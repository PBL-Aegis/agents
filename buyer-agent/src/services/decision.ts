import { createHash } from "node:crypto";
import { Decision } from "../models/Decision";

export interface Offer {
  agentId: string;
  price: number;
  respondSpeedSec: number;
  expertise: string;
}

export interface DecisionScores {
  priceScore: number;
  respondSpeedSecScore: number;
  taskSuitabilityScore: number;
  finalScore: number;
}

export interface SaveDecisionInput {
  query: string;
  userBudget: number;
  maxRespondSpeedSec: number;
  mode: string;
  offers: Offer[];
  selectedOffer: Offer;
  scores: DecisionScores;
}

export interface SaveDecisionResult {
  decisionId: string;
  decisionHash: string;
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const objectValue = value as Record<string, unknown>;
  const entries = Object.keys(objectValue)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stableStringify(objectValue[key])}`
    );

  return `{${entries.join(",")}}`;
}

export function createDecisionHash(input: SaveDecisionInput): string {
  const payload = {
    query: input.query,
    userBudget: input.userBudget,
    maxRespondSpeedSec: input.maxRespondSpeedSec,
    mode: input.mode,
    offers: input.offers,
    selectedAgentId: input.selectedOffer.agentId,
    selectedOffer: input.selectedOffer,
    scores: input.scores,
  };

  return createHash("sha256")
    .update(stableStringify(payload))
    .digest("hex");
}

export async function saveDecision(
  input: SaveDecisionInput
): Promise<SaveDecisionResult> {
  const decisionHash = createDecisionHash(input);
  const decision = await Decision.create({
    ...input,
    selectedAgentId: input.selectedOffer.agentId,
    decisionHash,
  });

  return {
    decisionId: decision.id,
    decisionHash,
  };
}
