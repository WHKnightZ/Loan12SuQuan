import { Effect } from "./effect";

export class Effects {
  list: Effect[];

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
      needUpdate = needUpdate || !obj.isAlive;
    });
    if (needUpdate) this.list = this.list.filter((obj) => obj.isAlive);
  }

  add(effect: Effect) {
    this.list.push(effect);
  }
}

export const effects = new Effects();
