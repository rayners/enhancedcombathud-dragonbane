# Argon - Combat HUD (DRAGONBANE)

[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Drayners%26type%3Dpatrons&style=flat)](https://patreon.com/rayners)

Enhance your Dragonbane gameplay experience with a streamlined combat interface designed specifically for Dragonbane's unique mechanics!

This module provides a specialized Combat HUD (Heads-Up Display) for the Dragonbane RPG system in Foundry VTT, making combat more intuitive and faster for both players and Game Masters.

## Features

- **Intuitive Combat Interface** - All combat actions available at a glance
- **Character Portrait** - With HP and WP displays prominently featured
- **Actions Panel** - Quick access to weapon attacks, spells, healing, and rallying
- **Defense Options** - Easily execute dodge and parry maneuvers
- **Movement Controls** - Manage character movement during combat
- **Weapon Sets** - Switch between different weapon configurations with ease
- **Rest Mechanics** - Manage stretch and shift rest with dedicated buttons
- **Support for All Character Types** - Works with player characters, NPCs, and monsters
- **Heroic Abilities Integration** - Quick access to your character's special abilities

![Combat HUD in action](https://raw.githubusercontent.com/rayners/enhancedcombathud-dragonbane/main/docs/screenshot.png)

## System Requirements

- Foundry VTT v11-v13
- [Argon Combat HUD (CORE)](https://foundryvtt.com/packages/enhancedcombathud/) v1.5.0+
- [Dragonbane](https://foundryvtt.com/packages/dragonbane/) system

## Installation

1. In your Foundry VTT setup screen, go to the "Add-on Modules" tab
2. Click "Install Module"
3. In the "Manifest URL" field, paste: 
   ```
   https://github.com/rayners/enhancedcombathud-dragonbane/releases/latest/download/module.json
   ```
4. Click "Install"

## Setup

1. After installing, enable the module in your game world
2. Make sure the Argon Combat HUD (CORE) module is also enabled
3. The HUD will automatically appear when you select a token in combat

## Configuration Options

The module provides several settings to customize your experience:

- **Include Unprepared Spells** - Choose whether to display unprepared spells in the spell list
- **Group Spells by Rank** - Organize spells by their rank in the spell panel
- **Prefer Shield for Parry** - Prioritize shields when selecting a weapon for parry actions
- **Skill Mappings** - Configure which Dragonbane skills to use for First Aid, Rally, and Dodge actions

To access these settings, go to Game Settings → Module Settings → Argon - Combat HUD (DRAGONBANE).

## Languages

This module supports:
- English
- Swedish

## Support

If you encounter any issues or have suggestions, please file them on our [GitHub issues page](https://github.com/rayners/enhancedcombathud-dragonbane/issues).

## Credits

Developed by [David Raynes](https://github.com/rayners)  
Includes icons from [game-icons.net](https://game-icons.net)