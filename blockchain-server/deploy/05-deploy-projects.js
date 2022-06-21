const { network, ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");

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

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("-----------------------------------------------------------");
    log("Verifying contract...");
    await verify(projectsDeploy.address, []);
    log("Contract verified.");
  }

  log("----------------------------------------------------");
  log("Transfering ownership to timelock...");
  const projectsContract = await ethers.getContractAt(
    "Projects",
    projectsDeploy.address
  );
  const timeLockContract = await ethers.getContract("TimeLock");
  const tx = await projectsContract.transferOwnership(timeLockContract.address);
  await tx.wait(1);
  log("Ownership transfered.");
};

module.exports.tags = ["all", "projects"];
