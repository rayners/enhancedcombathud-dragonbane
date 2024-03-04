const ARGON = CONFIG.ARGON;

export default class DragonbaneRestHud extends ARGON.ButtonHud {
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
