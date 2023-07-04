import { menuTexture } from "@/common/textures";
import {
  base,
  BOARD_COLORS,
  BOARD_SIZE,
  CELL_SIZE,
  GAIN_TURN,
  mapTileInfo,
  MAP_WIDTH,
  MAP_WIDTH_1,
  MATCH_4_POINT,
  MENU_HEIGHT,
  PLAYER_INTELLIGENCE,
  SCREEN_WIDTH,
  TILES,
  TILE_OFFSET,
} from "@/configs/consts";
import { Player } from "@/objects/player";
import { IGame, AllMatchedPositions, GameState, Point, TileInfo, GameStateFunction, FallItem, IPlayer } from "@/types";
import { check, generateMap } from "@/utils/common";
import explodeStateFunction from "./explode";
import fadeStateFunction from "./fade";
import fallStateFunction from "./fall";
import idleStateFunction from "./idle";
import selectStateFunction from "./select";

const mapFunction: {
  [key in GameState]: GameStateFunction;
} = {
  IDLE: idleStateFunction,
  SELECT: selectStateFunction,
  EXPLODE: explodeStateFunction,
  FALL: fallStateFunction,
  FADE: fadeStateFunction,
};

export class Game implements IGame {
  state: GameState;
  selected: Point | null;
  swapped: Point | null;
  reswap: boolean;

  fall: {
    [key: number]: FallItem;
  };

  explosions: Point[];
  explodedTiles: TileInfo[];

  tIdle: number;
  tSelect: number;
  tSwap: number;
  tExplode: number;
  tExplode2: number;
  tFadeIn: number;
  tFadeOut: number;

  isFadeIn: boolean;
  isFadeOut: boolean;

  matchedPositions: AllMatchedPositions;
  hintIndex: number;

  players: IPlayer[];
  playerTurn: number;

  constructor() {}

  init() {
    this.players = [new Player(this, 0, 5, 100, PLAYER_INTELLIGENCE), new Player(this, 1, 10, 100, 40)];
    this.playerTurn = 0;

    base.map = generateMap();
    this.findAllMatchedPositions();
    this.state = "IDLE";
    this.selected = null;
    this.swapped = null;
    this.reswap = false;
    this.fall = {};
    this.explosions = [];
    this.tIdle = 0;
    this.tSelect = 0;
    this.tSwap = 0;
    this.tExplode = 0;
    this.tExplode2 = 0;
    this.tFadeIn = 0;
    this.tFadeOut = 0;
    this.isFadeIn = false;
    this.isFadeOut = false;
    this.hintIndex = 0;

    this.fadeIn();
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
    const swapDirection = Math.random() < 0.5;
    const pos = swapDirection ? { x0: x1, y0: y1, x1: x0, y1: y0 } : { x0, y0, x1, y1 };
    if (m0 || m1) allMatchedPositions.push({ ...pos, point: p0 + p1 });
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
    this.matchedPositions = allMatchedPositions;

    this.hintIndex = this.players[this.playerTurn].getHintIndex(this.matchedPositions.length);
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
        this.fadeOut();
        break;
    }
  }

  fadeIn() {
    this.state = "FADE";
    for (let i = 0; i < MAP_WIDTH; i += 1) this.fall[i] = { list: [], below: MAP_WIDTH_1, pushCount: 0 };
    this.tFadeIn = 0;
    this.isFadeIn = true;
  }

  fadeOut() {
    this.state = "FADE";
    this.tFadeOut = 0;
    this.isFadeOut = true;
  }

  acquireTile({ value }: TileInfo) {
    switch (value) {
      case TILES.MANA:
        this.players[this.playerTurn].acquireMana(5);
        break;

      case TILES.SWORD:
        this.players[1 - this.playerTurn].takeDamage(2);
        break;

      case TILES.SWORDRED:
        this.players[1 - this.playerTurn].takeDamage(3);
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
        if (base.map[i][j] === -1 || this.state === "FADE") continue;

        base.context.drawImage(mapTileInfo[base.map[i][j]].texture, x + TILE_OFFSET, y + TILE_OFFSET);
      }
    }

    base.context.drawImage(menuTexture, 0, BOARD_SIZE);
    this.players.forEach((p) => p.render());

    mapFunction[this.state].render(this);
  }

  update() {
    this.players.forEach((p) => p.update());

    mapFunction[this.state].update(this);
  }
}
