import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(cors());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: "Server error processing request" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
