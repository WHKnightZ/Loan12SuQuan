export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min; // Include min, exclude max
export const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min; // Include min, exclude max

export const lerp = (v0: number, v1: number, t: number) => v0 + t * (v1 - v0);

export const pingPong = (value: number, length: number) => {
  return length - Math.abs(length - (value % (length * 2)));
};

export const sqr = (x: number) => x * x;
export const cube = (x: number) => x * x * x;

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
