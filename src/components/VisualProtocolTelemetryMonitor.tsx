import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Boxes,
  Zap,
  Server,
  Network,
  Cpu,
  Radio,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  HardDrive,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Terminal,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import {
  pluginRegistryManager,
  ProtocolPluginModule,
  AVAILABLE_TELEMETRY_SERVERS,
  TelemetryServerOption
} from '../services/pluginRegistryManager';
import { EngineProtocolCategory } from '../types/protocolEngine';

interface VisualProtocolTelemetryMonitorProps {
  initialSelectedPluginId?: string;
  onSelectSubTool?: (toolId: string) => void;
  onOpenPluginConfig?: (plugin: ProtocolPluginModule) => void;
}

interface SimulatedPacket {
  id: string;
  pluginId: string;
  pluginName: string;
  categoryLabel: string;
  type: 'INGRESS' | 'EGRESS' | 'AUTH' | 'TELEMETRY' | 'ROUTE';
  protocolType: string;
  sizeBytes: number;
  latencyMs: number;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'DROPPED';
  source: string;
  destination: string;
}

export const VisualProtocolTelemetryMonitor: React.FC<VisualProtocolTelemetryMonitorProps> = ({
  initialSelectedPluginId,
  onSelectSubTool,
  onOpenPluginConfig
}) => {
  const [plugins, setPlugins] = useState<ProtocolPluginModule[]>(pluginRegistryManager.getPlugins());
  const [selectedPluginId, setSelectedPluginId] = useState<string>(initialSelectedPluginId || 'all');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [samplingRateHz, setSamplingRateHz] = useState<number>(25);
  const [layerFilter, setLayerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTelemetryServerId, setSelectedTelemetryServerId] = useState<string>(AVAILABLE_TELEMETRY_SERVERS[0].id);
  
  // Real-time metrics state
  const [packets, setPackets] = useState<SimulatedPacket[]>([]);
  const [totalPacketsCount, setTotalPacketsCount] = useState<number>(148290);
  const [totalBytesTransferred, setTotalBytesTransferred] = useState<number>(842930214);
  const [averageLatency, setAverageLatency] = useState<number>(2.4);
  const [activeAlerts, setActiveAlerts] = useState<number>(0);
  const [burstActive, setBurstActive] = useState<boolean>(false);
  const [inspectedPacket, setInspectedPacket] = useState<SimulatedPacket | null>(null);

  // Per-module dynamic telemetry metrics map
  const [moduleMetrics, setModuleMetrics] = useState<Record<string, {
    packetRate: number;
    byteRateKb: number;
    latencyMs: number;
    bufferPercent: number;
    cpuLoad: number;
    errorRatePercent: number;
    circuitStatus: 'HEALTHY' | 'ACTIVE' | 'THROTTLED';
  }>>({});

  // Sync plugins from manager
  useEffect(() => {
    const unsub = pluginRegistryManager.subscribe(() => {
      setPlugins(pluginRegistryManager.getPlugins());
    });
    return unsub;
  }, []);

  // Initialize per-module metrics
  useEffect(() => {
    const initialMetrics: Record<string, any> = {};
    plugins.forEach((p, idx) => {
      initialMetrics[p.id] = {
        packetRate: Math.floor(450 + Math.random() * 850),
        byteRateKb: Math.floor(120 + Math.random() * 640),
        latencyMs: +(1.2 + Math.random() * 3.8).toFixed(2),
        bufferPercent: Math.floor(18 + Math.random() * 42),
        cpuLoad: Math.floor(12 + Math.random() * 35),
        errorRatePercent: 0.0,
        circuitStatus: 'HEALTHY'
      };
    });
    setModuleMetrics(initialMetrics);
  }, [plugins]);

  // Real-time packet generator loop
  useEffect(() => {
    if (!isStreaming) return;

    const intervalMs = Math.max(80, Math.floor(1000 / samplingRateHz));
    const interval = setInterval(() => {
      const activePlugins = plugins.filter(p => p.status === 'INSTALLED' || p.status === 'STANDBY');
      if (activePlugins.length === 0) return;

      const randomPlugin = activePlugins[Math.floor(Math.random() * activePlugins.length)];
      const types: Array<'INGRESS' | 'EGRESS' | 'AUTH' | 'TELEMETRY' | 'ROUTE'> = ['INGRESS', 'EGRESS', 'AUTH', 'TELEMETRY', 'ROUTE'];
      const pType = types[Math.floor(Math.random() * types.length)];
      const isDropped = Math.random() < 0.015;
      const latency = +(1.1 + Math.random() * 4.2 + (burstActive ? 2.5 : 0)).toFixed(2);
      const sizeBytes = Math.floor(128 + Math.random() * 4096);

      const newPacket: SimulatedPacket = {
        id: `pkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        pluginId: randomPlugin.id,
        pluginName: randomPlugin.name,
        categoryLabel: randomPlugin.shortLabel,
        type: pType,
        protocolType: randomPlugin.constituentProtocols[0] || 'QUIC/TLS',
        sizeBytes,
        latencyMs: latency,
        timestamp: new Date().toLocaleTimeString(),
        status: isDropped ? 'DROPPED' : latency > 4.5 ? 'WARNING' : 'SUCCESS',
        source: `node-${Math.floor(Math.random() * 16)}.vox.mesh`,
        destination: `telemetry-gw:${AVAILABLE_TELEMETRY_SERVERS.find(s => s.id === selectedTelemetryServerId)?.port || 4317}`
      };

      setPackets(prev => [newPacket, ...prev.slice(0, 49)]);
      setTotalPacketsCount(c => c + 1);
      setTotalBytesTransferred(b => b + sizeBytes);
      setAverageLatency(lat => +((lat * 0.95) + (latency * 0.05)).toFixed(2));

      // Slightly fluctuate module metrics
      setModuleMetrics(prev => {
        const curr = prev[randomPlugin.id] || {
          packetRate: 500,
          byteRateKb: 200,
          latencyMs: 2.0,
          bufferPercent: 25,
          cpuLoad: 15,
          errorRatePercent: 0,
          circuitStatus: 'HEALTHY'
        };
        const deltaRate = Math.floor((Math.random() - 0.48) * 40);
        return {
          ...prev,
          [randomPlugin.id]: {
            ...curr,
            packetRate: Math.max(100, curr.packetRate + deltaRate),
            byteRateKb: Math.max(50, Math.floor(curr.byteRateKb + (Math.random() - 0.48) * 15)),
            latencyMs: +(1.2 + Math.random() * 3.4).toFixed(2),
            bufferPercent: Math.min(95, Math.max(10, Math.floor(curr.bufferPercent + (Math.random() - 0.5) * 4))),
            cpuLoad: Math.min(98, Math.max(8, Math.floor(curr.cpuLoad + (Math.random() - 0.5) * 5)))
          }
        };
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, samplingRateHz, plugins, selectedTelemetryServerId, burstActive]);

  // Handle packet burst simulation
  const handleTriggerBurst = () => {
    setBurstActive(true);
    setTotalPacketsCount(c => c + 2500);
    setTotalBytesTransferred(b => b + 10485760);
    setTimeout(() => setBurstActive(false), 3000);
  };

  const selectedTelemetryServer = useMemo(() => {
    return AVAILABLE_TELEMETRY_SERVERS.find(s => s.id === selectedTelemetryServerId) || AVAILABLE_TELEMETRY_SERVERS[0];
  }, [selectedTelemetryServerId]);

  // Filtered plugins
  const filteredPlugins = useMemo(() => {
    return plugins.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.layer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLayer = layerFilter === 'ALL' || p.layer.toUpperCase() === layerFilter.toUpperCase();
      const matchSelect = selectedPluginId === 'all' || p.id === selectedPluginId;
      return matchSearch && matchLayer && matchSelect;
    });
  }, [plugins, searchQuery, layerFilter, selectedPluginId]);

  const uniqueLayers = useMemo(() => {
    const set = new Set(plugins.map(p => p.layer));
    return ['ALL', ...Array.from(set)];
  }, [plugins]);

  return (
    <div className="space-y-6 text-[#1c1917] font-sans">
      
      {/* Apple-Amazon Inspired Top Command & Telemetry Header */}
      <div className="rounded-3xl bg-[#faf6ee] border border-[#e8dfd3] p-6 sm:p-8 backdrop-blur-xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#fef3c7]/60 via-[#fde68a]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#fef3c7] border border-[#fde68a] text-[#92400e] flex items-center gap-1.5 shadow-sm">
                <Activity className="w-3.5 h-3.5 animate-pulse text-[#b45309]" />
                REAL-TIME MILK TELEMETRY BUS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffffff] border border-[#dfd4c3] text-[#57534e]">
                20 Pluggable Module Channels
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                OTLP Mesh Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1c1917] tracking-tight flex items-center gap-3">
              <span>Visual Telemetry Monitor &amp; Packet Stream</span>
            </h2>
            <p className="text-[#57534e] text-sm max-w-3xl mt-1 leading-relaxed">
              Live bi-directional packet stream analyzer and adapter health matrix for all pluggable protocol adapters across the sovereign network mesh.
            </p>
          </div>

          {/* Interactive Stream Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="btn-stream-toggle"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isStreaming
                  ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a] hover:bg-[#fde68a]'
                  : 'bg-[#15803d] text-white font-black hover:bg-[#166534]'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>

            <button
              id="btn-trigger-burst"
              onClick={handleTriggerBurst}
              disabled={burstActive}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border ${
                burstActive
                  ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#92400e] hover:to-[#b45309] text-white border-[#b45309] shadow-sm'
              }`}
            >
              <Zap className="w-4 h-4 text-white" />
              <span>{burstActive ? 'Simulating High-Load Burst...' : 'Inject Packet Burst'}</span>
            </button>
          </div>
        </div>

        {/* Global Overview Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#e8dfd3]">
          <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e8dfd3]">
            <span className="text-xs font-mono text-[#78716c] uppercase tracking-wider block">Total Dispatched Packets</span>
            <div className="text-xl sm:text-2xl font-black text-[#92400e] font-mono mt-1 flex items-center gap-2">
              <span>{totalPacketsCount.toLocaleString()}</span>
              <TrendingUp className="w-4 h-4 text-[#15803d]" />
            </div>
            <span className="text-[11px] text-[#a8a29e] mt-0.5 block font-mono">{(samplingRateHz * 18).toLocaleString()} pkts/s aggregate</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e8dfd3]">
            <span className="text-xs font-mono text-[#78716c] uppercase tracking-wider block">Total Payload Volume</span>
            <div className="text-xl sm:text-2xl font-black text-[#78350f] font-mono mt-1">
              {(totalBytesTransferred / (1024 * 1024)).toFixed(2)} MB
            </div>
            <span className="text-[11px] text-[#a8a29e] mt-0.5 block font-mono">Zero packet leak rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e8dfd3]">
            <span className="text-xs font-mono text-[#78716c] uppercase tracking-wider block">Average Adapter Latency</span>
            <div className="text-xl sm:text-2xl font-black text-[#15803d] font-mono mt-1 flex items-center gap-2">
              <span>{averageLatency} ms</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[11px] text-[#a8a29e] mt-0.5 block font-mono">Target: &lt; 5.0 ms</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e8dfd3]">
            <span className="text-xs font-mono text-[#78716c] uppercase tracking-wider block">Active Telemetry Server</span>
            <div className="text-sm font-bold text-[#1c1917] truncate mt-1.5" title={selectedTelemetryServer.name}>
              {selectedTelemetryServer.host}:{selectedTelemetryServer.port}
            </div>
            <span className="text-[11px] text-[#b45309] font-bold mt-0.5 block font-mono">{selectedTelemetryServer.protocol}</span>
          </div>
        </div>
      </div>

      {/* Filter and Configuration Bar */}
      <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e8dfd3] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search adapter telemetry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#ffffff] border border-[#dfd4c3] text-xs text-[#1c1917] placeholder-[#a8a29e] focus:border-[#b45309] focus:outline-none"
            />
          </div>

          {/* Layer Filter */}
          <div className="flex items-center gap-1.5 bg-[#ffffff] p-1 rounded-xl border border-[#dfd4c3] text-xs overflow-x-auto max-w-full">
            {uniqueLayers.map(l => (
              <button
                key={l}
                onClick={() => setLayerFilter(l)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  layerFilter === l
                    ? 'bg-[#b45309] text-white font-bold shadow-sm'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Server & Sampling Rate Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#78716c] font-mono">Server:</span>
            <select
              value={selectedTelemetryServerId}
              onChange={(e) => setSelectedTelemetryServerId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dfd4c3] text-[#92400e] text-xs font-mono font-bold focus:outline-none focus:border-[#b45309]"
            >
              {AVAILABLE_TELEMETRY_SERVERS.map(srv => (
                <option key={srv.id} value={srv.id}>
                  {srv.name} ({srv.host}:{srv.port})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#78716c] font-mono">Rate:</span>
            <select
              value={samplingRateHz}
              onChange={(e) => setSamplingRateHz(Number(e.target.value))}
              className="px-2.5 py-2 rounded-xl bg-[#ffffff] border border-[#dfd4c3] text-[#1c1917] text-xs font-mono font-bold focus:outline-none"
            >
              <option value={10}>10 Hz</option>
              <option value={25}>25 Hz (Default)</option>
              <option value={50}>50 Hz</option>
              <option value={100}>100 Hz</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Live Packet Flow Stream Canvas */}
      <div className="rounded-3xl bg-[#ffffff] border border-[#e8dfd3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#b45309] animate-pulse" />
            <h3 className="text-sm font-bold text-[#1c1917] font-mono">LIVE PACKET FLOW DISPATCH STREAM (LAST 50 EVENTS)</h3>
          </div>
          <span className="text-xs font-mono text-[#78716c] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Ingress/Egress Stream
          </span>
        </div>

        {/* Live Packet Lane Stream Animation */}
        <div className="h-44 overflow-y-auto space-y-1.5 pr-2 font-mono text-xs custom-scrollbar">
          <AnimatePresence initial={false}>
            {packets.map((pkt) => (
              <motion.div
                key={pkt.id}
                initial={{ opacity: 0, x: -20, scaleY: 0.8 }}
                animate={{ opacity: 1, x: 0, scaleY: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15 }}
                onClick={() => setInspectedPacket(pkt)}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.005] ${
                  pkt.status === 'DROPPED'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : pkt.status === 'WARNING'
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-[#faf6ee] border-[#e8dfd3] text-[#292524] hover:border-[#b45309] hover:bg-[#f5eedc]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pkt.type === 'INGRESS' ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]' :
                    pkt.type === 'EGRESS' ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]' :
                    pkt.type === 'AUTH' ? 'bg-[#f3e8ff] text-[#6b21a8] border border-[#e9d5ff]' :
                    pkt.type === 'ROUTE' ? 'bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]' :
                    'bg-[#f5eedc] text-[#57534e]'
                  }`}>
                    {pkt.type}
                  </span>

                  <span className="font-bold text-[#1c1917] truncate max-w-[140px] sm:max-w-[200px]">
                    {pkt.categoryLabel}
                  </span>

                  <span className="text-[#78716c] hidden sm:inline truncate max-w-[120px]">
                    [{pkt.protocolType}]
                  </span>

                  <span className="text-[#a8a29e] text-[11px] hidden md:inline">
                    {pkt.source} <ArrowRight className="inline w-3 h-3 text-[#78716c] mx-1" /> {pkt.destination}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[#78716c] text-[11px]">{pkt.sizeBytes} B</span>
                  <span className={`font-bold ${pkt.latencyMs > 4.0 ? 'text-[#b45309]' : 'text-[#15803d]'}`}>
                    {pkt.latencyMs} ms
                  </span>
                  <span className="text-[10px] text-[#a8a29e] hidden sm:inline">{pkt.timestamp}</span>
                  <Eye className="w-3.5 h-3.5 text-[#78716c] hover:text-[#92400e]" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pluggable Module Adapter Health Grid (All 20 Categories) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#1c1917] tracking-tight flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#b45309]" />
              <span>Pluggable Adapter Health &amp; Telemetry Matrix</span>
            </h3>
            <p className="text-xs text-[#57534e]">
              Showing telemetry metrics for {filteredPlugins.length} of {plugins.length} installed protocol adapters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPluginId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedPluginId === 'all'
                  ? 'bg-[#ffffff] text-[#92400e] border border-[#b45309]'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              Show All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPlugins.map((plugin) => {
            const metrics = moduleMetrics[plugin.id] || {
              packetRate: 480,
              byteRateKb: 180,
              latencyMs: 1.8,
              bufferPercent: 22,
              cpuLoad: 14,
              errorRatePercent: 0,
              circuitStatus: 'HEALTHY'
            };

            return (
              <div
                key={plugin.id}
                className="p-5 rounded-2xl bg-[#ffffff] border border-[#e8dfd3] hover:border-[#b45309] transition-all shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#faf6ee] border border-[#e8dfd3] text-[#92400e] group-hover:border-[#b45309] transition-all">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#b45309]">
                            #{plugin.categoryIndex.toString().padStart(2, '0')}
                          </span>
                          <h4 className="font-bold text-sm text-[#1c1917] group-hover:text-[#92400e] transition-colors">
                            {plugin.shortLabel}
                          </h4>
                        </div>
                        <span className="text-[11px] text-[#78716c] block truncate max-w-[200px]">
                          {plugin.name}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                      {metrics.circuitStatus}
                    </span>
                  </div>

                  {/* Telemetry Metrics Gauges */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2 rounded-xl bg-[#faf6ee] border border-[#e8dfd3]">
                      <span className="text-[10px] font-mono text-[#78716c] uppercase block">Throughput</span>
                      <span className="text-xs font-bold text-[#92400e] font-mono mt-0.5 block">
                        {metrics.packetRate} p/s
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#faf6ee] border border-[#e8dfd3]">
                      <span className="text-[10px] font-mono text-[#78716c] uppercase block">Bandwidth</span>
                      <span className="text-xs font-bold text-[#78350f] font-mono mt-0.5 block">
                        {metrics.byteRateKb} KB/s
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#faf6ee] border border-[#e8dfd3]">
                      <span className="text-[10px] font-mono text-[#78716c] uppercase block">Latency</span>
                      <span className="text-xs font-bold text-[#15803d] font-mono mt-0.5 block">
                        {metrics.latencyMs} ms
                      </span>
                    </div>
                  </div>

                  {/* Buffer & CPU Progress Bars */}
                  <div className="space-y-2 mt-3 pt-3 border-t border-[#e8dfd3] font-mono text-[11px]">
                    <div>
                      <div className="flex justify-between text-[#78716c] mb-1">
                        <span>Ring Buffer Utilization</span>
                        <span className="text-[#1c1917] font-bold">{metrics.bufferPercent}%</span>
                      </div>
                      <div className="w-full bg-[#f5eedc] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            metrics.bufferPercent > 75 ? 'bg-amber-500' : 'bg-[#b45309]'
                          }`}
                          style={{ width: `${metrics.bufferPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#78716c] mb-1">
                        <span>Adapter CPU Load</span>
                        <span className="text-[#1c1917] font-bold">{metrics.cpuLoad}%</span>
                      </div>
                      <div className="w-full bg-[#f5eedc] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#78350f] transition-all duration-300"
                          style={{ width: `${metrics.cpuLoad}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e8dfd3] text-xs font-mono">
                  <span className="text-[#78716c] truncate text-[10px]">
                    API: <code className="text-[#b45309] font-bold">{plugin.apiRoute}</code>
                  </span>

                  <button
                    onClick={() => {
                      if (onOpenPluginConfig) {
                        onOpenPluginConfig(plugin);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#faf6ee] hover:bg-[#efe6d8] text-[#92400e] font-bold border border-[#dfd4c3] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Packet Inspection Modal */}
      {inspectedPacket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e8dfd3] rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#b45309]" />
                <h3 className="font-bold text-[#1c1917] text-sm">TELEMETRY PACKET INSPECTOR</h3>
              </div>
              <button
                onClick={() => setInspectedPacket(null)}
                className="px-2.5 py-1 rounded-lg bg-[#faf6ee] text-[#78716c] hover:text-[#1c1917] border border-[#dfd4c3] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#faf6ee] border border-[#e8dfd3] space-y-2 text-[#292524]">
              <div className="flex justify-between"><span className="text-[#78716c]">Packet ID:</span><span className="text-[#1c1917] font-bold">{inspectedPacket.id}</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Adapter Module:</span><span className="text-[#92400e] font-bold">{inspectedPacket.pluginName} ({inspectedPacket.categoryLabel})</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Event Type:</span><span className="text-[#78350f] font-bold">{inspectedPacket.type}</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Protocol Encapsulation:</span><span>{inspectedPacket.protocolType}</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Payload Size:</span><span>{inspectedPacket.sizeBytes} Bytes</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Round-trip Latency:</span><span className="text-[#15803d] font-bold">{inspectedPacket.latencyMs} ms</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Source Node:</span><span>{inspectedPacket.source}</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Target Collector:</span><span>{inspectedPacket.destination}</span></div>
              <div className="flex justify-between"><span className="text-[#78716c]">Timestamp:</span><span>{inspectedPacket.timestamp}</span></div>
            </div>

            <div className="p-3 rounded-xl bg-[#faf6ee] border border-[#e8dfd3] text-[11px] text-[#57534e]">
              Payload Checksum Verified: <code className="text-[#15803d] font-bold">SHA-256 (0x7f2a...9b12)</code> • BTE Identity Anchor Attached.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
