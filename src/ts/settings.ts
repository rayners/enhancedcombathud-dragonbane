import { id as MODULE_NAME } from "../module.json";

export function registerSettings(): void {
  game.settings.register(MODULE_NAME, "includeUnpreparedSpells", {
    name: "Include Unprepared Spells",
    hint: "Include unprepared spells in spells list",
    config: true,
    type: Boolean,
    default: false
  });
}

export default {
  registerSettings
};
