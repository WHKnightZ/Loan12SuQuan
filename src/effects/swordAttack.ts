import { SCREEN_WIDTH, base } from "@/configs/consts";
import { Effect } from "./effect";
import { animate } from "@/utils/math";
import { effects } from ".";
import { CauseDamage } from "./causeDamage";
import { swordCrystalTextures } from "@/textures";
import { IPlayer } from "@/types";

const swords = [
  { delay: 8, x: 10, y: 0 },
  { delay: 4, x: -5, y: 10 },
  { delay: 0, x: 20, y: 0 },
];

const COUNT = swords.length;
const MAX_TIMER = 40;

export class SwordAttack extends Effect {
  attackingPlayer: IPlayer;
  attackedPlayer: IPlayer;
  playerIndex: number;
  halfSize: number;
  endX: number;
  endY: number;
  countDead: number;
  list: {
    x: number;
    y: number;
    startX: number;
    startY: number;
    distanceX: number;
    distanceY: number;
    timer: number;
    alive: boolean;
  }[];

  constructor(attackingPlayer: IPlayer, attackedPlayer: IPlayer) {
    super(0, 0);
    this.attackingPlayer = attackingPlayer;
    this.attackedPlayer = attackedPlayer;
    this.playerIndex = attackingPlayer.index;
    const startX = this.playerIndex * SCREEN_WIDTH;
    const startY = 30;
    const endX = attackedPlayer.avatarOffset.x + attackedPlayer.avatar.width / 2;
    const endY = attackedPlayer.avatarOffset.y + attackedPlayer.avatar.height / 2;
    this.halfSize = swordCrystalTextures[0][2].width / 2;
    this.endX = endX;
    this.endY = endY;
    this.list = swords.map(({ x, y, delay }) => {
      const newStartX = (this.playerIndex === 0 ? 1 : -1) * x + startX;
      const newStartY = y + startY;
      const distanceX = endX - startX;
      const distanceY = endY - startY;
      return {
        x: newStartX,
        y: newStartY,
        startX: newStartX,
        startY: newStartY,
        timer: -1 - delay,
        alive: false,
        distanceX,
        distanceY,
      };
    });
    this.countDead = 0;
  }

  render() {
    this.list.forEach(({ alive, x, y }) => {
      if (!alive) return;

      base.context.drawImage(swordCrystalTextures[this.playerIndex][2], x - this.halfSize, y - this.halfSize);
    });
  }

  update() {
    this.list.forEach((item) => {
      item.timer += 1;

      if (item.timer < 0) return;
      if (item.timer === 0) item.alive = true;

      const t = animate(item.timer / MAX_TIMER);

      item.x = item.startX + t * item.distanceX;
      item.y = item.startY + t * item.distanceY;

      if (item.timer !== MAX_TIMER) return;

      item.alive = false;
      this.countDead += 1;
      if (this.countDead === 1) this.attackedPlayer.shock();
      if (this.countDead === COUNT) {
        this.isAlive = false;
        effects.add(new CauseDamage(this.endX, this.endY - 10));
      }
    });
  }
}
