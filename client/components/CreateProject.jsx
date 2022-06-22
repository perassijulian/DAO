import { useState } from "react";
import { TextArea, useNotification } from "web3uikit";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractAddresses from "../contractAddresses.json";
import contractAbi from "../contractAbi.json";

const CreateProject = () => {
  const [project, setProject] = useState("");

  const dispatch = useNotification();

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
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const { chainId } = await provider.getNetwork();
    if (chainId !== 4) {
      handleNewNotification("error", "Please change to Rinkeby network");
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

    console.log('projectsAddress:', projectsAddress);
    console.log('projectsAbi:', projectsAbi);

    const projectsContract = new ethers.Contract(
      projectsAddress,
      projectsAbi,
      signer
    );

    const calldataEncoded = projectsContract.interface.encodeFunctionData(
      "addProject",
      [project]
    );
    const tx = await governorContract.propose([projectsAddress], [0], [calldataEncoded], project);
    const receiptTx = await tx.wait(1)
    const proposalId = receiptTx.events[0].args.proposalId.toString()
    const idSliced = proposalId.slice(4)+"..."+proposalId.slice(-4)

    handleNewNotification("success", `You just made a new proposal with ID: ${idSliced}!`);
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
          className="bg-red-500 px-8 py-1 mb-4 rounded-md font-bold text-white"
          onClick={() => {
            handlePropose();
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
