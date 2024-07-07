import { resize } from "@/utils/canvas";
import { loadTexture, waitLoadImage } from "@/utils/common";

export let selectItemsFrameTexture: HTMLImageElement;

const WIDTH = 236;
const HEIGHT = 236;
const OFFSET_BACKGROUND = 3;

export const loadFrames = async () => {
  const [cornerTop, cornerBottom, horizontalTop, horizontalBottom, vertical] = await Promise.all([
    loadTexture("frames/corner-top"),
    loadTexture("frames/corner-bottom"),
    loadTexture("frames/horizontal-top"),
    loadTexture("frames/horizontal-bottom"),
    loadTexture("frames/vertical"),
  ]);

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

  await waitLoadImage(selectItemsFrameTexture);
  selectItemsFrameTexture = await resize(selectItemsFrameTexture, 2);
};
