import { hintArrowOffsets, hintArrows } from "@/common/textures";
import { base, CELL_SIZE } from "@/configs/consts";
import { Direction, GameStateFunction } from "@/types";

const idleStateFunction: GameStateFunction = {
  render: (self) => {
    const hint = self.matchedPositions[0];

    if (!hint) return;

    let { x0, y0, x1, y1 } = hint;
    if (Math.random() < 0.5) {
      const tmpX = x0;
      x0 = x1;
      x1 = tmpX;
      const tmpY = y0;
      y0 = y1;
      y1 = tmpY;
    }

    let direction: Direction = "UP";
    if (x1 > x0) direction = "RIGHT";
    else if (x1 < x0) direction = "LEFT";
    else if (y1 > y0) direction = "DOWN";

    const { texture, offset, drt } = hintArrows[direction];

    base.context.drawImage(
      texture,
      x0 * CELL_SIZE + offset.x + drt.x * hintArrowOffsets[self.tIdle % 20],
      y0 * CELL_SIZE + offset.y + drt.y * hintArrowOffsets[self.tIdle % 20]
    );
  },
  update: (self) => {
    self.tIdle += 1;
  },
};

export default idleStateFunction;
