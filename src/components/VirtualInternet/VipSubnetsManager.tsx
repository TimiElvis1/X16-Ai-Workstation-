import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Plus,
  Zap,
  Activity,
  Globe,
  Lock,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { VIPSubnet } from '../../types/vip';

interface VipSubnetsManagerProps {
  subnets: VIPSubnet[];
  onCreateSubnet?: (subnet: Partial<VIPSubnet>) => void;
}

export const VipSubnetsManager: React.FC<VipSubnetsManagerProps> = ({
  subnets,
  onCreateSubnet
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            Virtual Subnet Micro-Segmentation
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Encrypted overlay CIDR partitions enabling zero-trust isolation and multi-region packet routing over physical gateways.
          </p>
        </div>

        <span className="text-xs font-mono text-sky-400 bg-sky-950/40 px-3 py-1 rounded-full border border-sky-800/50">
          {subnets.length} Active Subnets
        </span>
      </div>

      {/* Subnets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subnets.map((sub) => (
          <div
            key={sub.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 shadow-lg hover:border-sky-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-sky-400 font-bold">{sub.vnetUri}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  {sub.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-100">{sub.name}</h3>
              <div className="text-xs font-mono text-zinc-400">
                Region: <span className="text-zinc-200">{sub.region}</span>
              </div>
            </div>

            {/* Subnet Specs */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/80 text-xs font-mono">
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">CIDR BLOCK</div>
                <div className="text-zinc-200 font-semibold">{sub.cidr}</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">OVERLAY MTU</div>
                <div className="text-zinc-200 font-semibold">{sub.overlayMtu} Bytes</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">GATEWAY NODE</div>
                <div className="text-cyan-400 font-semibold truncate">{sub.gatewayNodeId}</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">ENCRYPTION</div>
                <div className="text-emerald-400 font-semibold truncate">{sub.encryptionState}</div>
              </div>
            </div>

            {/* Subnet Utilization */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/50 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Bandwidth: {sub.bandwidthUtilizationPct}%</span>
                <span>Loss: {sub.packetLossPct}%</span>
                <span className="text-zinc-300">{sub.routingTableEntriesCount} Routes</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full"
                  style={{ width: `${sub.bandwidthUtilizationPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
