const { network } = require("hardhat");
const {
  networkConfig,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");

const { verify } = "../helper-functions";

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

  if (chainId !== 31337) {
    log("----------------------------------------------------");
    log("Verifying contract...");
    await verify(governorContract);
    log("Contract verified.");
  }
};

module.exports.tags = ["all", "governor"];
