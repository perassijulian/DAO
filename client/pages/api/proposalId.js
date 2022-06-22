const fs = require("fs");

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      createProposal()
      return res.status(201).send("ProposalID saved correctly");
    case "GET":
      return getProposals();
    default:
      return res.status(405).end(`Method ${req.method} not allowed`);
  }

  function createProposal() {
    const allProposals = getProposals();
    allProposals.push(req.body)
    fs.writeFileSync("./proposalsDB.json", JSON.stringify(allProposals));
  }

  function getProposals() {
    return JSON.parse(fs.readFileSync("./proposalsDB.json", "utf-8"));
  }
}
