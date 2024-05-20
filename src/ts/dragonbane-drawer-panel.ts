const ARGON = CONFIG.ARGON;

type DrawerCategory = {
  gridCols: string;
  align?: Array<string>;
  buttons: Array<ArgonComponent>;
};

const attributesList = ["STR", "CON", "AGL", "INT", "WIL", "CHA"];

export default class DragonbaneDrawerPanel extends ARGON.DRAWER.DrawerPanel {
  constructor(...args) {
    super(...args);

    // should probably Hooks.off this somewhere, just not sure
    // where. Probably won't be needed _too_ much

    // this._updateHook =
    Hooks.on("updateActor", this.updateConditions.bind(this));
  }

  updateConditions() {
    attributesList
      // .map((a) => a.toLowerCase())
      .forEach((a) => {
        const el = this.element.querySelector(
          ".attribute-condition." + a.toLowerCase(),
        );
        if (el) {
          if (this.actor.hasCondition(a.toLowerCase())) {
            el.classList.add("on");
          } else {
            el.classList.remove("on");
          }
        }
      });
  }

  get classes() {
    return ["ability-menu", "dragonbane-ability-menu"];
  }

  get title() {
    return this.actor.isCharacter
      ? game.i18n.localize(
          "enhancedcombathud-dragonbane.drawer.attributes-and-skills",
        )
      : game.i18n.localize("enhancedcombathud-dragonbane.drawer.skills");
  }

  get categories() {
    if (this.actor.isMonster) {
      return [];
    }

    const categories: Array<DrawerCategory> = [];
    if (this.actor.isCharacter) {
      const attributesButtons = attributesList.map(
        (a) =>
          new ARGON.DRAWER.DrawerButton([
            {
              label: game.i18n.localize(
                "enhancedcombathud-dragonbane.drawer.attributes." + a,
              ),
              onClick: () => game.dragonbane.rollAttribute(this.actor, a),
            },
            {
              label: `<span class="attribute-condition ${a.toLowerCase()} ${this.actor.hasCondition(a.toLowerCase()) ? "on" : ""}">${game.i18n.localize("DoD.conditions." + a.toLowerCase())}</span>`,
              onClick: () =>
                this.actor.updateCondition(
                  a.toLowerCase(),
                  !this.actor.hasCondition(a.toLowerCase()),
                ),
            },
            {
              label: this.actor.system.attributes[a.toLowerCase()]?.value,
              onClick: () => game.dragonbane.rollAttribute(this.actor, a),
            },
          ]),
      );
      categories.push({
        gridCols: "5fr 2fr 2fr",
        captions: [
          {
            label: game.i18n.localize(
              "enhancedcombathud-dragonbane.drawer.attribute",
            ),
            align: "left",
          },
          { label: "", align: "right" },
          { label: "", align: "right" },
        ],
        align: ["left", "right", "right"],
        buttons: attributesButtons,
      });
    }

    const skillGroups = [
      {
        group: "core",
        label: game.i18n.localize("enhancedcombathud-dragonbane.drawer.skills"),
      },
      {
        group: "magic",
        label: game.i18n.localize("enhancedcombathud-dragonbane.drawer.magic"),
      },
      {
        group: "secondary",
        label: game.i18n.localize(
          "enhancedcombathud-dragonbane.drawer.secondary-skills",
        ),
      },
      {
        group: "weapon",
        label: game.i18n.localize(
          "enhancedcombathud-dragonbane.drawer.weapons",
        ),
      },
    ];

    skillGroups.forEach(({ group, label }) => {
      const skillsButtons = game.items
        .filter((i) => i.type === "skill" && i.system.skillType === group)
        .filter((i) => this.actor.getSkill(i.name)?.system.value)
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

      if (skillsButtons.length) {
        categories.push({
          gridCols: "8fr 1fr",
          captions: [
            { label, align: "left" },
            { label: "", align: "right" },
          ],
          align: ["left", "right"],
          buttons: skillsButtons,
        });
      }
    });

    return categories;
  }
}
