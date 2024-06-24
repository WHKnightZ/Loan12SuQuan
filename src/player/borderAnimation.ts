import { IPoint, IRenderable } from "@/types";
import { Spin } from "./spin";
import { base } from "@/configs/consts";

export class BorderAnimation implements IRenderable {
  private index: number;
  private spins: Spin[];

  constructor(index: number, avatarOffset: IPoint, avatarTexture: HTMLImageElement) {
    this.index = index;

    const padding = 4;

    this.spins = Array.from({ length: 2 }).map(
      (_, i) =>
        new Spin(
          avatarOffset.x - padding,
          avatarOffset.x + avatarTexture.width + padding,
          avatarOffset.y - padding,
          avatarOffset.y + avatarTexture.height + padding,
          0.8,
          "CW",
          40,
          3,
          avatarOffset.x + (i === 0 ? 10 - padding : avatarTexture.width + padding - 10),
          avatarOffset.y + (i === 0 ? -padding : avatarTexture.height + padding)
        )
    );
  }

  render() {
    this.spins.forEach((e) => e.render());
  }

  update() {
    this.spins.forEach((e) => {
      if (this.index === base.game.playerTurn) e.activate();
      else e.deactivate();

      e.update();
    });
  }
}
