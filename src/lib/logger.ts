import fs from 'fs';
import path from 'path';

const LOG_DIR = process.cwd();
const INSTALL_LOG_PATH = path.join(LOG_DIR, 'install.log');
const ERROR_LOG_PATH = path.join(LOG_DIR, 'error.log');

export function logInstallEvent(message: string): void {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [INSTALL] ${message}\n`;
  try {
    fs.appendFileSync(INSTALL_LOG_PATH, line, 'utf8');
  } catch (e) {
    console.error('Failed to write to install.log:', e);
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
    console.error('Failed to write to error.log:', e);
  }
}
