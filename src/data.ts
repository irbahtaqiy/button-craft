import { ButtonItem } from './types';

export const buttonsData: ButtonItem[] = [
  // 1. Shimmer Border
  {
    id: 'shimmer-border',
    name: 'Shimmer Border',
    category: 'glow',
    tags: ['animated', 'gradient', 'popular', 'subtle'],
    description: 'Rotating metallic aura running along an ultra-fine border',
    html: `<button class="btn-shimmer">
  <span class="btn-shimmer-spark"></span>
  <span class="btn-shimmer-content">Explore Horizon</span>
</button>`,
    css: `.btn-shimmer {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  padding: 1px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.btn-shimmer-spark {
  position: absolute;
  inset: -1000%;
  background: conic-gradient(from 90deg at 50% 50%, #e2e8f0 0%, #3b82f6 50%, #e2e8f0 100%);
  animation: shimmer-spin 3s linear infinite;
}

.btn-shimmer-content {
  position: relative;
  display: inline-flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #090d16;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #f8fafc;
  backdrop-filter: blur(12px);
  transition: background 0.2s, transform 0.2s;
}

.btn-shimmer:hover .btn-shimmer-content {
  background: #0f172a;
}

.btn-shimmer:active .btn-shimmer-content {
  transform: scale(0.97);
}

@keyframes shimmer-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-shimmer"><span class="btn-shimmer-spark"></span><span class="btn-shimmer-content">Explore Horizon</span></button>`;
    }
  },

  // 2. Liquid Mercury
  {
    id: 'liquid-mercury',
    name: 'Liquid Mercury',
    category: 'glass',
    tags: ['glassmorphism', 'glow', 'reflective'],
    description: 'Glossy metallic surface with inner refraction and bottom highlight',
    html: `<button class="btn-mercury">
  <span>Confirm Payment</span>
</button>`,
    css: `.btn-mercury {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 100%), #121826;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-mercury:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 14px 28px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.06) 100%), #1a2234;
}

.btn-mercury:active {
  transform: translateY(1px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.5);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-mercury"><span>Confirm Payment</span></button>`;
    }
  },

  // 3. Cyber Matrix Pulse
  {
    id: 'cyber-glitch',
    name: 'Cyberpunk Breach',
    category: 'cyberpunk',
    tags: ['glitch', 'neon', 'futuristic', 'angular'],
    description: 'Angular chamfer cuts with slice glitch shift on hover',
    html: `<button class="btn-cyber" data-text="INITIALIZE_">
  INITIALIZE_
</button>`,
    css: `.btn-cyber {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  background: #00f0ff;
  color: #050505;
  font-family: 'JetBrains Mono', monospace, sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
  clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
  box-shadow: 4px 4px 0px #ff003c;
  transition: all 0.15s ease-out;
}

.btn-cyber:hover {
  background: #ffe600;
  box-shadow: -4px -4px 0px #00f0ff;
  transform: translate(2px, 2px);
}

.btn-cyber::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff003c;
  color: #fff;
  clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
  transform: translate(2px, -2px);
  opacity: 0;
  transition: opacity 0.1s;
}

.btn-cyber:hover::after {
  opacity: 0.8;
  animation: cyber-twitch 0.4s steps(2) infinite;
}

@keyframes cyber-twitch {
  0% { transform: translate(-2px, 2px); clip-path: inset(20% 0 30% 0); }
  50% { transform: translate(3px, -1px); clip-path: inset(50% 0 10% 0); }
  100% { transform: translate(-1px, 2px); clip-path: inset(10% 0 60% 0); }
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-cyber" data-text="INITIALIZE_">INITIALIZE_</button>`;
    }
  },

  // 4. Neo Brutalism Pop
  {
    id: 'neo-brutalism',
    name: 'Neo Brutalist Pop',
    category: 'brutalist',
    tags: ['brutalism', 'retro', 'bold', 'punchy'],
    description: 'Thick black solid borders with sharp offset shadow drop on press',
    html: `<button class="btn-brutal">
  <span>Launch Rocket</span>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
</button>`,
    css: `.btn-brutal {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 26px;
  background: #a3e635;
  color: #0a0a0a;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 3px solid #0a0a0a;
  border-radius: 8px;
  box-shadow: 5px 5px 0px #0a0a0a;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn-brutal:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0px #0a0a0a;
  background: #bef264;
}

.btn-brutal:active {
  transform: translate(4px, 4px);
  box-shadow: 1px 1px 0px #0a0a0a;
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-brutal"><span>Launch Rocket</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>`;
    }
  },

  // 5. 3D Push Switch
  {
    id: 'isometric-3d',
    name: '3D Extruded Button',
    category: '3d',
    tags: ['tactile', 'gaming', 'pressable', '3d'],
    description: 'Physical depth switch that physically sinks on press',
    html: `<button class="btn-3d">
  <span class="btn-3d-shadow"></span>
  <span class="btn-3d-edge"></span>
  <span class="btn-3d-front">Claim Loot</span>
</button>`,
    css: `.btn-3d {
  position: relative;
  background: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  user-select: none;
}

.btn-3d-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  transform: translateY(4px);
  transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

.btn-3d-edge {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(to left, #7c2d12 0%, #b45309 8%, #b45309 92%, #7c2d12 100%);
}

.btn-3d-front {
  display: block;
  position: relative;
  border-radius: 12px;
  background: #f59e0b;
  padding: 14px 32px;
  color: #1c1917;
  font-size: 15px;
  font-weight: 700;
  transform: translateY(-6px);
  transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

.btn-3d:hover .btn-3d-front {
  transform: translateY(-8px);
  background: #fbbf24;
}

.btn-3d:hover .btn-3d-shadow {
  transform: translateY(6px);
}

.btn-3d:active .btn-3d-front {
  transform: translateY(-2px);
  transition: transform 34ms;
}

.btn-3d:active .btn-3d-shadow {
  transform: translateY(2px);
  transition: transform 34ms;
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-3d"><span class="btn-3d-shadow"></span><span class="btn-3d-edge"></span><span class="btn-3d-front">Claim Loot</span></button>`;
    }
  },

  // 6. Magnetic Aurora Glow
  {
    id: 'aurora-glow',
    name: 'Aurora Borealis Glow',
    category: 'glow',
    tags: ['gradient', 'glow', 'luxury', 'smooth'],
    description: 'Breathes dynamic violet and cyan gradient aura behind the button',
    html: `<div class="btn-aurora-wrapper">
  <div class="btn-aurora-glow"></div>
  <button class="btn-aurora">Unlock VIP</button>
</div>`,
    css: `.btn-aurora-wrapper {
  position: relative;
  display: inline-block;
}

.btn-aurora-glow {
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, #ff007f, #7928ca, #0070f3, #00dfd8);
  border-radius: 14px;
  filter: blur(14px);
  opacity: 0.6;
  transition: opacity 0.3s ease, filter 0.3s ease;
  z-index: 0;
  background-size: 300% 300%;
  animation: aurora-shift 5s ease infinite;
}

.btn-aurora {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 30px;
  background: #000000;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-aurora-wrapper:hover .btn-aurora-glow {
  opacity: 1;
  filter: blur(18px);
}

.btn-aurora-wrapper:hover .btn-aurora {
  background: #09090b;
  transform: translateY(-1px);
}

.btn-aurora-wrapper:active .btn-aurora {
  transform: translateY(1px);
}

@keyframes aurora-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`,
    render: (c) => {
      c.innerHTML = `<div class="btn-aurora-wrapper"><div class="btn-aurora-glow"></div><button class="btn-aurora">Unlock VIP</button></div>`;
    }
  },

  // 7. Minimal Pill Outline
  {
    id: 'minimal-pill',
    name: 'Minimal Pill Fill',
    category: 'minimal',
    tags: ['clean', 'saas', 'monochrome', 'hover-fill'],
    description: 'Ultra clean monochrome pill with smooth fill expansion',
    html: `<button class="btn-minimal-pill">
  <span class="btn-pill-label">Documentation</span>
  <span class="btn-pill-arrow">→</span>
</button>`,
    css: `.btn-minimal-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: transparent;
  color: #e2e8f0;
  border: 1px solid #334155;
  border-radius: 9999px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-minimal-pill::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #ffffff;
  transform: translateY(100%);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.btn-pill-label, .btn-pill-arrow {
  position: relative;
  z-index: 1;
  transition: color 0.25s, transform 0.25s;
}

.btn-minimal-pill:hover::before {
  transform: translateY(0);
}

.btn-minimal-pill:hover .btn-pill-label,
.btn-minimal-pill:hover .btn-pill-arrow {
  color: #09090b;
}

.btn-minimal-pill:hover .btn-pill-arrow {
  transform: translateX(3px);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-minimal-pill"><span class="btn-pill-label">Documentation</span><span class="btn-pill-arrow">→</span></button>`;
    }
  },

  // 8. Spotlight Cursor Glow
  {
    id: 'spotlight-card',
    name: 'Spotlight Border Radial',
    category: 'glow',
    tags: ['radial', 'spotlight', 'interactive', 'mouse'],
    description: 'Dynamic gradient illumination that tracks coordinates',
    html: `<button class="btn-spotlight">
  <span>Generate API Key</span>
</button>`,
    css: `.btn-spotlight {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(99, 102, 241, 0.4) 0%, rgba(15, 23, 42, 0.9) 70%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.btn-spotlight:hover {
  border-color: rgba(165, 180, 252, 0.6);
  box-shadow: 0 0 20px -3px rgba(99, 102, 241, 0.4);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-spotlight"><span>Generate API Key</span></button>`;
      const btn = c.querySelector('.btn-spotlight') as HTMLElement;
      btn?.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty('--x', `${x}%`);
        btn.style.setProperty('--y', `${y}%`);
      });
    }
  },

  // 9. Retro Pixel Quest
  {
    id: 'retro-pixel',
    name: '8-Bit Arcade Quest',
    category: 'retro',
    tags: ['8bit', 'pixel', 'gaming', 'nostalgia'],
    description: 'Stepped block shadow and pixelated push feedback',
    html: `<button class="btn-pixel">
  <span>START GAME</span>
</button>`,
    css: `.btn-pixel {
  position: relative;
  padding: 12px 24px;
  background: #ec4899;
  color: #ffffff;
  font-family: 'Press Start 2P', monospace, sans-serif;
  font-size: 11px;
  letter-spacing: 1px;
  border: 4px solid #831843;
  box-shadow: 4px 4px 0 #000, -4px 4px 0 #000, 4px -4px 0 #000, -4px -4px 0 #000, 0 8px 0 #000;
  cursor: pointer;
  transition: transform 0.05s steps(2);
}

.btn-pixel:hover {
  background: #f472b6;
}

.btn-pixel:active {
  transform: translateY(4px);
  box-shadow: 4px 4px 0 #000, -4px 4px 0 #000, 4px -4px 0 #000, -4px -4px 0 #000, 0 4px 0 #000;
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-pixel"><span>START GAME</span></button>`;
    }
  },

  // 10. Playful Jelly Bounce
  {
    id: 'jelly-bounce',
    name: 'Squishy Jelly Pop',
    category: 'playful',
    tags: ['bouncy', 'spring', 'fun', 'colorful'],
    description: 'Elastic rubber spring physics on hover and release',
    html: `<button class="btn-jelly">
  <span>Tap Me!</span>
</button>`,
    css: `.btn-jelly {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  border: none;
  border-radius: 50px;
  box-shadow: 0 10px 20px -5px rgba(254, 126, 95, 0.5);
  cursor: pointer;
  user-select: none;
}

.btn-jelly:hover {
  animation: jelly-wiggle 0.7s ease;
}

.btn-jelly:active {
  transform: scale(0.92, 0.88);
}

@keyframes jelly-wiggle {
  0% { transform: scale(1, 1); }
  30% { transform: scale(1.2, 0.8); }
  50% { transform: scale(0.85, 1.15); }
  65% { transform: scale(1.08, 0.95); }
  80% { transform: scale(0.97, 1.03); }
  100% { transform: scale(1, 1); }
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-jelly"><span>Tap Me!</span></button>`;
    }
  },

  // 11. Glassmorphism Frost
  {
    id: 'frosted-glass',
    name: 'Frosted Prism Glass',
    category: 'glass',
    tags: ['glass', 'blur', 'apple', 'clean'],
    description: 'Apple-styled ultra frosted backdrop with diffuse highlight',
    html: `<button class="btn-glass">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  <span>Pay with Apple</span>
</button>`,
    css: `.btn-glass {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.btn-glass:active {
  transform: translateY(0);
  background: rgba(255, 255, 255, 0.08);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-glass"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><span>Pay with Apple</span></button>`;
    }
  },

  // 12. Neumorphic Inset
  {
    id: 'soft-neumorphism',
    name: 'Soft Concave Neumorphism',
    category: 'minimal',
    tags: ['neumorphism', 'tactile', 'minimal', 'monochrome'],
    description: 'Dual directional shadows creating deep physical embossing',
    html: `<button class="btn-neumorph">
  <span>System Power</span>
</button>`,
    css: `.btn-neumorph {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  background: #181c24;
  border: none;
  border-radius: 16px;
  box-shadow: 6px 6px 14px #0e1015, -6px -6px 14px #222833;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-neumorph:hover {
  color: #e2e8f0;
}

.btn-neumorph:active {
  box-shadow: inset 4px 4px 8px #0e1015, inset -4px -4px 8px #222833;
  color: #38bdf8;
  transform: scale(0.99);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-neumorph"><span>System Power</span></button>`;
    }
  },

  // 13. Magnetic Particle Sweep
  {
    id: 'particle-sweep',
    name: 'Magnetic Sweep Arrow',
    category: 'minimal',
    tags: ['arrow', 'microinteraction', 'hover', 'fluid'],
    description: 'Dual icon translation with smooth infinite flow on hover',
    html: `<button class="btn-sweep">
  <span>Get Started Free</span>
  <span class="btn-sweep-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  </span>
</button>`,
    css: `.btn-sweep {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #0f172a;
  color: #f8fafc;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #334155;
  border-radius: 100px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
}

.btn-sweep-icon {
  position: relative;
  display: inline-flex;
  width: 16px;
  height: 16px;
  overflow: hidden;
}

.btn-sweep-icon svg {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-sweep-icon svg:nth-child(2) {
  transform: translate(-150%, 150%);
}

.btn-sweep:hover {
  background: #1e293b;
  border-color: #64748b;
}

.btn-sweep:hover .btn-sweep-icon svg:nth-child(1) {
  transform: translate(150%, -150%);
}

.btn-sweep:hover .btn-sweep-icon svg:nth-child(2) {
  transform: translate(0, 0);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-sweep"><span>Get Started Free</span><span class="btn-sweep-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></button>`;
    }
  },

  // 14. Neon Cyan Wireframe
  {
    id: 'neon-wireframe',
    name: 'Tron Wireframe Glow',
    category: 'glow',
    tags: ['tron', 'wireframe', 'neon', 'dark'],
    description: 'Electric cyan luminescence radiating through thin border paths',
    html: `<button class="btn-neon-wire">
  <span>SYNCHRONIZE</span>
</button>`,
    css: `.btn-neon-wire {
  position: relative;
  padding: 12px 30px;
  background: transparent;
  color: #06b6d4;
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  border: 1px solid #06b6d4;
  border-radius: 6px;
  box-shadow: inset 0 0 10px rgba(6, 182, 212, 0.2), 0 0 10px rgba(6, 182, 212, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-neon-wire:hover {
  background: #06b6d4;
  color: #021217;
  box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.6), 0 0 25px rgba(6, 182, 212, 0.8);
  text-shadow: none;
  transform: translateY(-2px);
}

.btn-neon-wire:active {
  transform: translateY(0);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-neon-wire"><span>SYNCHRONIZE</span></button>`;
    }
  },

  // 15. Pulse Ripple Radar
  {
    id: 'radar-ripple',
    name: 'Sonar Radar Ping',
    category: 'playful',
    tags: ['radar', 'sonar', 'ping', 'animated'],
    description: 'Concentric broadcasting soundwaves emerging from an active dot',
    html: `<button class="btn-radar">
  <span class="btn-radar-ping">
    <span class="btn-radar-ping-dot"></span>
    <span class="btn-radar-ping-wave"></span>
  </span>
  <span>Live Transmission</span>
</button>`,
    css: `.btn-radar {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 11px 24px;
  background: #111827;
  color: #f3f4f6;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #374151;
  border-radius: 9999px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.btn-radar:hover {
  border-color: #10b981;
  transform: translateY(-1px);
}

.btn-radar-ping {
  position: relative;
  display: flex;
  width: 10px;
  height: 10px;
}

.btn-radar-ping-wave {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: #10b981;
  animation: radar-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.btn-radar-ping-dot {
  position: relative;
  display: inline-flex;
  border-radius: 9999px;
  width: 10px;
  height: 10px;
  background: #10b981;
}

@keyframes radar-ping {
  75%, 100% {
    transform: scale(2.4);
    opacity: 0;
  }
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-radar"><span class="btn-radar-ping"><span class="btn-radar-ping-dot"></span><span class="btn-radar-ping-wave"></span></span><span>Live Transmission</span></button>`;
    }
  },

  // 16. Gradient Border Slide
  {
    id: 'gradient-slide',
    name: 'Sunset Gradient Flush',
    category: 'minimal',
    tags: ['sunset', 'flow', 'slide', 'vibrant'],
    description: 'Dynamic sunset wash wiping seamlessly from left to right',
    html: `<button class="btn-gradient-slide">
  <span>Schedule Demo</span>
</button>`,
    css: `.btn-gradient-slide {
  position: relative;
  padding: 13px 30px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(90deg, #ec4899, #f97316, #ec4899);
  background-size: 200% 100%;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.35);
  transition: all 0.4s ease;
}

.btn-gradient-slide:hover {
  background-position: 100% 0;
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
  transform: translateY(-2px);
}

.btn-gradient-slide:active {
  transform: translateY(0);
}`,
    render: (c) => {
      c.innerHTML = `<button class="btn-gradient-slide"><span>Schedule Demo</span></button>`;
    }
  }
];
