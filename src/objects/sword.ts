import { starTextures } from "@/common/textures";
import { base } from "@/configs/consts";

export class Sword {
  x: number;
  y: number;
  vx: number;
  vy: number;
  timer: number;
  animation: number;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.timer = 0;
    this.animation = 0;
  }

  render() {
    const texture = starTextures[this.animation];
    base.context.drawImage(texture, this.x - texture.width / 2, this.y - texture.height / 2);
  }

  update() {
    this.timer += 1;
    this.x += this.vx;
    this.y += this.vy;

    if (this.timer % 2 !== 0) return;

    this.animation += 1;
    if (this.animation === 4) this.animation = 0;
  }
}
