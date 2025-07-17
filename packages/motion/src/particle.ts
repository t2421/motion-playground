import { Vector2 } from './vector.js';
import { Mover } from './mover.js';

/**
 * Base particle class that extends Mover with lifetime management
 */
export class Particle extends Mover {
  public lifespan: number;
  public maxLifespan: number;
  public isDead: boolean = false;

  constructor(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    mass?: number;
    maxSpeed?: number;
    friction?: number;
    lifespan?: number;
  } = {}) {
    super(options);
    this.maxLifespan = options.lifespan ?? 60; // Default 1 second at 60fps
    this.lifespan = this.maxLifespan;
  }

  /** Update particle physics and lifetime */
  update(deltaTime: number = 1 / 60): void {
    super.update(deltaTime);
    this.lifespan -= deltaTime * 60; // Convert to frame-based
    if (this.lifespan <= 0) {
      this.isDead = true;
    }
  }

  /** Get normalized age (0 = just born, 1 = about to die) */
  getAge(): number {
    return 1 - (this.lifespan / this.maxLifespan);
  }

  /** Get alpha value based on age for fade effect */
  getAlpha(): number {
    return Math.max(0, this.lifespan / this.maxLifespan);
  }

  /** Reset particle to initial state for reuse */
  reset(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    lifespan?: number;
    color?: string;
    radius?: number;
    size?: number;
  } = {}): void {
    // Reset physics properties
    if (options.position) this.position = options.position.clone();
    if (options.velocity) this.velocity = options.velocity.clone();
    if (options.acceleration) this.acceleration = options.acceleration.clone();
    
    // Reset lifetime
    if (options.lifespan !== undefined) {
      this.maxLifespan = options.lifespan;
      this.lifespan = options.lifespan;
    } else {
      this.lifespan = this.maxLifespan;
    }
    
    this.isDead = false;
    
    // Reset visual properties (to be overridden in subclasses)
    this.resetVisualProperties(options);
  }

  /** Reset visual properties - to be overridden by subclasses */
  protected resetVisualProperties(options: any): void {
    // Base implementation - override in subclasses
  }

  /** Abstract draw method to be implemented by subclasses */
  draw(ctx: CanvasRenderingContext2D): void {
    // Base implementation - override in subclasses
  }
}

/**
 * Dot-shaped particle
 */
export class DotParticle extends Particle {
  public radius: number;
  public color: string;

  constructor(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    mass?: number;
    maxSpeed?: number;
    friction?: number;
    lifespan?: number;
    radius?: number;
    color?: string;
  } = {}) {
    super(options);
    this.radius = options.radius ?? 3;
    this.color = options.color ?? '#ff6b6b';
  }

  protected resetVisualProperties(options: any): void {
    if (options.radius !== undefined) this.radius = options.radius;
    if (options.color !== undefined) this.color = options.color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const alpha = this.getAlpha();
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Square-shaped particle
 */
export class SquareParticle extends Particle {
  public size: number;
  public color: string;

  constructor(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    mass?: number;
    maxSpeed?: number;
    friction?: number;
    lifespan?: number;
    size?: number;
    color?: string;
  } = {}) {
    super(options);
    this.size = options.size ?? 6;
    this.color = options.color ?? '#4ecdc4';
  }

  protected resetVisualProperties(options: any): void {
    if (options.size !== undefined) this.size = options.size;
    if (options.color !== undefined) this.color = options.color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const alpha = this.getAlpha();
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
    ctx.restore();
  }
}

/**
 * Triangle-shaped particle
 */
export class TriangleParticle extends Particle {
  public size: number;
  public color: string;

  constructor(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    mass?: number;
    maxSpeed?: number;
    friction?: number;
    lifespan?: number;
    size?: number;
    color?: string;
  } = {}) {
    super(options);
    this.size = options.size ?? 6;
    this.color = options.color ?? '#45b7d1';
  }

  protected resetVisualProperties(options: any): void {
    if (options.size !== undefined) this.size = options.size;
    if (options.color !== undefined) this.color = options.color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const alpha = this.getAlpha();
    const halfSize = this.size / 2;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y - halfSize);
    ctx.lineTo(this.position.x - halfSize, this.position.y + halfSize);
    ctx.lineTo(this.position.x + halfSize, this.position.y + halfSize);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Star-shaped particle
 */
export class StarParticle extends Particle {
  public size: number;
  public color: string;

  constructor(options: {
    position?: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    mass?: number;
    maxSpeed?: number;
    friction?: number;
    lifespan?: number;
    size?: number;
    color?: string;
  } = {}) {
    super(options);
    this.size = options.size ?? 8;
    this.color = options.color ?? '#ffa726';
  }

  protected resetVisualProperties(options: any): void {
    if (options.size !== undefined) this.size = options.size;
    if (options.color !== undefined) this.color = options.color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const alpha = this.getAlpha();
    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size * 0.4;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = this.position.x + Math.cos(angle) * radius;
      const y = this.position.y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}