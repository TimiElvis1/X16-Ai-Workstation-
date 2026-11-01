import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Plus,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Lock,
  Compass,
  ArrowUpRight,
  Server,
  Cpu,
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react';
import { VirtualNetwork, VIPCipher, VIPConsensusType, VIPTransportAdapter } from '../../types/vip';

interface VipNetworksManagerProps {
  networks: VirtualNetwork[];
  onCreateNetwork: (net: Partial<VirtualNetwork>) => void;
  onSelectNetwork?: (networkId: string) => void;
}

export const VipNetworksManager: React.FC<VipNetworksManagerProps> = ({
  networks,
  onCreateNetwork,
  onSelectNetwork
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [vnetUri, setVnetUri] = useState('vnet://enterprise-mesh');
  const [cidrBlock, setCidrBlock] = useState('10.250.0.0/16');
  const [description, setDescription] = useState('');
  const [defaultTransport, setDefaultTransport] = useState<VIPTransportAdapter>('QUIC');
  const [encryptionCipher, setEncryptionCipher] = useState<VIPCipher>('ChaCha20-Poly1305');
  const [consensusMechanism, setConsensusMechanism] = useState<VIPConsensusType>('PROOF_OF_BANDWIDTH');
  const [accessPolicy, setAccessPolicy] = useState<'PUBLIC_OPEN' | 'PERMISSIONED_CONSORTIUM' | 'PRIVATE_ISOLATED'>('PERMISSIONED_CONSORTIUM');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !vnetUri) return;
    onCreateNetwork({
      name,
      vnetUri,
      cidrBlock,
      description: description || 'Sovereign overlay network partition',
      defaultTransport,
      encryptionCipher,
      consensusMechanism,
      accessPolicy
    });
    setShowCreateModal(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Virtual Overlay Networks
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Decentralized sovereign overlay networks with consensus-driven topology, zero-trust CIDR partitions, and authenticated ciphers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Virtual Network</span>
        </button>
      </div>

      {/* Network Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {networks.map((net) => (
          <div
            key={net.id}
            onClick={() => onSelectNetwork && onSelectNetwork(net.id)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-cyan-500/50 transition-all p-5 space-y-4 shadow-lg flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-400 font-bold">{net.vnetUri}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {net.defaultTransport}
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                {net.name}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {net.description}
              </p>
            </div>

            {/* Network Specs */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/80 text-xs font-mono">
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">OVERLAY CIDR</div>
                <div className="text-zinc-200 font-semibold">{net.cidrBlock}</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">CIPHER</div>
                <div className="text-emerald-400 font-semibold truncate">{net.encryptionCipher}</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">CONSENSUS</div>
                <div className="text-cyan-400 font-semibold truncate">{net.consensusMechanism}</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">AVG LATENCY</div>
                <div className="text-zinc-200 font-semibold">{net.avgLatencyMs}ms RTT</div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/50">
              <span>{net.nodesCount} Nodes · {net.serversCount} Servers</span>
              <span className="text-emerald-400 font-bold">{net.healthScorePct}% Health</span>
            </div>
          </div>
        ))}
      </div>

      {/* Provision Network Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Provision Sovereign Virtual Network
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Network Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., AGVORA Enterprise Mesh"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">vnet:// URI</label>
                    <input
                      type="text"
                      required
                      value={vnetUri}
                      onChange={(e) => setVnetUri(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">CIDR Block</label>
                    <input
                      type="text"
                      required
                      value={cidrBlock}
                      onChange={(e) => setCidrBlock(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Default Transport</label>
                    <select
                      value={defaultTransport}
                      onChange={(e) => setDefaultTransport(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="QUIC">QUIC (0-RTT)</option>
                      <option value="UDP">UDP</option>
                      <option value="TCP">TCP</option>
                      <option value="WebSocket">WebSocket</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Encryption Cipher</label>
                    <select
                      value={encryptionCipher}
                      onChange={(e) => setEncryptionCipher(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
                      <option value="AES-256-GCM">AES-256-GCM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Consensus Mechanism</label>
                  <select
                    value={consensusMechanism}
                    onChange={(e) => setConsensusMechanism(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="PROOF_OF_BANDWIDTH">Proof-of-Bandwidth (Decentralized Mesh)</option>
                    <option value="PROOF_OF_AUTHORITY">Proof-of-Authority (Zero-Trust Enterprise)</option>
                    <option value="BYZANTINE_FAULT_TOLERANT">Byzantine Fault Tolerant (BFT)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Provision Network
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
