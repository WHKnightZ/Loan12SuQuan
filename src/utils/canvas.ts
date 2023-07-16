export const flipHorizontal = (image: HTMLImageElement) => {
  const width = image.width;
  const height = image.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  context.translate(width, 0);
  context.scale(-1, 1);
  context.drawImage(image, 0, 0);

  image = new Image();
  image.src = canvas.toDataURL("image/png");

  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

export const flipVertical = (image: HTMLImageElement) => {
  const width = image.width;
  const height = image.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  context.translate(0, 0);
  context.scale(1, -1);
  context.drawImage(image, 0, -image.height);

  image = new Image();
  image.src = canvas.toDataURL("image/png");

  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

export const rotateCW90 = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.height;
  canvas.height = image.width;
  const cw = canvas.width;
  const ch = canvas.height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  context.translate(cw / 2, ch / 2);
  context.rotate(Math.PI / 2);
  context.drawImage(image, -ch / 2, -cw / 2);

  image = new Image();
  image.src = canvas.toDataURL("image/png");
  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

export const rotateCCW90 = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.height;
  canvas.height = image.width;
  const cw = canvas.width;
  const ch = canvas.height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  context.translate(cw / 2, ch / 2);
  context.rotate(-Math.PI / 2);
  context.drawImage(image, -ch / 2, -cw / 2);

  image = new Image();
  image.src = canvas.toDataURL("image/png");
  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

export const rotate180 = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const cw = canvas.width;
  const ch = canvas.height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  context.translate(cw / 2, ch / 2);
  context.rotate(Math.PI);
  context.drawImage(image, -cw / 2, -ch / 2);

  image = new Image();
  image.src = canvas.toDataURL("image/png");
  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

export const resize = (image: HTMLImageElement, ratio: number = 1) => {
  const width = Math.floor(image.width * ratio);
  const height = Math.floor(image.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;

  context.drawImage(image, 0, 0, width, height);

  const image2 = new Image();
  image2.src = canvas.toDataURL("image/png");

  return new Promise<HTMLImageElement>((res) => {
    image2.onload = () => res(image2);
  });
};
