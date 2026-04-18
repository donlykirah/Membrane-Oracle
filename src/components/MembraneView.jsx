import { useEffect, useRef, useState } from 'react';

export const MembraneView = ({ velocity = 0.65, ageScore = 0.4, decayRate = 0.23, stage = 'IGNITION' }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Stage color mapping - biomorphic membrane tones
  const stageColors = {
    SEEDING: { primary: '#7cffb0', secondary: '#00e5ff', glow: 'rgba(124, 255, 176, 0.3)' },
    IGNITION: { primary: '#00e5ff', secondary: '#b44cff', glow: 'rgba(0, 229, 255, 0.4)' },
    PEAK: { primary: '#ff3366', secondary: '#ff9933', glow: 'rgba(255, 51, 102, 0.5)' },
    DISTRIBUTION: { primary: '#ff9933', secondary: '#ffcc00', glow: 'rgba(255, 153, 51, 0.3)' },
    DEAD: { primary: '#666666', secondary: '#444444', glow: 'rgba(102, 102, 102, 0.1)' }
  };
  
  const colors = stageColors[stage] || stageColors.IGNITION;
  
  // The 0.1% move: ResizeObserver for pixel-perfect canvas rendering
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Draw the membrane waveform
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = dimensions.width;
    const h = dimensions.height;
    
    // Set canvas resolution (retina-ready)
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);
    
    // Clear with stage-appropriate background gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.5, '#12121a');
    gradient.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Draw biomorphic grid (liquidity depth visualization)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines (time axis)
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    
    // Horizontal grid lines (price/liquidity axis)
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    // THE MEMBRANE WAVEFORM - Where the magic happens
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Shadow effect for depth
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw the main waveform
    for (let x = 0; x < w; x += 1.5) {
      // Base sine wave
      const t = x / w;
      
      // Frequency modulation based on decay rate
      // High decay = fewer oscillations (dying interest)
      // Low decay = rapid oscillations (viral spread)
      const baseFreq = 0.04;
      const decayModulation = decayRate * 0.03;
      const freq = baseFreq + (1 - decayRate) * 0.08;
      
      // Amplitude modulation based on velocity
      // High velocity (many tx) = taller waves
      const baseAmp = h * 0.25;
      const amp = baseAmp * (0.3 + velocity * 0.9);
      
      // STAGE-SPECIFIC WAVEFORM DISTORTIONS
      let y = h / 2;
      
      if (stage === 'DEAD') {
        // Flatline with micro-tremors
        y = h / 2 + Math.sin(x * 0.1) * 2;
        ctx.strokeStyle = '#444';
      } else if (stage === 'SEEDING') {
        // Low amplitude, high frequency tremor (wallet age analysis visible)
        const tremor = Math.sin(x * 0.3) * 8;
        const microTremor = Math.sin(x * 0.8) * 3 * ageScore;
        y = h/2 + Math.sin(x * freq) * amp * 0.3 + tremor + microTremor;
        
        // Color gradient for seeding
        const progress = x / w;
        const r = 124 + Math.floor(131 * progress);
        const g = 255;
        const b = 176 + Math.floor(79 * progress);
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      } else if (stage === 'IGNITION') {
        // Building momentum - sawtooth influence
        const sawtooth = (x * freq) % (Math.PI * 2) / (Math.PI * 2) - 0.5;
        y = h/2 + Math.sin(x * freq) * amp + sawtooth * amp * 0.3;
        
        // Cyan to purple gradient
        const gradient = ctx.createLinearGradient(0, h/2 - amp, w, h/2 + amp);
        gradient.addColorStop(0, '#00e5ff');
        gradient.addColorStop(0.5, '#b44cff');
        gradient.addColorStop(1, '#00e5ff');
        ctx.strokeStyle = gradient;
      } else if (stage === 'PEAK') {
        // Clipping distortion - the wave hits the ceiling
        let rawY = Math.sin(x * freq) * amp;
        // Clip at 80% of amp
        if (rawY > amp * 0.8) rawY = amp * 0.8 + (rawY - amp * 0.8) * 0.3;
        if (rawY < -amp * 0.8) rawY = -amp * 0.8 + (rawY + amp * 0.8) * 0.3;
        y = h/2 + rawY;
        
        // Intense red-orange gradient
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#ff3366');
        gradient.addColorStop(0.5, '#ff9933');
        gradient.addColorStop(1, '#ff3366');
        ctx.strokeStyle = gradient;
      } else if (stage === 'DISTRIBUTION') {
        // Decaying wave - amplitude decreases over time
        const decayFactor = 1 - (x / w) * 0.7;
        y = h/2 + Math.sin(x * freq) * amp * decayFactor;
        
        // Fading orange to transparent
        ctx.strokeStyle = '#ff9933';
        ctx.globalAlpha = 0.3 + (1 - x / w) * 0.4;
      }
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    
    // Draw secondary harmonic (holder behavior pattern)
    if (stage !== 'DEAD') {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.secondary;
      ctx.globalAlpha = 0.3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = colors.glow;
      
      for (let x = 0; x < w; x += 2) {
        const t = x / w;
        // Holder behavior adds a secondary frequency
        const holderFreq = 0.12 + ageScore * 0.1;
        const holderAmp = h * 0.15 * ageScore;
        const y = h/2 + Math.sin(x * holderFreq + t * 10) * holderAmp;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
    }
    
    // Draw "Ignition Window" marker (estimated peak hours)
    if (stage === 'IGNITION' || stage === 'SEEDING') {
      const peakPosition = w * 0.65; // 65% through the chart
      
      ctx.beginPath();
      ctx.moveTo(peakPosition, 0);
      ctx.lineTo(peakPosition, h);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      
      // Draw "PEAK ZONE" label
      ctx.setLineDash([]);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.7;
      ctx.textAlign = 'right';
      ctx.fillText('PEAK ZONE →', peakPosition - 5, 20);
      
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(peakPosition + 5, 30);
      ctx.lineTo(peakPosition + 15, 25);
      ctx.lineTo(peakPosition + 5, 20);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.7;
      ctx.fill();
      
      ctx.globalAlpha = 1.0;
    }
    
    // Draw confidence ring (top right corner)
    ctx.beginPath();
    ctx.arc(w - 30, 30, 20, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
  }, [dimensions, velocity, ageScore, decayRate, stage]);
  
  return (
    <div ref={containerRef} className="relative w-full h-56 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
      
      {/* Stage Overlay - Pure CSS for crisp text */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] font-mono text-white/40">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" 
                  style={{ backgroundColor: colors.primary, boxShadow: `0 0 10px ${colors.primary}` }} />
            MEMBRANE ACTIVE
          </span>
          <span>{stage}</span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[8px] font-mono text-white/30 uppercase tracking-wider mb-1">Current Stage</div>
            <div className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,229,255,0.7)]"
                 style={{ textShadow: `0 0 20px ${colors.glow}` }}>
              {stage}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[8px] font-mono text-white/30 uppercase tracking-wider">Tx Velocity</div>
            <div className="text-xl font-mono font-bold text-white">
              {(velocity * 100).toFixed(0)}%
            </div>
            <div className="w-16 h-0.5 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${velocity * 100}%`,
                  backgroundColor: colors.primary,
                  boxShadow: `0 0 10px ${colors.primary}`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};