export type ProtocolCategory = 'VIRTUAL_SERVER' | 'NETWORK';

export type ProtocolLifecycleStatus = 
  | 'DRAFT'
  | 'VALIDATING'
  | 'REGISTERED'
  | 'ACTIVE'
  | 'MONITORING'
  | 'UPDATED'
  | 'DISABLED'
  | 'ARCHIVED';

export type TransportType = 'HTTP/HTTPS' | 'TCP' | 'UDP' | 'QUIC' | 'WebSocket' | 'WireGuard' | 'IPC' | 'gRPC';

export type ServerStatus = 'PROVISIONED' | 'ONLINE' | 'ACTIVE' | 'DRAINING' | 'OFFLINE' | 'REPLICATING';
export type NodeStatus = 'ONLINE' | 'SYNCED' | 'BUSY' | 'MAINTENANCE' | 'OFFLINE';
export type DomainStatus = 'ACTIVE' | 'VERIFIED' | 'REVOKED' | 'PENDING_CHALLENGE' | 'DELEGATED';

export interface PublishedService {
  id: string;
  name: string;
  scheme: string; // e.g. "service" or "rpc"
  endpoint: string; // e.g. "/v1/inference"
  port: number;
  protocolId: string; // e.g. "VSP-SERVER" | "NIP-DATA"
  transport: TransportType;
  authRequired: boolean;
  rateLimitReqSec: number;
  activeSubscribers: number;
  status: 'ONLINE' | 'DEGRADED' | 'PAUSED';
  metadata?: Record<string, string>;
}

export interface VirtualServer {
  id: string;
  name: string;
  domainBinding: string; // e.g. "vx://neural.edge/compute"
  nodeAttachmentId: string;
  nodeName: string;
  subnetId: string;
  subnetName: string;
  vCpu: number;
  ramMB: number;
  storageGB: number;
  bandwidthMbps: number;
  ringBufferKB: number;
  status: ServerStatus;
  publishedServices: PublishedService[];
  replicationFactor: number;
  osEngine: string;
  cpuUsagePct: number;
  ramUsageMB: number;
  latencyMs: number;
  uptimeSeconds: number;
  createdAt: string;
  lastHeartbeat: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  subnetId: string;
  subnetName: string;
  region: string;
  status: NodeStatus;
  hardwareSpecs: {
    cpuCores: number;
    totalRamGB: number;
    diskType: string;
    nicSpeedGbps: number;
  };
  healthScore: number; // 0 - 100
  latencyMs: number;
  packetLossPct: number;
  attachedServersCount: number;
  governanceStakeTokens: number;
  validatorKey: string;
  createdAt: string;
}

export interface LogicalSubnet {
  id: string;
  name: string;
  cidr: string; // e.g. "10.240.0.0/16"
  overlayScheme: string; // e.g. "VX-Overlay-Mesh-v3"
  encryptionMode: string; // e.g. "ChaCha20-Poly1305 / Noise_XX"
  totalNodes: number;
  activeServers: number;
  accessPolicy: 'PUBLIC' | 'PERMISSIONED_CONSORTIUM' | 'RESTRICTED_DAO';
  governanceRule: string;
  bandwidthCapGbps: number;
  status: 'ACTIVE' | 'DEGRADED' | 'MAINTENANCE';
}

export interface DomainOwnershipRecord {
  domain: string; // e.g. "vx://core.mesh/gateway"
  networkIdentity: string; // e.g. "did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C"
  ownerIdentity: string; // e.g. "drvictoragboola@gmail.com" / "Operator-Prime"
  ownerPublicKey: string;
  signatureProof: string;
  domainStatus: DomainStatus;
  associatedSubnetId: string;
  associatedSubnetName: string;
  hostingNodeId: string;
  hostingNodeName: string;
  virtualServerId: string;
  virtualServerName: string;
  publishedServices: PublishedService[];
  accessPolicy: 'PUBLIC_OPEN' | 'TOKEN_GATED' | 'SIGNATURE_CHALLENGE' | 'WHITELIST_ONLY';
  telemetryState: {
    telemetryActive: boolean;
    pingIntervalSec: number;
    anomalyDetection: boolean;
    streamThroughputKbps: number;
    lastVerifiedAt: string;
  };
  creationTimestamp: string;
  lastActivity: string;
  ownershipVerificationStatus: 'CRYPTOGRAPHICALLY_VERIFIED' | 'PENDING_CHALLENGE' | 'FAILED_SIGNATURE';
}

export interface ProtocolDefinition {
  id: string;
  identifier: string; // e.g. "VSP-SERVER", "NIP-RESOLVE"
  name: string;
  category: ProtocolCategory;
  description: string;
  version: string;
  status: ProtocolLifecycleStatus;
  dependencies: string[];
  supportedTransports: TransportType[];
  securityState: {
    tlsVersion: string;
    encryptionCipher: string;
    replayProtection: boolean;
    zeroKnowledgeProof: boolean;
  };
  telemetry: {
    activeSessions: number;
    packetRateSec: number;
    errorRatePct: number;
    avgLatencyMs: number;
  };
  config: Record<string, any>;
  documentation: string;
  createdAt: string;
  updatedAt: string;
}

export interface NativeResolverResult {
  rawAddress: string;
  scheme: string; // "vx"
  domain: string;
  path: string;
  resolved: boolean;
  pipeline: {
    stage1_nativeDomain: { domain: string; status: 'RESOLVED' | 'FAILED'; timeMs: number };
    stage2_networkIdentity: { identityDid: string; publicKey: string; status: 'VERIFIED' | 'FAILED'; timeMs: number };
    stage3_subnet: { subnetId: string; cidr: string; status: 'ROUTED' | 'FAILED'; timeMs: number };
    stage4_node: { nodeId: string; ipAddress: string; port: number; status: 'CONNECTED' | 'FAILED'; timeMs: number };
    stage5_virtualServer: { serverId: string; vCpu: number; ramMB: number; status: 'ACTIVE' | 'FAILED'; timeMs: number };
    stage6_service: { serviceName: string; endpoint: string; transport: TransportType; status: 'BOUND' | 'FAILED'; timeMs: number };
  };
  totalResolutionTimeMs: number;
  cryptographicProof: string;
  cacheTtlSec: number;
}

export interface DiopSession {
  sessionId: string;
  clientIdentity: string;
  domain: string;
  targetService: string;
  transport: TransportType;
  establishedAt: string;
  expiresAt: string;
  packetsExchanged: number;
  bytesTransferred: number;
  securityLevel: string;
  sessionToken: string;
  status: 'ACTIVE' | 'PAUSED' | 'TERMINATED';
}

export interface DiopAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetType: 'PROTOCOL' | 'DOMAIN' | 'SERVER' | 'NODE' | 'SUBNET' | 'SERVICE' | 'SESSION';
  targetId: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  details: string;
  signatureProof: string;
}

export interface DiopTelemetrySummary {
  nodeAvailabilityPct: number;
  serverAvailabilityPct: number;
  avgNetworkLatencyMs: number;
  totalCpuUtilizationPct: number;
  totalRamUtilizationPct: number;
  activeConnectionsCount: number;
  totalIngressMbps: number;
  totalEgressMbps: number;
  protocolEventsCount: number;
  securityEventsCount: number;
  sandboxMode: boolean;
}
