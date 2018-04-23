const puppeteer = require('puppeteer');
const process = require('process');
const GAMESBYEMAIL_BASE_URL = 'http://gamesbyemail.com/Games/Play?';

const findNewestPage = function (currentPages, openedPages) {
  let notTracked = true;

  for (let currentPage of currentPages) {
    notTracked = true;

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
let openedPages = [];


(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome'
  });

  const initialPage = await browser.newPage();
  openedPages.push(initialPage);

  browser.on('targetcreated', (target) => {
    console.log('New page created!');
  });

  await initialPage.goto(`${GAMESBYEMAIL_BASE_URL}${gameID}`);
  await initialPage.waitForSelector('#Foundation_Elemental_2_openLog');
  await initialPage.click('#Foundation_Elemental_2_openLog');
  let currentPages = await browser.pages();
  let gameLogPage = findNewestPage(currentPages, openedPages);
  console.dir(gameLogPage);

  await browser.close();
})();