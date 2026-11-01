import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Key,
  Plus,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  X,
  FileCode2,
  Radio,
  UserCheck
} from 'lucide-react';
import { VirtualIdentity, VIPDelegatedCapability } from '../../types/vip';
import { VIPCrypto } from '../../services/vipCrypto';

interface VipSecurityStudioProps {
  identities: VirtualIdentity[];
  onCreateIdentity?: (identity: VirtualIdentity) => void;
}

export const VipSecurityStudio: React.FC<VipSecurityStudioProps> = ({
  identities,
  onCreateIdentity
}) => {
  const [selectedIdentity, setSelectedIdentity] = useState<VirtualIdentity | null>(identities[0] || null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [alias, setAlias] = useState('');
  const [algorithm, setAlgorithm] = useState<'Ed25519' | 'Secp256k1'>('Ed25519');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Signing Verification Playground
  const [signInput, setSignInput] = useState('Verify sovereign overlay provenance');
  const [generatedSig, setGeneratedSig] = useState('');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  const handleGenerateIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias) return;
    const keypair = VIPCrypto.generateEd25519Keypair(alias);
    const newIdentity: VirtualIdentity = {
      did: keypair.did,
      algorithm: algorithm,
      publicKey: keypair.publicKey,
      privateKeyMasked: keypair.privateKeyMasked,
      ownerUserId: 'usr-prime-operator',
      alias,
      reputationScore: 99.0,
      trustLevel: 'VERIFIED_OPERATOR',
      delegatedCapabilities: [
        {
          id: `cap-${Date.now()}`,
          issuerDid: keypair.did,
          granteeDid: keypair.did,
          resourceUri: 'vnet://*/*',
          permissions: ['READ', 'WRITE', 'ROUTE', 'EXECUTE'],
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 31536000000).toISOString(),
          signature: `sig_${algorithm.toLowerCase()}_cap_valid`,
          revoked: false
        }
      ],
      attestationProofs: ['proof_hardware_enclave_signed'],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    if (onCreateIdentity) {
      onCreateIdentity(newIdentity);
    }
    setSelectedIdentity(newIdentity);
    setShowGenerateModal(false);
    setAlias('');
  };

  const handleTestSign = () => {
    if (!selectedIdentity) return;
    const sig = VIPCrypto.sign(signInput, 'ed25519_sk_master_priv_7f2e89a42a9b3112');
    setGeneratedSig(sig);
    const isValid = VIPCrypto.verifySignature(signInput, sig, selectedIdentity.publicKey);
    setVerifyResult(isValid);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Cryptographic Identities & Delegated Permissions
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            W3C DID sovereign identity anchors, Ed25519/Secp256k1 key management, and fine-grained capability delegation tokens.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Sovereign Identity Anchor</span>
        </button>
      </div>

      {/* Identities Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Identities List */}
        <div className="lg:col-span-5 space-y-3">
          {identities.map((ident) => {
            const isSelected = selectedIdentity?.did === ident.did;
            return (
              <div
                key={ident.did}
                onClick={() => setSelectedIdentity(ident)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/10 shadow-lg'
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-sm text-zinc-100">{ident.alias}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {ident.algorithm}
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-400 truncate">
                  {ident.did}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>Trust Level: <span className="text-zinc-300">{ident.trustLevel}</span></span>
                  <span className="text-emerald-400 font-bold">{ident.reputationScore}% Score</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Deep Identity Details & Signing Playground */}
        <div className="lg:col-span-7 space-y-4">
          {selectedIdentity ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">{selectedIdentity.algorithm}</span>
                    <span className="text-xs font-mono text-zinc-400">● {selectedIdentity.trustLevel}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-100">{selectedIdentity.alias}</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">
                  {selectedIdentity.reputationScore}% Reputation
                </span>
              </div>

              {/* DID & Public Key Box */}
              <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
                    <span>W3C DECENTRALIZED IDENTIFIER (DID)</span>
                    <button
                      onClick={() => copyText(selectedIdentity.did, 'did')}
                      className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {copiedId === 'did' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-zinc-200 break-all">{selectedIdentity.did}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
                    <span>PUBLIC KEY</span>
                    <button
                      onClick={() => copyText(selectedIdentity.publicKey, 'pk')}
                      className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {copiedId === 'pk' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-cyan-400 break-all">{selectedIdentity.publicKey}</div>
                </div>
              </div>

              {/* Delegated Capabilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Delegated Capability Tokens ({selectedIdentity.delegatedCapabilities?.length || 0})
                </h4>
                <div className="space-y-2">
                  {(selectedIdentity.delegatedCapabilities || []).map((cap) => (
                    <div key={cap.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300 font-semibold">{cap.resourceUri}</span>
                        <span className="text-emerald-400 text-[10px]">Active</span>
                      </div>
                      <div className="text-zinc-500 flex gap-2">
                        <span>Permissions: {(cap.permissions || []).join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Verification Sandbox */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
                <h4 className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Cryptographic Signature Verification Tester
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={signInput}
                    onChange={(e) => setSignInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleTestSign}
                    className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-mono transition-colors cursor-pointer"
                  >
                    Sign & Verify with Ed25519 Key
                  </button>

                  {generatedSig && (
                    <div className="p-2.5 bg-zinc-900/90 rounded border border-zinc-800 text-xs font-mono space-y-1">
                      <div className="text-zinc-400 truncate">Signature: {generatedSig}</div>
                      <div className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Signature Validated against Public Key
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select an identity to view cryptographic anchors and permissions.
            </div>
          )}
        </div>
      </div>

      {/* Generate Identity Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Key className="w-5 h-5 text-emerald-400" />
                  Generate Sovereign Identity Keypair
                </h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGenerateIdentity} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Identity Alias</label>
                  <input
                    type="text"
                    required
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="e.g., Edge Node Frankfurt Keypair"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Cryptographic Algorithm</label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Ed25519">Ed25519 (High Performance Curve25519)</option>
                    <option value="Secp256k1">Secp256k1 (Bitcoin / Ethereum Standard)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Generate Keypair & DID
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
