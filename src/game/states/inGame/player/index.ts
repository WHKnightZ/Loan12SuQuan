import {
  AVATAR_CENTER,
  AVATAR_HEIGHT,
  AVATAR_OFFSET_X,
  AVATAR_OFFSET_Y,
  AVATAR_WIDTH,
  base,
  BOARD_SIZE,
  DEFAULT_ENERGY,
  DEFAULT_MANA,
  EPSILON_2,
  POWER_ATTACK_MULTIPLIER,
  SCREEN_WIDTH,
} from "@/configs/consts";
import { ICharacterAttributes } from "@/types";
import { avatarTextures, barTextures } from "@/textures";
import { clamp, easeInOutCubic, lerp, random } from "@/utils/math";
import { BorderAnimation } from "./borderAnimation";
import { Spring } from "./spring";
import { PowerAttackPlugin } from "./plugins";
import { IInGameState, IPlayer, IPlayerAttribute, IPlayerAttributeExtra, IPowerAttackPlugin } from "../types";

const BAR_OFFSET_X = 132;

export class Player implements IPlayer {
  /**
   * InGame
   */
  private inGame: IInGameState;
  /**
   * Animation chạy vòng tròn quanh avatar player
   */
  private borderAnimation: BorderAnimation;
  /**
   * Hiệu ứng rung khi nhận sát thương
   */
  private spring: Spring;
  /**
   * Độ thông minh khi tìm nước đi
   */
  private intelligence: number;
  /**
   * Máu: Hết máu sẽ thua
   */
  private life: IPlayerAttribute;
  /**
   * Mana: Để dùng kỹ năng
   */
  private mana: IPlayerAttribute;
  /**
   * Năng lượng: Mất liên tục, hết năng lượng cũng sẽ thua
   */
  private energy: IPlayerAttribute;
  /**
   * Offset x của bar
   */
  private barOffsetX: number;
  /**
   * Danh sách các bars
   */
  private bars: IPlayerAttributeExtra[];

  /**
   * Index của player
   */
  index: number;
  /**
   * Sức tấn công của player
   */
  attack: number;
  /**
   * Offset của avatar
   */
  avatarOffset: { x: number; y: number };
  /**
   * Texture của avatar
   */
  avatarTexture: HTMLImageElement;
  /**
   * Hiệu ứng sức mạnh
   */
  powerAttackPlugin: IPowerAttackPlugin;

  constructor({
    inGame,
    index,
    attributes,
  }: {
    inGame: IInGameState;
    index: number;
    attributes: ICharacterAttributes;
  }) {
    this.inGame = inGame;

    const { id, attack, intelligence, life } = attributes;
    this.index = index;
    this.attack = attack;
    this.intelligence = intelligence;

    this.life = this.initBarValue(life, life);
    this.energy = this.initBarValue(DEFAULT_ENERGY / 4, DEFAULT_ENERGY);
    this.mana = this.initBarValue(DEFAULT_MANA, DEFAULT_MANA);
    this.bars = [
      { attribute: this.life, maxTimer: 30, texture: barTextures.life },
      { attribute: this.energy, maxTimer: 80, texture: barTextures.energy },
      { attribute: this.mana, maxTimer: 25, texture: barTextures.mana },
    ];
    this.barOffsetX = index === 0 ? BAR_OFFSET_X : SCREEN_WIDTH - BAR_OFFSET_X - barTextures.life.width;

    this.avatarTexture = avatarTextures[id];
    this.avatarOffset = {
      x: this.index === 0 ? AVATAR_OFFSET_X : SCREEN_WIDTH - AVATAR_OFFSET_X - AVATAR_WIDTH,
      y: AVATAR_OFFSET_Y,
    };

    this.borderAnimation = new BorderAnimation(this.inGame, index, this.avatarOffset);
    this.spring = new Spring();

    this.powerAttackPlugin = new PowerAttackPlugin(this);
  }

  /**
   * Mục đích: lấy ngẫu nhiên một nước đi dựa theo chỉ số trí tuệ
   * Trí tuệ càng cao => tỉ lệ ngẫu nhiên ra 100 càng lớn => nước đi càng tốt
   */
  getHintIndex(matchedLength: number) {
    // Ngẫu nhiên một số trong khoảng intel => 100
    const chance = random(this.intelligence, 101);

    const hintIndex = Math.floor(((1 - matchedLength) * chance) / 100) + matchedLength - 1;

    // console.log("Intelligence: ", this.intelligence);
    // console.log("Chance: ", chance);
    // console.log("Length: ", matchedLength);
    // console.log("Hint Index: ", hintIndex);

    return hintIndex;
  }

  /**
   * Nhận sát thương sau một khoảng thời gian
   */
  takeDamage(damage: number, duration: number = 40) {
    const activePlayerPowerAttack = this.inGame.getActivePlayer().powerAttackPlugin;

    if (activePlayerPowerAttack.active && activePlayerPowerAttack.allow) {
      damage *= POWER_ATTACK_MULTIPLIER; // Nếu người tấn công đang có cuồng nộ thì mọi sát thương gây ra được tăng thêm
      activePlayerPowerAttack.hasCausedDamage = true; // Đánh dấu đã gây sát thương
    }

    // Gây sát thương sau 40 frame (đúng lúc kiếm chém sẽ đẹp hơn)
    this.updateAttribute(this.life, -damage, duration);

    if (this.life.realValue > EPSILON_2) return; // Nếu máu nhỏ hơn EPSILON là thua

    this.inGame.finish(1 - this.index);
  }

  /**
   * Hồi máu theo phần trăm máu tối đa
   */
  gainLife(value: number, duration: number = 20) {
    this.updateAttribute(this.life, (value * this.life.maxValue) / 100, duration);
  }

  /**
   * Hồi năng lượng
   */
  gainEnergy(value: number, duration: number = 20) {
    this.updateAttribute(this.energy, value, duration);

    // Full sức mạnh thì show effect
    if (this.energy.realValue > this.energy.maxValue - EPSILON_2) {
      this.powerAttackPlugin.start();
    }
  }

  /**
   * Hồi mana
   */
  gainMana(value: number, duration: number = 20) {
    this.updateAttribute(this.mana, value, duration);
  }

  /**
   * Gây hiệu ứng rung avatar khi nhận sát thương
   */
  shock() {
    this.spring.beginSpring();
  }

  /**
   * Đưa năng lượng về 0
   */
  resetEnergy() {
    this.gainEnergy(-this.energy.realValue, 1);
  }

  /**
   * Hiển thị
   */
  render() {
    const context = base.context;

    // Hiển thị các bars
    this.bars.forEach(({ texture, attribute }, index) => {
      const amount = attribute.currentDisplayValue / attribute.maxValue;
      const width = 84 * amount;
      if (width < 1) return;
      context.drawImage(texture, 0, 0, width, 12, this.barOffsetX, BOARD_SIZE + 24 + index * 20, width, 12);
    });

    // Hiển thị avatar
    const offsetAvatar = this.spring.getSpringOffet();
    const x = this.avatarOffset.x + offsetAvatar;
    const y = this.avatarOffset.y;

    context.save();
    context.translate(x, y);
    if (this.index === 0) {
      // Rotate nếu là người chơi 1 (do ảnh ban đầu bị lật ngược)
      context.translate(AVATAR_WIDTH, 0);
      context.scale(-1, 1);
    }
    context.drawImage(this.avatarTexture, 0, 4, AVATAR_WIDTH, AVATAR_HEIGHT, 0, 0, AVATAR_WIDTH, AVATAR_HEIGHT);
    context.restore();

    // Hiển thị border animation
    this.borderAnimation.render();
    this.powerAttackPlugin.render();
  }

  /**
   * Cập nhật
   */
  update() {
    // Update các bars
    this.bars.forEach(({ attribute, maxTimer }) => {
      if (Math.abs(attribute.currentDisplayValue - attribute.displayValue) < EPSILON_2) return;

      attribute.timer += 1;

      if (attribute.timer > maxTimer) attribute.timer = maxTimer;

      let value = 1 - attribute.timer / maxTimer; // Convert từ khoảng 0, 1 về khoảng 1, 0
      value = easeInOutCubic(value);

      attribute.currentDisplayValue = lerp(attribute.displayValue, attribute.currentDisplayValue, value);
    });

    // Update animation border và spring
    this.borderAnimation.update();
    this.spring.update();
    this.powerAttackPlugin.update();
  }

  /**
   * Khởi tạo giá trị mặc định cho bar
   */
  private initBarValue(value: number, maxValue: number): IPlayerAttribute {
    return {
      maxValue,
      realValue: value,
      displayValue: value,
      currentDisplayValue: value,
      timer: 0,
      timeoutId: 0,
    };
  }

  /**
   * Update chỉ số, sau một khoảng thời gian duration thì update bar hiển thị
   */
  private updateAttribute(attribute: IPlayerAttribute, value: number, duration: number) {
    attribute.timer = 0;
    attribute.realValue = attribute.realValue + value;
    attribute.realValue = clamp(attribute.realValue, 0, attribute.maxValue);

    if (attribute.timeoutId) base.game.clearTimeout(attribute.timeoutId);
    base.game.createTimeout(() => (attribute.displayValue = attribute.realValue), duration);
  }
}
