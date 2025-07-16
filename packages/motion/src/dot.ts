import { Vector2 } from './vector.js';

/**
 * A dot (particle) with position, velocity, and acceleration
 * Useful for physics simulations and particle systems
 */
export class Dot {
  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;
  public mass: number;
  public radius: number;
  public color: string;
  public maxSpeed: number;
  public friction: number;

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
    this.position = options.position || Vector2.zero();
    this.velocity = options.velocity || Vector2.zero();
    this.acceleration = options.acceleration || Vector2.zero();
    this.mass = options.mass || 1;
    this.radius = options.radius || 5;
    this.color = options.color || '#333';
    this.maxSpeed = options.maxSpeed || Infinity;
    this.friction = options.friction || 0;
  }

  // ==================== Physics Update ====================

  /**
   * Update the dot's physics for one frame
   * @param deltaTime Time step (in seconds, typically 1/60 for 60fps)
   */
  update(deltaTime: number = 1/60): void {
    // Apply acceleration to velocity
    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));
    
    // Apply friction
    if (this.friction > 0) {
      const frictionForce = this.velocity.multiply(-this.friction);
      this.velocity = this.velocity.add(frictionForce.multiply(deltaTime));
    }
    
    // Limit maximum speed
    if (this.maxSpeed < Infinity) {
      this.velocity = this.velocity.limit(this.maxSpeed);
    }
    
    // Apply velocity to position
    this.position = this.position.add(this.velocity.multiply(deltaTime));
    
    // Reset acceleration (forces need to be applied each frame)
    this.acceleration = Vector2.zero();
  }

  // ==================== Force Application ====================

  /**
   * Apply a force to this dot (F = ma, so acceleration = F/m)
   * @param force The force vector to apply
   */
  applyForce(force: Vector2): void {
    const acceleration = force.multiply(1 / this.mass);
    this.acceleration = this.acceleration.add(acceleration);
  }

  /**
   * Apply gravity force
   * @param gravity Gravity vector (typically Vector2.down().multiply(9.8))
   */
  applyGravity(gravity: Vector2 = Vector2.down().multiply(9.8)): void {
    this.applyForce(gravity.multiply(this.mass));
  }

  /**
   * Seek towards a target position
   * @param target Target position
   * @param maxForce Maximum force to apply
   */
  seek(target: Vector2, maxForce: number = 0.1): void {
    const desired = target.subtract(this.position).normalize().multiply(this.maxSpeed);
    const steer = desired.subtract(this.velocity).limit(maxForce);
    this.applyForce(steer);
  }

  /**
   * Flee from a target position
   * @param target Position to flee from
   * @param maxForce Maximum force to apply
   */
  flee(target: Vector2, maxForce: number = 0.1): void {
    const desired = this.position.subtract(target).normalize().multiply(this.maxSpeed);
    const steer = desired.subtract(this.velocity).limit(maxForce);
    this.applyForce(steer);
  }

  /**
   * Apply attraction force towards another dot
   * @param other The other dot to be attracted to
   * @param strength Attraction strength
   * @param minDistance Minimum distance to prevent infinite force
   * @param maxDistance Maximum distance for attraction
   */
  attract(other: Dot, strength: number = 1, minDistance: number = 10, maxDistance: number = 100): void {
    const distance = this.position.distance(other.position);
    if (distance > maxDistance) return;
    
    const force = other.position.subtract(this.position).normalize();
    const clampedDistance = Math.max(distance, minDistance);
    const magnitude = strength * this.mass * other.mass / (clampedDistance * clampedDistance);
    
    this.applyForce(force.multiply(magnitude));
  }

  // ==================== Collision Detection ====================

  /**
   * Check collision with another dot
   * @param other The other dot
   * @returns True if colliding
   */
  isCollidingWith(other: Dot): boolean {
    const distance = this.position.distance(other.position);
    return distance < (this.radius + other.radius);
  }

  /**
   * Handle collision with another dot (elastic collision)
   * @param other The other dot
   * @param restitution Bounciness factor (0 = no bounce, 1 = perfect bounce)
   */
  collideWith(other: Dot, restitution: number = 0.8): void {
    if (!this.isCollidingWith(other)) return;

    // Separate the dots first
    const distance = this.position.distance(other.position);
    const overlap = (this.radius + other.radius) - distance;
    const separation = this.position.subtract(other.position).normalize().multiply(overlap / 2);
    
    this.position = this.position.add(separation);
    other.position = other.position.subtract(separation);

    // Calculate relative velocity
    const relativeVelocity = this.velocity.subtract(other.velocity);
    const normal = this.position.subtract(other.position).normalize();
    
    // Calculate relative velocity in collision normal direction
    const velocityAlongNormal = relativeVelocity.dot(normal);
    
    // Do not resolve if velocities are separating
    if (velocityAlongNormal > 0) return;
    
    // Calculate impulse scalar
    const impulse = -(1 + restitution) * velocityAlongNormal;
    const impulseScalar = impulse / (1/this.mass + 1/other.mass);
    
    // Apply impulse
    const impulseVector = normal.multiply(impulseScalar);
    this.velocity = this.velocity.add(impulseVector.multiply(1/this.mass));
    other.velocity = other.velocity.subtract(impulseVector.multiply(1/other.mass));
  }

  // ==================== Boundary Handling ====================

  /**
   * Wrap around screen boundaries
   * @param width Screen width
   * @param height Screen height
   */
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

  /**
   * Bounce off screen boundaries
   * @param width Screen width
   * @param height Screen height
   * @param damping Energy loss on bounce (0-1)
   */
  bounceOffBounds(width: number, height: number, damping: number = 0.8): void {
    let bounced = false;

    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius;
      this.velocity.x *= -damping;
      bounced = true;
    } else if (this.position.x + this.radius > width) {
      this.position.x = width - this.radius;
      this.velocity.x *= -damping;
      bounced = true;
    }

    if (this.position.y - this.radius < 0) {
      this.position.y = this.radius;
      this.velocity.y *= -damping;
      bounced = true;
    } else if (this.position.y + this.radius > height) {
      this.position.y = height - this.radius;
      this.velocity.y *= -damping;
      bounced = true;
    }
  }

  // ==================== Utility Methods ====================

  /**
   * Get the kinetic energy of this dot
   */
  getKineticEnergy(): number {
    return 0.5 * this.mass * this.velocity.magnitude() * this.velocity.magnitude();
  }

  /**
   * Get the momentum vector of this dot
   */
  getMomentum(): Vector2 {
    return this.velocity.multiply(this.mass);
  }

  /**
   * Set the velocity magnitude while preserving direction
   * @param speed New speed
   */
  setSpeed(speed: number): void {
    this.velocity = this.velocity.setMagnitude(speed);
  }

  /**
   * Create a copy of this dot
   */
  clone(): Dot {
    return new Dot({
      position: this.position.clone(),
      velocity: this.velocity.clone(),
      acceleration: this.acceleration.clone(),
      mass: this.mass,
      radius: this.radius,
      color: this.color,
      maxSpeed: this.maxSpeed,
      friction: this.friction
    });
  }

  /**
   * Reset the dot to a clean state
   */
  reset(): void {
    this.velocity = Vector2.zero();
    this.acceleration = Vector2.zero();
  }

  // ==================== Static Factory Methods ====================

  /**
   * Create a random dot within bounds
   * @param width Boundary width
   * @param height Boundary height
   * @param options Additional options
   */
  static createRandom(width: number, height: number, options: {
    minRadius?: number;
    maxRadius?: number;
    minSpeed?: number;
    maxSpeed?: number;
    colors?: string[];
  } = {}): Dot {
    const {
      minRadius = 3,
      maxRadius = 8,
      minSpeed = 50,
      maxSpeed = 150,
      colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa726', '#9c27b0']
    } = options;

    const position = new Vector2(
      Math.random() * width,
      Math.random() * height
    );

    const velocity = Vector2.random(
      minSpeed + Math.random() * (maxSpeed - minSpeed)
    );

    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const color = colors[Math.floor(Math.random() * colors.length)];

    return new Dot({
      position,
      velocity,
      radius,
      color
    });
  }
}
