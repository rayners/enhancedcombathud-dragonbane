const ARGON = CONFIG.ARGON;

export default class DragonbaneMovementHud extends ARGON.MovementHud {
  get classes() {
    return [
      "movement-hud",
      "dragonbane-movement-hud",
      `dragonbane-${this.actor.type}`,
    ];
  }

  get visible() {
    return game.combat?.started;
  }

  get movementMax() {
    return this.actor.system.movement / canvas?.scene?.dimensions["distance"];
  }

  get movementColor() {
    return ["dragonbane-movement"];
  }
}
