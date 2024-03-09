const ARGON = CONFIG.ARGON;

class DragonbaneRallySelfButton extends ARGON.MAIN.BUTTONS.ActionButton {
  get icon() {
    return "modules/enhancedcombathud-dragonbane/icons/bugle-call.svg";
  }

  get label() {
    return game.i18n.localize(
      "enhancedcombathud-dragonbane.actions.rally-self",
    );
  }

  async _onLeftClick(event) {
    // Have to go through the character sheet for now
    // game.dragonbane.rollAttribute(this.actor, 'WIL', { manualBanes: 1 });
    this.actor.sheet._onAttributeRoll(event);
  }

  get visible() {
    return this.actor.system.hitPoints?.value === 0;
  }

  async _renderInner() {
    await super._renderInner();

    // embed the item id in the element for the left click handler to use
    this.element.dataset.attribute = "wil";
  }
}

export default class DragonbaneDyingActionsPanel extends ARGON.MAIN
  .ActionPanel {
  get classes() {
    return ["actions-container", "dragonbane-actions-container"];
  }
  get label() {
    return game.i18n.localize("enhancedcombathud-dragonbane.panels.dying");
  }

  get maxActions() {
    return this.currentActions;
  }

  get currentActions() {
    return this.actor.system.hitPoints?.value === 0 ? 1 : 0;
  }

  async _getButtons() {
    return [new DragonbaneRallySelfButton()];
  }

  // hacky, but it hides/shows it when the death state changes
  updateActionUse() {
    super.updateActionUse();
    this.updateVisibility();
  }
}
