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

Hooks.on("argonInit", (CoreHUD) => {
  setupDragonbaneHud(CoreHUD);
  console.log("Argon HUD - Dragonbane: UI setup complete");
});
