import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5002";

export const callMLService = async (features) => {
  try {
    const res = await axios.post(`${ML_SERVICE_URL}/predict`, {
      features: features
    });
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error("❌ Flask Side Error:", err.response.data);
    } else if (err.request) {
      console.error(`❌ Connection Error: Flask server at ${ML_SERVICE_URL} is not responding.`);
    } else {
      console.error("❌ Request Setup Error:", err.message);
    }
    throw new Error(err.response?.data?.message || "ML service unavailable");
  }
};