import {
  VIPUser,
  VirtualIdentity,
  VirtualNetwork,
  VIPSubnet,
  VIPNode,
  VIPServer,
  VIPDomainRecord,
  VIPPublishedService,
  VIPRouteLink,
  VIPTelemetryEntry,
  VIPTelemetrySummary,
  VIPProtocolSandboxTest
} from '../types/vip';

export const initialVipUsers: VIPUser[] = [
  {
    id: 'usr-prime-operator',
    email: 'drvictoragboola@gmail.com',
    name: 'Dr. Victor Agboola (Prime Operator)',
    role: 'super_admin',
    primaryIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    associatedNetworks: ['vnet-mesh-primary', 'vnet-enterprise-alpha', 'vnet-neural-edge'],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-node-relay-admin',
    email: 'relay-admin@vox-mesh.net',
    name: 'Sovereign Relay Custodian',
    role: 'network_operator',
    primaryIdentityDid: 'did:vip:ed25519:0x3B9c02d18471eA284094C991f851A07b538f9021',
    associatedNetworks: ['vnet-mesh-primary'],
    createdAt: '2026-01-05T00:00:00Z'
  }
];

export const initialVipIdentities: VirtualIdentity[] = [
  {
    did: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    algorithm: 'Ed25519',
    publicKey: 'ed25519_pk_7f2e89a42a9b3112028cef8109d4310e39a20b3c581a9f02e88a01124d',
    privateKeyMasked: 'ed25519_sk_••••••••••••••••••••••••••••••••7F2e89A4',
    ownerUserId: 'usr-prime-operator',
    alias: 'Prime Sovereign Root Anchor',
    reputationScore: 99.8,
    trustLevel: 'SOVEREIGN_ROOT',
    delegatedCapabilities: [
      {
        id: 'cap-root-all',
        issuerDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
        granteeDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
        resourceUri: 'vnet://*/*',
        permissions: ['ADMIN', 'READ', 'WRITE', 'ROUTE', 'EXECUTE', 'DELEGATE'],
        issuedAt: '2026-01-01T00:00:00Z',
        expiresAt: '2030-01-01T00:00:00Z',
        signature: 'sig_ed25519_root_master_7f2e89a',
        revoked: false
      }
    ],
    attestationProofs: [
      'proof_merkle_anchor_btc_block_894021',
      'proof_hardware_tpm2_attestation_verified'
    ],
    createdAt: '2026-01-01T00:00:00Z',
    lastActive: '2026-08-15T00:25:00Z'
  },
  {
    did: 'did:vip:ed25519:0x3B9c02d18471eA284094C991f851A07b538f9021',
    algorithm: 'Ed25519',
    publicKey: 'ed25519_pk_3b9c02d18471ea284094c991f851a07b538f90210081ab23fe90124c',
    privateKeyMasked: 'ed25519_sk_••••••••••••••••••••••••••••••••3B9c02d1',
    ownerUserId: 'usr-node-relay-admin',
    alias: 'Frankfurt Core Gateway Node Anchor',
    reputationScore: 98.4,
    trustLevel: 'VERIFIED_OPERATOR',
    delegatedCapabilities: [
      {
        id: 'cap-fra-routing',
        issuerDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
        granteeDid: 'did:vip:ed25519:0x3B9c02d18471eA284094C991f851A07b538f9021',
        resourceUri: 'vnet://mesh-primary/sub-eu-central/*',
        permissions: ['READ', 'ROUTE', 'EXECUTE'],
        issuedAt: '2026-01-10T00:00:00Z',
        expiresAt: '2028-01-10T00:00:00Z',
        signature: 'sig_ed25519_delegated_fra_3b9',
        revoked: false
      }
    ],
    attestationProofs: [
      'proof_datacenter_iso27001_signed'
    ],
    createdAt: '2026-01-05T00:00:00Z',
    lastActive: '2026-08-15T00:28:00Z'
  },
  {
    did: 'did:vip:secp256k1:0x91D03e87B11c0A947388C8058E3d15409d22B812',
    algorithm: 'Secp256k1',
    publicKey: 'secp256k1_pk_0491d03e87b11c0a947388c8058e3d15409d22b812f8290012e841ba',
    privateKeyMasked: 'secp256k1_sk_••••••••••••••••••••••••••••••••91D03e87',
    ownerUserId: 'usr-prime-operator',
    alias: 'Neural AI Inference Engine Anchor',
    reputationScore: 97.9,
    trustLevel: 'VERIFIED_OPERATOR',
    delegatedCapabilities: [],
    attestationProofs: ['proof_sgx_enclave_quote_v3'],
    createdAt: '2026-01-15T00:00:00Z',
    lastActive: '2026-08-15T00:29:00Z'
  }
];

export const initialVirtualNetworks: VirtualNetwork[] = [
  {
    id: 'vnet-mesh-primary',
    vnetUri: 'vnet://mesh-primary',
    name: 'Intentional Infrastructure Network Sovereign Mesh',
    ownerIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    ownerName: 'Dr. Victor Agboola',
    description: 'Core decentralized overlay internet operating multi-hop encrypted transport tunnels over UDP/QUIC/TCP.',
    cidrBlock: '10.240.0.0/12',
    overlayProtocol: 'VIP-Noise-Encrypted',
    defaultTransport: 'QUIC',
    status: 'ACTIVE',
    encryptionCipher: 'ChaCha20-Poly1305',
    accessPolicy: 'PERMISSIONED_CONSORTIUM',
    consensusMechanism: 'PROOF_OF_BANDWIDTH',
    subnetsCount: 4,
    nodesCount: 8,
    serversCount: 12,
    servicesCount: 16,
    totalPacketsProcessed: 894021200,
    bandwidthMbpsCapacity: 100000,
    avgLatencyMs: 8.4,
    healthScorePct: 99.8,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'vnet-enterprise-alpha',
    vnetUri: 'vnet://enterprise-alpha',
    name: 'Zero-Trust Enterprise Compute Net',
    ownerIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    ownerName: 'Dr. Victor Agboola',
    description: 'Ultra-low latency private overlay with hardware TPM attestation and deterministic packet isolation.',
    cidrBlock: '10.128.0.0/14',
    overlayProtocol: 'VIP-Overlay-v1',
    defaultTransport: 'TCP',
    status: 'ACTIVE',
    encryptionCipher: 'AES-256-GCM',
    accessPolicy: 'PRIVATE_ISOLATED',
    consensusMechanism: 'PROOF_OF_AUTHORITY',
    subnetsCount: 2,
    nodesCount: 4,
    serversCount: 6,
    servicesCount: 8,
    totalPacketsProcessed: 341029100,
    bandwidthMbpsCapacity: 50000,
    avgLatencyMs: 4.2,
    healthScorePct: 100,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'vnet-neural-edge',
    vnetUri: 'vnet://neural-edge',
    name: 'Decentralized Neural AI Inference Mesh',
    ownerIdentityDid: 'did:vip:secp256k1:0x91D03e87B11c0A947388C8058E3d15409d22B812',
    ownerName: 'Neural AI Anchor',
    description: 'High-throughput tensor streaming and distributed vector memory overlay running across edge nodes.',
    cidrBlock: '10.200.0.0/14',
    overlayProtocol: 'VIP-Mesh-Zero',
    defaultTransport: 'QUIC',
    status: 'ACTIVE',
    encryptionCipher: 'ChaCha20-Poly1305',
    accessPolicy: 'PUBLIC_OPEN',
    consensusMechanism: 'BYZANTINE_FAULT_TOLERANT',
    subnetsCount: 3,
    nodesCount: 6,
    serversCount: 8,
    servicesCount: 10,
    totalPacketsProcessed: 512048900,
    bandwidthMbpsCapacity: 80000,
    avgLatencyMs: 6.1,
    healthScorePct: 99.4,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  }
];

export const initialVipSubnets: VIPSubnet[] = [
  {
    id: 'vsub-eu-central',
    networkId: 'vnet-mesh-primary',
    vnetUri: 'vnet://mesh-primary/sub-eu-central',
    name: 'EU Central Core Subnet',
    cidr: '10.240.10.0/24',
    region: 'eu-central-1 (Frankfurt)',
    overlayMtu: 1420,
    status: 'ONLINE',
    encryptionState: 'ENABLED_CHACHA20',
    assignedNodes: ['vnode-fra-01', 'vnode-fra-02'],
    gatewayNodeId: 'vnode-fra-01',
    routingTableEntriesCount: 32,
    bandwidthUtilizationPct: 42.5,
    packetLossPct: 0.000,
    createdAt: '2026-01-02T00:00:00Z'
  },
  {
    id: 'vsub-us-east',
    networkId: 'vnet-mesh-primary',
    vnetUri: 'vnet://mesh-primary/sub-us-east',
    name: 'US East Backbone Subnet',
    cidr: '10.240.20.0/24',
    region: 'us-east-1 (N. Virginia)',
    overlayMtu: 1420,
    status: 'ONLINE',
    encryptionState: 'ENABLED_CHACHA20',
    assignedNodes: ['vnode-iad-01', 'vnode-iad-02'],
    gatewayNodeId: 'vnode-iad-01',
    routingTableEntriesCount: 28,
    bandwidthUtilizationPct: 58.1,
    packetLossPct: 0.001,
    createdAt: '2026-01-02T00:00:00Z'
  },
  {
    id: 'vsub-ap-southeast',
    networkId: 'vnet-mesh-primary',
    vnetUri: 'vnet://mesh-primary/sub-ap-southeast',
    name: 'AP SouthEast Gateway Subnet',
    cidr: '10.240.30.0/24',
    region: 'ap-southeast-1 (Singapore)',
    overlayMtu: 1420,
    status: 'ONLINE',
    encryptionState: 'ENABLED_NOISE_IK',
    assignedNodes: ['vnode-sin-01', 'vnode-sin-02'],
    gatewayNodeId: 'vnode-sin-01',
    routingTableEntriesCount: 24,
    bandwidthUtilizationPct: 36.8,
    packetLossPct: 0.000,
    createdAt: '2026-01-04T00:00:00Z'
  },
  {
    id: 'vsub-ai-neural',
    networkId: 'vnet-neural-edge',
    vnetUri: 'vnet://neural-edge/sub-compute',
    name: 'Neural Accelerator Subnet',
    cidr: '10.200.1.0/24',
    region: 'us-west-2 (Oregon)',
    overlayMtu: 9000, // Jumbo frames for GPU interconnect
    status: 'ONLINE',
    encryptionState: 'ENABLED_CHACHA20',
    assignedNodes: ['vnode-pdx-ai-01', 'vnode-pdx-ai-02'],
    gatewayNodeId: 'vnode-pdx-ai-01',
    routingTableEntriesCount: 18,
    bandwidthUtilizationPct: 74.2,
    packetLossPct: 0.000,
    createdAt: '2026-02-02T00:00:00Z'
  }
];

export const initialVipNodes: VIPNode[] = [
  {
    id: 'vnode-fra-01',
    networkId: 'vnet-mesh-primary',
    subnetId: 'vsub-eu-central',
    vnetUri: 'vnet://mesh-primary/sub-eu-central/vnode-fra-01',
    name: 'Frankfurt-Edge-Master-01',
    nodeIdentityDid: 'did:vip:ed25519:0x3B9c02d18471eA284094C991f851A07b538f9021',
    physicalTransportBinding: {
      ipAddress: '194.126.110.42',
      port: 9001,
      protocol: 'QUIC',
      publicDns: 'fra-node01.vip.vox-mesh.net'
    },
    role: 'GATEWAY',
    status: 'ONLINE',
    hardwareSpecs: {
      cpuCores: 64,
      totalRamGB: 256,
      diskType: 'NVMe Gen4 Enterprise (PCIe 4.0)',
      nicSpeedGbps: 40
    },
    resourceUsage: {
      cpuPct: 18.5,
      ramPct: 34.2,
      diskPct: 22.0,
      networkRxMbps: 4820.5,
      networkTxMbps: 5120.8
    },
    healthScore: 99.8,
    latencyToGatewayMs: 1.2,
    attachedServersCount: 3,
    createdAt: '2026-01-02T00:00:00Z'
  },
  {
    id: 'vnode-iad-01',
    networkId: 'vnet-mesh-primary',
    subnetId: 'vsub-us-east',
    vnetUri: 'vnet://mesh-primary/sub-us-east/vnode-iad-01',
    name: 'Virginia-Backbone-Relay-01',
    nodeIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    physicalTransportBinding: {
      ipAddress: '198.51.100.88',
      port: 9002,
      protocol: 'TCP',
      publicDns: 'iad-node01.vip.vox-mesh.net'
    },
    role: 'EDGE_ROUTER',
    status: 'ONLINE',
    hardwareSpecs: {
      cpuCores: 32,
      totalRamGB: 128,
      diskType: 'NVMe Gen4',
      nicSpeedGbps: 25
    },
    resourceUsage: {
      cpuPct: 24.1,
      ramPct: 41.5,
      diskPct: 31.2,
      networkRxMbps: 3120.0,
      networkTxMbps: 2980.4
    },
    healthScore: 99.2,
    latencyToGatewayMs: 2.1,
    attachedServersCount: 3,
    createdAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'vnode-sin-01',
    networkId: 'vnet-mesh-primary',
    subnetId: 'vsub-ap-southeast',
    vnetUri: 'vnet://mesh-primary/sub-ap-southeast/vnode-sin-01',
    name: 'Singapore-Edge-Gateway-01',
    nodeIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    physicalTransportBinding: {
      ipAddress: '203.0.113.15',
      port: 9003,
      protocol: 'QUIC',
      publicDns: 'sin-node01.vip.vox-mesh.net'
    },
    role: 'GATEWAY',
    status: 'ONLINE',
    hardwareSpecs: {
      cpuCores: 32,
      totalRamGB: 128,
      diskType: 'NVMe Gen4',
      nicSpeedGbps: 20
    },
    resourceUsage: {
      cpuPct: 14.8,
      ramPct: 28.0,
      diskPct: 19.5,
      networkRxMbps: 1840.5,
      networkTxMbps: 1920.1
    },
    healthScore: 99.5,
    latencyToGatewayMs: 1.8,
    attachedServersCount: 2,
    createdAt: '2026-01-04T00:00:00Z'
  },
  {
    id: 'vnode-pdx-ai-01',
    networkId: 'vnet-neural-edge',
    subnetId: 'vsub-ai-neural',
    vnetUri: 'vnet://neural-edge/sub-compute/vnode-pdx-ai-01',
    name: 'Oregon-H100-Tensor-Cluster-01',
    nodeIdentityDid: 'did:vip:secp256k1:0x91D03e87B11c0A947388C8058E3d15409d22B812',
    physicalTransportBinding: {
      ipAddress: '192.0.2.77',
      port: 9004,
      protocol: 'QUIC',
      publicDns: 'pdx-ai01.vip.vox-mesh.net'
    },
    role: 'COMPUTE_HOST',
    status: 'ONLINE',
    hardwareSpecs: {
      cpuCores: 128,
      totalRamGB: 512,
      diskType: 'NVMe Gen5 Enterprise Array',
      nicSpeedGbps: 100
    },
    resourceUsage: {
      cpuPct: 62.4,
      ramPct: 68.9,
      diskPct: 44.1,
      networkRxMbps: 12400.0,
      networkTxMbps: 11800.0
    },
    healthScore: 99.9,
    latencyToGatewayMs: 0.8,
    attachedServersCount: 4,
    createdAt: '2026-02-02T00:00:00Z'
  }
];

export const initialVipServers: VIPServer[] = [
  {
    id: 'vsrv-neural-gateway',
    networkId: 'vnet-mesh-primary',
    subnetId: 'vsub-eu-central',
    nodeId: 'vnode-fra-01',
    vnetUri: 'vnet://mesh-primary/sub-eu-central/vnode-fra-01/vsrv-neural',
    name: 'Neural Gateway Server (Primary)',
    domainBindingUri: 'vnet://neural.edge/compute',
    serverIdentityDid: 'did:vip:ed25519:0x3B9c02d18471eA284094C991f851A07b538f9021',
    osEngine: 'Alpine VIP Microkernel v24.2',
    vCpu: 16,
    ramMB: 32768,
    storageGB: 1000,
    status: 'ACTIVE',
    publishedServices: [],
    uptimeSeconds: 894000,
    cpuUsagePct: 22.4,
    ramUsageMB: 8192,
    replicationFactor: 3,
    createdAt: '2026-01-05T00:00:00Z',
    lastHeartbeat: '2026-08-15T00:29:45Z'
  },
  {
    id: 'vsrv-vault-auth',
    networkId: 'vnet-mesh-primary',
    subnetId: 'vsub-us-east',
    nodeId: 'vnode-iad-01',
    vnetUri: 'vnet://mesh-primary/sub-us-east/vnode-iad-01/vsrv-vault',
    name: 'Sovereign Cryptographic Vault Server',
    domainBindingUri: 'vnet://vault.secure/auth',
    serverIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    osEngine: 'Ubuntu 24.04 Hardened VIP Server',
    vCpu: 8,
    ramMB: 16384,
    storageGB: 500,
    status: 'ACTIVE',
    publishedServices: [],
    uptimeSeconds: 1420000,
    cpuUsagePct: 12.1,
    ramUsageMB: 4096,
    replicationFactor: 3,
    createdAt: '2026-01-06T00:00:00Z',
    lastHeartbeat: '2026-08-15T00:29:50Z'
  },
  {
    id: 'vsrv-p2p-relay',
    networkId: 'vnet-mesh-primary',
    subnetId: 'vsub-ap-southeast',
    nodeId: 'vnode-sin-01',
    vnetUri: 'vnet://mesh-primary/sub-ap-southeast/vnode-sin-01/vsrv-relay',
    name: 'High-Speed WebRTC Relay Server',
    domainBindingUri: 'vnet://stream.media/relay',
    serverIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    osEngine: 'Alpine VIP Microkernel v24.2',
    vCpu: 12,
    ramMB: 24576,
    storageGB: 250,
    status: 'ACTIVE',
    publishedServices: [],
    uptimeSeconds: 680000,
    cpuUsagePct: 18.9,
    ramUsageMB: 6144,
    replicationFactor: 2,
    createdAt: '2026-01-08T00:00:00Z',
    lastHeartbeat: '2026-08-15T00:29:55Z'
  },
  {
    id: 'vsrv-ai-inference-worker',
    networkId: 'vnet-neural-edge',
    subnetId: 'vsub-ai-neural',
    nodeId: 'vnode-pdx-ai-01',
    vnetUri: 'vnet://neural-edge/sub-compute/vnode-pdx-ai-01/vsrv-inference',
    name: 'Distributed Tensor Pipeline Host',
    domainBindingUri: 'vnet://ai.compute/inference',
    serverIdentityDid: 'did:vip:secp256k1:0x91D03e87B11c0A947388C8058E3d15409d22B812',
    osEngine: 'NVIDIA CUDA Linux VIP Kernel',
    vCpu: 64,
    ramMB: 262144,
    storageGB: 4000,
    status: 'ACTIVE',
    publishedServices: [],
    uptimeSeconds: 980000,
    cpuUsagePct: 54.8,
    ramUsageMB: 98304,
    replicationFactor: 2,
    createdAt: '2026-02-03T00:00:00Z',
    lastHeartbeat: '2026-08-15T00:30:00Z'
  }
];

export const initialVipDomains: VIPDomainRecord[] = [
  {
    id: 'dom-neural-edge',
    domain: 'neural.edge',
    vnetAddress: 'vnet://neural.edge',
    ownerIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    ownerName: 'Dr. Victor Agboola',
    targetNetworkId: 'vnet-mesh-primary',
    targetSubnetId: 'vsub-eu-central',
    targetNodeId: 'vnode-fra-01',
    targetServerId: 'vsrv-neural-gateway',
    status: 'VERIFIED',
    zoneRecords: [
      { type: 'VIP_A', name: '@', value: '10.240.10.12', ttlSec: 300 },
      { type: 'VIP_SRV', name: '_inference._tcp', value: '10.240.10.12:9106', ttlSec: 300 },
      { type: 'VIP_DID', name: '@', value: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C', ttlSec: 3600 },
      { type: 'VIP_TXT', name: '@', value: 'vip-zone-auth=provenance_verified', ttlSec: 3600 }
    ],
    dnssecProof: 'dnssec_sig_ed25519_neural_edge_zone_99a',
    signatureProof: 'sig_ed25519_domain_owner_7f2e89a',
    accessPolicy: 'PUBLIC_OPEN',
    trafficQueries24h: 148200,
    createdAt: '2026-01-10T00:00:00Z',
    expiresAt: '2036-01-10T00:00:00Z'
  },
  {
    id: 'dom-vault-secure',
    domain: 'vault.secure',
    vnetAddress: 'vnet://vault.secure',
    ownerIdentityDid: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
    ownerName: 'Dr. Victor Agboola',
    targetNetworkId: 'vnet-mesh-primary',
    targetSubnetId: 'vsub-us-east',
    targetNodeId: 'vnode-iad-01',
    targetServerId: 'vsrv-vault-auth',
    status: 'VERIFIED',
    zoneRecords: [
      { type: 'VIP_A', name: '@', value: '10.240.20.15', ttlSec: 300 },
      { type: 'VIP_SRV', name: '_auth._https', value: '10.240.20.15:9103', ttlSec: 300 },
      { type: 'VIP_DID', name: '@', value: 'did:vip:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C', ttlSec: 3600 }
    ],
    dnssecProof: 'dnssec_sig_ed25519_vault_secure_zone_11b',
    signatureProof: 'sig_ed25519_domain_owner_7f2e89a',
    accessPolicy: 'SIGNATURE_CHALLENGE',
    trafficQueries24h: 84900,
    createdAt: '2026-01-12T00:00:00Z',
    expiresAt: '2036-01-12T00:00:00Z'
  },
  {
    id: 'dom-ai-compute',
    domain: 'ai.compute',
    vnetAddress: 'vnet://ai.compute',
    ownerIdentityDid: 'did:vip:secp256k1:0x91D03e87B11c0A947388C8058E3d15409d22B812',
    ownerName: 'Neural AI Anchor',
    targetNetworkId: 'vnet-neural-edge',
    targetSubnetId: 'vsub-ai-neural',
    targetNodeId: 'vnode-pdx-ai-01',
    targetServerId: 'vsrv-ai-inference-worker',
    status: 'VERIFIED',
    zoneRecords: [
      { type: 'VIP_A', name: '@', value: '10.200.1.5', ttlSec: 300 },
      { type: 'VIP_SRV', name: '_inference._quic', value: '10.200.1.5:9106', ttlSec: 300 },
      { type: 'VIP_DID', name: '@', value: 'did:vip:secp256k1:0x91D03e87B11c0A947388C8058E3d15409d22B812', ttlSec: 3600 }
    ],
    dnssecProof: 'dnssec_sig_secp256k1_ai_compute_zone_77f',
    signatureProof: 'sig_secp256k1_domain_owner_91d03',
    accessPolicy: 'PUBLIC_OPEN',
    trafficQueries24h: 312000,
    createdAt: '2026-02-05T00:00:00Z',
    expiresAt: '2036-02-05T00:00:00Z'
  }
];

export const initialVipServices: VIPPublishedService[] = [
  {
    id: 'vsvc-neural-predict',
    serverId: 'vsrv-neural-gateway',
    serverName: 'Neural Gateway Server (Primary)',
    nodeId: 'vnode-fra-01',
    domain: 'neural.edge',
    serviceName: 'inference',
    vnetUri: 'vnet://neural.edge/inference',
    protocolId: 'VSP-SERVICE',
    transport: 'WebSocket',
    port: 9106,
    endpointPath: '/v1/predict',
    status: 'ONLINE',
    authRequired: false,
    rateLimitReqSec: 500,
    activeSubscribers: 142,
    avgLatencyMs: 6.8,
    metrics: {
      totalRequests: 14280190,
      errorCount: 12,
      bandwidthKbps: 4820
    },
    metadata: {
      modelFamily: 'Gemini-VIP-Edge-v3',
      accelerator: 'TensorCore Optimized'
    },
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'vsvc-vault-tokens',
    serverId: 'vsrv-vault-auth',
    serverName: 'Sovereign Cryptographic Vault Server',
    nodeId: 'vnode-iad-01',
    domain: 'vault.secure',
    serviceName: 'auth',
    vnetUri: 'vnet://vault.secure/auth',
    protocolId: 'NIP-TRUST',
    transport: 'HTTPS',
    port: 9103,
    endpointPath: '/v1/challenge',
    status: 'ONLINE',
    authRequired: true,
    rateLimitReqSec: 200,
    activeSubscribers: 88,
    avgLatencyMs: 4.2,
    metrics: {
      totalRequests: 8940200,
      errorCount: 2,
      bandwidthKbps: 1820
    },
    metadata: {
      cryptoScheme: 'Ed25519-ZeroKnowledge'
    },
    createdAt: '2026-01-16T00:00:00Z'
  },
  {
    id: 'vsvc-p2p-webrtc',
    serverId: 'vsrv-p2p-relay',
    serverName: 'High-Speed WebRTC Relay Server',
    nodeId: 'vnode-sin-01',
    domain: 'stream.media',
    serviceName: 'relay',
    vnetUri: 'vnet://stream.media/relay',
    protocolId: 'NIP-MESSAGING',
    transport: 'WebRTC',
    port: 9204,
    endpointPath: '/v1/stream',
    status: 'ONLINE',
    authRequired: false,
    rateLimitReqSec: 1000,
    activeSubscribers: 260,
    avgLatencyMs: 3.5,
    metrics: {
      totalRequests: 38204900,
      errorCount: 8,
      bandwidthKbps: 18400
    },
    metadata: {
      codec: 'Opus-AV1-VIP-Stream'
    },
    createdAt: '2026-01-20T00:00:00Z'
  },
  {
    id: 'vsvc-tensor-inference',
    serverId: 'vsrv-ai-inference-worker',
    serverName: 'Distributed Tensor Pipeline Host',
    nodeId: 'vnode-pdx-ai-01',
    domain: 'ai.compute',
    serviceName: 'inference',
    vnetUri: 'vnet://ai.compute/inference',
    protocolId: 'VSP-SERVICE',
    transport: 'QUIC',
    port: 9106,
    endpointPath: '/v1/tensor-exec',
    status: 'ONLINE',
    authRequired: false,
    rateLimitReqSec: 2000,
    activeSubscribers: 420,
    avgLatencyMs: 2.9,
    metrics: {
      totalRequests: 98401200,
      errorCount: 4,
      bandwidthKbps: 64200
    },
    metadata: {
      gpuCount: '8x NVIDIA H100 SXM5',
      tflops: '15800'
    },
    createdAt: '2026-02-05T00:00:00Z'
  }
];

export const initialVipRouteLinks: VIPRouteLink[] = [
  {
    id: 'link-fra-iad',
    sourceNodeId: 'vnode-fra-01',
    targetNodeId: 'vnode-iad-01',
    transport: 'QUIC',
    latencyMs: 74.2,
    bandwidthMbps: 40000,
    reliabilityPct: 99.99,
    costWeight: 1.2,
    isEncrypted: true,
    status: 'ACTIVE'
  },
  {
    id: 'link-iad-sin',
    sourceNodeId: 'vnode-iad-01',
    targetNodeId: 'vnode-sin-01',
    transport: 'QUIC',
    latencyMs: 182.5,
    bandwidthMbps: 20000,
    reliabilityPct: 99.95,
    costWeight: 2.4,
    isEncrypted: true,
    status: 'ACTIVE'
  },
  {
    id: 'link-fra-sin',
    sourceNodeId: 'vnode-fra-01',
    targetNodeId: 'vnode-sin-01',
    transport: 'TCP',
    latencyMs: 148.1,
    bandwidthMbps: 25000,
    reliabilityPct: 99.98,
    costWeight: 1.8,
    isEncrypted: true,
    status: 'ACTIVE'
  },
  {
    id: 'link-iad-pdx',
    sourceNodeId: 'vnode-iad-01',
    targetNodeId: 'vnode-pdx-ai-01',
    transport: 'QUIC',
    latencyMs: 52.8,
    bandwidthMbps: 80000,
    reliabilityPct: 100.0,
    costWeight: 1.0,
    isEncrypted: true,
    status: 'ACTIVE'
  }
];

export const initialVipTelemetryLogs: VIPTelemetryEntry[] = [
  {
    id: 'telem-blk-10482',
    sequenceNumber: 10482,
    timestamp: '2026-08-15T00:28:40.120Z',
    networkId: 'vnet-mesh-primary',
    nodeId: 'vnode-fra-01',
    protocolId: 'NIP-PACKET',
    metricType: 'PACKET_INSPECTION',
    metrics: {
      latencyMs: 6.8,
      packetCount: 1420,
      bytes: 849020,
      errorRate: 0.000,
      cpuPct: 18.5,
      ramPct: 34.2
    },
    details: 'Forwarded batch of 1,420 VirtualPackets from vnet://mesh-primary/sub-eu-central to vnet://neural.edge/inference. Cryptographic signatures validated 100%.',
    previousHash: '0x8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732',
    entryHash: '0x3e2b1a908d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a',
    merkleRoot: '0x7a0d3c8091f2b47e610a887b9e3420df67d8001345ab890de23f0101aceb6621',
    validatorSignature: 'sig_ed25519_fra_validator_3b9c02d',
    isTamperEvident: true
  },
  {
    id: 'telem-blk-10481',
    sequenceNumber: 10481,
    timestamp: '2026-08-15T00:27:10.840Z',
    networkId: 'vnet-neural-edge',
    nodeId: 'vnode-pdx-ai-01',
    protocolId: 'VSP-SERVICE',
    metricType: 'SERVICE_INVOCATION',
    metrics: {
      latencyMs: 2.9,
      packetCount: 890,
      bytes: 12408900,
      errorRate: 0.000,
      cpuPct: 62.4,
      ramPct: 68.9
    },
    details: 'Executed GPU tensor pipeline RPC for vnet://ai.compute/inference. RTT 2.9ms over QUIC transport adapter.',
    previousHash: '0x7a0d3c8091f2b47e610a887b9e3420df67d8001345ab890de23f0101aceb6621',
    entryHash: '0x8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732',
    merkleRoot: '0x2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a908d7c6b5a4f3e2d1c0b',
    validatorSignature: 'sig_secp256k1_ai_validator_91d03',
    isTamperEvident: true
  },
  {
    id: 'telem-blk-10480',
    sequenceNumber: 10480,
    timestamp: '2026-08-15T00:25:30.010Z',
    networkId: 'vnet-mesh-primary',
    nodeId: 'vnode-iad-01',
    protocolId: 'NIP-TRUST',
    metricType: 'SECURITY_CHALLENGE',
    metrics: {
      latencyMs: 4.2,
      packetCount: 310,
      bytes: 142000,
      errorRate: 0.000,
      cpuPct: 24.1,
      ramPct: 41.5
    },
    details: 'Verified Ed25519 delegated access token capability for did:vip:ed25519:0x3B9c02d1. Access authorized to sub-eu-central.',
    previousHash: '0x2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a908d7c6b5a4f3e2d1c0b',
    entryHash: '0x7a0d3c8091f2b47e610a887b9e3420df67d8001345ab890de23f0101aceb6621',
    merkleRoot: '0x6f9c2b7080e1a36d509a776a8d2310ce56c7000234ea789cd12e0000zbda5510',
    validatorSignature: 'sig_ed25519_iad_validator_7f2e8',
    isTamperEvident: true
  }
];

export const initialVipTelemetrySummary: VIPTelemetrySummary = {
  overallHealthScore: 99.8,
  activeNetworksCount: 3,
  onlineNodesCount: 4,
  activeServersCount: 4,
  liveServicesCount: 4,
  currentThroughputPacketsSec: 48200,
  avgMeshLatencyMs: 5.6,
  overallPacketLossPct: 0.0005,
  totalTamperEvidentBlocks: 10482,
  cryptographicIntegrityStatus: 'VERIFIED_CHAIN_INTACT'
};

export const initialVipSandboxTests: VIPProtocolSandboxTest[] = [
  {
    id: 'test-packet-e2e',
    name: 'VirtualPacket Wire Protocol E2E Loopback',
    description: 'Constructs signed VirtualPacket, injects into QUIC overlay transport, routes across 3 nodes, and verifies signature + payload integrity.',
    targetProtocol: 'NIP-PACKET',
    testCategory: 'PACKET_INJECTION',
    config: {
      sourceAddress: 'vnet://mesh-primary/sub-eu-central/vnode-fra-01/client',
      destinationAddress: 'vnet://neural.edge/inference',
      packetCount: 100,
      payloadSizeKB: 4,
      simulatePacketLossPct: 0,
      simulateJitterMs: 2,
      corruptSignatures: false,
      transportAdapter: 'QUIC'
    },
    status: 'PASSED',
    result: {
      packetsSent: 100,
      packetsReceived: 100,
      packetsDropped: 0,
      avgRttMs: 6.4,
      minRttMs: 5.1,
      maxRttMs: 8.9,
      signatureVerificationPassed: true,
      tamperDetectionTriggered: false,
      logs: [
        '[VIP SANDBOX] Initialized QUIC transport adapter on port 9203',
        '[VIP SANDBOX] Generated Ed25519 test keypair (did:vip:ed25519:test_client)',
        '[VIP SANDBOX] Crafted 100 VirtualPackets with magic 0x56495031',
        '[VIP SANDBOX] Multi-hop route: vnode-fra-01 -> vnode-iad-01 -> vsrv-neural-gateway',
        '[VIP SANDBOX] All 100/100 packets verified and acknowledged in 640ms'
      ],
      durationMs: 640,
      executedAt: '2026-08-15T00:20:00Z'
    }
  },
  {
    id: 'test-tamper-detection',
    name: 'Tamper-Evident Payload Fuzzing & Detection',
    description: 'Injects corrupt byte into encrypted payload in transit to verify that receiver cryptographic validation immediately flags and drops the packet.',
    targetProtocol: 'NIP-SECURITY',
    testCategory: 'SECURITY_CIPHER_BENCHMARK',
    config: {
      sourceAddress: 'vnet://mesh-primary/sub-us-east/vnode-iad-01/fuzzer',
      destinationAddress: 'vnet://vault.secure/auth',
      packetCount: 20,
      payloadSizeKB: 8,
      simulatePacketLossPct: 0,
      simulateJitterMs: 5,
      corruptSignatures: true,
      transportAdapter: 'HTTPS'
    },
    status: 'PASSED',
    result: {
      packetsSent: 20,
      packetsReceived: 0,
      packetsDropped: 20,
      avgRttMs: 3.8,
      minRttMs: 3.2,
      maxRttMs: 4.6,
      signatureVerificationPassed: false,
      tamperDetectionTriggered: true,
      logs: [
        '[VIP SANDBOX] Corrupted signature bytes injected into 20 test packets',
        '[VIP SANDBOX] Destination node performed Ed25519 signature verification',
        '[VIP SANDBOX] 20/20 packets REJECTED with error: SIG_VERIFICATION_FAILED',
        '[VIP SANDBOX] Tamper-evident audit block #10483 logged with anomaly flag'
      ],
      durationMs: 76,
      executedAt: '2026-08-15T00:22:00Z'
    }
  },
  {
    id: 'test-dijkstra-failover',
    name: 'Dynamic Route Convergence & Link Failover',
    description: 'Simulates severing physical link between Frankfurt and Virginia to test sub-10ms rerouting through Singapore gateway.',
    targetProtocol: 'VSP-ROUTING',
    testCategory: 'ROUTE_CONVERGENCE',
    config: {
      sourceAddress: 'vnet://mesh-primary/sub-eu-central/vnode-fra-01/probe',
      destinationAddress: 'vnet://mesh-primary/sub-us-east/vnode-iad-01/probe',
      packetCount: 50,
      payloadSizeKB: 2,
      simulatePacketLossPct: 0,
      simulateJitterMs: 3,
      corruptSignatures: false,
      transportAdapter: 'UDP'
    },
    status: 'READY'
  }
];

// Convenience alias exports for studio state initialization
export const vipNetworks = initialVirtualNetworks;
export const vipNodes = initialVipNodes;
export const vipServers = initialVipServers;
export const vipSubnets = initialVipSubnets;
export const vipDomains = initialVipDomains;
export const vipServices = initialVipServices;
export const vipIdentities = initialVipIdentities;
export const vipTelemetryLogs = initialVipTelemetryLogs;
export const vipTelemetrySummary = initialVipTelemetrySummary;
export const vipSandboxTests = initialVipSandboxTests;
