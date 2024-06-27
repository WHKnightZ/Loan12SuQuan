import {
  base,
  CELL_SIZE,
  GRAVITY,
  mapTileInfo,
  MAP_WIDTH,
  MAP_WIDTH_1,
  TILE_OFFSET,
  TILE_SIZE,
  TOTAL_TILES,
  VELOCITY_BASE,
  getKeys,
} from "@/configs/consts";
import { IFadeGameState, IGame } from "@/types";
import { clamp } from "@/utils/math";
import { GameState } from "./gameState";

let fadeInDone: {
  x: number;
  y: number;
  offset: number;
  velocity: number;
  value: number;
}[] = [];

const getScale = (x: number, y: number, fadeTimer: number) => clamp((x + y + 1) * 3 + 7 - fadeTimer, 0, 10) / 10;

const fadeInRender = (self: IFadeGameState) => {
  const fall = self.game.fall;

  getKeys(fall).forEach((col) => {
    fall[col].list.forEach(({ x, y, value, offset }) => {
      base.context.drawImage(
        mapTileInfo[value].texture,
        x * CELL_SIZE + TILE_OFFSET,
        y * CELL_SIZE + TILE_OFFSET + offset
      );
    });
  });

  fadeInDone.forEach(({ x, y, value }) =>
    base.context.drawImage(mapTileInfo[value].texture, x * CELL_SIZE + TILE_OFFSET, y * CELL_SIZE + TILE_OFFSET)
  );
};

const fadeOutRender = (self: IFadeGameState) => {
  for (let i = 0; i < MAP_WIDTH; i += 1) {
    for (let j = 0; j < MAP_WIDTH; j += 1) {
      const x = j * CELL_SIZE;
      const y = i * CELL_SIZE;

      const scale = getScale(j, i, self.fadeOutTimer);
      const size = Math.floor(TILE_SIZE * scale);
      const offset = Math.floor((CELL_SIZE - size) / 2);

      if (size === 0) continue;

      base.context.drawImage(mapTileInfo[base.map[i][j]].texture, x + offset, y + offset, size, size);
    }
  }
};

const fadeInUpdate = (self: IFadeGameState) => {
  self.fadeInTimer += 1;

  const fall = self.game.fall;

  for (let i = 0; i < MAP_WIDTH; i += 1) {
    let newFadeInTimer = self.fadeInTimer - i * 3;
    if (newFadeInTimer < 1) newFadeInTimer = 1;

    const fallItem = fall[i];

    if (newFadeInTimer % 6 === 0 && fallItem.pushCount < MAP_WIDTH) {
      fallItem.list.push({
        x: i,
        y: -1,
        velocity: VELOCITY_BASE + 4,
        offset: 0,
        value: base.map[MAP_WIDTH_1 - fallItem.pushCount][i],
      });
      fallItem.pushCount += 1;
    }
  }

  getKeys(fall).forEach((col) => {
    const colData = fall[col];
    col = Number(col);

    let shift = false;

    colData.list.forEach((i, index) => {
      i.velocity += GRAVITY * 1.4;
      i.offset += i.velocity;
      const newY = i.y + Math.floor((i.offset + 6) / CELL_SIZE);

      if (index === 0) {
        if (newY >= colData.below) {
          shift = true;
          colData.below -= 1;
        }
      } else {
        if (i.offset >= colData.list[index - 1].offset - 6 || newY >= colData.below - index + 1) {
          i.velocity = VELOCITY_BASE;
          i.offset = Math.floor(i.offset / CELL_SIZE) * CELL_SIZE;
        }
      }
    });

    if (shift) {
      const i = colData.list.shift();
      i.y = colData.below + 1;
      fadeInDone.push(i);

      if (fadeInDone.length === TOTAL_TILES) {
        self.game.changeState("IDLE");
        fadeInDone = [];
        self.isFadeIn = self.isFadeOut = false;
      }
    }
  });
};

const fadeOutUpdate = (self: IFadeGameState) => {
  self.fadeOutTimer += 1;

  if (getScale(2, 2, self.fadeOutTimer) !== 0) return;

  if (self.isFadeIn) return;

  self.fadeIn();
};

/**
 * State tile dần rơi xuống (fadeIn) và dần biến mất (fadeOut)
 */
export class FadeGameState extends GameState implements IFadeGameState {
  isFadeIn: boolean;
  isFadeOut: boolean;
  fadeInTimer: number;
  fadeOutTimer: number;

  constructor(game: IGame) {
    super("FADE", game);
    this.isFadeIn = this.isFadeOut = false;
  }

  fadeIn() {
    for (let i = 0; i < MAP_WIDTH; i += 1) this.game.fall[i] = { list: [], below: MAP_WIDTH_1, pushCount: 0 };
    this.isFadeIn = true;
  }

  fadeOut() {
    this.isFadeOut = true;
  }

  invoke() {
    this.fadeInTimer = this.fadeOutTimer = 0;
  }

  render() {
    if (this.isFadeIn) fadeInRender(this);
    if (this.isFadeOut) fadeOutRender(this);
  }

  update() {
    if (this.isFadeIn) fadeInUpdate(this);
    if (this.isFadeOut) fadeOutUpdate(this);
  }
}
