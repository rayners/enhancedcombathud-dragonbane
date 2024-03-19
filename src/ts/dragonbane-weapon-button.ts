const ARGON = CONFIG.ARGON;

export class DragonbaneWeaponButton extends ARGON.MAIN.BUTTONS.ItemButton {
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
