import { Page } from "@playwright/test";
import { ShopPageObject } from "./shope.pageobject";

export class GoodsTablePageObject extends ShopPageObject {
  constructor(page: Page) {
    super(page)
  }


}