import { expect, Page } from "@playwright/test";
import { BaseSelectors } from "../selectors/BaseSelectors";
import { BasePageObject } from "./base.pageobject";

class Selectors extends BaseSelectors {}

export class ShopPageObject extends BasePageObject {
  constructor(page: Page) {
    super(page)
  }

  public async goto() {
    await this.page.goto('/');
  }

  public async validateUserAuthorized() {
    await expect(this.page.locator(Selectors.avatar)).toBeVisible();
    await expect(this.page.locator(Selectors.basket)).toBeVisible();
  }

  public async waitForPageLoad() {
    await this.page.waitForSelector(Selectors.productPoster);
  }
}