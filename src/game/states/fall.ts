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
import { IFallGameState, IGame, ITileInfo } from "@/types";
import { combine } from "@/utils/common";
import { GameState } from "./gameState";

/**
 * State tile rơi xuống sau khi phát nổ
 */
export class FallGameState extends GameState implements IFallGameState {
  constructor(game: IGame) {
    super("FALL", game);
  }

  invoke() {}

  render() {
    const game = this.game;
    const fall = game.fall;
    getKeys(fall).forEach((col) => {
      fall[col].list.forEach(({ x, y, value, offset }) => {
        base.context.drawImage(
          mapTileInfo[value].texture,
          x * CELL_SIZE + TILE_OFFSET,
          y * CELL_SIZE + TILE_OFFSET + offset
        );
      });
    });
  }

  update() {
    const game = this.game;
    let newFalling = false;
    const fall = game.fall;
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

    game.matched4 = { turnCount: 0, matchedList: {} };
    game.matched4Tiles = [];
    const tt: ITileInfo[][] = [];
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        const { matched: m0, tiles: t0, matched4Tiles: m40 } = game.matchPosition(j, i);
        if (m0) tt.push(t0);
        if (m40.length) game.matched4Tiles = game.matched4Tiles.concat(m40);
      }
    }

    if (tt.length) {
      game.explodedTiles = combine(tt);
      game.explosions = [];
      game.explodedTiles.forEach((tile) => {
        const { x, y } = tile;
        game.gainTile(tile);
        game.explosions.push({ x, y, value: base.map[y][x] });
      });
      game.changeState("EXPLODE");
    } else {
      game.findAllMatchedPositions();
      game.changeState("IDLE");
    }
  }
}
