import { loadAvatars, avatarTextures } from "./avatars";
import { loadBackgroundTextures, backgroundTextures } from "./backgrounds";
import { loadCommonTextures, hintArrows } from "./commonTextures";
import { loadCornerSelections, cornerSelections } from "./cornerSelections";
import { loadCrystals, crystalTextures, swordCrystalTextures, damageTextures } from "./crystals";
import { loadFonts, fontTextures } from "./fonts";
import { loadFrames, selectItemsFrameTexture } from "./frames";
import { loadMenu, menuTexture, barTextures } from "./menu";
import { loadPowerAttackTextures, powerAttackTextures } from "./powerAttack";
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
  fontTextures,
  menuTexture,
  barTextures,
  starTextures,
  winTextures,
  loseTextures,
  powerAttackTextures,
  selectItemsFrameTexture,
  backgroundTextures,
};

export const loadTextures = () => {
  return Promise.all([
    loadTilesAndExplosions(),
    loadCornerSelections(),
    loadCommonTextures(),
    loadMenu(),
    loadAvatars(),
    loadFonts(),
    loadStars(),
    loadCrystals(),
    loadWinLoseTextures(),
    loadPowerAttackTextures(),
    loadFrames(),
    loadBackgroundTextures(),
  ]);
};
