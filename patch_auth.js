const fs = require('fs');
const file = 'backend/controllers/authController.js';
let content = fs.readFileSync(file, 'utf8');

// Inside exports.googleAuth, replace the catch block to return the error message specifically
content = content.replace(
  "res.status(500).json({ success: false, message: 'Google authentication failed' });",
  "res.status(500).json({ success: false, message: 'Google authentication failed', error: error.message, stack: error.stack });"
);

fs.writeFileSync(file, content, 'utf8');
