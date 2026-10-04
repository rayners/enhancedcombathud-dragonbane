# EnhancedCombatHUD-Dragonbane

An implementation of the Argon - Combat HUD for the Dragonbane system in Foundry VTT. This module is an extension of [Argon Combat HUD](https://github.com/theripper93/enhancedcombathud) and requires the Argon - Combat HUD (CORE) module to function.

## Development Context

For comprehensive development standards and patterns, see:

- [Development Context Reference](dev-context/README.md)

Specific areas:

- Development workflow: [dev-context/foundry-development-practices.md](dev-context/foundry-development-practices.md)
- Testing standards: [dev-context/testing-practices.md](dev-context/testing-practices.md)
- Architecture patterns: [dev-context/module-architecture-patterns.md](dev-context/module-architecture-patterns.md)
- Documentation standards: [dev-context/documentation-standards.md](dev-context/documentation-standards.md)
- Automation infrastructure: [dev-context/automation-infrastructure.md](dev-context/automation-infrastructure.md)

**⚠️ CRITICAL**: Always read [dev-context/ai-code-access-restrictions.md](dev-context/ai-code-access-restrictions.md) first to understand strict security boundaries around FoundryVTT proprietary code.

## Overview

This module provides a specialized Combat HUD (Heads-Up Display) for the Dragonbane RPG system in Foundry VTT. It extends the core Argon Combat HUD framework to provide Dragonbane-specific functionality, including:

- Character portrait with HP and WP displays
- Actions panel with weapon attacks, spells, healing, and rallying
- Defense panel with dodge and parry options
- Movement controls
- Weapon sets management
- Rest mechanics
- Heroic abilities integration
- Support for characters, NPCs, and monsters

## Foundry VTT v14 Compatibility

Version 14.4.0 adds support for Foundry VTT v14 with the following changes:

1. **Updated Module Manifest**:

   - Updated compatibility to `{ minimum: "14", verified: "14", maximum: "14" }`
   - Updated compatibility requirements for Argon Combat HUD CORE (v5.0.1+)

2. **Updated Dependencies**:

   - Bumped `@league-of-foundry-developers/foundry-vtt-types` to the v14 beta line (off the ancient `^9.280.0` pin)
   - Removed the unused `@typhonjs-fvtt/runtime` dependency
   - `tsconfig.json` now requires `"moduleResolution": "Bundler"`

3. **Dragonbane System ApplicationV2 Actor Sheets**:

   - The Dragonbane system's actor sheets moved from `ActorSheet` (V1) to `HandlebarsApplicationMixin(ActorSheetV2)`, changing action-handler signatures from `(event)` to `(event, target)`. All direct sheet-method calls this module makes (e.g. `_onSkillRoll` for spellcasting) were updated to pass a target element accordingly.

4. **Installation for v14**:
   - Update to Foundry VTT v14
   - Update Argon Combat HUD (CORE) to version 5.0.1 or later
   - Update the Dragonbane system to v4.1.1+ (`v14` branch)
   - Update EnhancedCombatHUD-Dragonbane to version 14.4.0
   - Run `npm install` to install new dependencies
   - Run `npm run build` to build the module

See the `MIGRATION-V14.md` file for more detailed information about the v14 update (and `MIGRATION-V13.md` for the prior v13 update).

## Project Structure

The project is structured as a Foundry VTT module with the following organization:

```
enhancedcombathud-dragonbane/
├── dist/               # Build output directory
├── docs/               # Documentation assets (screenshots)
├── src/                # Source code
│   ├── icons/          # Custom icons
│   ├── languages/      # Localization files
│   ├── styles/         # SCSS stylesheets
│   ├── ts/             # TypeScript implementation
│   └── module.json     # Module manifest
├── .git/               # Git repository
├── .github/            # GitHub configuration
├── LICENSE             # MIT License
├── README.md           # Basic project info
├── package.json        # NPM package configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build configuration
```

### Core Files

- **module.ts**: The entry point that initializes the module and sets up hooks.
- **dragonbaneui.ts**: Defines the overall HUD layout and component structure.
- **settings.ts**: Registers module settings in Foundry VTT.

### Component Files

The UI is divided into specialized components:

- **dragonbane-actions-panel.ts**: Main actions panel with weapons, spells, and abilities.
- **dragonbane-defense-panel.ts**: Defense options (parry, dodge).
- **dragonbane-drawer-panel.ts**: Expandable drawer with character information.
- **dragonbane-dying-panel.ts**: Controls for dying characters.
- **dragonbane-movement-hud.ts**: Movement controls.
- **dragonbane-portrait-panel.ts**: Character portrait with vital statistics.
- **dragonbane-rest-hud.ts**: Rest mechanics implementation.
- **dragonbane-spells-button.ts**: Implementation of spell casting interface.
- **dragonbane-weapon-button.ts**: Implementation of weapon attacks.
- **dragonbane-weapon-sets.ts**: Management of weapon sets.

## Setup and Building

1. **Prerequisites**:

   - Node.js and npm
   - Foundry VTT
   - Argon - Combat HUD (CORE) module
   - Dragonbane system

2. **Installation**:

   - Clone the repository
   - Run `npm install` to install dependencies

3. **Building**:

   - Run `npm run build` to compile TypeScript and build the module
   - The compiled module will be in the `dist/` directory

4. **Development**:
   - The project uses TypeScript for type safety
   - Vite is used for building and bundling
   - SCSS is used for styling

## Module Configuration

The module provides several configuration options in Foundry VTT settings:

- **Include Unprepared Spells**: Choose whether to show unprepared spells in the spell list
- **Group Spells by Rank**: Organize spells by their rank in the spell panel
- **Prefer Shield for Parry**: Prioritize shields when selecting a weapon for parry actions
- **Skill Mappings**: Configure which Dragonbane skills to use for First Aid, Rally, and Dodge actions

## Creating and Extending Components

When creating new components, follow these patterns:

1. **Extending Base Classes**:

   - Extend the appropriate Argon HUD base class:
     - `ARGON.MAIN.ActionPanel` for main panels
     - `ARGON.MAIN.BUTTONS.ActionButton` for action buttons
     - `ARGON.MAIN.BUTTONS.ItemButton` for item-based buttons

2. **Button Implementation**:

   - Override `classes` to provide Dragonbane-specific styling
   - Override `label` to set the button text
   - Override `icon` to set the button icon
   - Implement `_onLeftClick` to handle button activation

3. **Panel Implementation**:

   - Override `classes` for Dragonbane-specific styling
   - Override `label` for panel title
   - Implement `_getButtons` to populate the panel with buttons

4. **Tooltip Support**:
   - Set `hasTooltip` to `true` to enable tooltips
   - Implement `getTooltipData` to populate tooltip content

## Localization

The module supports multiple languages:

- English (en.json)
- Swedish (sv.json)

Use the localization system by referencing keys with:

```javascript
game.i18n.localize("enhancedcombathud-dragonbane.key.path");
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Development Standards

This project follows universal FoundryVTT development standards documented in the `dev-context/` directory. Key standards include:

### Quality Requirements (ALWAYS ENFORCED)

- **Documentation Accuracy**: All claims must be verifiable in code
- **No Hyperbole**: Avoid "works with all systems", "fully tested", etc.
- **Version References**: Use generic, verifiable version references
- **Date Accuracy**: Always use `date` command for accurate timestamps

### Testing Standards

- **Core Business Logic**: 90%+ test coverage required
- **TDD Workflow**: Tests before implementation for new features
- **Test Command**: Use `npm test` or `npm run test:run` (NEVER `npm run test:workspaces`)
- **Quality Gates**: 100% test pass rate before releases

### Pre-Commit Checklist

Before committing, always run:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

### Communication Standards

- Provide honest, unvarnished technical assessments
- Don't inflate the significance of incremental improvements
- Call maintenance work what it is rather than overselling it
- Apply realistic evaluation standards to features, releases, and technical decisions

## Argon Combat HUD Integration

This module extends the Argon Combat HUD framework. Key integration patterns:

### Component Extension

- Extend appropriate Argon base classes (`ARGON.MAIN.ActionPanel`, `ARGON.MAIN.BUTTONS.ActionButton`, etc.)
- Override `classes`, `label`, and `icon` for Dragonbane-specific customization
- Implement appropriate click handlers and tooltip support

### Dragonbane System Integration

- This module is tightly coupled to the Dragonbane system
- Unlike other modules in the portfolio, this is NOT system-agnostic
- All functionality assumes Dragonbane-specific data structures and APIs

### Design Considerations

- **Hard Dependency**: Requires both Argon Combat HUD (CORE) and Dragonbane system
- **Foundry v14**: Version 14.4.0+ supports Foundry VTT v14
- **Extension Pattern**: Builds upon Argon's architecture rather than replacing it

## Credits

Includes icons from https://game-icons.net
