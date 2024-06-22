import { flipHorizontal, resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

const COUNT_AVATARS = 2;

export const avatarTextures = Array.from({ length: COUNT_AVATARS }).map(() => [null, null]) as HTMLImageElement[][];

export const loadAvatars = async () => {
  return await Promise.all(
    avatarTextures.map(
      (_, index) =>
        new Promise(async (res) => {
          let img = await loadTexture(`avatars/${index}`);
          img = await resize(img, 2);
          avatarTextures[index][1] = img;
          img = await flipHorizontal(img);
          avatarTextures[index][0] = img;
          res(null);
        })
    )
  );
};
