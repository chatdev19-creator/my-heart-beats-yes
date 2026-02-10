import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: "confetti" | "heart";
  life: number;
}

interface ConfettiCanvasProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

const COLORS = [
  "#FF2D55", "#FF6B8A", "#FF9EB5", "#FFD1DC",
  "#FF4081", "#E91E63", "#F8BBD0", "#FFB6C1",
  "#FF69B4", "#DC143C", "#FFD700", "#FFF0F5",
];

const ConfettiCanvas = ({ active, duration = 4000, onComplete }: ConfettiCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const createParticle = useCallback((w: number, h: number): Particle => {
    const isHeart = Math.random() > 0.6;
    return {
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: isHeart ? Math.random() * 12 + 8 : Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      type: isHeart ? "heart" : "confetti",
      life: 1,
    };
  }, []);

  const drawHeart = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    const s = size / 2;
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.1);
    ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s * 1.2);
    ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
    ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
    ctx.fill();
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Adaptive particle count based on device capability
    const cores = navigator.hardwareConcurrency || 2;
    const maxParticles = Math.min(cores * 25, 150);

    particlesRef.current = [];
    startTimeRef.current = Date.now();

    // Spawn particles in bursts
    const spawnBurst = () => {
      const count = Math.min(maxParticles - particlesRef.current.length, 20);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(canvas.width, canvas.height));
      }
    };

    spawnBurst();
    const spawnInterval = setInterval(spawnBurst, 300);

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fadeOut = elapsed > duration - 1000 ? Math.max(0, (duration - elapsed) / 1000) : 1;

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.rotation += p.rotationSpeed;
        p.opacity = fadeOut * p.life;

        if (p.y > canvas.height + 50) return false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === "heart") {
          ctx.fillStyle = p.color;
          drawHeart(ctx, 0, 0, p.size);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
        return true;
      });

      if (elapsed < duration) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearInterval(spawnInterval);
        onComplete?.();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(spawnInterval);
    };
  }, [active, duration, onComplete, createParticle, drawHeart]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ConfettiCanvas;
