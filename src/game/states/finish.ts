import { IFinishGameState, IGame } from "@/types";
import { GameState } from "./gameState";
import { loseTextures, winTextures } from "@/textures";
import { BOARD_CENTER, base } from "@/configs/consts";

const MAX_FRAME = 3;
const FINISH_DELAY = 60;

/**
 * State kết thúc game, hiển thị text Thắng hoặc Thua
 */
export class FinishGameState extends GameState implements IFinishGameState {
  private finishDelay: number;
  private finishTimer: number;
  private finishFrame: number;
  private textures: HTMLImageElement[];
  private state: number;

  constructor(game: IGame) {
    super("FINISH", game);
    this.textures = [winTextures, loseTextures];
  }

  invoke() {
    this.finishDelay = this.finishTimer = this.finishFrame = 0;
  }

  win() {
    this.state = 0;
  }

  lose() {
    this.state = 1;
  }

  render() {
    if (this.finishDelay < FINISH_DELAY) return;

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
    if (this.finishDelay < FINISH_DELAY) {
      this.finishDelay += 1;
      return;
    }

    this.finishTimer += 1;
    if (this.finishTimer % 3 != 0) return;

    this.finishFrame += 1;
    if (this.finishFrame === MAX_FRAME) this.finishFrame = MAX_FRAME - 1;
  }
}
