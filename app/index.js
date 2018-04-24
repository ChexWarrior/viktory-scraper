const puppeteer = require('puppeteer');
const process = require('process');
const GAMESBYEMAIL_BASE_URL = 'http://gamesbyemail.com/Games/Play?';


    for (let openedPage of openedPages) {
      if (currentPage._target._targetId == openedPage._target._targetId) {
        notTracked = false;
      }
    }

    if (notTracked) {
      return currentPage;
    }
  }

  return null;
};

if(process.argv.length < 3) {
  console.log('You must pass the game ID!');
  process.exit(1);
}

let gameID = process.argv[2];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome'
  });

  const initialPage = await browser.newPage();

  await initialPage.goto(`${GAMESBYEMAIL_BASE_URL}${gameID}`);
  await initialPage.waitForSelector('#Foundation_Elemental_2_openLog');

  const newPagePromise  = new Promise((x) => {
    browser.once('targetcreated', (target) => {
      x(target.page());
    });
  });

  await initialPage.click('#Foundation_Elemental_2_openLog');

  const gameLogPage = await newPagePromise;

  await gameLogPage.screenshot({
    path: 'test.png'
  });

  await browser.close();
})();