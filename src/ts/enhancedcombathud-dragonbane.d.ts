/*
 * Creating a custom type for a Dragonbane game
 * since it adds some functions to `game.dragonbane`
 * that we're using
 */

interface Dragonbane {
  // Not using any of the commented ones... yet
  // migrateWorld(): void;
  // updateSpells(): void;
  rollAttribute(actor: Actor, attributeName: string, options?: object): void;
  rollItem(itemName: string, itemType: string, options?: object): void;
  // monsterAttack(): void;
  // monsterDefend(): void;
  // drawTreasureCards(): void;
}

interface DragonbaneGame extends Game {
  dragonbane: Dragonbane;
}

declare let game: DragonbaneGame;

// Also the global declarations for ARGON

interface ArgonCONFIG extends CONFIG {
  ARGON: any;
}

declare let CONFIG: ArgonCONFIG;
