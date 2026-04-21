const mongoose = require('mongoose');
const User = require('./models/User');
const AssessmentHistory = require('./models/AssessmentHistory');

mongoose.connect('mongodb://mongodb:27017/healthcompass').then(async () => {
    try {
        const user = await User.findOne({ email: 'test@healthcompass.com' });
        if (!user) {
            console.log("Could not find test user.");
            process.exit(1);
        }

        await AssessmentHistory.deleteMany({ caregiverId: user._id });

        const history1 = new AssessmentHistory({
            caregiverId: user._id,
            patientProfile: {
                name: 'Robert Miller',
                age: 72,
                gender: 'Male',
                education: 'bachelors',
                medicalFlags: ['Hypertension', 'CardiovascularDisease']
            },
            scores: {
                raw: { earned: 22, total: 30, percentage: 73.3 },
                mocaEquivalent: { raw: 24, adjusted: 25, adjustments: ["+1 for age > 70"] }
            },
            prediction: {
                risk_label: "Alzheimer's Disease Risk",
                probability: 0.82,
                risk_level: "HIGH",
                recommendation: "Comprehensive clinical evaluation recommended within 2-4 weeks. Consider neurology referral."
            },
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        });

        const history2 = new AssessmentHistory({
            caregiverId: user._id,
            patientProfile: {
                name: 'Martha Stewart',
                age: 65,
                gender: 'Female',
                education: 'masters',
                medicalFlags: ['Diabetes']
            },
            scores: {
                raw: { earned: 28, total: 30, percentage: 93.3 },
                mocaEquivalent: { raw: 28, adjusted: 28, adjustments: [] }
            },
            prediction: {
                risk_label: "Normal Aging",
                probability: 0.15,
                risk_level: "LOW",
                recommendation: "Continue regular health monitoring; reassess annually or if symptoms change."
            },
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        });

        await history1.save();
        await history2.save();

        console.log('SUCCESS: Generated 2 fake history records for test user!');
    } catch(err) {
        console.log('ERROR:', err);
    }
    process.exit(0);
}).catch(e => {
    console.log('MONGO ERR:', e);
    process.exit(1);
});
