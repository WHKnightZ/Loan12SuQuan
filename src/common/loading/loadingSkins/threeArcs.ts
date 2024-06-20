import { SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF } from "@/configs/consts";
import { LoadingSkin } from "./loadingSkin";

const arcs = [1, -0.5, 1.5].map((offset, index, arr) => ({
  color: index % 2 ? "#ff3d00" : "#999999",
  radius: index * 5 + 16,
  start: ((Math.PI * 2) / arr.length) * index,
  offset: (Math.PI * 2) / 60 / offset,
}));

export class ThreeArcsLoading extends LoadingSkin {
  render(timer: number) {
    this.context.lineWidth = 3;

    arcs.forEach(({ color, radius, start, offset }) => {
      this.context.strokeStyle = color;

      const startAngle = start + timer * offset;
      const endAngle = startAngle + Math.PI;

      this.context.beginPath();
      this.context.arc(SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF, radius, startAngle, endAngle);
      this.context.stroke();
    });
  }
}
