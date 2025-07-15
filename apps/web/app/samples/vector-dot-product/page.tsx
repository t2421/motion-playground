'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2 } from '@t2421/motion';

export default function VectorDotProduct() {
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
    const baseVector = new Vector2(150, 20);

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

      // Animate angle
      const time = Date.now() * 0.0008;
      const currentAngle = Math.sin(time) * Math.PI;

      // Create vectors
      const vectorA = new Vector2(baseVector.x, baseVector.y);
      const vectorB = new Vector2(
        Math.cos(currentAngle) * 120,
        Math.sin(currentAngle) * 120
      );

      // Calculate dot product and angle
      const dotProduct = vectorA.dot(vectorB);
      const angleRadians = vectorA.angleTo(vectorB);
      const angleDegrees = angleRadians * (180 / Math.PI);

      // Calculate projection of B onto A using the new method
      const projection = vectorB.projectOnto(vectorA);
      const rejection = vectorB.reject(vectorA);

      // Draw coordinate axes
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, center.y);
      ctx.lineTo(canvas.width, center.y);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(center.x, 0);
      ctx.lineTo(center.x, canvas.height);
      ctx.stroke();
      
      ctx.setLineDash([]);

      // Draw vectors from center
      CanvasUtil.drawVector(ctx, center, vectorA, {
        color: '#ff6b6b',
        lineWidth: 4,
        label: 'Vector A (fixed)',
        labelOffset: new Vector2(10, -20)
      });

      CanvasUtil.drawVector(ctx, center, vectorB, {
        color: '#4ecdc4',
        lineWidth: 4,
        label: 'Vector B (rotating)',
        labelOffset: new Vector2(10, 15)
      });

      // Draw projection
      if (projection.magnitude() > 0.1) {
        CanvasUtil.drawVector(ctx, center, projection, {
          color: '#ffa726',
          lineWidth: 3,
          label: 'Projection of B onto A',
          labelOffset: new Vector2(10, -35)
        });

        // Draw projection line (perpendicular from B to A)
        const projectionEnd = center.add(projection);
        const vectorBEnd = center.add(vectorB);
        
        ctx.strokeStyle = '#ffa726';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(vectorBEnd.x, vectorBEnd.y);
        ctx.lineTo(projectionEnd.x, projectionEnd.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw rejection (perpendicular component)
      if (rejection.magnitude() > 0.1) {
        const projectionEnd = center.add(projection);
        
        CanvasUtil.drawVector(ctx, projectionEnd, rejection, {
          color: '#e91e63',
          lineWidth: 3,
          label: 'Rejection (⊥ component)',
          labelOffset: new Vector2(10, 10)
        });

        // Draw right angle indicator at projection end
        const rightAngleSize = 15;
        const projNorm = projection.normalize();
        const rejNorm = rejection.normalize();
        
        if (projNorm.magnitude() > 0 && rejNorm.magnitude() > 0) {
          const corner1 = projectionEnd.add(projNorm.multiply(rightAngleSize));
          const corner2 = corner1.add(rejNorm.multiply(rightAngleSize));
          const corner3 = projectionEnd.add(rejNorm.multiply(rightAngleSize));
          
          ctx.strokeStyle = '#e91e63';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(corner1.x, corner1.y);
          ctx.lineTo(corner2.x, corner2.y);
          ctx.lineTo(corner3.x, corner3.y);
          ctx.stroke();
        }
      }

      // Draw angle arc between vectors A and B
      if (Math.abs(angleRadians) > 0.1) {
        const arcRadius = 50;
        
        // Get angles of both vectors
        const angleA = vectorA.angle();
        const angleB = vectorB.angle();
        
        // Determine start and end angles for the arc
        const startAngle = angleA;
        let endAngle = angleB;
        
        // Ensure we draw the shorter arc
        let angleDiff = endAngle - startAngle;
        if (angleDiff > Math.PI) {
          angleDiff -= 2 * Math.PI;
        } else if (angleDiff < -Math.PI) {
          angleDiff += 2 * Math.PI;
        }
        endAngle = startAngle + angleDiff;
        
        ctx.strokeStyle = '#9c27b0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center.x, center.y, arcRadius, startAngle, endAngle, angleDiff < 0);
        ctx.stroke();

        // Angle label at the middle of the arc
        const midAngle = startAngle + angleDiff / 2;
        const labelPos = new Vector2(
          center.x + Math.cos(midAngle) * (arcRadius + 15),
          center.y + Math.sin(midAngle) * (arcRadius + 15)
        );
        
        ctx.fillStyle = '#9c27b0';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${angleDegrees.toFixed(1)}°`, labelPos.x, labelPos.y);
      }

      // Information panel
      const panelX = 20;
      const panelY = 20;
      const panelWidth = 300;
      const panelHeight = 220;

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
      ctx.fillText('Vector Decomposition Analysis', panelX + 15, panelY + 25);

      ctx.font = '14px Arial';
      ctx.fillText(`Vector A: (${vectorA.x.toFixed(1)}, ${vectorA.y.toFixed(1)})`, panelX + 15, panelY + 50);
      ctx.fillText(`Vector B: (${vectorB.x.toFixed(1)}, ${vectorB.y.toFixed(1)})`, panelX + 15, panelY + 70);
      ctx.fillText(`Angle: ${angleDegrees.toFixed(1)}°`, panelX + 15, panelY + 90);
      
      // Projection info
      ctx.fillStyle = '#ffa726';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(`Projection: (${projection.x.toFixed(1)}, ${projection.y.toFixed(1)})`, panelX + 15, panelY + 115);
      ctx.font = '12px Arial';
      ctx.fillText(`Magnitude: ${projection.magnitude().toFixed(2)}`, panelX + 15, panelY + 130);
      
      // Rejection info
      ctx.fillStyle = '#e91e63';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(`Rejection: (${rejection.x.toFixed(1)}, ${rejection.y.toFixed(1)})`, panelX + 15, panelY + 150);
      ctx.font = '12px Arial';
      ctx.fillText(`Magnitude: ${rejection.magnitude().toFixed(2)}`, panelX + 15, panelY + 165);
      
      // Dot product
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = dotProduct >= 0 ? '#2e7d32' : '#d32f2f';
      ctx.fillText(`Dot Product: ${dotProduct.toFixed(2)}`, panelX + 15, panelY + 185);
      
      // Verification
      ctx.fillStyle = '#666';
      ctx.font = '11px Arial';
      const sumMagnitude = projection.add(rejection).magnitude();
      ctx.fillText(`Verification: |proj + rej| = ${sumMagnitude.toFixed(2)}`, panelX + 15, panelY + 205);

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
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Vector Projection & Rejection</h1>
        <p style={{ color: '#666' }}>
          Understanding vector decomposition: how any vector can be split into parallel and perpendicular components
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
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Vector Decomposition</h2>
        
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Any vector can be decomposed into two perpendicular components relative to another vector:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: '#ffa726' }}>Projection (Parallel Component)</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Component in the same direction as target vector</li>
              <li>Calculated using dot product</li>
              <li>Length = |B| × cos(θ)</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: '#e91e63' }}>Rejection (Perpendicular Component)</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Component perpendicular to target vector</li>
              <li>Rejection = Original - Projection</li>
              <li>Length = |B| × sin(θ)</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff3e0', 
          padding: '1rem', 
          borderRadius: '4px',
          border: '1px solid #ffcc02'
        }}>
          <strong>Key Formula:</strong> Vector B = Projection + Rejection (these components are always perpendicular)
        </div>
      </div>
    </div>
  );
}
