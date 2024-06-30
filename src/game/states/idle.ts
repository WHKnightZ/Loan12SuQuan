import { base, CELL_SIZE, TIMER_HINT_DELAY_DEFAULT } from "@/configs/consts";
import { hintArrows } from "@/textures";
import { IDirection, IGame, IIdleGameState } from "@/types";
import { GameState } from "./gameState";
import { FlickeringText } from "@/effects";

const HINT_ARROW_CYCLE = 30;

const hintArrowOffsets = Array.from({ length: HINT_ARROW_CYCLE }).map((_, i) =>
  Math.floor(3 * Math.sin((2 * Math.PI * i) / HINT_ARROW_CYCLE))
);

/**
 * State nghỉ, khi người chơi không làm gì cả
 */
export class IdleGameState extends GameState implements IIdleGameState {
  idleTimer: number;
  hintDelayTimer: number;

  constructor(game: IGame) {
    super("IDLE", game);
  }

  invoke() {
    const game = this.game;
    this.idleTimer = 0;
    this.hintDelayTimer = TIMER_HINT_DELAY_DEFAULT;
    this.game.combo = 0;

    // Chỉ show text, chuyển lượt chơi khi turn count update
    // Có trường hợp người chơi click xong huỷ, state chuyển về idle mà không có update gì
    if (game.isUpdatedTurnCount) {
      if (game.turnCount > 1) game.createEffect(new FlickeringText({ text: `Còn ${game.turnCount} lượt` }));
      else if (game.turnCount === 0) {
        game.changePlayer();
      }
    }
    game.isUpdatedTurnCount = false;

    game.hintIndex = game.players[game.playerTurn].getHintIndex(game.matchedPositions.length);

    if (game.playerTurn === 1) {
      // Computer
      game.computer.start();
    }
  }

  render() {
    if (this.hintDelayTimer > 0) return;

    const hint = this.game.matchedPositions[this.game.hintIndex];

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
}
