import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SeedGrowthEngine } from './SeedGrowthEngine';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Coins,
  Zap,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowUpRight,
  Flame,
  Globe,
  Radio,
  Cpu,
  Server,
  Sliders,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  BarChart3,
  Waves,
  Percent,
  Plus,
  ArrowRight,
  Info,
  MessageSquare,
  Send,
  ThumbsUp,
  User,
  Share2,
  MessageCircle,
  Filter,
  Palette,
  Wand2,
  Sprout,
  Calculator,
  CheckCircle
} from 'lucide-react';

export interface AINeonColorChoice {
  id: string;
  name: string;
  hex: string;
  textColor: string;
  borderColor: string;
  bgGlow: string;
  gradientFlow: string;
  ringColor: string;
  badgeBg: string;
  aiRationale: string;
}

export const AI_NEON_COLOR_PALETTE: AINeonColorChoice[] = [
  {
    id: 'cyberpunk_pink',
    name: 'Cyberpunk Neon Pink',
    hex: '#ff007f',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500',
    bgGlow: 'shadow-[0_0_25px_rgba(255,0,127,0.6)]',
    gradientFlow: 'from-transparent via-pink-500 to-transparent',
    ringColor: 'ring-pink-500',
    badgeBg: 'bg-pink-950/80 text-pink-300 border-pink-800',
    aiRationale: 'Selected for High Entropy Traffic Surge & Yield Spike Optimization'
  },
  {
    id: 'laser_emerald',
    name: 'Laser Neon Emerald',
    hex: '#00ff88',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    bgGlow: 'shadow-[0_0_25px_rgba(0,255,136,0.6)]',
    gradientFlow: 'from-transparent via-emerald-400 to-transparent',
    ringColor: 'ring-emerald-500',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    aiRationale: 'Selected for Proof-of-Traffic Maximum Network Efficiency'
  },
  {
    id: 'quantum_amber',
    name: 'Quantum Solar Amber',
    hex: '#ffaa00',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500',
    bgGlow: 'shadow-[0_0_25px_rgba(255,170,0,0.6)]',
    gradientFlow: 'from-transparent via-amber-400 to-transparent',
    ringColor: 'ring-amber-500',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800',
    aiRationale: 'Selected for £20,000 $DEPO Seed Vault Block Value Ascription'
  },
  {
    id: 'hyper_violet',
    name: 'Hyper Quantum Violet',
    hex: '#a855f7',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500',
    bgGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.6)]',
    gradientFlow: 'from-transparent via-purple-500 to-transparent',
    ringColor: 'ring-purple-500',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-800',
    aiRationale: 'Selected for Zero-Knowledge Sub-Network Node Mesh Alignment'
  },
  {
    id: 'electric_cyan',
    name: 'Electric Neon Cyan',
    hex: '#00f3ff',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    bgGlow: 'shadow-[0_0_25px_rgba(0,243,255,0.6)]',
    gradientFlow: 'from-transparent via-cyan-400 to-transparent',
    ringColor: 'ring-cyan-500',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
    aiRationale: 'Selected for Real-time Container Bandwidth Sub-Tunnel Sync'
  },
  {
    id: 'infrared_crimson',
    name: 'Infrared Plasma Crimson',
    hex: '#ff3366',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500',
    bgGlow: 'shadow-[0_0_25px_rgba(255,51,102,0.6)]',
    gradientFlow: 'from-transparent via-rose-500 to-transparent',
    ringColor: 'ring-rose-500',
    badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800',
    aiRationale: 'Selected for Dynamic Liquidity Rebalancing & Auto-Compounding'
  },
  {
    id: 'neon_lime',
    name: 'Radioactive Neon Lime',
    hex: '#84cc16',
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500',
    bgGlow: 'shadow-[0_0_25px_rgba(132,204,22,0.6)]',
    gradientFlow: 'from-transparent via-lime-400 to-transparent',
    ringColor: 'ring-lime-500',
    badgeBg: 'bg-lime-950/80 text-lime-300 border-lime-800',
    aiRationale: 'Selected for Maximum APY Yield Multiplier Acceleration'
  },
  {
    id: 'flare_gold',
    name: 'Supernova Golden Flare',
    hex: '#eab308',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    bgGlow: 'shadow-[0_0_25px_rgba(234,179,8,0.6)]',
    gradientFlow: 'from-transparent via-yellow-400 to-transparent',
    ringColor: 'ring-yellow-500',
    badgeBg: 'bg-yellow-950/80 text-yellow-300 border-yellow-800',
    aiRationale: 'Selected for Institutional Grade Vault Stability Verification'
  }
];

interface FarmingPool {
  id: string;
  name: string;
  pair: string;
  tvlUSD: number;
  baseApy: number;
  trafficBoostMaxApy: number;
  riskLevel: string;
  userStaked: number;
  lockDays: number;
  multiplier: string;
}

interface HarvestRecord {
  id: string;
  amountDepo: number;
  usdValue: number;
  timestamp: string;
  txHash: string;
}

interface UserPosition {
  userAddress: string;
  depoStakedAmount: number;
  depoPriceAtDeposit: number;
  stakedTimestamp: string;
  userAllocatedTrafficGbps: number;
  trafficMultiplier: number;
  pendingRewardsDepo: number;
  totalEarnedDepo: number;
  farmTier: string;
  boostMultiplier: number;
  lastHarvestTimestamp: string;
}

interface HistoricalTrend {
  epoch: string;
  depoPriceUSD: number;
  roiPercentage: number;
  tvlMillions: number;
  trafficGbps: number;
  randomYieldMultiplier: number;
}

interface CommunityFeedPost {
  id: string;
  authorAddress: string;
  authorTag: string;
  stakedTier: string;
  content: string;
  upvotes: number;
  isLiked: boolean;
  timestamp: string;
  badges: string[];
  repliesCount: number;
}

export const Web3FarmingStudio: React.FC = () => {
  const [vaultData, setVaultData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sub-navigation Section view
  const [activeSection, setActiveSection] = useState<'all' | 'growth_engine' | 'vaults' | 'analytics' | 'pipeline' | 'community'>('all');
  const [currencyMode, setCurrencyMode] = useState<'GBP' | 'USD'>('GBP');

  // Chart View Tab state
  const [chartMetric, setChartMetric] = useState<'price_roi' | 'tvl_bandwidth' | 'yield_multiplier'>('price_roi');

  // Animated Structure active node
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPulseActive, setIsPulseActive] = useState<boolean>(false);

  // AI Intentional Neon Pulsation Color State
  const [activeNeonChoice, setActiveNeonChoice] = useState<AINeonColorChoice>(AI_NEON_COLOR_PALETTE[1]); // Laser Neon Emerald
  const [autoCycleNeon, setAutoCycleNeon] = useState<boolean>(true);
  const [aiPulseCount, setAiPulseCount] = useState<number>(1);
  const [aiPulseNotice, setAiPulseNotice] = useState<string | null>("AI Choice: Initialized Laser Neon Emerald based on network traffic load.");

  // Community Feed state
  const [feedPosts, setFeedPosts] = useState<CommunityFeedPost[]>([]);
  const [feedFilter, setFeedFilter] = useState<'all' | 'traffic' | 'staking' | 'governance'>('all');
  const [newPostText, setNewPostText] = useState<string>('');
  const [newPostAuthorTag, setNewPostAuthorTag] = useState<string>('Quantum Staker');
  const [isPostingFeed, setIsPostingFeed] = useState<boolean>(false);
  const [postSuccessMsg, setPostSuccessMsg] = useState<string | null>(null);

  // Deposit Form state
  const [selectedPool, setSelectedPool] = useState<FarmingPool | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('0.50');
  const [trafficGbpsInput, setTrafficGbpsInput] = useState<number>(15);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Harvest state
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [harvestMsg, setHarvestMsg] = useState<string | null>(null);

  // Traffic Surge Boost state
  const [isBoostingTraffic, setIsBoostingTraffic] = useState<boolean>(false);
  const [trafficSurgeMsg, setTrafficSurgeMsg] = useState<string | null>(null);

  // Auto-compounding toggle
  const [autoCompound, setAutoCompound] = useState<boolean>(true);

  // 4 Seed Types Store & Server Ascription State
  const [seedCatalog, setSeedCatalog] = useState<any[]>([
    {
      id: "terras",
      name: "Terra's",
      category: "Terra Algorithmic Soil Seed",
      harvestCycle: "Monthly",
      harvestCycleDays: 30,
      basePriceDepo: 0.50,
      basePriceGBP: 10000,
      basePriceUSD: 13000,
      baseMultiplier: 1.25,
      estimatedApy: 125.0,
      entropyType: "Fundamentals (Protocol Usage & Fee-Burn Demand)",
      description: "Deep soil algorithmic seed engineered for steady monthly liquidity processing and protocol fee-burn capture.",
      serverSpecs: "Dedicated VOX Terra Node (4 vCPU / 16GB RAM / 10 Gbps Mesh)"
    },
    {
      id: "blunts",
      name: "Blunts",
      category: "High-Density Yearling Seed",
      harvestCycle: "Annual",
      harvestCycleDays: 365,
      basePriceDepo: 1.00,
      basePriceGBP: 20000,
      basePriceUSD: 26000,
      baseMultiplier: 2.50,
      estimatedApy: 185.0,
      entropyType: "Technicals (Chart Momentum & Orderbook Depth)",
      description: "Potent high-density annual seed with high technical entropy weighting and maximum year-long compounding returns.",
      serverSpecs: "Dedicated VOX Blunt Core Server (8 vCPU / 32GB RAM / 25 Gbps Pipeline)"
    },
    {
      id: "crops",
      name: "Crops",
      category: "Rapid Yield Seasonal Crop",
      harvestCycle: "Monthly",
      harvestCycleDays: 30,
      basePriceDepo: 0.25,
      basePriceGBP: 5000,
      basePriceUSD: 6500,
      baseMultiplier: 1.50,
      estimatedApy: 140.0,
      entropyType: "Balanced Fundamentals & Technicals",
      description: "Rapid growth monthly crop seed designed for quick liquidity harvesting and high velocity turnover.",
      serverSpecs: "Dedicated VOX Crop Harvester (2 vCPU / 8GB RAM / 5 Gbps Line)"
    },
    {
      id: "tubers",
      name: "Tubers",
      category: "Deep-Root Institutional Tuber",
      harvestCycle: "Annual",
      harvestCycleDays: 365,
      basePriceDepo: 2.50,
      basePriceGBP: 50000,
      basePriceUSD: 65000,
      baseMultiplier: 3.20,
      estimatedApy: 240.0,
      entropyType: "Natural Causes (Network Weather & Cosmic Entropy Noise)",
      description: "Heavy institutional tuber seed anchored deep into protocol node infrastructure for maximum annual yield resilience.",
      serverSpecs: "Dedicated VOX Tuber Institutional Vault Server (16 vCPU / 64GB RAM / 50 Gbps Direct Fiber)"
    }
  ]);

  const [purchasedSeeds, setPurchasedSeeds] = useState<any[]>([
    {
      id: "seed-inst-01",
      seedTypeId: "tubers",
      seedTypeName: "Tubers",
      amountDepo: 2.50,
      multiplier: 1.50,
      effectiveMultiplier: 2.25,
      harvestCycle: "Annual",
      valueGBP: 50000,
      valueUSD: 65000,
      plantedTimestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
      nextHarvestTimestamp: new Date(Date.now() + 86400000 * 353).toISOString(),
      ascribedServerId: "srv-depo-tubers-101",
      ascribedServerName: "VOX-Tubers-Dedicated-Node-101",
      ascribedServerIp: "10.142.4.88",
      entropyMetrics: {
        fundamentalsFactor: 1.14,
        technicalsFactor: 1.22,
        naturalCausesFactor: 1.08,
        combinedLiquidityEntropy: 1.48
      },
      projectedYieldGBP: 124000,
      projectedYieldUSD: 161200
    }
  ]);

  const [selectedSeedId, setSelectedSeedId] = useState<string>('tubers');
  const [plantDepoAmount, setPlantDepoAmount] = useState<string>('2.50');
  const [plantMultiplier, setPlantMultiplier] = useState<string>('1.50');
  const [isPurchasingSeed, setIsPurchasingSeed] = useState<boolean>(false);
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);
  const [ascribedServerResult, setAscribedServerResult] = useState<any | null>(null);

  // Random Entropy Causation Sliders State
  const [entropyFundamentals, setEntropyFundamentals] = useState<number>(1.18);
  const [entropyTechnicals, setEntropyTechnicals] = useState<number>(1.25);
  const [entropyNaturalCauses, setEntropyNaturalCauses] = useState<number>(1.12);

  useEffect(() => {
    fetchFarmingState();
    fetchSeedStoreData();

    // Auto-poll state every 4 seconds to simulate dynamic traffic entropy & randomized block yields
    const interval = setInterval(() => {
      fetchFarmingState(true);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchSeedStoreData = async () => {
    try {
      const res = await fetch('/api/web3-farming/seeds');
      if (res.ok) {
        const json = await res.json();
        if (json.catalog) setSeedCatalog(json.catalog);
        if (json.purchasedSeeds) setPurchasedSeeds(json.purchasedSeeds);
      }
    } catch (err) {
      console.warn('Could not fetch seed store catalog, using default seeds.');
    }
  };

  const handlePurchaseSeed = async () => {
    setIsPurchasingSeed(true);
    setPurchaseNotice(null);
    setAscribedServerResult(null);

    try {
      const res = await fetch('/api/web3-farming/purchase-seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedTypeId: selectedSeedId,
          amountDepoInput: plantDepoAmount,
          multiplierInput: plantMultiplier
        })
      });

      const data = await res.json();
      if (data.success) {
        setPurchaseNotice(data.message);
        if (data.seedInstance) {
          setPurchasedSeeds(prev => [data.seedInstance, ...prev]);
        }
        if (data.ascribedServer) {
          setAscribedServerResult(data.ascribedServer);
        }
        fetchFarmingState(true);
      } else {
        setPurchaseNotice(data.error || 'Failed to complete seed purchase.');
      }
    } catch (err) {
      setPurchaseNotice('Error executing seed purchase and dedicated server ascription.');
    } finally {
      setIsPurchasingSeed(false);
    }
  };

  // Auto-Cycle AI Intentional Neon Color Pulsation
  useEffect(() => {
    if (!autoCycleNeon) return;

    const pulseInterval = setInterval(() => {
      triggerQuantumTopologyPulse();
    }, 4500);

    return () => clearInterval(pulseInterval);
  }, [autoCycleNeon, activeNeonChoice.id]);

  const fetchFarmingState = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch('/api/web3-farming/state');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setVaultData(json.data);
          if (json.data.communityFeed) {
            setFeedPosts(json.data.communityFeed);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching Web3 farming vault state:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handlePublishFeedPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText || !newPostText.trim()) return;
    setIsPostingFeed(true);
    setPostSuccessMsg(null);

    try {
      const res = await fetch('/api/web3-farming/community-feed/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostText,
          authorTag: newPostAuthorTag
        })
      });

      const data = await res.json();
      if (data.success && data.post) {
        setFeedPosts(prev => [data.post, ...prev]);
        setNewPostText('');
        setPostSuccessMsg('Published your post to $DEPO Proof-of-Traffic Community Feed!');
        setTimeout(() => setPostSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Error publishing feed post:', err);
    } finally {
      setIsPostingFeed(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      setFeedPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            upvotes: p.isLiked ? p.upvotes - 1 : p.upvotes + 1
          };
        }
        return p;
      }));

      await fetch('/api/web3-farming/community-feed/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
    } catch (err) {
      console.error('Error liking feed post:', err);
    }
  };

  const triggerQuantumTopologyPulse = (specificChoice?: AINeonColorChoice) => {
    let selected = specificChoice;
    if (!selected) {
      const remaining = AI_NEON_COLOR_PALETTE.filter(c => c.id !== activeNeonChoice.id);
      selected = remaining[Math.floor(Math.random() * remaining.length)];
    }

    setActiveNeonChoice(selected);
    setIsPulseActive(true);
    setAiPulseCount(prev => prev + 1);
    setAiPulseNotice(`AI Intentional Choice: Switched Neon Aura to ${selected.name} (${selected.hex}) — ${selected.aiRationale}`);

    setTimeout(() => {
      setIsPulseActive(false);
    }, 2800);
  };

  const handleDepositSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    setIsDepositing(true);
    setDepositSuccessMsg(null);

    try {
      const res = await fetch('/api/web3-farming/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: selectedPool?.id || 'pool-depo-traffic',
          amountDepo: depositAmount,
          trafficAllocationGbps: trafficGbpsInput
        })
      });

      const data = await res.json();
      if (data.success) {
        setDepositSuccessMsg(data.message);
        setSelectedPool(null);
        triggerQuantumTopologyPulse();
        fetchFarmingState();
      }
    } catch (err) {
      console.error('Error executing seed deposit:', err);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleHarvest = async () => {
    setIsHarvesting(true);
    setHarvestMsg(null);

    try {
      const res = await fetch('/api/web3-farming/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (data.success) {
        setHarvestMsg(data.message);
        triggerQuantumTopologyPulse();
        fetchFarmingState();
      } else {
        setHarvestMsg(data.error || 'Failed to harvest rewards.');
      }
    } catch (err) {
      console.error('Error harvesting rewards:', err);
    } finally {
      setIsHarvesting(false);
    }
  };

  const handleInjectTrafficSurge = async () => {
    setIsBoostingTraffic(true);
    setTrafficSurgeMsg(null);

    try {
      const res = await fetch('/api/web3-farming/boost-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addTrafficGbps: 25.0 })
      });

      const data = await res.json();
      if (data.success) {
        setTrafficSurgeMsg(data.message);
        triggerQuantumTopologyPulse();
        fetchFarmingState();
      }
    } catch (err) {
      console.error('Error injecting traffic surge:', err);
    } finally {
      setIsBoostingTraffic(false);
    }
  };

  if (isLoading && !vaultData) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center space-y-4 font-mono text-zinc-300">
        <RefreshCw className="h-10 w-10 animate-spin text-emerald-400 mx-auto" />
        <p className="text-sm font-bold text-white">Connecting to $DEPO Quantum Yield Matrix &amp; Proof-of-Traffic Engine...</p>
        <p className="text-xs text-zinc-500">Synchronizing global server node bandwidth &amp; value-ascription contracts...</p>
      </div>
    );
  }

  const userPos: UserPosition = vaultData?.userPosition || {
    userAddress: "0x7F9...4A21",
    depoStakedAmount: 2.50,
    depoPriceAtDeposit: 18500,
    stakedTimestamp: new Date().toISOString(),
    userAllocatedTrafficGbps: 42.8,
    trafficMultiplier: 2.15,
    pendingRewardsDepo: 0.3125,
    totalEarnedDepo: 1.28,
    farmTier: "QUANTUM_NODE_OPERATOR",
    boostMultiplier: 2.85,
    lastHarvestTimestamp: new Date().toISOString()
  };

  const pools: FarmingPool[] = vaultData?.pools || [];
  const depoPrice = vaultData?.depoPriceUSD || 20000;
  const tvl = vaultData?.totalValueLockedUSD || 42890120;
  const globalTraffic = vaultData?.networkTrafficGlobalGbps || 1840.5;

  const trendData: HistoricalTrend[] = vaultData?.historicalTrendData || [
    { epoch: "Epoch 01", depoPriceUSD: 12400, roiPercentage: 35.2, tvlMillions: 5.2, trafficGbps: 320, randomYieldMultiplier: 1.12 },
    { epoch: "Epoch 02", depoPriceUSD: 14800, roiPercentage: 58.4, tvlMillions: 9.8, trafficGbps: 580, randomYieldMultiplier: 1.45 },
    { epoch: "Epoch 03", depoPriceUSD: 16200, roiPercentage: 82.1, tvlMillions: 14.5, trafficGbps: 840, randomYieldMultiplier: 1.80 },
    { epoch: "Epoch 04", depoPriceUSD: 17500, roiPercentage: 115.0, tvlMillions: 22.1, trafficGbps: 1120, randomYieldMultiplier: 2.10 },
    { epoch: "Epoch 05", depoPriceUSD: 18800, roiPercentage: 164.8, tvlMillions: 29.4, trafficGbps: 1390, randomYieldMultiplier: 2.35 },
    { epoch: "Epoch 06", depoPriceUSD: 19400, roiPercentage: 210.5, tvlMillions: 35.8, trafficGbps: 1610, randomYieldMultiplier: 2.60 },
    { epoch: "Epoch 07", depoPriceUSD: 19850, roiPercentage: 258.0, tvlMillions: 39.2, trafficGbps: 1750, randomYieldMultiplier: 2.75 },
    { epoch: "Epoch 08 (Now)", depoPriceUSD: 20000, roiPercentage: 312.4, tvlMillions: 42.8, trafficGbps: 1840, randomYieldMultiplier: 2.85 }
  ];

  // Custom Dark Neon Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950/95 border border-emerald-500/50 rounded-xl p-3 shadow-2xl font-mono text-xs space-y-1.5 backdrop-blur-md">
          <p className="text-zinc-400 font-bold border-b border-zinc-800 pb-1 text-[11px]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1.5" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-bold">{entry.name}:</span>
              </span>
              <span className="font-black text-white">
                {entry.unit === '£' ? `£${entry.value.toLocaleString()}` : entry.unit ? `${entry.value} ${entry.unit}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 4 Stages of the Animated Farming Structure
  const topologyStages = [
    {
      step: 1,
      title: "Seed Deposit Vault",
      subtitle: "User $DEPO Staking Pool",
      icon: Coins,
      color: "emerald",
      bgBorder: "border-emerald-500/40 bg-emerald-950/30",
      activeText: "text-emerald-400",
      description: "Users seed $DEPO tokens into time-locked quantum smart contracts. Staked deposits unlock bandwidth allocation slots and establish base liquidity.",
      metricLabel: "Total Staked Seeds",
      metricValue: `${userPos.depoStakedAmount.toFixed(2)} $DEPO (£${(userPos.depoStakedAmount * depoPrice).toLocaleString()})`
    },
    {
      step: 2,
      title: "Server Traffic Ingress",
      subtitle: "Proof-of-Traffic (PoT) Mesh",
      icon: Radio,
      color: "cyan",
      bgBorder: "border-cyan-500/40 bg-cyan-950/30",
      activeText: "text-cyan-300",
      description: "Live container node traffic (Gbps) measures physical network utilization. High server activity directly pumps energy into yield multipliers.",
      metricLabel: "Node Traffic Rate",
      metricValue: `${userPos.userAllocatedTrafficGbps} Gbps (${userPos.trafficMultiplier}x)`
    },
    {
      step: 3,
      title: "Quantum Entropy Gateway",
      subtitle: "Dynamic Randomized Yield Engine",
      icon: Cpu,
      color: "purple",
      bgBorder: "border-purple-500/40 bg-purple-950/30",
      activeText: "text-purple-300",
      description: "Applies pseudo-quantum noise and traffic entropy to calculate randomized block rewards, preventing front-running bots and stabilizing yields.",
      metricLabel: "Yield Multiplier",
      metricValue: `${userPos.boostMultiplier}x Boost`
    },
    {
      step: 4,
      title: "Value Ascription & Harvest",
      subtitle: "$DEPO Appreciation & Emission",
      icon: Flame,
      color: "amber",
      bgBorder: "border-amber-500/40 bg-amber-950/30",
      activeText: "text-amber-300",
      description: "Dynamic reward tokens are continuously minted and ascribed back to $DEPO value through systematic fee-burns and product utility demand.",
      metricLabel: "Pending Yield",
      metricValue: `${userPos.pendingRewardsDepo.toFixed(4)} $DEPO (£${(userPos.pendingRewardsDepo * depoPrice).toLocaleString('en-GB', { maximumFractionDigits: 2 })})`
    }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      
      {/* FUTURISTIC WEB3 HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-black border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Animated Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center space-x-1">
                <Coins className="h-3 w-3 text-emerald-400" />
                <span>Web3 Yield &amp; $DEPO Value Ascription Matrix</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-bold flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Proof-of-Traffic Mining</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-2">
              <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]">$DEPO</span>
              <span className="text-zinc-100 italic font-serif">Futuristic Decentralized Farming</span>
            </h2>

            <p className="text-xs text-zinc-300 mt-1.5 max-w-2xl leading-relaxed font-sans">
              The core product is the token ($DEPO). Yield outputs dynamically randomize and scale based on <strong>real-time user server traffic</strong>, <strong>custom seed deposits</strong>, and <strong>decentralized value ascription algorithms</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 relative z-10">
            <button
              onClick={handleInjectTrafficSurge}
              disabled={isBoostingTraffic}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs transition-all flex items-center space-x-2 shadow-lg shadow-emerald-950/80 shrink-0 cursor-pointer"
            >
              {isBoostingTraffic ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-black" />}
              <span>Inject Traffic Surge (+25 Gbps)</span>
            </button>

            <button
              onClick={() => setSelectedPool(pools[2] || pools[0])}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center space-x-1.5 shadow-lg shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Seed Deposit $DEPO</span>
            </button>
          </div>
        </div>

        {/* Real-time Ticker Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
          <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-3 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Base Coin Price</span>
            <div className="text-lg font-black text-emerald-300 flex items-center space-x-1">
              <span>£{depoPrice.toLocaleString()} GBP</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">+14.2%</span>
            </div>
            <span className="text-[9px] text-emerald-400/80 font-bold block">1 $DEPO = 20k Pounds Standard</span>
          </div>

          <div className="bg-black/60 border border-zinc-800 rounded-xl p-3 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total Value Locked</span>
            <div className="text-lg font-black text-white">
              £{(tvl).toLocaleString()} GBP
            </div>
            <span className="text-[9px] text-zinc-500 block">Across 3 Yield Pools</span>
          </div>

          <div
            className="bg-black/60 border rounded-xl p-3 space-y-0.5 transition-all"
            style={{
              borderColor: `${activeNeonChoice.hex}60`,
              boxShadow: `0 0 15px ${activeNeonChoice.hex}30`
            }}
          >
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Global Server Traffic</span>
            <div className="text-lg font-black flex items-center space-x-1" style={{ color: activeNeonChoice.hex }}>
              <Radio className="h-4 w-4 animate-pulse" style={{ color: activeNeonChoice.hex }} />
              <span>{globalTraffic} Gbps</span>
            </div>
            <span className="text-[9px] font-bold block" style={{ color: activeNeonChoice.hex }}>
              Pulsing {activeNeonChoice.name}
            </span>
          </div>

          <div className="bg-black/60 border border-purple-500/30 rounded-xl p-3 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Your Boost Multiplier</span>
            <div className="text-lg font-black text-purple-300 flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>{userPos.boostMultiplier}x Yield</span>
            </div>
            <span className="text-[9px] text-purple-400/80 block">Proof-of-Traffic Tier</span>
          </div>
        </div>

        {/* AI Intentional Neon Aura Bar */}
        <div className="p-3 rounded-xl bg-black/80 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="h-3.5 w-3.5 rounded-full animate-ping absolute opacity-75" style={{ backgroundColor: activeNeonChoice.hex }} />
              <span className="h-3 w-3 rounded-full relative" style={{ backgroundColor: activeNeonChoice.hex }} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">AI Intentional Neon Pulsation:</span>
                <span className="font-extrabold text-white" style={{ color: activeNeonChoice.hex }}>
                  {activeNeonChoice.name} ({activeNeonChoice.hex})
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-sans mt-0.5">{activeNeonChoice.aiRationale}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 text-xs">
            <button
              onClick={() => triggerQuantumTopologyPulse()}
              className="px-3 py-1.5 rounded-lg font-black text-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              style={{ backgroundColor: activeNeonChoice.hex }}
            >
              <Wand2 className="h-3.5 w-3.5 text-black" />
              <span>Random AI Pulse</span>
            </button>
            <button
              onClick={() => setAutoCycleNeon(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                autoCycleNeon
                  ? 'bg-zinc-800 border-zinc-600 text-white'
                  : 'bg-black border-zinc-800 text-zinc-500'
              }`}
            >
              <span>Auto-Cycle: {autoCycleNeon ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {trafficSurgeMsg && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>{trafficSurgeMsg}</span>
          </div>
          <button onClick={() => setTrafficSurgeMsg(null)} className="text-zinc-500 hover:text-white font-bold text-xs">Dismiss</button>
        </div>
      )}

      {depositSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{depositSuccessMsg}</span>
          </div>
          <button onClick={() => setDepositSuccessMsg(null)} className="text-zinc-500 hover:text-white font-bold text-xs">Dismiss</button>
        </div>
      )}

      {harvestMsg && (
        <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{harvestMsg}</span>
          </div>
          <button onClick={() => setHarvestMsg(null)} className="text-zinc-500 hover:text-white font-bold text-xs">Dismiss</button>
        </div>
      )}

      {/* WEB3 $DEPO FEATURE NAVIGATION SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'all'
                ? 'bg-emerald-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>All Modules</span>
          </button>

          <button
            onClick={() => setActiveSection('growth_engine')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'growth_engine'
                ? 'bg-emerald-400 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Sprout className="h-4 w-4 text-emerald-400" />
            <span>SeedGrowthEngine™</span>
          </button>

          <button
            onClick={() => setActiveSection('vaults')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'vaults'
                ? 'bg-emerald-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>Farming Vaults &amp; Seed Staking</span>
          </button>

          <button
            onClick={() => setActiveSection('analytics')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'analytics'
                ? 'bg-emerald-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Recharts Analytics</span>
          </button>

          <button
            onClick={() => setActiveSection('pipeline')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'pipeline'
                ? 'bg-emerald-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Topology Pipeline</span>
          </button>

          <button
            onClick={() => setActiveSection('community')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'community'
                ? 'bg-cyan-400 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            <span>Community Feed &amp; Web3 Discussion</span>
            <span className="px-1.5 py-0.2 rounded bg-black/40 text-cyan-300 text-[10px] font-mono">{feedPosts.length}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. COMMUNITY FEED & WEB3 DISCUSSION SECTION                               */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'community') && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white">$DEPO Proof-of-Traffic Community Feed</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Share node performance, traffic surge alerts, yield strategies, and value-ascription governance discussions with fellow $DEPO stakers.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-zinc-400">Filter Feed:</span>
              <div className="flex items-center space-x-1 bg-black p-1 rounded-xl border border-zinc-800">
                {(['all', 'traffic', 'staking', 'governance'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFeedFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all cursor-pointer ${
                      feedFilter === cat
                        ? 'bg-cyan-400 text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {postSuccessMsg && (
            <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-800 text-cyan-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>{postSuccessMsg}</span>
            </div>
          )}

          {/* Post Creation Form */}
          <form onSubmit={handlePublishFeedPost} className="bg-black/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-cyan-300 text-xs">
                  {userPos.userAddress.substring(2, 4)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{userPos.userAddress}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{userPos.farmTier}</span>
                </div>
              </div>

              <input
                type="text"
                value={newPostAuthorTag}
                onChange={(e) => setNewPostAuthorTag(e.target.value)}
                placeholder="Your Author Badge/Tag"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <textarea
              rows={3}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share a $DEPO farming strategy, traffic allocation update, or community thought..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-sans"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-2 text-[11px] text-zinc-500">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {userPos.userAllocatedTrafficGbps} Gbps Node Active
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  Proof-of-Traffic Verified
                </span>
              </div>

              <button
                type="submit"
                disabled={isPostingFeed || !newPostText.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-black text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                {isPostingFeed ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Publish Feed Post</span>
              </button>
            </div>
          </form>

          {/* Community Feed Stream */}
          <div className="space-y-3">
            {feedPosts
              .filter(post => {
                if (feedFilter === 'traffic') return post.content.toLowerCase().includes('traffic') || post.content.toLowerCase().includes('gbps');
                if (feedFilter === 'staking') return post.content.toLowerCase().includes('stak') || post.content.toLowerCase().includes('yield');
                if (feedFilter === 'governance') return post.content.toLowerCase().includes('burn') || post.content.toLowerCase().includes('ascription');
                return true;
              })
              .map(post => (
                <div key={post.id} className="bg-black/50 border border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl p-4 space-y-3 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-950 to-emerald-950 border border-cyan-800 flex items-center justify-center text-cyan-300 font-bold text-xs">
                        {post.authorAddress.substring(2, 4)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white font-mono">{post.authorAddress}</span>
                          <span className="px-2 py-0.2 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] text-emerald-300 font-bold">
                            {post.authorTag}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-500 mt-0.5">
                          <span>{post.timestamp}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-mono">{post.stakedTier}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      {post.badges?.map((badge, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-[9px] font-mono">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed font-sans sm:pl-12">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900/80 text-xs text-zinc-400 sm:pl-12 font-mono">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          post.isLiked
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800 font-bold'
                            : 'bg-zinc-900/60 border-zinc-800 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${post.isLiked ? 'fill-cyan-300' : ''}`} />
                        <span>{post.upvotes} Upvotes</span>
                      </button>

                      <div className="flex items-center space-x-1 text-zinc-500 hover:text-zinc-300 cursor-pointer">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{post.repliesCount} Replies</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-zinc-600">Proof-of-Traffic Verified</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RECHARTS VISUALIZATION: HISTORICAL ROI & $DEPO APPRECIATION TRENDS    */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'analytics') && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Historical ROI &amp; $DEPO Value Appreciation Analytics</h3>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Live block epoch progression tracking $DEPO market price, staking yield ROI %, and TVL growth.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center space-x-1.5 bg-black p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setChartMetric('price_roi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartMetric === 'price_roi'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              $DEPO Price &amp; ROI %
            </button>

            <button
              onClick={() => setChartMetric('tvl_bandwidth')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartMetric === 'tvl_bandwidth'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              TVL ($M) &amp; Traffic (Gbps)
            </button>

            <button
              onClick={() => setChartMetric('yield_multiplier')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartMetric === 'yield_multiplier'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Yield Multipliers
            </button>
          </div>
        </div>

        {/* Recharts Canvas Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === 'price_roi' ? (
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="epoch" stroke="#71717a" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 10, fill: '#34d399' }} unit="£" />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 10, fill: '#fbbf24' }} unit="%" />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="depoPriceUSD" name="$DEPO Market Price (£)" unit="£" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#priceGradient)" />
                <Area yAxisId="right" type="monotone" dataKey="roiPercentage" name="Cumulative Staking ROI" unit="%" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#roiGradient)" />
              </AreaChart>
            ) : chartMetric === 'tvl_bandwidth' ? (
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="epoch" stroke="#71717a" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 10, fill: '#22d3ee' }} unit="M£" />
                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" tick={{ fontSize: 10, fill: '#c084fc' }} unit="Gbps" />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="tvlMillions" name="Total Value Locked (£M)" unit="M£" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#tvlGradient)" />
                <Area yAxisId="right" type="monotone" dataKey="trafficGbps" name="Global Node Traffic" unit="Gbps" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#trafficGradient)" />
              </AreaChart>
            ) : (
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="epoch" stroke="#71717a" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <YAxis stroke="#c084fc" tick={{ fontSize: 10, fill: '#c084fc' }} unit="x" domain={[1.0, 3.5]} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="randomYieldMultiplier" name="Quantum Entropy Yield Multiplier" unit="x Boost" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 8 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ANIMATED FARMING TOPOLOGY & VALUE ASCRIPTION STRUCTURE                */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'pipeline') && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5" style={{ color: activeNeonChoice.hex }} />
              <h3 className="text-sm font-bold text-white">Interactive Animated $DEPO Farming Architecture</h3>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Click any stage to inspect live PoT data streams and trigger AI intentional quantum energy pulses through the mesh.
            </p>
          </div>

          <button
            onClick={() => triggerQuantumTopologyPulse()}
            className="px-4 py-2 rounded-xl text-black font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shrink-0"
            style={{ backgroundColor: activeNeonChoice.hex, boxShadow: `0 0 15px ${activeNeonChoice.hex}80` }}
          >
            <Zap className={`h-4 w-4 text-black ${isPulseActive ? 'animate-bounce' : ''}`} />
            <span>{isPulseActive ? 'AI Pulse Flow Active...' : 'Trigger AI Neon Pulse'}</span>
          </button>
        </div>

        {/* AI Intentional Neon Color Swatch Selector Bar */}
        <div className="p-3 bg-black/80 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs">
              <Palette className="h-4 w-4" style={{ color: activeNeonChoice.hex }} />
              <span className="font-bold text-white">AI Intentional Neon Color Palette:</span>
              <span className="text-[10px] text-zinc-400 font-sans">Pick an AI-selected neon hue or let the AI auto-cycle</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Pulsed {aiPulseCount} AI waves</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {AI_NEON_COLOR_PALETTE.map((choice) => {
              const isActive = activeNeonChoice.id === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => triggerQuantumTopologyPulse(choice)}
                  title={`${choice.name} (${choice.hex}): ${choice.aiRationale}`}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                    isActive
                      ? 'border-white text-white shadow-md'
                      : 'border-zinc-800 text-zinc-400 hover:text-white bg-zinc-950'
                  }`}
                  style={{
                    borderColor: isActive ? choice.hex : undefined,
                    backgroundColor: isActive ? `${choice.hex}30` : undefined,
                    boxShadow: isActive ? `0 0 10px ${choice.hex}60` : undefined
                  }}
                >
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: choice.hex }} />
                  <span style={{ color: isActive ? choice.hex : undefined }}>
                    {choice.name.replace('Neon ', '').replace('Quantum ', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Topology Nodes Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative pt-2">
          {topologyStages.map((stg, index) => {
            const IconComp = stg.icon;
            const isSelected = activeStage === index;

            return (
              <motion.div
                key={stg.step}
                onClick={() => setActiveStage(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 bg-black/60`}
                style={{
                  borderColor: isSelected || isPulseActive ? activeNeonChoice.hex : 'rgba(39, 39, 42, 0.8)',
                  boxShadow: isSelected || isPulseActive ? `0 0 20px ${activeNeonChoice.hex}60` : undefined
                }}
              >
                {/* Energy Pulse Flow Overlay Line */}
                {isPulseActive && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.2, delay: index * 0.25, repeat: Infinity }}
                    className={`absolute inset-x-0 top-0 h-1.5 z-20 bg-gradient-to-r ${activeNeonChoice.gradientFlow}`}
                    style={{ boxShadow: `0 0 16px ${activeNeonChoice.hex}` }}
                  />
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400`}>
                      STAGE 0{stg.step}
                    </span>
                    <div className="p-1.5 rounded-lg bg-black border border-zinc-800" style={{ color: activeNeonChoice.hex }}>
                      <IconComp className="h-4 w-4" />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white">{stg.title}</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{stg.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">{stg.metricLabel}</span>
                  <span className="text-xs font-black" style={{ color: activeNeonChoice.hex }}>{stg.metricValue}</span>
                </div>

                {/* Arrow indicator between stages */}
                {index < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-zinc-700 bg-zinc-950 p-1 rounded-full border border-zinc-800">
                    <ArrowRight className="h-3 w-3" style={{ color: activeNeonChoice.hex }} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Selected Stage Detail Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-black/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold border"
                  style={{
                    backgroundColor: `${activeNeonChoice.hex}20`,
                    borderColor: `${activeNeonChoice.hex}60`,
                    color: activeNeonChoice.hex
                  }}
                >
                  Inspect Stage 0{topologyStages[activeStage].step}
                </span>
                <span className="font-bold text-white text-sm">{topologyStages[activeStage].title}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed font-sans max-w-3xl">
                {topologyStages[activeStage].description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1 shrink-0 text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Stage Metric</span>
              <span className="text-sm font-black" style={{ color: activeNeonChoice.hex }}>
                {topologyStages[activeStage].metricValue}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      )}

      {/* 4 SEED TYPES FARM STORE & DEDICATED SERVER ASCRIPTION ENGINE (SeedGrowthEngine Module) */}
      {(activeSection === 'all' || activeSection === 'vaults' || activeSection === 'growth_engine') && (
        <SeedGrowthEngine
          seedCatalog={seedCatalog}
          purchasedSeeds={purchasedSeeds}
          onPlantSeed={async (seedTypeId: string, amountDepo: string, multiplier: string) => {
            setSelectedSeedId(seedTypeId);
            setPlantDepoAmount(amountDepo);
            setPlantMultiplier(multiplier);

            setIsPurchasingSeed(true);
            setPurchaseNotice(null);
            setAscribedServerResult(null);

            try {
              const res = await fetch('/api/web3-farming/purchase-seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  seedTypeId,
                  amountDepoInput: amountDepo,
                  multiplierInput: multiplier
                })
              });

              const data = await res.json();
              if (data.success) {
                setPurchaseNotice(data.message);
                if (data.seedInstance) {
                  setPurchasedSeeds(prev => [data.seedInstance, ...prev]);
                }
                if (data.ascribedServer) {
                  setAscribedServerResult(data.ascribedServer);
                }
                triggerQuantumTopologyPulse();
                fetchFarmingState(true);
              } else {
                setPurchaseNotice(data.error || 'Failed to complete seed purchase.');
              }
            } catch (err) {
              setPurchaseNotice('Error executing seed purchase and dedicated server ascription.');
            } finally {
              setIsPurchasingSeed(false);
            }
          }}
          currencyMode={currencyMode}
          onToggleCurrency={(mode) => setCurrencyMode(mode)}
          isPurchasing={isPurchasingSeed}
          purchaseNotice={purchaseNotice}
          ascribedServerResult={ascribedServerResult}
        />
      )}

      {/* USER STAKING POSITION & LIVE REWARD HARVESTER */}
      {(activeSection === 'all' || activeSection === 'vaults') && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Live Farming Position & Traffic Yield Engine */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Your $DEPO Seed Position &amp; Traffic Output</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                {userPos.farmTier}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Seed Deposit Value */}
              <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2">
                <span className="text-[11px] text-zinc-400 font-bold uppercase block">Total Seeded Deposit</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-white">{userPos.depoStakedAmount.toFixed(2)} $DEPO</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    (£{(userPos.depoStakedAmount * depoPrice).toLocaleString()} GBP)
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800">
                  <span>Price at Deposit: £{userPos.depoPriceAtDeposit.toLocaleString()} GBP</span>
                  <span className="text-emerald-400 font-bold">+18.8% Value Growth</span>
                </div>
              </div>

              {/* Allocated Traffic Bandwidth */}
              <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2">
                <span className="text-[11px] text-cyan-400 font-bold uppercase block flex items-center space-x-1">
                  <Radio className="h-3.5 w-3.5" />
                  <span>Your Allocated Node Traffic</span>
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-cyan-300">{userPos.userAllocatedTrafficGbps} Gbps</span>
                  <span className="text-xs text-purple-300 font-bold">{userPos.trafficMultiplier}x Multiplier</span>
                </div>
                <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800">
                  <span>Traffic Entropy Factor: High</span>
                  <span className="text-cyan-400 font-bold">Randomizing Yield</span>
                </div>
              </div>
            </div>

            {/* HARVEST BLOCK BOX */}
            <div className="p-5 bg-gradient-to-r from-amber-950/60 via-zinc-950 to-black border border-amber-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Pending $DEPO Block Yield</span>
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-3xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    {userPos.pendingRewardsDepo.toFixed(4)} $DEPO
                  </span>
                  <span className="text-sm text-zinc-400 font-bold">
                    (~£{(userPos.pendingRewardsDepo * depoPrice).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GBP)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  Total Earned Lifetime: <strong className="text-emerald-400">{userPos.totalEarnedDepo.toFixed(2)} $DEPO (£{(userPos.totalEarnedDepo * depoPrice).toLocaleString()} GBP)</strong>
                </span>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={handleHarvest}
                  disabled={isHarvesting || userPos.pendingRewardsDepo <= 0}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/50 cursor-pointer"
                >
                  {isHarvesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
                  <span>Harvest $DEPO Yield</span>
                </button>

                <label className="flex items-center space-x-2 text-[10px] text-zinc-400 cursor-pointer justify-end">
                  <input
                    type="checkbox"
                    checked={autoCompound}
                    onChange={e => setAutoCompound(e.target.checked)}
                    className="rounded border-zinc-800 bg-black text-amber-500"
                  />
                  <span>Auto-Compound Yield to Deposit</span>
                </label>
              </div>
            </div>
          </div>

          {/* FUTURISTIC VALUE ASCRIPTION PROTOCOLS */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Decentralized Value Ascription Architecture ($DEPO Core)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Radio className="h-4 w-4" />
                  <span>1. Proof-of-Traffic (PoT)</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Server container network traffic acts as physical liquidity. High bandwidth node activity directly converts into higher randomized $DEPO block emissions.
                </p>
              </div>

              <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Sliders className="h-4 w-4" />
                  <span>2. Dynamic Randomized Output</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Output rewards are dynamically randomized by applying quantum network entropy noise, preventing front-running and rewarding sustained seed deposits.
                </p>
              </div>

              <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-2 text-purple-400 font-bold">
                  <TrendingUp className="h-4 w-4" />
                  <span>3. Autonomous Value Ascription</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Every transaction burns a fraction of non-staked fees while re-attaching product utility back into $DEPO, creating deflationary upward price momentum.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Deposit Seed Modal / Form & Active Pools */}
        <div className="space-y-6">
          {/* DEPOSIT SEED FORM */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <Coins className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Seed Deposit $DEPO Vault</h3>
            </div>

            <form onSubmit={handleDepositSeed} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Target Yield Pool</label>
                <select
                  value={selectedPool?.id || 'pool-depo-traffic'}
                  onChange={e => setSelectedPool(pools.find(p => p.id === e.target.value) || pools[0])}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {pools.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.baseApy}% - {p.trafficBoostMaxApy}% APY)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">
                  Deposit Amount ($DEPO Seeds)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    placeholder="Enter deposit amount..."
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-3 pr-16 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-bold"
                  />
                  <span className="absolute right-3 top-2.5 text-amber-400 font-bold text-xs">$DEPO</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Estimated Value: <strong className="text-emerald-400">£{((parseFloat(depositAmount) || 0) * depoPrice).toLocaleString('en-GB', { minimumFractionDigits: 2 })} GBP</strong>
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-zinc-300 font-bold mb-1">
                  <span>Allocate Server Node Traffic</span>
                  <span className="text-cyan-400 font-mono">{trafficGbpsInput} Gbps</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={trafficGbpsInput}
                  onChange={e => setTrafficGbpsInput(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                  <span>1 Gbps (Standard)</span>
                  <span>100 Gbps (Quantum Surge)</span>
                </div>
              </div>

              {/* Dynamic APY Preview Box */}
              <div className="p-3 bg-black border border-zinc-800 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between text-zinc-400">
                  <span>Base Pool APY:</span>
                  <span className="text-white font-bold">{selectedPool ? selectedPool.baseApy : 210}%</span>
                </div>
                <div className="flex justify-between text-cyan-400 font-bold">
                  <span>Traffic Boost Multiplier:</span>
                  <span>+{(trafficGbpsInput * 4.2).toFixed(1)}% APY</span>
                </div>
                <div className="flex justify-between text-amber-300 font-black pt-1 border-t border-zinc-800 text-xs">
                  <span>Projected Dynamic APY:</span>
                  <span>{((selectedPool ? selectedPool.baseApy : 210) + (trafficGbpsInput * 4.2)).toFixed(1)}% APY</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isDepositing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              >
                {isDepositing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
                <span>Confirm $DEPO Seed Deposit</span>
              </button>
            </form>
          </div>

          {/* HARVEST HISTORY LOG */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block border-b border-zinc-800 pb-2">
              Recent Yield Harvest Ledger
            </span>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs custom-scrollbar">
              {vaultData?.harvestHistory?.map((h: HarvestRecord) => (
                <div key={h.id} className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-300 block">+{h.amountDepo.toFixed(4)} $DEPO</span>
                    <span className="text-[10px] text-zinc-500">{h.timestamp}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 block">£{h.usdValue.toLocaleString()} GBP</span>
                    <span className="text-[9px] text-zinc-600 font-mono">{h.txHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* YIELD POOLS INDEX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-xs">
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <Coins className="h-4 w-4 text-emerald-400" />
            <span>Active Web3 $DEPO Yield Pools ({pools.length})</span>
          </h3>
          <span className="text-zinc-500 text-[11px]">Dynamic Proof-of-Traffic Output Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pools.map(pool => (
            <div
              key={pool.id}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-4 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white bg-black px-2.5 py-1 rounded-lg border border-zinc-800">
                    {pool.pair}
                  </span>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    {pool.multiplier} Boost
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{pool.name}</h4>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Base APY:</span>
                    <span className="text-emerald-400 font-bold">{pool.baseApy}%</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Max Traffic APY:</span>
                    <span className="text-cyan-300 font-bold">{pool.trafficBoostMaxApy}%</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Pool TVL:</span>
                    <span className="text-white font-bold">£{pool.tvlUSD.toLocaleString()} GBP</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Your Staked:</span>
                  <span className="text-amber-300 font-bold">{pool.userStaked.toFixed(2)} $DEPO (£{(pool.userStaked * depoPrice).toLocaleString()})</span>
                </div>

                <button
                  onClick={() => setSelectedPool(pool)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Seed Deposit to Pool</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
        </>
      )}

    </div>
  );
};
