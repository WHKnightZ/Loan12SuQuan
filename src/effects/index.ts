import { IEffect } from "@/types";

export class Effects {
  private list: IEffect[];

  constructor() {
    this.list = [];
  }

  render() {
    this.list.forEach((obj) => obj.render());
  }

  update() {
    let needUpdate = false;
    this.list.forEach((obj) => {
      obj.update();
      needUpdate = needUpdate || !obj.alive;
    });
    if (needUpdate) this.list = this.list.filter((obj) => obj.alive);
  }

  create(effect: IEffect) {
    this.list.push(effect);
  }

  reset() {
    this.list = [];
  }
}

export * from "./effect";
export * from "./causeDamage";
export * from "./flickeringText";
export * from "./floatingText";
export * from "./gainTile";
export * from "./starExplosion";
export * from "./swordAttack";
