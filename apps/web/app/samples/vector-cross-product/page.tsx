'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2 } from '@t2421/motion';

export default function VectorCrossProduct() {
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
    const baseVector = new Vector2(150, 150);

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
      const time = Date.now() * 0.001;
      const currentAngle = Math.sin(time * 0.8) * Math.PI;

      // Create vectors
      const vectorA = new Vector2(baseVector.x, baseVector.y);
      const vectorB = new Vector2(
        Math.cos(currentAngle) * 100,
        Math.sin(currentAngle) * 100
      );

      // Calculate cross product and angle
      const crossProduct = vectorA.cross(vectorB);
      const angleRadians = vectorA.angleTo(vectorB);
      const angleDegrees = angleRadians * (180 / Math.PI);

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
        label: 'Vector A',
        labelOffset: new Vector2(10, -20)
      });

      CanvasUtil.drawVector(ctx, center, vectorB, {
        color: '#4ecdc4',
        lineWidth: 4,
        label: 'Vector B',
        labelOffset: new Vector2(10, 15)
      });

      // Draw parallelogram formed by vectors
      if (Math.abs(crossProduct) > 1) {
        const vectorAEnd = center.add(vectorA);
        const vectorBEnd = center.add(vectorB);
        const parallelogramEnd = vectorAEnd.add(vectorB);

        ctx.strokeStyle = '#9c27b0';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        
        // Draw parallelogram
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(vectorAEnd.x, vectorAEnd.y);
        ctx.lineTo(parallelogramEnd.x, parallelogramEnd.y);
        ctx.lineTo(vectorBEnd.x, vectorBEnd.y);
        ctx.closePath();
        ctx.stroke();

        // Fill parallelogram with transparency
        ctx.fillStyle = crossProduct >= 0 ? 'rgba(156, 39, 176, 0.1)' : 'rgba(244, 67, 54, 0.1)';
        ctx.fill();
        
        ctx.setLineDash([]);

        // Draw area text
        const centerOfParallelogram = new Vector2(
          center.x + (vectorA.x + vectorB.x) / 2,
          center.y + (vectorA.y + vectorB.y) / 2
        );
        
        ctx.fillStyle = '#9c27b0';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Area: ${Math.abs(crossProduct).toFixed(1)}`,
          centerOfParallelogram.x,
          centerOfParallelogram.y
        );
      }

      // Draw angle arc
      if (Math.abs(angleRadians) > 0.1) {
        const arcRadius = 60;
        
        // Get angles of both vectors
        const angleA = vectorA.angle();
        const angleB = vectorB.angle();
        
        // Determine start and end angles for the arc
        let startAngle = angleA;
        let endAngle = angleB;
        
        // Ensure we draw the shorter arc
        let angleDiff = endAngle - startAngle;
        if (angleDiff > Math.PI) {
          angleDiff -= 2 * Math.PI;
        } else if (angleDiff < -Math.PI) {
          angleDiff += 2 * Math.PI;
        }
        endAngle = startAngle + angleDiff;
        
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(center.x, center.y, arcRadius, startAngle, endAngle, angleDiff < 0);
        ctx.stroke();

        // Angle label at the middle of the arc
        const midAngle = startAngle + angleDiff / 2;
        const labelPos = new Vector2(
          center.x + Math.cos(midAngle) * (arcRadius + 25),
          center.y + Math.sin(midAngle) * (arcRadius + 25)
        );
        
        ctx.fillStyle = '#ff9800';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${angleDegrees.toFixed(1)}°`, labelPos.x, labelPos.y);
      }

      // Draw rotation indicator
      const rotationIndicator = crossProduct >= 0 ? '↻' : '↺';
      const rotationColor = crossProduct >= 0 ? '#2e7d32' : '#d32f2f';
      
      ctx.fillStyle = rotationColor;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        rotationIndicator,
        center.x + 180,
        center.y - 120
      );
      
      ctx.font = '12px Arial';
      ctx.fillText(
        crossProduct >= 0 ? 'Counter-clockwise' : 'Clockwise',
        center.x + 180,
        center.y - 100
      );

      // Information panel
      const panelX = 20;
      const panelY = 20;
      const panelWidth = 300;
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
      ctx.fillText('Cross Product Analysis', panelX + 15, panelY + 25);

      ctx.font = '14px Arial';
      ctx.fillText(`Vector A: (${vectorA.x.toFixed(1)}, ${vectorA.y.toFixed(1)})`, panelX + 15, panelY + 50);
      ctx.fillText(`Vector B: (${vectorB.x.toFixed(1)}, ${vectorB.y.toFixed(1)})`, panelX + 15, panelY + 70);
      ctx.fillText(`Angle: ${angleDegrees.toFixed(1)}°`, panelX + 15, panelY + 90);
      
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = crossProduct >= 0 ? '#2e7d32' : '#d32f2f';
      ctx.fillText(`Cross Product: ${crossProduct.toFixed(2)}`, panelX + 15, panelY + 115);
      
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      const interpretation = crossProduct > 0 ? 'B is counter-clockwise from A' :
                           crossProduct < 0 ? 'B is clockwise from A' :
                           'Vectors are parallel';
      ctx.fillText(interpretation, panelX + 15, panelY + 135);
      
      ctx.fillText(`Parallelogram Area: ${Math.abs(crossProduct).toFixed(2)}`, panelX + 15, panelY + 155);

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
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Vector Cross Product</h1>
        <p style={{ color: '#666' }}>
          Understanding the cross product: how it relates to area, rotation, and perpendicularity
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
