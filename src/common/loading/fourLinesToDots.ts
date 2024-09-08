import { SCREEN_HEIGHT_HALF, SCREEN_WIDTH_HALF } from "@/configs/consts";
import { LoadingSkin } from "./loadingSkin";
import { IColor } from "./type";
import { convertToHexColor, ease } from "./utils";

const MAX = 120;
const FACTOR = 20;

const keyframes = [
  {
    value: 0,
    0: { width: 0.5, height: 0.5, x: 1.1, y: -0.5 },
    1: { width: 0.5, height: 0.5, x: -1.1, y: 0.5 },
    2: { width: 0.5, height: 0.5, x: 0.5, y: 1.1 },
    3: { width: 0.5, height: 0.5, x: -0.5, y: -1.1 },
  },
  {
    value: 0.35,
    0: { width: 2.7, height: 0.5, x: 0, y: -0.5 },
    1: { width: 2.7, height: 0.5, x: 0, y: 0.5 },
    2: { width: 0.5, height: 2.7, x: 0.5, y: 0 },
    3: { width: 0.5, height: 2.7, x: -0.5, y: 0 },
  },
  {
    value: 0.7,
    0: { width: 0.5, height: 0.5, x: -1.1, y: -0.5 },
    1: { width: 0.5, height: 0.5, x: 1.1, y: 0.5 },
    2: { width: 0.5, height: 0.5, x: 0.5, y: -1.1 },
    3: { width: 0.5, height: 0.5, x: -0.5, y: 1.1 },
  },
  {
    value: 1,
    0: { width: 0.5, height: 0.5, x: 1, y: -0.5 },
    1: { width: 0.5, height: 0.5, x: -1, y: 0.5 },
    2: { width: 0.5, height: 0.5, x: 0.5, y: 1 },
    3: { width: 0.5, height: 0.5, x: -0.5, y: -1 },
  },
];

const colors: IColor[] = [
  { r: 225, g: 20, b: 98, a: 192 },
  { r: 111, g: 202, b: 220, a: 192 },
  { r: 61, g: 184, b: 143, a: 192 },
  { r: 233, g: 169, b: 32, a: 192 },
];

export class FourLinesToDotsLoading extends LoadingSkin {
  drawLine(x: number, y: number, w: number, h: number) {
    this.context.beginPath();
    this.context.roundRect((x - w / 2) * FACTOR, (y - h / 2) * FACTOR, w * FACTOR, h * FACTOR, FACTOR / 4);
    this.context.fill();
  }

  render(timer: number) {
    const newTime = (timer % MAX) / MAX;
    const lines = ease(newTime, keyframes, "easeInOutQuad");

    const lineValues = [lines[0], lines[1], lines[2], lines[3]];

    this.context.save();
    this.context.translate(SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF);
    this.context.rotate(Math.PI * 0.9);
    lineValues.forEach(({ x, y, width, height }, index) => {
      this.context.fillStyle = convertToHexColor(colors[index]);
      this.drawLine(x / 2, y / 2, width / 2, height / 2);
    });
    this.context.restore();
  }
}
