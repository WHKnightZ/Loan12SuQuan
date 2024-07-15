import {
  IGame,
  IGamePlugin,
  IGameStateManager,
  IGameStateType,
  IInGameStateType,
  IPoint,
  IPointExt,
  ITileInfo,
} from "@/types";
import { GameState, GameStateManager } from "@/extensions";
import { IAllMatchedPositions, IFallItem, IInGameState, IMatched4, IPlayer, IWaitProperties } from "./types";
import {
  BOARD_COLORS,
  BOARD_SIZE,
  CELL_SIZE,
  CELL_SIZE_HALF,
  ENEMIES,
  GAIN_TURN,
  HEROES,
  MAP_WIDTH,
  MAP_WIDTH_1,
  MATCH_4_SCORE,
  PLAYER_INTELLIGENCE,
  SWORDRED_ATTACK_MULTIPLIER,
  TILES,
  TILE_OFFSET,
  base,
  mapTileInfo,
} from "@/configs/consts";
import { Player } from "./player";
import { check, generateMap, getKey } from "@/utils/common";
import { randomBool } from "@/utils/math";
import { GainTile } from "@/effects";
import { menuTexture } from "@/textures";
import {
  InGameExplodeState,
  InGameFadeState,
  InGameFallState,
  InGameIdleState,
  InGameSelectItemState,
  InGameSelectState,
  InGameWaitState,
} from "./states";
import { ComputerPlugin, FinishPlugin } from "./plugins";

export class InGameState extends GameState<IGame, IGameStateType> implements IInGameState {
  private finishPlugin: IGamePlugin<IInGameState>;

  stateManager: IGameStateManager<IInGameState, IInGameStateType>;
  players: IPlayer[];
  computerPlugin: IGamePlugin<IInGameState>;
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
  isUpdatedTurnCount: boolean;
  isFinished: boolean;
  winner: number;

  constructor(parent: IGame) {
    super(parent, "IN_GAME");

    this.computerPlugin = new ComputerPlugin(this);
    this.finishPlugin = new FinishPlugin(this);

    this.stateManager = new GameStateManager([
      {
        name: "IDLE",
        state: new InGameIdleState(this),
        isDefault: true,
      },
      {
        name: "SELECT",
        state: new InGameSelectState(this),
      },
      {
        name: "EXPLODE",
        state: new InGameExplodeState(this),
      },
      {
        name: "FALL",
        state: new InGameFallState(this),
      },
      {
        name: "FADE",
        state: new InGameFadeState(this),
      },
      {
        name: "WAIT",
        state: new InGameWaitState(this),
      },
      {
        name: "SELECT_ITEM",
        state: new InGameSelectItemState(this),
      },
    ]);
  }

  init(enemyIndex: number): void {
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
    this.isFinished = false;

    this.players = [
      new Player({ inGame: this, index: 0, attributes: { ...HEROES.TRANG_SI, intelligence: PLAYER_INTELLIGENCE } }),
      new Player({ inGame: this, index: 1, attributes: ENEMIES[enemyIndex] }),
    ];
    this.playerTurn = 0;
    this.turnCount = 1;
    this.isUpdatedTurnCount = true;

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
    const activePlayer = this.getActivePlayer();
    const passivePlayer = this.getPassivePlayer();

    if (value !== TILES.SWORD && value !== TILES.SWORDRED) {
      base.game.createEffect(
        new GainTile({
          tile: value,
          startX: x * CELL_SIZE + CELL_SIZE_HALF,
          startY: y * CELL_SIZE + CELL_SIZE_HALF,
          endX: activePlayer.avatarOffset.x + activePlayer.avatarTexture.width / 2,
          endY: activePlayer.avatarOffset.y,
        })
      );
    }

    switch (value) {
      case TILES.SWORD:
      case TILES.SWORDRED:
        const dmg = activePlayer.attack;
        passivePlayer.takeDamage(dmg * (value === TILES.SWORDRED ? SWORDRED_ATTACK_MULTIPLIER : 1));
        break;

      case TILES.HEART:
        activePlayer.gainLife(1.5);
        break;

      case TILES.GOLD:
        break;

      case TILES.ENERGY:
        activePlayer.gainEnergy(6);
        break;

      case TILES.MANA:
        activePlayer.gainMana(5);
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
   * Lấy ra người chơi ở lượt này
   */
  getActivePlayer() {
    return this.players[this.playerTurn];
  }
  /**
   * Lấy ra người chơi còn lại
   */
  getPassivePlayer() {
    return this.players[1 - this.playerTurn];
  }
  /**
   * Kết thúc trò chơi: 0: Thắng hoặc 1: Thua
   */
  finish(state: number) {
    this.winner = state;
    this.finishPlugin.start();
  }
  /**
   * Chuyển qua state nổ sau khi đợi một khoảng thời gian
   */
  explode() {
    this.wait(this.combo === 0 ? 4 : 8, () => this.stateManager.changeState("EXPLODE"));
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
    this.stateManager.changeState("WAIT");
  }
  /**
   * Chuyển qua state fade in
   */
  fadeIn() {
    this.stateManager.changeState("FADE", false);
  }
  /**
   * Chuyển qua state fade out
   */
  fadeOut() {
    this.stateManager.changeState("FADE", true);
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
        if (base.map[i][j] === -1 || this.stateManager.is("FADE")) continue;

        base.context.drawImage(mapTileInfo[base.map[i][j]].texture, x + TILE_OFFSET, y + TILE_OFFSET);
      }
    }

    base.context.drawImage(menuTexture, 0, BOARD_SIZE);
    this.players.forEach((p) => p.render());
    this.stateManager.render();
    this.finishPlugin.render();
  }
  /**
   * Cập nhật
   */
  update() {
    this.players.forEach((p) => p.update());
    this.stateManager.update();
    this.computerPlugin.update();
    this.finishPlugin.update();
  }
  /**
   * Xử lý sự kiện click chuột
   */
  onClick(e: MouseEvent) {
    if ((!this.stateManager.is("IDLE") && !this.stateManager.is("SELECT")) || this.playerTurn !== 0) return;

    const canvas = base.canvas;

    const offsetX = (e.offsetX * canvas.width) / canvas.clientWidth;
    const offsetY = (e.offsetY * canvas.height) / canvas.clientHeight;

    if (offsetX < 0 || offsetX >= BOARD_SIZE || offsetY < 0 || offsetY >= BOARD_SIZE) return;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (!this.selected) {
      this.selected = { x, y, value: base.map[y][x] };
      base.map[y][x] = -1;
      this.stateManager.changeState("SELECT");
      return;
    }

    if (Math.abs(x - this.selected.x) + Math.abs(y - this.selected.y) !== 1) {
      const { x, y, value } = this.selected;
      base.map[y][x] = value;
      this.selected = null;
      this.stateManager.changeState("IDLE");
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
}
