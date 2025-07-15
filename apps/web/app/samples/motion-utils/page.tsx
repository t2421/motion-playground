'use client';

import Link from 'next/link';
import { MotionUtil } from '@t2421/motion';

export default function MotionUtils() {
  const examples = [
    {
      title: 'Linear Interpolation (lerp)',
      code: 'MotionUtil.lerp(0, 100, 0.5)',
      result: MotionUtil.lerp(0, 100, 0.5),
      description: 'Interpolate between 0 and 100 at 50%'
    },
    {
      title: 'Clamp',
      code: 'MotionUtil.clamp(150, 0, 100)',
      result: MotionUtil.clamp(150, 0, 100),
      description: 'Constrain 150 to range [0, 100]'
    },
    {
      title: 'Map Range',
      code: 'MotionUtil.map(75, 0, 100, 0, 1)',
      result: MotionUtil.map(75, 0, 100, 0, 1),
      description: 'Map 75 from [0,100] to [0,1]'
    },
    {
      title: 'Degrees to Radians',
      code: 'MotionUtil.degToRad(180)',
      result: MotionUtil.degToRad(180),
      description: 'Convert 180 degrees to radians'
    },
    {
      title: 'Radians to Degrees',
      code: 'MotionUtil.radToDeg(Math.PI)',
      result: MotionUtil.radToDeg(Math.PI),
      description: 'Convert π radians to degrees'
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Motion Utils</h1>
        <p style={{ color: '#666' }}>
          Utility functions for common motion calculations
        </p>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {examples.map((example, index) => (
          <div 
            key={index}
            style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>{example.title}</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{example.description}</p>
            
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '1rem', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              marginBottom: '1rem'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Code:</div>
              <div style={{ color: '#333', fontWeight: 'bold' }}>{example.code}</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '1rem', 
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Result:</div>
              <div style={{ color: '#2d5a2d', fontWeight: 'bold' }}>{example.result}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        padding: '1.5rem', 
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h3 style={{ marginTop: 0, color: '#856404' }}>Interactive Example</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="lerpT" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Lerp t value (0 to 1):
          </label>
          <input 
            id="lerpT"
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            defaultValue="0.5"
            style={{ width: '100%' }}
            onChange={(e) => {
              const t = parseFloat(e.target.value);
              const result = MotionUtil.lerp(0, 100, t);
              const resultElement = document.getElementById('lerpResult');
              if (resultElement) {
                resultElement.textContent = result.toFixed(2);
              }
            }}
          />
        </div>
        <div>
          Result: <span id="lerpResult" style={{ fontWeight: 'bold' }}>50.00</span>
        </div>
      </div>
    </div>
  );
}
