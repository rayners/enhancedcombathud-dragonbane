/*
 * Creating a custom type for a Dragonbane game
 * since it adds some functions to `game.dragonbane`
 * that we're using
 */

interface Dragonbane {
  // Not using any of the commented ones... yet
  // migrateWorld(): void;
  // updateSpells(): void;
  rollAttribute(
    actor: DragonbaneActor,
    attributeName: string,
    options?: object,
  ): void;
  rollItem(itemName: string | null, itemType: string, options?: object): void;
  // monsterAttack(): void;
  // monsterDefend(): void;
  // drawTreasureCards(): void;
}

interface DragonbaneGame extends Game {
  dragonbane: Dragonbane;
}

declare let game: DragonbaneGame;

// Also the global declarations for ARGON

class DragonbaneActorSheet extends ActorSheet {
  _onMonsterAttack(
    event: Pick<Event, "type" | "preventDefault" | "shiftKey" | "ctrlKey">,
  ): void;
  _onMonsterDefend(event: Pick<Event, "type" | "preventDefault">): void;

  // Rolling
  _onAttributeRoll(event: Event): void;
  _onSkillRoll(
    event: Pick<Event, "type" | "currentTarget" | "preventDefault">,
  ): void;
  _onDeathRoll(event: Event): void;

  // Rests
  _onRestRound(event: Event): void;
  _onRestStretch(event: Event): void;
  _onRestShift(event: Event): void;
}

class DragonbaneActor extends Actor {
  sheet: DragonbaneActorSheet;
  system: any;

  isMonster: boolean;
  isCharacter: boolean;
  isNpc: boolean;
  getEquippedWeapons(): Array<DragonbaneItem>;
  hasSpells: boolean;
  getSkill(skillName: string): any;

  hasCondition(attribute: string): boolean;
  updateCondition(attribute: string, value: boolean): void;

  useAbility(item: DragonbaneItem): void;
}

class ArgonComponent {
  constructor(...args: any[]);
  // Definitely have
  actor: DragonbaneActor;
  name?: string;

  async _renderInner(): void;
  async render(): void;
  element: HTMLElement;
}

class DragonbaneItem extends Item {
  id: string;
  system: any;
  hasWeaponFeature(feature: string): boolean;
}

class ArgonItemComponent extends ArgonComponent {
  item: DragonbaneItem;
  useTargetPicker: boolean;
}

class ArgonActionPanel extends ArgonComponent {
  updateActionUse(): void;
  updateVisibility(): void;
}

type ArgonComponentConstructor = new (...args: any[]) => ArgonComponent;
type ArgonPanelComponentConstructor = new (arg?: {
  buttons: Array<ArgonComponent>;
}) => ArgonActionPanel;

interface ArgonCONFIG extends CONFIG {
  ARGON: {
    ButtonHud: ArgonComponentConstructor;
    MovementHud: ArgonComponentConstructor;
    WeaponSets: ArgonComponentConstructor;
    DRAWER: {
      DrawerPanel: ArgonComponentConstructor;
      DrawerButton: ArgonComponentConstructor;
    };
    MAIN: {
      ActionPanel: ArgonPanelComponentConstructor;
      BUTTONS: {
        ActionButton: ArgonComponentConstructor;
        ButtonPanelButton: ArgonPanelComponentConstructor;
        ItemButton: new (args: {
          item: DragonbaneItem;
          id?: string;
        }) => ArgonItemComponent;
        SplitButton: new (
          button1: ArgonComponent,
          button2: ArgonComponent,
        ) => ArgonComponent;
      };
      BUTTON_PANELS: {
        ACCORDION: {
          AccordionPanelCategory: new (args: {
            label: string;
            buttons: Array<ArgonItemComponent>;
            uses: () => number;
          }) => ArgonComponent;
          AccordionPanel: new (arg: {
            accordionPanelCategories: Array<ArgonComponent>;
          }) => ArgonComponent;
        };
        ButtonPanel: ArgonPanelComponentConstructor;
      };
    };
    PORTRAIT: {
      PortraitPanel: ArgonComponentConstructor;
    };
  };
}

declare let CONFIG: ArgonCONFIG;
