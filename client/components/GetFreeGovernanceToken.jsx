import { ethers } from "ethers";
import { getContractSigned } from "../utils/getContract";
import checkIfMember from "../utils/checkIfMember";
import { useEffect, useState } from "react";
import contractAddresses from "../constants/contractAddresses.json";
import Notification from "./Notification";
import Spinner from "./Spinner";

const GetFreeGovernanceToken = () => {
  const tokenAddress = contractAddresses["4"].governorToken;
  const [isMember, setIsMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState({});

  const notificate = (message, type) => {
    setShowNotification(true);
    setNotificationContent({ message, type });
  };

  const isMemberChecking = async () => {
    setIsMember(await checkIfMember());
  };

  useEffect(() => {
    isMemberChecking();
  }, []);

  const getDaoToken = async () => {
    setIsLoading(true);
    await checkIfMember();
    if (isMember) {
      notificate("You already have DAO tokens", "error");
      return;
    }
    try {
      const { provider, contract } = await getContractSigned("governorToken");
      const { chainId } = await provider.getNetwork();
      if (chainId !== 4) {
        setIsLoading(false);
        notificate(
          "Please switch to Rinkeby network in your metamask account",
          "error"
        );
        return;
      }

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
        value: ethers.utils.parseEther("0.05"),
      });
      await txETH.wait(1);

      setIsMember(true);
      notificate("You got 200DAO tokens and some ETH to pay gas", "success");
    } catch (mainError) {
      notificate(mainError.message, "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-8 max-w-3xl">
      <Notification
        show={showNotification}
        setShow={setShowNotification}
        content={notificationContent}
      />
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
        <div className="mt-5 flex flex-col items-center w-full">
          <button
            className="w-40 h-10 bg-green-500 rounded-md text-white font-bold flex justify-center items-center"
            onClick={getDaoToken}
            disabled={isLoading || isMember}
          >
            {isLoading ? (
            <Spinner color="white"/>
            ) : (
              "GIMME TOKENS!"
            )}
          </button>
          {isLoading && (
            <div>You're getting tokens. This may take some seconds</div>
          )}
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
