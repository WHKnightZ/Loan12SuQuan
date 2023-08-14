import { base, OPACITY_ZERO } from "@/configs/consts";
import { Star } from "@/objects/star";
import { Effect } from "./effect";

const COUNT_STARS = 5;

export class StarFly extends Effect {
  list: Star[];

  constructor(x: number, y: number, targetX: number, targetY: number) {
    super(x, y);
    this.list = [];
    for (let i = 0; i < COUNT_STARS; i += 1) {
      const vx = (targetX - x) / 30;
      const vy = (targetY - y) / 30;

      const star = new Star(x, y, vx, vy);
      this.list.push(star);
    }
  }

  render() {
    base.context.save();
    base.context.globalAlpha = this.opacity;
    this.list.forEach((star) => star.render());
    base.context.restore();
  }

  update() {
    this.opacity -= 0.015;

    this.list.forEach((star) => star.update());

    if (this.opacity < OPACITY_ZERO) this.isAlive = false;
  }
}
