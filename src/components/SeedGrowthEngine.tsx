import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Zap, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Server, 
  Coins, 
  ShieldCheck, 
  Sliders, 
  CheckCircle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Percent, 
  Activity, 
  DollarSign,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

export interface SeedType {
  id: string;
  name: string;
  category: string;
  harvestCycle: 'Monthly' | 'Annual';
  harvestCycleDays: number;
  basePriceDepo: number;
  basePriceGBP: number;
  basePriceUSD: number;
  baseMultiplier: number;
  estimatedApy: number;
  entropyType: string;
  description: string;
  serverSpecs: string;
}

export interface PurchasedSeedInstance {
  id: string;
  seedTypeId: string;
  seedTypeName: string;
  amountDepo: number;
  multiplier: number;
  effectiveMultiplier: number;
  harvestCycle: 'Monthly' | 'Annual';
  valueGBP: number;
  valueUSD: number;
  plantedTimestamp: string;
  nextHarvestTimestamp: string;
  ascribedServerId: string;
  ascribedServerName: string;
  ascribedServerIp: string;
  entropyMetrics: {
    fundamentalsFactor: number;
    technicalsFactor: number;
    naturalCausesFactor: number;
    combinedLiquidityEntropy: number;
  };
  projectedYieldGBP: number;
  projectedYieldUSD: number;
  growthProgressPct?: number;
}

interface SeedGrowthEngineProps {
  seedCatalog: SeedType[];
  purchasedSeeds: PurchasedSeedInstance[];
  onPlantSeed: (seedTypeId: string, amountDepo: string, multiplier: string) => Promise<void>;
  currencyMode: 'GBP' | 'USD';
  onToggleCurrency: (mode: 'GBP' | 'USD') => void;
  isPurchasing: boolean;
  purchaseNotice: string | null;
  ascribedServerResult: any | null;
}

export const SeedGrowthEngine: React.FC<SeedGrowthEngineProps> = ({
  seedCatalog = [],
  purchasedSeeds = [],
  onPlantSeed,
  currencyMode = 'USD',
  onToggleCurrency,
  isPurchasing,
  purchaseNotice,
  ascribedServerResult
}) => {
  const [selectedSeedId, setSelectedSeedId] = useState<string>('tubers');
  const [depositAmount, setDepositAmount] = useState<string>('2.50');
  const [customMultiplier, setCustomMultiplier] = useState<string>('1.50');

  // Currency conversion constants
  const DEPO_GBP_PRICE = 20000;
  const DEPO_USD_PRICE = 26000;
  const currentDepoPrice = currencyMode === 'GBP' ? DEPO_GBP_PRICE : DEPO_USD_PRICE;
  const currencySymbol = currencyMode === 'GBP' ? '£' : '$';

  // Random Entropy Causation sliders
  const [fundamentalsFactor, setFundamentalsFactor] = useState<number>(1.20);
  const [technicalsFactor, setTechnicalsFactor] = useState<number>(1.25);
  const [naturalCausesFactor, setNaturalCausesFactor] = useState<number>(1.15);

  const selectedSeed = (seedCatalog || []).find(s => s.id === selectedSeedId) || seedCatalog?.[3] || {
    id: 'tubers',
    name: 'Tubers',
    category: 'Deep-Root Institutional Tuber',
    harvestCycle: 'Annual',
    harvestCycleDays: 365,
    basePriceDepo: 2.50,
    basePriceGBP: 50000,
    basePriceUSD: 65000,
    baseMultiplier: 3.20,
    estimatedApy: 240.0,
    entropyType: 'Natural Causes (Network Weather & Cosmic Entropy Noise)',
    description: 'Heavy institutional tuber seed anchored deep into protocol node infrastructure.',
    serverSpecs: 'Dedicated VOX Tuber Institutional Vault Server (16 vCPU / 64GB RAM / 50 Gbps Direct Fiber)'
  };

  // Calculations
  const numericDepo = parseFloat(depositAmount) || 0;
  const numericMultiplier = parseFloat(customMultiplier) || 1.0;
  const fiatDepositValue = numericDepo * currentDepoPrice;

  // Combined entropy multiplier
  const combinedEntropy = +(
    0.40 * fundamentalsFactor +
    0.35 * technicalsFactor +
    0.25 * naturalCausesFactor
  ).toFixed(2);

  const effectiveGrowthMultiplier = +(
    numericMultiplier * combinedEntropy * selectedSeed.baseMultiplier
  ).toFixed(2);

  // Next harvest calculation
  const calculatedNextHarvestDate = new Date(Date.now() + selectedSeed.harvestCycleDays * 86400000);
  const projectedYieldDepo = +(numericDepo * (selectedSeed.estimatedApy / 100) * (effectiveGrowthMultiplier / 2)).toFixed(3);
  const projectedYieldFiat = +(projectedYieldDepo * currentDepoPrice).toFixed(2);

  // Handle Plant / Deposit
  const handleExecutePlant = () => {
    onPlantSeed(selectedSeedId, depositAmount, customMultiplier);
  };

  return (
    <div id="seed-growth-engine-module" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-6">
      
      {/* Module Header with Paired Currency Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-2xl">
            <Sprout className="h-7 w-7 animate-bounce" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
              <span>SeedGrowthEngine™ Module</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                CYCLE &amp; MULTIPLIER CORE
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Deposit $DEPO, apply active seed multipliers (Terra, Blunt, Crop, Tuber), process random entropy algorithms, and calculate harvest dates.
            </p>
          </div>
        </div>

        {/* Currency Switcher Toggle (GBP £ vs USD $) */}
        <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold pl-2">Display &amp; Liquidity Currency:</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggleCurrency('GBP')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                currencyMode === 'GBP'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-950/60 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GBP (£20,000 / $DEPO)
            </button>

            <button
              onClick={() => onToggleCurrency('USD')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                currencyMode === 'USD'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-950/60 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($26,000 / $DEPO)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Active Seed Types Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Select Active Seed Type for Multiplier &amp; Harvest Cycle</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Current Rate: <strong className="text-emerald-400">1 $DEPO = {currencySymbol}{currentDepoPrice.toLocaleString()} {currencyMode}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(seedCatalog || []).map((seed) => {
            const isSelected = selectedSeedId === seed.id;
            const seedPriceFiat = currencyMode === 'GBP' ? seed.basePriceGBP : seed.basePriceUSD;

            return (
              <div
                key={seed.id}
                onClick={() => setSelectedSeedId(seed.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-950/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500 text-black font-bold text-[9px] font-mono">
                    <CheckCircle className="h-3 w-3" />
                    <span>ACTIVE</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between pr-14">
                    <h3 className="font-black text-sm text-white">{seed.name}</h3>
                  </div>

                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    seed.harvestCycle === 'Annual'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {seed.harvestCycle} Harvest ({seed.harvestCycleDays} Days)
                  </span>

                  <p className="text-[10px] text-slate-400 leading-relaxed">{seed.description}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">Base Multiplier:</span>
                    <span className="text-amber-400 font-bold">{seed.baseMultiplier}x Base</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">Estimated APY:</span>
                    <span className="text-emerald-400 font-bold">{seed.estimatedApy}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">Base Cost:</span>
                    <span className="text-white font-bold">{seed.basePriceDepo} $DEPO ({currencySymbol}{seedPriceFiat.toLocaleString()})</span>
                  </div>
                  <div className="text-[9px] text-slate-500 truncate pt-1 border-t border-slate-800/40">
                    Specs: {seed.serverSpecs}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Seed Growth Engine Form & Live Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-950 border border-slate-800 rounded-2xl p-5">
        
        {/* Left Column: Input Form */}
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Sliders className="h-4 w-4 text-amber-400" />
            <span className="font-bold text-white uppercase text-[11px]">Deposit &amp; Multiplier Input</span>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              $DEPO Deposit Amount:
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-black text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">$DEPO</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold mt-1">
              <span>Fiat Value: {currencySymbol}{fiatDepositValue.toLocaleString()} {currencyMode}</span>
              <span>Rate: {currencySymbol}{currentDepoPrice.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Custom Liquidity Multiplier (1.0x - 5.0x):
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={customMultiplier}
                onChange={(e) => setCustomMultiplier(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-black text-amber-300 text-sm focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">Multiplier</span>
            </div>
            <span className="text-[9px] text-slate-400 block mt-1">
              Applies on top of {selectedSeed.name} seed base ({selectedSeed.baseMultiplier}x)
            </span>
          </div>

          {/* Random Entropy Causation Sliders */}
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Random Entropy Causation Weights</span>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">1. Fundamentals:</span>
                <span className="text-cyan-400 font-bold">{fundamentalsFactor.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.8" 
                max="2.0" 
                step="0.05"
                value={fundamentalsFactor}
                onChange={(e) => setFundamentalsFactor(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">2. Technicals:</span>
                <span className="text-purple-400 font-bold">{technicalsFactor.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.8" 
                max="2.0" 
                step="0.05"
                value={technicalsFactor}
                onChange={(e) => setTechnicalsFactor(parseFloat(e.target.value))}
                className="w-full accent-purple-400 h-1 bg-slate-800 rounded-lg cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">3. Natural Causes:</span>
                <span className="text-amber-400 font-bold">{naturalCausesFactor.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.8" 
                max="2.0" 
                step="0.05"
                value={naturalCausesFactor}
                onChange={(e) => setNaturalCausesFactor(parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer" 
              />
            </div>
          </div>

          <button
            onClick={handleExecutePlant}
            disabled={isPurchasing || numericDepo <= 0}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer"
          >
            <Sprout className={`h-4 w-4 ${isPurchasing ? 'animate-spin' : ''}`} />
            <span>
              {isPurchasing 
                ? 'Processing Growth Engine...' 
                : `Plant ${depositAmount} $DEPO (${selectedSeed.name.toUpperCase()})`}
            </span>
          </button>
        </div>

        {/* Middle & Right Column: Next Harvest Calculation & Live Timeline */}
        <div className="lg:col-span-2 space-y-4 font-mono text-xs">
          
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="font-bold text-white uppercase text-[11px]">Harvest Date Calculation &amp; Yield Simulation</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 block uppercase">Selected Harvest Cycle</span>
              <strong className="text-sm text-purple-300 block">{selectedSeed.harvestCycle}</strong>
              <span className="text-[9px] text-slate-400">{selectedSeed.harvestCycleDays} Days Cycle</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 block uppercase">Effective Multiplier</span>
              <strong className="text-sm text-amber-400 block">{effectiveGrowthMultiplier}x Total</strong>
              <span className="text-[9px] text-slate-400">{combinedEntropy}x Entropy Factor</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 block uppercase">Calculated Next Harvest</span>
              <strong className="text-xs text-emerald-400 block">{calculatedNextHarvestDate.toLocaleDateString()}</strong>
              <span className="text-[9px] text-slate-400">Exact Target Date</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 block uppercase">Projected Harvest Yield</span>
              <strong className="text-xs text-cyan-400 block">{projectedYieldDepo} $DEPO</strong>
              <span className="text-[9px] text-emerald-400 font-bold">{currencySymbol}{projectedYieldFiat.toLocaleString()} {currencyMode}</span>
            </div>
          </div>

          {/* Biological Growth Timeline Progress */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>Seed Growth &amp; Harvest Maturation Pipeline</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                Cycle: {selectedSeed.harvestCycle} (Once Every {selectedSeed.harvestCycle === 'Annual' ? 'Year' : 'Month'})
              </span>
            </div>

            {/* Stage Timeline */}
            <div className="grid grid-cols-4 gap-2 text-[10px] text-center pt-1">
              <div className="p-2 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300">
                <span className="block font-bold">Phase 1: Soil Ingress</span>
                <span className="text-[9px] text-slate-400">Day 0 - {Math.floor(selectedSeed.harvestCycleDays * 0.25)}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <span className="block font-bold">Phase 2: Vegetative Node</span>
                <span className="text-[9px] text-slate-400">Day {Math.floor(selectedSeed.harvestCycleDays * 0.25)} - {Math.floor(selectedSeed.harvestCycleDays * 0.5)}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <span className="block font-bold">Phase 3: Mesh Bloom</span>
                <span className="text-[9px] text-slate-400">Day {Math.floor(selectedSeed.harvestCycleDays * 0.5)} - {Math.floor(selectedSeed.harvestCycleDays * 0.75)}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
                <span className="block font-bold">Phase 4: Harvest Ready</span>
                <span className="text-[9px] text-slate-400">Day {selectedSeed.harvestCycleDays}</span>
              </div>
            </div>

            {/* Ascribed Server Specs Notice */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-300">Ascribed Infrastructure Node:</span>
                <strong className="text-white">{selectedSeed.serverSpecs}</strong>
              </div>
              <span className="text-emerald-400 font-bold">Auto-Provision</span>
            </div>
          </div>

          {/* Feedback Notices */}
          {purchaseNotice && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{purchaseNotice}</span>
            </div>
          )}

          {ascribedServerResult && (
            <div className="p-3 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold uppercase text-[10px] flex items-center space-x-1">
                  <Server className="h-3.5 w-3.5" />
                  <span>Dedicated Ascribed Server Node Online</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">{ascribedServerResult.id}</span>
              </div>
              <div className="flex items-center space-x-3 font-mono text-white text-xs">
                <span>Node Name: <strong>{ascribedServerResult.name}</strong></span>
                <span>IP Address: <strong>{ascribedServerResult.ipAddress}</strong></span>
                <span className="text-emerald-400 font-bold">CONNECTED</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ACTIVE PURCHASED SEED INSTANCES INVENTORY */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
            <Layers className="h-4 w-4 text-purple-400" />
            <span>Active Planted Seed Instances &amp; Harvest Countdowns ({(purchasedSeeds || []).length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Harvest Frequency: Monthly &amp; Annual Cycles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(purchasedSeeds || []).map((ps) => {
            const plantedDate = new Date(ps.plantedTimestamp);
            const nextHarvestDate = new Date(ps.nextHarvestTimestamp);
            const fiatValue = currencyMode === 'GBP' ? ps.valueGBP : ps.valueUSD;
            const yieldFiat = currencyMode === 'GBP' ? ps.projectedYieldGBP : ps.projectedYieldUSD;

            return (
              <div
                key={ps.id}
                className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-all font-mono"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-xs font-black text-white">{ps.seedTypeName} Seed Instance</span>
                    <span className="text-[10px] text-slate-500 block">
                      Planted on: {plantedDate.toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ps.harvestCycle === 'Annual'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {ps.harvestCycle} Cycle
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Staked Deposit</span>
                    <strong className="text-emerald-400 text-sm">{ps.amountDepo} $DEPO</strong>
                    <span className="text-[10px] text-slate-400 block">
                      ({currencySymbol}{fiatValue?.toLocaleString()} {currencyMode})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Ascribed Server Node</span>
                    <strong className="text-cyan-300 text-xs flex items-center space-x-1">
                      <Server className="h-3 w-3" />
                      <span className="truncate">{ps.ascribedServerName}</span>
                    </strong>
                    <span className="text-[10px] text-slate-400 block">IP: {ps.ascribedServerIp}</span>
                  </div>
                </div>

                {/* Next Harvest Target and Estimated Yield */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Next Harvest Date</span>
                    <strong className="text-amber-300">{nextHarvestDate.toLocaleDateString()}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase block">Projected Harvest Yield</span>
                    <strong className="text-emerald-400">
                      {currencySymbol}{yieldFiat?.toLocaleString()} {currencyMode}
                    </strong>
                  </div>
                </div>

                {/* Entropy Factors Breakdown */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Fundamentals: <strong className="text-cyan-400">{ps.entropyMetrics?.fundamentalsFactor || 1.15}x</strong></span>
                  <span>Technicals: <strong className="text-purple-400">{ps.entropyMetrics?.technicalsFactor || 1.20}x</strong></span>
                  <span>Natural Causes: <strong className="text-amber-400">{ps.entropyMetrics?.naturalCausesFactor || 1.10}x</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
