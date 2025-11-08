import { expect, Page } from "@playwright/test";
import { BaseSelectors } from "../selectors/BaseSelectors";

class Selectors extends BaseSelectors {

}

export class ShopPageObject {
  constructor(protected page: Page) {}

  public async goto() {
    await this.page.goto('/');
  }

  public async validateUserAuthorized() {
    await expect(this.page.locator(Selectors.avatar)).toBeVisible();
  }
}