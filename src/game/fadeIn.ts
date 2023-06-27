import { base, CELL_SIZE, GRAVITY, mapTileInfo, MAP_WIDTH, TILE_OFFSET, VELOCITY_BASE } from "@/configs/consts";
import { GameStateFunction, TileInfo } from "@/types";
import { combine, getKeys, randomTile } from "@/utils/common";

const done: {
  x: number;
  y: number;
  offset: number;
  v: number;
  value: number;
}[] = [];

const fadeInStateFunction: GameStateFunction = {
  render: (self) => {
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
    done.forEach(({ x, y, value }) =>
      base.context.drawImage(mapTileInfo[value].texture, x * CELL_SIZE + TILE_OFFSET, y * CELL_SIZE + TILE_OFFSET)
    );
  },
  update: (self) => {
    self.tFade += 1;

    const fall = self.fall;

    for (let i = 0; i < MAP_WIDTH; i += 1) {
      if (self.tFade % (6 + i) === 0 && fall[i].pushCount! < MAP_WIDTH) {
        fall[i].list.push({ x: i, y: -1, v: VELOCITY_BASE + 5, offset: 0, value: randomTile() });
        fall[i].pushCount += 1;
      }
    }

    getKeys(fall).forEach((col) => {
      const colData = fall[col];
      col = Number(col);

      let shift = false;

      colData.list.forEach((i, index) => {
        i.v += GRAVITY;
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
        done.push(i);
      }
    });
  },
};

export default fadeInStateFunction;
