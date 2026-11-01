import { keccak256, encodePacked, stringToBytes } from 'viem';

/**
 * Supported 20 Standard Protocol Families for Digital Protocol Universe
 */
export type EngineProtocolCategory =
  | 'internet-transport'
  | 'web'
  | 'domain-discovery'
  | 'email'
  | 'security-crypto'
  | 'identity-auth'
  | 'routing'
  | 'network-management'
  | 'file-transfer'
  | 'application-apis'
  | 'messaging'
  | 'storage-distributed'
  | 'peer-to-peer'
  | 'blockchain-web3'
  | 'realtime-media'
  | 'iot'
  | 'hardware-local'
  | 'industrial'
  | 'telemetry-observability'
  | 'custom-inclusive'
  // Legacy aliases
  | 'virtual-server'
  | 'network'
  | 'dns'
  | 'identity'
  | 'security'
  | 'storage'
  | 'infrastructure'
  | 'blockchain'
  | 'decentralized';

export type ProtocolStatus = 'available' | 'installed' | 'disabled' | 'deprecated' | 'testing';

export interface TelemetryAssignment {
  assignedServerId: string;
  assignedServerName: string;
  telemetryEndpoint: string;
  samplingRateHz: number;
  otlpExportEnabled: boolean;
  assignedAt: string;
  status: 'ACTIVE' | 'IDLE' | 'ERROR';
  metrics: {
    throughputPps: number;
    latencyMs: number;
    packetLossPct: number;
    activeSockets: number;
    errorCount: number;
    lastHeartbeat: string;
  };
}

export interface PluginApiHook {
  hookName: string;
  handlerMethod: string;
  timeoutMs: number;
  isAsync: boolean;
}

export interface ProtocolPluginManifest {
  pluginId: string;
  pluginName: string;
  version: string;
  apiRoute: string;
  supportedMethods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'STREAM' | 'SUBSCRIBE'>;
  hooks: PluginApiHook[];
  isInstalledAsTool: boolean;
  installedAt?: string;
}

export interface ProtocolDependency {
  id: string;
  name: string;
  required: boolean;
  status: 'available' | 'installed' | 'config_required' | 'missing';
  reason?: string;
}

export interface SecurityRequirement {
  name: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
  description: string;
  fulfilled: boolean;
  remediation?: string;
}

export interface ConnectedServiceRef {
  id: string;
  type: 'server' | 'node' | 'subnet' | 'domain' | 'webapp' | 'storage' | 'compute';
  name: string;
  targetEndpoint: string;
  status: 'bound' | 'unbound' | 'pending';
}

export interface ProtocolLogEntry {
  id: string;
  timestamp: string;
  protocolId: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT' | 'SECURITY';
  message: string;
  actor?: string;
  details?: Record<string, any>;
}

export interface ProtocolDefinition {
  id: string;                      // standard identifier like 'smtp', 'https', 'websocket'
  name: string;
  version: string;
  categories: EngineProtocolCategory[];
  isVirtualServer: boolean;        // Virtual Server Protocol flag
  isNetwork: boolean;              // Network Protocol flag
  description: string;
  transport?: string;
  defaultPorts?: number[];
  encrypted: boolean;
  requiresSecrets: boolean;
  requiresPrivilegedAccess: boolean;
  privilegedAccessReason?: string;
  status: ProtocolStatus;
  
  // Hierarchy & Ownership linkage
  ownerIdentityId?: string;
  serverId?: string;
  nodeId?: string;
  subnetId?: string;
  domainId?: string;
  applicationId?: string;
  protocolHash?: string;
  protocolId?: string;             // Deterministic bytes32 ID: keccak256("BTE-PROTOCOL-V1", identityId, name, version)
  
  // Dependencies & Security
  dependencies: ProtocolDependency[];
  securityRequirements: SecurityRequirement[];
  connectedServices: ConnectedServiceRef[];
  
  // Configuration (Secret items masked/encrypted on backend)
  config: Record<string, any>;
  hasSecretConfig?: boolean;
  
  // Meta
  installedAt?: string;
  updatedAt?: string;
  testStatus?: 'UNTESTED' | 'PASS' | 'WARN' | 'FAIL';
  testResults?: Record<string, any>;
  documentation?: {
    summary: string;
    usageExample: string;
    rfcOrStandard?: string;
    securityBestPractices: string[];
  };
}

export interface ProtocolSandboxTestRequest {
  protocolId: string;
  endpointUrl?: string;
  host?: string;
  port?: number;
  authHeader?: string;
  testPayload?: string;
  useTls?: boolean;
  timeoutMs?: number;
  rateLimitPerSec?: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
}

export interface ProtocolSandboxTestResult {
  testId: string;
  protocolId: string;
  timestamp: string;
  success: boolean;
  latencyMs: number;
  responseStatus?: string | number;
  responseHeaders?: Record<string, string>;
  protocolFrames?: Array<{
    direction: 'SENT' | 'RECEIVED';
    protocol: string;
    bytes: number;
    rawPayload: string;
  }>;
  tlsHandshake?: {
    cipherSuite: string;
    tlsVersion: string;
    certIssuer: string;
    certExpiresAt: string;
    verified: boolean;
  };
  schemaValidation: {
    valid: boolean;
    errors?: string[];
  };
  logs: string[];
}

export interface CustomProtocolGeneratorInput {
  name: string;
  customId: string;
  version: string;
  categories: EngineProtocolCategory[];
  transport: 'TCP' | 'UDP' | 'QUIC' | 'HTTP/2' | 'HTTP/3' | 'WebSocket' | 'gRPC' | 'P2P_LIBP2P';
  messageSchema: string; // JSON Schema
  authentication: 'NONE' | 'BEARER_TOKEN' | 'MTLS' | 'WEBAUTHN' | 'BLOCKCHAIN_SIG' | 'OAUTH2';
  encryption: 'TLS_1_3' | 'AES_256_GCM' | 'CHACHA20_POLY1305' | 'NOISE_PROTOCOL';
  ports: number[];
  endpoints: string[];
  requestFormat: string;
  responseFormat: string;
  errorCodes: Array<{ code: number | string; message: string }>;
  permissions: string[];
}

export interface GeneratedProtocolBundle {
  protocolDefinition: ProtocolDefinition;
  specMarkdown: string;
  jsonSchema: Record<string, any>;
  openApiYaml?: string;
  adapters: {
    typescript: string;
    nodejsReference: string;
    pythonReference: string;
    goReference: string;
  };
  testSuiteTs: string;
  documentationMd: string;
}

export interface WebEndpointConfig {
  protocol: 'HTTP' | 'HTTPS' | 'WebSocket' | 'WebRTC' | 'SSE' | 'HTTP/2' | 'HTTP/3' | 'QUIC';
  host: string;
  port: number;
  path: string;
  authentication: 'NONE' | 'JWT' | 'OAUTH2' | 'API_KEY' | 'MTLS' | 'WEBAUTHN';
  tlsEnabled: boolean;
  rateLimitPerMin: number;
  timeoutMs: number;
  retryPolicy: {
    maxAttempts: number;
    backoffMs: number;
  };
  allowedOrigins: string[];
}

export interface DomainDnsMapping {
  domain: string;
  dnssecEnabled: boolean;
  dohEnabled: boolean;
  dotEnabled: boolean;
  records: Array<{
    type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'CAA' | 'PTR';
    name: string;
    value: string;
    ttl: number;
    priority?: number;
  }>;
  boundServerId?: string;
  boundNodeId?: string;
  boundSubnetId?: string;
  boundProtocolEndpoints: string[];
  verificationStatus: 'VERIFIED' | 'PROPAGATING' | 'FAILED';
}

/**
 * Deterministic Protocol Identifier Generation Helper
 * keccak256(["BTE-PROTOCOL-V1", identityId, protocolName, version])
 */
export function generateDeterministicProtocolId(
  identityId: `0x${string}` | string,
  protocolName: string,
  version: string
): `0x${string}` {
  const cleanId = (identityId.startsWith('0x') ? identityId : `0x${identityId}`) as `0x${string}`;
  // Ensure padded or fixed bytes32 representation
  const hex = cleanId.length === 66 ? cleanId : `0x${cleanId.slice(2).padStart(64, '0')}` as `0x${string}`;

  return keccak256(
    encodePacked(
      ['string', 'bytes32', 'string', 'string'],
      ['BTE-PROTOCOL-V1', hex, protocolName.trim().toUpperCase(), version.trim()]
    )
  );
}

/**
 * Deterministic Entity Identifier Generation Helper
 */
export function generateDeterministicEntityId(
  entityType: 'SERVER' | 'NODE' | 'SUBNET' | 'DOMAIN' | 'APPLICATION',
  identityId: string,
  entityName: string
): `0x${string}` {
  return keccak256(
    encodePacked(
      ['string', 'string', 'string'],
      [`BTE-${entityType}-V1`, identityId, entityName.trim()]
    )
  );
}

export type CategoryInstallStatus = 'installed' | 'partial' | 'uninstalled' | 'installing' | 'removing';

export interface ProtocolCategoryManifest {
  id: EngineProtocolCategory;
  categoryIndex: number;
  name: string;
  shortLabel: string;
  tagline: string;
  description: string;
  layer: string;
  color: string;
  iconName: string;
  protocolIds: string[];
  protocolNames: string[];
  defaultPorts: number[];
  transports: string[];
  securityStandards: string[];
  systemImpact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
  recommended: boolean;
  isVirtualServer: boolean;
  isNetwork: boolean;
}

