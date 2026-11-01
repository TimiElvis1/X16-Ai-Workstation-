import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  CandlestickChart, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  ShieldCheck, 
  Activity,
  Sliders,
  Layers,
  RefreshCw
} from 'lucide-react';

interface Trade {
  id: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
  time: string;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const LiveTradingChart: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<'DEPO/USDT' | 'BTC/USDT' | 'SOL/USDT' | 'ETH/USDT'>('DEPO/USDT');
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');
  const [timeframe, setTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '1D'>('5M');
  
  // Prices state
  const [currentPrice, setCurrentPrice] = useState<number>(10000.00);
  const [priceChange24h, setPriceChange24h] = useState<number>(14.2);
  const [high24h, setHigh24h] = useState<number>(10450.00);
  const [low24h, setLow24h] = useState<number>(9850.00);
  const [volume24h, setVolume24h] = useState<number>(845092000);

  // Candles mock data generator based on pair
  const [candles, setCandles] = useState<Candle[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);

  // Order form state
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [orderPrice, setOrderPrice] = useState<string>('10000.00');
  const [orderAmount, setOrderAmount] = useState<string>('1');
  const [orderExecuting, setOrderExecuting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Pair metadata setup
  useEffect(() => {
    let base = 10000.00;
    let high = 10450.00;
    let low = 9850.00;
    let vol = 845092000;
    let change = 14.2;

    if (selectedPair === 'BTC/USDT') {
      base = 96420.50;
      high = 98150.00;
      low = 94800.00;
      vol = 482104500;
      change = 2.85;
    } else if (selectedPair === 'SOL/USDT') {
      base = 184.60;
      high = 192.40;
      low = 178.20;
      vol = 124500800;
      change = -1.45;
    } else if (selectedPair === 'ETH/USDT') {
      base = 3450.80;
      high = 3580.00;
      low = 3390.00;
      vol = 289400100;
      change = 4.12;
    }

    setCurrentPrice(base);
    setHigh24h(high);
    setLow24h(low);
    setVolume24h(vol);
    setPriceChange24h(change);
    setOrderPrice(base.toString());

    // Generate Initial Candles
    const initialCandles: Candle[] = [];
    let p = base * 0.92;
    for (let i = 24; i >= 0; i--) {
      const open = p;
      const variation = (Math.random() - 0.47) * (base * 0.02);
      const close = open + variation;
      const highC = Math.max(open, close) + Math.random() * (base * 0.01);
      const lowC = Math.min(open, close) - Math.random() * (base * 0.01);
      const volC = Math.floor(Math.random() * 50000 + 10000);
      initialCandles.push({
        time: `${i}m ago`,
        open: Number(open.toFixed(2)),
        high: Number(highC.toFixed(2)),
        low: Number(lowC.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: volC
      });
      p = close;
    }
    setCandles(initialCandles);

    // Initial trades
    const trades: Trade[] = [];
    for (let i = 0; i < 8; i++) {
      const isBuy = Math.random() > 0.45;
      trades.push({
        id: `trd-${Math.random().toString(36).substr(2, 6)}`,
        price: Number((base + (Math.random() - 0.5) * (base * 0.005)).toFixed(2)),
        amount: Math.floor(Math.random() * 2500 + 100),
        type: isBuy ? 'buy' : 'sell',
        time: new Date(Date.now() - i * 3000).toLocaleTimeString()
      });
    }
    setRecentTrades(trades);

  }, [selectedPair]);

  // Real-time ticker price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * (currentPrice * 0.003);
      const newPrice = Math.max(0.0001, currentPrice + delta);
      setCurrentPrice(Number(newPrice.toFixed(2)));

      // Add a new trade tick
      const isBuy = delta >= 0;
      const newTrade: Trade = {
        id: `trd-${Math.random().toString(36).substr(2, 6)}`,
        price: Number(newPrice.toFixed(2)),
        amount: Math.floor(Math.random() * 1500 + 50),
        type: isBuy ? 'buy' : 'sell',
        time: new Date().toLocaleTimeString()
      };
      setRecentTrades(prev => [newTrade, ...prev.slice(0, 11)]);

      // Update last candle
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        last.close = Number(newPrice.toFixed(2));
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        last.volume += Math.floor(Math.random() * 500);
        return [...prev.slice(0, prev.length - 1), last];
      });

    }, 2500);

    return () => clearInterval(interval);
  }, [currentPrice, selectedPair]);

  // Execute Buy/Sell Trade
  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderExecuting(true);
    setTimeout(() => {
      setOrderExecuting(false);
      setNotification(`✓ Execution Success: ${orderType.toUpperCase()} ${orderAmount} ${selectedPair.split('/')[0]} @ $${orderPrice}`);
      setTimeout(() => setNotification(null), 4000);
    }, 800);
  };

  // SVG Chart Dimensions calculation
  const chartHeight = 280;
  const chartWidth = 720;
  const maxPriceInCandles = Math.max(...candles.map(c => c.high), currentPrice * 1.01);
  const minPriceInCandles = Math.min(...candles.map(c => c.low), currentPrice * 0.99);
  const priceRange = Math.max(0.0001, maxPriceInCandles - minPriceInCandles);

  const getSvgY = (price: number) => {
    return chartHeight - ((price - minPriceInCandles) / priceRange) * (chartHeight - 40) - 20;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-5">
      
      {/* Header & Pair Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        
        {/* Left: Pair Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-xl font-bold font-mono text-sm">
              ⚡ DEX
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-white font-black text-base rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-red-500"
                >
                  <option value="DEPO/USDT">$DEPO / USDT (DEPO Protocol)</option>
                  <option value="BTC/USDT">BTC / USDT (Bitcoin)</option>
                  <option value="SOL/USDT">SOL / USDT (Solana)</option>
                  <option value="ETH/USDT">ETH / USDT (Ethereum)</option>
                </select>

                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono flex items-center space-x-1 ${
                  priceChange24h >= 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {priceChange24h >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  <span>{priceChange24h >= 0 ? '+' : ''}{priceChange24h}%</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 font-mono">
                <span>24h High: <strong className="text-white">${high24h}</strong></span>
                <span>•</span>
                <span>24h Low: <strong className="text-white">${low24h}</strong></span>
                <span>•</span>
                <span>24h Vol: <strong className="text-amber-400">${(volume24h / 1000000).toFixed(2)}M</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Live Price Display */}
        <div className="flex items-center space-x-4">
          {/* Live Price Tag */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Live Market Price</span>
            <span className="text-xl font-black font-mono text-emerald-400 animate-pulse">
              ${currentPrice} <span className="text-xs text-slate-400 font-normal">USDT</span>
            </span>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setChartType('candlestick')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                chartType === 'candlestick' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CandlestickChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                chartType === 'area' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {(['1M', '5M', '15M', '1H', '1D'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-lg transition-all font-bold ${
                  timeframe === tf ? 'bg-slate-800 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Grid: Chart Canvas (Left) + Orderbook & Execution Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Interactive SVG Chart (Cols 2) */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <Activity className="h-3.5 w-3.5 animate-spin" />
              <span>SubNet Parity Liquidity Pool Feeds</span>
            </span>
            <span>MA(7): <strong className="text-amber-400">${(currentPrice * 0.998).toFixed(2)}</strong> | MA(25): <strong className="text-purple-400">${(currentPrice * 0.985).toFixed(2)}</strong></span>
          </div>

          {/* Chart SVG */}
          <div className="w-full h-[280px] relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              
              {/* Horizontal Grid lines */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={chartHeight * ratio}
                  x2={chartWidth}
                  y2={chartHeight * ratio}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Candlesticks or Area Chart rendering */}
              {chartType === 'candlestick' ? (
                candles.map((candle, i) => {
                  const x = (i / (candles.length - 1 || 1)) * (chartWidth - 40) + 20;
                  const candleWidth = Math.max(6, (chartWidth / candles.length) - 8);
                  const isBull = candle.close >= candle.open;
                  const yHigh = getSvgY(candle.high);
                  const yLow = getSvgY(candle.low);
                  const yOpen = getSvgY(candle.open);
                  const yClose = getSvgY(candle.close);
                  const topY = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));

                  return (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={isBull ? '#10b981' : '#ef4444'}
                        strokeWidth="1.5"
                      />
                      {/* Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={topY}
                        width={candleWidth}
                        height={bodyHeight}
                        fill={isBull ? '#10b981' : '#ef4444'}
                        rx="1"
                      />
                    </g>
                  );
                })
              ) : (
                /* Area Curve */
                <g>
                  <path
                    d={candles.reduce((acc, c, i) => {
                      const x = (i / (candles.length - 1 || 1)) * (chartWidth - 40) + 20;
                      const y = getSvgY(c.close);
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, '')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  <path
                    d={`${candles.reduce((acc, c, i) => {
                      const x = (i / (candles.length - 1 || 1)) * (chartWidth - 40) + 20;
                      const y = getSvgY(c.close);
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, '')} L ${chartWidth - 20} ${chartHeight} L 20 ${chartHeight} Z`}
                    fill="url(#emeraldGradient)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </g>
              )}

              {/* Current Price Line */}
              <line
                x1="0"
                y1={getSvgY(currentPrice)}
                x2={chartWidth}
                y2={getSvgY(currentPrice)}
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>

            {/* Price badge on current price line */}
            <div 
              className="absolute right-0 transform -translate-y-1/2 bg-emerald-500 text-slate-950 font-black font-mono text-[10px] px-2 py-0.5 rounded shadow-md"
              style={{ top: `${Math.max(10, Math.min(270, getSvgY(currentPrice)))}px` }}
            >
              ${currentPrice}
            </div>
          </div>
        </div>

        {/* Right: Orderbook & Quick Execution Trade Panel */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 font-mono">
          
          {/* Order Type Toggle */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setOrderType('buy')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                orderType === 'buy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              BUY {selectedPair.split('/')[0]}
            </button>
            <button
              onClick={() => setOrderType('sell')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                orderType === 'sell' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              SELL {selectedPair.split('/')[0]}
            </button>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleExecuteOrder} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Price (USDT)</label>
              <input
                type="text"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Amount ({selectedPair.split('/')[0]})</label>
              <input
                type="text"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-bold text-white text-xs"
              />
            </div>

            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[11px] space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Est:</span>
                <span className="font-bold text-amber-400">${(Number(orderPrice || 0) * Number(orderAmount || 0)).toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Slippage:</span>
                <span className="text-emerald-400">0.05% (Optimal)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={orderExecuting}
              className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
                orderType === 'buy' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              <Zap className={`h-4 w-4 ${orderExecuting ? 'animate-spin' : ''}`} />
              <span>{orderExecuting ? 'Broadcasting Tx...' : `Execute ${orderType.toUpperCase()} Order`}</span>
            </button>
          </form>

          {/* Toast Notification */}
          {notification && (
            <div className="p-2.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold rounded-xl animate-fade-in">
              {notification}
            </div>
          )}

          {/* Live Recent Trade Stream */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Live Filled Trade Stream</span>
            <div className="space-y-1 max-h-[100px] overflow-y-auto text-[10px]">
              {recentTrades.map((t) => (
                <div key={t.id} className="flex justify-between text-slate-300">
                  <span className={t.type === 'buy' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    ${t.price}
                  </span>
                  <span>{t.amount} {selectedPair.split('/')[0]}</span>
                  <span className="text-slate-500">{t.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
