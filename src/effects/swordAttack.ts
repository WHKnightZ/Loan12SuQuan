import { base } from "@/configs/consts";
import { Effect } from "./effect";
import { swordCrystalTextures } from "@/common/textures";
import { animate } from "@/utils/math";

const swords = [
  { delay: 20, x: 10, y: 0 },
  { delay: 10, x: 0, y: 10 },
  { delay: 0, x: 0, y: 0 },
];

const COUNT = swords.length;
const MAX_TIMER = 50;

export class SwordAttack extends Effect {
  playerIndex: number;
  halfSize: number;
  list: {
    x: number;
    y: number;
    startX: number;
    startY: number;
    distanceX: number;
    distanceY: number;
    timer: number;
    alive: boolean;
  }[];

  constructor(playerIndex: number, startX: number, startY: number, endX: number, endY: number) {
    super(0, 0);
    this.playerIndex = playerIndex;
    this.halfSize = swordCrystalTextures[0][2].width / 2;
    this.list = swords.map(({ x, y, delay }) => {
      const newStartX = x + startX;
      const newStartY = y + startY;
      const distanceX = endX - startX;
      const distanceY = endY - startY;
      return {
        x: newStartX,
        y: newStartY,
        startX: newStartX,
        startY: newStartY,
        timer: -1 - delay,
        alive: false,
        distanceX,
        distanceY,
      };
    });
  }

  render() {
    this.list.forEach(({ alive, x, y }) => {
      if (!alive) return;

      base.context.drawImage(swordCrystalTextures[this.playerIndex][2], x - this.halfSize, y - this.halfSize);
    });
  }

  update() {
    let countDead = 0;

    this.list.forEach((item) => {
      item.timer += 1;

      if (item.timer < 0) return;
      if (item.timer === 0) item.alive = true;

      const t = animate(item.timer / MAX_TIMER);

      item.x = item.startX + t * item.distanceX;
      item.y = item.startY + t * item.distanceY;

      if (item.timer >= MAX_TIMER) {
        item.alive = false;
        countDead += 1;
      }
    });

    if (countDead === COUNT) this.isAlive = false;
  }
}
