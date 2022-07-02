import connectToMongo from "./connectToMongo";
import Proposal from "../models/proposalModel";

export async function getAllProposalIds() {
  await connectToMongo();
  const proposals = await Proposal.find({});

  return proposals.map((proposal) => {
    return {
      params: {
        proposalId: proposal.proposalId,
      },
    };
  });
}