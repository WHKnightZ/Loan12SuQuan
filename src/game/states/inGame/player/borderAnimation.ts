import { IPoint, IRenderable } from "@/types";
import { Spin } from "./spin";
import { AVATAR_HEIGHT, AVATAR_WIDTH } from "@/configs/consts";
import { IInGameState } from "../types";

export class BorderAnimation implements IRenderable {
  private inGame: IInGameState;
  private index: number;
  private spins: Spin[];

  constructor(inGame: IInGameState, index: number, avatarOffset: IPoint) {
    this.inGame = inGame;
    this.index = index;

    const padding = 2;

    this.spins = Array.from({ length: 2 }).map(
      (_, i) =>
        new Spin(
          avatarOffset.x - padding,
          avatarOffset.x + AVATAR_WIDTH + padding,
          avatarOffset.y - padding,
          avatarOffset.y + AVATAR_HEIGHT + padding,
          0.6,
          "CW",
          20,
          2,
          avatarOffset.x + (i === 0 ? 4 - padding : AVATAR_WIDTH + padding - 4),
          avatarOffset.y + (i === 0 ? -padding : AVATAR_HEIGHT + padding)
        )
    );
  }

  render() {
    this.spins.forEach((e) => e.render());
  }

  update() {
    this.spins.forEach((e) => {
      if (this.index === this.inGame.playerTurn) e.activate();
      else e.deactivate();

      e.update();
    });
  }
}
