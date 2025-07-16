/**
 * Perlin Noise implementation for smooth, natural-looking random values
 */
export class PerlinNoise {
  private permutation: number[];
  private p: number[];

  constructor(seed?: number) {
    // Default permutation table
    const defaultPermutation = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
      8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117,
      35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
      134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41,
      55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89,
      18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226,
      250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
      189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
      172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97,
      228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239,
      107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
      138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];

    this.permutation = [...defaultPermutation];
    
    // If seed is provided, shuffle the permutation table
    if (seed !== undefined) {
      this.shuffle(seed);
    }

    // Duplicate the permutation table
    this.p = [...this.permutation, ...this.permutation];
  }

  private shuffle(seed: number): void {
    // Simple PRNG for deterministic shuffling
    let rng = seed;
    const random = () => {
      rng = (rng * 1664525 + 1013904223) % 4294967296;
      return rng / 4294967296;
    };

    for (let i = this.permutation.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const temp = this.permutation[i]!;
      this.permutation[i] = this.permutation[j]!;
      this.permutation[j] = temp;
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * Generate 2D Perlin noise value at given coordinates
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Noise value between -1 and 1
   */
  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.p[X]! + Y;
    const AA = this.p[A]!;
    const AB = this.p[A + 1]!;
    const B = this.p[X + 1]! + Y;
    const BA = this.p[B]!;
    const BB = this.p[B + 1]!;
    
    return this.lerp(
      this.lerp(
        this.grad(this.p[AA]!, x, y),
        this.grad(this.p[BA]!, x - 1, y),
        u
      ),
      this.lerp(
        this.grad(this.p[AB]!, x, y - 1),
        this.grad(this.p[BB]!, x - 1, y - 1),
        u
      ),
      v
    );
  }

  /**
   * Generate octave noise (multiple layers of noise)
   * @param x X coordinate
   * @param y Y coordinate
   * @param octaves Number of octaves
   * @param persistence Amplitude multiplier for each octave
   * @param scale Base scale for the noise
   * @returns Noise value
   */
  octaveNoise2D(
    x: number, 
    y: number, 
    octaves: number = 4, 
    persistence: number = 0.5, 
    scale: number = 0.01
  ): number {
    let value = 0;
    let amplitude = 1;
    let frequency = scale;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return value / maxValue;
  }
}

// Global instance for convenience
export const perlinNoise = new PerlinNoise();
