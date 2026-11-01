import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Plus,
  ShieldCheck,
  Zap,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  X,
  Server,
  FileCode2
} from 'lucide-react';
import { VIPDomainRecord } from '../../types/vip';

interface VipDomainsManagerProps {
  domains: VIPDomainRecord[];
  onRegisterDomain?: (domain: string, targetServerId: string) => void;
}

export const VipDomainsManager: React.FC<VipDomainsManagerProps> = ({
  domains,
  onRegisterDomain
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [selectedServer, setSelectedServer] = useState('vsrv-neural-gateway');
  const [activeDomain, setActiveDomain] = useState<VIPDomainRecord | null>(domains[0] || null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain || !onRegisterDomain) return;
    onRegisterDomain(newDomain, selectedServer);
    setShowModal(false);
    setNewDomain('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-400" />
            Virtual Domain Name & DNSSEC Registry
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Decentralized sovereign domain registry binding human-readable names to virtual servers and cryptographic DIDs without centralized ICANN root servers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register Sovereign Domain</span>
        </button>
      </div>

      {/* Main Grid: Domain List & Zone Record Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Domain List */}
        <div className="lg:col-span-5 space-y-3">
          {domains.map((dom) => {
            const isSelected = activeDomain?.id === dom.id;
            return (
              <div
                key={dom.id}
                onClick={() => setActiveDomain(dom)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-950/10 shadow-lg'
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-sm text-zinc-100">{dom.domain}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    {dom.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-cyan-400 truncate">
                  Address: {dom.vnetAddress}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>Queries (24h): <span className="text-zinc-200">{dom.trafficQueries24h.toLocaleString()}</span></span>
                  <span className="text-emerald-400">DNSSEC Valid</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Zone Record Details */}
        <div className="lg:col-span-7">
          {activeDomain ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-rose-400 font-bold">{activeDomain.domain}</span>
                    <span className="text-xs font-mono text-zinc-400">● {activeDomain.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100">{activeDomain.vnetAddress}</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">
                  {activeDomain.accessPolicy}
                </span>
              </div>

              {/* Owner DID Box */}
              <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Cryptographic Owner Anchor (DID)</div>
                <div className="text-xs font-mono text-zinc-200 break-all">{activeDomain.ownerIdentityDid}</div>
                <div className="text-[10px] font-mono text-zinc-500">Owner Name: <span className="text-zinc-300">{activeDomain.ownerName}</span></div>
              </div>

              {/* DNSSEC Zone Records Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Sovereign DNSSEC Zone Records
                </h4>
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-2.5">TYPE</th>
                        <th className="p-2.5">NAME</th>
                        <th className="p-2.5">VALUE / TARGET</th>
                        <th className="p-2.5">TTL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/40">
                      {activeDomain.zoneRecords.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/30">
                          <td className="p-2.5 font-bold text-cyan-400">{rec.type}</td>
                          <td className="p-2.5 text-zinc-300">{rec.name}</td>
                          <td className="p-2.5 text-zinc-200 truncate max-w-[200px]">{rec.value}</td>
                          <td className="p-2.5 text-zinc-500">{rec.ttlSec}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cryptographic Signature Proofs */}
              <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">DNSSEC Signature Proof</div>
                <div className="text-xs font-mono text-emerald-400 break-all">{activeDomain.dnssecProof}</div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a domain on the left to inspect zone records and DNSSEC signatures.
            </div>
          )}
        </div>
      </div>

      {/* Register Domain Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-rose-400" />
                  Register Sovereign Virtual Domain
                </h3>
                <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Domain Name</label>
                  <input
                    type="text"
                    required
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="e.g., ai-mesh.edge"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Target Virtual Server</label>
                  <select
                    value={selectedServer}
                    onChange={(e) => setSelectedServer(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="vsrv-neural-gateway">vsrv-neural-gateway (Frankfurt)</option>
                    <option value="vsrv-vault-auth">vsrv-vault-auth (Virginia)</option>
                    <option value="vsrv-p2p-relay">vsrv-p2p-relay (Singapore)</option>
                    <option value="vsrv-ai-inference-worker">vsrv-ai-inference-worker (Oregon GPU)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Register Domain
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
