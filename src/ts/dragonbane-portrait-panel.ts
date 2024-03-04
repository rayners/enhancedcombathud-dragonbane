const ARGON = CONFIG.ARGON;

export default class DragonbanePortraitPanel extends ARGON.PORTRAIT.PortraitPanel {
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

  async getStatBlocks() {
    const { system } = this.actor;
    const Blocks = [
      [{ text: "HP" }, // game.i18n.localize('DoD.secondaryAttributeTypes.hitPoints') },
        { text: system.hitPoints.value },
        { text: "/" },
        { text: system.hitPoints.max }]
    ];

    if (system.willPoints?.max) { // if they have any WP
      Blocks.push(
        [{ text: "WP" }, // game.i18n.localize('DoD.secondaryAttributeTypes.willPoints') },
          { text: system.willPoints.value },
          { text: "/" },
          { text: system.willPoints.max }]
      );
    }

    return Blocks;
  }
}

