#!/bin/bash

# Complete setup script for Ecommerce Frontend
# This script automates the entire installation and setup process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Ecommerce Frontend - Complete Setup Script           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check Node.js and npm
echo -e "${YELLOW}📋 Step 1: Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm version: $NPM_VERSION${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages (this may take a few minutes)..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules directory exists. Running npm install to update...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies updated${NC}"
fi
echo ""

# Step 3: Set up environment variables
echo -e "${YELLOW}⚙️  Step 3: Setting up environment variables...${NC}"

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists.${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}ℹ️  Keeping existing .env file${NC}"
        SKIP_ENV=true
    else
        SKIP_ENV=false
    fi
else
    SKIP_ENV=false
fi

if [ "$SKIP_ENV" = false ]; then
    # Copy .env.example to .env
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
    else
        echo -e "${RED}❌ .env.example file not found!${NC}"
        exit 1
    fi

    # Prompt for API URL
    echo ""
    echo -e "${BLUE}📝 Please configure your backend API URL:${NC}"
    DEFAULT_API_URL="http://localhost:3000/api/v1"
    read -p "Enter your API base URL (default: $DEFAULT_API_URL): " api_url
    api_url=${api_url:-$DEFAULT_API_URL}

    # Update .env file with API URL
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$api_url|" .env
    else
        # Linux
        sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$api_url|" .env
    fi

    echo -e "${GREEN}✅ Updated VITE_API_BASE_URL to: $api_url${NC}"
    
    # Optional: Ask about other configurations
    echo ""
    echo -e "${BLUE}📝 Optional: Configure additional settings?${NC}"
    read -p "Do you want to configure app name, currency, etc.? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "App Name (default: MXR Services): " app_name
        app_name=${app_name:-MXR Services}
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|VITE_APP_NAME=.*|VITE_APP_NAME=$app_name|" .env
        else
            sed -i "s|VITE_APP_NAME=.*|VITE_APP_NAME=$app_name|" .env
        fi
        
        read -p "Default Currency (default: USD): " currency
        currency=${currency:-USD}
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|VITE_DEFAULT_CURRENCY=.*|VITE_DEFAULT_CURRENCY=$currency|" .env
        else
            sed -i "s|VITE_DEFAULT_CURRENCY=.*|VITE_DEFAULT_CURRENCY=$currency|" .env
        fi
        
        echo -e "${GREEN}✅ Additional settings configured${NC}"
    fi
fi
echo ""

# Step 4: Type checking (optional)
echo -e "${YELLOW}🔍 Step 4: Running type check...${NC}"
if npm run type-check 2>/dev/null; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Type check found some issues (non-blocking)${NC}"
fi
echo ""

# Step 5: Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Setup Complete!                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ All setup steps completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "   ${GREEN}1.${NC} Review your .env file: ${YELLOW}cat .env${NC}"
echo -e "   ${GREEN}2.${NC} Start development server: ${YELLOW}npm run dev${NC}"
echo -e "   ${GREEN}3.${NC} Build for production: ${YELLOW}npm run build${NC}"
echo -e "   ${GREEN}4.${NC} Preview production build: ${YELLOW}npm run preview${NC}"
echo ""
echo -e "${BLUE}💡 Tip:${NC} You can edit .env file anytime to change configuration"
echo ""

# Optional: Ask if user wants to start dev server
read -p "Do you want to start the development server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}🚀 Starting development server...${NC}"
    echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
    echo ""
    npm run dev
fi

