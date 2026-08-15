import fs from 'fs';
import path from 'path';

// Primary installation directory
const PRIMARY_BASE_DIR = 'C:\\Mangesh\\Jules\\GayatriPortal';

function getBaseDir(): string {
  if (process.env.STORE_BASE_PATH) {
    return process.env.STORE_BASE_PATH;
  }
  try {
    if (!fs.existsSync(PRIMARY_BASE_DIR)) {
      fs.mkdirSync(PRIMARY_BASE_DIR, { recursive: true });
    }
    return PRIMARY_BASE_DIR;
  } catch (e) {
    return process.cwd();
  }
}

const BASE_DIR = getBaseDir();
const INSTALL_LOG_PATH = path.join(BASE_DIR, 'install.log');
const ERROR_LOG_PATH = path.join(BASE_DIR, 'error.log');

export function logInstallEvent(message: string): void {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [INSTALL] ${message}\n`;
  try {
    fs.appendFileSync(INSTALL_LOG_PATH, line, 'utf8');
  } catch (e) {
    // Local fallback
    try {
      fs.appendFileSync(path.join(process.cwd(), 'install.log'), line, 'utf8');
    } catch (err) {}
  }
}

export function logErrorEvent(message: string, error?: any): void {
  const timestamp = new Date().toISOString();
  const errorDetails = error ? (error.stack || JSON.stringify(error)) : '';
  const line = `[${timestamp}] [ERROR] ${message} ${errorDetails}\n`;
  try {
    fs.appendFileSync(ERROR_LOG_PATH, line, 'utf8');
    fs.appendFileSync(INSTALL_LOG_PATH, line, 'utf8');
  } catch (e) {
    try {
      fs.appendFileSync(path.join(process.cwd(), 'error.log'), line, 'utf8');
    } catch (err) {}
  }
}
