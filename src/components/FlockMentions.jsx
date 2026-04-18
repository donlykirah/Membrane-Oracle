import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const FlockMentions = ({ decayRate = 0.23, stage = 'IGNITION', token = 'WOJAK' }) => {
  const [particles, setParticles] = useState([]);
  
  const getStageColor = () => {
    const colors = {
      SEEDING: '#10b981',
      IGNITION: '#00e5ff',
      PEAK: '#ff3366',
      DISTRIBUTION: '#f59e0b',
      DEAD: '#6b7280'
    };
    return colors[stage] || '#00e5ff';
  };
  
  const accentColor = getStageColor();
  
  useEffect(() => {
    const count = stage === 'DEAD' ? 2 : Math.floor(8 + (1 - decayRate) * 25);
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: i * 0.15,
      duration: stage === 'PEAK' ? 2 + Math.random() * 2 : 4 + Math.random() * 4,
      radius: stage === 'PEAK' ? 30 + Math.random() * 40 : 50 + Math.random() * 60,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [decayRate, stage]);
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl glass p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 0 15px ${accentColor}`,
              animation: 'pulse 2s infinite'
            }}
          />
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">
            Social Membrane
          </h3>
        </div>
        <div className="text-[10px] font-mono text-white/40">
          Decay: {(decayRate * 100).toFixed(0)}%
        </div>
      </div>
      
      {/* Flock Visualization */}
      <div className="relative h-40 w-full">
        {/* Center Token */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          animate={{
            scale: stage === 'PEAK' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div 
            className="relative w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor}40, transparent)`,
              boxShadow: `0 0 40px ${accentColor}40`
            }}
          >
            <div className="absolute inset-0 rounded-full border border-white/20" />
            <span className="relative text-xs font-black text-white">
              ${token}
            </span>
          </div>
        </motion.div>
        
        {/* Orbiting Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: accentColor,
              boxShadow: `0 0 ${particle.size * 4}px ${accentColor}`
            }}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, particle.radius, 0, -particle.radius, 0],
              y: [0, 0, particle.radius * 0.6, 0, -particle.radius * 0.6],
              opacity: stage === 'DISTRIBUTION' ? [1, 0.3, 1] : [0.3, 1, 0.3],
              scale: stage === 'PEAK' ? [1, 1.5, 1] : 1,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        ))}
        
        {/* Social metrics overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1">
            <span className="text-white/30">📊</span>
            <span className="text-white/60">
              {(decayRate * 100).toFixed(0)}% decay
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white/30">🔄</span>
            <span className="text-white/60">
              {stage === 'PEAK' ? 'Viral' : stage === 'IGNITION' ? 'Building' : 'Quiet'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Footer stats */}
      <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-center">
        <div>
          <div className="text-[8px] font-mono text-white/30 uppercase">Mentions/24h</div>
          <div className="text-sm font-mono font-bold text-white">
            {stage === 'PEAK' ? '2.4K' : stage === 'IGNITION' ? '856' : '124'}
          </div>
        </div>
        <div>
          <div className="text-[8px] font-mono text-white/30 uppercase">Sentiment</div>
          <div 
            className="text-sm font-mono font-bold"
            style={{ color: accentColor }}
          >
            {stage === 'PEAK' ? '🟢 Bullish' : stage === 'DISTRIBUTION' ? '🔴 Bearish' : '🟡 Neutral'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};