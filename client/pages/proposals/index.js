import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProposalsTable from "../../components/ProposalsTable";
import { getContractSigned } from "../../utils/getContract";

const proposals = () => {
  const [proposals, setProposals] = useState([]);

  const getProposals = async () => {
    const res = await axios.get("/api/proposalId");
    setProposals(res.data);
  };


        
  const filterProposals = async () => {
    const { provider, contract } = await getContractSigned("governor");
    proposals.map(async p => {
      const state = await contract.state(p.proposalId);
      p["state"] = state;
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
    console.log('proposals:', proposals);
  };

  useEffect(() => {
    getProposals();
  }, []);

  useEffect(() => {
    filterProposals();
  }, [proposals]);

  if (proposals.length === 0)
    return (
      <div className="flex flex-col items-center">
        <Navbar />
        <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 border-red-500 mt-8"></div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="m-5">
        <div>
          <h2>Proposals you can vote</h2>
          <ProposalsTable proposals={proposals} />
        </div>
      </div>
    </div>
  );
};

export default proposals;
