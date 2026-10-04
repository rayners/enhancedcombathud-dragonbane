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

// This module only ever runs code after the Foundry "ready" hook (its own
// `Hooks.once("ready", ...)` / `Hooks.on("argonInit", ...)` handlers all run
// well after startup), so tell fvtt-types to assume "ready" has already
// happened. This makes lifecycle-dependent globals like `game`, `canvas`,
// etc. resolve to their fully-initialized types instead of unions with
// `undefined`, without us having to redeclare those global variables
// ourselves (which risks breaking the library's own internal type lookups
// that key off the real `Game`/`CONFIG` global interfaces).
// See: node_modules/@league-of-foundry-developers/foundry-vtt-types/src/configuration/configuration.d.mts
interface AssumeHookRan {
  ready: never;
}

// Merge our module's `game.dragonbane` API into the real global `Game`
// interface/class rather than redeclaring the `game` variable with a new
// type - see the `AssumeHookRan` note above for why. `ReadyGame` is merged
// too since that's the concrete lifecycle variant `game`'s type resolves to
// once `AssumeHookRan.ready` is set above (fvtt-types computes it as its own
// snapshot type rather than re-reading `Game` at every usage site).
interface Game {
  dragonbane: Dragonbane;
}
interface ReadyGame {
  dragonbane: Dragonbane;
}

// Foundry global utility functions
// fromUuidSync can return any document type, so we use a generic signature
declare function fromUuidSync(uuid: string): foundry.abstract.Document | null;

// Also the global declarations for ARGON

class DragonbaneActorSheet extends ActorSheet {
  _onMonsterAttack(
    event: Pick<Event, "type" | "preventDefault" | "shiftKey" | "ctrlKey">,
    target?: HTMLElement,
  ): void;
  _onMonsterDefend(
    event: Pick<Event, "type" | "preventDefault">,
    target?: HTMLElement,
  ): void;

  // Rolling
  _onAttributeRoll(event: Event, target?: HTMLElement): void;
  _onSkillRoll(
    event: Pick<Event, "type" | "currentTarget" | "preventDefault">,
    target?: HTMLElement,
  ): void;
  _onDeathRoll(event: Event, target?: HTMLElement): void;

  // Rests
  _onRestRound(event: Event, target?: HTMLElement): void;
  _onRestStretch(event: Event, target?: HTMLElement): void;
  _onRestShift(event: Event, target?: HTMLElement): void;
}

class DragonbaneActor extends Actor<any> {
  sheet: DragonbaneActorSheet;
  system: any;
  type: string;
  items: Collection<DragonbaneItem>;

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

class DragonbaneItem extends Item<any> {
  id: string;
  system: any;
  type: string;
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

// Merge our ARGON config into the real global `CONFIG` interface rather
// than redeclaring the `CONFIG` variable with a new type - see the
// `AssumeHookRan` note above for the same reasoning applied to `game`.
interface CONFIG {
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

// Register this module's own settings with fvtt-types so
// `game.settings.register`/`.get` accept our namespace + keys instead of
// only the built-in "core" namespace. `SettingConfig` is a global ambient
// interface (see foundry-vtt-types/src/types/config.d.mts), so a plain
// top-level merge like this is enough - no module augmentation needed.
interface SettingConfig {
  "enhancedcombathud-dragonbane.includeUnpreparedSpells": boolean;
  "enhancedcombathud-dragonbane.groupSpellsByRank": boolean;
  "enhancedcombathud-dragonbane.preferShieldParry": boolean;
  "enhancedcombathud-dragonbane.skillNameHealing": string;
  "enhancedcombathud-dragonbane.skillNamePersuasion": string;
  "enhancedcombathud-dragonbane.skillNameEvade": string;
}

// Note: Argon Combat HUD (CORE) fires a custom "argonInit" hook once it's
// ready to accept panel/HUD registrations, passing its own `CoreHUD` API
// object. Unlike `SettingConfig`/`AssumeHookRan` (which fvtt-types re-merges
// into global ambient interfaces), the hook registry (`Hooks.HookName` /
// `HookConfig`) is only reachable through the package's private `#configuration`
// subpath-import alias from inside its own source, which external consumers
// like this module cannot target with `declare module` augmentation.
// Argon CORE itself publishes no TS types either, so there is no clean way
// to teach `Hooks.on`/`Hooks.once` about "argonInit". See the explicit cast
// at the `Hooks.on("argonInit", ...)` call site in module.ts instead.
