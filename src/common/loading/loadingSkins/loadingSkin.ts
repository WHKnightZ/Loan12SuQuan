import { ILoadingSkin } from "../type";

export class LoadingSkin implements ILoadingSkin {
  protected context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  render(timer: number) {}
}
