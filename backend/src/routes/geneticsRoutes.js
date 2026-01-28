import express from "express";
import {addGenetics,getGeneticsByChild } from "../controllers/geneticsController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addGenetics);
router.get("/:childId", authMiddleware, getGeneticsByChild);

export default router;
