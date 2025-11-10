import { expect, Locator, Page } from "@playwright/test";
import { ShopPageObject } from "./shope.pageobject";
import { chance } from "../utils/chance";
import { BaseSelectors } from "../selectors/BaseSelectors";
import { ItemDataType, ItemStuffDataType } from "../utils/types";
import { ItemTypes } from "../utils/enums";
import { onlyNumbersRegExp } from "../utils/regexps";

class Selectors extends BaseSelectors {
  static readonly basketCounter = '.basket-count-items';
  static readonly pageItem = '.page-item ';
  static readonly noteItem = '.note-list .note-item';
  static readonly discountNoteItem = '.note-list .note-item.hasDiscount';
  static readonly discountClass = '.hasDiscount';
  static readonly notDiscountNoteItems = "//div[contains(@class, 'note-item') and not(contains(@class, 'hasDiscount'))]";
  static readonly discountNoteItems = "//div[contains(@class, 'note-item') and (contains(@class, 'hasDiscount'))]";
  static readonly buyButton = '.actionBuyProduct';
  static readonly basketDropdown = '//li[@id="basketContainer"]/div[contains(@class, "dropdown-menu")]';
  static readonly basketDropdownButton = 'a[role="button"]';
  static readonly basketDropdownItem = `//li[@id="basketContainer"]/div[contains(@class, 'dropdown-menu')]/ul/li[contains(@class, 'basket-item')]`;
  static readonly basketDropdownItemTitle = `//li[@id="basketContainer"]/div[contains(@class, 'dropdown-menu')]/ul/li[contains(@class, 'basket-item')]/span[@class='basket-item-title']`;
  static readonly itemTitle = '.product_name';
  static readonly itemPrice = '.product_price';
  static readonly itemType = '.product_type';
  static readonly basketItemTitle = '.basket-item-title';
  static readonly basketItemPrice = '.basket-item-price';
  static readonly basketCommonPrice = '.basket_price';
}

export class GoodsTablePageObject extends ShopPageObject {
  constructor(page: Page) {
    super(page)
  }

  private async validateBasketCounter(count: number) {
    const counterTextContent = await this.page.locator(Selectors.basketCounter).textContent();

    if(!Number(counterTextContent) && Number(counterTextContent) !== 0) {
      throw new Error('validateEmptyBasketCounter: text content is not a number')
    }

    expect(Number(counterTextContent)).toBe(count);
  }

  public async validateEmptyBasketCounter() {
    await this.validateBasketCounter(0);
  }

  public async validateBasketCounterHasGoods(count: number) {
    await this.page.locator(Selectors.basketCounter, { has: this.page.getByText( String(count), { exact: true })}).waitFor();
    await this.validateBasketCounter(count);
  }

  public async isBasketCounterHasCount(count: number): Promise<boolean> {
    await this.page.locator(Selectors.basketCounter, { has: this.page.getByText( String(count), { exact: true })}).waitFor();
    const counterTextContent = await this.page.locator(Selectors.basketCounter).textContent();

    if(!Number(counterTextContent) && Number(counterTextContent) !== 0) {
      throw new Error('validateEmptyBasketCounter: text content is not a number')
    }

    return count === Number(counterTextContent)
  }

  public async clickOnBasketDropdown() {
    await this.page.locator(Selectors.basket).click();
  }

  private async getItem(itemSelector: string, options?: { random: boolean }): Promise<Locator> {
    const locatorList = await this.page.locator(itemSelector).all()

    if(locatorList.length === 0) {
      throw new Error('getNonPromotionalItem/getPromotionalItem: no non promotional items in the table')
    }

    if(options?.random) {
      return chance.pickone(locatorList)
    }

    return locatorList[0]
  }

  public async getNonPromotionalItem(options?: { random: boolean }): Promise<Locator> {
    return this.getItem(Selectors.notDiscountNoteItems, options)
  }

  public async getPromotionalItem(options?: { random: boolean }): Promise<Locator> {
    return this.getItem(Selectors.discountNoteItems, options)
  }

  public async addToBasket(item: Locator) {
    await item.locator(Selectors.buyButton).click();
  }

  public async validateBasketDropdownIsOpened() {
    const locator =this.page.locator(Selectors.basketDropdown);

    await expect(locator).toBeVisible();
    await expect(locator).toContainClass('show');
  }

  public async validateBasketDropdownItemCount(count: number) {
    const itemsList = await this.page.locator(Selectors.basketDropdownItem).all();

    expect(itemsList).toHaveLength(count)
  }

  public async getBasketDropdownItems(): Promise<Locator[]> {
    return await this.page.locator(Selectors.basketDropdownItemTitle).all();
  }

  private prettifyBasketItemPrice(price: string): number {
    return parseInt(price.replace(onlyNumbersRegExp, ''), 10);
  }

  public async getBasketDropdownItem(title: string): Promise<ItemDataType> {
    const basketItem = this.page.locator(Selectors.basketDropdownItem)
      .filter({
        has: this.page.locator(Selectors.basketItemTitle).getByText(title, { exact: true })
      })

      
    const itemPrice = await basketItem.locator(Selectors.basketItemPrice).textContent();

    if(itemPrice === null) {
      throw new Error(' basket item price should be a string')
    }

    return {
      title,
      price: this.prettifyBasketItemPrice(itemPrice)
    }
  }

  public async getCommonPrice(): Promise<number> {
    const commonPrice = await this.page.locator(Selectors.basketCommonPrice).textContent();

    return Number(commonPrice)
  }

  public async validateBasketDropdownItem(title: string, price: number) {
    const item = this.page.locator(Selectors.basketDropdownItem).filter({
        has: this.page.locator(Selectors.basketItemTitle).getByText(title, { exact: true })
      });

    await expect(item).toBeVisible();

    const itemTitle = await item.locator(Selectors.basketItemTitle).textContent()
    const itemPrice = await item.locator(Selectors.basketItemPrice).textContent();

    if(!itemPrice || !itemTitle) {
      throw new Error(' basket item price and title should be a string')
    }

    expect(itemTitle).toEqual(title)
    expect(this.prettifyBasketItemPrice(itemPrice)).toEqual(price)
  }

  public async validateBasketDropdownCommonPrice(price: number) {
    const commonPrice = await this.page.locator(Selectors.basketCommonPrice).textContent();

    expect(Number(commonPrice)).toEqual(price)
  }

  public async clickOpenBasketButton() {
    await this.page.locator(Selectors.basketDropdown)
      .locator(Selectors.basketDropdownButton)
      .getByText('Перейти в корзину', { exact: true })
      .click(); 
  }

  public async getItemData(locator: Locator): Promise<ItemDataType> {
    const title = await locator.locator(Selectors.itemTitle).textContent();
    const price = await locator.locator(Selectors.itemPrice).textContent();

    if(!title || !price) {
      throw new Error('Title and price should be a string')
    }

    return {
      title,
      price: Number(price.split(' р.')[0])
    }
  }

  private async addToBasketItems(count: number, itemLocator: Locator, itemType?: keyof typeof ItemTypes): Promise<ItemStuffDataType> {
    const itemList: ItemDataType[] = [];
    const pageList = await this.page.locator(Selectors.pageItem).all();

    for (const page of pageList) {
      await page.click();

      await expect(page).toContainClass('active');
      await this.page.waitForSelector(Selectors.productPoster);

      /**
       * Slow down the test since the system doesn't re-render so fast and bring an error with existing items in basket
       */
      await this.page.waitForTimeout(400)

      /**
       * Since 500 error if add 9 items in basket I've configured test to have 8 items in basket and takes not more then 4 items from each page 
       */
      // const items = await this.page.locator(Selectors.noteItem).all();
      const items = (await itemLocator.all()).slice(0, 4);

      for( const item of items) {
        if(itemList.length >= count) {
          return {list: itemList}
        }

        const data = await this.getItemData(item);

        itemList.push(data)

        await this.addToBasket(item);

        /**
         * Slow down the test since the system doesn't re-render so fast and bring an error with existing items in basket
         */
        await this.page.waitForTimeout(200)
      }
    }

    return {list: itemList, itemType }
  }

  public async addToBasketItemStuff(itemCount: number): Promise<ItemStuffDataType> {
    return await this.addToBasketItems(itemCount, this.page.locator(Selectors.noteItem))
  }

  public async validateBasketDropdownItems(items:  Array<ItemDataType>) {
    for(const item of items) {
      await this.validateBasketDropdownItem(item.title, item.price);
    }
  }

  public calculateCommonPrice(items:  Array<ItemDataType>): number {
    let count: number = 0;

    for(const item of items) {
      count += item.price
    }

    return count
  }

  public async addToBasketPromotionalStuff(count: number, itemType: keyof typeof ItemTypes): Promise<ItemStuffDataType> {
    const locator = this.page.locator(Selectors.discountNoteItem)
      .filter({
        has: this.page.locator(Selectors.itemType).getByText(ItemTypes[itemType], { exact: true })
      })

    return await this.addToBasketItems(count, locator, itemType)
  }
}
