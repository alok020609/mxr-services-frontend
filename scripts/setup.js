#!/usr/bin/env node

/**
 * Complete setup script for Ecommerce Frontend
 * Cross-platform Node.js script that automates the entire installation and setup process
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.yellow}${msg}${colors.reset}`),
};

async function main() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║     Ecommerce Frontend - Complete Setup Script           ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const projectRoot = process.cwd();

  // Step 1: Check prerequisites
  log.step('📋 Step 1: Checking prerequisites...');
  try {
    const nodeVersion = execSync('node -v', { encoding: 'utf-8' }).trim();
    const npmVersion = execSync('npm -v', { encoding: 'utf-8' }).trim();
    log.success(`Node.js version: ${nodeVersion}`);
    log.success(`npm version: ${npmVersion}`);
  } catch (error) {
    log.error('Node.js or npm is not installed. Please install Node.js first.');
    process.exit(1);
  }

  // Step 2: Install dependencies
  log.step('📦 Step 2: Installing dependencies...');
  try {
    if (!fs.existsSync(path.join(projectRoot, 'node_modules'))) {
      log.info('Installing npm packages (this may take a few minutes)...');
      execSync('npm install', { stdio: 'inherit' });
      log.success('Dependencies installed successfully');
    } else {
      log.warning('node_modules directory exists. Running npm install to update...');
      execSync('npm install', { stdio: 'inherit' });
      log.success('Dependencies updated');
    }
  } catch (error) {
    log.error('Failed to install dependencies');
    process.exit(1);
  }

  // Step 3: Set up environment variables
  log.step('⚙️  Step 3: Setting up environment variables...');
  const envPath = path.join(projectRoot, '.env');
  const envExamplePath = path.join(projectRoot, '.env.example');

  let skipEnv = false;
  if (fs.existsSync(envPath)) {
    log.warning('.env file already exists.');
    const response = await question('Do you want to overwrite it? (y/N): ');
    if (response.toLowerCase() !== 'y') {
      log.info('Keeping existing .env file');
      skipEnv = true;
    }
  }

  if (!skipEnv) {
    if (!fs.existsSync(envExamplePath)) {
      log.error('.env.example file not found!');
      process.exit(1);
    }

    // Copy .env.example to .env
    fs.copyFileSync(envExamplePath, envPath);
    log.success('Created .env file from .env.example');

    // Read .env content
    let envContent = fs.readFileSync(envPath, 'utf-8');

    // Prompt for API URL
    console.log(`\n${colors.cyan}📝 Please configure your backend API URL:${colors.reset}`);
    const defaultApiUrl = 'http://localhost:3000/api/v1';
    const apiUrl = await question(`Enter your API base URL (default: ${defaultApiUrl}): `) || defaultApiUrl;
    envContent = envContent.replace(/VITE_API_BASE_URL=.*/, `VITE_API_BASE_URL=${apiUrl}`);
    log.success(`Updated VITE_API_BASE_URL to: ${apiUrl}`);

    // Optional: Additional configuration
    console.log(`\n${colors.cyan}📝 Optional: Configure additional settings?${colors.reset}`);
    const configureMore = await question('Do you want to configure app name, currency, etc.? (y/N): ');
    if (configureMore.toLowerCase() === 'y') {
      const appName = await question('App Name (default: Ecommerce Store): ') || 'Ecommerce Store';
      envContent = envContent.replace(/VITE_APP_NAME=.*/, `VITE_APP_NAME=${appName}`);

      const currency = await question('Default Currency (default: USD): ') || 'USD';
      envContent = envContent.replace(/VITE_DEFAULT_CURRENCY=.*/, `VITE_DEFAULT_CURRENCY=${currency}`);

      log.success('Additional settings configured');
    }

    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
  }

  // Step 4: Type checking (optional)
  log.step('🔍 Step 4: Running type check...');
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
    log.success('Type check passed');
  } catch (error) {
    log.warning('Type check found some issues (non-blocking)');
  }

  // Step 5: Summary
  console.log(`\n${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║                    Setup Complete!                        ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  log.success('All setup steps completed successfully!\n');
  console.log(`${colors.blue}📋 Next steps:${colors.reset}`);
  console.log(`   ${colors.green}1.${colors.reset} Review your .env file: ${colors.yellow}cat .env${colors.reset} (or ${colors.yellow}type .env${colors.reset} on Windows)`);
  console.log(`   ${colors.green}2.${colors.reset} Start development server: ${colors.yellow}npm run dev${colors.reset}`);
  console.log(`   ${colors.green}3.${colors.reset} Build for production: ${colors.yellow}npm run build${colors.reset}`);
  console.log(`   ${colors.green}4.${colors.reset} Preview production build: ${colors.yellow}npm run preview${colors.reset}\n`);
  console.log(`${colors.blue}💡 Tip:${colors.reset} You can edit .env file anytime to change configuration\n`);

  // Optional: Start dev server
  const startDev = await question('Do you want to start the development server now? (y/N): ');
  if (startDev.toLowerCase() === 'y') {
    console.log(`\n${colors.green}🚀 Starting development server...${colors.reset}`);
    console.log(`${colors.blue}Press Ctrl+C to stop the server${colors.reset}\n`);
    execSync('npm run dev', { stdio: 'inherit' });
  }

  rl.close();
}

main().catch((error) => {
  log.error(`Setup failed: ${error.message}`);
  rl.close();
  process.exit(1);
});

