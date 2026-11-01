import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Server, 
  Network, 
  ShieldCheck, 
  Zap, 
  DownloadCloud, 
  Activity, 
  Sliders, 
  Search, 
  Plus, 
  RefreshCw, 
  Cpu, 
  Layers, 
  Lock, 
  Radio, 
  CheckCircle2, 
  Terminal, 
  Share2 
} from 'lucide-react';

import { 
  VirtualServer, 
  NetworkNode, 
  LogicalSubnet, 
  DomainOwnershipRecord, 
  DiopSession, 
  DiopAuditEvent,
  PublishedService,
  TransportType
} from '../../types/diop';

import { 
  initialProtocolDefinitions, 
  initialVirtualServers, 
  initialNetworkNodes, 
  initialLogicalSubnets, 
  initialDomainOwnershipRecords, 
  initialDiopSessions, 
  initialDiopAuditLogs 
} from '../../data/initialDiopData';

import { VisualNetworkExplorer } from './VisualNetworkExplorer';
import { VirtualServerProtocolsView } from './VirtualServerProtocolsView';
import { NetworkProtocolsView } from './NetworkProtocolsView';
import { NativeResolverView } from './NativeResolverView';
import { DomainOwnershipRegistryView } from './DomainOwnershipRegistryView';
import { HostWorkflowView } from './HostWorkflowView';
import { SubscribeWorkflowView } from './SubscribeWorkflowView';
import { AuditComplianceDashboard } from './AuditComplianceDashboard';

export const DecentralizedInternetOwnershipStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'explorer' | 'vsp' | 'nip' | 'resolver' | 'ownership' | 'host_pipeline' | 'subscribe_pipeline' | 'audit'
  >('explorer');

  // Core Data States
  const [protocols] = useState(initialProtocolDefinitions);
  const [servers, setServers] = useState<VirtualServer[]>(initialVirtualServers);
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNetworkNodes);
  const [subnets, setSubnets] = useState<LogicalSubnet[]>(initialLogicalSubnets);
  const [domains, setDomains] = useState<DomainOwnershipRecord[]>(initialDomainOwnershipRecords);
  const [sessions, setSessions] = useState<DiopSession[]>(initialDiopSessions);
  const [auditLogs, setAuditLogs] = useState<DiopAuditEvent[]>(initialDiopAuditLogs);

  const [searchFilter, setSearchFilter] = useState<string>('');

  // Filter VSP vs NIP protocols
  const vspProtocols = protocols.filter(p => p.category === 'VIRTUAL_SERVER' || (p.category as string) === 'VSP');
  const nipProtocols = protocols.filter(p => p.category === 'NETWORK' || (p.category as string) === 'NIP');

  // Handle server creation
  const handleCreateServer = (serverData: Partial<VirtualServer>) => {
    const newServer: VirtualServer = {
      id: `vsrv-${Date.now().toString(36)}`,
      name: serverData.name || 'VOX-Virtual-Server',
      domainBinding: serverData.domainBinding || 'vx://cluster.custom/service',
      nodeAttachmentId: serverData.nodeAttachmentId || nodes[0]?.id || 'node-01',
      nodeName: serverData.nodeName || 'Node-Alpha',
      subnetId: serverData.subnetId || subnets[0]?.id || 'subnet-01',
      subnetName: serverData.subnetName || 'Subnet-Mesh',
      vCpu: serverData.vCpu || 8,
      ramMB: serverData.ramMB || 16384,
      storageGB: serverData.storageGB || 500,
      bandwidthMbps: serverData.bandwidthMbps || 5000,
      ringBufferKB: serverData.ringBufferKB || 4096,
      replicationFactor: serverData.replicationFactor || 3,
      osEngine: serverData.osEngine || 'Ubuntu 24.04 LTS (Optimized Kernel)',
      status: 'ONLINE',
      publishedServices: [],
      cpuUsagePct: 15,
      ramUsageMB: 2048,
      latencyMs: 12,
      uptimeSeconds: 120,
      createdAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString()
    };

    setServers(prev => [newServer, ...prev]);

    // Record audit event
    const newAuditEvent: DiopAuditEvent = {
      id: `audit-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action: 'SERVER_PROVISIONED',
      targetType: 'SERVER',
      targetId: newServer.id,
      status: 'SUCCESS',
      actor: 'did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
      details: `Provisioned virtual server ${newServer.name} with ${newServer.vCpu} vCPU attached to node ${newServer.nodeName}.`,
      signatureProof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setAuditLogs(prev => [newAuditEvent, ...prev]);
  };

  // Handle service publishing
  const handlePublishService = (serverId: string, serviceData: Partial<PublishedService>) => {
    const newService: PublishedService = {
      id: `svc-${Date.now().toString(36)}`,
      name: serviceData.name || 'Custom Ingress Service',
      scheme: serviceData.scheme || 'service',
      endpoint: serviceData.endpoint || '/v1/service',
      port: serviceData.port || 8080,
      transport: serviceData.transport || 'QUIC',
      authRequired: serviceData.authRequired ?? true,
      rateLimitReqSec: serviceData.rateLimitReqSec || 1000,
      protocolId: 'VSP-HOST',
      activeSubscribers: 1,
      status: 'ONLINE'
    };

    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        return { ...s, publishedServices: [...s.publishedServices, newService] };
      }
      return s;
    }));

    // Update domain records as well if matching
    setDomains(prev => prev.map(d => {
      if (d.virtualServerId === serverId) {
        return { ...d, publishedServices: [...d.publishedServices, newService] };
      }
      return d;
    }));

    // Audit log
    const newAuditEvent: DiopAuditEvent = {
      id: `audit-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action: 'SERVICE_PUBLISHED',
      targetType: 'SERVICE',
      targetId: newService.id,
      status: 'SUCCESS',
      actor: 'did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
      details: `Published service '${newService.name}' (${newService.transport}) on port ${newService.port} at endpoint ${newService.endpoint}.`,
      signatureProof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setAuditLogs(prev => [newAuditEvent, ...prev]);
  };

  // Handle replication update
  const handleUpdateReplication = (serverId: string, replicationFactor: number) => {
    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        return { ...s, replicationFactor };
      }
      return s;
    }));

    const newAuditEvent: DiopAuditEvent = {
      id: `audit-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action: 'REPLICATION_UPDATED',
      targetType: 'SERVER',
      targetId: serverId,
      status: 'SUCCESS',
      actor: 'did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C',
      details: `Updated replication factor on server ${serverId} to ${replicationFactor}x Raft multi-DC consensus.`,
      signatureProof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setAuditLogs(prev => [newAuditEvent, ...prev]);
  };

  // Handle domain registration
  const handleRegisterDomain = (domainData: Partial<DomainOwnershipRecord>) => {
    const newRecord: DomainOwnershipRecord = {
      domain: domainData.domain || 'vx://custom.mesh/service',
      networkIdentity: domainData.networkIdentity || `did:vx:secp256k1:0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      ownerIdentity: domainData.ownerIdentity || 'drvictoragboola@gmail.com',
      ownerPublicKey: domainData.ownerPublicKey || '0x0489a42a9b3112028cef8109d4310e39a20b3c8f1e4b90a312c58e721a998c0d4531fa78e9112456bc901ef34a1202bdfa7732',
      signatureProof: domainData.signatureProof || '0x' + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      domainStatus: 'ACTIVE',
      associatedSubnetId: domainData.associatedSubnetId || subnets[0]?.id || 'subnet-01',
      associatedSubnetName: domainData.associatedSubnetName || 'Subnet-Mesh',
      hostingNodeId: domainData.hostingNodeId || nodes[0]?.id || 'node-01',
      hostingNodeName: domainData.hostingNodeName || 'Node-Alpha',
      virtualServerId: domainData.virtualServerId || servers[0]?.id || 'vsrv-01',
      virtualServerName: domainData.virtualServerName || 'Server-Alpha',
      publishedServices: domainData.publishedServices || [],
      accessPolicy: domainData.accessPolicy || 'PUBLIC_OPEN',
      telemetryState: {
        telemetryActive: true,
        pingIntervalSec: 5,
        anomalyDetection: true,
        streamThroughputKbps: 3800,
        lastVerifiedAt: new Date().toISOString()
      },
      creationTimestamp: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ownershipVerificationStatus: 'CRYPTOGRAPHICALLY_VERIFIED'
    };

    setDomains(prev => [newRecord, ...prev]);

    const newAuditEvent: DiopAuditEvent = {
      id: `audit-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action: 'DOMAIN_REGISTERED',
      targetType: 'DOMAIN',
      targetId: newRecord.domain,
      status: 'SUCCESS',
      actor: newRecord.ownerIdentity,
      details: `Registered native domain ${newRecord.domain} bound to DID ${newRecord.networkIdentity}.`,
      signatureProof: newRecord.signatureProof
    };
    setAuditLogs(prev => [newAuditEvent, ...prev]);
  };

  // Verify ownership cryptographic signature
  const handleVerifyOwnership = async (domainUri: string): Promise<boolean> => {
    // Simulated cryptographic attestation with server sync
    return new Promise(resolve => {
      setTimeout(() => {
        const found = domains.find(d => d.domain === domainUri);
        if (found) {
          const newAuditEvent: DiopAuditEvent = {
            id: `audit-${Date.now().toString(36).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            action: 'OWNERSHIP_CHALLENGE_VERIFIED',
            targetType: 'DOMAIN',
            targetId: found.domain,
            status: 'SUCCESS',
            actor: found.networkIdentity,
            details: `Cryptographic ownership challenge verified for ${found.domain} via Secp256k1 public key attestation.`,
            signatureProof: found.signatureProof
          };
          setAuditLogs(prev => [newAuditEvent, ...prev]);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  // Revoke domain
  const handleRevokeDomain = (domainUri: string) => {
    setDomains(prev => prev.filter(d => d.domain !== domainUri));

    const newAuditEvent: DiopAuditEvent = {
      id: `audit-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action: 'DOMAIN_REVOKED',
      targetType: 'DOMAIN',
      targetId: domainUri,
      status: 'FLAGGED',
      actor: 'drvictoragboola@gmail.com',
      details: `Revoked decentralized ownership record for domain ${domainUri}.`,
      signatureProof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setAuditLogs(prev => [newAuditEvent, ...prev]);
  };

  // Handle session creation
  const handleCreateSession = (domain: string, service: string, transport: TransportType) => {
    const newSession: DiopSession = {
      sessionId: `sess_vx_${Date.now().toString(36)}`,
      domain,
      targetService: service,
      clientIdentity: 'did:vx:ed25519:0x89a42a9b3112028c',
      transport,
      establishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      packetsExchanged: 14,
      bytesTransferred: 4096,
      securityLevel: 'TLS 1.3 Strict / ChaCha20-Poly1305',
      status: 'ACTIVE',
      sessionToken: 'tk_0x' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setSessions(prev => [newSession, ...prev]);

    const newAuditEvent: DiopAuditEvent = {
      id: `audit-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action: 'SESSION_ESTABLISHED',
      targetType: 'SESSION',
      targetId: newSession.sessionId,
      status: 'SUCCESS',
      actor: newSession.clientIdentity,
      details: `Established encrypted ${transport} session ${newSession.sessionId} with domain ${domain}.`,
      signatureProof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setAuditLogs(prev => [newAuditEvent, ...prev]);
  };

  // Host pipeline completed
  const handleCompleteHostPipeline = (payload: {
    domain: string;
    serverName: string;
    nodeId: string;
    subnetId: string;
    vCpu: number;
    ramGB: number;
    serviceName: string;
    serviceEndpoint: string;
    servicePort: number;
    transport: TransportType;
  }) => {
    const targetNode = nodes.find(n => n.id === payload.nodeId) || nodes[0];
    const targetSubnet = subnets.find(s => s.id === payload.subnetId) || subnets[0];

    const newSvr: VirtualServer = {
      id: `vsrv-${Date.now().toString(36)}`,
      name: payload.serverName,
      domainBinding: payload.domain,
      nodeAttachmentId: payload.nodeId,
      nodeName: targetNode.name,
      subnetId: payload.subnetId,
      subnetName: targetSubnet.name,
      vCpu: payload.vCpu,
      ramMB: payload.ramGB * 1024,
      storageGB: 500,
      bandwidthMbps: 10000,
      ringBufferKB: 8192,
      replicationFactor: 3,
      osEngine: 'Ubuntu 24.04 LTS (Optimized Kernel)',
      status: 'ONLINE',
      publishedServices: [
        {
          id: `svc-${Date.now().toString(36)}`,
          name: payload.serviceName,
          scheme: 'service',
          endpoint: payload.serviceEndpoint,
          port: payload.servicePort,
          transport: payload.transport,
          authRequired: true,
          rateLimitReqSec: 2000,
          protocolId: 'VSP-HOST',
          activeSubscribers: 1,
          status: 'ONLINE'
        }
      ],
      cpuUsagePct: 8,
      ramUsageMB: 2048,
      latencyMs: 9,
      uptimeSeconds: 0,
      createdAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString()
    };

    setServers(prev => [newSvr, ...prev]);

    handleRegisterDomain({
      domain: payload.domain,
      associatedSubnetId: payload.subnetId,
      associatedSubnetName: targetSubnet.name,
      hostingNodeId: payload.nodeId,
      hostingNodeName: targetNode.name,
      virtualServerId: newSvr.id,
      virtualServerName: newSvr.name,
      publishedServices: newSvr.publishedServices
    });
  };

  // Subscribe pipeline completed
  const handleCompleteSubscribePipeline = (payload: {
    domain: string;
    serviceName: string;
    transport: TransportType;
    accessKey: string;
  }) => {
    handleCreateSession(payload.domain, payload.serviceName, payload.transport);
  };

  // Simulate protocol event
  const handleTriggerSimulatedEvent = () => {
    const eventTypes = [
      { type: 'PEER_DHT_SYNC', cat: 'NODE' as const, proto: 'NIP-DISCOVER', desc: 'DHT peer routing table synchronized with 48 edge nodes.' },
      { type: 'RING_BUFFER_ROTATED', cat: 'SERVER' as const, proto: 'VSP-RESOURCE', desc: 'Virtual server ring buffer memory mapped pages rotated seamlessly.' },
      { type: 'RAFT_HEARTBEAT_ACK', cat: 'PROTOCOL' as const, proto: 'VSP-REPLICATION', desc: 'Raft consensus heartbeat acknowledged across multi-DC cluster in 12ms.' },
      { type: 'ANOMALY_MITIGATED', cat: 'SUBNET' as const, proto: 'VSP-TELEMETRY', desc: 'Automated jitter suppressor dampened synthetic network turbulence.' }
    ];
    const picked = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    const newAuditEvent: DiopAuditEvent = {
      id: `audit-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action: picked.type,
      targetType: picked.cat,
      targetId: picked.proto,
      status: picked.type === 'ANOMALY_MITIGATED' ? 'FLAGGED' : 'SUCCESS',
      actor: 'system://telemetry-daemon',
      details: picked.desc,
      signatureProof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setAuditLogs(prev => [newAuditEvent, ...prev]);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden p-8 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-cyan-500/30 shadow-2xl vox-spacious-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <span className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/20">
                <Globe className="h-8 w-8 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center space-x-3">
                  <span>Decentralized Internet Ownership Protocol</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono text-xs font-bold">
                    DIOP v3.4
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl">
                  Decentralized virtual server virtualization, transport-agnostic network protocols, non-custodial domain ownership, and 6-tier native address resolution.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-4 py-2.5 rounded-2xl bg-black border border-zinc-800 text-zinc-400 font-mono text-xs flex items-center space-x-2.5 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-black">{nodes.length} Nodes</span>
                <span>•</span>
                <span className="text-cyan-300 font-black">{servers.length} Servers</span>
                <span>•</span>
                <span className="text-purple-300 font-black">{domains.length} Domains</span>
              </span>
            </div>
          </div>

          {/* Master Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-zinc-800/80">
            {[
              { id: 'explorer', label: 'Network Visualizer', icon: Activity, badge: 'Topology' },
              { id: 'vsp', label: 'Virtual Server Protocols', icon: Server, badge: '8 VSP' },
              { id: 'nip', label: 'Network Protocols', icon: Network, badge: '9 NIP' },
              { id: 'resolver', label: 'Native Resolver', icon: Globe, badge: '6-Tier' },
              { id: 'ownership', label: 'Domain Ownership', icon: ShieldCheck, badge: `${domains.length} Domains` },
              { id: 'host_pipeline', label: 'Host Workflow', icon: Zap, badge: 'Deploy' },
              { id: 'subscribe_pipeline', label: 'Subscribe Workflow', icon: DownloadCloud, badge: 'Consume' },
              { id: 'audit', label: 'Audit & Stream', icon: Terminal, badge: `${auditLogs.length} Events` }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2.5 cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/20 font-black scale-[1.02]'
                      : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono ${
                    isSelected ? 'bg-black text-cyan-300 font-bold' : 'bg-black text-zinc-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Render Views */}
      <div className="transition-all">
        {activeTab === 'explorer' && (
          <VisualNetworkExplorer
            domains={domains}
            subnets={subnets}
            nodes={nodes}
            servers={servers}
            sessions={sessions}
          />
        )}

        {activeTab === 'vsp' && (
          <VirtualServerProtocolsView
            servers={servers}
            nodes={nodes}
            subnets={subnets}
            vspProtocols={vspProtocols}
            onCreateServer={handleCreateServer}
            onPublishService={handlePublishService}
            onUpdateReplication={handleUpdateReplication}
          />
        )}

        {activeTab === 'nip' && (
          <NetworkProtocolsView
            nipProtocols={nipProtocols}
            sessions={sessions}
            domains={domains}
            subnets={subnets}
            nodes={nodes}
            onCreateSession={handleCreateSession}
            onVerifyProof={handleVerifyOwnership}
          />
        )}

        {activeTab === 'resolver' && (
          <NativeResolverView
            domains={domains}
            subnets={subnets}
            nodes={nodes}
            servers={servers}
          />
        )}

        {activeTab === 'ownership' && (
          <DomainOwnershipRegistryView
            domains={domains}
            subnets={subnets}
            nodes={nodes}
            servers={servers}
            onRegisterDomain={handleRegisterDomain}
            onVerifyOwnership={handleVerifyOwnership}
            onRevokeDomain={handleRevokeDomain}
          />
        )}

        {activeTab === 'host_pipeline' && (
          <HostWorkflowView
            subnets={subnets}
            nodes={nodes}
            onCompleteHostPipeline={handleCompleteHostPipeline}
          />
        )}

        {activeTab === 'subscribe_pipeline' && (
          <SubscribeWorkflowView
            domains={domains}
            onCompleteSubscribePipeline={handleCompleteSubscribePipeline}
          />
        )}

        {activeTab === 'audit' && (
          <AuditComplianceDashboard
            auditLogs={auditLogs}
            onTriggerSimulatedEvent={handleTriggerSimulatedEvent}
          />
        )}
      </div>

    </div>
  );
};
