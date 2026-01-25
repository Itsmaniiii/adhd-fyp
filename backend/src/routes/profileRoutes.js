import express from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
