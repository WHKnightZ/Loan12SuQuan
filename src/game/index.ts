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
  CELL_SIZE_HALF,
  COMPUTER_INTELLIGENCE,
  SWORDRED_ATTACK_MULTIPLIER,
} from "@/configs/consts";
import { Effects, GainTile } from "@/effects";
import { Player } from "@/player";
import {
  IGame,
  IAllMatchedPositions,
  IGameState,
  IPointExt,
  ITileInfo,
  IFallItem,
  IPlayer,
  IPoint,
  IMatched4,
  IWaitProperties,
  IEffect,
  IComputer,
  IGameStateType,
  MapGameState,
  IIdleGameState,
  ISelectGameState,
  IExplodeGameState,
  IFallGameState,
  IWaitGameState,
  IFadeGameState,
} from "@/types";
import { check, generateMap, getKey } from "@/utils/common";
import { menuTexture } from "@/textures";
import {
  ExplodeGameState,
  FadeGameState,
  FallGameState,
  IdleGameState,
  SelectGameState,
  WaitGameState,
} from "./states";
import { Computer } from "./plugins";
import { randomBool } from "@/utils/math";

type ITimeout = { id: number; callback: () => void; currentFrame: number; maxFrame: number };

export class Game implements IGame {
  private timeouts: { currentId: number; list: ITimeout[] };
  private effects: Effects;
  private mapGameState: { [key in IGameStateType]: MapGameState[key] };
  private idleGameState: IIdleGameState;
  private selectGameState: ISelectGameState;
  private explodeGameState: IExplodeGameState;
  private fallGameState: IFallGameState;
  private fadeGameState: IFadeGameState;
  private waitGameState: IWaitGameState;

  state: IGameState;
  players: IPlayer[];
  computer: IComputer;
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
  matchedPositions: IAllMatchedPositions;
  hintIndex: number;
  playerTurn: number;
  turnCount: number;
  isUpdateTurnCount: boolean;

  constructor() {
    this.timeouts = { currentId: 0, list: [] };
    this.effects = new Effects();
    this.computer = new Computer(this);

    this.idleGameState = new IdleGameState(this);
    this.selectGameState = new SelectGameState(this);
    this.explodeGameState = new ExplodeGameState(this);
    this.fallGameState = new FallGameState(this);
    this.fadeGameState = new FadeGameState(this);
    this.waitGameState = new WaitGameState(this);
    this.mapGameState = {
      IDLE: this.idleGameState,
      SELECT: this.selectGameState,
      EXPLODE: this.explodeGameState,
      FALL: this.fallGameState,
      FADE: this.fadeGameState,
      WAIT: this.waitGameState,
    };

    this.init();
  }

  /**
   * Khởi tạo
   */
  init() {
    this.effects.reset();
    this.state = this.idleGameState;
    this.players = [
      new Player({ index: 0, attributes:{} attack: 7, intelligence: PLAYER_INTELLIGENCE, life: 100, avatar: 0 }),
      new Player({ index: 1, attributes:{} 9, intelligence: COMPUTER_INTELLIGENCE, life: 100, avatar: 1 }),
    ];
    this.playerTurn = 0;
    this.turnCount = 1;
    this.isUpdateTurnCount = true;
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

    this.fadeIn();
  }

  /**
   * Kiểm tra cách hoán đổi này ăn được những gì
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
   */
  swap(x0: number, y0: number, x1: number, y1: number) {
    const tmp = base.map[y0][x0];
    base.map[y0][x0] = base.map[y1][x1];
    base.map[y1][x1] = tmp;
  }

  /**
   * Thử xem cách hoán đổi này có khả thi không, nếu khả thi thì thêm vào danh sách
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
   * Ăn tile
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
        const attackedPlayer = this.players[1 - this.playerTurn];
        attackedPlayer.takeDamage(dmg * (value === TILES.SWORDRED ? SWORDRED_ATTACK_MULTIPLIER : 1));
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
   * Đổi lượt
   */
  changePlayer() {
    this.playerTurn = 1 - this.playerTurn;
    this.turnCount = 1;
  }

  /**
   * Chuyển qua state nổ sau khi đợi một khoảng thời gian
   */
  explode() {
    this.wait(this.combo === 0 ? 4 : 8, () => this.changeState("EXPLODE"));
  }

  /**
   * Đợi một khoảng thời gian mới thực hiện callback
   */
  wait(maxTimer: number, callback: () => void) {
    this.waitProperties = {
      timer: 0,
      maxTimer,
      callback,
    };
    this.changeState("WAIT");
  }

  /**
   * Chuyển qua state fade in
   */
  fadeIn() {
    this.changeState("FADE").fadeIn();
  }

  /**
   * Chuyển qua state fade out
   */
  fadeOut() {
    this.changeState("FADE").fadeOut();
  }

  /**
   * Chuyển state đồng thời gọi hàm invoke() của state đó
   */
  changeState<T extends IGameStateType>(state: T) {
    const newState = this.mapGameState[state];

    newState.invoke();
    this.state = newState;

    return newState;
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
        if (base.map[i][j] === -1 || this.state.is("FADE")) continue;

        base.context.drawImage(mapTileInfo[base.map[i][j]].texture, x + TILE_OFFSET, y + TILE_OFFSET);
      }
    }

    base.context.drawImage(menuTexture, 0, BOARD_SIZE);
    this.players.forEach((p) => p.render());
    this.state.render();
    this.effects.render();
  }

  /**
   * Cập nhật
   */
  update() {
    this.handleTimeouts();

    this.players.forEach((p) => p.update());
    this.state.update();
    this.effects.update();
    this.computer.update();
  }

  /**
   * Tạo effect
   */
  createEffect(effect: IEffect) {
    this.effects.create(effect);
  }

  /**
   * Xử lý sự kiện click chuột
   */
  onClick(e: MouseEvent) {
    if ((!this.state.is("IDLE") && !this.state.is("SELECT")) || this.playerTurn !== 0) return;

    const canvas = base.canvas;

    const offsetX = (e.offsetX * canvas.width) / canvas.clientWidth;
    const offsetY = (e.offsetY * canvas.height) / canvas.clientHeight;

    if (offsetX < 0 || offsetX >= BOARD_SIZE || offsetY < 0 || offsetY >= BOARD_SIZE) return;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (!this.selected) {
      this.selected = { x, y, value: base.map[y][x] };
      base.map[y][x] = -1;
      this.changeState("SELECT");
      return;
    }

    if (Math.abs(x - this.selected.x) + Math.abs(y - this.selected.y) !== 1) {
      const { x, y, value } = this.selected;
      base.map[y][x] = value;
      this.selected = null;
      this.changeState("IDLE");
      return;
    }

    this.swapped = { x, y, value: base.map[y][x] };
    base.map[y][x] = -1;
  }

  /**
   * Xử lý sự kiện nhấn phím
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
   */
  createTimeout(callback: () => void, frame: number): number {
    const id = this.timeouts.currentId;
    this.timeouts.currentId += 1;
    this.timeouts.list.push({ id, callback, currentFrame: 0, maxFrame: frame });
    return id;
  }

  /**
   * Xoá timeout
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
