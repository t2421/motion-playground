import { Vector2 } from './vector.js';
import { Particle, DotParticle, SquareParticle, TriangleParticle, StarParticle } from './particle.js';

/**
 * Particle type constructor interface
 */
export interface ParticleConstructor {
  new (options?: any): Particle;
}

/**
 * Emission pattern types
 */
export enum EmissionPattern {
  BURST = 'burst',
  CONTINUOUS = 'continuous',
  WAVE = 'wave'
}

/**
 * Particle emitter configuration
 */
export interface ParticleEmitterConfig {
  position: Vector2;
  particleCount?: number;
  emissionRate?: number;
  lifespan?: number;
  particleLifespan?: number;
  particleClass?: ParticleConstructor;
  velocityRange?: {
    min: Vector2;
    max: Vector2;
  };
  accelerationRange?: {
    min: Vector2;
    max: Vector2;
  };
  colors?: string[];
  sizeRange?: {
    min: number;
    max: number;
  };
  pattern?: EmissionPattern;
  spread?: number; // Angle spread in radians
  direction?: Vector2; // Base direction for particles
  gravity?: Vector2;
  friction?: number;
}

/**
 * Particle emitter class that manages particle creation and lifecycle
 */
export class ParticleEmitter {
  public position: Vector2;
  public particles: Particle[] = [];
  public isActive: boolean = true;
  public lifespan: number;
  public maxLifespan: number;
  
  private config: Required<ParticleEmitterConfig>;
  private emissionTimer: number = 0;
  private particlesEmitted: number = 0;
  private particlePool: Particle[] = []; // Object pool for particle reuse
  private poolIndex: number = 0; // Current index in the pool

  constructor(config: ParticleEmitterConfig) {
    this.position = config.position.clone();
    this.maxLifespan = config.lifespan ?? Infinity;
    this.lifespan = this.maxLifespan;
    
    // Set default configuration
    this.config = {
      position: config.position.clone(),
      particleCount: config.particleCount ?? 50,
      emissionRate: config.emissionRate ?? 10, // particles per second
      lifespan: config.lifespan ?? Infinity,
      particleLifespan: config.particleLifespan ?? 120, // frames
      particleClass: config.particleClass ?? DotParticle,
      velocityRange: config.velocityRange ?? {
        min: new Vector2(-50, -50),
        max: new Vector2(50, 50)
      },
      accelerationRange: config.accelerationRange ?? {
        min: new Vector2(0, 0),
        max: new Vector2(0, 0)
      },
      colors: config.colors ?? ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa726', '#9c27b0'],
      sizeRange: config.sizeRange ?? { min: 2, max: 8 },
      pattern: config.pattern ?? EmissionPattern.CONTINUOUS,
      spread: config.spread ?? Math.PI / 4, // 45 degrees
      direction: config.direction ?? Vector2.up(),
      gravity: config.gravity ?? Vector2.zero(),
      friction: config.friction ?? 0
    };
  }

  /**
   * Update the emitter and all its particles
   */
  update(deltaTime: number = 1 / 60): void {
    // Update emitter lifespan
    if (this.maxLifespan !== Infinity) {
      this.lifespan -= deltaTime * 60;
      if (this.lifespan <= 0) {
        this.isActive = false;
      }
    }

    // Emit new particles based on pattern
    if (this.isActive) {
      this.emitParticles(deltaTime);
    }

    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      if (!particle) continue;
      
      // Apply gravity if specified
      if (!this.config.gravity.isZero()) {
        particle.applyGravity(this.config.gravity);
      }
      
      particle.update(deltaTime);
      
      if(particle.isDead){
        if(this.config.particleCount > this.particles.length){
          this.recycleParticle(particle);
        }else{
          this.particles.splice(i, 1);
        }
      }
     
    }
  }

  /**
   * Emit particles based on the current pattern
   */
  private emitParticles(deltaTime: number): void {
    switch (this.config.pattern) {
      case EmissionPattern.BURST:
        this.emitBurst();
        break;
      case EmissionPattern.CONTINUOUS:
        this.emitContinuous(deltaTime);
        break;
      case EmissionPattern.WAVE:
        this.emitWave(deltaTime);
        break;
    }
  }

  /**
   * Emit all particles at once (burst pattern)
   */
  private emitBurst(): void {
    if (this.particlesEmitted === 0) {
      for (let i = 0; i < this.config.particleCount; i++) {
        this.createParticle();
      }
      this.particlesEmitted = this.config.particleCount;
      this.isActive = false; // Stop emitting after burst
    }
  }

  /**
   * Emit particles continuously at specified rate
   */
  private emitContinuous(deltaTime: number): void {
    this.emissionTimer += deltaTime;
    const emissionInterval = 1 / this.config.emissionRate;
    
    while (this.emissionTimer >= emissionInterval && this.particlesEmitted < this.config.particleCount) {
      this.createParticle();
      this.particlesEmitted++;
      this.emissionTimer -= emissionInterval;
    }
    
    if (this.particlesEmitted >= this.config.particleCount) {
      this.isActive = false;
    }
  }

  /**
   * Emit particles in waves (pulsing pattern)
   */
  private emitWave(deltaTime: number): void {
    this.emissionTimer += deltaTime;
    const waveInterval = 1; // 1 second waves
    
    if (this.emissionTimer >= waveInterval) {
      const particlesPerWave = Math.min(10, this.config.particleCount - this.particlesEmitted);
      for (let i = 0; i < particlesPerWave; i++) {
        this.createParticle();
        this.particlesEmitted++;
      }
      this.emissionTimer = 0;
      
      if (this.particlesEmitted >= this.config.particleCount) {
        this.isActive = false;
      }
    }
  }

  /**
   * Create a single particle with randomized properties
   */
  private createParticle(): void {
    // Random velocity within range
    const velocity = this.getRandomVelocity();
    
    // Random acceleration within range
    const acceleration = new Vector2(
      this.lerp(this.config.accelerationRange.min.x, this.config.accelerationRange.max.x, Math.random()),
      this.lerp(this.config.accelerationRange.min.y, this.config.accelerationRange.max.y, Math.random())
    );

    // Random color
    const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
    
    // Random size
    const size = this.lerp(this.config.sizeRange.min, this.config.sizeRange.max, Math.random());

    // Create particle with the specified class
    const particle = new this.config.particleClass({
      position: this.position.clone(),
      velocity,
      acceleration,
      lifespan: this.config.particleLifespan,
      friction: this.config.friction,
      color,
      radius: size, // For DotParticle
      size: size    // For other particle types
    });

    this.particles.push(particle);
  }

  /**
   * Generate random velocity based on direction and spread
   */
  private getRandomVelocity(): Vector2 {
    if (this.config.direction.isZero()) {
      // Random velocity within range if no direction specified
      return new Vector2(
        this.lerp(this.config.velocityRange.min.x, this.config.velocityRange.max.x, Math.random()),
        this.lerp(this.config.velocityRange.min.y, this.config.velocityRange.max.y, Math.random())
      );
    }

    // Use direction with spread
    const baseAngle = Math.atan2(this.config.direction.y, this.config.direction.x);
    const spreadAngle = (Math.random() - 0.5) * this.config.spread;
    const finalAngle = baseAngle + spreadAngle;
    
    const speed = this.lerp(
      this.config.velocityRange.min.magnitude(),
      this.config.velocityRange.max.magnitude(),
      Math.random()
    );

    return new Vector2(
      Math.cos(finalAngle) * speed,
      Math.sin(finalAngle) * speed
    );
  }

  /**
   * Draw all particles
   */
  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      particle.draw(ctx);
    });
  }

  /**
   * Reset the emitter to initial state
   */
  reset(): void {
    this.particles = [];
    this.isActive = true;
    this.lifespan = this.maxLifespan;
    this.emissionTimer = 0;
    this.particlesEmitted = 0;
  }

  /**
   * Set emitter position
   */
  setPosition(position: Vector2): void {
    this.position = position.clone();
    this.config.position = position.clone();
  }
  /**
   * Set emission count and regenerate particles if needed
   */
  setEmissionCount(count: number): void {
    const oldCount = this.config.particleCount;
    this.config.particleCount = count;
    
    // Reset emission state when count changes
    if (oldCount !== count) {
      this.particlesEmitted = 0;
      this.isActive = true;
      
      // For burst pattern, immediately emit all particles
      if (this.config.pattern === EmissionPattern.BURST) {
        this.emitBurst();
      }
    }
  }
  setEmissionRate(rate: number): void {
    this.config.emissionRate = rate
  }
  /**
   * Set velocity range for particles
   */
  setVelocityRange(velocityRange: { min: Vector2; max: Vector2 }): void {
    this.config.velocityRange = {
      min: velocityRange.min.clone(),
      max: velocityRange.max.clone()
    };
  }
  
  /**
   * Set spread angle for particles (in radians)
   */
  setSpread(spread: number): void {
    this.config.spread = spread;
  }
  
  /**
   * Set direction vector for particles
   */
  setDirection(direction: Vector2): void {
    this.config.direction = direction.clone();
  }

  /**
   * Get number of active particles
   */
  getParticleCount(): number {
    return this.particles.length;
  }

  /**
   * Check if emitter is finished (no active particles and not emitting)
   */
  isFinished(): boolean {
    return !this.isActive && this.particles.length === 0;
  }

  /**
   * Recycle a dead particle by resetting it to initial state
   */
  private recycleParticle(particle: Particle): void {
    // Generate new random properties for the recycled particle
    const velocity = this.getRandomVelocity();
    const acceleration = new Vector2(
      this.lerp(this.config.accelerationRange.min.x, this.config.accelerationRange.max.x, Math.random()),
      this.lerp(this.config.accelerationRange.min.y, this.config.accelerationRange.max.y, Math.random())
    );
    const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
    const size = this.lerp(this.config.sizeRange.min, this.config.sizeRange.max, Math.random());

    // Reset the particle with new properties
    particle.reset({
      position: this.position,
      velocity,
      acceleration,
      lifespan: this.config.particleLifespan,
      color,
      radius: size, // For DotParticle
      size: size    // For other particle types
    });

    // Reset friction
    particle.friction = this.config.friction;
  }

  /**
   * Linear interpolation helper
   */
  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Create preset emitter configurations
   */
  static createFireworks(position: Vector2): ParticleEmitter {
    return new ParticleEmitter({
      position,
      particleCount: 30,
      pattern: EmissionPattern.BURST,
      particleClass: StarParticle,
      velocityRange: {
        min: new Vector2(-100, -150),
        max: new Vector2(100, -50)
      },
      colors: ['#ff6b6b', '#ffa726', '#ffeb3b', '#4caf50', '#2196f3'],
      sizeRange: { min: 4, max: 10 },
      particleLifespan: 180,
      gravity: new Vector2(0, 50),
      friction: 0.02
    });
  }

  static createSmoke(position: Vector2): ParticleEmitter {
    return new ParticleEmitter({
      position,
      particleCount: 20,
      emissionRate: 5,
      pattern: EmissionPattern.CONTINUOUS,
      particleClass: DotParticle,
      velocityRange: {
        min: new Vector2(-20, -30),
        max: new Vector2(20, -10)
      },
      colors: ['#666666', '#888888', '#aaaaaa'],
      sizeRange: { min: 3, max: 8 },
      particleLifespan: 240,
      friction: 0.01
    });
  }

  static createMagic(position: Vector2): ParticleEmitter {
    return new ParticleEmitter({
      position,
      particleCount: 40,
      emissionRate: 15,
      pattern: EmissionPattern.CONTINUOUS,
      particleClass: TriangleParticle,
      direction: Vector2.up(),
      spread: Math.PI / 3,
      velocityRange: {
        min: new Vector2(0, 30),
        max: new Vector2(0, 80)
      },
      colors: ['#9c27b0', '#e91e63', '#3f51b5', '#00bcd4'],
      sizeRange: { min: 2, max: 6 },
      particleLifespan: 150
    });
  }
}