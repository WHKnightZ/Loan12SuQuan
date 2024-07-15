import { base, SCREEN_WIDTH, SCREEN_HEIGHT, INTERVAL } from "@/configs/consts";
import { Game } from "@/game";
import { loadTextures } from "@/textures";
import { updateFps } from "@/utils/misc";
import { Loading } from "@/common/loading";
import { pause } from "./utils/common";

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
  await pause(500);

  loading.end();

  game = new Game();
  base.game = game;

  base.canvas.addEventListener("click", (e) => game.onClick(e));
  base.canvas.addEventListener("mousemove", (e) => game.onMouseMove(e));
  document.addEventListener("keydown", (e) => game.onKeyDown(e));
};

main();
