const ARGON = CONFIG.ARGON;

export default class DragonbanePortraitPanel extends ARGON.PORTRAIT
  .PortraitPanel {
  get classes() {
    return ["portrait-hud", "dragonbane-portrait-hud"];
  }

  get description() {
    const { system } = this.actor;

    if (this.actor.type !== "character") {
      return null;
    }

    return `${system.kin.name} ${system.profession.name}`;
  }

  async _onDeathSave(event) {
    this.actor.sheet._onDeathRoll(event);
  }

  get isDying() {
    if (this.actor.type === "character") {
      return this.actor.system.hitPoints.value === 0;
    } else {
      return false;
    }
  }

  get successes() {
    if (this.actor.type === "character") {
      return this.actor.system.deathRolls.successes;
    } else {
      return 0;
    }
  }

  get failures() {
    if (this.actor.type === "character") {
      return this.actor.system.deathRolls.failures;
    } else {
      return 0;
    }
  }

  async getStatBlocks() {
    const { system } = this.actor;
    const Blocks = [
      [
        {
          text: game.i18n.localize("enhancedcombathud-dragonbane.portrait.hp"),
        }, // game.i18n.localize('DoD.secondaryAttributeTypes.hitPoints') },
        { text: system.hitPoints.value },
        { text: "/" },
        { text: system.hitPoints.max },
      ],
    ];

    if (system.willPoints?.max) {
      // if they have any WP
      Blocks.push([
        {
          text: game.i18n.localize("enhancedcombathud-dragonbane.portrait.wp"),
        }, // game.i18n.localize('DoD.secondaryAttributeTypes.willPoints') },
        { text: system.willPoints.value },
        { text: "/" },
        { text: system.willPoints.max },
      ]);
    }

    return Blocks;
  }
}
