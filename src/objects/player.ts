import { barTextures } from "@/common/textures";
import { base, BOARD_SIZE, DEFAULT_ENERGY, DEFAULT_MANA, SCREEN_WIDTH } from "@/configs/consts";
import { IPlayer } from "@/types";
import { random } from "@/utils/common";

const BAR_OFFSET_X = 132;

export class Player implements IPlayer {
  index: number;

  maxLife: number;
  displayLife: number;
  life: number;
  tLife: number;
  maxMana: number;
  mana: number;
  maxEnergy: number;
  energy: number;
  attack: number;
  intelligence: number;
  barOffsetX: number;

  constructor(index: number, attack: number, life: number, intelligence: number) {
    this.index = index;
    this.attack = attack;
    this.maxLife = this.displayLife = this.life = life;
    this.tLife = 0;
    this.maxMana = this.mana = DEFAULT_MANA;
    this.maxEnergy = this.energy = DEFAULT_ENERGY;
    this.intelligence = intelligence;
    this.barOffsetX = index === 0 ? BAR_OFFSET_X : SCREEN_WIDTH - BAR_OFFSET_X - barTextures.life.width;
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

  takeDamage(damage: number) {}

  render() {
    const lifePercent = Math.max(this.life / this.maxLife, 0);
    const energyPercent = Math.max(this.energy / this.maxEnergy, 0);
    const manaPercent = Math.max(this.mana / this.maxMana, 0);

    const bars = [
      { texture: barTextures.life, amount: lifePercent },
      { texture: barTextures.energy, amount: energyPercent },
      { texture: barTextures.mana, amount: manaPercent },
    ];

    bars.forEach(({ texture, amount }, index) => {
      const width = 84 * amount;
      if (width < 1) return;
      base.context.drawImage(texture, 0, 0, width, 12, this.barOffsetX, BOARD_SIZE + 26 + index * 18, width, 12);
    });
  }

  update() {}
}
