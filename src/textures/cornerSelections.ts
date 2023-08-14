import { CELL_SIZE } from "@/configs/consts";
import { flipHorizontal, flipVertical } from "@/utils/canvas";
import { getImageSrc } from "@/utils/common";

export let cornerSelections: {
  texture: HTMLImageElement;
  position: { x: number; y: number };
  offset: { x: number; y: number };
}[] = [];

export const loadCornerSelections = () => {
  cornerSelections = [];

  let cornerTopLeft = new Image();
  cornerTopLeft.src = getImageSrc("selection/corner");

  return new Promise((res) => {
    cornerTopLeft.onload = async () => {
      const cornerTopRight = await flipHorizontal(cornerTopLeft);
      const cornerBottomLeft = await flipVertical(cornerTopLeft);
      const cornerBottomRight = await flipVertical(cornerTopRight);

      const size = cornerTopLeft.width;

      const right = CELL_SIZE - size;

      cornerSelections.push({ texture: cornerTopLeft, position: { x: 0, y: 0 }, offset: { x: 1, y: 1 } });
      cornerSelections.push({ texture: cornerTopRight, position: { x: right, y: 0 }, offset: { x: -1, y: 1 } });
      cornerSelections.push({ texture: cornerBottomLeft, position: { x: 0, y: right }, offset: { x: 1, y: -1 } });
      cornerSelections.push({ texture: cornerBottomRight, position: { x: right, y: right }, offset: { x: -1, y: -1 } });

      res(null);
    };
  });
};
