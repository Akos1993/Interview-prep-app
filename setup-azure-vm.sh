#!/bin/bash

# --- SYSTEM SETUP FOR AZURE VM ---
# Target OS: Ubuntu 20.04 LTS / 22.04 LTS / 24.04 LTS
# This script provisions Node.js, builds the app, and mounts the server on background PM2.

set -e

# Formatting utilities
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Interview Calibration Azure VM Auto-Setup ===${NC}"
echo -e "${YELLOW}[1/5] Updating package cache and installing prerequisites...${NC}"
sudo apt-get update -y
sudo apt-get install -y curl git build-essential

echo -e "${YELLOW}[2/5] Installing Node.js v20 (LTS) via NodeSource...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
echo -e "${GREEN}✓ Node version: $(node -v)${NC}"
echo -e "${GREEN}✓ NPM version:  $(npm -v)${NC}"

echo -e "${YELLOW}[3/5] Installing PM2 process manager globally...${NC}"
sudo npm install -g pm2

echo -e "${YELLOW}[4/5] Installing project dependencies and compiling production build...${NC}"
# Navigate to script folder location if run inside the directory
cd "$(dirname "$0")"

npm install

echo -e "${YELLOW}Building static elements & bundlers...${NC}"
npm run build

echo -e "${YELLOW}[5/5] Launching interview background service under PM2...${NC}"
# Delete existing instance if it was already running to prevent overlap crash
pm2 delete interview-calibrator 2>/dev/null || true

# Start Node process under PM2
pm2 start dist/server.cjs --name "interview-calibrator" --env PORT=3000

# Set up PM2 system boot resurrection
echo -e "${YELLOW}Configuring startup services...${NC}"
pm2 save

echo -e "${GREEN}=======================================================${NC}"
echo -e "${GREEN}🚀 PRODUCTION CALIBRATION SERVER INSTALLED SUCCESSFULLY!${NC}"
echo -e "${GREEN}=======================================================${NC}"
echo -e "Your web service is active on background port: ${BLUE}3000${NC}"
echo -e ""
echo -e "${YELLOW}👉 IMPORTANT AZURE VM NETWORKING STEP:${NC}"
echo -e "An Azure VM is shielded by standard Microsoft Firewalls. To access the site,"
echo -e "you must open inbound ingress port 3000 in your Network Security Group (NSG):"
echo -e "  1. Open Azure Portal and go to your Virtual Machine."
echo -e "  2. Click 'Networking' under the Settings menu."
echo -e "  3. Click 'Add inbound port rule'."
echo -e "  4. Set Destination Port Ranges to: 3000"
echo -e "  5. Set Protocol to: TCP"
echo -e "  6. Set Action to: Allow"
echo -e "  7. Click 'Add'."
echo -e "  8. Open http://<YOUR_AZURE_VM_PUBLIC_IP>:3000 in your browser!"
echo -e ""
echo -e "${BLUE}To monitor logs, run:                ${NC} pm2 logs interview-calibrator"
echo -e "${BLUE}To view status dashboard, run:       ${NC} pm2 status"
echo -e "${BLUE}To restart the server manually, run:  ${NC} pm2 restart interview-calibrator"
echo -e "${GREEN}=======================================================${NC}"
