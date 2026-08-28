import { MODULE_NAME } from "./module-id";

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

  game.settings.register(MODULE_NAME, "preferShieldParry", {
    name: `${MODULE_NAME}.settings.preferShieldParry`,
    hint: `${MODULE_NAME}.settings.preferShieldParryHint`,
    config: true,
    type: Boolean,
    default: true,
  });
}

export function registerSkillSettings(): void {
  // Load world skills to select from (just for ease of use)
  //
  // `game.items` is typed as a collection of the base `Item` document
  // shape - the Dragonbane system doesn't ship TS types, so there's no way
  // for fvtt-types to know about the "skill" item subtype. Cast through our
  // own `DragonbaneItem` stub type (see enhancedcombathud-dragonbane.d.ts).
  const worldSkills: Record<string, string> = (
    game.items as unknown as Collection<DragonbaneItem>
  )
    .filter((i) => i.type === "skill")
    .map((i) => i.name)
    .reduce((m, skill) => {
      m[skill] = skill;
      return m;
    }, {});

  (["Healing", "Persuasion", "Evade"] as const).forEach((skill) =>
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
