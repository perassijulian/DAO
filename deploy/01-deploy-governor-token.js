const { ethers, run, network } = require("hardhat");

async function main() {
  const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
  const governanceToken = await GovernanceToken.deploy();
  await governanceToken.deployed();
  console.log("Deployed to: ", governanceToken.address);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    governanceToken.deployTransaction.wait(6);
    await verify(governanceToken.address, []);
  }
}

async function verify(address, constructorArgsParams) {
  console.log("Verifying contract..");
  try {
    await run("verify:verify", {
      address,
      constructorArgsParams,
    });
  } catch (e) {
    console.log(e);
  }
  console.log("Contract verified");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
