# Migration Guide: Foundry VTT v14 Compatibility

This document outlines the changes made to make EnhancedCombatHUD-Dragonbane compatible with Foundry VTT v14.

## Changes Made

1. **Updated Module Manifest**:

   - Changed compatibility to `{ minimum: "14", verified: "14", maximum: "14" }`
   - Added minimum versions to `relationships`: Argon Combat HUD (CORE) 5.0.1 and the Dragonbane system 4.1.1
   - Module versions now follow `<Foundry major>.<Dragonbane major>.<module release>` (this release is 14.4.0). The version is set by release-please, so don't edit it by hand.

2. **Updated Dependencies**:

   - Bumped `@league-of-foundry-developers/foundry-vtt-types` from the ancient `^9.280.0` pin to the v14 beta line (`14.366.0-beta.20260825144710`) - these types are only published as beta prereleases, so the beta line is the current release. The version is pinned exactly to match Foundry v14 build 366
   - Updated `tsconfig.json`'s `moduleResolution` from `Node` to `Bundler`, which the new type package requires to resolve its subpath `imports`/`exports` maps correctly
   - Removed the unused `@typhonjs-fvtt/runtime` devDependency (it was never actually imported anywhere in `src/` or `test/`)

3. **API Compatibility - Dragonbane System's ApplicationV2 Actor Sheets**:

   - The Dragonbane system (v4.1.1, `v14` branch) migrated its actor sheets from the legacy `ActorSheet` (V1) to `HandlebarsApplicationMixin(ActorSheetV2)`. As part of that migration, its action-handler methods changed signature from `(event)` to `(event, target)`, where `target` is the specific clicked `HTMLElement` (previously read off `event.currentTarget`).
   - This module calls several of those sheet methods directly (`_onSkillRoll`, `_onMonsterAttack`, `_onMonsterDefend`, `_onDeathRoll`, `_onAttributeRoll`, `_onRestRound`, `_onRestStretch`, `_onRestShift`) to trigger rolls from custom HUD buttons, since it can't rely on the system's own DOM click delegation.
   - **Confirmed bug fixed**: `DragonbaneSpellButton._onLeftClick` (`src/ts/dragonbane-spells-button.ts`) called `_onSkillRoll` with only one argument. The v14 `_onSkillRoll(event, target)` does `target.closest(".sheet-table-data").dataset.itemId` unconditionally - with no second argument, `target` was `undefined`, throwing `TypeError: Cannot read properties of undefined (reading 'closest')` any time a player tried to cast a spell or use a magic trick from the HUD. Fixed by passing `this.element` (which already carries the `sheet-table-data` class and `data-item-id`, set in `_renderInner`) as the second argument.
   - **Defensive alignment**: all the other sheet-method call sites listed above were also updated to pass their button's own root element (`this.element`) as a second argument, even where the v14 system doesn't currently read it (e.g. `_onRestRound`/`_onRestStretch`/`_onRestShift` only use `event.currentTarget?.blur()`, and `_onMonsterAttack`/`_onMonsterDefend` take a `_target` parameter they don't use). This keeps every call site consistent with the system's real `(event, target)` signature and protects against the system starting to rely on `target` in a future point release. `DragonbaneActorSheet` in `src/ts/enhancedcombathud-dragonbane.d.ts` was updated to declare an optional `target?: HTMLElement` second parameter on each of these methods to match.

4. **TypeScript typing fallout from the type-package bump**:
   - The v14 beta types are far stricter/more precise than the old v9 types. Fixing the resulting ~65 typecheck errors (without weakening `strict`/lint rules) required:
     - Declaring `interface AssumeHookRan { ready: never; }` so `game`/`canvas`/etc. resolve to their fully-initialized ("ready") shapes instead of `T | undefined` everywhere, since this module's code only ever runs after Foundry's `"ready"` hook.
     - Merging `game.dragonbane` and `CONFIG.ARGON` directly into the real global `Game`/`ReadyGame`/`CONFIG` interfaces (interface declaration merging) instead of redeclaring the `game`/`CONFIG` variables with new types - the latter approach was tried first and silently corrupted unrelated type lookups elsewhere in the library (e.g. `game.items` resolved to `unknown`).
     - Declaring `DragonbaneActor extends Actor<any>` / `DragonbaneItem extends Item<any>` instead of the bare (now generic and subtype-branded) `Actor`/`Item` classes, since Dragonbane ships no TS types describing its own Actor/Item subtypes.
     - Adding a `SettingConfig` interface merge (also a global ambient interface) so `game.settings.register`/`.get` accept this module's own setting keys, plus a small `src/ts/module-id.ts` that re-exports `MODULE_NAME` from `module.json` with a literal type (JSON imports otherwise widen to plain `string`, which doesn't satisfy the literal-keyed settings API).
     - A couple of local, explicitly-commented type assertions where the fix would otherwise require type information Dragonbane and Argon Combat HUD (CORE) don't publish at all (e.g. `Hooks.on("argonInit", ...)` - a custom hook fired by an untyped third-party module).

## For Users

1. **Installation**:

   - Update to Foundry VTT v14
   - Update Argon Combat HUD (CORE) to version 5.0.1 or later (min/verified/max 14)
   - Update the Dragonbane system to a v14-compatible release (v4.1.1+, `v14` branch)
   - Update EnhancedCombatHUD-Dragonbane to version 14.4.0

2. **Known Issues**:
   - If you encounter any issues with the update, please report them on our [GitHub issues page](https://github.com/rayners/enhancedcombathud-dragonbane/issues)

## For Developers

If you're working with this module or extending it, please note:

- `tsconfig.json` now requires `"moduleResolution": "Bundler"` for `foundry-vtt-types` to resolve correctly - do not revert this to `"Node"`.
- `foundry-vtt-types` is only published as beta prereleases, so the pinned beta is the expected state, not a stopgap. The pin is exact on purpose: newer betas can change types and break typecheck, so review bumps (including Dependabot's) by running `npm run typecheck` before merging.
- Any new call into a Dragonbane `ActorSheet` method should pass `(event, target)` per the system's `ActorSheetV2` action-handler convention, and should have its signature added to `DragonbaneActorSheet` in `src/ts/enhancedcombathud-dragonbane.d.ts`.
- Test your extensions thoroughly with Foundry v14 and the current Dragonbane `v14` branch.

## Technical Details

### TypeScript Configuration

```json
"devDependencies": {
  "@league-of-foundry-developers/foundry-vtt-types": "14.366.0-beta.20260825144710"
}
```

```json
"compilerOptions": {
  "moduleResolution": "Bundler"
}
```

### Module Requirements

The module now requires:

- Foundry VTT v14
- Argon Combat HUD (CORE) v5.0.1 or higher
- Dragonbane system v4.1.1+ (`v14` branch)
