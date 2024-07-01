export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min; // Include min, exclude max
export const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min; // Include min, exclude max
export const randomBool = () => Math.random() < 0.5;

export const lerp = (v0: number, v1: number, t: number) => v0 + t * (v1 - v0);

export const pingPong = (value: number, length: number) => {
  return length - Math.abs(length - (value % (length * 2)));
};

export const sqr = (x: number) => x * x;
export const cube = (x: number) => x * x * x;

// Animations

/**
 * Linear animation
 */
export const linear = (t: number) => {
  return t;
};

/**
 * EaseInQuad animation
 */
export const easeInQuad = (t: number) => {
  return t * t;
};

/**
 * EaseInOutCubic animation
 */
export const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * cube(t) : 1 - 4 * cube(1 - t);
};

/**
 * EaseInOutCbrt animation
 */
export const easeInOutCbrt = (t: number) => {
  return (Math.cbrt(t * 2 - 1) + 1) / 2;
};
