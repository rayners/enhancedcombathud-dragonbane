# Migration Guide: Foundry VTT v13 Compatibility

This document outlines the changes made to make EnhancedCombatHUD-Dragonbane compatible with Foundry VTT v13.

## Changes Made

1. **Updated Module Manifest**:

   - Changed compatibility to support Foundry v13
   - Updated version to 0.11.0
   - Specified required version of Argon Combat HUD (CORE)

2. **Updated Dependencies**:

   - Added v13 TypeScript type definitions for Foundry VTT
   - Updated tsconfig.json to include new type definitions

3. **API Compatibility**:
   - Reviewed and updated code to ensure compatibility with Foundry v13 API changes
   - Ensured compatibility with the latest Argon Combat HUD CORE module

## For Users

1. **Installation**:

   - Update to Foundry VTT v13
   - Update Argon Combat HUD (CORE) to version 1.5.0 or later
   - Update EnhancedCombatHUD-Dragonbane to version 0.11.0

2. **Known Issues**:
   - If you encounter any issues with the update, please report them on our [GitHub issues page](https://github.com/rayners/enhancedcombathud-dragonbane/issues)

## For Developers

If you're working with this module or extending it, please note:

- Review the updated type definitions for Foundry v13
- Test your extensions thoroughly with Foundry v13
- Check for any changes in the Argon Combat HUD API

## Technical Details

### TypeScript Configuration

The module now uses the existing Foundry types with the addition of the TyphonJS runtime for enhanced Foundry v13 support:

```json
"devDependencies": {
  "@league-of-foundry-developers/foundry-vtt-types": "^9.280.0",
  "@typhonjs-fvtt/runtime": "^0.1.0"
}
```

### Module Requirements

The module now requires:

- Foundry VTT v11-v13
- Argon Combat HUD (CORE) v1.5.0 or higher
- Dragonbane system (latest version recommended)
