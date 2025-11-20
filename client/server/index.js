import "dotenv/config";      
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};

    const resp = await client.responses.create({
      model: "gpt-5.1-mini",  
      input: messages?.length ? messages : "Say hello!",
      temperature: 0.7,
      max_output_tokens: 600
    });

    res.json({ reply: resp.output_text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
