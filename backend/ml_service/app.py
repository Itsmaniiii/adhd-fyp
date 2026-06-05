from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model # <-- ERROR 1 FIX: Sahi tarika import ka
from flask_cors import CORS # <-- Zaroori: Node.js se connect karne ke liye

app = Flask(__name__)
CORS(app) # Taake Node.js (5000) Flask (5001) se baat kar sake

# 1. Real AI Model load karein
adhd_model = None
try:
    # Model file ka pura naam check karein (adhd_model.h5)
    adhd_model = load_model('adhd_model.h5')
    print("✅ Success: AI Model Loaded!")
except Exception as e:
    print(f"❌ Error: Model load nahi ho saka. Wajah: {e}")

# Diagnosis Classes mapping
diagnosis_map = {0: "No ADHD", 1: "Mild ADHD", 2: "Moderate ADHD", 3: "Severe ADHD"}

@app.route('/predict', methods=['POST'])
def predict():
    if adhd_model is None:
        return jsonify({"success": False, "message": "Model not loaded on server"}), 500

    try:
        data = request.json
        features = data.get("features", [])

        # Check agar features khali hain
        if not features:
            return jsonify({"success": False, "message": "No features provided"}), 400

        # Input data conversion
        input_data = np.array(features).reshape(1, -1)

        # 2. Real Model Prediction
        prediction_probs = adhd_model.predict(input_data)
        predicted_class = np.argmax(prediction_probs)
        confidence = float(np.max(prediction_probs))

        return jsonify({
            "success": True,
            "severity": diagnosis_map.get(predicted_class, "Unknown"),
            "class_index": int(predicted_class),
            "confidence": confidence, # Decimal bhej rahe hain taake frontend pe calculation asan ho
            "all_probabilities": prediction_probs.tolist()
        })

    except Exception as err:
        print(f"Prediction Error: {err}") # Terminal mein error dikhega
        return jsonify({
            "success": False,
            "message": str(err)
        }), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True, use_reloader=False)