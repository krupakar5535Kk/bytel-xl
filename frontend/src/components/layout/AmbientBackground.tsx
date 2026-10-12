import React, { useEffect, useRef } from 'react';

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Mouse interactive coordinates
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Orbital particles and nodes around a central core
    const orbitalRadii = [120, 220, 340, 480];
    const nodes = [
      { radiusIndex: 0, angle: 0, speed: 0.004, size: 4, color: '#00e5ff' },
      { radiusIndex: 0, angle: Math.PI, speed: 0.004, size: 3, color: '#38bdf8' },
      { radiusIndex: 1, angle: Math.PI / 4, speed: -0.003, size: 5, color: '#06b6d4' },
      { radiusIndex: 1, angle: (5 * Math.PI) / 4, speed: -0.003, size: 4, color: '#8b5cf6' },
      { radiusIndex: 2, angle: Math.PI / 2, speed: 0.002, size: 5, color: '#00e5ff' },
      { radiusIndex: 2, angle: (3 * Math.PI) / 2, speed: 0.002, size: 4, color: '#a855f7' },
      { radiusIndex: 3, angle: (2 * Math.PI) / 3, speed: -0.0015, size: 6, color: '#38bdf8' },
      { radiusIndex: 3, angle: (5 * Math.PI) / 3, speed: -0.0015, size: 4, color: '#00e5ff' },
    ];

    // Background floating data particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.4 ? 190 : 265, // cyan/blue or violet
    }));

    let pulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Core center position with subtle mouse parallax
      const centerX = width / 2 + (mouseX - width / 2) * 0.03;
      const centerY = height / 2 + (mouseY - height / 2) * 0.03;

      // 1. Draw subtle background particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
        ctx.fill();
      }

      // 2. Draw curved orbital tracks
      pulse += 0.02;
      const corePulse = 1 + Math.sin(pulse) * 0.06;

      for (let i = 0; i < orbitalRadii.length; i++) {
        const r = orbitalRadii[i];
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, r * 1.1, r * 0.65, 0.1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.05 + i * 0.015})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Draw central luminous Intelligence Core
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 110 * corePulse);
      coreGrad.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
      coreGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.18)');
      coreGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.06)');
      coreGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 110 * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Core center spark
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10 * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Update and draw orbital nodes with signal connection lines
      const computedNodes: { x: number; y: number; color: string; size: number }[] = [];

      for (const node of nodes) {
        node.angle += node.speed;
        const r = orbitalRadii[node.radiusIndex];
        const nx = centerX + Math.cos(node.angle) * (r * 1.1);
        const ny = centerY + Math.sin(node.angle) * (r * 0.65);
        computedNodes.push({ x: nx, y: ny, color: node.color, size: node.size });

        // Node glow
        ctx.beginPath();
        ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. Flowing signal lines between nodes
      for (let i = 0; i < computedNodes.length; i++) {
        for (let j = i + 1; j < computedNodes.length; j++) {
          const dx = computedNodes[i].x - computedNodes[j].x;
          const dy = computedNodes[i].y - computedNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(computedNodes[i].x, computedNodes[i].y);
            ctx.lineTo(computedNodes[j].x, computedNodes[j].y);
            const lineAlpha = (1 - dist / 180) * 0.22;
            ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      {/* Dark overlay grid for futuristic aesthetic */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Top subtle vignette glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-wildfire-blue/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-wildfire-violet/10 blur-[140px] rounded-full pointer-events-none" />
    </div>
  );
};
