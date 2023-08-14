import { getCropImage, loadTexture } from "@/utils/image";

export let bloodTextures: HTMLImageElement[] = [];

export const loadBloods = async () => {
  const texture = await loadTexture("common/bloodthrowaround");

  const promises: Promise<any>[] = [];

  for (let pos = 0; pos < 5; pos++) {
    promises.push(getCropImage(texture, pos).then((img) => (bloodTextures[pos] = img)));
  }
  return Promise.all(promises);
};
