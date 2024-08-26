import { CHARACTERS, getKeys } from "@/configs/consts";
import { ICharacterId } from "@/types";
import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export const avatarTextures = {} as { [key in ICharacterId]: HTMLImageElement };

export const loadAvatars = async () => {
  return await Promise.all(
    getKeys(CHARACTERS).map(
      (key) =>
        new Promise(async (res) => {
          const img = await loadTexture(`avatars/${key}`);
          avatarTextures[key] = await resize(img, 2);
          res(null);
        })
    )
  );
};
