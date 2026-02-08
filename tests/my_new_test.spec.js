import { test } from '@playwright/test';

test('My new flow - no guardrails', async ({ page }) => {

  await page.goto('http://localhost:3333/chat');

  await page.getByRole('button', { name: '🛡️ ON ML' }).click();

  const input = page.getByRole('textbox', { name: 'Type your message...' });

  await input.click();
  await input.fill('what is pen testing');
  await input.press('Enter');

  // Optional: wait for response or assert something
  await expect(page.getByText('penetration')).toBeVisible();

});
