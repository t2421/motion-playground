'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2 } from '@t2421/motion';

export default function VectorLerp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    
    // Control points for lerp demonstration
    const startPoint = new Vector2(150, 200);
    const endPoint = new Vector2(650, 300);
    
    // Multiple lerp examples
    const lerpExamples = [
      { t: 0.0, color: '#ff6b6b', label: 't=0.0 (start)' },
      { t: 0.25, color: '#ffa726', label: 't=0.25' },
      { t: 0.5, color: '#4ecdc4', label: 't=0.5 (middle)' },
      { t: 0.75, color: '#45b7d1', label: 't=0.75' },
      { t: 1.0, color: '#9c27b0', label: 't=1.0 (end)' }
    ];

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

      // Animate lerp with time
      const time = Date.now() * 0.001;
      const animatedT = (Math.sin(time) + 1) * 0.5; // Oscillate between 0 and 1
      
      // Update end point to make it more dynamic
      const animatedEndPoint = new Vector2(
        endPoint.x + Math.sin(time * 0.7) * 50,
        endPoint.y + Math.cos(time * 0.8) * 30
      );

      // Draw line between start and end points
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(animatedEndPoint.x, animatedEndPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw start and end points
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(animatedEndPoint.x, animatedEndPoint.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Labels for start and end
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Start', startPoint.x, startPoint.y - 15);
      ctx.fillText('End', animatedEndPoint.x, animatedEndPoint.y - 15);

      // Draw static lerp examples
      lerpExamples.forEach((example, index) => {
        const lerpPoint = startPoint.lerp(animatedEndPoint, example.t);
        
        // Draw lerp point
        ctx.fillStyle = example.color;
        ctx.beginPath();
        ctx.arc(lerpPoint.x, lerpPoint.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = example.color;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(
          example.label,
          20,
          120 + index * 20
        );
      });

      // Draw animated lerp point
      const animatedLerpPoint = startPoint.lerp(animatedEndPoint, animatedT);
      ctx.fillStyle = '#e91e63';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(animatedLerpPoint.x, animatedLerpPoint.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw animated t value
      ctx.fillStyle = '#e91e63';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Animated t = ${animatedT.toFixed(3)}`, 20, 50);

      // Draw vector from start to lerp point
      CanvasUtil.drawVector(ctx, startPoint, animatedLerpPoint.subtract(startPoint), {
        color: '#e91e63',
        lineWidth: 3,
        label: 'Lerp Vector',
        labelOffset: new Vector2(10, -15)
      });

      // Lerp in different contexts
      const time2 = time * 0.5;
      const t2 = (Math.sin(time2) + 1) * 0.5;
      
      // Color lerp demonstration
      const startColor = { r: 255, g: 107, b: 107 }; // #ff6b6b
      const endColor = { r: 76, g: 205, b: 196 };   // #4ecdc4
      
      const lerpedR = Math.round(startColor.r + (endColor.r - startColor.r) * t2);
      const lerpedG = Math.round(startColor.g + (endColor.g - startColor.g) * t2);
      const lerpedB = Math.round(startColor.b + (endColor.b - startColor.b) * t2);
      
      // Draw color lerp demonstration
      const colorRect = { x: 550, y: 100, width: 200, height: 30 };
      
      // Background
      ctx.fillStyle = '#fff';
      ctx.fillRect(colorRect.x - 5, colorRect.y - 5, colorRect.width + 10, colorRect.height + 40);
      ctx.strokeStyle = '#ddd';
      ctx.strokeRect(colorRect.x - 5, colorRect.y - 5, colorRect.width + 10, colorRect.height + 40);
      
      // Start color
      ctx.fillStyle = `rgb(${startColor.r}, ${startColor.g}, ${startColor.b})`;
      ctx.fillRect(colorRect.x, colorRect.y, 60, colorRect.height);
      
      // Lerped color
      ctx.fillStyle = `rgb(${lerpedR}, ${lerpedG}, ${lerpedB})`;
      ctx.fillRect(colorRect.x + 70, colorRect.y, 60, colorRect.height);
      
      // End color
      ctx.fillStyle = `rgb(${endColor.r}, ${endColor.g}, ${endColor.b})`;
      ctx.fillRect(colorRect.x + 140, colorRect.y, 60, colorRect.height);
      
      // Labels
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Start', colorRect.x + 30, colorRect.y + colorRect.height + 15);
      ctx.fillText(`t=${t2.toFixed(2)}`, colorRect.x + 100, colorRect.y + colorRect.height + 15);
      ctx.fillText('End', colorRect.x + 170, colorRect.y + colorRect.height + 15);

      // Information panel
      const panelX = 20;
      const panelY = 250;
      const panelWidth = 350;
      const panelHeight = 200;

      // Panel background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

      // Panel content
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Linear Interpolation (Lerp)', panelX + 15, panelY + 25);

      ctx.font = '14px Arial';
      ctx.fillText('Formula: start + (end - start) × t', panelX + 15, panelY + 50);
      ctx.fillText('Where t ∈ [0, 1]:', panelX + 15, panelY + 70);
      
      ctx.font = '12px Arial';
      ctx.fillText('• t = 0.0 → returns start point', panelX + 25, panelY + 90);
      ctx.fillText('• t = 0.5 → returns middle point', panelX + 25, panelY + 105);
      ctx.fillText('• t = 1.0 → returns end point', panelX + 25, panelY + 120);
      
      ctx.font = 'bold 13px Arial';
      ctx.fillStyle = '#e91e63';
      ctx.fillText(`Current position: (${animatedLerpPoint.x.toFixed(1)}, ${animatedLerpPoint.y.toFixed(1)})`, panelX + 15, panelY + 145);
      
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText('Pink dot smoothly animates between start and end', panelX + 15, panelY + 165);
      ctx.fillText('Color rectangle shows lerp applied to RGB values', panelX + 15, panelY + 180);

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Vector Linear Interpolation (Lerp)</h1>
        <p style={{ color: '#666' }}>
          Smooth transitions between two points using linear interpolation
        </p>
      </header>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <canvas 
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>What is Linear Interpolation?</h2>
        
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Linear interpolation (lerp) is a method for finding a point between two known points. 
          It&apos;s calculated as: <strong>result = start + (end - start) × t</strong>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: '#4ecdc4' }}>Mathematical Properties</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Linear function: constant rate of change</li>
              <li>Continuous: no jumps or gaps</li>
              <li>Bounded: result always between start and end</li>
              <li>Symmetric: lerp(a,b,t) + lerp(b,a,t) = a + b</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: '#ff6b6b' }}>Parameter t</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>t = 0: returns start point exactly</li>
              <li>t = 0.5: returns midpoint</li>
              <li>t = 1: returns end point exactly</li>
              <li>t can go beyond [0,1] for extrapolation</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff3e0', 
          padding: '1rem', 
          borderRadius: '4px',
          border: '1px solid #ffcc02'
        }}>
          <strong>Note:</strong> Lerp works on any data type that supports addition and scalar multiplication (vectors, colors, numbers, etc.)
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        padding: '2rem', 
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Practical Applications</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>🎮 Game Development</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Smooth character movement, camera transitions, object positioning, and UI animations.
            </p>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>🎨 Animation</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Tweening between keyframes, color transitions, size changes, and property animations.
            </p>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>📊 Data Visualization</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Smooth chart transitions, progress bars, loading animations, and value changes.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>🤖 AI & Robotics</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Path smoothing, trajectory planning, sensor fusion, and control system interpolation.
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f3e5f5', 
        padding: '2rem', 
        borderRadius: '8px',
        border: '1px solid #9c27b0',
        marginTop: '2rem'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Code Examples</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Vector Lerp</h3>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '12px',
              margin: 0
            }}>
{`const start = new Vector2(0, 0);
const end = new Vector2(100, 100);

// 25% of the way from start to end
const quarter = start.lerp(end, 0.25);
// Result: Vector2(25, 25)

// Animate between points
const t = (Math.sin(time) + 1) * 0.5;
const animated = start.lerp(end, t);`}
            </pre>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Color Lerp</h3>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '12px',
              margin: 0
            }}>
{`function lerpColor(start, end, t) {
  return {
    r: start.r + (end.r - start.r) * t,
    g: start.g + (end.g - start.g) * t,
    b: start.b + (end.b - start.b) * t
  };
}

const red = {r: 255, g: 0, b: 0};
const blue = {r: 0, g: 0, b: 255};
const purple = lerpColor(red, blue, 0.5);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
