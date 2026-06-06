import { Schema, model } from "mongoose";

const offerSchema = new Schema(
  {
    agentId: { type: String, required: true },
    price: { type: Number, required: true },
    respondSpeedSec: { type: Number, required: true },
    expertise: { type: String, required: true },
  },
  { _id: false }
);

const scoreSchema = new Schema(
  {
    priceScore: { type: Number, required: true },
    respondSpeedSecScore: { type: Number, required: true },
    taskSuitabilityScore: { type: Number, required: true },
    finalScore: { type: Number, required: true },
  },
  { _id: false }
);

const decisionSchema = new Schema(
  {
    query: { type: String, required: true },
    userBudget: { type: Number, required: true },
    maxRespondSpeedSec: { type: Number, required: true },
    mode: { type: String, required: true },
    offers: { type: [offerSchema], required: true },
    selectedAgentId: { type: String, required: true },
    selectedOffer: { type: offerSchema, required: true },
    scores: { type: scoreSchema, required: true },
    decisionHash: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const Decision = model("Decision", decisionSchema);
