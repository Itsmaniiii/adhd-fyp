import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
let groqClient = null;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing. Please set it in your .env file.");
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
};

router.post("/chat", async (req, res) => {
  try {
    const { history } = req.body;

    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ reply: "Chat history is required." });
    }

    const lastEntry = history[history.length - 1];
    const lastMsg = lastEntry?.text || lastEntry?.content || "";

    if (!lastMsg.trim()) {
      return res.status(400).json({ reply: "Message content is required." });
    }

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an ADHD AI assistant. Keep answers short, use bullet points, and give practical steps. No medical diagnosis."
        },
        {
          role: "user",
          content: lastMsg
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    return res.json({
      reply: completion.choices[0]?.message?.content || ""
    });
  } catch (error) {
    console.error("❌ Groq Error:", error.message);

    if (error.message.includes("GROQ_API_KEY")) {
      return res.status(503).json({
        reply: "AI service is not configured yet. Please add GROQ_API_KEY to your environment."
      });
    }

    return res.status(500).json({
      reply: "Meta AI service busy. Try again."
    });
  }
});

export default router;