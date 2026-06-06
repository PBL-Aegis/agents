import assert from "node:assert/strict";
import test from "node:test";
import {
  SaveDecisionInput,
  createDecisionHash,
  stableStringify,
} from "./decision";

const input: SaveDecisionInput = {
  query: "Analyze recent Apple stock trends",
  userBudget: 0.05,
  maxRespondSpeedSec: 30,
  mode: "default",
  offers: [
    {
      agentId: "gemini",
      price: 0.05,
      respondSpeedSec: 30,
      expertise: "Long-context analysis",
    },
  ],
  selectedOffer: {
    agentId: "gemini",
    price: 0.05,
    respondSpeedSec: 30,
    expertise: "Long-context analysis",
  },
  scores: {
    priceScore: 0.8,
    respondSpeedSecScore: 0.7,
    taskSuitabilityScore: 0.9,
    finalScore: 0.86,
  },
};

test("stableStringify sorts object keys recursively", () => {
  assert.equal(
    stableStringify({ z: 1, nested: { b: 2, a: 1 } }),
    '{"nested":{"a":1,"b":2},"z":1}'
  );
});

test("createDecisionHash is deterministic", () => {
  const first = createDecisionHash(input);
  const second = createDecisionHash({
    scores: input.scores,
    selectedOffer: input.selectedOffer,
    offers: input.offers,
    mode: input.mode,
    maxRespondSpeedSec: input.maxRespondSpeedSec,
    userBudget: input.userBudget,
    query: input.query,
  });

  assert.equal(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
});
