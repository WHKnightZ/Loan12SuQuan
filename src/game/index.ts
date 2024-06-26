import {
  base,
  BOARD_COLORS,
  BOARD_SIZE,
  CELL_SIZE,
  GAIN_TURN,
  mapTileInfo,
  MAP_WIDTH,
  MAP_WIDTH_1,
  MATCH_4_SCORE,
  PLAYER_INTELLIGENCE,
  TILES,
  TILE_OFFSET,
  TIMER_HINT_DELAY_DEFAULT,
  CELL_SIZE_HALF,
  COMPUTER_INTELLIGENCE,
  SWORDRED_ATTACK_MULTIPLIER,
} from "@/configs/consts";
import { Effects } from "@/effects";
import { FlickeringText } from "@/effects/flickeringText";
import { FloatingText } from "@/effects/floatingText";
import { StarExplosion } from "@/effects/starExplosion";
import { Player } from "@/player";
import {
  IGame,
  IAllMatchedPositions,
  IGameState,
  IPointExt,
  ITileInfo,
  IGameStateFunction,
  IFallItem,
  IPlayer,
  IPoint,
  IMatched4,
  IWaitProperties,
  IEffect,
  IComputer,
} from "@/types";
import { check, generateMap, getKey } from "@/utils/common";
import { GainTile } from "@/effects/gainTile";
import { SwordAttack } from "@/effects/swordAttack";
import { menuTexture } from "@/textures";
import {
  explodeStateFunction,
  fadeStateFunction,
  fallStateFunction,
  idleStateFunction,
  selectStateFunction,
  waitStateFunction,
} from "./states";
import { Computer } from "./plugins";
import { randomBool } from "@/utils/math";

const mapStateFunction: {
  [key in IGameState]: IGameStateFunction;
} = {
  IDLE: idleStateFunction,
  SELECT: selectStateFunction,
  EXPLODE: explodeStateFunction,
  FALL: fallStateFunction,
  FADE: fadeStateFunction,
  WAIT: waitStateFunction,
};

type ITimeout = { id: number; callback: () => void; currentFrame: number; maxFrame: number };

export class Game implements IGame {
  private timeouts: { currentId: number; list: ITimeout[] };
  private effects: Effects;
  private computer: IComputer;

  state: IGameState;
  players: IPlayer[];
  waitProperties: IWaitProperties;
  selected: IPointExt | null;
  swapped: IPointExt | null;
  reswap: boolean;
  fall: { [key: number]: IFallItem };
  combo: number;
  explosions: IPointExt[];
  explodedTiles: ITileInfo[];
  matched4Tiles: IPoint[];
  matched4: IMatched4;
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
  matchedPositions: IAllMatchedPositions;
  hintIndex: number;
  playerTurn: number;
  turnCount: number;

  constructor() {
    this.timeouts = { currentId: 0, list: [] };
    this.effects = new Effects();
    this.computer = new Computer(this);
    this.init();
  }

  /**
   * Khởi tạo
   */
  init() {
    this.effects.reset();
    this.state = "IDLE";
    this.players = [
      new Player({ index: 0, attack: 7, intelligence: PLAYER_INTELLIGENCE, life: 100, avatar: 0 }),
      new Player({ index: 1, attack: 9, intelligence: COMPUTER_INTELLIGENCE, life: 100, avatar: 1 }),
    ];
    this.playerTurn = 0;
    this.turnCount = 1;
    this.waitProperties = null;

    this.matched4 = { turnCount: 0, matchedList: {} };

    base.map = generateMap();
    this.findAllMatchedPositions();
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

    this.fadeIn();
  }

  /**
   * Kiểm tra cách hoán đổi này ăn được những gì
   * @param x
   * @param y
   * @returns
   */
  matchPosition(x: number, y: number) {
    let h: ITileInfo[] = [];
    let v: ITileInfo[] = [];
    let newX: number, newY: number;
    const posValue = base.map[y][x];
    const compatible = mapTileInfo[posValue].compatible;

    newX = x - 1;
    while (newX >= 0) {
      const value = base.map[y][newX];
      if (!check(value, posValue, compatible)) break;
      h.push({ x: newX, y, score: mapTileInfo[value].score, value });
      newX -= 1;
    }
    newX = x + 1;
    while (newX < MAP_WIDTH) {
      const value = base.map[y][newX];
      if (!check(value, posValue, compatible)) break;
      h.push({ x: newX, y, score: mapTileInfo[value].score, value });
      newX += 1;
    }
    newY = y - 1;
    while (newY >= 0) {
      const value = base.map[newY][x];
      if (!check(value, posValue, compatible)) break;
      v.push({ x, y: newY, score: mapTileInfo[value].score, value });
      newY -= 1;
    }
    newY = y + 1;
    while (newY < MAP_WIDTH) {
      const value = base.map[newY][x];
      if (!check(value, posValue, compatible)) break;
      v.push({ x, y: newY, score: mapTileInfo[value].score, value });
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
    const thisPoint = { x, y, score: mapTileInfo[value].score, value };
    const tiles = matched ? [...h, ...v, thisPoint] : [];

    const checkMatch4Turn = (tiles: ITileInfo[]) => {
      let check = 0;
      tiles.forEach((tile) => {
        const key = getKey(tile.x, tile.y);
        if (this.matched4.matchedList[key]) return;

        this.matched4.matchedList[key] = true;
        check = 1;
      });
      return check;
    };

    let matched4Tiles: IPoint[] = [];
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
      score:
        tiles.reduce((a, b) => a + b.score, 0) +
        (h.length >= GAIN_TURN ? MATCH_4_SCORE : 0) +
        (v.length >= GAIN_TURN ? MATCH_4_SCORE : 0),
      matched4Tiles,
    };
  }

  /**
   * Hoán đổi 2 tile gần nhau
   * @param x0
   * @param y0
   * @param x1
   * @param y1
   */
  swap(x0: number, y0: number, x1: number, y1: number) {
    const tmp = base.map[y0][x0];
    base.map[y0][x0] = base.map[y1][x1];
    base.map[y1][x1] = tmp;
  }

  /**
   * Thử xem cách hoán đổi này có khả thi không, nếu khả thi thì thêm vào danh sách
   * @param allMatchedPositions
   * @param x0
   * @param y0
   * @param x1
   * @param y1
   */
  addMatchedPosition(allMatchedPositions: IAllMatchedPositions, x0: number, y0: number, x1: number, y1: number) {
    this.swap(x0, y0, x1, y1);
    const { matched: m0, score: p0 } = this.matchPosition(x0, y0);
    const { matched: m1, score: p1 } = this.matchPosition(x1, y1);
    const swapDirection = randomBool();
    const pos = swapDirection ? { x0: x1, y0: y1, x1: x0, y1: y0 } : { x0, y0, x1, y1 };
    if (m0 || m1) allMatchedPositions.push({ ...pos, score: p0 + p1 });
    this.swap(x0, y0, x1, y1);
  }

  /**
   * Tìm tất cả các cách hoán đổi khả thi
   */
  findAllMatchedPositions() {
    const allMatchedPositions: IAllMatchedPositions = [];
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

    allMatchedPositions.sort((a, b) => (a.score < b.score ? 1 : -1));
    this.matchedPositions = allMatchedPositions;
  }

  /**
   * Đổi lượt
   */
  changePlayer() {
    this.playerTurn = 1 - this.playerTurn;
    this.turnCount = 1;
  }

  /**
   * Phát nổ mỗi khi ăn một cụm tile
   */
  explode() {
    this.wait(this.combo === 0 ? 4 : 8, () => {
      this.explosions.forEach(({ x, y }) => (base.map[y][x] = -1));

      this.state = "EXPLODE";
      const center = this.explosions.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });

      if (this.explosions.some(({ value }) => value === TILES.SWORD || value === TILES.SWORDRED)) {
        // const player = this.players[1 - this.playerTurn];
        this.createEffect(new SwordAttack(this.players[this.playerTurn], this.players[1 - this.playerTurn]));
      }

      this.turnCount += this.matched4.turnCount;

      const x = center.x / this.explosions.length;
      const y = center.y / this.explosions.length;
      this.combo += 1;
      const effectX = x * CELL_SIZE + CELL_SIZE_HALF;
      const effectY = y * CELL_SIZE + CELL_SIZE_HALF;

      if (this.combo < 2) return;

      this.createEffect(new FloatingText({ text: `x${this.combo}`, x: effectX, y: effectY + 8 }));
      this.createEffect(new StarExplosion(effectX, effectY));
    });
  }

  /**
   * Ăn tile
   * @param param0
   */
  gainTile({ value, x, y }: ITileInfo) {
    if (value !== TILES.SWORD && value !== TILES.SWORDRED) {
      const currentPlayer = this.players[this.playerTurn];
      this.createEffect(
        new GainTile({
          tile: value,
          startX: x * CELL_SIZE + CELL_SIZE_HALF,
          startY: y * CELL_SIZE + CELL_SIZE_HALF,
          endX: currentPlayer.avatarOffset.x + currentPlayer.avatarTexture.width / 2,
          endY: currentPlayer.avatarOffset.y,
        })
      );
    }

    switch (value) {
      case TILES.SWORD:
      case TILES.SWORDRED:
        const dmg = this.players[this.playerTurn].attack / 4;
        this.players[1 - this.playerTurn].takeDamage(dmg * (value === TILES.SWORDRED ? SWORDRED_ATTACK_MULTIPLIER : 1));
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

  /**
   * Chuyển qua state idle
   */
  idle() {
    this.tHintDelay = TIMER_HINT_DELAY_DEFAULT;
    this.state = "IDLE";
    this.combo = 0;

    if (this.turnCount > 1) this.createEffect(new FlickeringText({ text: `Còn ${this.turnCount} lượt` }));
    else if (this.turnCount === 0) {
      this.changePlayer();
    }

    this.hintIndex = this.players[this.playerTurn].getHintIndex(this.matchedPositions.length);

    if (this.playerTurn === 1) {
      // Computer
      this.computer.startTimer();
    }
  }

  /**
   * Đợi một khoảng thời gian mới thực hiện callback
   * @param maxTimer
   * @param callback
   */
  wait(maxTimer: number, callback: () => void) {
    this.waitProperties = {
      timer: 0,
      maxTimer,
      callback,
    };
    this.state = "WAIT";
  }

  /**
   * Chuyển qua state fade in
   */
  fadeIn() {
    this.state = "FADE";
    for (let i = 0; i < MAP_WIDTH; i += 1) this.fall[i] = { list: [], below: MAP_WIDTH_1, pushCount: 0 };
    this.tFadeIn = 0;
    this.isFadeIn = true;
  }

  /**
   * Chuyển qua state fade out
   */
  fadeOut() {
    this.state = "FADE";
    this.tFadeOut = 0;
    this.isFadeOut = true;
  }

  /**
   * Hiển thị
   */
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

    mapStateFunction[this.state].render(this);

    this.effects.render();
  }

  /**
   * Cập nhật
   */
  update() {
    this.handleTimeouts();

    this.players.forEach((p) => p.update());

    mapStateFunction[this.state].update(this);

    this.effects.update();
    this.computer.update();
  }

  /**
   * Tạo effect
   * @param effect
   */
  createEffect(effect: IEffect) {
    this.effects.create(effect);
  }

  /**
   * Xử lý sự kiện click chuột
   * @param e
   * @returns
   */
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

  /**
   * Xử lý sự kiện nhấn phím
   * @param e
   */
  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        this.fadeOut();
        break;
    }
  }

  /**
   * Tạo timeout
   * @param callback
   * @param frame
   * @returns
   */
  createTimeout(callback: () => void, frame: number): number {
    const id = this.timeouts.currentId;
    this.timeouts.currentId += 1;
    this.timeouts.list.push({ id, callback, currentFrame: 0, maxFrame: frame });
    return id;
  }

  /**
   * Xoá timeout
   * @param timeoutId
   */
  clearTimeout(timeoutId: number): void {
    this.timeouts.list = this.timeouts.list.filter((x) => x.id !== timeoutId);
  }

  /**
   * Xử lý danh sách các timeout
   */
  private handleTimeouts() {
    const doneTimeouts: number[] = [];

    this.timeouts.list.forEach((timeout) => {
      const { id, callback, maxFrame } = timeout;
      timeout.currentFrame += 1;
      if (timeout.currentFrame < maxFrame) return;
      callback();
      doneTimeouts.push(id);
    });

    if (doneTimeouts.length > 0) this.timeouts.list = this.timeouts.list.filter((x) => !doneTimeouts.includes(x.id));
  }
}
