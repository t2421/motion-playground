'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2 } from '@t2421/motion';

export default function VectorReflect() {
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
    const center = new Vector2(400, 250);
    
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

      // Animate the incident vector
      const time = Date.now() * 0.001;
      const incidentVector = Vector2.fromAngle(Math.sin(time * 0.7) * Math.PI * 0.7, 120);
      
      // Define surface normals for different scenarios
      const surfaces = [
        {
          position: new Vector2(200, 150),
          normal: Vector2.up(),
          label: 'Horizontal Surface',
          color: '#ff6b6b'
        },
        {
          position: new Vector2(600, 150),
          normal: Vector2.fromAngle(Math.PI * 0.25),
          label: '45° Surface',
          color: '#4ecdc4'
        },
        {
          position: new Vector2(200, 350),
          normal: Vector2.fromAngle(Math.sin(time * 0.5) * Math.PI * 0.3),
          label: 'Rotating Surface',
          color: '#45b7d1'
        },
        {
          position: new Vector2(600, 350),
          normal: Vector2.right(),
          label: 'Vertical Surface',
          color: '#ffa726'
        }
      ];

      surfaces.forEach(surface => {
        // Calculate reflected vector
        const reflected = incidentVector.reflect(surface.normal);
        
        // Draw surface (represented as a line perpendicular to normal)
        const surfaceLength = 80;
        const surfaceDir = surface.normal.perpendicular();
        const surfaceStart = surface.position.subtract(surfaceDir.multiply(surfaceLength / 2));
        const surfaceEnd = surface.position.add(surfaceDir.multiply(surfaceLength / 2));
        
        ctx.strokeStyle = surface.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(surfaceStart.x, surfaceStart.y);
        ctx.lineTo(surfaceEnd.x, surfaceEnd.y);
        ctx.stroke();
        
        // Draw surface normal
        CanvasUtil.drawVector(ctx, surface.position, surface.normal.multiply(60), {
          color: surface.color,
          lineWidth: 2,
          label: 'Normal',
          labelOffset: new Vector2(10, -10)
        });
        
        // Draw incident vector
        const incidentStart = surface.position.subtract(incidentVector.multiply(0.8));
        CanvasUtil.drawVector(ctx, incidentStart, incidentVector.multiply(0.8), {
          color: '#333',
          lineWidth: 3,
          label: 'Incident',
          labelOffset: new Vector2(-60, -10)
        });
        
        // Draw reflected vector
        CanvasUtil.drawVector(ctx, surface.position, reflected.multiply(0.8), {
          color: '#e91e63',
          lineWidth: 3,
          label: 'Reflected',
          labelOffset: new Vector2(10, -10)
        });
        
        // Draw surface label
        ctx.fillStyle = surface.color;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(surface.label, surface.position.x, surface.position.y + 90);
        
        // Draw angle indicators
        const incidentAngle = Math.abs(incidentVector.negate().angleTo(surface.normal));
        const reflectedAngle = Math.abs(reflected.angleTo(surface.normal));
        
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.fillText(
          `θᵢ = ${(incidentAngle * 180 / Math.PI).toFixed(1)}°`,
          surface.position.x - 40,
          surface.position.y + 105
        );
        ctx.fillText(
          `θᵣ = ${(reflectedAngle * 180 / Math.PI).toFixed(1)}°`,
          surface.position.x + 40,
          surface.position.y + 105
        );
      });

      // Central demonstration with detailed angles
      const centralSurface = {
        position: center,
        normal: Vector2.fromAngle(Math.sin(time * 0.3) * Math.PI * 0.4),
        color: '#9c27b0'
      };
      
      const centralIncident = Vector2.fromAngle(Math.PI * 0.75 + Math.sin(time * 0.8) * 0.5, 100);
      const centralReflected = centralIncident.reflect(centralSurface.normal);
      
      // Draw central surface
      const centralSurfaceDir = centralSurface.normal.perpendicular();
      const centralStart = center.subtract(centralSurfaceDir.multiply(60));
      const centralEnd = center.add(centralSurfaceDir.multiply(60));
      
      ctx.strokeStyle = centralSurface.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(centralStart.x, centralStart.y);
      ctx.lineTo(centralEnd.x, centralEnd.y);
      ctx.stroke();
      
      // Draw central vectors
      CanvasUtil.drawVector(ctx, center, centralSurface.normal.multiply(80), {
        color: centralSurface.color,
        lineWidth: 3
      });
      
      const centralIncidentStart = center.subtract(centralIncident.multiply(0.7));
      CanvasUtil.drawVector(ctx, centralIncidentStart, centralIncident.multiply(0.7), {
        color: '#333',
        lineWidth: 4
      });
      
      CanvasUtil.drawVector(ctx, center, centralReflected.multiply(0.7), {
        color: '#e91e63',
        lineWidth: 4
      });
      
      // Draw angle arcs for central demonstration
      const incidentAngle = centralIncident.negate().angleTo(centralSurface.normal);
      const reflectedAngle = centralReflected.angleTo(centralSurface.normal);
      
      // Incident angle arc
      if (Math.abs(incidentAngle) > 0.1) {
        const arcRadius = 40;
        const startAngle = centralSurface.normal.angle();
        const endAngle = centralIncident.negate().angle();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center.x, center.y, arcRadius, startAngle, endAngle, false);
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        ctx.fillText(
          `θᵢ=${(Math.abs(incidentAngle) * 180 / Math.PI).toFixed(1)}°`,
          center.x + Math.cos(midAngle) * (arcRadius + 20),
          center.y + Math.sin(midAngle) * (arcRadius + 20)
        );
      }
      
      // Reflected angle arc
      if (Math.abs(reflectedAngle) > 0.1) {
        const arcRadius = 50;
        const startAngle = centralSurface.normal.angle();
        const endAngle = centralReflected.angle();
        
        ctx.strokeStyle = '#e91e63';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center.x, center.y, arcRadius, startAngle, endAngle, false);
        ctx.stroke();
        
        ctx.fillStyle = '#e91e63';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        ctx.fillText(
          `θᵣ=${(Math.abs(reflectedAngle) * 180 / Math.PI).toFixed(1)}°`,
          center.x + Math.cos(midAngle) * (arcRadius + 20),
          center.y + Math.sin(midAngle) * (arcRadius + 20)
        );
      }

      // Information panel
      const panelX = 20;
      const panelY = 20;
      const panelWidth = 250;
      const panelHeight = 100;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Vector Reflection', panelX + 15, panelY + 25);

      ctx.font = '12px Arial';
      ctx.fillText('Law of Reflection: θᵢ = θᵣ', panelX + 15, panelY + 45);
      ctx.fillText('• Incident angle = Reflected angle', panelX + 15, panelY + 60);
      ctx.fillText('• Measured from surface normal', panelX + 15, panelY + 75);

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
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Vector Reflection</h1>
        <p style={{ color: '#666' }}>
          Understanding vector reflection across surfaces with different orientations
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
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>What is Vector Reflection?</h2>
        
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Vector reflection calculates how a vector bounces off a surface. The formula is:
          <strong> reflected = incident - 2 × (incident · normal) × normal</strong>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: '#e91e63' }}>Law of Reflection</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Incident angle equals reflected angle</li>
              <li>Both angles measured from surface normal</li>
              <li>Incident, reflected, and normal are coplanar</li>
              <li>Energy is conserved (in ideal reflection)</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: '#9c27b0' }}>Surface Normal</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Vector perpendicular to surface</li>
              <li>Must be unit length (normalized)</li>
              <li>Direction determines &quot;outside&quot; of surface</li>
              <li>Critical for accurate reflection calculation</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff3e0', 
          padding: '1rem', 
          borderRadius: '4px',
          border: '1px solid #ffcc02'
        }}>
          <strong>Key Insight:</strong> The reflection formula works for any incident vector and any surface normal in 2D or 3D space.
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
            <h3 style={{ marginBottom: '0.5rem' }}>🎮 Game Physics</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Ball bouncing, projectile ricochets, vehicle collisions with walls and barriers.
            </p>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>💡 Ray Tracing</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Light reflection off surfaces, mirror effects, and realistic rendering calculations.
            </p>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>🤖 Robotics</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Sensor reflection modeling, path planning around obstacles, collision avoidance.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>🌊 Physics Simulation</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
              Wave reflection, sound echoes, electromagnetic wave propagation.
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
            <h3 style={{ marginBottom: '0.5rem' }}>Basic Reflection</h3>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '12px',
              margin: 0
            }}>
{`// Ball bouncing off horizontal surface
const velocity = new Vector2(5, -3);
const wallNormal = Vector2.up(); // (0, -1)

const reflected = velocity.reflect(wallNormal);
// Result: Vector2(5, 3) - bounces up

// Ball bouncing off 45° surface
const diagonal = Vector2.fromAngle(Math.PI/4);
const bounced = velocity.reflect(diagonal);`}
            </pre>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Collision Response</h3>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '12px',
              margin: 0
            }}>
{`function handleWallCollision(ball, wall) {
  // Check if collision occurred
  if (ballCollidesWithWall(ball, wall)) {
    // Get wall normal
    const normal = wall.getNormal();
    
    // Reflect velocity
    ball.velocity = ball.velocity.reflect(normal);
    
    // Apply energy loss (optional)
    ball.velocity = ball.velocity.multiply(0.9);
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
