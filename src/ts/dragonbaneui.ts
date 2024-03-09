import DragonbanePortraitPanel from "./dragonbane-portrait-panel";
import DragonbaneDrawerPanel from "./dragonbane-drawer-panel";
import DragonbaneMovementHud from "./dragonbane-movement-hud";
import DragonbaneWeaponSets from "./dragonbane-weapon-sets";
import DragonbaneMagicPanel from "./dragonbane-magic-panel";
import DragonbaneActionsPanel from "./dragonbane-actions-panel";
import DragonbaneDefensePanel from "./dragonbane-defense-panel";
import DragonbaneAttackPanel from "./dragonbane-attack-panel";
import DragonbaneRestHud from "./dragonbane-rest-hud";
import DragonbaneDyingPanel from "./dragonbane-dying-panel";

export function setupDragonbaneHud(CoreHUD): void {
  const ARGON = CoreHUD.ARGON;

  CoreHUD.definePortraitPanel(DragonbanePortraitPanel);
  CoreHUD.defineDrawerPanel(DragonbaneDrawerPanel);
  CoreHUD.defineMainPanels([
    DragonbaneAttackPanel,
    DragonbaneActionsPanel,
    DragonbaneDyingPanel,
    DragonbaneMagicPanel,
    DragonbaneDefensePanel,
    ARGON.PREFAB.PassTurnPanel,
  ]);
  CoreHUD.defineMovementHud(DragonbaneMovementHud);
  CoreHUD.defineWeaponSets(DragonbaneWeaponSets);
  CoreHUD.defineButtonHud(DragonbaneRestHud);
  CoreHUD.defineSupportedActorTypes(["character", "npc", "monster"]);
}
