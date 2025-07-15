/**
 * 2D Vector class for motion calculations
 */
export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  /**
   * Add another vector to this vector
   */
  add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  /**
   * Subtract another vector from this vector
   */
  subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  /**
   * Multiply this vector by a scalar
   */
  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Get the magnitude (length) of this vector
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize this vector (make it unit length)
   */
  normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2(0, 0);
    return new Vector2(this.x / mag, this.y / mag);
  }

  /**
   * Get the distance between this vector and another
   */
  distance(vector: Vector2): number {
    return this.subtract(vector).magnitude();
  }

  /**
   * Calculate the dot product of this vector and another
   */
  dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * Calculate the cross product of this vector and another
   * In 2D, this returns a scalar (the z-component of the 3D cross product)
   */
  cross(vector: Vector2): number {
    return this.x * vector.y - this.y * vector.x;
  }

  /**
   * Get the angle between this vector and another in radians
   */
  angleTo(vector: Vector2): number {
    const dotProduct = this.dot(vector);
    const magnitudes = this.magnitude() * vector.magnitude();
    if (magnitudes === 0) return 0;
    return Math.acos(Math.max(-1, Math.min(1, dotProduct / magnitudes)));
  }

  /**
   * Get the angle of this vector in radians (from positive x-axis)
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Create a string representation of this vector
   */
  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
