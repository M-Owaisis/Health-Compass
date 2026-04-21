# backend/debug_features.py
import pickle

FEATURES_PATH = 'ai_models/model_features.pkl'

with open(FEATURES_PATH, 'rb') as f:
    model_features = pickle.load(f)

print(f"Model expects {len(model_features)} features:")
for i, feature in enumerate(model_features, 1):
    print(f"{i}. {feature}")