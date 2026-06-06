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

const WEIGHTS = {
    price: 0.4,
    speed: 0.3,
    suitability: 0.3,
};

export async function scoreAndSelectWinner(
    query: string,
    offers: Offer[],
    userBudget: number,
    maxRespondSpeedSec: number
): Promise<{ winner: ScoredOffer; allScores: ScoredOffer[] }> {

    const scored: ScoredOffer[] = await Promise.all(
        offers.map(async (offer) => {
            // 가격 점수: 낮을수록 높은 점수
            const priceScore = Math.max(0, 1 - offer.price / userBudget);

            // 속도 점수: 빠를수록 높은 점수
            const respondSpeedSecScore = Math.max(
                0,
                1 - offer.respondSpeedSec / maxRespondSpeedSec
            );

            // 적합도 점수: Gemini가 평가
            const taskSuitabilityScore = await evaluateTaskSuitability(
                query,
                offer.specialty
            );

            const finalScore =
                priceScore * WEIGHTS.price +
                respondSpeedSecScore * WEIGHTS.speed +
                taskSuitabilityScore * WEIGHTS.suitability;

            return {
                ...offer,
                priceScore,
                respondSpeedSecScore,
                taskSuitabilityScore,
                finalScore,
            };
        })
    );

    const winner = scored.reduce((a, b) => (a.finalScore > b.finalScore ? a : b));

    return { winner, allScores: scored };
}