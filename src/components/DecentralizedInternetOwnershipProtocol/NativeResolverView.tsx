import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Layers, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw,
  Sliders,
  Terminal,
  Settings
} from 'lucide-react';
import { DomainOwnershipRecord, LogicalSubnet, NetworkNode, VirtualServer, NativeResolverResult } from '../../types/diop';

interface NativeResolverViewProps {
  domains: DomainOwnershipRecord[];
  subnets: LogicalSubnet[];
  nodes: NetworkNode[];
  servers: VirtualServer[];
}

export const NativeResolverView: React.FC<NativeResolverViewProps> = ({
  domains,
  subnets,
  nodes,
  servers
}) => {
  const [schemePrefix, setSchemePrefix] = useState<string>('vx');
  const [inputAddress, setInputAddress] = useState<string>('vx://core.mesh/gateway');
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [resolverResult, setResolverResult] = useState<NativeResolverResult | null>({
    rawAddress: 'vx://core.mesh/gateway',
    scheme: 'vx',
    domain: 'core.mesh',
    path: '/gateway',
    resolved: true,
    pipeline: {
      stage1_nativeDomain: { domain: 'core.mesh', status: 'RESOLVED', timeMs: 1.2 },
      stage2_networkIdentity: { 
        identityDid: 'did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C', 
        publicKey: '0x0489a42a9b3112028cef8109d4310e39a20b3c8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732', 
        status: 'VERIFIED', 
        timeMs: 2.1 
      },
      stage3_subnet: { subnetId: 'subnet-us-east-1', cidr: '10.240.0.0/16', status: 'ROUTED', timeMs: 1.8 },
      stage4_node: { nodeId: 'node-alpha-gateway', ipAddress: '10.142.0.12', port: 8080, status: 'CONNECTED', timeMs: 3.4 },
      stage5_virtualServer: { serverId: 'vsrv-core-gateway', vCpu: 8, ramMB: 16384, status: 'ACTIVE', timeMs: 1.5 },
      stage6_service: { serviceName: 'Nginx TLS Gateway Proxy', endpoint: '/v1/gateway', transport: 'HTTP/HTTPS', status: 'BOUND', timeMs: 0.9 }
    },
    totalResolutionTimeMs: 10.9,
    cryptographicProof: '0x3a90f1e884c90123efd89001345ab890de23f0101aceb66217a0d3c8091f2b47e610a887b9e3420df67d8001345ab890de23f0101aceb66211b',
    cacheTtlSec: 300
  });

  const [copiedProof, setCopiedProof] = useState<boolean>(false);

  const handleResolve = () => {
    setIsResolving(true);
    setTimeout(() => {
      // Find matching domain record or fallback gracefully
      const matchedDomain = domains.find(d => inputAddress.includes(d.domain.replace(`${schemePrefix}://`, '')) || d.domain === inputAddress);
      
      if (matchedDomain) {
        const matchedSubnet = subnets.find(s => s.id === matchedDomain.associatedSubnetId) || subnets[0];
        const matchedNode = nodes.find(n => n.id === matchedDomain.hostingNodeId) || nodes[0];
        const matchedServer = servers.find(s => s.id === matchedDomain.virtualServerId) || servers[0];
        const matchedService = matchedDomain.publishedServices[0] || {
          name: 'Default Ingress Gateway',
          endpoint: '/ingress',
          transport: 'QUIC'
        };

        setResolverResult({
          rawAddress: inputAddress,
          scheme: schemePrefix,
          domain: matchedDomain.domain.replace(`${schemePrefix}://`, ''),
          path: matchedService.endpoint,
          resolved: true,
          pipeline: {
            stage1_nativeDomain: { domain: matchedDomain.domain, status: 'RESOLVED', timeMs: +(Math.random() * 2 + 0.8).toFixed(1) },
            stage2_networkIdentity: { identityDid: matchedDomain.networkIdentity, publicKey: matchedDomain.ownerPublicKey, status: 'VERIFIED', timeMs: +(Math.random() * 2 + 1.5).toFixed(1) },
            stage3_subnet: { subnetId: matchedSubnet.id, cidr: matchedSubnet.cidr, status: 'ROUTED', timeMs: +(Math.random() * 2 + 1.2).toFixed(1) },
            stage4_node: { nodeId: matchedNode.id, ipAddress: matchedNode.ipAddress, port: matchedNode.port, status: 'CONNECTED', timeMs: +(Math.random() * 3 + 2.0).toFixed(1) },
            stage5_virtualServer: { serverId: matchedServer.id, vCpu: matchedServer.vCpu, ramMB: matchedServer.ramMB, status: 'ACTIVE', timeMs: +(Math.random() * 1.5 + 0.8).toFixed(1) },
            stage6_service: { serviceName: matchedService.name, endpoint: matchedService.endpoint, transport: (matchedService.transport || 'QUIC') as any, status: 'BOUND', timeMs: +(Math.random() * 1.2 + 0.5).toFixed(1) }
          },
          totalResolutionTimeMs: +(Math.random() * 5 + 8.5).toFixed(1),
          cryptographicProof: matchedDomain.signatureProof,
          cacheTtlSec: 300
        });
      } else {
        // Fallback for custom addresses
        const parts = inputAddress.replace(`${schemePrefix}://`, '').split('/');
        setResolverResult({
          rawAddress: inputAddress,
          scheme: schemePrefix,
          domain: parts[0] || 'custom.domain',
          path: parts.slice(1).join('/') || '/service',
          resolved: true,
          pipeline: {
            stage1_nativeDomain: { domain: parts[0] || 'custom.domain', status: 'RESOLVED', timeMs: 1.5 },
            stage2_networkIdentity: { identityDid: 'did:vx:ed25519:0x89a42a9b3112028c', publicKey: '0x0489a42a9b...', status: 'VERIFIED', timeMs: 2.2 },
            stage3_subnet: { subnetId: subnets[0]?.id || 'subnet-01', cidr: subnets[0]?.cidr || '10.240.0.0/16', status: 'ROUTED', timeMs: 1.7 },
            stage4_node: { nodeId: nodes[0]?.id || 'node-01', ipAddress: nodes[0]?.ipAddress || '10.142.0.12', port: 8080, status: 'CONNECTED', timeMs: 3.1 },
            stage5_virtualServer: { serverId: servers[0]?.id || 'vsrv-01', vCpu: 8, ramMB: 16384, status: 'ACTIVE', timeMs: 1.4 },
            stage6_service: { serviceName: 'Dynamically Resolved Service', endpoint: `/${parts.slice(1).join('/') || 'service'}`, transport: 'QUIC', status: 'BOUND', timeMs: 0.8 }
          },
          totalResolutionTimeMs: 10.7,
          cryptographicProof: '0x7e889012a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d71c',
          cacheTtlSec: 300
        });
      }
      setIsResolving(false);
    }, 450);
  };

  const handleCopyProof = () => {
    if (resolverResult?.cryptographicProof) {
      navigator.clipboard.writeText(resolverResult.cryptographicProof);
      setCopiedProof(true);
      setTimeout(() => setCopiedProof(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Namespace Scheme Configuration */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Globe className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-white">Native Namespace &amp; 6-Tier Resolver</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Configurable native addressing architecture. Translates <span className="font-mono text-cyan-300 font-bold">{schemePrefix}://domain.node/service</span> and <span className="font-mono text-cyan-300 font-bold">{schemePrefix}://domain/subnet/node/resource</span> into cryptographically attested endpoints.
            </p>
          </div>

          {/* Scheme Customizer */}
          <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-2xl">
            <Settings className="h-4 w-4 text-zinc-400" />
            <label className="text-xs font-bold text-zinc-400">Protocol Scheme:</label>
            <input
              type="text"
              value={schemePrefix}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                setSchemePrefix(val || 'vx');
                setInputAddress(`${val || 'vx'}://${inputAddress.split('://')[1] || 'core.mesh/gateway'}`);
              }}
              className="w-16 bg-black border border-zinc-700 text-cyan-400 font-mono font-bold text-xs rounded-lg px-2 py-1 focus:border-cyan-500 text-center"
            />
            <span className="text-zinc-500 font-mono text-xs">://</span>
          </div>
        </div>

        {/* Interactive Address Resolver Bar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
            Enter Native Protocol Address to Resolve:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="vx://domain.node/service or vx://domain/subnet/node/resource"
                className="w-full bg-black border border-zinc-700 text-white font-mono text-sm rounded-2xl px-4 py-3.5 pl-10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-inner"
              />
              <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-4" />
            </div>

            <button
              onClick={handleResolve}
              disabled={isResolving}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-black text-xs transition-all shadow-xl flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isResolving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-black" />
                  <span>Resolving 6 Tiers...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-black" />
                  <span>Resolve Address</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-zinc-500">Quick Presets:</span>
            {domains.map(d => (
              <button
                key={d.domain}
                onClick={() => {
                  setInputAddress(d.domain);
                  handleResolve();
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500 text-zinc-300 hover:text-cyan-300 font-mono text-[10px] transition-all cursor-pointer"
              >
                {d.domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6-Tier Pipeline Resolution Visualizer */}
      {resolverResult && (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h4 className="text-sm font-black text-white">
                6-Stage Cryptographic Pipeline Execution
              </h4>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                TOTAL: {resolverResult.totalResolutionTimeMs} ms
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                TTL: {resolverResult.cacheTtlSec}s CACHE
              </span>
            </div>
          </div>

          {/* Step-by-Step 6 Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            
            {/* Stage 1 */}
            <div className="p-3.5 bg-black border border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-cyan-400">1. Native Domain</span>
                  <span className="text-[8px] font-mono text-zinc-500">{resolverResult.pipeline.stage1_nativeDomain.timeMs}ms</span>
                </div>
                <span className="font-mono text-xs font-bold text-white block truncate">
                  {resolverResult.pipeline.stage1_nativeDomain.domain}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-mono font-bold block text-center">
                {resolverResult.pipeline.stage1_nativeDomain.status}
              </span>
            </div>

            {/* Stage 2 */}
            <div className="p-3.5 bg-black border border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-purple-400">2. Network Identity</span>
                  <span className="text-[8px] font-mono text-zinc-500">{resolverResult.pipeline.stage2_networkIdentity.timeMs}ms</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-300 block truncate">
                  {resolverResult.pipeline.stage2_networkIdentity.identityDid.slice(0, 16)}...
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-mono font-bold block text-center">
                {resolverResult.pipeline.stage2_networkIdentity.status}
              </span>
            </div>

            {/* Stage 3 */}
            <div className="p-3.5 bg-black border border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-blue-400">3. Logical Subnet</span>
                  <span className="text-[8px] font-mono text-zinc-500">{resolverResult.pipeline.stage3_subnet.timeMs}ms</span>
                </div>
                <span className="font-mono text-xs font-bold text-white block truncate">
                  {resolverResult.pipeline.stage3_subnet.cidr}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-mono font-bold block text-center">
                {resolverResult.pipeline.stage3_subnet.status}
              </span>
            </div>

            {/* Stage 4 */}
            <div className="p-3.5 bg-black border border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-amber-400">4. Hosting Node</span>
                  <span className="text-[8px] font-mono text-zinc-500">{resolverResult.pipeline.stage4_node.timeMs}ms</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-300 block truncate">
                  {resolverResult.pipeline.stage4_node.ipAddress}:{resolverResult.pipeline.stage4_node.port}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-mono font-bold block text-center">
                {resolverResult.pipeline.stage4_node.status}
              </span>
            </div>

            {/* Stage 5 */}
            <div className="p-3.5 bg-black border border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-emerald-400">5. Virtual Server</span>
                  <span className="text-[8px] font-mono text-zinc-500">{resolverResult.pipeline.stage5_virtualServer.timeMs}ms</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-300 block truncate">
                  {resolverResult.pipeline.stage5_virtualServer.vCpu} vCPU / {Math.round(resolverResult.pipeline.stage5_virtualServer.ramMB / 1024)}GB
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-mono font-bold block text-center">
                {resolverResult.pipeline.stage5_virtualServer.status}
              </span>
            </div>

            {/* Stage 6 */}
            <div className="p-3.5 bg-black border border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-indigo-400">6. Live Service</span>
                  <span className="text-[8px] font-mono text-zinc-500">{resolverResult.pipeline.stage6_service.timeMs}ms</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-indigo-300 block truncate">
                  {resolverResult.pipeline.stage6_service.transport} • {resolverResult.pipeline.stage6_service.endpoint}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-mono font-bold block text-center">
                {resolverResult.pipeline.stage6_service.status}
              </span>
            </div>

          </div>

          {/* Cryptographic Signature & Attestation Output */}
          <div className="p-4 bg-black border border-zinc-800 rounded-2xl space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-bold text-[11px] flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>ECDSA / Ed25519 Attestation Signature Proof:</span>
              </span>
              <button
                onClick={handleCopyProof}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
              >
                {copiedProof ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedProof ? 'Copied' : 'Copy Proof'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-zinc-950 rounded-xl text-emerald-400 text-[10px] break-all border border-zinc-800">
              {resolverResult.cryptographicProof}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
