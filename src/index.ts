import { base, SCREEN_WIDTH, SCREEN_HEIGHT } from "@/configs/consts";
import { Game } from "@/game";
import { loadTextures } from "./textures";

const game = new Game();

const init = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;

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

  const elapsed = (now - then) / 1000;
  if (elapsed < 0.015) return;
  then = now;

  game.update();
  game.render();
};

const main = async () => {
  init();

  await loadTextures();

  game.init();

  base.canvas.addEventListener("click", (e) => {
    game.onClick(e);
  });

  document.addEventListener("keydown", (e) => {
    game.onKeyDown(e);
  });

  update();
};

main();
