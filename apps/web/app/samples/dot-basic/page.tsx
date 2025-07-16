'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2, Dot } from '@t2421/motion';

export default function DotBasic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVectors, setShowVectors] = useState(true);
  const [enableGravity, setEnableGravity] = useState(false);
  const [enableFriction, setEnableFriction] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;

    // Animation state
    let animationId: number;
    
    // Create sample dots
    const dots: Dot[] = [
      // Controlled dot (will be attracted to mouse)
      new Dot({
        position: new Vector2(400, 250),
        velocity: Vector2.zero(),
        radius: 10,
        color: '#45b7d1',
        maxSpeed: 300,
        friction: enableFriction ? 0.3 : 0
      }),
      new Dot({
        position: new Vector2(300, 250),
        velocity: Vector2.down().multiply(2),
        radius: 10,
        color: '#ffb7d1',
        maxSpeed: 300,
        friction: enableFriction ? 0.015 : 0
      }),
      new Dot({
        position: new Vector2(500, 250),
        velocity: Vector2.down().multiply(2),
        radius: 10,
        color: '#12ff12',
        maxSpeed: 300,
        friction: enableFriction ? 0.015 : 0
      }),
    ];

    // Mouse position for attraction
    let mousePos = new Vector2(400, 250);

    // Mouse event listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      mousePos = new Vector2(
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
      );
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    function animate() {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      CanvasUtil.drawGrid(canvas, { 
        interval: 20, 
        color: '#e9ecef', 
        lineWidth: 1 
      });

      // Update and draw dots
      dots.forEach((dot) => {
        dot.seek(mousePos, 100);
        const distanceToMouse = dot.position.distance(mousePos);
        const direction = dot.position.directionTo(mousePos);
        dot.acceleration = dot.acceleration.add(direction.multiply(distanceToMouse*0.3));
        
        dot.applyGravity(enableGravity ? Vector2.down().multiply(0.5) : Vector2.zero());
        dot.update();

        // Bounce off boundaries
        dot.bounceOffBounds(canvas.width, canvas.height, 0.9);

        // Draw the dot
        dot.draw(ctx);
        
        // Draw debug vectors if enabled
        if (showVectors) {
          dot.drawDebugVectors(ctx, {
            velocityScale: 0.5,
            accelerationScale: 50
          });
        }
        
        ctx.strokeStyle = dot.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(dot.position.x, dot.position.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw mouse position indicator
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 3, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showVectors, enableGravity, enableFriction]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Dot Physics Basics</h1>
        <p style={{ color: '#666' }}>
          Interactive demonstration of dots with position, velocity, and acceleration
        </p>
      </header>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={showVectors}
            onChange={(e) => setShowVectors(e.target.checked)}
          />
          Show Velocity & Acceleration Vectors
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={enableGravity}
            onChange={(e) => setEnableGravity(e.target.checked)}
          />
          Enable Gravity
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={enableFriction}
            onChange={(e) => setEnableFriction(e.target.checked)}
          />
          Enable Friction
        </label>
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
    </div>
  );
}
