// Export all modules
export { Vector2 } from "./vector.js";
export { BezierCurve, EasingFunctions } from "./bezier.js";
export { Shape, Circle, Rectangle, Triangle } from "./shapes.js";
export { Motion } from "./motion.js";

// Version and package info
export const VERSION = "0.1.0";
export const PACKAGE_NAME = "@repo/motion";

/**
 * Motion Package - A comprehensive animation and vector calculation library
 * 
 * Features:
 * - Vector2D calculations
 * - Bezier curves and easing functions
 * - Geometric shapes (Circle, Rectangle, Triangle)
 * - Motion utility functions
 * 
 * Example usage:
 * ```typescript
 * import { Vector2, Circle, Motion } from "@repo/motion";
 * 
 * const position = new Vector2(10, 20);
 * const circle = new Circle(5, position);
 * const lerped = Motion.lerp(0, 100, 0.5); // 50
 * ```
 */
