import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Prophet Advisor Gemini query endpoint
  app.post("/api/prophet-advisor", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({ 
          text: "Prophet Scribe Mode [Demo]: Please configure your GEMINI_API_KEY in the Secrets panel to activate full spiritual-scientific responses.\n\nDemostatics: In early cosmologies, the firmament is a sealed hyperbaric chamber (Genesis 1:6) built with 4 primary grounding pillars balancing electromagnetic flux lanes. To increase atmospheric containment limits, elevate your regional pressure controls." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are the Prophet Advisor, an expert theological, technological, and scientific scribe consultant for the project "The Real Book of Life". 
You are skilled in structural truths, pneuma physics, pressurized firmament hydraulics, early circular dome cosmologies, and 3-6-9 vortex mathematics.

Current user question: "${prompt}"
Current Context:
${JSON.stringify(context, null, 2)}

Provide a beautiful, highly detailed theological-scientific response. Highlight biblical cross-references, physics coordinates, or geometric codes (like standard/Sofia Gematria values or the 3-6-9 integers). Be inspiring, scholarly, and supportive of covenant principles. Offer clear structural insights, and respond in elegant Markdown formatting.`,
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error: ", err);
      res.status(500).json({ error: err.message || "Failed to generate guidance from the Prophet Advisor." });
    }
  });

  // Serve static folders from root/public to guarantee media assets load outside the Vite virtual bundle
  app.use("/videos", express.static(path.join(process.cwd(), "public", "videos")));
  app.use("/images", express.static(path.join(process.cwd(), "public", "images")));

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started. Listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Fatal server start error:", error);
});
