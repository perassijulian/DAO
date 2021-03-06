const { network } = require("hardhat");
const {
  networkConfig,
  MIN_DELAY,
  frontEndAddresses,
  frontEndAbi,
} = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");
const fs = require("fs");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  log("------------------------------");
  log("Deploying timelock contract...");
  const timeLockContract = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
  });
  log(`Timelock contract deployed to ${timeLockContract.address}`);

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("------------------------------");
    log("Verifying contract...");
    await verify(timeLockContract.address, [MIN_DELAY, [], []]);
    log("Contract verified.");
  }

  if (process.env.UPDATE_FRONT) {
    log("------------------------------");
    log("Updating front end...");
    const chainId = network.config.chainId.toString();
    const addresses = JSON.parse(fs.readFileSync(frontEndAddresses, "utf-8"));
    addresses[chainId]["timeLock"] = timeLockContract.address;
    fs.writeFileSync(frontEndAddresses, JSON.stringify(addresses));

    const abis = JSON.parse(fs.readFileSync(frontEndAbi, "utf-8"));
    const abi = timeLockContract.abi;
    abis["timeLock"] = abi;
    fs.writeFileSync(frontEndAbi, JSON.stringify(abis));

    log("Front end updated.");
  }
};

module.exports.tags = ["all", "timelock"];
