import { CHARACTERS, getKeys } from "@/configs/consts";
import { ICharacterId } from "@/types";
import { loadTexture } from "@/utils/common";

export const avatarTextures = {} as { [key in ICharacterId]: HTMLImageElement };

export const loadAvatars = async () => {
  return await Promise.all(
    getKeys(CHARACTERS).map(
      (key) =>
        new Promise(async (res) => {
          avatarTextures[key] = await loadTexture(`avatars/${key}`);
          res(null);
        })
    )
  );
};
