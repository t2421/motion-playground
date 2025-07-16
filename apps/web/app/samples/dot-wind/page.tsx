'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2, Dot } from '@t2421/motion';

export default function DotWind() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVectors, setShowVectors] = useState(true);
  const [enableGravity, setEnableGravity] = useState(false);
  const [enableFriction, setEnableFriction] = useState(false);
  const [enableWind, setEnableWind] = useState(false);
  const [windStrength, setWindStrength] = useState(50);

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
    let startTime = Date.now();
    
    // Wind parameters
    const getWindForce = (time: number, position: Vector2) => {
      if (!enableWind) return Vector2.zero();
      
      // Fixed wind direction (horizontal wind from left to right)
      const windDirection = new Vector2(1, 0.2); // Slightly upward wind
      
      // Create varying wind strength using sine waves
      const baseStrength = Math.abs(Math.sin(time * 0.001)) * windStrength;
      const turbulence = Math.abs(Math.sin(time * 0.003 + position.x * 0.01)) * windStrength * 0.3;
      const gustiness = Math.abs(Math.sin(time * 0.002 + position.y * 0.005)) * windStrength * 0.2;
      
      const totalStrength = baseStrength + turbulence + gustiness;
      
      return windDirection.normalize().multiply(totalStrength);
    };
    
    // Create sample dots
    const dots: Dot[] = [
      // Controlled dot (will be attracted to mouse)
      new Dot({
        position: new Vector2(400, 250),
        velocity: Vector2.zero(),
        radius: 10,
        color: '#45b7d1',
        maxSpeed: 300,
        friction: 0.2
      }),
      new Dot({
        position: new Vector2(300, 250),
        velocity: Vector2.down().multiply(2),
        radius: 10,
        color: '#ffb7d1',
        maxSpeed: 300,
        friction: 0.2
      }),
      new Dot({
        position: new Vector2(500, 250),
        velocity: Vector2.down().multiply(2),
        radius: 10,
        color: '#12ff12',
        maxSpeed: 300,
        friction: 0.2
      }),
    ];

    const connectors: { maxLength: number, minLength: number }[] = [
      { maxLength: 100, minLength: 50 },
      { maxLength: 150, minLength: 75 },
      { maxLength: 200, minLength: 100 }
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
      dots.forEach((dot, index) => {
        const connector = connectors[index] ?? connectors[connectors.length - 1]!; // Use last connector as fallback
        const distanceToMouse = dot.position.distance(mousePos);
        
        // Apply gravity if enabled
        if (enableGravity) {
          dot.applyGravity(Vector2.down().multiply(50));
        }
        
        // Apply wind force if enabled
        const currentTime = Date.now();
        const windForce = getWindForce(currentTime, dot.position);
        if (enableWind) {
          dot.applyForce(windForce);
        }
        
        // Apply constraint forces before update
        const springForce = 3; // Spring force strength
        
        if (distanceToMouse > connector.maxLength) {
          // If too far, apply force towards mouse proportional to overshoot
          const overshoot = distanceToMouse - connector.maxLength;
          const direction = mousePos.subtract(dot.position).normalize();
          const force = direction.multiply(overshoot * springForce);
          dot.applyForce(force);
        } else if (distanceToMouse < connector.minLength && distanceToMouse > 0) {
          // If too close, apply force away from mouse proportional to undershoot
          const undershoot = connector.minLength - distanceToMouse;
          const direction = dot.position.subtract(mousePos).normalize();
          const force = direction.multiply(undershoot * springForce);
          dot.applyForce(force);
        }
        
        dot.update();

        // Bounce off boundaries (but within connector constraints)
        dot.bounceOffBounds(canvas.width, canvas.height, 0.9);
        
        // Draw the dot
        dot.draw(ctx);
        
        // Draw velocity vector if enabled
        if (showVectors && !dot.velocity.isZero()) {
          CanvasUtil.drawVector(ctx, dot.position, dot.velocity.multiply(0.5), {
            color: '#4ecdc4',
            lineWidth: 2,
            label: 'v',
            labelOffset: new Vector2(5, -5)
          });
        }

        // Draw acceleration vector if enabled
        if (showVectors && !dot.acceleration.isZero()) {
          CanvasUtil.drawVector(ctx, dot.position, dot.acceleration.multiply(50), {
            color: '#ff6b6b',
            lineWidth: 2,
            label: 'a',
            labelOffset: new Vector2(5, 5)
          });
        }
        
        // Draw connector constraint visualization
        const currentDistance = dot.position.distance(mousePos);
        
        // Draw min/max range circles
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        
        // Min distance circle
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, connector.minLength, 0, Math.PI * 2);
        ctx.stroke();
        
        // Max distance circle
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, connector.maxLength, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw connection line with color based on constraint state
        let lineColor = dot.color;
        if (currentDistance >= connector.maxLength) {
          lineColor = '#ff4444'; // Red when at max distance
        } else if (currentDistance <= connector.minLength) {
          lineColor = '#ff8844'; // Orange when at min distance
        }
        
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
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
  }, [showVectors, enableGravity, enableFriction, enableWind, windStrength]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Dot Connector Constraints</h1>
        <p style={{ color: '#666' }}>
          Dots are constrained to stay within specified distance ranges from the mouse cursor, creating elastic connector behavior.
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
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={enableWind}
            onChange={(e) => setEnableWind(e.target.checked)}
          />
          Enable Wind
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Wind Strength:
          <input
            type="range"
            min="0"
            max="200"
            value={windStrength}
            onChange={(e) => setWindStrength(Number(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
          <span style={{ minWidth: '3rem', textAlign: 'right' }}>{windStrength}</span>
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

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '0.9em',
        lineHeight: '1.6'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>How it works:</h3>
        <ul style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
          <li><strong>Distance Constraints:</strong> Each dot has min/max distance limits from the mouse cursor</li>
          <li><strong>Connector Ranges:</strong> Blue dot: 50-100px, Pink dot: 75-150px, Green dot: 100-200px</li>
          <li><strong>Visual Feedback:</strong> Constraint circles show allowed ranges, line color indicates constraint state</li>
          <li><strong>Elastic Behavior:</strong> Dots are pulled back when they exceed limits, creating spring-like motion</li>
          <li><strong>Wind Effects:</strong> Dynamic wind forces with turbulence and gustiness for realistic motion</li>
          <li><strong>Physics Integration:</strong> Works with gravity and friction for realistic movement</li>
        </ul>
      </div> 
    </div>
  );
}
