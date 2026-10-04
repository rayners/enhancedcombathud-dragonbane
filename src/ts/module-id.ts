import { id } from "../module.json";

// TS infers a plain `string` type for JSON-imported string fields, but
// `game.settings.register`/`.get` (and the `SettingConfig` augmentation in
// enhancedcombathud-dragonbane.d.ts) key off of the literal namespace
// `"enhancedcombathud-dragonbane"`. This re-exports the same runtime value
// from module.json (so it can never drift from the module's actual id) with
// a literal type so those calls typecheck.
export const MODULE_NAME = id as "enhancedcombathud-dragonbane";
