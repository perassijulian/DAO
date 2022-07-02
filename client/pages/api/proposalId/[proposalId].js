import Proposal from "../../../models/proposalModel";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const proposal = await Proposal.find({
        proposalId: req.query.proposalId,
      });
      if (proposal.length == 0)
        return res.status(400).end("Proposal not found");
      return res.status(200).send(proposal);
    default:
      return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
