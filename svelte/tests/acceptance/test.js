import { expect, test } from '@playwright/test';

test('it shows the default state', async ({ page }) => {
  await page.goto('/');
  const message = await page.locator('.Vorfreude__countdown-message');
  expect(await message.textContent()).toContain('Vorfreude');

  const timer = await page.locator('.CountdownTimer');

  // :shrug: this might fail if this test is ran on the same day as the default date
  expect(await timer.textContent()).toMatch(/\d+ days \d+ hours \d+ minutes \d+ seconds/)
});
