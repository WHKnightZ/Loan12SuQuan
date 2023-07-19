import { base, OPACITY_ZERO } from "@/configs/consts";
import { font } from "@/objects/font";
import { Effect } from "./effect";

export class FlickeringText extends Effect {
  text: string;
  show: boolean;
  speed: number;

  constructor({ text, x = 0, y = 0 }: { text: string; x?: number; y?: number }) {
    super(x, y);

    this.text = text;
    this.show = true;
    this.speed = 8;
  }

  render() {
    if (!this.show) return;
    base.context.save();
    base.context.globalAlpha = this.opacity;
    font.draw({ text: this.text, x: this.x, y: this.y });
    base.context.restore();
  }

  update() {
    this.timer += 1;

    this.opacity -= 0.012;

    if (this.timer % Math.floor(this.speed) === 0) {
      this.timer = 0;
      this.speed -= 0.01;
      this.show = !this.show;
    }

    if (this.opacity < OPACITY_ZERO) this.isAlive = false;
  }
}
