import { describe, it, expect, beforeEach, vi } from "vitest";
import DragonbaneDefensePanel from "../src/ts/dragonbane-defense-panel";

describe("Fear Table Integration", () => {
  let mockActor: any;

  beforeEach(() => {
    // Create a proper mock actor with all needed methods
    mockActor = {
      type: "character",
      name: "Test Character",
      getEquippedWeapons: vi.fn(() => [
        {
          name: "Test Sword",
          type: "weapon",
          system: {
            skill: { value: 10 },
            durability: 5,
          },
          hasWeaponFeature: vi.fn(() => false),
        },
      ]),
      items: [],
    };

    // Reset global mocks
    (global as any).fromUuidSync = vi.fn();
  });

  describe("DragonbaneDefensePanel with Fear Table", () => {
    it("should have 'Defence/Reactions' label when fear table exists", () => {
      // Mock fear table exists
      (global as any).fromUuidSync = vi.fn((uuid: string) => {
        if (uuid === "RollTable.wHTr9HuHkpVv7ccX") {
          return { name: "Fear", uuid: uuid, formula: "1d8" };
        }
        return null;
      });

      const panel = new DragonbaneDefensePanel(mockActor);
      expect(panel.label).toBe(
        "enhancedcombathud-dragonbane.panels.defense-reactions",
      );
    });

    it("should have 'Defence' label when fear table does not exist", () => {
      // Mock fear table does not exist
      (global as any).fromUuidSync = vi.fn(() => null);

      const panel = new DragonbaneDefensePanel(mockActor);
      expect(panel.label).toBe("enhancedcombathud-dragonbane.panels.defense");
    });

    it("should include fear button when fear table exists", async () => {
      // Mock fear table exists
      const mockFearTable = { name: "Fear", uuid: "RollTable.wHTr9HuHkpVv7ccX", formula: "1d8" };
      (global as any).fromUuidSync = vi.fn((uuid: string) => {
        if (uuid === "RollTable.wHTr9HuHkpVv7ccX") {
          return mockFearTable;
        }
        return null;
      });

      const panel = new DragonbaneDefensePanel(mockActor);
      const buttons = await panel._getButtons();

      // Should have dodge, parry (if weapon exists), and fear button
      const fearButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneFearButton",
      );
      expect(fearButton).toBeDefined();
    });

    it("should not include fear button when fear table does not exist", async () => {
      // Mock fear table does not exist
      (global as any).fromUuidSync = vi.fn(() => null);

      const panel = new DragonbaneDefensePanel(mockActor);
      const buttons = await panel._getButtons();

      // Should only have dodge and parry buttons
      const fearButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneFearButton",
      );
      expect(fearButton).toBeUndefined();
    });

    it("should not add fear button for monsters", async () => {
      // Mock fear table exists
      const mockFearTable = { name: "Fear", uuid: "RollTable.wHTr9HuHkpVv7ccX", formula: "1d8" };
      (global as any).fromUuidSync = vi.fn((uuid: string) => {
        if (uuid === "RollTable.wHTr9HuHkpVv7ccX") {
          return mockFearTable;
        }
        return null;
      });

      const monsterActor = {
        ...mockActor,
        type: "monster",
      };

      const panel = new DragonbaneDefensePanel(monsterActor);
      const buttons = await panel._getButtons();

      // Monsters only get their defend button, no fear button
      const fearButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneFearButton",
      );
      expect(fearButton).toBeUndefined();
    });
  });

  describe("DragonbaneFearButton", () => {
    it("should have correct label", async () => {
      const mockFearTable = { name: "Fear", uuid: "RollTable.wHTr9HuHkpVv7ccX", formula: "1d8", draw: vi.fn() };
      (global as any).fromUuidSync = vi.fn((uuid: string) => {
        if (uuid === "RollTable.wHTr9HuHkpVv7ccX") {
          return mockFearTable;
        }
        return null;
      });

      const panel = new DragonbaneDefensePanel(mockActor);
      const buttons = await panel._getButtons();
      const fearButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneFearButton",
      );

      expect(fearButton?.label).toBe(
        "enhancedcombathud-dragonbane.actions.fear-table",
      );
    });

    it("should roll on fear table when clicked", async () => {
      const mockDraw = vi.fn();
      const mockFearTable = {
        name: "Fear",
        uuid: "RollTable.wHTr9HuHkpVv7ccX",
        formula: "1d8",
        draw: mockDraw,
      };
      (global as any).fromUuidSync = vi.fn((uuid: string) => {
        if (uuid === "RollTable.wHTr9HuHkpVv7ccX") {
          return mockFearTable;
        }
        return null;
      });

      const panel = new DragonbaneDefensePanel(mockActor);
      const buttons = await panel._getButtons();
      const fearButton = buttons.find(
        (b: any) => b.constructor.name === "DragonbaneFearButton",
      );

      await fearButton._onLeftClick({});

      expect(mockDraw).toHaveBeenCalled();
    });
  });
});
