# seller-agent

판매 에이전트 서버. 구매 에이전트의 /offers 요청에 하드코딩된 설정값으로 응답한다.

**담당자:** 장혜리

## 담당 파일

- `src/routes/offers.ts` — 판매 에이전트 /offers API
- `src/index.ts` — 서버 진입점

## /offers API

**POST /offers**

요청:
```json
{
  "query": "string",
  "userBudget": number,
  "maxRespondSpeedSec": number
}
```

응답:
```json
{
  "agentId": "string",
  "price": number,
  "respondSpeedSec": number,
  "expertise": "string"
}
```

- LLM 호출 없음, 하드코딩 설정값 반환
- `PORT` 환경변수로 어느 에이전트인지 구분 (4001~4004)

## 에이전트 설정값

| PORT | agentId     | price | respondSpeedSec | expertise              |
|------|-------------|-------|-----------------|------------------------|
| 4001 | perplexity  | 0.03  | 20              | 실시간 검색 기반 분석  |
| 4002 | claude      | 0.05  | 35              | 논리적 추론과 문서 분석|
| 4003 | chatgpt     | 0.04  | 25              | 범용 텍스트 생성       |
| 4004 | gemini      | 0.05  | 30              | 심층 분석과 긴 문맥 처리|

## 실행 방법

```bash
PORT=4001 npx ts-node src/index.ts  # perplexity
PORT=4002 npx ts-node src/index.ts  # claude
PORT=4003 npx ts-node src/index.ts  # chatgpt
PORT=4004 npx ts-node src/index.ts  # gemini
```
