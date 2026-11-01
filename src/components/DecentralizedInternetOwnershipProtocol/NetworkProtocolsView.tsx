import React, { useState } from 'react';
import { 
  Network, 
  Key, 
  Search, 
  Globe, 
  Lock, 
  Radio, 
  ShieldCheck, 
  Vote, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Copy, 
  Check, 
  RefreshCw,
  Terminal,
  ShieldAlert,
  Send
} from 'lucide-react';
import { 
  ProtocolDefinition, 
  DiopSession, 
  DomainOwnershipRecord, 
  LogicalSubnet, 
  NetworkNode,
  TransportType
} from '../../types/diop';

interface NetworkProtocolsViewProps {
  nipProtocols: ProtocolDefinition[];
  sessions: DiopSession[];
  domains: DomainOwnershipRecord[];
  subnets: LogicalSubnet[];
  nodes: NetworkNode[];
  onCreateSession: (domain: string, service: string, transport: TransportType) => void;
  onVerifyProof: (domain: string) => Promise<boolean>;
}

export const NetworkProtocolsView: React.FC<NetworkProtocolsViewProps> = ({
  nipProtocols,
  sessions,
  domains,
  subnets,
  nodes,
  onCreateSession,
  onVerifyProof
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'identity' | 'resolution' | 'discovery' | 'routing' | 'sessions' | 'data' | 'ownership' | 'governance'
  >('identity');

  // Interactive DID generation state
  const [selectedKeyAlgo, setSelectedKeyAlgo] = useState<'Ed25519' | 'Secp256k1' | 'RSA-4096'>('Ed25519');
  const [generatedDid, setGeneratedDid] = useState<string>('did:vx:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C');
  const [generatedPubKey, setGeneratedPubKey] = useState<string>('0x0489a42a9b3112028cef8109d4310e39a20b3c8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732');
  const [didProofStatus, setDidProofStatus] = useState<string>('VALIDATED');

  // Route calculation tester
  const [routeOrigin, setRouteOrigin] = useState<string>('subnet-us-east-1');
  const [routeDest, setRouteDest] = useState<string>('subnet-asia-south-1');
  const [computedHops, setComputedHops] = useState<string[]>([
    'Alpha-Edge-Gateway-01 (10.142.0.12)',
    'Mesh-Transit-WireGuard-04 (10.240.8.1)',
    'Singapore-Harvester-101 (10.142.4.88)'
  ]);

  // Session creator state
  const [targetDomain, setTargetDomain] = useState<string>(domains[0]?.domain || 'vx://core.mesh/gateway');
  const [targetService, setTargetService] = useState<string>('Nginx TLS Gateway Proxy');
  const [targetTransport, setTargetTransport] = useState<TransportType>('QUIC');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateIdentity = () => {
    const hex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const pub = '0x04' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setGeneratedDid(`did:vx:${selectedKeyAlgo.toLowerCase()}:0x${hex}`);
    setGeneratedPubKey(pub);
    setDidProofStatus('CRYPTOGRAPHICALLY_ATTESTED');
  };

  return (
    <div className="space-y-6">
      
      {/* NIP Sub-navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'identity', label: 'Network Identity', badge: 'NIP-ID', icon: Key },
            { id: 'resolution', label: 'Domain Resolution', badge: 'NIP-RESOLVE', icon: Globe },
            { id: 'discovery', label: 'Service Discovery', badge: 'NIP-DISCOVER', icon: Search },
            { id: 'routing', label: 'Overlay Routing', badge: 'NIP-ROUTE', icon: Network },
            { id: 'sessions', label: 'Encrypted Sessions', badge: `${sessions.length} Live`, icon: Lock },
            { id: 'data', label: 'Transport Data', badge: 'Agnostic', icon: Activity },
            { id: 'ownership', label: 'Ownership Verification', badge: 'NIP-OWNERSHIP', icon: ShieldCheck },
            { id: 'governance', label: 'Governance & DAO', badge: 'NIP-GOVERNANCE', icon: Vote }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-500 text-white shadow-md font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  isSelected ? 'bg-black/40 text-purple-200' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Protocol Standards Banner */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Network Protocol Standards (NIP-Suite)
            </h4>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">9 TRANSPORT-AGNOSTIC SPECIFICATIONS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {nipProtocols.map(proto => (
            <div key={proto.id} className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center space-y-1 hover:border-purple-500 transition-all">
              <span className="text-[11px] font-black text-purple-300 font-mono block">{proto.identifier}</span>
              <span className="text-[9px] text-zinc-400 block truncate">{proto.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 text-[8px] font-bold font-mono">
                v{proto.version}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SUB-TAB: IDENTITY (NIP-ID) */}
      {activeSubTab === 'identity' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <Key className="h-4 w-4 text-purple-400" />
                  <span>NIP-ID Cryptographic Network Identity Engine</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">W3C DID formatted decentralized identity provider with Zero-Knowledge verification.</p>
              </div>
              <button
                onClick={handleGenerateIdentity}
                className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Generate Keypair</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="text-xs font-bold text-zinc-400">Cryptographic Algorithm:</label>
                {(['Ed25519', 'Secp256k1', 'RSA-4096'] as const).map(algo => (
                  <button
                    key={algo}
                    onClick={() => setSelectedKeyAlgo(algo)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedKeyAlgo === algo
                        ? 'bg-purple-500 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Decentralized Identifier (DID):</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-purple-300 font-bold break-all">{generatedDid}</span>
                    <button
                      onClick={() => handleCopy(generatedDid, 'did')}
                      className="text-zinc-500 hover:text-white p-1 rounded"
                    >
                      {copiedKey === 'did' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Public Key Proof:</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-zinc-300 text-[10px] break-all">{generatedPubKey}</span>
                    <button
                      onClick={() => handleCopy(generatedPubKey, 'pubkey')}
                      className="text-zinc-500 hover:text-white p-1 rounded"
                    >
                      {copiedKey === 'pubkey' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-[10px]">
                  <span>Attestation Status: <strong className="text-emerald-400">{didProofStatus}</strong></span>
                  <span className="text-zinc-500">Zero Private Keys Stored on Client</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Network Identities In Registry
            </h4>
            <div className="space-y-2">
              {domains.map(d => (
                <div key={d.domain} className="p-3 bg-black border border-zinc-800 rounded-xl space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-bold truncate max-w-[120px]">{d.domain}</span>
                    <span className="text-emerald-400 text-[9px] font-bold">{d.domainStatus}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block truncate">{d.networkIdentity}</span>
                  <span className="text-[9px] text-zinc-500 block">Owner: {d.ownerIdentity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: SESSIONS (NIP-SESSION) */}
      {activeSubTab === 'sessions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span>NIP-SESSION Active Cryptographic Channels ({sessions.length})</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Ephemeral Curve25519 ECDH key exchange with HMAC replay protection.</p>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.map(sess => (
                <div key={sess.sessionId} className="p-4 bg-black border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold">
                        {sess.sessionId}
                      </span>
                      <span className="font-bold text-white text-xs">{sess.targetService}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                      {sess.transport}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Domain Binding</span>
                      <span className="text-purple-300 font-bold text-[10px] truncate block">{sess.domain}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Packets</span>
                      <span className="text-cyan-300 font-bold">{sess.packetsExchanged.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Data Transferred</span>
                      <span className="text-emerald-400 font-bold">{(sess.bytesTransferred / 1000000).toFixed(1)} MB</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Security Level</span>
                      <span className="text-amber-300 font-bold text-[9px] truncate block">Forward Secret</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-500 flex justify-between border-t border-zinc-800/80 pt-1">
                    <span>Token: <strong className="text-zinc-300">{sess.sessionToken}</strong></span>
                    <span className="text-emerald-400">STATUS: {sess.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Session Launcher */}
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Establish New Session</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-bold">Select Target Domain:</label>
                <select
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white font-mono text-xs rounded-xl p-2.5 focus:border-purple-500"
                >
                  {domains.map(d => (
                    <option key={d.domain} value={d.domain}>{d.domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-bold">Target Service:</label>
                <input
                  type="text"
                  value={targetService}
                  onChange={(e) => setTargetService(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white font-mono text-xs rounded-xl p-2.5 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-bold">Underlying Transport:</label>
                <select
                  value={targetTransport}
                  onChange={(e) => setTargetTransport(e.target.value as any)}
                  className="w-full bg-black border border-zinc-700 text-white font-mono text-xs rounded-xl p-2.5 focus:border-purple-500"
                >
                  <option value="QUIC">QUIC (0-RTT Handshake)</option>
                  <option value="WebSocket">WebSocket (Bidirectional Stream)</option>
                  <option value="WireGuard">WireGuard (Layer-3 Mesh)</option>
                  <option value="HTTP/HTTPS">HTTP/HTTPS (Secure Ingress)</option>
                  <option value="TCP">TCP Direct Socket</option>
                  <option value="gRPC">gRPC Protobuf Pipeline</option>
                </select>
              </div>

              <button
                onClick={() => onCreateSession(targetDomain, targetService, targetTransport)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Establish Encrypted Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: ROUTING (NIP-ROUTE) */}
      {activeSubTab === 'routing' && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Network className="h-4 w-4 text-cyan-400" />
                <span>NIP-ROUTE Dynamic Multi-Path Mesh Router</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Calculates lowest-jitter multi-path routes across overlay subnets and physical relays.</p>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold">Convergence: 45ms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 font-bold block mb-1">Origin Subnet:</label>
              <select
                value={routeOrigin}
                onChange={(e) => setRouteOrigin(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white font-mono p-2 rounded-xl"
              >
                {subnets.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.cidr})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-400 font-bold block mb-1">Destination Subnet:</label>
              <select
                value={routeDest}
                onChange={(e) => setRouteDest(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white font-mono p-2 rounded-xl"
              >
                {subnets.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.cidr})</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setComputedHops([
                    'Alpha-Edge-Gateway-01 (10.142.0.12)',
                    'Euro-Relay-Tunnel-03 (10.241.0.8)',
                    'Singapore-Harvester-101 (10.142.4.88)'
                  ]);
                }}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl cursor-pointer"
              >
                Recalculate Optimal Mesh Path
              </button>
            </div>
          </div>

          <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Computed Multi-Hop Path:</span>
            <div className="flex flex-wrap items-center gap-2">
              {computedHops.map((hop, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-cyan-300 font-bold">
                    {hop}
                  </div>
                  {idx < computedHops.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-zinc-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: GOVERNANCE (NIP-GOVERNANCE) */}
      {activeSubTab === 'governance' && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Vote className="h-4 w-4 text-amber-400" />
                <span>NIP-GOVERNANCE Decentralized Protocol Upgrades &amp; DAO Proposals</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Stake-weighted voting coordinates protocol versioning without breaking existing nodes.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
              QUORUM: 66.7% REQ
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">NIP-008: QUIC 0-RTT Strict Encryption Upgrade</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">
                  PASSED &amp; ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Enables hardware-accelerated TLS 1.3 handshake resumption over QUIC transports for sub-10ms connections.</p>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-800">
                <span>Votes For: <strong className="text-emerald-400">94.2%</strong></span>
                <span>Stake Weight: <strong className="text-white">423,100 TOKENS</strong></span>
              </div>
            </div>

            <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">VSP-014: Dynamic Memory Ring Buffer Compression</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono font-bold">
                  VOTING OPEN (42h left)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Introduces ZSTD level-3 real-time compression to virtual server ring buffers reducing memory pressure by 40%.</p>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-800">
                <span>Votes For: <strong className="text-emerald-400">78.5%</strong></span>
                <span>Stake Weight: <strong className="text-white">310,000 TOKENS</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs fallback */}
      {(activeSubTab === 'resolution' || activeSubTab === 'discovery' || activeSubTab === 'data' || activeSubTab === 'ownership') && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span>Protocol Component: {activeSubTab.toUpperCase()}</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">SYSTEM ACTIVE</span>
          </div>

          <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2 text-xs">
            <span className="text-zinc-300 font-bold">Modular Protocol Engine State:</span>
            <p className="text-zinc-400 text-[11px]">
              This protocol module operates over transport-agnostic channels (HTTP/HTTPS, TCP, UDP, QUIC, WebSocket, WireGuard, IPC). All operational telemetry is streamed directly through the event engine.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <span className="text-zinc-500 block">Packet Rate</span>
                <span className="text-cyan-300 font-bold">14,200 / sec</span>
              </div>
              <div className="p-2 bg-zinc-900 rounded-lg">
                <span className="text-zinc-500 block">Error Rate</span>
                <span className="text-emerald-400 font-bold">0.000%</span>
              </div>
              <div className="p-2 bg-zinc-900 rounded-lg">
                <span className="text-zinc-500 block">Mean Latency</span>
                <span className="text-purple-300 font-bold">8.4 ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
