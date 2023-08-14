import { resize, rotate180, rotateCCW90, rotateCW90 } from "@/utils/canvas";
import { loadTexture } from "@/utils/image";

export let starTextures: HTMLImageElement[] = [];

export const loadStars = async () => {
  const texture = await loadTexture("common/star");
  starTextures[0] = await resize(texture, 2);

  const promises: Promise<any>[] = [];

  const t = starTextures[0];
  promises.push(rotateCW90(t).then((img) => (starTextures[1] = img)));
  promises.push(rotate180(t).then((img) => (starTextures[2] = img)));
  promises.push(rotateCCW90(t).then((img) => (starTextures[3] = img)));

  return Promise.all(promises);
};
