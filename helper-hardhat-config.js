const networkConfig = {
  31337: {
    name: "localhost",
  },
  4: {
    name: "rinkeby",
    blockConfirmations: 6,
  },
};

const developmentChains = ["hardhat", "localhost"]

const MIN_DELAY = 3600; //1hr
const VOTING_PERIOD = 5; //5blocks
const VOTING_DELAY = 1; //1block
const QUORUM_PERCENTAGE = 4; //4%
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const PROJECT_DESCRIPTION = "Second proposal description";
const PROJECT_FUNCTION = "addProject";
const PROJECT_ARG = "Make even more bridges";

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
  developmentChains
};
