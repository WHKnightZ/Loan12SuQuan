import { IGame } from "@/types";
import { loseTextures, winTextures } from "@/textures";
import { BOARD_CENTER, base } from "@/configs/consts";
import { GamePlugin } from "@/plugins/plugin";

const MAX_FRAME = 3;
const FINISH_DELAY = 120;

/**
 * Kết thúc game, hiển thị text Thắng hoặc Thua
 */
export class FinishPlugin extends GamePlugin<IGame> {
  private finishDelay: number;
  private finishFrame: number;
  private textures: HTMLImageElement[];
  private state: number;

  constructor(parent: IGame) {
    super(parent);
    this.textures = [winTextures, loseTextures];
  }

  start() {
    this.parent.isFinished = true;
    this.state = this.parent.winner;
    this.timer = this.finishDelay = this.finishFrame = 0;
  }

  render() {
    if (!this.parent.isFinished || this.finishDelay < FINISH_DELAY) return;

    const texture = this.textures[this.state];
    const width = texture.width / MAX_FRAME;
    const height = texture.height;

    base.context.drawImage(
      texture,
      this.finishFrame * width,
      0,
      width,
      height,
      BOARD_CENTER - width / 2,
      BOARD_CENTER - height / 2,
      width,
      height
    );
  }

  update() {
    if (!this.parent.isFinished) return;

    if (this.finishDelay < FINISH_DELAY) {
      this.finishDelay += 1;
      return;
    }

    this.timer += 1;
    if (this.timer % 3 != 0) return;

    this.finishFrame += 1;
    if (this.finishFrame === MAX_FRAME) this.finishFrame = MAX_FRAME - 1;
  }
}
