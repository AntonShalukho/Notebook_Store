import { chromium } from "@playwright/test";
import { Timeout } from "./utils/enums";
import { login } from "./utils/login";
import { baseUrl, globalSetupReportPath, storagePath } from "./utils/constants";

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