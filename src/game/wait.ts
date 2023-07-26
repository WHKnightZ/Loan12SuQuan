import { GameStateFunction } from "@/types";

const waitStateFunction: GameStateFunction = {
  render: () => {},
  update: (self) => {
    self.wait.timer += 1;
    if (self.wait.timer < self.wait.maxTimer) return;

    self.wait.callback();
  },
};

export default waitStateFunction;
