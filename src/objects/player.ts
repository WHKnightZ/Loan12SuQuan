import { barTextures } from "@/common/textures";
import { base, BOARD_SIZE, DEFAULT_ENERGY, DEFAULT_MANA, LOSE_ENERGY_INTERVAL, SCREEN_WIDTH } from "@/configs/consts";
import { IGame, IPlayer, PlayerAttribute, PlayerAttributeExtra } from "@/types";
import { random } from "@/utils/common";

const BAR_OFFSET_X = 132;

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

  constructor(game: IGame, index: number, attack: number, life: number, intelligence: number) {
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
      base.context.drawImage(texture, 0, 0, width, 12, this.barOffsetX, BOARD_SIZE + 26 + index * 18, width, 12);
    });
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
  }
}
