//POST execute 라우터
import { Router } from "express";
import { callGemini } from "../llm/gemini.js";

const router = Router();

router.post("/", async (req, res) => {
    const { query, budget } = req.body;
    const prompt = `구매 요청: ${query}, 예산: ${budget}`;
    const result = await callGemini(prompt);
    res.json({ success: true, result });
});

export default router;