import {base, CELL_SIZE, hintArrowOffsets, HINT_ARROW_CYCLE, TURN_DURATION} from "@/configs/consts";
import { hintArrows } from "@/textures";
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
    if (performance.now() - self.startTurnTime > TURN_DURATION) {
      console.log(self.startTurnTime);
      self.startTurnTime = performance.now();
      self.turnCount -= 1;
      self.tIdle +=1;
      self.tHintDelay = 0;
      self.hintIndex = 0;
      self.needUpdate = true;
      self.idle();
      return;
    }
    if (self.tHintDelay > 0) {
      self.tHintDelay -= 1;
      return;
    }
    self.tIdle += 1;
  },
};

export default idleStateFunction;
