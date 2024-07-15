import { IGameState, IGameStateManager } from "@/types";

/**
 * Base game state
 */
export class GameState<TParent, TGameStateType extends string> implements IGameState<TParent, TGameStateType> {
  protected type: TGameStateType;

  parent: TParent;

  constructor(parent: TParent, type: TGameStateType) {
    this.parent = parent;
    this.type = type;
  }

  /**
   * Hàm sẽ được thực thi khi vừa chuyển game state
   */
  init(...params: any[]): void {}
  /**
   * Hàm check xem game state này có giống với tham số truyền vào không
   */
  is(type: TGameStateType) {
    return type === this.type;
  }
  /**
   * Hiển thị
   */
  render() {}
  /**
   * Cập nhật
   */
  update() {}
  /**
   * Xử lý sự kiện click chuột
   */
  onClick(e: MouseEvent) {}
  /**
   * Xử lý sự kiện nhấn phím
   */
  onKeyDown(e: KeyboardEvent) {}
}

export class GameStateManager<TParent, TGameStateType extends string>
  implements IGameStateManager<TParent, TGameStateType>
{
  private mapState: { [key in TGameStateType]: GameState<TParent, TGameStateType> };
  private state: GameState<TParent, TGameStateType>;
  private defaultState: GameState<TParent, TGameStateType>;
  private prevState: GameState<TParent, TGameStateType>; // Sử dụng để làm transition, tạm thời chưa dùng

  constructor(states: { name: TGameStateType; state: GameState<TParent, TGameStateType>; isDefault?: boolean }[]) {
    this.mapState = {} as any;

    states.forEach(({ name, state, isDefault }) => {
      this.mapState[name] = state;

      if (isDefault) this.defaultState = state;
    });

    this.state = this.defaultState;
    this.state.init();
  }

  /**
   * Chuyển sang state mới, đồng thời gọi hàm init() của state đó
   */
  changeState<T extends TGameStateType>(newState: T, ...params: any[]) {
    this.state = this.mapState[newState];

    this.state.init(...params);

    return this.state;
  }
  /**
   * Hàm check xem state hiện tại có giống với tham số truyền vào không
   */
  is(type: TGameStateType) {
    return this.state.is(type);
  }
  /**
   * Hiển thị
   */
  render() {
    this.state.render();
  }
  /**
   * Cập nhật
   */
  update() {
    this.state.update();
  }
  /**
   * Xử lý sự kiện click chuột
   */
  onClick(e: MouseEvent) {
    this.state.onClick(e);
  }
  /**
   * Xử lý sự kiện nhấn phím
   */
  onKeyDown(e: KeyboardEvent) {
    this.state.onKeyDown(e);
  }
}
