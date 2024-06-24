import { createSpringEffect } from "@/utils/physics";

const SPRING_OFFSETS = createSpringEffect(8);

export class Spring {
  private springIndex: number;

  constructor() {
    this.springIndex = -1;
  }

  beginSpring() {
    this.springIndex = 0;
  }

  getSpringOffet() {
    return this.springIndex > -1 ? SPRING_OFFSETS[this.springIndex] : 0;
  }

  update() {
    if (this.springIndex === -1) return;

    this.springIndex += 1;
    if (this.springIndex >= SPRING_OFFSETS.length) this.springIndex = -1;
  }
}
