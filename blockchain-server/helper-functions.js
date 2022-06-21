const { run } = require("hardhat");

const verify = async (address, constructorArgsParams) => {
  try {
    await run("verify:verify", {
      address,
      constructorArgsParams,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { verify };
