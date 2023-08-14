// BEGIN: 5d2f1a8c6b3c
import { base, OPACITY_ZERO } from "@/configs/consts";
import { Blood } from "@/objects/blood";
import { Effect } from "./effect";

const COUNT_BLOODS = 5;

export class BloodThrowAround extends Effect {
  list: Blood[];
  speed: number = 0;
  show: boolean = true;

  constructor(x: number, y: number, player: number) {
    super(x, y);
    this.list = [];
    this.speed = 8;
    this.show = true;
    for (let i = 0; i < COUNT_BLOODS; i += 1) {
      const blood = new Blood(x, y, player);
      this.list.push(blood);
    }
  }

  render() {
    base.context.save();
    // base.context.globalAlpha = this.opacity;
    this.list.forEach((blood) => blood.render());
    base.context.restore();
  }
  update() {
    this.timer += 1;

    this.opacity -= 0.012;

    if (this.timer % Math.floor(this.speed) === 0) {
      this.timer = 0;
      this.speed -= 0.2;
      this.show = !this.show;
    }

    if (this.opacity < OPACITY_ZERO) this.isAlive = false;
  }
}
