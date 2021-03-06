import { useState } from "react";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import checkIfMember from "../utils/checkIfMember";
import shortenId from "../utils/shortenId";
import { getContractSigned } from "../utils/getContract";
import Notification from "./Notification";
import Spinner from "./Spinner";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    address: "",
    amount: null,
  });
  const router = useRouter();

  const notificate = (message, type) => {
    setShowNotification(true);
    setNotificationContent({ message, type });
  };

  const handleChange = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      notificate(error.message, "error");
    }
    setIsLoading(false);
  };

  const uploadToIPFS = async () => {
    const { name, description } = formInput;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      return added.path;
    } catch (error) {
      notificate(error.message, "error");
    }
  };

  const handlePropose = async () => {
    setIsLoading(true);
    const { name, description, address, amount } = formInput;
    if (!name || name.length < 15) {
      setIsLoading(false);
      notificate("Please write a title with more than 15 characters", "error");
      return;
    }
    if (!address || address.length !== 42) {
      setIsLoading(false);
      notificate("Please add a valid address", "error");
      return;
    }

    if (!amount || amount < 0) {
      setIsLoading(false);
      notificate("Please add a valid amount of nfts to mint", "error");
      return;
    }
    if (!description || description.length < 100) {
      setIsLoading(false);
      notificate(
        "Please write a description with more than 100 characters",
        "error"
      );
      return;
    }
    if (!fileUrl) {
      setIsLoading(false);
      notificate("Please select a file", "error");
      return;
    }

    const isMember = await checkIfMember();
    if (!isMember) {
      setIsLoading(false);
      notificate(
        "You need to have at least 1 governance token to be able to create a proposal",
        "error"
      );
      return;
    }

    const hashIpfs = await uploadToIPFS();

    try {
      const { provider, contract: governorContract } = await getContractSigned(
        "governor"
      );
      const { provider1, contract: projectsContract } = await getContractSigned(
        "projects"
      );

      const { chainId } = await provider.getNetwork();
      if (chainId !== 4) {
        setIsLoading(false);
        notificate("Please change to Rinkeby network", "error");
        return;
      }

      const calldataEncoded = projectsContract.interface.encodeFunctionData(
        "mint",
        [address, amount, [], hashIpfs]
      );

      const proposal = {
        targets: [projectsContract.address],
        values: [0],
        calldatas: [calldataEncoded],
        description: formInput.name,
      };

      const tx = await governorContract.propose(
        proposal.targets,
        proposal.values,
        proposal.calldatas,
        proposal.description
      );

      const receiptTx = await tx.wait(1);
      const proposalId = receiptTx.events[0].args.proposalId.toString();
      proposal["proposalId"] = proposalId;
      const deadline = await governorContract.proposalDeadline(proposalId);
      proposal["deadline"] = deadline.toString();

      await axios.post("/api/proposalId", proposal).catch((axiosError) => {
        console.log("axios error: ", axiosError);
        console.log("proposal:", proposal);
      });
      notificate(
        `You just made a new proposal with ID: ${shortenId(proposalId)}!`,
        "success"
      );
      setIsLoading(false);

      setTimeout(() => {
        router.replace("/proposals/vote");
      }, 3500);
    } catch (error) {
      setIsLoading(false);
      notificate(error.message, "error");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Notification
        show={showNotification}
        setShow={setShowNotification}
        content={notificationContent}
      />
      <h1 className="font-bold text-3xl mt-6">CREATE A NEW PROJECT</h1>
      <div className="bg-red-100 w-2/4 flex flex-col items-center mt-4">
        <input
          value=""
          type="file"
          className="mt-4"
          onChange={handleChange}
        />
        <div className="w-11/12 mt-4">
          <input
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
            value={formInput.name}
            placeholder="Title"
            className="p-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500"
          />
        </div>
        <div className="w-11/12 my-4">
          <textarea
            onChange={(e) => {
              setFormInput({ ...formInput, description: e.target.value });
            }}
            value={formInput.description}
            placeholder="Description"
            className="p-3 h-40 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500"
          />
        </div>
        <div className="flex gap-3 w-11/12">
          <input
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
            value={formInput.address}
            placeholder="Address to deposit NFTs"
            className="p-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500"
          />
          <input
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, amount: e.target.value })
            }
            value={formInput.amount}
            placeholder="Amount of NFTs"
            className="p-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500"
          />
        </div>
        <button
          className="bg-red-500 w-40 h-8 my-4 rounded-md font-bold text-white flex items-center justify-center"
          onClick={() => {
            handlePropose();
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner color="white"/>
            ) : (
            "ADD"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
