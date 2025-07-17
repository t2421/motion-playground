import { Vector2 } from './vector.js';
import { PerlinNoise } from './noise.js';

/**
 * Base class for movable objects.
 * Handles physics properties like position and velocity.
 */
export class Mover {
  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;
  private prevAccelleration: Vector2; // for debug
  public mass: number;
  public maxSpeed: number;
  public friction: number;

  protected noiseOffset: Vector2;
  protected static globalNoise: PerlinNoise = new PerlinNoise();

  constructor(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    prevAccelleration? :Vector2;
    mass?: number;
    maxSpeed?: number;
    friction?: number;
  } = {}) {
    this.position = options.position || Vector2.zero();
    this.velocity = options.velocity || Vector2.zero();
    this.acceleration = options.acceleration || Vector2.zero();
    this.prevAccelleration = options.prevAccelleration || Vector2.zero();
    this.mass = options.mass ?? 1;
    this.maxSpeed = options.maxSpeed ?? Infinity;
    this.friction = options.friction ?? 0;

    this.noiseOffset = new Vector2(Math.random() * 1000, Math.random() * 1000);
  }

  /** Update physics for one frame */
  update(deltaTime: number = 1 / 60): void {
    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));

    if (this.friction > 0) {
      const frictionForce = this.velocity.multiply(-this.friction);
      this.velocity = this.velocity.add(frictionForce.multiply(deltaTime));
    }

    if (this.maxSpeed < Infinity) {
      this.velocity = this.velocity.limit(this.maxSpeed);
    }

    this.position = this.position.add(this.velocity.multiply(deltaTime));
    this.prevAccelleration = this.acceleration.clone()
    this.acceleration = Vector2.zero();
  }

  /** Apply a force to this mover */
  applyForce(force: Vector2): void {
    const acceleration = force.multiply(1 / this.mass);
    this.acceleration = this.acceleration.add(acceleration);
  }

  /** Apply gravity force */
  applyGravity(gravity: Vector2 = Vector2.down().multiply(9.8)): void {
    this.applyForce(gravity.multiply(this.mass));
  }

  /** Seek towards a target position */
  seek(target: Vector2, maxForce: number = 0.1): void {
    const desired = target.subtract(this.position).normalize().multiply(this.maxSpeed);
    const steer = desired.subtract(this.velocity).limit(maxForce);
    this.applyForce(steer);
  }

  /** Flee from a target position */
  flee(target: Vector2, maxForce: number = 0.1): void {
    const desired = this.position.subtract(target).normalize().multiply(this.maxSpeed);
    const steer = desired.subtract(this.velocity).limit(maxForce);
    this.applyForce(steer);
  }

  /** Apply Perlin noise-based force for organic movement */
  applyNoiseForce(strength: number = 0.5, scale: number = 0.01, time: number = 0): void {
    const noiseX = Mover.globalNoise.octaveNoise2D(
      (this.position.x + this.noiseOffset.x) * scale,
      time * scale * 0.5,
      4,
      0.5,
      1
    );

    const noiseY = Mover.globalNoise.octaveNoise2D(
      (this.position.y + this.noiseOffset.y) * scale,
      time * scale * 0.5 + 1000,
      4,
      0.5,
      1
    );

    const noiseForce = new Vector2(noiseX, noiseY).multiply(strength);
    this.applyForce(noiseForce);
  }

  /** Apply attraction force towards another mover */
  attract(other: Mover, strength: number = 1, minDistance: number = 10, maxDistance: number = 100): void {
    const distance = this.position.distance(other.position);
    if (distance > maxDistance) return;

    let force = other.position.subtract(this.position);
    if (force.magnitude() === 0) return; // Skip if the vector is zero
    force = force.normalize();
    const clampedDistance = Math.max(distance, minDistance);
    const magnitude = (strength * this.mass * other.mass) / (clampedDistance * clampedDistance);

    this.applyForce(force.multiply(magnitude));
  }

  /** Get kinetic energy */
  getKineticEnergy(): number {
    return 0.5 * this.mass * this.velocity.magnitude() * this.velocity.magnitude();
  }

  /** Get momentum vector */
  getMomentum(): Vector2 {
    return this.velocity.multiply(this.mass);
  }

  /** Set velocity magnitude while preserving direction */
  setSpeed(speed: number): void {
    this.velocity = this.velocity.setMagnitude(speed);
  }

  /** Create a copy of this mover */
  clone(): Mover {
    const cloned = new Mover({
      position: this.position.clone(),
      velocity: this.velocity.clone(),
      acceleration: this.acceleration.clone(),
      mass: this.mass,
      maxSpeed: this.maxSpeed,
      friction: this.friction,
    });

    cloned.noiseOffset = this.noiseOffset.clone();
    return cloned;
  }

  /** Reset the mover state */
  reset(): void {
    this.velocity = Vector2.zero();
    this.acceleration = Vector2.zero();
  }

  // ==================== Debug Drawing Methods ====================

  /** Private helper method to draw a vector with arrow */
  private drawVector(
    ctx: CanvasRenderingContext2D,
    vector: Vector2,
    options: {
      scale?: number;
      color?: string;
      lineWidth?: number;
      showLabel?: boolean;
      labelOffset?: Vector2;
      label?: string;
      arrowHeadLength?: number;
    }
  ): void {
    const {
      scale = 1,
      color = '#333',
      lineWidth = 1,
      showLabel = true,
      labelOffset = new Vector2(5, -5),
      label = '',
      arrowHeadLength = 3
    } = options;

    if (vector.isZero()) return;

    const endPos = this.position.add(vector.multiply(scale));
    
    // Draw vector line
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.stroke();

    // Draw arrow head
    const angle = Math.atan2(vector.y, vector.x);
    ctx.beginPath();
    ctx.moveTo(endPos.x, endPos.y);
    ctx.lineTo(
      endPos.x - arrowHeadLength * Math.cos(angle - Math.PI / 6),
      endPos.y - arrowHeadLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endPos.x, endPos.y);
    ctx.lineTo(
      endPos.x - arrowHeadLength * Math.cos(angle + Math.PI / 6),
      endPos.y - arrowHeadLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw label
    if (showLabel && label) {
      ctx.fillStyle = color;
      ctx.font = '12px Arial';
      const labelPos = endPos.add(labelOffset);
      ctx.fillText(label, labelPos.x, labelPos.y);
    }
  }

  /** Draw velocity vector for debugging */
  drawVelocity(ctx: CanvasRenderingContext2D, options: {
    scale?: number;
    color?: string;
    lineWidth?: number;
    showLabel?: boolean;
    labelOffset?: Vector2;
  } = {}): void {
    this.drawVector(ctx, this.velocity, {
      scale: options.scale ?? 1,
      color: options.color ?? '#4ecdc4',
      lineWidth: options.lineWidth,
      showLabel: options.showLabel ?? true,
      labelOffset: options.labelOffset ?? new Vector2(5, -5),
      label: 'v',
    });
  }

  /** Draw acceleration vector for debugging */
  drawAcceleration(ctx: CanvasRenderingContext2D, options: {
    scale?: number;
    color?: string;
    lineWidth?: number;
    showLabel?: boolean;
    labelOffset?: Vector2;
  } = {}): void {
    this.drawVector(ctx, this.prevAccelleration, {
      scale: options.scale ?? 10,
      color: options.color ?? '#ff6b6b',
      lineWidth: options.lineWidth,
      showLabel: options.showLabel ?? true,
      labelOffset: options.labelOffset ?? new Vector2(5, 5),
      label: 'a',
    });
  }

  /** Draw both velocity and acceleration vectors for debugging */
  drawDebugVectors(ctx: CanvasRenderingContext2D, options: {
    showVelocity?: boolean;
    showAcceleration?: boolean;
    velocityScale?: number;
    accelerationScale?: number;
    velocityColor?: string;
    accelerationColor?: string;
  } = {}): void {
    const {
      showVelocity = true,
      showAcceleration = true,
      velocityScale = 1,
      accelerationScale = 10,
      velocityColor = '#4ecdc4',
      accelerationColor = '#ff6b6b'
    } = options;

    if (showVelocity) {
      this.drawVelocity(ctx, {
        scale: velocityScale,
        color: velocityColor
      });
    }

    if (showAcceleration) {
      this.drawAcceleration(ctx, {
        scale: accelerationScale,
        color: accelerationColor
      });
    }
  }
}
