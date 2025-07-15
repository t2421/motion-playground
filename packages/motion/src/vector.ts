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
   * Project this vector onto another vector
   * Returns the projection of this vector onto the target vector
   */
  projectOnto(target: Vector2): Vector2 {
    const targetMagnitudeSquared = target.dot(target);
    if (targetMagnitudeSquared === 0) {
      return new Vector2(0, 0); // Cannot project onto zero vector
    }
    
    const scalar = this.dot(target) / targetMagnitudeSquared;
    return target.multiply(scalar);
  }

  /**
   * Get the scalar projection of this vector onto another vector
   * Returns the length of the projection (can be negative)
   */
  scalarProjection(target: Vector2): number {
    const targetMagnitude = target.magnitude();
    if (targetMagnitude === 0) return 0;
    
    return this.dot(target) / targetMagnitude;
  }

  /**
   * Get the rejection of this vector from another vector
   * Returns the component of this vector perpendicular to the target
   */
  reject(target: Vector2): Vector2 {
    const projection = this.projectOnto(target);
    return this.subtract(projection);
  }

  /**
   * Create a string representation of this vector
   */
  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }

  // ==================== Basic Operations ====================

  /**
   * Create a copy of this vector
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Get the negated vector
   */
  negate(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  /**
   * Check if this vector equals another vector
   */
  equals(vector: Vector2, tolerance: number = 0.001): boolean {
    return Math.abs(this.x - vector.x) < tolerance && 
           Math.abs(this.y - vector.y) < tolerance;
  }

  /**
   * Check if this vector is zero
   */
  isZero(tolerance: number = 0.001): boolean {
    return this.magnitude() < tolerance;
  }

  // ==================== Geometric Operations ====================

  /**
   * Rotate this vector by the given angle in radians
   */
  rotate(angleRadians: number): Vector2 {
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
   * Get a vector perpendicular to this one (rotated 90 degrees counter-clockwise)
   */
  perpendicular(): Vector2 {
    return new Vector2(-this.y, this.x);
  }

  /**
   * Reflect this vector across a surface with the given normal
   */
  reflect(normal: Vector2): Vector2 {
    const normalizedNormal = normal.normalize();
    return this.subtract(normalizedNormal.multiply(2 * this.dot(normalizedNormal)));
  }

  /**
   * Linear interpolation between this vector and another
   */
  lerp(target: Vector2, t: number): Vector2 {
    return new Vector2(
      this.x + (target.x - this.x) * t,
      this.y + (target.y - this.y) * t
    );
  }

  // ==================== Distance and Range Operations ====================

  /**
   * Get the squared distance between this vector and another (faster than distance)
   */
  distanceSquared(vector: Vector2): number {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return dx * dx + dy * dy;
  }

  /**
   * Clamp this vector's components between min and max vectors
   */
  clamp(min: Vector2, max: Vector2): Vector2 {
    return new Vector2(
      Math.max(min.x, Math.min(max.x, this.x)),
      Math.max(min.y, Math.min(max.y, this.y))
    );
  }

  /**
   * Limit the magnitude of this vector to the given maximum
   */
  limit(maxLength: number): Vector2 {
    const mag = this.magnitude();
    if (mag > maxLength) {
      return this.normalize().multiply(maxLength);
    }
    return this.clone();
  }

  // ==================== Magnitude and Angle Setters ====================

  /**
   * Set the magnitude of this vector while preserving direction
   */
  setMagnitude(magnitude: number): Vector2 {
    return this.normalize().multiply(magnitude);
  }

  /**
   * Set the angle of this vector while preserving magnitude
   */
  setAngle(angleRadians: number): Vector2 {
    const mag = this.magnitude();
    return new Vector2(
      Math.cos(angleRadians) * mag,
      Math.sin(angleRadians) * mag
    );
  }

  // ==================== Conversion Methods ====================

  /**
   * Convert this vector to an array
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Convert this vector to a plain object
   */
  toObject(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }

  // ==================== Static Factory Methods ====================

  /**
   * Create a vector from an angle and magnitude
   */
  static fromAngle(angleRadians: number, magnitude: number = 1): Vector2 {
    return new Vector2(
      Math.cos(angleRadians) * magnitude,
      Math.sin(angleRadians) * magnitude
    );
  }

  /**
   * Create a random unit vector
   */
  static random(magnitude: number = 1): Vector2 {
    const angle = Math.random() * Math.PI * 2;
    return Vector2.fromAngle(angle, magnitude);
  }

  /**
   * Create a zero vector
   */
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * Create a unit vector (1, 1)
   */
  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  /**
   * Create an up vector (0, -1) - negative Y is up in screen coordinates
   */
  static up(): Vector2 {
    return new Vector2(0, -1);
  }

  /**
   * Create a down vector (0, 1)
   */
  static down(): Vector2 {
    return new Vector2(0, 1);
  }

  /**
   * Create a left vector (-1, 0)
   */
  static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  /**
   * Create a right vector (1, 0)
   */
  static right(): Vector2 {
    return new Vector2(1, 0);
  }

  /**
   * Create a vector from an array
   */
  static fromArray(array: [number, number]): Vector2 {
    return new Vector2(array[0], array[1]);
  }

  /**
   * Create a vector from an object
   */
  static fromObject(obj: { x: number, y: number }): Vector2 {
    return new Vector2(obj.x, obj.y);
  }
}
