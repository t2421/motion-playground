'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Camera2D, CanvasUtil, Vector2 } from '@t2421/motion';

export default function CameraBasics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    const camera = new Camera2D(new Vector2(0, 0), 1, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      const moveAmount = 20;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          camera.move(Vector2.up().multiply(moveAmount));
          break;
        case 'ArrowDown':
        case 's':
          camera.move(Vector2.down().multiply(moveAmount));
          break;
        case 'ArrowLeft':
        case 'a':
          camera.move(Vector2.left().multiply(moveAmount));
          break;
        case 'ArrowRight':
        case 'd':
          camera.move(Vector2.right().multiply(moveAmount));
          break;
        case '+':
          camera.zoomBy(1.1);
          break;
        case '-':
          camera.zoomBy(0.9);
          break;
        case 'q':
          camera.rotate(-0.1);
          break;
        case 'e':
          camera.rotate(0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const worldDots: Vector2[] = [
      new Vector2(100, 100),
      new Vector2(300, 100),
      new Vector2(100, 300),
      new Vector2(300, 300)
    ];

    let animationId: number;
    const render = () => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      CanvasUtil.drawGrid(canvas, { interval: 20, color: '#e9ecef', lineWidth: 1 });

      ctx.save();
      camera.applyTransform(ctx);

      worldDots.forEach(pos => {
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Camera 2D</h1>
        <p style={{ color: '#666' }}>
          Use WASD or arrow keys to move, +/- to zoom, Q/E to rotate
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
