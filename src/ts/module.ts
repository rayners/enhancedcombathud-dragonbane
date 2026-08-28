import "../styles/module.scss";

import { registerSettings, registerSkillSettings } from "./settings";
import { setupDragonbaneHud } from "./dragonbaneui";

Hooks.once("init", () => {
  registerSettings();
  console.log("Argon HUD - Dragonbane: init complete");
});

Hooks.once("ready", () => {
  registerSkillSettings();
  console.log("Argon HUD - Dragonbane: skill settings complete");
});

// "argonInit" is a custom hook fired by the Argon Combat HUD (CORE) module,
// which publishes no TS types of its own, so fvtt-types (which only knows
// Foundry core's built-in hooks) can't validate this call. See the note in
// enhancedcombathud-dragonbane.d.ts for why this can't be fixed via a
// `HookConfig` augmentation the way `SettingConfig` is handled below.
(Hooks.on as (hook: string, fn: (coreHUD: any) => void) => number)(
  "argonInit",
  (CoreHUD) => {
    setupDragonbaneHud(CoreHUD);
    console.log("Argon HUD - Dragonbane: UI setup complete");
  },
);
