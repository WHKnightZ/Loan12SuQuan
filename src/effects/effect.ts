import { IEffect } from "@/types";

export class Effect implements IEffect {
  protected x: number;
  protected y: number;
  protected timer: number;
  protected opacity: number;

  alive: boolean;

  constructor(x: number, y: number) {
    this.timer = 0;
    this.alive = true;
    this.opacity = 1;
    this.x = x;
    this.y = y;
  }

  render() {}

  update() {}
}
