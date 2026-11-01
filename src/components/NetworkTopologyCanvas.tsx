import React, { useState } from 'react';
import { 
  NetworkNode, 
  PrivateServer, 
  CodeInjunction 
} from '../types';
import { 
  Server, 
  Database, 
  Cpu, 
  Activity, 
  Radio, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Globe, 
  ExternalLink,
  Play,
  Search,
  Filter
} from 'lucide-react';

interface TopologyProps {
  nodes: NetworkNode[];
  servers: PrivateServer[];
  injunctions: CodeInjunction[];
  onSelectServer: (serverId: string) => void;
  onRunInjunction: (injunctionId: string, params: any) => void;
  onPingNode: (ip: string) => void;
}

export const NetworkTopologyCanvas: React.FC<TopologyProps> = ({
  nodes,
  servers,
  injunctions,
  onSelectServer,
  onRunInjunction,
  onPingNode
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-gateway");
  const [subnetFilter, setSubnetFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const matchedServer = servers.find(s => s.ipAddress === selectedNode?.ip || (s.name || '').toLowerCase().includes(selectedNode?.label.toLowerCase() || ""));

  // Calculate Subnet Stats
  const activeCount = nodes.filter(n => n.status === 'active').length;
  const avgLatency = Math.round(servers.reduce((acc, s) => acc + s.latencyMs, 0) / (servers.length || 1));
  const totalBandwidth = nodes.reduce((acc, n) => acc + (n.bandwidthKbps || 0), 0);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-5 w-5 text-purple-400" />;
      case 'gateway':
        return <ShieldCheck className="h-5 w-5 text-cyan-400" />;
      case 'ai_agent':
        return <Cpu className="h-5 w-5 text-indigo-400" />;
      case 'tool':
        return <Terminal className="h-5 w-5 text-emerald-400" />;
      default:
        return <Server className="h-5 w-5 text-blue-400" />;
    }
  };

  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase()) || n.ip.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div id="network-topology-view" className="space-y-6">
      
      {/* Top Topology Banner & Stat Pills */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-cyan-950/80 rounded-lg text-cyan-400 border border-cyan-800/50">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Sub-Connective Gateway</div>
            <div className="text-lg font-bold text-slate-100 font-mono">10.142.0.0/16</div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Subnet Tunnel Active</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-indigo-950/80 rounded-lg text-indigo-400 border border-indigo-800/50">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Nodes Connected</div>
            <div className="text-lg font-bold text-slate-100 font-mono">
              {activeCount} / {nodes.length} <span className="text-xs text-slate-400 font-normal">Active</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {servers.length} Provisioned Private Servers
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-950/80 rounded-lg text-emerald-400 border border-emerald-800/50">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Avg Latency Index</div>
            <div className="text-lg font-bold text-slate-100 font-mono">{avgLatency} ms</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              Zero packet loss across mesh
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-purple-950/80 rounded-lg text-purple-400 border border-purple-800/50">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mesh Bandwidth</div>
            <div className="text-lg font-bold text-slate-100 font-mono">{(totalBandwidth / 1000).toFixed(2)} MB/s</div>
            <div className="text-[11px] text-purple-300 font-medium mt-0.5">
              WireGuard TLS Encrypted
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive SVG Network Map (2 columns) */}
        <div className="lg:col-span-2 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col min-h-[480px]">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                Sub-Connective Network Topology
              </h3>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter nodes or IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Canvas SVG Area */}
          <div className="relative flex-1 bg-slate-950/90 rounded-xl border border-slate-800/80 p-4 overflow-hidden flex items-center justify-center">
            
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            <svg className="w-full h-[380px] z-10">
              <defs>
                <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Draw Connection Wires */}
              {(nodes || []).map(node => {
                return (node?.connections || []).map(targetId => {
                  const targetNode = (nodes || []).find(n => n.id === targetId);
                  if (!targetNode) return null;

                  return (
                    <g key={`wire-${node.id}-${targetId}`}>
                      {/* Base Wire */}
                      <line
                        x1={node.x}
                        y1={node.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke="url(#wireGrad)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="opacity-60"
                      />
                      
                      {/* Signal Pulse Particle */}
                      <circle r="3" fill="#38bdf8">
                        <animateMotion
                          path={`M${node.x},${node.y} L${targetNode.x},${targetNode.y}`}
                          dur={`${2 + (Math.sin(node.x) + 1)}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                });
              })}

              {/* Render Node Circles */}
              {filteredNodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Glow Ring */}
                    <circle
                      r={isSelected ? "28" : "22"}
                      className={`transition-all duration-300 ${
                        isSelected 
                          ? 'fill-cyan-950/80 stroke-cyan-400 stroke-2' 
                          : 'fill-slate-900/90 stroke-slate-700 hover:stroke-cyan-500'
                      }`}
                    />

                    {/* Status Pulse */}
                    <circle
                      r="4"
                      cx="14"
                      cy="-14"
                      className={node.status === 'active' ? 'fill-emerald-400 animate-pulse' : 'fill-amber-400'}
                    />

                    {/* Center Icon */}
                    <foreignObject x="-10" y="-10" width="20" height="20">
                      <div className="flex items-center justify-center h-full w-full">
                        {getNodeIcon(node.type)}
                      </div>
                    </foreignObject>

                    {/* Label Badge below Node */}
                    <text
                      y="36"
                      textAnchor="middle"
                      className={`text-[11px] font-medium font-sans fill-slate-200 transition-colors ${
                        isSelected ? 'font-bold fill-cyan-300' : ''
                      }`}
                    >
                      {node.label}
                    </text>

                    {/* IP Badge */}
                    <text
                      y="48"
                      textAnchor="middle"
                      className="text-[9px] font-mono fill-slate-400"
                    >
                      {node.ip}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Topology Legend Footer */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-4 text-[10px] text-slate-400">
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span>Gateway</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                <span>AI Core</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                <span>Vector DB</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Automation Worker</span>
              </span>
            </div>
          </div>
        </div>

        {/* Selected Node Details & Inspector (1 column) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-slate-800 rounded-lg">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{selectedNode.label}</h4>
                  <span className="text-xs font-mono text-cyan-400">{selectedNode.ip}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                {selectedNode.status}
              </span>
            </div>

            {/* Node Metadata List */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Node ID</span>
                <span className="font-mono text-slate-200">{selectedNode.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Type Architecture</span>
                <span className="font-semibold text-cyan-300 uppercase">{selectedNode.type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Subnet Target</span>
                <span className="font-mono text-slate-200">subnet-us-east-1</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Mesh Bandwidth</span>
                <span className="font-mono text-emerald-400">{selectedNode.bandwidthKbps || 1000} Kbps</span>
              </div>
            </div>

            {/* Attached Server Telemetry if available */}
            {matchedServer ? (
              <div className="mt-5 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Matched Private Server:</span>
                  <span className="font-mono text-indigo-400">{matchedServer.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>CPU Allocation</span>
                    <span>{matchedServer.cpuUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full" 
                      style={{ width: `${matchedServer.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>RAM Usage</span>
                    <span>{matchedServer.ramUsage} / {matchedServer.maxRam} MB</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${(matchedServer.ramUsage / matchedServer.maxRam) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-3 bg-slate-950/40 rounded-xl border border-slate-800/40 text-[11px] text-slate-500 italic text-center">
                Virtual Node routing via SubNet gateway
              </div>
            )}

            {/* Applicable Code Injunctions for this node */}
            <div className="mt-5">
              <h5 className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1">
                <span>Bound Code Injunctions</span>
              </h5>
              <div className="space-y-2">
                {injunctions.slice(0, 2).map(inj => (
                  <div key={inj.id} className="p-2.5 bg-slate-950/90 rounded-lg border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-slate-200">{inj.name}</div>
                      <div className="text-[10px] text-slate-400">{inj.parameters.length} Input Params</div>
                    </div>
                    <button
                      onClick={() => onRunInjunction(inj.id, { ipAddress: selectedNode.ip })}
                      className="p-1.5 rounded-md bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 transition-colors"
                      title="Execute Injunction"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Quick Action Buttons */}
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => onPingNode(selectedNode.ip)}
              className="w-full py-2 px-3 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-medium flex items-center justify-center space-x-2 transition-all"
            >
              <Radio className="h-3.5 w-3.5 text-cyan-400" />
              <span>Ping Node ({selectedNode.ip})</span>
            </button>

            {matchedServer && (
              <button
                onClick={() => onSelectServer(matchedServer.id)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center space-x-2 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Private Server Workspace</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
