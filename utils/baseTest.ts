import { PlaywrightTestArgs, PlaywrightTestOptions, test as base } from "@playwright/test";
import { chance as baseChance, setupGlobalChance } from "./chance";
import { Chance } from 'chance';

/**
 * @description Fixtures types
 */
export type TestFixtures = {
  chance: Chance.Chance
};

export type SofiFixture = PlaywrightTestArgs & PlaywrightTestOptions & TestFixtures;

/**
 * @description To have ability to use fixtures in case test data required in test execution
 */
const test = base.extend<TestFixtures & { globalChanceFixture: void }>({
  // globalChanceFixture: [
  //   async ({}, use) => {
  //     setupGlobalChance();
  //     await use();
  //   },
  //   { scope: 'test', auto: true },
  // ],

  chance: ({}, use) => {
    use(baseChance)
  }
});

test.afterEach(async ({ page }) => {
  await page.close();
});

export { test };