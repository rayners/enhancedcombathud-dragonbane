const ARGON = CONFIG.ARGON;

class DragonbaneAttackButton extends ARGON.MAIN.BUTTONS.ActionButton {
  constructor(weapon) {
    super();
    this.weapon = weapon;
  }

  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }

  get label() {
    return this.weapon.name;
  }
  get icon() {
    return this.weapon.img;
  }

  async _onLeftClick() {
    game.dragonbane.rollItem(this.weapon.name, this.weapon.type);
  }
}

export default class DragonbaneAttackPanel extends ARGON.MAIN.ActionPanel {
  get classes() {
    return ["actions-container", "dragonbane-actions-container"];
  }
  get label() {
    return game.i18n.localize("enhancedcombathud-dragonbane.panels.attack");
  }

  get maxActions() {
    return 1;
  }

  async _getButtons() {
    const weapons = this.actor.getEquippedWeapons();
    return weapons.map((w) => new DragonbaneAttackButton(w));
  }
}
