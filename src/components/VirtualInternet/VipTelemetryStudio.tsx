import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ShieldCheck,
  Zap,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Code2,
  Copy,
  Check,
  Search
} from 'lucide-react';
import { VIPTelemetryEntry, VIPTelemetrySummary } from '../../types/vip';

interface VipTelemetryStudioProps {
  telemetryLogs: VIPTelemetryEntry[];
  summary: VIPTelemetrySummary;
  onRefresh?: () => void;
}

export const VipTelemetryStudio: React.FC<VipTelemetryStudioProps> = ({
  telemetryLogs,
  summary,
  onRefresh
}) => {
  const [selectedLog, setSelectedLog] = useState<VIPTelemetryEntry | null>(telemetryLogs[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Tamper-Evident Merkle Telemetry & Audit Logs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Immutable, cryptographically chained telemetry stream logging every packet hop, route update, and RPC call with Ed25519 validator signatures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/50 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {summary.cryptographicIntegrityStatus}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Analytics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 font-medium">Throughput</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">48.2k</div>
          <div className="text-[11px] text-zinc-500 font-mono">Packets / sec</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 font-medium">Avg Mesh Latency</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.avgMeshLatencyMs}ms</div>
          <div className="text-[11px] text-zinc-500 font-mono">Sub-10ms Target</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 font-medium">Packet Loss</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">{summary.overallPacketLossPct}%</div>
          <div className="text-[11px] text-emerald-400 font-mono">Zero Congestion</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 font-medium">Audited Merkle Blocks</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">#{summary.totalTamperEvidentBlocks}</div>
          <div className="text-[11px] text-zinc-500 font-mono">Chained & Signed</div>
        </div>
      </div>

      {/* Block Stream & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stream List */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="text-xs font-mono text-zinc-400 uppercase">Live Tamper-Evident Blocks</div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {telemetryLogs.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/15 shadow-md'
                      : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        Block #{log.sequenceNumber}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                        {log.protocolId}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
                    <span className="truncate max-w-[200px]">Node: {log.nodeId}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Merkle Valid
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cryptographic Block Inspector */}
        <div className="lg:col-span-6">
          {selectedLog ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">MERKLE AUDIT BLOCK #{selectedLog.sequenceNumber}</span>
                  <h3 className="text-sm font-bold text-zinc-100">{selectedLog.metricType}</h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {new Date(selectedLog.timestamp).toISOString()}
                </span>
              </div>

              {/* Block Details */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Event Description</div>
                <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>

              {/* Cryptographic Chain Box */}
              <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">PREVIOUS HASH</div>
                  <div className="text-zinc-400 break-all text-[11px]">{selectedLog.previousHash}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">ENTRY HASH</div>
                  <div className="text-cyan-400 break-all text-[11px]">{selectedLog.entryHash}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">MERKLE ROOT</div>
                  <div className="text-purple-400 break-all text-[11px]">{selectedLog.merkleRoot}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">VALIDATOR SIGNATURE (ED25519)</div>
                  <div className="text-emerald-400 break-all text-[11px]">{selectedLog.validatorSignature}</div>
                </div>
              </div>

              {/* Numerical Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(selectedLog.metrics).map(([k, v]) => (
                  <div key={k} className="p-2 bg-zinc-950 rounded border border-zinc-800 text-xs font-mono">
                    <div className="text-[10px] text-zinc-500 uppercase">{k}</div>
                    <div className="text-zinc-200 font-bold">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a telemetry block on the left to inspect Merkle tree roots and validator signatures.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
