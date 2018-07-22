const puppeteer = require('puppeteer');
const process = require('process');
const GAMESBYEMAIL_BASE_URL = 'http://gamesbyemail.com/Games/Play?';

const waitForElementToLoad = async function(page, container, targets) {
  let counter = -1;
  let numTargets = 0;

  await page.waitForSelector(container);

  while(numTargets !== counter) {
    counter = numTargets;
    await page.waitFor(2000);
    console.log(`counter: ${counter}`);

    for(let target of targets) {
      numTargets = await page.$eval(container, (container, target) => {
        return container.querySelectorAll(target).length;
      }, target);
    }

    console.log(`numTargets: ${numTargets}`);
  }

  console.log(`End Counter: ${counter}, End numTargets: ${numTargets}`);
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
  const gameLogOpenPromise  = new Promise((x) => {
    browser.once('targetcreated', (target) => {
      x(target.page());
    });
  });

  await initialPage.click('#Foundation_Elemental_2_openLog');

  console.log('Waiting to open game log page...');

  const gameLogPage = await gameLogOpenPromise;
  await waitForElementToLoad(gameLogPage, '#Foundation_Elemental_1_log', ['tr']);
  await gameLogPage.waitForSelector('#Foundation_Elemental_1_printerFriendlyLog');
  const printLogPagePromise = new Promise((x) => {
    browser.once('targetcreated', (target) => {
      x(target.page());
    });
  });

  await gameLogPage.click('#Foundation_Elemental_1_printerFriendlyLog');

  console.log('Waiting to open print log page...');

  const printLogPage = await printLogPagePromise;
  await printLogPage.waitForSelector('body > h3');
  await waitForElementToLoad(printLogPage, 'body > div', ['tr']);

  const logHTML = await printLogPage.content();

  console.log(logHTML);

  await browser.close();
})();