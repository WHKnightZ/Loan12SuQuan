import { base, CELL_SIZE, SCREEN_HEIGHT, TIMER_HINT_DELAY_DEFAULT } from "@/configs/consts";
import { hintArrows, menuButtons } from "@/textures";
import { IDirection, IInGameStateType, IMouseEvent } from "@/types";
import { FlickeringText } from "@/effects";
import { IInGameState } from "../types";
import { GameState } from "@/extensions";
import { MENU_BUTTON_OFFSET, MENU_BUTTON_SIZE } from "@/textures/commonTextures";
import { Button } from "@/elements/button";

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
  private btnMenu: Button;

  constructor(parent: IInGameState) {
    super(parent, "IDLE");

    this.btnMenu = new Button({
      x: MENU_BUTTON_OFFSET,
      y: SCREEN_HEIGHT - MENU_BUTTON_SIZE - MENU_BUTTON_OFFSET,
      w: MENU_BUTTON_SIZE,
      h: MENU_BUTTON_SIZE,
      texture: menuButtons,
      sx: 0,
      sy: 0,
      sw: MENU_BUTTON_SIZE,
      sh: MENU_BUTTON_SIZE,
    });
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
    this.btnMenu.render();

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
    this.btnMenu.visible = this.parent.playerTurn === 0;

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
    switch (e.key) {
      case "Enter":
        this.parent.stateManager.changeState("SELECT_ITEM");
        break;

      case "Escape":
        this.parent.fadeOut();
        break;
    }
  }

  onMouseDown(e: IMouseEvent) {
    if (this.btnMenu.contain(e)) this.parent.stateManager.changeState("SELECT_ITEM");
  }
}
