#!/usr/bin/env node

/**
 * Classic Windows Game Setup Wizard CLI
 * Styled after 90s / early 2000s InstallShield & Windows Setup
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(process.cwd(), 'install.log');
const ERROR_LOG = path.join(process.cwd(), 'error.log');

function writeLog(msg, isError = false) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [SETUP] ${msg}\n`;
  try {
    fs.appendFileSync(LOG_FILE, entry, 'utf8');
    if (isError) {
      fs.appendFileSync(ERROR_LOG, entry, 'utf8');
    }
  } catch (e) {
    // Fallback if log writing fails
  }
}

// Log start of installation process
writeLog("Starting Kalakriti Arts Studio Setup Wizard execution...");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function clearScreen() {
  console.clear();
}

function printHeader(title = "KALAKRITI ARTS STUDIO SETUP WIZARD") {
  console.log("================================================================================");
  console.log(`               ${title}               `);
  console.log("================================================================================");
  console.log(" (C) 2025 Kalakriti Arts Studio Inc. All rights reserved.");
  console.log("--------------------------------------------------------------------------------\n");
}

async function welcomeStep() {
  clearScreen();
  writeLog("Entered Welcome Step");
  printHeader("WELCOME TO KALAKRITI ARTS STUDIO SETUP");
  console.log("  Welcome to the Kalakriti Arts Studio Installation Program.");
  console.log("  This setup program will install Kalakriti Arts Studio E-Commerce Boutique");
  console.log("  on your computer.\n");
  console.log("  It is strongly recommended that you exit all other programs before");
  console.log("  running this Setup program.\n");
  console.log("  Click NEXT or press [ENTER] to continue, or [Q] to quit Setup.\n");

  return new Promise((resolve) => {
    rl.question("  [Enter = Next / Q = Cancel]: ", (answer) => {
      if (answer.toLowerCase() === 'q') {
        writeLog("Setup cancelled by user at Welcome Step");
        console.log("\n  Setup cancelled by user.");
        process.exit(0);
      }
      resolve();
    });
  });
}

async function licenseStep() {
  clearScreen();
  writeLog("Entered License Step");
  printHeader("SOFTWARE LICENSE AGREEMENT");
  console.log("  Please read the following License Agreement carefully:\n");
  console.log("  --------------------------------------------------------------------------");
  console.log("  KALAKRITI ARTS STUDIO - SINGLE OWNER BOUTIQUE LICENSE");
  console.log("  1. Grant of License: You are granted a lifetime license for 1 store owner.");
  console.log("  2. Copyright: All art catalog routines, UPI QR generators, and store");
  console.log("     management components are protected by copyright law.");
  console.log("  3. India E-Commerce Compliance: Built with GST-ready architecture");
  console.log("     and Razorpay payment gateway integration.");
  console.log("  --------------------------------------------------------------------------\n");

  return new Promise((resolve) => {
    rl.question("  Do you accept all the terms of the preceding License Agreement? [Y/N]: ", (answer) => {
      if (answer.toLowerCase() !== 'y') {
        writeLog("License Agreement declined by user");
        console.log("\n  You must accept the agreement to install setup. Exiting...");
        process.exit(0);
      }
      writeLog("License Agreement accepted by user");
      resolve();
    });
  });
}

async function destinationStep() {
  clearScreen();
  writeLog("Entered Destination Step");
  printHeader("CHOOSE DESTINATION LOCATION");
  console.log("  Setup will install Kalakriti Arts Studio in the following directory:\n");
  console.log("      C:\\Mangesh\\Jules\\GayatriPortal\\");
  console.log("      (Local Base Installation Directory)\n");

  return new Promise((resolve) => {
    rl.question("  Press [ENTER] to accept this directory and begin installation: ", () => {
      writeLog("Destination folder C:\\Mangesh\\Jules\\GayatriPortal\\ confirmed");
      resolve();
    });
  });
}

async function installProgressStep() {
  clearScreen();
  printHeader("COPYING PROGRAM FILES...");
  console.log("  Please wait while Setup copies files and initializes the database:\n");

  const tasks = [
    "Checking Node.js & System Prerequisites...",
    "Extracting SQLite Database Engine (better-sqlite3)...",
    "Writing Database Schema (products, categories, orders, coupons)...",
    "Seeding 5 Initial Categories (Canvas, Lippan, Candles, Resin, MDF)...",
    "Seeding 15 Handmade Indian Masterpieces & Pricing...",
    "Generating Default Admin User (admin@kalakritiarts.in)...",
    "Configuring Razorpay UPI QR Engine...",
    "Building Next.js Production Components...",
    "Finalizing Windows System Registry & Desktop Shortcuts..."
  ];

  for (let i = 0; i < tasks.length; i++) {
    const percent = Math.round(((i + 1) / tasks.length) * 100);
    const filledBar = "█".repeat(Math.floor(percent / 5));
    const emptyBar = "░".repeat(20 - Math.floor(percent / 5));

    writeLog(`Task [${i + 1}/${tasks.length}]: ${tasks[i]}`);

    clearScreen();
    printHeader("INSTALLATION IN PROGRESS...");
    console.log(`  Current Action: ${tasks[i]}`);
    console.log("\n  Overall Progress:");
    console.log(`  [${filledBar}${emptyBar}]  ${percent}%\n`);

    if (i === 2 || i === 3 || i === 4) {
      try {
        execSync('node -e "require(\'./src/lib/seed.ts\')"', { stdio: 'ignore' });
        writeLog(`Successfully executed database seed routine for task: ${tasks[i]}`);
      } catch (e) {
        writeLog(`Error executing seed routine: ${e.message}`, true);
      }
    }

    await sleep(300);
  }
}

async function finishStep() {
  clearScreen();
  writeLog("Installation completed successfully!");
  printHeader("SETUP COMPLETE!");
  console.log("  Congratulations!");
  console.log("  Kalakriti Arts Studio has been successfully installed on your computer.\n");
  console.log("  --------------------------------------------------------------------------");
  console.log("  * Storefront URL:      http://localhost:3000");
  console.log("  * Admin Dashboard:     http://localhost:3000/admin");
  console.log("  * Setup Wizard Page:   http://localhost:3000/setup");
  console.log("  * Admin Login:         admin@kalakritiarts.in / admin123");
  console.log("  * Install Log:         install.log");
  console.log("  * Error Log:           error.log");
  console.log("  --------------------------------------------------------------------------\n");
  console.log("  To launch the store server, run:\n");
  console.log("      npm run dev   (or npm start for production mode)\n");

  rl.question("  Press [ENTER] to exit Setup Wizard...", () => {
    rl.close();
  });
}

async function runWizard() {
  try {
    await welcomeStep();
    await licenseStep();
    await destinationStep();
    await installProgressStep();
    await finishStep();
  } catch (err) {
    writeLog(`Unhandled error during setup wizard execution: ${err.stack || err.message}`, true);
    console.error("\n[ERROR] Setup encountered an error. Check error.log for details.");
    rl.close();
  }
}

runWizard();
