export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

// Animations

// // EaseInOutCubic
// const t1 = t - 1;
// return t < 0.5 ? 4 * t * t * t : 4 * t1 * t1 * t1 + 1;

// // EaseInBack
// const c1 = 1.70158;
// const c3 = c1 + 1;

// return c3 * t * t * t - c1 * t * t;

export const animateGainTile = (t: number) => {
  // Linear
  return t;
};

export const animateSword = (t: number) => {
  // // EaseInQuad
  return t * t;
};
