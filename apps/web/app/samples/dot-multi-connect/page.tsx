'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2, Dot } from '@t2421/motion';

export default function DotMultiConnect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVectors, setShowVectors] = useState(true);
  const [enableGravity, setEnableGravity] = useState(false);
  const [enableFriction, setEnableFriction] = useState(false);
  const [springStrength, setSpringStrength] = useState(0.1);
  const [damping, setDamping] = useState(0.98);

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
    
    // Spring force calculation
    const calculateSpringForce = (position: Vector2, target: Vector2, strength: number, restLength: number = 0) => {
      const displacement = target.subtract(position);
      const distance = displacement.magnitude();
      
      if (distance === 0) return Vector2.zero();
      
      const extension = distance - restLength;
      const force = displacement.normalize().multiply(extension * strength);
      
      return force;
    };
    
    // Create sample dots
    const dots: Dot[] = [
      // Dot connected to BOTH mouse AND screen edge with springs
      new Dot({
        position: new Vector2(400, 250),
        velocity: Vector2.zero(),
        radius: 10,
        color: '#45b7d1',
        maxSpeed: 500,
        friction: 0.1
      }),
      // Independent dot with free movement
      new Dot({
        position: new Vector2(600, 250),
        velocity: new Vector2(-50, 30),
        radius: 8,
        color: '#ff6b6b',
        maxSpeed: 300,
        friction: 0.05
      }),
    ];

    // Screen edge anchor points for the second dot
    const edgeAnchors = [
      new Vector2(0, 250),        // Left edge
      new Vector2(800, 250),      // Right edge
      new Vector2(400, 0),        // Top edge
      new Vector2(400, 500),      // Bottom edge
    ];
    let currentEdgeIndex = 0;

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

    // Edge anchor cycling for the second dot
    const cycleEdgeAnchor = () => {
      currentEdgeIndex = (currentEdgeIndex + 1) % edgeAnchors.length;
    };

    // Click event to cycle edge anchor
    const handleCanvasClick = () => {
      cycleEdgeAnchor();
    };

    canvas.addEventListener('click', handleCanvasClick);

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

      // Current edge anchor for the second dot
      const currentEdgeAnchor = edgeAnchors[currentEdgeIndex]!;

      // Update and draw dots
      dots.forEach((dot, index) => {
        // Apply gravity if enabled
        if (enableGravity) {
          dot.applyGravity(Vector2.down().multiply(50));
        }
        
        // Apply spring forces
        if (index === 0) {
          // First dot: connected to BOTH mouse AND screen edge
          
          // Spring force to mouse
          const mouseSpringForce = calculateSpringForce(dot.position, mousePos, springStrength, 80);
          dot.applyForce(mouseSpringForce);
          
          // Spring force to edge anchor
          const edgeSpringForce = calculateSpringForce(dot.position, currentEdgeAnchor, springStrength * 0.7, 120);
          dot.applyForce(edgeSpringForce);
          
        } else if (index === 1) {
          // Second dot: independent movement, no spring connections
          // Just apply some random movement or let it move freely
        }
        
        // Apply damping
        dot.velocity = dot.velocity.multiply(damping);
        
        dot.update();

        // Bounce off boundaries
        dot.bounceOffBounds(canvas.width, canvas.height, 0.8);
        
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
        
        // Draw spring connections for the first dot only
        if (index === 0) {
          // Connection to mouse
          ctx.strokeStyle = '#45b7d1';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(dot.position.x, dot.position.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
          
          // Connection to edge anchor
          ctx.strokeStyle = '#9b59b6';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(dot.position.x, dot.position.y);
          ctx.lineTo(currentEdgeAnchor.x, currentEdgeAnchor.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw mouse position indicator
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw edge anchor indicator
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(currentEdgeAnchor.x, currentEdgeAnchor.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw edge anchor label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(`Edge ${currentEdgeIndex + 1}`, currentEdgeAnchor.x + 10, currentEdgeAnchor.y - 10);

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showVectors, enableGravity, enableFriction, springStrength, damping]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Multi-Connected Dot</h1>
        <p style={{ color: '#666' }}>
          Blue dot is connected to BOTH the mouse cursor AND screen edge with springs. Red dot moves independently. Click the canvas to cycle through edge anchor points.
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
          Spring Strength:
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={springStrength}
            onChange={(e) => setSpringStrength(Number(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
          <span style={{ minWidth: '3rem', textAlign: 'right' }}>{springStrength.toFixed(2)}</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Damping:
          <input
            type="range"
            min="0.90"
            max="0.99"
            step="0.01"
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
          <span style={{ minWidth: '3rem', textAlign: 'right' }}>{damping.toFixed(2)}</span>
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
          <li><strong>Multi-Spring Connection:</strong> Blue dot is connected to both mouse cursor AND screen edge simultaneously</li>
          <li><strong>Force Combination:</strong> Two spring forces pull the blue dot in different directions, creating complex motion</li>
          <li><strong>Edge Cycling:</strong> Click the canvas to change the edge anchor point (left, right, top, bottom)</li>
          <li><strong>Independent Movement:</strong> Red dot moves freely without spring constraints</li>
          <li><strong>Visual Distinction:</strong> Blue lines show mouse connection, purple lines show edge connection</li>
          <li><strong>Physics Integration:</strong> Compatible with gravity and friction for realistic dynamics</li>
        </ul>
      </div> 
    </div>
  );
}
