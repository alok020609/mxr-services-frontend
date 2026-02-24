# Setup script to create .env file from example (Windows PowerShell)

$ErrorActionPreference = "Stop"

# Script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Set-Location $ProjectRoot

Write-Host "🚀 Setting up environment variables..." -ForegroundColor Cyan

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit 0
    }
}

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
Write-Host ""
Write-Host "✨ Environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Review and update .env file with your configuration" -ForegroundColor White
Write-Host "   2. Run 'npm install' to install dependencies" -ForegroundColor White
Write-Host "   3. Run 'npm run dev' to start development server" -ForegroundColor White
Write-Host ""

