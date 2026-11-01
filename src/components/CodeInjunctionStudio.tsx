import React, { useState } from 'react';
import { CodeInjunction, FunctionParameter } from '../types';
import { 
  Code2, 
  Play, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Copy, 
  Sliders, 
  Braces, 
  Sparkles, 
  Save, 
  Zap,
  Check,
  Workflow,
  Radio,
  Globe,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface InjunctionStudioProps {
  injunctions: CodeInjunction[];
  onCreateInjunction: (injunction: Partial<CodeInjunction>) => void;
  onExecuteInjunction: (injunctionId: string, inputParams: any) => Promise<any>;
}

export const CodeInjunctionStudio: React.FC<InjunctionStudioProps> = ({
  injunctions,
  onCreateInjunction,
  onExecuteInjunction
}) => {
  const [viewMode, setViewMode] = useState<'editor' | 'n8n_canvas'>('editor');
  const [selectedInjunctionId, setSelectedInjunctionId] = useState<string>(injunctions?.[0]?.id || '');
  const activeInjunction = (injunctions || []).find(i => i.id === selectedInjunctionId) || injunctions?.[0];

  // Editor State
  const [codeText, setCodeText] = useState<string>(activeInjunction?.code || '');
  const [injName, setInjName] = useState<string>(activeInjunction?.name || '');
  const [injDesc, setInjDesc] = useState<string>(activeInjunction?.description || '');
  const [injTrigger, setInjTrigger] = useState<CodeInjunction['triggerType']>(activeInjunction?.triggerType || 'manual');
  
  // Execution Sandbox State
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // n8n Workflow Studio State
  const [activeN8nPipeline, setActiveN8nPipeline] = useState<string>('n8n-proto-webhook-mqtt');
  const [n8nExecStatus, setN8nExecStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [n8nStepResults, setN8nStepResults] = useState<any[]>([]);

  // Sync state when active injunction changes
  React.useEffect(() => {
    if (activeInjunction) {
      setCodeText(activeInjunction.code || '');
      setInjName(activeInjunction.name || '');
      setInjDesc(activeInjunction.description || '');
      setInjTrigger(activeInjunction.triggerType || 'manual');
      
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

  const handleRunSandbox = async () => {
    setIsExecuting(true);
    setExecutionError(null);
    setExecutionLogs(["[SANDBOX] Dispatching code injunction to server execution sandbox..."]);

    try {
      const response = await onExecuteInjunction(activeInjunction.id, inputValues);
      setExecutionResult(response.output);
      setExecutionLogs(response.logs || ["[LOG] Injunction returned result cleanly."]);
    } catch (err: any) {
      setExecutionError(err.message || "Runtime error inside parameter function.");
      setExecutionLogs(prev => [...prev, `[ERROR] ${err.message || String(err)}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCreateNewInjunction = () => {
    const newInj: Partial<CodeInjunction> = {
      name: `n8n_Protocol_Node_${injunctions.length + 1}`,
      description: "n8n network automation protocol injunction",
      language: "typescript",
      triggerType: "webhook",
      parameters: [
        { name: "protocol", type: "string", required: true, description: "HTTP | MQTT | WEBSOCKET | SFTP", defaultValue: "HTTP" },
        { name: "endpoint", type: "string", required: true, description: "Target network URL", defaultValue: "http://10.142.0.12:5678/webhook" }
      ],
      code: `// n8n Network Protocol Injunction
function execute(params) {
  const { protocol, endpoint } = params;
  console.log("n8n dispatching protocol: " + protocol + " -> " + endpoint);
  return {
    n8nNodeType: "n8n-nodes-base.network-protocol",
    status: "DELIVERED",
    timestamp: new Date().toISOString(),
    protocol,
    endpoint,
    latencyMs: 14
  };
}`
    };
    onCreateInjunction(newInj);
  };

  const handleRunN8nPipeline = async () => {
    setN8nExecStatus('running');
    setN8nStepResults([]);

    // Step 1: Webhook Trigger Node
    setTimeout(() => {
      setN8nStepResults(prev => [
        ...prev,
        {
          step: 1,
          nodeName: "n8n Webhook HTTP Listener",
          protocol: "HTTP POST",
          status: "SUCCESS",
          latencyMs: 4,
          payload: { event: "ISP_PORT_TELEMETRY", port: 8080, ip: "10.142.0.12" }
        }
      ]);
    }, 400);

    // Step 2: Protocol Router Node
    setTimeout(() => {
      setN8nStepResults(prev => [
        ...prev,
        {
          step: 2,
          nodeName: "n8n Network Router / Filter Node",
          protocol: "INTERNAL BGP ROUTE",
          status: "SUCCESS",
          latencyMs: 2,
          ruleMatched: "Port == 8080 && Priority == HIGH -> Route to MQTT Broker"
        }
      ]);
    }, 900);

    // Step 3: MQTT / TCP Broker Injunction Dispatch
    setTimeout(() => {
      setN8nStepResults(prev => [
        ...prev,
        {
          step: 3,
          nodeName: "n8n MQTT Broker Automation Injunction",
          protocol: "MQTT QoS 1",
          status: "DELIVERED",
          latencyMs: 11,
          topic: "subnet/telemetry/nodes",
          brokerHost: "10.142.1.88"
        }
      ]);
      setN8nExecStatus('success');
    }, 1500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div id="code-injunction-studio-view" className="space-y-6">
      
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">Code Injunction & n8n Automation Studio</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build parameter functions and orchestrate full n8n.com automation node pipelines across network protocols (HTTP, Webhooks, MQTT, WebSockets, SFTP).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle Switch */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Injunction Editor</span>
            </button>

            <button
              onClick={() => setViewMode('n8n_canvas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'n8n_canvas'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Workflow className="h-3.5 w-3.5" />
              <span>n8n Protocol Canvas</span>
            </button>
          </div>

          <button
            onClick={handleCreateNewInjunction}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Injunction</span>
          </button>
        </div>
      </div>

      {/* Mode 1: n8n Workflow Visualizer / Automation Canvas */}
      {viewMode === 'n8n_canvas' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[10px] border border-red-800 font-bold">
                  n8n.com Embedded Engine
                </span>
                <h3 className="text-base font-bold text-slate-100">Full n8n Network Protocol Automation Workflow</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visual pipeline chaining Webhooks, Network Protocol Routers, MQTT Brokers, and S3 Storage Sync Injunctions.
              </p>
            </div>

            <button
              onClick={handleRunN8nPipeline}
              disabled={n8nExecStatus === 'running'}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-red-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{n8nExecStatus === 'running' ? 'Executing n8n Nodes...' : 'Run Full n8n Workflow'}</span>
            </button>
          </div>

          {/* n8n Node Visual Graph */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Node 1: Webhook Trigger */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[9px] font-mono font-bold">TRIGGER</span>
                  <Globe className="h-4 w-4 text-amber-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2">1. n8n Webhook Listener</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Listens on <code className="text-cyan-300 font-mono">/webhook/v1/network-event</code> for HTTP/TLS traffic.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Protocol: HTTP/TLS</span>
                <span className="text-emerald-400">Listening</span>
              </div>
            </div>

            {/* Node 2: Protocol Router */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 text-[9px] font-mono font-bold">SWITCH</span>
                  <Layers className="h-4 w-4 text-indigo-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2">2. n8n Protocol Router</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Filters packets, validates HMAC signatures, and routes by TCP/UDP protocol type.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Evaluator: JavaScript</span>
                <span className="text-cyan-400">Rules Active</span>
              </div>
            </div>

            {/* Node 3: MQTT Network Dispatcher */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 text-[9px] font-mono font-bold">BROKER</span>
                  <Radio className="h-4 w-4 text-purple-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2">3. n8n MQTT Broker Node</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Publishes transformed telemetry to topic <code className="text-cyan-300 font-mono">subnet/sensors/telemetry/#</code>.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Target: 10.142.1.88</span>
                <span className="text-purple-400">QoS 1</span>
              </div>
            </div>

            {/* Node 4: S3 Network Storage Sync */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold">STORAGE</span>
                  <Database className="h-4 w-4 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2">4. n8n SFTP / S3 Bucket Sync</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Transfers gzipped log archives over SSH port 22 directly to S3 object storage.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Protocol: SFTP/S3</span>
                <span className="text-emerald-400">Synced</span>
              </div>
            </div>

          </div>

          {/* n8n Step-by-Step Execution Output Log Stream */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 font-mono flex items-center space-x-1">
              <Terminal className="h-3.5 w-3.5 text-red-400" />
              <span>n8n Node Execution Trace Logs</span>
            </h4>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 max-h-[220px] overflow-y-auto font-mono text-[11px]">
              {n8nStepResults.length > 0 ? (
                n8nStepResults.map((res, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-cyan-300 font-bold">
                      <span>Step {res.step}: {res.nodeName}</span>
                      <span className="text-emerald-400 text-[10px] flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{res.status} ({res.latencyMs}ms)</span>
                      </span>
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Protocol: {res.protocol} | Payload: {JSON.stringify(res.payload || res.ruleMatched || res.topic)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-600 italic">Click 'Run Full n8n Workflow' to observe real-time step execution trace logs.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Standard Code Injunction Studio */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Injunction Sidebar List (1 column) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between px-2 pb-2 border-b border-slate-800">
              <span>Injunction Library</span>
              <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full font-mono">{injunctions.length}</span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {injunctions.map((inj) => {
                const isSelected = inj.id === activeInjunction?.id;
                const isN8n = inj.name?.toLowerCase().includes('n8n') || false;

                return (
                  <div
                    key={inj.id}
                    onClick={() => setSelectedInjunctionId(inj.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-1">
                        {isN8n && <Workflow className="h-3 w-3 text-red-400 shrink-0" />}
                        <span className="truncate">{inj.name}</span>
                      </span>
                      <span className={`px-1.5 py-0.2 text-[9px] uppercase font-mono rounded ${
                        isN8n ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-cyan-300'
                      }`}>
                        {inj.triggerType}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{inj.description}</p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{inj.parameters.length} params</span>
                      <span className="text-emerald-400">{inj.executionCount || 0} runs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Editor & Parameter Schema (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Editor Header / Meta */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Function Name</label>
                  <input
                    type="text"
                    value={injName}
                    onChange={(e) => setInjName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Trigger Binding</label>
                  <select
                    value={injTrigger}
                    onChange={(e: any) => setInjTrigger(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ai_tool">AI Model Tool Call</option>
                    <option value="manual">Manual Sandbox Execution</option>
                    <option value="webhook">External Webhook Endpoint</option>
                    <option value="schedule">Scheduled Cron Worker</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={injDesc}
                  onChange={(e) => setInjDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Code Injunction Textarea Window */}
              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-[11px] font-semibold text-slate-300 font-mono flex items-center space-x-1">
                    <Braces className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Executable Parameter Function (JavaScript / TS)</span>
                  </span>
                  <button
                    onClick={copyCode}
                    className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
                  <textarea
                    value={codeText}
                    onChange={(e) => setCodeText(e.target.value)}
                    rows={14}
                    className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none resize-y leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Input Parameter Schema List */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1">
                  <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Declared Input Parameters ({(activeInjunction?.parameters || []).length})</span>
                </h4>
                <div className="space-y-2">
                  {(activeInjunction?.parameters || []).map((param, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-cyan-300 font-semibold">{param.name}</span>
                        <span className="ml-2 px-1.5 py-0.2 text-[9px] bg-slate-800 text-slate-400 rounded">{param.type}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{param.description}</p>
                      </div>
                      {param.required && <span className="text-[9px] text-amber-400 font-mono font-semibold">REQUIRED</span>}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Execution Sandbox Console (1 column) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">Execution Sandbox</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">READY</span>
              </div>

              {/* Parameter Input Controls */}
              <div className="mt-4 space-y-3">
                <div className="text-xs font-semibold text-slate-300">Input Parameter Values:</div>
                {(activeInjunction?.parameters || []).map((param) => (
                  <div key={param.name}>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      {param.name} <span className="text-slate-500">({param.type})</span>
                    </label>
                    {param.type === 'boolean' ? (
                      <input
                        type="checkbox"
                        checked={!!inputValues[param.name]}
                        onChange={(e) => handleInputChange(param.name, e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-cyan-500"
                      />
                    ) : (
                      <input
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={inputValues[param.name] ?? ''}
                        onChange={(e) => handleInputChange(param.name, e.target.value)}
                        placeholder={param.description}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Execute Button */}
              <button
                onClick={handleRunSandbox}
                disabled={isExecuting}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>{isExecuting ? 'Running Injunction...' : 'Run Parameter Function'}</span>
              </button>

              {/* Output & Logs Display */}
              <div className="mt-5 space-y-2">
                <div className="text-[11px] font-mono font-semibold text-slate-300 flex items-center justify-between">
                  <span>Output Console JSON</span>
                  {executionResult && <span className="text-emerald-400 text-[10px]">SUCCESS</span>}
                </div>

                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200 h-[180px] overflow-y-auto border border-slate-800 shadow-inner">
                  {executionResult ? (
                    <pre className="text-cyan-300 leading-relaxed whitespace-pre-wrap">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  ) : executionError ? (
                    <div className="text-red-400 font-mono">{executionError}</div>
                  ) : (
                    <div className="text-slate-600 italic">Click Run to execute script and inspect output JSON payload</div>
                  )}
                </div>
              </div>

              {/* Console Log Lines */}
              <div className="mt-3">
                <div className="text-[10px] font-mono text-slate-400 mb-1">Execution Log Tail:</div>
                <div className="bg-slate-900/80 p-2 rounded-lg text-[10px] font-mono text-emerald-400 space-y-1 max-h-[80px] overflow-y-auto border border-slate-800">
                  {executionLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
