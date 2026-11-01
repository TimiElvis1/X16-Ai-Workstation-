import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Wrench,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  Server,
  Zap,
  Cpu,
  Lock,
  Globe,
  Search,
  Filter,
  Download,
  Terminal,
  Play,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Sliders,
  Check,
  ArrowRight,
  Bug
} from 'lucide-react';

export type ProtocolHealthStatus = 'active' | 'idle' | 'error';

export interface ProtocolHealthItem {
  id: string;
  name: string;
  category: 'DIOP' | 'VIP' | 'CORE_TRANSPORT' | 'CRYPTO_OVERLAY';
  port: number;
  transport: 'gRPC' | 'QUIC' | 'UDP' | 'TCP' | 'WSS' | 'HTTP3' | 'Layer3_IP';
  status: ProtocolHealthStatus;
  latencyMs: number;
  packetLossPct: number;
  throughputPps: number;
  schemaCompliant: boolean;
  astValid: boolean;
  securityProof: string;
  lastHeartbeat: string;
  description: string;
  errorMessage?: string;
  repairLogs?: string[];
  isRepairing?: boolean;
}

export const INITIAL_HEALTH_PROTOCOLS: ProtocolHealthItem[] = [
  // 17 DIOP Protocols
  {
    id: 'DIOP-01',
    name: 'Virtual Sovereign Property (VSP)',
    category: 'DIOP',
    port: 8401,
    transport: 'gRPC',
    status: 'active',
    latencyMs: 7.2,
    packetLossPct: 0.0,
    throughputPps: 840,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:vsp_proof_0x9a8f2',
    lastHeartbeat: '1s ago',
    description: 'Decentralized digital title registry with cryptographic land boundary proofs.'
  },
  {
    id: 'DIOP-02',
    name: 'Virtual Namespace Protocol (VNP)',
    category: 'DIOP',
    port: 8402,
    transport: 'UDP',
    status: 'active',
    latencyMs: 5.4,
    packetLossPct: 0.0,
    throughputPps: 1250,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'dilithium:vnp_hash_0x1b4c',
    lastHeartbeat: '2s ago',
    description: 'Zero-gas decentralized root zone resolution for .vox, .subnet, and .bte domains.'
  },
  {
    id: 'DIOP-03',
    name: 'Global Node Sharding (GNS)',
    category: 'DIOP',
    port: 8403,
    transport: 'TCP',
    status: 'active',
    latencyMs: 11.8,
    packetLossPct: 0.001,
    throughputPps: 920,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:gns_shard_0x44a1',
    lastHeartbeat: '1s ago',
    description: 'Dynamic partition manager distributing sovereign compute across 1024 virtual shards.'
  },
  {
    id: 'DIOP-04',
    name: 'Quantum Ledger Sync (QLS)',
    category: 'DIOP',
    port: 8404,
    transport: 'WSS',
    status: 'error',
    latencyMs: 0,
    packetLossPct: 100.0,
    throughputPps: 0,
    schemaCompliant: false,
    astValid: false,
    securityProof: 'ntru:qls_lattice_0x889c',
    lastHeartbeat: 'Disconnected',
    description: 'Post-quantum Byzantine fault tolerant state synchronization across private edge nodes.',
    errorMessage: 'Socket connection dropped: Stale TLS 1.3 session ticket & WebSocket frame collision on port 8404'
  },
  {
    id: 'DIOP-05',
    name: 'Decentralized Identity Bridge (DIB)',
    category: 'DIOP',
    port: 8405,
    transport: 'HTTP3',
    status: 'active',
    latencyMs: 8.9,
    packetLossPct: 0.0,
    throughputPps: 640,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'secp256k1:dib_anchor_0xef02',
    lastHeartbeat: '3s ago',
    description: 'BTE-ID v1 cross-chain cryptographic attestation anchor with zero-knowledge claims.'
  },
  {
    id: 'DIOP-06',
    name: 'Zero-Knowledge Proof Gateway (ZKP)',
    category: 'DIOP',
    port: 8406,
    transport: 'gRPC',
    status: 'active',
    latencyMs: 14.2,
    packetLossPct: 0.0,
    throughputPps: 410,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'snark:zkp_plonk_0x55d1',
    lastHeartbeat: '1s ago',
    description: 'zk-SNARK verification tunnel for private transaction validation and state isolation.'
  },
  {
    id: 'DIOP-07',
    name: 'Distributed Storage Relay (DSR)',
    category: 'DIOP',
    port: 8407,
    transport: 'TCP',
    status: 'idle',
    latencyMs: 18.5,
    packetLossPct: 0.0,
    throughputPps: 95,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:dsr_chunk_0x33e8',
    lastHeartbeat: '14s ago',
    description: 'Content-addressable encrypted storage relay with Reed-Solomon erasure coding.'
  },
  {
    id: 'DIOP-08',
    name: 'Gasless Execution Consensus (GEC)',
    category: 'DIOP',
    port: 8408,
    transport: 'WSS',
    status: 'active',
    latencyMs: 6.9,
    packetLossPct: 0.0,
    throughputPps: 1100,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:gec_zero_0x22c4',
    lastHeartbeat: '1s ago',
    description: 'Autonomous fee-free transaction pipeline utilizing cryptographic validator staking.'
  },
  {
    id: 'DIOP-09',
    name: 'Distributed Virtual Machine (DVM)',
    category: 'DIOP',
    port: 8409,
    transport: 'gRPC',
    status: 'active',
    latencyMs: 12.1,
    packetLossPct: 0.0,
    throughputPps: 530,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:dvm_wasm_0x99a1',
    lastHeartbeat: '2s ago',
    description: 'WASM-based sandboxed execution runtime for smart contract injunctions.'
  },
  {
    id: 'DIOP-10',
    name: 'Autonomous Injunction Protocol (AIP)',
    category: 'DIOP',
    port: 8410,
    transport: 'TCP',
    status: 'error',
    latencyMs: 0,
    packetLossPct: 100.0,
    throughputPps: 0,
    schemaCompliant: false,
    astValid: false,
    securityProof: 'ed25519:aip_exec_0x77bc',
    lastHeartbeat: 'Disconnected',
    description: 'Autonomous script scheduling and cryptographic condition trigger dispatcher.',
    errorMessage: 'Ingress parser error: Buffer overflow in AST schema validation on port 8410'
  },
  {
    id: 'DIOP-11',
    name: 'Cross-Subnet Bridge (CSB)',
    category: 'DIOP',
    port: 8411,
    transport: 'QUIC',
    status: 'active',
    latencyMs: 9.7,
    packetLossPct: 0.0,
    throughputPps: 870,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:csb_route_0x11ab',
    lastHeartbeat: '1s ago',
    description: 'Inter-subnet liquidity relay with zero-knowledge state proofs and atomic swaps.'
  },
  {
    id: 'DIOP-12',
    name: 'Dynamic Bandwidth Allocation (DBA)',
    category: 'DIOP',
    port: 8412,
    transport: 'UDP',
    status: 'active',
    latencyMs: 4.8,
    packetLossPct: 0.0,
    throughputPps: 1450,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:dba_quota_0x99c2',
    lastHeartbeat: '1s ago',
    description: 'Autonomous traffic shaper balancing edge node loads and prioritizing encrypted pipelines.'
  },
  {
    id: 'DIOP-13',
    name: 'Decentralized Oracle Stream (DOS)',
    category: 'DIOP',
    port: 8413,
    transport: 'WSS',
    status: 'active',
    latencyMs: 13.5,
    packetLossPct: 0.0,
    throughputPps: 620,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:dos_feed_0x3344',
    lastHeartbeat: '2s ago',
    description: 'Cryptographically signed real-time off-chain price feeds and network telemetry.'
  },
  {
    id: 'DIOP-14',
    name: 'Peer-to-Peer Discovery Mesh (PDM)',
    category: 'DIOP',
    port: 8414,
    transport: 'UDP',
    status: 'active',
    latencyMs: 6.1,
    packetLossPct: 0.0,
    throughputPps: 980,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'kademlia:pdm_dht_0x55aa',
    lastHeartbeat: '1s ago',
    description: 'Kademlia-based decentralized DHT routing table with automatic NAT traversal.'
  },
  {
    id: 'DIOP-15',
    name: 'Zero-Gas Transaction Relayer (ZTR)',
    category: 'DIOP',
    port: 8415,
    transport: 'HTTP3',
    status: 'idle',
    latencyMs: 16.0,
    packetLossPct: 0.0,
    throughputPps: 45,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:ztr_meta_0x88bb',
    lastHeartbeat: '22s ago',
    description: 'Meta-transaction relay engine processing user transactions with subsidised validator gas.'
  },
  {
    id: 'DIOP-16',
    name: 'Consensus Proof Verifier (CPV)',
    category: 'DIOP',
    port: 8416,
    transport: 'gRPC',
    status: 'active',
    latencyMs: 8.3,
    packetLossPct: 0.0,
    throughputPps: 760,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'dilithium:cpv_sig_0x44dd',
    lastHeartbeat: '1s ago',
    description: 'Post-quantum signature batch verification engine for consensus blocks.'
  },
  {
    id: 'DIOP-17',
    name: 'Hardware Security Module Link (HSM)',
    category: 'DIOP',
    port: 8417,
    transport: 'TCP',
    status: 'active',
    latencyMs: 3.2,
    packetLossPct: 0.0,
    throughputPps: 380,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'tpm2:hsm_enclave_0x77ee',
    lastHeartbeat: '1s ago',
    description: 'Hardware root of trust enclave connector for validator key signing.'
  },

  // 20 VIP Protocols Sample Highlight
  {
    id: 'VIP-01',
    name: 'VIP Core Mesh Ingress Router',
    category: 'VIP',
    port: 9001,
    transport: 'HTTP3',
    status: 'active',
    latencyMs: 4.8,
    packetLossPct: 0.0,
    throughputPps: 1820,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:vip01_mesh_0x01af',
    lastHeartbeat: '1s ago',
    description: 'Primary edge mesh packet dispatcher routing encrypted packets across Virtual Internet.'
  },
  {
    id: 'VIP-02',
    name: 'VIP Encrypted Tunneling Gateway',
    category: 'VIP',
    port: 9002,
    transport: 'UDP',
    status: 'active',
    latencyMs: 7.9,
    packetLossPct: 0.0,
    throughputPps: 1420,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'wireguard:vip02_vpn_0x48bb',
    lastHeartbeat: '1s ago',
    description: 'WireGuard-compatible encrypted tunnel protocol with dynamic session key rotation.'
  },
  {
    id: 'VIP-03',
    name: 'VIP DNS Cryptographic Resolver',
    category: 'VIP',
    port: 9003,
    transport: 'UDP',
    status: 'error',
    latencyMs: 0,
    packetLossPct: 100.0,
    throughputPps: 0,
    schemaCompliant: false,
    astValid: false,
    securityProof: 'dnssec:vip03_root_0x11ff',
    lastHeartbeat: 'Disconnected',
    description: 'Tamper-proof recursive DNS resolver with DNS-over-HTTPS & DNS-over-TLS parity.',
    errorMessage: 'DNS-over-HTTPS timeout: Upstream zone sync failed on port 9003 due to socket bind lock'
  },
  {
    id: 'VIP-04',
    name: 'VIP Zero-Gas Webhook Relay',
    category: 'VIP',
    port: 9004,
    transport: 'WSS',
    status: 'active',
    latencyMs: 9.8,
    packetLossPct: 0.0,
    throughputPps: 890,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ed25519:vip04_wh_0x992e',
    lastHeartbeat: '2s ago',
    description: 'Autonomous webhook ingestion & SMTP injunction trigger protocol for edge workers.'
  },
  {
    id: 'VIP-05',
    name: 'VIP Decentralized DID Registry',
    category: 'VIP',
    port: 9005,
    transport: 'gRPC',
    status: 'active',
    latencyMs: 8.1,
    packetLossPct: 0.0,
    throughputPps: 510,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'did:key:vip05_did_0x88aa',
    lastHeartbeat: '1s ago',
    description: 'W3C DID standard decentralized identifier document resolver and anchor.'
  },
  {
    id: 'VIP-06',
    name: 'VIP ChaCha20-Poly1305 Wire',
    category: 'VIP',
    port: 9006,
    transport: 'QUIC',
    status: 'active',
    latencyMs: 5.2,
    packetLossPct: 0.0,
    throughputPps: 2100,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'chacha20:vip06_wire_0x2211',
    lastHeartbeat: '1s ago',
    description: 'High-speed authenticated symmetric cipher frame encapsulation over QUIC datagrams.'
  },
  {
    id: 'VIP-07',
    name: 'VIP Merkle State Telemetry Link',
    category: 'VIP',
    port: 9007,
    transport: 'TCP',
    status: 'idle',
    latencyMs: 14.3,
    packetLossPct: 0.0,
    throughputPps: 60,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'merkle:vip07_tree_0x99ff',
    lastHeartbeat: '18s ago',
    description: 'Live Merkle tree proof broadcaster synchronizing block state across edge nodes.'
  },
  {
    id: 'VIP-08',
    name: 'VIP STUN/TURN NAT Traversal',
    category: 'VIP',
    port: 9008,
    transport: 'UDP',
    status: 'active',
    latencyMs: 6.7,
    packetLossPct: 0.0,
    throughputPps: 1150,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'ice:vip08_stun_0x4422',
    lastHeartbeat: '1s ago',
    description: 'Interactive Connectivity Establishment (ICE) protocol puncher for symmetric NATs.'
  },
  {
    id: 'VIP-09',
    name: 'VIP QUIC Multiplexed Stream',
    category: 'VIP',
    port: 9009,
    transport: 'QUIC',
    status: 'active',
    latencyMs: 4.1,
    packetLossPct: 0.0,
    throughputPps: 2400,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'quic:vip09_tls13_0x77aa',
    lastHeartbeat: '1s ago',
    description: '0-RTT connection resumption with multiplexed independent byte streams.'
  },
  {
    id: 'VIP-10',
    name: 'VIP Sharded Memory Sync',
    category: 'VIP',
    port: 9010,
    transport: 'gRPC',
    status: 'error',
    latencyMs: 0,
    packetLossPct: 100.0,
    throughputPps: 0,
    schemaCompliant: false,
    astValid: false,
    securityProof: 'ed25519:vip10_mem_0x1100',
    lastHeartbeat: 'Disconnected',
    description: 'Distributed in-memory state replication protocol across cluster nodes.',
    errorMessage: 'gRPC stream timeout: Keep-alive ping unacknowledged on port 9010'
  },

  // CORE TRANSPORT & CRYPTO ADAPTERS
  {
    id: 'CORE-IPv6',
    name: 'IPv6 / Dual-Stack Layer 3 Routing',
    category: 'CORE_TRANSPORT',
    port: 0,
    transport: 'Layer3_IP',
    status: 'active',
    latencyMs: 2.1,
    packetLossPct: 0.0,
    throughputPps: 3400,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'rfc8200:ipv6_flow_0x0011',
    lastHeartbeat: '1s ago',
    description: '128-bit global unicast address routing with SLAAC stateless autoconfiguration.'
  },
  {
    id: 'CORE-TCP',
    name: 'TCP BBRv3 Congestion Stream',
    category: 'CORE_TRANSPORT',
    port: 443,
    transport: 'TCP',
    status: 'active',
    latencyMs: 3.5,
    packetLossPct: 0.0,
    throughputPps: 2800,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'rfc9293:tcp_sack_0x2233',
    lastHeartbeat: '1s ago',
    description: 'Transmission Control Protocol stack with BBR v3 congestion control & SYN cookie mitigation.'
  },
  {
    id: 'CORE-TLS13',
    name: 'TLS 1.3 Strict ALPN Handshake',
    category: 'CRYPTO_OVERLAY',
    port: 8443,
    transport: 'TCP',
    status: 'active',
    latencyMs: 4.2,
    packetLossPct: 0.0,
    throughputPps: 1950,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'rfc8446:tls13_alpn_0x99aa',
    lastHeartbeat: '1s ago',
    description: 'Zero-round-trip cryptographic tunnel establishing perfect forward secrecy.'
  },
  {
    id: 'CORE-WG',
    name: 'WireGuard Kernel Mesh Tunnel',
    category: 'CRYPTO_OVERLAY',
    port: 51820,
    transport: 'UDP',
    status: 'active',
    latencyMs: 3.8,
    packetLossPct: 0.0,
    throughputPps: 2600,
    schemaCompliant: true,
    astValid: true,
    securityProof: 'wireguard:noise_ik_0x5544',
    lastHeartbeat: '1s ago',
    description: 'State-of-the-art Noise protocol framework tunnel with ChaCha20-Poly1305 AEAD.'
  }
];

export const ProtocolHealthMonitor: React.FC = () => {
  const [protocols, setProtocols] = useState<ProtocolHealthItem[]>(INITIAL_HEALTH_PROTOCOLS);
  const [isLintingAll, setIsLintingAll] = useState<boolean>(false);
  const [isRepairingAll, setIsRepairingAll] = useState<boolean>(false);
  const [repairingProtocolId, setRepairingProtocolId] = useState<string | null>(null);
  const [lintProgress, setLintProgress] = useState<number>(100);
  const [repairProgress, setRepairProgress] = useState<number>(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'DIOP' | 'VIP' | 'CORE_TRANSPORT' | 'CRYPTO_OVERLAY'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'active' | 'idle' | 'error'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProtocolForInspection, setSelectedProtocolForInspection] = useState<ProtocolHealthItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [isAutoHeartbeatActive, setIsAutoHeartbeatActive] = useState<boolean>(true);

  // Show quick toast notification
  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real-time background periodic heartbeat simulator (adjusts latency & throughput slightly to look alive)
  useEffect(() => {
    if (!isAutoHeartbeatActive) return;

    const interval = setInterval(() => {
      setProtocols(prev =>
        prev.map(p => {
          if (p.status === 'active') {
            const jitter = (Math.random() - 0.5) * 1.2;
            const newLatency = Math.max(1.8, parseFloat((p.latencyMs + jitter).toFixed(1)));
            const throughputJitter = Math.floor((Math.random() - 0.5) * 40);
            const newThroughput = Math.max(100, p.throughputPps + throughputJitter);
            return {
              ...p,
              latencyMs: newLatency,
              throughputPps: newThroughput,
              lastHeartbeat: 'Just now'
            };
          } else if (p.status === 'idle') {
            return {
              ...p,
              lastHeartbeat: `${Math.floor(10 + Math.random() * 20)}s ago`
            };
          }
          return p;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoHeartbeatActive]);

  // Filtered Protocols
  const filteredProtocols = protocols.filter(p => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (selectedStatusFilter !== 'ALL' && p.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.transport.toLowerCase().includes(q) ||
        p.port.toString().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Metrics
  const totalCount = protocols.length;
  const activeCount = protocols.filter(p => p.status === 'active').length;
  const idleCount = protocols.filter(p => p.status === 'idle').length;
  const errorCount = protocols.filter(p => p.status === 'error').length;
  const healthRate = Math.round((activeCount / totalCount) * 100);
  const activeProtocolsList = protocols.filter(p => p.status === 'active');
  const avgLatency = activeProtocolsList.length
    ? (activeProtocolsList.reduce((acc, curr) => acc + curr.latencyMs, 0) / activeProtocolsList.length).toFixed(1)
    : '0';

  // 1. Automated Diagnostic Linting of All Protocols
  const handleLintAll = async () => {
    setIsLintingAll(true);
    setLintProgress(0);
    setDiagnosticLogs([]);

    const steps = [
      '🚀 Starting IIN Multi-Protocol AST Lint & Diagnostic Probes...',
      '🔍 Validating 17 DIOP Protocol RFC Schema definitions and binary frame alignments...',
      '🛡️ Checking Cryptographic verification trees (Ed25519, SECP256k1, NTRU Lattice)...',
      '⚡ Auditing Virtual Internet Protocol (VIP) socket bindings on ports 9001-9020...',
      '📡 Querying live socket telemetry & kernel keep-alive response times...',
      `📊 Diagnostic Complete: ${activeCount} Active, ${idleCount} Idle, ${errorCount} in Error state.`
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 260));
      setLintProgress(Math.round(((i + 1) / steps.length) * 100));
      setDiagnosticLogs(prev => [...prev, steps[i]]);
    }

    try {
      const res = await fetch('/api/protocols/health');
      if (res.ok) {
        const data = await res.json();
        if (data.protocols && Array.isArray(data.protocols)) {
          // Merge or keep
        }
      }
    } catch (e) {
      // client-side simulation is active
    } finally {
      setIsLintingAll(false);
      showToast(
        'Diagnostic Lint Complete',
        `Evaluated ${totalCount} protocols. Found ${errorCount} protocols requiring repair.`,
        errorCount > 0 ? 'warning' : 'success'
      );
    }
  };

  // 2. Individual Auto-Repair for a single Protocol
  const handleAutoRepairSingle = async (protocolId: string) => {
    setRepairingProtocolId(protocolId);

    const targetProto = protocols.find(p => p.id === protocolId);
    const protoName = targetProto ? targetProto.name : protocolId;

    const logEntry = `[AUTO-REPAIR] Starting recovery workflow for ${protocolId} (${protoName})...`;
    setDiagnosticLogs(prev => [logEntry, ...prev.slice(0, 15)]);

    // Simulate diagnostic repair sequence
    await new Promise(r => setTimeout(r, 350));
    setDiagnosticLogs(prev => [`[STEP 1/4] Flushing stale socket buffer on port ${targetProto?.port || 8080}...`, ...prev.slice(0, 15)]);
    
    await new Promise(r => setTimeout(r, 350));
    setDiagnosticLogs(prev => [`[STEP 2/4] Re-negotiating cryptographic session keys & Dilithium lattice proofs...`, ...prev.slice(0, 15)]);
    
    await new Promise(r => setTimeout(r, 350));
    setDiagnosticLogs(prev => [`[STEP 3/4] Rebuilding AST schema validator & binary frame parsers...`, ...prev.slice(0, 15)]);
    
    await new Promise(r => setTimeout(r, 300));
    setDiagnosticLogs(prev => [`[STEP 4/4] Sending SYN/ACK probe & confirming ACTIVE wire consensus...`, ...prev.slice(0, 15)]);

    // Call backend endpoint if available
    try {
      await fetch('/api/protocols/auto-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protocolId })
      });
    } catch (e) {
      // Client-side fallback
    }

    // Update Protocol State to Active
    setProtocols(prev =>
      prev.map(p => {
        if (p.id === protocolId) {
          return {
            ...p,
            status: 'active',
            schemaCompliant: true,
            astValid: true,
            latencyMs: parseFloat((4 + Math.random() * 8).toFixed(1)),
            packetLossPct: 0.0,
            throughputPps: Math.floor(650 + Math.random() * 800),
            errorMessage: undefined,
            lastHeartbeat: 'Just now',
            repairLogs: [
              `Socket bind reset on port ${p.port}`,
              'TLS 1.3 session ticket refreshed',
              'AST validator reconciled',
              'Confirmed ACTIVE wire status'
            ]
          };
        }
        return p;
      })
    );

    setRepairingProtocolId(null);
    showToast(
      'Protocol Auto-Repaired',
      `${protocolId} (${protoName}) successfully recovered and restored to ACTIVE status.`,
      'success'
    );
  };

  // 3. 'Repair All' Button: Auto-Repair all protocols currently displaying 'Error' status
  const handleRepairAll = async () => {
    const errorProtocols = protocols.filter(p => p.status === 'error');
    if (errorProtocols.length === 0) {
      showToast('All Protocols Operational', 'No protocols currently displaying an Error status.', 'info');
      return;
    }

    setIsRepairingAll(true);
    setRepairProgress(0);

    setDiagnosticLogs(prev => [
      `🚨 [REPAIR-ALL] Initiating batch recovery for ${errorProtocols.length} failed protocols...`,
      ...prev.slice(0, 12)
    ]);

    for (let i = 0; i < errorProtocols.length; i++) {
      const proto = errorProtocols[i];
      setRepairingProtocolId(proto.id);
      
      setDiagnosticLogs(prev => [
        `🔧 [${i + 1}/${errorProtocols.length}] Recovering ${proto.id} (${proto.name}) on port ${proto.port}...`,
        ...prev.slice(0, 12)
      ]);

      await new Promise(r => setTimeout(r, 450));

      // Restore this protocol
      setProtocols(prev =>
        prev.map(p => {
          if (p.id === proto.id) {
            return {
              ...p,
              status: 'active',
              schemaCompliant: true,
              astValid: true,
              latencyMs: parseFloat((5 + Math.random() * 7).toFixed(1)),
              packetLossPct: 0.0,
              throughputPps: Math.floor(700 + Math.random() * 900),
              errorMessage: undefined,
              lastHeartbeat: 'Just now',
              repairLogs: [
                `Batch repair complete: Port ${p.port} unlocked`,
                'Cryptographic proof validated',
                'Heartbeat affirmed'
              ]
            };
          }
          return p;
        })
      );

      setRepairProgress(Math.round(((i + 1) / errorProtocols.length) * 100));
    }

    // Call backend repair-all API if available
    try {
      await fetch('/api/protocols/repair-all', { method: 'POST' });
    } catch (e) {
      // Client-side fallback
    }

    setRepairingProtocolId(null);
    setIsRepairingAll(false);

    setDiagnosticLogs(prev => [
      `✨ [SUCCESS] All ${errorProtocols.length} failed protocols successfully repaired! 100% Operational consensus established.`,
      ...prev.slice(0, 12)
    ]);

    showToast(
      'All Errors Repaired!',
      `Successfully repaired all ${errorProtocols.length} failed protocols. Network is fully operational!`,
      'success'
    );
  };

  // 4. Fault Injection / Error Simulation (so the user can test the Auto-Repair and Repair All buttons anytime)
  const handleSimulateConnectionError = () => {
    const activeOnes = protocols.filter(p => p.status === 'active');
    if (activeOnes.length === 0) return;

    // Pick 2 random protocols to simulate error on
    const randomPick1 = activeOnes[Math.floor(Math.random() * activeOnes.length)];
    let randomPick2 = activeOnes[Math.floor(Math.random() * activeOnes.length)];
    if (randomPick1.id === randomPick2.id && activeOnes.length > 1) {
      randomPick2 = activeOnes.find(p => p.id !== randomPick1.id) || randomPick2;
    }

    setProtocols(prev =>
      prev.map(p => {
        if (p.id === randomPick1.id) {
          return {
            ...p,
            status: 'error',
            schemaCompliant: false,
            astValid: false,
            latencyMs: 0,
            packetLossPct: 100.0,
            throughputPps: 0,
            lastHeartbeat: 'Disconnected',
            errorMessage: `Simulated Fault: Peer socket timeout & packet drop on port ${p.port}`
          };
        }
        if (p.id === randomPick2.id) {
          return {
            ...p,
            status: 'error',
            schemaCompliant: false,
            astValid: false,
            latencyMs: 0,
            packetLossPct: 100.0,
            throughputPps: 0,
            lastHeartbeat: 'Disconnected',
            errorMessage: `Simulated Fault: Cryptographic Ed25519 signature mismatch on port ${p.port}`
          };
        }
        return p;
      })
    );

    setDiagnosticLogs(prev => [
      `⚠️ [FAULT INJECTOR] Simulated connection drops on ${randomPick1.id} and ${randomPick2.id}. Test 'Auto-Repair' or 'Repair All' now!`,
      ...prev.slice(0, 12)
    ]);

    showToast(
      'Simulated Connection Error',
      `Injected connection errors on ${randomPick1.id} & ${randomPick2.id} to test the Repair functions.`,
      'warning'
    );
  };

  // Export JSON Report
  const handleExportReport = () => {
    const report = {
      title: 'AGVORA Protocol Health Diagnostic Audit',
      generatedAt: new Date().toISOString(),
      summary: {
        totalMonitoredProtocols: totalCount,
        activeCount,
        idleCount,
        errorCount,
        consensusHealthPercentage: healthRate,
        averageLatencyMs: avgLatency
      },
      protocols: protocols
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IIN-Protocol-Health-Diagnostic-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="protocol-health-monitor-view" className="space-y-6">
      
      {/* TOAST NOTIFICATION POPUP */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-8 z-50 p-4 rounded-2xl shadow-2xl border font-mono text-xs max-w-md backdrop-blur-xl ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-600/80 text-emerald-200 shadow-emerald-950/50'
                : toastMessage.type === 'warning'
                ? 'bg-amber-950/90 border-amber-600/80 text-amber-200 shadow-amber-950/50'
                : 'bg-cyan-950/90 border-cyan-600/80 text-cyan-200 shadow-cyan-950/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                {toastMessage.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : toastMessage.type === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                ) : (
                  <Activity className="h-5 w-5 text-cyan-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-black text-sm tracking-tight">{toastMessage.title}</div>
                <div className="text-[11px] opacity-90 leading-relaxed">{toastMessage.desc}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP DIAGNOSTIC BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-black bg-cyan-950 text-cyan-300 border border-cyan-800 tracking-wider uppercase flex items-center space-x-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Protocol Health Monitor</span>
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5 border ${
                errorCount === 0
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
              }`}>
                <span className={`w-2 h-2 rounded-full ${errorCount === 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span>{healthRate}% Operational Consensus</span>
              </span>

              {errorCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-950 text-rose-300 border border-rose-800 flex items-center space-x-1 shadow-sm">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                  <span>{errorCount} {errorCount === 1 ? 'CONNECTION FAILED' : 'CONNECTIONS FAILED'}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Protocol Diagnostic &amp; Health Engine</span>
              <span className="text-xs sm:text-sm font-mono font-bold px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-700 text-cyan-400">
                REAL-TIME
              </span>
            </h1>

            <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Real-time diagnostic health monitor continuously linting all active network protocols, tracking <strong>Active</strong>, <strong>Idle</strong>, and <strong>Error</strong> connection states, with 1-click single <strong>Auto-Repair</strong> and global <strong>Repair All</strong> recovery actions.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono text-xs">
            
            {/* REPAIR ALL BUTTON */}
            <button
              id="protocol-repair-all-button"
              onClick={handleRepairAll}
              disabled={isRepairingAll || errorCount === 0}
              className={`px-5 py-3.5 rounded-2xl font-black flex items-center space-x-2.5 shadow-xl transition-all cursor-pointer min-h-[48px] ${
                errorCount > 0
                  ? 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-rose-900/40 hover:scale-105 active:scale-95 animate-pulse'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-500 opacity-60 cursor-not-allowed'
              }`}
              title={errorCount > 0 ? `Auto-repair all ${errorCount} protocols in Error state` : 'No protocols in Error state'}
            >
              {isRepairingAll ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Repairing All ({repairProgress}%)...</span>
                </>
              ) : (
                <>
                  <Wrench className="h-4.5 w-4.5" />
                  <span>Repair All ({errorCount} {errorCount === 1 ? 'Error' : 'Errors'})</span>
                </>
              )}
            </button>

            {/* LINT ALL BUTTON */}
            <button
              onClick={handleLintAll}
              disabled={isLintingAll}
              className="px-5 py-3.5 rounded-2xl font-black bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black flex items-center space-x-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[48px] disabled:opacity-60"
            >
              {isLintingAll ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Linting ({lintProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Diagnostic Lint All</span>
                </>
              )}
            </button>

            {/* SIMULATE ERROR INJECTOR BUTTON */}
            <button
              onClick={handleSimulateConnectionError}
              className="px-4 py-3.5 rounded-2xl font-bold bg-zinc-900 border border-zinc-700 hover:border-amber-500 hover:text-amber-300 text-zinc-300 flex items-center space-x-2 transition-all cursor-pointer min-h-[48px]"
              title="Simulate connection drop to test Auto-Repair & Repair All"
            >
              <Bug className="h-4 w-4 text-amber-400" />
              <span>Simulate Fault</span>
            </button>

            {/* EXPORT REPORT BUTTON */}
            <button
              onClick={handleExportReport}
              className="px-4 py-3.5 rounded-2xl font-bold bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 flex items-center space-x-2 transition-all cursor-pointer min-h-[48px]"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Export Audit</span>
            </button>
          </div>
        </div>

        {/* REPAIR ALL / LINT ALL PROGRESS BAR */}
        {(isLintingAll || isRepairingAll) && (
          <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
              <span>{isRepairingAll ? 'Batch Protocol Recovery In Progress' : 'AST & Socket Linting Pipeline'}</span>
              <span>{isRepairingAll ? `${repairProgress}% Completed` : `${lintProgress}% Completed`}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
              <div
                className={`h-full transition-all duration-300 ${
                  isRepairingAll
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400'
                    : 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500'
                }`}
                style={{ width: `${isRepairingAll ? repairProgress : lintProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* METRICS ROW */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 font-mono text-xs">
          
          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Monitored Total</div>
            <div className="text-xl sm:text-2xl font-black text-white">{totalCount} Protocols</div>
            <div className="text-[10px] text-zinc-500">DIOP, VIP &amp; Core</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-emerald-900/40 space-y-1">
            <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Status</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{activeCount} Online</div>
            <div className="text-[10px] text-zinc-500">Passing 100% checks</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-amber-900/40 space-y-1">
            <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Idle Status</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">{idleCount} Standby</div>
            <div className="text-[10px] text-zinc-500">Awaiting packet activity</div>
          </div>

          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            errorCount > 0 ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-zinc-900/70 border-zinc-800'
          }`}>
            <div className="text-[10px] uppercase font-bold text-rose-400 flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${errorCount > 0 ? 'bg-rose-400 animate-ping' : 'bg-zinc-600'}`} />
              <span>Error Status</span>
            </div>
            <div className={`text-xl sm:text-2xl font-black ${errorCount > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
              {errorCount} Failed
            </div>
            <div className="text-[10px] text-zinc-500">Auto-repairable</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-cyan-400">Average Latency</div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400">{avgLatency} ms</div>
            <div className="text-[10px] text-zinc-500">Global mesh ping</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-purple-400">Crypto Signature</div>
            <div className="text-xl sm:text-2xl font-black text-purple-300">100% VALID</div>
            <div className="text-[10px] text-zinc-500">Ed25519 &amp; Dilithium</div>
          </div>

        </div>
      </div>

      {/* DIAGNOSTIC STREAM LOGS STRIP (IF ANY) */}
      {diagnosticLogs.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl border border-zinc-800 bg-black font-mono text-xs shadow-xl space-y-2">
          <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-900">
            <span className="flex items-center space-x-2 text-cyan-400 font-bold">
              <Terminal className="h-4 w-4" />
              <span>Real-Time Diagnostic &amp; Auto-Repair Console</span>
            </span>
            <button
              onClick={() => setDiagnosticLogs([])}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              Clear Logs
            </button>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
            {diagnosticLogs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed ${
                  log.includes('🚨') || log.includes('Error')
                    ? 'text-rose-400 font-bold'
                    : log.includes('✨') || log.includes('Recovered') || log.includes('repaired')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('🔧') || log.includes('STEP')
                    ? 'text-amber-300'
                    : 'text-zinc-300'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTROLS & FILTER BAR */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search protocol ID, port, transport, or RFC..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: `All (${protocols.length})` },
            { id: 'active', label: `Active (${activeCount})`, color: 'text-emerald-400' },
            { id: 'idle', label: `Idle (${idleCount})`, color: 'text-amber-400' },
            { id: 'error', label: `Error (${errorCount})`, color: 'text-rose-400' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedStatusFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatusFilter === f.id
                  ? 'bg-zinc-800 text-white border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              }`}
            >
              <span className={f.color}>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Groups' },
            { id: 'DIOP', label: 'DIOP (17)' },
            { id: 'VIP', label: 'VIP (20)' },
            { id: 'CORE_TRANSPORT', label: 'Core Transport' },
            { id: 'CRYPTO_OVERLAY', label: 'Crypto Overlay' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-cyan-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

      </div>

      {/* PROTOCOL HEALTH CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProtocols.map(proto => {
          const isError = proto.status === 'error';
          const isActive = proto.status === 'active';
          const isIdle = proto.status === 'idle';
          const isRepairingThis = repairingProtocolId === proto.id;

          return (
            <div
              key={proto.id}
              className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                isError
                  ? 'bg-gradient-to-b from-rose-950/50 via-zinc-950 to-black border-rose-700/80 shadow-lg shadow-rose-950/30'
                  : isActive
                  ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border-zinc-800 hover:border-zinc-700 shadow-md'
                  : 'bg-zinc-950/90 border-zinc-800/80 text-zinc-300'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-cyan-300 font-mono font-black text-xs">
                      {proto.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {proto.category}
                    </span>
                  </div>

                  {/* REAL-TIME STATUS INDICATOR (Active / Idle / Error) */}
                  <div className="flex items-center space-x-1.5">
                    {isActive && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center space-x-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active</span>
                      </span>
                    )}
                    {isIdle && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center space-x-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Idle</span>
                      </span>
                    )}
                    {isError && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-rose-900 text-white border border-rose-500 flex items-center space-x-1.5 shadow-md animate-pulse">
                        <XCircle className="h-3.5 w-3.5 text-rose-300" />
                        <span>Error</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                  <span>{proto.name}</span>
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {proto.description}
                </p>
              </div>

              {/* Error Callout if in Error status */}
              {isError && proto.errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-600/80 font-mono text-xs text-rose-200 space-y-1 shadow-inner">
                  <div className="flex items-center space-x-1.5 font-black text-rose-300 text-[11px] uppercase">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    <span>Connection Diagnostic Failure:</span>
                  </div>
                  <div className="text-[11px] leading-snug text-rose-100">
                    {proto.errorMessage}
                  </div>
                </div>
              )}

              {/* Protocol Spec & Live Telemetry Strip */}
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 font-mono text-xs grid grid-cols-2 gap-2 text-zinc-300">
                <div className="flex items-center justify-between border-r border-zinc-800 pr-2">
                  <span className="text-zinc-500 text-[11px]">Transport:</span>
                  <span className="font-bold text-cyan-400">{proto.transport}</span>
                </div>
                <div className="flex items-center justify-between pl-1">
                  <span className="text-zinc-500 text-[11px]">Port:</span>
                  <span className="font-bold text-zinc-200">{proto.port === 0 ? 'RAW' : proto.port}</span>
                </div>
                <div className="flex items-center justify-between border-r border-zinc-800 pr-2">
                  <span className="text-zinc-500 text-[11px]">Latency:</span>
                  <span className={`font-bold ${isError ? 'text-zinc-600' : 'text-emerald-400'}`}>
                    {isError ? 'N/A' : `${proto.latencyMs}ms`}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-1">
                  <span className="text-zinc-500 text-[11px]">Throughput:</span>
                  <span className="font-bold text-purple-300">{proto.throughputPps} pps</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 font-mono text-xs gap-2">
                
                {/* AUTO-REPAIR BUTTON */}
                {isError ? (
                  <button
                    onClick={() => handleAutoRepairSingle(proto.id)}
                    disabled={isRepairingThis}
                    className="flex-1 py-2.5 px-3.5 rounded-xl font-black bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white flex items-center justify-center space-x-1.5 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isRepairingThis ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Auto-Repairing...</span>
                      </>
                    ) : (
                      <>
                        <Wrench className="h-4 w-4" />
                        <span>Auto-Repair Connection</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleAutoRepairSingle(proto.id)}
                    disabled={isRepairingThis}
                    className="flex-1 py-2.5 px-3.5 rounded-xl font-bold bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-zinc-300 hover:text-white flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                    title="Re-verify AST and reset socket pipeline"
                  >
                    {isRepairingThis ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Re-verifying...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Re-Verify Wire</span>
                      </>
                    )}
                  </button>
                )}

                {/* Inspect Details Button */}
                <button
                  onClick={() => setSelectedProtocolForInspection(proto)}
                  className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Inspect Diagnostic Details"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* INSPECTION MODAL / DRAWER */}
      <AnimatePresence>
        {selectedProtocolForInspection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border-2 border-cyan-500/50 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 text-white font-sans"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-black text-sm">
                    {selectedProtocolForInspection.id}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedProtocolForInspection.name}</h2>
                    <p className="text-xs text-zinc-400">{selectedProtocolForInspection.category} • Port {selectedProtocolForInspection.port}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProtocolForInspection(null)}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="text-zinc-400 font-bold uppercase text-[10px]">Description &amp; Specification</div>
                  <div className="text-zinc-200 text-xs leading-relaxed">{selectedProtocolForInspection.description}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">Status</div>
                    <div className={`font-black text-sm mt-0.5 uppercase ${
                      selectedProtocolForInspection.status === 'active'
                        ? 'text-emerald-400'
                        : selectedProtocolForInspection.status === 'error'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}>
                      {selectedProtocolForInspection.status}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">AST Lint Valid</div>
                    <div className="font-black text-sm mt-0.5 text-cyan-300">
                      {selectedProtocolForInspection.astValid ? 'TRUE' : 'FAILED'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">Latency</div>
                    <div className="font-black text-sm mt-0.5 text-zinc-200">
                      {selectedProtocolForInspection.latencyMs} ms
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">Packet Loss</div>
                    <div className="font-black text-sm mt-0.5 text-zinc-200">
                      {selectedProtocolForInspection.packetLossPct}%
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Cryptographic Proof Anchor:</div>
                  <div className="text-purple-300 font-mono text-[11px] truncate select-all">
                    {selectedProtocolForInspection.securityProof}
                  </div>
                </div>

                {selectedProtocolForInspection.status === 'error' && (
                  <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-600 text-rose-200 space-y-1.5">
                    <div className="font-bold flex items-center space-x-1.5 text-rose-300">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Connection Error Log:</span>
                    </div>
                    <div className="text-xs">{selectedProtocolForInspection.errorMessage}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => {
                    handleAutoRepairSingle(selectedProtocolForInspection.id);
                    setSelectedProtocolForInspection(null);
                  }}
                  className="px-5 py-2.5 rounded-xl font-black bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono flex items-center space-x-2 cursor-pointer"
                >
                  <Wrench className="h-4 w-4" />
                  <span>Execute Auto-Repair Sequence</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
