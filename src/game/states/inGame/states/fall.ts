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
import { GameState } from "@/extensions";
import { combine } from "@/utils/common";
import { IInGameState } from "../types";
import { IInGameStateType, ITileInfo } from "@/types";

/**
 * State tile rơi xuống sau khi phát nổ
 */
export class InGameFallState extends GameState<IInGameState, IInGameStateType> {
  constructor(parent: IInGameState) {
    super(parent, "FALL");
  }

  render() {
    const parent = this.parent;
    const fall = parent.fall;

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
    const parent = this.parent;
    let stillFalling = false; // Rơi đến khi nào fill toàn bộ các ô thì dừng
    const fall = parent.fall;

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

    // Nếu parent đã kết thúc thì bỏ qua bước check bên dưới
    if (parent.isFinished) {
      parent.wait(0, () => {});
      return;
    }

    // Nếu các cell đã được lấp đầy thì xuống bước check xem có ăn được tiếp combo x2, x3 ... không

    parent.matched4 = { turnCount: 0, matchedList: {} };
    parent.matched4Tiles = [];
    const tileInfos: ITileInfo[][] = [];
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        const { matched: m0, tiles: t0, matched4Tiles: m40 } = parent.matchPosition(j, i);
        if (m0) tileInfos.push(t0);
        if (m40.length) parent.matched4Tiles = parent.matched4Tiles.concat(m40);
      }
    }

    if (tileInfos.length) {
      parent.explodedTiles = combine(tileInfos);
      parent.explosions = [];
      parent.explodedTiles.forEach((tile) => {
        const { x, y } = tile;
        parent.gainTile(tile);
        parent.explosions.push({ x, y, value: base.map[y][x] });
      });
      parent.explode();
    } else {
      const activePlayer = parent.getActivePlayer();
      const activePlayerPowerAttack = activePlayer.powerAttackPlugin;

      if (activePlayerPowerAttack.active) {
        // Nếu đang ở trạng thái cuồng nộ mà gây sát thương thì reset trạng thái
        if (activePlayerPowerAttack.hasCausedDamage) {
          activePlayer.resetEnergy();
          base.game.createTimeout(() => activePlayerPowerAttack.stop(), 12);
        } else {
          // Cho phép cuồng nộ hoạt động sau khi qua một lượt
          activePlayerPowerAttack.allow = true;
        }
      }

      parent.findAllMatchedPositions();
      parent.stateManager.changeState("IDLE");
    }
  }
}
