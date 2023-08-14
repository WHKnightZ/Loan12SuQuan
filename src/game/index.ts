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
  PLAYER_INTELLIGENCE,
  TILES,
  TILE_OFFSET,
  TIMER_HINT_DELAY_DEFAULT,
  CELL_SIZE_2,
  SCREEN_WIDTH,
} from "@/configs/consts";
import { effects } from "@/effects";
import { FlickeringText } from "@/effects/flickeringText";
import { FloatingText } from "@/effects/floatingText";
import { StarExplosion } from "@/effects/starExplosion";
import { Player } from "@/objects/player";
import {
  IGame,
  AllMatchedPositions,
  GameState,
  PointExt,
  TileInfo,
  GameStateFunction,
  FallItem,
  IPlayer,
  Point,
  Matched4,
  Wait,
} from "@/types";
import { check, generateMap, getKey } from "@/utils/common";
import explodeStateFunction from "./explode";
import fadeStateFunction from "./fade";
import fallStateFunction from "./fall";
import idleStateFunction from "./idle";
import selectStateFunction from "./select";
import waitStateFunction from "./wait";
import { GainTile } from "@/effects/gainTile";
import { SwordAttack } from "@/effects/swordAttack";

const mapFunction: {
  [key in GameState]: GameStateFunction;
} = {
  IDLE: idleStateFunction,
  SELECT: selectStateFunction,
  EXPLODE: explodeStateFunction,
  FALL: fallStateFunction,
  FADE: fadeStateFunction,
  WAIT: waitStateFunction,
};

export class Game implements IGame {
  state: GameState;
  selected: PointExt | null;
  swapped: PointExt | null;
  reswap: boolean;

  fall: {
    [key: number]: FallItem;
  };

  combo: number;
  explosions: PointExt[];
  explodedTiles: TileInfo[];
  matched4Tiles: Point[];
  matched4: Matched4;

  tIdle: number;
  tSelect: number;
  tSwap: number;
  tExplode: number;
  tExplode2: number;
  tFadeIn: number;
  tFadeOut: number;
  tHintDelay: number;

  isFadeIn: boolean;
  isFadeOut: boolean;

  wait: Wait;

  matchedPositions: AllMatchedPositions;
  hintIndex: number;

  players: IPlayer[];
  playerTurn: number;
  turnCount: number;

  needUpdate: boolean;

  computerTimer: number;

  constructor() {}

  init() {
    this.players = [
      new Player({ game: this, index: 0, attack: 7, life: 100, intelligence: PLAYER_INTELLIGENCE, avatar: 0 }),
      new Player({ game: this, index: 1, attack: 9, life: 100, intelligence: 100, avatar: 1 }),
    ];
    this.playerTurn = 0;
    this.turnCount = 1;
    this.matched4 = { turnCount: 0, matchedList: {} };

    base.map = generateMap();
    this.findAllMatchedPositions();
    this.state = "IDLE";
    this.selected = null;
    this.swapped = null;
    this.reswap = false;
    this.fall = {};
    this.combo = 0;
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
    this.needUpdate = true;

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
    const thisPoint = { x, y, point: mapTileInfo[value].point, value };
    const tiles = matched ? [...h, ...v, thisPoint] : [];

    const checkMatch4Turn = (tiles: TileInfo[]) => {
      let check = 0;
      tiles.forEach((tile) => {
        const key = getKey(tile.x, tile.y);
        if (this.matched4.matchedList[key]) return;

        this.matched4.matchedList[key] = true;
        check = 1;
      });
      return check;
    };

    let matched4Tiles: Point[] = [];
    if (h.length >= GAIN_TURN) {
      matched4Tiles = matched4Tiles.concat(h);
      this.matched4.turnCount += checkMatch4Turn([...h, thisPoint]);
    }
    if (v.length >= GAIN_TURN) {
      matched4Tiles = matched4Tiles.concat(v);
      this.matched4.turnCount += checkMatch4Turn([...v, thisPoint]);
    }
    if (matched4Tiles.length) matched4Tiles.push(thisPoint);

    return {
      matched,
      tiles,
      point:
        tiles.reduce((a, b) => a + b.point, 0) +
        (h.length >= GAIN_TURN ? MATCH_4_POINT : 0) +
        (v.length >= GAIN_TURN ? MATCH_4_POINT : 0),
      matched4Tiles,
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
  }

  onClick(e: MouseEvent) {
    if ((this.state !== "IDLE" && this.state !== "SELECT") || this.playerTurn !== 0) return;

    const canvas = base.canvas;

    const offsetX = (e.offsetX * canvas.width) / canvas.clientWidth;
    const offsetY = (e.offsetY * canvas.height) / canvas.clientHeight;

    if (offsetX < 0 || offsetX >= BOARD_SIZE || offsetY < 0 || offsetY >= BOARD_SIZE) return;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

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
      this.idle();
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

  changePlayer() {
    this.playerTurn = 1 - this.playerTurn;
    this.turnCount = 1;
  }

  idle() {
    this.tHintDelay = TIMER_HINT_DELAY_DEFAULT;
    this.state = "IDLE";
    this.combo = 0;

    if (this.needUpdate) {
      if (this.turnCount > 1) effects.add(new FlickeringText({ text: `Còn ${this.turnCount} lượt` }));
      else if (this.turnCount === 0) {
        this.changePlayer();
      }
    }

    this.hintIndex = this.players[this.playerTurn].getHintIndex(this.matchedPositions.length);

    if (this.playerTurn === 1) {
      // Computer
      this.computerTimer = 0;
    }

    this.needUpdate = false;
  }

  explode() {
    const callback = () => {
      this.explosions.forEach(({ x, y }) => (base.map[y][x] = -1));

      this.state = "EXPLODE";
      const center = this.explosions.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });

      if (this.explosions.some(({ value }) => value === TILES.SWORD || value === TILES.SWORDRED)) {
        const player = this.players[1 - this.playerTurn];
        effects.add(
          new SwordAttack(
            this.playerTurn,
            this.playerTurn === 0 ? 0 : SCREEN_WIDTH,
            30,
            player.avatarOffset.x + player.avatar.width / 2,
            player.avatarOffset.y + player.avatar.height / 2
          )
        );
      }

      this.turnCount += this.matched4.turnCount;

      const x = center.x / this.explosions.length;
      const y = center.y / this.explosions.length;
      this.combo += 1;
      const effectX = x * CELL_SIZE + CELL_SIZE_2;
      const effectY = y * CELL_SIZE + CELL_SIZE_2;

      if (this.combo < 2) return;

      effects.add(new FloatingText({ text: `x${this.combo}`, x: effectX, y: effectY + 8 }));
      effects.add(new StarExplosion(effectX, effectY));
    };

    this.wait = {
      timer: 0,
      maxTimer: this.combo === 0 ? 4 : 8,
      callback,
    };
    this.state = "WAIT";
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

  gainTile({ value, x, y }: TileInfo) {
    if (value !== TILES.SWORD && value !== TILES.SWORDRED) {
      const currentPlayer = this.players[this.playerTurn];
      effects.add(
        new GainTile({
          tile: value,
          startX: x * CELL_SIZE + CELL_SIZE_2,
          startY: y * CELL_SIZE + CELL_SIZE_2,
          endX: currentPlayer.avatarOffset.x + currentPlayer.avatar.width / 2,
          endY: currentPlayer.avatarOffset.y,
        })
      );
    }

    switch (value) {
      case TILES.SWORD:
      case TILES.SWORDRED:
        const dmg = this.players[this.playerTurn].attack / 4;
        this.players[1 - this.playerTurn].takeDamage(dmg * (value === TILES.SWORDRED ? 2.5 : 1));
        break;

      case TILES.HEART:
        this.players[this.playerTurn].gainLife(1.5);
        break;

      case TILES.GOLD:
        break;

      case TILES.ENERGY:
        this.players[this.playerTurn].gainEnergy(2);
        break;

      case TILES.MANA:
        this.players[this.playerTurn].gainMana(5);
        break;

      case TILES.EXP:
        break;
    }
  }

  updateComputer() {
    if (this.playerTurn !== 1) return;

    this.computerTimer += 1;

    if (this.computerTimer === 70) {
      this.tSwap = 0;
      const { x0, y0 } = this.matchedPositions[this.hintIndex];

      this.selected = { x: x0, y: y0, value: base.map[y0][x0] };
      base.map[y0][x0] = -1;
      this.state = "SELECT";
    } else if (this.computerTimer === 100) {
      const { x1, y1 } = this.matchedPositions[this.hintIndex];
      this.swapped = { x: x1, y: y1, value: base.map[y1][x1] };
      base.map[y1][x1] = -1;
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

    effects.render();
  }

  update() {
    this.players.forEach((p) => p.update());

    mapFunction[this.state].update(this);

    effects.update();

    this.updateComputer();
  }
}
