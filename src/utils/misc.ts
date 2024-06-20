import { FPS } from "@/configs/consts";
import version from "@/configs/version.json";

const fpsElement = document.createElement("div");
fpsElement.id = "fps";
document.body.append(fpsElement);

const versionElement = document.createElement("div");
versionElement.id = "version";
document.body.append(versionElement);

const createFpsText = (fps: number) => `Fps: ${fps}`;

fpsElement.innerText = createFpsText(FPS);
versionElement.innerText = String(`Version ${version}`);

let then = 0;
let fps = 0;

export const updateFps = (now = 0) => {
  fps += 1;
  if (now - then < 1000) return;

  fpsElement.innerText = createFpsText(fps);

  then += 1000;
  fps = 0;
};
