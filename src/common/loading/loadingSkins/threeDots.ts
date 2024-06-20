import { SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF } from "@/configs/consts";
import { LoadingSkin } from "./loadingSkin";

const OFFSET_X = -40;
const OFFSET_TIMER = 10;
const RADIUS = 10;

const dots = [-1, 0, 1].map((dot) => ({ x: dot * OFFSET_X, offset: dot }));

export class ThreeDotsLoading extends LoadingSkin {
  render(timer: number) {
    this.context.fillStyle = "#ffff00";

    dots.forEach(({ x, offset }) => {
      const scale = Math.abs(Math.sin((timer + OFFSET_TIMER * offset) * 0.05)) * RADIUS;
      this.context.beginPath();
      this.context.arc(SCREEN_WIDTH_HALF + x, SCREEN_HEIGHT_HALF, scale, 0, Math.PI * 2);
      this.context.fill();
    });
  }
}
