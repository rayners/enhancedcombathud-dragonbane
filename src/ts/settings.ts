import { id as MODULE_NAME } from "../module.json";

export function registerSettings(): void {
  game.settings.register(MODULE_NAME, "includeUnpreparedSpells", {
    name: `${MODULE_NAME}.settings.includeUnpreparedSpells`,
    hint: `${MODULE_NAME}.settings.includeUnpreparedSpellsHint`,
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(MODULE_NAME, "groupSpellsByRank", {
    name: `${MODULE_NAME}.settings.groupSpellsByRank`,
    hint: `${MODULE_NAME}.settings.groupSpellsByRankHint`,
    config: true,
    type: Boolean,
    default: true,
  });
}

export function registerSkillSettings(): void {
  // Load world skills to select from (just for ease of use)
  const worldSkills: Record<string, string> = game.items
    .filter((i) => i.type === "skill")
    .map((i) => i.name)
    .reduce((m, skill) => {
      m[skill] = skill;
      return m;
    }, {});

  ["Healing", "Persuasion", "Evade"].forEach((skill) =>
    game.settings.register(MODULE_NAME, `skillName${skill}`, {
      name: `${MODULE_NAME}.settings.skillName${skill}`,
      scope: "world",
      config: true,
      type: String,
      default: skill,
      choices: worldSkills,
    }),
  );
}

export default {
  registerSettings,
  registerSkillSettings,
};
