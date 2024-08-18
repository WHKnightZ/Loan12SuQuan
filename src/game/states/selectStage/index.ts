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
import { IGame, IGameStateType, IMouseEvent } from "@/types";
import { curveThroughPoints, curveThroughPoints2, curveThroughPoints3, drawPoints } from "@/utils/common";

const AVATARS_PER_ROW = 5;
const avatarOffsetX = 50;
const avatarOffsetY = 110;
const avatarGapX = 20;
const avatarGapY = 15;
let avatarFullWidth: number;
let avatarFullHeight: number;

const OFFSET_DRAW_AVATAR = 200;

const getAvatarOffsetX = (index: number) => (index % AVATARS_PER_ROW) * avatarFullWidth + avatarOffsetX;
const getAvatarOffsetY = (index: number) => Math.floor(index / AVATARS_PER_ROW) * avatarFullHeight + avatarOffsetY;

export class SelectStageState extends GameState<IGame, IGameStateType> {
  private activeAvatar: number;
  private oldOffsetY: number;
  private offsetY: number;
  private offsetY2: number;
  private velocity: number;
  private lastTime: number;
  private offset: number;
  private dragging: boolean;
  private gradient: CanvasGradient;

  constructor(parent: IGame) {
    super(parent, "SELECT_STAGE");

    this.activeAvatar = -1;
    avatarFullWidth = AVATAR_WIDTH + avatarGapX;
    avatarFullHeight = AVATAR_WIDTH + avatarGapY;

    this.offsetY = 80;
    this.offsetY2 = 0;
    this.dragging = false;

    this.velocity = 0;

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

    const from = -this.offsetY - this.offsetY2 - OFFSET_DRAW_AVATAR;
    const to = from + SCREEN_HEIGHT + OFFSET_DRAW_AVATAR;

    let a = Math.floor(from / CYCLE_HEIGHT);
    const b = Math.ceil(to / CYCLE_HEIGHT);

    // TODO: Hover + touch thì show popup chi tiết enemy
    // TODO: Có thể thêm 1 cái overlay gradient ở đoạn title Chọn quân địch để ko bị đè text lên avatar
    if (a < 0) a = 0;

    const newMap = MAP.slice(a * CYCLE_POINTS, b * CYCLE_POINTS); // Ước lượng ra các điểm có thể có dựa theo toạ độ màn hình
    const map = newMap
      .map((p, i) => ({ ...p, y: p.y + this.offsetY + this.offsetY2, index: i + b * CYCLE_POINTS }))
      .filter(({ y }) => y > -OFFSET_DRAW_AVATAR && y < SCREEN_HEIGHT + OFFSET_DRAW_AVATAR); // Chỉ vẽ những điểm nằm trong màn hình

    curveThroughPoints(map);
    // curveThroughPoints2(map);
    // curveThroughPoints3(map);
    drawPoints(map);

    context.fillStyle = this.gradient;
    context.fillRect(0, 0, 480, 125);

    Font.draw({
      text: "Chọn Quân Địch",
      y: 60,
    });

    return;

    Font.draw({
      text: "Chọn Quân Địch",
      y: 60,
    });

    context.strokeStyle = "#00a88e";
    context.lineWidth = 5;

    ENEMIES.forEach((e, i) => {
      const x = getAvatarOffsetX(i);
      const y = getAvatarOffsetY(i);
      context.save();
      context.beginPath();
      context.arc(x + AVATAR_CENTER, y + AVATAR_CENTER, 27, 0, Math.PI * 2, true);
      context.stroke();
      context.clip();
      context.closePath();
      context.drawImage(avatarTextures[e.id], x, y);
      context.restore();
    });

    if (this.activeAvatar !== -1) {
      const offsetX = getAvatarOffsetX(this.activeAvatar) + AVATAR_CENTER;
      const offsetY = getAvatarOffsetY(this.activeAvatar) + AVATAR_CENTER;
      context.lineWidth = 2;
      context.strokeStyle = "#f8ae49";
      context.beginPath();
      context.arc(offsetX, offsetY, 34, 0, Math.PI * 2, true);
      context.closePath();
      context.stroke();

      const { name } = ENEMIES[this.activeAvatar];

      Font.draw({
        text: name,
        y: SCREEN_HEIGHT - 60,
      });
    }
  }
  /**
   * Cập nhật
   */
  update() {
    this.offsetY += this.velocity;
    this.velocity *= 0.93;
  }
  /**
   * Xử lý sự kiện move chuột
   */
  onMouseMove({ offsetX, offsetY }: IMouseEvent) {
    if (this.dragging) {
      const o = offsetY - this.offset;
      const t = performance.now();
      const v = o / (t - this.lastTime) / 2;
      this.lastTime = t;
      this.offset = offsetY;
      this.velocity += v;
      this.offsetY2 = offsetY - this.oldOffsetY;
    }

    return;

    const x = Math.floor((offsetX - avatarOffsetX) / avatarFullWidth);
    const y = Math.floor((offsetY - avatarOffsetY) / avatarFullHeight);

    const startX = x * avatarFullWidth + avatarOffsetX;
    const startY = y * avatarFullHeight + avatarOffsetY;

    if (x < 0 || y < 0 || x >= AVATARS_PER_ROW || startX + AVATAR_WIDTH < offsetX || startY + AVATAR_WIDTH < offsetY) {
      this.activeAvatar = -1;
      return;
    }

    const current = y * AVATARS_PER_ROW + x;

    if (current >= ENEMIES.length) {
      this.activeAvatar = -1;
      return;
    }

    this.activeAvatar = current;
  }
  /**
   * Xử lý sự kiện click chuột
   */
  onMouseDown({ offsetY }: IMouseEvent) {
    this.dragging = true;
    this.oldOffsetY = offsetY;

    this.lastTime = performance.now();
    this.offset = offsetY;

    if (this.activeAvatar === -1) return;

    this.parent.stateManager.changeState("IN_GAME", this.activeAvatar);
  }

  onMouseUp() {
    this.offsetY += this.offsetY2;
    this.offsetY2 = 0;
    this.dragging = false;
  }
}
