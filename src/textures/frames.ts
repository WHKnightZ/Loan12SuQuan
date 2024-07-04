import { BOARD_SIZE } from "@/configs/consts";
import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export let selectItemsFrameTexture: HTMLImageElement;

const WIDTH = 160;
const HEIGHT = 160;
const OFFSET_BACKGROUND = 3;

export const loadFrames = async () => {
  const [cornerTop, cornerBottom, horizontalTop, horizontalBottom, vertical] = await Promise.all([
    loadTexture("frames/corner-top"),
    loadTexture("frames/corner-bottom"),
    loadTexture("frames/horizontal-top"),
    loadTexture("frames/horizontal-bottom"),
    loadTexture("frames/vertical"),
    loadTexture("frames/frame1-divide"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;

  const drawBackground = () => {
    const offset = OFFSET_BACKGROUND;
    context.fillStyle = "#774b75";
    context.fillRect(offset, offset, WIDTH - offset * 2, HEIGHT - offset * 2);
  };

  drawBackground();

  const drawSide = () => {
    context.drawImage(cornerTop, 0, 0);
    context.drawImage(vertical, 2, cornerTop.height, vertical.width, HEIGHT - cornerTop.height - cornerBottom.height);
    context.drawImage(cornerBottom, 2, HEIGHT - cornerBottom.height);
  };

  context.drawImage(horizontalTop, cornerTop.width, 2, WIDTH - 2 * cornerTop.width, horizontalTop.height);
  context.drawImage(
    horizontalBottom,
    cornerBottom.width,
    HEIGHT - 3,
    WIDTH - 2 * cornerBottom.width,
    horizontalBottom.height
  );

  drawSide();
  context.save();
  context.translate(WIDTH, 0);
  context.scale(-1, 1);
  drawSide();
  context.restore();

  selectItemsFrameTexture = new Image();
  selectItemsFrameTexture.src = canvas.toDataURL();
  console.log(selectItemsFrameTexture.src);

  await new Promise<HTMLImageElement>((res) => {
    selectItemsFrameTexture.onload = () => res(null);
  });

  selectItemsFrameTexture = await resize(selectItemsFrameTexture, BOARD_SIZE / WIDTH);
};
