import { avatarTextures, loadAvatars } from "./avatar";
import { bloodTextures, loadBloods } from "./blood";
import {
  barTextures,
  cornerSelections,
  hintArrows,
  loadCommonTextures,
  loadCornerSelections,
  loadFont,
  loadMenu,
  mapFontChar,
  menuTexture,
} from "./common";
import { loadStars, starTextures } from "./star";
import { loadTilesAndExplosions } from "./tile";

export {
  avatarTextures,
  barTextures,
  bloodTextures,
  cornerSelections,
  hintArrows,
  mapFontChar,
  menuTexture,
  starTextures,
};
// All
export default () => {
  return Promise.all([
    loadTilesAndExplosions(),
    loadCornerSelections(),
    loadCommonTextures(),
    loadMenu(),
    loadAvatars(),
    loadFont(),
    loadBloods(),
    loadStars(),
    //
  ]);
};
