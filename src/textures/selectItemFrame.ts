import { IRectangle } from "@/types";
import { resize } from "@/utils/canvas";
import { loadTexture, waitLoadImage } from "@/utils/common";

export let selectItemFrameTexture: HTMLImageElement;

const WIDTH = 236;
const HEIGHT = 236;
const OFFSET_BACKGROUND = 3;
const OFFSET_DIVIDE = 80;

const vertical = { x: 20, y: 0, w: 3, h: 12 };
const cornerBottom = { x: 18, y: 20, w: 11, h: 9 };
const cornerTop = { x: 0, y: 20, w: 18, h: 19 };
const divideCenter = { x: 0, y: 12, w: 30, h: 5 };
const divideLeft = { x: 0, y: 0, w: 20, h: 7 };
const horizontalBottom = { x: 0, y: 17, w: 20, h: 3 };
const horizontalTop = { x: 0, y: 7, w: 20, h: 5 };

export const loadSelectItemFrame = async () => {
  const selectItemFrameSpriteSheet = await loadTexture("selectItem/frame");

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;

  const drawBackground = () => {
    const offset = OFFSET_BACKGROUND;
    context.fillStyle = "#774575";
    context.fillRect(offset, offset, WIDTH - offset * 2, HEIGHT - offset * 2);
  };

  drawBackground();

  const draw = (position: IRectangle, x: number, y: number, w: number, h: number) => {
    context.drawImage(selectItemFrameSpriteSheet, position.x, position.y, position.w, position.h, x, y, w, h);
  };

  const drawSide = () => {
    draw(cornerTop, 0, 0, cornerTop.w, cornerTop.h);
    draw(vertical, 2, cornerTop.h, vertical.w, HEIGHT - cornerTop.h - cornerBottom.h);
    draw(cornerBottom, 2, HEIGHT - cornerBottom.h, cornerBottom.w, cornerBottom.h);
    draw(divideLeft, 4, OFFSET_DIVIDE, divideLeft.w, divideLeft.h);
  };

  draw(horizontalTop, cornerTop.w, 2, WIDTH - 2 * cornerTop.w, horizontalTop.h);
  draw(horizontalBottom, cornerBottom.w, HEIGHT - 3, WIDTH - 2 * cornerBottom.w, horizontalBottom.h);
  draw(divideCenter, 4 + divideLeft.w, OFFSET_DIVIDE + 1, WIDTH - 2 * (4 + divideLeft.w), divideCenter.h);

  drawSide();
  context.save();
  context.translate(WIDTH, 0);
  context.scale(-1, 1);
  drawSide();
  context.restore();

  selectItemFrameTexture = new Image();
  selectItemFrameTexture.src = canvas.toDataURL();

  await waitLoadImage(selectItemFrameTexture);
  selectItemFrameTexture = await resize(selectItemFrameTexture, 2);
};
