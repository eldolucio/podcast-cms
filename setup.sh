#!/bin/bash

# ------------------------------------------------------------
# Super Podcast CMS - Server Installation Setup Script
# ------------------------------------------------------------
# This script automates the preparation of the Super Podcast CMS
# for deployment on a VPS or shared hosting environment.
# It performs the following actions:
#   1. Checks for required commands (git, zip, unzip, npm)
#   2. Installs Node.js dependencies (if any)
#   3. Builds the project (if a build step exists)
#   4. Packages the application into a zip archive for FTP upload
#   5. Optionally pushes the latest code to GitHub
# ------------------------------------------------------------

set -e

# Function to check command existence
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 1. Verify required tools
REQUIRED_CMDS=(git zip unzip)
for cmd in "${REQUIRED_CMDS[@]}"; do
  if ! command_exists "$cmd"; then
    echo "Error: Required command '$cmd' is not installed. Install it and retry."
    exit 1
  fi
done

# Optional: check for npm if you have a build step (e.g., using Vite)
if [ -f "package.json" ]; then
  if ! command_exists npm; then
    echo "Warning: npm not found. Skipping npm install/build steps."
  else
    echo "Installing npm dependencies..."
    npm ci
    if grep -q "" scripts"" package.json; then
      # If a build script exists, run it
      if npm run | grep -q "build"; then
        echo "Running npm build..."
        npm run build
      fi
    fi
  fi
fi

# 2. Create a clean zip package
ZIP_NAME="super-podcast-cms-$(date +%Y%m%d%H%M%S).zip"
echo "Creating archive $ZIP_NAME..."
# Exclude node_modules and .git directories if present
zip -r "$ZIP_NAME" . -x "node_modules/*" "*.git/*" "*.gitignore" "setup.sh"

echo "Archive created successfully."

# 3. Optional: Push to GitHub (requires git remote configured)
read -p "Do you want to push the latest changes to GitHub? (y/N): " push_choice
if [[ "$push_choice" =~ ^[Yy]$ ]]; then
  git add .
  git commit -m "Prepare release $(date +%Y-%m-%d)"
  git push origin main
  echo "Changes pushed to GitHub."
else
  echo "Skipping GitHub push."
fi

echo "Setup completed. Upload $ZIP_NAME to your server via FTP/SFTP or SCP."
