import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Compass,
  Database,
  Radio,
  FileCode2,
  RefreshCw
} from 'lucide-react';
import { VirtualNetwork, VIPNode, VIPServer, VIPDomainRecord, VIPPublishedService, VIPTelemetrySummary } from '../../types/vip';
import { vipProtocolCatalog } from '../../data/vipProtocolsDatabase';

interface VipOverviewDashboardProps {
  summary: VIPTelemetrySummary;
  networks: VirtualNetwork[];
  nodes: VIPNode[];
  servers: VIPServer[];
  domains: VIPDomainRecord[];
  services: VIPPublishedService[];
  onNavigateTab: (tabId: string) => void;
  onQuickResolve: (uri: string) => void;
}

export const VipOverviewDashboard: React.FC<VipOverviewDashboardProps> = ({
  summary,
  networks = [],
  nodes = [],
  servers = [],
  domains = [],
  services = [],
  onNavigateTab,
  onQuickResolve
}) => {
  const [quickAddressInput, setQuickAddressInput] = useState('vnet://neural.edge/inference');
  const [activeLayerHighlight, setActiveLayerHighlight] = useState<number | null>(null);

  const architectureLayers = [
    { level: 1, name: 'User Layer', desc: 'Sovereign operator & multi-sig accounts', icon: ShieldCheck, color: 'text-indigo-400', tab: 'security' },
    { level: 2, name: 'Virtual Identity', desc: 'W3C DIDs & Ed25519 cryptographic anchors', icon: Lock, color: 'text-emerald-400', tab: 'security' },
    { level: 3, name: 'Virtual Network', desc: 'Consensus overlay mesh & CIDR allocation', icon: Globe, color: 'text-cyan-400', tab: 'networks' },
    { level: 4, name: 'Virtual Subnet', desc: 'Micro-segmentation & zero-trust isolation', icon: Layers, color: 'text-sky-400', tab: 'subnets' },
    { level: 5, name: 'Virtual Node', desc: 'Hardware attestation & transport binding', icon: Cpu, color: 'text-amber-400', tab: 'nodes' },
    { level: 6, name: 'Virtual Server', desc: 'Microkernel compute & memory ring-buffers', icon: Server, color: 'text-purple-400', tab: 'servers' },
    { level: 7, name: 'Virtual Domain', desc: 'Cryptographic DNSSEC zone mapping', icon: Compass, color: 'text-rose-400', tab: 'domains' },
    { level: 8, name: 'Virtual Service', desc: 'Published RPC endpoints & rate limiting', icon: Radio, color: 'text-emerald-400', tab: 'services' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / System Health */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                VIP OVERLAY ACTIVE
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700">
                RFC-VSP & RFC-NIP Standardized
              </span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/50">
                20 Sovereign Protocols
              </span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
              Virtual Internet Protocol Platform
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Modular, cryptographic network overlay operating over standard IP transports (TCP, UDP, QUIC, WebSocket, WebRTC, HTTPS) with zero-trust addressing and tamper-evident telemetry.
            </p>
          </div>

          {/* Quick URI Resolver Box */}
          <div className="w-full lg:w-auto min-w-[360px] bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase flex items-center justify-between">
              <span>Quick Virtual Address Resolver</span>
              <span className="text-cyan-400 text-[10px]">vnet:// scheme</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={quickAddressInput}
                onChange={(e) => setQuickAddressInput(e.target.value)}
                placeholder="vnet://domain.edge/service"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => onQuickResolve(quickAddressInput)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>Resolve</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigateTab('networks')}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Virtual Networks</span>
            <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{networks.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">10.240.0.0/12 Mesh</div>
        </div>

        <div
          onClick={() => onNavigateTab('nodes')}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Active Nodes</span>
            <Cpu className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{nodes.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">100% Attested</div>
        </div>

        <div
          onClick={() => onNavigateTab('servers')}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Virtual Servers</span>
            <Server className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{servers.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">Microkernels Active</div>
        </div>

        <div
          onClick={() => onNavigateTab('domains')}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Virtual Domains</span>
            <Compass className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{domains.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">DNSSEC Anchored</div>
        </div>

        <div
          onClick={() => onNavigateTab('protocols')}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Protocol Catalog</span>
            <FileCode2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{vipProtocolCatalog.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">10 VSP / 10 NIP</div>
        </div>

        <div
          onClick={() => onNavigateTab('telemetry')}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Throughput</span>
            <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">48.2k</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">Packets / sec</div>
        </div>
      </div>

      {/* 8-Layer Sovereign Stack Map */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Sovereign 8-Layer Architecture Stack
            </h3>
            <p className="text-xs text-zinc-400">
              User → Virtual Identity → Network → Subnet → Node → Server → Domain → Service
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Click any layer to jump into management
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {architectureLayers.map((layer) => {
            const Icon = layer.icon;
            const isHovered = activeLayerHighlight === layer.level;
            return (
              <div
                key={layer.level}
                onMouseEnter={() => setActiveLayerHighlight(layer.level)}
                onMouseLeave={() => setActiveLayerHighlight(null)}
                onClick={() => onNavigateTab(layer.tab)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                  isHovered
                    ? 'border-cyan-500 bg-zinc-800/80 shadow-lg'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                    LAYER 0{layer.level}
                  </span>
                  <Icon className={`w-4 h-4 ${layer.color}`} />
                </div>
                <div className="font-semibold text-sm text-zinc-200">{layer.name}</div>
                <div className="text-xs text-zinc-400 mt-1 leading-snug">{layer.desc}</div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60 pt-2">
                  <span>Manage</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column: Active Transport Overlays & Live Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Transports & Overlay Nodes */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Physical Transport Bindings & Nodes
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
              No IPv4/IPv6 replacement
            </span>
          </div>

          <div className="space-y-2.5">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-zinc-200">{node.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {node.role}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    Physical: <span className="text-zinc-400">{node.physicalTransportBinding.ipAddress}:{node.physicalTransportBinding.port}</span> ({node.physicalTransportBinding.protocol})
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="text-right">
                    <div className="text-xs font-mono text-zinc-300">{node.resourceUsage.networkRxMbps} Mbps</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{node.latencyToGatewayMs}ms RTT</div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-900/50">
                    {node.healthScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Published Services & Endpoints */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Live Virtual Services & Endpoints
            </h3>
            <button
              onClick={() => onNavigateTab('services')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All ({services.length})
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200">{svc.vnetUri}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                      {svc.transport}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    Bound Server: <span className="text-zinc-400">{svc.serverName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-mono text-zinc-300">{svc.activeSubscribers} Subs</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{svc.avgLatencyMs}ms Avg</div>
                  </div>
                  <button
                    onClick={() => onQuickResolve(svc.vnetUri)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  >
                    Invoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
