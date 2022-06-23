import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProposalsTable from "../../components/ProposalsTable";
import { getContractSigned } from "../../utils/getContract";

const proposals = () => {
  const [proposal, setProposal] = useState({});

  const getProposals = async () => {
    const { provider, contract } = await getContractSigned("governor");
    const res = await axios.get("/api/proposalId");
    res.data.map(async (id) => {
      const state = await contract.state(id[0]);
      const proposalDeadlineBN = await contract.proposalDeadline(id[0]);
      const proposalDeadline = proposalDeadlineBN.toString();
      console.log(proposalDeadline)
    });
  };

  useEffect(() => {
    getProposals();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="m-5">
        <div>
          <h2>Proposals you can vote</h2>
          <ProposalsTable />
        </div>
        <div>
          <h2>Proposals already voted</h2>
          <ProposalsTable />
        </div>
      </div>
    </div>
  );
};

export default proposals;
