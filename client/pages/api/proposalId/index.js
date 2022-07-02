import Proposal from "../../../models/proposalModel";
import connectToMongo from "../../../utils/connectToMongo";

const fs = require("fs");

export default async function handler(req, res) {
  console.log("Connecting to mongo...");
  await connectToMongo();
  console.log("Connected to mongo");
  switch (req.method) {
    case "POST":
      const newProposal = new Proposal(req.body);
      const proposalSaved = await newProposal.save();
      return res.status(201).send(proposalSaved);
    case "GET":
      const proposals = await Proposal.find({})
      console.log('proposals:', proposals);
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
