const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5002/login');
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  if (content.includes('HealthCompass')) {
    console.log('Loaded correctly!');
  } else {
    console.log('Failed to load. Content:', content.substring(0, 500));
  }
  await browser.close();
})();
