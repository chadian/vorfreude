import { expect, test } from '@playwright/test';

async function elementLocators(page, selector) {
  const inputs = page.locator(selector);
  const settingInputs = await Promise.all(Array((await inputs.count()))
    .fill(null)
    .map((_, i) => inputs.nth(i)));

  return settingInputs;
}

test('it has a wallpaper', async ({ page }) => {
  await page.goto('/');
  const wallpaper = await page.waitForSelector('.Wallpaper', { timeout: 10000 });
  expect(await wallpaper.isVisible()).toStrictEqual(true);
});

test('it shows the default settings state', async ({ page }) => {
  await page.goto('/');
  const message = page.locator('.Vorfreude__countdown-message');
  expect(await message.textContent()).toContain('Vorfreude');

  const timer = page.locator('.CountdownTimer');
  // :shrug: this might fail if this test is ran on the same day as the default date
  expect(await timer.textContent()).toMatch(/\d+ day(|s) \d+ hour(|s) \d+ minute(|s) \d+ second(|s)/);
});

test('it has the default settings', async ({ page }) => {
  await page.goto('/');
  await page.click('.Vorfreude__show-settings');
  await expect(page).toHaveURL('#settings');

  const settingInputs = await elementLocators(page, '.Settings__input-wrapper input');
  const settingInputValues = await Promise.all(settingInputs.map(locator => locator.inputValue()));

  const [
    countdownMessage,
    allDoneMessage,
    searchImageTerms,
    countdownYear,
    countdownMonth,
    countdownDay,
    countdownHour,
    countdownMinute
  ] = settingInputValues;

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  expect(countdownMessage).toBe('Vorfreude');
  expect(allDoneMessage).toBe('Countdown complete!');
  expect(searchImageTerms).toBe('New York City');

  // it could be this year or next year depending on whether the
  // date has already passed this year. See Settings component
  expect([currentYear, nextYear].includes(Number(countdownYear))).toStrictEqual(true);

  expect(countdownMonth).toBe('01');
  expect(countdownDay).toBe('01');
  expect(countdownHour).toBe('00');
  expect(countdownMinute).toBe('00');
});

test('it saves settings', async ({ page }) => {
  await page.goto('/#settings');

  await page.waitForSelector('.Settings__input-wrapper input');
  const settingInputs = await elementLocators(page, '.Settings__input-wrapper input');

  const [
    countdownMessageInput,
    allDoneMessageInput,
    searchImageTermsInput,
    countdownYearInput,
    countdownMonthInput,
    countdownDayInput,
    countdownHourInput,
    countdownMinuteInput,
  ] = settingInputs;

  const today = new Date();

  const newSettings = {
    countdownMessage: 'Hey, countdown!',
    allDoneMessage: 'We made it!',
    searchImageTerms: 'Hello hello',
    // put the countdown date 1 year in the future from today
    countdownYear: (today.getFullYear() + 1).toString(),
    // months are zero indexed
    countdownMonth: (today.getMonth() + 1).toString(),
    countdownDay: today.getDate().toString(),
    countdownHour: today.getHours().toString(),
    countdownMinute: today.getMinutes().toString(),
  }

  await countdownMessageInput.fill(newSettings.countdownMessage);
  await allDoneMessageInput.fill(newSettings.allDoneMessage);
  await searchImageTermsInput.fill(newSettings.searchImageTerms);
  await countdownYearInput.fill(newSettings.countdownYear);
  await countdownMonthInput.fill(newSettings.countdownMonth);
  await countdownDayInput.fill(newSettings.countdownDay);
  await countdownHourInput.fill(newSettings.countdownHour);
  await countdownMinuteInput.fill(newSettings.countdownMinute);

  // save!
  await page.click('button[type=submit]')

  const message = page.locator('.Vorfreude__countdown-message');
  expect(await message.textContent()).toContain(newSettings.countdownMessage);

  const timer = page.locator('.CountdownTimer');

  // seconds is fuzzy depending on how long it takes to run
  expect(await timer.textContent()).toMatch(/364 days 23 hours 59 minutes \d+ seconds/);
});
