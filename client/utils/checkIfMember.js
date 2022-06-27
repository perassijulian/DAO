import { ethers } from "ethers";
import ERC20Abi from "../constants/ERC20Abi.json";
import contractAddresses from "../constants/contractAddresses.json";
import Web3Modal from "web3modal";

export default async () => {
  // checking for number 4 because it's rinkebyId
  const tokenAddress = contractAddresses[4].governorToken;
  const abi = ERC20Abi;
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const contract = new ethers.Contract(tokenAddress, abi, provider);
  const signerAddress = window.ethereum._state.accounts[0];
  const balance = await contract.balanceOf(signerAddress);
  return balance.toString() > 0;
};
