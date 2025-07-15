export interface GridOptions {
  interval?: number;
  color?: string;
  lineWidth?: number;
}

export class CanvasUtil {
    static drawGrid(
        canvas: HTMLCanvasElement, 
        options: GridOptions = {}
    ) {
        const { interval = 20, color = '#e9ecef', lineWidth = 1 } = options;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');
        
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth; 
      for (let x = 0; x < canvas.width; x += interval) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += interval) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
        }
}