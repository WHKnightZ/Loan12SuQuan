import { hintArrows } from "@/common/textures";
import { base, CELL_SIZE, hintArrowOffsets, HINT_ARROW_CYCLE } from "@/configs/consts";
import { Direction, GameStateFunction } from "@/types";

const idleStateFunction: GameStateFunction = {
  render: (self) => {
    if (self.tHintDelay > 0) return;

    const hint = self.matchedPositions[self.hintIndex];

    if (!hint) return;

    const { x0, y0, x1, y1 } = hint;

    let direction: Direction = "UP";
    if (x1 > x0) direction = "RIGHT";
    else if (x1 < x0) direction = "LEFT";
    else if (y1 > y0) direction = "DOWN";

    const { texture, offset, drt } = hintArrows[direction];

    const offsetDrt = hintArrowOffsets[self.tIdle % HINT_ARROW_CYCLE];

    base.context.drawImage(
      texture,
      x0 * CELL_SIZE + offset.x + drt.x * offsetDrt,
      y0 * CELL_SIZE + offset.y + drt.y * offsetDrt
    );
  },
  update: (self) => {
    if (self.tHintDelay > 0) {
      self.tHintDelay -= 1;
      return;
    }
    self.tIdle += 1;
  },
};

export default idleStateFunction;
