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
import { random } from "@/utils/math";
import { BorderAnimation } from "./borderAnimation";
import { Spring } from "./spring";

const BAR_OFFSET_X = 132;

export class Player implements IPlayer {
  private borderAnimation: BorderAnimation;
  private spring: Spring;
  private intelligence: number;

  private life: IPlayerAttribute;
  private mana: IPlayerAttribute;
  private energy: IPlayerAttribute;

  private barOffsetX: number;
  private bars: IPlayerAttributeExtra[];
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

    this.life = { maxValue: life, value: life, display: life, timer: 0 };
    this.energy = { maxValue: DEFAULT_ENERGY, value: DEFAULT_ENERGY, display: DEFAULT_ENERGY, timer: 0 };
    this.mana = { maxValue: DEFAULT_MANA, value: DEFAULT_MANA, display: DEFAULT_MANA, timer: 0 };
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
   * @param matchedLength
   * @returns
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
   * Nhận sát thương
   * @param damage
   */
  takeDamage(damage: number) {
    this.life.timer = 0;
    this.life.value = this.life.value - damage;
    if (this.life.value < 0) this.life.value = 0;
  }

  /**
   * Hồi máu
   * @param value
   */
  gainLife(value: number) {
    this.life.timer = 0;
    this.life.value = this.life.value + (value * this.life.maxValue) / 100;
    if (this.life.value > this.life.maxValue) this.life.value = this.life.maxValue;
  }

  /**
   * Hồi năng lượng
   * @param value
   */
  gainEnergy(value: number) {
    this.energy.timer = 0;
    this.energy.value = this.energy.value + value;
    if (this.energy.value > this.energy.maxValue) this.energy.value = this.energy.maxValue;
  }

  /**
   * Hồi mana
   * @param value
   */
  gainMana(value: number) {
    this.mana.timer = 0;
    this.mana.value = this.mana.value + value;
    if (this.mana.value > this.mana.maxValue) this.mana.value = this.mana.maxValue;
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
    this.bars.forEach(({ texture, attribute }, index) => {
      const amount = attribute.display / attribute.maxValue;
      const width = 84 * amount;
      if (width < 1) return;
      base.context.drawImage(texture, 0, 0, width, 12, this.barOffsetX, BOARD_SIZE + 24 + index * 20, width, 12);
    });

    const offsetAvatar = this.spring.getSpringOffet();
    base.context.drawImage(this.avatarTexture, this.avatarOffset.x + offsetAvatar, this.avatarOffset.y);

    this.borderAnimation.render();
  }

  /**
   * Cập nhật
   */
  update() {
    this.loseEnergy();

    // TODO: Tách các hàm ra private function
    this.bars.forEach(({ attribute, maxTimer }) => {
      if (Math.abs(attribute.display - attribute.value) < 0.1) return;

      attribute.timer += 1;

      if (attribute.timer > maxTimer) attribute.timer = maxTimer;

      let value = -attribute.timer / maxTimer + 1;
      value = value * 2 - 1;
      value = (Math.cbrt(value) + 1) / 2;
      attribute.display = attribute.value + (attribute.display - attribute.value) * value;
    });

    this.borderAnimation.update();
    this.spring.update();
  }

  /**
   * Người chơi mỗi LOSE_ENERGY_INTERVAL mà không tương tác sẽ mất năng lượng
   * @returns
   */
  private loseEnergy() {
    if (this.index !== base.game.playerTurn) return;

    this.energyTimer += 1;
    if (this.energyTimer % LOSE_ENERGY_INTERVAL !== 0) return;

    this.energy.value -= 1;
  }
}
