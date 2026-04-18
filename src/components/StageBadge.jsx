import { motion } from 'framer-motion';

export const StageBadge = ({ stage = 'IGNITION', ageScore = 0.4, liquidityDepth = 0.7 }) => {
  const stageData = {
    SEEDING: { label: 'SEEDING', color: '#10b981', description: 'Early accumulation' },
    IGNITION: { label: 'IGNITION', color: '#00e5ff', description: 'Momentum building' },
    PEAK: { label: 'PEAK', color: '#ff3366', description: 'Maximum velocity' },
    DISTRIBUTION: { label: 'DISTRIBUTION', color: '#f59e0b', description: 'Exit phase' },
    DEAD: { label: 'DEAD', color: '#6b7280', description: 'Inactive' }
  };
  
  const current = stageData[stage] || stageData.IGNITION;
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl glass p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Stage indicator */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ 
            backgroundColor: `${current.color}15`,
            border: `1px solid ${current.color}30`
          }}
          animate={{
            boxShadow: [`0 0 0px ${current.color}00`, `0 0 20px ${current.color}40`, `0 0 0px ${current.color}00`]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: current.color }}
          />
        </motion.div>
        <div>
          <div 
            className="text-lg font-black tracking-tight"
            style={{ color: current.color }}
          >
            {current.label}
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase">
            {current.description}
          </div>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-white/40">Wallet Age</span>
            <span className="text-white">{(ageScore * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                width: `${ageScore * 100}%`,
                background: `linear-gradient(90deg, ${current.color}, ${current.color}80)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${ageScore * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-white/40">Liquidity Depth</span>
            <span className="text-white">{(liquidityDepth * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                width: `${liquidityDepth * 100}%`,
                background: `linear-gradient(90deg, ${current.color}, ${current.color}80)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${liquidityDepth * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Stage timeline */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          {Object.keys(stageData).map((s) => (
            <div 
              key={s}
              className="flex flex-col items-center gap-1"
            >
              <div 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  s === stage ? 'scale-150' : ''
                }`}
                style={{ 
                  backgroundColor: s === stage ? stageData[s].color : 'rgba(255,255,255,0.1)',
                  boxShadow: s === stage ? `0 0 10px ${stageData[s].color}` : 'none'
                }}
              />
              <span className={`text-[7px] font-mono uppercase transition-colors duration-300 ${
                s === stage ? 'text-white/60' : 'text-white/20'
              }`}>
                {s.slice(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};