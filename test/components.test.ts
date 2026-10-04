import { describe, it, expect, beforeEach, afterEach } from "vitest";
import DragonbanePortraitPanel from "../src/ts/dragonbane-portrait-panel";
import DragonbaneMovementHud from "../src/ts/dragonbane-movement-hud";

describe("Component Smoke Tests", () => {
  describe("DragonbanePortraitPanel", () => {
    let mockActor: any;

    beforeEach(() => {
      mockActor = {
        name: "Test Character",
        img: "path/to/image.png",
        type: "character",
        system: {
          kin: { name: "Human" },
          profession: { name: "Warrior" },
          hitPoints: { value: 15, max: 20 },
          willPoints: { value: 10, max: 12 },
          deathRolls: { successes: 0, failures: 0 },
        },
        sheet: {
          _onDeathRoll: () => {},
        },
      };
    });

    it("should be importable", () => {
      expect(DragonbanePortraitPanel).toBeDefined();
    });

    it("should instantiate with an actor", () => {
      const panel = new DragonbanePortraitPanel(mockActor);
      expect(panel).toBeDefined();
      expect(panel.actor).toBe(mockActor);
    });

    it("should have expected classes", () => {
      const panel = new DragonbanePortraitPanel(mockActor);
      const classes = panel.classes;
      expect(classes).toContain("portrait-hud");
      expect(classes).toContain("dragonbane-portrait-hud");
    });

    it("should generate description for character", () => {
      const panel = new DragonbanePortraitPanel(mockActor);
      expect(panel.description).toBe("Human Warrior");
    });

    it("should return null description for non-character", () => {
      mockActor.type = "monster";
      const panel = new DragonbanePortraitPanel(mockActor);
      expect(panel.description).toBeNull();
    });

    it("should detect dying state correctly", () => {
      mockActor.system.hitPoints.value = 0;
      const panel = new DragonbanePortraitPanel(mockActor);
      expect(panel.isDying).toBe(true);
    });

    it("should not be dying with HP > 0", () => {
      const panel = new DragonbanePortraitPanel(mockActor);
      expect(panel.isDying).toBe(false);
    });

    it("should generate stat blocks", async () => {
      const panel = new DragonbanePortraitPanel(mockActor);
      const blocks = await panel.getStatBlocks();
      expect(blocks).toHaveLength(2); // HP and WP blocks
    });
  });

  describe("DragonbaneMovementHud", () => {
    let mockActor: any;
    let mockToken: any;

    beforeEach(() => {
      mockActor = {
        type: "character",
        system: {
          movement: { value: 10 },
        },
      };
      mockToken = {
        actor: mockActor,
      };
    });

    it("should be importable", () => {
      expect(DragonbaneMovementHud).toBeDefined();
    });

    it("should instantiate with actor and token", () => {
      const hud = new DragonbaneMovementHud(mockActor, mockToken);
      expect(hud).toBeDefined();
      expect(hud.actor).toBe(mockActor);
    });

    it("should have expected classes", () => {
      const hud = new DragonbaneMovementHud(mockActor, mockToken);
      const classes = hud.classes;
      expect(classes).toContain("movement-hud");
      expect(classes).toContain("dragonbane-movement-hud");
      expect(classes).toContain("dragonbane-character");
    });

    it("should calculate movement max correctly", () => {
      const hud = new DragonbaneMovementHud(mockActor, mockToken);
      // movement.value (10) / canvas.scene.dimensions.distance (5) = 2
      expect(hud.movementMax).toBe(2);
    });

    describe("movementMax distance fallback", () => {
      const originalCanvas = (global as any).canvas;

      afterEach(() => {
        (global as any).canvas = originalCanvas;
      });

      it("should fall back to distance 1 when dimensions is undefined", () => {
        (global as any).canvas = { scene: { dimensions: undefined } };
        const hud = new DragonbaneMovementHud(mockActor, mockToken);
        expect(hud.movementMax).toBe(10); // movement.value (10) / fallback (1)
      });

      it("should fall back to distance 1 when scene is null", () => {
        (global as any).canvas = { scene: null };
        const hud = new DragonbaneMovementHud(mockActor, mockToken);
        expect(hud.movementMax).toBe(10);
      });

      it("should fall back to distance 1 when canvas itself is undefined", () => {
        (global as any).canvas = undefined;
        const hud = new DragonbaneMovementHud(mockActor, mockToken);
        expect(hud.movementMax).toBe(10);
      });
    });

    it("should be visible when combat is started", () => {
      (global as any).game.combat = { started: true };
      const hud = new DragonbaneMovementHud(mockActor, mockToken);
      expect(hud.visible).toBe(true);
    });

    it("should not be visible when combat is not started", () => {
      (global as any).game.combat = null;
      const hud = new DragonbaneMovementHud(mockActor, mockToken);
      expect(hud.visible).toBeFalsy();
    });
  });
});
