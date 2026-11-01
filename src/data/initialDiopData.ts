import { 
  ProtocolDefinition, 
  VirtualServer, 
  NetworkNode, 
  LogicalSubnet, 
  DomainOwnershipRecord, 
  DiopSession, 
  DiopAuditEvent 
} from '../types/diop';

export const initialProtocolDefinitions: ProtocolDefinition[] = [
  // ==========================================
  // VIRTUAL SERVER PROTOCOLS (VSP)
  // ==========================================
  {
    id: 'proto-vsp-server',
    identifier: 'VSP-SERVER',
    name: 'Virtual Server Lifecycle Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Defines autonomous lifecycle management, deterministic provisioning, and state encapsulation for decentralized virtual servers.',
    version: '1.4.2',
    status: 'ACTIVE',
    dependencies: ['VSP-NODE', 'VSP-RESOURCE'],
    supportedTransports: ['HTTP/HTTPS', 'TCP', 'QUIC', 'gRPC'],
    securityState: {
      tlsVersion: 'TLS 1.3 Strict',
      encryptionCipher: 'AES-256-GCM / ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 38,
      packetRateSec: 1420,
      errorRatePct: 0.001,
      avgLatencyMs: 14.2
    },
    config: {
      maxInstancesPerNode: 64,
      heartbeatTimeoutSec: 10,
      enforceIsolation: 'cgroups_v2_strict'
    },
    documentation: 'VSP-SERVER orchestrates deterministic container creation, dynamic port mapping, memory ring buffers, and crash recovery.',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-10T12:30:00Z'
  },
  {
    id: 'proto-vsp-node',
    identifier: 'VSP-NODE',
    name: 'Network Node Attestation Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Manages physical and virtual node registration, hardware attestation, and cryptographically verified proof-of-bandwidth.',
    version: '2.1.0',
    status: 'ACTIVE',
    dependencies: ['NIP-ID'],
    supportedTransports: ['QUIC', 'WireGuard', 'TCP', 'UDP'],
    securityState: {
      tlsVersion: 'TLS 1.3 / Noise_IK',
      encryptionCipher: 'ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 84,
      packetRateSec: 4280,
      errorRatePct: 0.000,
      avgLatencyMs: 9.8
    },
    config: {
      attestationIntervalMs: 5000,
      minStakeThreshold: 5000,
      slashingPenaltyPct: 5
    },
    documentation: 'Verifies node capacity, hardware integrity, and enforces stake-backed quality of service agreements across participating nodes.',
    createdAt: '2026-01-10T04:00:00Z',
    updatedAt: '2026-08-11T14:10:00Z'
  },
  {
    id: 'proto-vsp-subnet',
    identifier: 'VSP-SUBNET',
    name: 'Logical Subnet Mesh Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Enables overlay CIDR micro-segmentation, dynamic mesh route advertisement, and encrypted packet forwarding.',
    version: '1.8.0',
    status: 'ACTIVE',
    dependencies: ['NIP-ROUTE', 'VSP-NODE'],
    supportedTransports: ['WireGuard', 'UDP', 'QUIC', 'IPC'],
    securityState: {
      tlsVersion: 'TLS 1.3 / WireGuard Curve25519',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: false
    },
    telemetry: {
      activeSessions: 112,
      packetRateSec: 9240,
      errorRatePct: 0.002,
      avgLatencyMs: 11.5
    },
    config: {
      overlayMtu: 1420,
      maxHops: 8,
      routeConvergenceMs: 45
    },
    documentation: 'Provides virtual overlay networks spanning multiple physical data centers with zero central routing coordinator bottlenecks.',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-08-12T09:20:00Z'
  },
  {
    id: 'proto-vsp-host',
    identifier: 'VSP-HOST',
    name: 'Decentralized Hosting & Publishing Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Standardizes domain-to-service hosting binds, container daemon scheduling, and zero-downtime service ingress.',
    version: '2.0.4',
    status: 'ACTIVE',
    dependencies: ['VSP-SERVER', 'NIP-OWNERSHIP'],
    supportedTransports: ['HTTP/HTTPS', 'QUIC', 'WebSocket', 'TCP'],
    securityState: {
      tlsVersion: 'TLS 1.3 Automated ACME Proof',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 64,
      packetRateSec: 2840,
      errorRatePct: 0.001,
      avgLatencyMs: 16.4
    },
    config: {
      ingressRateLimit: 5000,
      autoScaleThresholdPct: 80,
      drainGracePeriodSec: 15
    },
    documentation: 'Hosts application endpoints on native vx:// domains, ensuring high availability and seamless node failover.',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-08-13T16:00:00Z'
  },
  {
    id: 'proto-vsp-subscribe',
    identifier: 'VSP-SUBSCRIBE',
    name: 'Virtual Service Ingress Subscription Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Manages consumer identity authorization, encrypted reverse tunnels, and tokenized access credentials for virtual services.',
    version: '1.3.1',
    status: 'ACTIVE',
    dependencies: ['NIP-SESSION', 'NIP-DATA'],
    supportedTransports: ['WebSocket', 'QUIC', 'HTTP/HTTPS', 'TCP'],
    securityState: {
      tlsVersion: 'TLS 1.3 / Ecdh-P384',
      encryptionCipher: 'ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 148,
      packetRateSec: 5120,
      errorRatePct: 0.000,
      avgLatencyMs: 13.0
    },
    config: {
      sessionTimeoutSec: 3600,
      maxConcurrentStreams: 256,
      compression: 'zstd_level_3'
    },
    documentation: 'Allows authorized users or edge clients to establish authenticated sessions to private and public virtual services.',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-08-12T11:45:00Z'
  },
  {
    id: 'proto-vsp-resource',
    identifier: 'VSP-RESOURCE',
    name: 'Hardware Resource Allocation & Metering Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Fine-grained dynamic allocation of vCPU cores, RAM pools, high-speed ring buffers, and network egress quotas.',
    version: '1.5.0',
    status: 'ACTIVE',
    dependencies: ['VSP-NODE'],
    supportedTransports: ['IPC', 'gRPC', 'TCP'],
    securityState: {
      tlsVersion: 'mTLS Strict Internal',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: false
    },
    telemetry: {
      activeSessions: 42,
      packetRateSec: 1800,
      errorRatePct: 0.000,
      avgLatencyMs: 4.2
    },
    config: {
      sampleRateHz: 10,
      oversubscriptionLimit: 1.2,
      quotaEnforcement: 'hard_cap_cgroup'
    },
    documentation: 'Ensures fair hardware utilization and isolates noisy neighbors across virtual nodes with sub-millisecond precision.',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-08-13T10:15:00Z'
  },
  {
    id: 'proto-vsp-telemetry',
    identifier: 'VSP-TELEMETRY',
    name: 'Real-Time Telemetry Stream Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Low-overhead UDP/WebSocket protocol streaming real-time hardware telemetry, error traces, and health pulses.',
    version: '2.0.0',
    status: 'ACTIVE',
    dependencies: ['VSP-SERVER', 'VSP-NODE'],
    supportedTransports: ['WebSocket', 'UDP', 'QUIC', 'IPC'],
    securityState: {
      tlsVersion: 'TLS 1.3 / DTLS 1.3',
      encryptionCipher: 'ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: false
    },
    telemetry: {
      activeSessions: 190,
      packetRateSec: 12400,
      errorRatePct: 0.000,
      avgLatencyMs: 5.1
    },
    config: {
      flushIntervalMs: 250,
      bufferCapacityPackets: 65536,
      dropOnCongestion: true
    },
    documentation: 'Event-driven telemetry ingestion engine feeding observability dashboards without database poll bottlenecks.',
    createdAt: '2026-02-18T14:00:00Z',
    updatedAt: '2026-08-14T01:00:00Z'
  },
  {
    id: 'proto-vsp-replication',
    identifier: 'VSP-REPLICATION',
    name: 'State Replication & Distributed Consensus Protocol',
    category: 'VIRTUAL_SERVER',
    description: 'Raft/Paxos hybrid consensus engine for multi-region state synchronization, snapshot shipping, and instant node failover.',
    version: '1.2.8',
    status: 'ACTIVE',
    dependencies: ['VSP-SERVER', 'VSP-SUBNET'],
    supportedTransports: ['TCP', 'QUIC', 'gRPC'],
    securityState: {
      tlsVersion: 'TLS 1.3 Strict Mutual Auth',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 26,
      packetRateSec: 960,
      errorRatePct: 0.001,
      avgLatencyMs: 18.7
    },
    config: {
      electionTimeoutMs: 1000,
      heartbeatIntervalMs: 150,
      quorumMinNodes: 3
    },
    documentation: 'Maintains Byzantine fault tolerant state machines across geographically distributed node instances.',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-08-11T17:20:00Z'
  },

  // ==========================================
  // NETWORK PROTOCOLS (NIP)
  // ==========================================
  {
    id: 'proto-nip-id',
    identifier: 'NIP-ID',
    name: 'Decentralized Network Identity Protocol',
    category: 'NETWORK',
    description: 'Establishes cryptographic network identities (W3C DID format) with Ed25519/Secp256k1 keypairs and zero-knowledge claim proofs.',
    version: '2.3.0',
    status: 'ACTIVE',
    dependencies: [],
    supportedTransports: ['HTTP/HTTPS', 'TCP', 'QUIC', 'WebSocket'],
    securityState: {
      tlsVersion: 'TLS 1.3 / Ed25519 Native',
      encryptionCipher: 'Ed25519 + ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 210,
      packetRateSec: 3600,
      errorRatePct: 0.000,
      avgLatencyMs: 8.4
    },
    config: {
      didPrefix: 'did:vx:',
      challengeExpirySec: 120,
      supportedKeyAlgorithms: ['Ed25519', 'Secp256k1', 'RSA-4096']
    },
    documentation: 'Cryptographic backbone providing identity attestations for users, nodes, domains, and virtual servers.',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-12T18:00:00Z'
  },
  {
    id: 'proto-nip-resolve',
    identifier: 'NIP-RESOLVE',
    name: 'Native Namespace Resolver Protocol',
    category: 'NETWORK',
    description: 'Translates native addresses (vx://domain/node/service) into verified network identities, subnets, nodes, and live service ports.',
    version: '2.0.1',
    status: 'ACTIVE',
    dependencies: ['NIP-ID', 'NIP-OWNERSHIP'],
    supportedTransports: ['QUIC', 'UDP', 'HTTP/HTTPS', 'gRPC'],
    securityState: {
      tlsVersion: 'TLS 1.3 Encrypted DNS / DoQ',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 320,
      packetRateSec: 15800,
      errorRatePct: 0.001,
      avgLatencyMs: 6.2
    },
    config: {
      cacheTtlSec: 300,
      maxRecursionDepth: 5,
      enableFallbackDns: false
    },
    documentation: 'Executes the 6-tier resolution pipeline: Domain -> Identity -> Subnet -> Node -> Virtual Server -> Service.',
    createdAt: '2026-01-12T05:00:00Z',
    updatedAt: '2026-08-13T20:30:00Z'
  },
  {
    id: 'proto-nip-discover',
    identifier: 'NIP-DISCOVER',
    name: 'Distributed Service & Node Discovery Protocol',
    category: 'NETWORK',
    description: 'Kademlia DHT-backed peer discovery for decentralized service announcements, capability matching, and proximity indexing.',
    version: '1.6.4',
    status: 'ACTIVE',
    dependencies: ['NIP-ID', 'NIP-RESOLVE'],
    supportedTransports: ['UDP', 'QUIC', 'WebSocket'],
    securityState: {
      tlsVersion: 'Noise_XX Handshake',
      encryptionCipher: 'ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 175,
      packetRateSec: 8400,
      errorRatePct: 0.002,
      avgLatencyMs: 15.6
    },
    config: {
      kBucketSize: 20,
      alphaConcurrency: 3,
      refreshIntervalMs: 30000
    },
    documentation: 'Broadcasts verified service descriptors across DHT nodes with cryptographic signature validation.',
    createdAt: '2026-01-25T11:00:00Z',
    updatedAt: '2026-08-10T19:00:00Z'
  },
  {
    id: 'proto-nip-route',
    identifier: 'NIP-ROUTE',
    name: 'Multi-Path Overlay Routing Protocol',
    category: 'NETWORK',
    description: 'Dynamically computes latency-optimal, censorship-resistant multi-path routes across overlay subnets and relay gateways.',
    version: '1.9.2',
    status: 'ACTIVE',
    dependencies: ['NIP-ID', 'VSP-SUBNET'],
    supportedTransports: ['WireGuard', 'QUIC', 'UDP', 'TCP'],
    securityState: {
      tlsVersion: 'WireGuard / TLS 1.3',
      encryptionCipher: 'ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: false
    },
    telemetry: {
      activeSessions: 160,
      packetRateSec: 11200,
      errorRatePct: 0.001,
      avgLatencyMs: 12.8
    },
    config: {
      routeMetric: 'lowest_jitter_latency',
      maxMultipathStreams: 4,
      packetReorderingWindowMs: 50
    },
    documentation: 'Routes encrypted frames across mesh overlays, automatically steering traffic around congested physical transit links.',
    createdAt: '2026-02-05T07:00:00Z',
    updatedAt: '2026-08-12T14:40:00Z'
  },
  {
    id: 'proto-nip-session',
    identifier: 'NIP-SESSION',
    name: 'End-to-End Encrypted Session Protocol',
    category: 'NETWORK',
    description: 'Establishes forward-secret cryptographic sessions between clients, nodes, and published services with bidirectional verification.',
    version: '2.2.0',
    status: 'ACTIVE',
    dependencies: ['NIP-ID', 'NIP-RESOLVE'],
    supportedTransports: ['QUIC', 'WebSocket', 'TCP', 'WireGuard'],
    securityState: {
      tlsVersion: 'Noise_IK / TLS 1.3 PSK',
      encryptionCipher: 'AES-256-GCM / ChaCha20-Poly1305',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 240,
      packetRateSec: 9800,
      errorRatePct: 0.000,
      avgLatencyMs: 10.4
    },
    config: {
      sessionRekeySeconds: 1800,
      handshakeTimeoutMs: 2000,
      ticketRenewalPolicy: 'auto_rotate'
    },
    documentation: 'Prevents session hijacking and eavesdropping using ephemeral key exchange (ECDH Curve25519) and HMAC token binding.',
    createdAt: '2026-02-12T13:00:00Z',
    updatedAt: '2026-08-14T00:15:00Z'
  },
  {
    id: 'proto-nip-data',
    identifier: 'NIP-DATA',
    name: 'Transport-Agnostic Data Framing Protocol',
    category: 'NETWORK',
    description: 'Framing, chunking, multiplexing, and binary streaming protocol operating seamlessly over HTTP, TCP, UDP, QUIC, or WebSockets.',
    version: '1.7.5',
    status: 'ACTIVE',
    dependencies: ['NIP-SESSION'],
    supportedTransports: ['HTTP/HTTPS', 'TCP', 'UDP', 'QUIC', 'WebSocket', 'IPC'],
    securityState: {
      tlsVersion: 'Application-Layer Envelope',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: false
    },
    telemetry: {
      activeSessions: 290,
      packetRateSec: 18400,
      errorRatePct: 0.001,
      avgLatencyMs: 7.9
    },
    config: {
      maxFrameSizeKB: 64,
      windowSizeMB: 16,
      flowControl: 'credit_based_backpressure'
    },
    documentation: 'Abstracts underlying physical network protocols so services communicate cleanly regardless of the transport medium.',
    createdAt: '2026-02-16T15:00:00Z',
    updatedAt: '2026-08-13T19:10:00Z'
  },
  {
    id: 'proto-nip-subscribe',
    identifier: 'NIP-SUBSCRIBE',
    name: 'Decentralized Pub/Sub Broadcast Protocol',
    category: 'NETWORK',
    description: 'High-throughput topic-based publish/subscribe message bus with gossip dissemination and cryptographic publisher proofs.',
    version: '1.4.0',
    status: 'ACTIVE',
    dependencies: ['NIP-DATA', 'NIP-ID'],
    supportedTransports: ['WebSocket', 'QUIC', 'TCP', 'IPC'],
    securityState: {
      tlsVersion: 'TLS 1.3 / Signed Messages',
      encryptionCipher: 'Ed25519 + AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 185,
      packetRateSec: 14600,
      errorRatePct: 0.000,
      avgLatencyMs: 11.2
    },
    config: {
      gossipFanout: 6,
      heartbeatIntervalMs: 1000,
      historyCacheSize: 10000
    },
    documentation: 'Allows subscribers to stream real-time events, telemetry feeds, and decentralized notifications across the network mesh.',
    createdAt: '2026-02-20T16:00:00Z',
    updatedAt: '2026-08-12T22:30:00Z'
  },
  {
    id: 'proto-nip-ownership',
    identifier: 'NIP-OWNERSHIP',
    name: 'Domain Ownership & Cryptographic Verification Protocol',
    category: 'NETWORK',
    description: 'Enforces non-custodial domain registration, signature challenge proofs, ownership transfers, and granular access delegation.',
    version: '2.4.1',
    status: 'ACTIVE',
    dependencies: ['NIP-ID'],
    supportedTransports: ['HTTP/HTTPS', 'QUIC', 'gRPC'],
    securityState: {
      tlsVersion: 'ECDSA Secp256k1 / Ed25519 Strict',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 95,
      packetRateSec: 1650,
      errorRatePct: 0.000,
      avgLatencyMs: 8.9
    },
    config: {
      challengeNonceTtlSec: 300,
      signatureAlgorithms: ['Ed25519', 'EIP-712', 'Secp256k1'],
      enforceStrictSignatureVerification: true
    },
    documentation: 'Backbone of decentralized Internet ownership ensuring only cryptographic key holders can modify or route domains.',
    createdAt: '2026-01-08T03:00:00Z',
    updatedAt: '2026-08-14T00:40:00Z'
  },
  {
    id: 'proto-nip-governance',
    identifier: 'NIP-GOVERNANCE',
    name: 'Network Governance & Protocol Upgrade Protocol',
    category: 'NETWORK',
    description: 'On-chain/distributed voting, parameter updates, protocol version transitions, and node slashing governance rules.',
    version: '1.1.0',
    status: 'ACTIVE',
    dependencies: ['NIP-ID', 'NIP-OWNERSHIP'],
    supportedTransports: ['HTTP/HTTPS', 'QUIC', 'gRPC'],
    securityState: {
      tlsVersion: 'TLS 1.3 / Multi-Sig Proofs',
      encryptionCipher: 'AES-256-GCM',
      replayProtection: true,
      zeroKnowledgeProof: true
    },
    telemetry: {
      activeSessions: 32,
      packetRateSec: 420,
      errorRatePct: 0.000,
      avgLatencyMs: 14.8
    },
    config: {
      votingPeriodHours: 72,
      quorumPercentage: 66.7,
      timelockDelayHours: 24
    },
    documentation: 'Coordinates decentralized protocol lifecycle progression: Create -> Validate -> Register -> Activate -> Monitor -> Update -> Disable -> Archive.',
    createdAt: '2026-02-28T18:00:00Z',
    updatedAt: '2026-08-13T12:00:00Z'
  }
];

export const initialLogicalSubnets: LogicalSubnet[] = [
  {
    id: 'subnet-us-east-1',
    name: 'VOX-East-Core-Subnet',
    cidr: '10.240.0.0/16',
    overlayScheme: 'VX-Overlay-Mesh-v3',
    encryptionMode: 'ChaCha20-Poly1305 / Noise_XX',
    totalNodes: 4,
    activeServers: 6,
    accessPolicy: 'PUBLIC',
    governanceRule: 'Consensus-66% Majority Threshold',
    bandwidthCapGbps: 100,
    status: 'ACTIVE'
  },
  {
    id: 'subnet-eu-central-1',
    name: 'VOX-Euro-Edge-Subnet',
    cidr: '10.241.0.0/16',
    overlayScheme: 'VX-Overlay-Mesh-v3',
    encryptionMode: 'AES-256-GCM / WireGuard',
    totalNodes: 3,
    activeServers: 4,
    accessPolicy: 'PERMISSIONED_CONSORTIUM',
    governanceRule: 'Multi-Sig 3/5 Validator Board',
    bandwidthCapGbps: 80,
    status: 'ACTIVE'
  },
  {
    id: 'subnet-asia-south-1',
    name: 'VOX-Asia-Pac-Subnet',
    cidr: '10.242.0.0/16',
    overlayScheme: 'VX-Overlay-Mesh-v3',
    encryptionMode: 'ChaCha20-Poly1305 / WireGuard',
    totalNodes: 2,
    activeServers: 3,
    accessPolicy: 'PUBLIC',
    governanceRule: 'Stake-Weighted Node Delegation',
    bandwidthCapGbps: 50,
    status: 'ACTIVE'
  }
];

export const initialNetworkNodes: NetworkNode[] = [
  {
    id: 'node-alpha-gateway',
    name: 'Alpha-Edge-Gateway-01',
    ipAddress: '10.142.0.12',
    port: 8080,
    subnetId: 'subnet-us-east-1',
    subnetName: 'VOX-East-Core-Subnet',
    region: 'us-east (N. Virginia)',
    status: 'ONLINE',
    hardwareSpecs: {
      cpuCores: 16,
      totalRamGB: 64,
      diskType: 'NVMe Gen4 PCIe SSD',
      nicSpeedGbps: 25
    },
    healthScore: 99,
    latencyMs: 8.4,
    packetLossPct: 0.000,
    attachedServersCount: 3,
    governanceStakeTokens: 125000,
    validatorKey: 'val_ed25519_89a42a9b3112028cef81',
    createdAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'node-vector-store',
    name: 'Neural-Vector-Store-02',
    ipAddress: '10.142.0.45',
    port: 6379,
    subnetId: 'subnet-us-east-1',
    subnetName: 'VOX-East-Core-Subnet',
    region: 'us-east (N. Virginia)',
    status: 'ONLINE',
    hardwareSpecs: {
      cpuCores: 32,
      totalRamGB: 128,
      diskType: 'Dual NVMe U.2 Array',
      nicSpeedGbps: 50
    },
    healthScore: 98,
    latencyMs: 11.2,
    packetLossPct: 0.001,
    attachedServersCount: 2,
    governanceStakeTokens: 84200,
    validatorKey: 'val_ed25519_3b9c02d18471ea284094',
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'node-worker-03',
    name: 'Automation-Script-Worker-03',
    ipAddress: '10.142.1.88',
    port: 3001,
    subnetId: 'subnet-eu-central-1',
    subnetName: 'VOX-Euro-Edge-Subnet',
    region: 'eu-central (Frankfurt)',
    status: 'SYNCED',
    hardwareSpecs: {
      cpuCores: 16,
      totalRamGB: 32,
      diskType: 'NVMe SSD',
      nicSpeedGbps: 20
    },
    healthScore: 97,
    latencyMs: 18.5,
    packetLossPct: 0.000,
    attachedServersCount: 2,
    governanceStakeTokens: 48900,
    validatorKey: 'val_ed25519_91d03e87b11c0a947388',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'node-depo-harvester',
    name: 'VOX-Tubers-Dedicated-Node-101',
    ipAddress: '10.142.4.88',
    port: 8088,
    subnetId: 'subnet-asia-south-1',
    subnetName: 'VOX-Asia-Pac-Subnet',
    region: 'asia-south (Singapore)',
    status: 'ONLINE',
    hardwareSpecs: {
      cpuCores: 16,
      totalRamGB: 64,
      diskType: 'Direct Fiber NVMe Cluster',
      nicSpeedGbps: 50
    },
    healthScore: 100,
    latencyMs: 14.1,
    packetLossPct: 0.000,
    attachedServersCount: 2,
    governanceStakeTokens: 165000,
    validatorKey: 'val_ed25519_12e9918a0b437c182a9d',
    createdAt: '2026-02-10T00:00:00Z'
  }
];

export const initialVirtualServers: VirtualServer[] = [
  {
    id: 'vsrv-core-gateway',
    name: 'VOX-Alpha-Edge-Gateway',
    domainBinding: 'vx://core.mesh/gateway',
    nodeAttachmentId: 'node-alpha-gateway',
    nodeName: 'Alpha-Edge-Gateway-01',
    subnetId: 'subnet-us-east-1',
    subnetName: 'VOX-East-Core-Subnet',
    vCpu: 8,
    ramMB: 16384,
    storageGB: 250,
    bandwidthMbps: 5000,
    ringBufferKB: 4096,
    status: 'ONLINE',
    publishedServices: [
      {
        id: 'svc-reverse-proxy',
        name: 'Nginx TLS Gateway Proxy',
        scheme: 'service',
        endpoint: '/v1/gateway',
        port: 8080,
        protocolId: 'VSP-SERVER',
        transport: 'HTTP/HTTPS',
        authRequired: true,
        rateLimitReqSec: 2500,
        activeSubscribers: 142,
        status: 'ONLINE'
      },
      {
        id: 'svc-wireguard-relay',
        name: 'WireGuard Mesh Relay Tunnel',
        scheme: 'tunnel',
        endpoint: '/mesh/tunnel',
        port: 51820,
        protocolId: 'VSP-SUBNET',
        transport: 'WireGuard',
        authRequired: true,
        rateLimitReqSec: 5000,
        activeSubscribers: 88,
        status: 'ONLINE'
      }
    ],
    replicationFactor: 3,
    osEngine: 'Alpine Linux 3.20 (x86_64)',
    cpuUsagePct: 22.4,
    ramUsageMB: 4820,
    latencyMs: 8.5,
    uptimeSeconds: 864200,
    createdAt: '2026-01-12T00:00:00Z',
    lastHeartbeat: new Date().toISOString()
  },
  {
    id: 'vsrv-neural-store',
    name: 'VOX-Neural-Vector-Store',
    domainBinding: 'vx://neural.ai/embeddings',
    nodeAttachmentId: 'node-vector-store',
    nodeName: 'Neural-Vector-Store-02',
    subnetId: 'subnet-us-east-1',
    subnetName: 'VOX-East-Core-Subnet',
    vCpu: 16,
    ramMB: 65536,
    storageGB: 1000,
    bandwidthMbps: 10000,
    ringBufferKB: 8192,
    status: 'ONLINE',
    publishedServices: [
      {
        id: 'svc-qdrant-vector',
        name: 'Qdrant Vector Embedding Search',
        scheme: 'vector',
        endpoint: '/v2/vectors/query',
        port: 6333,
        protocolId: 'NIP-DATA',
        transport: 'gRPC',
        authRequired: true,
        rateLimitReqSec: 1200,
        activeSubscribers: 64,
        status: 'ONLINE'
      },
      {
        id: 'svc-redis-cache',
        name: 'Redis High-Speed Memory Ring',
        scheme: 'cache',
        endpoint: '/cache/keyval',
        port: 6379,
        protocolId: 'VSP-RESOURCE',
        transport: 'TCP',
        authRequired: true,
        rateLimitReqSec: 10000,
        activeSubscribers: 95,
        status: 'ONLINE'
      }
    ],
    replicationFactor: 2,
    osEngine: 'Ubuntu 24.04 LTS (Optimized Kernel)',
    cpuUsagePct: 34.8,
    ramUsageMB: 28400,
    latencyMs: 11.2,
    uptimeSeconds: 742000,
    createdAt: '2026-01-18T00:00:00Z',
    lastHeartbeat: new Date().toISOString()
  },
  {
    id: 'vsrv-script-worker',
    name: 'Automation-Script-Worker',
    domainBinding: 'vx://automate.ops/injunctions',
    nodeAttachmentId: 'node-worker-03',
    nodeName: 'Automation-Script-Worker-03',
    subnetId: 'subnet-eu-central-1',
    subnetName: 'VOX-Euro-Edge-Subnet',
    vCpu: 8,
    ramMB: 16384,
    storageGB: 500,
    bandwidthMbps: 2500,
    ringBufferKB: 2048,
    status: 'ONLINE',
    publishedServices: [
      {
        id: 'svc-injunction-engine',
        name: 'Autonomous Code Injunction Engine',
        scheme: 'injunction',
        endpoint: '/api/injunctions/dispatch',
        port: 3001,
        protocolId: 'VSP-SERVER',
        transport: 'HTTP/HTTPS',
        authRequired: true,
        rateLimitReqSec: 500,
        activeSubscribers: 32,
        status: 'ONLINE'
      }
    ],
    replicationFactor: 2,
    osEngine: 'Debian 12 Bookworm',
    cpuUsagePct: 15.2,
    ramUsageMB: 3100,
    latencyMs: 18.5,
    uptimeSeconds: 412000,
    createdAt: '2026-02-05T00:00:00Z',
    lastHeartbeat: new Date().toISOString()
  }
];

export const initialDomainOwnershipRecords: DomainOwnershipRecord[] = [
  {
    domain: 'vx://core.mesh/gateway',
    networkIdentity: 'did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    ownerIdentity: 'operator@vox.network',
    ownerPublicKey: '0x0489a42a9b3112028cef8109d4310e39a20b3c8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732',
    signatureProof: '0x3a90f1e884c90123efd89001345ab890de23f0101aceb66217a0d3c8091f2b47e610a887b9e3420df67d8001345ab890de23f0101aceb66211b',
    domainStatus: 'ACTIVE',
    associatedSubnetId: 'subnet-us-east-1',
    associatedSubnetName: 'VOX-East-Core-Subnet',
    hostingNodeId: 'node-alpha-gateway',
    hostingNodeName: 'Alpha-Edge-Gateway-01',
    virtualServerId: 'vsrv-core-gateway',
    virtualServerName: 'VOX-Alpha-Edge-Gateway',
    publishedServices: initialVirtualServers[0].publishedServices,
    accessPolicy: 'PUBLIC_OPEN',
    telemetryState: {
      telemetryActive: true,
      pingIntervalSec: 5,
      anomalyDetection: true,
      streamThroughputKbps: 4820,
      lastVerifiedAt: new Date().toISOString()
    },
    creationTimestamp: '2026-01-12T00:00:00Z',
    lastActivity: new Date().toISOString(),
    ownershipVerificationStatus: 'CRYPTOGRAPHICALLY_VERIFIED'
  },
  {
    domain: 'vx://neural.ai/embeddings',
    networkIdentity: 'did:vx:secp256k1:0x3B9c02d18471eA284094C991f851A07b538f9021',
    ownerIdentity: 'drvictoragboola@gmail.com',
    ownerPublicKey: '0x043b9c02d18471ea284094c991f851a07b538f90217a0d3c8091f2b47e610a887b9e3420df67d8001345ab890de23f0101aceb6621',
    signatureProof: '0x7e889012a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d71234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1c',
    domainStatus: 'ACTIVE',
    associatedSubnetId: 'subnet-us-east-1',
    associatedSubnetName: 'VOX-East-Core-Subnet',
    hostingNodeId: 'node-vector-store',
    hostingNodeName: 'Neural-Vector-Store-02',
    virtualServerId: 'vsrv-neural-store',
    virtualServerName: 'VOX-Neural-Vector-Store',
    publishedServices: initialVirtualServers[1].publishedServices,
    accessPolicy: 'TOKEN_GATED',
    telemetryState: {
      telemetryActive: true,
      pingIntervalSec: 5,
      anomalyDetection: true,
      streamThroughputKbps: 9400,
      lastVerifiedAt: new Date().toISOString()
    },
    creationTimestamp: '2026-01-18T00:00:00Z',
    lastActivity: new Date().toISOString(),
    ownershipVerificationStatus: 'CRYPTOGRAPHICALLY_VERIFIED'
  },
  {
    domain: 'vx://automate.ops/injunctions',
    networkIdentity: 'did:vx:ed25519:0x91D03e87B11c0A947388C8058E3d15409d22B812',
    ownerIdentity: 'operator@vox.network',
    ownerPublicKey: '0x0491d03e87b11c0a947388c8058e3d15409d22b8128f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732',
    signatureProof: '0x5b1289c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a81234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b',
    domainStatus: 'ACTIVE',
    associatedSubnetId: 'subnet-eu-central-1',
    associatedSubnetName: 'VOX-Euro-Edge-Subnet',
    hostingNodeId: 'node-worker-03',
    hostingNodeName: 'Automation-Script-Worker-03',
    virtualServerId: 'vsrv-script-worker',
    virtualServerName: 'Automation-Script-Worker',
    publishedServices: initialVirtualServers[2].publishedServices,
    accessPolicy: 'SIGNATURE_CHALLENGE',
    telemetryState: {
      telemetryActive: true,
      pingIntervalSec: 10,
      anomalyDetection: true,
      streamThroughputKbps: 1850,
      lastVerifiedAt: new Date().toISOString()
    },
    creationTimestamp: '2026-02-05T00:00:00Z',
    lastActivity: new Date().toISOString(),
    ownershipVerificationStatus: 'CRYPTOGRAPHICALLY_VERIFIED'
  }
];

export const initialDiopSessions: DiopSession[] = [
  {
    sessionId: 'sess-vx-9901',
    clientIdentity: 'did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    domain: 'vx://core.mesh/gateway',
    targetService: 'Nginx TLS Gateway Proxy',
    transport: 'HTTP/HTTPS',
    establishedAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    packetsExchanged: 14280,
    bytesTransferred: 48920000,
    securityLevel: 'TLS 1.3 / ChaCha20-Poly1305 (Forward Secret)',
    sessionToken: 'tok_vx_sess_9901_ed25519_proof',
    status: 'ACTIVE'
  },
  {
    sessionId: 'sess-vx-9902',
    clientIdentity: 'did:vx:secp256k1:0x3B9c02d18471eA284094C991f851A07b538f9021',
    domain: 'vx://neural.ai/embeddings',
    targetService: 'Qdrant Vector Embedding Search',
    transport: 'gRPC',
    establishedAt: new Date(Date.now() - 1800000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    packetsExchanged: 38400,
    bytesTransferred: 124800000,
    securityLevel: 'mTLS Strict / AES-256-GCM',
    sessionToken: 'tok_vx_sess_9902_secp256k1_proof',
    status: 'ACTIVE'
  }
];

export const initialDiopAuditLogs: DiopAuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    actor: 'operator@vox.network',
    action: 'REGISTER_DOMAIN',
    targetType: 'DOMAIN',
    targetId: 'vx://core.mesh/gateway',
    status: 'SUCCESS',
    details: 'Registered domain with cryptographic Secp256k1 signature challenge proof verified.',
    signatureProof: 'sig_ed25519_9941a'
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    actor: 'drvictoragboola@gmail.com',
    action: 'PUBLISH_SERVICE',
    targetType: 'SERVICE',
    targetId: 'svc-qdrant-vector',
    status: 'SUCCESS',
    details: 'Published gRPC vector search endpoint on Neural-Vector-Store (10.142.0.45:6333).',
    signatureProof: 'sig_ed25519_8812b'
  },
  {
    id: 'audit-003',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actor: 'system-governance-engine',
    action: 'ACTIVATE_PROTOCOL',
    targetType: 'PROTOCOL',
    targetId: 'VSP-TELEMETRY',
    status: 'SUCCESS',
    details: 'Transitioned VSP-TELEMETRY v2.0.0 to ACTIVE status across 4 nodes and 3 subnets.',
    signatureProof: 'sig_ed25519_7734c'
  },
  {
    id: 'audit-004',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    actor: 'operator@vox.network',
    action: 'CREATE_SESSION',
    targetType: 'SESSION',
    targetId: 'sess-vx-9901',
    status: 'SUCCESS',
    details: 'Established forward-secret QUIC session to vx://core.mesh/gateway with zero packet drops.',
    signatureProof: 'sig_ed25519_6621d'
  }
];
