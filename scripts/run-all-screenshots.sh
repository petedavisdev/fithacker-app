#!/bin/bash

# Generate App Store screenshots for all locales using Maestro (iOS only).
#
# Usage:
#   bash scripts/run-all-screenshots.sh [locale] [--ipad|--all-devices] [--all-locales]
#   bash scripts/run-all-screenshots.sh --resume-from de --ipad --all-locales
#   bash scripts/run-all-screenshots.sh --check-only [--ipad|--all-devices]
#
# Prerequisites: Java, Maestro CLI, Metro running (npm start), app built.

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
LOCALES=("en" "de" "es" "fr" "it" "ja" "ko" "pt" "zh")
DATE_FOLDER=$(date +%Y-%m-%d)
IPHONE_SIMULATOR="iPhone 15 Pro"
IPAD_SIMULATOR="iPad Pro 13-inch (M4)"
APP_PATH="ios/build/Build/Products/Debug-iphonesimulator/Fithacker.app"
OUTPUT_BASE="docs/screenshots-${DATE_FOLDER}"
FLOW=".maestro/flows/screenshot-all.yaml"

# Track failures
FAILED_LOCALES=()

get_apple_locale() {
  case "$1" in
    de) echo "de_DE" ;; en) echo "en_US" ;; es) echo "es_ES" ;;
    fr) echo "fr_FR" ;; it) echo "it_IT" ;; ja) echo "ja_JP" ;;
    ko) echo "ko_KR" ;; pt) echo "pt_BR" ;; zh) echo "zh_CN" ;;
    *) echo "en_US" ;;
  esac
}

check_prerequisites() {
  echo -e "${BOLD}Checking prerequisites...${NC}"
  local ok=true

  echo -n "  Java: "
  if command -v java &>/dev/null; then echo -e "${GREEN}OK${NC}"; else echo -e "${RED}missing${NC} (brew install --cask temurin)"; ok=false; fi

  echo -n "  Maestro: "
  if command -v maestro &>/dev/null; then echo -e "${GREEN}OK${NC}"; else echo -e "${RED}missing${NC} (curl -Ls 'https://get.maestro.mobile.dev' | bash)"; ok=false; fi

  echo -n "  Metro: "
  if nc -z localhost 8081 2>/dev/null; then echo -e "${GREEN}OK${NC}"; else echo -e "${RED}not running${NC} (npm start)"; ok=false; fi

  echo -n "  App build: "
  if [ -d "$APP_PATH" ]; then echo -e "${GREEN}OK${NC}"; else echo -e "${RED}not found${NC} ($APP_PATH)"; ok=false; fi

  [ "$ok" = false ] && exit 1
}

ensure_simulator() {
  local simulator_name=$1
  local booted_name
  booted_name=$(xcrun simctl list devices booted | grep "Booted" | head -1 || true)

  if [[ "$booted_name" == *"$simulator_name"* ]]; then
    echo -e "  Simulator: ${GREEN}$simulator_name (already booted)${NC}"
  else
    echo -e "  Simulator: ${YELLOW}booting $simulator_name...${NC}"
    xcrun simctl shutdown all 2>/dev/null || true
    xcrun simctl boot "$simulator_name" || { echo -e "${RED}Failed to boot $simulator_name${NC}"; exit 1; }
    open -a Simulator
    sleep 2
  fi

  xcrun simctl install booted "$APP_PATH"
}

apply_locale() {
  local locale=$1
  local udid
  udid=$(xcrun simctl list devices booted | grep -oE '[A-F0-9-]{36}' | head -1)
  [ -z "$udid" ] && return

  local apple_locale
  apple_locale=$(get_apple_locale "$locale")
  xcrun simctl spawn "$udid" defaults write "Apple Global Domain" AppleLanguages -array "$locale"
  xcrun simctl spawn "$udid" defaults write "Apple Global Domain" AppleLocale -string "$apple_locale"
  xcrun simctl terminate "$udid" dev.petedavis.fithacker 2>/dev/null || true
  sleep 1
}

run_locale() {
  local locale=$1
  local device_type=$2
  local index=$3
  local total=$4
  local output_dir="${OUTPUT_BASE}/${device_type}"
  local start_time=$SECONDS

  echo ""
  echo -e "${BOLD}[${index}/${total}] ${locale} (${device_type})${NC}"

  apply_locale "$locale"

  if maestro test -e "LOCALE=$locale" -e "OUTPUT_DIR=$output_dir" "$FLOW" 2>&1; then
    local elapsed=$(( SECONDS - start_time ))
    echo -e "${GREEN}  ✓ ${locale} done (${elapsed}s) → ${locale}1.png–${locale}5.png${NC}"
  else
    local elapsed=$(( SECONDS - start_time ))
    echo -e "${RED}  ✗ ${locale} failed after ${elapsed}s${NC}"
    FAILED_LOCALES+=("$locale")
  fi
}

# --- Main ---
main() {
  local locale="en"
  local run_iphone=false
  local run_ipad=false
  local all_locales=false
  local check_only=false
  local resume_from=""

  while [[ $# -gt 0 ]]; do
    case $1 in
      --all-locales)  all_locales=true; shift ;;
      --resume-from)  resume_from="$2"; shift 2 ;;
      --check-only)   check_only=true; shift ;;
      --ipad)         run_ipad=true; shift ;;
      --all-devices)  run_iphone=true; run_ipad=true; shift ;;
      *)              [[ "$1" =~ ^[a-z]{2}$ ]] && locale=$1; shift ;;
    esac
  done

  # Default: iPhone only
  [ "$run_iphone" = false ] && [ "$run_ipad" = false ] && run_iphone=true

  echo -e "${BOLD}=== FitHacker Screenshots ===${NC}"
  echo -e "  Output: ${OUTPUT_BASE}/"
  [ "$all_locales" = true ] && echo -e "  Locales: ${LOCALES[*]}" || echo -e "  Locale: $locale"
  [ "$run_iphone" = true ] && echo -n "  iPhone" && [ "$run_ipad" = true ] && echo -n " + iPad" || true
  [ "$run_iphone" = false ] && [ "$run_ipad" = true ] && echo -n "  iPad"
  echo ""
  [ -n "$resume_from" ] && echo -e "  ${YELLOW}Resuming from: $resume_from${NC}"
  echo ""

  check_prerequisites

  if [ "$check_only" = true ]; then
    [ "$run_iphone" = true ] && ensure_simulator "$IPHONE_SIMULATOR"
    [ "$run_ipad" = true ] && ensure_simulator "$IPAD_SIMULATOR"
    echo -e "\n${GREEN}All checks passed.${NC}"
    exit 0
  fi

  mkdir -p "${OUTPUT_BASE}/iPhone" "${OUTPUT_BASE}/iPad"

  run_all_locales() {
    local device_type=$1
    local i=0
    local total=${#LOCALES[@]}
    local skipping=false
    [ -n "$resume_from" ] && skipping=true

    for l in "${LOCALES[@]}"; do
      i=$((i + 1))
      if [ "$skipping" = true ]; then
        if [[ "$l" == "$resume_from" ]]; then
          skipping=false
        else
          echo -e "  ${YELLOW}skip ${l}${NC}"
          continue
        fi
      fi
      run_locale "$l" "$device_type" "$i" "$total"
    done
  }

  local total_start=$SECONDS

  if [ "$run_iphone" = true ]; then
    echo -e "\n${BOLD}--- iPhone ---${NC}"
    ensure_simulator "$IPHONE_SIMULATOR"
    if [ "$all_locales" = true ]; then
      run_all_locales "iPhone"
    else
      run_locale "$locale" "iPhone" "1" "1"
    fi
  fi

  if [ "$run_ipad" = true ]; then
    echo -e "\n${BOLD}--- iPad ---${NC}"
    ensure_simulator "$IPAD_SIMULATOR"
    if [ "$all_locales" = true ]; then
      run_all_locales "iPad"
    else
      run_locale "$locale" "iPad" "1" "1"
    fi
  fi

  local total_elapsed=$(( SECONDS - total_start ))
  local total_min=$(( total_elapsed / 60 ))
  local total_sec=$(( total_elapsed % 60 ))

  echo ""
  echo -e "${BOLD}=== Done (${total_min}m ${total_sec}s) ===${NC}"

  if [ ${#FAILED_LOCALES[@]} -gt 0 ]; then
    echo -e "${RED}Failed: ${FAILED_LOCALES[*]}${NC}"
    echo -e "Re-run with: ${YELLOW}bash scripts/run-all-screenshots.sh --resume-from ${FAILED_LOCALES[0]} [--ipad] --all-locales${NC}"
    exit 1
  else
    echo -e "${GREEN}All screenshots captured successfully.${NC}"
  fi
}

main "$@"
