import axios from "axios";
import { useEffect, useState } from "react";
import ProposalsTable from "../../components/ProposalsTable";
import Spinner from "../../components/Spinner";
import filterProposals from "../../utils/filterProposals";

const Proposals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [proposals, setProposals] = useState([])

  const getProposals = async () => {
    const res = await axios.get("/api/proposalId");
    setProposals(res.data);
  };

  const filter = async () => {
    try {
      const res = await filterProposals(proposals);
      setFilteredProposals(res);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProposals();
  }, []);

  useEffect(() => {
      filter();
  }, [proposals])

  return (
    <div className="flex flex-col items-center relative overflow-x-hidden">
      <div className="w-11/12 m-5">
        <h1 className="font-semibold">READY TO EXECUTE</h1>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <ProposalsTable
            key="table"
            proposals={filteredProposals[5]}
            action="EXECUTE"
          />
        )}
      </div>
      <div className="w-11/12 m-5">
        <h1 className="font-semibold">READY TO QUEUE</h1>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <ProposalsTable
            key="table"
            proposals={filteredProposals[4]}
            action="QUEUE"
          />
        )}
      </div>
      <div className="w-11/12 m-5">
        <h1 className="font-semibold">ALREADY EXECUTED</h1>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <ProposalsTable
            key="table"
            proposals={filteredProposals[7]}
            action="DETAILS"
          />
        )}
      </div>
    </div>
  );
};

export default Proposals;
