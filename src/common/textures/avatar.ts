import { flipHorizontal, resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/image";

const COUNT_AVATARS = 2;

export const avatarTextures = Array.from({ length: COUNT_AVATARS }).map(() => [null, null]) as HTMLImageElement[][];

export const loadAvatars = async () => {
  await Promise.all(
    avatarTextures.map(
      (_, index) =>
        new Promise((res) => {
          loadTexture(`avatars/${index}`)
            .then((img) => resize(img, 2))
            .then((img) => {
              avatarTextures[index][1] = img;
              res(null);
            });
        })
    )
  );

  return Promise.all(
    avatarTextures.map(
      (i) =>
        new Promise((res) => {
          flipHorizontal(i[1]).then((img) => {
            i[0] = img;
            res(null);
          });
        })
    )
  );
};
