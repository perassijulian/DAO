import { useEffect, useState } from "react";
import ProposalsTable from "../../components/ProposalsTable";
import filterProposals from "../../utils/filterProposals";
import axios from "axios";
import Spinner from "../../components/Spinner";

const Vote = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);

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
  

  if (isLoading)
    return (
      <div className="flex flex-col items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col items-center relative overflow-x-hidden">
      <div className="w-11/12 m-5">
        <h1 className="font-semibold">OPEN PROPOSALS</h1>
        <ProposalsTable
          proposals={filteredProposals[0].concat(filteredProposals[1])}
          action="vote"
        />
        <div className="text-red-500 text-center w-full mt-2">
          Remember that you need 20 secs after adding a new proposal and to be
          able to vote on it.
        </div>
        <div className="text-red-500 text-center w-full">
          Voting time is around 15 mins. After that time - if the proposal is
          approved - you will be able to queue it.
        </div>
        <div className="text-red-500 text-center w-full">
          Once is queued, after 15 min you will be able to execute it. This
          means, it will mint the nft to the address provided
        </div>
      </div>
    </div>
  );
};

export default Vote;
