import { useState } from "react";
import { useRouter } from "next/router";
import { TextArea, useNotification } from "web3uikit";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import contractAddresses from "../contractAddresses.json";
import contractAbi from "../contractAbi.json";
import checkIfMember from "../utils/checkIfMember";

const CreateProject = () => {
  const [project, setProject] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useNotification();
  const router = useRouter();

  const handleNewNotification = (type, message) => {
    dispatch({
      type,
      message,
      title: "New Notification",
      icon: "bell",
      position: "topR",
    });
  };

  const handlePropose = async () => {
    // const { provider, contract } = await getContractSigned("governor");
    // const { provider, contract } = await getContractSigned("projects");
    if (project.length < 15) {
      handleNewNotification(
        "error",
        "Please be more specific. Projects must have at least 15 characters"
      );
      return;
    }
    setIsLoading(true);
    const isMember = await checkIfMember();
    if (!isMember) {
      handleNewNotification(
        "error",
        "You need to have at least 1 governance token to be able to create a proposal"
      );
      setIsLoading(false);
      return;
    }

    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const { chainId } = await provider.getNetwork();
      if (chainId !== 4) {
        handleNewNotification("error", "Please change to Rinkeby network");
        setIsLoading(false);
        return;
      }

      const governorAddress = contractAddresses[chainId.toString()]["governor"];
      const governorAbi = contractAbi["governor"];

      const governorContract = new ethers.Contract(
        governorAddress,
        governorAbi,
        signer
      );

      const projectsAddress = contractAddresses[chainId.toString()]["projects"];
      const projectsAbi = contractAbi["projects"];

      const projectsContract = new ethers.Contract(
        projectsAddress,
        projectsAbi,
        signer
      );

      const calldataEncoded = projectsContract.interface.encodeFunctionData(
        "addProject",
        [project]
      );

      const proposal = {
        targets: [projectsAddress],
        values: [0],
        calldatas: [calldataEncoded],
        description: project,
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
      console.log("deadline.toString():", deadline.toString());

      await axios.post("/api/proposalId", proposal);
      const idSliced = proposalId.slice(0, 3) + "..." + proposalId.slice(-3);

      handleNewNotification(
        "success",
        `You just made a new proposal with ID: ${idSliced}!`
      );
      setIsLoading(false);

      setTimeout(() => {
        router.replace("/proposals/vote");
      }, 3500);
    } catch (error) {
      handleNewNotification("error", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <h1 className="font-bold text-3xl">CREATE A NEW PROJECT</h1>
      <div className="bg-red-100 w-2/4 flex flex-col items-center">
        <div className="w-11/12 my-6">
          <TextArea
            label="new project"
            onBlur={function noRefCheck() {}}
            onChange={(e) => {
              setProject(e.target.value);
            }}
            placeholder={project}
            value={project}
            width="100%"
          />
        </div>
        <button
          className="bg-red-500 w-24 h-8 mb-4 rounded-md font-bold text-white flex items-center justify-center"
          onClick={() => {
            handlePropose();
          }}
        >
          {isLoading ? (
            <div className="animate-spin p-2 border-b-4 rounded-full w-2 h-2 border-white"></div>
          ) : (
            "ADD"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
