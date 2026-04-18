import { useState, useEffect, useCallback } from 'react';

// Simulated on-chain patterns based on real BSC meme coin behavior
const LIFECYCLE_PATTERNS = {
  SEEDING: {
    velocity: [0.05, 0.15],      // Low tx count
    ageScore: [0.8, 0.95],       // Early wallets are fresh
    decayRate: [0.8, 0.9],       // No social momentum yet
    liquidityDepth: [0.1, 0.2],  // Thin liquidity
    confidence: [45, 60]
  },
  IGNITION: {
    velocity: [0.4, 0.7],        // Building tx pressure
    ageScore: [0.5, 0.7],        // Mix of fresh and aged
    decayRate: [0.2, 0.4],       // Social catching fire
    liquidityDepth: [0.4, 0.6],  // Liquidity building
    confidence: [70, 85]
  },
  PEAK: {
    velocity: [0.85, 0.98],      // Maximum tx throughput
    ageScore: [0.2, 0.4],        // Snipers dominating
    decayRate: [0.05, 0.15],     // Viral explosion
    liquidityDepth: [0.8, 0.95], // Deep liquidity
    confidence: [85, 95]
  },
  DISTRIBUTION: {
    velocity: [0.4, 0.6],        // Selling pressure
    ageScore: [0.3, 0.5],        // Holders exiting
    decayRate: [0.5, 0.7],       // Social fading
    liquidityDepth: [0.5, 0.7],  // Liquidity pulling
    confidence: [40, 60]
  },
  DEAD: {
    velocity: [0.01, 0.05],      // Ghost chain
    ageScore: [0.7, 0.9],        // Bag holders left
    decayRate: [0.9, 0.98],      // Social silence
    liquidityDepth: [0.05, 0.1], // Dust
    confidence: [5, 20]
  }
};

const STAGE_PROGRESSION = ['SEEDING', 'IGNITION', 'PEAK', 'DISTRIBUTION', 'DEAD'];

export const useMLOOracle = (initialToken = 'WOJAK', autoCycle = true) => {
  const [token, setToken] = useState(initialToken);
  const [stage, setStage] = useState('SEEDING');
  const [stageIndex, setStageIndex] = useState(0);
  const [metrics, setMetrics] = useState({
    velocity: 0.08,
    ageScore: 0.87,
    decayRate: 0.85,
    liquidityDepth: 0.15,
    confidence: 52,
    peakHours: { start: 12, end: 16 }
  });
  
  const [history, setHistory] = useState([]);
  
  // Generate metrics based on current stage
  const generateMetrics = useCallback((currentStage) => {
    const pattern = LIFECYCLE_PATTERNS[currentStage];
    
    const randomInRange = (min, max) => min + Math.random() * (max - min);
    
    // Add micro-fluctuations to simulate real market noise
    const noise = 0.05;
    
    const velocity = randomInRange(pattern.velocity[0], pattern.velocity[1]) 
                     + (Math.random() - 0.5) * noise;
    const ageScore = randomInRange(pattern.ageScore[0], pattern.ageScore[1]) 
                     + (Math.random() - 0.5) * noise;
    const decayRate = randomInRange(pattern.decayRate[0], pattern.decayRate[1]) 
                      + (Math.random() - 0.5) * noise;
    const liquidityDepth = randomInRange(pattern.liquidityDepth[0], pattern.liquidityDepth[1]) 
                           + (Math.random() - 0.5) * noise;
    const confidence = randomInRange(pattern.confidence[0], pattern.confidence[1]);
    
    // Calculate peak hours based on stage
    let peakHours;
    if (currentStage === 'SEEDING') {
      peakHours = { start: 8, end: 24 };
    } else if (currentStage === 'IGNITION') {
      peakHours = { start: 2, end: 6 };
    } else if (currentStage === 'PEAK') {
      peakHours = { start: 0, end: 3 };
    } else if (currentStage === 'DISTRIBUTION') {
      peakHours = { start: 12, end: 18 };
    } else {
      peakHours = { start: 0, end: 0 };
    }
    
    return {
      velocity: Math.max(0, Math.min(1, velocity)),
      ageScore: Math.max(0, Math.min(1, ageScore)),
      decayRate: Math.max(0, Math.min(1, decayRate)),
      liquidityDepth: Math.max(0, Math.min(1, liquidityDepth)),
      confidence: Math.floor(confidence),
      peakHours
    };
  }, []);
  
  // Update metrics with realistic noise
  const updateMetrics = useCallback(() => {
    setMetrics(prev => {
      const pattern = LIFECYCLE_PATTERNS[stage];
      
      // Random walk within stage boundaries
      const walk = (value, min, max, step = 0.03) => {
        const change = (Math.random() - 0.5) * step;
        return Math.max(min, Math.min(max, value + change));
      };
      
      return {
        velocity: walk(prev.velocity, pattern.velocity[0], pattern.velocity[1]),
        ageScore: walk(prev.ageScore, pattern.ageScore[0], pattern.ageScore[1]),
        decayRate: walk(prev.decayRate, pattern.decayRate[0], pattern.decayRate[1]),
        liquidityDepth: walk(prev.liquidityDepth, pattern.liquidityDepth[0], pattern.liquidityDepth[1]),
        confidence: Math.floor(walk(prev.confidence, pattern.confidence[0], pattern.confidence[1], 2)),
        peakHours: prev.peakHours
      };
    });
  }, [stage]);
  
  // Progress to next stage
  const progressStage = useCallback(() => {
    setStageIndex(prev => {
      const next = (prev + 1) % STAGE_PROGRESSION.length;
      const newStage = STAGE_PROGRESSION[next];
      setStage(newStage);
      setMetrics(generateMetrics(newStage));
      return next;
    });
  }, [generateMetrics]);
  
  // Add to history
  useEffect(() => {
    setHistory(prev => [...prev, { 
      timestamp: Date.now(), 
      stage, 
      ...metrics 
    }].slice(-100)); // Keep last 100 data points
  }, [metrics, stage]);
  
  // Auto-cycle simulation
  useEffect(() => {
    if (!autoCycle) return;
    
    // Update metrics every 3 seconds (simulating on-chain data polling)
    const metricInterval = setInterval(updateMetrics, 3000);
    
    // Progress stage every 15 seconds (simulating market evolution)
    const stageInterval = setInterval(progressStage, 15000);
    
    return () => {
      clearInterval(metricInterval);
      clearInterval(stageInterval);
    };
  }, [autoCycle, updateMetrics, progressStage]);
  
  // Manual override functions
  const setStageManually = (newStage) => {
    const index = STAGE_PROGRESSION.indexOf(newStage);
    if (index !== -1) {
      setStageIndex(index);
      setStage(newStage);
      setMetrics(generateMetrics(newStage));
    }
  };
  
  const setTokenManually = (newToken) => {
    setToken(newToken);
    // Reset to SEEDING for new token
    setStageIndex(0);
    setStage('SEEDING');
    setMetrics(generateMetrics('SEEDING'));
    setHistory([]);
  };
  
  return {
    token,
    stage,
    metrics,
    history,
    setStage: setStageManually,
    setToken: setTokenManually,
    progressStage,
    isAutoCycling: autoCycle
  };
};