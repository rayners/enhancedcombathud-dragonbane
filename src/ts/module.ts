import "../styles/module.scss";

import { registerSettings } from './settings';
import { setupDragonbaneHud } from './dragonbaneui';

Hooks.once("init", () => { registerSettings() });

Hooks.on("argonInit", (CoreHUD) => { setupDragonbaneHud(CoreHUD) });
