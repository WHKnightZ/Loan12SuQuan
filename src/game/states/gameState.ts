import { IGame, IGameState, IGameStateType } from "@/types";

/**
 * State base
 */
export class GameState implements IGameState {
  type: IGameStateType;
  game: IGame;

  constructor(type: IGameStateType, game: IGame) {
    this.type = type;
    this.game = game;
  }

  invoke() {}

  is(type: IGameStateType) {
    return this.type === type;
  }

  render() {}
  update() {}
}
