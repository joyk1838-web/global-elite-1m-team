import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Gemini client initialization
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "ELITE GROUP Command Center" });
  });

  // Gemini AI Strategist Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Check if API key is present
      if (!apiKey) {
        const lastMessage = messages[messages.length - 1]?.content || "";
        return res.json({
          text: `[ELITE STRATEGIST] The ELITE GROUP ecosystem is operating in tactical high-priority mode. You asked: "${lastMessage}". Our mission is scaling from $1K to $1M under the leadership of MD Joy Hossen, MD Tarif Hossain, and MD ASIF HOSSAIN. All systems, brand divisions (Elite Soft Drink, Elite Funder, Elite Fashion), and roadmap objectives are moving forward. What specific division would you like to review?`
        });
      }

      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.content || "") }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: "You are the official AI Strategist and Chief Advisory System for ELITE GROUP. Your tone is authoritative, visionary, executive, and luxury-focused. You represent Founder MD Joy Hossen and ELITE TEAM 07 Team Members MD Tarif Hossain, MD ASIF HOSSAIN, ANISUR RAHMAN, and BABU (no separate sub-titles). The core mission is 'BUILDING EXCELLENCE', scaling from $1K to $1M with ELITE TEAM 07, achieving debt freedom, financial sovereignty, and global brand domination (including Elite Soft Drink Ultra-Premium, Elite Funder, and Elite Fashion). Our active First Series project is the '$600 to $5K Challenge Series' (সহজ বাংলায় ট্রেডিং শিক্ষা — রিস্ক ম্যানেজমেন্ট, ট্রেডিং সাইকোলজি, প্রফেশনাল মাইন্ডসেট), demonstrating rule-based capital growth from $600 to $5,000. Provide concise, inspiring, and actionable executive strategic responses."
        }
      });

      const text = response.text || "Command acknowledged. Systems proceeding according to the 2030 Vision.";
      res.json({ text });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.json({
        text: "Command transmission received. ELITE GROUP leadership is focused on exponential growth and milestone achievement. How can I assist your operational plan today?"
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

  // Vite integration: middleware in dev, static serving in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ELITE GROUP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
