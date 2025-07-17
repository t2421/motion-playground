'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { 
  CanvasUtil, 
  Vector2, 
  ParticleEmitter, 
  EmissionPattern,
  DotParticle,
  SquareParticle,
  TriangleParticle,
  StarParticle
} from '@t2421/motion';

export default function ParticleEmitterSample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleShape, setParticleShape] = useState<'dot' | 'square' | 'triangle' | 'star'>('dot');
  const [particleCount, setParticleCount] = useState(30);
  const [emissionRate, setEmissionRate] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Animation state
    let animationId: number;
    const emitters: ParticleEmitter[] = [];
    let mouseEmitter: ParticleEmitter | null = null;
    let isMouseDown = false;
    
    // Mouse position and movement tracking
    let mousePos = new Vector2(400, 300);
    let prevMousePos = new Vector2(400, 300);
    let mouseVelocity = new Vector2(0, 0);
    const velocitySmoothing = 0.8; // Smoothing factor for velocity calculation
    const minVelocityMagnitude = 2; // Minimum velocity magnitude to consider for direction

    const particleClasses = {
      dot: DotParticle,
      square: SquareParticle,
      triangle: TriangleParticle,
      star: StarParticle
    };

    // Mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      prevMousePos = mousePos.clone();
      mousePos = new Vector2(
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
      );

      // Calculate mouse velocity with smoothing
      const currentVelocity = mousePos.subtract(prevMousePos);
      mouseVelocity = mouseVelocity.multiply(velocitySmoothing).add(currentVelocity.multiply(1 - velocitySmoothing));

      // Update mouse emitter position and direction if active
      if (mouseEmitter && isMouseDown) {
        mouseEmitter.setPosition(mousePos);
        updateEmitterDirection();
      }
    };

    // Update emitter direction based on mouse velocity
    const updateEmitterDirection = () => {
      if (!mouseEmitter) return;
      
      // Only update direction if mouse is moving fast enough
      const velocityMagnitude = mouseVelocity.magnitude();
      if (velocityMagnitude < minVelocityMagnitude) return;
      
      // Get the inverse direction of mouse movement
      const inverseDirection = mouseVelocity.multiply(-1).normalize();
      
      // Calculate velocity range based on mouse speed
      const speed = Math.min(200, velocityMagnitude * 8); // 速度上限を上げる
      const minSpeed = speed * 0.3; // 最小速度を下げて広がりを増す
      
      // 横方向の拡散を増やす
      const perpVector = new Vector2(-inverseDirection.y, inverseDirection.x);
      const spreadFactor = 80; // 横方向の拡散係数を大きくする
      
      // Set velocity range in the opposite direction of mouse movement with increased spread
      mouseEmitter.setVelocityRange({
        min: new Vector2(
          inverseDirection.x * minSpeed - perpVector.x * spreadFactor,
          inverseDirection.y * minSpeed - perpVector.y * spreadFactor
        ),
        max: new Vector2(
          inverseDirection.x * speed + perpVector.x * spreadFactor,
          inverseDirection.y * speed + perpVector.y * spreadFactor
        )
      });
      
      // マウスの動きが速いほど拡散角度を広げる
      const dynamicSpread = Math.PI * (0.8 + Math.min(0.6, velocityMagnitude / 50));
      mouseEmitter.setSpread(dynamicSpread);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      mousePos = new Vector2(
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
      );

      isMouseDown = true;

      // Create continuous emitter at mouse position
      mouseEmitter = new ParticleEmitter({
        position: mousePos,
        particleCount: 60, // より多くのパーティクルを生成
        emissionRate,
        pattern: EmissionPattern.CONTINUOUS,
        particleClass: particleClasses[particleShape],
        velocityRange: {
          min: new Vector2(-50, -50), // 速度範囲を広げる
          max: new Vector2(50, 50)
        },
        accelerationRange: { // ランダムな加速度を追加
          min: new Vector2(-3, -3),
          max: new Vector2(3, 3)
        },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa726', '#9c27b0', '#ffeb3b', '#2196f3'],
        sizeRange: { min: 3, max: 6 }, // サイズ範囲を広げる
        particleLifespan: 120, // 寿命を長くする
        gravity: new Vector2(0, 3), // 重力をさらに弱める
        friction: 0.02, // 摩擦をさらに減らす
        spread: Math.PI * 0.5 // 拡散角度をさらに広げる（約216度）
      });
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      // mouseEmitter = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    function animate() {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      CanvasUtil.drawGrid(canvas, { 
        interval: 40, 
        color: '#16213e', 
        lineWidth: 1 
      });

      // Update and draw mouse emitter
      if (mouseEmitter && isMouseDown) {
        mouseEmitter.setEmissionRate(emissionRate);
        mouseEmitter.update();
        mouseEmitter.draw(ctx);
      }

      // Update and draw emitters
      for (let i = emitters.length - 1; i >= 0; i--) {
        const emitter = emitters[i];
        if (!emitter) continue;
        
        emitter.update();
        emitter.draw(ctx);

        // Remove finished emitters
        if (emitter.isFinished()) {
          emitters.splice(i, 1);
        }
      }

      // Draw mouse position indicator
      ctx.strokeStyle = isMouseDown ? '#ff6b6b' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, isMouseDown ? 8 : 5, 0, Math.PI * 2);
      ctx.stroke();

      // Draw mouse velocity vector and its inverse
      if (mouseVelocity.magnitude() > minVelocityMagnitude) {
        // Draw velocity vector (direction of mouse movement)
        const velocityScale = 5; // Scale factor to make vector visible
        const velocityEnd = mousePos.add(mouseVelocity.multiply(velocityScale));
        
        ctx.strokeStyle = '#4ecdc4'; // Teal color for velocity
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.lineTo(velocityEnd.x, velocityEnd.y);
        ctx.stroke();
        
        // Draw arrowhead
        const arrowSize = 8;
        const angle = Math.atan2(velocityEnd.y - mousePos.y, velocityEnd.x - mousePos.x);
        ctx.beginPath();
        ctx.moveTo(velocityEnd.x, velocityEnd.y);
        ctx.lineTo(
          velocityEnd.x - arrowSize * Math.cos(angle - Math.PI / 6),
          velocityEnd.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          velocityEnd.x - arrowSize * Math.cos(angle + Math.PI / 6),
          velocityEnd.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#4ecdc4';
        ctx.fill();
        
        // Draw inverse vector (direction of particle emission)
        const inverseEnd = mousePos.add(mouseVelocity.multiply(-velocityScale));
        
        ctx.strokeStyle = '#ff6b6b'; // Red color for inverse direction
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.lineTo(inverseEnd.x, inverseEnd.y);
        ctx.stroke();
        
        // Draw arrowhead for inverse vector
        const inverseAngle = Math.atan2(inverseEnd.y - mousePos.y, inverseEnd.x - mousePos.x);
        ctx.beginPath();
        ctx.moveTo(inverseEnd.x, inverseEnd.y);
        ctx.lineTo(
          inverseEnd.x - arrowSize * Math.cos(inverseAngle - Math.PI / 6),
          inverseEnd.y - arrowSize * Math.sin(inverseAngle - Math.PI / 6)
        );
        ctx.lineTo(
          inverseEnd.x - arrowSize * Math.cos(inverseAngle + Math.PI / 6),
          inverseEnd.y - arrowSize * Math.sin(inverseAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();
      }

      // Draw crosshair
      ctx.strokeStyle = isMouseDown ? '#ff6b6b' : '#ffffff';
      ctx.beginPath();
      ctx.moveTo(mousePos.x - 10, mousePos.y);
      ctx.lineTo(mousePos.x + 10, mousePos.y);
      ctx.moveTo(mousePos.x, mousePos.y - 10);
      ctx.lineTo(mousePos.x, mousePos.y + 10);
      ctx.stroke();

      // Draw info
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      const mouseParticles = mouseEmitter && isMouseDown ? mouseEmitter.getParticleCount() : 0;
      const totalParticles = emitters.reduce((sum, e) => sum + e.getParticleCount(), 0) + mouseParticles;
      ctx.fillText(`Total Particles: ${totalParticles}`, 10, 25);
      ctx.fillText('Hold mouse button to emit particles', 10, canvas.height - 20);

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particleShape, particleCount, emissionRate]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Particle Emitter System</h1>
        <p style={{ color: '#666' }}>
          Hold mouse button to emit particles
        </p>
      </header>

      {/* Simple Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Particle Shape:
          </label>
          <select
            value={particleShape}
            onChange={(e) => setParticleShape(e.target.value as 'dot' | 'square' | 'triangle' | 'star')}
            style={{ padding: '0.5rem' }}
          >
            <option value="dot">Dot</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="star">Star</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Particle Count: {particleCount}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            style={{ width: '150px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Emission Rate: {emissionRate}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={emissionRate}
            onChange={(e) => setEmissionRate(Number(e.target.value))}
            style={{ width: '150px' }}
          />
        </div>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <canvas 
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: 'auto', cursor: 'crosshair' }}
        />
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Features:</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Mouse-down particle emission with motion-based direction</li>
          <li>Particles emit in the opposite direction of mouse movement</li>
          <li>Visual motion vectors with directional indicators</li>
          <li>Multiple particle shapes: Dot, Square, Triangle, Star</li>
          <li>Configurable particle count with object pooling</li>
          <li>Physics simulation with gravity and friction</li>
          <li>Real-time mouse tracking with velocity calculation</li>
        </ul>
      </div>
    </div>
  );
}