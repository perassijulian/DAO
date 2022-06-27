import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProposalsTable from "../../components/ProposalsTable";
import filterProposals from "../../utils/filterProposals";

const Vote = ({ proposals }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProposals, setFilteredProposals] = useState(null);

  useEffect(() => {
    const filter = async () => {
      try {
        const res = await filterProposals(proposals);
        setFilteredProposals(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error)
      }
    };

    filter();
  }, []);

  if (isLoading)
    return (
      <div className="flex flex-col items-center">
        <Navbar />
        <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 border-red-500 mt-8"></div>
      </div>
    );

    if (!isLoading && filteredProposals[0].concat(filteredProposals[1]).length === 0)
    return (
      <div className="flex flex-col items-center">
        <Navbar />
        <div className="mt-8 text-xl">There's no proposals open to vote. You can ADD a new project or come back later!</div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="m-5">
        <div>
          <h1 className="font-semibold">OPEN PROPOSALS</h1>
          <ProposalsTable
            proposals={filteredProposals[0].concat(filteredProposals[1])}
            action="vote"
          />
        </div>
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

export default Vote;
