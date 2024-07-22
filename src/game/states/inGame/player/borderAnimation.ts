import { IPoint, IRenderable } from "@/types";
import { Spin } from "./spin";
import { AVATAR_HEIGHT, AVATAR_WIDTH } from "@/configs/consts";
import { IInGameState } from "../types";

export class BorderAnimation implements IRenderable {
  private inGame: IInGameState;
  private index: number;
  private spins: Spin[];

  constructor(inGame: IInGameState, index: number, avatarOffset: IPoint, avatarTexture: HTMLImageElement) {
    this.inGame = inGame;
    this.index = index;

    const padding = 4;

    this.spins = Array.from({ length: 2 }).map(
      (_, i) =>
        new Spin(
          avatarOffset.x - padding,
          avatarOffset.x + AVATAR_WIDTH + padding,
          avatarOffset.y - padding,
          avatarOffset.y + AVATAR_HEIGHT + padding,
          0.8,
          "CW",
          40,
          3,
          avatarOffset.x + (i === 0 ? 10 - padding : AVATAR_WIDTH + padding - 10),
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
