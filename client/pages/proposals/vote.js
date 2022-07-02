import { useEffect, useState } from "react";
import ProposalsTable from "../../components/ProposalsTable";
import filterProposals from "../../utils/filterProposals";
import { getAllProposals } from "../../utils/getProposals";

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
        console.log(error);
      }
    };

    filter();
  }, []);

  if (isLoading)
    return (
      <div className="flex flex-col items-center">
        <div className="animate-spin p-3 border-b-4 rounded-full w-3 h-3 border-red-500 mt-8"></div>
      </div>
    );

  if (
    !isLoading &&
    filteredProposals[0].concat(filteredProposals[1]).length === 0
  )
    return (
      <div className="flex flex-col items-center">
        <div className="mt-8 text-xl">
          There's no proposals open to vote. You can ADD a new project or come
          back later!
        </div>
      </div>
    );

  return (
    <div>
      <div className="m-5">
        <div>
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
    </div>
  );
};

export async function getStaticProps() {
  const proposals = getAllProposals();
  return {
    props: {
      proposals,
    },
  };
}

export default Vote;
