import { IGamePlugin } from "@/types";

/**
 * Plugin gắn vào 1 object cha, cho phép update cha
 */
export class GamePlugin<T> implements IGamePlugin<T> {
  parent: T;
  timer: number;

  constructor(parent: T) {
    this.parent = parent;
    this.timer = 0;
  }

  start() {}

  stop() {}

  render() {}

  update() {}
}
