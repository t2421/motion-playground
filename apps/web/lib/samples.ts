export interface Sample {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  path: string;
  category: 'vector' | 'shapes' | 'bezier' | 'utils';
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
    id: 'bouncing-ball',
    title: 'Bouncing Ball',
    description: 'Physics simulation with vector calculations',
    thumbnail: '/thumbnails/bouncing-ball.svg',
    path: '/samples/bouncing-ball',
    category: 'vector'
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
  }
];

export const categories = {
  vector: 'Vector Calculations',
  shapes: 'Geometric Shapes',
  bezier: 'Bezier & Easing',
  utils: 'Utility Functions'
} as const;
