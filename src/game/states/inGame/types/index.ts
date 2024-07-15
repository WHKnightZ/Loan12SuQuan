import {
  IGame,
  IGamePlugin,
  IGameState,
  IGameStateManager,
  IGameStateType,
  IHasTimer,
  IInGameStateType,
  IPoint,
  IPointExt,
  IRenderable,
  ITileInfo,
} from "@/types";

export type IFallItem = {
  list: (IPointExt & { offset: number; velocity: number })[];
  below: number;
  pushCount: number;
};

export type IMatched4 = {
  turnCount: number;
  matchedList: { [key: string]: boolean };
};

export type IAllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; score: number }[];

export type IWaitProperties = IHasTimer & {
  maxTimer: number;
  callback: () => void;
};

export type IPlayerAttribute = IHasTimer & {
  realValue: number;
  maxValue: number;
  displayValue: number;
  currentDisplayValue: number;
  timeoutId: number;
};

export type IPlayerAttributeExtra = {
  attribute: IPlayerAttribute;
  texture: HTMLImageElement;
  maxTimer: number;
};

export type IPowerAttackPlugin = IGamePlugin<IPlayer> & {
  /**
   * Cho phép gây thêm sát thương chưa
   */
  allow: boolean;
  /**
   * Khi cho phép rồi thì đã gây sát thương chưa
   */
  hasCausedDamage: boolean;
};

export type IPlayer = IRenderable & {
  /**
   * Index của player
   */
  index: number;
  /**
   * Sức tấn công của player
   */
  attack: number;
  /**
   * Offset của avatar
   */
  avatarOffset: { x: number; y: number };
  /**
   * Texture của avatar
   */
  avatarTexture: HTMLImageElement;
  /**
   * Hiệu ứng sức mạnh
   */
  powerAttackPlugin: IPowerAttackPlugin;

  /**
   * Mục đích: lấy ngẫu nhiên một nước đi dựa theo chỉ số trí tuệ
   * Trí tuệ càng cao => tỉ lệ ngẫu nhiên ra 100 càng lớn => nước đi càng tốt
   */
  getHintIndex(matchedLength: number): number;
  /**
   * Nhận sát thương sau một khoảng thời gian
   */
  takeDamage(damage: number, duration?: number): void;
  /**
   * Hồi máu
   */
  gainLife(value: number): void;
  /**
   * Hồi năng lượng
   */
  gainEnergy(value: number): void;
  /**
   * Hồi mana
   */
  gainMana(value: number): void;
  /**
   * Gây hiệu ứng rung avatar khi nhận sát thương
   */
  shock(): void;
  /**
   * Đưa năng lượng về 0
   */
  resetEnergy(): void;
};

export type IHintArrow = {
  offset: { x: number; y: number };
  drt: { x: number; y: number };
  texture: HTMLImageElement;
};

export type IInGameState = IGameState<IGame, IGameStateType> & {
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

  /**
   * Kiểm tra cách hoán đổi này ăn được những gì
   */
  matchPosition(x: number, y: number): { matched: boolean; tiles: ITileInfo[]; score: number; matched4Tiles: IPoint[] };
  /**
   * Hoán đổi 2 tile gần nhau
   */
  swap(x0: number, y0: number, x1: number, y1: number): void;
  /**
   * Thử xem cách hoán đổi này có khả thi không, nếu khả thi thì thêm vào danh sách
   */
  addMatchedPosition(allMatchedPositions: IAllMatchedPositions, x0: number, y0: number, x1: number, y1: number): void;
  /**
   * Tìm tất cả các cách hoán đổi khả thi
   */
  findAllMatchedPositions(): void;
  /**
   * Ăn tile
   */
  gainTile(tile: ITileInfo): void;
  /**
   * Đổi lượt
   */
  changePlayer(): void;
  /**
   * Lấy ra người chơi ở lượt này
   */
  getActivePlayer(): IPlayer;
  /**
   * Lấy ra người chơi còn lại
   */
  getPassivePlayer(): IPlayer;
  /**
   * Kết thúc trò chơi: 0: Thắng hoặc 1: Thua
   */
  finish(state: number): void;
  /**
   * Chuyển qua state nổ sau khi đợi một khoảng thời gian
   */
  explode(): void;
  /**
   * Đợi một khoảng thời gian mới thực hiện callback
   */
  wait(maxTimer: number, callback: () => void): void;
  /**
   * Chuyển qua state fade in
   */
  fadeIn(): void;
  /**
   * Chuyển qua state fade out
   */
  fadeOut(): void;
};
