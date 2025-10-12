import { describe, it, expect, beforeEach, vi } from "vitest";
import DragonbaneActionsPanel from "../src/ts/dragonbane-actions-panel";

describe("Spell Filtering", () => {
  let mockGame: any;

  beforeEach(() => {
    // Setup mock game with settings
    mockGame = {
      i18n: {
        localize: vi.fn((key: string) => key),
        format: vi.fn((key: string) => key),
      },
      settings: {
        get: vi.fn(),
      },
    };
    (global as any).game = mockGame;
  });

  describe("Player Character spell filtering", () => {
    let mockPlayerActor: any;

    beforeEach(() => {
      mockPlayerActor = {
        type: "character",
        isMonster: false,
        hasSpells: true,
        system: {
          hitPoints: { value: 10, max: 10 },
          willPoints: { max: 5 },
        },
        items: [
          {
            type: "spell",
            name: "Fireball",
            system: { memorized: true, rank: 3 },
          },
          {
            type: "spell",
            name: "Lightning Bolt",
            system: { memorized: false, rank: 3 },
          },
          {
            type: "spell",
            name: "Magic Missile",
            system: { memorized: true, rank: 1 },
          },
        ],
        getEquippedWeapons: vi.fn(() => []),
      };
    });

    it("should only show memorized spells when includeUnpreparedSpells is false", async () => {
      mockGame.settings.get.mockReturnValue(false);

      const panel = new DragonbaneActionsPanel(mockPlayerActor);
      const buttons = await panel._getButtons();

      // Find the spells button
      const spellsButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneSpellsButton"
      );
      expect(spellsButton).toBeDefined();
      expect(spellsButton.spells).toHaveLength(2); // Only memorized spells
      expect(spellsButton.spells.map((s: any) => s.name)).toEqual([
        "Fireball",
        "Magic Missile",
      ]);
    });

    it("should show all spells when includeUnpreparedSpells is true", async () => {
      mockGame.settings.get.mockReturnValue(true);

      const panel = new DragonbaneActionsPanel(mockPlayerActor);
      const buttons = await panel._getButtons();

      const spellsButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneSpellsButton"
      );
      expect(spellsButton).toBeDefined();
      expect(spellsButton.spells).toHaveLength(3); // All spells
      expect(spellsButton.spells.map((s: any) => s.name)).toEqual([
        "Fireball",
        "Lightning Bolt",
        "Magic Missile",
      ]);
    });
  });

  describe("NPC spell filtering", () => {
    let mockNPCActor: any;

    beforeEach(() => {
      mockNPCActor = {
        type: "npc",
        isMonster: false,
        hasSpells: true,
        system: {
          hitPoints: { value: 10, max: 10 },
          willPoints: { max: 5 },
        },
        items: [
          {
            type: "spell",
            name: "Fireball",
            system: { memorized: true, rank: 3 },
          },
          {
            type: "spell",
            name: "Lightning Bolt",
            system: { memorized: false, rank: 3 },
          },
          {
            type: "spell",
            name: "Magic Missile",
            system: { memorized: true, rank: 1 },
          },
        ],
        getEquippedWeapons: vi.fn(() => []),
      };
    });

    it("should show all spells for NPCs regardless of includeUnpreparedSpells setting", async () => {
      // Setting is false, but NPCs should ignore it
      mockGame.settings.get.mockReturnValue(false);

      const panel = new DragonbaneActionsPanel(mockNPCActor);
      const buttons = await panel._getButtons();

      const spellsButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneSpellsButton"
      );
      expect(spellsButton).toBeDefined();
      expect(spellsButton.spells).toHaveLength(3); // All spells, ignoring setting
      expect(spellsButton.spells.map((s: any) => s.name)).toEqual([
        "Fireball",
        "Lightning Bolt",
        "Magic Missile",
      ]);
    });

    it("should show all spells for NPCs when includeUnpreparedSpells is true", async () => {
      mockGame.settings.get.mockReturnValue(true);

      const panel = new DragonbaneActionsPanel(mockNPCActor);
      const buttons = await panel._getButtons();

      const spellsButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneSpellsButton"
      );
      expect(spellsButton).toBeDefined();
      expect(spellsButton.spells).toHaveLength(3); // All spells
    });
  });
});
