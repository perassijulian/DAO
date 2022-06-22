import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractAddresses from "../contractAddresses.json";
import contractAbi from "../contractAbi.json";

export const getContractSigned = async (contractName) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const { chainId } = await provider.getNetwork();
  const address = contractAddresses[chainId.toString()][contractName];
  const abi = contractAbi[contractName];

  const contract = new ethers.Contract(address, abi, signer);
  return { provider, contract };
};
