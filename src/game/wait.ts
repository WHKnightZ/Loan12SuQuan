import { IGameStateFunction } from "@/types";

const waitStateFunction: IGameStateFunction = {
  render: () => {},
  update: (self) => {
    self.wait.timer += 1;
    if (self.wait.timer < self.wait.maxTimer) return;

    self.wait.callback();
  },
};

export default waitStateFunction;
