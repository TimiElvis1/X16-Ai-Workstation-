import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Radio,
  FileCode2,
  Cpu,
  Server,
  Layers,
  Compass,
  Activity,
  ShieldCheck,
  Zap,
  Code2,
  Send,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { VipOverviewDashboard } from './VipOverviewDashboard';
import { VipVirtualPacketStudio } from './VipVirtualPacketStudio';
import { VipProtocolsRegistry } from './VipProtocolsRegistry';
import { VipNetworksManager } from './VipNetworksManager';
import { VipNodesManager } from './VipNodesManager';
import { VipServersManager } from './VipServersManager';
import { VipSubnetsManager } from './VipSubnetsManager';
import { VipDomainsManager } from './VipDomainsManager';
import { VipServicesDiscovery } from './VipServicesDiscovery';
import { VipTelemetryStudio } from './VipTelemetryStudio';
import { VipSecurityStudio } from './VipSecurityStudio';
import { VipSandboxStudio } from './VipSandboxStudio';
import { VipSdkStudio } from './VipSdkStudio';

import {
  vipNetworks,
  vipNodes,
  vipServers,
  vipSubnets,
  vipDomains,
  vipServices,
  vipIdentities,
  vipTelemetryLogs,
  vipTelemetrySummary,
  vipSandboxTests
} from '../../data/vipDatabase';
import { VirtualNetwork, VIPServer, VIPDomainRecord, VirtualIdentity } from '../../types/vip';

export type VipStudioTab =
  | 'overview'
  | 'virtual-packet'
  | 'protocols'
  | 'networks'
  | 'nodes'
  | 'servers'
  | 'subnets'
  | 'domains'
  | 'services'
  | 'telemetry'
  | 'security'
  | 'sandbox'
  | 'sdk';

interface VirtualInternetStudioProps {
  initialTab?: VipStudioTab;
}

export const VirtualInternetStudio: React.FC<VirtualInternetStudioProps> = ({
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<VipStudioTab>(initialTab);
  const [networks, setNetworks] = useState<VirtualNetwork[]>(vipNetworks);
  const [nodes, setNodes] = useState(vipNodes);
  const [servers, setServers] = useState<VIPServer[]>(vipServers);
  const [subnets, setSubnets] = useState(vipSubnets);
  const [domains, setDomains] = useState<VIPDomainRecord[]>(vipDomains);
  const [services, setServices] = useState(vipServices);
  const [identities, setIdentities] = useState<VirtualIdentity[]>(vipIdentities);
  const [telemetryLogs, setTelemetryLogs] = useState(vipTelemetryLogs);
  const [telemetrySummary, setTelemetrySummary] = useState(vipTelemetrySummary);
  const [sandboxTests, setSandboxTests] = useState(vipSandboxTests);

  const [sandboxTargetProtocol, setSandboxTargetProtocol] = useState<string | undefined>(undefined);
  const [selectedTargetUriForPacket, setSelectedTargetUriForPacket] = useState<string | undefined>(undefined);

  const handleCreateNetwork = (net: Partial<VirtualNetwork>) => {
    const newNet: VirtualNetwork = {
      id: `vnet-${Date.now()}`,
      name: net.name || 'Custom Overlay',
      vnetUri: net.vnetUri || 'vnet://custom',
      cidrBlock: net.cidrBlock || '10.250.0.0/16',
      description: net.description || 'Custom provisioned sovereign mesh overlay',
      ownerIdentityDid: 'did:vip:ed25519:z6MkqBf3KqU5sYt1Gv9XwZa7Np2C',
      ownerName: net.ownerName || 'Prime Sovereign Root',
      ownerUserId: 'usr-prime-operator',
      overlayProtocol: net.overlayProtocol || 'VIP-Noise-Encrypted',
      accessPolicy: net.accessPolicy || 'PERMISSIONED_CONSORTIUM',
      consensusMechanism: net.consensusMechanism || 'PROOF_OF_BANDWIDTH',
      encryptionCipher: net.encryptionCipher || 'ChaCha20-Poly1305',
      defaultTransport: net.defaultTransport || 'QUIC',
      nodesCount: 1,
      serversCount: 1,
      subnetsCount: 1,
      healthScorePct: 100,
      avgLatencyMs: 4.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNetworks((prev) => [newNet, ...prev]);
  };

  const handleCreateServer = (srv: Partial<VIPServer>) => {
    const newSrv: VIPServer = {
      id: `vsrv-${Date.now()}`,
      name: srv.name || 'Custom Virtual Server',
      nodeId: 'vnode-fra-01',
      subnetId: 'vsub-fra-01',
      domainBindingUri: srv.domainBindingUri || 'vnet://custom.edge/service',
      vCpu: srv.vCpu || 8,
      ramMB: srv.ramMB || 16384,
      storageGB: srv.storageGB || 500,
      osEngine: srv.osEngine || 'Alpine VIP Microkernel v24.2',
      status: 'ACTIVE',
      uptimeSeconds: 10,
      cpuUsagePct: 8,
      ramUsageMB: 1024,
      networkTxMbps: 120,
      networkRxMbps: 140,
      servicesCount: 1,
      replicationFactor: srv.replicationFactor || 3,
      createdAt: new Date().toISOString()
    };
    setServers((prev) => [newSrv, ...prev]);
  };

  const handleRegisterDomain = (domain: string, targetServerId: string) => {
    const newDom: VIPDomainRecord = {
      id: `dom-${Date.now()}`,
      domain,
      vnetAddress: `vnet://${domain}`,
      targetServerId,
      ownerIdentityDid: 'did:vip:ed25519:z6MkqBf3KqU5sYt1Gv9XwZa7Np2C',
      ownerName: 'Global Operator Consortium',
      accessPolicy: 'SOVEREIGN_OPEN',
      dnssecProof: 'dnssec_sig_valid_root_anchor_proof',
      zoneRecords: [
        { type: 'VIP_A', name: '@', value: '10.240.10.10', ttlSec: 3600 },
        { type: 'VIP_DID', name: '@', value: 'did:vip:ed25519:z6MkqBf3KqU5sYt1Gv9XwZa7Np2C', ttlSec: 86400 }
      ],
      trafficQueries24h: 120,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 31536000000).toISOString()
    };
    setDomains((prev) => [newDom, ...prev]);
  };

  const handleCreateIdentity = (ident: VirtualIdentity) => {
    setIdentities((prev) => [ident, ...prev]);
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Globe, badge: 'Topology' },
    { id: 'virtual-packet', label: 'VirtualPacket & Addressing', icon: Send, badge: 'vnet://' },
    { id: 'protocols', label: '20 Protocols (VSP & NIP)', icon: FileCode2, badge: 'RFCs' },
    { id: 'networks', label: 'Networks', icon: Globe, count: (networks || []).length },
    { id: 'nodes', label: 'Nodes', icon: Cpu, count: (nodes || []).length },
    { id: 'servers', label: 'Servers', icon: Server, count: (servers || []).length },
    { id: 'subnets', label: 'Subnets', icon: Layers, count: (subnets || []).length },
    { id: 'domains', label: 'Domains', icon: Compass, count: (domains || []).length },
    { id: 'services', label: 'Services & RPC', icon: Radio, count: (services || []).length },
    { id: 'telemetry', label: 'Merkle Telemetry', icon: Activity, badge: 'Audited' },
    { id: 'security', label: 'Security & DIDs', icon: ShieldCheck, badge: 'Zero-Trust' },
    { id: 'sandbox', label: 'Test Sandbox', icon: Zap, badge: 'Fuzzer' },
    { id: 'sdk', label: 'Developer SDK & APIs', icon: Code2, badge: 'REST/WS' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Banner & VIP Badge */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Virtual Internet Protocol (VIP) Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                8-Layer Resolution Stack
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800/60">
                v1.4.0-Production
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Virtual Internet Protocol Sovereign Platform
            </h1>
            <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Modular, zero-trust network overlay operating across QUIC, UDP, TCP, WebSocket, and WebRTC transports.
              Enables deterministic <code className="text-cyan-400 font-mono">vnet://</code> addressing, W3C DID identity verification, Dijkstra path routing, and tamper-evident Merkle telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('virtual-packet')}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send VirtualPacket</span>
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border border-zinc-700"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Protocol Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="border-b border-zinc-800 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as VipStudioTab)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-cyan-950 text-cyan-300' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === 'overview' && (
          <VipOverviewDashboard
            onNavigate={(tab) => setActiveTab(tab as VipStudioTab)}
            onSendPacket={(uri) => {
              setSelectedTargetUriForPacket(uri);
              setActiveTab('virtual-packet');
            }}
          />
        )}

        {activeTab === 'virtual-packet' && (
          <VipVirtualPacketStudio
            initialUri={selectedTargetUriForPacket || 'vnet://neural.edge/inference'}
          />
        )}

        {activeTab === 'protocols' && (
          <VipProtocolsRegistry
            onRunSandboxForProtocol={(code) => {
              setSandboxTargetProtocol(code);
              setActiveTab('sandbox');
            }}
          />
        )}

        {activeTab === 'networks' && (
          <VipNetworksManager
            networks={networks}
            onCreateNetwork={handleCreateNetwork}
            onSelectNetwork={(id) => {
              setSelectedTargetUriForPacket(`vnet://${id}/sub-eu-central/vnode-fra-01/client`);
              setActiveTab('virtual-packet');
            }}
          />
        )}

        {activeTab === 'nodes' && (
          <VipNodesManager
            nodes={nodes}
          />
        )}

        {activeTab === 'servers' && (
          <VipServersManager
            servers={servers}
            onCreateServer={handleCreateServer}
          />
        )}

        {activeTab === 'subnets' && (
          <VipSubnetsManager
            subnets={subnets}
          />
        )}

        {activeTab === 'domains' && (
          <VipDomainsManager
            domains={domains}
            onRegisterDomain={handleRegisterDomain}
          />
        )}

        {activeTab === 'services' && (
          <VipServicesDiscovery
            services={services}
            onInvokeService={(uri) => {
              setSelectedTargetUriForPacket(uri);
              setActiveTab('virtual-packet');
            }}
          />
        )}

        {activeTab === 'telemetry' && (
          <VipTelemetryStudio
            telemetryLogs={telemetryLogs}
            summary={telemetrySummary}
          />
        )}

        {activeTab === 'security' && (
          <VipSecurityStudio
            identities={identities}
            onCreateIdentity={handleCreateIdentity}
          />
        )}

        {activeTab === 'sandbox' && (
          <VipSandboxStudio
            initialTests={sandboxTests}
            defaultProtocolCode={sandboxTargetProtocol}
          />
        )}

        {activeTab === 'sdk' && (
          <VipSdkStudio />
        )}
      </div>
    </div>
  );
};
