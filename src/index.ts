import { base, SCREEN_WIDTH, SCREEN_HEIGHT, INTERVAL, IS_MOBILE } from "@/configs/consts";
import { Game } from "@/game";
import { loadTextures } from "@/textures";
import { updateFps } from "@/utils/misc";
import { Loading } from "@/common/loading";
import { pause } from "./utils/common";
import { Font } from "./elements/font";

let game: Game;
let loading: Loading;

const init = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  context.imageSmoothingEnabled = false;

  base.canvas = canvas;
  base.context = context;
};

// Timer
let then = 0;

const update = (now = 0) => {
  requestAnimationFrame(update);

  const elapsed = now - then;
  if (elapsed < INTERVAL) return;
  then = now - (elapsed % INTERVAL);

  updateFps(now);

  loading.update();

  if (!game) return;

  game.update();
  game.render();
};

const main = async () => {
  init();

  loading = new Loading({ context: base.context });
  loading.begin();

  update();

  await loadTextures();
  Font.init();
  // await pause(500);

  loading.end();

  game = new Game();
  base.game = game;

  if (IS_MOBILE) {
    const getOffset = (e: TouchEvent) => {
      const element = e.target as HTMLCanvasElement;
      const target = e.targetTouches[0];
      const offsetX = target.clientX - element.offsetLeft;
      const offsetY = target.clientY - element.offsetTop;
      return { offsetX, offsetY };
    };

    base.canvas.addEventListener("touchstart", (e) => game.onMouseDown(getOffset(e)));
    base.canvas.addEventListener("touchend", () => game.onMouseUp());
    base.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      game.onMouseMove(getOffset(e));
    });
  } else {
    base.canvas.addEventListener("mousedown", (e) => game.onMouseDown(e));
    base.canvas.addEventListener("mouseup", () => game.onMouseUp());
    base.canvas.addEventListener("mousemove", (e) => game.onMouseMove(e));
    base.canvas.addEventListener("mouseleave", () => game.onMouseLeave());
  }

  document.addEventListener("keydown", (e) => game.onKeyDown(e));
};

main();
