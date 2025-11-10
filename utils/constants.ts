import path from 'path';

export const pathNames = {
  login: 'https://enotes.pointschool.ru/login',
  clear: 'https://enotes.pointschool.ru/basket/clear',
}

export const baseUrl = 'https://enotes.pointschool.ru';
export const storagePath = path.join(process.cwd(), '.auth', 'user.json');
export const testReportPath = path.join(process.cwd(), 'playwright-report', 'html');
export const junitReportPath = path.join(process.cwd(), 'playwright-report', 'junit', 'results.xml');
export const globalSetupReportPath = path.join(process.cwd(), 'playwright-report', 'globalSetup', 'trace-login.zip');
