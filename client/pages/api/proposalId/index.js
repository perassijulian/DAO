import Proposal from "../../../models/proposalModel";
import connectToMongo from "../../../utils/connectToMongo";

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
      const proposals = await Proposal.find({});
      return res.status(200).send(proposals);
    default:
      return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
