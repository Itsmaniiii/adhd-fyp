import express from "express";
import { predictADHD } from "../controllers/predictionController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/predict/adhd", authenticate, predictADHD);

export default router;