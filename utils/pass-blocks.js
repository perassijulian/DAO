const { network } = require("hardhat");

const advanceBlocks = async (amount) => {
  for (let i = 0; i < amount; i++) {
    await network.provider.send("evm_mine", []);
  }
};

module.exports = { advanceBlocks };
