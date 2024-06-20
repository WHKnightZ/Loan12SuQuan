export type ILoadingSkin = {
  render(timer: number): void;
};

export type IKeyframeProperties = {
  [key: string]: number | { [key: string]: number };
};

export type IKeyframe<T extends IKeyframeProperties> = { value: number } & {
  [Property in keyof T]: T[Property];
};

export type IEaseType = "easeInOutSine" | "easeInQuad" | "easeOutQuad" | "easeInOutQuad" | "easeInOutCubic";

export type IColor = { r: number; g: number; b: number; a: number };
