const { expect, assert } = require("chai");
const { ethers, deployments, network } = require("hardhat");
const {
  PROJECT_ARG,
  PROJECT_DESCRIPTION,
  PROJECT_FUNCTION,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} = require("../../helper-hardhat-config");
const { advanceBlocks } = require("../../utils/pass-blocks");
const { advanceTime } = require("../../utils/pass-time");

describe("Governance actions", async () => {
  let governorToken;
  let timeLock;
  let governor;
  let projects;
  let state;

  beforeEach(async () => {
    await deployments.fixture("all");
    governorToken = await ethers.getContract("GovernanceToken");
    timeLock = await ethers.getContract("TimeLock");
    governor = await ethers.getContract("GovernorContract");
    projects = await ethers.getContract("Projects");
  });

  it("Should not allow Projects to be executed by anybody", async () => {
    await expect(projects.addProject(PROJECT_ARG)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should allow to propose, vote and execute proposals", async () => {
    const calldataHash = projects.interface.encodeFunctionData(
      PROJECT_FUNCTION,
      [PROJECT_ARG]
    );
    const descriptionHash = ethers.utils.id(PROJECT_DESCRIPTION);

    //create proposal
    const proposeTx = await governor.propose(
      [projects.address],
      [0],
      [calldataHash],
      PROJECT_DESCRIPTION
    );
    const proposeReceipt = await proposeTx.wait(1);
    const proposeEvent = proposeReceipt.events[0].event;
    const { proposalId } = proposeReceipt.events[0].args;
    state = await governor.state(proposalId);
    assert.equal(state, 0); //pending
    assert.equal(proposeEvent, "ProposalCreated");
    console.log("Create proposal ✔️");

    //voting on proposal
    await advanceBlocks(VOTING_DELAY);
    const voteTx = await governor.castVote(proposalId, 1);
    const voteReceipt = await voteTx.wait(1);
    state = await governor.state(proposalId);
    const voteEvent = voteReceipt.events[0].event;
    assert.equal(state, 1); //active
    assert.equal(voteEvent, "VoteCast");
    console.log("Vote proposal ✔️");

    //queueing proposal
    await advanceBlocks(VOTING_PERIOD);
    const queueTx = await governor.queue(
      [projects.address],
      [0],
      [calldataHash],
      descriptionHash
    );
    const queueReceipt = await queueTx.wait(1);
    state = await governor.state(proposalId);
    assert.equal(state, 5); //queued
    const queueEvent = queueReceipt.events[1].event;
    assert.equal(queueEvent, "ProposalQueued");
    console.log("Queue proposal ✔️");

    //executing proposal
    await advanceTime(MIN_DELAY + 1);
    await advanceBlocks(1);
    const executeTx = await governor.execute(
      [projects.address],
      [0],
      [calldataHash],
      descriptionHash
    );
    const executeReceipt = await executeTx.wait(1);
    state = await governor.state(proposalId);
    assert.equal(state, 7); //queued
    const executeEvent = executeReceipt.events[0].event;
    assert.equal(executeEvent, "ProposalExecuted");
    console.log("Execute proposal ✔️");

    const res = await projects.getProjects();
    assert.equal(res[0], PROJECT_ARG);
    console.log("Contract updated ✔️");
  });

  it("Should revert when not enought time has passed", async () => {
    let blockNr;

    const calldataHash = projects.interface.encodeFunctionData(
      PROJECT_FUNCTION,
      [PROJECT_ARG]
    );
    const descriptionHash = ethers.utils.id(PROJECT_DESCRIPTION);

    //create proposal
    const proposeTx = await governor.propose(
      [projects.address],
      [0],
      [calldataHash],
      PROJECT_DESCRIPTION
    );
    const proposeReceipt = await proposeTx.wait(1);
    const { proposalId } = proposeReceipt.events[0].args;

    //voting on proposal
    await advanceBlocks(VOTING_DELAY - 1);
    await expect(governor.castVote(proposalId, 1)).to.be.revertedWith(
      "Governor: vote not currently active"
    );
    await advanceBlocks(1);
    const voteTx = await governor.castVote(proposalId, 1);
    await voteTx.wait(1);

    //queueing proposal
    blockNr = await ethers.provider.getBlockNumber();
    const deadline = await governor.proposalDeadline(proposalId);
    await advanceBlocks(deadline - blockNr - 1);
    await expect(
      governor.queue([projects.address], [0], [calldataHash], descriptionHash)
    ).to.be.revertedWith("Governor: proposal not successful");
    await advanceBlocks(1);
    const queueTx = await governor.queue(
      [projects.address],
      [0],
      [calldataHash],
      descriptionHash
    );
    await queueTx.wait(1);

    //executing proposal
    await advanceTime(MIN_DELAY - 1);
    await expect(
      governor.execute([projects.address], [0], [calldataHash], descriptionHash)
    ).to.be.revertedWith("TimelockController: operation is not ready");
    await advanceTime(1);
    const executeTx = await governor.execute(
      [projects.address],
      [0],
      [calldataHash],
      descriptionHash
    );
    const executeReceipt = await executeTx.wait(1);
    const executeEvent = executeReceipt.events[0].event;
    assert.equal(executeEvent, "ProposalExecuted");

    const res = await projects.getProjects();
    assert.equal(res[0], PROJECT_ARG);
  });
});
