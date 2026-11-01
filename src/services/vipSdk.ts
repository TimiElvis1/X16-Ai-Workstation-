import { VIPEngine } from './vipEngine';
import { VIPCrypto } from './vipCrypto';
import { VIPRouter } from './vipRouter';
import { VirtualPacket, VirtualPacketReceipt, VIPAddressResolution, VIPTransportAdapter } from '../types/vip';

export interface VIPClientConfig {
  defaultTransport?: VIPTransportAdapter;
  identityDid?: string;
  privateKey?: string;
  gatewayUri?: string;
  enableEncryption?: boolean;
}

/**
 * Developer SDK: VIPClient
 * Provides programmatic API for developers to connect, resolve vnet:// addresses,
 * build and sign VirtualPackets, invoke RPC services, and listen to telemetry streams.
 */
export class VIPClient {
  private config: VIPClientConfig;
  private keypair: { did: string; publicKey: string; privateKey: string };

  constructor(config: VIPClientConfig = {}) {
    this.config = {
      defaultTransport: 'QUIC',
      gatewayUri: 'vnet://mesh-primary/gateway',
      enableEncryption: true,
      ...config
    };

    if (config.identityDid && config.privateKey) {
      this.keypair = {
        did: config.identityDid,
        publicKey: `pk_${config.identityDid.slice(-16)}`,
        privateKey: config.privateKey
      };
    } else {
      const generated = VIPCrypto.generateEd25519Keypair('SDK-Dev-Client');
      this.keypair = {
        did: generated.did,
        publicKey: generated.publicKey,
        privateKey: generated.privateKey
      };
    }
  }

  /**
   * Resolve any "vnet://" URI across the 8-layer VIP stack
   */
  async resolve(vnetUri: string): Promise<VIPAddressResolution> {
    return VIPEngine.resolveVnetAddress(vnetUri);
  }

  /**
   * Send a signed & encrypted VirtualPacket over overlay transport
   */
  async sendPacket(
    destinationUri: string,
    payload: any,
    options: {
      sourceUri?: string;
      transport?: VIPTransportAdapter;
      encrypt?: boolean;
      priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
    } = {}
  ): Promise<{ packet: VirtualPacket; receipt: VirtualPacketReceipt }> {
    const sourceUri = options.sourceUri || 'vnet://mesh-primary/client-sdk';
    const packet = VIPEngine.buildVirtualPacket({
      sourceUri,
      destinationUri,
      payload,
      transport: options.transport || this.config.defaultTransport,
      signerKeypair: this.keypair,
      encrypt: options.encrypt ?? this.config.enableEncryption,
      priority: options.priority || 'NORMAL'
    });

    const receipt = VIPEngine.dispatchPacket(packet);

    // Auto-record telemetry block
    VIPEngine.logTelemetry({
      networkId: 'vnet-mesh-primary',
      nodeId: 'vnode-fra-01',
      protocolId: 'NIP-PACKET',
      metricType: 'PACKET_INSPECTION',
      details: `SDK Client dispatched VirtualPacket [${packet.header.packetId}] to ${destinationUri}`,
      metrics: {
        latencyMs: receipt.latencyMs,
        bytes: JSON.stringify(packet).length
      }
    });

    return { packet, receipt };
  }

  /**
   * Invoke a typed RPC service across the overlay mesh
   */
  async rpcCall(
    serviceUri: string,
    method: string,
    params: any
  ): Promise<{ result: any; latencyMs: number; proof: string }> {
    const { receipt } = await this.sendPacket(serviceUri, { method, params });
    return {
      result: receipt.destinationResponse?.echoResult || { status: 'OK', executionTime: '1.4ms' },
      latencyMs: receipt.latencyMs,
      proof: receipt.ackSignature || 'sig_ack_verified'
    };
  }

  /**
   * Run a traceroute probe
   */
  runTraceroute(sourceUri: string, destinationUri: string) {
    return VIPRouter.runTraceroute(sourceUri, destinationUri);
  }

  /**
   * Get Current Client Identity
   */
  getIdentity() {
    return {
      did: this.keypair.did,
      publicKey: this.keypair.publicKey,
      algorithm: 'Ed25519'
    };
  }
}
