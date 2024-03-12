const ARGON = CONFIG.ARGON;

export default class DragonbaneWeaponSets extends ARGON.WeaponSets {
  // We aren't using it... yet
  async getDefaultSets() {
    return {};
  }
  // async _onSetChange({ sets, active }) {
  async _onSetChange() {}
}
