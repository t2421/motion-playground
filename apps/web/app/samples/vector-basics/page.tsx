'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CanvasUtil, Vector2 } from '@t2421/motion';

export default function VectorBasics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Animation state
    let animationId: number;
    const vectors = {
      a: new Vector2(100, 200),
      b: new Vector2(200, 100),
      result: new Vector2()
    };

    function animate() {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      CanvasUtil.drawGrid(canvas, { 
        interval: 10, 
        color: '#e9ecef', 
        lineWidth: 1 
      });

      // Calculate result vector
      vectors.result = vectors.a.add(vectors.b);

      // Draw vectors
      CanvasUtil.drawVector(ctx, new Vector2(0, 0), vectors.a, { 
        color: '#ff6b6b', 
        lineWidth: 3,
        label: 'Vector A',
        labelOffset: new Vector2(10, -15)
      });
      CanvasUtil.drawVector(ctx, vectors.a, vectors.b, { 
        color: '#4ecdc4', 
        lineWidth: 3,
        label: 'Vector B',
        labelOffset: new Vector2(15, 0)
      });
      CanvasUtil.drawVector(ctx, new Vector2(0, 0), vectors.result, { 
        color: '#45b7d1', 
        lineWidth: 2,
        label: 'Result (A + B)',
        labelOffset: new Vector2(10, -15)
      });

      // Update vectors for animation
      const time = Date.now() * 0.001;
      vectors.a.x = 100 + Math.sin(time) * 50;
      vectors.a.y = 200 + Math.cos(time * 0.7) * 30;
      vectors.b.x = 200 + Math.cos(time * 1.2) * 40;
      vectors.b.y = 100 + Math.sin(time * 0.8) * 35;

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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Vector Basics</h1>
        <p style={{ color: '#666' }}>
          Basic vector operations: addition, subtraction, and normalization
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
