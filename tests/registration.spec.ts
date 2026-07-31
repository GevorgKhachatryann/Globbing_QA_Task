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
  MailTmAccount
} from '../utils/mailtm';


test.describe('Registration- Globbing', () => {
  test('TC_REG_001 - full registration flow with dynamic data', async ({ page }) => {

    test.setTimeout(120000);
    const email = generateDynamicEmail('qa');
    const password = generateDynamicPassword();
    const { firstName, lastName } = generateDynamicName();
    const { phoneNumber } = generateDynamicPhoneNumber();
    const registrationPage = new RegistrationPage(page);
    const stepTwoPage = new RegistrationStepTwoPage(page);
    let mailAccount: MailTmAccount;

    await test.step('Create disposable inbox', async () => {
      mailAccount = await createMailTmAccount(email, password);
    });

    await test.step('Open Registration and fill Step One', async () => {
      await registrationPage.open();
      await registrationPage.fillStepOne({
        email,
        password,
        phoneNumber,
      });
    });

    await test.step('Submit registration', async () => {
      await registrationPage.submit();
      await registrationPage.expectVerificationEmailSentSuccessfully();
    });

    let confirmationLink = '';

    await test.step('Read verification email', async () => {

      const message = await waitForMessage(mailAccount, {
        timeoutMs: 120000,
        intervalMs: 5000,
      });

      const body = await getMessageBody(
        mailAccount,
        message.id
      );

      console.log('EMAIL BODY:', body);
      confirmationLink = extractConfirmationLink(body);
      console.log(
        'Confirmation URL:',
        confirmationLink
      );

    });

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

    await test.step('Finish registration', async () => {
      await stepTwoPage.confirmInDialog();
      await stepTwoPage.submit();
      await stepTwoPage.expectRegistrationSuccess();
    });
  });


  test('TC_REG_002 - empty required fields block registration', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    await test.step('Open Registration and submit with everything empty', async () => {
      await registrationPage.open();
      await registrationPage.submit();
    });

    await test.step('Assert validation errors are shown and the form is not accepted', async () => {
      await registrationPage.expectEmailValidationError();
      await expect(page).toHaveURL(/registration/);
    });
  });

  test('TC_REG_003 - password/confirmation mismatch blocks registration', async ({ page }) => {
    const email = generateDynamicEmail('qa');
    const password = generateDynamicPassword();
    const { phoneNumber } = generateDynamicPhoneNumber();
    const registrationPage = new RegistrationPage(page);

    await test.step('Fill Step One with a mismatched confirm-password value', async () => {
      await registrationPage.open();
      await registrationPage.emailInput.fill(email);
      await registrationPage.passwordInput.fill(password);
      await registrationPage.passwordConfirmInput.fill(password + 'X'); // deliberately different
      await registrationPage.phoneNumberInput.fill(phoneNumber);
      await registrationPage.termsCheckbox.check();
    });

    await test.step('Submit and assert a validation error is shown, no verification email triggered', async () => {
      await registrationPage.submit();
      await registrationPage.expectPasswordValidationError();
      await expect(page).toHaveURL(/registration/);
    });
  });
});