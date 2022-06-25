import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProposalsTable from "../../components/ProposalsTable";
import { getContractSigned } from "../../utils/getContract";

const Proposals = ({ proposals }) => {
  const [readyToQueue, setReadyToQueue] = useState([]);
  const [readyToExecute, setReadyToExecute] = useState([]);
  const [alreadyExecuted, setAlreadyExecuted] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("proposals:", proposals);

  const filterProposals = async () => {
    //Make this filter
    const filterQueue = [];
    const filterExectute = [];
    const filterExectuted = [];
    const { provider, contract } = await getContractSigned("governor");
    await Promise.all(
      await proposals.map(async (p) => {
        const state = await contract.state(p.proposalId);
        switch (state) {
          case 4:
            filterQueue.push(p);
            break;
          case 5:
            filterExectute.push(p);
            break;
          case 7:
            filterExectuted.push(p);
            break;
          default:
            break;
        }
        // ProposalState
        // 0 Pending,
        // 1 Active,
        // 2 Canceled,
        // 3 Defeated,
        // 4 Succeeded,
        // 5 Queued,
        // 6 Expired,
        // 7 Executed
      })
    );
    setReadyToQueue(filterQueue);
    setReadyToExecute(filterExectute);
    setAlreadyExecuted(filterExectuted);
    setLoading(false);
  };

  const filterProposalsD = async () => {
    //For next iteration
    const filtered = { 3: [], 4: [] };
    const { provider, contract } = await getContractSigned("governor");
    await Promise.all(
      await proposals.map(async (p) => {
        const state = await contract.state(p.proposalId);
        filtered[state] = [...filtered[state], p];

        // ProposalState
        // 0 Pending,
        // 1 Active,
        // 2 Canceled,
        // 3 Defeated,
        // 4 Succeeded,
        // 5 Queued,
        // 6 Expired,
        // 7 Executed
      })
    );
    console.log(filtered);
    setLoading(false);
  };

  useEffect(() => {
    filterProposals();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="w-11/12 m-5">
        <h1 className="font-semibold">READY TO EXECUTE</h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 mt-8 border-red-500 "></div>
          </div>
        ) : (
          <ProposalsTable
            key="table"
            proposals={readyToExecute}
            action="EXECUTE"
          />
        )}
      </div>
     <div className="w-11/12 m-5">
        <h1 className="font-semibold">READY TO QUEUE</h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 mt-8 border-red-500 "></div>
          </div>
        ) : (
          <ProposalsTable key="table" proposals={readyToQueue} action="QUEUE" />
        )}
      </div>
      <div className="w-11/12 m-5">
        <h1 className="font-semibold">ALREADY EXECUTED</h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 mt-8 border-red-500 "></div>
          </div>
        ) : (
          <ProposalsTable key="table" proposals={alreadyExecuted} action="" />
        )}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/api/proposalId");
  const proposals = await res.json();

  return {
    props: {
      proposals,
    },
  };
}

export default Proposals;
