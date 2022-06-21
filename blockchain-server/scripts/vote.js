const { ethers, network } = require("hardhat");
const fs = require("fs");
const { advanceBlocks } = require("../utils/pass-blocks");
const {
  VOTING_PERIOD,
  developmentChains,
} = require("../helper-hardhat-config");

const vote = async () => {
  const governorContract = await ethers.getContract("GovernorContract");
  const proposals = JSON.parse(fs.readFileSync("./proposals.json", "utf-8"));
  const proposalId = proposals[network.config.chainId.toString()][0];
  const tx = await governorContract.castVote(proposalId, 1);
  await tx.wait(1);

  let state = await governorContract.state(proposalId);
  console.log(`State before moving blocks is ${state}`);

  if (developmentChains.includes(network.name)) {
    await advanceBlocks(VOTING_PERIOD + 1);
  }

  state = await governorContract.state(proposalId);
  console.log(`State after moving blocks is ${state}`);
};

vote()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
