export type ITileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

export type IPoint = { x: number; y: number };

export type IPointExt = IPoint & { value: number };

export type IAllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; score: number }[];

export type ITileInfo = IPointExt & { score: number };

export type IDirection = "UP" | "RIGHT" | "DOWN" | "LEFT";

export type IGameState = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE" | "WAIT";

export type IRenderable = {
  render(): void;
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
  pushCount?: number;
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
  value: number;
  maxValue: number;
  display: number;
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

  getHintIndex(matchedLength: number): number;
  takeDamage(damage: number): void;
  gainLife(value: number): void;
  gainEnergy(value: number): void;
  gainMana(value: number): void;
  shock(): void;
};

export type IComputer = IHasTimer & {
  startTimer(): void;
  update(): void;
};

export type IGame = IRenderable & {
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

  init(): void;
  matchPosition(x: number, y: number): { matched: boolean; tiles: ITileInfo[]; score: number; matched4Tiles: IPoint[] };
  swap(x0: number, y0: number, x1: number, y1: number): void;
  addMatchedPosition(allMatchedPositions: IAllMatchedPositions, x0: number, y0: number, x1: number, y1: number): void;
  findAllMatchedPositions(): void;
  changePlayer(): void;
  explode(): void;
  gainTile(tile: ITileInfo): void;

  idle(): void;
  wait(maxTimer: number, callback: () => void): void;
  explode(): void;
  fadeIn(): void;
  fadeOut(): void;

  createEffect(effect: IEffect): void;
  onClick(e: MouseEvent): void;
  onKeyDown(e: KeyboardEvent): void;
  createTimeout(callback: () => void, frame: number): number;
  clearTimeout(timeoutId: number): void;
};

export type IBase = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  game: IGame;
  map: number[][];
};

export type IGameStateFunction = {
  render: (self: IGame) => void;
  update: (self: IGame) => void;
};

export type IHintArrow = {
  offset: { x: number; y: number };
  drt: { x: number; y: number };
  texture: HTMLImageElement;
};

export type IFontChar = { texture: HTMLImageElement; offsetY: number };
