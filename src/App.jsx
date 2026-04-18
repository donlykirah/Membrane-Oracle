import { MembraneView } from './components/MembraneView';
import { GasTuner } from './components/GasTuner';
import { FlockMentions } from './components/FlockMentions';
import { ConfidenceMeter } from './components/ConfidenceMeter';
import { StageBadge } from './components/StageBadge';
import { MembraneSkeleton, MetricSkeleton } from './components/LoadingSkeleton';
import { useBSCOracle } from './hooks/useBSCOracle';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';

// Popular BSC tokens with verified addresses
const POPULAR_TOKENS = [
  { symbol: 'CAKE', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', name: 'PancakeSwap' },
  { symbol: 'BABYDOGE', address: '0xc748673057861a797275CD8A068AbB95A902e8de', name: 'Baby Doge' },
  { symbol: 'FLOKI', address: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E', name: 'Floki' },
  { symbol: 'BONK', address: '0xA697e272A73744b343528C3Bc4702F2565b2F422', name: 'Bonk' },
  { symbol: 'PEPE', address: '0x25d2e80cB6B86881Fd7e07dd263Fb79f4AbE033c', name: 'Pepe' },
  { symbol: 'SHIB', address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D', name: 'Shiba Inu' },
  { symbol: 'LADYS', address: '0xBb6cDed6825f9adB4D9B6c8a01602F14Ef1b5e33', name: 'Milady' },
  { symbol: 'TURBO', address: '0x4FBb9d16E4453FfBc412EfcB1BA4B2db6b9063B4', name: 'Turbo' },
];

function App() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [useRealData, setUseRealData] = useState(false);
  const [selectedToken, setSelectedToken] = useState(POPULAR_TOKENS[0]);
  
  const { data, isLoading, isFetching, error, refetch, liveEvents } = useBSCOracle(
    useRealData ? (tokenAddress || selectedToken.address) : undefined,
    10000
  );
  
  const handleTokenSelect = (token) => {
    setSelectedToken(token);
    setTokenAddress(token.address);
  };
  
  const handleCustomAddress = (address) => {
    try {
      const checksumAddress = ethers.utils.getAddress(address);
      setTokenAddress(checksumAddress);
      setSelectedToken(null);
    } catch {
      setTokenAddress(address);
      setSelectedToken(null);
    }
  };
  
  const simulationData = {
    token: 'WOJAK',
    stage: 'IGNITION',
    confidence: 78,
    velocity: 0.65,
    ageScore: 0.4,
    decayRate: 0.23,
    liquidityDepth: 0.7,
    peakHours: { start: 4, end: 6 }
  };
  
  const displayData = useRealData && data ? data : simulationData;
  const showLoading = useRealData && isLoading;
  
  return (
    <main className="min-h-screen bg-black p-6 font-sans antialiased">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,229,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                MLO
              </span>
              <span className="text-white/20 font-light text-xl">|</span>
              <span className="text-white/60 text-lg font-normal">MEMBRANE ORACLE</span>
            </h1>
          </div>
          
          <button
            onClick={() => setUseRealData(!useRealData)}
            className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold transition-all
              ${useRealData 
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_#00e5ff]' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
          >
            {useRealData ? '🔴 BSC LIVE' : '🟡 SIMULATION'}
          </button>
        </div>
        
        {/* Token Selector */}
        {useRealData && (
          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOKENS.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all
                    ${selectedToken?.address === token.address 
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_#00e5ff]' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {token.symbol}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste any BSC token address (0x...)"
                value={tokenAddress}
                onChange={(e) => handleCustomAddress(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder:text-white/20"
              />
              <button
                onClick={refetch}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/10 disabled:text-white/40 text-black rounded-xl text-sm font-bold cursor-pointer transition-all"
              >
                Load
              </button>
            </div>
            
            {data?.tokenInfo && (
              <div className="flex items-center gap-4 text-xs">
                <span className="text-white/60">
                  Tracking: <span className="text-white font-bold">{data.tokenInfo.name}</span> (${data.token})
                </span>
                {data.priceUSD > 0 && (
                  <span className="text-cyan-400 font-mono">
                    ${data.priceUSD.toFixed(8)}
                  </span>
                )}
                {isFetching && (
                  <span className="text-cyan-400 text-[10px] animate-pulse">Updating...</span>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Status Bar */}
        {useRealData && (
          <div className="mb-4 p-2 bg-white/5 rounded-lg text-[10px] font-mono flex gap-6 items-center">
            <span className="text-white/40">
              Status: {isLoading ? 'Loading...' : isFetching ? 'Fetching...' : '✅ Connected'}
            </span>
            <span className="text-white/40">
              Stage: <span className="text-white font-bold">{data?.stage || 'N/A'}</span>
            </span>
            <span className="text-white/40">
              Events: <span className="text-cyan-400">{liveEvents.length}</span>
            </span>
            <button 
              onClick={refetch}
              className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-[9px]"
            >
              ⟳ Refresh
            </button>
          </div>
        )}
        
        {/* Error */}
        <AnimatePresence>
          {error && useRealData && (
            <motion.div 
              className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-rose-400 text-sm">
                ⚠️ {error.message || 'Connection error. Try another token or refresh.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading */}
        {showLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <MembraneSkeleton />
              <MetricSkeleton />
            </div>
            <div className="space-y-5">
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </div>
          </div>
        ) : (
          /* Main Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            <div className="lg:col-span-2 space-y-5">
              <MembraneView 
                velocity={displayData.velocity}
                ageScore={displayData.ageScore}
                decayRate={displayData.decayRate}
                stage={displayData.stage}
              />
              
              <GasTuner 
                liquidityDepth={displayData.liquidityDepth} 
                peakHours={displayData.peakHours}
                stage={displayData.stage}
                velocity={displayData.velocity}
              />
            </div>
            
            <div className="space-y-5">
              <ConfidenceMeter 
                confidence={displayData.confidence}
                stage={displayData.stage}
              />
              
              <FlockMentions 
                decayRate={displayData.decayRate} 
                stage={displayData.stage}
                token={displayData.token}
              />
              
              <StageBadge 
                stage={displayData.stage}
                ageScore={displayData.ageScore}
                liquidityDepth={displayData.liquidityDepth}
              />
              
              {useRealData && liveEvents.length > 0 && (
                <motion.div 
                  className="rounded-3xl glass p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live Mempool ({liveEvents.length})
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {liveEvents.slice(0, 8).map((event, i) => (
                      <div key={i} className="text-[10px] font-mono text-white/60 border-b border-white/5 pb-1">
                        <span className="text-cyan-400">
                          {event.value.toFixed(2)}
                        </span>
                        {' '}{displayData.token}
                        <div className="text-[8px] text-white/30 truncate">
                          {event.txHash?.slice(0, 12)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;