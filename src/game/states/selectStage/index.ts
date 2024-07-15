import { SCREEN_HEIGHT, SCREEN_WIDTH, base } from "@/configs/consts";
import { GameState } from "@/extensions";
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
    base.context.font = "24px solid";
    base.context.strokeStyle = "green";
    base.context.strokeText("This Is Select Stage", 100, 100);
  }

  /**
   * Cập nhật
   */
  update() {}

  onClick(e: MouseEvent): void {
    this.parent.stateManager.changeState("IN_GAME");
  }
}
