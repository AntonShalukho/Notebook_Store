import { PlaywrightTestArgs, PlaywrightTestOptions, test as base } from "@playwright/test";
import { chance as baseChance } from "./chance";
import { pathNames, storagePath } from "./constants";
import fs from 'fs/promises';

/**
 * @description Fixtures types
 */
export type TestFixtures = {
  chance: Chance.Chance,
  clearBasket: () => Promise<void>
};

export type SofiFixture = PlaywrightTestArgs & PlaywrightTestOptions & TestFixtures;

/**
 * @description To have ability to use fixtures in case test data required in test execution
 */
const test = base.extend<TestFixtures & { globalChanceFixture: void }>({
  chance: ({}, use) => {
    use(baseChance)
  },

  clearBasket: async ({page}, use) => {
    async function clear() {
      const raw = await fs.readFile(storagePath, 'utf-8');
      const storageState = JSON.parse(raw) as any;
      const csrfToken = storageState.csrfToken as string;
      const cookies = storageState.cookies || [];

      if (!csrfToken) throw new Error('CSRF-token has not been found in storage');


      const cookieHeader = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

      const response = await page.request.post(pathNames.clear, {
        headers: {
          cookie: cookieHeader,
          'x-csrf-token': csrfToken,
        },
        data: { response: true },
      });

      if (response.status() !== 200) {
        const body = await response.text();
        throw new Error(`Clear basket has been failed (status ${response.status()}): ${body}`);
      }
    };

    await use(clear)
  }
});

test.afterEach(async ({ page }) => {
  await page.close();
});

export { test };