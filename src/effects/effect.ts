export class Effect {
  isAlive: boolean;
  x?: number;
  y?: number;
  timer: number;

  constructor() {
    this.timer = 0;
  }

  render() {}

  update() {}
}
