import { expect, Page } from "@playwright/test";
import { pathNames } from "./constants";
import { BaseSelectors } from "../selectors/BaseSelectors";

class Selectors extends BaseSelectors {
  static readonly username = '#loginform-username';
  static readonly password = '#loginform-password';
}

export const login = async (page: Page) => {
  await page.goto(pathNames.login);

  const loginButton = page.locator(Selectors.submitButton);

  await expect(loginButton).toBeDisabled()

  await page.locator(Selectors.username).pressSequentially(process.env.USERNAME);
  await page.locator(Selectors.password).pressSequentially(process.env.PASSWORD);

  await expect(loginButton).toBeEnabled()
  await loginButton.click();

  await expect(page.locator(Selectors.avatar)).toBeVisible()
}