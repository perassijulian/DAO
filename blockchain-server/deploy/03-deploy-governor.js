const { network } = require("hardhat");
const {
  networkConfig,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  frontEndAddresses,
  frontEndAbi,
} = require("../helper-hardhat-config");
const fs = require("fs");
require("dotenv").config();
const { verify } = require("../helper-functions");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;
  const timeLock = await get("TimeLock");
  const governanceToken = await get("GovernanceToken");

  log("----------------------------------------------------");
  log("Deploying governor contract...");
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      timeLock.address,
      governanceToken.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
  });
  log(`Governor contract deployed to ${governorContract.address}`);

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("------------------------------");
    log("Verifying contract...");
    await verify(governorContract.address, [
      timeLock.address,
      governanceToken.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ]);
    log("Contract verified.");
  }

  if (process.env.UPDATE_FRONT) {
    log("------------------------------");
    log("Updating front end...");
    const chainId = network.config.chainId.toString();
    const addresses = JSON.parse(fs.readFileSync(frontEndAddresses, "utf-8"));
    addresses[chainId]["governor"] = governorContract.address;
    fs.writeFileSync(frontEndAddresses, JSON.stringify(addresses));

    const abis = JSON.parse(fs.readFileSync(frontEndAbi, "utf-8"));
    const abi = governorContract.abi;
    abis["governor"] = abi;
    fs.writeFileSync(frontEndAbi, JSON.stringify(abis));

    log("Front end updated.");
  }
};

module.exports.tags = ["all", "governor"];
