import React from "react";
import contractAddresses from "../constants/contractAddresses.json";
import contractAbi from "../constants/contractAbi.json";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const GetFreeGovernanceToken = () => {
  const getDaoToken = async () => {
    const abi = contractAbi["governorToken"];
    const address = contractAddresses["4"]["governorToken"];

    //get contract from user signer
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    //get contract from dao wallet with its secret key
    const daoWallet = new ethers.Wallet(
      process.env.NEXT_PUBLIC_SECRET_KEY,
      provider
    );

    const contractByDao = contract.connect(daoWallet);

    const receiver = window.ethereum._state.accounts[0];
    const tx = await contractByDao.transfer(
      receiver,
      ethers.utils.parseEther("200")
    );
    const receipt = await tx.wait(1);
    console.log(receipt);
  };
  return (
    <div className="mt-8 max-w-3xl">
      <h1 className="text-3xl font-bold">
        This is a testing environment for a DAO
      </h1>
      <p className="mt-3 text-xl">
        You can add new proposals and vote. Please note that there is a few
        seconds waiting time from the time you propose it until you can vote for
        it.
      </p>
      <p className="mt-3 text-xl">
        To interact you need to have metamask plugin installed and be in the
        Rinkeby test network. It is also necessary to have some eth to pay the
        gas fees. As this is a test network they are free
      </p>
      <p className="mt-3 text-xl">
        You must also possess the dao token. For that you can get some here
      </p>
      <div className="mt-5 flex w-full justify-around">
        <button onClick={getDaoToken}>DAO TOKEN</button>
        <button>RINKEBY ETH</button>
      </div>
    </div>
  );
};

export default GetFreeGovernanceToken;
