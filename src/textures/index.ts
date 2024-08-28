import { loadAvatars, avatarTextures } from "./avatars";
import { loadBackgroundTextures, backgroundTextures } from "./backgrounds";
import { loadCommonTextures, hintArrows, menuButtons } from "./commonTextures";
import { loadCornerSelections, cornerSelections } from "./cornerSelections";
import { loadCrystals, crystalTextures, swordCrystalTextures, damageTextures } from "./crystals";
import { loadFonts, fontTextures } from "./fonts";
import { loadFrames, selectItemsFrameTexture } from "./frames";
import { loadStatusBoard, statusBoardTexture, barTextures } from "./statusBoard";
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
  statusBoardTexture,
  barTextures,
  starTextures,
  winTextures,
  loseTextures,
  powerAttackTextures,
  selectItemsFrameTexture,
  backgroundTextures,
  menuButtons,
};

export const loadTextures = () => {
  return Promise.all([
    loadTilesAndExplosions(),
    loadCornerSelections(),
    loadCommonTextures(),
    loadStatusBoard(),
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
