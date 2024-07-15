import { base, CELL_SIZE, mapTileInfo, SWAP_DURATION, SWAP_OFFSET, TILE_OFFSET } from "@/configs/consts";
import { GameState } from "@/extensions";
import { cornerSelections } from "@/textures";
import { IGame, IInGameStateType } from "@/types";
import { combine } from "@/utils/common";
import { IInGameState } from "../types";

const CORNER_SELECTION_CYCLE = 30;

const cornerSelectionOffsets = Array.from({ length: CORNER_SELECTION_CYCLE }).map((_, i) =>
  Math.floor(3 * Math.sin((2 * Math.PI * i) / CORNER_SELECTION_CYCLE))
);

/**
 * State khi chọn một tile
 */
export class InGameSelectState extends GameState<IInGameState, IInGameStateType> {
  private selectTimer: number;
  private swapTimer: number;

  constructor(parent: IInGameState) {
    super(parent, "SELECT");
  }

  init() {
    this.selectTimer = 0;
    this.swapTimer = 0;
  }

  render() {
    const parent = this.parent;

    const offset = this.swapTimer * SWAP_OFFSET;

    const { x: x0, y: y0, value: v0 } = parent.selected;
    const { x: x1, y: y1, value: v1 } = parent.swapped || parent.selected;

    if (parent.swapped)
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

    if (!parent.swapped) {
      const offset = cornerSelectionOffsets[this.selectTimer % CORNER_SELECTION_CYCLE];

      cornerSelections.forEach(({ texture, offset: o, position }) =>
        base.context.drawImage(
          texture,
          parent.selected.x * CELL_SIZE + position.x + o.x * offset,
          parent.selected.y * CELL_SIZE + position.y + o.y * offset
        )
      );
    }
  }

  update() {
    const parent = this.parent;

    if (!parent.swapped) {
      this.selectTimer += 1;
      return;
    }

    this.swapTimer += 1;
    if (this.swapTimer <= SWAP_DURATION) return;

    this.swapTimer = SWAP_DURATION;

    const { x: x0, y: y0, value: v0 } = parent.selected;
    const { x: x1, y: y1, value: v1 } = parent.swapped;

    base.map[y0][x0] = v0;
    base.map[y1][x1] = v1;

    parent.swap(x0, y0, x1, y1);

    if (parent.reswap) {
      parent.reswap = false;
      parent.selected = parent.swapped = null;
      parent.stateManager.changeState("IDLE");
    } else {
      parent.matched4 = { turnCount: 0, matchedList: {} };
      const { matched: m0, tiles: t0, matched4Tiles: m40 } = parent.matchPosition(x0, y0);
      const { matched: m1, tiles: t1, matched4Tiles: m41 } = parent.matchPosition(x1, y1);

      if (m0 || m1) {
        // Hoán đổi oke thì giảm 1 lượt
        parent.turnCount -= 1;
        parent.isUpdatedTurnCount = true;

        parent.matched4Tiles = [].concat(m40, m41);

        parent.selected = parent.swapped = null;
        parent.explodedTiles = combine([t0, t1]);
        parent.explosions = [];

        parent.explodedTiles.forEach((tile) => {
          const { x, y } = tile;
          parent.gainTile(tile);
          parent.explosions.push({ x, y, value: base.map[y][x] });
        });

        parent.explode();
      } else {
        base.map[y0][x0] = -1;
        base.map[y1][x1] = -1;
        const tmpX = parent.selected.x;
        const tmpY = parent.selected.y;
        parent.selected.x = parent.swapped.x;
        parent.selected.y = parent.swapped.y;
        parent.swapped.x = tmpX;
        parent.swapped.y = tmpY;
        parent.reswap = true;
        this.swapTimer = 0;
      }
    }
  }
}
