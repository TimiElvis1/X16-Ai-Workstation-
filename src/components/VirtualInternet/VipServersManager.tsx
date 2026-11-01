import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  Plus,
  Zap,
  Activity,
  Cpu,
  Layers,
  Compass,
  CheckCircle2,
  Lock,
  Radio,
  X,
  RefreshCw
} from 'lucide-react';
import { VIPServer } from '../../types/vip';

interface VipServersManagerProps {
  servers: VIPServer[];
  onCreateServer?: (server: Partial<VIPServer>) => void;
}

export const VipServersManager: React.FC<VipServersManagerProps> = ({
  servers,
  onCreateServer
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [domainBindingUri, setDomainBindingUri] = useState('vnet://neural.edge/compute');
  const [vCpu, setVCpu] = useState(16);
  const [ramMB, setRamMB] = useState(32768);
  const [storageGB, setStorageGB] = useState(1000);
  const [osEngine, setOsEngine] = useState('Alpine VIP Microkernel v24.2');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !onCreateServer) return;
    onCreateServer({
      name,
      domainBindingUri,
      vCpu: Number(vCpu),
      ramMB: Number(ramMB),
      storageGB: Number(storageGB),
      osEngine,
      status: 'ACTIVE',
      uptimeSeconds: 10,
      cpuUsagePct: 5,
      ramUsageMB: 1024,
      replicationFactor: 3
    });
    setShowCreateModal(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            Virtual Server Microkernels
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Deterministic isolated compute instances executing stateful microservices with memory ring-buffers and sovereign domain bindings.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy Virtual Server</span>
        </button>
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servers.map((srv) => (
          <div
            key={srv.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 shadow-lg hover:border-purple-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-purple-400 font-bold">{srv.id}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  {srv.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-100">{srv.name}</h3>
              <div className="text-xs font-mono text-cyan-400 truncate">
                Domain Binding: {srv.domainBindingUri}
              </div>
              <div className="text-xs font-mono text-zinc-500">
                OS Engine: <span className="text-zinc-300">{srv.osEngine}</span>
              </div>
            </div>

            {/* Compute Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/80 text-xs font-mono">
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">vCPU CORES</div>
                <div className="text-zinc-200 font-semibold">{srv.vCpu} Cores</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">RAM ALLOC</div>
                <div className="text-zinc-200 font-semibold">{(srv.ramMB / 1024).toFixed(0)} GB</div>
              </div>
              <div className="p-2 bg-zinc-950/80 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">STORAGE</div>
                <div className="text-zinc-200 font-semibold">{srv.storageGB} GB NVMe</div>
              </div>
            </div>

            {/* Usage Gauges */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/50 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>CPU: {srv.cpuUsagePct}%</span>
                <span>RAM: {srv.ramUsageMB} MB</span>
                <span className="text-emerald-400">Repl Factor: {srv.replicationFactor}x</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${srv.cpuUsagePct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deploy Server Modal */}
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
                  <Server className="w-5 h-5 text-purple-400" />
                  Deploy Virtual Server Instance
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
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Server Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Inference Gateway Host"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Domain Binding URI</label>
                  <input
                    type="text"
                    required
                    value={domainBindingUri}
                    onChange={(e) => setDomainBindingUri(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">vCPU Cores</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={128}
                      value={vCpu}
                      onChange={(e) => setVCpu(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">RAM (MB)</label>
                    <input
                      type="number"
                      required
                      min={1024}
                      value={ramMB}
                      onChange={(e) => setRamMB(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Storage (GB)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={storageGB}
                      onChange={(e) => setStorageGB(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Microkernel OS Engine</label>
                  <select
                    value={osEngine}
                    onChange={(e) => setOsEngine(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Alpine VIP Microkernel v24.2">Alpine VIP Microkernel v24.2</option>
                    <option value="Ubuntu 24.04 Hardened VIP Server">Ubuntu 24.04 Hardened VIP Server</option>
                    <option value="NVIDIA CUDA Linux VIP Kernel">NVIDIA CUDA Linux VIP Kernel</option>
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
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Deploy Instance
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
