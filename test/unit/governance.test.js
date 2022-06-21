const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { PROJECT_ARG } = require("../../helper-hardhat-config");

describe("Governance actions", async () => {
  beforeEach(async () => {
    const projectsContract = await ethers.getContract("Projects");
  });

  it("Should not allow Projects to be executed by anybody", async () => {
    try {
      const tx = await projectsContract.addProject(PROJECT_ARG);
      tx.wait(1);
    } catch (e) {
      console.log(e.message);
    }
  });
});
