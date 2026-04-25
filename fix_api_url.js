const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (dirPath === path.join(dir, 'node_modules')) return;
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./frontend/src', filePath => {
  if (!filePath.endsWith('.js')) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace single-quoted urls
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${process.env.REACT_APP_API_URL || "http://localhost:5000"}$1`');
  
  // Replace double-quoted urls
  content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${process.env.REACT_APP_API_URL || "http://localhost:5000"}$1`');

  // Replace backticked urls (like `http://localhost:5000${endpoint}`)
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${process.env.REACT_APP_API_URL || "http://localhost:5000"}$1`');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Replaced localhost:5000 with process.env.REACT_APP_API_URL");
