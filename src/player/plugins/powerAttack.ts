import { base } from "@/configs/consts";
import { GamePlugin } from "@/plugins/plugin";
import { powerAttackTextures } from "@/textures";
import { IPlayer } from "@/types";

const MAX_FRAME = 3;

/**
 * Hiển thị hiệu ứng cuồng nộ
 */
export class PowerAttackPlugin extends GamePlugin<IPlayer> {
  private running: boolean;
  private frame: number;

  constructor(parent: IPlayer) {
    super(parent);

    this.running = false;
  }

  start() {
    this.running = true;
    this.timer = 0;
  }

  stop() {
    this.running = false;
  }

  render() {
    if (!this.running) return;

    const texture = powerAttackTextures[this.frame];
    const width = texture.width / MAX_FRAME;
    const height = texture.height;

    base.context.drawImage(
      texture,
      this.frame * width,
      0,
      width,
      height,
      this.parent.avatarOffset.x,
      this.parent.avatarOffset.y,
      width,
      height
    );
  }

  update() {
    if (!this.running) return;
  }
}
