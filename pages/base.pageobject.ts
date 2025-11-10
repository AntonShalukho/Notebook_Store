import { Page } from "@playwright/test";

export class BasePageObject {
  constructor(protected page: Page) {}
}