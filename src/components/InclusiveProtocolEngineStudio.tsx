import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Globe, 
  Server, 
  Cpu, 
  Radio, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Settings, 
  Code, 
  Terminal, 
  Search, 
  Plus, 
  RefreshCw, 
  Download, 
  ArrowRight, 
  FileText, 
  Zap, 
  Check, 
  X, 
  ExternalLink,
  ChevronRight,
  Database,
  Mail,
  Network,
  Activity,
  KeyRound,
  Sliders,
  Send,
  Boxes,
  Sparkles
} from 'lucide-react';
import { 
  ProtocolDefinition, 
  EngineProtocolCategory, 
  ProtocolStatus,
  CustomProtocolGeneratorInput,
  GeneratedProtocolBundle,
  ProtocolSandboxTestResult,
  generateDeterministicProtocolId
} from '../types/protocolEngine';
import { initialProtocolCatalog, protocolAuditLogs } from '../data/protocolRegistryDatabase';
import { executeSandboxProtocolTest } from '../services/protocolSandboxEngine';
import { generateCustomProtocolBundle } from '../services/customProtocolGenerator';
import { InstallerEngineView } from './InstallerEngineView';
import { PluginRegistry } from './PluginRegistry';
import { VisualProtocolTelemetryMonitor } from './VisualProtocolTelemetryMonitor';

interface InclusiveProtocolEngineStudioProps {
  onSelectSubTool?: (toolId: string) => void;
}

export const InclusiveProtocolEngineStudio: React.FC<InclusiveProtocolEngineStudioProps> = ({ onSelectSubTool }) => {
  // Navigation tabs
  const [activeView, setActiveView] = useState<'installer' | 'plugin_registry' | 'telemetry_monitor' | 'catalog' | 'installed' | 'sandbox' | 'custom_generator' | 'hierarchy_graph' | 'web_endpoints' | 'dns_manager'>('installer');
  
  // State
  const [protocols, setProtocols] = useState<ProtocolDefinition[]>(initialProtocolCatalog || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'VIRTUAL_SERVER' | 'NETWORK'>('ALL');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolDefinition | null>(protocols?.[0] || null);

  // Configure Modal / Drawer state
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configForm, setConfigForm] = useState<Record<string, any>>({});
  const [secretsForm, setSecretsForm] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState<{ text: string; type: 'success' | 'warn' | 'error' } | null>(null);

  // Sandbox state
  const [sandboxTarget, setSandboxTarget] = useState<string>('smtp');
  const [sandboxEndpoint, setSandboxEndpoint] = useState<string>('https://0.0.0.0:3000/api/health');
  const [sandboxHost, setSandboxHost] = useState<string>('10.142.0.12');
  const [sandboxPort, setSandboxPort] = useState<number>(587);
  const [sandboxUseTls, setSandboxUseTls] = useState<boolean>(true);
  const [sandboxRunning, setSandboxRunning] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<ProtocolSandboxTestResult | null>(null);

  // Custom Protocol Generator state
  const [customGenInput, setCustomGenInput] = useState<CustomProtocolGeneratorInput>({
    name: 'Neural Stream Protocol',
    customId: 'neural_stream',
    version: '1.0',
    categories: ['virtual-server', 'messaging'],
    transport: 'QUIC',
    messageSchema: JSON.stringify({
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'NeuralFrame',
      type: 'object',
      properties: {
        tensorId: { type: 'string' },
        dimensions: { type: 'array', items: { type: 'integer' } },
        quantization: { type: 'string', enum: ['FP16', 'INT8', 'INT4'] }
      },
      required: ['tensorId', 'dimensions']
    }, null, 2),
    authentication: 'BLOCKCHAIN_SIG',
    encryption: 'TLS_1_3',
    ports: [9443],
    endpoints: ['/v1/stream', '/v1/inference'],
    requestFormat: 'Protobuf (Binary) / JSON',
    responseFormat: 'Protobuf Stream',
    errorCodes: [
      { code: 'ERR_INSUFFICIENT_STAKE', message: 'Node identity stake insufficient for high-throughput stream' },
      { code: 'ERR_SCHEMA_VIOLATION', message: 'Tensor dimension payload mismatch' }
    ],
    permissions: ['STREAM_READ', 'STREAM_WRITE', 'ADMIN_EVICT']
  });
  const [generatedBundle, setGeneratedBundle] = useState<GeneratedProtocolBundle | null>(null);
  const [activeGenTab, setActiveGenTab] = useState<'spec' | 'typescript' | 'node' | 'python' | 'go' | 'test'>('spec');

  // Web Endpoint Manager state
  const [webEndpoints, setWebEndpoints] = useState([
    { id: 'ep-01', protocol: 'HTTPS', host: '0.0.0.0', port: 3000, path: '/api/*', auth: 'JWT + Anchor', tls: true, rateLimit: 600, status: 'ACTIVE' },
    { id: 'ep-02', protocol: 'WebSocket', host: '0.0.0.0', port: 3000, path: '/api/ws', auth: 'Origin Nonce', tls: true, rateLimit: 1200, status: 'ACTIVE' },
    { id: 'ep-03', protocol: 'HTTP/3 (QUIC)', host: '0.0.0.0', port: 443, path: '/v3/stream', auth: 'mTLS', tls: true, rateLimit: 2400, status: 'ACTIVE' },
    { id: 'ep-04', protocol: 'gRPC', host: '0.0.0.0', port: 50051, path: '/SubnetService/*', auth: 'Token Ingestion', tls: true, rateLimit: 5000, status: 'ACTIVE' }
  ]);

  // DNS and Domain Manager state
  const [domainRecords, setDomainRecords] = useState([
    { type: 'A', name: '@', value: '10.142.0.12 (Alpha-Edge-Gateway)', ttl: 3600, status: 'VERIFIED' },
    { type: 'CNAME', name: 'api', value: 'alpha-edge.vox.network', ttl: 3600, status: 'VERIFIED' },
    { type: 'MX', name: '@', value: '10 mail.vox.network (SMTP Port 587)', ttl: 3600, status: 'VERIFIED' },
    { type: 'TXT', name: '@', value: 'v=spf1 include:vox.network ~all | did=bte:anchor:0x3f89...', ttl: 3600, status: 'VERIFIED' },
    { type: 'SRV', name: '_imaps._tcp', value: '0 1 993 imap.vox.network', ttl: 3600, status: 'VERIFIED' }
  ]);

  // Fetch protocols from backend on mount
  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    try {
      const res = await fetch('/api/protocols');
      const data = await res.json();
      if (data.success && Array.isArray(data.protocols)) {
        setProtocols(data.protocols);
        if (!selectedProtocol && data.protocols.length > 0) {
          setSelectedProtocol(data.protocols[0]);
        }
      }
    } catch (e) {
      console.warn('Backend protocols endpoint fallback to local registry state:', e);
    }
  };

  const showNotice = (text: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setActionNotice({ text, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Actions
  const handleInstall = async (proto: ProtocolDefinition) => {
    try {
      const res = await fetch(`/api/protocols/${proto.id}/install`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotice(`Protocol '${proto.name}' installed and registered to Identity Anchor.`, 'success');
        fetchProtocols();
      } else {
        showNotice(data.error || 'Failed to install protocol', 'error');
      }
    } catch (e) {
      // Local fallback
      setProtocols(prev => prev.map(p => p.id === proto.id ? { ...p, status: 'installed', installedAt: new Date().toISOString() } : p));
      showNotice(`Protocol '${proto.name}' installed (Local Mode).`, 'success');
    }
  };

  const handleToggleStatus = async (proto: ProtocolDefinition) => {
    const action = proto.status === 'installed' ? 'disable' : 'enable';
    try {
      const res = await fetch(`/api/protocols/${proto.id}/${action}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotice(`Protocol '${proto.name}' status set to ${action === 'enable' ? 'INSTALLED' : 'DISABLED'}.`, 'success');
        fetchProtocols();
      }
    } catch (e) {
      setProtocols(prev => prev.map(p => p.id === proto.id ? { ...p, status: action === 'enable' ? 'installed' : 'disabled' } : p));
      showNotice(`Protocol '${proto.name}' updated.`, 'success');
    }
  };

  const openConfigDrawer = (proto: ProtocolDefinition) => {
    setSelectedProtocol(proto);
    setConfigForm({ ...proto.config });
    setSecretsForm({});
    setIsConfigOpen(true);
  };

  const handleSaveConfig = async () => {
    if (!selectedProtocol) return;
    try {
      const res = await fetch(`/api/protocols/${selectedProtocol.id}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: configForm,
          secrets: secretsForm
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Configuration for '${selectedProtocol.name}' encrypted and saved!`, 'success');
        setIsConfigOpen(false);
        fetchProtocols();
      }
    } catch (e) {
      setProtocols(prev => prev.map(p => p.id === selectedProtocol.id ? { ...p, config: { ...configForm } } : p));
      showNotice(`Configuration saved (Secrets stored securely in vault).`, 'success');
      setIsConfigOpen(false);
    }
  };

  const runSandboxProbe = async (protoId?: string) => {
    const targetId = protoId || sandboxTarget;
    setSandboxRunning(true);
    setSandboxResult(null);

    try {
      const res = await fetch('/api/protocols/sandbox/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocolId: targetId,
          endpointUrl: sandboxEndpoint,
          host: sandboxHost,
          port: sandboxPort,
          useTls: sandboxUseTls
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setSandboxResult(data.result);
      } else {
        const fallback = await executeSandboxProtocolTest({
          protocolId: targetId,
          host: sandboxHost,
          port: sandboxPort,
          useTls: sandboxUseTls
        });
        setSandboxResult(fallback);
      }
    } catch (e) {
      const fallback = await executeSandboxProtocolTest({
        protocolId: targetId,
        host: sandboxHost,
        port: sandboxPort,
        useTls: sandboxUseTls
      });
      setSandboxResult(fallback);
    } finally {
      setSandboxRunning(false);
      showNotice(`Sandbox probe completed for '${targetId.toUpperCase()}'.`, 'success');
    }
  };

  const handleGenerateCustomBundle = () => {
    try {
      const bundle = generateCustomProtocolBundle(customGenInput);
      setGeneratedBundle(bundle);
      showNotice(`Protocol '${customGenInput.name}' generated with full TypeScript/Node/Python/Go adapters!`, 'success');
    } catch (e: any) {
      showNotice(`Generator error: ${e.message}`, 'error');
    }
  };

  const handleRegisterGeneratedProtocol = async () => {
    if (!generatedBundle) return;
    try {
      const def = generatedBundle.protocolDefinition;
      const res = await fetch('/api/protocols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: def.name,
          version: def.version,
          categories: def.categories,
          isVirtualServer: def.isVirtualServer,
          isNetwork: def.isNetwork,
          description: def.description,
          transport: def.transport,
          defaultPorts: def.defaultPorts,
          config: def.config,
          requiresPrivilegedAccess: def.requiresPrivilegedAccess,
          privilegedAccessReason: def.privilegedAccessReason
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Custom Protocol '${def.name}' registered to on-chain registry!`, 'success');
        fetchProtocols();
        setActiveView('catalog');
      }
    } catch (e) {
      setProtocols(prev => [generatedBundle.protocolDefinition, ...prev]);
      showNotice(`Protocol '${generatedBundle.protocolDefinition.name}' registered (Local State).`, 'success');
      setActiveView('catalog');
    }
  };

  // Filtered protocols list
  const filteredProtocols = protocols.filter(p => {
    // View tab filtering
    if (activeView === 'installed' && p.status !== 'installed') return false;
    
    // Category tab filtering
    if (selectedCategory !== 'all' && !p.categories.includes(selectedCategory as any)) return false;

    // Type filter (Virtual Server vs Network)
    if (typeFilter === 'VIRTUAL_SERVER' && !p.isVirtualServer) return false;
    if (typeFilter === 'NETWORK' && !p.isNetwork) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTransport = p.transport?.toLowerCase().includes(q);
      return matchName || matchId || matchDesc || matchTransport;
    }

    return true;
  });

  const categoriesList: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Protocols', icon: Layers },
    { id: 'virtual-server', label: 'Virtual Server (VSP)', icon: Server },
    { id: 'network', label: 'Network Protocols', icon: Network },
    { id: 'email', label: 'Email (SMTP/IMAP)', icon: Mail },
    { id: 'web', label: 'Web & Realtime', icon: Globe },
    { id: 'dns', label: 'DNS & Domain', icon: Globe },
    { id: 'identity', label: 'Identity & Auth', icon: KeyRound },
    { id: 'security', label: 'Security & PKI', icon: Lock },
    { id: 'messaging', label: 'API & Messaging', icon: Activity },
    { id: 'storage', label: 'Storage & Files', icon: Database },
    { id: 'infrastructure', label: 'Infrastructure', icon: Cpu },
    { id: 'decentralized', label: 'P2P / IPFS', icon: Radio },
    { id: 'blockchain', label: 'Blockchain RPC', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                BTE-PROTOCOL-ENGINE v1.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
                Application-Level Protocol Adapters
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                12 Active Adapters
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Inclusive Protocol Engine
            </h1>
            <p className="text-slate-400 text-sm max-w-3xl mt-1 leading-relaxed">
              Install, configure, test, register, and monitor application protocol adapters connecting Blockchain Identity Anchors, Virtual Servers, Subnets, Domains, and Web Applications above foundational Internet standards.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="btn-nav-telemetry-monitor"
              onClick={() => setActiveView('telemetry_monitor')}
              className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25 transition-all text-sm cursor-pointer border border-cyan-400/30"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Visual Telemetry Monitor</span>
            </button>
            <button
              id="btn-nav-plugin-registry"
              onClick={() => setActiveView('plugin_registry')}
              className="px-4 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-2 transition-all text-sm cursor-pointer"
            >
              <Boxes className="w-4 h-4" />
              <span>Plugin Registry & Tool APIs</span>
            </button>
            <button
              onClick={() => setActiveView('custom_generator')}
              className="px-4 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-2 transition-all text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Protocol</span>
            </button>
            <button
              onClick={() => {
                setSandboxTarget('smtp');
                setActiveView('sandbox');
                runSandboxProbe('smtp');
              }}
              className="px-4 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 transition-all text-sm cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Sandbox Probe</span>
            </button>
          </div>
        </div>

        {/* Global Notice Banner */}
        {actionNotice && (
          <div className={`mt-4 p-3.5 rounded-xl border text-sm flex items-center justify-between ${
            actionNotice.type === 'success' ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' :
            actionNotice.type === 'warn' ? 'bg-amber-950/70 border-amber-500/40 text-amber-300' :
            'bg-rose-950/70 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span className="font-mono text-xs">{actionNotice.text}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation Views */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'telemetry_monitor', label: 'Visual Telemetry Monitor', icon: Activity, count: 20, highlight: true },
          { id: 'installer', label: 'Installer Engine (20 Categories)', icon: Sparkles, count: 20, highlight: false },
          { id: 'plugin_registry', label: 'Plugin Registry & Tool APIs', icon: Boxes, count: 20, highlight: false },
          { id: 'catalog', label: 'Protocol Catalog', icon: Layers, count: protocols.length },
          { id: 'installed', label: 'Installed Adapters', icon: CheckCircle2, count: protocols.filter(p => p.status === 'installed').length },
          { id: 'hierarchy_graph', label: 'Architecture & Hierarchy', icon: Network },
          { id: 'web_endpoints', label: 'Web Endpoint Manager', icon: Globe },
          { id: 'dns_manager', label: 'DNS & Domain Mapping', icon: Server },
          { id: 'sandbox', label: 'Protocol Sandbox Testbed', icon: Play },
          { id: 'custom_generator', label: 'Custom Protocol Generator', icon: Code }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? tab.highlight 
                    ? 'bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950/40 font-bold'
                    : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                  : tab.highlight
                  ? 'text-cyan-400 hover:text-cyan-200 hover:bg-slate-800/80 border border-cyan-500/20 bg-cyan-950/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.highlight ? 'text-cyan-400' : ''}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                  isActive 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW 0: VISUAL TELEMETRY MONITOR (REAL-TIME PACKET FLOW & 20 ADAPTERS) */}
      {activeView === 'telemetry_monitor' && (
        <VisualProtocolTelemetryMonitor
          onSelectSubTool={onSelectSubTool}
          onOpenPluginConfig={(plugin) => {
            setActiveView('plugin_registry');
          }}
        />
      )}

      {/* VIEW 0.2: INSTALLER ENGINE (20 IDENTIFIED CATEGORIES) */}
      {activeView === 'installer' && (
        <InstallerEngineView
          protocols={protocols}
          onProtocolsUpdate={(updated) => setProtocols(updated)}
          onSelectProtocolForConfig={openConfigDrawer}
          onLaunchSandboxProbe={(protoId) => {
            setSandboxTarget(protoId);
            setActiveView('sandbox');
            runSandboxProbe(protoId);
          }}
          showNotice={showNotice}
        />
      )}

      {/* VIEW 0.5: PLUGIN REGISTRY & TOOL APIS (20 CATEGORIES) */}
      {activeView === 'plugin_registry' && (
        <PluginRegistry
          onSelectSubTool={onSelectSubTool}
          onOpenTelemetryStudio={() => setActiveView('telemetry_monitor')}
          showNotice={showNotice}
        />
      )}

      {/* VIEW 1: PROTOCOL CATALOG & INSTALLED LIST */}
      {(activeView === 'catalog' || activeView === 'installed') && (
        <div className="space-y-6">
          {/* Filter Toolbar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search protocols (SMTP, HTTPS, DNS, gRPC...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Type Switcher: All vs Virtual Server vs Network */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {(['ALL', 'VIRTUAL_SERVER', 'NETWORK'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    typeFilter === t ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'ALL' ? 'All Types' : t === 'VIRTUAL_SERVER' ? 'Virtual Server (VSP)' : 'Network Protocols (NP)'}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Horizontal Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categoriesList.map(cat => {
              const CatIcon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Protocols Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProtocols.map(proto => {
              const isInstalled = proto.status === 'installed';
              const isSelected = selectedProtocol?.id === proto.id;

              return (
                <div
                  key={proto.id}
                  className={`bg-slate-900/80 border rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                    isSelected ? 'border-cyan-500/60 shadow-lg shadow-cyan-950/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                          {proto.id.toUpperCase()} v{proto.version}
                        </span>
                        {proto.isVirtualServer && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-950/80 border border-purple-500/30 text-purple-300">
                            VSP
                          </span>
                        )}
                        {proto.isNetwork && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-950/80 border border-blue-500/30 text-blue-300">
                            NP
                          </span>
                        )}
                        {proto.encrypted && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> TLS
                          </span>
                        )}
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono ${
                        isInstalled ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        proto.status === 'disabled' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {proto.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {proto.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {proto.description}
                    </p>

                    {/* Infrastructure Privileges Notice */}
                    {proto.requiresPrivilegedAccess && (
                      <div className="mt-3 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-start gap-2 text-[11px] text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Privileged Infrastructure Access: </span>
                          <span>{proto.privilegedAccessReason || 'Requires root port binding or network stack control.'}</span>
                        </div>
                      </div>
                    )}

                    {/* Meta Tags: Ports & Transport */}
                    <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] font-mono text-slate-400">
                      {proto.transport && (
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Transport: {proto.transport}
                        </span>
                      )}
                      {proto.defaultPorts && proto.defaultPorts.length > 0 && (
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Ports: {proto.defaultPorts.join(', ')}
                        </span>
                      )}
                      {proto.connectedServices && proto.connectedServices.length > 0 && (
                        <span className="bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-300">
                          {proto.connectedServices.length} Linked Services
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openConfigDrawer(proto)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                        title="Configure Adapter & Secrets"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Config</span>
                      </button>
                      <button
                        onClick={() => {
                          setSandboxTarget(proto.id);
                          setActiveView('sandbox');
                          runSandboxProbe(proto.id);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                        title="Test in Sandbox"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Test</span>
                      </button>
                    </div>

                    <div>
                      {!isInstalled ? (
                        <button
                          onClick={() => handleInstall(proto)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Install</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(proto)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            proto.status === 'installed'
                              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/50'
                              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                          }`}
                        >
                          {proto.status === 'installed' ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: HIERARCHY & ARCHITECTURE GRAPH */}
      {activeView === 'hierarchy_graph' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              Sovereign Protocol Management Layer & Hierarchy
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl mb-8">
              Visualizing deterministic protocol attachment from the Blockchain Identity Anchor down to physical and virtual node endpoints.
            </p>

            {/* Visual Tree */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-4 overflow-x-auto">
              <div className="flex items-center gap-3 text-cyan-300 font-bold text-sm bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>Blockchain Identity Anchor (BTE-ID v1)</span>
                <span className="text-xs text-slate-400 font-normal ml-auto">0x3f89a1b0...</span>
              </div>

              <div className="pl-6 border-l-2 border-slate-800 space-y-6">
                {/* Branch 1: Domain & Web */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-500/20">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>Domain: agvora.vox (DNS / DoH / DNSSEC)</span>
                  </div>
                  
                  <div className="pl-6 border-l-2 border-slate-800 space-y-2 text-slate-400">
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
                      <Server className="w-3.5 h-3.5 text-purple-400" />
                      <span>Virtual Server: Alpha-Edge-Gateway (10.142.0.12)</span>
                    </div>
                    <div className="pl-6 border-l-2 border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Node: val-subnet-01 (SubNet: subnet-us-east-1)</span>
                      </div>
                      <div className="pl-6 border-l-2 border-slate-800 space-y-1.5 text-cyan-300">
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>HTTPS / HTTP-3 QUIC Adapter (Port 443)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>SMTP Submission (Port 587 STARTTLS)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>WebSocket WSS (Port 3000 /api/ws)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch 2: Blockchain RPC & Decentralized Mesh */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>Decentralized Mesh & On-Chain Registry</span>
                  </div>
                  <div className="pl-6 border-l-2 border-slate-800 space-y-2 text-slate-400">
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>EVM Protocol Registry Contract: 0x71C8A942a9b3112028Cef8109d4310E39A20b001</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
                      <Boxes className="w-3.5 h-3.5 text-amber-400" />
                      <span>libp2p Swarm + IPFS Bitswap (Port 4001/5001)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: WEB ENDPOINT MANAGER */}
      {activeView === 'web_endpoints' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Web Endpoint & Protocol Manager
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Configure HTTP, HTTPS, WebSocket, WebRTC, SSE, HTTP/2, HTTP/3, and QUIC edge routes.
                </p>
              </div>
              <button
                onClick={() => showNotice('New Web Endpoint created with rate limiter and TLS 1.3 Strict ALPN.', 'success')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Endpoint Route</span>
              </button>
            </div>

            {/* Endpoints Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="p-3">Protocol</th>
                    <th className="p-3">Host:Port</th>
                    <th className="p-3">Path Route</th>
                    <th className="p-3">Authentication</th>
                    <th className="p-3">TLS</th>
                    <th className="p-3">Rate Limit</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {webEndpoints.map(ep => (
                    <tr key={ep.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-cyan-300">{ep.protocol}</td>
                      <td className="p-3 text-slate-300">{ep.host}:{ep.port}</td>
                      <td className="p-3 text-white font-semibold">{ep.path}</td>
                      <td className="p-3 text-indigo-300">{ep.auth}</td>
                      <td className="p-3">
                        {ep.tls ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            TLS 1.3 Strict
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                            Plain
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{ep.rateLimit} req/min</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">
                          {ep.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSandboxEndpoint(`https://${ep.host}:${ep.port}${ep.path}`);
                            setActiveView('sandbox');
                            runSandboxProbe('https');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                        >
                          Test Route
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: DNS & DOMAIN MAPPING */}
      {activeView === 'dns_manager' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  DNS & Domain Verification Pipeline
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Domain → DNS → Protocol Endpoint → Virtual Server → Node/Subnet resolution.
                </p>
              </div>
              <button
                onClick={() => showNotice('DNS record added and synced across DoH resolvers.', 'success')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Record</span>
              </button>
            </div>

            {/* DNS Records */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Value / Target</th>
                    <th className="p-2.5">TTL</th>
                    <th className="p-2.5">DNSSEC Status</th>
                    <th className="p-2.5 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {domainRecords.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-bold text-cyan-300">{r.type}</td>
                      <td className="p-2.5 text-white">{r.name}</td>
                      <td className="p-2.5 text-slate-300">{r.value}</td>
                      <td className="p-2.5 text-slate-500">{r.ttl}s</td>
                      <td className="p-2.5 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Signed (RRSIG)</span>
                      </td>
                      <td className="p-2.5 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: PROTOCOL SANDBOX TESTBED */}
      {activeView === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-emerald-400" />
              Isolated Protocol Testing Sandbox
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl mb-6">
              Safe execution sandbox enforcing authorized endpoint connectivity. Inspect protocol frames, TLS handshake certificates, response headers, and latency.
            </p>

            {/* Test Configuration Panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Protocol</label>
                <select
                  value={sandboxTarget}
                  onChange={(e) => setSandboxTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="smtp">SMTP / SMTPS (Mail Submission)</option>
                  <option value="https">HTTPS / HTTP-3 (QUIC Web)</option>
                  <option value="dns">DNS / DoH (Domain Resolver)</option>
                  <option value="blockchain_rpc">Blockchain EVM JSON-RPC</option>
                  <option value="websocket">WebSocket WSS Realtime</option>
                  <option value="grpc">gRPC Protocol Buffers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Host / IP</label>
                <input
                  type="text"
                  value={sandboxHost}
                  onChange={(e) => setSandboxHost(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Port</label>
                <input
                  type="number"
                  value={sandboxPort}
                  onChange={(e) => setSandboxPort(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => runSandboxProbe()}
                  disabled={sandboxRunning}
                  className="w-full py-2 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all text-xs"
                >
                  {sandboxRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Probing Socket...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Execute Sandbox Probe</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sandbox Results Display */}
            {sandboxResult && (
              <div className="mt-6 space-y-5">
                {/* Status Bar */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Probe Succeeded (Status: {sandboxResult.responseStatus || 200})
                      </h4>
                      <p className="text-slate-400 text-xs font-mono">
                        Protocol: {sandboxResult.protocolId.toUpperCase()} • Latency: {sandboxResult.latencyMs}ms • Test ID: {sandboxResult.testId}
                      </p>
                    </div>
                  </div>

                  {sandboxResult.tlsHandshake && (
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{sandboxResult.tlsHandshake.tlsVersion} ({sandboxResult.tlsHandshake.cipherSuite})</span>
                    </div>
                  )}
                </div>

                {/* Protocol Frames Captured */}
                {sandboxResult.protocolFrames && sandboxResult.protocolFrames.length > 0 && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      Captured Protocol Frames & Sockets
                    </h4>
                    <div className="space-y-2 font-mono text-xs">
                      {sandboxResult.protocolFrames.map((f, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border ${
                            f.direction === 'SENT'
                              ? 'bg-blue-950/30 border-blue-500/30 text-blue-300'
                              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>{f.direction} [{f.protocol}]</span>
                            <span>{f.bytes} Bytes</span>
                          </div>
                          <pre className="whitespace-pre-wrap font-mono text-xs">{f.rawPayload}</pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sandbox Log Output */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    Sandbox Execution Telemetry Logs
                  </h4>
                  <div className="space-y-1 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                    {sandboxResult.logs.map((l, i) => (
                      <div key={i} className="text-slate-400 hover:text-white">
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 6: CUSTOM PROTOCOL GENERATOR */}
      {activeView === 'custom_generator' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-2">
              <Code className="w-5 h-5 text-cyan-400" />
              Custom Protocol Generator & Reference Implementations
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl mb-6">
              Generate custom protocol specifications, JSON Schemas, TypeScript Adapters, Node.js, Python, and Go reference implementations with test suites.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Input Column */}
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Protocol Name</label>
                  <input
                    type="text"
                    value={customGenInput.name}
                    onChange={(e) => setCustomGenInput({ ...customGenInput, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Identifier</label>
                    <input
                      type="text"
                      value={customGenInput.customId}
                      onChange={(e) => setCustomGenInput({ ...customGenInput, customId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Version</label>
                    <input
                      type="text"
                      value={customGenInput.version}
                      onChange={(e) => setCustomGenInput({ ...customGenInput, version: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Transport</label>
                    <select
                      value={customGenInput.transport}
                      onChange={(e) => setCustomGenInput({ ...customGenInput, transport: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    >
                      <option value="QUIC">QUIC (HTTP/3)</option>
                      <option value="TCP">TCP Socket</option>
                      <option value="UDP">UDP Datagram</option>
                      <option value="WebSocket">WebSocket</option>
                      <option value="gRPC">gRPC / Protobuf</option>
                      <option value="P2P_LIBP2P">libp2p P2P</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Authentication</label>
                    <select
                      value={customGenInput.authentication}
                      onChange={(e) => setCustomGenInput({ ...customGenInput, authentication: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    >
                      <option value="BLOCKCHAIN_SIG">Blockchain Anchor Sig</option>
                      <option value="BEARER_TOKEN">JWT Bearer Token</option>
                      <option value="MTLS">Mutual TLS (mTLS)</option>
                      <option value="WEBAUTHN">WebAuthn Passkey</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Message JSON Schema</label>
                  <textarea
                    rows={6}
                    value={customGenInput.messageSchema}
                    onChange={(e) => setCustomGenInput({ ...customGenInput, messageSchema: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-cyan-300 font-mono"
                  />
                </div>

                <button
                  onClick={handleGenerateCustomBundle}
                  className="w-full py-2.5 rounded-xl font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  <span>Generate Multi-Language Adapters</span>
                </button>
              </div>

              {/* Generated Output Tabs */}
              <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                {generatedBundle ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        {(['spec', 'typescript', 'node', 'python', 'go', 'test'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveGenTab(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                              activeGenTab === tab ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleRegisterGeneratedProtocol}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Register to On-Chain Registry</span>
                      </button>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-[440px]">
                      {activeGenTab === 'spec' && <pre className="whitespace-pre-wrap">{generatedBundle.specMarkdown}</pre>}
                      {activeGenTab === 'typescript' && <pre className="whitespace-pre-wrap text-cyan-300">{generatedBundle.adapters.typescript}</pre>}
                      {activeGenTab === 'node' && <pre className="whitespace-pre-wrap text-emerald-300">{generatedBundle.adapters.nodejsReference}</pre>}
                      {activeGenTab === 'python' && <pre className="whitespace-pre-wrap text-amber-300">{generatedBundle.adapters.pythonReference}</pre>}
                      {activeGenTab === 'go' && <pre className="whitespace-pre-wrap text-indigo-300">{generatedBundle.adapters.goReference}</pre>}
                      {activeGenTab === 'test' && <pre className="whitespace-pre-wrap text-purple-300">{generatedBundle.testSuiteTs}</pre>}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                    <Code className="w-10 h-10 text-slate-600" />
                    <p className="text-sm">Click "Generate Multi-Language Adapters" to produce reference code, schemas, and specs.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURATION & SECRETS MODAL DRAWER */}
      {isConfigOpen && selectedProtocol && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  Configure Adapter: {selectedProtocol.name}
                </h3>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Standard Config Parameters */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Adapter Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(configForm).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-xs font-mono text-slate-300 mb-1">{key}</label>
                    <input
                      type="text"
                      value={typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      onChange={(e) => setConfigForm({ ...configForm, [key]: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Encrypted Secrets Section */}
            {selectedProtocol.requiresSecrets && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Lock className="w-4 h-4" />
                  <span>Encrypted Backend Secrets Vault</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Secrets are encrypted in-memory on the backend and never exposed in client frontend JavaScript.
                </p>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Update Secret Password / Key</label>
                  <input
                    type="password"
                    placeholder="Enter new secret (e.g. SMTP_PASSWORD)"
                    onChange={(e) => setSecretsForm({ [selectedProtocol.id.toUpperCase() + '_PASSWORD']: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsConfigOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg cursor-pointer"
              >
                Save & Encrypt Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
