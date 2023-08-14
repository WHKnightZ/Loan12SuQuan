import { base } from "@/configs/consts";
import { Effect } from "./effect";
import { random } from "@/utils/common";
import { animate } from "@/utils/math";
import { crystalTextures } from "@/textures";

const COUNT = 3;

const BASE_LIST = Array.from({ length: COUNT });

export class GainTile extends Effect {
  tile: number;
  maxTimer: number;
  halfSize: number;
  list: {
    x: number;
    y: number;
    startX: number;
    startY: number;
    distanceX: number;
    distanceY: number;
    timer: number;
    frame: number;
    alive: boolean;
  }[];

  constructor({
    tile,
    startX,
    startY,
    endX,
    endY,
  }: {
    tile: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) {
    super(startX, startY);
    this.tile = tile;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    this.maxTimer = Math.floor(Math.sqrt(distanceX * distanceX + distanceY * distanceY) / 8) + 15;
    this.halfSize = Math.floor(crystalTextures[this.tile][0].width / 2);

    this.list = BASE_LIST.map(() => {
      const x = startX + random(-70, 70);
      const y = startY + random(-70, 70);
      const newEndX = endX + random(-30, 30);
      const newEndY = endY + random(5, 35);
      const distanceX = newEndX - x;
      const distanceY = newEndY - y;

      return {
        x,
        y,
        startX: x,
        startY: y,
        distanceX,
        distanceY,
        timer: random(-20, -1),
        frame: -1,
        alive: false,
      };
    });
  }

  render() {
    this.list.forEach(({ alive, frame, x, y }) => {
      if (!alive) return;

      base.context.drawImage(crystalTextures[this.tile][frame], x - this.halfSize, y - this.halfSize);
    });
  }

  update() {
    let countDead = 0;

    this.list.forEach((item) => {
      item.timer += 1;

      if (item.timer < 0) return;
      if (item.timer === 0) item.alive = true;

      const t = animate(item.timer / this.maxTimer);

      item.x = item.startX + t * item.distanceX;
      item.y = item.startY + t * item.distanceY;

      if (item.timer % 4 === 0) item.frame = (item.timer / 4) % 6;
      if (item.timer >= this.maxTimer) {
        item.alive = false;
        countDead += 1;
      }
    });

    if (countDead === COUNT) this.isAlive = false;
  }
}
