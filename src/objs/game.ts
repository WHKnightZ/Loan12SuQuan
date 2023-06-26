import { cornerSelections } from "@/common/textures";
import {
  base,
  BOARD_COLORS,
  CELL_SIZE,
  cornerSelectionOffsets,
  CORNER_SELECTION_CYCLE,
  GAIN_TURN,
  GRAVITY,
  mapTileInfo,
  MAP_WIDTH,
  MAP_WIDTH_1,
  MATCH_4_POINT,
  SWAP_DURATION,
  SWAP_OFFSET,
  TILE_OFFSET,
  VELOCITY_BASE,
} from "@/configs/consts";
import { AllMatchedPositions, GameState, Point, TileInfo } from "@/types";
import { check, combine, findBelow, generateMap, getKeys, randomTile } from "@/utils/common";

const mapFunction: {
  [key in GameState]: {
    render: (self: Game) => void;
    update: (self: Game) => void;
  };
} = {
  IDLE: { render: () => {}, update: () => {} },
  SELECT: {
    render: (self) => {
      const offset = self.tSwap * SWAP_OFFSET;

      const { x: x0, y: y0, value: v0 } = self.selected;
      const { x: x1, y: y1, value: v1 } = self.swapped || self.selected;

      if (self.swapped)
        base.context.drawImage(
          mapTileInfo[v1].texture,
          x1 * CELL_SIZE + TILE_OFFSET + (x0 - x1) * offset,
          y1 * CELL_SIZE + TILE_OFFSET + (y0 - y1) * offset
        );

      base.context.drawImage(
        mapTileInfo[v0].texture,
        x0 * CELL_SIZE + TILE_OFFSET + (x1 - x0) * offset,
        y0 * CELL_SIZE + TILE_OFFSET + (y1 - y0) * offset
      );

      if (!self.swapped) {
        const offset = cornerSelectionOffsets[self.tSelect % CORNER_SELECTION_CYCLE];

        cornerSelections.forEach(({ texture, offset: o, position }) =>
          base.context.drawImage(
            texture,
            self.selected.x * CELL_SIZE + position.x + o.x * offset,
            self.selected.y * CELL_SIZE + position.y + o.y * offset
          )
        );
      }
    },
    update: (self) => {
      if (!self.swapped) {
        self.tSelect += 1;
        return;
      }

      self.tSwap += 1;
      if (self.tSwap <= SWAP_DURATION) return;

      self.tSwap = SWAP_DURATION;

      const { x: x0, y: y0, value: v0 } = self.selected;
      const { x: x1, y: y1, value: v1 } = self.swapped;

      base.map[y0][x0] = v0;
      base.map[y1][x1] = v1;

      self.swap(x0, y0, x1, y1);

      if (self.reswap) {
        self.reswap = false;
        self.selected = self.swapped = null;
        self.state = "IDLE";
      } else {
        const { matched: m0, tiles: t0 } = self.matchPosition(x0, y0);
        const { matched: m1, tiles: t1 } = self.matchPosition(x1, y1);
        if (m0 || m1) {
          self.selected = self.swapped = null;
          self.explodedTiles = combine([t0, t1]);
          self.explosions = [];
          self.explodedTiles.forEach(({ x, y }) => {
            self.explosions.push({ x, y, value: base.map[y][x] });
            base.map[y][x] = -1;
          });
          self.state = "EXPLODE";
        } else {
          base.map[y0][x0] = -1;
          base.map[y1][x1] = -1;
          const tmpX = self.selected.x;
          const tmpY = self.selected.y;
          self.selected.x = self.swapped.x;
          self.selected.y = self.swapped.y;
          self.swapped.x = tmpX;
          self.swapped.y = tmpY;
          self.reswap = true;
          self.tSwap = 0;
        }
      }
    },
  },
  EXPLODE: {
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

      self.explodedTiles.forEach(({ x, y }) => {
        base.map[y][x] = -1;
        if (self.fall[x]) {
          !self.fall[x].list.find(({ x: x0, y: y0 }) => x0 === x && y0 === y) &&
            self.fall[x].list.push({ x, y, v: 0, offset: 0, value: -1 });
        } else self.fall[x] = { list: [{ x, y, v: 0, offset: 0, value: -1 }], below: -1 };
      });

      getKeys(self.fall).forEach((key) => {
        self.fall[key].below = findBelow(self.fall[key].list);
        const needAdd = self.fall[key].list.length;
        self.fall[key].list = [];
        key = Number(key);
        for (let i = self.fall[key].below; i >= 0; i -= 1) {
          if (base.map[i][key] !== -1) {
            self.fall[key].list.push({ x: key, y: i, v: VELOCITY_BASE, offset: 0, value: base.map[i][key] });
            base.map[i][key] = -1;
          }
        }
        for (let i = 0; i < needAdd; i += 1) {
          self.fall[key].list.push({ x: key, y: -1 - i, v: VELOCITY_BASE, offset: 0, value: randomTile() });
        }
      });
    },
  },
  FALL: {
    render: (self) => {
      getKeys(self.fall).forEach((col) => {
        self.fall[col].list.forEach(({ x, y, value, offset }) => {
          base.context.drawImage(
            mapTileInfo[value].texture,
            x * CELL_SIZE + TILE_OFFSET,
            y * CELL_SIZE + TILE_OFFSET + offset
          );
        });
      });
    },
    update: (self) => {
      let newFalling = false;
      getKeys(self.fall).forEach((col) => {
        const colData = self.fall[col];
        col = Number(col);

        let shift = false;

        colData.list.forEach((i, index) => {
          i.v += GRAVITY;
          i.offset += i.v;
          const newY = i.y + Math.floor((i.offset + 6) / CELL_SIZE);

          if (index === 0) {
            if (newY >= colData.below) {
              shift = true;
              base.map[colData.below][col] = i.value;
              colData.below -= 1;
            }
          } else {
            if (i.offset >= colData.list[index - 1].offset - 6 || newY >= colData.below - index + 1) {
              i.v = VELOCITY_BASE;
              i.offset = Math.floor(i.offset / CELL_SIZE) * CELL_SIZE;
            }
          }
        });

        if (shift) colData.list.shift();
        if (colData.list.length) newFalling = true;
      });

      if (newFalling) return;

      const tt: TileInfo[][] = [];
      for (let i = 0; i < MAP_WIDTH; i += 1) {
        for (let j = 0; j < MAP_WIDTH; j += 1) {
          const { matched: m0, tiles: t0 } = self.matchPosition(j, i);
          if (m0) tt.push(t0);
        }
      }

      if (tt.length) {
        self.explodedTiles = combine(tt);
        self.explosions = [];
        self.explodedTiles.forEach(({ x, y }) => {
          self.explosions.push({ x, y, value: base.map[y][x] });
          base.map[y][x] = -1;
        });
        self.state = "EXPLODE";
      } else self.state = "IDLE";
    },
  },
  FADE: {
    render: () => {},
    update: () => {},
  },
};

export class Game {
  state: GameState;

  selected: Point | null;
  swapped: Point | null;

  reswap: boolean;

  fall: {
    [key: number]: {
      list: { x: number; y: number; offset: number; v: number; value: number }[];
      below: number;
    };
  };

  explosions: Point[];
  explodedTiles: TileInfo[];

  tSelect: number;
  tSwap: number;
  tExplode: number;
  tExplode2: number;

  constructor() {}

  init() {
    base.map = generateMap();
    this.state = "IDLE";
    this.selected = null;
    this.swapped = null;
    this.reswap = false;
    this.fall = {};
    this.explosions = [];
    this.tSelect = 0;
    this.tSwap = 0;
    this.tExplode = 0;
    this.tExplode2 = 0;
  }

  matchPosition(x: number, y: number) {
    let h: TileInfo[] = [];
    let v: TileInfo[] = [];
    let newX: number, newY: number;
    const posValue = base.map[y][x];
    const compatible = mapTileInfo[posValue].compatible;

    newX = x - 1;
    while (newX >= 0) {
      const value = base.map[y][newX];
      if (!check(value, posValue, compatible)) break;
      h.push({ x: newX, y, point: mapTileInfo[value].point, value });
      newX -= 1;
    }
    newX = x + 1;
    while (newX < MAP_WIDTH) {
      const value = base.map[y][newX];
      if (!check(value, posValue, compatible)) break;
      h.push({ x: newX, y, point: mapTileInfo[value].point, value });
      newX += 1;
    }
    newY = y - 1;
    while (newY >= 0) {
      const value = base.map[newY][x];
      if (!check(value, posValue, compatible)) break;
      v.push({ x, y: newY, point: mapTileInfo[value].point, value });
      newY -= 1;
    }
    newY = y + 1;
    while (newY < MAP_WIDTH) {
      const value = base.map[newY][x];
      if (!check(value, posValue, compatible)) break;
      v.push({ x, y: newY, point: mapTileInfo[value].point, value });
      newY += 1;
    }

    let hasH = true;
    let hasV = true;

    if (h.length < 2) {
      h = [];
      hasH = false;
    }
    if (v.length < 2) {
      v = [];
      hasV = false;
    }

    const matched = hasH || hasV;
    const value = base.map[y][x];
    const tiles = matched ? [...h, ...v, { x, y, point: mapTileInfo[value].point, value }] : [];

    return {
      matched,
      tiles,
      point:
        tiles.reduce((a, b) => a + b.point, 0) +
        (h.length >= GAIN_TURN ? MATCH_4_POINT : 0) +
        (v.length >= GAIN_TURN ? MATCH_4_POINT : 0),
      turn: Number(h.length >= GAIN_TURN) + Number(v.length >= GAIN_TURN),
    };
  }

  swap(x0: number, y0: number, x1: number, y1: number) {
    const tmp = base.map[y0][x0];
    base.map[y0][x0] = base.map[y1][x1];
    base.map[y1][x1] = tmp;
  }

  addMatchedPosition(allMatchedPositions: AllMatchedPositions, x0: number, y0: number, x1: number, y1: number) {
    this.swap(x0, y0, x1, y1);
    const { matched: m0, point: p0 } = this.matchPosition(x0, y0);
    const { matched: m1, point: p1 } = this.matchPosition(x1, y1);
    if (m0 || m1) allMatchedPositions.push({ x0, y0, x1, y1, point: p0 + p1 });
    this.swap(x0, y0, x1, y1);
  }

  findAllMatchedPositions() {
    const allMatchedPositions: AllMatchedPositions = [];
    for (let i = 0; i < MAP_WIDTH_1; i += 1) {
      for (let j = 0; j < MAP_WIDTH_1; j += 1) {
        this.addMatchedPosition(allMatchedPositions, j, i, j + 1, i);
        this.addMatchedPosition(allMatchedPositions, j, i, j, i + 1);
      }
    }
    for (let i = 0; i < MAP_WIDTH_1; i += 1)
      this.addMatchedPosition(allMatchedPositions, MAP_WIDTH_1, i, MAP_WIDTH_1, i + 1);
    for (let j = 0; j < MAP_WIDTH_1; j += 1)
      this.addMatchedPosition(allMatchedPositions, j, MAP_WIDTH_1, j + 1, MAP_WIDTH_1);

    allMatchedPositions.sort((a, b) => (a.point < b.point ? 1 : -1));
    return allMatchedPositions;
  }

  onClick(e: MouseEvent) {
    if (this.state !== "IDLE" && this.state !== "SELECT") return;

    const canvas = base.canvas;

    const x = Math.floor((e.offsetX * canvas.width) / canvas.clientWidth / CELL_SIZE);
    const y = Math.floor((e.offsetY * canvas.height) / canvas.clientHeight / CELL_SIZE);
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_WIDTH) return;

    this.tSwap = 0;

    if (!this.selected) {
      this.selected = { x, y, value: base.map[y][x] };
      base.map[y][x] = -1;
      this.state = "SELECT";
      return;
    }

    if (Math.abs(x - this.selected.x) + Math.abs(y - this.selected.y) !== 1) {
      const { x, y, value } = this.selected;
      base.map[y][x] = value;
      this.selected = null;
      this.state = "IDLE";
      return;
    }

    this.swapped = { x, y, value: base.map[y][x] };
    base.map[y][x] = -1;
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        this.state = "FADE";
        break;
    }
  }

  render() {
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        base.context.fillStyle = BOARD_COLORS[(i + j) % 2];
        const x = j * CELL_SIZE;
        const y = i * CELL_SIZE;
        base.context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        if (base.map[i][j] === -1) continue;

        base.context.drawImage(mapTileInfo[base.map[i][j]].texture, x + TILE_OFFSET, y + TILE_OFFSET);
      }
    }

    mapFunction[this.state].render(this);
  }

  update() {
    mapFunction[this.state].update(this);
  }
}
