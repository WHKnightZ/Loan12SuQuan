import {
  AVATAR_CENTER,
  AVATAR_WIDTH,
  BACKGROUND_COLOR,
  ENEMIES,
  MAP,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  base,
} from "@/configs/consts";
import { Font } from "@/elements/font";
import { GameState } from "@/extensions";
import { avatarTextures } from "@/textures";
import { IGame, IGameStateType, IMouseEvent } from "@/types";
import { curveThroughPoints, curveThroughPoints2, curveThroughPoints3 } from "@/utils/common";

const AVATARS_PER_ROW = 5;
const avatarOffsetX = 50;
const avatarOffsetY = 110;
const avatarGapX = 20;
const avatarGapY = 15;
let avatarFullWidth: number;
let avatarFullHeight: number;

const enemyCount = ENEMIES.length;

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

    // const from = this.offsetY + this.offsetY2 - 200;
    // const to = from + SCREEN_HEIGHT + 200;

    // const a = -Math.floor(from / LOOP_CYCLE) + 1;
    // let b = -Math.ceil(to / LOOP_CYCLE);

    // if (b < 0) b = 0;

    // // console.log(a, b);

    // const newMap = MAP.slice(b * 31, a * 31);

    // const map = newMap.map((p, i) => ({ ...p, y: p.y + this.offsetY + this.offsetY2, index: i + b * 31 }));

    // curveThroughPoints(map);
    // // curveThroughPoints2(map);
    // // curveThroughPoints3(map);
    // drawPoints(map);

    // Font.draw({
    //   text: "Chọn Quân Địch",
    //   y: 60,
    // });

    // return;

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
    // if (this.dragging) {
    //   const o = offsetY - this.offset;
    //   const t = performance.now();
    //   const v = o / (t - this.lastTime) / 2;
    //   this.lastTime = t;
    //   this.offset = offsetY;
    //   this.velocity += v;
    //   this.offsetY2 = offsetY - this.oldOffsetY;
    // }

    // return;

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
