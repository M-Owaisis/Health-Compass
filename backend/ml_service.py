# backend/ml_service.py (FIXED - MATCHES FRONTEND KEY NAMES)
from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS
import os
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Load model and features
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ai_models', 'health_compass_classifier.pkl')
FEATURES_PATH = os.path.join(os.path.dirname(__file__), 'ai_models', 'model_features.pkl')

print(f"Loading model from: {MODEL_PATH}")
print(f"Loading features from: {FEATURES_PATH}")

with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

with open(FEATURES_PATH, 'rb') as f:
    model_features = pickle.load(f)

print(f"Model loaded successfully with {len(model_features)} features")
print(f"Expected features: {model_features}")

def safe_get(data, key, default=None):
    """Safely get value from dict"""
    if data is None:
        return default
    value = data.get(key, default)
    # Return None for empty strings or invalid values
    if value == "" or value == "Select" or value == "select" or value is None:
        return None
    return value

@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.json
        assessment_results = data.get('assessmentResults', {})
        profile = data.get('profile', {})
        
        print(f"\n=== Processing Classification Request ===")
        print(f"Profile keys received: {list(profile.keys())}")
        print(f"Assessment keys received: {list(assessment_results.keys())}")
        
        # Initialize all features as None
        features = {feature: None for feature in model_features}
        
        # Get domain scores from assessment results
        domain_scores = assessment_results.get('domain_scores', [])
        domain_dict = {}
        for d in domain_scores:
            if d.get('percent') is not None:
                domain_dict[d.get('id')] = d.get('percent')
        
        # Get MoCA score
        moca_score = assessment_results.get('mocaScore', {})
        mmse_value = moca_score.get('adjusted') or moca_score.get('raw')
        
        # Get domain-specific percentages
        episodic_percent = domain_dict.get('episodic-memory')
        global_percent = domain_dict.get('global')
        executive_percent = domain_dict.get('executive')
        language_percent = domain_dict.get('language')
        functional_percent = domain_dict.get('functional')
        
        print(f"Domain scores - Global: {global_percent}, Episodic: {episodic_percent}, Executive: {executive_percent}, Functional: {functional_percent}")
        
        # ===== MAP ALL FEATURES FROM PROFILE (using exact keys from frontend) =====
        
        # 1. Age
        features['Age'] = safe_get(profile, 'Age') or safe_get(profile, 'age')
        
        # 2. Gender (convert to numeric)
        gender_val = safe_get(profile, 'Gender') or safe_get(profile, 'gender')
        if gender_val is not None:
            gender_map = {'male': 0, 'female': 1, 'other': 2, 0: 0, 1: 1, 2: 2}
            features['Gender'] = gender_map.get(str(gender_val).lower(), None)
        
        # 3. Ethnicity (convert to numeric)
        ethnicity_val = safe_get(profile, 'Ethnicity') or safe_get(profile, 'ethnicity')
        if ethnicity_val is not None:
            ethnicity_map = {
                'caucasian': 0, 'white': 0,
                'african-american': 1, 'black': 1,
                'hispanic': 2, 'latino': 2,
                'asian': 3,
                'other': 4
            }
            features['Ethnicity'] = ethnicity_map.get(str(ethnicity_val).lower(), None)
        
        # 4. EducationLevel (convert to numeric)
        edu_val = safe_get(profile, 'EducationLevel') or safe_get(profile, 'education')
        if edu_val is not None:
            # If already numeric, use as is
            if isinstance(edu_val, (int, float)):
                features['EducationLevel'] = int(edu_val)
            else:
                edu_mapping = {
                    'elementary': 0, 'elementary school': 0,
                    'middle school': 1, 'high-school': 1, 'high school': 1,
                    'some-college': 2, 'some college': 2, 'associate': 2,
                    'bachelors': 3, 'bachelor': 3, 'bachelor\'s': 3,
                    'masters': 4, 'master': 4, 'master\'s': 4,
                    'doctorate': 5, 'phd': 5, 'doctoral': 5
                }
                features['EducationLevel'] = edu_mapping.get(str(edu_val).lower(), None)
        
        # 5. BMI
        features['BMI'] = safe_get(profile, 'BMI') or safe_get(profile, 'bmi')
        
        # 6. Smoking (convert to numeric)
        smoking_val = safe_get(profile, 'Smoking') or safe_get(profile, 'smoking')
        if smoking_val is not None:
            if isinstance(smoking_val, (int, float)):
                features['Smoking'] = int(smoking_val)
            else:
                smoking_map = {'never': 0, 'former': 1, 'current': 2}
                features['Smoking'] = smoking_map.get(str(smoking_val).lower(), None)
        
        # 7. AlcoholConsumption (convert to numeric)
        alcohol_val = safe_get(profile, 'AlcoholConsumption') or safe_get(profile, 'alcohol')
        if alcohol_val is not None:
            if isinstance(alcohol_val, (int, float)):
                features['AlcoholConsumption'] = int(alcohol_val)
            else:
                alcohol_map = {'none': 0, 'never': 0, 'light': 1, 'moderate': 2, 'heavy': 3}
                features['AlcoholConsumption'] = alcohol_map.get(str(alcohol_val).lower(), None)
        
        # 8. PhysicalActivity
        features['PhysicalActivity'] = safe_get(profile, 'PhysicalActivity') or safe_get(profile, 'physical_activity')
        
        # 9. DietQuality
        features['DietQuality'] = safe_get(profile, 'DietQuality') or safe_get(profile, 'diet_quality')
        
        # 10. SleepQuality
        features['SleepQuality'] = safe_get(profile, 'SleepQuality') or safe_get(profile, 'sleep_quality')
        
        # 11. FamilyHistoryAlzheimers
        fh_val = safe_get(profile, 'FamilyHistoryAlzheimers') or safe_get(profile, 'family_history')
        if fh_val is not None:
            if isinstance(fh_val, bool):
                features['FamilyHistoryAlzheimers'] = 1 if fh_val else 0
            else:
                features['FamilyHistoryAlzheimers'] = 1 if str(fh_val).lower() in ['yes', 'true', '1', 'y'] else 0
        
        # 12. CardiovascularDisease
        cv_val = safe_get(profile, 'CardiovascularDisease') or safe_get(profile, 'cardiovascular_disease')
        if cv_val is not None:
            if isinstance(cv_val, bool):
                features['CardiovascularDisease'] = 1 if cv_val else 0
            else:
                features['CardiovascularDisease'] = 1 if str(cv_val).lower() in ['yes', 'true', '1', 'y'] else 0
        
        # 13. Diabetes
        diabetes_val = safe_get(profile, 'Diabetes') or safe_get(profile, 'diabetes')
        if diabetes_val is not None:
            if isinstance(diabetes_val, bool):
                features['Diabetes'] = 1 if diabetes_val else 0
            else:
                features['Diabetes'] = 1 if str(diabetes_val).lower() in ['yes', 'true', '1', 'y'] else 0
        
        # 14. Depression
        depression_val = safe_get(profile, 'Depression') or safe_get(profile, 'depression')
        if depression_val is not None:
            if isinstance(depression_val, bool):
                features['Depression'] = 1 if depression_val else 0
            else:
                features['Depression'] = 1 if str(depression_val).lower() in ['yes', 'true', '1', 'y'] else 0
        
        # 15. HeadInjury
        hi_val = safe_get(profile, 'HeadInjury') or safe_get(profile, 'head_injury')
        if hi_val is not None:
            if isinstance(hi_val, bool):
                features['HeadInjury'] = 1 if hi_val else 0
            else:
                features['HeadInjury'] = 1 if str(hi_val).lower() in ['yes', 'true', '1', 'y'] else 0
        
        # 16. Hypertension
        htn_val = safe_get(profile, 'Hypertension') or safe_get(profile, 'hypertension')
        if htn_val is not None:
            if isinstance(htn_val, bool):
                features['Hypertension'] = 1 if htn_val else 0
            else:
                features['Hypertension'] = 1 if str(htn_val).lower() in ['yes', 'true', '1', 'y'] else 0
        
        # 17. MMSE
        features['MMSE'] = mmse_value
        
        # 18. FunctionalAssessment (convert from percentage to 0-10 scale)
        if functional_percent is not None:
            features['FunctionalAssessment'] = (functional_percent / 100) * 10
        else:
            features['FunctionalAssessment'] = safe_get(profile, 'FunctionalAssessment')
        
        # 19. MemoryComplaints
        if episodic_percent is not None:
            features['MemoryComplaints'] = 1 if episodic_percent < 85 else 0
        else:
            features['MemoryComplaints'] = safe_get(profile, 'MemoryComplaints')
        
        # 20. BehavioralProblems
        if global_percent is not None and executive_percent is not None and language_percent is not None:
            avg_score = (global_percent + executive_percent + language_percent) / 3
            features['BehavioralProblems'] = 1 if avg_score < 80 else 0
        elif global_percent is not None:
            features['BehavioralProblems'] = 1 if global_percent < 75 else 0
        else:
            features['BehavioralProblems'] = safe_get(profile, 'BehavioralProblems')
        
        # 21. ADL
        if functional_percent is not None:
            if functional_percent >= 90:
                features['ADL'] = 0
            elif functional_percent >= 70:
                features['ADL'] = 1
            else:
                features['ADL'] = 2
        else:
            features['ADL'] = safe_get(profile, 'ADL')
        
        # 22. Confusion
        if global_percent is not None and executive_percent is not None:
            features['Confusion'] = 1 if (global_percent < 70 or executive_percent < 70) else 0
        elif global_percent is not None:
            features['Confusion'] = 1 if global_percent < 65 else 0
        else:
            features['Confusion'] = safe_get(profile, 'Confusion')
        
        # 23. Disorientation
        if global_percent is not None:
            features['Disorientation'] = 1 if global_percent < 65 else 0
        else:
            features['Disorientation'] = safe_get(profile, 'Disorientation')
        
        # 24. PersonalityChanges
        if features['BehavioralProblems'] is not None:
            features['PersonalityChanges'] = 1 if features['BehavioralProblems'] == 1 else 0
        else:
            features['PersonalityChanges'] = safe_get(profile, 'PersonalityChanges')
        
        # 25. DifficultyCompletingTasks
        if executive_percent is not None:
            features['DifficultyCompletingTasks'] = 1 if executive_percent < 75 else 0
        else:
            features['DifficultyCompletingTasks'] = safe_get(profile, 'DifficultyCompletingTasks')
        
        # 26. Forgetfulness
        if episodic_percent is not None:
            features['Forgetfulness'] = 1 if episodic_percent < 80 else 0
        elif features['MemoryComplaints'] is not None:
            features['Forgetfulness'] = features['MemoryComplaints']
        else:
            features['Forgetfulness'] = safe_get(profile, 'Forgetfulness')
        
        # Create feature array in correct order
        feature_values = []
        missing_features = []
        
        for feature in model_features:
            val = features.get(feature)
            if val is None or (isinstance(val, float) and np.isnan(val)):
                missing_features.append(feature)
                feature_values.append(np.nan)
            else:
                try:
                    feature_values.append(float(val))
                except (TypeError, ValueError):
                    feature_values.append(np.nan)
                    missing_features.append(feature)
        
        if missing_features:
            print(f"Warning: Missing {len(missing_features)} features: {missing_features[:10]}...")
        
        # Convert to numpy array
        X = np.array(feature_values, dtype=np.float64).reshape(1, -1)
        
        print(f"\nFeature values (first 10):")
        for i in range(min(10, len(model_features))):
            val = X[0][i]
            val_display = f"{val:.1f}" if not np.isnan(val) else "MISSING"
            print(f"  {model_features[i]}: {val_display}")
        
        # Make prediction
        probability = model.predict_proba(X)[0][1]
        prediction = 1 if probability > 0.5 else 0
        
        print(f"\nPrediction: probability={probability:.3f}, class={prediction}")
        
        # Determine risk level
        if probability >= 0.7:
            risk_level = "HIGH"
            color = "#dc2626"
            recommendation = "Comprehensive clinical evaluation recommended within 2-4 weeks. Consider neurology referral."
        elif probability >= 0.4:
            risk_level = "MODERATE"
            color = "#f59e0b"
            recommendation = "Follow-up assessment in 3-6 months; monitor cognitive changes and discuss with primary care."
        else:
            risk_level = "LOW"
            color = "#10b981"
            recommendation = "Continue regular health monitoring; reassess annually or if symptoms change."
        
        response_data = {
            'success': True,
            'prediction': int(prediction),
            'risk_label': "Alzheimer's Disease Risk" if prediction == 1 else "Normal Aging",
            'probability': float(probability),
            'risk_level': risk_level,
            'color': color,
            'recommendation': recommendation,
            'moca_score': mmse_value if mmse_value is not None else None,
            'missing_features_count': len(missing_features),
            'missing_features': missing_features[:10] if missing_features else []
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in classification: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy', 
        'model_loaded': True, 
        'n_features': len(model_features),
        'features': model_features[:10]
    })

if __name__ == '__main__':
    print("\n=== Starting ML Service ===")
    print(f"Model expects {len(model_features)} features")
    app.run(port=5001, debug=True)