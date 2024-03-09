const ARGON = CONFIG.ARGON;

class DragonbaneMonsterDefendButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }

  get label() {
    return game.i18n.localize(
      "enhancedcombathud-dragonbane.actions.monster-defend",
    );
  }

  get icon() {
    return "systems/dragonbane/art/ui/shield.webp";
  }

  async _onLeftClick(event) {
    this.actor.sheet._onMonsterDefend({
      type: "click",
      preventDefault: () => event.preventDefault(),
    });
  }
}

class DragonbaneEvadeButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }
  get label() {
    return game.i18n.localize("enhancedcombathud-dragonbane.actions.dodge");
  }

  get icon() {
    return "modules/enhancedcombathud/icons/svg/dodging.svg";
  }

  async _onLeftClick() {
    return game.dragonbane.rollItem("Evade", "skill");
  }
}

class DragonbaneParryButton extends ARGON.MAIN.BUTTONS.ActionButton {
  constructor() {
    super();

    // select for highest skill+durability
    this._parryWeapon = this.actor
      .getEquippedWeapons()
      .filter((w) => !w.hasWeaponFeature("noparry"))
      .sort(
        (a, b) =>
          b.system.skill.value +
          b.system.durability -
          (a.system.skill.value + a.system.durability),
      )[0];
  }

  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }
  get label() {
    return `${game.i18n.localize("enhancedcombathud-dragonbane.actions.parry")} (${this._parryWeapon?.name})`;
  }

  get icon() {
    return "modules/enhancedcombathud/icons/svg/crossed-swords.svg";
  }

  async _renderInner() {
    await super._renderInner();
    if (!this._parryWeapon) {
      this.element.style.display = "none";
      return;
    }
  }

  async _onLeftClick() {
    // not sure if there is a way to default it to a parry
    // (doesn't seem to be one... yet)
    game.dragonbane.rollItem(this._parryWeapon.name, this._parryWeapon.type);
  }
}

export default class DragonbaneDefensePanel extends ARGON.MAIN.ActionPanel {
  get classes() {
    return ["actions-container", "dragonbane-actions-container"];
  }

  get label() {
    return game.i18n.localize("enhancedcombathud-dragonbane.panels.defense");
  }

  get maxActions() {
    return 1;
  }

  async _getButtons() {
    if (this.actor.type === "monster") {
      return [new DragonbaneMonsterDefendButton()];
    }
    return [new DragonbaneEvadeButton(), new DragonbaneParryButton()];
  }

  get colorScheme() {
    return 3;
  }
}
