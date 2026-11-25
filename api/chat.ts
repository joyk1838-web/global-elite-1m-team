import { GoogleGenAI } from "@google/genai";

interface ServerlessRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: {
    messages?: unknown;
  };
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1500;

function getAllowedOrigin(originHeader: string | string[] | undefined): string | null {
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;
  if (!origin) return null;
  if (
    origin === "https://global-elite-1m-team.vercel.app" ||
    /^https:\/\/[a-z0-9-]+\.asia-east1\.run\.app$/i.test(origin) ||
    /^http:\/\/localhost(:\d+)?$/i.test(origin)
  ) {
    return origin;
  }
  return null;
}

function normalizeMessages(raw: unknown): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) {
    return null;
  }
  const normalized: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (typeof content !== "string") return null;
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return null;
    if (role !== "user" && role !== "assistant" && role !== "model") return null;
    normalized.push({
      role: role === "user" ? "user" : "model",
      parts: [{ text: trimmed }],
    });
  }
  return normalized;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  const allowedOrigin = getAllowedOrigin(req.headers?.origin);
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const contents = normalizeMessages(req.body?.messages);
    if (!contents) {
      res.status(400).json({
        error: "Invalid messages payload. Provide 1–20 messages with text up to 1500 characters.",
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(200).json({
        text: "GLOBAL ELITE 1M TEAM (ELITE GROUP) is operating toward the $1M milestone under Founder MD Joy Hossen and ELITE TEAM 07 across Elite Soft Drink, Elite Funder, Elite Fashion, and the Series 01 ($600 to $5K) trading education project.",
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents,
      config: {
        systemInstruction:
          "You are the official AI Strategist and Chief Advisory System for GLOBAL ELITE 1M TEAM (ELITE GROUP). Core message: ONE TEAM. ONE VISION. ONE GOAL. Values: DISCIPLINE. CONSISTENCY. TRANSPARENCY. GROWTH. You represent Founder MD Joy Hossen and ELITE TEAM 07 Team Members MD Tarif Hossain, MD ASIF HOSSAIN, ANISUR RAHMAN, and BABU. The core mission is scaling from $1K to $1M toward financial sovereignty across Elite Soft Drink, Elite Funder, and Elite Fashion, plus our Series 01 '$600 to $5K Challenge Series' (সহজ বাংলায় ট্রেডিং শিক্ষা — রিস্ক ম্যানেজমেন্ট, ট্রেডিং সাইকোলজি, প্রফেশনাল মাইন্ডসেট). Never guarantee financial returns and remind visitors that trading involves financial risk when asked about trading.",
      },
    });

    const text =
      response.text ||
      "Command acknowledged. Systems proceeding according to the 2030 Vision.";
    res.status(200).json({ text });
  } catch (error) {
    console.error("Vercel AI Chat Error:", error);
    res.status(500).json({
      error: "Unable to complete advisory request at this moment. Please try again shortly.",
    });
  }
}
