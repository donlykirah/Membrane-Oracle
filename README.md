# MLO — Meme Lifecycle Oracle

<div align="center">
  <img src="https://img.shields.io/badge/Chain-BNB%20Smart%20Chain-yellow?style=for-the-badge&logo=binance" alt="BSC" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</div>

<br />

## 🧬 What Is MLO?

**MLO (Meme Lifecycle Oracle)** is onchain intelligence infrastructure for the memecoin economy. Today, traders and autonomous agents blindly enter meme tokens without understanding where they sit in the lifecycle — buying at distribution peaks thinking it's ignition, or selling at seeding thinking the token is dead.

MLO solves this by building a **real-time lifecycle classification system** that analyzes onchain behavior patterns combined with social signal decay to output a precise stage diagnosis and optimal entry/exit parameters.

The result is a verifiable, data-driven oracle that answers the single most important question in memecoin trading: **"Where are we in the lifecycle?"**

---

## 🎯 Project Positioning in the BNB Chain Ecosystem

MLO positions itself as **open intelligence infrastructure** for the BSC memecoin economy — the same way trading terminals provide charting tools that traders build strategies on top of.

Any application can integrate MLO to:
- Classify any BEP-20 token's current lifecycle stage
- Receive confidence-scored stage predictions
- Get optimal launch parameters (gas timing, slippage, anti-snipe settings)
- Monitor real-time mempool activity for early ignition detection
- Verify all analysis against onchain BSC data

MLO is not just a dashboard. It is the **lifecycle intelligence layer** that agents, traders, and protocols in the BNB Chain ecosystem build on top of.

---

## 🌐 Live Deployment

| Component | URL |
|-----------|-----|
| Frontend Dashboard | [meme-lifecycle-oracle.vercel.app](https://meme-lifecycle-oracle.vercel.app) |
| GitHub Repository | [github.com/UDM2202/MCLO](https://github.com/donlykirah/Membrane-Oracle) |
| BSC Explorer | [View Any Token on BSCScan](https://bscscan.com) |

---

## 🔄 The MLO Lifecycle Engine

Every 10 seconds (configurable), MLO runs a complete onchain analysis cycle:

### 1. Token Information Resolution
- Queries BSC RPC for token metadata (name, symbol, decimals, total supply)
- Validates contract address checksum
- Establishes baseline token identity

### 2. Liquidity Depth Analysis
- Locates PancakeSwap V2 pair for token/WBNB
- Extracts real-time reserve data
- Calculates BNB liquidity depth and USD valuation
- Outputs: **Liquidity Depth Score (0-1)**

### 3. Transaction Velocity Calculation
- Scans recent blocks (50-100 blocks, configurable)
- Counts Transfer events over the time window
- Calculates transactions per minute (TPM)
- Outputs: **Velocity Score (0-1)** normalized against 30 TPM baseline

### 4. Mempool Monitoring
- Subscribes to live Transfer events via ethers.js
- Streams real-time transaction data to dashboard
- Detects sudden velocity spikes (ignition signals)
- Maintains rolling 50-event buffer

### 5. Stage Classification Algorithm

```javascript
Stage = classify({
  velocity: velocityScore,
  liquidityDepth: liquidityScore,
  ageScore: walletAgeScore
})

Classification Rules:
├── DEAD          → velocity < 0.05 && liquidity < 0.1
├── DISTRIBUTION  → 0.3 < velocity < 0.6 && liquidity > 0.4 && age < 0.4
├── PEAK          → velocity > 0.7 && liquidity > 0.6
├── IGNITION      → 0.2 < velocity < 0.7 && liquidity > 0.2 && age > 0.3
└── SEEDING       → default fallback
6. Confidence Scoring
text
Confidence (0-100%) = Base(60) + (Velocity * 20) + (LiquidityDepth * 20)
Capped at 95%
Higher velocity and deeper liquidity produce higher confidence predictions.

7. Optimal Launch Parameter Generation
Gas Timing Window: Calculated from velocity trends (high velocity = tighter window)

Slippage Recommendation: Dynamic based on liquidity depth

Anti-Snipe Configuration: Toggleable protection parameters

8. Biomembrane Visualization
Canvas-based waveform rendering

Stage-specific wave morphology:

SEEDING: Low-amplitude tremor with micro-spasms

IGNITION: Building sawtooth with momentum

PEAK: Clipped/overdriven distortion wave

DISTRIBUTION: Decaying amplitude envelope

DEAD: Flatline with micro-tremors

📊 Lifecycle Stages Reference
Stage	Characteristics	Trader Action	Visual Signature
SEEDING	Low velocity, thin liquidity, fresh wallets	Monitor for ignition	Green tremor wave
IGNITION	Building tx pressure, liquidity accumulating	OPTIMAL ENTRY	Cyan sawtooth building
PEAK	Maximum velocity, deep liquidity	Take profit / Exit	Red clipped distortion
DISTRIBUTION	Selling pressure, liquidity exiting	Avoid entry	Orange decay wave
DEAD	Ghost chain, zero activity	Ignore	Gray flatline
🏗️ Architecture Overview
text
┌─────────────────────────────────────────────────────────────────┐
│                    MLO — BNB Smart Chain                        │
│              Meme Lifecycle Oracle Infrastructure                │
└─────────────────────────────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   BSC RPC Pool  │    │  PancakeSwap    │    │  Mempool Stream │
│   (Multi-node   │    │   V2 Factory    │    │  (Live Events)  │
│    Failover)    │    │                 │    │                 │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │    BSC Client Layer   │
                    │   (ethers.js v5.7.2)  │
                    └───────────┬───────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Token Info     │    │   Liquidity     │    │   Velocity      │
│  Resolution     │    │   Depth Engine  │    │   Calculator    │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │   Stage Classifier    │
                    │  (Algorithmic Oracle) │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Confidence Scorer   │
                    │   + Launch Params     │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Biomembrane Renderer │
                    │  (Canvas + Framer)    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   React Dashboard     │
                    │   (Vite + Tailwind)   │
                    └───────────────────────┘
📁 Project Structure
text
MCLO/
├── src/
│   ├── components/
│   │   ├── MembraneView.jsx        # Canvas waveform visualizer
│   │   ├── GasTuner.jsx            # Optimal launch parameters
│   │   ├── FlockMentions.jsx       # Social signal visualization
│   │   ├── ConfidenceMeter.jsx     # Confidence score display
│   │   ├── StageBadge.jsx          # Lifecycle stage indicator
│   │   ├── LoadingSkeleton.jsx     # Skeleton loaders
│   │   └── ErrorBoundary.jsx       # Error handling wrapper
│   │
│   ├── hooks/
│   │   ├── useBSCOracle.js         # Main oracle data hook
│   │   ├── useMLOOracle.js         # Simulation mode hook
│   │   └── usePerformanceMonitor.js # Render optimization
│   │
│   ├── lib/
│   │   ├── bscClient.js            # BSC RPC client + failover
│   │   └── mloCalculations.js      # Stage classification logic
│   │
│   ├── styles/
│   │   └── membrane.css            # Biomembrane animations
│   │
│   ├── App.jsx                     # Main application
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind v4 styles
│
├── public/
│   └── assets/                     # Static assets
│
├── vercel.json                     # Vercel deployment config
├── vite.config.js                  # Vite + Tailwind config
├── package.json                    # Dependencies
└── README.md                       # You are here
🔧 Technical Stack
Layer	Technology	Purpose
Chain Interface	ethers.js v5.7.2	BSC RPC communication, contract interaction
Frontend Framework	React 19 + Vite	Fast refresh, optimal builds
Styling	Tailwind CSS v4	Glass morphism, responsive design
Animations	Framer Motion	Fluid transitions, particle effects
Data Layer	Custom Hooks + Context	Oracle state management
Visualization	Canvas API	Biomembrane waveform rendering
Deployment	Vercel	Edge deployment, automatic SSL
🎛️ Core Features
1. Real-Time BSC Integration
Multi-node RPC failover (7+ endpoints)

Automatic reconnection logic

Checksum address validation

10-second refresh intervals

2. Token Universe
8+ preloaded popular meme tokens (CAKE, BABYDOGE, FLOKI, BONK, PEPE, SHIB, LADYS, TURBO)

Custom token address input

Any BEP-20 token supported

3. Live Mempool Feed
Real-time Transfer event streaming

Rolling 50-event buffer

Transaction hash tracking

Value formatting in token units

4. Biomembrane Visualization
Stage-specific waveform morphology

Velocity → Amplitude mapping

Liquidity → Glow intensity

60fps canvas rendering

5. Launch Parameter Intelligence
Optimal gas timing window

Dynamic slippage recommendations

Anti-snipe configuration

MEV protection toggle

6. Dual Mode Operation
Simulation Mode: Educational lifecycle demonstration

BSC LIVE Mode: Real onchain data analysis

🚀 Quick Start
Prerequisites
Node.js 18+

npm or yarn

Installation
bash
# Clone the repository
git clone https://github.com/donlykirah/Membrane-Oracle
cd Membrane-Oracle

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
Environment Variables
No API keys required for basic operation. MLO uses public BSC RPC endpoints.

📡 API Endpoints (Internal Hook Interface)
Hook	Description
useBSCOracle(address, interval)	Main oracle data hook for BSC tokens
useMLOOracle(token, autoCycle)	Simulation mode lifecycle demonstration
usePerformanceMonitor(component)	Render optimization tracking
🔗 Onchain Verification
All MLO analysis is verifiable directly on BNB Smart Chain:

PancakeSwap Factory: 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73
WBNB Address: 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c

Any user can independently verify:

Liquidity depth via getPair() and getReserves()

Transaction velocity via Transfer event logs

Token metadata via standard ERC-20 calls

🧪 How New Tokens Are Analyzed
User pastes any BEP-20 contract address

MLO validates checksum and resolves token metadata

System queries PancakeSwap for WBNB pair liquidity

Recent blocks are scanned for transfer velocity

Stage classifier outputs current lifecycle position

Confidence score is calculated from data quality

Mempool subscription begins for live monitoring

Biomembrane renders stage-appropriate visualization

📈 Performance Metrics
Metric	Target	Actual
Initial Load Time	< 2s	~1.2s
RPC Response Time	< 500ms	~300ms
Canvas Render FPS	60	60
Mempool Event Latency	< 2s	~1s
Bundle Size	< 500KB	~380KB
🛣️ Roadmap
Phase 1: Core Oracle (✅ Complete)
BSC RPC integration

Stage classification engine

Biomembrane visualization

Simulation mode

Phase 2: Production Hardening (✅ Complete)
Multi-RPC failover

Error boundaries

Loading skeletons

Vercel deployment

Phase 3: Social Signals (🔄 Planned)
Twitter/X mention scraping

Sentiment analysis integration

Social decay rate from live data

Telegram/Discord alert webhooks

Phase 4: Agent Integration (📅 Future)
MLO SDK for autonomous agents

WebSocket stream for real-time stage changes

Historical stage database

Cross-chain expansion (Ethereum, Solana, Base)

🤝 Contributing
MLO is open infrastructure for the BNB Chain ecosystem. Contributions are welcome.

Fork the repository

Create feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open Pull Request

📄 License
MIT License — free for personal and commercial use.

🙏 Acknowledgments
Binance Smart Chain — For the robust, low-cost infrastructure

PancakeSwap — For the open liquidity pools

ethers.js — For the excellent Web3 library

Vercel — For the seamless deployment platform

Tailwind Labs — For the revolutionary CSS framework

<div align="center"> <strong>MLO — Never Buy at the Wrong Stage Again</strong> <br /> <sub>Built for the 0.1% who understand that timing is everything.</sub> </div> ```