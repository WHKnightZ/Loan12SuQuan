import { avatarTextures, barTextures } from "@/common/textures";
import { base, BOARD_SIZE, DEFAULT_ENERGY, DEFAULT_MANA, LOSE_ENERGY_INTERVAL, SCREEN_WIDTH } from "@/configs/consts";
import { IGame, IPlayer, PlayerAttribute, PlayerAttributeExtra } from "@/types";
import { random } from "@/utils/common";
import { Spin } from "./spin";

const BAR_OFFSET_X = 132;
const AVATAR_OFFSET_X = 62;
const AVATAR_OFFSET_Y = BOARD_SIZE + 24;

export class Player implements IPlayer {
  index: number;
  game: IGame;

  life: PlayerAttribute;
  mana: PlayerAttribute;
  energy: PlayerAttribute;
  attack: number;
  intelligence: number;
  barOffsetX: number;
  bars: PlayerAttributeExtra[];
  energyTimer: number;
  avatar: HTMLImageElement;
  avatarOffset: { x: number; y: number };
  spins: Spin[];

  constructor(game: IGame, index: number, attack: number, life: number, intelligence: number, avatar: number) {
    this.index = index;
    this.game = game;
    this.attack = attack;
    this.life = { maxValue: life, value: life, display: life, timer: 0 };
    this.energy = { maxValue: DEFAULT_ENERGY, value: DEFAULT_ENERGY, display: DEFAULT_ENERGY, timer: 0 };
    this.mana = { maxValue: DEFAULT_MANA, value: 0, display: 0, timer: 0 };
    this.bars = [
      { attribute: this.life, maxTimer: 30, texture: barTextures.life },
      { attribute: this.energy, maxTimer: 20, texture: barTextures.energy },
      { attribute: this.mana, maxTimer: 25, texture: barTextures.mana },
    ];
    this.intelligence = intelligence;
    this.barOffsetX = index === 0 ? BAR_OFFSET_X : SCREEN_WIDTH - BAR_OFFSET_X - barTextures.life.width;
    this.energyTimer = 0;
    this.avatar = avatarTextures[avatar][index];
    this.avatarOffset = {
      x: this.index === 0 ? AVATAR_OFFSET_X : SCREEN_WIDTH - AVATAR_OFFSET_X - this.avatar.width,
      y: AVATAR_OFFSET_Y,
    };
    this.spins = Array.from({ length: 2 }).map(
      (_, i) =>
        new Spin(
          this.avatarOffset.x - 3,
          this.avatarOffset.x + this.avatar.width + 3,
          this.avatarOffset.y - 3,
          this.avatarOffset.y + this.avatar.height + 3,
          0.8,
          "CW",
          40,
          3,
          this.avatarOffset.x + (i === 0 ? 10 - 3 : this.avatar.width + 3 - 10),
          this.avatarOffset.y + (i === 0 ? -3 : this.avatar.height + 3)
        )
    );
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

    const hintIndex = Math.ceil(((1 - matchedLength) * chance) / 100) + matchedLength - 1;

    console.log("Intelligence: ", this.intelligence);
    console.log("Chance: ", chance);
    console.log("Length: ", matchedLength);
    console.log("Hint Index: ", hintIndex);

    return hintIndex;
  }

  takeDamage(damage: number) {
    this.life.timer = 0;
    this.life.value = this.life.value - damage;
  }

  gainEnergy(value: number) {
    this.energy.timer = 0;
    this.energy.value = this.energy.value + value;
  }

  gainMana(value: number) {
    this.mana.timer = 0;
    this.mana.value = this.mana.value + value;
  }

  render() {
    this.bars.forEach(({ texture, attribute }, index) => {
      const amount = attribute.display / attribute.maxValue;
      const width = 84 * amount;
      if (width < 1) return;
      base.context.drawImage(texture, 0, 0, width, 14, this.barOffsetX, BOARD_SIZE + 24 + index * 20, width, 14);
    });

    base.context.drawImage(this.avatar, this.avatarOffset.x, this.avatarOffset.y);

    this.spins.forEach((e) => e.render());
  }

  update() {
    if (this.index === this.game.playerTurn) {
      this.energyTimer += 1;
      if (this.energyTimer % LOSE_ENERGY_INTERVAL === 0) {
        this.energy.value -= 1;
      }
    }

    this.bars.forEach(({ attribute, maxTimer }) => {
      if (Math.abs(attribute.display - attribute.value) < 0.1) return;

      attribute.timer += 1;

      if (attribute.timer > maxTimer) attribute.timer = maxTimer;

      let value = -attribute.timer / maxTimer + 1;
      value = value * 2 - 1;
      value = (Math.cbrt(value) + 1) / 2;
      attribute.display = attribute.value + (attribute.display - attribute.value) * value;
    });

    this.spins.forEach((e) => {
      if (this.index === this.game.playerTurn) e.activate();
      else e.deactivate();

      e.update();
    });
  }
}
