const { ethers } = require("hardhat");
const { ADDRESS_ZERO } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const timeLock = await ethers.getContract("TimeLock", deployer);
  const governorContract = await ethers.getContract(
    "GovernorContract",
    deployer
  );

  log("----------------------------------------------------");
  log("Setting up governance roles...");

  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  const txProposer = await timeLock.grantRole(
    proposerRole,
    governorContract.address
  );
  await txProposer.wait(1);
  log("Proposer role changed");
  const txExecutor = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  await txExecutor.wait(1);
  log("Executor role changed");
  const txAdmin = await timeLock.revokeRole(adminRole, deployer);
  await txAdmin.wait(1);
  log("Admin role revoked");
};

module.exports.tags = ["all", "setup"];
