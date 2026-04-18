import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const GasTuner = ({ liquidityDepth = 0.7, peakHours = { start: 4, end: 6 }, stage = 'IGNITION', velocity = 0.65 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeParam, setActiveParam] = useState(null);
  
  const getStageStyles = () => {
    const styles = {
      SEEDING: { accent: '#10b981', accentRGB: '16, 185, 129', label: 'MICRO-CAP' },
      IGNITION: { accent: '#00e5ff', accentRGB: '0, 229, 255', label: 'MOMENTUM' },
      PEAK: { accent: '#ff3366', accentRGB: '255, 51, 102', label: 'HYPERGROWTH' },
      DISTRIBUTION: { accent: '#f59e0b', accentRGB: '245, 158, 11', label: 'EXIT LIQUIDITY' },
      DEAD: { accent: '#6b7280', accentRGB: '107, 114, 128', label: 'DORMANT' }
    };
    return styles[stage] || styles.IGNITION;
  };
  
  const style = getStageStyles();
  
  // Calculate optimal gas based on velocity and stage
  const getOptimalGas = () => {
    if (stage === 'PEAK') return '5-8';
    if (stage === 'IGNITION') return '3-4';
    if (stage === 'SEEDING') return '1-2';
    return '1';
  };
  
  // Calculate slippage recommendation
  const getSlippage = () => {
    if (velocity > 0.8) return '15-20%';
    if (velocity > 0.5) return '8-12%';
    return '3-5%';
  };
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl glass"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background ambient effect */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 30% 50%, rgba(${style.accentRGB}, 0.4) 0%, transparent 70%)`
        }}
      />
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(${style.accentRGB}, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(${style.accentRGB}, 0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      <div className="relative p-6">
        {/* Header with stage badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: style.accent,
                boxShadow: `0 0 20px ${style.accent}`
              }}
            />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">
              Launch Parameters
            </h3>
          </div>
          <motion.div 
            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ 
              backgroundColor: `rgba(${style.accentRGB}, 0.1)`,
              color: style.accent,
              border: `1px solid rgba(${style.accentRGB}, 0.2)`
            }}
            animate={{
              boxShadow: isHovered ? `0 0 20px rgba(${style.accentRGB}, 0.3)` : 'none'
            }}
          >
            {style.label}
          </motion.div>
        </div>
        
        {/* Main Gas Timing Display */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
              Optimal Gas Window (BNB)
            </span>
            <motion.span 
              className="text-[10px] font-mono text-white/60"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              LIVE
            </motion.span>
          </div>
          
          <div className="flex items-end gap-2">
            <span 
              className="text-5xl font-black tabular-nums tracking-tight"
              style={{ color: style.accent }}
            >
              {peakHours.start}:00
            </span>
            <span className="text-2xl font-light text-white/40 mb-1">–</span>
            <span 
              className="text-5xl font-black tabular-nums tracking-tight"
              style={{ color: style.accent }}
            >
              {peakHours.end}:00
            </span>
            <span className="text-sm font-mono text-white/40 mb-2 ml-2">UTC</span>
          </div>
        </div>
        
        {/* Liquidity Depth Visualization */}
        <div className="mb-6">
          <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
            <span>Liquidity Depth</span>
            <span>{(liquidityDepth * 100).toFixed(0)}%</span>
          </div>
          
          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ 
                width: `${liquidityDepth * 100}%`,
                background: `linear-gradient(90deg, ${style.accent}, rgba(${style.accentRGB}, 0.5))`,
                boxShadow: `0 0 20px rgba(${style.accentRGB}, 0.5)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${liquidityDepth * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            {/* Depth markers */}
            <div className="absolute inset-0 flex">
              {[0.25, 0.5, 0.75].map(mark => (
                <div 
                  key={mark}
                  className="flex-1 border-r border-white/10"
                  style={{ marginLeft: mark === 0.25 ? 0 : undefined }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Parameter Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div 
            className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer overflow-hidden"
            onHoverStart={() => setActiveParam('gas')}
            onHoverEnd={() => setActiveParam(null)}
            whileHover={{ scale: 1.02 }}
          >
            <AnimatePresence>
              {activeParam === 'gas' && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            
            <div className="relative z-10">
              <div className="text-[9px] font-mono text-white/30 uppercase tracking-wider mb-1">
                Gas Price
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {getOptimalGas()} <span className="text-sm font-normal text-white/40">GWEI</span>
              </div>
              <div className="text-[9px] font-mono text-amber-400/60 mt-1">
                ↑ Priority Fee: 0.5 GWEI
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer overflow-hidden"
            onHoverStart={() => setActiveParam('slippage')}
            onHoverEnd={() => setActiveParam(null)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative z-10">
              <div className="text-[9px] font-mono text-white/30 uppercase tracking-wider mb-1">
                Slippage
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {getSlippage()}
              </div>
              <div className="text-[9px] font-mono text-rose-400/60 mt-1">
                ⚡ High velocity detected
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Anti-Snipe Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">
                Anti-Snipe Protection
              </span>
            </div>
            <motion.div 
              className="relative w-9 h-5 rounded-full cursor-pointer"
              style={{ 
                backgroundColor: `rgba(${style.accentRGB}, 0.3)`,
                border: `1px solid rgba(${style.accentRGB}, 0.5)`
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute top-1 w-3 h-3 rounded-full bg-white"
                style={{ right: 4 }}
                layoutId="antiSnipeToggle"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">
                MEV Protection
              </span>
            </div>
            <motion.div 
              className="relative w-9 h-5 rounded-full cursor-pointer"
              style={{ 
                backgroundColor: `rgba(${style.accentRGB}, 0.3)`,
                border: `1px solid rgba(${style.accentRGB}, 0.5)`
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute top-1 w-3 h-3 rounded-full bg-white"
                style={{ right: 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Estimated TX Success Rate */}
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
              TX Success Probability
            </span>
            <motion.span 
              className="text-lg font-black"
              style={{ color: style.accent }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stage === 'IGNITION' ? '94%' : stage === 'PEAK' ? '76%' : '89%'}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};