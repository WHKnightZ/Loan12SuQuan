export type ITileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

export type IPoint = { x: number; y: number };

export type IPointExt = IPoint & { value: number };

export type IAllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; score: number }[];

export type ITileInfo = IPointExt & { score: number };

export type IDirection = "UP" | "RIGHT" | "DOWN" | "LEFT";

export type IRenderable = {
  /**
   * Hiển thị
   */
  render(): void;
  /**
   * Cập nhật
   */
  update(): void;
};

export type ILivable = {
  alive: boolean;
};

export type IHasTimer = {
  timer: number;
};

export type IEffect = ILivable & IRenderable;

export type IFallItem = {
  list: (IPointExt & { offset: number; velocity: number })[];
  below: number;
  pushCount: number;
};

export type IMatched4 = {
  turnCount: number;
  matchedList: { [key: string]: boolean };
};

export type IWaitProperties = IHasTimer & {
  maxTimer: number;
  callback: () => void;
};

export type IPlayerAttribute = IHasTimer & {
  realValue: number;
  maxValue: number;
  displayValue: number;
};

export type IPlayerAttributeExtra = {
  attribute: IPlayerAttribute;
  texture: HTMLImageElement;
  maxTimer: number;
};

export type IPlayer = IRenderable & {
  index: number;
  attack: number;
  avatarTexture: HTMLImageElement;
  avatarOffset: { x: number; y: number };

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
};

export type IComputer = IHasTimer & {
  start(): void;
  update(): void;
};

export type IGameStateType = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE" | "WAIT" | "FINISH";

export type IGameState = IRenderable & {
  type: IGameStateType;
  game: IGame;

  /**
   * Hàm sẽ được thực thi khi vừa chuyển game state
   */
  invoke(): void;
  /**
   * Hàm check xem game state này có giống với tham số truyền vào không
   */
  is(type: IGameStateType): boolean;
};

export type IIdleGameState = IGameState;
export type ISelectGameState = IGameState;
export type IExplodeGameState = IGameState;
export type IFallGameState = IGameState;
export type IFadeGameState = IGameState & {
  isFadeIn: boolean;
  isFadeOut: boolean;
  fadeInTimer: number;
  fadeOutTimer: number;

  /**
   * Fade in
   */
  fadeIn(): void;
  /**
   * Fade out
   */
  fadeOut(): void;
};
export type IWaitGameState = IGameState;
export type IFinishGameState = IGameState & {
  win(): void;
  lose(): void;
};

export type MapGameState = {
  IDLE: IIdleGameState;
  SELECT: ISelectGameState;
  EXPLODE: IExplodeGameState;
  FALL: IFallGameState;
  FADE: IFadeGameState;
  WAIT: IWaitGameState;
  FINISH: IFinishGameState;
};

export type IGame = IRenderable & {
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
  isUpdatedTurnCount: boolean;
  isFinished: boolean;

  /**
   * Khởi tạo
   */
  init(): void;
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
  /**
   * Chuyển state đồng thời gọi hàm invoke() của state đó
   */
  changeState<T extends IGameStateType>(state: T): MapGameState[T];
  /**
   * Tạo 1 effect
   */
  createEffect(effect: IEffect): void;
  /**
   * Xử lý sự kiện click chuột
   */
  onClick(e: MouseEvent): void;
  /**
   * Xử lý sự kiện nhấn phím
   */
  onKeyDown(e: KeyboardEvent): void;
  /**
   * Tạo timeout
   */
  createTimeout(callback: () => void, frame: number): number;
  /**
   * Xoá timeout
   */
  clearTimeout(timeoutId: number): void;
};

export type IBase = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  game: IGame;
  map: number[][];
};

export type IHintArrow = {
  offset: { x: number; y: number };
  drt: { x: number; y: number };
  texture: HTMLImageElement;
};

export type IFontChar = { texture: HTMLImageElement; offsetY: number };

export type IHeroId = "TRANG_SI" | "LINH_QUEN" | "ANH_HUNG" | "QUAI_VAT" | "KIEU_CONG_HAN";

export type IHeroAttributes = {
  name: string;
  attack: number;
  intelligence: number;
  life: number;
  avatar: number;
};
