import {
  base,
  CELL_SIZE,
  cornerSelectionOffsets,
  CORNER_SELECTION_CYCLE,
  mapTileInfo,
  SWAP_DURATION,
  SWAP_OFFSET,
  TILE_OFFSET,
} from "@/configs/consts";
import { cornerSelections } from "@/textures";
import { IGameStateFunction } from "@/types";
import { combine } from "@/utils/common";

const selectStateFunction: IGameStateFunction = {
  render: (self) => {
    const offset = self.tSwap * SWAP_OFFSET;

    const { x: x0, y: y0, value: v0 } = self.selected;
    const { x: x1, y: y1, value: v1 } = self.swapped || self.selected;

    if (self.swapped)
      base.context.drawImage(
        mapTileInfo[v1].texture,
        x1 * CELL_SIZE + TILE_OFFSET + (x0 - x1) * offset,
        y1 * CELL_SIZE + TILE_OFFSET + (y0 - y1) * offset
      );

    base.context.drawImage(
      mapTileInfo[v0].texture,
      x0 * CELL_SIZE + TILE_OFFSET + (x1 - x0) * offset,
      y0 * CELL_SIZE + TILE_OFFSET + (y1 - y0) * offset
    );

    if (!self.swapped) {
      const offset = cornerSelectionOffsets[self.tSelect % CORNER_SELECTION_CYCLE];

      cornerSelections.forEach(({ texture, offset: o, position }) =>
        base.context.drawImage(
          texture,
          self.selected.x * CELL_SIZE + position.x + o.x * offset,
          self.selected.y * CELL_SIZE + position.y + o.y * offset
        )
      );
    }
  },
  update: (self) => {
    if (!self.swapped) {
      self.tSelect += 1;
      return;
    }

    self.tSwap += 1;
    if (self.tSwap <= SWAP_DURATION) return;

    self.tSwap = SWAP_DURATION;

    const { x: x0, y: y0, value: v0 } = self.selected;
    const { x: x1, y: y1, value: v1 } = self.swapped;

    base.map[y0][x0] = v0;
    base.map[y1][x1] = v1;

    self.swap(x0, y0, x1, y1);

    if (self.reswap) {
      self.reswap = false;
      self.selected = self.swapped = null;
      self.idle();
    } else {
      self.matched4 = { turnCount: 0, matchedList: {} };
      const { matched: m0, tiles: t0, matched4Tiles: m40 } = self.matchPosition(x0, y0);
      const { matched: m1, tiles: t1, matched4Tiles: m41 } = self.matchPosition(x1, y1);
      if (m0 || m1) {
        // Hoán đổi oke thì giảm 1 lượt
        self.turnCount -= 1;
        self.needUpdate = true;

        self.matched4Tiles = [].concat(m40, m41);

        self.selected = self.swapped = null;
        self.explodedTiles = combine([t0, t1]);
        self.explosions = [];
        self.explodedTiles.forEach((tile) => {
          const { x, y } = tile;
          self.gainTile(tile);
          self.explosions.push({ x, y, value: base.map[y][x] });
        });
        self.explode();
      } else {
        base.map[y0][x0] = -1;
        base.map[y1][x1] = -1;
        const tmpX = self.selected.x;
        const tmpY = self.selected.y;
        self.selected.x = self.swapped.x;
        self.selected.y = self.swapped.y;
        self.swapped.x = tmpX;
        self.swapped.y = tmpY;
        self.reswap = true;
        self.tSwap = 0;
      }
    }
  },
};

export default selectStateFunction;
