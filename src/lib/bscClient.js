import { ethers } from 'ethers';

// BSC Mainnet RPC endpoints with failover
const RPC_ENDPOINTS = [
  'https://bsc.publicnode.com',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed2.defibit.io'
];

// Known token addresses - using CAKE as default (very active)
export const KNOWN_TOKENS = {
  CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  BNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  WOJAK: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
};

const PANCAKE_FACTORY = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

const PAIR_ABI = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
];

const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

class BSCClient {
  constructor() {
    this.provider = null;
    this.isConnected = false;
    this.connect();
  }
  
  async connect() {
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(endpoint);
        await provider.getBlockNumber();
        
        this.provider = provider;
        this.isConnected = true;
        
        console.log(`[BSC] ✅ Connected to ${endpoint}`);
        return true;
      } catch (error) {
        console.warn(`[BSC] Failed ${endpoint}:`, error.message);
      }
    }
    
    this.isConnected = false;
    console.error('[BSC] ❌ All RPC endpoints failed');
    return false;
  }
  
  async ensureConnection() {
    if (!this.isConnected || !this.provider) {
      return await this.connect();
    }
    return true;
  }
  
  async watchTokenMempool(tokenAddress, callback) {
    const connected = await this.ensureConnection();
    if (!connected) return false;
    
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      contract.on('Transfer', (from, to, value, event) => {
        const formattedValue = parseFloat(ethers.utils.formatEther(value));
        console.log(`[BSC] 📤 Transfer: ${formattedValue.toFixed(2)} tokens`);
        
        callback({
          type: 'TRANSFER',
          from,
          to,
          value: formattedValue,
          txHash: event.transactionHash,
          timestamp: Date.now()
        });
      });
      
      console.log(`[BSC] 👁️ Watching mempool for ${tokenAddress}`);
      return true;
    } catch (error) {
      console.error(`[BSC] Failed to watch ${tokenAddress}:`, error);
      return false;
    }
  }
  
  async getTransactionVelocity(tokenAddress, blocksToCheck = 100) {
    const connected = await this.ensureConnection();
    if (!connected) return 0;
    
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      const filter = contract.filters.Transfer();
      const fromBlock = Math.max(0, currentBlock - blocksToCheck);
      
      const events = await contract.queryFilter(filter, fromBlock, currentBlock);
      
      if (events.length === 0) return 0;
      
      const oldestBlock = await this.provider.getBlock(fromBlock);
      const newestBlock = await this.provider.getBlock(currentBlock);
      const timeSpanMinutes = (newestBlock.timestamp - oldestBlock.timestamp) / 60;
      
      const tpm = events.length / Math.max(timeSpanMinutes, 1);
      
      console.log(`[BSC] 📊 ${events.length} transfers in ${timeSpanMinutes.toFixed(1)}min = ${tpm.toFixed(2)} TPM`);
      
      return Math.min(tpm / 30, 1);
    } catch (error) {
      console.error('[BSC] Velocity error:', error);
      return 0;
    }
  }
  
  async getLiquidityDepth(tokenAddress) {
    const connected = await this.ensureConnection();
    if (!connected) return { depthScore: 0, bnbLiquidity: 0, priceInUSD: 0 };
    
    try {
      const factory = new ethers.Contract(PANCAKE_FACTORY, FACTORY_ABI, this.provider);
      const wbnb = KNOWN_TOKENS.WBNB;
      
      const pairAddress = await factory.getPair(tokenAddress, wbnb);
      
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        console.log('[BSC] 💧 No liquidity pair found');
        return { depthScore: 0, bnbLiquidity: 0, priceInUSD: 0 };
      }
      
      const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
      const reserves = await pair.getReserves();
      const token0 = await pair.token0();
      
      const bnbReserve = token0.toLowerCase() === wbnb.toLowerCase() ? reserves[0] : reserves[1];
      const tokenReserve = token0.toLowerCase() === wbnb.toLowerCase() ? reserves[1] : reserves[0];
      
      const bnbAmount = parseFloat(ethers.utils.formatEther(bnbReserve));
      const tokenAmount = parseFloat(ethers.utils.formatEther(tokenReserve));
      const priceInBNB = tokenAmount > 0 ? bnbAmount / tokenAmount : 0;
      const priceInUSD = priceInBNB * 600;
      const depthScore = Math.min(bnbAmount / 100, 1);
      
      console.log(`[BSC] 💧 Liquidity: ${bnbAmount.toFixed(2)} BNB, Price: $${priceInUSD.toFixed(6)}`);
      
      return {
        depthScore,
        bnbLiquidity: bnbAmount,
        tokenLiquidity: tokenAmount,
        priceInBNB,
        priceInUSD,
        pairAddress
      };
    } catch (error) {
      console.error('[BSC] Liquidity error:', error);
      return { depthScore: 0, bnbLiquidity: 0, priceInUSD: 0 };
    }
  }
  
  async getTokenInfo(tokenAddress) {
    const connected = await this.ensureConnection();
    if (!connected) return null;
    
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);
      
      console.log(`[BSC] 🪙 Token: ${name} (${symbol})`);
      
      return {
        name,
        symbol,
        decimals,
        totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
        address: tokenAddress
      };
    } catch (error) {
      console.error('[BSC] Token info error:', error);
      return null;
    }
  }
  
  calculateStage(metrics) {
    const { velocity, liquidityDepth } = metrics;
    
    if (velocity < 0.05 && liquidityDepth < 0.1) return 'DEAD';
    if (velocity > 0.4 && velocity < 0.7 && liquidityDepth > 0.4) return 'DISTRIBUTION';
    if (velocity > 0.7 && liquidityDepth > 0.6) return 'PEAK';
    if (velocity > 0.2 && liquidityDepth > 0.2) return 'IGNITION';
    
    return 'SEEDING';
  }
  
  async getOracleData(tokenAddress) {
    const connected = await this.ensureConnection();
    if (!connected) {
      throw new Error('BSC connection failed');
    }
    
    console.log(`[BSC] 🔍 Fetching oracle data for ${tokenAddress}`);
    
    try {
      const tokenInfo = await this.getTokenInfo(tokenAddress);
      const liquidityData = await this.getLiquidityDepth(tokenAddress);
      const velocity = await this.getTransactionVelocity(tokenAddress);
      
      const stage = this.calculateStage({
        velocity,
        liquidityDepth: liquidityData.depthScore
      });
      
      const confidence = Math.floor(Math.min(60 + (velocity * 20) + (liquidityData.depthScore * 20), 95));
      
      const result = {
        token: tokenInfo?.symbol || 'UNKNOWN',
        tokenInfo,
        tokenAddress,
        stage,
        confidence,
        velocity,
        ageScore: 0.5,
        decayRate: Math.max(0, 0.5 - velocity * 0.3),
        liquidityDepth: liquidityData.depthScore,
        liquidityData,
        peakHours: {
          start: Math.max(0, Math.floor(12 - velocity * 8)),
          end: Math.min(23, Math.floor(16 + velocity * 8))
        },
        priceUSD: liquidityData.priceInUSD,
        lastUpdated: Date.now()
      };
      
      console.log(`[BSC] ✅ Oracle data ready: Stage=${stage}, Confidence=${confidence}%`);
      
      return result;
    } catch (error) {
      console.error('[BSC] Oracle data failed:', error);
      throw error;
    }
  }
  
  unwatchToken(tokenAddress) {
    if (this.provider) {
      this.provider.removeAllListeners();
    }
  }
}

let bscClientInstance = null;

export const getBSCClient = () => {
  if (!bscClientInstance) {
    bscClientInstance = new BSCClient();
  }
  return bscClientInstance;
};

export default BSCClient;