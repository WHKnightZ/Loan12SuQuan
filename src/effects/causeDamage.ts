import { base } from "@/configs/consts";
import { Effect } from "./effect";
import { damageTextures } from "@/textures";

export class CauseDamage extends Effect {
  private frame: number;
  private halfWidth: number;
  private halfHeight: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.frame = 0;
    this.halfWidth = damageTextures[this.frame].width / 2;
    this.halfHeight = damageTextures[this.frame].height / 2;
  }

  render() {
    base.context.drawImage(damageTextures[this.frame], this.x - this.halfWidth, this.y - this.halfHeight);
  }

  update() {
    this.timer += 1;

    if (this.timer % 3 !== 0) return;

    this.frame += 1;

    if (this.frame > 4) this.alive = false;
  }
}
