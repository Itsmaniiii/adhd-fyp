import express from "express";
import {submitQuestionnaire,getQuestionnaireByChild } from "../controllers/questionnaireController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, submitQuestionnaire);
router.get("/:childId", authMiddleware, getQuestionnaireByChild);

export default router;
