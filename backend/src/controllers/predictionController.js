import { callMLService } from "../services/mlService.js";

export const predictADHD = async (req, res) => {
  try {
    const { answers } = req.body;
    const features = answers.map(a => Number(a.score));

    console.log("📤 Sending to Flask:", features); // Check karein array mein kitne items hain

    const result = await callMLService(features);

    res.json({
      success: true,
      prediction: result // Flask ka poora response
    });
  } catch (err) {
    console.error("🔥 Controller Error:", err.message);
    res.status(500).json({
      success: false,
      message: "AI Prediction Failed: " + err.message
    });
  }
};