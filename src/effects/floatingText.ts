import { base, OPACITY_ZERO } from "@/configs/consts";
import { font } from "@/objects/font";
import { Effect } from "./effect";

export class FloatingText extends Effect {
  text: string;
  isFadeIn: boolean;

  constructor({ text, x = 0, y = 0 }: { text: string; x?: number; y?: number }) {
    super(x, y);

    this.text = text;
    this.isFadeIn = true;
    this.opacity = 0;
  }

  render() {
    base.context.save();
    base.context.globalAlpha = this.opacity;
    font.draw({ text: this.text, x: this.x, y: this.y });
    base.context.restore();
  }

  update() {
    this.y -= 0.8;

    if (this.isFadeIn) {
      this.opacity += 0.12;
      if (this.opacity > 1) {
        this.isFadeIn = false;
        this.opacity = 1;
      }
    } else {
      this.opacity -= 0.04;
      if (this.opacity < OPACITY_ZERO) this.isAlive = false;
    }
  }
}
