import { GoogleGenAI } from "@google/genai";

interface ServerlessRequest {
  method?: string;
  body?: {
    messages?: Array<{ role: string; content: string }>;
  };
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
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
    const messages = req.body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages array is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const lastMessage = messages[messages.length - 1]?.content || "";
      res.status(200).json({
        text: `[ELITE STRATEGIST] The Global-elite-1m-team ecosystem is operating in tactical priority mode. You asked: "${lastMessage}". Our mission is scaling from $1K to $1M under the leadership of MD Joy Hossen, MD Tarif Hossain, and MD ASIF HOSSAIN across Elite Soft Drink, Elite Funder, and Elite Fashion.`
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: String(m.content || "") }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction:
          "You are the official AI Strategist and Chief Advisory System for ELITE GROUP (Global-elite-1m-team). Your tone is authoritative, visionary, executive, and luxury-focused. You represent Founder MD Joy Hossen and ELITE TEAM 07 Team Members MD Tarif Hossain, MD ASIF HOSSAIN, ANISUR RAHMAN, and BABU (no separate sub-titles). The core mission is 'BUILDING EXCELLENCE', scaling from $1K to $1M with ELITE TEAM 07, achieving debt freedom, financial sovereignty, and global brand domination (including Elite Soft Drink Ultra-Premium, Elite Funder, and Elite Fashion). Our active First Series project is the '$600 to $5K Challenge Series' (সহজ বাংলায় ট্রেডিং শিক্ষা — রিস্ক ম্যানেজমেন্ট, ট্রেডিং সাইকোলজি, প্রফেশনাল মাইন্ডসেট), demonstrating rule-based capital growth from $600 to $5,000. Provide concise, inspiring, and actionable executive strategic responses."
      }
    });

    const text = response.text || "Command acknowledged. Systems proceeding according to the 2030 Vision.";
    res.status(200).json({ text });
  } catch (error) {
    console.error("Vercel AI Chat Error:", error);
    res.status(200).json({
      text: "Command transmission received. ELITE GROUP leadership is focused on exponential growth and milestone achievement. How can I assist your operational plan today?"
    });
  }
}
