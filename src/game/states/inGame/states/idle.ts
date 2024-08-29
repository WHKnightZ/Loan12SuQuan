import { base, CELL_SIZE, SCREEN_HEIGHT, TIMER_HINT_DELAY_DEFAULT } from "@/configs/consts";
import { hintArrows, menuButtons } from "@/textures";
import { IDirection, IInGameStateType, IMouseEvent } from "@/types";
import { FlickeringText } from "@/effects";
import { IInGameState } from "../types";
import { GameState } from "@/extensions";
import { MENU_BUTTON_OFFSET, MENU_BUTTON_SIZE } from "@/textures/commonTextures";

const HINT_ARROW_CYCLE = 30;

const hintArrowOffsets = Array.from({ length: HINT_ARROW_CYCLE }).map((_, i) =>
  Math.floor(3 * Math.sin((2 * Math.PI * i) / HINT_ARROW_CYCLE))
);

/**
 * State nghỉ, khi người chơi không làm gì cả
 */
export class InGameIdleState extends GameState<IInGameState, IInGameStateType> {
  private idleTimer: number;
  private hintDelayTimer: number;

  constructor(parent: IInGameState) {
    super(parent, "IDLE");
  }

  init() {
    const parent = this.parent;

    this.idleTimer = 0;
    this.hintDelayTimer = TIMER_HINT_DELAY_DEFAULT;
    this.parent.combo = 0;

    // Chỉ show text, chuyển lượt chơi khi turn count update
    // Có trường hợp người chơi click xong huỷ, state chuyển về idle mà không có update gì
    if (parent.isUpdatedTurnCount) {
      if (parent.turnCount > 1) base.game.createEffect(new FlickeringText({ text: `Còn ${parent.turnCount} lượt` }));
      else if (parent.turnCount === 0) {
        parent.changePlayer();
      }
    }
    parent.isUpdatedTurnCount = false;

    const activePlayer = parent.getActivePlayer();
    parent.hintIndex = activePlayer.getHintIndex(parent.matchedPositions.length);

    if (parent.playerTurn === 1) {
      // Computer
      parent.computerPlugin.start();
    }
  }

  render() {
    // Menu button
    if (this.parent.playerTurn === 0) {
      const size = MENU_BUTTON_SIZE;
      const offset = MENU_BUTTON_OFFSET;

      base.context.drawImage(menuButtons, 0, 0, size, size, offset, SCREEN_HEIGHT - size - offset, size, size);
    }

    if (this.hintDelayTimer > 0) return;

    const hint = this.parent.matchedPositions[this.parent.hintIndex];

    if (!hint) return;

    const { x0, y0, x1, y1 } = hint;

    let direction: IDirection = "UP";
    if (x1 > x0) direction = "RIGHT";
    else if (x1 < x0) direction = "LEFT";
    else if (y1 > y0) direction = "DOWN";

    const { texture, offset, drt } = hintArrows[direction];

    const offsetDrt = hintArrowOffsets[this.idleTimer % HINT_ARROW_CYCLE];

    base.context.drawImage(
      texture,
      x0 * CELL_SIZE + offset.x + drt.x * offsetDrt,
      y0 * CELL_SIZE + offset.y + drt.y * offsetDrt
    );
  }

  update() {
    if (this.hintDelayTimer > 0) {
      this.hintDelayTimer -= 1;
      return;
    }

    this.idleTimer += 1;
  }

  /**
   * Xử lý sự kiện nhấn phím
   */
  onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Enter") return;

    this.parent.stateManager.changeState("SELECT_ITEM");
  }
  // onKeyDown(e: KeyboardEvent) {
  //   this.stateManager.onKeyDown(e);

  //   switch (e.key) {
  //     case "Escape":
  //       this.fadeOut();
  //       break;
  //   }
  // }

  onMouseDown({ offsetX, offsetY }: IMouseEvent) {
    const offset = MENU_BUTTON_OFFSET - 4; // Expand 4 pixel
    const size = MENU_BUTTON_SIZE + 8; // Expand 4 pixel
    const h = SCREEN_HEIGHT;

    if (offsetX < offset || offsetX > offset + size || offsetY < h - offset - size || offsetY > h - offset) return;

    this.parent.stateManager.changeState("SELECT_ITEM");
  }
}
