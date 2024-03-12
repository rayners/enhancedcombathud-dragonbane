const ARGON = CONFIG.ARGON;

class DragonbaneWeaponButton extends ARGON.MAIN.BUTTONS.ItemButton {
  constructor(...args) {
    super(...args);
  }

  get targets() {
    return 1;
  }
  get ranges() {
    return {
      normal: this.item.system.calculatedRange,
      long: null,
    };
  }

  async _onLeftClick() {
    game.dragonbane.rollItem(this.item.name, this.item.type);
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
    return weapons.map(
      (item) => new DragonbaneWeaponButton({ item, inActionPanel: true }),
    );
  }
}
