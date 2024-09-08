import { loadAvatarTextures, avatarTextures } from "./avatars";
import { loadBackgroundTextures, backgroundTextures } from "./backgrounds";
import { loadCommonTextures, hintArrows, menuButtons } from "./commonTextures";
import { loadCornerSelectionTextures, cornerSelections } from "./cornerSelections";
import { loadCrystalTextures, crystalTextures, swordCrystalTextures, damageTextures } from "./crystals";
import { loadFontTextures, fontTextures } from "./fonts";
import { loadSelectItemFrameTexture, selectItemFrameTexture } from "./selectItemFrame";
import { loadStatusBoardTexture, statusBoardTexture, barTextures } from "./statusBoard";
import { loadPowerAttackTextures, powerAttackTextures } from "./powerAttack";
import { loadStarTextures, starTextures } from "./stars";
import { loadTilesAndExplosionTextures } from "./tilesAndExplosions";
import { loadWinLoseTextures, winTextures, loseTextures } from "./winLose";
import { loadSkillTextures, skillTextures } from "./skills";

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
  selectItemFrameTexture,
  backgroundTextures,
  menuButtons,
  skillTextures,
};

export const loadTextures = () => {
  return Promise.all([
    loadTilesAndExplosionTextures(),
    loadCornerSelectionTextures(),
    loadCommonTextures(),
    loadStatusBoardTexture(),
    loadAvatarTextures(),
    loadFontTextures(),
    loadStarTextures(),
    loadCrystalTextures(),
    loadWinLoseTextures(),
    loadPowerAttackTextures(),
    loadSelectItemFrameTexture(),
    loadBackgroundTextures(),
    loadSkillTextures(),
  ]);
};
