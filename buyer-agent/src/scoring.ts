import { evaluateTaskSuitability } from "./llm/gemini";

interface Offer {
    agentId: string;
    price: number;
    respondSpeedSec: number;
    specialty: string;
}

interface ScoredOffer extends Offer {
    priceScore: number;
    respondSpeedSecScore: number;
    taskSuitabilityScore: number;
    finalScore: number;
}

type Mode = "default" | "budget" | "fast";

const WEIGHTS = {
    default: { price: 0.2, suitability: 0.7, speed: 0.1 },
    budget: { price: 0.6, suitability: 0.3, speed: 0.1 },
    fast: { price: 0.2, suitability: 0.2, speed: 0.6 },
};

export async function scoreAndSelectWinner(
    query: string,
    offers: Offer[],
    mode: Mode = "default"
): Promise<{ winner: ScoredOffer; allScores: ScoredOffer[] }> {

    const weights = WEIGHTS[mode];

    // 가격 정규화
    const prices = offers.map((o) => o.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    // 속도 정규화
    const speeds = offers.map((o) => o.respondSpeedSec);
    const maxSpeed = Math.max(...speeds);
    const minSpeed = Math.min(...speeds);

    const scored: ScoredOffer[] = await Promise.all(
        offers.map(async (offer) => {
            // 가격 점수: 낮을수록 높은 점수
            const priceScore =
                maxPrice === minPrice
                    ? 1
                    : (maxPrice - offer.price) / (maxPrice - minPrice);

            // 속도 점수: 빠를수록 높은 점수
            const respondSpeedSecScore =
                maxSpeed === minSpeed
                    ? 1
                    : (maxSpeed - offer.respondSpeedSec) / (maxSpeed - minSpeed);

            // 적합도 점수: Gemini가 평가
            const taskSuitabilityScore = await evaluateTaskSuitability(
                query,
                offer.specialty
            );

            const finalScore =
                priceScore * weights.price +
                taskSuitabilityScore * weights.suitability +
                respondSpeedSecScore * weights.speed;

            return {
                ...offer,
                priceScore,
                respondSpeedSecScore,
                taskSuitabilityScore,
                finalScore,
            };
        })
    );

    const winner = scored.reduce((a, b) =>
        a.finalScore > b.finalScore ? a : b
    );

    return { winner, allScores: scored };
}