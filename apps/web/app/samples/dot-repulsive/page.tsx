'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2, Dot } from '@t2421/motion';

export default function DotRepulsive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVectors, setShowVectors] = useState(true);
  const [repulsionForce, setRepulsionForce] = useState(100);
  const [repulsionRadius, setRepulsionRadius] = useState(150);
  const [enableTrails, setEnableTrails] = useState(false);

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
    
    // Create multiple dots scattered around the canvas
    const dots: Dot[] = [];
    const numDots = 15;
    
    for (let i = 0; i < numDots; i++) {
      dots.push(new Dot({
        position: new Vector2(
          Math.random() * (canvas.width - 100) + 50,
          Math.random() * (canvas.height - 100) + 50
        ),
        velocity: Vector2.random(Math.random() * 50 + 25),
        radius: 6 + Math.random() * 8,
        color: `hsl(${(i * 360 / numDots) + Math.random() * 60}, 70%, 60%)`,
        maxSpeed: 200,
        friction: 0.05
      }));
    }

    // Mouse position for repulsion
    let mousePos = new Vector2(400, 250);
    let isMouseInCanvas = false;

    // Mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      mousePos = new Vector2(
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
      );
    };

    const handleMouseEnter = () => {
      isMouseInCanvas = true;
    };

    const handleMouseLeave = () => {
      isMouseInCanvas = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    function animate() {
      if (!canvas || !ctx) return;
      
      // Clear canvas with trails effect or complete clear
      if (enableTrails) {
        ctx.fillStyle = 'rgba(248, 249, 250, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw grid
      if (!enableTrails) {
        CanvasUtil.drawGrid(canvas, { 
          interval: 20, 
          color: '#e9ecef', 
          lineWidth: 1 
        });
      }

      // Update and draw dots
      dots.forEach((dot) => {
        if (isMouseInCanvas) {
          const distanceToMouse = dot.position.distance(mousePos);
          
          // Apply repulsion force only if within repulsion radius
          if (distanceToMouse < repulsionRadius) {
            dot.flee(mousePos, repulsionForce);
          }
        }
        
        dot.update();

        // Wrap around boundaries instead of bouncing
        dot.wrapAroundBounds(canvas.width, canvas.height);

        // Draw the dot
        CanvasUtil.drawParticle(ctx, dot, {
          showVelocity: showVectors,
          showAcceleration: showVectors,
          velocityScale: 0.3,
          accelerationScale: 20
        });
      });

      // Draw mouse repulsion area when mouse is in canvas
      if (isMouseInCanvas && !enableTrails) {
        // Draw repulsion radius circle
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, repulsionRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw mouse position indicator
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw inner core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showVectors, repulsionForce, repulsionRadius, enableTrails]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Dot Repulsive Force</h1>
        <p style={{ color: '#666' }}>
          Dots flee from the mouse cursor using repulsive forces. Move your mouse over the canvas to see the effect.
        </p>
      </header>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
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
            checked={enableTrails}
            onChange={(e) => setEnableTrails(e.target.checked)}
          />
          Enable Trails Effect
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Repulsion Force:
          <input
            type="range"
            min="1"
            max="200"
            step="10"
            value={repulsionForce}
            onChange={(e) => setRepulsionForce(parseFloat(e.target.value))}
            style={{ width: '100px' }}
          />
          <span style={{ minWidth: '40px', fontSize: '0.9em' }}>{repulsionForce.toFixed(1)}</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Repulsion Radius:
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={repulsionRadius}
            onChange={(e) => setRepulsionRadius(parseInt(e.target.value))}
            style={{ width: '100px' }}
          />
          <span style={{ minWidth: '40px', fontSize: '0.9em' }}>{repulsionRadius}px</span>
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
          style={{ display: 'block', width: '100%', height: 'auto', cursor: 'none' }}
        />
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '0.9em',
        lineHeight: '1.6'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>How it works:</h3>
        <ul style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
          <li><strong>Repulsive Force:</strong> Uses the <code>flee()</code> method to make dots move away from the mouse</li>
          <li><strong>Radius Control:</strong> Only dots within the repulsion radius are affected</li>
          <li><strong>Force Strength:</strong> Adjust the strength of the repulsive force</li>
          <li><strong>Wrapping Boundaries:</strong> Dots wrap around screen edges for continuous motion</li>
          <li><strong>Trails Effect:</strong> Optional visual effect showing dot movement paths</li>
        </ul>
      </div>
    </div>
  );
}
