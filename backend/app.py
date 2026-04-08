from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load model and preprocessing objects
print("Loading model and preprocessors...")
model = tf.keras.models.load_model('adhd_model.keras')
scaler = joblib.load('scaler.pkl')
label_encoders = joblib.load('label_encoders.pkl')

# Define column names (same as training)
FEATURE_COLUMNS = [
    'Age', 'Gender', 'Educational_Level', 'Family_History', 'Sleep_Hours',
    'Daily_Activity_Hours', 'Daily_Phone_Usage_Hours',
    'Daily_Walking_Running_Hours', 'Difficulty_Organizing_Tasks',
    'Focus_Score_Video', 'Daily_Coffee_Tea_Consumption',
    'Learning_Difficulties', 'Anxiety_Depression_Levels'
]

# Mapping for frontend to backend
QUESTION_MAPPING = {
    'age': 'Age',
    'gender': 'Gender',
    'educational_level': 'Educational_Level',
    'family_history': 'Family_History',
    'sleep_hours': 'Sleep_Hours',
    'daily_activity_hours': 'Daily_Activity_Hours',
    'daily_phone_usage_hours': 'Daily_Phone_Usage_Hours',
    'daily_walking_running_hours': 'Daily_Walking_Running_Hours',
    'difficulty_organizing_tasks': 'Difficulty_Organizing_Tasks',
    'focus_score_video': 'Focus_Score_Video',
    'daily_coffee_tea_consumption': 'Daily_Coffee_Tea_Consumption',
    'learning_difficulties': 'Learning_Difficulties',
    'anxiety_depression_levels': 'Anxiety_Depression_Levels'
}

# Value mappings for categorical variables
VALUE_MAPPINGS = {
    'gender': {'male': 1, 'female': 2},
    'educational_level': {
        'kindergarten': 0, 'primary': 1, 'middle': 2, 
        'secondary': 3, 'university': 4, 'working': 5, 'not_working': 6
    },
    'family_history': {'yes': 1, 'no': 0, 'unknown': 0},
    'difficulty_organizing_tasks': {'no': 0, 'yes': 1},
    'learning_difficulties': {'no': 0, 'yes': 1}
}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model_loaded': True})

@app.route('/predict', methods=['POST'])
def predict():
    """Predict ADHD based on questionnaire answers"""
    try:
        # Get data from request
        data = request.json
        print(f"Received data: {data}")
        
        # Convert frontend answers to model input
        input_dict = {}
        
        for frontend_key, backend_key in QUESTION_MAPPING.items():
            value = data.get(frontend_key)
            
            # Apply value mappings if needed
            if frontend_key in VALUE_MAPPINGS:
                value = VALUE_MAPPINGS[frontend_key].get(str(value).lower(), value)
            else:
                # Convert to appropriate type
                try:
                    value = float(value) if '.' in str(value) else int(value)
                except:
                    pass
            
            input_dict[backend_key] = value
        
        # Create DataFrame
        input_df = pd.DataFrame([input_dict])
        
        # Encode categorical columns
        for col in label_encoders:
            if col in input_df.columns:
                try:
                    input_df[col] = label_encoders[col].transform(input_df[col].astype(str))
                except ValueError as e:
                    # Handle unknown categories
                    print(f"Warning: {e}")
                    input_df[col] = 0  # Default to first category
        
        # Ensure all columns are present
        for col in FEATURE_COLUMNS:
            if col not in input_df.columns:
                input_df[col] = 0
        
        # Reorder columns to match training
        input_df = input_df[FEATURE_COLUMNS]
        
        # Scale features
        input_scaled = scaler.transform(input_df)
        
        # Make prediction
        prediction = model.predict(input_scaled, verbose=0)
        predicted_class = int(np.argmax(prediction[0]))
        confidence = float(prediction[0][predicted_class])
        
        # Diagnosis mapping
        diagnosis_map = {
            0: "No ADHD",
            1: "Mild ADHD", 
            2: "Moderate ADHD",
            3: "Severe ADHD"
        }
        
        # Prepare response
        response = {
            'success': True,
            'prediction': {
                'class': predicted_class,
                'diagnosis': diagnosis_map[predicted_class],
                'confidence': round(confidence * 100, 2),
                'probabilities': {
                    'No ADHD': round(float(prediction[0][0]) * 100, 2),
                    'Mild ADHD': round(float(prediction[0][1]) * 100, 2) if len(prediction[0]) > 1 else 0,
                    'Moderate ADHD': round(float(prediction[0][2]) * 100, 2) if len(prediction[0]) > 2 else 0,
                    'Severe ADHD': round(float(prediction[0][3]) * 100, 2) if len(prediction[0]) > 3 else 0
                }
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """Predict for multiple samples"""
    try:
        data = request.json
        samples = data.get('samples', [])
        
        results = []
        for sample in samples:
            # Process each sample
            input_dict = {}
            for frontend_key, backend_key in QUESTION_MAPPING.items():
                value = sample.get(frontend_key)
                if frontend_key in VALUE_MAPPINGS:
                    value = VALUE_MAPPINGS[frontend_key].get(str(value).lower(), value)
                input_dict[backend_key] = value
            
            input_df = pd.DataFrame([input_dict])
            
            # Encode and predict
            for col in label_encoders:
                if col in input_df.columns:
                    try:
                        input_df[col] = label_encoders[col].transform(input_df[col].astype(str))
                    except:
                        input_df[col] = 0
            
            input_df = input_df[FEATURE_COLUMNS]
            input_scaled = scaler.transform(input_df)
            prediction = model.predict(input_scaled, verbose=0)
            predicted_class = int(np.argmax(prediction[0]))
            
            diagnosis_map = {0: "No ADHD", 1: "Mild ADHD", 2: "Moderate ADHD", 3: "Severe ADHD"}
            results.append({
                'class': predicted_class,
                'diagnosis': diagnosis_map[predicted_class],
                'confidence': float(prediction[0][predicted_class])
            })
        
        return jsonify({'success': True, 'results': results})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)