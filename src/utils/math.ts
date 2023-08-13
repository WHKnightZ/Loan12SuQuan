export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const animate = (t: number) => {
  // Linear
  return t;

  // // EaseInOutCubic
  // const t1 = t - 1;
  // return t < 0.5 ? 4 * t * t * t : 4 * t1 * t1 * t1 + 1;
};
