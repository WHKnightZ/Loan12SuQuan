import { IGamePlugin } from "@/types";

/**
 * Plugin gắn vào 1 object cha, cho phép update cha
 */
export class GamePlugin<T> implements IGamePlugin<T> {
  parent: T;
  timer: number;
  active: boolean;

  constructor(parent: T) {
    this.parent = parent;
    this.timer = 0;
    this.active = false;
  }

  start() {
    this.timer = 0;
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  render() {}

  update() {}
}
