import { BACKGROUND_COLOR, SCREEN_HEIGHT, SCREEN_WIDTH } from "@/configs/consts";
import { FourLinesToDotsLoading } from "./fourLinesToDots";
import { ILoadingSkin } from "./type";

const MAX_FADING_TIMER = 40;

export class Loading {
  private loading: boolean;
  private timer: number;
  private fadingTimer: number;
  private skin: ILoadingSkin;
  private context: CanvasRenderingContext2D;
  private onUpdate: () => void;

  constructor({ context, onUpdate }: { context: CanvasRenderingContext2D; onUpdate?: () => void }) {
    this.context = context;
    this.onUpdate = onUpdate;

    this.loading = false;
    this.timer = 0;
    this.fadingTimer = 0;
    this.update = this.update.bind(this);

    this.skin = new FourLinesToDotsLoading(this.context);
  }

  render() {
    this.context.fillStyle = BACKGROUND_COLOR;
    this.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    this.skin.render(this.timer);
  }

  update() {
    if (!this.loading) return;

    this.timer += 1;

    let opacity: number = 1.0;

    if (this.fadingTimer > 0) {
      this.fadingTimer += 1;
      opacity = (MAX_FADING_TIMER - this.fadingTimer) / MAX_FADING_TIMER;
      this.context.globalAlpha = opacity;
      if (opacity === 0) this.loading = false;
    }

    this.render();

    this.onUpdate?.();

    if (this.fadingTimer > 0) this.context.globalAlpha = 1 - opacity;
  }

  begin() {
    this.timer = 0;
    this.fadingTimer = 0;
    this.loading = true;
  }

  end() {
    this.fadingTimer = 1;
  }
}
