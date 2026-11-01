export type ServerState = 
  | 'DISCOVERED' 
  | 'IDENTIFIED' 
  | 'UNAUTHORIZED' 
  | 'OBSERVE_ONLY' 
  | 'AUTHORIZED' 
  | 'TESTABLE' 
  | 'TESTING' 
  | 'HEALTHY' 
  | 'DEGRADED' 
  | 'FAILED' 
  | 'REMEDIATION_REQUIRED' 
  | 'APPROVED_ACTION' 
  | 'ACTION_EXECUTED' 
  | 'VERIFIED';

export interface StandardTelemetryObject {
  telemetryId: string;
  timestamp: string;
  target: {
    host: string;
    address: string;
    authorized: boolean;
  };
  protocol: 'HTTPS' | 'HTTP' | 'WSS' | 'DNS' | 'TCP' | 'UDP';
  test: {
    direction: 'download' | 'upload';
    payloadBytes: number;
    durationMs: number;
    firstByteMs?: number;
  };
  network: {
    latencyMs: number;
    jitterMs: number;
    packetLoss: number;
    throughputMbps: number;
    p50Ms?: number;
    p90Ms?: number;
    p95Ms?: number;
    p99Ms?: number;
  };
  transport: {
    retransmissions: number;
    connections: number;
    timeouts?: number;
  };
  result: {
    status: 'success' | 'warning' | 'failed' | 'error';
    error: string | null;
  };
}

export interface TelemetryEvaluationEvent {
  type: 'HIGH_LATENCY' | 'PACKET_LOSS' | 'LOW_THROUGHPUT' | 'RETRANSMISSION_SPIKE' | 'ANOMALY_DETECTED';
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  details: string;
}

export interface AnomalyReport {
  historicalBaselineMbps: number;
  currentTelemetryMbps: number;
  expectedOperatingRangeMbps: { min: number; max: number };
  anomalyScore: number; // 0 to 1
  anomalyDetected: boolean;
  events: TelemetryEvaluationEvent[];
}

export interface PrivateServer {
  id: string;
  name: string;
  type: 'edge_compute' | 'microservice' | 'vector_db' | 'gateway_proxy' | 'automation_worker' | 'indexer_relay';
  ipAddress: string;
  port: number;
  subnetId: string;
  status: 'online' | 'provisioning' | 'offline' | 'degraded';
  serverState?: ServerState;
  authorized?: boolean;
  cpuUsage: number; // percentage 0-100
  ramUsage: number; // MBs
  maxRam: number; // MBs
  latencyMs: number;
  servicesRunning: string[];
  os: string;
  dockerImage?: string;
  envVars: Record<string, string>;
  createdAt: string;
  logs: string[];
  telemetryHistory?: StandardTelemetryObject[];
  latestAnomalyReport?: AnomalyReport;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'server' | 'gateway' | 'ai_agent' | 'database' | 'tool' | 'webhook';
  ip: string;
  status: 'active' | 'warning' | 'idle' | 'offline';
  x: number;
  y: number;
  connections: string[]; // target node IDs
  bandwidthKbps?: number;
}

export interface FunctionParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface CodeInjunction {
  id: string;
  name: string;
  description: string;
  language: 'typescript' | 'javascript' | 'python' | 'json';
  triggerType: 'manual' | 'ai_tool' | 'webhook' | 'schedule';
  parameters: FunctionParameter[];
  code: string;
  executionCount: number;
  lastRunTime?: string;
  lastExecutionLog?: string;
  lastExecutionStatus?: 'success' | 'error' | 'pending';
  lastOutput?: any;
  targetServerId?: string;
}

export interface OpenSourceProject {
  id: string;
  name: string;
  repoUrl: string;
  description: string;
  category: 'AI/LLM' | 'Networking' | 'Automation' | 'Database' | 'DevOps';
  tags: string[];
  starCount: number;
  status: 'synced' | 'cloning' | 'running' | 'idle';
  deployedServerId?: string;
  configYaml: string;
  parameterFunctions: CodeInjunction[];
  author: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system' | 'tool';
  content: string;
  timestamp: string;
  functionCalls?: Array<{
    id: string;
    name: string;
    args: any;
    result?: any;
    status: 'calling' | 'success' | 'error';
  }>;
  modelUsed?: string;
}

export interface NetworkToolRequest {
  type: 'ping' | 'http' | 'port_scan' | 'dns' | 'subnet_lookup' | 'packet_sniff' | 'domain_diagnostic';
  target: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  port?: number;
  ispCarrier?: string;
  interfaceName?: string;
  protocolFilter?: string;
  captureDurationSec?: number;
}

export interface SniffedPacket {
  frameNo: number;
  timestamp: string;
  sourceIP: string;
  destIP: string;
  sourcePort: number;
  destPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'TLS' | 'HTTP' | 'DNS';
  ispCarrier: string;
  ispAsn: string;
  payloadSizeBytes: number;
  tcpFlags?: string;
  info: string;
  headerDetails: {
    ethernet: string;
    ipv4Header: string;
    transportHeader: string;
    payloadHexDump: string;
    payloadAscii: string;
  };
}

export interface NetworkToolResponse {
  success: boolean;
  timestamp: string;
  latencyMs: number;
  statusCode?: number;
  statusText: string;
  data: any;
  logs: string[];
  packetsCaptured?: SniffedPacket[];
}

export interface TelemetryBlock {
  blockIndex: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  nonce: number;
  timestamp: string;
  mainServerSource: string;
  subnetServerTarget: string;
  telemetryMetrics: {
    downloadMbps: number;
    uploadMbps: number;
    latencyMs: number;
    packetLoss: number;
    activeConnections: number;
  };
  validatorNode: string;
  validatorSignature: string;
  verifiedStatus: 'VALIDATED' | 'REGENERATED' | 'SYNCING' | 'PENDING';
}

export interface SubnetValidatorNode {
  nodeId: string;
  name: string;
  ipAddress: string;
  subnetId: string;
  role: 'MAIN_GENESIS' | 'SUBNET_VALIDATOR' | 'REGEN_RELAY';
  blocksValidated: number;
  stakeBalanceDEPO: number;
  gasLimitCapacity: number;
  status: 'ONLINE' | 'SYNCED' | 'REGENERATING';
}

export interface WalletAddressIndex {
  derivationIndex: number;
  address: string;
  path: string;
  targetSubnetNode: string;
  balanceDEPO?: number;
  balanceSNT?: number;
  stakedWeightPct: number;
  allocatedGas: number;
  status: 'ACTIVE' | 'REGENERATED' | 'SCALED';
  lastBlockValidated: number;
}

export interface CryptographicEngineState {
  secp256k1VerifiedCount: number;
  ed25519VerifiedCount: number;
  schnorrBip340Active: boolean;
  blake3Acceleration: boolean;
  pohSequenceTick: number;
  pohHash: string;
  tpsCapacity: number;
}

export interface UTXOOutput {
  txid: string;
  vout: number;
  address: string;
  valueSats: number;
  scriptPubKey: string;
  type: 'NATIVE_BTC' | 'BRC20' | 'ORDINALS' | 'RUNES';
  protocolData?: string;
  isSpent: boolean;
}

export interface SPLTokenAccount {
  mintAddress: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  associatedTokenAddress: string;
  ownerAddress: string;
  balance: number;
  hostedOnServer: string;
  supply: number;
}

export interface ProofOfHistoryTick {
  tickIndex: number;
  hash: string;
  slot: number;
  leaderNode: string;
  eventPayload: string;
  timestamp: string;
}

export interface SubnetTokenHost {
  tokenId: string;
  name: string;
  symbol: string;
  standard: 'SPL' | 'BRC-20' | 'RUNES' | 'NATIVE_SNT';
  totalSupply: number;
  decimals: number;
  hostedNodeIp: string;
  contractAddress: string;
  holdersCount: number;
  status: 'HOSTED_ACTIVE' | 'SYNCING' | 'REGENERATED';
}

// BTE-ID v1 - Immutable Blockchain Identity Anchor Types
export type ProtocolCategory = 'VIRTUAL_SERVER' | 'NETWORK';

export type ProtocolType = 
  | 'VIRTUAL_SERVER'
  | 'NETWORK_PROTOCOL'
  | 'SUBNET'
  | 'DOMAIN'
  | 'STORAGE'
  | 'COMPUTE'
  | 'NODE'
  | 'WEBAPP'
  | 'API'
  | 'IDENTITY_ROUTER';

export interface BlockchainIdentityAnchor {
  identityId: string;           // bytes32: keccak256("BIGTECH-IDENTITY-V1", walletAddress)
  identityCommitment: string;   // bytes32: sha256(userId + "|" + version + "|" + encryptedDoc)
  ownerAddress: string;         // Ethereum/EVM Address
  createdAt: number;            // uint64 Unix timestamp
  exists: boolean;
  blockNumber: number;
  txHash: string;
  gasUsed: number;
  status: 'IMMUTABLE_ANCHORED' | 'PENDING' | 'VERIFIED';
}

export interface RegisteredProtocol {
  protocolId: string;           // bytes32: keccak256("BIGTECH-PROTOCOL-V1", identityId, protocolType)
  identityId: string;           // bytes32 anchor reference
  protocolType: ProtocolType;
  category: ProtocolCategory;
  name: string;
  description: string;
  protocolHash: string;
  registeredAt: number;
  active: boolean;
  targetEndpoint?: string;
  rolePermissions: string[];
  lastVerifiedAt?: string;
}

export interface OffChainPrivateIdentity {
  userId: string;
  version: string;
  fullName: string;
  decentralizedEmail: string;
  organization: string;
  didDocumentUri: string;
  pgpPublicKeyPreview: string;
  encryptedDocumentHex: string;
  encryptionAlgorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
  secretSalt: string;
}

export interface VerificationTelemetryRecord {
  id: string;
  timestamp: string;
  identityId: string;
  protocolId: string;
  protocolType: string;
  caller: string;
  status: 'VERIFIED_MATCH' | 'FAILED_MISMATCH' | 'REVOKED' | 'UNREGISTERED';
  latencyMs: number;
  contractMethod: 'verifyProtocol' | 'getIdentityId' | 'checkPermission';
}

// Re-export Inclusive Protocol Engine types
export * from './types/protocolEngine';

