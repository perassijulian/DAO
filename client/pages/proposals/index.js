import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getContractSigned } from "../../utils/getContract";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [readyToQueue, setReadyToQueue] = useState([]);
  const [readyToExecute, setReadyToExecute] = useState([]);
  const [alreadyExecuted, setAlreadyExecuted] = useState([]);

  const getProposals = async () => {
    const res = await axios.get("/api/proposalId");
    const { provider, contract } = await getContractSigned("governor");
    res.data.map(async (p) => {
      const state = await contract.state(p.proposalId);
      p.state = state;
      // ProposalState
      // 0 Pending,
      // 1 Active,
      // 2 Canceled,
      // 3 Defeated,
      // 4 Succeeded,
      // 5 Queued,
      // 6 Expired,
      // 7 Executed
    });
    setProposals(res.data);
  };

  const filterProposals = async () => {
    setReadyToQueue(proposals.filter((p) => p.state == 4));
    setReadyToExecute(proposals.filter((p) => p.state == 5));
    setAlreadyExecuted(proposals.filter((p) => p.state == 7));
  };

  useEffect(() => {
    getProposals();
  }, []);

  useEffect(() => {
    filterProposals();
  }, [proposals]);

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div>
        <h1>READY TO EXECUTE</h1>
        <div></div>
      </div>
      <div>
        <h1>READY TO QUEUE</h1>
        <div></div>
      </div>
      <div>
        <h1>ALREADY EXECUTED</h1>
        <div></div>
      </div>
    </div>
  );
};

export default Proposals;
