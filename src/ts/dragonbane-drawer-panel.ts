const ARGON = CONFIG.ARGON;

export default class DragonbaneDrawerPanel extends ARGON.DRAWER.DrawerPanel {
  get classes() {
    return ["ability-menu", "dragonbane-ability-menu"];
  }

  get title() {
    return "Attributes & Skills";
  }

  get categories() {
    if (this.actor.isMonster) {
      return [];
    }
    const attributesButtons = ["STR", "CON", "AGL", "INT", "WIL", "CHA"].map(
      (a) =>
        new ARGON.DRAWER.DrawerButton([
          {
            label: a,
            onClick: () => game.dragonbane.rollAttribute(this.actor, a),
          },
          {
            label: this.actor.system.attributes[a.toLowerCase()]?.value,
            onClick: () => game.dragonbane.rollAttribute(this.actor, a),
          },
        ]),
    );

    const skillsButtons = game.items
      .filter((i) => i.type === "skill" && i.system.skillType === "core")
      .map(
        (skill) =>
          new ARGON.DRAWER.DrawerButton([
            {
              label: skill.name,
              onClick: () => game.dragonbane.rollItem(skill.name, "skill"),
            },
            {
              label: this.actor.getSkill(skill.name)?.system.value,
              onClick: () => game.dragonbane.rollItem(skill.name, "skill"),
            },
          ]),
      );

    const weaponsButtons = game.items
      .filter((i) => i.type === "skill" && i.system.skillType === "weapon")
      .map(
        (skill) =>
          new ARGON.DRAWER.DrawerButton([
            {
              label: skill.name,
              onClick: () => game.dragonbane.rollItem(skill.name, "skill"),
            },
            {
              label: this.actor.getSkill(skill.name)?.system.value,
              onClick: () => game.dragonbane.rollItem(skill.name, "skill"),
            },
          ]),
      );

    return [
      {
        gridCols: "8fr 1fr",
        captions: [
          { label: "Attribute", align: "left" },
          { label: "", align: "right" },
        ],
        align: ["left", "right"],
        buttons: attributesButtons,
      },
      {
        gridCols: "8fr 1fr",
        captions: [
          { label: "Skill", align: "left" },
          { label: "", align: "right" },
        ],
        align: ["left", "right"],
        buttons: skillsButtons,
      },
      {
        gridCols: "8fr 1fr",
        captions: [
          { label: "Weapon", align: "left" },
          { label: "", align: "right" },
        ],
        align: ["left", "right"],
        buttons: weaponsButtons,
      },
    ];
  }
}
