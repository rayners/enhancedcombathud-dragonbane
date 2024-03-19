import { id as MODULE_NAME } from "../module.json";

const ARGON = CONFIG.ARGON;

const spellSort = (a, b) => a.name.localeCompare(b.name);

export class DragonbaneSpellsButton extends ARGON.MAIN.BUTTONS
  .ButtonPanelButton {
  spells: Array<DragonbaneItem>;

  constructor(spells) {
    super(spells);
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
    if (game.settings.get(MODULE_NAME, "groupSpellsByRank")) {
      const spellsByRank = this.spells.reduce((m, spell) => {
        m[spell.system.rank] ||= [];
        m[spell.system.rank].push(spell);
        return m;
      }, {});
      const accordionPanelCategories = Object.keys(spellsByRank)
        .sort()
        .map(
          (rank) =>
            new ARGON.MAIN.BUTTON_PANELS.ACCORDION.AccordionPanelCategory({
              label: `Rank ${rank}`,
              buttons: spellsByRank[rank]
                .sort(spellSort)
                .map((item) => new DragonbaneSpellButton({ item })),
              uses: () => this.actor.system.willPoints,
            }),
        );

      return new ARGON.MAIN.BUTTON_PANELS.ACCORDION.AccordionPanel({
        accordionPanelCategories,
      });
    } else {
      return new ARGON.MAIN.BUTTON_PANELS.ButtonPanel({
        buttons: this.spells
          .sort(spellSort)
          .map((item) => new DragonbaneSpellButton({ id: this.id, item })),
      });
    }
  }
}

class DragonbaneSpellButton extends ARGON.MAIN.BUTTONS.ItemButton {
  get classes() {
    return [
      "feature-element",
      "dragonbane-feature-element",
      "sheet-table-data",
    ];
  }

  get targets() {
    return this.useTargetPicker ? 1 : 0;
  }

  get ranges() {
    return {
      normal: this.item.system.range,
      long: null,
    };
  }

  get hasTooltip() {
    return true;
  }

  async getTooltipData() {
    const details = [{ label: "Range", value: this.item.system.range }];
    if (this.item.system.damage) {
      details.push({ label: "Damage", value: this.item.system.damage });
    }
    return {
      title: this.item.name,
      subtitle: this.item.system.school,
      description: this.item.system.description,
      details,
      properties: [
        ...(this.item.system.castingTime
          ? [{ label: this.item.system.castingTime, primary: true }]
          : []),
        ...(this.item.system.areaOfEffect !== "none"
          ? [{ label: this.item.system.areaOfEffect, primary: true }]
          : []),
        ...(this.item.system.memorized
          ? [{ label: "Memorized", secondary: true }]
          : []),
        ...(this.item.system.duration
          ? [{ label: this.item.system.duration, primary: true }]
          : []),
        ...this.item.system.requirement
          .split(/\s*,\s*/)
          .map((r) => ({ label: r, secondary: true })),
      ],
      footerText: `Skill ${this.item.system.skillValue}`,
    };
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
      currentTarget: this.element,
      preventDefault: () => event.preventDefault(),
    });
  }

  override async _renderInner() {
    await super._renderInner();

    // embed the item id in the element for the left click handler to use
    this.element.dataset.itemId = this.item?.id;
  }
}
