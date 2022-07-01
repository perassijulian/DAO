import { useState } from "react";
import { getAllProposalIds, getProposal } from "../../utils/getProposals";
import { getContractSigned } from "../../utils/getContract";
import shortenId from "../../utils/shortenId";

const Proposal = ({ data }) => {
  const [showCalldata, setShowCalldata] = useState(false);
  const [calldataToShow, setCalldataToShow] = useState("");

  const decodeCalldata = async (calldata, i) => {
    const { provider, contract } = await getContractSigned("projects");
    const decodedCalldata = await contract.interface.decodeFunctionData(
      "mint",
      calldata
    );
    console.log(decodedCalldata);
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

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-3xl mt-6">PROPOSAL DETAILS</h1>
      <div className="grid grid-cols-2 bg-red-100 p-3 w-2/4 mt-4 gap-3">
        <div>Proposal ID</div>
        <p className="font-bold text-gray-700">{shortenId(data.proposalId)}</p>
        <div>Description</div>
        <p className="font-bold text-gray-700">{data.description}</p>
        <div>Deadline</div>
        <p className="font-bold text-gray-700">{data.deadline}</p>
        <div>Calldatas</div>
        <div>
          {data.calldatas.map((calldata) => (
            <p className="font-bold text-gray-700">{calldata.slice(0, 25)}</p>
          ))}
        </div>
        <div>Targets</div>
        <div>
          {data.targets.map((target) => (
            <p className="font-bold text-gray-700">{target.slice(0, 24)}</p>
          ))}
        </div>
      </div>
      <div className="bg-red-100 mt-4 p-3 w-2/4">
        {data.calldatas.map((calldata, i) => (
          <div className="mb-4">
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
  );
};

export async function getStaticProps({ params }) {
  const data = getProposal(params.proposalId);
  return {
    props: {
      data,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllProposalIds();
  return {
    paths,
    fallback: false,
  };
}

export default Proposal;
