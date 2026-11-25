import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1500;

function normalizeChatMessages(raw: unknown): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> | null {
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

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));

  // Baseline security headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // Gemini client initialization (strictly server-side)
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "GLOBAL ELITE 1M TEAM Command Center" });
  });

  // Gemini AI Strategist Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const contents = normalizeChatMessages(req.body?.messages);
      if (!contents) {
        return res.status(400).json({
          error: "Invalid messages payload. Provide 1–20 messages with text up to 1500 characters.",
        });
      }

      if (!apiKey) {
        return res.json({
          text: "GLOBAL ELITE 1M TEAM (ELITE GROUP) is operating toward the $1M milestone under Founder MD Joy Hossen and ELITE TEAM 07 across Elite Soft Drink, Elite Funder, Elite Fashion, and the Series 01 ($600 to $5K) trading education project.",
        });
      }

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
      res.json({ text });
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({
        error: "Unable to complete advisory request at this moment. Please try again shortly.",
      });
    }
  });

  // Serve SEO files explicitly so they never fall back to index.html
  const staticRoot =
    process.env.NODE_ENV === "production"
      ? path.join(process.cwd(), "dist")
      : path.join(process.cwd(), "public");

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml; charset=utf-8");
    res.sendFile(path.join(staticRoot, "sitemap.xml"));
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain; charset=utf-8");
    res.sendFile(path.join(staticRoot, "robots.txt"));
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "7d" }));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GLOBAL ELITE 1M TEAM Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
