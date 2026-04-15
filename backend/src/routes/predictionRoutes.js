import express from "express";
import { predictADHD } from "../controllers/predictionController.js";

const router = express.Router();

router.post("/predict/adhd", predictADHD);

export default router;