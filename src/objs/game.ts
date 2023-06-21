import {
  base,
  CELL_SIZE,
  GAIN_TURN,
  GRAVITY,
  mapTileInfo,
  MAP_WIDTH,
  MAP_WIDTH_1,
  MATCH_4_POINT,
  SWAP_DURATION,
  SWAP_OFFSET,
  TILE_OFFSET,
  TILE_SIZE,
  VELOCITY_BASE,
} from "@/configs/consts";
import { AllMatchedPositions, Point, TileInfo } from "@/types";
import { check, combine, findBelow, generateMap, getKey, getKeys, randomTile } from "@/utils/common";

export class Game {
  state: "IDLE" | "SELECT" | "EXPLODE" | "FALL";

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
      h.push({ x: newX, y, point: mapTileInfo[value].point });
      newX -= 1;
    }
    newX = x + 1;
    while (newX < MAP_WIDTH) {
      const value = base.map[y][newX];
      if (!check(value, posValue, compatible)) break;
      h.push({ x: newX, y, point: mapTileInfo[value].point });
      newX += 1;
    }
    newY = y - 1;
    while (newY >= 0) {
      const value = base.map[newY][x];
      if (!check(value, posValue, compatible)) break;
      v.push({ x, y: newY, point: mapTileInfo[value].point });
      newY -= 1;
    }
    newY = y + 1;
    while (newY < MAP_WIDTH) {
      const value = base.map[newY][x];
      if (!check(value, posValue, compatible)) break;
      v.push({ x, y: newY, point: mapTileInfo[value].point });
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
    const tiles = matched ? [...h, ...v, { x, y, point: mapTileInfo[base.map[y][x]].point }] : [];

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
    const x = Math.floor(e.offsetX / CELL_SIZE);
    const y = Math.floor(e.offsetY / CELL_SIZE);
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_WIDTH) return;

    if (!this.selected) {
      this.selected = { x, y, value: base.map[y][x] };
      base.map[y][x] = -1;
      return;
    }

    if (Math.abs(x - this.selected.x) + Math.abs(y - this.selected.y) !== 1) {
      this.selected = null;
      return;
    }

    this.swapped = { x, y, value: base.map[y][x] };
    base.map[y][x] = -1;
    this.tSwap = 0;

    this.state = "SELECT";
  }

  render() {
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        base.context.fillStyle = (i + j) % 2 ? "#554933" : "#3e3226";
        const x = j * CELL_SIZE;
        const y = i * CELL_SIZE;
        base.context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        if (base.map[i][j] === -1) continue;

        base.context.drawImage(
          mapTileInfo[base.map[i][j]].texture,
          x + TILE_OFFSET,
          y + TILE_OFFSET,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }

    if (this.state === "SELECT") {
      if (!this.swapped) {
        base.context.lineWidth = 4;
        base.context.strokeStyle = "cyan";
        base.context.strokeRect(
          this.selected.x * CELL_SIZE + 2,
          this.selected.y * CELL_SIZE + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4
        );
      } else {
        let done = false;
        this.tSwap += 1;
        if (this.tSwap > SWAP_DURATION) {
          this.tSwap = SWAP_DURATION;
          done = true;
        }

        console.log(this.tSwap);

        const offset = this.tSwap * SWAP_OFFSET;

        const { x: x0, y: y0, value: v0 } = this.selected;
        const { x: x1, y: y1, value: v1 } = this.swapped;

        console.log(v0, v1);

        base.context.drawImage(
          mapTileInfo[v1].texture,
          x1 * CELL_SIZE + TILE_OFFSET + (x0 - x1) * offset,
          y1 * CELL_SIZE + TILE_OFFSET + (y0 - y1) * offset,
          TILE_SIZE,
          TILE_SIZE
        );
        base.context.drawImage(
          mapTileInfo[v0].texture,
          x0 * CELL_SIZE + TILE_OFFSET + (x1 - x0) * offset,
          y0 * CELL_SIZE + TILE_OFFSET + (y1 - y0) * offset,
          TILE_SIZE,
          TILE_SIZE
        );

        if (done) {
          base.map[y0][x0] = v0;
          base.map[y1][x1] = v1;

          this.swap(x0, y0, x1, y1);

          if (this.reswap) {
            this.reswap = false;
            this.selected = this.swapped = null;
          } else {
            const { matched: m0, tiles: t0 } = this.matchPosition(x0, y0);
            const { matched: m1, tiles: t1 } = this.matchPosition(x1, y1);
            if (m0 || m1) {
              this.selected = this.swapped = null;
              this.explodedTiles = combine([t0, t1]);
              this.explosions = [];
              this.explodedTiles.forEach(({ x, y }) => {
                this.explosions.push({ x, y, value: base.map[y][x] });
                base.map[y][x] = -1;
              });
              this.state = "EXPLODE";
            } else {
              this.reswap = true;
              this.tSwap = 0;
            }
          }
        }
      }
    }

    if (this.state === "EXPLODE") {
      this.explosions.forEach(({ x, y, value }) => {
        const texture = mapTileInfo[value].explosions[this.tExplode];
        base.context.drawImage(
          texture,
          x * CELL_SIZE + Math.floor((CELL_SIZE - texture.width) / 2),
          y * CELL_SIZE + Math.floor((CELL_SIZE - texture.height) / 2)
        );
      });
    } else if (this.state === "FALL") {
      getKeys(this.fall).forEach((col) => {
        const colData = this.fall[col];

        colData.list.forEach(({ x, y, value, offset }) => {
          base.context.drawImage(
            mapTileInfo[value].texture,
            x * CELL_SIZE + TILE_OFFSET,
            y * CELL_SIZE + TILE_OFFSET + offset,
            TILE_SIZE,
            TILE_SIZE
          );
        });
      });
    }
  }

  update() {
    if (this.state === "EXPLODE") {
      this.tExplode2 += 1;
      if (this.tExplode2 % 2 === 0) {
        this.tExplode += 1;
        if (this.tExplode === 4) {
          this.tExplode = 0;
          this.state = "FALL";

          this.fall = {};

          this.explodedTiles.forEach(({ x, y }) => {
            base.map[y][x] = -1;
            if (this.fall[x]) {
              !this.fall[x].list.find(({ x: x0, y: y0 }) => x0 === x && y0 === y) &&
                this.fall[x].list.push({ x, y, v: 0, offset: 0, value: -1 });
            } else this.fall[x] = { list: [{ x, y, v: 0, offset: 0, value: -1 }], below: -1 };
          });

          getKeys(this.fall).forEach((key) => {
            this.fall[key].below = findBelow(this.fall[key].list);
            const needAdd = this.fall[key].list.length;
            this.fall[key].list = [];
            key = Number(key);
            for (let i = this.fall[key].below; i >= 0; i -= 1) {
              if (base.map[i][key] !== -1) {
                this.fall[key].list.push({ x: key, y: i, v: VELOCITY_BASE, offset: 0, value: base.map[i][key] });
                base.map[i][key] = -1;
              }
            }
            for (let i = 0; i < needAdd; i += 1) {
              this.fall[key].list.push({ x: key, y: -1 - i, v: VELOCITY_BASE, offset: 0, value: randomTile() });
            }
          });
        }
      }
    } else if (this.state === "FALL") {
      let newFalling = false;
      getKeys(this.fall).forEach((col) => {
        const colData = this.fall[col];
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

      if (!newFalling) {
        const t: any[] = [];
        for (let i = 0; i < MAP_WIDTH; i += 1) {
          for (let j = 0; j < MAP_WIDTH; j += 1) {
            const { matched: m0, tiles: t0 } = this.matchPosition(j, i);
            if (m0) t.push(...t0);
          }
        }

        if (t.length) {
          this.fall = {};
          t.forEach(({ x, y }) => {
            base.map[y][x] = -1;
            if (this.fall[x]) {
              !this.fall[x].list.find(({ x: x0, y: y0 }) => x0 === x && y0 === y) &&
                this.fall[x].list.push({ x, y, v: 0, offset: 0, value: -1 });
            } else this.fall[x] = { list: [{ x, y, v: 0, offset: 0, value: -1 }], below: -1 };
          });
          const findBelow = (list: { x: number; y: number; offset: number; v: number }[]) =>
            list.reduce((a, b) => (a < b.y ? b.y : a), -1);
          getKeys(this.fall).forEach((key) => {
            this.fall[key].below = findBelow(this.fall[key].list);
            const needAdd = this.fall[key].list.length;
            this.fall[key].list = [];
            key = Number(key);
            for (let i = this.fall[key].below; i >= 0; i -= 1) {
              if (base.map[i][key] !== -1) {
                this.fall[key].list.push({ x: key, y: i, v: VELOCITY_BASE, offset: 0, value: base.map[i][key] });
                base.map[i][key] = -1;
              }
            }
            for (let i = 0; i < needAdd; i += 1) {
              this.fall[key].list.push({ x: key, y: -1 - i, v: VELOCITY_BASE, offset: 0, value: randomTile() });
            }
          });
          // falling = true;
        }
      }
    }
  }
}
