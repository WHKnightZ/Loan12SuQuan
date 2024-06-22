import { base, EPSILON } from "@/configs/consts";
import { font } from "@/objects/font";
import { Effect } from "./effect";

export class FloatingText extends Effect {
  private text: string;
  private fadeIn: boolean;

  constructor({ text, x = 0, y = 0 }: { text: string; x?: number; y?: number }) {
    super(x, y);

    this.text = text;
    this.fadeIn = true;
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

    if (this.fadeIn) {
      this.opacity += 0.12;
      if (this.opacity > 1) {
        this.fadeIn = false;
        this.opacity = 1;
      }
    } else {
      this.opacity -= 0.04;
      if (this.opacity < EPSILON) this.alive = false;
    }
  }
}
