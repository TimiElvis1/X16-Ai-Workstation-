import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Server,
  Zap,
  Activity,
  ShieldCheck,
  Globe,
  Radio,
  ArrowUpRight,
  RefreshCw,
  HardDrive,
  Network
} from 'lucide-react';
import { VIPNode } from '../../types/vip';

interface VipNodesManagerProps {
  nodes: VIPNode[];
  onSelectNode?: (nodeId: string) => void;
}

export const VipNodesManager: React.FC<VipNodesManagerProps> = ({
  nodes,
  onSelectNode
}) => {
  const [selectedNode, setSelectedNode] = useState<VIPNode | null>(nodes[0] || null);

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            Virtual & Physical Node Management
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cryptographic node anchors bound to physical IP transport interfaces with TPM/SGX hardware attestation and real-time QoS benchmarking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {nodes.length} Nodes Active & Attested
          </span>
        </div>
      </div>

      {/* Nodes Grid / Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Node Cards */}
        <div className="lg:col-span-6 space-y-3">
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-950/10 shadow-lg'
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-sm text-zinc-100">{node.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {node.role}
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Physical: <span className="text-zinc-200">{node.physicalTransportBinding.ipAddress}:{node.physicalTransportBinding.port}</span></span>
                  <span className="text-cyan-400">({node.physicalTransportBinding.protocol})</span>
                  <span className="text-zinc-500">{node.physicalTransportBinding.publicDns}</span>
                </div>

                {/* Resource Usage Bars */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>CPU Load</span>
                      <span className="text-zinc-200">{node.resourceUsage.cpuPct}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${node.resourceUsage.cpuPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>RAM Usage</span>
                      <span className="text-zinc-200">{node.resourceUsage.ramPct}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${node.resourceUsage.ramPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                  <span>Throughput: <span className="text-emerald-400">{node.resourceUsage.networkRxMbps} Mbps</span></span>
                  <span>Health: <span className="text-emerald-400 font-bold">{node.healthScore}%</span></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Node Inspector */}
        <div className="lg:col-span-6">
          {selectedNode ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">{selectedNode.role}</span>
                    <span className="text-xs font-mono text-zinc-400">● {selectedNode.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100">{selectedNode.name}</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">
                  {selectedNode.healthScore}% Health
                </span>
              </div>

              {/* Hardware Attestation Box */}
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-3">
                <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Hardware Attestation Proof & Specs
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800/60">
                    <div className="text-[10px] text-zinc-500">CPU CORES</div>
                    <div className="text-zinc-200 font-bold">{selectedNode.hardwareSpecs.cpuCores} Threads</div>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800/60">
                    <div className="text-[10px] text-zinc-500">TOTAL RAM</div>
                    <div className="text-zinc-200 font-bold">{selectedNode.hardwareSpecs.totalRamGB} GB ECC</div>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800/60">
                    <div className="text-[10px] text-zinc-500">DISK ARRAY</div>
                    <div className="text-zinc-200 font-bold truncate">{selectedNode.hardwareSpecs.diskType}</div>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800/60">
                    <div className="text-[10px] text-zinc-500">NIC SPEED</div>
                    <div className="text-emerald-400 font-bold">{selectedNode.hardwareSpecs.nicSpeedGbps} Gbps</div>
                  </div>
                </div>
              </div>

              {/* DID Identity Anchor */}
              <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Cryptographic Node Anchor (DID)</div>
                <div className="text-xs font-mono text-zinc-200 break-all">{selectedNode.nodeIdentityDid}</div>
                <div className="text-[10px] font-mono text-zinc-500">Overlay URI: <span className="text-cyan-400">{selectedNode.vnetUri}</span></div>
              </div>

              {/* Physical Transport Details */}
              <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  Physical Transport Mapping
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-zinc-400">IP: <span className="text-zinc-200">{selectedNode.physicalTransportBinding.ipAddress}</span></div>
                  <div className="text-zinc-400">Port: <span className="text-zinc-200">:{selectedNode.physicalTransportBinding.port}</span></div>
                  <div className="text-zinc-400">Protocol: <span className="text-cyan-400">{selectedNode.physicalTransportBinding.protocol}</span></div>
                  <div className="text-zinc-400">Gateway RTT: <span className="text-emerald-400">{selectedNode.latencyToGatewayMs}ms</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a node to inspect hardware attestation and transport bindings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
