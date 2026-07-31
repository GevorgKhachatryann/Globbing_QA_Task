import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async expectUserIsLoggedIn() {
    await expect(this.page).not.toHaveURL(/\/profile\/?$/);
  }
  
}
