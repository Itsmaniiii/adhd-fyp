import * as questionnaireService from "../services/questionnaireService.js";
import { findUserById } from "../repositories/userRepository.js";

export const submitQuestionnaire = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { questions } = req.body;

    console.log("📥 Received questionnaire submission:");
    console.log(`   User ID from JWT: ${userId}`);
    console.log(`   User object:`, req.user);
    console.log(`   Number of questions: ${questions?.length}`);

    if (!userId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid data: authenticated user and questions array required" });
    }

    // Verify user exists
    const user = await findUserById(userId);
    if (!user) {
      console.log(`❌ User with ID ${userId} not found in database`);
      return res.status(404).json({ error: "User not found. Please log in again." });
    }
    console.log(`✅ User found: ${user.name} (${user.email})`);

    const invalidQuestion = questions.find(
      q => !q || typeof q.question !== "string" || q.question.trim() === "" || typeof q.answer !== "string"
    );
    if (invalidQuestion) {
      return res.status(400).json({ error: "Invalid questions payload: each item must have question and answer strings" });
    }

    const data = await questionnaireService.submitQuestionnaire({
      user_id: userId,
      questions
    });

    res.status(201).json(data);
  } catch (err) {
    console.error("Questionnaire submission error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getQuestionnaireByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await questionnaireService.getQuestionnaireByUser(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
