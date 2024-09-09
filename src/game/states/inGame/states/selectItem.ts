import { BOARD_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, base } from "@/configs/consts";
import { GameState } from "@/extensions";
import { menuButtons, selectItemFrameTexture, skillTextures } from "@/textures";
import { IInGameState } from "../types";
import { IInGameStateType, IMouseEvent } from "@/types";
import { MENU_BUTTON_OFFSET, MENU_BUTTON_SIZE } from "@/textures/commonTextures";
import { Button } from "@/elements/button";

/**
 * State chọn vật phẩm, kỹ năng
 */
export class InGameSelectItemState extends GameState<IInGameState, IInGameStateType> {
  private btnConfirm: Button;
  private btnCancel: Button;

  constructor(parent: IInGameState) {
    super(parent, "SELECT_ITEM");

    this.btnConfirm = new Button({
      x: MENU_BUTTON_OFFSET,
      y: SCREEN_HEIGHT - MENU_BUTTON_SIZE - MENU_BUTTON_OFFSET,
      w: MENU_BUTTON_SIZE,
      h: MENU_BUTTON_SIZE,
      texture: menuButtons,
      sx: MENU_BUTTON_SIZE,
      sy: 0,
      sw: MENU_BUTTON_SIZE,
      sh: MENU_BUTTON_SIZE,
    });

    this.btnCancel = new Button({
      x: SCREEN_WIDTH - MENU_BUTTON_SIZE - MENU_BUTTON_OFFSET,
      y: SCREEN_HEIGHT - MENU_BUTTON_SIZE - MENU_BUTTON_OFFSET,
      w: MENU_BUTTON_SIZE,
      h: MENU_BUTTON_SIZE,
      texture: menuButtons,
      sx: MENU_BUTTON_SIZE * 2,
      sy: 0,
      sw: MENU_BUTTON_SIZE,
      sh: MENU_BUTTON_SIZE,
    });
  }

  render() {
    this.btnConfirm.render();
    this.btnCancel.render();

    base.context.drawImage(
      selectItemFrameTexture,
      (BOARD_SIZE - selectItemFrameTexture.width) / 2,
      (BOARD_SIZE - selectItemFrameTexture.height) / 2 - 2
    );

    this.parent.getActivePlayer().attributes.skills.forEach((skill, index) => {
      base.context.drawImage(skillTextures[skill], 80 + index * 80, 40, 60, 60);
    });
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Esc") return;

    this.parent.stateManager.changeState("IDLE");
  }

  onMouseDown(e: IMouseEvent) {
    if (this.btnConfirm.contain(e)) {
      this.parent.stateManager.changeState("IDLE");
      return;
    }

    if (this.btnCancel.contain(e)) {
      this.parent.stateManager.changeState("IDLE");
    }
  }
}
