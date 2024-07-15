import { ENEMIES, SCREEN_HEIGHT, SCREEN_WIDTH, base } from "@/configs/consts";
import { GameState } from "@/extensions";
import { avatarTextures } from "@/textures";
import { IGame, IGameStateType } from "@/types";

export class SelectStageState extends GameState<IGame, IGameStateType> {
  constructor(parent: IGame) {
    super(parent, "SELECT_STAGE");
  }

  /**
   * Hiển thị
   */
  render() {
    base.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ENEMIES.forEach((e, i) => {
      base.context.drawImage(avatarTextures[e.avatar][0], (i % 4) * 80 + 40, Math.floor(i / 4) * 80 + 40);
    });
  }

  /**
   * Cập nhật
   */
  update() {}

  onClick(e: MouseEvent): void {
    this.parent.stateManager.changeState("IN_GAME");
  }
}
