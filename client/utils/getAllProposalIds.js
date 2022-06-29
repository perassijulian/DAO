import fs from "fs";

export function getAllProposalIds() {
  const proposals = JSON.parse(fs.readFileSync("./proposalsDB.json", "utf-8"));
  return proposals.map((proposal) => {
    return {
      params: {
        proposalId: proposal.proposalId,
      },
    };
  });
}
