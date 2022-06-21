const { ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  log("----------------------------------------------------");
  log("Deploying GovernanceToken and waiting for confirmations...");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
  });
  log(`GovernanceToken deployed at ${governanceToken.address}.`);

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("-----------------------------------------------------------");
    log("Verifying contract...");
    await verify(governanceToken.address, []);
    log("Contract verified.");
  }

  log("-----------------------------------------------------------");
  log("Delegating voting power to deployer...");
  await delegate(governanceToken.address, deployer);
  log("Voting power delegated.");
};

const delegate = async (contractAddress, delegatee) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    contractAddress
  );
  const tx = await governanceToken.delegate(delegatee);
  await tx.wait(1);

  const checkpointNr = await governanceToken.numCheckpoints(delegatee);
  console.log(`Checkpoint nr: ${checkpointNr}`);
};

module.exports.tags = ["all", "governortoken"];
