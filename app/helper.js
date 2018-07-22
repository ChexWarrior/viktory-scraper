'use strict';

const waitForElementToLoad = async function(page, container, targets) {
  let counter = -1;
  let numTargets = 0;

  await page.waitForSelector(container);

  while (numTargets !== counter) {
    counter = numTargets;
    await page.waitFor(2000);
    console.log(`counter: ${counter}`);

    for (let target of targets) {
      numTargets = await page.$eval(container, (container, target) => {
        return container.querySelectorAll(target).length;
      }, target);
    }

    console.log(`numTargets: ${numTargets}`);
  }

  console.log(`End Counter: ${counter}, End numTargets: ${numTargets}`);
};

module.exports.waitForElementToLoad = waitForElementToLoad;