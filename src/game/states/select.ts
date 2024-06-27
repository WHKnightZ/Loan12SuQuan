import { base, CELL_SIZE, mapTileInfo, SWAP_DURATION, SWAP_OFFSET, TILE_OFFSET } from "@/configs/consts";
import { cornerSelections } from "@/textures";
import { IGame, ISelectGameState } from "@/types";
import { combine } from "@/utils/common";
import { GameState } from "./gameState";

const CORNER_SELECTION_CYCLE = 30;

const cornerSelectionOffsets = Array.from({ length: CORNER_SELECTION_CYCLE }).map((_, i) =>
  Math.floor(3 * Math.sin((2 * Math.PI * i) / CORNER_SELECTION_CYCLE))
);

/**
 * State khi chọn một tile
 */
export class SelectGameState extends GameState implements ISelectGameState {
  private selectTimer: number;
  private swapTimer: number;

  constructor(game: IGame) {
    super("SELECT", game);
  }

  invoke() {
    this.selectTimer = 0;
    this.swapTimer = 0;
  }

  render() {
    const game = this.game;

    const offset = this.swapTimer * SWAP_OFFSET;

    const { x: x0, y: y0, value: v0 } = game.selected;
    const { x: x1, y: y1, value: v1 } = game.swapped || game.selected;

    if (game.swapped)
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

    if (!game.swapped) {
      const offset = cornerSelectionOffsets[this.selectTimer % CORNER_SELECTION_CYCLE];

      cornerSelections.forEach(({ texture, offset: o, position }) =>
        base.context.drawImage(
          texture,
          game.selected.x * CELL_SIZE + position.x + o.x * offset,
          game.selected.y * CELL_SIZE + position.y + o.y * offset
        )
      );
    }
  }

  update() {
    const game = this.game;

    if (!game.swapped) {
      this.selectTimer += 1;
      return;
    }

    this.swapTimer += 1;
    if (this.swapTimer <= SWAP_DURATION) return;

    this.swapTimer = SWAP_DURATION;

    const { x: x0, y: y0, value: v0 } = game.selected;
    const { x: x1, y: y1, value: v1 } = game.swapped;

    base.map[y0][x0] = v0;
    base.map[y1][x1] = v1;

    game.swap(x0, y0, x1, y1);

    if (game.reswap) {
      game.reswap = false;
      game.selected = game.swapped = null;
      game.changeState("IDLE");
    } else {
      game.matched4 = { turnCount: 0, matchedList: {} };
      const { matched: m0, tiles: t0, matched4Tiles: m40 } = game.matchPosition(x0, y0);
      const { matched: m1, tiles: t1, matched4Tiles: m41 } = game.matchPosition(x1, y1);

      if (m0 || m1) {
        // Hoán đổi oke thì giảm 1 lượt
        game.turnCount -= 1;

        game.matched4Tiles = [].concat(m40, m41);

        game.selected = game.swapped = null;
        game.explodedTiles = combine([t0, t1]);
        game.explosions = [];

        game.explodedTiles.forEach((tile) => {
          const { x, y } = tile;
          game.gainTile(tile);
          game.explosions.push({ x, y, value: base.map[y][x] });
        });

        game.explode();
      } else {
        base.map[y0][x0] = -1;
        base.map[y1][x1] = -1;
        const tmpX = game.selected.x;
        const tmpY = game.selected.y;
        game.selected.x = game.swapped.x;
        game.selected.y = game.swapped.y;
        game.swapped.x = tmpX;
        game.swapped.y = tmpY;
        game.reswap = true;
        this.swapTimer = 0;
      }
    }
  }
}
