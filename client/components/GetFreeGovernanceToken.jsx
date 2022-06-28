import { ethers } from "ethers";
import { getContractSigned } from "../utils/getContract";
import { useNotification } from "web3uikit";
import checkIfMember from "../utils/checkIfMember";
import { useEffect, useState } from "react";
import contractAddresses from "../constants/contractAddresses.json";

const GetFreeGovernanceToken = () => {
  const tokenAddress = contractAddresses["4"].governorToken;
  const [isMember, setIsMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useNotification();

  const isMemberChecking = async () => {
    setIsMember(await checkIfMember());
  };

  useEffect(() => {
    isMemberChecking();
  }, []);

  const handleNewNotification = (type, message) => {
    dispatch({
      type,
      message,
      title: "New Notification",
      icon: "bell",
      position: "topR",
    });
  };

  const getDaoToken = async () => {
    if (isMember) {
      handleNewNotification("error", "You already have DAO tokens");
    }
    setIsLoading(true);
    try {
      const { provider, contract } = await getContractSigned("governorToken");
      const { chainId } = await provider.getNetwork();
      if (chainId !== 4) {
        handleNewNotification("error", "Please switch to Rinkeby network");
        setIsLoading(false);
        return
      }

      console.log("chainId:", chainId);
      //get contract from dao wallet with its secret key
      const daoWallet = new ethers.Wallet(
        process.env.NEXT_PUBLIC_SECRET_KEY,
        provider
      );
      const contractByDao = contract.connect(daoWallet);
      const signer = window.ethereum._state.accounts[0];
      const txDAO = await contractByDao.transfer(
        signer,
        ethers.utils.parseEther("200")
      );
      await txDAO.wait(1);
      const txETH = await daoWallet.sendTransaction({
        to: signer,
        value: ethers.utils.parseEther("0.1"),
      });
      await txETH.wait(1);

      handleNewNotification(
        "success",
        "You got 200DAO tokens and some ETH to pay gas"
      );
      setIsMember(true);
    } catch (mainError) {
      handleNewNotification("error", mainError.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-8 max-w-3xl">
      <h1 className="text-3xl font-bold">
        This is a testing environment for a DAO
      </h1>
      <p className="mt-3 text-xl">
        To interact you need to have metamask plugin installed and be in the
        Rinkeby test network.
      </p>
      <p className="mt-3 text-xl">
        You must also possess the dao token and some Rinkeby ETH. For that you
        can get some FREE here
      </p>
      {!isMember ? (
        <div className="mt-5 flex w-full justify-around">
          <button
            className="w-40 h-10 bg-green-500 rounded-md text-white font-bold flex justify-center items-center"
            onClick={getDaoToken}
            disabled={isLoading || isMember}
          >
            {isLoading ? (
              <div className="animate-spin p-2 border-b-4 rounded-full w-2 h-2 border-white"></div>
            ) : (
              "GIMME TOKENS!"
            )}
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xl text-center bg-green-400">
          Congratulations! As you have DAO tokens you are a member that can
          propose and vote on projects! You can check your tokens from metamask
          clicking on "Import tokens" and pasting the address {tokenAddress}
        </p>
      )}
    </div>
  );
};

export default GetFreeGovernanceToken;
