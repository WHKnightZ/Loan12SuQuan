import { CELL_SIZE } from "@/configs/consts";
import { IDirection, IHintArrow } from "@/types";
import { resize, rotateCW90 } from "@/utils/canvas";
import { getImageSrc } from "@/utils/common";

export let hintArrows: {
  [key in IDirection]: IHintArrow;
} = {} as any;

export const loadCommonTextures = async () => {
  let image = new Image();
  image.src = getImageSrc("common/hint-arrow");

  await new Promise(
    (res) =>
      (image.onload = async () => {
        image = await resize(image, 2);
        res(null);
      })
  );

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
};
