import { Vector2 } from "../vector.js";

export interface GridOptions {
  interval?: number;
  color?: string;
  lineWidth?: number;
}

export interface VectorDrawOptions {
  color?: string;
  lineWidth?: number;
  arrowHeadLength?: number;
  label?: string;
  labelOffset?: Vector2;
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

    static drawVector(
        ctx: CanvasRenderingContext2D,
        start: Vector2,
        end: Vector2,
        options: VectorDrawOptions = {}
    ) {
        const { 
            color = '#333', 
            lineWidth = 3, 
            arrowHeadLength = 15, 
            label,
            labelOffset = new Vector2(10, -10)
        } = options;
        
        const endPos = start.add(end);
        
        // Draw line
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();

        // Draw arrow head
        const angle = Math.atan2(end.y, end.x);
        ctx.beginPath();
        ctx.moveTo(endPos.x, endPos.y);
        ctx.lineTo(
            endPos.x - arrowHeadLength * Math.cos(angle - Math.PI / 6),
            endPos.y - arrowHeadLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endPos.x, endPos.y);
        ctx.lineTo(
            endPos.x - arrowHeadLength * Math.cos(angle + Math.PI / 6),
            endPos.y - arrowHeadLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();

        // Draw label if provided
        if (label) {
            ctx.fillStyle = color;
            ctx.font = '14px Arial';
            const labelPos = endPos.add(labelOffset);
            ctx.fillText(label, labelPos.x, labelPos.y);
        }
    }
}