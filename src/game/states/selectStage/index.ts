import {
  AVATAR_CENTER,
  AVATAR_WIDTH,
  BACKGROUND_COLOR,
  ENEMIES,
  LOOP_CYCLE,
  MAP,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SPIN_ANIMATION_COLOR,
  base,
} from "@/configs/consts";
import { Font } from "@/elements/font";
import { GameState } from "@/extensions";
import { avatarTextures } from "@/textures";
import { IGame, IGameStateType, IMapPoint, IMouseEvent } from "@/types";
import { curveThroughPoints, curveThroughPoints2, curveThroughPoints3 } from "@/utils/common";

const AVATARS_PER_ROW = 5;
const avatarOffsetX = 50;
const avatarOffsetY = 110;
const avatarGapX = 20;
const avatarGapY = 15;
let avatarFullWidth: number;
let avatarFullHeight: number;

const enemyCount = ENEMIES.length;

const drawPoints = (points: IMapPoint[]) => {
  const context = base.context;

  // base.context.strokeStyle = "#1562af";
  context.strokeStyle = "#00a88e";
  context.lineWidth = 5;

  points.forEach(({ x, y, hidden, index }) => {
    if (hidden) return;

    context.save();
    context.beginPath();
    context.arc(x, y, 22, 0, Math.PI * 2, true);
    context.stroke();
    context.clip();
    context.closePath();
    context.drawImage(avatarTextures[ENEMIES[index % enemyCount].id], x - 22, y - 22, 44, 44);
    context.restore();
  });
};

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

  constructor(parent: IGame) {
    super(parent, "SELECT_STAGE");

    this.activeAvatar = -1;
    avatarFullWidth = AVATAR_WIDTH + avatarGapX;
    avatarFullHeight = AVATAR_WIDTH + avatarGapY;

    this.offsetY = 0;
    this.offsetY2 = 0;
    this.dragging = false;

    this.velocity = 0;
  }

  /**
   * Hiển thị
   */
  render() {
    const context = base.context;

    context.reset();

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const from = this.offsetY + this.offsetY2 - 200;
    const to = from + SCREEN_HEIGHT + 200;

    const a = -Math.floor(from / LOOP_CYCLE) + 1;
    let b = -Math.ceil(to / LOOP_CYCLE);

    if (b < 0) b = 0;

    // console.log(a, b);

    const newMap = MAP.slice(b * 31, a * 31);

    const map = newMap.map((p, i) => ({ ...p, y: p.y + this.offsetY + this.offsetY2, index: i + b * 31 }));

    curveThroughPoints(map);
    // curveThroughPoints2(map);
    // curveThroughPoints3(map);
    drawPoints(map);

    return;

    Font.draw({
      text: "Chọn Quân Địch",
      y: 60,
    });

    context.strokeStyle = "#2465D3";
    context.lineWidth = 3;

    ENEMIES.forEach((e, i) => {
      const x = getAvatarOffsetX(i);
      const y = getAvatarOffsetY(i);
      context.save();
      context.beginPath();
      context.arc(x + AVATAR_CENTER, y + AVATAR_CENTER, AVATAR_CENTER, 0, Math.PI * 2, true);
      context.stroke();
      context.clip();
      context.closePath();
      context.drawImage(avatarTextures[e.id], x, y);
      context.restore();
    });

    if (this.activeAvatar !== -1) {
      const offsetX = getAvatarOffsetX(this.activeAvatar);
      const offsetY = getAvatarOffsetY(this.activeAvatar);
      context.strokeStyle = SPIN_ANIMATION_COLOR;
      context.lineWidth = 2;
      context.strokeRect(offsetX - 3, offsetY - 3, AVATAR_WIDTH + 6, AVATAR_WIDTH + 6);

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
    this.velocity *= 0.97;
  }
  /**
   * Xử lý sự kiện move chuột
   */
  onMouseMove({ offsetX, offsetY }: IMouseEvent) {
    if (this.dragging) {
      const o = offsetY - this.offset;
      const t = performance.now();
      const v = o / (t - this.lastTime) / 8;
      this.lastTime = t;
      this.offset = this.offset;
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
