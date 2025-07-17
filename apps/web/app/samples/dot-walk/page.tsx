"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CanvasUtil, Vector2, Dot, ParticleEmitter } from "@t2421/motion";

export default function DotWalk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    let animationId: number;

    const dot = new Dot({
      position: new Vector2(400, 250),
      velocity: Vector2.zero(),
      radius: 10,
      color: "#45b7d1",
      maxSpeed: 300,
      friction: 0.05,
    });

    let orientation = 0; // radians
    const rotationSpeed = Math.PI / 90; // per frame
    const thrust = 100;

    const emitter = new ParticleEmitter({
      position: dot.position.clone(),
      particleCount: 1000,
      emissionRate: 60,
      particleLifespan: 60,
      direction: Vector2.fromAngle(Math.PI),
      spread: Math.PI / 6,
      velocityRange: {
        min: Vector2.fromAngle(0, 30),
        max: Vector2.fromAngle(0, 80),
      },
      colors: ["#fbbf24", "#fde047"],
      sizeRange: { min: 2, max: 4 },
      friction: 0.02,
    });
    emitter.isActive = false;

    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
      ) {
        keys[e.code] = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
      ) {
        keys[e.code] = false;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function animate() {
      if (!canvas || !ctx) return;

      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      CanvasUtil.drawGrid(canvas, { interval: 20, color: "#e9ecef" });

      if (keys["ArrowLeft"]) orientation -= rotationSpeed;
      if (keys["ArrowRight"]) orientation += rotationSpeed;

      if (keys["ArrowUp"]) {
        const force = Vector2.fromAngle(orientation, thrust);
        dot.applyForce(force);
        emitter.isActive = true;
      } else {
        emitter.isActive = false;
      }

      if (keys["ArrowDown"]) {
        const force = Vector2.fromAngle(orientation + Math.PI, thrust);
        dot.applyForce(force);
      }

      dot.update();
      dot.bounceOffBounds(canvas.width, canvas.height, 0.9);

      emitter.setPosition(dot.position);
      emitter.setDirection(Vector2.fromAngle(orientation + Math.PI));
      emitter.update();
      emitter.draw(ctx);

      dot.draw(ctx);
      CanvasUtil.drawVector(
        ctx,
        dot.position,
        Vector2.fromAngle(orientation, 20),
        {
          color: "#e91e63",
          lineWidth: 2,
          label: "",
          arrowHeadLength: 6,
        },
      );

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ color: "#667eea", textDecoration: "none" }}>
          ← Back to Gallery
        </Link>
        <h1 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Dot Walk</h1>
        <p style={{ color: "#666" }}>
          Move the dot using the arrow keys. Particles emit from the opposite
          direction when thrusting forward.
        </p>
      </header>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
