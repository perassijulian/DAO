const { network } = require("hardhat");

const advanceTime = async (amount) => {
  console.log("Advancing time");
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved forward ${amount} seconds`)
};

module.exports = { advanceTime };
