import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Activity,
  Server,
  Wifi,
  Cpu,
  HardDrive,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Play,
  Sliders,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Globe,
  Radio,
  Layers
} from 'lucide-react';
import { PrivateServer } from '../types';

interface NetworkHealthAnalyticsDashboardProps {
  servers: PrivateServer[];
  onRefreshServers?: () => void;
  onOpenPingTool?: (ip: string) => void;
}

interface TimeSeriesPoint {
  time: string;
  requestsPerSec: number;
  inboundMbps: number;
  outboundMbps: number;
  latencyMs: number;
  cpuUsagePct: number;
  packetLossPct: number;
  activeConnections: number;
}

const DEFAULT_NODES = [
  { id: '10.142.3.153', name: 'DEPO-Vault-Subledger-Node-1', type: 'vector_db', ip: '10.142.3.153', uptime: 99.99, status: 'online', load: 38 },
  { id: '10.142.0.12', name: 'Alpha-Edge-Gateway', type: 'gateway_proxy', ip: '10.142.0.12', uptime: 99.98, status: 'online', load: 52 },
  { id: '10.142.0.45', name: 'Neural-Vector-Store', type: 'vector_db', ip: '10.142.0.45', uptime: 99.95, status: 'online', load: 64 },
  { id: '10.142.1.88', name: 'Automation-Worker-Alpha', type: 'automation_worker', ip: '10.142.1.88', uptime: 100.0, status: 'online', load: 24 },
  { id: '10.142.2.99', name: 'EVM-Bridge-Relayer-Node', type: 'edge_compute', ip: '10.142.2.99', uptime: 99.89, status: 'online', load: 45 }
];

export const NetworkHealthAnalyticsDashboard: React.FC<NetworkHealthAnalyticsDashboardProps> = ({
  servers = [],
  onRefreshServers,
  onOpenPingTool
}) => {
  const [selectedNodeIp, setSelectedNodeIp] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '24h' | '7d'>('1h');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [trafficSpikeActive, setTrafficSpikeActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'bandwidth' | 'latency' | 'availability'>('overview');

  // Initial historical data generator
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesPoint[]>(() => {
    const points: TimeSeriesPoint[] = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 60 * 1000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const baseReq = 1200 + Math.floor(Math.sin(i * 0.5) * 300) + Math.floor(Math.random() * 150);
      points.push({
        time: timeStr,
        requestsPerSec: baseReq,
        inboundMbps: Math.floor(baseReq * 0.45 + Math.random() * 50),
        outboundMbps: Math.floor(baseReq * 0.72 + Math.random() * 80),
        latencyMs: Math.floor(12 + Math.sin(i * 0.8) * 6 + Math.random() * 4),
        cpuUsagePct: Math.floor(35 + Math.sin(i * 0.4) * 20 + Math.random() * 10),
        packetLossPct: Number((Math.random() * 0.08).toFixed(3)),
        activeConnections: Math.floor(baseReq * 3.2)
      });
    }
    return points;
  });

  // Live streaming ticker effect
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setTimeSeriesData(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const spikeMultiplier = trafficSpikeActive ? 2.5 : 1.0;
        const baseReq = Math.floor((1300 + Math.random() * 250) * spikeMultiplier);
        
        const newPoint: TimeSeriesPoint = {
          time: timeStr,
          requestsPerSec: baseReq,
          inboundMbps: Math.floor((baseReq * 0.45 + Math.random() * 60)),
          outboundMbps: Math.floor((baseReq * 0.75 + Math.random() * 90)),
          latencyMs: Math.floor((12 + Math.random() * 6) * (trafficSpikeActive ? 1.8 : 1.0)),
          cpuUsagePct: Math.min(99, Math.floor((38 + Math.random() * 15) * (trafficSpikeActive ? 1.6 : 1.0))),
          packetLossPct: Number((Math.random() * (trafficSpikeActive ? 0.35 : 0.08)).toFixed(3)),
          activeConnections: Math.floor(baseReq * 3.4)
        };

        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, trafficSpikeActive]);

  // Aggregate stats calculations
  const currentMetrics = useMemo(() => {
    const latest = timeSeriesData[timeSeriesData.length - 1] || {
      requestsPerSec: 1450,
      inboundMbps: 650,
      outboundMbps: 1100,
      latencyMs: 14,
      cpuUsagePct: 42,
      packetLossPct: 0.02,
      activeConnections: 4800
    };

    const totalMbps = latest.inboundMbps + latest.outboundMbps;
    const isNodeFiltered = selectedNodeIp !== 'ALL';

    return {
      requestsPerSec: isNodeFiltered ? Math.floor(latest.requestsPerSec * 0.28) : latest.requestsPerSec,
      inboundMbps: isNodeFiltered ? Math.floor(latest.inboundMbps * 0.28) : latest.inboundMbps,
      outboundMbps: isNodeFiltered ? Math.floor(latest.outboundMbps * 0.28) : latest.outboundMbps,
      totalMbps: isNodeFiltered ? Math.floor(totalMbps * 0.28) : totalMbps,
      latencyMs: latest.latencyMs,
      cpuUsagePct: latest.cpuUsagePct,
      packetLossPct: latest.packetLossPct,
      activeConnections: isNodeFiltered ? Math.floor(latest.activeConnections * 0.28) : latest.activeConnections,
      availabilitySla: trafficSpikeActive ? 99.82 : 99.99
    };
  }, [timeSeriesData, selectedNodeIp, trafficSpikeActive]);

  // Node Bandwidth Comparison Data
  const nodeBandwidthData = useMemo(() => {
    const combinedNodes = (servers && servers.length > 0) ? servers.map(s => ({
      name: s.name ? (s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name) : (s.id || 'Node'),
      ip: s.ipAddress || '10.142.0.1',
      bandwidthGb: Math.floor(45 + Math.random() * 80),
      packetsKps: Math.floor(12 + Math.random() * 35),
      cpu: s.cpuUsage || Math.floor(30 + Math.random() * 40),
      status: s.status || 'online'
    })) : DEFAULT_NODES.map(d => ({
      name: d.name,
      ip: d.ip,
      bandwidthGb: Math.floor(55 + Math.random() * 70),
      packetsKps: Math.floor(18 + Math.random() * 30),
      cpu: d.load,
      status: d.status
    }));

    return combinedNodes;
  }, [servers]);

  // Uptime/Status Breakdown Data for PieChart
  const statusPieData = useMemo(() => {
    const total = (servers && servers.length > 0) ? servers.length : DEFAULT_NODES.length;
    const onlineCount = (servers && servers.length > 0) ? servers.filter(s => s.status === 'online').length : 5;
    const degradedCount = (servers && servers.length > 0) ? servers.filter(s => s.status === 'degraded').length : 0;
    const offlineCount = Math.max(0, total - onlineCount - degradedCount);

    return [
      { name: 'Healthy / Optimal', value: onlineCount, color: '#10b981' },
      { name: 'High Load / Degraded', value: degradedCount > 0 ? degradedCount : 0, color: '#f59e0b' },
      { name: 'Offline / Standby', value: offlineCount > 0 ? offlineCount : 0, color: '#ef4444' }
    ].filter(d => d.value > 0);
  }, [servers]);

  const handleSimulateSpike = () => {
    setTrafficSpikeActive(prev => !prev);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header & Mode Controls */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 rounded-2xl text-white shadow-xl flex items-center justify-center">
              <Activity className="h-7 w-7 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Network Health & Live Analytics Dashboard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SLA 99.99% OPERATIONAL</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono font-bold">
                  RECHARTS VIZ ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Real-time telemetry telemetry monitor tracking bandwidth consumption, HTTP/TCP throughput, latency curves, packet loss, and server availability across all private subledger nodes.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Live Streaming Toggle */}
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-2 rounded-xl border font-bold flex items-center space-x-2 transition-all ${
                isLiveStreaming
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLiveStreaming ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isLiveStreaming ? 'Live Stream Active' : 'Stream Paused'}</span>
            </button>

            {/* Spike Injector Toggle */}
            <button
              onClick={handleSimulateSpike}
              className={`px-3 py-2 rounded-xl border font-bold flex items-center space-x-2 transition-all ${
                trafficSpikeActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300'
              }`}
            >
              <Zap className={`h-3.5 w-3.5 ${trafficSpikeActive ? 'text-amber-400 fill-amber-400 animate-bounce' : ''}`} />
              <span>{trafficSpikeActive ? 'Spike Active (2.5x)' : 'Inject Traffic Spike'}</span>
            </button>

            {/* Time Range Selector */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex space-x-1">
              {(['15m', '1h', '24h', '7d'] as const).map(tr => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    timeRange === tr
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Node Selector Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-amber-400" />
            <span className="text-slate-300 font-bold uppercase text-[11px]">Filter Target Node:</span>
            <select
              value={selectedNodeIp}
              onChange={(e) => setSelectedNodeIp(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-bold text-xs focus:border-red-500 focus:outline-none"
            >
              <option value="ALL">🌐 All Active Private Server Nodes ({(servers || []).length > 0 ? servers.length : DEFAULT_NODES.length})</option>
              {DEFAULT_NODES.map(node => (
                <option key={node.id} value={node.ip}>
                  {node.name} ({node.ip})
                </option>
              ))}
              {(servers || []).map(s => (
                <option key={s.id} value={s.ipAddress}>
                  {s.name} ({s.ipAddress})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Normal Bandwidth</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>High Load Threshold (&gt;80%)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span>SLA Warning (&gt;50ms)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metric High-Level Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        
        {/* Card 1: Requests Per Second */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Live Traffic</span>
            <Wifi className="h-4 w-4 text-red-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{currentMetrics.requestsPerSec.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-bold">req/s</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-bold">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+14.2% vs baseline</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 2: Total Bandwidth Throughput */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Bandwidth</span>
            <Radio className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-300">{currentMetrics.totalMbps.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-bold">Mbps</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>In: <strong className="text-emerald-400">{currentMetrics.inboundMbps}</strong></span>
            <span>Out: <strong className="text-purple-300">{currentMetrics.outboundMbps}</strong></span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 3: Response Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Avg Latency</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black ${currentMetrics.latencyMs > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {currentMetrics.latencyMs}
            </span>
            <span className="text-xs text-slate-400 font-bold">ms</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-slate-400">
            <span>Loss Rate: <strong className="text-slate-200">{currentMetrics.packetLossPct}%</strong></span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 4: CPU & Resource Load */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Avg CPU Load</span>
            <Cpu className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-purple-300">{currentMetrics.cpuUsagePct}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${currentMetrics.cpuUsagePct > 80 ? 'bg-red-500' : currentMetrics.cpuUsagePct > 60 ? 'bg-amber-500' : 'bg-purple-500'}`}
              style={{ width: `${currentMetrics.cpuUsagePct}%` }}
            />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 5: Availability SLA */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Availability SLA</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">{currentMetrics.availabilitySla}%</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>0 Downtime Incident</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

      </div>

      {/* Primary Chart Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Area Chart for Live Traffic & Bandwidth */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <BarChart3 className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Real-Time Traffic & Throughput Flow (Req/s & Mbps)
                </h3>
                <p className="text-xs text-slate-400">
                  Subsecond packet telemetry stream over target node mesh
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded bg-red-500/80" />
                <span className="text-slate-300">Requests/sec</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded bg-amber-500/80" />
                <span className="text-slate-300">Inbound (Mbps)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded bg-purple-500/80" />
                <span className="text-slate-300">Outbound (Mbps)</span>
              </span>
            </div>
          </div>

          {/* AreaChart Recharts Container */}
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requestsPerSec"
                  name="Requests/sec"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReq)"
                />
                <Area
                  type="monotone"
                  dataKey="inboundMbps"
                  name="Inbound Mbps"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIn)"
                />
                <Area
                  type="monotone"
                  dataKey="outboundMbps"
                  name="Outbound Mbps"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOut)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Peak Bandwidth Throughput: <strong className="text-amber-300">1,840 Mbps</strong></span>
            <span>Packet Retransmission Rate: <strong className="text-emerald-400">0.001%</strong></span>
            <span>Enclave Verification: <strong className="text-blue-400 font-bold">PASSED</strong></span>
          </div>
        </div>

        {/* Right Column (4 cols): Latency Curve & Server Uptime Distribution */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Latency & Jitter LineChart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <h4 className="font-bold text-sm">Latency & Jitter (ms)</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                SLA &lt; 50ms
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} domain={[0, 60]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <ReferenceLine y={45} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'SLA Limit (45ms)', fill: '#ef4444', fontSize: 9 }} />
                  <Line type="monotone" dataKey="latencyMs" name="Latency (ms)" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Avg Latency: <strong className="text-emerald-400">{currentMetrics.latencyMs}ms</strong></span>
              <span>Jitter: <strong className="text-amber-300">1.4ms</strong></span>
            </div>
          </div>

          {/* Node Availability Status PieChart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <PieChartIcon className="h-4 w-4 text-purple-400" />
                <h4 className="font-bold text-sm">Server Availability & SLA</h4>
              </div>
              <span className="text-[10px] font-mono text-purple-300 font-bold">
                {(servers || []).length > 0 ? `${servers.length} Servers` : '5 Core Nodes'}
              </span>
            </div>

            <div className="h-40 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1 text-xs font-mono">
              {statusPieData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 text-[11px]">{item.name}</span>
                  </div>
                  <strong className="text-white font-bold">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bandwidth Consumption Breakdown Per Server Node (BarChart) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Layers className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Bandwidth & Load Breakdown Across Active Private Server Nodes
              </h3>
              <p className="text-xs text-slate-400">
                Data transfer consumption (GB/hr) & CPU Utilization % per node
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1">
              <span className="h-3 w-3 rounded bg-amber-500" />
              <span className="text-slate-300">Bandwidth (GB/hr)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-3 w-3 rounded bg-purple-500" />
              <span className="text-slate-300">CPU Load (%)</span>
            </span>
          </div>
        </div>

        {/* BarChart Recharts Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nodeBandwidthData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Bar dataKey="bandwidthGb" name="Bandwidth (GB/hr)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cpu" name="CPU Load (%)" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Server Node Live Status & Health Action Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Server className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Active Private Server Nodes Live Telemetry Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Direct health metrics, IP bindings, and ping tools for monitored subledger servers
              </p>
            </div>
          </div>

          <button
            onClick={() => onRefreshServers && onRefreshServers()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            <span>Refresh Server Nodes</span>
          </button>
        </div>

        <div className="overflow-x-auto font-mono">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="p-3">Node Name</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Role / Service</th>
                <th className="p-3">CPU Usage</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Availability</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {DEFAULT_NODES.map((node) => (
                <tr key={node.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{node.name}</span>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">{node.ip}</td>
                  <td className="p-3 text-slate-400 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold uppercase text-[9px]">
                      {node.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-10 text-right font-bold text-purple-300">{node.load}%</span>
                      <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-purple-500 h-full"
                          style={{ width: `${node.load}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">14 ms</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      {node.uptime}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenPingTool && onOpenPingTool(node.ip)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all inline-flex items-center space-x-1"
                    >
                      <Wifi className="h-3 w-3" />
                      <span>Ping Tool</span>
                    </button>
                  </td>
                </tr>
              ))}

              {servers.map((server) => (
                <tr key={server.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <span className={`h-2 w-2 rounded-full ${server.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>{server.name}</span>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">{server.ipAddress}</td>
                  <td className="p-3 text-slate-400 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-bold uppercase text-[9px]">
                      {server.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-10 text-right font-bold text-purple-300">{server.cpuUsage}%</span>
                      <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-purple-500 h-full"
                          style={{ width: `${server.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">{server.latencyMs || 12} ms</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      99.98%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenPingTool && onOpenPingTool(server.ipAddress)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all inline-flex items-center space-x-1"
                    >
                      <Wifi className="h-3 w-3" />
                      <span>Ping Tool</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
