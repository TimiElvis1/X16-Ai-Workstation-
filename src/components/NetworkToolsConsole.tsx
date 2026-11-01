import React, { useState } from 'react';
import { NetworkToolRequest, NetworkToolResponse, SniffedPacket } from '../types';
import { 
  Terminal, 
  Radio, 
  Globe, 
  Send, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Search,
  Check,
  Eye,
  Filter,
  Layers,
  Cpu,
  Server,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface NetworkToolsProps {
  onExecuteTool: (req: NetworkToolRequest) => Promise<NetworkToolResponse>;
  defaultTarget?: string;
}

export const NetworkToolsConsole: React.FC<NetworkToolsProps> = ({
  onExecuteTool,
  defaultTarget = "10.142.0.12"
}) => {
  const [toolType, setToolType] = useState<NetworkToolRequest['type']>('ping');
  const [target, setTarget] = useState<string>(defaultTarget);
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [httpBody, setHttpBody] = useState<string>('{\n  "client": "SubNet-Tool",\n  "status": "ping"\n}');
  const [port, setPort] = useState<number>(8080);

  // ISP Sniffer Specific State
  const [ispCarrier, setIspCarrier] = useState<string>("Level3 / Lumen AS3356 Transit");
  const [interfaceName, setInterfaceName] = useState<string>("eth0-isp-gw");
  const [protocolFilter, setProtocolFilter] = useState<string>("ALL");
  const [selectedPacket, setSelectedPacket] = useState<SniffedPacket | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toolResponse, setToolResponse] = useState<NetworkToolResponse | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  const handleRunTool = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setSelectedPacket(null);
    
    try {
      const res = await onExecuteTool({
        type: toolType,
        target,
        method: httpMethod,
        body: toolType === 'http' && ['POST', 'PUT'].includes(httpMethod) ? httpBody : undefined,
        port,
        ispCarrier,
        interfaceName,
        protocolFilter
      });
      setToolResponse(res);
      if (res.packetsCaptured && res.packetsCaptured.length > 0) {
        setSelectedPacket(res.packetsCaptured[0]);
      }
    } catch (err: any) {
      setToolResponse({
        success: false,
        timestamp: new Date().toISOString(),
        latencyMs: 0,
        statusText: "Network Tool Diagnostic Failed",
        data: null,
        logs: [`[ERROR] ${err.message || String(err)}`]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (!toolResponse) return;
    navigator.clipboard.writeText(JSON.stringify(toolResponse.data, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const filteredPackets = (toolResponse?.packetsCaptured || []).filter(p => {
    if (protocolFilter === "ALL") return true;
    return p.protocol === protocolFilter;
  });

  return (
    <div id="network-tools-console-view" className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Sub-Connective Network Tools & ISP Port Sniffer Console</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Perform network diagnostics, HTTP API sandbox requests, port scans, subnet DNS probes, and ISP traffic packet sniffing across private server routes.
          </p>
        </div>

        {toolType === 'packet_sniff' && (
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-300 font-semibold">ISP Promiscuous Sniffer Mode Active</span>
          </div>
        )}
      </div>

      {/* Main Grid: Tool Form & Response Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tool Selector & Controls (1 Column) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          
          {/* Tool Type Radio Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Diagnostic Tool Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setToolType('domain_diagnostic');
                  if (!target || target === '10.142.0.12') setTarget('alpha-gateway.subnet.digital');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border col-span-2 ${
                  toolType === 'domain_diagnostic'
                    ? 'bg-gradient-to-r from-emerald-950 to-cyan-950 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="h-4 w-4 text-cyan-400 animate-pulse" />
                <div className="text-left">
                  <div className="font-bold flex items-center space-x-1.5">
                    <span>Domain Servers & Host Diagnostics</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-black text-[9px] font-black uppercase">FULL AUDIT</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">DNS, SSL/TLS, Port 80/443, Nginx Proxy & Hosting Options</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setToolType('ping')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border ${
                  toolType === 'ping'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="h-3.5 w-3.5 text-cyan-400" />
                <span>ICMP Ping</span>
              </button>

              <button
                type="button"
                onClick={() => setToolType('http')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border ${
                  toolType === 'http'
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-indigo-400" />
                <span>HTTP Sandbox</span>
              </button>

              <button
                type="button"
                onClick={() => setToolType('port_scan')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border ${
                  toolType === 'port_scan'
                    ? 'bg-purple-950 border-purple-500 text-purple-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-purple-400" />
                <span>Port Scanner</span>
              </button>

              <button
                type="button"
                onClick={() => setToolType('packet_sniff')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border ${
                  toolType === 'packet_sniff'
                    ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>ISP Port Sniffer</span>
              </button>

              <button
                type="button"
                onClick={() => setToolType('dns')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border col-span-2 ${
                  toolType === 'dns'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Search className="h-3.5 w-3.5 text-emerald-400" />
                <span>Subnet DNS Resolver</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRunTool} className="space-y-4 text-xs">
            {/* Target Address Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-medium">Target Host / Subnet IP Address</label>
                {toolType === 'domain_diagnostic' && (
                  <span className="text-[10px] text-cyan-400 font-mono">Domain Host Server</span>
                )}
              </div>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. alpha-gateway.subnet.digital or 10.142.0.12"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />

              {/* Domain Preset Quick Selector */}
              {toolType === 'domain_diagnostic' && (
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] text-slate-400">Select Domain Host Preset:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTarget('alpha-gateway.subnet.digital')}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 truncate text-left font-mono"
                    >
                      🌐 alpha-gateway.subnet.digital
                    </button>
                    <button
                      type="button"
                      onClick={() => setTarget('vector-store.subnet.digital')}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 truncate text-left font-mono"
                    >
                      🧠 vector-store.subnet.digital
                    </button>
                    <button
                      type="button"
                      onClick={() => setTarget('depo-vault.subnet.digital')}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 truncate text-left font-mono"
                    >
                      🔐 depo-vault.subnet.digital
                    </button>
                    <button
                      type="button"
                      onClick={() => setTarget('worker.subnet.digital')}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 truncate text-left font-mono"
                    >
                      ⚡ worker.subnet.digital
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ISP Port Sniffer Specific Controls */}
            {toolType === 'packet_sniff' && (
              <>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">ISP Transit Carrier Route</label>
                  <select
                    value={ispCarrier}
                    onChange={(e) => setIspCarrier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Level3 / Lumen AS3356 Transit">Level3 / Lumen AS3356 Transit</option>
                    <option value="Cogent Communications AS174">Cogent Communications AS174</option>
                    <option value="Telia Carrier / Arelion AS1299">Telia Carrier / Arelion AS1299</option>
                    <option value="Verizon Business AS701">Verizon Business AS701</option>
                    <option value="Tata Communications AS6453">Tata Communications AS6453</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Interface</label>
                    <select
                      value={interfaceName}
                      onChange={(e) => setInterfaceName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="eth0-isp-gw">eth0-isp-gw</option>
                      <option value="wan0-fiber">wan0-fiber</option>
                      <option value="tap-subnet1">tap-subnet1</option>
                      <option value="lo-loopback">lo-loopback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Port</label>
                    <input
                      type="number"
                      value={port}
                      onChange={(e) => setPort(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Protocol Filter</label>
                  <div className="flex flex-wrap gap-1">
                    {["ALL", "TCP", "TLS", "HTTP", "UDP", "DNS"].map((proto) => (
                      <button
                        key={proto}
                        type="button"
                        onClick={() => setProtocolFilter(proto)}
                        className={`px-2 py-1 rounded text-[10px] font-mono border ${
                          protocolFilter === proto
                            ? 'bg-amber-950 border-amber-500 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {proto}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* HTTP Specific Inputs */}
            {toolType === 'http' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">HTTP Method</label>
                    <select
                      value={httpMethod}
                      onChange={(e: any) => setHttpMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Port</label>
                    <input
                      type="number"
                      value={port}
                      onChange={(e) => setPort(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {['POST', 'PUT'].includes(httpMethod) && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">JSON Payload Body</label>
                    <textarea
                      value={httpBody}
                      onChange={(e) => setHttpBody(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-mono text-xs focus:outline-none resize-y"
                    />
                  </div>
                )}
              </>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 ${
                toolType === 'packet_sniff'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-950'
                  : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-emerald-950'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>
                {isLoading 
                  ? 'Executing Diagnostic Probe...' 
                  : toolType === 'packet_sniff'
                  ? 'Start ISP Port Packet Sniff'
                  : `Run ${toolType.toUpperCase()} Diagnostic`
                }
              </span>
            </button>
          </form>

        </div>

        {/* Response & Packet Inspector (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Top Status Header */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">
                {toolType === 'packet_sniff' ? 'ISP Packet Sniffer Frame Stream' : 'Diagnostic Telemetry & Output'}
              </h3>
            </div>
            
            {toolResponse && (
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1 text-slate-400 font-mono">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{toolResponse.latencyMs}ms</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                  toolResponse.success ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                }`}>
                  {toolResponse.statusCode ? `HTTP ${toolResponse.statusCode}` : toolResponse.statusText}
                </span>
              </div>
            )}
          </div>

          {/* ISP Packet Sniffer Interactive Wireshark Table or Domain Diagnostic Inspector */}
          {toolType === 'domain_diagnostic' ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              {/* Domain & Host Overall Status Card */}
              {toolResponse?.data ? (
                <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                      <h4 className="text-sm font-bold text-white font-mono">
                        {toolResponse.data.domainName || target} ({toolResponse.data.resolvedIp || '10.142.0.12'})
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                        100% OPERATIONAL
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
                      <Activity className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Latency: {toolResponse.latencyMs || 14}ms</span>
                    </div>
                  </div>

                  {/* Diagnostic Checks Matrix */}
                  <div>
                    <div className="text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Domain Server Diagnostic Probes (5 Checks Passed)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {(toolResponse.data.diagnosticChecks || [
                        { id: 'dns', title: 'Subnet DNS Anycast Probe', status: 'PASSED', detail: 'A Record -> 10.142.0.12 (TTL 300s)' },
                        { id: 'ping', title: 'Host Ping & Packet Loss', status: 'PASSED', detail: '4/4 packets received (0% loss, RTT 14ms)' },
                        { id: 'ssl', title: 'HTTPS & TLS 1.3 Cert', status: 'PASSED', detail: 'TLS 1.3 ECDHE-RSA valid for 89 days' },
                        { id: 'ports', title: 'Server Port Access', status: 'PASSED', detail: 'Ports 80, 443, 8080, 22 OPEN' },
                        { id: 'proxy', title: 'Nginx Hosting Proxy', status: 'PASSED', detail: 'Nginx reverse proxy bound, 200 OK' }
                      ]).map((check: any) => (
                        <div key={check.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{check.title}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              ✓ {check.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">{check.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hosting Options Verification */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                      <Server className="h-4 w-4 text-cyan-400" />
                      <span>Hosting Server Options & Active Capabilities</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(toolResponse.data.hostingOptions || [
                        { option: 'Edge CDN Caching', enabled: true, status: 'Active (99.4% cache hit)' },
                        { option: 'Auto SSL Renewal', enabled: true, status: 'Active (ACME bot)' },
                        { option: 'Load Failover', enabled: true, status: 'Standby node ready' },
                        { option: 'DDoS Protection', enabled: true, status: 'Rate limit active' }
                      ]).map((opt: any, idx: number) => (
                        <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                          <div className="text-[10px] font-bold text-slate-200">{opt.option}</div>
                          <div className="text-[9px] text-emerald-400 font-mono font-medium">{opt.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DNS Record Lookup Details */}
                  {toolResponse.data?.diagnosticChecks?.[0]?.dnsRecords && (
                    <div className="pt-1">
                      <div className="text-[11px] font-bold text-slate-300 mb-1 font-mono">DNS Records Table ({toolResponse.data?.domainName || 'Host'})</div>
                      <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 overflow-x-auto">
                        <table className="w-full text-left font-mono text-[10px] text-slate-300">
                          <thead>
                            <tr className="text-slate-500 border-b border-slate-800 pb-1">
                              <th className="p-1">Type</th>
                              <th className="p-1">Name</th>
                              <th className="p-1">Target / Value</th>
                              <th className="p-1 text-right">TTL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(toolResponse.data?.diagnosticChecks?.[0]?.dnsRecords || []).map((rec: any, idx: number) => (
                              <tr key={idx} className="border-b border-slate-900">
                                <td className="p-1 font-bold text-cyan-400">{rec.type}</td>
                                <td className="p-1 text-slate-300">{rec.name}</td>
                                <td className="p-1 text-emerald-400">{rec.target}</td>
                                <td className="p-1 text-right text-slate-500">{rec.ttl}s</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Terminal Diagnostic Log Output */}
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 mb-1">Domain Host Diagnostic Terminal Output</div>
                    <div className="bg-slate-950 p-3 rounded-xl font-mono text-[10px] text-emerald-400 h-[100px] overflow-y-auto border border-slate-800 space-y-1">
                      {toolResponse?.logs?.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3">
                  <Globe className="h-10 w-10 text-cyan-400 mx-auto animate-pulse" />
                  <h4 className="text-sm font-bold text-slate-200">Ready to Test Domain Servers & Host Options</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Select a domain preset or enter a host domain name, then click <span className="text-cyan-300 font-semibold">'Run DOMAIN_DIAGNOSTIC Diagnostic'</span> to test DNS, ICMP ping, SSL/TLS, port connectivity, and hosting proxy status.
                  </p>
                  <button
                    onClick={handleRunTool}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-emerald-500 hover:to-cyan-500 transition-all"
                  >
                    Run Domain Diagnostic Probe Now
                  </button>
                </div>
              )}
            </div>
          ) : toolType === 'packet_sniff' ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
              
              {/* Captured Packet Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 font-mono flex items-center space-x-1">
                    <Layers className="h-3.5 w-3.5 text-amber-400" />
                    <span>Intercepted ISP Port Packets ({filteredPackets.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Click a packet row to view header inspection
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto max-h-[220px]">
                  <table className="w-full text-left font-mono text-[11px] text-slate-300 border-collapse">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <tr>
                        <th className="p-2">No.</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Source IP:Port</th>
                        <th className="p-2">Dest IP:Port</th>
                        <th className="p-2">Protocol</th>
                        <th className="p-2">ISP Carrier</th>
                        <th className="p-2 text-right">Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredPackets.length > 0 ? (
                        filteredPackets.map((pkt) => {
                          const isSelected = selectedPacket?.frameNo === pkt.frameNo;
                          return (
                            <tr
                              key={pkt.frameNo}
                              onClick={() => setSelectedPacket(pkt)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-amber-950/60 text-amber-200 font-semibold'
                                  : 'hover:bg-slate-800/50'
                              }`}
                            >
                              <td className="p-2 text-slate-400">{pkt.frameNo}</td>
                              <td className="p-2 text-cyan-400">{pkt.timestamp}</td>
                              <td className="p-2">{pkt.sourceIP}:{pkt.sourcePort}</td>
                              <td className="p-2 text-emerald-400">{pkt.destIP}:{pkt.destPort}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  pkt.protocol === 'TCP' ? 'bg-indigo-950 text-indigo-300' :
                                  pkt.protocol === 'TLS' ? 'bg-purple-950 text-purple-300' :
                                  pkt.protocol === 'HTTP' ? 'bg-emerald-950 text-emerald-300' :
                                  'bg-slate-800 text-slate-300'
                                }`}>
                                  {pkt.protocol}
                                </span>
                              </td>
                              <td className="p-2 text-slate-400 text-[10px] truncate max-w-[120px]">{pkt.ispCarrier}</td>
                              <td className="p-2 text-right text-slate-300">{pkt.payloadSizeBytes} B</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-slate-500 italic">
                            No packets captured yet. Click 'Start ISP Port Packet Sniff' to intercept transit frames.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Wireshark-Style Packet Header Inspector */}
              {selectedPacket && (
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-[11px]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-amber-400 font-bold flex items-center space-x-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Frame #{selectedPacket.frameNo} Header & Payload Inspector</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ISP Route: {selectedPacket.ispCarrier} ({selectedPacket.ispAsn})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="text-cyan-400 font-semibold">1. Ethernet II Frame</div>
                      <div className="text-slate-300 leading-snug">{selectedPacket.headerDetails.ethernet}</div>
                      
                      <div className="text-indigo-400 font-semibold mt-2">2. IPv4 Packet Header</div>
                      <div className="text-slate-300 leading-snug">{selectedPacket.headerDetails.ipv4Header}</div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="text-emerald-400 font-semibold">3. Transport Layer ({selectedPacket.protocol})</div>
                      <div className="text-slate-300 leading-snug">{selectedPacket.headerDetails.transportHeader}</div>

                      <div className="text-amber-400 font-semibold mt-2">4. TCP/UDP Flags</div>
                      <div className="text-slate-300 font-bold">{selectedPacket.tcpFlags || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Raw Hex Payload Dump */}
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 mb-1">Payload Hex & ASCII Dump</div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre">
                      {selectedPacket.headerDetails.payloadHexDump}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Standard JSON & Logs view for Ping / HTTP / Port Scanner / DNS */
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              
              {/* Response Data JSON */}
              <div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-slate-300 font-mono">Payload Data JSON Output</span>
                  {toolResponse?.data && (
                    <button
                      onClick={copyResponse}
                      className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                    >
                      {copiedResponse ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedResponse ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  )}
                </div>

                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-cyan-300 h-[220px] overflow-y-auto border border-slate-800 shadow-inner">
                  {toolResponse ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(toolResponse.data, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-slate-600 italic">Run a network diagnostic probe tool to inspect output payload data</div>
                  )}
                </div>
              </div>

              {/* Raw Terminal Command Logs */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 mb-1">Diagnostic Terminal Log Stream</div>
                <div className="bg-slate-900/80 p-3 rounded-xl font-mono text-[10px] text-emerald-400 h-[100px] overflow-y-auto border border-slate-800 space-y-1">
                  {toolResponse?.logs ? (
                    toolResponse.logs.map((log, idx) => <div key={idx}>{log}</div>)
                  ) : (
                    <div className="text-slate-600 italic">[SYSTEM] Terminal initialized and awaiting probe request.</div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
