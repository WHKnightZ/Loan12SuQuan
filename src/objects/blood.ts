import { bloodTextures } from "@/common/textures";
import { base } from "@/configs/consts";

export class Blood {
  x: number;
  y: number;
  player: number;
  animation: number;

  constructor(x: number, y: number, player: number) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.animation = 0;
  }

  render() {
    const texture = bloodTextures[this.animation];
    base.context.drawImage(texture, this.x - texture.width / 2, this.y - texture.height / 2);
  }

  update() {
    this.animation += 1;
    if (this.animation === 5) this.animation = 0;
  }
}
