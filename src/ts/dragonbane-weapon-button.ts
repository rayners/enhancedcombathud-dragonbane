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

  get hasTooltip() {
    return true;
  }

  async getTooltipData() {
    const props = ["worn", "mainHand", "offHand", "broken"];
    return {
      title: this.item.name,
      subtitle: `${this.item.system.skill.name}: ${this.item.system.skill.value}`,
      details: [
        {
          label: game.i18n.localize(
            "enhancedcombathud-dragonbane.weapon.tooltips.damage",
          ),
          value: this.item.system.damage,
        },
        {
          label: game.i18n.localize(
            "enhancedcombathud-dragonbane.weapon.tooltips.durability",
          ),
          value: this.item.system.durability,
        },
        {
          label: game.i18n.localize(
            "enhancedcombathud-dragonbane.weapon.tooltips.range",
          ),
          value: this.item.system.calculatedRange,
        },
        {
          label: game.i18n.localize(
            "enhancedcombathud-dragonbane.weapon.tooltips.features",
          ),
          value: this.item.system.features.join(", "),
        },
      ],
      properties: props.reduce((m: Array<object>, p): Array<object> => {
        if (this.item.system[p]) {
          m.push({ label: p, secondary: true });
        }

        return m;
      }, []),
    };
  }
}
