import express from "express";
import {submitQuestionnaire, getQuestionnaireByUser } from "../controllers/questionnaireController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/questionnaire/submit - Save user's questionnaire answers
router.post("/submit", authMiddleware, submitQuestionnaire);

// GET /api/questionnaire/history/:userId - Get all questionnaire responses for a user
router.get("/history/:userId", authMiddleware, getQuestionnaireByUser);

export default router;
