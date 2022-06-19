const { network } = require("hardhat");
const { networkConfig, MIN_DELAY } = require("../helper-hardhat-config");

const { verify } = "../helper-functions";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  log("----------------------------------------------------");
  log("Deploying timelock contract...");
  const timeLockContract = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [deployer], [deployer]],
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
  });
  log(`Timelock contract deployed to ${timeLockContract.address}`);

  if (chainId !== 31337) {
    log("----------------------------------------------------");
    log("Verifying contract...");
    await verify(timeLockContract);
    log("Contract verified.");
  }
};
