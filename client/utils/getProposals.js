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

export function getAllProposals() {
  return JSON.parse(fs.readFileSync("./proposalsDB.json", "utf-8"));
}

export function getProposal(proposalId) {
  const proposals = JSON.parse(fs.readFileSync("./proposalsDB.json", "utf-8"));
  for (let i = 0; i < proposals.length; i++) {
    if (proposals[i].proposalId == proposalId) {
      return proposals[i];
    }
  }
  return [];
}
