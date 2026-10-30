import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  glowColor: string;
  isDiamond: boolean;
  alpha: number;
  alphaSpeed: number;
  alphaDirection: number;
}

interface PulseWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const HeroParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Brand color palette
    const colors = [
      { fill: '#c81e32', glow: 'rgba(200, 30, 50, 0.45)', isDiamond: true },
      { fill: '#ff3852', glow: 'rgba(255, 56, 82, 0.4)', isDiamond: false },
      { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.3)', isDiamond: false },
      { fill: '#e11d48', glow: 'rgba(225, 29, 72, 0.4)', isDiamond: true },
      { fill: '#fda4af', glow: 'rgba(253, 164, 175, 0.3)', isDiamond: false },
    ];

    let particles: Particle[] = [];
    const pulseWaves: PulseWave[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
      active: false,
    };

    const updateDimensions = (newWidth: number, newHeight: number) => {
      if (!canvas || !ctx || newWidth <= 0 || newHeight <= 0) return;
      width = Math.floor(newWidth);
      height = Math.floor(newHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Calculate particle density based on screen size (approx 1 particle per 15,000 sq pixels, bounded 35-75)
      const count = Math.min(75, Math.max(35, Math.floor((width * height) / 16000)));

      for (let i = 0; i < count; i++) {
        const colorConfig = colors[Math.floor(Math.random() * colors.length)];
        const baseRadius = Math.random() * 2 + 1.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          baseRadius,
          radius: baseRadius,
          color: colorConfig.fill,
          glowColor: colorConfig.glow,
          isDiamond: colorConfig.isDiamond,
          alpha: Math.random() * 0.5 + 0.3,
          alphaSpeed: Math.random() * 0.01 + 0.005,
          alphaDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    // Zero-reflow mouse tracking: use e.offsetX / e.offsetY directly without getBoundingClientRect
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const onClick = (e: MouseEvent) => {
      const clickX = e.offsetX;
      const clickY = e.offsetY;

      // Create shockwave pulse
      pulseWaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: 180,
        alpha: 0.8,
      });

      // Push particles outwards with impulse
      for (const p of particles) {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180;
          p.vx += (dx / dist) * force * 3;
          p.vy += (dy / dist) * force * 3;
        }
      }
    };

    // Handle visibility to save resources
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Initial sizing and continuous tracking via ResizeObserver contentRect (no layout reflow)
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width: w, height: h } = entry.contentRect;
        updateDimensions(w, h);
      }
    });
    resizeObserver.observe(container);

    // Attach mouse listeners with passive performance
    container.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave, { passive: true });
    container.addEventListener('click', onClick);


    // Render loop
    const maxLineDist = 110;
    const maxLineDistSq = maxLineDist * maxLineDist;
    const mouseRadiusSq = mouse.radius * mouse.radius;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Shockwave pulses
      for (let i = pulseWaves.length - 1; i >= 0; i--) {
        const wave = pulseWaves[i];
        wave.radius += 3.5;
        wave.alpha -= 0.018;

        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius) {
          pulseWaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 30, 50, ${wave.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff3852';
        ctx.stroke();
        ctx.restore();
      }

      // 2. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Friction dampening for explosive clicks
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Min velocity drift
        if (Math.abs(p.vx) < 0.15) p.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(p.vy) < 0.15) p.vy += (Math.random() - 0.5) * 0.05;

        // Bounce/Wrap boundaries
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Alpha twinkle animation
        p.alpha += p.alphaSpeed * p.alphaDirection;
        if (p.alpha > 0.85) {
          p.alpha = 0.85;
          p.alphaDirection = -1;
        } else if (p.alpha < 0.2) {
          p.alpha = 0.2;
          p.alphaDirection = 1;
        }

        // Mouse interaction (gentle repulsion)
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < mouseRadiusSq) {
            const mDist = Math.sqrt(mDistSq);
            const force = (mouse.radius - mDist) / mouse.radius;
            const angle = Math.atan2(mdy, mdx);
            p.x += Math.cos(angle) * force * 1.8;
            p.y += Math.sin(angle) * force * 1.8;

            // Connect laser beam to mouse
            const lineAlpha = (1 - mDist / mouse.radius) * 0.5;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(255, 56, 82, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.glowColor;

        if (p.isDiamond) {
          // Milky BOSS Diamond shape
          const s = p.radius * 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s);
          ctx.lineTo(p.x + s, p.y);
          ctx.lineTo(p.x, p.y + s);
          ctx.lineTo(p.x - s, p.y);
          ctx.closePath();
          ctx.fill();
        } else {
          // Soft circular node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 3. Connect lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxLineDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxLineDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Alternate between subtle red glow line and neutral line
            if (p.color === '#c81e32' || p2.color === '#c81e32') {
              ctx.strokeStyle = `rgba(200, 30, 50, ${lineAlpha * 1.2})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * 0.6})`;
            }
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
