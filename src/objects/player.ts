import { barTextures } from "@/common/textures";
import { base, BOARD_SIZE, DEFAULT_ENERGY, DEFAULT_MANA, MENU_HEIGHT } from "@/configs/consts";
import { IPlayer } from "@/types";
import { random } from "@/utils/common";

export class Player implements IPlayer {
  index: number;

  maxLife: number;
  maxMana: number;
  maxEnergy: number;
  life: number;
  mana: number;
  energy: number;
  attack: number;
  intelligence: number;

  constructor(index: number, attack: number, life: number, intelligence: number) {
    this.index = index;
    this.attack = attack;
    this.maxLife = this.life = life;
    this.maxMana = this.mana = DEFAULT_MANA;
    this.maxEnergy = this.energy = DEFAULT_ENERGY;
    this.intelligence = intelligence;
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

  render() {
    base.context.drawImage(barTextures.life, 0, BOARD_SIZE + 20);
    base.context.drawImage(barTextures.energy, 0, BOARD_SIZE + 50);
    base.context.drawImage(barTextures.mana, 0, BOARD_SIZE + 80);
  }
}
