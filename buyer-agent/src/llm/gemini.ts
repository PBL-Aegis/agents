import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function evaluateTaskSuitability(
    query: string,
    specialty: string
): Promise<number> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
다음 작업 요청과 에이전트의 전문성을 보고, 이 에이전트가 해당 작업에 얼마나 적합한지 0~1 사이의 숫자만 반환해줘.
0은 전혀 적합하지 않음, 1은 매우 적합함.
숫자만 반환하고 다른 텍스트는 절대 포함하지 마.

작업 요청: ${query}
에이전트 전문성: ${specialty}
  `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const score = parseFloat(text);

    if (isNaN(score)) return 0.5;
    return Math.min(1, Math.max(0, score));
}