
import { GoodsTablePageObject } from "../pages/goodsTable.pageobject";
import { test } from "../utils/baseTest";

test.describe('Shopping cart test', () => {
  let goodsTablePageObject: GoodsTablePageObject
  test.beforeEach(async ({ page }) => {
    goodsTablePageObject = new GoodsTablePageObject(page)

    await goodsTablePageObject.goto();

    await goodsTablePageObject.validateUserAuthorized();
  })

  test.only('Go to empty cart', async ({ chance, page }) => {
    const name = chance.name();
// await page.pause()
    await goodsTablePageObject.validateUserAuthorized();
  })

  test('Go to cart with 1 non-promotional item', async () => {

  })

  test('Go to cart with 1 promotional item', async () => {

  })

  test('Go to cart with 9 different items', async () => {

  })

  test('Go to cart with 9 promotional items of the same name', async () => {

  })
})