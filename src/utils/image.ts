import { SCALE_RATIO, TILE_LENGTH } from "@/configs/consts";
import { getImageSrc } from "@/utils/common";

export const loadTexture = (src: string) => {
  const image = new Image();
  image.src = getImageSrc(src);
  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

export const getCropImage = (image: HTMLImageElement, pos: number) => {
  const width = Math.floor((image.width / TILE_LENGTH) * SCALE_RATIO);
  const height = Math.floor(image.height * SCALE_RATIO);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;

  const newPosition = (image.width / TILE_LENGTH) * pos;
  const newWidth = image.width / TILE_LENGTH;

  context.drawImage(image, newPosition, 0, newWidth, image.height, 0, 0, width, height);

  const image2 = new Image();
  image2.src = canvas.toDataURL("image/png");

  return new Promise<HTMLImageElement>((res) => (image2.onload = () => res(image2)));
};
