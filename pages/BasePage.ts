import { Page } from '@playwright/test';


export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async reload() {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  async currentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}
