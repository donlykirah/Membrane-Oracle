import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ConfidenceMeter = ({ confidence = 78, stage = 'IGNITION', history = [] }) => {
  const [displayConfidence, setDisplayConfidence] = useState(confidence);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayConfidence(confidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [confidence]);
  
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
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl glass p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${accentColor}40, transparent)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">
            Confidence Index
          </h3>
          <motion.div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        
        <div className="text-center mb-4">
          <motion.div 
            className="text-7xl font-black tabular-nums tracking-tighter"
            style={{ color: accentColor }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {displayConfidence}
            <span className="text-3xl text-white/40 ml-1">%</span>
          </motion.div>
          <div className="text-sm font-mono text-white/40 mt-1 uppercase tracking-wider">
            {stage} BIAS
          </div>
        </div>
        
        {/* Confidence ring */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayConfidence / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 10px ${accentColor})`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[10px] font-mono text-white/30">MLO</div>
              <div className="text-xs font-black text-white">V2</div>
            </div>
          </div>
        </div>
        
        {/* Trend indicators */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[8px] font-mono text-white/30 uppercase">Short</div>
            <div className="text-xs font-mono text-green-400">↑ 12%</div>
          </div>
          <div>
            <div className="text-[8px] font-mono text-white/30 uppercase">Mid</div>
            <div className="text-xs font-mono text-amber-400">→ 0%</div>
          </div>
          <div>
            <div className="text-[8px] font-mono text-white/30 uppercase">Long</div>
            <div className="text-xs font-mono text-rose-400">↓ 5%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};