const { ethers, network } = require("hardhat");
const {
  PROJECT_DESCRIPTION,
  PROJECT_FUNCTION,
  PROJECT_ARG,
  VOTING_DELAY,
  developmentChains,
} = require("../helper-hardhat-config");
const { advanceBlocks } = require("../utils/pass-blocks");
const fs = require("fs");

const propose = async (functionToCall, args, description) => {
  const projectsContract = await ethers.getContract("Projects");
  const governorContract = await ethers.getContract("GovernorContract");

  const calldataEncoded = projectsContract.interface.encodeFunctionData(
    functionToCall,
    [args]
  );

  console.log(`Propose: ${description}`);
  console.log(`To function ${functionToCall} with args ${args}`);

  const tx = await governorContract.propose(
    [projectsContract.address],
    [0],
    [calldataEncoded],
    description
  );
  const txReceipt = await tx.wait(1);
  console.log("Proposal made!");

  if (developmentChains.includes(network.name)) {
    await advanceBlocks(VOTING_DELAY + 1);
  }

  const { proposalId } = txReceipt.events[0].args;

  const proposalsJson = JSON.parse(
    fs.readFileSync("./proposals.json", "utf-8")
  );

  if (Object.keys(proposalsJson).includes(network.config.chainId.toString())) {
    proposalsJson[network.config.chainId.toString()].push(proposalId.toString());
  } else {
    proposalsJson[network.config.chainId.toString()] = [proposalId.toString()];
  }

  fs.writeFileSync("./proposals.json", JSON.stringify(proposalsJson));
};

propose(PROJECT_FUNCTION, PROJECT_ARG, PROJECT_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
