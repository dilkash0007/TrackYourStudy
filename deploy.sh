#!/bin/bash

echo "🚀 Preparing TrackYouStudy app for deployment..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null
then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Make sure everything is committed
echo "Checking git status..."
if [[ $(git status --porcelain) ]]; then
    echo "❗️ You have uncommitted changes. Please commit before deploying."
    echo "Run the following commands:"
    echo "git add ."
    echo "git commit -m \"Ready for deployment\""
    exit 1
fi

# Build the project
echo "Building project..."
npm run build

# Verify build succeeded
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete! Your app should be live now."
echo "Check your Vercel dashboard for the live URL." 