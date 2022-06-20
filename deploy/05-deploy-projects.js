const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  log("----------------------------------------------------");
  log("Deploying Projects and waiting for confirmations...");
  const projectsContract = await deploy("Projects", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
  });
  log(`Projects deployed at ${projectsContract.address}.`);

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("-----------------------------------------------------------");
    log("Verifying contract...");
    await verify(projectsContract.address, []);
    log("Contract verified.");
  }
};