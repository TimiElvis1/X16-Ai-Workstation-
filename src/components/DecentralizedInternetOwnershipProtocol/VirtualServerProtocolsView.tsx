import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Layers, 
  Activity, 
  Radio, 
  Zap, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Database,
  ArrowRight,
  HardDrive,
  Network
} from 'lucide-react';
import { 
  VirtualServer, 
  NetworkNode, 
  LogicalSubnet, 
  ProtocolDefinition, 
  PublishedService,
  TransportType
} from '../../types/diop';

interface VirtualServerProtocolsViewProps {
  servers: VirtualServer[];
  nodes: NetworkNode[];
  subnets: LogicalSubnet[];
  vspProtocols: ProtocolDefinition[];
  onCreateServer: (serverData: Partial<VirtualServer>) => void;
  onPublishService: (serverId: string, serviceData: Partial<PublishedService>) => void;
  onUpdateReplication: (serverId: string, replicationFactor: number) => void;
}

export const VirtualServerProtocolsView: React.FC<VirtualServerProtocolsViewProps> = ({
  servers,
  nodes,
  subnets,
  vspProtocols,
  onCreateServer,
  onPublishService,
  onUpdateReplication
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'servers' | 'nodes' | 'subnets' | 'resources' | 'hosting' | 'subscriptions' | 'telemetry' | 'replication'
  >('servers');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [selectedServerForPublish, setSelectedServerForPublish] = useState<string>(servers[0]?.id || '');

  // New server form state
  const [serverName, setServerName] = useState<string>('VOX-Edge-Cluster-03');
  const [domainBinding, setDomainBinding] = useState<string>('vx://edge.cluster/service');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const [selectedSubnetId, setSelectedSubnetId] = useState<string>(subnets[0]?.id || '');
  const [vCpu, setVCpu] = useState<number>(8);
  const [ramGB, setRamGB] = useState<number>(16);
  const [storageGB, setStorageGB] = useState<number>(500);
  const [bandwidthMbps, setBandwidthMbps] = useState<number>(5000);
  const [ringBufferKB, setRingBufferKB] = useState<number>(4096);
  const [replicationFactor, setReplicationFactor] = useState<number>(3);
  const [osEngine, setOsEngine] = useState<string>('Ubuntu 24.04 LTS (Optimized Kernel)');

  // New Service publish state
  const [serviceName, setServiceName] = useState<string>('Realtime Inference Gateway');
  const [serviceScheme, setServiceScheme] = useState<string>('service');
  const [serviceEndpoint, setServiceEndpoint] = useState<string>('/v1/inference/predict');
  const [servicePort, setServicePort] = useState<number>(8090);
  const [serviceTransport, setServiceTransport] = useState<TransportType>('QUIC');
  const [serviceAuthRequired, setServiceAuthRequired] = useState<boolean>(true);
  const [serviceRateLimit, setServiceRateLimit] = useState<number>(1000);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNode = nodes.find(n => n.id === selectedNodeId);
    const targetSubnet = subnets.find(s => s.id === selectedSubnetId);

    onCreateServer({
      name: serverName,
      domainBinding,
      nodeAttachmentId: selectedNodeId,
      nodeName: targetNode?.name || 'Node-Generic',
      subnetId: selectedSubnetId,
      subnetName: targetSubnet?.name || 'Subnet-Core',
      vCpu,
      ramMB: ramGB * 1024,
      storageGB,
      bandwidthMbps,
      ringBufferKB,
      replicationFactor,
      osEngine,
      status: 'ONLINE',
      publishedServices: [],
      cpuUsagePct: 12,
      ramUsageMB: 2048,
      latencyMs: 10,
      uptimeSeconds: 0
    });

    setIsCreateModalOpen(false);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublishService(selectedServerForPublish, {
      name: serviceName,
      scheme: serviceScheme,
      endpoint: serviceEndpoint,
      port: servicePort,
      transport: serviceTransport,
      authRequired: serviceAuthRequired,
      rateLimitReqSec: serviceRateLimit,
      protocolId: 'VSP-HOST',
      activeSubscribers: 0,
      status: 'ONLINE'
    });
    setIsPublishModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* VSP Sub-navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'servers', label: 'Virtual Servers', count: servers?.length || 0, icon: Server },
            { id: 'nodes', label: 'Network Nodes', count: nodes?.length || 0, icon: Radio },
            { id: 'subnets', label: 'Logical Subnets', count: subnets?.length || 0, icon: Layers },
            { id: 'resources', label: 'Resource Allocation', count: `${(servers || []).reduce((a, s) => a + (s.vCpu || 0), 0)} vCPU`, icon: Cpu },
            { id: 'hosting', label: 'Service Hosting', count: (servers || []).flatMap(s => s.publishedServices || []).length, icon: Zap },
            { id: 'subscriptions', label: 'Subscriptions', count: 'Active', icon: Share2 },
            { id: 'telemetry', label: 'Server Telemetry', count: 'Live Stream', icon: Activity },
            { id: 'replication', label: 'State Replication', count: 'Raft Multi-DC', icon: RefreshCw }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black shadow-md font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  isSelected ? 'bg-black/30 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-black text-xs transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Provision Virtual Server</span>
          </button>
        </div>
      </div>

      {/* Protocol Definitions Banner */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Virtual Server Protocol Standards (VSP-Suite)
            </h4>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">8 PROTOCOLS COMPILED & ACTIVE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {vspProtocols.map(proto => (
            <div key={proto.id} className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center space-y-1 hover:border-cyan-500 transition-all">
              <span className="text-[11px] font-black text-cyan-300 font-mono block">{proto.identifier}</span>
              <span className="text-[9px] text-zinc-400 block truncate">{proto.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[8px] font-bold font-mono">
                v{proto.version}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SUB-TAB: SERVERS */}
      {activeSubTab === 'servers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Server className="h-4 w-4 text-emerald-400" />
              <span>Decentralized Virtual Servers ({servers.length})</span>
            </h4>
            <span className="text-xs text-zinc-400">Deterministic container sandboxes attached to physical nodes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((srv) => (
              <div key={srv.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 space-y-4 shadow-xl relative flex flex-col justify-between">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <Server className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm font-black text-white">{srv.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">{srv.domainBinding}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold font-mono">
                      {srv.status}
                    </span>
                  </div>

                  {/* Hardware resource meters */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold block">Allocated CPU</span>
                      <span className="font-mono font-black text-white">{srv.vCpu} vCPU</span>
                      <span className="text-[10px] text-zinc-400 block">{srv.cpuUsagePct}% active</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold block">RAM & Ring Buffer</span>
                      <span className="font-mono font-black text-purple-300">{Math.round(srv.ramMB / 1024)} GB</span>
                      <span className="text-[10px] text-zinc-400 block">{srv.ringBufferKB} KB Ring</span>
                    </div>
                  </div>

                  {/* Attachment Details */}
                  <div className="text-[11px] space-y-1 text-zinc-400 font-mono">
                    <div className="flex justify-between">
                      <span>Attached Node:</span>
                      <span className="text-zinc-200 font-bold">{srv.nodeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subnet Mesh:</span>
                      <span className="text-cyan-300">{srv.subnetName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Replication:</span>
                      <span className="text-emerald-400 font-bold">{srv.replicationFactor}x Multi-DC</span>
                    </div>
                  </div>

                  {/* Published services */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">
                      Published Services ({srv.publishedServices?.length || 0})
                    </span>
                    {!srv.publishedServices || srv.publishedServices.length === 0 ? (
                      <span className="text-[10px] text-zinc-600 italic">No services published yet</span>
                    ) : (
                      (srv.publishedServices || []).map(svc => (
                        <div key={svc.id} className="p-2 rounded-lg bg-black/80 border border-zinc-800 text-[10px] font-mono flex items-center justify-between">
                          <span className="text-blue-300 font-bold">{svc.name}</span>
                          <span className="text-zinc-400">{svc.transport} • {svc.endpoint}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedServerForPublish(srv.id);
                      setIsPublishModalOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Publish Service</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: NODES */}
      {activeSubTab === 'nodes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Radio className="h-4 w-4 text-amber-400" />
              <span>Participating Network Nodes ({nodes.length})</span>
            </h4>
            <span className="text-xs text-zinc-400">VSP-NODE Attested Physical & Virtual Edge Hardware</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map(node => (
              <div key={node.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-sm font-black text-white">{node.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400 block">{node.region}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold font-mono">
                    {node.status} • {node.healthScore}% HEALTH
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-black border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">IP / Port</span>
                    <span className="font-mono font-bold text-white text-[11px]">{node.ipAddress}:{node.port}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">Latency / Loss</span>
                    <span className="font-mono font-bold text-amber-300 text-[11px]">{node.latencyMs}ms ({node.packetLossPct}%)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">Hardware</span>
                    <span className="font-mono font-bold text-cyan-300 text-[11px]">{node.hardwareSpecs.cpuCores}C / {node.hardwareSpecs.totalRamGB}G</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">Network NIC</span>
                    <span className="font-mono font-bold text-emerald-400 text-[11px]">{node.hardwareSpecs.nicSpeedGbps} Gbps</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1">
                  <span>Validator Key: <strong className="text-zinc-200">{node.validatorKey}</strong></span>
                  <span className="text-purple-300 font-bold">{node.attachedServersCount} Virtual Servers Attached</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: SUBNETS */}
      {activeSubTab === 'subnets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Logical Overlay Subnets ({subnets.length})</span>
            </h4>
            <span className="text-xs text-zinc-400">VSP-SUBNET Micro-Segmented Mesh Networks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subnets.map(sub => (
              <div key={sub.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-black text-white">{sub.name}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">
                    {sub.cidr}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Encryption Mode:</span>
                    <span className="text-zinc-200 font-bold">{sub.encryptionMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Policy:</span>
                    <span className="text-cyan-300 font-bold">{sub.accessPolicy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bandwidth Cap:</span>
                    <span className="text-emerald-400 font-bold">{sub.bandwidthCapGbps} Gbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Governance:</span>
                    <span className="text-amber-300 text-[10px]">{sub.governanceRule}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">{sub.totalNodes} Nodes</span>
                  <span className="text-purple-300 font-bold">{sub.activeServers} Active Servers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: RESOURCES */}
      {activeSubTab === 'resources' && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <span>VSP-RESOURCE Dynamic Hardware Quotas &amp; Metering</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Real-time isolation enforced with cgroups v2 and high-speed memory mapped ring buffers.</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-black border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs">
              TOTAL ALLOCATED: {servers.reduce((a, s) => a + s.vCpu, 0)} vCPU • {Math.round(servers.reduce((a, s) => a + s.ramMB, 0) / 1024)} GB RAM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servers.map(srv => (
              <div key={srv.id} className="p-4 bg-black/60 border border-zinc-800 rounded-xl space-y-3">
                <span className="font-bold text-white text-xs block">{srv.name}</span>
                
                {/* CPU Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>vCPU Usage ({srv.vCpu} Cores)</span>
                    <span className="text-cyan-400 font-bold">{srv.cpuUsagePct}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${srv.cpuUsagePct}%` }} />
                  </div>
                </div>

                {/* RAM Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>RAM Utilization ({Math.round(srv.ramMB / 1024)} GB)</span>
                    <span className="text-purple-400 font-bold">{Math.round((srv.ramUsageMB / srv.ramMB) * 100)}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.round((srv.ramUsageMB / srv.ramMB) * 100)}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <span>Ring Buffer: <strong className="text-white">{srv.ringBufferKB} KB</strong></span>
                  <span>Egress: <strong className="text-emerald-400">{srv.bandwidthMbps} Mbps</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: HOSTING */}
      {activeSubTab === 'hosting' && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>VSP-HOST Service Ingress &amp; Publishing Registry</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Application and API endpoints accessible over native decentralized domains.</p>
            </div>
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Publish New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(servers || []).flatMap(srv => (srv?.publishedServices || []).map(svc => ({ ...svc, serverName: srv.name, domainBinding: srv.domainBinding }))).map(svc => (
              <div key={svc.id} className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{svc.name}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                    {svc.transport} • Port {svc.port}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-cyan-400">
                  {svc.domainBinding}{svc.endpoint}
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
                  <span>Server: <strong className="text-zinc-200">{svc.serverName}</strong></span>
                  <span className="text-emerald-400 font-bold">{svc.activeSubscribers} Subscribers Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: REPLICATION */}
      {activeSubTab === 'replication' && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-emerald-400" />
                <span>VSP-REPLICATION State Replication &amp; Byzantine Consensus</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Configured replication factors ensure automated state failover across geographically separate nodes.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">Raft Quorum: ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servers.map(srv => (
              <div key={srv.id} className="p-4 bg-black border border-zinc-800 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">{srv.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                    {srv.replicationFactor}x Factor
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Consensus Engine:</span>
                    <span className="text-zinc-200 font-bold">Raft v2.4 (mTLS)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heartbeat Interval:</span>
                    <span className="text-cyan-300">150ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Snapshot Shipping:</span>
                    <span className="text-emerald-400 font-bold">ENABLED</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center space-x-2">
                  <label className="text-[10px] text-zinc-400">Factor:</label>
                  <select
                    value={srv.replicationFactor}
                    onChange={(e) => onUpdateReplication(srv.id, Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white font-mono text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1x (Single Node)</option>
                    <option value={2}>2x (Dual-DC Mirror)</option>
                    <option value={3}>3x (Raft Multi-DC Quorum)</option>
                    <option value={5}>5x (Global High-Resilience)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE VIRTUAL SERVER */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Provision Virtual Server (VSP-SERVER)</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-zinc-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Server Name:</label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Domain Binding:</label>
                  <input
                    type="text"
                    value={domainBinding}
                    onChange={(e) => setDomainBinding(e.target.value)}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Attach to Node:</label>
                  <select
                    value={selectedNodeId}
                    onChange={(e) => setSelectedNodeId(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.ipAddress})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Select Subnet:</label>
                  <select
                    value={selectedSubnetId}
                    onChange={(e) => setSelectedSubnetId(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    {subnets.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.cidr})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">vCPU Cores:</label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={vCpu}
                    onChange={(e) => setVCpu(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">RAM (GB):</label>
                  <input
                    type="number"
                    min={1}
                    max={256}
                    value={ramGB}
                    onChange={(e) => setRamGB(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Ring Buffer (KB):</label>
                  <input
                    type="number"
                    step={1024}
                    min={1024}
                    max={65536}
                    value={ringBufferKB}
                    onChange={(e) => setRingBufferKB(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black"
                >
                  Provision Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH SERVICE */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Publish Service Endpoint (VSP-HOST)</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-zinc-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Target Virtual Server:</label>
                <select
                  value={selectedServerForPublish}
                  onChange={(e) => setSelectedServerForPublish(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                >
                  {servers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.domainBinding})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Service Name:</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Endpoint Path:</label>
                  <input
                    type="text"
                    value={serviceEndpoint}
                    onChange={(e) => setServiceEndpoint(e.target.value)}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Port:</label>
                  <input
                    type="number"
                    value={servicePort}
                    onChange={(e) => setServicePort(Number(e.target.value))}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Transport:</label>
                  <select
                    value={serviceTransport}
                    onChange={(e) => setServiceTransport(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="HTTP/HTTPS">HTTP/HTTPS</option>
                    <option value="QUIC">QUIC</option>
                    <option value="WebSocket">WebSocket</option>
                    <option value="TCP">TCP</option>
                    <option value="WireGuard">WireGuard</option>
                    <option value="gRPC">gRPC</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Rate Limit (Req/s):</label>
                  <input
                    type="number"
                    value={serviceRateLimit}
                    onChange={(e) => setServiceRateLimit(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
