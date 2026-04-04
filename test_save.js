
const http = require('http');

const data = JSON.stringify({
  name: 'Test User',
  email: 'test_save@mail.com',
  password: 'Password123!'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const token = JSON.parse(body).token;
    console.log('Token:', token);
    
    // Now hit save-result
    const saveData = JSON.stringify({
      profile: {
        name: 'John Doe',
        age: 65,
        gender: 'male',
        education: 'bachelors',
        occupation: 'retired',
        medicalFlags: []
      },
      scores: {
        raw: { earned: 85 },
        mocaEquivalent: { raw: 24, adjusted: 25 }
      },
      prediction: {
        risk_label: 'Normal',
        probability: 0.1,
        risk_level: 'LOW',
        recommendation: 'Nothing'
      },
      interpretation: { level: 'LOW' }
    });

    const req2 = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/assessment/save-result',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Length': saveData.length
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', d => body2 += d);
      res2.on('end', () => console.log('Save Result:', body2));
    });
    req2.write(saveData);
    req2.end();
  });
});
req.write(data);
req.end();
