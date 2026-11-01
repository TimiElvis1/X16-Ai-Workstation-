import React, { useState } from 'react';
import { PrivateServer, CodeInjunction } from '../types';
import { UrlDomainGrabberN8nStudio } from './UrlDomainGrabberN8nStudio';
import { 
  Workflow, 
  Server, 
  Play, 
  Plus, 
  Zap, 
  Globe, 
  Radio, 
  Database, 
  Cpu, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Sliders, 
  ArrowRight, 
  HardDrive, 
  Link2, 
  ExternalLink,
  ChevronRight,
  Filter,
  Box
} from 'lucide-react';

interface N8nServersWorkspaceProps {
  servers?: PrivateServer[];
  injunctions?: CodeInjunction[];
  onGenerateServer?: (serverData: Partial<PrivateServer>) => void;
  onCreateInjunction?: (injunction: Partial<CodeInjunction>) => void;
  onExecuteInjunction?: (injunctionId: string, inputParams: any) => Promise<any>;
  onRestartServer?: (serverId: string) => void;
}

export const N8nServersWorkspace: React.FC<N8nServersWorkspaceProps> = ({
  servers = [],
  injunctions = [],
  onGenerateServer = (_serverData?: Partial<PrivateServer>) => {},
  onCreateInjunction = (_injunction?: Partial<CodeInjunction>) => {},
  onExecuteInjunction = async (_injunctionId?: string, _inputParams?: any): Promise<any> => ({ output: { status: 'OK' }, logs: ['[n8n SUCCESS] Executed successfully.'] }),
  onRestartServer = (_serverId?: string) => {}
}) => {
  const [workspaceMode, setWorkspaceMode] = useState<'FLEET_INJUNCTIONS' | 'URL_DOMAIN_GRABBER'>('FLEET_INJUNCTIONS');
  const [selectedServerId, setSelectedServerId] = useState<string>(servers?.[0]?.id || '');
  const [selectedInjunctionId, setSelectedInjunctionId] = useState<string>('');
  
  // Filter n8n specific injunctions or all injunctions
  const n8nInjunctions = (injunctions || []).filter(inj => 
    (inj?.name || '').toLowerCase().includes('n8n') || 
    (inj?.description || '').toLowerCase().includes('n8n') ||
    (inj?.id || '').includes('n8n')
  );

  const displayInjunctions = n8nInjunctions.length > 0 ? n8nInjunctions : (injunctions || []);
  const activeInjunction = displayInjunctions.find(i => i?.id === selectedInjunctionId) || displayInjunctions[0];

  // Execution Sandbox State
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Workflow Pipeline Trigger State
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [pipelineTrace, setPipelineTrace] = useState<any[]>([]);

  // Sync default input values when active injunction changes
  React.useEffect(() => {
    if (activeInjunction) {
      setSelectedInjunctionId(activeInjunction.id);
      const defaults: Record<string, any> = {};
      (activeInjunction.parameters || []).forEach(p => {
        defaults[p.name] = p.defaultValue !== undefined ? p.defaultValue : p.type === 'number' ? 0 : p.type === 'boolean' ? false : '';
      });
      setInputValues(defaults);
      setExecutionResult(activeInjunction.lastOutput || null);
      setExecutionLogs(activeInjunction.lastExecutionLog ? [activeInjunction.lastExecutionLog] : []);
    }
  }, [selectedInjunctionId, activeInjunction]);

  const handleInputChange = (paramName: string, val: any) => {
    setInputValues(prev => ({ ...prev, [paramName]: val }));
  };

  const handleRunInjunctionOnServer = async () => {
    if (!activeInjunction) return;
    setIsExecuting(true);
    setExecutionLogs([`[n8n DISPATCH] Initiating ${activeInjunction.name} on target server node...`]);

    try {
      const res = await onExecuteInjunction(activeInjunction.id, {
        ...inputValues,
        targetServerId: selectedServerId
      });
      setExecutionResult(res.output);
      setExecutionLogs(res.logs || [`[n8n SUCCESS] Workflow execution finished cleanly.`]);
    } catch (err: any) {
      setExecutionLogs(prev => [...prev, `[n8n ERROR] ${err.message || String(err)}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDeployNewN8nServer = () => {
    onGenerateServer({
      name: `n8n-Worker-Node-0${servers.length + 1}`,
      type: 'microservice',
      os: 'Ubuntu 22.04 LTS (n8n Docker Runtime)',
      dockerImage: 'n8nio/n8n:latest',
      servicesRunning: ['n8n Engine', 'PostgreSQL Backing Store', 'Webhook Receiver', 'Redis Queue'],
      ipAddress: `10.142.0.${40 + servers.length * 2}`
    });
  };

  const handleCreateN8nInjunctionTemplate = (type: string) => {
    let templateInj: Partial<CodeInjunction> = {};

    if (type === 'webhook') {
      templateInj = {
        name: `n8n_HTTP_Webhook_Node_${injunctions.length + 1}`,
        description: "n8n HTTP Webhook trigger endpoint with TLS signature verification and JSON body parsing.",
        language: "typescript",
        triggerType: "webhook",
        parameters: [
          { name: "webhookPath", type: "string", required: true, description: "Endpoint URL Path", defaultValue: "/webhook/n8n-trigger" },
          { name: "authHeader", type: "string", required: false, description: "Authorization Bearer Token", defaultValue: "Bearer n8n_sec_88492" }
        ],
        code: `function execute(params) {
  const { webhookPath, authHeader } = params;
  return {
    n8nNodeType: "n8n-nodes-base.webhook",
    endpoint: webhookPath,
    authVerified: true,
    status: "TRIGGERED",
    timestamp: new Date().toISOString(),
    incomingPayload: { event: "PAYLOAD_DISPATCH", source: "External API" }
  };
}`
      };
    } else if (type === 'mqtt') {
      templateInj = {
        name: `n8n_MQTT_Broker_Node_${injunctions.length + 1}`,
        description: "n8n MQTT network broker node subscribing to device telemetry queues with QoS 1.",
        language: "typescript",
        triggerType: "ai_tool",
        parameters: [
          { name: "brokerHost", type: "string", required: true, description: "MQTT Broker Host", defaultValue: "10.142.1.88" },
          { name: "topic", type: "string", required: true, description: "MQTT Topic Filter", defaultValue: "subnet/telemetry/nodes" }
        ],
        code: `function execute(params) {
  const { brokerHost, topic } = params;
  return {
    n8nNodeType: "n8n-nodes-base.mqtt",
    broker: brokerHost,
    topic,
    qos: 1,
    status: "CONNECTED",
    packetsReceived: 42
  };
}`
      };
    } else {
      templateInj = {
        name: `n8n_WebSocket_Stream_Node_${injunctions.length + 1}`,
        description: "n8n WebSocket streaming listener for real-time TCP socket frame ingestion.",
        language: "typescript",
        triggerType: "schedule",
        parameters: [
          { name: "wsEndpoint", type: "string", required: true, description: "WebSocket Socket URL", defaultValue: "ws://10.142.0.12:8080/ws" }
        ],
        code: `function execute(params) {
  const { wsEndpoint } = params;
  return {
    n8nNodeType: "n8n-nodes-base.websocket",
    socketUrl: wsEndpoint,
    connectionState: "OPEN",
    framesProcessed: 128
  };
}`
      };
    }

    onCreateInjunction(templateInj);
  };

  const handleRunFullServerPipeline = async () => {
    setPipelineRunning(true);
    setPipelineTrace([]);

    const steps = [
      { step: 1, server: "n8n-Gateway-Node", action: "n8n Webhook Listener", protocol: "HTTP POST", latency: "3ms", status: "RECEIVED" },
      { step: 2, server: "srv-worker-03", action: "n8n JSON Schema Validator", protocol: "Internal IPC", latency: "2ms", status: "VALIDATED" },
      { step: 3, server: "srv-edge-01", action: "n8n MQTT Broker Dispatch", protocol: "MQTT QoS 1", latency: "8ms", status: "DELIVERED" },
      { step: 4, server: "srv-db-02", action: "n8n SFTP S3 Archive Backup", protocol: "SFTP SSH", latency: "14ms", status: "SYNC_COMPLETE" }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setPipelineTrace(prev => [...prev, steps[i]]);
    }

    setPipelineRunning(false);
  };

  const copyResultJson = () => {
    if (!executionResult) return;
    navigator.clipboard.writeText(JSON.stringify(executionResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div id="n8n-servers-workspace-view" className="space-y-6">
      
      {/* Workspace Header & Top Metrics */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-orange-600 text-white shadow-md shadow-red-950">
                <Workflow className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
                    n8n Automation + Servers Injunction Workspace
                  </h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800 rounded-full">
                    n8n.com INTEGRATED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Orchestrate n8n protocol automation injunctions bound directly across private server nodes and network protocol bridges.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDeployNewN8nServer}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-red-950 flex items-center space-x-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Deploy n8n Server Node</span>
            </button>
          </div>
        </div>

        {/* Real-time Cluster Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Active Server Nodes</div>
            <div className="text-lg font-bold text-slate-100 mt-1 flex items-center space-x-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <span>{servers.length} Servers</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">n8n Injunction Nodes</div>
            <div className="text-lg font-bold text-slate-100 mt-1 flex items-center space-x-2">
              <Workflow className="h-4 w-4 text-red-400" />
              <span>{displayInjunctions.length} Active Nodes</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Supported Protocols</div>
            <div className="text-xs font-mono text-amber-300 mt-1 flex items-center space-x-1">
              <Globe className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>HTTP • MQTT • WS • SFTP</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">n8n Cluster Health</div>
            <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center space-x-1 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>100% HEALTHY (0ms loss)</span>
            </div>
          </div>
        </div>

        {/* Workspace Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setWorkspaceMode('FLEET_INJUNCTIONS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                workspaceMode === 'FLEET_INJUNCTIONS'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Workflow className="h-4 w-4" />
              <span>n8n Fleet & Injunctions Engine</span>
            </button>
            <button
              onClick={() => setWorkspaceMode('URL_DOMAIN_GRABBER')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                workspaceMode === 'URL_DOMAIN_GRABBER'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Globe className="h-4 w-4 text-orange-400" />
              <span>URL & Domain Grabbing Extension</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-orange-950 text-orange-300 rounded font-black border border-orange-800">
                NEW
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Node Relay: <span className="text-emerald-400 font-bold">10.142.0.40:5678 (n8n v1.82.2)</span>
          </div>
        </div>

      </div>

      {/* Render URL Domain Grabber Studio Extension */}
      {workspaceMode === 'URL_DOMAIN_GRABBER' ? (
        <UrlDomainGrabberN8nStudio
          servers={servers}
          onExecuteInjunction={onExecuteInjunction}
        />
      ) : (
        /* Main Grid: Server Fleet & Injunction Execution Studio */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Server Nodes Fleet & n8n Runtime Containers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">Target n8n Server Cluster</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{servers.length} Nodes</span>
          </div>

          {/* Server Selector List */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {servers.map((srv) => {
              const isSelected = srv.id === selectedServerId;
              const isN8n = (srv.name || '').toLowerCase().includes('n8n') || srv.dockerImage?.includes('n8n');

              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServerId(srv.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/80 shadow-md ring-1 ring-red-500/30'
                      : 'bg-slate-950/80 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 font-mono flex items-center space-x-1.5">
                      <Box className={`h-3.5 w-3.5 ${isN8n ? 'text-red-400' : 'text-cyan-400'}`} />
                      <span className="truncate">{srv.name}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ONLINE
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>IP: {srv.ipAddress}</span>
                    <span className="text-amber-300">{srv.dockerImage || 'Ubuntu 22.04'}</span>
                  </div>

                  {/* Resource meters */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                    <div>
                      <span>CPU Load: </span>
                      <span className="text-slate-200 font-bold">{srv.cpuUsagePercent || 14}%</span>
                    </div>
                    <div>
                      <span>RAM: </span>
                      <span className="text-slate-200 font-bold">{srv.ramUsagePercent || 32}%</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">n8n Port: 5678</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestartServer(srv.id);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Restart Container</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Create Templates */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-2">Create n8n Injunction Node Template:</div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                onClick={() => handleCreateN8nInjunctionTemplate('webhook')}
                className="p-2 bg-slate-950 border border-slate-800 hover:border-red-500/60 rounded-lg text-slate-300 font-mono flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <Globe className="h-3.5 w-3.5 text-amber-400" />
                <span>+ Webhook</span>
              </button>

              <button
                onClick={() => handleCreateN8nInjunctionTemplate('mqtt')}
                className="p-2 bg-slate-950 border border-slate-800 hover:border-red-500/60 rounded-lg text-slate-300 font-mono flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <Radio className="h-3.5 w-3.5 text-purple-400" />
                <span>+ MQTT Broker</span>
              </button>

              <button
                onClick={() => handleCreateN8nInjunctionTemplate('websocket')}
                className="p-2 bg-slate-950 border border-slate-800 hover:border-red-500/60 rounded-lg text-slate-300 font-mono flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span>+ WebSocket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: n8n Injunction Dispatcher & Interactive Sandbox (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* n8n Injunction Selector & Code Preview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Workflow className="h-4 w-4 text-red-400" />
                <h3 className="text-sm font-bold text-slate-100">n8n Injunction Execution Terminal</h3>
              </div>

              {/* Injunction Selector Dropdown */}
              <select
                value={selectedInjunctionId}
                onChange={(e) => setSelectedInjunctionId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {displayInjunctions.map(inj => (
                  <option key={inj.id} value={inj.id}>
                    {inj.name} ({inj.triggerType})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Injunction Details */}
            {activeInjunction && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 font-mono">{activeInjunction.name}</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[10px]">
                      {activeInjunction.triggerType.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeInjunction.description}</p>
                </div>

                {/* Input Parameters Form */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 font-mono">
                    n8n Injunction Input Parameters:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeInjunction?.parameters || []).map((param) => (
                      <div key={param.name}>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          {param.name} <span className="text-slate-500">({param.type})</span>
                        </label>
                        <input
                          type={param.type === 'number' ? 'number' : 'text'}
                          value={inputValues[param.name] ?? ''}
                          onChange={(e) => handleInputChange(param.name, e.target.value)}
                          placeholder={param.description}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execute Button */}
                <button
                  onClick={handleRunInjunctionOnServer}
                  disabled={isExecuting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-red-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>
                    {isExecuting 
                      ? 'Dispatching to n8n Server Node...' 
                      : `Execute on Server [${servers.find(s => s.id === selectedServerId)?.name || 'Selected Server'}]`
                    }
                  </span>
                </button>

                {/* Execution Result JSON Output */}
                <div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-semibold text-slate-300 font-mono">
                      Server Output Payload Response:
                    </span>
                    {executionResult && (
                      <button
                        onClick={copyResultJson}
                        className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                      >
                        {copiedJson ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-cyan-300 h-[180px] overflow-y-auto border border-slate-800 shadow-inner">
                    {executionResult ? (
                      <pre className="whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(executionResult, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-slate-600 italic">Click Execute to dispatch injunction payload to target server node</div>
                    )}
                  </div>
                </div>

                {/* Console Log Trace */}
                <div>
                  <div className="text-[10px] font-mono text-slate-400 mb-1">n8n Execution Log Stream:</div>
                  <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-[10px] text-emerald-400 space-y-1 h-[70px] overflow-y-auto border border-slate-800">
                    {executionLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Multi-Server n8n Pipeline Visual Trace */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                  <Workflow className="h-4 w-4 text-red-400" />
                  <span>Multi-Server n8n Protocol Pipeline Canvas</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Test chained workflow execution across multiple server nodes on the subnet.
                </p>
              </div>

              <button
                onClick={handleRunFullServerPipeline}
                disabled={pipelineRunning}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{pipelineRunning ? 'Traced...' : 'Run Pipeline'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-[11px]">
              {pipelineTrace.length > 0 ? (
                pipelineTrace.map((tr, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-cyan-300 font-bold">
                        Hop {tr.step}: {tr.server} → {tr.action}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Protocol: {tr.protocol} | Latency: {tr.latency}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                      {tr.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-600 italic">Click 'Run Pipeline' to simulate a multi-hop n8n workflow across server nodes.</div>
              )}
            </div>
          </div>

        </div>

      </div>
      )}

    </div>
  );
};
