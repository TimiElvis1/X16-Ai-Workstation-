import React, { useState } from 'react';
import { 
  Globe, 
  Layers, 
  Server, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Radio, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Info,
  Key,
  Lock,
  Box
} from 'lucide-react';
import { 
  DomainOwnershipRecord, 
  LogicalSubnet, 
  NetworkNode, 
  VirtualServer, 
  PublishedService 
} from '../../types/diop';

interface VisualNetworkExplorerProps {
  domains: DomainOwnershipRecord[];
  subnets: LogicalSubnet[];
  nodes: NetworkNode[];
  servers: VirtualServer[];
  onSelectDomain?: (domain: string) => void;
  onSelectServer?: (serverId: string) => void;
  onSelectNode?: (nodeId: string) => void;
  onNavigateTab?: (tabName: string) => void;
}

export const VisualNetworkExplorer: React.FC<VisualNetworkExplorerProps> = ({
  domains = [],
  subnets = [],
  nodes = [],
  servers = [],
  onSelectDomain,
  onSelectServer,
  onSelectNode,
  onNavigateTab
}) => {
  const [selectedDomainKey, setSelectedDomainKey] = useState<string>(domains?.[0]?.domain || 'vx://core.mesh/gateway');
  const activeDomain = (domains || []).find(d => d.domain === selectedDomainKey) || domains?.[0];
  const activeSubnet = (subnets || []).find(s => s.id === activeDomain?.associatedSubnetId) || subnets?.[0];
  const activeNode = (nodes || []).find(n => n.id === activeDomain?.hostingNodeId) || nodes?.[0];
  const activeServer = (servers || []).find(s => s.id === activeDomain?.virtualServerId) || servers?.[0];
  const activeServices = activeServer?.publishedServices || [];

  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Globe className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Decentralized Visual Network Explorer
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono font-bold animate-pulse">
              LIVE MESH TOPOLOGY
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
            Interactive 5-tier cryptographic routing topology: <strong className="text-zinc-200">Domain ➔ Subnet ➔ Node ➔ Virtual Server ➔ Service</strong>. Inspect verified ownership, virtual hardware allocations, and real-time telemetry pipelines.
          </p>
        </div>

        {/* Domain Selector Pill */}
        <div className="flex items-center space-x-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Select Domain:</label>
          <select
            value={selectedDomainKey}
            onChange={(e) => {
              setSelectedDomainKey(e.target.value);
              if (onSelectDomain) onSelectDomain(e.target.value);
            }}
            className="bg-zinc-900 border border-zinc-700 text-cyan-300 font-mono text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {domains.map(d => (
              <option key={d.domain} value={d.domain}>
                {d.domain} ({d.ownerIdentity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5-Tier Visual Flow Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        
        {/* TIER 1: DOMAIN */}
        <div 
          onMouseEnter={() => setHoveredTier('domain')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
            hoveredTier === 'domain' 
              ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-500 shadow-lg shadow-cyan-950/50' 
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-black uppercase">
                Tier 1: Domain
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="font-mono text-xs font-black text-white break-all flex items-center space-x-1">
              <Globe className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{activeDomain?.domain}</span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Identity: <span className="font-mono text-zinc-300">{activeDomain?.networkIdentity.slice(0, 16)}...</span>
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[10px] space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Owner:</span>
              <span className="text-zinc-200 font-bold truncate max-w-[90px]">{activeDomain?.ownerIdentity}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">{activeDomain?.domainStatus}</span>
            </div>
          </div>
        </div>

        {/* TIER 2: SUBNET */}
        <div 
          onMouseEnter={() => setHoveredTier('subnet')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
            hoveredTier === 'subnet' 
              ? 'bg-purple-950/40 border-purple-400 ring-1 ring-purple-500 shadow-lg shadow-purple-950/50' 
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] font-black uppercase">
                Tier 2: Subnet
              </span>
              <Layers className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div className="font-mono text-xs font-black text-white break-all">
              {activeSubnet?.name}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              CIDR: <span className="text-purple-300 font-bold">{activeSubnet?.cidr}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[10px] space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Encryption:</span>
              <span className="text-zinc-300 font-bold">{activeSubnet?.encryptionMode.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Nodes / Cap:</span>
              <span className="text-purple-300 font-bold">{activeSubnet?.totalNodes} Nodes / {activeSubnet?.bandwidthCapGbps}G</span>
            </div>
          </div>
        </div>

        {/* TIER 3: NODE */}
        <div 
          onMouseEnter={() => setHoveredTier('node')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
            hoveredTier === 'node' 
              ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-500 shadow-lg shadow-amber-950/50' 
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-black uppercase">
                Tier 3: Node
              </span>
              <Server className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="font-mono text-xs font-black text-white break-all">
              {activeNode?.name}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              IP: <span className="text-amber-300 font-bold">{activeNode?.ipAddress}:{activeNode?.port}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[10px] space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Health:</span>
              <span className="text-emerald-400 font-bold">{activeNode?.healthScore}% (Score)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Latency:</span>
              <span className="text-amber-300 font-bold">{activeNode?.latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* TIER 4: VIRTUAL SERVER */}
        <div 
          onMouseEnter={() => setHoveredTier('server')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
            hoveredTier === 'server' 
              ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-500 shadow-lg shadow-emerald-950/50' 
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-black uppercase">
                Tier 4: V-Server
              </span>
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="font-mono text-xs font-black text-white break-all">
              {activeServer?.name}
            </div>
            <p className="text-[10px] text-zinc-400">
              Specs: <span className="font-mono text-emerald-300 font-bold">{activeServer?.vCpu} vCPU / {Math.round((activeServer?.ramMB || 0) / 1024)}GB RAM</span>
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[10px] space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>CPU Usage:</span>
              <span className="text-zinc-200 font-bold">{activeServer?.cpuUsagePct}%</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Replication:</span>
              <span className="text-emerald-400 font-bold">{activeServer?.replicationFactor}x Raft</span>
            </div>
          </div>
        </div>

        {/* TIER 5: SERVICES */}
        <div 
          onMouseEnter={() => setHoveredTier('service')}
          onMouseLeave={() => setHoveredTier(null)}
          className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
            hoveredTier === 'service' 
              ? 'bg-blue-950/40 border-blue-400 ring-1 ring-blue-500 shadow-lg shadow-blue-950/50' 
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px] font-black uppercase">
                Tier 5: Services ({activeServices.length})
              </span>
              <Zap className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="space-y-1">
              {activeServices.slice(0, 2).map((svc) => (
                <div key={svc.id} className="p-1.5 rounded-lg bg-black/60 border border-zinc-800 text-[10px] font-mono flex items-center justify-between">
                  <span className="text-blue-300 truncate max-w-[100px]">{svc.name}</span>
                  <span className="px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[8px] font-bold">{svc.transport}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[10px] space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Subscribers:</span>
              <span className="text-cyan-300 font-bold">{activeServices.reduce((acc, s) => acc + s.activeSubscribers, 0)} Active</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">ALL ONLINE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Deep Inspection Panel & Cryptographic Proof Details */}
      <div className="p-5 bg-black/80 border border-zinc-800 rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Cryptographic Ownership Verification Card */}
        <div className="space-y-2 border-b lg:border-b-0 lg:border-r border-zinc-800 lg:pr-5">
          <div className="flex items-center space-x-2 text-xs font-black text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Cryptographic Ownership Verification</span>
          </div>
          <div className="space-y-1.5 text-xs text-zinc-400">
            <div className="flex justify-between text-[11px]">
              <span>Verification Status:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-black border border-emerald-800 text-[10px]">
                {activeDomain?.ownershipVerificationStatus}
              </span>
            </div>
            <div className="text-[10px]">
              <span className="text-zinc-500 block">Owner Public Key (Secp256k1/Ed25519):</span>
              <span className="font-mono text-zinc-300 break-all">{activeDomain?.ownerPublicKey}</span>
            </div>
            <div className="text-[10px]">
              <span className="text-zinc-500 block">Cryptographic Signature Proof:</span>
              <span className="font-mono text-emerald-400 break-all">{activeDomain?.signatureProof}</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Probes */}
        <div className="space-y-2 border-b lg:border-b-0 lg:border-r border-zinc-800 lg:pr-5">
          <div className="flex items-center space-x-2 text-xs font-black text-white">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Real-Time Node & Server Telemetry</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[9px] text-zinc-500 block">Throughput Stream</span>
              <span className="font-mono font-black text-cyan-300">{activeDomain?.telemetryState.streamThroughputKbps} Kbps</span>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[9px] text-zinc-500 block">Anomaly Sensor</span>
              <span className="font-mono font-black text-emerald-400">HEALTHY (0.00%)</span>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[9px] text-zinc-500 block">Ring Buffer</span>
              <span className="font-mono font-black text-purple-300">{activeServer?.ringBufferKB} KB</span>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[9px] text-zinc-500 block">Ping Interval</span>
              <span className="font-mono font-black text-amber-300">{activeDomain?.telemetryState.pingIntervalSec}s</span>
            </div>
          </div>
        </div>

        {/* Published Services Inspection & Quick Jump */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-white">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Published Endpoints ({activeServices.length})</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">VSP-HOST ACTIVE</span>
          </div>
          
          <div className="space-y-2">
            {activeServices.map(svc => (
              <div key={svc.id} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">{svc.name}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[9px] font-bold">
                    {svc.transport} • Port {svc.port}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Endpoint: <strong className="text-cyan-300">{svc.endpoint}</strong></span>
                  <span className="text-emerald-400">{svc.activeSubscribers} Subs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
