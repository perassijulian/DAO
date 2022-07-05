import { useEffect, useState } from "react";
import { getContractSigned } from "../../utils/getContract";
import shortenId from "../../utils/shortenId";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "../../components/Spinner";

const ProposalData = () => {
  const [showCalldata, setShowCalldata] = useState(false);
  const [calldataToShow, setCalldataToShow] = useState("");
  const [proposal, setProposal] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const decodeCalldata = async (calldata, i) => {
    const { provider, contract } = await getContractSigned("projects");
    const decodedCalldata = await contract.interface.decodeFunctionData(
      "mint",
      calldata
    );
    setCalldataToShow(
      `ACCOUNT WHERE THE MINT IS GOING ${
        decodedCalldata[0]
      } // AMOUNT THAT IS GOING TO BE MINTED: ${decodedCalldata[1].toString()} // EXTRA DATA (0x means nothing): ${
        decodedCalldata[2]
      } // YOU CAN CHECK THE METADATA THATS GOING TO CONTAIN THE TOKEN AT: https://ipfs.io/ipfs/${
        decodedCalldata[3]
      }`
    );
    setShowCalldata(true);
  };

  const getProposal = async () => {
    const res = await axios.get(`/api/proposalId/${router.query.proposalId}`);
    setProposal(res.data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query.proposalId) getProposal();
  }, [router.query]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-3xl mt-6">PROPOSAL DETAILS</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-2 bg-red-100 p-3 w-2/4 mt-4 gap-3">
            <div>Proposal ID</div>
            <p className="font-bold text-gray-700">
              {shortenId(proposal.proposalId)}
            </p>
            <div>Description</div>
            <p className="font-bold text-gray-700">{proposal.description}</p>
            <div>Deadline</div>
            <p className="font-bold text-gray-700">{proposal.deadline}</p>
            <div>Calldatas</div>
            <div>
              {proposal.calldatas.map((calldata) => (
                <p
                  key={`calldata-${shortenId(proposal.proposalId)}`}
                  className="font-bold text-gray-700"
                >
                  {calldata.slice(0, 25)}
                </p>
              ))}
            </div>
            <div>Targets</div>
            <div>
              {proposal.targets.map((target) => (
                <p
                  key={`target-${shortenId(proposal.proposalId)}`}
                  className="font-bold text-gray-700"
                >
                  {target.slice(0, 24)}
                </p>
              ))}
            </div>
          </div>
          <div className="bg-red-100 mt-4 p-3 w-2/4">
            {proposal.calldatas.map((calldata, i) => (
              <div key={`calldata-${i}`} className="mb-4">
                <div className="flex justify-between">
                  <h2>Calldata:</h2>
                  <button
                    className="bg-green-500 px-2 rounded-sm"
                    onClick={() => decodeCalldata(calldata)}
                  >
                    Decode
                  </button>
                </div>
                {showCalldata && <p>{calldataToShow}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalData;
