import React, { useEffect, useState, useRef } from 'react';

export const InteractiveAura: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible]);

  // Floating background luxury micro-particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definition
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '#C5A477' : '#B77D83',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Floating Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10 opacity-60"
      />

      {/* Interactive Radial Aura Glow that follows cursor */}
      <div
        className="fixed pointer-events-none z-0 rounded-full transition-opacity duration-700 ease-out will-change-transform"
        style={{
          width: 500,
          height: 500,
          left: mousePos.x - 250,
          top: mousePos.y - 250,
          opacity: isVisible ? 0.35 : 0,
          background: 'radial-gradient(circle, rgba(197, 164, 119, 0.18) 0%, rgba(183, 125, 131, 0.12) 40%, rgba(245, 231, 229, 0) 70%)',
          filter: 'blur(30px)',
        }}
      />
    </>
  );
};
