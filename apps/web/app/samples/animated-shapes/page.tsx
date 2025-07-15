import Link from 'next/link';

export default function AnimatedShapes() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Animated Shapes</h1>
        <p style={{ color: '#666' }}>Circle, Rectangle, Triangle animations</p>
      </header>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '3rem', 
        borderRadius: '8px',
        textAlign: 'center',
        border: '2px dashed #ddd'
      }}>
        <h2 style={{ color: '#666', marginBottom: '1rem' }}>Coming Soon</h2>
        <p style={{ color: '#999' }}>
          This sample is under development. Check back later for the interactive demo!
        </p>
      </div>
    </div>
  );
}
