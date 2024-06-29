import { loadAvatars, avatarTextures } from "./avatars";
import { loadCommonTextures, hintArrows } from "./commonTextures";
import { loadCornerSelections, cornerSelections } from "./cornerSelections";
import { loadCrystals, crystalTextures, swordCrystalTextures, damageTextures } from "./crystals";
import { loadFont, mapFontChar } from "./fonts";
import { loadMenu, menuTexture, barTextures } from "./menu";
import { loadStars, starTextures } from "./stars";
import { loadTilesAndExplosions } from "./tilesAndExplosions";
import { loadWinLoseTextures, winTextures, loseTextures } from "./winLose";

export {
  avatarTextures,
  hintArrows,
  cornerSelections,
  crystalTextures,
  swordCrystalTextures,
  damageTextures,
  mapFontChar,
  menuTexture,
  barTextures,
  starTextures,
  winTextures,
  loseTextures,
};

export const loadTextures = () => {
  return Promise.all([
    loadTilesAndExplosions(),
    loadCornerSelections(),
    loadCommonTextures(),
    loadMenu(),
    loadAvatars(),
    loadFont(),
    loadStars(),
    loadCrystals(),
    loadWinLoseTextures(),
  ]);
};
