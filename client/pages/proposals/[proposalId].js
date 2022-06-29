import { useState } from "react";
import { CodeArea, CopyButton, Typography, useNotification } from "web3uikit";
import Navbar from "../../components/Navbar";
import { getAllProposalIds } from "../../utils/getAllProposalIds";
import { getContractSigned } from "../../utils/getContract";
import shortenId from "../../utils/shortenId";

const Proposal = ({ data }) => {
  const [showCalldata, setShowCalldata] = useState(false);
  const [calldataToShow, setCalldataToShow] = useState("");
  const notify = useNotification();

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
      <Navbar />
      <h1 className="font-bold text-3xl mt-6">PROPOSAL DETAILS</h1>
      <div className="grid grid-cols-2 bg-red-100 p-3 w-2/4 mt-4 gap-3">
        <div>Proposal ID</div>
        <div>
          <Typography variant="body18">{shortenId(data.proposalId)}</Typography>
          <CopyButton
            text={data.proposalId}
            revertIn={1500}
            onCopy={() =>
              notify({
                type: "success",
                message: "Complete ID copied to clipboard",
                title: "New Notification",
                position: "topR",
              })
            }
          />
        </div>
        <div>Description</div>
        <Typography variant="body18">{data.description}</Typography>
        <div>Deadline</div>
        <Typography variant="body18">{data.deadline}</Typography>
        <div>Calldatas</div>
        <div>
          {data.calldatas.map((calldata) => (
            <div>
              <Typography variant="body18">{calldata.slice(0, 25)}</Typography>
              <CopyButton
                text={calldata}
                revertIn={1500}
                onCopy={() =>
                  notify({
                    type: "success",
                    message: "Complete calldata copied to clipboard",
                    title: "New Notification",
                    position: "topR",
                  })
                }
              />
            </div>
          ))}
        </div>
        <div>Targets</div>
        <div>
          {data.targets.map((target) => (
            <div>
              <Typography variant="body18">{target.slice(0, 24)}</Typography>
              <CopyButton
                text={target}
                revertIn={1500}
                onCopy={() =>
                  notify({
                    type: "success",
                    message: "Complete address copied to clipboard",
                    title: "New Notification",
                    position: "topR",
                  })
                }
              />
            </div>
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

export default Proposal;

export async function getStaticProps({ params }) {
  const res = await fetch(
    `http://localhost:3000/api/proposalId/${params.proposalId}`
  );
  const data = await res.json();
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
