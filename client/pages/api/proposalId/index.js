const fs = require("fs");

export default function handler(req, res) {
  console.log("API init")
  switch (req.method) {
    case "POST":
      console.log("POST/proposalId init");
      createProposal();
      return res.status(201).send("ProposalID saved correctly");
    case "GET":
      const proposals = getProposals();
      return res.status(200).send(proposals);
    default:
      return res.status(405).end(`Method ${req.method} not allowed`);
  }

  function createProposal() {
    console.log("POST/proposalId createProposal()");
    const allProposals = getProposals();
    // const id = Object.keys(req.body);
    // const proposal = req.body[id];
    // allProposals[id] = proposal;
    // fs.writeFileSync("./proposalsDB.json", JSON.stringify(allProposals));
    console.log("POST/proposalId push: ", req.body);
    allProposals.push(req.body);
    fs.writeFileSync("./proposalsDB.json", JSON.stringify(allProposals));
  }

  function getProposals() {
    console.log("POST/proposalId getProposals()");
    return JSON.parse(fs.readFileSync("./proposalsDB.json", "utf-8"));
  }
}
