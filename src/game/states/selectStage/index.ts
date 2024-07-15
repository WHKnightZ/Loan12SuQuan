import { ENEMIES, SCREEN_HEIGHT, SCREEN_WIDTH, SPIN_ANIMATION_COLOR, base } from "@/configs/consts";
import { font } from "@/elements/font";
import { GameState } from "@/extensions";
import { avatarTextures } from "@/textures";
import { IGame, IGameStateType } from "@/types";

const AVATARS_PER_ROW = 4;
let avatarWidth: number;
let avatarHeight: number;
const avatarOffsetX = 90;
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
    avatarWidth = avatarTextures[0][0].width;
    avatarHeight = avatarTextures[0][0].height;
    avatarFullWidth = avatarWidth + avatarGapX;
    avatarFullHeight = avatarHeight + avatarGapY;
  }

  /**
   * Hiển thị
   */
  render() {
    base.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    font.draw({
      text: "Chọn Quân Địch",
      y: 60,
    });

    ENEMIES.forEach((e, i) => {
      base.context.drawImage(avatarTextures[e.avatar][0], getAvatarOffsetX(i), getAvatarOffsetY(i));
    });

    if (this.activeAvatar !== -1) {
      const offsetX = getAvatarOffsetX(this.activeAvatar);
      const offsetY = getAvatarOffsetY(this.activeAvatar);
      base.context.strokeStyle = SPIN_ANIMATION_COLOR;
      base.context.lineWidth = 2;
      base.context.strokeRect(offsetX - 3, offsetY - 3, avatarWidth + 6, avatarHeight + 6);

      const { name } = ENEMIES[this.activeAvatar];

      font.draw({
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
   * Xử lý sụ kiện move chuột
   */
  onMouseMove(e: MouseEvent) {
    const x = Math.floor((e.offsetX - avatarOffsetX) / avatarFullWidth);
    const y = Math.floor((e.offsetY - avatarOffsetY) / avatarFullHeight);

    const startX = x * avatarFullWidth + avatarOffsetX;
    const startY = y * avatarFullHeight + avatarOffsetY;

    if (x < 0 || y < 0 || startX + avatarWidth < e.offsetX || startY + avatarHeight < e.offsetY) {
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
  onClick(e: MouseEvent) {
    if (this.activeAvatar === -1) return;

    this.parent.stateManager.changeState("IN_GAME", this.activeAvatar);
  }
}
