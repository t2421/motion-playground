import { Vector2 } from "./vector.js";

/**
 * Basic geometric shapes for animations
 */
export abstract class Shape {
  constructor(public position: Vector2 = new Vector2()) {}

  abstract getArea(): number;
  abstract getPerimeter(): number;
  abstract toString(): string;
}

/**
 * Circle shape
 */
export class Circle extends Shape {
  constructor(
    public radius: number = 1,
    position: Vector2 = new Vector2()
  ) {
    super(position);
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  toString(): string {
    return `Circle(radius: ${this.radius}, position: ${this.position.toString()})`;
  }
}

/**
 * Rectangle shape
 */
export class Rectangle extends Shape {
  constructor(
    public width: number = 1,
    public height: number = 1,
    position: Vector2 = new Vector2()
  ) {
    super(position);
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  toString(): string {
    return `Rectangle(width: ${this.width}, height: ${this.height}, position: ${this.position.toString()})`;
  }
}

/**
 * Triangle shape
 */
export class Triangle extends Shape {
  constructor(
    public base: number = 1,
    public height: number = 1,
    position: Vector2 = new Vector2()
  ) {
    super(position);
  }

  getArea(): number {
    return (this.base * this.height) / 2;
  }

  getPerimeter(): number {
    // For simplicity, assuming an isosceles triangle
    const side = Math.sqrt((this.base / 2) ** 2 + this.height ** 2);
    return this.base + 2 * side;
  }

  toString(): string {
    return `Triangle(base: ${this.base}, height: ${this.height}, position: ${this.position.toString()})`;
  }
}
