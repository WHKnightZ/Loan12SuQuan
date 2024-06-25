import { base } from "@/configs/consts";
import { IRenderable } from "@/types";

type Rotation = "CW" | "CCW"; // Clockwise, Counter Clockwise
type IDirection = "HT" | "VR" | "HB" | "VL"; // Horizontal Top, Vertical Right, Horizontal Bottom, Vertical Left
type IPointExt = { x: number; y: number; direction: IDirection };

const mapDirection: {
  [key in Rotation]: {
    [key in IDirection]: (self: Spin, point: IPointExt) => void;
  };
} = {
  CW: {
    HT: (self, point) => {
      point.x += self.speed;
      if (point.x <= self.boundRight) return;

      point.y = point.y + point.x - self.boundRight;
      point.x = self.boundRight;
      point.direction = "VR";
    },
    VR: (self, point) => {
      point.y += self.speed;
      if (point.y <= self.boundBottom) return;

      point.x = point.x + self.boundBottom - point.y;
      point.y = self.boundBottom;
      point.direction = "HB";
    },
    HB: (self, point) => {
      point.x -= self.speed;
      if (point.x >= self.boundLeft) return;

      point.y = point.y + point.x - self.boundLeft;
      point.x = self.boundLeft;
      point.direction = "VL";
    },
    VL: (self, point) => {
      point.y -= self.speed;
      if (point.y >= self.boundTop) return;

      point.x = point.x + self.boundTop - point.y;
      point.y = self.boundTop;
      point.direction = "HT";
    },
  },
  CCW: {
    HT: (self, point) => {
      point.x -= self.speed;
      if (point.x >= self.boundLeft) return;

      point.y = point.y + self.boundLeft - point.x;
      point.x = self.boundLeft;
      point.direction = "VL";
    },
    VL: (self, point) => {
      point.y += self.speed;
      if (point.y <= self.boundBottom) return;

      point.x = point.x + point.y - self.boundBottom;
      point.y = self.boundBottom;
      point.direction = "HB";
    },
    HB: (self, point) => {
      point.x += self.speed;
      if (point.x >= self.boundRight) return;

      point.y = point.y + self.boundRight - point.x;
      point.x = self.boundRight;
      point.direction = "VR";
    },
    VR: (self, point) => {
      point.y -= self.speed;
      if (point.y >= self.boundTop) return;

      point.x = point.x + point.y - self.boundTop;
      point.y = self.boundTop;
      point.direction = "HT";
    },
  },
};

export class Spin implements IRenderable {
  private rotation: Rotation;
  private thickness: number;
  private points: IPointExt[];
  private active: boolean;
  private opacity: number;

  boundLeft: number;
  boundRight: number;
  boundTop: number;
  boundBottom: number;
  speed: number;

  constructor(
    boundLeft: number,
    boundRight: number,
    boundTop: number,
    boundBottom: number,
    speed: number,
    rotation: Rotation,
    length: number,
    thickness: number,
    x: number,
    y: number
  ) {
    this.boundLeft = boundLeft;
    this.boundRight = boundRight;
    this.boundTop = boundTop;
    this.boundBottom = boundBottom;
    this.rotation = rotation;
    this.thickness = thickness;

    const findDrt = (x: number, y: number): IDirection => {
      if (x === boundLeft) return "VL";
      if (x === boundRight) return "VR";
      if (y === boundTop) return "HT";
      return "HB";
    };

    const direction = findDrt(x, y);
    this.speed = length;
    const point = { x, y, direction };
    mapDirection[this.rotation][direction](this, point);
    this.points = [{ x, y, direction }, point];
    this.speed = speed;
    this.active = false;
    this.opacity = 0;
  }

  activate() {
    if (this.active) return;

    this.opacity = 0;
    this.active = true;
  }

  deactivate() {
    if (!this.active) return;

    this.opacity = 1;
    this.active = false;
  }

  update() {
    if (this.active) {
      this.opacity += 0.05;
      if (this.opacity > 1) this.opacity = 1;
    } else {
      this.opacity -= 0.05;
      if (this.opacity < 0) this.opacity = 0;
    }
    this.points.forEach((p) => {
      mapDirection[this.rotation][p.direction](this, p);
    });
  }

  render() {
    const { x: x0, y: y0 } = this.points[0];
    const { x: x1, y: y1 } = this.points[1];
    const ctx = base.context;
    ctx.globalAlpha = this.opacity;

    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = "#96e6e0";

    if (x0 === x1 || y0 === y1) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.globalAlpha = 1;
      return;
    }

    const { x: x2, y: y2 } = this.getMidPoint();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  private getMidPoint = () => {
    const { direction } = this.points[0];
    if ((direction === "HT" && this.rotation === "CW") || (direction === "VR" && this.rotation === "CCW"))
      return { x: this.boundRight, y: this.boundTop };
    if ((direction === "VR" && this.rotation === "CW") || (direction === "HB" && this.rotation === "CCW"))
      return { x: this.boundRight, y: this.boundBottom };
    if ((direction === "HB" && this.rotation === "CW") || (direction === "VL" && this.rotation === "CCW"))
      return { x: this.boundLeft, y: this.boundBottom };
    return { x: this.boundLeft, y: this.boundTop };
  };
}
