import { Request, Response, Router } from "express";
import { saveDecision } from "../services/decision";
import type { SaveDecisionInput } from "../services/decision";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const input = req.body as SaveDecisionInput;
    const { decisionId, decisionHash } = await saveDecision(input);

    res.status(201).json({
      selectedAgentId: input.selectedOffer.agentId,
      selectedOffer: input.selectedOffer,
      decisionId,
      decisionHash,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
});

export default router;
