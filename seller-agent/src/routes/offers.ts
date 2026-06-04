import { Router, Request, Response } from "express";

const router = Router();

interface OfferRequest {
  query: string;
  userBudget: number;
  maxRespondSpeedSec: number;
}

interface OfferResponse {
  agentId: string;
  price: number;
  respondSpeedSec: number;
  expertise: string;
}

const AGENT_CONFIGS: Record<string, OfferResponse> = {
  perplexity: {
    agentId: "perplexity",
    price: 0.03,
    respondSpeedSec: 20,
    expertise: "실시간 검색 기반 분석",
  },
  claude: {
    agentId: "claude",
    price: 0.05,
    respondSpeedSec: 35,
    expertise: "논리적 추론과 문서 분석",
  },
  chatgpt: {
    agentId: "chatgpt",
    price: 0.04,
    respondSpeedSec: 25,
    expertise: "범용 텍스트 생성",
  },
  gemini: {
    agentId: "gemini",
    price: 0.05,
    respondSpeedSec: 30,
    expertise: "심층 분석과 긴 문맥 처리",
  },
};

const PORT_TO_AGENT: Record<number, string> = {
  4001: "perplexity",
  4002: "claude",
  4003: "chatgpt",
  4004: "gemini",
};

router.post("/", (req: Request, res: Response) => {
  const { query, userBudget, maxRespondSpeedSec } = req.body as OfferRequest;

  if (!query || userBudget === undefined || maxRespondSpeedSec === undefined) {
    res.status(400).json({ error: "query, userBudget, maxRespondSpeedSec are required" });
    return;
  }

  const port = req.socket.localPort ?? Number(process.env.PORT);
  const agentId = PORT_TO_AGENT[port];
  const config = agentId ? AGENT_CONFIGS[agentId] : undefined;

  if (!config) {
    res.status(500).json({ error: `Unknown agent port: ${port}` });
    return;
  }

  res.json(config);
});

export default router;
