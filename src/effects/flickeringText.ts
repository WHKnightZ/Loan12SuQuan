import { font } from "@/objects/font";
import { Effect } from "./effect";

export class FlickeringText extends Effect {
  text: string;

  constructor({ text, x, y }: { text: string; x?: number; y?: number }) {
    super();

    this.text = text;
    this.x = x;
    this.y = y;
  }

  render() {
    console.log(this.timer);
    if (this.timer % 2 === 0) font.draw({ text: this.text, x: this.x, y: this.y });
  }

  update() {
    this.timer += 1;

    if (this.timer > 300) this.isAlive = false;
  }
}
