import { CHARACTERS, getKeys } from "@/configs/consts";
import { ISkillId } from "@/types";
import { loadTexture } from "@/utils/common";

export const skillTextures = {} as { [key in ISkillId]: HTMLImageElement };

export const loadSkillTextures = async () => {
  const skills = getKeys(CHARACTERS).reduce((a, b) => [...a, ...CHARACTERS[b].skills], []);

  const promises: Promise<any>[] = skills.map((skill) =>
    loadTexture(`skills/${skill}`).then((img) => (skillTextures[skill] = img))
  );

  return Promise.all(promises);
};
