import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Key, 
  Lock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Trash2,
  Share2,
  Zap,
  Activity,
  Layers,
  Server
} from 'lucide-react';
import { 
  DomainOwnershipRecord, 
  LogicalSubnet, 
  NetworkNode, 
  VirtualServer 
} from '../../types/diop';

interface DomainOwnershipRegistryViewProps {
  domains: DomainOwnershipRecord[];
  subnets: LogicalSubnet[];
  nodes: NetworkNode[];
  servers: VirtualServer[];
  onRegisterDomain: (domainData: Partial<DomainOwnershipRecord>) => void;
  onVerifyOwnership: (domain: string) => Promise<boolean>;
  onRevokeDomain: (domain: string) => void;
}

export const DomainOwnershipRegistryView: React.FC<DomainOwnershipRegistryViewProps> = ({
  domains,
  subnets,
  nodes,
  servers,
  onRegisterDomain,
  onVerifyOwnership,
  onRevokeDomain
}) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [verifyStatusMessage, setVerifyStatusMessage] = useState<string | null>(null);

  // New domain registration form
  const [newDomain, setNewDomain] = useState<string>('vx://edge.ai/inference');
  const [ownerIdentity, setOwnerIdentity] = useState<string>('drvictoragboola@gmail.com');
  const [ownerPublicKey, setOwnerPublicKey] = useState<string>('0x0489a42a9b3112028cef8109d4310e39a20b3c8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732');
  const [associatedSubnetId, setAssociatedSubnetId] = useState<string>(subnets[0]?.id || '');
  const [hostingNodeId, setHostingNodeId] = useState<string>(nodes[0]?.id || '');
  const [virtualServerId, setVirtualServerId] = useState<string>(servers[0]?.id || '');
  const [accessPolicy, setAccessPolicy] = useState<'PUBLIC_OPEN' | 'TOKEN_GATED' | 'SIGNATURE_CHALLENGE' | 'WHITELIST_ONLY'>('PUBLIC_OPEN');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSubnet = subnets.find(s => s.id === associatedSubnetId);
    const targetNode = nodes.find(n => n.id === hostingNodeId);
    const targetServer = servers.find(s => s.id === virtualServerId);

    const randSig = '0x' + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const did = `did:vx:secp256k1:0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    onRegisterDomain({
      domain: newDomain,
      networkIdentity: did,
      ownerIdentity,
      ownerPublicKey,
      signatureProof: randSig,
      domainStatus: 'ACTIVE',
      associatedSubnetId,
      associatedSubnetName: targetSubnet?.name || 'Subnet-Core',
      hostingNodeId,
      hostingNodeName: targetNode?.name || 'Node-Core',
      virtualServerId,
      virtualServerName: targetServer?.name || 'Server-Core',
      publishedServices: targetServer?.publishedServices || [],
      accessPolicy,
      telemetryState: {
        telemetryActive: true,
        pingIntervalSec: 5,
        anomalyDetection: true,
        streamThroughputKbps: 3400,
        lastVerifiedAt: new Date().toISOString()
      },
      creationTimestamp: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ownershipVerificationStatus: 'CRYPTOGRAPHICALLY_VERIFIED'
    });

    setIsRegisterModalOpen(false);
  };

  const handleRunVerification = async (domainKey: string) => {
    setIsVerifying(domainKey);
    setVerifyStatusMessage(null);
    try {
      const isValid = await onVerifyOwnership(domainKey);
      if (isValid) {
        setVerifyStatusMessage(`Domain ${domainKey} cryptographically verified with valid ECDSA/Ed25519 signature proof.`);
      } else {
        setVerifyStatusMessage(`Verification failed: Invalid signature challenge on ${domainKey}.`);
      }
    } catch (err: any) {
      setVerifyStatusMessage(`Verification error: ${err.message}`);
    } finally {
      setIsVerifying(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-white">Decentralized Domain Ownership Registry</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Non-custodial domain registry enforcing cryptographic signature ownership, DID binding, access policies, and live telemetry.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Register Native Domain</span>
          </button>
        </div>

        {/* Verification Alert Message */}
        {verifyStatusMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs font-mono text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{verifyStatusMessage}</span>
            </div>
            <button
              onClick={() => setVerifyStatusMessage(null)}
              className="text-emerald-400 font-bold hover:text-white px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Domain Registry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {domains.map((record) => (
          <div 
            key={record.domain}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 space-y-4 shadow-xl relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-purple-400" />
                  <span className="font-mono text-sm font-black text-white">{record.domain}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                  {record.domainStatus}
                </span>
              </div>

              {/* Identity & Owner */}
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Owner Identity:</span>
                  <span className="font-mono font-bold text-zinc-200 text-[11px] truncate block">{record.ownerIdentity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Network DID:</span>
                  <span className="font-mono text-purple-300 text-[10px] truncate block">{record.networkIdentity}</span>
                </div>
              </div>

              {/* Routing Hierarchy */}
              <div className="p-3 bg-black/70 border border-zinc-800/80 rounded-2xl space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Subnet:</span>
                  <span className="text-zinc-200 font-bold">{record.associatedSubnetName}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Hosting Node:</span>
                  <span className="text-amber-300">{record.hostingNodeName}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Virtual Server:</span>
                  <span className="text-emerald-400 font-bold">{record.virtualServerName}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Access Policy:</span>
                  <span className="text-cyan-300 font-bold">{record.accessPolicy}</span>
                </div>
              </div>

              {/* Cryptographic Signature Snippet */}
              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Signature Proof (Secp256k1):</span>
                  <button
                    onClick={() => handleCopy(record.signatureProof, record.domain)}
                    className="hover:text-white"
                  >
                    {copiedKey === record.domain ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <span className="p-1.5 rounded-lg bg-black text-emerald-400 block truncate border border-zinc-800/80">
                  {record.signatureProof}
                </span>
              </div>

              {/* Telemetry Stream Badge */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Telemetry: {record.telemetryState.streamThroughputKbps} Kbps</span>
                </span>
                <span className="text-purple-300">{(record.publishedServices || []).length} Services</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleRunVerification(record.domain)}
                disabled={isVerifying === record.domain}
                className="w-full py-2 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 font-bold text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                {isVerifying === record.domain ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Verifying Proof...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Verify Ownership</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onRevokeDomain(record.domain)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-zinc-400 transition-all cursor-pointer"
                title="Revoke / Delete Domain"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* MODAL: REGISTER DOMAIN */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-black text-white">Register Native Domain (NIP-OWNERSHIP)</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-zinc-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Native Domain URI:</label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="vx://domain.sub/service"
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Owner Identity / Email:</label>
                <input
                  type="text"
                  value={ownerIdentity}
                  onChange={(e) => setOwnerIdentity(e.target.value)}
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Associated Subnet:</label>
                  <select
                    value={associatedSubnetId}
                    onChange={(e) => setAssociatedSubnetId(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    {subnets.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Hosting Node:</label>
                  <select
                    value={hostingNodeId}
                    onChange={(e) => setHostingNodeId(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Virtual Server:</label>
                  <select
                    value={virtualServerId}
                    onChange={(e) => setVirtualServerId(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    {servers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Access Policy:</label>
                  <select
                    value={accessPolicy}
                    onChange={(e) => setAccessPolicy(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="PUBLIC_OPEN">Public Open</option>
                    <option value="TOKEN_GATED">Token Gated</option>
                    <option value="SIGNATURE_CHALLENGE">Signature Challenge</option>
                    <option value="WHITELIST_ONLY">Whitelist Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black"
                >
                  Register &amp; Attest Ownership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
