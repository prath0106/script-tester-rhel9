#!/bin/bash

# A single script to install Python, Git, Node.js, and Docker on RHEL 9.
# This script must be run with root privileges (e.g., using sudo).

# --- Check for Root Privileges ---
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: This script must be run as root. Please use 'sudo'."
  exit 1
fi

echo "🚀 Starting installation of Developer Tools (Python, Git, Node.js, Docker)..."
echo "----------------------------------------------------------------"

# --- 1. Update System Packages ---
echo "🔄 Updating all system packages. This may take a few minutes..."
dnf update -y
echo "✅ System packages are up to date."
echo "----------------------------------------------------------------"

# --- 2. Install Git ---
echo "➡️ Installing Git..."
dnf install -y git
echo "✅ Git installed successfully."
echo "----------------------------------------------------------------"

# --- 3. Install Python 3.11 ---
echo "➡️ Installing Python 3.11..."
dnf install -y python3.11
echo "✅ Python 3.11 installed successfully."
echo "----------------------------------------------------------------"

# --- 4. Install Node.js 20 ---
echo "➡️ Installing Node.js 20..."
# Enable the Node.js 20 application stream
dnf module enable -y nodejs:20
# Install Node.js
dnf install -y nodejs
echo "✅ Node.js 20 installed successfully."
echo "----------------------------------------------------------------"

# --- 5. Install Docker ---
echo "➡️ Installing Docker Engine..."
# Install packages needed to manage repositories
dnf install -y dnf-utils
# Add Docker's official repository for CentOS (which is compatible)
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# Install Docker Engine, CLI, and other components
dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
# Start the Docker service
systemctl start docker
# Enable Docker to start automatically on system boot
systemctl enable docker
echo "✅ Docker installed and service has been started."
echo "----------------------------------------------------------------"

# --- 6. Verification ---
echo "🔍 Verifying all installations..."
echo ""
echo "--- Installed Versions ---"
git --version
python3.11 --version
node --version
npm --version
docker --version
echo "--------------------------"
echo ""

# --- Final Instructions ---
echo "🎉 All tools have been installed successfully!"
echo "💡 IMPORTANT: To run Docker commands without 'sudo', you must add your user to the 'docker' group."
echo "   Run the following command (replacing 'your_username' if needed):"
echo "   sudo usermod -aG docker \$USER"
echo "   After running it, you must LOG OUT and LOG BACK IN for the changes to take effect."