import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { RegistrationStepTwoPage } from '../pages/RegistrationStepTwoPage';
import {
  generateDynamicEmail,
  generateDynamicPassword,
  generateDynamicName,
  generateDynamicPhoneNumber,
} from '../utils/dynamicEmail';
import {
  createMailTmAccount,
  waitForMessage,
  getMessageBody,
  extractConfirmationLink,
  MailTmAccount,
} from '../utils/mailtm';

test.describe('Registration - Globbing', () => {
  test.describe.configure({ mode: 'serial' });

  let email: string;

  test.beforeEach(async () => {
    email = await generateDynamicEmail();
  });

  test('TC_REG_001 - complete registration with valid dynamic data', async ({ page }) => {
    test.setTimeout(140000);

    // Test data
    const password = generateDynamicPassword();
    const { firstName, lastName } = generateDynamicName();
    const { phoneNumber } = generateDynamicPhoneNumber();

    // Page objects
    const registrationPage = new RegistrationPage(page);
    const stepTwoPage = new RegistrationStepTwoPage(page);

    let mailAccount: MailTmAccount;

    await test.step('Create disposable email account', async () => {
      mailAccount = await createMailTmAccount(email, password);
    });

    await test.step('Open registration page and fill Step One', async () => {
      await registrationPage.open();

      await registrationPage.fillStepOne({
        email,
        password,
        phoneNumber,
      });
    });

    await test.step('Submit registration form', async () => {
      await registrationPage.submit();
      await registrationPage.expectVerificationEmailSentSuccessfully();
    });

    const confirmationLink = await test.step(
      'Get confirmation link from verification email',
      async () => {
        const message = await waitForMessage(mailAccount, {
          timeoutMs: 120000,
          intervalMs: 5000,
        });

        const body = await getMessageBody(
          mailAccount,
          message.id
        );

        console.log('Verification email received.');

        return extractConfirmationLink(body);
      }
    );

    await test.step('Open confirmation link', async () => {
      await page.goto(confirmationLink, {
        waitUntil: 'domcontentloaded',
      });

      await stepTwoPage.expectLoaded();
    });

    await test.step('Fill Step Two', async () => {
      await stepTwoPage.fillNames(firstName, lastName);
      await stepTwoPage.selectServiceCenter();
    });

    await test.step('Complete registration', async () => {
      await stepTwoPage.confirmInDialog();
      await stepTwoPage.submit();
      await stepTwoPage.expectRegistrationSuccess();
    });
  });

  test('TC_REG_002 - required fields prevent registration', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    await test.step('Open registration page', async () => {
      await registrationPage.open();
    });

    await test.step('Submit empty registration form', async () => {
      await registrationPage.submit();
    });

    await test.step('Verify required field validation', async () => {
      await registrationPage.expectEmailValidationError();
      await expect(page).toHaveURL(/registration/);
    });
  });

  test('TC_REG_003 - password confirmation mismatch prevents registration', async ({ page }) => {
    const password = generateDynamicPassword();
    const { phoneNumber } = generateDynamicPhoneNumber();

    const registrationPage = new RegistrationPage(page);

    await test.step('Open registration page', async () => {
      await registrationPage.open();
    });

    await test.step('Fill registration form with mismatched passwords', async () => {
      await registrationPage.emailInput.fill(email);
      await registrationPage.passwordInput.fill(password);
      await registrationPage.passwordConfirmInput.fill(`${password}X`);
      await registrationPage.phoneNumberInput.fill(phoneNumber);
      await registrationPage.termsCheckbox.check();
    });

    await test.step('Submit form and verify password validation error', async () => {
      await registrationPage.submit();
      await registrationPage.expectPasswordValidationError();
      await expect(page).toHaveURL(/registration/);
    });
  });
});