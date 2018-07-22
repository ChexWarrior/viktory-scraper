'use strict';

const puppeteer = require('puppeteer');
const process = require('process');
const helper = require('./helper');

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
  await helper.waitForElementToLoad(gameLogPage, '#Foundation_Elemental_1_log', ['tr']);
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
  await helper.waitForElementToLoad(printLogPage, 'body > div', ['tr']);

  const logHTML = await printLogPage.content();

  console.log(logHTML);

  await browser.close();
})();