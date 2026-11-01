import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Radio,
  Plus,
  Zap,
  Activity,
  Server,
  Code2,
  CheckCircle2,
  RefreshCw,
  Send,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { VIPPublishedService } from '../../types/vip';
import { VIPClient } from '../../services/vipSdk';

interface VipServicesDiscoveryProps {
  services: VIPPublishedService[];
  onInvokeService?: (vnetUri: string) => void;
}

export const VipServicesDiscovery: React.FC<VipServicesDiscoveryProps> = ({
  services,
  onInvokeService
}) => {
  const [selectedService, setSelectedService] = useState<VIPPublishedService | null>(services[0] || null);
  const [rpcMethod, setRpcMethod] = useState('predict');
  const [rpcParams, setRpcParams] = useState('{\n  "input": "Synthesize sovereign neural weights",\n  "maxTokens": 256\n}');
  const [rpcResponse, setRpcResponse] = useState<any>(null);
  const [isCalling, setIsCalling] = useState(false);

  const handleRpcInvoke = async () => {
    if (!selectedService) return;
    setIsCalling(true);
    try {
      const client = new VIPClient();
      let parsed = {};
      try {
        parsed = JSON.parse(rpcParams);
      } catch {
        parsed = { text: rpcParams };
      }
      const response = await client.rpcCall(selectedService.vnetUri, rpcMethod, parsed);
      setRpcResponse(response);
    } catch (err: any) {
      setRpcResponse({ error: err.message });
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            Virtual Services & Dynamic Discovery
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Decentralized microservices, RPC contracts, port bindings, and real-time execution across the virtual overlay mesh.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/50">
          {services.length} Services Online
        </span>
      </div>

      {/* Grid: Services List & Interactive RPC Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Services List */}
        <div className="lg:col-span-6 space-y-3">
          {services.map((svc) => {
            const isSelected = selectedService?.id === svc.id;
            return (
              <div
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/10 shadow-lg'
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-sm text-zinc-100">{svc.vnetUri}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                    {svc.transport}
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
                  <span>Server: <span className="text-zinc-200">{svc.serverName}</span></span>
                  <span className="text-zinc-500">Port :{svc.port}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>Rate Limit: <span className="text-zinc-300">{svc.rateLimitReqSec} req/s</span></span>
                  <span>Avg RTT: <span className="text-emerald-400 font-bold">{svc.avgLatencyMs}ms</span></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live RPC Invoker */}
        <div className="lg:col-span-6">
          {selectedService ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">RPC INVOCATION CONSOLE</span>
                  <h3 className="text-base font-bold text-zinc-100">{selectedService.vnetUri}</h3>
                </div>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                  {selectedService.endpointPath}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">RPC Method</label>
                  <input
                    type="text"
                    value={rpcMethod}
                    onChange={(e) => setRpcMethod(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Parameters (JSON)</label>
                  <textarea
                    rows={4}
                    value={rpcParams}
                    onChange={(e) => setRpcParams(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handleRpcInvoke}
                  disabled={isCalling}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  {isCalling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>Invoke Virtual Service RPC ({selectedService.transport})</span>
                </button>
              </div>

              {/* RPC Response Box */}
              {rpcResponse && (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Response Received</span>
                    <span className="text-emerald-400">{rpcResponse.latencyMs}ms RTT</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg max-h-[180px] overflow-y-auto font-mono text-xs text-zinc-300">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(rpcResponse, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a service on the left to invoke RPC methods.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
