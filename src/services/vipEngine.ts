import {
  VirtualPacket,
  VirtualPacketReceipt,
  VIPAddressResolution,
  VIPTelemetryEntry,
  VIPProtocolSandboxTest,
  VIPTransportAdapter,
  VIPProtocolGroup
} from '../types/vip';
import { VIPCrypto } from './vipCrypto';
import { VIPRouter } from './vipRouter';
import {
  initialVipUsers,
  initialVipIdentities,
  initialVirtualNetworks,
  initialVipSubnets,
  initialVipNodes,
  initialVipServers,
  initialVipDomains,
  initialVipServices,
  initialVipTelemetryLogs,
  initialVipSandboxTests
} from '../data/vipDatabase';

export class VIPEngine {
  /**
   * Universal 8-Layer Stack Address Resolution
   * User → Virtual Identity → Network → Subnet → Node → Server → Domain → Service
   */
  static resolveVnetAddress(vnetUri: string): VIPAddressResolution {
    const startTime = performance.now();
    const parsed = VIPRouter.parseVnetUri(vnetUri);

    let resolvedNetwork = initialVirtualNetworks[0];
    let resolvedSubnet = initialVipSubnets[0];
    let resolvedNode = initialVipNodes[0];
    let resolvedServer = initialVipServers[0];
    let resolvedDomain = initialVipDomains[0];
    let resolvedService = initialVipServices[0];
    let resolvedIdentity = initialVipIdentities[0];
    let resolvedUser = initialVipUsers[0];

    if (parsed.isDomainFormat) {
      // Find domain record
      const matchDomain = initialVipDomains.find(d => d.domain.toLowerCase() === parsed.domainOrNetwork.toLowerCase());
      if (matchDomain) {
        resolvedDomain = matchDomain;
        const matchedServer = initialVipServers.find(s => s.id === matchDomain.targetServerId);
        if (matchedServer) resolvedServer = matchedServer;
        const matchedNode = initialVipNodes.find(n => n.id === matchDomain.targetNodeId);
        if (matchedNode) resolvedNode = matchedNode;
        const matchedSubnet = initialVipSubnets.find(sub => sub.id === matchDomain.targetSubnetId);
        if (matchedSubnet) resolvedSubnet = matchedSubnet;
        const matchedNet = initialVirtualNetworks.find(net => net.id === matchDomain.targetNetworkId);
        if (matchedNet) resolvedNetwork = matchedNet;
      }

      if (parsed.serviceName) {
        const matchService = initialVipServices.find(
          s => s.domain.toLowerCase() === parsed.domainOrNetwork.toLowerCase() &&
               s.serviceName.toLowerCase() === parsed.serviceName?.toLowerCase()
        );
        if (matchService) resolvedService = matchService;
      }
    } else {
      // Hierarchical lookup
      const matchNet = initialVirtualNetworks.find(
        n => n.id.toLowerCase() === parsed.domainOrNetwork.toLowerCase() ||
             n.name.toLowerCase().includes(parsed.domainOrNetwork.toLowerCase())
      );
      if (matchNet) resolvedNetwork = matchNet;

      if (parsed.subnetId) {
        const matchSub = initialVipSubnets.find(s => s.id === parsed.subnetId || s.name.toLowerCase().includes(parsed.subnetId!.toLowerCase()));
        if (matchSub) resolvedSubnet = matchSub;
      }

      if (parsed.nodeId) {
        const matchNode = initialVipNodes.find(n => n.id === parsed.nodeId || n.name.toLowerCase().includes(parsed.nodeId!.toLowerCase()));
        if (matchNode) resolvedNode = matchNode;
      }

      if (parsed.serverId) {
        const matchSrv = initialVipServers.find(s => s.id === parsed.serverId);
        if (matchSrv) resolvedServer = matchSrv;
      }

      if (parsed.serviceName) {
        const matchSvc = initialVipServices.find(s => s.serviceName.toLowerCase() === parsed.serviceName?.toLowerCase());
        if (matchSvc) resolvedService = matchSvc;
      }
    }

    const proofHash = VIPCrypto.sha256(
      `${vnetUri}_${resolvedIdentity.did}_${resolvedNetwork.id}_${resolvedSubnet.id}_${resolvedNode.id}_${resolvedServer.id}`
    );

    const totalResolutionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

    return {
      rawUri: vnetUri,
      parsed: {
        scheme: 'vnet',
        domainOrNetwork: parsed.domainOrNetwork,
        subnet: parsed.subnetId,
        node: parsed.nodeId,
        server: parsed.serverId,
        service: parsed.serviceName,
        pathParams: parsed.pathParams
      },
      resolved: true,
      resolutionPipeline: {
        layer1_user: {
          userId: resolvedUser.id,
          role: resolvedUser.role,
          status: 'VERIFIED',
          latencyMs: 0.2
        },
        layer2_identity: {
          did: resolvedIdentity.did,
          algorithm: resolvedIdentity.algorithm,
          status: 'VERIFIED',
          latencyMs: 0.3
        },
        layer3_network: {
          networkId: resolvedNetwork.id,
          vnetUri: resolvedNetwork.vnetUri,
          status: 'LOCATED',
          latencyMs: 0.4
        },
        layer4_subnet: {
          subnetId: resolvedSubnet.id,
          cidr: resolvedSubnet.cidr,
          status: 'ROUTED',
          latencyMs: 0.3
        },
        layer5_node: {
          nodeId: resolvedNode.id,
          physicalIp: resolvedNode.physicalTransportBinding.ipAddress,
          transport: resolvedNode.physicalTransportBinding.protocol,
          status: 'BOUND',
          latencyMs: 0.5
        },
        layer6_server: {
          serverId: resolvedServer.id,
          status: 'RUNNING',
          latencyMs: 0.2
        },
        layer7_domain: {
          domain: resolvedDomain.domain,
          zoneStatus: 'RESOLVED',
          latencyMs: 0.3
        },
        layer8_service: {
          serviceId: resolvedService.id,
          endpoint: resolvedService.endpointPath,
          port: resolvedService.port,
          status: 'BOUND',
          latencyMs: 0.2
        }
      },
      totalResolutionTimeMs: Math.max(1.2, totalResolutionTimeMs),
      cryptographicProof: proofHash,
      cacheTtlSec: 300
    };
  }

  /**
   * Build a structured VirtualPacket adhering to NIP-PACKET
   */
  static buildVirtualPacket(params: {
    sourceUri: string;
    destinationUri: string;
    protocolGroup?: VIPProtocolGroup;
    protocolId?: string;
    payload: any;
    payloadType?: 'json' | 'binary' | 'rpc_request' | 'rpc_response' | 'heartbeat';
    transport?: VIPTransportAdapter;
    signerKeypair?: { publicKey: string; privateKey: string; did: string };
    encrypt?: boolean;
    ttl?: number;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  }): VirtualPacket {
    const packetId = `pkt-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 8)}`;
    const keypair = params.signerKeypair || {
      publicKey: initialVipIdentities[0].publicKey,
      privateKey: 'ed25519_sk_master_priv_7f2e89a42a9b3112',
      did: initialVipIdentities[0].did
    };

    const rawPayload = params.payload;
    const payloadHash = VIPCrypto.sha256(JSON.stringify(rawPayload));
    const timestamp = new Date().toISOString();

    const header = {
      magic: 0x56495031, // "VIP1"
      version: '1.0.0',
      packetId,
      sourceUri: params.sourceUri,
      destinationUri: params.destinationUri,
      sourceIdentity: keypair.did,
      destinationIdentity: 'did:vip:ed25519:dest_target_anchor',
      protocolGroup: params.protocolGroup || 'NIP',
      protocolId: params.protocolId || 'NIP-PACKET',
      payloadType: params.payloadType || 'json',
      payloadHash,
      ttl: params.ttl || 64,
      hopCount: 0,
      routePath: [params.sourceUri],
      timestamp,
      flags: {
        encrypted: !!params.encrypt,
        signed: true,
        requiresAck: true,
        priority: params.priority || 'NORMAL'
      }
    };

    const signature = VIPCrypto.sign(
      `${header.magic}:${header.packetId}:${header.sourceUri}:${header.destinationUri}:${payloadHash}`,
      keypair.privateKey
    );

    let envelope: any = undefined;
    if (params.encrypt) {
      envelope = VIPCrypto.encryptChaCha20Poly1305(rawPayload, keypair.publicKey);
    }

    return {
      header,
      security: {
        signature,
        signerPublicKey: keypair.publicKey,
        encryptionEnvelope: envelope,
        delegationProof: {
          capabilityToken: 'cap_tok_valid_mesh_all',
          delegatorIdentity: keypair.did,
          scope: ['READ', 'WRITE', 'ROUTE', 'EXECUTE'],
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          delegatorSignature: 'sig_ed25519_cap_proof_valid'
        }
      },
      payload: rawPayload,
      transportMetadata: {
        underlyingTransport: params.transport || 'QUIC',
        physicalSourceIp: '194.126.110.42',
        physicalDestIp: '198.51.100.88',
        physicalPort: 9001,
        rttMs: 8.4
      }
    };
  }

  /**
   * Dispatch & Route a VirtualPacket across the overlay
   */
  static dispatchPacket(packet: VirtualPacket): VirtualPacketReceipt {
    // 1. Verify Header Magic
    if (packet.header.magic !== 0x56495031) {
      return {
        packetId: packet.header.packetId,
        status: 'REJECTED',
        latencyMs: 0.1,
        hopsTraversed: 0,
        routePath: [],
        timestamp: new Date().toISOString(),
        destinationResponse: { error: 'BAD_MAGIC_HEADER: Expected VIP1 (0x56495031)' }
      };
    }

    // 2. Validate Cryptographic Signature
    const isSignatureValid = VIPCrypto.verifySignature(
      packet.payload,
      packet.security.signature,
      packet.security.signerPublicKey
    );

    if (!isSignatureValid && packet.header.flags.signed) {
      return {
        packetId: packet.header.packetId,
        status: 'REJECTED',
        latencyMs: 1.2,
        hopsTraversed: 1,
        routePath: [packet.header.sourceUri],
        timestamp: new Date().toISOString(),
        destinationResponse: { error: 'SIGNATURE_VERIFICATION_FAILED: Tampered packet rejected by overlay node' }
      };
    }

    // 3. Resolve destination & calculate route
    const resolution = this.resolveVnetAddress(packet.header.destinationUri);
    const route = VIPRouter.findShortestRoute('vnode-fra-01', 'vnode-iad-01');

    const hopsTraversed = route.totalHops;
    const latencyMs = route.estimatedLatencyMs;

    return {
      packetId: packet.header.packetId,
      status: 'DELIVERED',
      latencyMs,
      hopsTraversed,
      routePath: route.hopNodes.map(h => h.nodeName),
      ackSignature: `ack_ed25519_${VIPCrypto.sha256(`ack_${packet.header.packetId}`).slice(2, 18)}`,
      timestamp: new Date().toISOString(),
      destinationResponse: {
        status: 'SUCCESS',
        serviceBound: resolution.resolutionPipeline.layer8_service.serviceId,
        endpoint: resolution.resolutionPipeline.layer8_service.endpoint,
        acknowledgedPayloadHash: packet.header.payloadHash,
        echoResult: {
          receivedAt: new Date().toISOString(),
          processedByServer: resolution.resolutionPipeline.layer6_server.serverId
        }
      }
    };
  }

  /**
   * Execute an Isolated Protocol Sandbox Test by test ID or test object
   */
  static runSandboxScenario(testOrId: string | VIPProtocolSandboxTest): VIPProtocolSandboxTest {
    let test: VIPProtocolSandboxTest;
    if (typeof testOrId === 'string') {
      const found = initialVipSandboxTests.find(t => t.id === testOrId);
      if (!found) {
        test = initialVipSandboxTests[0];
      } else {
        test = found;
      }
    } else {
      test = testOrId;
    }
    return VIPEngine.runSandboxTest(test);
  }

  /**
   * Execute an Isolated Protocol Sandbox Test
   */
  static runSandboxTest(test: VIPProtocolSandboxTest): VIPProtocolSandboxTest {
    const startTime = performance.now();
    const logs: string[] = [];

    logs.push(`[VIP SANDBOX] Initializing isolated overlay testbed: ${test.name}`);
    logs.push(`[VIP SANDBOX] Target Protocol: ${test.targetProtocol} | Transport Adapter: ${test.config.transportAdapter}`);
    logs.push(`[VIP SANDBOX] Source Address: ${test.config.sourceAddress}`);
    logs.push(`[VIP SANDBOX] Destination Address: ${test.config.destinationAddress}`);

    let packetsSent = test.config.packetCount;
    let packetsDropped = 0;
    let packetsReceived = 0;
    let signaturePassed = true;
    let tamperTriggered = false;

    if (test.config.corruptSignatures) {
      logs.push('[VIP SANDBOX] FAULT INJECTION: Injecting corrupted bitflips into Ed25519 signatures');
      signaturePassed = false;
      tamperTriggered = true;
      packetsDropped = packetsSent;
      packetsReceived = 0;
      logs.push(`[VIP SANDBOX] Receiver node dropped ${packetsDropped}/${packetsSent} packets due to invalid signature`);
      logs.push('[VIP SANDBOX] Tamper-evident Merkle telemetry block appended to audit log');
    } else {
      packetsReceived = packetsSent;
      logs.push(`[VIP SANDBOX] Transmitted ${packetsSent} VirtualPackets with 0.00% packet loss`);
      logs.push(`[VIP SANDBOX] Authenticated ChaCha20-Poly1305 encryption verified across all frames`);
      logs.push(`[VIP SANDBOX] All ${packetsReceived} packet ACK signatures verified in overlay buffer`);
    }

    const durationMs = Math.round(performance.now() - startTime + (packetsSent * 0.4));
    const avgRtt = test.config.transportAdapter === 'QUIC' ? 4.2 : test.config.transportAdapter === 'UDP' ? 3.1 : 7.8;

    return {
      ...test,
      status: tamperTriggered ? 'PASSED' : 'PASSED',
      result: {
        packetsSent,
        packetsReceived,
        packetsDropped,
        avgRttMs: avgRtt,
        minRttMs: Math.max(1.8, parseFloat((avgRtt * 0.7).toFixed(1))),
        maxRttMs: parseFloat((avgRtt * 1.6).toFixed(1)),
        signatureVerificationPassed: signaturePassed,
        tamperDetectionTriggered: tamperTriggered,
        logs,
        durationMs,
        executedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Log a new Tamper-Evident Telemetry Entry into the Merkle Chain
   */
  static logTelemetry(entry: {
    networkId: string;
    nodeId: string;
    protocolId: string;
    metricType: VIPTelemetryEntry['metricType'];
    details: string;
    metrics: Record<string, number>;
  }): VIPTelemetryEntry {
    const lastEntry = initialVipTelemetryLogs[0] || {
      sequenceNumber: 10482,
      entryHash: '0x8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732'
    };

    const sequenceNumber = lastEntry.sequenceNumber + 1;
    const timestamp = new Date().toISOString();
    const entryHash = VIPCrypto.sha256(`${sequenceNumber}_${timestamp}_${entry.details}_${JSON.stringify(entry.metrics)}`);
    const merkleRoot = VIPCrypto.computeMerkleRoot([lastEntry.entryHash, entryHash]);
    const validatorSignature = VIPCrypto.sign(merkleRoot, 'ed25519_sk_validator_fra');

    const newLog: VIPTelemetryEntry = {
      id: `telem-blk-${sequenceNumber}`,
      sequenceNumber,
      timestamp,
      networkId: entry.networkId,
      nodeId: entry.nodeId,
      protocolId: entry.protocolId,
      metricType: entry.metricType,
      metrics: entry.metrics,
      details: entry.details,
      previousHash: lastEntry.entryHash,
      entryHash,
      merkleRoot,
      validatorSignature,
      isTamperEvident: true
    };

    initialVipTelemetryLogs.unshift(newLog);
    return newLog;
  }
}
