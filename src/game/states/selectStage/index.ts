import { DEFAULT_CHARACTER, ENEMIES, SCREEN_HEIGHT, SCREEN_WIDTH, SPIN_ANIMATION_COLOR, base } from "@/configs/consts";
import { Font } from "@/elements/font";
import { GameState } from "@/extensions";
import { avatarTextures } from "@/textures";
import { IGame, IGameStateType, IMouseEvent } from "@/types";

const AVATARS_PER_ROW = 5;
let avatarWidth: number;
let avatarHeight: number;
const avatarOffsetX = 50;
const avatarOffsetY = 120;
const avatarGapX = 20;
const avatarGapY = 20;
let avatarFullWidth: number;
let avatarFullHeight: number;

const getAvatarOffsetX = (index: number) => (index % AVATARS_PER_ROW) * avatarFullWidth + avatarOffsetX;
const getAvatarOffsetY = (index: number) => Math.floor(index / AVATARS_PER_ROW) * avatarFullHeight + avatarOffsetY;

export class SelectStageState extends GameState<IGame, IGameStateType> {
  private activeAvatar: number;

  constructor(parent: IGame) {
    super(parent, "SELECT_STAGE");

    this.activeAvatar = -1;
    avatarWidth = avatarTextures[DEFAULT_CHARACTER][0].width;
    avatarHeight = avatarTextures[DEFAULT_CHARACTER][0].height;
    avatarFullWidth = avatarWidth + avatarGapX;
    avatarFullHeight = avatarHeight + avatarGapY;
  }

  /**
   * Hiển thị
   */
  render() {
    const context = base.context;

    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

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
      context.arc(x + 30, y + 26, 26, 0, Math.PI * 2, true);
      context.stroke();
      context.clip();
      context.closePath();
      context.drawImage(avatarTextures[e.id][0], x, y);
      context.restore();
    });

    if (this.activeAvatar !== -1) {
      const offsetX = getAvatarOffsetX(this.activeAvatar);
      const offsetY = getAvatarOffsetY(this.activeAvatar);
      context.strokeStyle = SPIN_ANIMATION_COLOR;
      context.lineWidth = 2;
      context.strokeRect(offsetX - 3, offsetY - 3, avatarWidth + 6, avatarHeight + 6);

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

    if (x < 0 || y < 0 || startX + avatarWidth < offsetX || startY + avatarHeight < offsetY) {
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
