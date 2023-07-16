export class Effect {
  isAlive: boolean;
  x: number;
  y: number;
  timer: number;
  opacity: number;

  constructor(x: number, y: number) {
    this.timer = 0;
    this.isAlive = true;
    this.opacity = 1;
    this.x = x;
    this.y = y;
  }

  render() {}

  update() {}
}
