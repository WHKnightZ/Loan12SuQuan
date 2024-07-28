export type IPoint = { x: number; y: number };
export type IPointExt = IPoint & { value: number };
export type IMapPoint = IPoint & { hidden?: boolean; index?: number };
export type ITileInfo = IPointExt & { score: number };

export type ITileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";
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

export type IPassivable = {
  active: boolean;
};

export type ILivable = {
  alive: boolean;
};

export type IHasTimer = {
  timer: number;
};

export type IEffect = ILivable & IRenderable;

export type IMouseEvent = {
  offsetX: number;
  offsetY: number;
};

export type IHasEvent = {
  /**
   * Xử lý sự kiện move chuột
   */
  onMouseMove(e: IMouseEvent): void;
  /**
   * Xử lý sự kiện click chuột
   */
  onMouseDown(e: IMouseEvent): void;
  /**
   * Xử lý sự kiện nhả chuột
   */
  onMouseUp(e: IMouseEvent): void;
  /**
   * Xử lý sự kiện nhấn phím
   */
  onKeyDown(e: KeyboardEvent): void;
};

export type IGamePlugin<T> = IRenderable &
  IHasTimer &
  IPassivable & {
    parent: T;

    /**
     * Bắt đầu khởi chạy plugin
     */
    start(): void;
    /**
     * Kết thúc chạy plugin
     */
    stop(): void;
  };

export type IGameStateType = "SELECT_STAGE" | "IN_GAME";
export type IInGameStateType = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE" | "WAIT" | "SELECT_ITEM";

export type IGameState<TParent, TGameStateType extends string> = IRenderable &
  IHasEvent & {
    parent: TParent;

    /**
     * Hàm sẽ được thực thi khi vừa chuyển game state
     */
    init(...params: any[]): void;
    /**
     * Hàm check xem game state này có giống với tham số truyền vào không
     */
    is(type: TGameStateType): boolean;
  };

export type IGameStateManager<TParent, TGameStateType extends string> = IRenderable &
  IHasEvent & {
    /**
     * Chuyển sang state mới, đồng thời gọi hàm init() của state đó
     */
    changeState<T extends TGameStateType>(newState: T, ...params: any[]): IGameState<TParent, TGameStateType>;
    /**
     * Hàm check xem state hiện tại có giống với tham số truyền vào không
     */
    is(type: TGameStateType): boolean;
  };

export type IGame = IRenderable &
  IHasEvent & {
    /**
     * Quản lý state
     */
    stateManager: IGameStateManager<IGame, IGameStateType>;

    /**
     * Tạo 1 effect
     */
    createEffect(effect: IEffect): void;
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

export type IFontFamily = "CAP_WHITE" | "CAP_YELLOW" | "ARIAL" | "BLACK" | "VERDANA";

export type ICharacterId =
  | "trang-si"
  | "linh-quen"
  | "cay-an-thit"
  | "nguyen-bac"
  | "quy-ong"
  | "linh-binh-kieu"
  | "quy-lun"
  | "son-tac"
  | "linh-hoi-ho"
  | "chon-tinh"
  | "ly-khue"
  | "moc-tinh"
  | "linh-phong-chau"
  | "la-duong"
  | "linh-tam-dai"
  | "xa-tinh"
  | "tuong-do-dong"
  | "doc-nhan-tru"
  | "do-canh-thac"
  | "ngo-xuong-xi"
  | "nhen-tinh"
  | "nguyen-tri-kha"
  | "ngo-nhat-khanh"
  | "sau-quy"
  | "kieu-thuan"
  | "kieu-cong-han";

export type ICharacterWithoutIdAttributes = {
  name: string;
  attack: number;
  intelligence: number;
  life: number;
};

export type ICharacterAttributes = ICharacterWithoutIdAttributes & {
  id: string;
};
