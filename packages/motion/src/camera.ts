import { Vector2 } from './vector.js';

/**
 * Simple 2D camera for canvas based animations.
 * Translates, scales and rotates the scene opposite to the camera movement.
 */
export class Camera2D {
  constructor(
    public position: Vector2 = Vector2.zero(),
    public zoom: number = 1,
    public rotation: number = 0
  ) {}

  /** Move the camera by a delta vector */
  move(delta: Vector2): void {
    this.position = this.position.add(delta);
  }

  /** Set absolute zoom level */
  setZoom(zoom: number): void {
    this.zoom = zoom;
  }

  /** Multiply current zoom by a factor */
  zoomBy(factor: number): void {
    this.zoom *= factor;
  }

  /** Rotate camera by angle in radians */
  rotate(angle: number): void {
    this.rotation += angle;
  }

  /**
   * Convert world coordinates to screen coordinates.
   */
  worldToScreen(worldPos: Vector2): Vector2 {
    const translated = worldPos.subtract(this.position);
    const cos = Math.cos(-this.rotation);
    const sin = Math.sin(-this.rotation);
    const rx = translated.x * cos - translated.y * sin;
    const ry = translated.x * sin + translated.y * cos;
    return new Vector2(rx * this.zoom, ry * this.zoom);
  }

  /**
   * Convert screen coordinates to world coordinates.
   */
  screenToWorld(screenPos: Vector2): Vector2 {
    const scaled = screenPos.multiply(1 / this.zoom);
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    const rx = scaled.x * cos - scaled.y * sin;
    const ry = scaled.x * sin + scaled.y * cos;
    return new Vector2(rx, ry).add(this.position);
  }

  /**
   * Apply the camera transformation to a canvas rendering context.
   * Call `ctx.save()` before and `ctx.restore()` after drawing the scene.
   */
  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.position.x, -this.position.y);
    ctx.rotate(-this.rotation);
    ctx.scale(this.zoom, this.zoom);
  }
}
