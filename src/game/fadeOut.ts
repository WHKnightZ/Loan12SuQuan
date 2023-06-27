import { base, CELL_SIZE, mapTileInfo, MAP_WIDTH, MAP_WIDTH_1, TILE_SIZE } from "@/configs/consts";
import { GameStateFunction } from "@/types";
import { clamp } from "@/utils/math";

const getScale = (x: number, y: number, tFade: number) => clamp((x + y + 1) * 3 + 7 - tFade, 0, 10) / 10;

const fadeOutStateFunction: GameStateFunction = {
  render: (self) => {
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        const x = j * CELL_SIZE;
        const y = i * CELL_SIZE;

        const scale = getScale(j, i, self.tFade);
        const size = Math.floor(TILE_SIZE * scale);
        const offset = Math.floor((CELL_SIZE - size) / 2);

        if (size === 0) continue;

        base.context.drawImage(mapTileInfo[base.map[i][j]].texture, x + offset, y + offset, size, size);
      }
    }
  },
  update: (self) => {
    self.tFade += 1;

    if (getScale(MAP_WIDTH_1, MAP_WIDTH_1, self.tFade) !== 0) return;

    for (let i = 0; i < MAP_WIDTH; i += 1) self.fall[i] = { list: [], below: MAP_WIDTH_1, pushCount: 0 };
    self.state = "FADE_IN";
    self.tFade = 0;
  },
};

export default fadeOutStateFunction;
