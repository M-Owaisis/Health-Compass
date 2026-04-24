import os
from huggingface_hub import HfApi, login

# 1. Get token from user environment
hf_token = os.environ.get("HF_TOKEN")
if not hf_token:
    print("Please export HF_TOKEN='your_hf_access_token' first.")
    exit(1)

# 2. Login
login(token=hf_token)
api = HfApi()

# 3. Define repo details
repo_id = "M-Owaisis/Health-Compass-Model" # Change to your HF username if different

try:
    api.create_repo(repo_id=repo_id, exist_ok=True, repo_type="model")
    print(f"Repository {repo_id} ready.")
    
    # 4. Upload models
    api.upload_folder(
        folder_path="ai_models",
        repo_id=repo_id,
        repo_type="model",
    )
    print("Model uploaded successfully to Hugging Face Hub!")
except Exception as e:
    print(f"Error: {e}")
