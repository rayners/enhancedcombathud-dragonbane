import { vi } from "vitest";

// Mock base classes from Argon Combat HUD
class MockArgonComponent {
  actor: any;
  token: any;
  constructor(actor?: any, token?: any) {
    this.actor = actor;
    this.token = token;
  }
  render() {}
  refresh() {}
}

class MockActionPanel extends MockArgonComponent {
  get classes() {
    return [];
  }
  get label() {
    return "";
  }
  async _getButtons() {
    return [];
  }
}

class MockActionButton {
  actor: any;
  token: any;

  constructor(actor?: any, token?: any) {
    this.actor = actor;
    this.token = token;
  }

  get classes() {
    return [];
  }
  get label() {
    return "";
  }
  get icon() {
    return "";
  }
  get hasTooltip() {
    return false;
  }
}

class MockItemButton extends MockActionButton {
  item: any;
  constructor(item?: any, actor?: any, token?: any) {
    super(actor, token);
    this.item = item;
  }
}

class MockButtonPanelButton extends MockActionButton {
  async _getPanel() {
    return null;
  }
}

class MockButtonPanel {
  buttons: any[];
  constructor({ buttons = [] } = {}) {
    this.buttons = buttons;
  }
}

class MockAccordionPanelCategory {
  label: string;
  buttons: any[];
  uses: any;
  constructor({ label = "", buttons = [], uses = null } = {}) {
    this.label = label;
    this.buttons = buttons;
    this.uses = uses;
  }
}

class MockAccordionPanel {
  accordionPanelCategories: any[];
  constructor({ accordionPanelCategories = [] } = {}) {
    this.accordionPanelCategories = accordionPanelCategories;
  }
}

class MockSplitButton {
  constructor(button1?: any, button2?: any) {}
}

class MockPortraitPanel extends MockArgonComponent {
  get classes() {
    return ["portrait-hud"];
  }
  get name() {
    return this.actor?.name || "";
  }
  get image() {
    return this.actor?.img || "";
  }
  get description() {
    return "";
  }
  get isDead() {
    return false;
  }
  get isDying() {
    return false;
  }
  async getStatBlocks() {
    return [];
  }
}

class MockMovementHud extends MockArgonComponent {
  get classes() {
    return ["movement-hud"];
  }
  get movementMax() {
    return 10;
  }
  get movementColor() {
    return ["base-movement"];
  }
}

// Setup global CONFIG object with ARGON structure
(global as any).CONFIG = {
  ARGON: {
    PORTRAIT: {
      PortraitPanel: MockPortraitPanel,
    },
    MovementHud: MockMovementHud,
    MAIN: {
      ActionPanel: MockActionPanel,
      BUTTONS: {
        ActionButton: MockActionButton,
        ItemButton: MockItemButton,
        ButtonPanelButton: MockButtonPanelButton,
        SplitButton: MockSplitButton,
      },
      BUTTON_PANELS: {
        ButtonPanel: MockButtonPanel,
        ACCORDION: {
          AccordionPanel: MockAccordionPanel,
          AccordionPanelCategory: MockAccordionPanelCategory,
        },
      },
    },
  },
};

// Mock game object
(global as any).game = {
  i18n: {
    localize: vi.fn((key: string) => key),
    format: vi.fn((key: string) => key),
  },
  settings: {
    get: vi.fn(),
    set: vi.fn(),
    register: vi.fn(),
  },
  modules: new Map(),
  system: {
    id: "dragonbane",
  },
  combat: null,
  canvas: {
    scene: {
      dimensions: {
        distance: 5,
      },
    },
  },
};

// Mock ui object
(global as any).ui = {
  notifications: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
};

// Mock canvas
(global as any).canvas = {
  scene: {
    dimensions: {
      distance: 5,
    },
  },
};

// Mock fromUuidSync - default to returning null, tests can override
(global as any).fromUuidSync = vi.fn(() => null);
