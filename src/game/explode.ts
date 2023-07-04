import { base, CELL_SIZE, mapTileInfo, VELOCITY_BASE } from "@/configs/consts";
import { GameStateFunction } from "@/types";
import { findBelow, getKeys, randomTile } from "@/utils/common";

const explodeStateFunction: GameStateFunction = {
  render: (self) => {
    self.explosions.forEach(({ x, y, value }) => {
      const texture = mapTileInfo[value].explosions[self.tExplode];
      base.context.drawImage(
        texture,
        x * CELL_SIZE + Math.floor((CELL_SIZE - texture.width) / 2),
        y * CELL_SIZE + Math.floor((CELL_SIZE - texture.height) / 2)
      );
    });
  },
  update: (self) => {
    self.tExplode2 += 1;
    if (self.tExplode2 % 2 !== 0) return;

    self.tExplode += 1;
    if (self.tExplode !== 4) return;

    self.tExplode = 0;
    self.state = "FALL";

    self.fall = {};

    const fall = self.fall;

    self.explodedTiles.forEach(({ x, y }) => {
      base.map[y][x] = -1;
      if (self.fall[x]) {
        !fall[x].list.find(({ x: x0, y: y0 }) => x0 === x && y0 === y) &&
          fall[x].list.push({ x, y, v: 0, offset: 0, value: -1 });
      } else fall[x] = { list: [{ x, y, v: 0, offset: 0, value: -1 }], below: -1 };
    });

    getKeys(fall).forEach((key) => {
      fall[key].below = findBelow(fall[key].list);
      const needAdd = fall[key].list.length;
      fall[key].list = [];
      key = Number(key);
      for (let i = self.fall[key].below; i >= 0; i -= 1) {
        if (base.map[i][key] !== -1) {
          fall[key].list.push({ x: key, y: i, v: VELOCITY_BASE, offset: 0, value: base.map[i][key] });
          base.map[i][key] = -1;
        }
      }
      for (let i = 0; i < needAdd; i += 1) {
        fall[key].list.push({ x: key, y: -1 - i, v: VELOCITY_BASE, offset: 0, value: randomTile() });
      }
    });
  },
};

export default explodeStateFunction;
