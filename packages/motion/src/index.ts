// Export all modules
export { Vector2 } from "./vector.js";
export { Mover } from "./mover.js";
export { Dot } from "./dot.js";
export { BezierCurve, EasingFunctions } from "./bezier.js";
export { Shape, Circle, Rectangle, Triangle } from "./shapes.js";
export { MotionUtil } from "./motion.js";
export { CanvasUtil, type GridOptions, type VectorDrawOptions } from "./utils/canvas.js";
export { PerlinNoise, perlinNoise } from "./noise.js";
export { Camera2D } from "./camera.js";
export { 
  Particle, 
  DotParticle, 
  SquareParticle, 
  TriangleParticle, 
  StarParticle 
} from "./particle.js";
export { 
  ParticleEmitter, 
  EmissionPattern, 
  type ParticleConstructor, 
  type ParticleEmitterConfig 
} from "./particle-emitter.js";

// Version and package info
export const VERSION = "0.1.0";
export const PACKAGE_NAME = "@t2421/motion";

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
 * import { Vector2, Circle, MotionUtil } from "@t2421/motion";
 * 
 * const position = new Vector2(10, 20);
 * const circle = new Circle(5, position);
 * const lerped = MotionUtil.lerp(0, 100, 0.5); // 50
 * ```
 */
