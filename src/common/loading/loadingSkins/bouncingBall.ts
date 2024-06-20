import { SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF } from "@/configs/consts";
import { LoadingSkin } from "./loadingSkin";
import { pingPong } from "@/utils/math";
import { IColor } from "../type";
import { convertToHexColor, ease } from "../utils";

const MAX = 40;
const MAX2 = MAX * 2;
const RADIUS = 15;

const yKeyframes = [
  { value: 0, y: 60 },
  { value: 1, y: -60 },
];

const scaleKeyframes = [
  { value: 0, scaleX: 1, scaleY: 0.7 },
  { value: 0.4, scaleX: 0.8, scaleY: 1.2 },
  { value: 0.6, scaleX: 1, scaleY: 1 },
  { value: 1, scaleX: 1, scaleY: 1 },
];

const barKeyframes = [
  {
    value: 0,
    0: { x: 0, y: 10, opacity: 0 },
    1: { x: 0, y: 10, opacity: 1 },
    2: { x: -45, y: 50, opacity: 1 },
    3: { x: -90, y: 90, opacity: 1 },
  },
  {
    value: 1,
    0: { x: 0, y: 10, opacity: 1 },
    1: { x: -45, y: 50, opacity: 1 },
    2: { x: -90, y: 90, opacity: 1 },
    3: { x: -90, y: 90, opacity: 0 },
  },
];

const color: IColor = { r: 255, g: 255, b: 255, a: 255 };

export class BouncingBallLoading extends LoadingSkin {
  drawLine(x: number, y: number) {
    this.context.beginPath();
    this.context.roundRect(x - 22, y - 3, 45, 7, 4);
    this.context.fill();
  }

  render(timer: number) {
    const newTime = pingPong(timer, MAX) / MAX;
    const { y } = ease(newTime, yKeyframes, "easeInOutQuad");
    const { scaleX, scaleY } = ease(newTime, scaleKeyframes, "easeInOutQuad");

    const newTime2 = (timer % MAX2) / MAX2;
    const bars = ease(newTime2, barKeyframes, "easeInOutQuad");

    const barValues = [bars[0], bars[1], bars[2], bars[3]];

    barValues.forEach(({ x, y, opacity }) => {
      color.a = opacity * 255;
      this.context.fillStyle = convertToHexColor(color);
      this.drawLine(SCREEN_WIDTH_HALF + x + 45, SCREEN_HEIGHT_HALF + y - 28);
    });

    this.context.fillStyle = "#2a9d8f";
    this.context.beginPath();
    this.context.ellipse(
      SCREEN_WIDTH_HALF,
      SCREEN_HEIGHT_HALF + y - 50,
      RADIUS * scaleX,
      RADIUS * scaleY,
      0,
      0,
      Math.PI * 2
    );
    this.context.fill();
  }
}
