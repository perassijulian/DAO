const networkConfig = {
  31337: {
    name: "localhost",
  },
  4: {
    name: "rinkeby",
    blockConfirmations: 6,
  },
};

const developmentChains = ["hardhat", "localhost"];
const frontEndAddresses = "../client/contractAddresses.json";
const frontEndAbi = "../client/contractAbi.json";

const MIN_DELAY = 3600; //1hr => between proposal queued and being able to execute it
const VOTING_PERIOD = 400; //400blocks => between proposal able to vote and finish voting. Around 1hr in rinkeby
const VOTING_DELAY = 1; //1block => between propose and voting
const QUORUM_PERCENTAGE = 4; //4%
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const PROJECT_DESCRIPTION = "First proposal description";
const PROJECT_FUNCTION = "addProject";
const PROJECT_ARG = "Make more bridges";

module.exports = {
  networkConfig,
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  PROJECT_DESCRIPTION,
  PROJECT_FUNCTION,
  PROJECT_ARG,
  developmentChains,
  frontEndAddresses,
  frontEndAbi
};
