import axios from "axios";

export const callMLService = async (features) => {
  try {
    // 127.0.0.1 use karna localhost se zyada reliable hota hai networking mein
    const res = await axios.post("http://127.0.0.1:5002/predict", {
      features: features
    });
    return res.data;
  } catch (err) {
    // Yahan hum detail nikal rahe hain
    if (err.response) {
      // Flask tak call gayi, lekin Flask ne error diya (e.g., 500 ya 400)
      console.error("❌ Flask Side Error:", err.response.data);
    } else if (err.request) {
      // Call gayi hi nahi (Flask server band hai ya port galat hai)
      console.error("❌ Connection Error: Flask server (5002) is not responding.");
    } else {
      console.error("❌ Request Setup Error:", err.message);
    }
    throw new Error(err.response?.data?.message || "ML service unavailable");
  }
};