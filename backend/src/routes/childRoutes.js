import express from "express";
import { createChild, getChildByUser } from "../controllers/childController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChild);
router.get("/:userId", authMiddleware, getChildByUser);

export default router;
