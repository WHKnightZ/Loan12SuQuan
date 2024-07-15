import { base, CELL_SIZE, CELL_SIZE_HALF, getKeys, mapTileInfo, TILES, VELOCITY_BASE } from "@/configs/consts";
import { findBelow, randomTile } from "@/utils/common";
import { FloatingText, StarExplosion, SwordAttack } from "@/effects";
import { GameState } from "@/extensions";
import { IInGameState } from "../types";
import { IInGameStateType } from "@/types";

/**
 * State phát nổ khi ăn được 3 trên một hàng
 */
export class InGameExplodeState extends GameState<IInGameState, IInGameStateType> {
  private explodeTimer: number;
  private explodeFrame: number;

  constructor(parent: IInGameState) {
    super(parent, "EXPLODE");
  }

  init() {
    const parent = this.parent;

    this.explodeTimer = 0;
    this.explodeFrame = 0;

    parent.explosions.forEach(({ x, y }) => (base.map[y][x] = -1));

    const center = parent.explosions.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });

    if (parent.explosions.some(({ value }) => value === TILES.SWORD || value === TILES.SWORDRED)) {
      // Tạo hiệu ứng kiếm cắm xuống người chơi bị tấn công
      base.game.createEffect(new SwordAttack(parent.getActivePlayer(), parent.getPassivePlayer()));
    }

    parent.turnCount += parent.matched4.turnCount;

    const x = center.x / parent.explosions.length;
    const y = center.y / parent.explosions.length;
    parent.combo += 1;
    const effectX = x * CELL_SIZE + CELL_SIZE_HALF;
    const effectY = y * CELL_SIZE + CELL_SIZE_HALF;

    if (parent.combo < 2) return;

    // Tạo hiệu ứng toả sao khi được combo x2 trở lên
    base.game.createEffect(new FloatingText({ text: `x${parent.combo}`, x: effectX, y: effectY + 8 }));
    base.game.createEffect(new StarExplosion(effectX, effectY));
  }

  render() {
    const parent = this.parent;

    parent.explosions.forEach(({ x, y, value }) => {
      const texture = mapTileInfo[value].explosions[this.explodeFrame];
      base.context.drawImage(
        texture,
        x * CELL_SIZE + Math.floor((CELL_SIZE - texture.width) / 2),
        y * CELL_SIZE + Math.floor((CELL_SIZE - texture.height) / 2)
      );
    });
  }

  update() {
    const parent = this.parent;

    this.explodeTimer += 1;
    if (this.explodeTimer % 2) return;

    this.explodeFrame += 1;
    if (this.explodeFrame !== 4) return;

    this.explodeFrame = 0;
    parent.stateManager.changeState("FALL");

    parent.fall = {};

    const fall = parent.fall;

    parent.explodedTiles.forEach(({ x, y }) => {
      base.map[y][x] = -1;
      if (parent.fall[x]) {
        !fall[x].list.find(({ x: x0, y: y0 }) => x0 === x && y0 === y) &&
          fall[x].list.push({ x, y, velocity: 0, offset: 0, value: -1 });
      } else fall[x] = { list: [{ x, y, velocity: 0, offset: 0, value: -1 }], below: -1, pushCount: 0 };
    });

    getKeys(fall).forEach((key) => {
      fall[key].below = findBelow(fall[key].list);
      const needAdd = fall[key].list.length;
      fall[key].list = [];
      key = Number(key);

      for (let i = parent.fall[key].below; i >= 0; i -= 1) {
        if (base.map[i][key] !== -1) {
          fall[key].list.push({ x: key, y: i, velocity: VELOCITY_BASE, offset: 0, value: base.map[i][key] });
          base.map[i][key] = -1;
        }
      }

      for (let i = 0; i < needAdd; i += 1) {
        fall[key].list.push({ x: key, y: -1 - i, velocity: VELOCITY_BASE, offset: 0, value: randomTile() });
      }
    });
  }
}
