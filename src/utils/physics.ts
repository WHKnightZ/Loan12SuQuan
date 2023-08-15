export const createSpringEffect = (initialPosition: number, stiffness = 2500, damping = 7, precision = 0.5) => {
  let position = initialPosition;
  let endPosition = 0;
  let secPerFrame = 1 / 60;
  let velocity = 0;

  let isComplete = false;

  const out: number[] = [];

  while (!isComplete) {
    const distance = endPosition - position;
    const acceleration = stiffness * distance - damping * velocity;
    const newVelocity = velocity + acceleration * secPerFrame;
    const newPosition = position + newVelocity * secPerFrame;

    isComplete = Math.abs(newVelocity) < 1 / precision && Math.abs(newPosition - endPosition) < 1 / precision;

    position = isComplete ? endPosition : newPosition;

    out.push(position);

    velocity = newVelocity;
  }

  return out;
};
