// backend/services/mlService.js
const axios = require('axios');

// Python microservice URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

class MLService {
  async classifyRisk(assessmentResults, profile) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/classify`, {
        assessmentResults,
        profile
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('ML Service error:', error.message);
      
      // Fallback response based on MoCA score
      const mocaScore = assessmentResults?.mocaScore?.adjusted || 24;
      let fallbackRisk = {
        success: true,
        prediction: 0,
        risk_label: "Normal Aging",
        probability: 0.2,
        risk_level: "LOW",
        recommendation: "Continue regular health monitoring.",
        fallback: true
      };
      
      if (mocaScore <= 18) {
        fallbackRisk = {
          success: true,
          prediction: 1,
          risk_label: "Alzheimer's Disease Risk",
          probability: 0.75,
          risk_level: "HIGH",
          recommendation: "Clinical evaluation recommended based on MoCA score.",
          fallback: true
        };
      } else if (mocaScore <= 25) {
        fallbackRisk = {
          success: true,
          prediction: 0,
          risk_label: "MCI Range",
          probability: 0.45,
          risk_level: "MODERATE",
          recommendation: "Follow-up assessment recommended.",
          fallback: true
        };
      }
      
      return fallbackRisk;
    }
  }
  
  async healthCheck() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
      return response.data;
    } catch (error) {
      return { status: 'unavailable', error: error.message };
    }
  }
}

module.exports = new MLService();