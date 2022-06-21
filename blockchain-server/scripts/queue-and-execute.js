const { ethers, network } = require("hardhat");
const {
  PROJECT_DESCRIPTION,
  PROJECT_FUNCTION,
  PROJECT_ARG,
  MIN_DELAY,
  developmentChains,
} = require("../helper-hardhat-config");
const { advanceTime } = require("../utils/pass-time");

const queueAndExecute = async (functionToCall, args, description) => {
  const projectsContract = await ethers.getContract("Projects");
  const governorContract = await ethers.getContract("GovernorContract");
  const calldataEncoded = projectsContract.interface.encodeFunctionData(
    functionToCall,
    [args]
  );
  const descriptionEncoded = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(description)
  );

  console.log("Queueing proposal...");
  const queueTx = await governorContract.queue(
    [projectsContract.address],
    [0],
    [calldataEncoded],
    descriptionEncoded
  );
  const queueReceipt = await queueTx.wait(1);
  const { proposalId } = queueReceipt.events[1].args;
  let state = await governorContract.state(proposalId);
  console.log("State after queueing: ", state);

  if (developmentChains.includes(network.name)) {
    await advanceTime(MIN_DELAY + 1);
  }

  console.log("Executing proposal...");
  const executeTx = await governorContract.execute(
    [projectsContract.address],
    [0],
    [calldataEncoded],
    descriptionEncoded
  );
  await executeTx.wait(1);
  state = await governorContract.state(proposalId);
  console.log("State after executing: ", state);

  const res = await projectsContract.getProjects();
  console.log(res);
};

queueAndExecute(PROJECT_FUNCTION, PROJECT_ARG, PROJECT_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
