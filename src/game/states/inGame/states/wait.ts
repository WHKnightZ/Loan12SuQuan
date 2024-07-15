import { GameState } from "@/extensions";
import { IInGameState } from "../types";
import { IInGameStateType } from "@/types";

/**
 * State đợi, không làm gì cả, chờ 1 khoảng thời gian rồi thực hiện 1 action gì đó
 */
export class InGameWaitState extends GameState<IInGameState, IInGameStateType> {
  constructor(parent: IInGameState) {
    super(parent, "WAIT");
  }

  update() {
    const parent = this.parent;

    parent.waitProperties.timer += 1;
    if (parent.waitProperties.timer < parent.waitProperties.maxTimer) return;

    parent.waitProperties.callback();
  }
}
