import { base } from "@/configs/consts";
import { GamePlugin } from "@/extensions";
import { IInGameState } from "../types";

/**
 * Điều khiển máy khi trạng thái parent là IDLE
 */
export class ComputerPlugin extends GamePlugin<IInGameState> {
  constructor(parent: IInGameState) {
    super(parent);
  }

  update() {
    if (!this.active) return;

    const parent = this.parent;

    this.timer += 1;

    if (this.timer === 70) {
      // Đợi để click lần 1: select
      const { x0, y0 } = parent.matchedPositions[parent.hintIndex];

      parent.selected = { x: x0, y: y0, value: base.map[y0][x0] };
      base.map[y0][x0] = -1;
      parent.stateManager.changeState("SELECT");
    } else if (this.timer === 100) {
      // Đợi để click lần 2: swap
      const { x1, y1 } = parent.matchedPositions[parent.hintIndex];
      parent.swapped = { x: x1, y: y1, value: base.map[y1][x1] };
      base.map[y1][x1] = -1;

      this.stop();
    }
  }
}
