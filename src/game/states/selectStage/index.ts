import {
  AVATAR_CENTER,
  AVATAR_WIDTH,
  BACKGROUND_COLOR,
  BASE_MAP,
  ENEMIES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SPIN_ANIMATION_COLOR,
  base,
} from "@/configs/consts";
import { Font } from "@/elements/font";
import { GameState } from "@/extensions";
import { avatarTextures } from "@/textures";
import { IGame, IGameStateType, IMouseEvent } from "@/types";
import { curveThroughPoints, curveThroughPoints2 } from "@/utils/common";

const AVATARS_PER_ROW = 5;
const avatarOffsetX = 50;
const avatarOffsetY = 110;
const avatarGapX = 20;
const avatarGapY = 15;
let avatarFullWidth: number;
let avatarFullHeight: number;

const drawPoints = () => {
  base.context.strokeStyle = "#1562af7f";
  base.context.lineWidth = 3;
  base.context.fillStyle = "#3f8dda";

  for (let i = 0, n = BASE_MAP.length, p; i < n; i += 1) {
    p = BASE_MAP[i];
    base.context.beginPath();
    base.context.arc(p.x, p.y, 21, 0, Math.PI * 2, false);
    base.context.fill();
    base.context.stroke();
  }
};

const getAvatarOffsetX = (index: number) => (index % AVATARS_PER_ROW) * avatarFullWidth + avatarOffsetX;
const getAvatarOffsetY = (index: number) => Math.floor(index / AVATARS_PER_ROW) * avatarFullHeight + avatarOffsetY;

export class SelectStageState extends GameState<IGame, IGameStateType> {
  private activeAvatar: number;

  constructor(parent: IGame) {
    super(parent, "SELECT_STAGE");

    this.activeAvatar = -1;
    avatarFullWidth = AVATAR_WIDTH + avatarGapX;
    avatarFullHeight = AVATAR_WIDTH + avatarGapY;
  }

  /**
   * Hiển thị
   */
  render() {
    const context = base.context;

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    curveThroughPoints2();
    // drawPoints();

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
  update() {}
  /**
   * Xử lý sự kiện move chuột
   */
  onMouseMove({ offsetX, offsetY }: IMouseEvent) {
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
  onClick(e: IMouseEvent) {
    if (this.activeAvatar === -1) return;

    this.parent.stateManager.changeState("IN_GAME", this.activeAvatar);
  }
}
