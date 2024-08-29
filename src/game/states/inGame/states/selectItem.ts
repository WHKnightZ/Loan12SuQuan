import { BOARD_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, base } from "@/configs/consts";
import { GameState } from "@/extensions";
import { menuButtons, selectItemsFrameTexture } from "@/textures";
import { IInGameState } from "../types";
import { IInGameStateType, IMouseEvent } from "@/types";
import { MENU_BUTTON_OFFSET, MENU_BUTTON_SIZE } from "@/textures/commonTextures";

/**
 * State chọn vật phẩm, kỹ năng
 */
export class InGameSelectItemState extends GameState<IInGameState, IInGameStateType> {
  constructor(parent: IInGameState) {
    super(parent, "SELECT_ITEM");
  }

  render() {
    const size = MENU_BUTTON_SIZE;
    const offset = MENU_BUTTON_OFFSET;
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    base.context.drawImage(menuButtons, size, 0, size, size, offset, h - size - offset, size, size);
    base.context.drawImage(menuButtons, size * 2, 0, size, size, w - size - offset, h - size - offset, size, size);

    base.context.drawImage(
      selectItemsFrameTexture,
      (BOARD_SIZE - selectItemsFrameTexture.width) / 2,
      (BOARD_SIZE - selectItemsFrameTexture.height) / 2 - 2
    );
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Esc") return;

    this.parent.stateManager.changeState("IDLE");
  }

  onMouseDown({ offsetX, offsetY }: IMouseEvent) {
    const offset = MENU_BUTTON_OFFSET - 4; // Expand 4 pixel
    const size = MENU_BUTTON_SIZE + 8; // Expand 4 pixel
    const h = SCREEN_HEIGHT;

    if (offsetX < offset || offsetX > offset + size || offsetY < h - offset - size || offsetY > h - offset) return;

    this.parent.stateManager.changeState("IDLE");
  }
}
