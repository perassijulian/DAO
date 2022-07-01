import { useState } from "react";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import checkIfMember from "../utils/checkIfMember";
import shortenId from "../utils/shortenId";
import { getContractSigned } from "../utils/getContract";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
  });
  const router = useRouter();

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
      alert(error.message);
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
      alert(error.message);
    }
  };

  const handlePropose = async () => {
    setIsLoading(true);
    const { name, description } = formInput;
    if (!name || name.length < 15) {
      setIsLoading(false);
      alert("Please write a title with more than 15 characters");
      return;
    }
    if (!description || description.length < 100) {
      setIsLoading(false);
      alert("Please write a description with more than 100 characters");
      return;
    }
    if (!fileUrl) {
      setIsLoading(false);
      alert("Please select a file");
      return;
    }

    const isMember = await checkIfMember();
    if (!isMember) {
      setIsLoading(false);
      alert(
        "You need to have at least 1 governance token to be able to create a proposal"
      );
      return;
    }

    const hashIpfs = await uploadToIPFS();

    try {
      console.log("Getting contracts..")
      const { provider, contract: governorContract } = await getContractSigned(
        "governor"
      );
      const { provider1, contract: projectsContract } = await getContractSigned(
        "projects"
      );

      console.log("Checking chain id..")
      const { chainId } = await provider.getNetwork();
      if (chainId !== 4) {
        setIsLoading(false);
        alert("Please change to Rinkeby network");
        return;
      }

      const calldataEncoded = projectsContract.interface.encodeFunctionData(
        "mint",
        ["0xbf3f8D6a3aE5cfc144AA116896b82F3a87671F83", 2, [], hashIpfs]
      );

      const proposal = {
        targets: [projectsContract.address],
        values: [0],
        calldatas: [calldataEncoded],
        description: formInput.name,
      };

      console.log("Proposing..")
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

      console.log("Posting on API..")
      await axios.post("/api/proposalId", proposal);
      console.log("Posted succesfully.")
      setIsLoading(false);
      alert(`You just made a new proposal with ID: ${shortenId(proposalId)}!`);

      setTimeout(() => {
        router.replace("/proposals/vote");
      }, 3500);
    } catch (error) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-3xl mt-6">CREATE A NEW PROJECT</h1>
      <div className="bg-red-100 w-2/4 flex flex-col items-center mt-4">
        <input type="file" className="mt-6" onChange={handleChange} />
        <div className="w-11/12 mt-6">
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
        <div className="w-11/12 my-6">
          <textarea
            onChange={(e) => {
              setFormInput({ ...formInput, description: e.target.value });
            }}
            placeholder="Description"
            className="p-3 h-40 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500"
          />
        </div>
        <button
          className="bg-red-500 w-24 h-8 mb-4 rounded-md font-bold text-white flex items-center justify-center"
          onClick={() => {
            handlePropose();
          }}
          disabled={isLoading}
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
