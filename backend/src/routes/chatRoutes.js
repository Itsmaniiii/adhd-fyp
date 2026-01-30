import express from "express";
import Groq from "groq-sdk"; // Groq import karein

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // .env mein key rakhein

router.post("/chat", async (req, res) => {
  try {
    const { history } = req.body;
    const lastMsg = history[history.length - 1].text || history[history.length - 1].content;

    const completion = await groq.chat.completions.create({
      // ✅ Meta ki Llama model yahan specify karein
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
      model: "llama-3.3-70b-versatile", // Ya "llama-3.1-8b-instant" for speed
    });

    res.json({ reply: completion.choices[0]?.message?.content || "" });

  } catch (error) {
    console.error("❌ Groq Error:", error.message);
    res.status(500).json({ reply: "Meta AI service busy. Try again." });
  }
});

export default router;