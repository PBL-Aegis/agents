import axios from "axios";

const SELLER_PORTS = [4001, 4002, 4003, 4004];

interface OfferRequest {
  query: string;
  userBudget: number;
  maxRespondSpeedSec: number;
}

interface Offer {
  agentId: string;
  price: number;
  respondSpeedSec: number;
  expertise: string;
}

interface BroadcastError {
  url: string;
  message: string;
}

interface BroadcastResult {
  offers: Offer[];
  errors: BroadcastError[];
}

export async function broadcastOffers(req: OfferRequest): Promise<BroadcastResult> {
  const results = await Promise.all(
    SELLER_PORTS.map(async (port) => {
      const url = `http://localhost:${port}/offers`;
      try {
        const { data } = await axios.post<Offer>(url, req);
        return { ok: true as const, offer: data };
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.error ?? err.message)
          : String(err);
        return { ok: false as const, url, message };
      }
    })
  );

  const offers: Offer[] = [];
  const errors: BroadcastError[] = [];

  for (const result of results) {
    if (result.ok) {
      offers.push(result.offer);
    } else {
      errors.push({ url: result.url, message: result.message });
    }
  }

  return { offers, errors };
}
