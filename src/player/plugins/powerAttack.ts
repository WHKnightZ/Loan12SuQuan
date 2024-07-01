import { base } from "@/configs/consts";
import { GamePlugin } from "@/plugins/plugin";
import { powerAttackTextures } from "@/textures";
import { IPlayer, IPowerAttackPlugin } from "@/types";

const MAX_FRAME = 3;
const MAX_DELAY = 50;

/**
 * Hiển thị hiệu ứng cuồng nộ
 */
export class PowerAttackPlugin extends GamePlugin<IPlayer> implements IPowerAttackPlugin {
  private frame: number;
  private delay: number;

  allow: boolean;
  hasCausedDamage: boolean;

  constructor(parent: IPlayer) {
    super(parent);
  }

  start() {
    super.start();
    this.frame = this.delay = 0;
    this.allow = this.hasCausedDamage = false;
  }

  render() {
    if (!this.active || this.delay < MAX_DELAY) return;

    const player = this.parent;

    const texture = powerAttackTextures;
    const width = texture.width / MAX_FRAME;
    const height = texture.height;

    base.context.drawImage(
      texture,
      this.frame * width,
      0,
      width,
      height,
      player.avatarOffset.x + (player.avatarTexture.width - width) / 2,
      player.avatarOffset.y + player.avatarTexture.height - height + 1,
      width,
      height
    );
  }

  update() {
    if (!this.active) return;

    this.delay += 1;
    if (this.delay < MAX_DELAY) return;

    this.timer += 1;
    if (this.timer % 4 !== 0) return;

    this.frame += 1;
    if (this.frame === MAX_FRAME) this.frame = 0;
  }
}
