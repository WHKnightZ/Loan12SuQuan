import {
  base,
  CELL_SIZE,
  GRAVITY,
  mapTileInfo,
  MAP_WIDTH,
  TILE_OFFSET,
  VELOCITY_BASE,
  getKeys,
} from "@/configs/consts";
import { IGameStateFunction, ITileInfo } from "@/types";
import { combine } from "@/utils/common";

export const fallStateFunction: IGameStateFunction = {
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
  },
  update: (self) => {
    let newFalling = false;
    const fall = self.fall;
    getKeys(fall).forEach((col) => {
      const colData = fall[col];
      col = Number(col);

      let shift = false;

      colData.list.forEach((i, index) => {
        i.velocity += GRAVITY;
        i.offset += i.velocity;
        const newY = i.y + Math.floor((i.offset + 6) / CELL_SIZE);

        if (index === 0) {
          if (newY >= colData.below) {
            shift = true;
            base.map[colData.below][col] = i.value;
            colData.below -= 1;
          }
        } else {
          if (i.offset >= colData.list[index - 1].offset - 6 || newY >= colData.below - index + 1) {
            i.velocity = VELOCITY_BASE;
            i.offset = Math.floor(i.offset / CELL_SIZE) * CELL_SIZE;
          }
        }
      });

      if (shift) colData.list.shift();
      if (colData.list.length) newFalling = true;
    });

    if (newFalling) return;

    self.matched4 = { turnCount: 0, matchedList: {} };
    self.matched4Tiles = [];
    const tt: ITileInfo[][] = [];
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        const { matched: m0, tiles: t0, matched4Tiles: m40 } = self.matchPosition(j, i);
        if (m0) tt.push(t0);
        if (m40.length) self.matched4Tiles = self.matched4Tiles.concat(m40);
      }
    }

    if (tt.length) {
      self.explodedTiles = combine(tt);
      self.explosions = [];
      self.explodedTiles.forEach((tile) => {
        const { x, y } = tile;
        self.gainTile(tile);
        self.explosions.push({ x, y, value: base.map[y][x] });
      });
      self.explode();
    } else {
      self.findAllMatchedPositions();
      self.idle();
    }
  },
};
