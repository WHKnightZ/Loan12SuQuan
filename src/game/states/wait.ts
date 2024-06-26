import { IGame } from "@/types";
import { GameState } from "./gameState";

/**
 * State đợi, không làm gì cả, chờ 1 khoảng thời gian rồi thực hiện 1 action gì đó
 */
export class WaitGameState extends GameState {
  constructor(game: IGame) {
    super("WAIT", game);
  }

  render() {}

  update() {
    const game = this.game;

    game.waitProperties.timer += 1;
    if (game.waitProperties.timer < game.waitProperties.maxTimer) return;

    game.waitProperties.callback();
  }
}
