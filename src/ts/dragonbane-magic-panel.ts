import { id as MODULE_NAME } from "../module.json";

const ARGON = CONFIG.ARGON;

class DragonbaneSpellsButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {
  constructor(spells) {
    super();
    this.spells = spells;
  }
  get classes() {
    return ["action-element", "ech-blur", "dragonbane-action-element"];
  }

  get label() {
    return game.i18n.localize("enhancedcombathud-dragonbane.buttons.spells");
  }
  get icon() {
    return "modules/enhancedcombathud/icons/svg/spell-book.svg";
  }

  get id() {
    return "spells-button";
  }

  async _getPanel() {
    return new ARGON.MAIN.BUTTON_PANELS.ButtonPanel({
      buttons: this.spells.map(
        (item) => new DragonbaneSpellButton({ id: this.id, item }),
      ),
    });
  }
}

class DragonbaneSpellButton extends ARGON.MAIN.BUTTONS.ItemButton {
  constructor(...args) {
    super(...args);
  }

  get classes() {
    return [
      "feature-element",
      "dragonbane-feature-element",
      "sheet-table-data",
    ];
  }

  get useTargetPicker() {
    return false;
  }

  async _onLeftClick(event) {
    // You'd think this would be enough:
    // game.dragonbane.rollItem(this.item.name, this.item.type);

    // But it doesn't account for:
    // - Magic tricks
    // - Maybe something else? But I think it's just tricks

    // We're going to have to fake an event, since this is actually
    // a mouseup event instead of the expected left click (per the
    // sheet code)
    this.actor.sheet._onSkillRoll({
      type: "click",
      currentTarget: event.currentTarget,
      preventDefault: () => event.preventDefault(),
    });
  }

  async _renderInner() {
    await super._renderInner();

    // embed the item id in the element for the left click handler to use
    this.element.dataset.itemId = this.item.id;
  }
}

export default class DragonbaneMagicPanel extends ARGON.MAIN.ActionPanel {
  get classes() {
    return ["actions-container", "dragonbane-actions-container"];
  }
  get label() {
    return game.i18n.localize("enhancedcombathud-dragonbane.panels.magic");
  }

  get maxActions() {
    return this.actor.hasSpells ? 1 : null;
  }

  async _getButtons() {
    if (!this.actor.hasSpells) {
      return [];
    }
    const includeUnpreparedSpells = game.settings.get(
      MODULE_NAME,
      "includeUnpreparedSpells",
    );
    const spells = this.actor.items
      .filter((i) => i.type == "spell")
      .filter((s) => s.system.memorized || includeUnpreparedSpells);

    return [new DragonbaneSpellsButton(spells)];
  }
}
