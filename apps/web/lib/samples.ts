export interface Sample {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  path: string;
  category: 'vector' | 'shapes' | 'bezier' | 'utils' | 'physics';
}

export const samples: Sample[] = [
  {
    id: 'vector-basics',
    title: 'Vector Basics',
    description: 'Basic vector operations: add, subtract, normalize',
    thumbnail: '/thumbnails/vector-basics.svg',
    path: '/samples/vector-basics',
    category: 'vector'
  },
  {
    id: 'dot-basic',
    title: 'Dot Physics',
    description: 'Interactive dots with position, velocity, and acceleration',
    thumbnail: '/thumbnails/dot-basic.svg',
    path: '/samples/dot-basic',
    category: 'physics'
  },
  {
    id: 'dot-repulsive',
    title: 'Dot Repulsive Force',
    description: 'Dots flee from the mouse cursor using repulsive forces',
    thumbnail: '/thumbnails/dot-repulsive.svg',
    path: '/samples/dot-repulsive',
    category: 'physics'
  },
  {
    id: 'dot-wind',
    title: 'Dot Wind Force',
    description: 'Dots affected by wind forces',
    thumbnail: '/thumbnails/dot-wind.svg',
    path: '/samples/dot-wind',
    category: 'physics'
  },
  {
    id: 'animated-shapes',
    title: 'Animated Shapes',
    description: 'Circle, Rectangle, Triangle animations',
    thumbnail: '/thumbnails/animated-shapes.svg',
    path: '/samples/animated-shapes',
    category: 'shapes'
  },
  {
    id: 'bezier-curves',
    title: 'Bezier Curves',
    description: 'Interactive bezier curve visualization',
    thumbnail: '/thumbnails/bezier-curves.svg',
    path: '/samples/bezier-curves',
    category: 'bezier'
  },
  {
    id: 'easing-functions',
    title: 'Easing Functions',
    description: 'Compare different easing functions',
    thumbnail: '/thumbnails/easing-functions.svg',
    path: '/samples/easing-functions',
    category: 'bezier'
  },
  {
    id: 'motion-utils',
    title: 'Motion Utils',
    description: 'Utility functions: lerp, clamp, map',
    thumbnail: '/thumbnails/motion-utils.svg',
    path: '/samples/motion-utils',
    category: 'utils'
  },
  {
    id: 'vector-dot-product',
    title: 'Vector Dot Product',
    description: 'Interactive dot product visualization and projection',
    thumbnail: '/thumbnails/vector-dot-product.svg',
    path: '/samples/vector-dot-product',
    category: 'vector'
  },
  {
    id: 'vector-cross-product',
    title: 'Vector Cross Product',
    description: 'Cross product, area calculation, and rotation direction',
    thumbnail: '/thumbnails/vector-cross-product.svg',
    path: '/samples/vector-cross-product',
    category: 'vector'
  },
  {
    id: 'vector-lerp',
    title: 'Vector Lerp',
    description: 'Linear interpolation between vectors for smooth animations',
    thumbnail: '/thumbnails/vector-lerp.svg',
    path: '/samples/vector-lerp',
    category: 'vector'
  },
  {
    id: 'vector-reflect',
    title: 'Vector Reflection',
    description: 'Vector reflection across surfaces and collision response',
    thumbnail: '/thumbnails/vector-reflect.svg',
    path: '/samples/vector-reflect',
    category: 'vector'
  }
];

export const categories = {
  vector: 'Vector Calculations',
  physics: 'Physics & Particles',
  shapes: 'Geometric Shapes',
  bezier: 'Bezier & Easing',
  utils: 'Utility Functions'
} as const;
