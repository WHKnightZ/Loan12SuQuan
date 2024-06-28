import {
  AVATAR_OFFSET_X,
  AVATAR_OFFSET_Y,
  base,
  BOARD_SIZE,
  DEFAULT_ENERGY,
  DEFAULT_MANA,
  LOSE_ENERGY_INTERVAL,
  SCREEN_WIDTH,
} from "@/configs/consts";
import { IPlayer, IPlayerAttribute, IPlayerAttributeExtra } from "@/types";
import { avatarTextures, barTextures } from "@/textures";
import { easeInOutCubic, lerp, random } from "@/utils/math";
import { BorderAnimation } from "./borderAnimation";
import { Spring } from "./spring";

const BAR_OFFSET_X = 132;

export class Player implements IPlayer {
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
   * Bộ đếm thời gian, khi đếm đủ một chu kỳ sẽ mất năng lượng
   */
  private energyTimer: number;

  index: number;
  attack: number;
  avatarOffset: { x: number; y: number };
  avatarTexture: HTMLImageElement;

  constructor({
    index,
    attack,
    intelligence,
    life,
    avatar,
  }: {
    index: number;
    attack: number;
    intelligence: number;
    life: number;
    avatar: number;
  }) {
    this.index = index;
    this.attack = attack;
    this.intelligence = intelligence;

    this.life = { maxValue: life, realValue: life, displayValue: life, timer: 0 };
    this.energy = { maxValue: DEFAULT_ENERGY, realValue: DEFAULT_ENERGY, displayValue: DEFAULT_ENERGY, timer: 0 };
    this.mana = { maxValue: DEFAULT_MANA, realValue: DEFAULT_MANA, displayValue: DEFAULT_MANA, timer: 0 };
    this.barOffsetX = index === 0 ? BAR_OFFSET_X : SCREEN_WIDTH - BAR_OFFSET_X - barTextures.life.width;
    this.bars = [
      { attribute: this.life, maxTimer: 30, texture: barTextures.life },
      { attribute: this.energy, maxTimer: 20, texture: barTextures.energy },
      { attribute: this.mana, maxTimer: 25, texture: barTextures.mana },
    ];

    this.energyTimer = 0;
    this.avatarTexture = avatarTextures[avatar][index];
    this.avatarOffset = {
      x: this.index === 0 ? AVATAR_OFFSET_X : SCREEN_WIDTH - AVATAR_OFFSET_X - this.avatarTexture.width,
      y: AVATAR_OFFSET_Y,
    };

    this.borderAnimation = new BorderAnimation(index, this.avatarOffset, this.avatarTexture);
    this.spring = new Spring();
  }

  /**
   * Mục đích: lấy ngẫu nhiên một nước đi dựa theo chỉ số trí tuệ
   * Trí tuệ càng cao => tỉ lệ ngẫu nhiên ra 100 càng lớn => nước đi càng tốt
   */
  getHintIndex(matchedLength: number) {
    // Ngẫu nhiên một số trong khoảng intel => 100
    const chance = random(this.intelligence, 101);

    const hintIndex = Math.floor(((1 - matchedLength) * chance) / 100) + matchedLength - 1;

    console.log("Intelligence: ", this.intelligence);
    console.log("Chance: ", chance);
    console.log("Length: ", matchedLength);
    console.log("Hint Index: ", hintIndex);

    return hintIndex;
  }

  /**
   * Nhận sát thương sau một khoảng thời gian
   */
  takeDamage(damage: number, duration: number = 40) {
    base.game.createTimeout(() => {
      // Gây sát thương sau 40 frame (đúng lúc kiếm chém sẽ đẹp hơn)
      this.life.timer = 0;
      this.life.realValue = this.life.realValue - damage;
      this.life.realValue = Math.max(this.life.realValue, 0);
    }, duration);
  }

  /**
   * Hồi máu
   */
  gainLife(value: number) {
    this.life.timer = 0;
    this.life.realValue = this.life.realValue + (value * this.life.maxValue) / 100;
    this.life.realValue = Math.min(this.life.realValue, this.life.maxValue);
  }

  /**
   * Hồi năng lượng
   */
  gainEnergy(value: number) {
    this.energy.timer = 0;
    this.energy.realValue = this.energy.realValue + value;
    this.energy.realValue = Math.min(this.energy.realValue, this.energy.maxValue);
  }

  /**
   * Hồi mana
   */
  gainMana(value: number) {
    this.mana.timer = 0;
    this.mana.realValue = this.mana.realValue + value;
    this.mana.realValue = Math.min(this.mana.realValue, this.mana.maxValue);
  }

  /**
   * Gây hiệu ứng rung avatar khi nhận sát thương
   */
  shock() {
    this.spring.beginSpring();
  }

  /**
   * Hiển thị
   */
  render() {
    // Hiển thị các bars
    this.bars.forEach(({ texture, attribute }, index) => {
      const amount = attribute.displayValue / attribute.maxValue;
      const width = 84 * amount;
      if (width < 1) return;
      base.context.drawImage(texture, 0, 0, width, 12, this.barOffsetX, BOARD_SIZE + 24 + index * 20, width, 12);
    });

    // Hiển thị avatar
    const offsetAvatar = this.spring.getSpringOffet();
    base.context.drawImage(this.avatarTexture, this.avatarOffset.x + offsetAvatar, this.avatarOffset.y);

    // Hiển thị border animation
    this.borderAnimation.render();
  }

  /**
   * Cập nhật
   */
  update() {
    this.loseEnergy();

    // Update các bars
    this.bars.forEach(({ attribute, maxTimer }) => {
      if (Math.abs(attribute.displayValue - attribute.realValue) < 0.1) return;

      attribute.timer += 1;

      if (attribute.timer > maxTimer) attribute.timer = maxTimer;

      let value = 1 - attribute.timer / maxTimer; // Convert từ khoảng 0, 1 về khoảng 1, 0
      value = easeInOutCubic(value);

      attribute.displayValue = lerp(attribute.realValue, attribute.displayValue, value);
    });

    // Update animation border và spring
    this.borderAnimation.update();
    this.spring.update();
  }

  /**
   * Người chơi mỗi LOSE_ENERGY_INTERVAL mà không tương tác sẽ mất năng lượng
   */
  private loseEnergy() {
    if (this.index !== base.game.playerTurn) return;

    this.energyTimer += 1;
    if (this.energyTimer % LOSE_ENERGY_INTERVAL !== 0) return;

    this.energy.realValue -= 1;
  }
}
