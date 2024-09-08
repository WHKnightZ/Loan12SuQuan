import { CELL_SIZE } from "@/configs/consts";
import { IHintArrow } from "@/game/states/inGame/types";
import { IDirection } from "@/types";
import { rotateCW90 } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export const hintArrows: {
  [key in IDirection]: IHintArrow;
} = {} as any;

export const MENU_BUTTON_SIZE = 14;
export const MENU_BUTTON_OFFSET = 5;

export let menuButtons = null as HTMLImageElement;

export const loadCommonTextures = async () => {
  let image = await loadTexture("common/hint-arrow");

  hintArrows.UP = {
    offset: { x: (CELL_SIZE - image.width) / 2, y: -6 },
    texture: image,
    drt: { x: 0, y: -1 },
  };
  image = await rotateCW90(image);
  hintArrows.RIGHT = {
    offset: { x: CELL_SIZE - image.width + 6, y: (CELL_SIZE - image.height) / 2 },
    texture: image,
    drt: { x: 1, y: 0 },
  };
  image = await rotateCW90(image);
  hintArrows.DOWN = {
    offset: { x: (CELL_SIZE - image.width) / 2, y: CELL_SIZE - image.height + 6 },
    texture: image,
    drt: { x: 0, y: 1 },
  };
  image = await rotateCW90(image);
  hintArrows.LEFT = {
    offset: { x: -6, y: (CELL_SIZE - image.height) / 2 },
    texture: image,
    drt: { x: -1, y: 0 },
  };

  menuButtons = await loadTexture("common/menu-buttons");
};
