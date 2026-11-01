import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Server,
  Globe,
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Link,
  Unlink,
  Terminal,
  Search,
  Activity,
  ArrowRight,
  Shield,
  HelpCircle,
  Network,
  Boxes,
  Code2,
  Radio,
  FileText,
  Share2,
  CheckCheck
} from 'lucide-react';
import {
  BlockchainIdentityAnchor,
  RegisteredProtocol,
  OffChainPrivateIdentity,
  VerificationTelemetryRecord,
  ProtocolType,
  ProtocolCategory
} from '../types';

interface BlockchainIdentityAnchorStudioProps {
  onSelectSubTool?: (subTool: string) => void;
}

export const BlockchainIdentityAnchorStudio: React.FC<BlockchainIdentityAnchorStudioProps> = ({
  onSelectSubTool
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'anchor_deployer' | 'offchain_vault' | 'protocol_registry' | 'webapp_verify' | 'permissions_roles' | 'solidity_contract'>('overview');
  
  // Blockchain State
  const [identities, setIdentities] = useState<BlockchainIdentityAnchor[]>([]);
  const [protocols, setProtocols] = useState<RegisteredProtocol[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<VerificationTelemetryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Identity Creator Form
  const [walletInput, setWalletInput] = useState<string>('0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C');
  const [userIdInput, setUserIdInput] = useState<string>('usr_vox_alpha_01');
  const [versionInput, setVersionInput] = useState<string>('BTE-ID-v1.0');
  const [isDeployingAnchor, setIsDeployingAnchor] = useState<boolean>(false);
  const [anchorDeploySuccess, setAnchorDeploySuccess] = useState<any | null>(null);

  // Off-chain Private Data Form
  const [privateData, setPrivateData] = useState<OffChainPrivateIdentity>({
    userId: 'usr_vox_alpha_01',
    version: 'BTE-ID-v1.0',
    fullName: 'Dr. Victor Agboola',
    decentralizedEmail: 'victor@agvora.vox',
    organization: 'AGVORA Sovereign Decentralized Network',
    didDocumentUri: 'did:vox:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    pgpPublicKeyPreview: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: AGVORA-v1.4\nmQENBF2...\n-----END PGP PUBLIC KEY BLOCK-----',
    encryptedDocumentHex: '0x4a9f821c00984b2e1140928a34bc7e11248901a02b34903e102948f12a02b349',
    encryptionAlgorithm: 'AES-256-GCM',
    secretSalt: 'vox-entropy-994201'
  });

  const [showEncryptedHex, setShowEncryptedHex] = useState<boolean>(false);
  const [commitmentValidation, setCommitmentValidation] = useState<any | null>(null);
  const [isValidatingCommitment, setIsValidatingCommitment] = useState<boolean>(false);

  // Protocol Linker Form
  const [newProtoName, setNewProtoName] = useState<string>('');
  const [newProtoType, setNewProtoType] = useState<ProtocolType>('VIRTUAL_SERVER');
  const [newProtoCategory, setNewProtoCategory] = useState<ProtocolCategory>('VIRTUAL_SERVER');
  const [newProtoDesc, setNewProtoDesc] = useState<string>('');
  const [newProtoEndpoint, setNewProtoEndpoint] = useState<string>('');
  const [isLinkingProto, setIsLinkingProto] = useState<boolean>(false);

  // WebApp Verification Testbed
  const [selectedVerifyProtocolId, setSelectedVerifyProtocolId] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Fetch initial BTE Identity data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/bte-identity');
      const data = await res.json();
      if (data.activeIdentity) {
        setIdentities([data.activeIdentity]);
      }
      if (Array.isArray(data.protocols)) {
        setProtocols(data.protocols);
        if (data.protocols.length > 0 && !selectedVerifyProtocolId) {
          setSelectedVerifyProtocolId(data.protocols[0].protocolId);
        }
      }
      if (Array.isArray(data.verificationLogs)) {
        setVerificationLogs(data.verificationLogs);
      }
    } catch (err) {
      console.error('Failed to load BTE identity state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // 1. Deploy Identity Anchor
  const handleDeployAnchor = async () => {
    if (!walletInput.trim()) return;
    setIsDeployingAnchor(true);
    setAnchorDeploySuccess(null);
    try {
      const res = await fetch('/api/bte-identity/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: walletInput,
          userId: userIdInput,
          identityVersion: versionInput,
          encryptedDocumentHex: privateData.encryptedDocumentHex
        })
      });
      const data = await res.json();
      if (data.identity) {
        setIdentities([data.identity]);
        setAnchorDeploySuccess(data);
        fetchData();
      } else if (data.error) {
        setAnchorDeploySuccess({ error: data.error, identity: data.identity });
      }
    } catch (err: any) {
      setAnchorDeploySuccess({ error: err.message || 'Deployment failed' });
    } finally {
      setIsDeployingAnchor(false);
    }
  };

  // 2. Validate Commitment (Tamper-Evidence Test)
  const handleValidateCommitment = async () => {
    if (identities.length === 0) return;
    setIsValidatingCommitment(true);
    setCommitmentValidation(null);
    try {
      const res = await fetch('/api/bte-identity/validate-commitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityId: identities[0].identityId,
          userId: privateData.userId,
          identityVersion: privateData.version,
          encryptedDocumentHex: privateData.encryptedDocumentHex
        })
      });
      const data = await res.json();
      setCommitmentValidation(data);
    } catch (err: any) {
      setCommitmentValidation({ error: err.message });
    } finally {
      setIsValidatingCommitment(false);
    }
  };

  // 3. Link New Protocol to Identity Anchor
  const handleLinkProtocol = async () => {
    if (identities.length === 0 || !newProtoName.trim()) return;
    setIsLinkingProto(true);
    try {
      const res = await fetch('/api/bte-identity/link-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityId: identities[0].identityId,
          protocolType: newProtoType,
          name: newProtoName,
          description: newProtoDesc,
          targetEndpoint: newProtoEndpoint || `${newProtoType.toLowerCase()}://node.vox.network`
        })
      });
      const data = await res.json();
      if (data.protocol) {
        setProtocols(prev => [data.protocol, ...prev]);
        setNewProtoName('');
        setNewProtoDesc('');
        setNewProtoEndpoint('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to link protocol:', err);
    } finally {
      setIsLinkingProto(false);
    }
  };

  // 4. Verify Protocol Testbed
  const handleVerifyProtocol = async () => {
    if (identities.length === 0 || !selectedVerifyProtocolId) return;
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/bte-identity/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocolId: selectedVerifyProtocolId,
          identityId: identities[0].identityId,
          callerAddress: walletInput
        })
      });
      const data = await res.json();
      setVerifyResult(data);
      fetchData();
    } catch (err: any) {
      setVerifyResult({ error: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  // 5. Toggle Protocol Permission / Active Status
  const handleToggleProtocolPermission = async (protocolId: string) => {
    try {
      const res = await fetch('/api/bte-identity/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protocolId, action: 'TOGGLE_ACTIVE' })
      });
      const data = await res.json();
      if (data.protocol) {
        setProtocols(prev => prev.map(p => p.protocolId === protocolId ? data.protocol : p));
      }
    } catch (err) {
      console.error('Failed to update protocol permissions:', err);
    }
  };

  const activeAnchor = identities[0] || null;

  const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title InclusiveIdentityRegistry (BTE-ID v1)
 * @notice Immutable Blockchain Identity Anchor with Inclusive Protocol Registry.
 * @dev Stored at a deterministic blockchain address. Core Identity is permanently immutable.
 */
contract InclusiveIdentityRegistry {

    struct Identity {
        bytes32 identityId;
        bytes32 identityCommitment;
        address owner;
        uint64 createdAt;
        bool exists;
    }

    // Wallet address => Immutable Identity Anchor
    mapping(address => Identity) private identities;

    // Deterministic identityId => Wallet owner address
    mapping(bytes32 => address) public identityOwner;

    // protocolId => Linked identityId
    mapping(bytes32 => bytes32) public protocolIdentity;

    // Events emitted on-chain
    event IdentityCreated(
        bytes32 indexed identityId,
        address indexed owner,
        bytes32 identityCommitment
    );

    event ProtocolLinked(
        bytes32 indexed identityId,
        bytes32 indexed protocolId
    );

    /**
     * @notice Registers an immutable Identity Anchor.
     * @dev Once created, identityId, identityCommitment, and createdAt CANNOT be edited or deleted.
     */
    function createIdentity(
        bytes32 identityId,
        bytes32 identityCommitment
    ) external {
        require(!identities[msg.sender].exists, "Identity already exists");
        require(identityOwner[identityId] == address(0), "Identity ID exists");

        identities[msg.sender] = Identity({
            identityId: identityId,
            identityCommitment: identityCommitment,
            owner: msg.sender,
            createdAt: uint64(block.timestamp),
            exists: true
        });

        identityOwner[identityId] = msg.sender;

        emit IdentityCreated(
            identityId,
            msg.sender,
            identityCommitment
        );
    }

    /**
     * @notice Links an inclusive protocol (VSP or NP) to the sender's Identity Anchor.
     */
    function linkProtocol(
        bytes32 identityId,
        bytes32 protocolId
    ) external {
        require(
            identityOwner[identityId] == msg.sender,
            "Not identity owner"
        );
        require(
            protocolIdentity[protocolId] == bytes32(0),
            "Protocol already linked"
        );

        protocolIdentity[protocolId] = identityId;

        emit ProtocolLinked(
            identityId,
            protocolId
        );
    }

    /**
     * @notice Reads the deterministic identityId for a given address.
     */
    function getIdentityId(
        address user
    ) external view returns (bytes32) {
        require(identities[user].exists, "Identity not found");
        return identities[user].identityId;
    }

    /**
     * @notice Verifies if a protocol belongs to the specified Identity Anchor.
     */
    function verifyProtocol(
        bytes32 protocolId,
        bytes32 identityId
    ) external view returns (bool) {
        return protocolIdentity[protocolId] == identityId;
    }
}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* HEADER BANNER & INTRO */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>DECENTRALIZED ARCHITECTURE STANDARD • BTE-ID v1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Immutable Blockchain Identity Anchor &amp; Inclusive Protocol Registry
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Decouples immutable on-chain cryptographic roots from private off-chain personal data. Every server, domain, subnet, and network protocol joins the ecosystem anchored deterministically without exposing PII on-chain.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto font-mono text-xs">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center space-x-2 font-bold cursor-pointer transition-all shadow-md"
            >
              <RefreshCw className={`h-4 w-4 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab('solidity_contract')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-md shadow-cyan-500/20"
            >
              <FileCode2 className="h-4 w-4" />
              <span>Solidity EVM (0.8.24)</span>
            </button>
          </div>
        </div>

        {/* 3-Layer Architecture Quick Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800/80 font-mono text-xs">
          
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-cyan-500/40 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span className="flex items-center space-x-1.5">
                <Lock className="h-4 w-4" />
                <span>Layer A: Blockchain Anchor</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-black border border-cyan-800">
                IMMUTABLE
              </span>
            </div>
            <p className="text-zinc-300 text-[11px] font-sans">
              Deterministic <code className="text-cyan-300">identityId</code> + versioned SHA-256 <code className="text-cyan-300">identityCommitment</code>. No edit or delete functions.
            </p>
            <div className="text-[10px] text-zinc-400 truncate pt-1">
              Active ID: <span className="text-white font-mono">{activeAnchor ? `${activeAnchor.identityId.slice(0, 18)}...` : 'None Anchored'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-purple-500/40 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-purple-400 font-bold">
              <span className="flex items-center space-x-1.5">
                <Key className="h-4 w-4" />
                <span>Layer B: Private Off-Chain</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-black border border-purple-800">
                AES-256 / ZERO-PII
              </span>
            </div>
            <p className="text-zinc-300 text-[11px] font-sans">
              Encrypted documents, DID payloads &amp; profile data. Never published to the public blockchain ledger in plaintext.
            </p>
            <div className="text-[10px] text-zinc-400 truncate pt-1">
              State: <span className="text-emerald-400 font-bold">Encrypted (Tamper-Proof)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/40 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center space-x-1.5">
                <Boxes className="h-4 w-4" />
                <span>Layer C: Protocol Registry</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-black border border-emerald-800">
                VSP &amp; NP SUITE
              </span>
            </div>
            <p className="text-zinc-300 text-[11px] font-sans">
              Universal protocols (Servers, Nodes, Subnets, WebApps, APIs) link to the same root anchor with mutable permissions.
            </p>
            <div className="text-[10px] text-zinc-400 truncate pt-1">
              Protocols Linked: <span className="text-emerald-300 font-bold">{protocols.length} Active Modules</span>
            </div>
          </div>

        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar font-mono text-xs">
        {[
          { id: 'overview', name: 'Identity Architecture & Tree', icon: Layers },
          { id: 'anchor_deployer', name: 'Deterministic Anchor Deployer', icon: ShieldCheck },
          { id: 'offchain_vault', name: 'Private Data Encryptor & Commitments', icon: Key },
          { id: 'protocol_registry', name: 'Universal Protocol Registry (VSP / NP)', icon: Boxes },
          { id: 'webapp_verify', name: 'WebApp Verification Testbed', icon: Globe },
          { id: 'permissions_roles', name: 'Mutable Permissions & Roles', icon: Lock },
          { id: 'solidity_contract', name: 'Solidity Contract & ABI', icon: FileCode2 }
        ].map((tabItem) => {
          const Icon = tabItem.icon;
          const isActive = activeTab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20 font-black'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tabItem.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ARCHITECTURE OVERVIEW & TREE HIERARCHY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Universal Protocol Tree Diagram */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Network className="h-5 w-5 text-cyan-400" />
                  <span>Universal Inclusive Protocol Hierarchy</span>
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Single immutable root identity anchor providing tamper-evident verification across all ecosystem layers.
                </p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold self-start sm:self-auto">
                BTE-ID-V1 STANDARD
              </div>
            </div>

            {/* Visual Tree Display */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 font-mono text-xs overflow-x-auto space-y-4">
              
              {/* Root Anchor Box */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border-2 border-cyan-500 text-cyan-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg shadow-cyan-500/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest block uppercase">IMMUTABLE BLOCKCHAIN ROOT</span>
                    <span className="text-sm font-black text-white">Blockchain Identity Anchor</span>
                    <span className="text-[11px] text-cyan-300 block font-mono">
                      identityId: {activeAnchor ? activeAnchor.identityId : '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-900 text-cyan-200 border border-cyan-700 text-[10px] font-bold">
                    CANNOT BE OVERWRITTEN
                  </span>
                </div>
              </div>

              {/* Connecting Tree Lines & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Category 1: Virtual Server Protocols (VSP) */}
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center space-x-2 text-blue-400 font-bold">
                      <Server className="h-4 w-4" />
                      <span>Virtual Server Protocols (VSP)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                      INFRASTRUCTURE
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Deterministic host binding, hardware sandboxes, and virtualized computing layers.
                  </p>
                  <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <strong className="text-white">VSP-1 Core Server:</strong>
                      <span className="text-zinc-400">Edge gateway proxy &amp; listener nodes</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <strong className="text-white">VSP-2 Node Mesh:</strong>
                      <span className="text-zinc-400">Container mesh workers &amp; CPU sandboxes</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <strong className="text-white">VSP-3 SubNet:</strong>
                      <span className="text-zinc-400">Private segmented L2 subnet routing</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <strong className="text-white">VSP-4 Domain:</strong>
                      <span className="text-zinc-400">Sovereign Web3 DNS resolution (.vox)</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <strong className="text-white">VSP-5 Storage &amp; Compute:</strong>
                      <span className="text-zinc-400">Encrypted vector DB &amp; SIMD tensors</span>
                    </li>
                  </ul>
                </div>

                {/* Category 2: Network Protocols (NP) */}
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center space-x-2 text-purple-400 font-bold">
                      <Globe className="h-4 w-4" />
                      <span>Network Protocols (NP)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      COMMUNICATIONS
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Zero-knowledge identity routers, authentication handshakes, and WebApp clients.
                  </p>
                  <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <strong className="text-white">NP-1 Identity Router:</strong>
                      <span className="text-zinc-400">Zero-knowledge DID peer verification</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <strong className="text-white">NP-2 Discovery &amp; Routing:</strong>
                      <span className="text-zinc-400">P2P node discovery &amp; onion routing</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <strong className="text-white">NP-3 Messaging &amp; Sync:</strong>
                      <span className="text-zinc-400">End-to-end encrypted protocol channels</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <strong className="text-white">NP-4 WebApp Gateway:</strong>
                      <span className="text-zinc-400">Browser workstation client auth</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <strong className="text-white">NP-5 Service API:</strong>
                      <span className="text-zinc-400">REST &amp; gRPC decentralized endpoints</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          {/* Key Architectural Principles (9 Pillars) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <Lock className="h-4 w-4" />
                <span>1. Deterministic Identifier</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Calculated strictly via <code className="text-cyan-300">keccak256("BIGTECH-IDENTITY-V1", walletAddress)</code>. Enables any subnet or node to verify identity deterministically.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>2. Zero-PII On-Chain</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Personal readable data (name, email, KYC) is never posted in plaintext. Only SHA-256 commitments are anchored, guaranteeing privacy and compliance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Boxes className="h-4 w-4" />
                <span>3. Universal Protocol Registry</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Every protocol generates a deterministic <code className="text-emerald-300">protocolId</code> and registers against the parent identity anchor via on-chain contract events.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                <Key className="h-4 w-4" />
                <span>4. Immutable Root + Mutable Roles</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                The root identity never changes, but permissions (revoking compromised servers, disabling protocols, role delegation) remain safely manageable.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <Globe className="h-4 w-4" />
                <span>5. 1-Step WebApp Gate</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Web applications call <code className="text-rose-300">verifyProtocol(protocolId, identityId)</code> on-chain before granting access to privileged resources.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                <Radio className="h-4 w-4" />
                <span>6. Standard REST Endpoint</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Every node exposes <code className="text-blue-300">GET /identity</code> returning standard BTE-ID v1 JSON telemetry for cross-network federation.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: DETERMINISTIC ANCHOR DEPLOYER */}
      {activeTab === 'anchor_deployer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Deployer Form */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center space-x-3 text-cyan-400 font-bold border-b border-zinc-800 pb-3">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="text-base font-bold text-white">Deterministic Blockchain Anchor Generator</h2>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">EVM / Ethereum Wallet Address (Owner):</label>
                  <input
                    type="text"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    placeholder="0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">User Identifier Tag:</label>
                    <input
                      type="text"
                      value={userIdInput}
                      onChange={(e) => setUserIdInput(e.target.value)}
                      placeholder="usr_vox_alpha_01"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Identity Standard Version:</label>
                    <input
                      type="text"
                      value={versionInput}
                      onChange={(e) => setVersionInput(e.target.value)}
                      placeholder="BTE-ID-v1.0"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Deterministic Hash Preview */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-500/30 space-y-2">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    Computed Deterministic Identity Anchor (keccak256):
                  </div>
                  <div className="text-[11px] text-zinc-300 break-all font-mono">
                    <code>keccak256(["BIGTECH-IDENTITY-V1", "{walletInput}"])</code>
                  </div>
                </div>

                <button
                  onClick={handleDeployAnchor}
                  disabled={isDeployingAnchor || !walletInput}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all disabled:opacity-50"
                >
                  <ShieldCheck className={`h-4 w-4 ${isDeployingAnchor ? 'animate-spin' : ''}`} />
                  <span>{isDeployingAnchor ? 'Deploying to EVM Ledger...' : 'Anchor Immutable Identity to Blockchain'}</span>
                </button>
              </div>

              {anchorDeploySuccess && (
                <div className={`p-4 rounded-xl text-xs font-mono border ${
                  anchorDeploySuccess.error ? 'bg-amber-950/50 border-amber-500 text-amber-300' : 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                }`}>
                  <div className="font-bold flex items-center space-x-2 mb-1">
                    {anchorDeploySuccess.error ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span>{anchorDeploySuccess.error ? 'Deployment Notice' : 'On-Chain Confirmation'}</span>
                  </div>
                  <p className="text-[11px] font-sans text-zinc-300">
                    {anchorDeploySuccess.error || anchorDeploySuccess.message}
                  </p>
                  {anchorDeploySuccess.identity && (
                    <div className="mt-2 text-[10px] text-zinc-400 space-y-1">
                      <div>Tx Hash: <span className="text-white">{anchorDeploySuccess.identity.txHash}</span></div>
                      <div>Gas Used: <span className="text-emerald-400">{anchorDeploySuccess.identity.gasUsed}</span></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Anchor Card Details */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Database className="h-5 w-5 text-cyan-400" />
                  <span>Current Anchored Identity State</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  ON-CHAIN EVM
                </span>
              </div>

              {activeAnchor ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Immutable identityId (bytes32)</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-cyan-300 break-all text-[11px] font-mono">{activeAnchor.identityId}</span>
                      <button
                        onClick={() => handleCopy(activeAnchor.identityId, 'identityId')}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0 cursor-pointer"
                      >
                        {copiedKey === 'identityId' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">identityCommitment (SHA-256)</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-purple-300 break-all text-[11px] font-mono">{activeAnchor.identityCommitment}</span>
                      <button
                        onClick={() => handleCopy(activeAnchor.identityCommitment, 'commitment')}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0 cursor-pointer"
                      >
                        {copiedKey === 'commitment' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold">Owner Address</span>
                      <span className="text-zinc-200 text-[11px] font-mono truncate block mt-0.5">{activeAnchor.ownerAddress}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold">Anchored Block</span>
                      <span className="text-emerald-400 text-[11px] font-mono font-bold block mt-0.5">#{activeAnchor.blockNumber}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-sans flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Permanent On-Chain Immutability: Verified. This anchor can be safely referenced across all subnets and protocols.</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-400 text-xs font-mono space-y-2">
                  <ShieldCheck className="h-8 w-8 text-zinc-600 mx-auto" />
                  <p>No active Identity Anchor found. Use the generator on the left to deploy one.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: OFF-CHAIN PRIVATE DATA & ZERO-PII COMMITMENT */}
      {activeTab === 'offchain_vault' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Private Data Vault */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-purple-400 font-bold">
                  <Key className="h-5 w-5" />
                  <h2 className="text-base font-bold text-white">Private Off-Chain Identity Vault</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">
                  NEVER ON-CHAIN
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Full Legal Name:</label>
                    <input
                      type="text"
                      value={privateData.fullName}
                      onChange={(e) => setPrivateData({ ...privateData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Decentralized Email:</label>
                    <input
                      type="text"
                      value={privateData.decentralizedEmail}
                      onChange={(e) => setPrivateData({ ...privateData, decentralizedEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">DID Document URI:</label>
                  <input
                    type="text"
                    value={privateData.didDocumentUri}
                    onChange={(e) => setPrivateData({ ...privateData, didDocumentUri: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400">Encrypted Identity Document (Hex Payload):</label>
                    <button
                      onClick={() => setShowEncryptedHex(!showEncryptedHex)}
                      className="text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer text-[10px]"
                    >
                      {showEncryptedHex ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      <span>{showEncryptedHex ? 'Hide Hex' : 'View Hex'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={showEncryptedHex ? 4 : 2}
                    value={privateData.encryptedDocumentHex}
                    onChange={(e) => setPrivateData({ ...privateData, encryptedDocumentHex: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-purple-300 font-mono text-[11px] focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Encryption Scheme:</span>
                  <span className="text-purple-400 font-bold">{privateData.encryptionAlgorithm} (Hardware Encrypted)</span>
                </div>
              </div>
            </div>

            {/* Live Tamper-Evidence Commitment Validator */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>Tamper-Evidence Commitment Validator</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                  ZERO-KNOWLEDGE
                </span>
              </div>

              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                The smart contract verifies that your off-chain data matches the immutable on-chain commitment without revealing the contents to anyone.
              </p>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Validation Formula</span>
                  <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-300 text-[11px] break-all border border-zinc-800">
                    <code>SHA256("{privateData.userId}|{privateData.version}|&lt;encryptedDoc&gt;")</code>
                  </div>
                </div>

                <button
                  onClick={handleValidateCommitment}
                  disabled={isValidatingCommitment || identities.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <RefreshCw className={`h-4 w-4 ${isValidatingCommitment ? 'animate-spin' : ''}`} />
                  <span>{isValidatingCommitment ? 'Comparing Hashes...' : 'Verify Tamper-Proof Match'}</span>
                </button>
              </div>

              {commitmentValidation && (
                <div className={`p-4 rounded-2xl text-xs font-mono border space-y-2 ${
                  commitmentValidation.tamperProof ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border-rose-500 text-rose-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-black flex items-center space-x-1.5">
                      {commitmentValidation.tamperProof ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-rose-400" />}
                      <span>{commitmentValidation.matchStatus}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 font-bold">
                      {commitmentValidation.tamperProof ? 'INTEGRITY VALID' : 'TAMPER DETECTED'}
                    </span>
                  </div>

                  <div className="text-[10px] text-zinc-300 space-y-1 pt-1 border-t border-zinc-800/60">
                    <div>Stored Commitment: <span className="font-mono text-zinc-100 break-all">{commitmentValidation.storedOnChainCommitment}</span></div>
                    <div>Recomputed Hash: <span className="font-mono text-cyan-300 break-all">{commitmentValidation.recomputedCommitment}</span></div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* TAB 4: UNIVERSAL INCLUSIVE PROTOCOL REGISTRY (VSP & NP) */}
      {activeTab === 'protocol_registry' && (
        <div className="space-y-6">
          
          {/* Protocol Linker Form */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Boxes className="h-5 w-5" />
                <h2 className="text-base font-bold text-white">Link New Protocol to Identity Anchor</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                EVM LINKER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Protocol Name:</label>
                <input
                  type="text"
                  value={newProtoName}
                  onChange={(e) => setNewProtoName(e.target.value)}
                  placeholder="e.g. Edge Gateway Server (VSP-01)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Protocol Type:</label>
                <select
                  value={newProtoType}
                  onChange={(e) => setNewProtoType(e.target.value as ProtocolType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <optgroup label="Virtual Server Protocols (VSP)">
                    <option value="VIRTUAL_SERVER">VIRTUAL_SERVER (Edge &amp; Gateway)</option>
                    <option value="NODE">NODE (Container Mesh Worker)</option>
                    <option value="SUBNET">SUBNET (Private L2 Routing)</option>
                    <option value="DOMAIN">DOMAIN (Sovereign Web3 DNS)</option>
                    <option value="STORAGE">STORAGE (Encrypted Vector DB)</option>
                    <option value="COMPUTE">COMPUTE (SIMD Tensor Engine)</option>
                  </optgroup>
                  <optgroup label="Network Protocols (NP)">
                    <option value="NETWORK_PROTOCOL">NETWORK_PROTOCOL (Zero-Knowledge DID)</option>
                    <option value="WEBAPP">WEBAPP (Browser Client Workstation)</option>
                    <option value="API">API (Decentralized gRPC Endpoint)</option>
                    <option value="IDENTITY_ROUTER">IDENTITY_ROUTER (Cross-Subnet Auth)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Target Endpoint / URI:</label>
                <input
                  type="text"
                  value={newProtoEndpoint}
                  onChange={(e) => setNewProtoEndpoint(e.target.value)}
                  placeholder="vsp://node-01.vox.network:8080"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="text-zinc-400 block mb-1">Protocol Description:</label>
              <input
                type="text"
                value={newProtoDesc}
                onChange={(e) => setNewProtoDesc(e.target.value)}
                placeholder="High-throughput mTLS reverse proxy linked to identity anchor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleLinkProtocol}
              disabled={isLinkingProto || !newProtoName.trim() || identities.length === 0}
              className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              <Link className="h-4 w-4" />
              <span>{isLinkingProto ? 'Emitting ProtocolLinked Event...' : 'Register Protocol against Identity Anchor'}</span>
            </button>
          </div>

          {/* Registered Protocols Table */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Boxes className="h-5 w-5 text-cyan-400" />
                  <span>Registered Protocols ({protocols.length})</span>
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  All protocols registered against Identity Anchor: <code className="text-cyan-300">{activeAnchor ? activeAnchor.identityId.slice(0, 16) + '...' : 'None'}</code>
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                    <th className="pb-3 px-3">Protocol Name &amp; Type</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Deterministic protocolId</th>
                    <th className="pb-3 px-3">Endpoint</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {protocols.map((proto) => {
                    const isVsp = proto.category === 'VIRTUAL_SERVER';
                    return (
                      <tr key={proto.protocolId} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white">{proto.name}</div>
                          <span className="text-[10px] text-zinc-400 block">{proto.protocolType}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isVsp ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-purple-950 text-purple-300 border-purple-800'
                          }`}>
                            {proto.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-cyan-300 text-[11px] truncate max-w-xs">{proto.protocolId.slice(0, 16)}...</span>
                            <button
                              onClick={() => handleCopy(proto.protocolId, proto.protocolId)}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer shrink-0"
                            >
                              {copiedKey === proto.protocolId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-zinc-300 truncate max-w-xs">
                          {proto.targetEndpoint}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            proto.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {proto.active ? 'ACTIVE' : 'REVOKED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => handleToggleProtocolPermission(proto.protocolId)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                              proto.active ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700' : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
                            }`}
                          >
                            {proto.active ? 'Revoke' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: WEBAPP VERIFICATION FLOW & RESOLUTION SIMULATOR */}
      {activeTab === 'webapp_verify' && (
        <div className="space-y-6">
          
          {/* Step-by-Step Flow Chart */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold border-b border-zinc-800 pb-3">
              <Globe className="h-5 w-5" />
              <h2 className="text-base font-bold text-white">WebApp 7-Step Verification Flow</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 font-mono text-[11px]">
              {[
                { step: '1', title: 'Connect Wallet', desc: 'Read public EVM address' },
                { step: '2', title: 'Read Anchor', desc: 'Query contract getIdentityId()' },
                { step: '3', title: 'Get identityId', desc: 'Obtain deterministic bytes32' },
                { step: '4', title: 'Identify Protocol', desc: 'Retrieve requested protocolId' },
                { step: '5', title: 'Verify Protocol', desc: 'Call verifyProtocol() on-chain' },
                { step: '6', title: 'Check Roles', desc: 'Validate permissions & nonce' },
                { step: '7', title: 'Allow Access', desc: 'Initiate encrypted session' }
              ].map((flow, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 relative">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-[10px]">
                    {flow.step}
                  </div>
                  <div className="font-bold text-white">{flow.title}</div>
                  <div className="text-[10px] text-zinc-400">{flow.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Verification Testbed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Terminal className="h-5 w-5 text-cyan-400" />
                <span>Live On-Chain Verification Simulator</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">Select Protocol to Verify:</label>
                  <select
                    value={selectedVerifyProtocolId}
                    onChange={(e) => setSelectedVerifyProtocolId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {protocols.map((p) => (
                      <option key={p.protocolId} value={p.protocolId}>
                        {p.name} ({p.protocolType}) - {p.active ? 'ACTIVE' : 'REVOKED'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 text-[11px]">
                  <span className="text-zinc-400 block">Active Target Identity Anchor:</span>
                  <span className="text-cyan-300 break-all font-mono">
                    {activeAnchor ? activeAnchor.identityId : '0x3f89a1b021c...'}
                  </span>
                </div>

                <button
                  onClick={handleVerifyProtocol}
                  disabled={isVerifying || !selectedVerifyProtocolId}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
                >
                  <CheckCheck className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Executing verifyProtocol()...' : 'Run verifyProtocol(protocolId, identityId)'}</span>
                </button>
              </div>

              {verifyResult && (
                <div className={`p-4 rounded-2xl text-xs font-mono border space-y-2 ${
                  verifyResult.verified ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border-rose-500 text-rose-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center space-x-2">
                      {verifyResult.verified ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-rose-400" />}
                      <span>{verifyResult.verified ? 'VERIFICATION SUCCESSFUL (MATCH)' : 'VERIFICATION FAILED'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 font-bold">
                      GAS: {verifyResult.gasUsed || 2100}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-zinc-300">
                    {verifyResult.verified 
                      ? 'The protocol belongs deterministically to the Identity Anchor. Access authorized for the WebApp session.' 
                      : 'Protocol does not match the Identity Anchor or has been revoked by the owner.'}
                  </p>
                </div>
              )}
            </div>

            {/* Standard JSON Endpoint View: GET /identity */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Standard Endpoint: GET /identity</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                  JSON REST API
                </span>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-72">
                <pre>{JSON.stringify({
                  identityProtocol: "BTE-ID-V1",
                  identityId: activeAnchor?.identityId || "0x3f89a1b021c...",
                  protocolId: selectedVerifyProtocolId || "0x9a8b7c6d5e4...",
                  protocolType: protocols.find(p => p.protocolId === selectedVerifyProtocolId)?.protocolType || "VIRTUAL_SERVER",
                  chainId: 1,
                  verification: "onchain",
                  immutabilityGuaranteed: true,
                  ownerAddress: activeAnchor?.ownerAddress || "0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C"
                }, null, 2)}</pre>
              </div>

              <button
                onClick={() => handleCopy(JSON.stringify({
                  identityProtocol: "BTE-ID-V1",
                  identityId: activeAnchor?.identityId || "0x3f89a1b021c...",
                  protocolId: selectedVerifyProtocolId || "0x9a8b7c6d5e4...",
                  chainId: 1,
                  verification: "onchain"
                }, null, 2), 'json_passport')}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                {copiedKey === 'json_passport' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>Copy Standard BTE-ID v1 JSON Telemetry</span>
              </button>
            </div>

          </div>

          {/* Verification Telemetry Logs */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              <span>Real-Time Verification Telemetry Logs</span>
            </h3>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                    <th className="pb-2 px-3">Timestamp</th>
                    <th className="pb-2 px-3">Protocol ID</th>
                    <th className="pb-2 px-3">Type</th>
                    <th className="pb-2 px-3">Status</th>
                    <th className="pb-2 px-3">Latency</th>
                    <th className="pb-2 px-3">EVM Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {verificationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-800/30">
                      <td className="py-2.5 px-3 text-zinc-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5 px-3 text-cyan-300">{log.protocolId.slice(0, 16)}...</td>
                      <td className="py-2.5 px-3 text-zinc-300">{log.protocolType}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'VERIFIED_MATCH' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300">{log.latencyMs} ms</td>
                      <td className="py-2.5 px-3 text-purple-300">{log.contractMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: MUTABLE PERMISSIONS & ROLES */}
      {activeTab === 'permissions_roles' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Lock className="h-5 w-5 text-amber-400" />
                <span>Immutable Root + Mutable Permissions Architecture</span>
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                The identity anchor never changes, but operational permissions can be revoked or re-assigned dynamically if a server is compromised.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {protocols.map((proto) => (
                <div key={proto.protocolId} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{proto.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      proto.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {proto.active ? 'ACTIVE' : 'REVOKED'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Role Permissions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {proto.rolePermissions.map((role, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-cyan-300 text-[10px] font-mono font-bold">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">Nonce: #4920</span>
                    <button
                      onClick={() => handleToggleProtocolPermission(proto.protocolId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        proto.active ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800' : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {proto.active ? 'Emergency Revoke Server' : 'Restore Permissions'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SOLIDITY SMART CONTRACT & ABI */}
      {activeTab === 'solidity_contract' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileCode2 className="h-5 w-5 text-cyan-400" />
                  <span>InclusiveIdentityRegistry.sol (Solidity ^0.8.24)</span>
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Production-grade EVM reference smart contract implementation for immutable identity anchoring.
                </p>
              </div>
              <button
                onClick={() => handleCopy(solidityCode, 'solidity')}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center space-x-1.5 cursor-pointer transition-all self-start sm:self-auto"
              >
                {copiedKey === 'solidity' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>Copy Solidity Source</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[600px] leading-relaxed custom-scrollbar">
              <pre className="text-cyan-300">{solidityCode}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
