import { Vector2 } from './vector.js';
import { Mover } from './mover.js';

/**
 * Drawable dot that inherits motion behaviour from {@link Mover}.
 */
export class Dot extends Mover {
  public radius: number;
  public color: string;

  constructor(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    mass?: number;
    radius?: number;
    color?: string;
    maxSpeed?: number;
    friction?: number;
  } = {}) {
    super(options);
    this.radius = options.radius ?? 5;
    this.color = options.color ?? '#333';
  }

  /** Draw the dot on a canvas context */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ==================== Collision Detection ====================

  /** Check collision with another dot */
  isCollidingWith(other: Dot): boolean {
    const distance = this.position.distance(other.position);
    return distance < this.radius + other.radius;
  }

  /** Handle elastic collision with another dot */
  collideWith(other: Dot, restitution: number = 0.8): void {
    if (!this.isCollidingWith(other)) return;

    const distance = this.position.distance(other.position);
    const overlap = this.radius + other.radius - distance;
    const separation = this.position
      .subtract(other.position)
      .normalize()
      .multiply(overlap / 2);

    this.position = this.position.add(separation);
    other.position = other.position.subtract(separation);

    const relativeVelocity = this.velocity.subtract(other.velocity);
    const normal = this.position.subtract(other.position).normalize();
    const velocityAlongNormal = relativeVelocity.dot(normal);
    if (velocityAlongNormal > 0) return;

    const impulse = -(1 + restitution) * velocityAlongNormal;
    const impulseScalar = impulse / (1 / this.mass + 1 / other.mass);
    const impulseVector = normal.multiply(impulseScalar);

    this.velocity = this.velocity.add(impulseVector.multiply(1 / this.mass));
    other.velocity = other.velocity.subtract(impulseVector.multiply(1 / other.mass));
  }

  // ==================== Boundary Handling ====================

  /** Wrap around screen boundaries */
  wrapAroundBounds(width: number, height: number): void {
    if (this.position.x > width + this.radius) {
      this.position.x = -this.radius;
    } else if (this.position.x < -this.radius) {
      this.position.x = width + this.radius;
    }

    if (this.position.y > height + this.radius) {
      this.position.y = -this.radius;
    } else if (this.position.y < -this.radius) {
      this.position.y = height + this.radius;
    }
  }

  /** Bounce off screen boundaries */
  bounceOffBounds(width: number, height: number, damping: number = 0.8): void {
    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius;
      this.velocity.x *= -damping;
    } else if (this.position.x + this.radius > width) {
      this.position.x = width - this.radius;
      this.velocity.x *= -damping;
    }

    if (this.position.y - this.radius < 0) {
      this.position.y = this.radius;
      this.velocity.y *= -damping;
    } else if (this.position.y + this.radius > height) {
      this.position.y = height - this.radius;
      this.velocity.y *= -damping;
    }
  }

  // ==================== Utility Methods ====================

  /** Create a copy of this dot */
  clone(): Dot {
    const cloned = new Dot({
      position: this.position.clone(),
      velocity: this.velocity.clone(),
      acceleration: this.acceleration.clone(),
      mass: this.mass,
      radius: this.radius,
      color: this.color,
      maxSpeed: this.maxSpeed,
      friction: this.friction,
    });
    return cloned;
  }

  /**
   * Create a random dot within bounds
   */
  static createRandom(
    width: number,
    height: number,
    options: {
      minRadius?: number;
      maxRadius?: number;
      minSpeed?: number;
      maxSpeed?: number;
      colors?: string[];
    } = {}
  ): Dot {
    const {
      minRadius = 3,
      maxRadius = 8,
      minSpeed = 50,
      maxSpeed = 150,
      colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa726', '#9c27b0'],
    } = options;

    const position = new Vector2(Math.random() * width, Math.random() * height);
    const velocity = Vector2.random(minSpeed + Math.random() * (maxSpeed - minSpeed));
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const color = colors[Math.floor(Math.random() * colors.length)];

    return new Dot({ position, velocity, radius, color });
  }
}
