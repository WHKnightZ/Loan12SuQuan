import {
  base,
  CELL_SIZE,
  GRAVITY,
  mapTileInfo,
  MAP_WIDTH,
  MAP_WIDTH_1,
  TILE_OFFSET,
  TILE_SIZE,
  TOTAL_TILES,
  VELOCITY_BASE,
  getKeys,
} from "@/configs/consts";
import { IGameStateFunction, IGame } from "@/types";
import { clamp } from "@/utils/math";

let fadeInDone: {
  x: number;
  y: number;
  offset: number;
  v: number;
  value: number;
}[] = [];

const getScale = (x: number, y: number, tFade: number) => clamp((x + y + 1) * 3 + 7 - tFade, 0, 10) / 10;

const fadeInRender = (self: IGame) => {
  const fall = self.fall;
  getKeys(fall).forEach((col) => {
    fall[col].list.forEach(({ x, y, value, offset }) => {
      base.context.drawImage(
        mapTileInfo[value].texture,
        x * CELL_SIZE + TILE_OFFSET,
        y * CELL_SIZE + TILE_OFFSET + offset
      );
    });
  });
  fadeInDone.forEach(({ x, y, value }) =>
    base.context.drawImage(mapTileInfo[value].texture, x * CELL_SIZE + TILE_OFFSET, y * CELL_SIZE + TILE_OFFSET)
  );
};

const fadeOutRender = (self: IGame) => {
  for (let i = 0; i < MAP_WIDTH; i += 1) {
    for (let j = 0; j < MAP_WIDTH; j += 1) {
      const x = j * CELL_SIZE;
      const y = i * CELL_SIZE;

      const scale = getScale(j, i, self.tFadeOut);
      const size = Math.floor(TILE_SIZE * scale);
      const offset = Math.floor((CELL_SIZE - size) / 2);

      if (size === 0) continue;

      base.context.drawImage(mapTileInfo[base.map[i][j]].texture, x + offset, y + offset, size, size);
    }
  }
};

const fadeInUpdate = (self: IGame) => {
  self.tFadeIn += 1;

  const fall = self.fall;

  for (let i = 0; i < MAP_WIDTH; i += 1) {
    let newTFade = self.tFadeIn - i * 3;
    if (newTFade < 1) newTFade = 1;

    if (newTFade % 6 === 0 && fall[i].pushCount! < MAP_WIDTH) {
      fall[i].list.push({
        x: i,
        y: -1,
        v: VELOCITY_BASE + 4,
        offset: 0,
        value: base.map[MAP_WIDTH_1 - fall[i].pushCount][i],
      });
      fall[i].pushCount += 1;
    }
  }

  getKeys(fall).forEach((col) => {
    const colData = fall[col];
    col = Number(col);

    let shift = false;

    colData.list.forEach((i, index) => {
      i.v += GRAVITY * 1.4;
      i.offset += i.v;
      const newY = i.y + Math.floor((i.offset + 6) / CELL_SIZE);

      if (index === 0) {
        if (newY >= colData.below) {
          shift = true;
          colData.below -= 1;
        }
      } else {
        if (i.offset >= colData.list[index - 1].offset - 6 || newY >= colData.below - index + 1) {
          i.v = VELOCITY_BASE;
          i.offset = Math.floor(i.offset / CELL_SIZE) * CELL_SIZE;
        }
      }
    });

    if (shift) {
      const i = colData.list.shift();
      i.y = colData.below + 1;
      fadeInDone.push(i);
      if (fadeInDone.length === TOTAL_TILES) {
        self.idle();
        fadeInDone = [];
        self.isFadeIn = self.isFadeOut = false;
      }
    }
  });
};

const fadeOutUpdate = (self: IGame) => {
  self.tFadeOut += 1;

  if (getScale(2, 2, self.tFadeOut) !== 0) return;

  if (self.isFadeIn) return;

  self.fadeIn();
};

const fadeStateFunction: IGameStateFunction = {
  render: (self) => {
    if (self.isFadeIn) fadeInRender(self);
    if (self.isFadeOut) fadeOutRender(self);
  },
  update: (self) => {
    if (self.isFadeIn) fadeInUpdate(self);
    if (self.isFadeOut) fadeOutUpdate(self);
  },
};

export default fadeStateFunction;
