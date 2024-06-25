import { base } from "@/configs/consts";
import { IComputer, IGame } from "@/types";

export class Computer implements IComputer {
  private game: IGame;

  timer: number;

  constructor(game: IGame) {
    this.game = game;
  }

  startTimer() {
    this.timer = 0;
  }

  update() {
    const game = this.game;
    if (game.playerTurn !== 1) return; // Người chơi có turn là 0, máy có turn là 1, không phải máy thì dừng

    this.timer += 1;

    if (this.timer === 70) {
      // Đợi để click lần 1: select
      game.tSwap = 0;
      const { x0, y0 } = game.matchedPositions[game.hintIndex];

      game.selected = { x: x0, y: y0, value: base.map[y0][x0] };
      base.map[y0][x0] = -1;
      game.state = "SELECT";
    } else if (this.timer === 100) {
      // Đợi để click lần 2: swap
      const { x1, y1 } = game.matchedPositions[game.hintIndex];
      game.swapped = { x: x1, y: y1, value: base.map[y1][x1] };
      base.map[y1][x1] = -1;
    }
  }
}
