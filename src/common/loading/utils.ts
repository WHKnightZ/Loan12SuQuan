import { cube, lerp, sqr } from "@/utils/math";
import { IColor, IEaseType, IKeyframe, IKeyframeProperties } from "./type";
import { getKeys } from "@/configs/consts";
import { isNumber } from "@/utils/common";

export const isColor = (value: any): value is IColor => !!value.r;

export const convertToHex = (v: number) => {
  v = ~~v;
  return (v < 16 ? "0" : "") + v.toString(16);
};

export const convertToHexColor = ({ r, g, b, a }: IColor) =>
  "#" + convertToHex(r) + convertToHex(g) + convertToHex(b) + convertToHex(a);

export const easeInOutSine = (x: number) => {
  return -(Math.cos(Math.PI * x) - 1) / 2;
};

export const easeInQuad = (x: number) => {
  return sqr(x);
};

export const easeOutQuad = (x: number) => {
  return 1 - sqr(1 - x);
};

export const easeInOutQuad = (x: number) => {
  return x < 0.5 ? 2 * sqr(x) : 1 - sqr(-2 * x + 2) / 2;
};

export const easeInOutCubic = (x: number) => {
  return x < 0.5 ? 4 * cube(x) : 1 - cube(-2 * x + 2) / 2;
};

const mapEaseFunction: { [key in IEaseType]: (x: number) => number } = {
  easeInOutSine,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInOutCubic,
};

export const ease = <T extends IKeyframeProperties>(value: number, keyframes: IKeyframe<T>[], type: IEaseType) => {
  const last = keyframes.length - 1;
  let index = last;

  keyframes.forEach(({ value: keyframeValue }, i) => {
    if (index !== last) return;
    if (value < keyframeValue) index = i;
  });

  const { value: value1, ...rest1 } = keyframes[index - 1];
  const { value: value2, ...rest2 } = keyframes[index];

  const pos = mapEaseFunction[type]((value - value1) / (value2 - value1));

  const rest = { ...rest1 };

  getKeys(rest).forEach((key) => {
    if (!isNumber(rest[key])) rest[key] = { ...(rest[key] as any) };

    const v1 = rest[key];
    const v2 = rest2[key];

    if (isNumber(v1)) {
      (rest as any)[key] = lerp(v1, v2 as number, pos);
    } else {
      getKeys(v1).forEach((k) => {
        v1[k] = lerp(v1[k], v2[k], pos);
      });
    }
  });

  return rest;
};
