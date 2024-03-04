import { id as MODULE_NAME } from '../module.json';

const ARGON = CONFIG.ARGON;
class DragonbaneMonsterAttackButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }

  get label() {
    return "Monster Attack";
  }

  get icon() {
    return "systems/dragonbane/art/ui/sword.webp";
  }

  async _onLeftClick(event) {
    this.actor.sheet._onMonsterAttack({
      type: "click",
      preventDefault: () => event.preventDefault(),
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey
    });
  }
}
class DragonbaneHeroicAbilitiesButton extends ARGON.MAIN.BUTTONS
  .ButtonPanelButton {
    get label() {
      return "Heroic Abilities";
    }
    get icon() {
      return `modules/${MODULE_NAME}/icons/skills.svg`;
    }

    async _getPanel() {
      const abilities = this.actor.items
        .filter(item => item.type === "ability")
        .filter(item => item.system.wp);

      return new DragonbaneAbilityButtonPanel({
        buttons: abilities.map((item) => new DragonbaneAbilityButton({ item })),
      });
    }
  }

class DragonbaneAbilityButtonPanel extends ARGON.MAIN.BUTTON_PANELS.ButtonPanel {
  constructor(...args) {
    super(...args)
  }

  get classes() {
    return ["features-container", "dragonbane-features-container"];
  }
}

class DragonbaneAbilityButton extends ARGON.MAIN.BUTTONS.ItemButton {
  constructor(...args) {
    super(...args);
  }

  get classes() {
    return ["feature-element", "sheet-table-data"]; // need the latter to trick the DB code
  }
    
  get label() {
    return this.item.name;
  }
  get icon() {
    return this.item.img;
  }

  async _onLeftClick(event) {
    // we're going to have to fake an event, since this is actually
    // a mouseup event instead of the expected left click (per the
    // sheet code)
    this.actor.sheet._onUseItem({
      type: 'click',
      currentTarget: event.currentTarget,
      preventDefault: () => event.preventDefault()
    });
  }

  async _renderInner() {
    await super._renderInner();

    // embed the item id in the element for the left click handler to use
    this.element.dataset.itemId = this.item.id;
  }
}

class DragonbaneRoundRestButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }

  get icon() {
    return `modules/${MODULE_NAME}/icons/meditation.svg`;
  }
  get label() {
    return "Round Rest";
  }

  async _onLeftClick(event) {      
    this.actor.system.canRestRound && this.actor.sheet._onRestRound(event);
  }
}

// class DragonbaneDashButton extends ARGON.MAIN.BUTTONS.ActionButton {
//   get icon() {
//     return "modules/enhancedcombathud/icons/svg/run.svg";
//   }
//   get label() {
//     return "Dash";
//   }
// }

class DragonbaneSkillButton extends ARGON.MAIN.BUTTONS.ActionButton {
  constructor({ skillName, iconName, label }) {
    super();
    this.skillName = skillName;
    this._icon = iconName ? `modules/${MODULE_NAME}/icons/${iconName}` : "";
    this._label = label || skillName;
  }

  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }

  get icon() {
    return this._icon;
  }
  get label() {
    return this._label;
  }

  async _onLeftClick() {
    game.dragonbane.rollItem(this.skillName, "skill");
  }
}

export default  class DragonbaneActionsPanel extends ARGON.MAIN.ActionPanel {
  get classes() {
    return ["actions-container", "dragonbane-actions-container"];
  }

  get label() {
    return "Actions";
  }
  get maxActions() {
    return 1;
  }

  async _getButtons() {
    const Buttons: any[] = [];

    if (!this.actor.isMonster) {
      Buttons.push(
        // new DragonbaneDashButton(), // not really implemented yet. Just double movement for a round?
        new ARGON.MAIN.BUTTONS.SplitButton(
          new DragonbaneSkillButton({
            skillName: "Healing",
            label: "First Aid",
            iconName: "bandage-roll.svg",
          }),
          new DragonbaneSkillButton({
            skillName: "Persuasion",
            label: "Rally",
            iconName: "bugle-call.svg",
          }),
        )
      );
    } else {
      Buttons.push(new DragonbaneMonsterAttackButton());
    }

    if (this.actor.system.willPoints?.max) {
      Buttons.push(
        new DragonbaneHeroicAbilitiesButton(),
        new DragonbaneRoundRestButton()
      );
    }

    return Buttons;
  }
}
