import { describe, it, expect, vi } from "vitest";
import { DragonbaneSpellsButton } from "../src/ts/dragonbane-spells-button";

describe("DragonbaneSpellButton _onLeftClick", () => {
  // Regression test for the v14 crash: Dragonbane's ActorSheetV2 migration
  // changed _onSkillRoll's signature from (event) to (event, target), and
  // target.closest(...) is called unconditionally. Calling _onSkillRoll
  // with only one argument leaves `target` undefined and throws.
  it("passes the button's own element as the second argument to _onSkillRoll", async () => {
    (global as any).game.settings.get = vi.fn(() => false); // groupSpellsByRank: flat list

    const mockOnSkillRoll = vi.fn();
    const mockActor = {
      sheet: { _onSkillRoll: mockOnSkillRoll },
    };
    const mockSpellItem = {
      name: "Firebolt",
      system: { rank: 1 },
    };

    const spellsButton = new DragonbaneSpellsButton([mockSpellItem]);
    const panel: any = await spellsButton._getPanel();
    const spellButton = panel.buttons[0];

    spellButton.actor = mockActor;
    spellButton.element = { dataset: {} };

    const mockEvent = { preventDefault: vi.fn() };
    await spellButton._onLeftClick(mockEvent);

    expect(mockOnSkillRoll).toHaveBeenCalledTimes(1);
    const [eventArg, targetArg] = mockOnSkillRoll.mock.calls[0];
    expect(targetArg).toBe(spellButton.element);
    expect(targetArg).toBeDefined();
    expect(eventArg.currentTarget).toBe(spellButton.element);
  });
});
