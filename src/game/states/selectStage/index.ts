import {
  AVATAR_CENTER,
  AVATAR_WIDTH,
  CYCLE_HEIGHT,
  CYCLE_POINTS,
  ENEMIES,
  MAP,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  base,
} from "@/configs/consts";
import { Font } from "@/elements/font";
import { GameState } from "@/extensions";
import { avatarTextures, backgroundTextures } from "@/textures";
import { IGame, IGameStateType, IMapPointAvatar, IMouseEvent } from "@/types";
import { curveThroughPoints, drawPoints } from "@/utils/common";
import { sqr } from "@/utils/math";

const AVATARS_PER_ROW = 5;
const avatarOffsetX = 50;
const avatarOffsetY = 110;
const avatarGapX = 20;
const avatarGapY = 15;
let avatarFullWidth: number;
let avatarFullHeight: number;

const OFFSET_MAP = 80;
const OFFSET_DRAW_AVATAR = 200;

const getAvatarOffsetX = (index: number) => (index % AVATARS_PER_ROW) * avatarFullWidth + avatarOffsetX;
const getAvatarOffsetY = (index: number) => Math.floor(index / AVATARS_PER_ROW) * avatarFullHeight + avatarOffsetY;

export class SelectStageState extends GameState<IGame, IGameStateType> {
  private activeAvatar: number;
  private oldOffsetX: number;
  private oldOffsetY: number;
  private offsetY: number;
  private offsetY2: number;
  private velocity: number;
  private lastTime: number;
  private offset: number;
  private dragging: boolean;
  private gradient: CanvasGradient;
  private factor: number;
  private map: IMapPointAvatar[];
  private canChoose: boolean; // Check xem người dùng có ý định chọn stage ko, chỉ có ý định khi khoảng cách từ lúc mouseDown đến lúc mouseUp rất nhỏ

  constructor(parent: IGame) {
    super(parent, "SELECT_STAGE");

    this.activeAvatar = -1;
    avatarFullWidth = AVATAR_WIDTH + avatarGapX;
    avatarFullHeight = AVATAR_WIDTH + avatarGapY;

    this.offsetY = OFFSET_MAP;
    this.offsetY2 = 0;
    this.dragging = false;
    this.factor = 1;

    this.velocity = 0;
    this.map = [];

    this.gradient = base.context.createLinearGradient(0, 0, 0, 125);
    this.gradient.addColorStop(0.0, "#000000bf");
    this.gradient.addColorStop(0.7, "#0000005f");
    this.gradient.addColorStop(1.0, "#00000000");
  }

  /**
   * Hiển thị
   */
  render() {
    const context = base.context;

    context.reset();
    context.drawImage(backgroundTextures.menu, 0, -40, SCREEN_WIDTH, 640);

    curveThroughPoints(this.map);
    drawPoints(this.map);

    context.fillStyle = this.gradient;
    context.fillRect(0, 0, 480, 125);

    Font.draw({
      text: "Chọn Quân Địch",
      y: 60,
    });
  }
  /**
   * Cập nhật
   */
  update() {
    if (!this.dragging && this.offsetY > OFFSET_MAP) {
      this.velocity = 0;
      this.offsetY *= this.factor;
      this.factor = 1 + (this.factor - 1) * 0.93;
      if (this.factor > 0.99) this.factor = 0.99;
    }

    this.offsetY += this.velocity;
    this.velocity *= 0.94;

    const from = -this.offsetY - this.offsetY2 - OFFSET_DRAW_AVATAR;
    const to = from + SCREEN_HEIGHT + OFFSET_DRAW_AVATAR;

    let a = Math.floor(from / CYCLE_HEIGHT);
    const b = Math.ceil(to / CYCLE_HEIGHT);

    // TODO: Hover + touch thì show popup chi tiết enemy
    if (a < 0) a = 0;

    const newMap = MAP.slice(a * CYCLE_POINTS, b * CYCLE_POINTS); // Ước lượng ra các điểm có thể có dựa theo toạ độ màn hình
    this.map = newMap
      .map((p) => ({ ...p, y: p.y + this.offsetY + this.offsetY2 }))
      .filter(({ y }) => y > -OFFSET_DRAW_AVATAR && y < SCREEN_HEIGHT + OFFSET_DRAW_AVATAR); // Chỉ vẽ những điểm nằm trong màn hình
  }
  /**
   * Xử lý sự kiện move chuột
   */
  onMouseMove({ offsetX, offsetY }: IMouseEvent) {
    if (!this.dragging) return;

    const o = offsetY - this.offset;
    const t = performance.now();
    const v = o / (t - this.lastTime) / 2;
    this.lastTime = t;
    this.offset = offsetY;
    this.velocity += v;
    this.offsetY2 = offsetY - this.oldOffsetY;

    if (sqr(offsetX - this.oldOffsetX) + sqr(offsetY - this.oldOffsetY) > 600) this.canChoose = false; // Move chuột quá xa điểm ban đầu => ko muốn chọn stage mà muốn scroll
  }
  /**
   * Xử lý sự kiện click chuột
   */
  onMouseDown({ offsetX, offsetY }: IMouseEvent) {
    this.canChoose = true;

    this.activeAvatar = -1;
    this.map.forEach(({ x, y, avatar, hidden }) => {
      if (hidden || this.activeAvatar != -1) return;

      if (
        offsetX >= x - AVATAR_CENTER &&
        offsetX <= x + AVATAR_CENTER &&
        offsetY >= y - AVATAR_CENTER &&
        offsetY <= y + AVATAR_CENTER
      ) {
        this.activeAvatar = avatar;
      }
    });

    this.dragging = true;
    this.oldOffsetX = offsetX;
    this.oldOffsetY = offsetY;

    this.lastTime = performance.now();
    this.offset = offsetY;
  }
  /**
   * Xử lý sự kiện nhả chuột
   */
  onMouseUp() {
    this.offsetY += this.offsetY2;
    this.offsetY2 = 0;
    this.dragging = false;
    this.factor = 0.9;

    if (!this.canChoose || this.activeAvatar === -1) return;

    this.parent.stateManager.changeState("IN_GAME", this.activeAvatar);
  }
}
