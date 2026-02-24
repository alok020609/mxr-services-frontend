#!/bin/bash

# Setup script to create .env file from example

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🚀 Setting up environment variables..."

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists."
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 0
    fi
fi

# Copy .env.example to .env
if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "❌ .env.example file not found!"
    exit 1
fi

# Prompt for API URL
echo ""
echo "📝 Please configure your backend API URL:"
read -p "Enter your API base URL (default: http://localhost:3000/api/v1): " api_url
api_url=${api_url:-http://localhost:3000/api/v1}

# Update .env file with API URL
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$api_url|" .env
else
    # Linux
    sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$api_url|" .env
fi

echo "✅ Updated VITE_API_BASE_URL to: $api_url"
echo ""
echo "✨ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review and update .env file with your configuration"
echo "   2. Run 'npm install' to install dependencies"
echo "   3. Run 'npm run dev' to start development server"
echo ""

