import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export let selectItemsFrameTexture: HTMLImageElement;

const WIDTH = 176;
const HEIGHT = 180;
const OFFSET_BACKGROUND = 4;
const OFFSET_V_FRAME_X = 3;
const OFFSET_V_FRAME_Y = 27;

export const loadFrames = async () => {
  const [frame1Horizontal, frame1Vertical, frame1Divide, frame1Decor] = await Promise.all([
    loadTexture("frames/frame1-horizontal"),
    loadTexture("frames/frame1-vertical"),
    loadTexture("frames/frame1-divide"),
    loadTexture("frames/frame1-decor"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;

  const drawBackground = () => {
    const offset = OFFSET_BACKGROUND;
    context.fillStyle = "#773b75";
    context.fillRect(offset, offset, WIDTH - offset * 2, HEIGHT - offset * 2);
  };

  drawBackground();

  const drawFrameHorizontal = () => {
    const draw = () => context.drawImage(frame1Horizontal, 0, 0, WIDTH, frame1Horizontal.height);
    draw();
    context.save();
    context.translate(0, HEIGHT);
    context.scale(1, -1);
    draw();
    context.restore();
  };

  drawFrameHorizontal();

  const drawFrameVertical = () => {
    const offsetX = OFFSET_V_FRAME_X;
    const offsetY = OFFSET_V_FRAME_Y;
    const draw = () => context.drawImage(frame1Vertical, offsetX, offsetY, frame1Vertical.width, HEIGHT - offsetY * 2);

    draw();
    context.save();
    context.translate(WIDTH, 0);
    context.scale(-1, 1);
    draw();
    context.restore();
  };

  drawFrameVertical();

  const drawFrameDivide = () => {
    context.drawImage(frame1Divide, 8, 54, frame1Divide.width, frame1Divide.height);
  };

  drawFrameDivide();

  selectItemsFrameTexture = new Image();
  selectItemsFrameTexture.src = canvas.toDataURL();
  console.log(selectItemsFrameTexture.src);

  await new Promise<HTMLImageElement>((res) => {
    selectItemsFrameTexture.onload = () => res(null);
  });

  selectItemsFrameTexture = await resize(selectItemsFrameTexture, 2.5);
};
