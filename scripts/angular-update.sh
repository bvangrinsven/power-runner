#!/bin/bash
set -e

echo "============================================"
echo "  PowerRunner: Angular 12 -> 17 Migration"
echo "============================================"
echo ""
echo "This script updates Angular CLI and core packages through"
echo "major versions: 12 -> 13 -> 14 -> 15 -> 16 -> 17"
echo ""
echo "Make sure you have already run 'yarn install' to get"
echo "Angular CLI 17 on disk before running this script."
echo ""
echo "If something goes wrong, run: git reset --hard HEAD"
echo ""
read -p "Press Enter to continue (or Ctrl+C to cancel)..."

echo ""
echo "Updating Angular 12 -> 13..."
npx ng update @angular/core@13 @angular/cli@13 --allow-dirty --force

echo ""
echo "Updating Angular 13 -> 14..."
npx ng update @angular/core@14 @angular/cli@14 --allow-dirty --force

echo ""
echo "Updating Angular 14 -> 15..."
npx ng update @angular/core@15 @angular/cli@15 --allow-dirty --force

echo ""
echo "Updating Angular 15 -> 16..."
npx ng update @angular/core@16 @angular/cli@16 --allow-dirty --force

echo ""
echo "Updating Angular 16 -> 17..."
npx ng update @angular/core@17 @angular/cli@17 --allow-dirty --force

echo ""
echo "Updating Angular Material to 17..."
npx ng update @angular/material@17 --allow-dirty --force

echo ""
echo "============================================"
echo "  Angular 12 -> 17 update complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Fix deprecated API usage (see README-ANGULAR-UPDATE.md)"
echo "  2. Run: npx ng build --configuration production"
echo "  3. Run: npx ng test --browsers=ChromeHeadless --watch=false"
echo ""
