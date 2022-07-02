import { Schema, model, models } from "mongoose";

const proposalSchema = new Schema({
  targets: Array,
  values: Array,
  calldatas: Array,
  description: String,
  proposalId: Number,
  deadline: Number,
});

const Proposal = models.Proposal || model("Proposal", proposalSchema);

export default Proposal;
