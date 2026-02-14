#!/bin/bash

# Script to generate App Store screenshots for all locales and iOS devices using Maestro
# This script loops through locales and iOS devices (iPhone/iPad), sets the simulator locale,
# runs Maestro flows, and organizes screenshots into dated folders.
#
# iOS ONLY - App is not in Play Store, so Android screenshots are not needed.
#
# Prerequisites:
# 1. Install Maestro CLI: curl -Ls "https://get.maestro.mobile.dev" | bash
# 2. Install Java 17+ (required by Maestro): https://www.oracle.com/java/technologies/downloads/
# 3. Build app for simulator:
#    npx expo prebuild --platform ios
#    cd ios && xcodebuild -workspace Fithacker.xcworkspace -scheme Fithacker \
#      -configuration Debug -sdk iphonesimulator -derivedDataPath build
#    xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/Fithacker.app
# 4. Start Metro bundler: npm start (in another terminal - REQUIRED)
# 5. Ensure iOS simulator is booted: xcrun simctl list devices | grep Booted

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
LOCALES=("de" "en" "es" "fr" "it" "ja" "ko" "pt" "zh")
DATE_FOLDER=$(date +%Y-%m-%d)
OUTPUT_BASE="docs/screenshots-${DATE_FOLDER}"

# Maestro flow files (in order: 1-5)
FLOWS=(
  "screenshot-home"
  "screenshot-chart"
  "screenshot-notes"
  "screenshot-filter"
  "screenshot-account"
)

# Function to run all flows for a locale
run_flows_for_locale() {
  local locale=$1
  local device_type=$2
  local output_dir="${OUTPUT_BASE}/${device_type}"
  
  echo -e "${GREEN}Running flows for locale: $locale ($device_type)${NC}"
  
  # Run each flow with environment variables
  for i in "${!FLOWS[@]}"; do
    local flow_name=${FLOWS[$i]}
    local screenshot_num=$((i + 1))
    
    echo -e "${YELLOW}  Running: $flow_name...${NC}"
    
    # Run Maestro with environment variables using -e flag
    maestro test -e LOCALE="$locale" -e OUTPUT_DIR="$output_dir" ".maestro/flows/${flow_name}.yaml" || {
      echo -e "${RED}  Failed: $flow_name${NC}"
      continue
    }
    
    echo -e "${GREEN}  Done: ${locale}${screenshot_num}.png${NC}"
    sleep 1
  done
}

# Function to check prerequisites
check_prerequisites() {
  echo -e "${YELLOW}Checking prerequisites...${NC}"
  
  # Check if Maestro is installed
  if ! command -v maestro &> /dev/null; then
    echo -e "${RED}Error: Maestro CLI is not installed.${NC}"
    echo "Install it with: curl -Ls \"https://get.maestro.mobile.dev\" | bash"
    exit 1
  fi
  echo -e "${GREEN}Maestro CLI found${NC}"
  
  # Check if Metro bundler is running (required for dev builds)
  if ! curl -s http://localhost:8081/status 2>/dev/null | grep -q "packager-status:running"; then
    echo -e "${RED}Error: Metro bundler is not running.${NC}"
    echo "Start it with: npm start (in another terminal)"
    exit 1
  fi
  echo -e "${GREEN}Metro bundler running${NC}"
  
  # Check if a simulator is booted
  if ! xcrun simctl list devices | grep -q "Booted"; then
    echo -e "${RED}Error: No iOS simulator is booted.${NC}"
    echo "Boot one with: xcrun simctl boot \"iPhone 15 Pro\""
    exit 1
  fi
  echo -e "${GREEN}iOS simulator booted${NC}"
}

# Main execution
main() {
  echo -e "${GREEN}=== FitHacker Screenshot Automation ===${NC}"
  echo -e "${YELLOW}Output folder: ${OUTPUT_BASE}${NC}"
  echo ""
  
  check_prerequisites
  
  # Create output directories
  mkdir -p "${OUTPUT_BASE}/iPhone"
  mkdir -p "${OUTPUT_BASE}/iPad"
  
  # For now, just run iPhone screenshots (single locale for testing)
  # Full locale support would require simulator locale changes
  
  if [ "$1" == "--all-locales" ]; then
    echo -e "${YELLOW}Running all locales (requires manual locale changes)${NC}"
    for locale in "${LOCALES[@]}"; do
      echo -e "${GREEN}--- Locale: $locale ---${NC}"
      echo -e "${YELLOW}Please change simulator locale to $locale and press Enter...${NC}"
      read -r
      run_flows_for_locale "$locale" "iPhone"
    done
  else
    # Single locale (current simulator locale)
    local locale="${1:-en}"
    echo -e "${GREEN}Running for locale: $locale${NC}"
    run_flows_for_locale "$locale" "iPhone"
  fi
  
  echo ""
  echo -e "${GREEN}=== Screenshots complete! ===${NC}"
  echo "Output: ${OUTPUT_BASE}/"
  ls -la "${OUTPUT_BASE}/iPhone/"
}

# Run main function with optional locale argument
main "$@"
