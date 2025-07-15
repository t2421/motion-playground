/**
 * Cubic Bezier curve implementation for smooth animations
 */
export class BezierCurve {
  constructor(
    public p0: { x: number; y: number },
    public p1: { x: number; y: number },
    public p2: { x: number; y: number },
    public p3: { x: number; y: number }
  ) {}

  /**
   * Get a point on the curve at parameter t (0 to 1)
   */
  getPoint(t: number): { x: number; y: number } {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const x = uuu * this.p0.x +
              3 * uu * t * this.p1.x +
              3 * u * tt * this.p2.x +
              ttt * this.p3.x;

    const y = uuu * this.p0.y +
              3 * uu * t * this.p1.y +
              3 * u * tt * this.p2.y +
              ttt * this.p3.y;

    return { x, y };
  }

  /**
   * Get multiple points along the curve
   */
  getPoints(numPoints: number = 100): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      points.push(this.getPoint(t));
    }
    return points;
  }
}

/**
 * Common easing functions using cubic bezier curves
 */
export const EasingFunctions = {
  linear: new BezierCurve({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }),
  easeInOut: new BezierCurve({ x: 0, y: 0 }, { x: 0.25, y: 0.1 }, { x: 0.25, y: 1 }, { x: 1, y: 1 }),
  easeIn: new BezierCurve({ x: 0, y: 0 }, { x: 0.42, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 1 }),
  easeOut: new BezierCurve({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0.58, y: 1 }, { x: 1, y: 1 }),
} as const;
