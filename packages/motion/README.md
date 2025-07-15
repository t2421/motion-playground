# @t2421/motion

A comprehensive animation and vector calculation library for motion graphics and animations.

## Features

- **Vector2D calculations**: Add, subtract, multiply, normalize vectors
- **Bezier curves**: Create smooth curves and easing functions
- **Geometric shapes**: Circle, Rectangle, Triangle with area/perimeter calculations
- **Motion utilities**: Linear interpolation, clamping, mapping, and more

## Usage

```typescript
import { Vector2, Circle, MotionUtil, BezierCurve, EasingFunctions } from "@t2421/motion";

// Vector calculations
const position = new Vector2(10, 20);
const velocity = new Vector2(5, 0);
const newPosition = position.add(velocity);

// Shapes
const circle = new Circle(5, position);
console.log(circle.getArea()); // π * 5²

// Motion utilities
const lerped = MotionUtil.lerp(0, 100, 0.5); // 50
const clamped = MotionUtil.clamp(150, 0, 100); // 100

// Bezier curves
const curve = new BezierCurve(
  { x: 0, y: 0 },
  { x: 25, y: 100 },
  { x: 75, y: 100 },
  { x: 100, y: 0 }
);
const point = curve.getPoint(0.5); // Middle point of the curve
```

## API Reference

### Vector2
- `add(vector)` - Add vectors
- `subtract(vector)` - Subtract vectors
- `multiply(scalar)` - Multiply by scalar
- `magnitude()` - Get vector length
- `normalize()` - Get unit vector
- `distance(vector)` - Distance to another vector

### Shapes
- `Circle(radius, position)` - Circle shape
- `Rectangle(width, height, position)` - Rectangle shape
- `Triangle(base, height, position)` - Triangle shape

### MotionUtil
- `lerp(start, end, t)` - Linear interpolation
- `clamp(value, min, max)` - Clamp value to range
- `map(value, fromMin, fromMax, toMin, toMax)` - Map value between ranges
- `degToRad(degrees)` / `radToDeg(radians)` - Angle conversions

### Bezier & Easing
- `BezierCurve(p0, p1, p2, p3)` - Cubic bezier curve
- `EasingFunctions` - Predefined easing curves (linear, easeIn, easeOut, easeInOut)
