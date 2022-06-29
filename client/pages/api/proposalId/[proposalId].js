const fs = require("fs");

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      const proposal = getProposal(req.query.proposalId);
      if (proposal.length == 0)
        return res.status(400).end("Proposal not found");
      return res.status(200).send(proposal);
    default:
      return res.status(405).end(`Method ${req.method} not allowed`);
  }

  function getProposal(proposalId) {
    const proposals = JSON.parse(
      fs.readFileSync("./proposalsDB.json", "utf-8")
    );
    for (let i = 0; i < proposals.length; i++) {
      if (proposals[i].proposalId == proposalId) {
        return proposals[i];
      }
    }
    return [];
  }
}
