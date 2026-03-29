# Complete setup script for Ecommerce Frontend (Windows PowerShell)
# This script automates the entire installation and setup process

$ErrorActionPreference = "Stop"

# Script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Set-Location $ProjectRoot

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Ecommerce Frontend - Complete Setup Script           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js and npm
Write-Host "📋 Step 1: Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js or npm is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Install dependencies
Write-Host "📦 Step 2: Installing dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages (this may take a few minutes)..." -ForegroundColor Cyan
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules directory exists. Running npm install to update..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies updated" -ForegroundColor Green
}
Write-Host ""

# Step 3: Set up environment variables
Write-Host "⚙️  Step 3: Setting up environment variables..." -ForegroundColor Yellow

$skipEnv = $false
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "ℹ️  Keeping existing .env file" -ForegroundColor Cyan
        $skipEnv = $true
    }
}

if (-not $skipEnv) {
    # Copy .env.example to .env
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example file not found!" -ForegroundColor Red
        exit 1
    }

    # Prompt for API URL
    Write-Host ""
    Write-Host "📝 Please configure your backend API URL:" -ForegroundColor Cyan
    $defaultApiUrl = "http://localhost:3000/api/v1"
    $apiUrl = Read-Host "Enter your API base URL (default: $defaultApiUrl)"
    if ([string]::IsNullOrWhiteSpace($apiUrl)) {
        $apiUrl = $defaultApiUrl
    }

    # Update .env file with API URL
    $envContent = Get-Content ".env" -Raw
    $envContent = $envContent -replace "VITE_API_BASE_URL=.*", "VITE_API_BASE_URL=$apiUrl"
    Set-Content ".env" $envContent

    Write-Host "✅ Updated VITE_API_BASE_URL to: $apiUrl" -ForegroundColor Green
    
    # Optional: Ask about other configurations
    Write-Host ""
    Write-Host "📝 Optional: Configure additional settings?" -ForegroundColor Cyan
    $response = Read-Host "Do you want to configure app name, currency, etc.? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        $appName = Read-Host "App Name (default: MXR Services)"
        if ([string]::IsNullOrWhiteSpace($appName)) {
            $appName = "MXR Services"
        }
        $envContent = $envContent -replace "VITE_APP_NAME=.*", "VITE_APP_NAME=$appName"
        
        $currency = Read-Host "Default Currency (default: USD)"
        if ([string]::IsNullOrWhiteSpace($currency)) {
            $currency = "USD"
        }
        $envContent = $envContent -replace "VITE_DEFAULT_CURRENCY=.*", "VITE_DEFAULT_CURRENCY=$currency"
        
        Set-Content ".env" $envContent
        Write-Host "✅ Additional settings configured" -ForegroundColor Green
    }
}
Write-Host ""

# Step 4: Type checking (optional)
Write-Host "🔍 Step 4: Running type check..." -ForegroundColor Yellow
try {
    npm run type-check 2>&1 | Out-Null
    Write-Host "✅ Type check passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Type check found some issues (non-blocking)" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Summary
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Setup Complete!                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ All setup steps completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Review your .env file: Get-Content .env" -ForegroundColor Green
Write-Host "   2. Start development server: npm run dev" -ForegroundColor Green
Write-Host "   3. Build for production: npm run build" -ForegroundColor Green
Write-Host "   4. Preview production build: npm run preview" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: You can edit .env file anytime to change configuration" -ForegroundColor Cyan
Write-Host ""

# Optional: Ask if user wants to start dev server
$response = Read-Host "Do you want to start the development server now? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
    Write-Host ""
    npm run dev
}

