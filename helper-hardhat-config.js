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

module.exports = { networkConfig, MIN_DELAY };
