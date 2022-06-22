const { network, ethers } = require("hardhat");
const {
  networkConfig,
  frontEndAddresses,
  frontEndAbi,
} = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");
const fs = require("fs");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  log("----------------------------------------------------");
  log("Deploying Projects and waiting for confirmations...");
  const projectsDeploy = await deploy("Projects", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
  });
  log(`Projects deployed at ${projectsDeploy.address}.`);

  log("------------------------------");
  log("Transfering ownership to timelock...");
  const projectsContract = await ethers.getContractAt(
    "Projects",
    projectsDeploy.address
  );
  const timeLockContract = await ethers.getContract("TimeLock");
  const tx = await projectsContract.transferOwnership(timeLockContract.address);
  await tx.wait(1);
  log("Ownership transfered.");

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("------------------------------");
    log("Verifying contract...");
    await verify(projectsDeploy.address, []);
    log("Contract verified.");
  }

  if (process.env.UPDATE_FRONT) {
    log("------------------------------");
    log("Updating front end...");
    const chainId = network.config.chainId.toString();
    const addresses = JSON.parse(fs.readFileSync(frontEndAddresses, "utf-8"));
    addresses[chainId]["projects"] = projectsDeploy.address;
    fs.writeFileSync(frontEndAddresses, JSON.stringify(addresses));

    const abis = JSON.parse(fs.readFileSync(frontEndAbi, "utf-8"));
    const abi = projectsDeploy.abi;
    abis["projects"] = abi;
    fs.writeFileSync(frontEndAbi, JSON.stringify(abis));

    log("Front end updated.");
  }
};

module.exports.tags = ["all", "projects"];
