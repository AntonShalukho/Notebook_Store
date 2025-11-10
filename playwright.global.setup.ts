import { chromium } from "@playwright/test";
import { Timeout } from "./utils/enums";
import { login } from "./utils/login";
import { baseUrl, globalSetupReportPath, storagePath } from "./utils/constants";
import fs from 'fs/promises';
import path from 'path';

async function globalSetup() {
  const browser = await chromium.launch({
    headless: process.env.SHOW_BROWSER ? false : true,
    timeout: Timeout.SIXTY,
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    baseURL: baseUrl
  });

  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });
  
  try {
    const page = await context.newPage();

    await login(page)

    await page.context().storageState({
      path: storagePath,
    });

    const csrfToken = await page.getAttribute('meta[name="csrf-token"]', 'content');
    if (!csrfToken) {
      throw new Error("CSRF-token wasn't be found after authorization");
    }

    const storageState = await page.context().storageState();

    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    await fs.writeFile(
      storagePath,
      JSON.stringify({ ...storageState, csrfToken }, null, 2),
      'utf-8'
    );
  } catch{
    await context.tracing.stop({
      path: globalSetupReportPath,
    });
  } finally {
    await context.tracing.stop();
    await browser.close();
  }
}

export default globalSetup