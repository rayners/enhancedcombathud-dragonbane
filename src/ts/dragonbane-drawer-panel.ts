
const ARGON = CONFIG.ARGON;

export default class DragonbaneDrawerPanel extends ARGON.DRAWER.DrawerPanel {
  get classes() {
    return ["ability-menu", "dragonbane-ability-menu"];
  }

  get title() {
    return "Skills & Abilities";
  }
}
