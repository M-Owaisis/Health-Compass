# Health Compass

Health Compass is a patient ability assessment web app that guides caregivers through structured, MCQ-based cognitive and daily-function tests. It generates age-, gender-, and occupation-aware question sets and presents clear scoring with visual summaries.

## Features
- Profile-based test generation (age, gender, occupation)
- Five-domain assessment flow: Global, Episodic Memory, Executive, Language, Functional
- MCQ-only questions with 1-mark scoring
- Visual results with radar profile and progress bars
- Secure auth flow and protected test routes

## Tech Stack
- Frontend: React, React Router
- Backend: Node.js, Express
- Logic: Proprietary Assessment Engine

## Project Structure
- backend/: API server, adaptive test generation, auth
- frontend/: React UI

## Running with Docker (Recommended)

If you have Docker and Docker Desktop installed, you can run the entire stack with a single command:

1. **Configure Engine Key**: Open `docker-compose.yml` and paste your key in the `GEMINI_API_KEY` field under `healthcompass-backend`.
2. **Start Services**:
   ```bash
   docker-compose up --build
   ```
3. **Access the App**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)
   - ML Service: [http://localhost:5001](http://localhost:5001)

### Manual Setup

#### Backend
1. Create `backend/config.env` with your secrets:
```
PORT=5000
GEMINI_API_KEY=your_key_here
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/healthcompass
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```
2. Install and run:
```bash
cd backend
npm install
node server.js
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Notes
- Do not commit backend/config.env (it is ignored).
- New tests are calibrated based on patient profiles.

## License
MIT
