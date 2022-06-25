import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProposalsTable from "../../components/ProposalsTable";
import filterProposals from "../../utils/filterProposals";

const Proposals = ({ proposals }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProposals, setFilteredProposals] = useState(null);

  useEffect(() => {
    const filter = async () => {
      const res = await filterProposals(proposals);
      setFilteredProposals(res);
      setIsLoading(false);
    };

    filter();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="w-11/12 m-5">
        <h1 className="font-semibold">READY TO EXECUTE</h1>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 mt-8 border-red-500 "></div>
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
            <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 mt-8 border-red-500 "></div>
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
            <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 mt-8 border-red-500 "></div>
          </div>
        ) : (
          <ProposalsTable
            key="table"
            proposals={filteredProposals[7]}
            action=""
          />
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
