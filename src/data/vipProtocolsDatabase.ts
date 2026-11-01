import { VIPProtocolDefinition } from '../types/vip';

export const vipProtocolCatalog: VIPProtocolDefinition[] = [
  // ============================================================================
  // 1. VIRTUAL SERVER PROTOCOLS (VSP) - 10 Core Specs
  // ============================================================================
  {
    id: 'VSP-NET',
    code: 'VSP-NET',
    name: 'Virtual Network Protocol',
    rfcNumber: 'RFC-VSP-001',
    group: 'VSP',
    version: '1.4.0',
    description: 'Defines overlay network topology creation, sovereign consensus membership, and cross-subnet overlay packet tunneling over standard IP transports.',
    status: 'ACTIVE',
    primaryTransport: 'QUIC',
    supportedTransports: ['QUIC', 'UDP', 'TCP', 'WebSocket'],
    headerMagic: '0x5653504E', // "VSPN"
    portDefault: 9101,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'VirtualNetworkSpec',
      type: 'object',
      properties: {
        networkId: { type: 'string', pattern: '^vnet-[a-z0-9-]+$' },
        vnetUri: { type: 'string', pattern: '^vnet://[a-z0-9-]+$' },
        cidrBlock: { type: 'string' },
        overlayCipher: { type: 'string', enum: ['ChaCha20-Poly1305', 'AES-256-GCM'] },
        consensusType: { type: 'string', enum: ['PROOF_OF_AUTHORITY', 'PROOF_OF_BANDWIDTH', 'BFT'] }
      },
      required: ['networkId', 'vnetUri', 'cidrBlock', 'overlayCipher']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 64,
      packetThroughputSec: 8420,
      avgLatencyMs: 9.4,
      errorRatePct: 0.001,
      bytesTransferredTotal: 14285091200
    },
    documentation: 'VSP-NET governs the creation of sovereign overlay network spaces. It provides cryptographic membership proofs, overlay CIDR partitioning, and seamless transport switching across TCP, UDP, QUIC, and WebSockets without breaking overlay connection state.',
    codeSnippet: `// VSP-NET Overlay Initialization
import { VIPClient } from '@vip/sdk';
const vip = new VIPClient();
const network = await vip.joinNetwork('vnet://mesh-primary', {
  transport: 'QUIC',
  cipher: 'ChaCha20-Poly1305'
});`,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-08-14T10:00:00Z'
  },
  {
    id: 'VSP-NODE',
    code: 'VSP-NODE',
    name: 'Node Protocol',
    rfcNumber: 'RFC-VSP-002',
    group: 'VSP',
    version: '2.1.0',
    description: 'Manages physical and virtual node hardware attestation, cryptographic health heartbeats, and dynamic transport link aggregation.',
    status: 'ACTIVE',
    primaryTransport: 'TCP',
    supportedTransports: ['TCP', 'QUIC', 'WebSocket'],
    headerMagic: '0x56535044', // "VSPD"
    portDefault: 9102,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'NodeAttestationSpec',
      type: 'object',
      properties: {
        nodeId: { type: 'string' },
        hardwareProof: { type: 'string' },
        physicalTransportBinding: {
          type: 'object',
          properties: {
            ipAddress: { type: 'string' },
            port: { type: 'number' },
            protocol: { type: 'string' }
          }
        },
        validatorSignature: { type: 'string' }
      },
      required: ['nodeId', 'hardwareProof', 'validatorSignature']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 128,
      packetThroughputSec: 12450,
      avgLatencyMs: 7.8,
      errorRatePct: 0.000,
      bytesTransferredTotal: 34182900120
    },
    documentation: 'VSP-NODE establishes cryptographic node identity anchors. It continuously benchmarks CPU, RAM, and NIC capacity to ensure guaranteed overlay QoS.',
    codeSnippet: `// VSP-NODE Attestation Probe
const nodeAttestation = await vip.node.attest({
  nodeId: 'vnode-fra-01',
  specs: { cpuCores: 16, ramGB: 64 },
  signature: userKeypair.sign(hash)
});`,
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-08-14T11:00:00Z'
  },
  {
    id: 'VSP-SERVER',
    code: 'VSP-SERVER',
    name: 'Server Protocol',
    rfcNumber: 'RFC-VSP-003',
    group: 'VSP',
    version: '1.8.2',
    description: 'Governs virtual server provisioning, deterministic memory ring-buffers, container isolation, and stateful lifecycle migrations.',
    status: 'ACTIVE',
    primaryTransport: 'HTTPS',
    supportedTransports: ['HTTPS', 'QUIC', 'WebSocket', 'TCP'],
    headerMagic: '0x56535053', // "VSPS"
    portDefault: 9103,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'VirtualServerSpec',
      type: 'object',
      properties: {
        serverId: { type: 'string' },
        domainBinding: { type: 'string' },
        vCpu: { type: 'number' },
        ramMB: { type: 'number' },
        stateReplication: { type: 'boolean' }
      },
      required: ['serverId', 'vCpu', 'ramMB']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: false
    },
    metrics: {
      activeSessions: 94,
      packetThroughputSec: 6180,
      avgLatencyMs: 11.2,
      errorRatePct: 0.002,
      bytesTransferredTotal: 18910244100
    },
    documentation: 'VSP-SERVER orchestrates deterministic container creation, dynamic port mapping, memory ring buffers, and crash recovery inside the virtual network overlay.',
    codeSnippet: `// VSP-SERVER Instance Creation
const server = await vip.server.create({
  name: 'vsrv-neural-gateway',
  vCpu: 8,
  ramMB: 16384,
  domainBinding: 'vnet://neural.edge/compute'
});`,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-08-14T12:00:00Z'
  },
  {
    id: 'VSP-SUBNET',
    code: 'VSP-SUBNET',
    name: 'Subnet Protocol',
    rfcNumber: 'RFC-VSP-004',
    group: 'VSP',
    version: '1.6.0',
    description: 'Enables overlay CIDR micro-segmentation, dynamic mesh route advertisement, and encrypted packet forwarding across subnet boundaries.',
    status: 'ACTIVE',
    primaryTransport: 'UDP',
    supportedTransports: ['UDP', 'QUIC', 'WebSocket'],
    headerMagic: '0x56535042', // "VSPB"
    portDefault: 9104,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'SubnetMeshSpec',
      type: 'object',
      properties: {
        subnetId: { type: 'string' },
        networkId: { type: 'string' },
        cidr: { type: 'string' },
        encryptionMode: { type: 'string' },
        accessPolicy: { type: 'string' }
      },
      required: ['subnetId', 'networkId', 'cidr']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: false
    },
    metrics: {
      activeSessions: 78,
      packetThroughputSec: 15100,
      avgLatencyMs: 6.9,
      errorRatePct: 0.001,
      bytesTransferredTotal: 52100840100
    },
    documentation: 'VSP-SUBNET partitions large virtual networks into secure, encrypted isolation zones with zero-trust packet filters.',
    codeSnippet: `// VSP-SUBNET Partitioning
const subnet = await vip.subnet.provision({
  name: 'sub-eu-central',
  cidr: '10.240.10.0/24',
  encryption: 'ChaCha20-Poly1305'
});`,
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-08-14T13:00:00Z'
  },
  {
    id: 'VSP-DOMAIN',
    code: 'VSP-DOMAIN',
    name: 'Domain Protocol',
    rfcNumber: 'RFC-VSP-005',
    group: 'VSP',
    version: '2.0.1',
    description: 'Implements sovereign DID domain binding, decentralized cryptographic DNS zones, and DNSSEC overlay verification.',
    status: 'ACTIVE',
    primaryTransport: 'HTTPS',
    supportedTransports: ['HTTPS', 'QUIC', 'TCP', 'UDP'],
    headerMagic: '0x5653504D', // "VSPM"
    portDefault: 9105,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'DomainRegistrationSpec',
      type: 'object',
      properties: {
        domain: { type: 'string' },
        ownerDid: { type: 'string' },
        zoneRecords: { type: 'array' },
        signatureProof: { type: 'string' }
      },
      required: ['domain', 'ownerDid', 'signatureProof']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 210,
      packetThroughputSec: 4200,
      avgLatencyMs: 4.5,
      errorRatePct: 0.000,
      bytesTransferredTotal: 8401920300
    },
    documentation: 'VSP-DOMAIN replaces centralized DNS root servers with cryptographic domain ownership certificates linked to sovereign W3C DIDs.',
    codeSnippet: `// VSP-DOMAIN Registry
const domain = await vip.domain.register({
  domain: 'neural.edge',
  targetServer: 'vsrv-neural-gateway',
  ownerDid: 'did:vip:ed25519:7F2e89A42a9b3112'
});`,
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-08-14T14:00:00Z'
  },
  {
    id: 'VSP-SERVICE',
    code: 'VSP-SERVICE',
    name: 'Service Protocol',
    rfcNumber: 'RFC-VSP-006',
    group: 'VSP',
    version: '1.5.0',
    description: 'Standardizes microservice publication, port binding, rate limiting, and RPC invocation across the overlay mesh.',
    status: 'ACTIVE',
    primaryTransport: 'WebSocket',
    supportedTransports: ['WebSocket', 'HTTPS', 'QUIC', 'TCP'],
    headerMagic: '0x56535056', // "VSPV"
    portDefault: 9106,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'ServiceEndpointSpec',
      type: 'object',
      properties: {
        serviceName: { type: 'string' },
        domain: { type: 'string' },
        endpointPath: { type: 'string' },
        rateLimitReqSec: { type: 'number' },
        authRequired: { type: 'boolean' }
      },
      required: ['serviceName', 'domain', 'endpointPath']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: false
    },
    metrics: {
      activeSessions: 145,
      packetThroughputSec: 11200,
      avgLatencyMs: 8.1,
      errorRatePct: 0.001,
      bytesTransferredTotal: 29401820400
    },
    documentation: 'VSP-SERVICE enables instant discovery, capability-based auth enforcement, and sub-millisecond dispatch to running services.',
    codeSnippet: `// VSP-SERVICE Exposer
vip.service.publish({
  serviceName: 'inference',
  domain: 'neural.edge',
  endpointPath: '/v1/predict',
  handler: async (req) => ({ result: 'Model output' })
});`,
    createdAt: '2026-01-22T00:00:00Z',
    updatedAt: '2026-08-14T15:00:00Z'
  },
  {
    id: 'VSP-STORAGE',
    code: 'VSP-STORAGE',
    name: 'Storage Protocol',
    rfcNumber: 'RFC-VSP-007',
    group: 'VSP',
    version: '1.2.0',
    description: 'Provides content-addressable block storage, decentralized replication buffers, and erasure-coded volume mounting.',
    status: 'ACTIVE',
    primaryTransport: 'TCP',
    supportedTransports: ['TCP', 'QUIC', 'HTTPS'],
    headerMagic: '0x56535054', // "VSPT"
    portDefault: 9107,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'StorageVolumeSpec',
      type: 'object',
      properties: {
        volumeId: { type: 'string' },
        capacityGB: { type: 'number' },
        redundancyFactor: { type: 'number' },
        encryptionKeyHash: { type: 'string' }
      },
      required: ['volumeId', 'capacityGB']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 52,
      packetThroughputSec: 3890,
      avgLatencyMs: 14.8,
      errorRatePct: 0.000,
      bytesTransferredTotal: 89401290300
    },
    documentation: 'VSP-STORAGE manages zero-knowledge persistent storage volumes mounted directly into virtual servers across edge nodes.',
    codeSnippet: `// VSP-STORAGE Volume Mount
const volume = await vip.storage.mount({
  volumeId: 'vol-vector-index-01',
  sizeGB: 500,
  replication: 3
});`,
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-08-14T16:00:00Z'
  },
  {
    id: 'VSP-DISCOVERY',
    code: 'VSP-DISCOVERY',
    name: 'Discovery Protocol',
    rfcNumber: 'RFC-VSP-008',
    group: 'VSP',
    version: '1.9.0',
    description: 'Facilitates DHT-based peer discovery, SRV beacon gossip, and autonomous server capability broadcast.',
    status: 'ACTIVE',
    primaryTransport: 'UDP',
    supportedTransports: ['UDP', 'WebRTC', 'WebSocket', 'QUIC'],
    headerMagic: '0x56535043', // "VSPC"
    portDefault: 9108,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'DiscoveryBeaconSpec',
      type: 'object',
      properties: {
        beaconId: { type: 'string' },
        originNode: { type: 'string' },
        servicesAdvertised: { type: 'array' },
        ttlSeconds: { type: 'number' }
      },
      required: ['beaconId', 'originNode', 'servicesAdvertised']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: false,
      zeroKnowledgeProofSupported: false
    },
    metrics: {
      activeSessions: 320,
      packetThroughputSec: 18400,
      avgLatencyMs: 3.2,
      errorRatePct: 0.000,
      bytesTransferredTotal: 12401820400
    },
    documentation: 'VSP-DISCOVERY operates a Kademlia-inspired overlay DHT enabling nodes and services to locate one another in <10ms.',
    codeSnippet: `// VSP-DISCOVERY Lookup
const services = await vip.discovery.findServices({
  serviceType: 'ai-inference',
  maxLatencyMs: 25
});`,
    createdAt: '2026-01-28T00:00:00Z',
    updatedAt: '2026-08-14T17:00:00Z'
  },
  {
    id: 'VSP-ROUTING',
    code: 'VSP-ROUTING',
    name: 'Routing Protocol',
    rfcNumber: 'RFC-VSP-009',
    group: 'VSP',
    version: '2.4.0',
    description: 'Implements Dijkstra-optimized overlay route calculations, dynamic failover switching, and multi-path packet dispatch.',
    status: 'ACTIVE',
    primaryTransport: 'QUIC',
    supportedTransports: ['QUIC', 'UDP', 'TCP', 'WebSocket'],
    headerMagic: '0x56535052', // "VSPR"
    portDefault: 9109,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'OverlayRoutingSpec',
      type: 'object',
      properties: {
        routeId: { type: 'string' },
        sourceNode: { type: 'string' },
        destinationNode: { type: 'string' },
        hopCostWeights: { type: 'array' },
        failoverAvailable: { type: 'boolean' }
      },
      required: ['routeId', 'sourceNode', 'destinationNode']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 180,
      packetThroughputSec: 22100,
      avgLatencyMs: 5.1,
      errorRatePct: 0.001,
      bytesTransferredTotal: 68102940200
    },
    documentation: 'VSP-ROUTING continuously evaluates link latency, jitter, and loss across physical IP adapters to route overlay packets around bottlenecks.',
    codeSnippet: `// VSP-ROUTING Path Calculation
const route = await vip.routing.computeShortestPath({
  from: 'vnode-fra-01',
  to: 'vnode-sin-03',
  metric: 'LOWEST_LATENCY'
});`,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-08-14T18:00:00Z'
  },
  {
    id: 'VSP-TELEMETRY',
    code: 'VSP-TELEMETRY',
    name: 'Telemetry Protocol',
    rfcNumber: 'RFC-VSP-010',
    group: 'VSP',
    version: '2.0.0',
    description: 'Streams tamper-evident Merkle telemetry logs, node performance metrics, and cryptographic audit proofs.',
    status: 'ACTIVE',
    primaryTransport: 'WebSocket',
    supportedTransports: ['WebSocket', 'QUIC', 'HTTPS', 'TCP'],
    headerMagic: '0x5653504C', // "VSPL"
    portDefault: 9110,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'TamperEvidentTelemetrySpec',
      type: 'object',
      properties: {
        sequenceNumber: { type: 'number' },
        timestamp: { type: 'string' },
        previousHash: { type: 'string' },
        entryHash: { type: 'string' },
        merkleRoot: { type: 'string' },
        validatorSignature: { type: 'string' }
      },
      required: ['sequenceNumber', 'entryHash', 'merkleRoot', 'validatorSignature']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 410,
      packetThroughputSec: 28900,
      avgLatencyMs: 3.8,
      errorRatePct: 0.000,
      bytesTransferredTotal: 41920400100
    },
    documentation: 'VSP-TELEMETRY forms a cryptographically verifiable audit log of every packet hop, route change, and state mutation.',
    codeSnippet: `// VSP-TELEMETRY Stream Subscribe
vip.telemetry.subscribe({
  networkId: 'vnet-mesh-primary',
  onBlock: (entry) => console.log('Merkle Root:', entry.merkleRoot)
});`,
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-08-14T19:00:00Z'
  },

  // ============================================================================
  // 2. NETWORK PROTOCOLS (NIP) - 10 Core Specs
  // ============================================================================
  {
    id: 'NIP-ADDRESSING',
    code: 'NIP-ADDRESSING',
    name: 'Virtual Addressing Protocol (vnet://)',
    rfcNumber: 'RFC-NIP-001',
    group: 'NIP',
    version: '2.2.0',
    description: 'Standardizes the sovereign "vnet://" URI syntax, hierarchical path parsing, and resolution into the 8-layer VIP stack.',
    status: 'ACTIVE',
    primaryTransport: 'HTTPS',
    supportedTransports: ['HTTPS', 'QUIC', 'WebSocket', 'TCP', 'UDP'],
    headerMagic: '0x4E495041', // "NIPA"
    portDefault: 9201,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'VnetAddressSpec',
      type: 'object',
      properties: {
        rawUri: { type: 'string', pattern: '^vnet://.+$' },
        scheme: { type: 'string', const: 'vnet' },
        domainOrNetwork: { type: 'string' },
        subnet: { type: 'string' },
        node: { type: 'string' },
        service: { type: 'string' }
      },
      required: ['rawUri', 'scheme', 'domainOrNetwork']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'None',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 540,
      packetThroughputSec: 34500,
      avgLatencyMs: 2.1,
      errorRatePct: 0.000,
      bytesTransferredTotal: 18290400100
    },
    documentation: 'NIP-ADDRESSING defines how human-readable and DID-based vnet:// URIs resolve hierarchically from User to Identity to Network to Subnet to Node to Server to Domain to Service.',
    codeSnippet: `// NIP-ADDRESSING Resolver
const target = await vip.addressing.resolve('vnet://neural.edge/inference');
console.log('Resolved Physical Transport:', target.layer5_node.physicalIp);`,
    createdAt: '2026-02-08T00:00:00Z',
    updatedAt: '2026-08-14T20:00:00Z'
  },
  {
    id: 'NIP-IDENTITY',
    code: 'NIP-IDENTITY',
    name: 'Identity Protocol',
    rfcNumber: 'RFC-NIP-002',
    group: 'NIP',
    version: '2.0.0',
    description: 'Provides W3C DID specification compliance, Ed25519/Secp256k1 keypair management, and cryptographic attestation proofs.',
    status: 'ACTIVE',
    primaryTransport: 'HTTPS',
    supportedTransports: ['HTTPS', 'QUIC', 'WebSocket'],
    headerMagic: '0x4E495049', // "NIPI"
    portDefault: 9202,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'IdentityDidSpec',
      type: 'object',
      properties: {
        did: { type: 'string', pattern: '^did:vip:[a-z0-9]+:.+$' },
        publicKey: { type: 'string' },
        algorithm: { type: 'string', enum: ['Ed25519', 'Secp256k1', 'Curve25519'] },
        attestations: { type: 'array' }
      },
      required: ['did', 'publicKey', 'algorithm']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'Curve25519-ECDH',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 380,
      packetThroughputSec: 16800,
      avgLatencyMs: 4.2,
      errorRatePct: 0.000,
      bytesTransferredTotal: 14902840200
    },
    documentation: 'NIP-IDENTITY anchors cryptographic identities for users, networks, nodes, and servers, eliminating reliance on centralized certificate authorities.',
    codeSnippet: `// NIP-IDENTITY Key Generation
const identity = await vip.identity.create({
  alias: 'Sovereign-Alpha-Gateway',
  algorithm: 'Ed25519'
});`,
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-08-14T21:00:00Z'
  },
  {
    id: 'NIP-PACKET',
    code: 'NIP-PACKET',
    name: 'Packet Protocol (VirtualPacket)',
    rfcNumber: 'RFC-NIP-003',
    group: 'NIP',
    version: '2.5.0',
    description: 'Defines the universal "VirtualPacket" binary and JSON wire format, structured security envelope, and TTL enforcement.',
    status: 'ACTIVE',
    primaryTransport: 'QUIC',
    supportedTransports: ['QUIC', 'UDP', 'TCP', 'WebSocket', 'WebRTC'],
    headerMagic: '0x56495031', // "VIP1"
    portDefault: 9203,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'VirtualPacketWireSpec',
      type: 'object',
      properties: {
        header: {
          type: 'object',
          properties: {
            magic: { type: 'number', const: 0x56495031 },
            packetId: { type: 'string' },
            sourceUri: { type: 'string' },
            destinationUri: { type: 'string' },
            protocolId: { type: 'string' },
            ttl: { type: 'number' },
            payloadHash: { type: 'string' }
          },
          required: ['magic', 'packetId', 'sourceUri', 'destinationUri', 'payloadHash']
        },
        security: {
          type: 'object',
          properties: {
            signature: { type: 'string' },
            signerPublicKey: { type: 'string' }
          },
          required: ['signature', 'signerPublicKey']
        },
        payload: {}
      },
      required: ['header', 'security', 'payload']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 890,
      packetThroughputSec: 48200,
      avgLatencyMs: 3.4,
      errorRatePct: 0.001,
      bytesTransferredTotal: 128401920300
    },
    documentation: 'NIP-PACKET is the fundamental transmission unit of the Virtual Internet Protocol. Every packet carries cryptographic provenance and payload tamper-resistance.',
    codeSnippet: `// NIP-PACKET Construction
const packet = vip.packet.build({
  source: 'vnet://mesh-primary/vnode-fra-01/client',
  destination: 'vnet://neural.edge/inference',
  protocolId: 'VSP-SERVICE',
  payload: { prompt: 'Execute secure query' }
});`,
    createdAt: '2026-02-12T00:00:00Z',
    updatedAt: '2026-08-14T22:00:00Z'
  },
  {
    id: 'NIP-MESSAGING',
    code: 'NIP-MESSAGING',
    name: 'Messaging Protocol',
    rfcNumber: 'RFC-NIP-004',
    group: 'NIP',
    version: '1.7.0',
    description: 'Provides end-to-end encrypted pub/sub messaging channels, async mailbox buffers, and guaranteed message delivery acknowledgments.',
    status: 'ACTIVE',
    primaryTransport: 'WebSocket',
    supportedTransports: ['WebSocket', 'WebRTC', 'QUIC', 'TCP'],
    headerMagic: '0x4E49504D', // "NIPM"
    portDefault: 9204,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'EncryptedMessageSpec',
      type: 'object',
      properties: {
        channelUri: { type: 'string' },
        messageId: { type: 'string' },
        encryptedCiphertext: { type: 'string' },
        nonce: { type: 'string' }
      },
      required: ['channelUri', 'messageId', 'encryptedCiphertext']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 320,
      packetThroughputSec: 21400,
      avgLatencyMs: 5.6,
      errorRatePct: 0.000,
      bytesTransferredTotal: 48102940200
    },
    documentation: 'NIP-MESSAGING provides robust asynchronous and synchronous message delivery across unreliable physical transports.',
    codeSnippet: `// NIP-MESSAGING PubSub
await vip.messaging.publish('vnet://channels/telemetry', {
  event: 'NODE_HEARTBEAT',
  timestamp: Date.now()
});`,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-08-14T23:00:00Z'
  },
  {
    id: 'NIP-DISCOVERY',
    code: 'NIP-DISCOVERY',
    name: 'Discovery Protocol',
    rfcNumber: 'RFC-NIP-005',
    group: 'NIP',
    version: '2.0.0',
    description: 'Implements decentralized service advertisement, SRV record propagation, and latency-aware overlay neighbor discovery.',
    status: 'ACTIVE',
    primaryTransport: 'UDP',
    supportedTransports: ['UDP', 'WebRTC', 'WebSocket', 'QUIC'],
    headerMagic: '0x4E495044', // "NIPD"
    portDefault: 9205,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'ServiceDiscoverySpec',
      type: 'object',
      properties: {
        serviceUri: { type: 'string' },
        transportEndpoints: { type: 'array' },
        weight: { type: 'number' }
      },
      required: ['serviceUri', 'transportEndpoints']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'None',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: false,
      zeroKnowledgeProofSupported: false
    },
    metrics: {
      activeSessions: 460,
      packetThroughputSec: 19800,
      avgLatencyMs: 3.1,
      errorRatePct: 0.000,
      bytesTransferredTotal: 15401920300
    },
    documentation: 'NIP-DISCOVERY propagates service availability through multi-hop gossip broadcasts across the overlay topology.',
    codeSnippet: `// NIP-DISCOVERY Query
const endpoints = await vip.discovery.lookup('vnet://neural.edge/inference');
console.log('Available transport endpoints:', endpoints);`,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'NIP-ROUTING',
    code: 'NIP-ROUTING',
    name: 'Routing Protocol',
    rfcNumber: 'RFC-NIP-006',
    group: 'NIP',
    version: '2.3.1',
    description: 'Oversees hop-by-hop packet forwarding, route table convergence, and automated traffic re-routing around degraded transit links.',
    status: 'ACTIVE',
    primaryTransport: 'QUIC',
    supportedTransports: ['QUIC', 'UDP', 'TCP', 'WebSocket'],
    headerMagic: '0x4E495052', // "NIPR"
    portDefault: 9206,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'PacketForwardingSpec',
      type: 'object',
      properties: {
        nextHopNodeId: { type: 'string' },
        routeCost: { type: 'number' },
        ttlRemaining: { type: 'number' }
      },
      required: ['nextHopNodeId', 'routeCost']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 620,
      packetThroughputSec: 41200,
      avgLatencyMs: 4.8,
      errorRatePct: 0.001,
      bytesTransferredTotal: 94102940200
    },
    documentation: 'NIP-ROUTING executes decentralized overlay path finding with guaranteed loop prevention and minimum-latency optimization.',
    codeSnippet: `// NIP-ROUTING Forwarder
vip.router.onForwardPacket(async (pkt, next) => {
  console.log('Forwarding to next hop:', next.nodeId);
});`,
    createdAt: '2026-02-20T00:00:00Z',
    updatedAt: '2026-08-15T01:00:00Z'
  },
  {
    id: 'NIP-SERVICE',
    code: 'NIP-SERVICE',
    name: 'Service Protocol',
    rfcNumber: 'RFC-NIP-007',
    group: 'NIP',
    version: '1.8.0',
    description: 'Standardizes sovereign service contracts, typed RPC interfaces, and response streaming over VirtualPacket transports.',
    status: 'ACTIVE',
    primaryTransport: 'WebSocket',
    supportedTransports: ['WebSocket', 'HTTPS', 'QUIC', 'WebRTC'],
    headerMagic: '0x4E495053', // "NIPS"
    portDefault: 9207,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'RpcContractSpec',
      type: 'object',
      properties: {
        method: { type: 'string' },
        params: { type: 'object' },
        requestId: { type: 'string' }
      },
      required: ['method', 'requestId']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: false
    },
    metrics: {
      activeSessions: 290,
      packetThroughputSec: 18900,
      avgLatencyMs: 6.4,
      errorRatePct: 0.001,
      bytesTransferredTotal: 38910240100
    },
    documentation: 'NIP-SERVICE enables high-speed typed RPC execution directly across the Virtual Internet Protocol stack.',
    codeSnippet: `// NIP-SERVICE RPC Invocation
const result = await vip.rpc.call('vnet://neural.edge/inference', 'predict', {
  tensor: [0.12, 0.45, 0.88]
});`,
    createdAt: '2026-02-22T00:00:00Z',
    updatedAt: '2026-08-15T02:00:00Z'
  },
  {
    id: 'NIP-REGISTRY',
    code: 'NIP-REGISTRY',
    name: 'Registry Protocol',
    rfcNumber: 'RFC-NIP-008',
    group: 'NIP',
    version: '2.1.0',
    description: 'Maintains tamper-evident network, subnet, and domain ownership records backed by cryptographic consensus and smart contract anchors.',
    status: 'ACTIVE',
    primaryTransport: 'HTTPS',
    supportedTransports: ['HTTPS', 'QUIC', 'TCP'],
    headerMagic: '0x4E495047', // "NIPG"
    portDefault: 9208,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'OwnershipRegistrySpec',
      type: 'object',
      properties: {
        resourceUri: { type: 'string' },
        ownerIdentityDid: { type: 'string' },
        signatureProof: { type: 'string' },
        delegationToken: { type: 'string' }
      },
      required: ['resourceUri', 'ownerIdentityDid', 'signatureProof']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'AES-256-GCM',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 310,
      packetThroughputSec: 11400,
      avgLatencyMs: 4.9,
      errorRatePct: 0.000,
      bytesTransferredTotal: 24901820400
    },
    documentation: 'NIP-REGISTRY provides immutable, verifiable proof of network and resource ownership across all VIP participants.',
    codeSnippet: `// NIP-REGISTRY Ownership Verification
const proof = await vip.registry.verifyOwnership(
  'vnet://mesh-primary',
  'did:vip:ed25519:7F2e89A42a9b3112'
);
console.log('Ownership valid:', proof.isValid);`,
    createdAt: '2026-02-25T00:00:00Z',
    updatedAt: '2026-08-15T03:00:00Z'
  },
  {
    id: 'NIP-TRUST',
    code: 'NIP-TRUST',
    name: 'Trust Protocol',
    rfcNumber: 'RFC-NIP-009',
    group: 'NIP',
    version: '1.9.0',
    description: 'Computes peer reputation scores, handles delegated capability grants, and evaluates zero-knowledge access proofs.',
    status: 'ACTIVE',
    primaryTransport: 'HTTPS',
    supportedTransports: ['HTTPS', 'QUIC', 'WebSocket'],
    headerMagic: '0x4E495054', // "NIPT"
    portDefault: 9209,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'TrustCapabilitySpec',
      type: 'object',
      properties: {
        granteeDid: { type: 'string' },
        permissions: { type: 'array' },
        expiresAt: { type: 'string' },
        issuerSignature: { type: 'string' }
      },
      required: ['granteeDid', 'permissions', 'issuerSignature']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'Curve25519-ECDH',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 240,
      packetThroughputSec: 9800,
      avgLatencyMs: 5.2,
      errorRatePct: 0.000,
      bytesTransferredTotal: 18204910200
    },
    documentation: 'NIP-TRUST enforces granular role-based capabilities and delegated access tokens without centralized credentials.',
    codeSnippet: `// NIP-TRUST Capability Delegation
const grant = await vip.trust.delegate({
  granteeDid: 'did:vip:ed25519:operator-2',
  permissions: ['ROUTE', 'EXECUTE'],
  ttlSeconds: 86400
});`,
    createdAt: '2026-02-28T00:00:00Z',
    updatedAt: '2026-08-15T04:00:00Z'
  },
  {
    id: 'NIP-SECURITY',
    code: 'NIP-SECURITY',
    name: 'Security Protocol',
    rfcNumber: 'RFC-NIP-010',
    group: 'NIP',
    version: '2.6.0',
    description: 'Enforces Noise Protocol framework handshakes, ChaCha20-Poly1305 authenticated encryption, and forward-secrecy key rotation.',
    status: 'ACTIVE',
    primaryTransport: 'QUIC',
    supportedTransports: ['QUIC', 'UDP', 'TCP', 'WebSocket', 'WebRTC'],
    headerMagic: '0x4E495058', // "NIPX"
    portDefault: 9210,
    schemaVersion: 'draft-07',
    schemaDefinition: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'SecurityHandshakeSpec',
      type: 'object',
      properties: {
        handshakePattern: { type: 'string', enum: ['Noise_IK', 'Noise_XX', 'TLS_1_3'] },
        ephemeralPublicKey: { type: 'string' },
        authTag: { type: 'string' },
        timestamp: { type: 'string' }
      },
      required: ['handshakePattern', 'ephemeralPublicKey', 'authTag']
    },
    securityRequirements: {
      minTlsVersion: 'TLS 1.3 Strict',
      encryptionAlgorithm: 'ChaCha20-Poly1305',
      signatureAlgorithm: 'Ed25519',
      replayProtection: true,
      tamperEvidentTelemetry: true,
      zeroKnowledgeProofSupported: true
    },
    metrics: {
      activeSessions: 720,
      packetThroughputSec: 52400,
      avgLatencyMs: 2.8,
      errorRatePct: 0.000,
      bytesTransferredTotal: 158902840100
    },
    documentation: 'NIP-SECURITY provides military-grade authenticated encryption and zero-round-trip time (0-RTT) security handshakes over any underlying IP transport.',
    codeSnippet: `// NIP-SECURITY Handshake
const sessionKey = await vip.security.performHandshake({
  remoteNodeDid: 'did:vip:ed25519:vnode-fra-01',
  cipher: 'ChaCha20-Poly1305'
});`,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-08-15T05:00:00Z'
  }
];
