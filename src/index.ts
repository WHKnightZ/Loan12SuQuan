import { loadTextures } from "./common/textures";
import { base, SCREEN_SIZE } from "./configs/consts";
import { Game } from "./objs/game";

const game = new Game();

const init = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;

  canvas.width = canvas.height = SCREEN_SIZE;
  context.imageSmoothingEnabled = false;

  base.canvas = canvas;
  base.context = context;
};

// Timer
// let then = 0;

const update = (now = 0) => {
  requestAnimationFrame(update);

  // const elapsed = (now - then) / 1000;
  // if (elapsed < 0) return;
  // then = now;

  game.update();
  game.render();
};

const main = async () => {
  init();

  await loadTextures();

  game.init();

  document.addEventListener("click", (e) => {
    game.onClick(e);
  });

  update();
};

main();
