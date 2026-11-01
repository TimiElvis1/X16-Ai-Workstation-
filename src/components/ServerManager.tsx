import React, { useState } from 'react';
import { PrivateServer, CodeInjunction } from '../types';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  Terminal, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Settings, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Play, 
  Copy, 
  Sliders,
  Check
} from 'lucide-react';

interface ServerManagerProps {
  servers: PrivateServer[];
  injunctions: CodeInjunction[];
  onGenerateServer: (serverData: Partial<PrivateServer>) => void;
  onDeleteServer: (serverId: string) => void;
  onRestartServer: (serverId: string) => void;
  onRunInjunctionOnServer: (injunctionId: string, serverId: string) => void;
  onOpenPingTool: (ip: string) => void;
}

export const ServerManager: React.FC<ServerManagerProps> = ({
  servers = [],
  injunctions = [],
  onGenerateServer,
  onDeleteServer,
  onRestartServer,
  onRunInjunctionOnServer,
  onOpenPingTool
}) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedServerLogs, setSelectedServerLogs] = useState<PrivateServer | null>(servers?.[0] || null);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // Form State for Server Generation
  const [name, setName] = useState('');
  const [type, setType] = useState<PrivateServer['type']>('microservice');
  const [subnetId, setSubnetId] = useState('subnet-us-east-1');
  const [port, setPort] = useState(8080);
  const [os, setOs] = useState('Ubuntu 22.04 LTS');
  const [dockerImage, setDockerImage] = useState('node:20-alpine');
  const [services, setServices] = useState('Nginx, Node.js API, Health Monitor');
  const [envKey, setEnvKey] = useState('NODE_ENV');
  const [envValue, setEnvValue] = useState('production');

  const handleSubmitGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceList = services.split(',').map(s => s.trim()).filter(Boolean);
    onGenerateServer({
      name: name || `Server-Node-${(servers || []).length + 1}`,
      type,
      subnetId,
      port: Number(port),
      os,
      dockerImage,
      servicesRunning: serviceList.length > 0 ? serviceList : ['Container Runtime'],
      envVars: { [envKey]: envValue, SUBNET: subnetId }
    });
    setShowGenerateModal(false);
    // Reset Form
    setName('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  return (
    <div id="server-manager-view" className="space-y-6">
      
      {/* Header Bar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Private Server Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate, configure, and monitor isolated sub-connective server instances & container environments.
          </p>
        </div>

        <button
          id="btn-open-server-modal"
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-cyan-950 flex items-center justify-center space-x-2 transition-all ring-1 ring-cyan-400/30"
        >
          <Plus className="h-4 w-4" />
          <span>Generate Private Server</span>
        </button>
      </div>

      {/* Grid of Servers & Live Log Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Servers List (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((server) => {
              const isSelectedForLogs = selectedServerLogs?.id === server.id;
              return (
                <div
                  key={server.id}
                  className={`bg-slate-900/95 border rounded-2xl p-5 transition-all shadow-md relative overflow-hidden ${
                    isSelectedForLogs
                      ? 'border-cyan-500 ring-1 ring-cyan-500/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Status & Name */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-100">{server.name}</h3>
                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase rounded bg-slate-800 text-cyan-300">
                          {server.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-mono text-cyan-400 font-semibold">{server.ipAddress}:{server.port}</span>
                        <button 
                          onClick={() => copyToClipboard(server.ipAddress)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy IP"
                        >
                          {copiedIp === server.ipAddress ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                      server.status === 'online'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                        : server.status === 'provisioning'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800/60 animate-pulse'
                        : 'bg-red-950/80 text-red-400 border-red-800/60'
                    }`}>
                      {server.status}
                    </span>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span className="flex items-center space-x-1">
                          <Cpu className="h-3 w-3 text-cyan-400" />
                          <span>CPU Load</span>
                        </span>
                        <span className="font-mono text-slate-200">{server.cpuUsage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            server.cpuUsage > 75 ? 'bg-amber-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${server.cpuUsage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span className="flex items-center space-x-1">
                          <HardDrive className="h-3 w-3 text-indigo-400" />
                          <span>RAM Memory</span>
                        </span>
                        <span className="font-mono text-slate-200">{server.ramUsage} / {server.maxRam} MB</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${(server.ramUsage / server.maxRam) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Services Tags */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[10px] text-slate-400 mb-1">Services Running:</div>
                    <div className="flex flex-wrap gap-1">
                      {(server.servicesRunning || []).map((svc, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-950 text-slate-300 border border-slate-800 rounded">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedServerLogs(server)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                        isSelectedForLogs 
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Terminal className="h-3 w-3" />
                      <span>Console Logs</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onOpenPingTool(server.ipAddress)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                        title="Ping Diagnostic"
                      >
                        <Activity className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onRestartServer(server.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Restart Instance"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteServer(server.id)}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900/40"
                        title="Decommission Server"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Live Server Terminal Console Drawer (1 column) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[420px]">
          {selectedServerLogs ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-sm font-mono font-bold text-slate-200">
                      {selectedServerLogs.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">{selectedServerLogs.ipAddress}</span>
                </div>

                {/* Subnet Specs */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500">Subnet: </span>
                    <span className="text-slate-200">{selectedServerLogs.subnetId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">OS: </span>
                    <span className="text-slate-200">{selectedServerLogs.os}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Docker: </span>
                    <span className="text-slate-200">{selectedServerLogs.dockerImage || 'none'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Latency: </span>
                    <span className="text-emerald-400">{selectedServerLogs.latencyMs}ms</span>
                  </div>
                </div>

                {/* Console Log Terminal Window */}
                <div className="mt-4">
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>Server stdout/stderr output</span>
                    <span className="text-emerald-400 font-normal">● Streaming</span>
                  </div>
                  <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-emerald-400/90 h-[220px] overflow-y-auto space-y-1.5 border border-slate-800 shadow-inner">
                    {(selectedServerLogs.logs || []).map((logLine, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {logLine}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Code Injunction Inserter */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">Execute Injunction on Server:</div>
                <div className="flex items-center space-x-2">
                  <select 
                    id="select-server-injunction"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    onChange={(e) => {
                      if (e.target.value) {
                        onRunInjunctionOnServer(e.target.value, selectedServerLogs.id);
                      }
                    }}
                  >
                    <option value="">-- Select Parameter Function --</option>
                    {injunctions.map(inj => (
                      <option key={inj.id} value={inj.id}>{inj.name}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">
              Select a server to view console telemetry
            </div>
          )}
        </div>

      </div>

      {/* Generate Server Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Provision Private Server</h3>
              </div>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Server Name</label>
                <input
                  type="text"
                  placeholder="e.g. Edge-Router-01"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Architecture Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="microservice">Microservice</option>
                    <option value="edge_compute">Edge Compute</option>
                    <option value="vector_db">Vector DB Cluster</option>
                    <option value="gateway_proxy">Gateway Proxy</option>
                    <option value="automation_worker">Automation Worker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Subnet Segment</label>
                  <select
                    value={subnetId}
                    onChange={(e) => setSubnetId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="subnet-us-east-1">subnet-us-east-1 (10.142.0.0)</option>
                    <option value="subnet-us-central-2">subnet-us-central-2 (10.142.1.0)</option>
                    <option value="subnet-eu-west-1">subnet-eu-west-1 (10.142.2.0)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Exposed Port</label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Docker Image</label>
                  <input
                    type="text"
                    value={dockerImage}
                    onChange={(e) => setDockerImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Services Running (comma-separated)</label>
                <input
                  type="text"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-950"
                >
                  Provision Instance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
