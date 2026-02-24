#!/usr/bin/env node

/**
 * Setup script to create .env file from example
 * Cross-platform Node.js script
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
};

async function main() {
  console.log(`${colors.cyan}🚀 Setting up environment variables...${colors.reset}\n`);

  const projectRoot = process.cwd();
  const envPath = path.join(projectRoot, '.env');
  const envExamplePath = path.join(projectRoot, '.env.example');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    log.warning('.env file already exists.');
    const response = await question('Do you want to overwrite it? (y/N): ');
    if (response.toLowerCase() !== 'y') {
      log.error('Setup cancelled.');
      rl.close();
      return;
    }
  }

  // Copy .env.example to .env
  if (!fs.existsSync(envExamplePath)) {
    log.error('.env.example file not found!');
    rl.close();
    process.exit(1);
  }

  fs.copyFileSync(envExamplePath, envPath);
  log.success('Created .env file from .env.example');

  // Prompt for API URL
  console.log(`\n${colors.cyan}📝 Please configure your backend API URL:${colors.reset}`);
  const defaultApiUrl = 'http://localhost:3000/api/v1';
  const apiUrl = await question(`Enter your API base URL (default: ${defaultApiUrl}): `) || defaultApiUrl;

  // Update .env file with API URL
  let envContent = fs.readFileSync(envPath, 'utf-8');
  envContent = envContent.replace(/VITE_API_BASE_URL=.*/, `VITE_API_BASE_URL=${apiUrl}`);
  fs.writeFileSync(envPath, envContent);

  log.success(`Updated VITE_API_BASE_URL to: ${apiUrl}`);
  console.log(`\n${colors.green}✨ Environment setup complete!${colors.reset}\n`);
  console.log(`${colors.cyan}📋 Next steps:${colors.reset}`);
  console.log('   1. Review and update .env file with your configuration');
  console.log('   2. Run \'npm install\' to install dependencies');
  console.log('   3. Run \'npm run dev\' to start development server\n');

  rl.close();
}

main().catch((error) => {
  log.error(`Setup failed: ${error.message}`);
  rl.close();
  process.exit(1);
});

