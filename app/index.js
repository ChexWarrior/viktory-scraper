const puppeteer = require('puppeteer');
const process = require('process');

const GAMESBYEMAIL_BASE_URL = 'http://gamesbyemail.com/Games/Play?';

if(process.argv.length < 3) {
  console.log('You must pass the game ID!');
  process.exit(1);
}

let gameID = process.argv[2];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome'
  });

  const page = await browser.newPage();
  await page.goto(`${GAMESBYEMAIL_BASE_URL}${gameID}`);
  await page.screenshot({
    path: 'test.png'
  });

  await browser.close();
})();