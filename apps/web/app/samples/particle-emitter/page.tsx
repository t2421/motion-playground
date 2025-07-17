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
    
    // Mouse position
    let mousePos = new Vector2(400, 300);

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
      
      mousePos = new Vector2(
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
      );

      // Update mouse emitter position if active
      if (mouseEmitter && isMouseDown) {
        mouseEmitter.setPosition(mousePos);
      }
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
        particleCount: 200, // Limit for continuous emission
        emissionRate: 20,
        pattern: EmissionPattern.CONTINUOUS,
        particleClass: particleClasses[particleShape],
        velocityRange: {
          min: new Vector2(-60, -80),
          max: new Vector2(60, -20)
        },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa726', '#9c27b0'],
        sizeRange: { min: 2, max: 6 },
        particleLifespan: 120,
        gravity: new Vector2(0, 20),
        friction: 0.02
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

      // Draw crosshair
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
  }, [particleShape, particleCount]);

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
          <li>Mouse-down particle emission</li>
          <li>Multiple particle shapes: Dot, Square, Triangle, Star</li>
          <li>Configurable particle count</li>
          <li>Physics simulation with gravity and friction</li>
          <li>Real-time mouse tracking</li>
        </ul>
      </div>
    </div>
  );
}