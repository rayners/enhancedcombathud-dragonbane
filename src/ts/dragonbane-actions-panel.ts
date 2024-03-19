import { id as MODULE_NAME } from "../module.json";
import { DragonbaneWeaponButton } from "./dragonbane-weapon-button";
import { DragonbaneSpellsButton } from "./dragonbane-spells-button";

const ARGON = CONFIG.ARGON;

class DragonbaneMonsterAttackButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get classes() {
    return ["action-element", "dragonbane-action-element"];
  }

  get label() {
    return game.i18n.localize(
      "enhancedcombathud-dragonbane.actions.monster-attack",
    );
  }

  get icon() {
    return "systems/dragonbane/art/ui/sword.webp";
  }

  async _onLeftClick(event) {
    this.actor.sheet._onMonsterAttack({
      type: "click",
      preventDefault: () => event.preventDefault(),
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
    });
  }
}
class DragonbaneHeroicAbilitiesButton extends ARGON.MAIN.BUTTONS
  .ButtonPanelButton {
  get label() {
    return game.i18n.localize(
      "enhancedcombathud-dragonbane.buttons.heroic-abilities",
    );
  }
  get icon() {
    return `modules/${MODULE_NAME}/icons/skills.svg`;
  }

  async _getPanel() {
    const abilities = this.actor.items
      .filter((item) => item.type === "ability")
      .filter((item) => item.system.wp);

    return new DragonbaneAbilityButtonPanel({
      buttons: abilities.map((item) => new DragonbaneAbilityButton({ item })),
    });
  }
}

class DragonbaneAbilityButtonPanel extends ARGON.MAIN.BUTTON_PANELS
  .ButtonPanel {
  get classes() {
    return ["features-container", "dragonbane-features-container"];
  }
}

class DragonbaneAbilityButton extends ARGON.MAIN.BUTTONS.ItemButton {
  get classes() {
    return ["feature-element", "sheet-table-data"]; // need the latter to trick the DB code
  }

  get label() {
    return this.item?.name;
  }
  get icon() {
    return this.item?.img;
  }

  async _onLeftClick(event) {
    // we're going to have to fake an event, since this is actually
    // a mouseup event instead of the expected left click (per the
    // sheet code)
    this.actor.sheet._onUseItem({
      type: "click",
      currentTarget: event.currentTarget,
      preventDefault: () => event.preventDefault(),
    });
  }

  get hasTooltip() {
    return true;
  }
  async getTooltipData() {
    return {
      title: this.item.name,
      subtitle: "Heroic Ability",
      description: this.item.system.description,
      details: [{ label: "WP Cost", value: this.item.system.wp }],
      properties: [
        { label: this.item.system.abilityType, primary: true },
        { label: `WP: ${this.item.system.wp}`, primary: true },
      ],
      footerText: this.item.system.requirement,
    };
  }

  override async _renderInner() {
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
    return game.i18n.localize(
      "enhancedcombathud-dragonbane.buttons.round-rest",
    );
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
  _icon: string;
  _label: string;
  skillName: string;

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
    // use the configured skill name
    // or fallback if somehow it's not set to anything
    game.dragonbane.rollItem(
      (game.settings.get(MODULE_NAME, `skillName${this.skillName}`) as
        | string
        | null
        | undefined) || this.skillName,
      "skill",
    );
  }
}

export default class DragonbaneActionsPanel extends ARGON.MAIN.ActionPanel {
  get classes() {
    return ["actions-container", "dragonbane-actions-container"];
  }

  get label() {
    return game.i18n.localize("enhancedcombathud-dragonbane.panels.actions");
  }

  get currentActions() {
    // they have to be up/alive, or rallied...
    // How do we determine rallied?
    return this.actor.system.hitPoints?.value > 0;
  }

  get maxActions() {
    return 1;
  }

  async _getButtons() {
    const Buttons: Array<ArgonComponent> = [];

    if (!this.actor.isMonster) {
      this.actor
        .getEquippedWeapons()
        .forEach((item) =>
          Buttons.push(
            new DragonbaneWeaponButton({ item, inActionPanel: true }),
          ),
        );
      if (this.actor.hasSpells) {
        const includeUnpreparedSpells = game.settings.get(
          MODULE_NAME,
          "includeUnpreparedSpells",
        );
        const spells = this.actor.items
          .filter((i) => i.type == "spell")
          .filter((s) => s.system.memorized || includeUnpreparedSpells);

        Buttons.push(new DragonbaneSpellsButton(spells));
      }
      Buttons.push(
        // new DragonbaneDashButton(), // not really implemented yet. Just double movement for a round?
        new ARGON.MAIN.BUTTONS.SplitButton(
          new DragonbaneSkillButton({
            skillName: "Healing",
            label: game.i18n.localize(
              "enhancedcombathud-dragonbane.actions.first-aid",
            ),
            iconName: "bandage-roll.svg",
          }),
          new DragonbaneSkillButton({
            skillName: "Persuasion",
            label: game.i18n.localize(
              "enhancedcombathud-dragonbane.actions.rally",
            ),
            iconName: "bugle-call.svg",
          }),
        ),
      );
    } else {
      Buttons.push(new DragonbaneMonsterAttackButton());
    }

    // Do they have willpower points to spend/gain?
    if (this.actor.system.willPoints?.max) {
      Buttons.push(
        new DragonbaneHeroicAbilitiesButton(),
        new DragonbaneRoundRestButton(),
      );
    }

    return Buttons;
  }

  // hacky, but it hides/shows it when the death state changes
  override updateActionUse() {
    super.updateActionUse();
    this.updateVisibility();
  }
}
