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
    let stillFalling = false; // Rơi đến khi nào fill toàn bộ các ô thì dừng
    const fall = game.fall;

    getKeys(fall).forEach((col) => {
      const colData = fall[col]; // Danh sách các cell cần rơi của cột đang xét
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

      if (shift) colData.list.shift(); // Nếu có cell đã rơi xuống đúng vị trí thì ko xét cell này nữa
      if (colData.list.length) stillFalling = true; // Nếu còn ít nhất một cell chưa rơi xong thì lặp lại chu trình
    });

    if (stillFalling) return;

    // Nếu game đã kết thúc thì bỏ qua bước check bên dưới
    if (game.isFinished) {
      game.wait(0, () => {});
      return;
    }

    // Nếu các cell đã được lấp đầy thì xuống bước check xem có ăn được tiếp combo x2, x3 ... không

    game.matched4 = { turnCount: 0, matchedList: {} };
    game.matched4Tiles = [];
    const tileInfos: ITileInfo[][] = [];
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        const { matched: m0, tiles: t0, matched4Tiles: m40 } = game.matchPosition(j, i);
        if (m0) tileInfos.push(t0);
        if (m40.length) game.matched4Tiles = game.matched4Tiles.concat(m40);
      }
    }

    if (tileInfos.length) {
      game.explodedTiles = combine(tileInfos);
      game.explosions = [];
      game.explodedTiles.forEach((tile) => {
        const { x, y } = tile;
        game.gainTile(tile);
        game.explosions.push({ x, y, value: base.map[y][x] });
      });
      game.explode();
    } else {
      const activePlayer = game.getActivePlayer();
      const activePlayerPowerAttack = activePlayer.powerAttackPlugin;

      // Nếu đang ở trạng thái cuồng nộ mà gây sát thương thì reset trạng thái
      if (activePlayerPowerAttack.active && activePlayerPowerAttack.hasCausedDamage) {
        activePlayer.resetEnergy();
        game.createTimeout(() => activePlayerPowerAttack.stop(), 15);
      }

      game.findAllMatchedPositions();
      game.changeState("IDLE");
    }
  }
}
