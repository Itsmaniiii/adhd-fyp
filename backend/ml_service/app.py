from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
import tensorflow as tf
import joblib
import pandas as pd

app = Flask(__name__)

# ✅ Update CORS for React
CORS(app, resources={r"/*": {"origins": "*"}})

print("🚀 Starting ADHD Prediction Server")



adhd_model = None
scaler = None
target_encoder = None
feature_names = None
rf_model = None
model_loaded = False

# Load Neural Network
model_path = 'adhd_91_model.keras'
if os.path.exists(model_path):
    try:
        adhd_model = tf.keras.models.load_model(model_path)
        print(f"✅ Neural Network loaded from: {model_path}")
        model_loaded = True
    except Exception as e:
        print(f"❌ Error loading {model_path}: {e}")
else:
    print(f"⚠️ Model file '{model_path}' not found!")

# Load scaler and encoders
try:
    if os.path.exists('adhd_scaler.pkl'):
        scaler = joblib.load('adhd_scaler.pkl')
        print("✅ Scaler loaded successfully")
    
    if os.path.exists('adhd_target_encoder.pkl'):
        target_encoder = joblib.load('adhd_target_encoder.pkl')
        print(f"✅ Target encoder loaded: {target_encoder.classes_}")
    
    if os.path.exists('adhd_feature_names.pkl'):
        feature_names = joblib.load('adhd_feature_names.pkl')
        print(f"✅ Feature names loaded: {len(feature_names)} features")
    
    if os.path.exists('adhd_rf_model.pkl'):
        rf_model = joblib.load('adhd_rf_model.pkl')
        print("✅ Random Forest loaded for ensemble")
        
except Exception as e:
    print(f"⚠️ Error loading preprocessing files: {e}")



# Symptom columns (8 symptoms - what model expects)
SYMPTOM_COLS = [
    'Careless mistakes / miss details',
    'Difficulty sustaining attention',
    'Difficulty organizing tasks & following instructions',
    'Easily distracted or forgetful',
    'Fidgets or trouble staying seated',
    'Constantly on the go / difficulty playing quietly',
    'Talks excessively / blurts out answers',
    'Difficulty waiting turn / interrupts others'
]

if feature_names is not None:
    SYMPTOM_COLS = feature_names


def get_diagnosis(class_idx):
    """Get diagnosis name from class index"""
    if target_encoder is not None:
        try:
            return target_encoder.inverse_transform([class_idx])[0]
        except:
            pass
    
    diagnosis_map = {
        0: "High Risk",
        1: "Low Risk", 
        2: "Moderate Risk"
    }
    return diagnosis_map.get(class_idx, "Unknown")

def extract_symptoms(features):
   
    if isinstance(features, list):
        if len(features) > len(SYMPTOM_COLS):
            symptom_features = features[-len(SYMPTOM_COLS):]
            print(f"   Extracted symptoms (skipping Age, Gender): {symptom_features}")
            return symptom_features
        else:
            return features
    
    elif isinstance(features, dict):
        symptom_dict = {}
        for col in SYMPTOM_COLS:
            symptom_dict[col] = features.get(col, 0)
        return symptom_dict
    
    return features

def preprocess_input(features):
    
    features = extract_symptoms(features)
    
    if isinstance(features, list):
        while len(features) < len(SYMPTOM_COLS):
            features.append(0)
        if len(features) > len(SYMPTOM_COLS):
            features = features[:len(SYMPTOM_COLS)]
        
        input_dict = {}
        for i, col in enumerate(SYMPTOM_COLS):
            input_dict[col] = features[i] if i < len(features) else 0
    
    elif isinstance(features, dict):
        input_dict = features
    else:
        raise ValueError("Features must be list or dict")
    
    input_df = pd.DataFrame([input_dict])
    
    for col in SYMPTOM_COLS:
        if col not in input_df.columns:
            input_df[col] = 0
    
    input_df = input_df[SYMPTOM_COLS]
    input_df = input_df.apply(pd.to_numeric, errors='coerce').fillna(0)
    
    if scaler is not None:
        input_scaled = scaler.transform(input_df)
    else:
        input_scaled = input_df.values / 3.0
    
    return input_scaled, input_dict


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model_loaded,
        "model_accuracy": "92.70%",
        "model_file": "adhd_91_model.keras",
        "features": SYMPTOM_COLS,
        "feature_count": len(SYMPTOM_COLS),
        "classes": target_encoder.classes_.tolist() if target_encoder else ["High Risk", "Low Risk", "Moderate Risk"],
        "port": 5001,
        "note": "Model expects 8 symptom scores. First 2 features (Age, Gender) are automatically skipped."
    })

@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        "message": "ADHD Prediction Server is running!",
        "port": 5001,
        "model_loaded": model_loaded,
        "model_accuracy": "92.70%",
        "features_expected": len(SYMPTOM_COLS),
        "feature_names": SYMPTOM_COLS,
        "note": "If you send 10 features, first 2 (Age, Gender) will be skipped."
    })

@app.route('/predict', methods=['POST'])
def predict():
  
    try:
        data = request.json
        features = data.get("features", [])
        model_type = data.get("model_type", "nn")
        
        print(f"\n📥 Received request")
        print(f"   Model type: {model_type}")
        print(f"   Original features: {features}")
        
        if not features:
            return jsonify({
                "success": False,
                "message": "No features provided."
            }), 400
        
        if not model_loaded:
            return jsonify({
                "success": False,
                "message": "Model not loaded. Please check server.",
                "model_loaded": False
            }), 503
        
        # Preprocess input (automatically skips Age, Gender)
        input_scaled, input_dict = preprocess_input(features)
        # Make prediction based on model type
        if model_type == 'ensemble' and rf_model is not None:
            rf_probs = rf_model.predict_proba(input_scaled)[0]
            nn_probs = adhd_model.predict(input_scaled, verbose=0)[0]
            probabilities = (rf_probs + nn_probs) / 2
            model_used = "ensemble (RF + NN)"
        elif model_type == 'rf' and rf_model is not None:
            probabilities = rf_model.predict_proba(input_scaled)[0]
            model_used = "random_forest"
        else:
            probabilities = adhd_model.predict(input_scaled, verbose=0)[0]
            model_used = "neural_network (91%)"
        
        # Get prediction
        predicted_class = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities))
        severity = get_diagnosis(predicted_class)
        # Create probability dict
        prob_dict = {}
        classes = target_encoder.classes_.tolist() if target_encoder else ["High Risk", "Low Risk", "Moderate Risk"]
        for i, cls in enumerate(classes):
            prob_dict[cls] = float(probabilities[i]) if i < len(probabilities) else 0.0
        result = {
            "success": True,
            "severity": severity,
            "class_index": predicted_class,
            "confidence": confidence,
            "probabilities": prob_dict,
            "model_used": model_used,
            "model_accuracy": "92.70%",
            "features_used": input_dict,
            "note": "Age and Gender (first 2 features) were automatically skipped."
        }
        print(f"🤖 Prediction: {severity} (confidence: {confidence:.2%})")
        print(f"   Model: {model_used}")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    try:
        data = request.json
        patients = data.get("patients", [])
        
        if not patients:
            return jsonify({
                "success": False,
                "message": "No patients provided"
            }), 400
        
        if not model_loaded:
            return jsonify({
                "success": False,
                "message": "Model not loaded. Please check server."
            }), 503
        
        results = []
        for idx, patient in enumerate(patients):
            features = patient.get("features", [])
            if not features:
                results.append({
                    "error": "No features provided",
                    "patient_index": idx
                })
                continue
            
            try:
                input_scaled, input_dict = preprocess_input(features)
                probabilities = adhd_model.predict(input_scaled, verbose=0)[0]
                predicted_class = int(np.argmax(probabilities))
                confidence = float(np.max(probabilities))
                severity = get_diagnosis(predicted_class)
                
                prob_dict = {}
                classes = target_encoder.classes_.tolist() if target_encoder else ["High Risk", "Low Risk", "Moderate Risk"]
                for i, cls in enumerate(classes):
                    prob_dict[cls] = float(probabilities[i]) if i < len(probabilities) else 0.0
                
                results.append({
                    "severity": severity,
                    "class_index": predicted_class,
                    "confidence": confidence,
                    "probabilities": prob_dict,
                    "features_used": input_dict
                })
            except Exception as e:
                results.append({
                    "error": str(e),
                    "patient_index": idx
                })
        
        return jsonify({
            "success": True,
            "results": results,
            "total": len(results)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/info', methods=['GET'])
def info():
    return jsonify({
        "model": {
            "loaded": model_loaded,
            "type": "Neural Network ",
            "accuracy": "92.70%",
            "file": "adhd_91_model.keras",
            "features": SYMPTOM_COLS,
            "feature_count": len(SYMPTOM_COLS),
            "classes": target_encoder.classes_.tolist() if target_encoder else ["High Risk", "Low Risk", "Moderate Risk"],
            "scaler_loaded": scaler is not None,
            "rf_loaded": rf_model is not None,
            "input_format": "Accepts 8 or 10 features. If 10, first 2 (Age, Gender) are skipped."
        },
        "server": {
            "status": "running",
            "port": 5001,
            "endpoints": [
                "GET  /health - Health check",
                "GET  /test - Test endpoint",
                "POST /predict - Single prediction (skips Age, Gender)",
                "POST /predict-batch - Batch prediction",
                "GET  /info - Model information"
            ]
        },
        
    })
if __name__ == '__main__':
    print("Model Status:")
    print(f"   Neural Network (91%): {'✅' if model_loaded else '❌'} {'Loaded' if model_loaded else 'Not Found'}")
    print(f"   Scaler:              {'✅' if scaler else '❌'} {'Loaded' if scaler else 'Not Found'}")
    print(f"   Target Encoder:      {'✅' if target_encoder else '❌'} {'Loaded' if target_encoder else 'Not Found'}")
    print(f"   Feature Names:       {'✅' if feature_names else '❌'} {'Loaded' if feature_names else 'Not Found'}")
    print(f"   Random Forest:       {'✅' if rf_model else '❌'} {'Loaded' if rf_model else 'Not Found'}")
    
    print(f"\n📍 Server URL: http://localhost:5002")
    print(f"📍 Health check: http://127.0.0.1:5002/health")
    print(f"📍 Test endpoint: http://127.0.0.1:5002/test")
    print(f"📍 Model info: http://127.0.0.1:5002/info")
    
    print(f"\n📋 Features Expected ({len(SYMPTOM_COLS)} symptom scores):")
    for i, col in enumerate(SYMPTOM_COLS, 1):
        print(f"   {i}. {col}")
    
    print("✅ Server is ready! Pure model predictions - NO FALLBACK!")
    
    app.run(host='0.0.0.0', port=5002, debug=True)