import "../styles/module.scss";
import { id as MODULE_NAME } from "../module.json";

declare var game: any;

Hooks.on("argonInit", (CoreHUD) => {
  const ARGON = CoreHUD.ARGON;

  class DragonbanePortraitPanel extends ARGON.PORTRAIT.PortraitPanel {
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

  class DragonbaneDrawerPanel extends ARGON.DRAWER.DrawerPanel {
    get classes() {
      return ["ability-menu", "dragonbane-ability-menu"];
    }

    get title() {
      return "Skills & Abilities";
    }
  }

  class DragonbaneMovementHud extends ARGON.MovementHud {
    get classes() {
      return ["movement-hud", "dragonbane-movement-hud"];
    }

    get movementMax() {
      return this.actor.system.movement / canvas?.scene?.dimensions["distance"];
    }

    get movementColor() {
      return ["dragonbane-movement"];
    }
  }

  class DragonbaneWeaponSets extends ARGON.WeaponSets {
    // async _onSetChange({ sets, active }) {
    async _onSetChange() {}
  }

  class DragonbaneMagicPanel extends ARGON.MAIN.ActionPanel {
    get classes() {
      return ["actions-container", "dragonbane-actions-container"];
    }
    get label() {
      return "Magic";
    }

    get maxActions() {
      return this.actor.hasSpells ? 1 : null;
    }

    async _getButtons() {
      if (!this.actor.hasSpells) {
        return [];
      }
      const spells = this.actor.items.filter((i) => i.type == "spell");

      return [new DragonbaneSpellsButton(spells)];
    }
  }

  class DragonbaneSpellsButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {
    constructor(spells) {
      super();
      this.spells = spells;
    }
    get classes() {
      return ["action-element", "ech-blur", "dragonbane-action-element"];
    }

    get label() {
      return "Spells";
    }
    get icon() {
      return "modules/enhancedcombathud/icons/svg/spell-book.svg";
    }

    get id() { return 'spells-button'; }

    async _getPanel() {
      return new ARGON.MAIN.BUTTON_PANELS.ButtonPanel({
        buttons: this.spells.map((item) => new DragonbaneSpellButton({ id: this.id, item })),
      });
    }
  }

  class DragonbaneSpellButton extends ARGON.MAIN.BUTTONS.ItemButton {
    constructor(...args) {
      super(...args);
    }

    get classes() {
      return ["feature-element", "dragonbane-feature-element", "sheet-table-data"];
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

  class DragonbaneMonsterDefendButton extends ARGON.MAIN.BUTTONS.ActionButton {
    get classes() {
      return ["action-element", "dragonbane-action-element"];
    }

    get label() {
      return "Monster Defend";
    }

    get icon() {
      return "systems/dragonbane/art/ui/shield.webp";
    }

    async _onLeftClick(event) {
      this.actor.sheet._onMonsterDefend({
        type: 'click',
        preventDefault: () => event.preventDefault()
      });
    }
  }

  class DragonbaneDefensePanel extends ARGON.MAIN.ActionPanel {
    get classes() {
      return ["actions-container", "dragonbane-actions-container"];
    }

    get label() {
      return "Defense";
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

  class DragonbaneEvadeButton extends ARGON.MAIN.BUTTONS.ActionButton {
    get classes() {
      return ["action-element", "dragonbane-action-element"];
    }
    get label() {
      return "Dodge";
    }

    get icon() {
      return "modules/enhancedcombathud/icons/svg/dodging.svg";
    }

    async _onLeftClick() {
      return game.dragonbane.rollItem('Evade', 'skill');
    }
  }

  class DragonbaneParryButton extends ARGON.MAIN.BUTTONS.ActionButton {
    constructor() {
      super();

      // select for highest skill+durability
      this._parryWeapon = this.actor.getEquippedWeapons()
        .filter(w => !w.hasWeaponFeature('noparry'))
        .sort((a,b) => (b.system.skill.value + b.system.durability) - (a.system.skill.value + a.system.durability))[0];
    }

    get classes() {
      return ["action-element", "dragonbane-action-element"];
    }
    get label() {
      return `Parry (${this._parryWeapon?.name})`;
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

  class DragonbaneAttackPanel extends ARGON.MAIN.ActionPanel {
    get classes() {
      return ["actions-container", "dragonbane-actions-container"];
    }
    get label() {
      return "Attack";
    }

    get maxActions() {
      return 1;
    }

    async _getButtons() {
      const weapons = this.actor.getEquippedWeapons();
      return weapons.map((w) => new DragonbaneAttackButton(w));
    }
  }

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

  class DragonbaneActionsPanel extends ARGON.MAIN.ActionPanel {
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

  class DragonbaneAbilityButtonPanel extends ARGON.MAIN.BUTTON_PANELS.ButtonPanel {
    constructor(...args) {
      super(...args)
    }

    get classes() {
      return ["features-container", "dragonbane-features-container"];
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
      const abilities = this.actor.items.filter(
        (item) => item.type === "ability",
      );
      return new DragonbaneAbilityButtonPanel({
        buttons: abilities.map((item) => new DragonbaneAbilityButton({ item })),
      });
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

  class DragonbaneButtonHud extends ARGON.ButtonHud {
    get classes() {
      return ["movement-hud", "dragonbane-movement-hud"];
    }

    get visible() {
      return !game.combat?.started;
    }

    async _getButtons() {
      return [
        {
          label: "Stretch Rest",
          // have to account for _not_ being able to rest for a stretch
          onClick: (event) => this.actor.system.canRestStretch && this.actor.sheet._onRestStretch(event),
          icon: "fas fa-chair",
        },
        {
          label: "Shift Rest",
          onClick: (event) => this.actor.sheet._onRestShift(event),
          icon: "fas fa-bed",
        },
      ];
    }
  }

  CoreHUD.definePortraitPanel(DragonbanePortraitPanel);
  CoreHUD.defineDrawerPanel(DragonbaneDrawerPanel);
  CoreHUD.defineMainPanels([
    DragonbaneAttackPanel,
    DragonbaneActionsPanel,
    DragonbaneMagicPanel,
    DragonbaneDefensePanel,
    ARGON.PREFAB.PassTurnPanel,
  ]);
  CoreHUD.defineMovementHud(DragonbaneMovementHud);
  CoreHUD.defineWeaponSets(DragonbaneWeaponSets);
  CoreHUD.defineButtonHud(DragonbaneButtonHud);
  CoreHUD.defineSupportedActorTypes(["character", "npc", "monster"]);
});
