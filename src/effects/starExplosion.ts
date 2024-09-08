import { base, EPSILON } from "@/configs/consts";
import { Star } from "@/elements/star";
import { Effect } from "./effect";

const COUNT_STARS = 20;

export class StarExplosion extends Effect {
  list: Star[];

  constructor(x: number, y: number) {
    super(x, y);
    this.list = [];
    for (let i = 0; i < COUNT_STARS; i += 1) {
      const angle = (Math.PI * 2 * i) / COUNT_STARS;
      this.list.push(new Star(x, y, 2 * Math.cos(angle), 2 * Math.sin(angle)));
    }
  }

  render() {
    base.context.save();
    base.context.globalAlpha = this.opacity;
    this.list.forEach((star) => star.render());
    base.context.restore();
  }

  update() {
    this.opacity -= 0.025;

    this.list.forEach((star) => star.update());

    if (this.opacity < EPSILON) this.alive = false;
  }
}
