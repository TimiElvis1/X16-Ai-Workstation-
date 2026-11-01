import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileCode2,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  Play,
  Lock
} from 'lucide-react';
import { VIPProtocolDefinition, VIPProtocolGroup } from '../../types/vip';
import { vipProtocolCatalog } from '../../data/vipProtocolsDatabase';

interface VipProtocolsRegistryProps {
  onRunSandboxForProtocol?: (protocolCode: string) => void;
}

export const VipProtocolsRegistry: React.FC<VipProtocolsRegistryProps> = ({
  onRunSandboxForProtocol
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'ALL' | 'VSP' | 'NIP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProtocol, setActiveProtocol] = useState<VIPProtocolDefinition | null>(vipProtocolCatalog[0]);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const filteredProtocols = vipProtocolCatalog.filter((proto) => {
    const matchesGroup = selectedGroup === 'ALL' || proto.group === selectedGroup;
    const matchesSearch =
      proto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proto.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proto.rfcNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proto.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const vspCount = vipProtocolCatalog.filter((p) => p.group === 'VSP').length;
  const nipCount = vipProtocolCatalog.filter((p) => p.group === 'NIP').length;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Protocol Group Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-400" />
            Virtual Internet Protocol (VIP) Specification Registry
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            20 standardized protocols organized into Virtual Server Protocols (VSP) and Network Protocols (NIP) with RFC specifications and JSON schemas.
          </p>
        </div>

        {/* Group Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-start lg:self-auto">
          <button
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              selectedGroup === 'ALL'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Protocols ({vipProtocolCatalog.length})
          </button>
          <button
            onClick={() => setSelectedGroup('VSP')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              selectedGroup === 'VSP'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold'
                : 'text-zinc-400 hover:text-cyan-400'
            }`}
          >
            <span>VSP Group</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/50">{vspCount}</span>
          </button>
          <button
            onClick={() => setSelectedGroup('NIP')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              selectedGroup === 'NIP'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold'
                : 'text-zinc-400 hover:text-emerald-400'
            }`}
          >
            <span>NIP Group</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/50">{nipCount}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Protocol List / Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by RFC, protocol code, or keyword..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredProtocols.map((proto) => {
              const isSelected = activeProtocol?.id === proto.id;
              const isVsp = proto.group === 'VSP';
              return (
                <div
                  key={proto.id}
                  onClick={() => setActiveProtocol(proto)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? isVsp
                        ? 'border-cyan-500 bg-cyan-950/20 shadow-md'
                        : 'border-emerald-500 bg-emerald-950/20 shadow-md'
                      : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isVsp
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        }`}
                      >
                        {proto.rfcNumber}
                      </span>
                      <span className="text-xs font-mono font-semibold text-zinc-200">
                        {proto.code}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">v{proto.version}</span>
                  </div>

                  <div className="font-semibold text-sm text-zinc-100">{proto.name}</div>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {proto.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60 pt-2">
                    <span>Transport: <span className="text-zinc-300 font-semibold">{proto.primaryTransport}</span></span>
                    <span className="text-emerald-400">{proto.metrics.packetThroughputSec.toLocaleString()} pkt/s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Protocol Specification & Schema Inspector */}
        <div className="lg:col-span-7">
          {activeProtocol ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                        activeProtocol.group === 'VSP'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {activeProtocol.group === 'VSP' ? 'Virtual Server Protocol' : 'Network Protocol'}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{activeProtocol.rfcNumber}</span>
                    <span className="text-xs font-mono text-emerald-400">● {activeProtocol.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100">{activeProtocol.name} ({activeProtocol.code})</h3>
                </div>

                <div className="flex items-center gap-2">
                  {onRunSandboxForProtocol && (
                    <button
                      onClick={() => onRunSandboxForProtocol(activeProtocol.code)}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Test in Sandbox</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Protocol Spec Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <div className="text-[10px] font-mono text-zinc-500">PRIMARY TRANSPORT</div>
                  <div className="text-sm font-mono font-bold text-cyan-400">{activeProtocol.primaryTransport}</div>
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <div className="text-[10px] font-mono text-zinc-500">HEADER MAGIC</div>
                  <div className="text-sm font-mono font-bold text-purple-400">{activeProtocol.headerMagic}</div>
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <div className="text-[10px] font-mono text-zinc-500">DEFAULT PORT</div>
                  <div className="text-sm font-mono font-bold text-amber-400">:{activeProtocol.portDefault}</div>
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <div className="text-[10px] font-mono text-zinc-500">ENCRYPTION CIPHER</div>
                  <div className="text-sm font-mono font-bold text-emerald-400 truncate">{activeProtocol.securityRequirements.encryptionAlgorithm}</div>
                </div>
              </div>

              {/* Documentation Text */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold">Protocol Overview & Specification</h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/70 p-3 rounded-lg border border-zinc-800/80">
                  {activeProtocol.documentation}
                </p>
              </div>

              {/* Security Profile */}
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-2">
                <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Security & Cryptographic Invariants
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="text-zinc-400">
                    Signatures: <span className="text-zinc-200">{activeProtocol.securityRequirements.signatureAlgorithm}</span>
                  </div>
                  <div className="text-zinc-400">
                    Min TLS: <span className="text-zinc-200">{activeProtocol.securityRequirements.minTlsVersion}</span>
                  </div>
                  <div className="text-zinc-400">
                    Replay Protection: <span className="text-emerald-400">{activeProtocol.securityRequirements.replayProtection ? 'Active' : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* JSON Schema Definition */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    JSON Wire Schema ({activeProtocol.schemaVersion})
                  </h4>
                  <button
                    onClick={() => copyCode(JSON.stringify(activeProtocol.schemaDefinition, null, 2))}
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Schema</span>
                  </button>
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg max-h-[220px] overflow-y-auto font-mono text-xs text-zinc-300">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(activeProtocol.schemaDefinition, null, 2)}</pre>
                </div>
              </div>

              {/* Developer Code Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
                    TypeScript VIP-SDK Integration
                  </h4>
                  <button
                    onClick={() => copyCode(activeProtocol.codeSnippet)}
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Code</span>
                  </button>
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-cyan-300 overflow-x-auto">
                  <pre className="whitespace-pre">{activeProtocol.codeSnippet}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a protocol on the left to inspect its RFC specification and JSON wire schema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
