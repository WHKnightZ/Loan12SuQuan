import { CHARACTERS, getKeys } from "@/configs/consts";
import { ICharacterId } from "@/types";
import { flipHorizontal, resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export const avatarTextures = {} as { [key in ICharacterId]: HTMLImageElement[] };

export const loadAvatars = async () => {
  return await Promise.all(
    getKeys(CHARACTERS).map(
      (key) =>
        new Promise(async (res) => {
          const img = await loadTexture(`avatars/${key}`);
          const imgR = await resize(img, 2);
          const imgL = await flipHorizontal(imgR);
          avatarTextures[key] = [imgL, imgR];
          res(null);
        })
    )
  );
};
