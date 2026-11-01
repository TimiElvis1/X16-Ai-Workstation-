import React, { useState, useEffect } from 'react';
import { PrivateServer, CodeInjunction } from '../types';
import { 
  Database, 
  Terminal, 
  Zap, 
  Search, 
  Copy, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Code, 
  Check, 
  Layers, 
  Play, 
  FileText,
  Server,
  Activity
} from 'lucide-react';

interface CacheDumpingWorkspaceProps {
  servers: PrivateServer[];
  injunctions: CodeInjunction[];
  onCreateInjunction: (injunction: Partial<CodeInjunction>) => void;
  onExecuteInjunction: (injunctionId: string, inputParams: any) => Promise<any>;
}

interface DumpSample {
  address: string;
  hex: string;
  ascii: string;
}

export const CacheDumpingWorkspace: React.FC<CacheDumpingWorkspaceProps> = ({
  servers,
  injunctions,
  onCreateInjunction,
  onExecuteInjunction
}) => {
  const [selectedServerId, setSelectedServerId] = useState<string>(servers[0]?.id || '');
  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0];

  const [cacheEngine, setCacheEngine] = useState<'REDIS' | 'MEMCACHED' | 'V8_HEAP' | 'KERNEL_PAGE_CACHE'>('REDIS');
  const [dumpFormat, setDumpFormat] = useState<'HEXDUMP' | 'JSON_KV' | 'RAW_TEXT'>('HEXDUMP');
  const [bufferSize, setBufferSize] = useState<string>('64KB');
  const [isDumping, setIsDumping] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [dumpedLogs, setDumpedLogs] = useState<string[]>([
    `[CACHE DUMP INITIALIZED] Selected target node: ${activeServer?.name || 'srv-01'} [${activeServer?.ipAddress || '10.142.0.12'}]`,
    `[SAFE MODE ACTIVE] Cache dumping running in read-only telemetry mode.`
  ]);

  // Simulated Hex Dump memory lines
  const [hexDumpLines, setHexDumpLines] = useState<DumpSample[]>([]);
  const [jsonDumpOutput, setJsonDumpOutput] = useState<string>('');

  // Generate memory dump
  const generateDumpData = () => {
    setIsDumping(true);
    setDumpedLogs(prev => [
      ...prev,
      `[INJUNCTION TRIGGER] Executing Cache_Memory_Dump_Injunction on node ${activeServer?.name} [${activeServer?.ipAddress}]...`,
      `[BUFFER ALLOC] Inspecting ${cacheEngine} cache engine (${bufferSize} buffer window)...`
    ]);

    setTimeout(() => {
      // Generate hex lines
      const sampleLines: DumpSample[] = [];
      const baseAddr = 0x00004f20;
      const sampleStrings = [
        `user_session:sess_${Math.floor(10000 + Math.random() * 90000)}`,
        `auth_token:bearer_eyJhbGciOiJIUzI1NiIsInR5cCI6`,
        `n8n_workflow_state:RUNNING_NODE_5678`,
        `subnet_ip_route_10_142_0_12:ACTIVE`,
        `redis_key_telemetry_cache_v2:OK`,
        `node_v8_memory_pointer_0x8f22:ALLOC`
      ];

      for (let i = 0; i < 24; i++) {
        const addrHex = '0x' + (baseAddr + i * 16).toString(16).padStart(8, '0');
        let hexPart = '';
        let asciiPart = '';
        
        for (let j = 0; j < 16; j++) {
          const charCode = Math.floor(32 + Math.random() * 94);
          hexPart += charCode.toString(16).padStart(2, '0') + ' ';
          asciiPart += (charCode >= 32 && charCode <= 126) ? String.fromCharCode(charCode) : '.';
        }

        // Inject readable strings randomly
        if (i % 4 === 0) {
          const str = sampleStrings[(i / 4) % sampleStrings.length];
          asciiPart = (str + '................').slice(0, 16);
        }

        sampleLines.push({
          address: addrHex,
          hex: hexPart.trim(),
          ascii: asciiPart
        });
      }

      setHexDumpLines(sampleLines);

      // Generate JSON dump
      const jsonSample = {
        node: activeServer?.name || 'srv-node',
        ipAddress: activeServer?.ipAddress || '10.142.0.12',
        cacheEngine: cacheEngine,
        bufferSizeAllocated: bufferSize,
        timestamp: new Date().toISOString(),
        keysExtracted: 18,
        dumpSummary: {
          sessionCacheHits: 1420,
          memoryUtilization: `${activeServer?.ramUsage || 4}GB / ${activeServer?.maxRam || 16}GB`,
          activeRoutes: ["10.142.0.0/24", "10.142.1.0/24"],
          n8nEngineBuffer: "Port 5678 - 12 Webhook Injunction Objects Cached"
        },
        cachedKeysSample: [
          { key: "telemetry:radar:node_state", ttl: 3600, type: "hash" },
          { key: "n8n:workflow:active_execution_882", ttl: 1200, type: "string" },
          { key: "auth:subnet_admin_token", ttl: 86400, type: "string" },
          { key: "vector_db:qdrant_indexing_buffer", ttl: 300, type: "list" }
        ]
      };
      setJsonDumpOutput(JSON.stringify(jsonSample, null, 2));

      setIsDumping(false);
      setDumpedLogs(prev => [
        ...prev,
        `[DUMP COMPLETE] Successfully extracted memory cache dump (${sampleLines.length * 16} bytes read). Safe telemetry mode confirmed.`
      ]);
    }, 600);
  };

  useEffect(() => {
    if (servers.length > 0) {
      generateDumpData();
    }
  }, [selectedServerId, cacheEngine]);

  // Create & Save Code Injunction
  const handleRegisterCacheDumpInjunction = () => {
    const snippet: Partial<CodeInjunction> = {
      name: `Injunction_Cache_Memory_Dumper_${injunctions.length + 1}`,
      description: `Performs safe read-only memory cache dumping on server node ${activeServer?.name || 'target'} targeting ${cacheEngine}.`,
      language: 'typescript',
      triggerType: 'webhook',
      parameters: [
        { name: 'serverIp', type: 'string', required: true, description: 'Target Server IP', defaultValue: activeServer?.ipAddress },
        { name: 'cacheEngine', type: 'string', required: true, description: 'Engine Target', defaultValue: cacheEngine },
        { name: 'bufferSize', type: 'string', required: true, description: 'Memory Buffer Window', defaultValue: bufferSize }
      ],
      code: `function execute(params) {
  const { serverIp, cacheEngine, bufferSize } = params;
  return {
    status: "CACHE_DUMP_SUCCESS",
    targetNode: serverIp,
    engine: cacheEngine,
    bufferRead: bufferSize,
    safeMode: true,
    timestamp: new Date().toISOString()
  };
}`
    };

    onCreateInjunction(snippet);
    setDumpedLogs(prev => [
      ...prev,
      `[INJUNCTION CREATED] Code snippet '${snippet.name}' bound to node ${activeServer?.name} created.`
    ]);
  };

  const copyDumpToClipboard = () => {
    const textToCopy = dumpFormat === 'JSON_KV' ? jsonDumpOutput : hexDumpLines.map(l => `${l.address}  ${l.hex}  |${l.ascii}|`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    const headers = ['Offset_Address', 'Hex_Bytes', 'ASCII_Decoded', 'Target_Node_IP', 'Target_Node_Name', 'Cache_Engine', 'Timestamp'];
    const rows = hexDumpLines.map(line => [
      `"${line.address}"`,
      `"${line.hex}"`,
      `"${line.ascii.replace(/"/g, '""')}"`,
      `"${activeServer?.ipAddress || '10.142.0.12'}"`,
      `"${activeServer?.name || 'srv-node'}"`,
      `"${cacheEngine}"`,
      `"${new Date().toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cache_dump_${activeServer?.name || 'node'}_${cacheEngine}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDumpedLogs(prev => [
      ...prev,
      `[CSV EXPORT] Exported ${rows.length} memory dump records to file 'cache_dump_${activeServer?.name}_${cacheEngine}.csv'.`
    ]);
  };

  const filteredHexLines = hexDumpLines.filter(line => 
    !searchQuery || 
    line.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    line.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
    line.ascii.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="cache-dumping-workspace-view" className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-emerald-600 text-white shadow-lg shadow-amber-950/80">
              <Database className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
                  Server Cache-Dumping & Memory Telemetry Studio
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800 rounded-full">
                  SAFE MODE OPERATIONAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Select any server node detected on Radar Sniffer to trigger read-only memory cache dump injunctions with raw hex and JSON inspection terminal outputs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold shadow-md flex items-center space-x-2 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export Dump (CSV)</span>
            </button>
            <button
              onClick={handleRegisterCacheDumpInjunction}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-amber-950 flex items-center space-x-2 transition-all"
            >
              <Code className="h-4 w-4" />
              <span>Register Injunction Template</span>
            </button>
          </div>
        </div>

        {/* Server Selection Cards Grid */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Select Radar Target Server Node:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {servers.map((srv) => {
              const isSelected = srv.id === activeServer?.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServerId(srv.id)}
                  className={`p-3 rounded-xl border text-left transition-all font-mono text-xs ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md shadow-amber-950'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 truncate">{srv.name}</span>
                    <span className={`h-2 w-2 rounded-full ${srv.status === 'running' ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  </div>
                  <div className="text-[11px] text-amber-400/90 mt-1">{srv.ipAddress}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>{srv.type}</span>
                    <span>{srv.ramUsage || 4}GB RAM</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Panel + Hex Terminal View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Cpu className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Dump Configuration Options</h3>
          </div>

          {/* Target Engine */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-slate-400 font-semibold">Target Memory/Cache Engine:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'REDIS', name: 'Redis Cache' },
                { id: 'MEMCACHED', name: 'Memcached' },
                { id: 'V8_HEAP', name: 'Node V8 Heap' },
                { id: 'KERNEL_PAGE_CACHE', name: 'OS Page Cache' }
              ].map(eng => (
                <button
                  key={eng.id}
                  onClick={() => setCacheEngine(eng.id as any)}
                  className={`py-2 px-2.5 rounded-lg border text-center font-bold text-[11px] transition-all ${
                    cacheEngine === eng.id
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {eng.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dump Format */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-slate-400 font-semibold">Output Inspection Format:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDumpFormat('HEXDUMP')}
                className={`py-2 px-2 rounded-lg border text-center font-bold text-[11px] ${
                  dumpFormat === 'HEXDUMP' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Hex Dump
              </button>
              <button
                onClick={() => setDumpFormat('JSON_KV')}
                className={`py-2 px-2 rounded-lg border text-center font-bold text-[11px] ${
                  dumpFormat === 'JSON_KV' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                JSON KV
              </button>
              <button
                onClick={() => setDumpFormat('RAW_TEXT')}
                className={`py-2 px-2 rounded-lg border text-center font-bold text-[11px] ${
                  dumpFormat === 'RAW_TEXT' ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ASCII Text
              </button>
            </div>
          </div>

          {/* Buffer Size Window */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-slate-400 font-semibold">Buffer Window Size:</label>
            <select
              value={bufferSize}
              onChange={(e) => setBufferSize(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="64KB">64 KB (Standard Cache Snapshot)</option>
              <option value="128KB">128 KB (Extended Session Memory)</option>
              <option value="256KB">256 KB (Full Buffer Scan)</option>
              <option value="1MB">1 MB (Deep Page Memory Dump)</option>
            </select>
          </div>

          {/* Trigger Action Button */}
          <button
            onClick={generateDumpData}
            disabled={isDumping}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-amber-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Zap className={`h-4 w-4 ${isDumping ? 'animate-spin' : ''}`} />
            <span>{isDumping ? 'Dumping Cache Memory...' : 'Trigger Cache Dump Injunction'}</span>
          </button>

          {/* Operating System Telemetry Info */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Node Safe Mode OS Telemetry:</div>
            <div className="text-slate-300 flex justify-between">
              <span>Kernel OS:</span>
              <span className="text-cyan-300">{activeServer?.os || 'Linux 6.8.0-generic'}</span>
            </div>
            <div className="text-slate-300 flex justify-between">
              <span>Docker Image:</span>
              <span className="text-amber-300">{activeServer?.dockerImage || 'node:20-alpine'}</span>
            </div>
            <div className="text-slate-300 flex justify-between">
              <span>RAM Allocation:</span>
              <span className="text-emerald-300">{activeServer?.ramUsage || 4}GB / {activeServer?.maxRam || 16}GB</span>
            </div>
          </div>
        </div>

        {/* Terminal Dump View Column */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                Memory Dump Terminal - Node [{activeServer?.name || 'Selected Node'}]
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search memory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none w-36 sm:w-48 font-mono"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-emerald-400 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
                title="Download CSV File"
              >
                <Download className="h-3.5 w-3.5" />
                <span>CSV</span>
              </button>

              <button
                onClick={copyDumpToClipboard}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-colors"
                title="Copy Dump Payload"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Terminal Code Viewer */}
          <div className="bg-black/90 p-4 rounded-xl border border-slate-800/80 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[360px] max-h-[460px] overflow-y-auto">
            {dumpFormat === 'HEXDUMP' && (
              <div className="space-y-1">
                <div className="text-slate-500 border-b border-slate-800/80 pb-1 flex justify-between">
                  <span>OFFSET (Hex)</span>
                  <span className="pr-20">00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</span>
                  <span>ASCII DECODE</span>
                </div>
                {filteredHexLines.length === 0 ? (
                  <div className="text-slate-500 italic py-8 text-center">No matching memory bytes found.</div>
                ) : (
                  filteredHexLines.map((line, idx) => (
                    <div key={idx} className="flex justify-between hover:bg-slate-900/60 py-0.5 px-1 rounded transition-colors">
                      <span className="text-amber-400 font-bold">{line.address}</span>
                      <span className="text-slate-300 font-mono">{line.hex}</span>
                      <span className="text-emerald-400 font-bold">|{line.ascii}|</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {dumpFormat === 'JSON_KV' && (
              <pre className="text-emerald-300 font-mono whitespace-pre-wrap">{jsonDumpOutput}</pre>
            )}

            {dumpFormat === 'RAW_TEXT' && (
              <div className="text-cyan-300 font-mono space-y-1 whitespace-pre-wrap">
                {hexDumpLines.map(l => l.ascii).join('\n')}
              </div>
            )}
          </div>

          {/* Execution Log Stream Footer */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 font-mono text-[10px] space-y-1">
            <div className="text-slate-400 font-bold flex items-center justify-between">
              <span>Telemetry Injunction Log Stream:</span>
              <span className="text-emerald-400">STATUS: OK</span>
            </div>
            <div className="text-slate-300 space-y-0.5 max-h-16 overflow-y-auto">
              {dumpedLogs.slice(-3).map((log, idx) => (
                <div key={idx} className="truncate">{log}</div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
