const ARGON = CONFIG.ARGON;

export default class DragonbaneDrawerPanel extends ARGON.DRAWER.DrawerPanel {
  get classes() {
    return ["ability-menu", "dragonbane-ability-menu"];
  }

  get title() {
    return "Skills & Abilities";
  }

  get categories() {
    if (this.actor.isMonster) {
      return [];
    }
    const attributes = [
      new ARGON.DRAWER.DrawerButton(
        ["STR", "CON", "AGL", "INT", "WIL", "CHA"].map((a) => ({
          label: a,
          onClick: () => game.dragonbane.rollAttribute(this.actor, a),
        })),
      ),
    ];

    const skills = [
      new ARGON.DRAWER.DrawerButton(
        game.items
          .filter((i) => i.type === "skill" && i.system.skillType === "core")
          .map((skill) => ({
            label: skill.name,
            onClick: () => game.dragonbane.rollItem(skill.name, "skill"),
          })),
      ),
    ];
    const weapons = [
      new ARGON.DRAWER.DrawerButton(
        game.items
          .filter((i) => i.type === "skill" && i.system.skillType === "weapon")
          .map((skill) => ({
            label: skill.name,
            onClick: () => game.dragonbane.rollItem(skill.name, "skill"),
          })),
      ),
    ];
    return [
      {
        captions: [{ label: "Attribute", align: "left" }],
        align: ["left"],
        buttons: attributes,
      },
      {
        captions: [{ label: "Skill", align: "left" }],
        align: ["left"],
        buttons: skills,
      },
      {
        captions: [{ label: "Weapon", align: "left" }],
        align: ["left"],
        buttons: weapons,
      },
    ];
  }
}
