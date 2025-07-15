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
      const scalarProjection = vectorB.scalarProjection(vectorA);

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
      const panelWidth = 280;
      const panelHeight = 180;

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
      ctx.fillText('Dot Product Analysis', panelX + 15, panelY + 25);

      ctx.font = '14px Arial';
      ctx.fillText(`Vector A: (${vectorA.x.toFixed(1)}, ${vectorA.y.toFixed(1)})`, panelX + 15, panelY + 50);
      ctx.fillText(`Vector B: (${vectorB.x.toFixed(1)}, ${vectorB.y.toFixed(1)})`, panelX + 15, panelY + 70);
      ctx.fillText(`Angle: ${angleDegrees.toFixed(1)}°`, panelX + 15, panelY + 90);
      ctx.fillText(`Scalar Projection: ${scalarProjection.toFixed(2)}`, panelX + 15, panelY + 110);
      
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = dotProduct >= 0 ? '#2e7d32' : '#d32f2f';
      ctx.fillText(`Dot Product: ${dotProduct.toFixed(2)}`, panelX + 15, panelY + 130);
      
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      const interpretation = dotProduct > 0 ? 'Vectors point in similar directions' :
                           dotProduct < 0 ? 'Vectors point in opposite directions' :
                           'Vectors are perpendicular';
      ctx.fillText(interpretation, panelX + 15, panelY + 155);

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
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Vector Dot Product</h1>
        <p style={{ color: '#666' }}>
          Understanding the dot product: how it relates to vector projection and the angle between vectors
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
    </div>
  );
}
