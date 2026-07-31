import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegistrationSelectors } from '../data/selectors';
import { env } from '../utils/env';


export class RegistrationPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorMessageEmailInput: Locator;
  readonly errorMessagePasswords: Locator;

  constructor(page: Page) {
    super(page);
    const s = RegistrationSelectors.stepOne;
    this.emailInput = page.getByPlaceholder('Էլ. հասցե*');
    this.passwordInput = page.getByPlaceholder('Գաղտնաբառ*');
    this.passwordConfirmInput = page.getByPlaceholder('Կրկնել գաղտնաբառը*');
    this.phoneNumberInput = page.getByPlaceholder('Հեռախոսահամար');
    this.submitButton = page.getByRole('button', {name: 'Գրանցվել'});
    this.termsCheckbox = page.locator(s.termsCheckbox);
    this.errorMessageEmailInput = page.locator(s.errorMessageEmailInput);
    this.errorMessagePasswords = page.locator(s.errorMessagePasswords);
  }

  async open() {
    await this.goto(`https://am.globbing.com/hy/registration/`);
        // await this.goto(`${env.baseUrl}/en/register/`);
  }

  async fillStepOne(params: { email: string; password: string; phoneNumber: string }) {
    await this.emailInput.fill(params.email);
    await this.passwordInput.fill(params.password);
    await this.passwordConfirmInput.fill(params.password);
    await this.phoneNumberInput.fill(params.phoneNumber);
    await this.termsCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectVerificationEmailSentSuccessfully() {
    await expect(this.page).toHaveURL(/\/success\/?$/);
  }

  async expectEmailValidationError() {  
    await expect(this.errorMessageEmailInput).toBeVisible();
  }

  async expectPasswordValidationError() {
    await expect(this.errorMessagePasswords).toContainText('Գաղտնաբառերը չեն համընկնում');
  }
}
