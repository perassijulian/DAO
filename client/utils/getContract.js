import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractAddresses from "../constants/contractAddresses.json";
import contractAbi from "../constants/contractAbi.json";

export const getContractSigned = async (contractName) => {
  try {
    let address = null;
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const { chainId } = await provider.getNetwork();

    //Try to get the address from the chainId connected, if not any
    //you will get the rinkeby one
    try {
      address = contractAddresses[chainId.toString()][contractName];
    } catch (error) {
      console.log('----------------------------')
      console.log('/utils/getContract ERROR')
      console.log('Not on rinkeby network')
      address = contractAddresses["4"][contractName];
    }
    const abi = contractAbi[contractName];

    const contract = new ethers.Contract(address, abi, signer);
    return { provider, contract };
  } catch (mainError) {
    console.log(mainError)
  }
};

export const getContractUnsigned = async (contractName) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const address = contractAddresses["4"][contractName];
  const abi = contractAbi[contractName];
  const contract = new ethers.Contract(address, abi, provider);
  return { provider, contract };
};
