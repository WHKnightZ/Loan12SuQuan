import { BOARD_SIZE, base } from "@/configs/consts";
import { GameState } from "@/extensions";
import { selectItemsFrameTexture } from "@/textures";
import { IInGameState } from "../types";
import { IInGameStateType } from "@/types";

/**
 * State chọn vật phẩm, kỹ năng
 */
export class InGameSelectItemState extends GameState<IInGameState, IInGameStateType> {
  constructor(parent: IInGameState) {
    super(parent, "SELECT_ITEM");
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Esc") return;

    this.parent.stateManager.changeState("IDLE");
  }

  render() {
    base.context.drawImage(
      selectItemsFrameTexture,
      (BOARD_SIZE - selectItemsFrameTexture.width) / 2,
      (BOARD_SIZE - selectItemsFrameTexture.height) / 2 - 2
    );
  }
}
