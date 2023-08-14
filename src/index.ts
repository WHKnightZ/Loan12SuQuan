import loadTextures from "@/common/textures";
import { SCREEN_HEIGHT, SCREEN_WIDTH, base } from "@/configs/consts";
import { Game } from "@/game";

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

  // const elapsed = (now - then) / 1000;
  // if (elapsed < 0.05) return;
  // then = now;

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
