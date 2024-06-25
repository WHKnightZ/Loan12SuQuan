import { IGameStateFunction } from "@/types";

/**
 * State đợi, không làm gì cả, chờ 1 khoảng thời gian rồi thực hiện 1 action gì đó
 */
export const waitStateFunction: IGameStateFunction = {
  render: () => {},
  update: (self) => {
    self.waitProperties.timer += 1;
    if (self.waitProperties.timer < self.waitProperties.maxTimer) return;

    self.waitProperties.callback();
  },
};
