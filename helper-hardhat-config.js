const networkConfig = {
  31337: {
    name: "localhost",
  },
  4: {
    name: "rinkeby",
    blockConfirmations: 6,
  },
};

const MIN_DELAY = 3600; //1hr
const VOTING_PERIOD = 5; //5blocks
const VOTING_DELAY = 1; //1block
const QUORUM_PERCENTAGE = 4; //4%

module.exports = {
  networkConfig,
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
};
