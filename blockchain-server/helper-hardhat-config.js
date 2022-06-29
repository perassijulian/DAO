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
const frontEndAddresses = "../client/constants/contractAddresses.json";
const frontEndAbi = "../client/constants/contractAbi.json";

const MIN_DELAY = 3600; //1hr => between proposal queued and being able to execute it
const VOTING_PERIOD = 400; //400blocks => between proposal able to vote and finish voting. Around 1hr in rinkeby
const VOTING_DELAY = 1; //1block => between propose and voting
const QUORUM_PERCENTAGE = 4; //4%
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const PROJECT_FUNCTION = "mint";
const PROJECT_ARG = [
  "0xbf3f8D6a3aE5cfc144AA116896b82F3a87671F83",
  100,
  [],
  "bafkreihnnvdet7b3kjitiztwjmxz7onouuns55wqgtjq3hg3mem5nq6v6a",
];
const PROJECT_DESCRIPTION = `Mint ${PROJECT_ARG[2]} tokens with id ${PROJECT_ARG[1]} to address ${PROJECT_ARG[0]}`;

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
  frontEndAbi,
};
