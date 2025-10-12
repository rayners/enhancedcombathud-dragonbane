#!/bin/bash
# Update script for EnhancedCombatHUD-Dragonbane v0.11.0 (Foundry v13 compatibility)

# Install dependencies
echo "Installing updated dependencies..."
npm install --save-dev @typhonjs-fvtt/runtime@^0.1.0

# Build the module
echo "Building module..."
npm run build

echo "Update complete! The module is now compatible with Foundry VTT v13."
echo "Please check the MIGRATION-V13.md file for more information."
