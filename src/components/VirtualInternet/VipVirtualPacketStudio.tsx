import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Activity,
  Code2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Compass,
  ArrowRight,
  Radio,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { VirtualPacket, VirtualPacketReceipt, VIPAddressResolution, VIPTransportAdapter } from '../../types/vip';
import { VIPEngine } from '../../services/vipEngine';
import { VIPRouter } from '../../services/vipRouter';

interface VipVirtualPacketStudioProps {
  initialUri?: string;
}

export const VipVirtualPacketStudio: React.FC<VipVirtualPacketStudioProps> = ({
  initialUri = 'vnet://neural.edge/inference'
}) => {
  const [targetUri, setTargetUri] = useState(initialUri);
  const [sourceUri, setSourceUri] = useState('vnet://mesh-primary/sub-eu-central/vnode-fra-01/client');
  const [payloadText, setPayloadText] = useState('{\n  "query": "Execute sovereign tensor inference",\n  "model": "Gemini-VIP-Edge",\n  "temperature": 0.2\n}');
  const [transport, setTransport] = useState<VIPTransportAdapter>('QUIC');
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'>('HIGH');

  const [resolution, setResolution] = useState<VIPAddressResolution | null>(() => VIPEngine.resolveVnetAddress(initialUri));
  const [isResolving, setIsResolving] = useState(false);

  const [dispatchedPackets, setDispatchedPackets] = useState<Array<{ packet: VirtualPacket; receipt: VirtualPacketReceipt }>>([]);
  const [selectedPacket, setSelectedPacket] = useState<VirtualPacket | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [tracerouteResult, setTracerouteResult] = useState<any>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleResolve = () => {
    setIsResolving(true);
    setTimeout(() => {
      try {
        const res = VIPEngine.resolveVnetAddress(targetUri);
        setResolution(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsResolving(false);
      }
    }, 200);
  };

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      try {
        let parsedPayload: any = { message: "VirtualPacket transmission" };
        try {
          parsedPayload = JSON.parse(payloadText);
        } catch {
          parsedPayload = { rawText: payloadText };
        }

        const packet = VIPEngine.buildVirtualPacket({
          sourceUri,
          destinationUri: targetUri,
          payload: parsedPayload,
          transport,
          encrypt: enableEncryption,
          priority
        });

        const receipt = VIPEngine.dispatchPacket(packet);

        setDispatchedPackets(prev => [{ packet, receipt }, ...prev]);
        setSelectedPacket(packet);
      } catch (err) {
        console.error('Dispatch error:', err);
      } finally {
        setIsSending(false);
      }
    }, 300);
  };

  const handleRunTraceroute = () => {
    setIsTracing(true);
    setTimeout(() => {
      const trace = VIPRouter.runTraceroute(sourceUri, targetUri);
      setTracerouteResult(trace);
      setIsTracing(false);
    }, 400);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Virtual Addressing & VirtualPacket Wire Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Resolve sovereign "vnet://" addresses through the 8-layer stack and dispatch cryptographically signed VirtualPackets over QUIC/UDP/TCP transports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTargetUri('vnet://neural.edge/inference');
              setSourceUri('vnet://mesh-primary/sub-eu-central/vnode-fra-01/client');
              handleResolve();
            }}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-mono transition-colors cursor-pointer"
          >
            Example: neural.edge
          </button>
          <button
            onClick={() => {
              setTargetUri('vnet://vault.secure/auth');
              setSourceUri('vnet://mesh-primary/sub-us-east/vnode-iad-01/client');
              handleResolve();
            }}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-mono transition-colors cursor-pointer"
          >
            Example: vault.secure
          </button>
        </div>
      </div>

      {/* 1. Universal "vnet://" Address Resolver Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-zinc-200">
              Universal 8-Layer "vnet://" Stack Resolver
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
            Deterministic DID Binding
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={targetUri}
              onChange={(e) => setTargetUri(e.target.value)}
              placeholder="vnet://domain.edge/service or vnet://network/subnet/node/server/service"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={handleResolve}
            disabled={isResolving}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isResolving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            <span>Resolve Stack</span>
          </button>
          <button
            onClick={handleRunTraceroute}
            disabled={isTracing}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Traceroute</span>
          </button>
        </div>

        {/* 8-Layer Stack Breakdown Cards */}
        {resolution && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/60 pb-2">
              <span>Resolution Pipeline: {resolution.totalResolutionTimeMs}ms RTT</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cryptographic Proof: {resolution.cryptographicProof.slice(0, 16)}...
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {/* Layer 1: User */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L1: User</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer1_user.userId}</div>
                <div className="text-[10px] text-indigo-400 font-mono">{resolution.resolutionPipeline.layer1_user.role}</div>
              </div>

              {/* Layer 2: Identity */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L2: Identity (DID)</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer2_identity.did}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{resolution.resolutionPipeline.layer2_identity.algorithm}</div>
              </div>

              {/* Layer 3: Network */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L3: Network</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer3_network.networkId}</div>
                <div className="text-[10px] text-cyan-400 font-mono">Mesh Overlay</div>
              </div>

              {/* Layer 4: Subnet */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L4: Subnet</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer4_subnet.subnetId}</div>
                <div className="text-[10px] text-sky-400 font-mono">{resolution.resolutionPipeline.layer4_subnet.cidr}</div>
              </div>

              {/* Layer 5: Node */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L5: Node</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer5_node.nodeId}</div>
                <div className="text-[10px] text-amber-400 font-mono">{resolution.resolutionPipeline.layer5_node.transport} : {resolution.resolutionPipeline.layer5_node.physicalIp}</div>
              </div>

              {/* Layer 6: Server */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L6: Server</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer6_server.serverId}</div>
                <div className="text-[10px] text-purple-400 font-mono">{resolution.resolutionPipeline.layer6_server.status}</div>
              </div>

              {/* Layer 7: Domain */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L7: Domain</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer7_domain.domain}</div>
                <div className="text-[10px] text-rose-400 font-mono">DNSSEC Valid</div>
              </div>

              {/* Layer 8: Service */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">L8: Service</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{resolution.resolutionPipeline.layer8_service.serviceId}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{resolution.resolutionPipeline.layer8_service.endpoint}</div>
              </div>
            </div>
          </div>
        )}

        {/* Traceroute Result Box if triggered */}
        {tracerouteResult && (
          <div className="mt-3 p-3.5 rounded-lg border border-amber-500/30 bg-zinc-950 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Traceroute Probe: {tracerouteResult.totalHops} Hops | Avg RTT {tracerouteResult.avgRttMs}ms
              </span>
              <span className="text-zinc-400">Dest Physical IP: {tracerouteResult.resolvedDestinationIp}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {tracerouteResult.hops.map((hop: any) => (
                <div key={hop.hopIndex} className="p-2 bg-zinc-900/80 border border-zinc-800 rounded text-xs font-mono space-y-0.5">
                  <div className="text-zinc-400 flex justify-between">
                    <span>Hop #{hop.hopIndex}</span>
                    <span className="text-emerald-400">{hop.rttMs}ms</span>
                  </div>
                  <div className="text-zinc-200 font-semibold truncate">{hop.nodeName}</div>
                  <div className="text-[11px] text-zinc-500">{hop.ipAddress} ({hop.transport})</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. VirtualPacket Builder & Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Packet Construction Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Send className="w-4 h-4 text-cyan-400" />
              Construct "VirtualPacket" (NIP-PACKET Spec)
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase block mb-1">
                  Source Address (Sender)
                </label>
                <input
                  type="text"
                  value={sourceUri}
                  onChange={(e) => setSourceUri(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase block mb-1">
                  Destination Address (Recipient)
                </label>
                <input
                  type="text"
                  value={targetUri}
                  onChange={(e) => setTargetUri(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase block mb-1">
                    Transport
                  </label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value as VIPTransportAdapter)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="QUIC">QUIC (Default)</option>
                    <option value="UDP">UDP</option>
                    <option value="TCP">TCP</option>
                    <option value="WebSocket">WebSocket</option>
                    <option value="WebRTC">WebRTC</option>
                    <option value="HTTPS">HTTPS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase block mb-1">
                    Encryption
                  </label>
                  <button
                    onClick={() => setEnableEncryption(!enableEncryption)}
                    className={`w-full py-1.5 rounded text-xs font-mono flex items-center justify-center gap-1 transition-colors ${
                      enableEncryption
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>{enableEncryption ? 'ChaCha20' : 'Plaintext'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase block mb-1 flex items-center justify-between">
                  <span>Packet Payload (JSON / RPC)</span>
                  <span className="text-[10px] text-zinc-500">Payload Hash Auto-Computed</span>
                </label>
                <textarea
                  rows={4}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleDispatch}
                disabled={isSending}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Sign & Dispatch VirtualPacket Over {transport}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Wire Inspector & Stream */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                VirtualPacket Wire & Security Envelope Inspector
              </h3>
              {selectedPacket && (
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedPacket, null, 2), 'pkt-json')}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono cursor-pointer"
                >
                  {copiedId === 'pkt-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy JSON</span>
                </button>
              )}
            </div>

            {selectedPacket ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
                    <div className="text-[10px] font-mono text-zinc-500">MAGIC HEADER</div>
                    <div className="text-xs font-mono text-cyan-400">0x56495031 (VIP1)</div>
                  </div>
                  <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
                    <div className="text-[10px] font-mono text-zinc-500">PACKET ID</div>
                    <div className="text-xs font-mono text-zinc-200 truncate">{selectedPacket.header.packetId}</div>
                  </div>
                  <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
                    <div className="text-[10px] font-mono text-zinc-500">ENCRYPTION</div>
                    <div className="text-xs font-mono text-emerald-400">{selectedPacket.header.flags.encrypted ? 'ChaCha20-Poly1305' : 'None'}</div>
                  </div>
                  <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
                    <div className="text-[10px] font-mono text-zinc-500">SIGNATURE</div>
                    <div className="text-xs font-mono text-indigo-400 truncate">Ed25519 Verified</div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg max-h-[300px] overflow-y-auto font-mono text-xs text-zinc-300">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(selectedPacket, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-lg">
                No packet dispatched yet. Click "Sign & Dispatch VirtualPacket" on the left to inject a live packet into the overlay mesh.
              </div>
            )}

            {/* Dispatched History List */}
            {dispatchedPackets.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="text-xs font-mono text-zinc-400">Recent Dispatched Packets ({dispatchedPackets.length})</div>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                  {dispatchedPackets.map(({ packet, receipt }) => (
                    <div
                      key={packet.header.packetId}
                      onClick={() => setSelectedPacket(packet)}
                      className={`p-2 rounded border cursor-pointer text-xs font-mono flex items-center justify-between transition-colors ${
                        selectedPacket?.header.packetId === packet.header.packetId
                          ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                          : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="truncate">{packet.header.packetId}</span>
                        <span className="text-[10px] text-zinc-500">({packet.header.destinationUri})</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{receipt.latencyMs}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
