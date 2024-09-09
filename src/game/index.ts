import { Effects } from "@/effects";
import { GameStateManager } from "@/extensions";
import { IEffect, IGame, IGameStateType, IMouseEvent } from "@/types";
import { SelectStageState } from "./states/selectStage";
import { InGameState } from "./states/inGame";
import { base } from "@/configs/consts";

type ITimeout = { id: number; callback: () => void; currentFrame: number; maxFrame: number };

export class Game implements IGame {
  private timeouts: { currentId: number; list: ITimeout[] };
  private effects: Effects;

  stateManager: GameStateManager<IGame, IGameStateType>;

  constructor() {
    this.timeouts = { currentId: 1, list: [] };
    this.effects = new Effects();
    this.effects.reset();

    this.stateManager = new GameStateManager([
      { name: "SELECT_STAGE", state: new SelectStageState(this), isDefault: true },
      { name: "IN_GAME", state: new InGameState(this) },
    ]);

    // this.stateManager.changeState("SELECT_STAGE");
    this.stateManager.changeState("IN_GAME", 0);
  }

  /**
   * Hiển thị
   */
  render() {
    this.stateManager.render();
    this.effects.render();
  }
  /**
   * Cập nhật
   */
  update() {
    this.handleTimeouts();

    this.stateManager.update();
    this.effects.update();
  }
  /**
   * Tạo effect
   */
  createEffect(effect: IEffect) {
    this.effects.create(effect);
  }
  /**
   * Xử lý sự kiện move chuột
   */
  onMouseMove(e: IMouseEvent) {
    const canvas = base.canvas;
    const offsetX = (e.offsetX * canvas.width) / canvas.clientWidth;
    const offsetY = (e.offsetY * canvas.height) / canvas.clientHeight;

    this.stateManager.onMouseMove({ offsetX, offsetY });
  }
  /**
   * Xử lý sự kiện click chuột
   */
  onMouseDown(e: IMouseEvent) {
    const canvas = base.canvas;
    const offsetX = (e.offsetX * canvas.width) / canvas.clientWidth;
    const offsetY = (e.offsetY * canvas.height) / canvas.clientHeight;

    this.stateManager.onMouseDown({ offsetX, offsetY });
  }
  /**
   * Xử lý sự kiện nhả chuột
   */
  onMouseUp() {
    this.stateManager.onMouseUp();
  }
  /**
   * Xử lý sự kiện chuột đi ra khỏi canvas
   */
  onMouseLeave() {
    this.stateManager.onMouseLeave();
  }
  /**
   * Xử lý sự kiện nhấn phím
   */
  onKeyDown(e: KeyboardEvent) {
    this.stateManager.onKeyDown(e);
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
