/**
 * Virtual Internet Protocol (VIP) Platform - Type Definitions
 * 
 * Target Architecture:
 * User → Virtual Identity → Network → Subnet → Node → Server → Domain → Service
 * 
 * Protocol Groups:
 * 1. Virtual Server Protocols (VSP): Virtual Network, Node, Server, Subnet, Domain, Service, Storage, Discovery, Routing, Telemetry
 * 2. Network Protocols (NIP): Virtual Addressing (vnet://), Identity, Packet, Messaging, Discovery, Routing, Service, Registry, Trust, Security
 * 
 * Underlying Transports: TCP, UDP, QUIC, WebSocket, WebRTC, HTTPS
 */

export type VIPTransportAdapter = 'TCP' | 'UDP' | 'QUIC' | 'WebSocket' | 'WebRTC' | 'HTTPS';

export type VIPProtocolGroup = 'VSP' | 'NIP';

export type VIPCipher = 'ChaCha20-Poly1305' | 'AES-256-GCM' | 'Curve25519-ECDH' | 'None';
export type VIPConsensusType = 'PROOF_OF_AUTHORITY' | 'PROOF_OF_BANDWIDTH' | 'BYZANTINE_FAULT_TOLERANT';

export type VSPProtocolId =
  | 'VSP-NET'       // Virtual Network Protocol
  | 'VSP-NODE'      // Node Protocol
  | 'VSP-SERVER'    // Server Protocol
  | 'VSP-SUBNET'    // Subnet Protocol
  | 'VSP-DOMAIN'    // Domain Protocol
  | 'VSP-SERVICE'   // Service Protocol
  | 'VSP-STORAGE'   // Storage Protocol
  | 'VSP-DISCOVERY' // Discovery Protocol
  | 'VSP-ROUTING'   // Routing Protocol
  | 'VSP-TELEMETRY';// Telemetry Protocol

export type NIPProtocolId =
  | 'NIP-ADDRESSING' // Virtual Addressing (vnet://) Protocol
  | 'NIP-IDENTITY'   // Identity Protocol
  | 'NIP-PACKET'     // Packet Protocol (VirtualPacket)
  | 'NIP-MESSAGING'  // Messaging Protocol
  | 'NIP-DISCOVERY'  // Discovery Protocol
  | 'NIP-ROUTING'    // Routing Protocol
  | 'NIP-SERVICE'    // Service Protocol
  | 'NIP-REGISTRY'   // Registry Protocol
  | 'NIP-TRUST'      // Trust Protocol
  | 'NIP-SECURITY';  // Security Protocol

export type ProtocolLifecycleStatus = 'DRAFT' | 'SPECIFIED' | 'VALIDATING' | 'ACTIVE' | 'UPDATING' | 'DEPRECATED';

// ============================================================================
// 1. PROTOCOL SPECIFICATION & SCHEMA
// ============================================================================

export interface VIPProtocolDefinition {
  id: string; // e.g. "VSP-NET", "NIP-PACKET"
  code: VSPProtocolId | NIPProtocolId;
  name: string;
  rfcNumber: string; // e.g. "RFC-VSP-001"
  group: VIPProtocolGroup;
  version: string;
  description: string;
  status: ProtocolLifecycleStatus;
  primaryTransport: VIPTransportAdapter;
  supportedTransports: VIPTransportAdapter[];
  headerMagic: string;
  portDefault: number;
  schemaVersion: string;
  schemaDefinition: Record<string, any>;
  securityRequirements: {
    minTlsVersion: string;
    encryptionAlgorithm: 'ChaCha20-Poly1305' | 'AES-256-GCM' | 'Curve25519-ECDH' | 'None';
    signatureAlgorithm: 'Ed25519' | 'Secp256k1' | 'BLS12-381';
    replayProtection: boolean;
    tamperEvidentTelemetry: boolean;
    zeroKnowledgeProofSupported: boolean;
  };
  metrics: {
    activeSessions: number;
    packetThroughputSec: number;
    avgLatencyMs: number;
    errorRatePct: number;
    bytesTransferredTotal: number;
  };
  documentation: string;
  codeSnippet: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 2. VIRTUAL PACKET WIRE PROTOCOL (NIP-PACKET)
// ============================================================================

export interface VirtualPacketHeader {
  magic: number; // 0x56495031 (ASCII "VIP1")
  version: string; // "1.0.0"
  packetId: string; // UUID v4 or 128-bit hex
  sourceUri: string; // "vnet://network/subnet/node/service" or "vnet://user@identity/..."
  destinationUri: string; // "vnet://domain.vox/service" or "vnet://..."
  sourceIdentity: string; // "did:vip:ed25519:0x..."
  destinationIdentity: string; // "did:vip:ed25519:0x..."
  protocolGroup: VIPProtocolGroup;
  protocolId: VSPProtocolId | NIPProtocolId | string;
  payloadType: 'json' | 'binary' | 'rpc_request' | 'rpc_response' | 'heartbeat' | 'stream_chunk' | 'discovery_beacon' | 'handshake';
  payloadHash: string; // SHA-256 or BLAKE3 hash of payload
  ttl: number; // Time-to-live hop count (default: 64)
  hopCount: number; // Incremented at each node
  routePath: string[]; // Node IDs traversed
  timestamp: string;
  flags: {
    encrypted: boolean;
    signed: boolean;
    requiresAck: boolean;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
    fragmented?: boolean;
    fragmentIndex?: number;
    totalFragments?: number;
  };
}

export interface VirtualPacketSecurity {
  signature: string; // Ed25519 or Secp256k1 signature over header + payloadHash
  signerPublicKey: string;
  encryptionEnvelope?: {
    algorithm: 'ChaCha20-Poly1305' | 'AES-256-GCM';
    ephemeralPublicKey?: string;
    nonce?: string;
    authTag?: string;
  };
  delegationProof?: {
    capabilityToken: string;
    delegatorIdentity: string;
    scope: string[];
    expiresAt: string;
    delegatorSignature: string;
  };
}

export interface VirtualPacket {
  header: VirtualPacketHeader;
  security: VirtualPacketSecurity;
  payload: any;
  transportMetadata?: {
    underlyingTransport: VIPTransportAdapter;
    physicalSourceIp?: string;
    physicalDestIp?: string;
    physicalPort?: number;
    rttMs?: number;
  };
}

export interface VirtualPacketReceipt {
  packetId: string;
  status: 'DELIVERED' | 'ROUTED' | 'DROPPED' | 'REJECTED' | 'ACKNOWLEDGED';
  latencyMs: number;
  hopsTraversed: number;
  routePath: string[];
  ackSignature?: string;
  timestamp: string;
  destinationResponse?: any;
}

// ============================================================================
// 3. TARGET ARCHITECTURE: HIERARCHY ENTITIES
// User → Virtual Identity → Network → Subnet → Node → Server → Domain → Service
// ============================================================================

export interface VIPUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'network_operator' | 'service_developer' | 'auditor' | 'guest';
  primaryIdentityDid: string;
  associatedNetworks: string[];
  createdAt: string;
}

export interface VirtualIdentity {
  did: string; // e.g. "did:vip:ed25519:7F2e89A42a9b3112028Cef8109d4310E39A20b3C"
  algorithm: 'Ed25519' | 'Secp256k1' | 'Curve25519';
  publicKey: string;
  privateKeyMasked: string; // "ed25519:priv:••••••••••••••••"
  ownerUserId: string;
  alias: string; // e.g. "Alpha Sovereign Gateway Anchor"
  reputationScore: number; // 0 - 100
  trustLevel: 'SOVEREIGN_ROOT' | 'VERIFIED_OPERATOR' | 'STANDARD_PEER' | 'PROVISIONAL';
  delegatedCapabilities: VIPCapabilityGrant[];
  attestationProofs: string[];
  createdAt: string;
  lastActive: string;
}

export interface VIPCapabilityGrant {
  id: string;
  issuerDid: string;
  granteeDid: string;
  resourceUri: string; // e.g. "vnet://mesh-primary/*"
  permissions: Array<'READ' | 'WRITE' | 'ROUTE' | 'EXECUTE' | 'DELEGATE' | 'ADMIN'>;
  issuedAt: string;
  expiresAt: string;
  signature: string;
  revoked: boolean;
}

export type VIPDelegatedCapability = VIPCapabilityGrant;

export interface VirtualNetwork {
  id: string; // e.g. "vnet-mesh-primary"
  vnetUri: string; // e.g. "vnet://mesh-primary"
  name: string;
  ownerIdentityDid: string;
  ownerName?: string;
  ownerUserId?: string;
  description: string;
  cidrBlock: string; // e.g. "10.240.0.0/12"
  overlayProtocol: 'VIP-Overlay-v1' | 'VIP-Mesh-Zero' | 'VIP-Noise-Encrypted' | string;
  defaultTransport: VIPTransportAdapter;
  status?: 'ACTIVE' | 'PROVISIONING' | 'DEGRADED' | 'MAINTENANCE' | 'OFFLINE';
  encryptionCipher: 'ChaCha20-Poly1305' | 'AES-256-GCM' | string;
  accessPolicy: 'PUBLIC_OPEN' | 'PERMISSIONED_CONSORTIUM' | 'TOKEN_GATED' | 'PRIVATE_ISOLATED' | 'SOVEREIGN_OPEN' | string;
  consensusMechanism: 'PROOF_OF_AUTHORITY' | 'PROOF_OF_BANDWIDTH' | 'BYZANTINE_FAULT_TOLERANT' | string;
  subnetsCount?: number;
  nodesCount?: number;
  serversCount?: number;
  servicesCount?: number;
  totalPacketsProcessed?: number;
  bandwidthMbpsCapacity?: number;
  avgLatencyMs?: number;
  healthScorePct?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VIPSubnet {
  id: string; // e.g. "vsub-eu-central"
  networkId: string;
  vnetUri: string; // e.g. "vnet://mesh-primary/sub-eu-central"
  name: string;
  cidr: string; // e.g. "10.240.10.0/24"
  region: string; // e.g. "eu-central-1"
  overlayMtu: number; // e.g. 1420
  status: 'ONLINE' | 'CONGESTED' | 'ISOLATED' | 'OFFLINE';
  encryptionState: 'ENABLED_NOISE_IK' | 'ENABLED_CHACHA20' | 'TLS_1_3_STRICT';
  assignedNodes: string[];
  gatewayNodeId: string;
  routingTableEntriesCount: number;
  bandwidthUtilizationPct: number;
  packetLossPct: number;
  createdAt: string;
}

export interface VIPNode {
  id: string; // e.g. "vnode-fra-01"
  networkId: string;
  subnetId: string;
  vnetUri: string; // e.g. "vnet://mesh-primary/sub-eu-central/vnode-fra-01"
  name: string;
  nodeIdentityDid: string;
  physicalTransportBinding: {
    ipAddress: string;
    port: number;
    protocol: VIPTransportAdapter;
    publicDns?: string;
  };
  role: 'EDGE_ROUTER' | 'COMPUTE_HOST' | 'STORAGE_RELAY' | 'CONSENSUS_VALIDATOR' | 'GATEWAY';
  status: 'ONLINE' | 'SYNCED' | 'HIGH_LOAD' | 'MAINTENANCE' | 'OFFLINE';
  hardwareSpecs: {
    cpuCores: number;
    totalRamGB: number;
    diskType: string;
    nicSpeedGbps: number;
  };
  resourceUsage: {
    cpuPct: number;
    ramPct: number;
    diskPct: number;
    networkRxMbps: number;
    networkTxMbps: number;
  };
  healthScore: number;
  latencyToGatewayMs: number;
  attachedServersCount: number;
  createdAt: string;
}

export interface VIPServer {
  id: string; // e.g. "vsrv-neural-gateway"
  networkId?: string;
  subnetId?: string;
  nodeId: string;
  vnetUri?: string; // e.g. "vnet://mesh-primary/sub-eu-central/vnode-fra-01/vsrv-neural"
  name: string;
  domainBindingUri: string; // e.g. "vnet://neural.edge/compute"
  serverIdentityDid?: string;
  osEngine: string;
  vCpu: number;
  ramMB: number;
  storageGB: number;
  status: 'ONLINE' | 'ACTIVE' | 'RESTARTING' | 'DRAINING' | 'OFFLINE';
  publishedServices?: VIPPublishedService[];
  uptimeSeconds: number;
  cpuUsagePct: number;
  ramUsageMB: number;
  replicationFactor: number;
  networkTxMbps?: number;
  networkRxMbps?: number;
  servicesCount?: number;
  createdAt: string;
  lastHeartbeat?: string;
}

export interface VIPDomainRecord {
  id: string;
  domain: string; // e.g. "neural.edge" or "mesh.vox"
  vnetAddress: string; // e.g. "vnet://neural.edge"
  ownerIdentityDid: string;
  ownerName: string;
  targetNetworkId?: string;
  targetSubnetId?: string;
  targetNodeId?: string;
  targetServerId: string;
  status: 'ACTIVE' | 'VERIFIED' | 'REVOKED' | 'PENDING_CHALLENGE' | 'DELEGATED';
  zoneRecords: Array<{
    type: 'VIP_A' | 'VIP_SRV' | 'VIP_TXT' | 'VIP_DID' | 'VIP_ROUTE' | string;
    name: string;
    value: string;
    ttlSec: number;
  }>;
  dnssecProof: string;
  signatureProof?: string;
  accessPolicy: 'PUBLIC_OPEN' | 'TOKEN_GATED' | 'SIGNATURE_CHALLENGE' | 'WHITELIST_ONLY' | 'SOVEREIGN_OPEN' | 'PRIVATE_ISOLATED' | string;
  trafficQueries24h: number;
  createdAt: string;
  expiresAt: string;
}

export interface VIPPublishedService {
  id: string; // e.g. "vsvc-inference-rpc"
  serverId: string;
  serverName: string;
  nodeId: string;
  domain: string; // e.g. "neural.edge"
  serviceName: string; // e.g. "inference"
  vnetUri: string; // e.g. "vnet://neural.edge/inference"
  protocolId: VSPProtocolId | NIPProtocolId | string; // e.g. "VSP-SERVICE" | "NIP-MESSAGING"
  transport: VIPTransportAdapter;
  port: number;
  endpointPath: string; // e.g. "/v1/predict"
  status: 'ONLINE' | 'ACTIVE' | 'DEGRADED' | 'PAUSED' | 'OFFLINE';
  authRequired: boolean;
  rateLimitReqSec: number;
  activeSubscribers: number;
  avgLatencyMs: number;
  metrics: {
    totalRequests: number;
    errorCount: number;
    bandwidthKbps: number;
  };
  metadata?: Record<string, string>;
  createdAt: string;
}

// ============================================================================
// 4. ROUTING & TOPOLOGY ENGINE
// ============================================================================

export interface VIPRouteLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  transport: VIPTransportAdapter;
  latencyMs: number;
  bandwidthMbps: number;
  reliabilityPct: number;
  costWeight: number;
  isEncrypted: boolean;
  status: 'ACTIVE' | 'DEGRADED' | 'DOWN';
}

export interface VIPRoutePath {
  sourceUri: string;
  destinationUri: string;
  hopNodes: Array<{
    nodeId: string;
    nodeName: string;
    transport: VIPTransportAdapter;
    latencyMs: number;
    healthScore: number;
  }>;
  totalHops: number;
  estimatedLatencyMs: number;
  routeScore: number;
  failoverPathAvailable: boolean;
}

export interface VIPAddressResolution {
  rawUri: string; // "vnet://neural.edge/inference"
  parsed: {
    scheme: 'vnet';
    domainOrNetwork: string;
    subnet?: string;
    node?: string;
    server?: string;
    service?: string;
    pathParams?: string;
  };
  resolved: boolean;
  resolutionPipeline: {
    layer1_user: { userId: string; role: string; status: 'VERIFIED' | 'FAILED'; latencyMs: number };
    layer2_identity: { did: string; algorithm: string; status: 'VERIFIED' | 'FAILED'; latencyMs: number };
    layer3_network: { networkId: string; vnetUri: string; status: 'LOCATED' | 'FAILED'; latencyMs: number };
    layer4_subnet: { subnetId: string; cidr: string; status: 'ROUTED' | 'FAILED'; latencyMs: number };
    layer5_node: { nodeId: string; physicalIp: string; transport: VIPTransportAdapter; status: 'BOUND' | 'FAILED'; latencyMs: number };
    layer6_server: { serverId: string; status: 'RUNNING' | 'FAILED'; latencyMs: number };
    layer7_domain: { domain: string; zoneStatus: 'RESOLVED' | 'FAILED'; latencyMs: number };
    layer8_service: { serviceId: string; endpoint: string; port: number; status: 'BOUND' | 'FAILED'; latencyMs: number };
  };
  totalResolutionTimeMs: number;
  cryptographicProof: string;
  cacheTtlSec: number;
}

// ============================================================================
// 5. TAMPER-EVIDENT TELEMETRY & MERKLE AUDIT CHAIN
// ============================================================================

export interface VIPTelemetryEntry {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  networkId: string;
  nodeId: string;
  protocolId: string;
  metricType: 'PACKET_INSPECTION' | 'LATENCY_SAMPLE' | 'ROUTE_FAILOVER' | 'SECURITY_CHALLENGE' | 'SERVICE_INVOCATION' | 'ANOMALY_DETECTED';
  metrics: {
    latencyMs?: number;
    packetCount?: number;
    bytes?: number;
    errorRate?: number;
    cpuPct?: number;
    ramPct?: number;
  };
  details: string;
  previousHash: string;
  entryHash: string;
  merkleRoot: string;
  validatorSignature: string;
  isTamperEvident: boolean;
}

export interface VIPTelemetrySummary {
  overallHealthScore: number;
  activeNetworksCount: number;
  onlineNodesCount: number;
  activeServersCount: number;
  liveServicesCount: number;
  currentThroughputPacketsSec: number;
  avgMeshLatencyMs: number;
  overallPacketLossPct: number;
  totalTamperEvidentBlocks: number;
  cryptographicIntegrityStatus: 'VERIFIED_CHAIN_INTACT' | 'AUDIT_IN_PROGRESS' | 'ANOMALY_FLAGGED';
}

// ============================================================================
// 6. ISOLATED PROTOCOL / NETWORK SANDBOX
// ============================================================================

export interface VIPProtocolSandboxTest {
  id: string;
  name: string;
  description: string;
  targetProtocol: VSPProtocolId | NIPProtocolId | string;
  testCategory: 'PACKET_INJECTION' | 'ROUTE_CONVERGENCE' | 'SECURITY_CIPHER_BENCHMARK' | 'FUZZ_MALFORMED_HEADER' | 'MTU_FRAGMENTATION' | 'IDENTITY_CHALLENGE';
  config: {
    sourceAddress: string;
    destinationAddress: string;
    packetCount: number;
    payloadSizeKB: number;
    simulatePacketLossPct: number;
    simulateJitterMs: number;
    corruptSignatures: boolean;
    transportAdapter: VIPTransportAdapter;
  };
  status: 'READY' | 'RUNNING' | 'PASSED' | 'FAILED' | 'ERROR';
  result?: {
    packetsSent: number;
    packetsReceived: number;
    packetsDropped: number;
    avgRttMs: number;
    minRttMs: number;
    maxRttMs: number;
    signatureVerificationPassed: boolean;
    tamperDetectionTriggered: boolean;
    logs: string[];
    durationMs: number;
    executedAt: string;
  };
}

export type VIPSandboxTest = VIPProtocolSandboxTest;

// ============================================================================
// 7. DEVELOPER SDK INTERFACE DEFINITIONS
// ============================================================================

export interface VIPClientConfig {
  networkEndpoint?: string;
  defaultTransport?: VIPTransportAdapter;
  identityKeypair?: {
    publicKey: string;
    privateKey: string;
  };
  autoReconnect?: boolean;
  requestTimeoutMs?: number;
  enableTamperAudit?: boolean;
}

export interface VIPSendOptions {
  transport?: VIPTransportAdapter;
  ttl?: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  sign?: boolean;
  encrypt?: boolean;
  requiresAck?: boolean;
  timeoutMs?: number;
}
