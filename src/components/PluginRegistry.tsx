import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
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
  Sparkles,
  SlidersHorizontal,
  Copy,
  CheckCheck,
  ShieldCheck,
  HardDrive,
  Route,
  ArrowUpRight,
  Filter,
  Monitor
} from 'lucide-react';
import { 
  pluginRegistryManager, 
  ProtocolPluginModule, 
  PluginHookDefinition,
  AVAILABLE_TELEMETRY_SERVERS,
  TelemetryServerOption 
} from '../services/pluginRegistryManager';
import { EngineProtocolCategory } from '../types/protocolEngine';

interface PluginRegistryProps {
  onSelectSubTool?: (toolId: string) => void;
  onOpenTelemetryStudio?: () => void;
  showNotice?: (text: string, type?: 'success' | 'warn' | 'error') => void;
}

// Icon mapping helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Network': return Network;
    case 'Globe': return Globe;
    case 'Server': return Server;
    case 'Mail': return Mail;
    case 'Lock': return Lock;
    case 'KeyRound': return KeyRound;
    case 'Route': return Route;
    case 'Sliders': return Sliders;
    case 'FileText': return FileText;
    case 'Code': return Code;
    case 'Activity': return Activity;
    case 'Database': return Database;
    case 'Radio': return Radio;
    case 'ShieldCheck': return ShieldCheck;
    case 'Zap': return Zap;
    case 'Cpu': return Cpu;
    case 'Boxes': return Boxes;
    case 'HardDrive': return HardDrive;
    default: return Layers;
  }
};

export const PluginRegistry: React.FC<PluginRegistryProps> = ({
  onSelectSubTool,
  onOpenTelemetryStudio,
  showNotice
}) => {
  const [plugins, setPlugins] = useState<ProtocolPluginModule[]>(pluginRegistryManager.getPlugins());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'INSTALLED' | 'STANDBY'>('ALL');
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  
  // Interactive Modals State
  const [telemetryModalTarget, setTelemetryModalTarget] = useState<ProtocolPluginModule | 'ALL' | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string>(AVAILABLE_TELEMETRY_SERVERS[0]?.id || 'telemetry-srv-01');
  const [samplingRateHz, setSamplingRateHz] = useState<number>(20);
  const [otlpExportEnabled, setOtlpExportEnabled] = useState<boolean>(true);
  
  // Test Console Drawer State
  const [testingPlugin, setTestingPlugin] = useState<ProtocolPluginModule | null>(null);
  const [testAction, setTestAction] = useState<string>('DISPATCH_PACKET');
  const [testPayloadText, setTestPayloadText] = useState<string>('{\n  "targetNode": "node-us-east-01",\n  "flags": ["URGENT", "ENCRYPTED"],\n  "sampleRate": 100\n}');
  const [isExecutingTest, setIsExecutingTest] = useState<boolean>(false);
  const [testExecutionResult, setTestExecutionResult] = useState<any | null>(null);

  // Code Snippet Modal State
  const [snippetPlugin, setSnippetPlugin] = useState<ProtocolPluginModule | null>(null);
  const [activeSnippetLang, setActiveSnippetLang] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Hook Inspector Modal State
  const [hookInspectorPlugin, setHookInspectorPlugin] = useState<ProtocolPluginModule | null>(null);

  // Synchronize state with PluginRegistryManager
  useEffect(() => {
    const unsubscribe = pluginRegistryManager.subscribe(() => {
      setPlugins(pluginRegistryManager.getPlugins());
    });
    return unsubscribe;
  }, []);

  const notify = (msg: string, type: 'success' | 'warn' | 'error' = 'success') => {
    if (showNotice) {
      showNotice(msg, type);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filter plugins
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.apiRoute.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.constituentProtocols.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'INSTALLED' && plugin.isInstalledAsTool) ||
      (statusFilter === 'STANDBY' && !plugin.isInstalledAsTool);

    const matchesLayer = 
      selectedLayer === 'ALL' || plugin.layer.toLowerCase().includes(selectedLayer.toLowerCase());

    return matchesSearch && matchesStatus && matchesLayer;
  });

  // Aggregate Stats
  const installedCount = plugins.filter(p => p.isInstalledAsTool).length;
  const totalHooks = plugins.reduce((acc, p) => acc + p.hooks.length, 0);
  const totalPps = plugins
    .filter(p => p.isInstalledAsTool)
    .reduce((acc, p) => acc + (p.telemetry?.metrics?.throughputPps || 0), 0);
  const avgLatency = (
    plugins.reduce((acc, p) => acc + (p.telemetry?.metrics?.latencyMs || 0), 0) / plugins.length
  ).toFixed(1);

  // Action: Install Single Plugin
  const handleToggleInstall = (plugin: ProtocolPluginModule) => {
    if (plugin.isInstalledAsTool) {
      pluginRegistryManager.uninstallPlugin(plugin.categoryId);
      notify(`Deactivated Plugin API for '${plugin.name}'.`, 'warn');
    } else {
      pluginRegistryManager.installPlugin(plugin.categoryId);
      notify(`Installed '${plugin.name}' as Plugin API under Tools.`, 'success');
    }
  };

  // Action: Install All 20 Protocols as Plugin API
  const handleInstallAllAsPluginApi = () => {
    const result = pluginRegistryManager.installAllAsPluginApi(selectedServerId);
    notify(
      `⚡ Successfully installed all 20 Protocol Categories as Plugin APIs under Tools! Assigned to ${result.assignedServer}.`,
      'success'
    );
  };

  // Action: Submit Telemetry Assignment
  const handleSaveTelemetryAssignment = () => {
    if (!telemetryModalTarget) return;

    const targetCategoryIds = telemetryModalTarget === 'ALL' 
      ? 'ALL' 
      : [telemetryModalTarget.categoryId];

    pluginRegistryManager.assignTelemetryServer(targetCategoryIds, {
      serverId: selectedServerId,
      samplingRateHz,
      otlpExportEnabled
    });

    const srv = AVAILABLE_TELEMETRY_SERVERS.find(s => s.id === selectedServerId);
    notify(
      `📡 Telemetry server '${srv?.name}' bound to ${telemetryModalTarget === 'ALL' ? 'all 20 plugins' : telemetryModalTarget.name}.`,
      'success'
    );
    setTelemetryModalTarget(null);
  };

  // Action: Execute Test Probe in Test Console Drawer
  const handleExecutePluginTest = async () => {
    if (!testingPlugin) return;
    setIsExecutingTest(true);
    setTestExecutionResult(null);

    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(testPayloadText);
      } catch {
        parsedPayload = { rawText: testPayloadText };
      }

      const res = await pluginRegistryManager.invokePlugin(
        testingPlugin.categoryId,
        testAction,
        parsedPayload
      );
      setTestExecutionResult(res);
      notify(`Plugin '${testingPlugin.name}' executed successfully (${res.latencyMs}ms).`, 'success');
    } catch (err: any) {
      setTestExecutionResult({
        success: false,
        error: err.message || 'Execution error'
      });
      notify(`Plugin test execution failed: ${err.message}`, 'error');
    } finally {
      setIsExecutingTest(false);
    }
  };

  return (
    <div id="plugin-registry-container" className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-lg text-cyan-400">
                <Boxes className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  Protocol Plugin Registry & Tool API Dispatcher
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                    20 Standard Modules
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Initialize, install, and store all 20 protocol categories as pluggable APIs under tools, with live telemetry server bindings.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Quick Batch Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-install-all-plugins-api"
              onClick={handleInstallAllAsPluginApi}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-900/30 border border-cyan-400/30 transition active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Install All as Plugin API under Tools
            </button>

            <button
              id="btn-bulk-assign-telemetry"
              onClick={() => setTelemetryModalTarget('ALL')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-medium rounded-lg border border-slate-700 transition active:scale-95"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              Assign Telemetry Server (Bulk)
            </button>

            <button
              id="btn-refresh-plugins"
              onClick={() => {
                setPlugins(pluginRegistryManager.getPlugins());
                notify('Plugin registry metrics refreshed.', 'success');
              }}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Refresh Registry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Realtime Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20 text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">{installedCount} / 20</div>
              <div className="text-[11px] text-slate-400">Installed Tool APIs</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">{totalHooks}</div>
              <div className="text-[11px] text-slate-400">Attached Tool Hooks</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {totalPps.toLocaleString()} PPS
              </div>
              <div className="text-[11px] text-slate-400">Telemetry Throughput</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">{avgLatency} ms</div>
              <div className="text-[11px] text-slate-400">Avg Probe Latency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            id="input-plugin-search"
            type="text"
            placeholder="Search 20 protocols, APIs, routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded transition ${statusFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All (20)
            </button>
            <button
              onClick={() => setStatusFilter('INSTALLED')}
              className={`px-3 py-1 rounded transition ${statusFilter === 'INSTALLED' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Installed ({installedCount})
            </button>
            <button
              onClick={() => setStatusFilter('STANDBY')}
              className={`px-3 py-1 rounded transition ${statusFilter === 'STANDBY' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Standby ({20 - installedCount})
            </button>
          </div>

          <select
            id="select-plugin-layer"
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Layers</option>
            <option value="Transport">Transport Layers</option>
            <option value="Application">Application Layers</option>
            <option value="Zero-Trust">Zero-Trust & Crypto</option>
            <option value="Identity">Identity & Auth</option>
            <option value="Storage">Storage & Distributed</option>
            <option value="Consensus">Blockchain Consensus</option>
            <option value="IoT">IoT & Embedded</option>
            <option value="Industrial">Industrial & SCADA</option>
            <option value="Telemetry">Telemetry Plane</option>
          </select>
        </div>
      </div>

      {/* Grid of 20 Protocol Category Plugins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlugins.map((plugin) => {
          const IconComp = getCategoryIcon(plugin.iconName);
          const isInstalled = plugin.isInstalledAsTool;

          return (
            <div
              key={plugin.id}
              id={`plugin-card-${plugin.categoryId}`}
              className={`group bg-slate-900/70 border rounded-xl p-4 transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                isInstalled 
                  ? 'border-slate-700/80 hover:border-cyan-500/40 bg-slate-900/90' 
                  : 'border-slate-800/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Card Top: Number, Icon, Name, Install Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      #{plugin.categoryIndex.toString().padStart(2, '0')}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-cyan-400 group-hover:scale-105 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 leading-tight group-hover:text-cyan-300 transition-colors">
                        {plugin.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {plugin.layer}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                      isInstalled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isInstalled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    {isInstalled ? 'Active Plugin' : 'Standby'}
                  </span>
                </div>

                {/* API Route & Method Badges */}
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">API Endpoint:</span>
                    <span className="text-cyan-400 font-mono text-[10px] truncate max-w-[180px]" title={plugin.apiRoute}>
                      {plugin.apiRoute}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1">
                      {plugin.supportedMethods.slice(0, 3).map((m) => (
                        <span key={m} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[9px]">
                          {m}
                        </span>
                      ))}
                      {plugin.supportedMethods.length > 3 && (
                        <span className="text-slate-500 font-mono text-[9px]">+{plugin.supportedMethods.length - 3}</span>
                      )}
                    </div>
                    <span className="text-indigo-400 font-mono text-[9px] bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      Auth: {plugin.authStrategy}
                    </span>
                  </div>
                </div>

                {/* Constituent Protocols Summary */}
                <div className="mb-3">
                  <div className="text-[10px] text-slate-400 font-medium mb-1">Adapters in this Module:</div>
                  <div className="flex flex-wrap gap-1">
                    {plugin.constituentProtocols.slice(0, 3).map((cp) => (
                      <span key={cp} className="text-[9px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/50 truncate max-w-[130px]">
                        {cp}
                      </span>
                    ))}
                    {plugin.constituentProtocols.length > 3 && (
                      <span className="text-[9px] text-slate-400 bg-slate-800/40 px-1.5 py-0.5 rounded">
                        +{plugin.constituentProtocols.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Telemetry Server Assignment Pill */}
                <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 mb-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Activity className="w-3 h-3 text-cyan-400" />
                      Telemetry Server:
                    </span>
                    <button
                      onClick={() => setTelemetryModalTarget(plugin)}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline text-[9px]"
                    >
                      Change
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-200 font-mono truncate" title={plugin.telemetry.assignedServerName}>
                    {plugin.telemetry.assignedServerName}
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1 font-mono">
                    <span className="text-emerald-400">{plugin.telemetry.metrics.throughputPps} PPS</span>
                    <span>{plugin.telemetry.metrics.latencyMs}ms</span>
                    <span className="text-cyan-400">{plugin.telemetry.samplingRateHz} Hz</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                <button
                  id={`btn-toggle-${plugin.categoryId}`}
                  onClick={() => handleToggleInstall(plugin)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    isInstalled
                      ? 'bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/30'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Installed API
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Install as Tool
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setTestingPlugin(plugin);
                    setTestExecutionResult(null);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 rounded-lg border border-slate-700 transition"
                  title="Test Plugin API / Execute Hooks"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setHookInspectorPlugin(plugin)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 rounded-lg border border-slate-700 transition"
                  title="Inspect Attached Tool Hooks"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setSnippetPlugin(plugin)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
                  title="View cURL / SDK Snippet"
                >
                  <Terminal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Telemetry Server Assignment Modal                                */}
      {/* ========================================================================= */}
      {telemetryModalTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setTelemetryModalTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {telemetryModalTarget === 'ALL' 
                    ? 'Assign Telemetry Server to All 20 Protocols' 
                    : `Assign Telemetry Server: ${telemetryModalTarget.name}`}
                </h3>
                <p className="text-xs text-slate-400">
                  Route packet latency, throughput PPS, socket telemetry and OTLP spans to a designated cluster.
                </p>
              </div>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Target Telemetry Ingestion Node:
                </label>
                <div className="space-y-2">
                  {AVAILABLE_TELEMETRY_SERVERS.map((srv) => (
                    <label
                      key={srv.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        selectedServerId === srv.id
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-slate-100'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="telemetry_server"
                          value={srv.id}
                          checked={selectedServerId === srv.id}
                          onChange={() => setSelectedServerId(srv.id)}
                          className="text-cyan-500 focus:ring-cyan-500"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{srv.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{srv.endpoint} • {srv.location}</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-400">
                        {srv.protocol}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sampling Frequency (Hz):
                  </label>
                  <select
                    value={samplingRateHz}
                    onChange={(e) => setSamplingRateHz(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
                  >
                    <option value={1}>1 Hz (Low Bandwidth)</option>
                    <option value={5}>5 Hz (Standard)</option>
                    <option value={10}>10 Hz (Real-Time Mesh)</option>
                    <option value={20}>20 Hz (High Frequency)</option>
                    <option value={50}>50 Hz (Microsecond Tracing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    OTLP Export Mode:
                  </label>
                  <div className="flex items-center h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={otlpExportEnabled}
                        onChange={(e) => setOtlpExportEnabled(e.target.checked)}
                        className="rounded text-cyan-500 focus:ring-cyan-500"
                      />
                      <span>Enable OTLP / gRPC Spans</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setTelemetryModalTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                id="btn-save-telemetry-assignment"
                onClick={handleSaveTelemetryAssignment}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 2: Interactive Plugin Test & Hook Console                           */}
      {/* ========================================================================= */}
      {testingPlugin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      Plugin API Tester & Hook Trace
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {testingPlugin.apiRoute}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTestingPlugin(null)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Action / Method:
                  </label>
                  <select
                    value={testAction}
                    onChange={(e) => setTestAction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <option value="DISPATCH_PACKET">DISPATCH_PACKET (Default Ingress)</option>
                    <option value="AUTHENTICATE_IDENTITY">AUTHENTICATE_IDENTITY (DID / Anchor Check)</option>
                    <option value="STREAM_SUBSCRIBE">STREAM_SUBSCRIBE (WebTransport / WS)</option>
                    <option value="PROBE_HEALTH">PROBE_HEALTH (Telemetry Ping)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    JSON Request Payload:
                  </label>
                  <textarea
                    rows={4}
                    value={testPayloadText}
                    onChange={(e) => setTestPayloadText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono p-3 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Execution Results */}
                {testExecutionResult && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Execution Trace: {testExecutionResult.traceId}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {testExecutionResult.latencyMs} ms
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Executed Tool Hooks Pipeline:
                      </span>
                      {testExecutionResult.executedHooks?.map((h: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-[11px] bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                          <span className="text-slate-300 font-mono">{h.hookName}</span>
                          <span className="text-emerald-400 font-mono text-[10px]">+{h.durationMs}ms</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Dispatch Response:
                      </span>
                      <pre className="text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800/80 text-emerald-300 font-mono overflow-x-auto">
                        {JSON.stringify(testExecutionResult.result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setTestingPlugin(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
              >
                Close
              </button>
              <button
                id="btn-invoke-plugin-test"
                onClick={handleExecutePluginTest}
                disabled={isExecutingTest}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2 disabled:opacity-50"
              >
                {isExecutingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Dispatch Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Code Snippets & cURL Drawer                                       */}
      {/* ========================================================================= */}
      {snippetPlugin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setSnippetPlugin(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Integration Code Snippets: {snippetPlugin.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {snippetPlugin.apiRoute}
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
              <button
                onClick={() => setActiveSnippetLang('curl')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition ${activeSnippetLang === 'curl' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveSnippetLang('typescript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition ${activeSnippetLang === 'typescript' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                TypeScript / Node
              </button>
              <button
                onClick={() => setActiveSnippetLang('python')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition ${activeSnippetLang === 'python' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Python (Requests)
              </button>
            </div>

            {/* Snippet Display */}
            <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800">
              <button
                onClick={() => handleCopy(snippetPlugin.usageExample[activeSnippetLang], 'code_snippet')}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                title="Copy snippet"
              >
                {copiedKey === 'code_snippet' ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                {snippetPlugin.usageExample[activeSnippetLang]}
              </pre>
            </div>

            <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSnippetPlugin(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: Hook Inspector Modal                                             */}
      {/* ========================================================================= */}
      {hookInspectorPlugin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setHookInspectorPlugin(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Attached Tool Hooks: {hookInspectorPlugin.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Runtime execution points intercepted during API dispatch
                </p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              {hookInspectorPlugin.hooks.map((hook, index) => (
                <div key={hook.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      #{index + 1} {hook.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                      {hook.triggerEvent}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{hook.description}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>Handler: {hook.handlerName}()</span>
                    <span>Timeout: {hook.timeoutMs}ms • {hook.isAsync ? 'Async' : 'Sync'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setHookInspectorPlugin(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
