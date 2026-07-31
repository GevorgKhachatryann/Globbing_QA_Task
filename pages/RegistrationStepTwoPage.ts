import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegistrationSelectors } from '../data/selectors';


export class RegistrationStepTwoPage extends BasePage {
  readonly physicalPersonOption: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly serviceCenterSelect: Locator;
  readonly submitButton: Locator;
  readonly confirmDialogSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    const s = RegistrationSelectors.stepTwo;
    this.physicalPersonOption = page.locator(s.physicalPersonOption);
    this.firstNameInput = page.locator(s.firstNameInput);
    this.lastNameInput = page.locator(s.lastNameInput);
    this.serviceCenterSelect = page.locator(s.serviceCenterSelect);
    this.submitButton = page.getByRole('button', { name: /submit/i }).or(page.locator(s.submitButton));
    this.confirmDialogSubmitButton = page.locator(s.confirmDialogSubmitButton);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/register\/step-two/);
  }

  async selectPhysicalPerson() {
    await this.physicalPersonOption.click();
  }

  async fillNames(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  
async selectServiceCenter() {
  await this.serviceCenterSelect.click();
}

  async submit() {
    await this.submitButton.click();
  }

  async confirmInDialog() {
    await expect(this.confirmDialogSubmitButton).toBeVisible({ timeout: 5_000 });
    await this.confirmDialogSubmitButton.click();
  }

  async expectRegistrationSuccess() {
    await expect(this.page).toHaveURL(/\/thank-you\/?$/, { timeout: 10_000 });
  }
}
