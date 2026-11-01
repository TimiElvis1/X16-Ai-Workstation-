import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Network, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Play, 
  Plus, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Radio, 
  Copy, 
  ExternalLink, 
  Settings, 
  Wifi, 
  Lock, 
  Layers, 
  ArrowRight,
  RefreshCw,
  Sliders,
  Code,
  Globe,
  Share2,
  Users,
  Compass,
  Bookmark,
  Coins,
  Search,
  CheckCircle
} from 'lucide-react';
import { PrivateServer } from '../types';

interface VirtualProtocolProxyStudioProps {
  servers: PrivateServer[];
}

interface VirtualProxy {
  id: string;
  name: string;
  protocol: string;
  protocolGroup?: string;
  hostNodeIp: string;
  port: number;
  targetEndpoint: string;
  status: string;
  encryption: string;
  bandwidthMbps: number;
  requestsPerSec: number;
  createdAt: string;
}

interface DecentralizedWebServer {
  id: string;
  serverName: string;
  protocol: string;
  protocolGroup: string;
  sovereignUrl: string;
  ownerHandle: string;
  ownerWallet: string;
  allocatedNodeIp: string;
  port: number;
  status: string;
  subscribersCount: number;
  trafficVolumeGb: number;
  trafficEarningsDepo: number;
  trafficEarningsGBP: number;
  trafficEarningsUSD: number;
  bandwidthMbps: number;
  htmlPayload: string;
  lastActiveTimestamp: string;
  createdAt: string;
}

export const VirtualProtocolProxyStudio: React.FC<VirtualProtocolProxyStudioProps> = ({ servers }) => {
  // Protocol Group Selector: 'all' | 'virtual_server' | 'network_protocols' | 'browser'
  const [activeProtocolGroup, setActiveProtocolGroup] = useState<'virtual_server' | 'network_protocols' | 'browser'>('virtual_server');

  // Virtual Proxies State
  const [proxies, setProxies] = useState<VirtualProxy[]>([]);
  const [selectedHostIp, setSelectedHostIp] = useState<string>(
    servers[0]?.ipAddress || '10.142.0.12'
  );

  // Form inputs for Virtual Server Protocols
  const [proxyName, setProxyName] = useState<string>('vProtocol-gRPC-Tunnel-01');
  const [selectedVspProtocol, setSelectedVspProtocol] = useState<string>('gRPC/HTTP2-Mux');
  const [listenPort, setListenPort] = useState<number>(9090);
  const [targetEndpoint, setTargetEndpoint] = useState<string>('upstream.internal.subnet.net:443');
  const [encryptionScheme, setEncryptionScheme] = useState<string>('mTLS-v1.3');
  const [maxConnections, setMaxConnections] = useState<number>(50000);

  // Form inputs for Network Protocols / Decentralized Web Hosting
  const [dwebServerName, setDwebServerName] = useState<string>('VOX-Sovereign-Telemetry-Hub');
  const [selectedNetworkProtocol, setSelectedNetworkProtocol] = useState<string>('vox://');
  const [domainSlug, setDomainSlug] = useState<string>('telemetry.genesis.depo');
  const [dwebPort, setDwebPort] = useState<number>(7080);
  const [dwebOwnerHandle, setDwebOwnerHandle] = useState<string>('@sovereign_operator');
  const [dwebHtmlPayload, setDwebHtmlPayload] = useState<string>(
`<!DOCTYPE html>
<html>
<head><title>VOX Sovereign Telemetry Portal</title></head>
<body style="background:#09090b;color:#10b981;font-family:monospace;padding:24px;">
  <h1 style="color:#34d399;">🌐 vox://telemetry.genesis.depo</h1>
  <p style="color:#a1a1aa;">Welcome to the Decentralized Internet Sovereign Telemetry Portal.</p>
  <div style="border:1px solid #059669;padding:16px;border-radius:12px;background:#064e3b20;">
    <h3 style="margin:0 0 8px 0;color:#6ee7b7;">Autonomous Node Telemetry Feed</h3>
    <p style="margin:4px 0;color:#e4e4e7;">Host Node IP: <strong>10.142.0.12:7080</strong></p>
    <p style="margin:4px 0;color:#e4e4e7;">Proof-of-Traffic: <strong style="color:#34d399;">ACTIVE_VERIFIED</strong></p>
  </div>
</body>
</html>`
  );

  // Decentralized Web Servers State
  const [dwebServers, setDwebServers] = useState<DecentralizedWebServer[]>([]);
  const [isHostingServer, setIsHostingServer] = useState<boolean>(false);
  const [hostSuccessMsg, setHostSuccessMsg] = useState<string | null>(null);

  // Decentralized Browser State
  const [browserUrlInput, setBrowserUrlInput] = useState<string>('vox://telemetry.genesis.depo');
  const [activeBrowsedContent, setActiveBrowsedContent] = useState<any | null>(null);
  const [isBrowsing, setIsBrowsing] = useState<boolean>(false);

  // Active testing state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [testingProxyId, setTestingProxyId] = useState<string | null>(null);
  const [subscribingServerId, setSubscribingServerId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    `[PROTOCOL-DISPATCHER] Initialized Virtual Server Protocols & Network Protocols engine`,
    `[DECENTRALIZED-WEB] Sovereign URL Telemetry resolver online at vox://, depo://, torx-mesh://`,
    `[SOCKET-ENCLAVE] Virtual socket multiplexer active across host nodes subnet 10.142.0.0/16`
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 24)]);
  };

  // Fetch initial list
  const fetchProxies = async () => {
    try {
      const res = await fetch('/api/virtual-proxy/list');
      const data = await res.json();
      if (data.success && Array.isArray(data.proxies)) {
        setProxies(data.proxies);
      }
    } catch (err) {
      console.error('Failed to load virtual proxies:', err);
    }
  };

  const fetchDwebServers = async () => {
    try {
      const res = await fetch('/api/decentralized-web/servers');
      const data = await res.json();
      if (data.success && Array.isArray(data.servers)) {
        setDwebServers(data.servers);
      }
    } catch (err) {
      console.error('Failed to load decentralized web servers:', err);
    }
  };

  useEffect(() => {
    fetchProxies();
    fetchDwebServers();
  }, []);

  // Generate Virtual Server Proxy
  const handleGenerateProxy = async () => {
    setIsGenerating(true);
    addLog(`Deploying Virtual Server Protocol [${selectedVspProtocol}] on host node ${selectedHostIp}:${listenPort}...`);

    try {
      const res = await fetch('/api/virtual-proxy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: proxyName,
          protocol: selectedVspProtocol,
          hostNodeIp: selectedHostIp,
          listenPort,
          targetEndpoint,
          encryptionScheme,
          maxConnections
        })
      });
      const data = await res.json();
      if (data.success) {
        setProxies(prev => [data.proxy, ...prev]);
        addLog(`✓ ${data.message}`);
        setListenPort(prev => prev + 1);
      }
    } catch (err) {
      addLog(`Error generating virtual proxy: ${err}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Test Tunnel Connectivity
  const handleTestTunnel = async (proxyId: string) => {
    setTestingProxyId(proxyId);
    addLog(`Running multiplexed packet diagnostic test on proxy #${proxyId}...`);

    try {
      const res = await fetch('/api/virtual-proxy/test-tunnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxyId })
      });
      const data = await res.json();
      if (data.success) {
        addLog(`✓ Diagnostic passed! Latency: ${data.pingMs}ms | Throughput: ${data.throughputGbps} Gbps | Packets Passed: ${data.packetsPassed.toLocaleString()}`);
      }
    } catch (err) {
      addLog(`Diagnostic test error: ${err}`);
    } finally {
      setTestingProxyId(null);
    }
  };

  // Host a Decentralized Web Server
  const handleHostDecentralizedServer = async () => {
    setIsHostingServer(true);
    setHostSuccessMsg(null);
    addLog(`Publishing Decentralized Web Server [${selectedNetworkProtocol}] with domain '${domainSlug}'...`);

    try {
      const res = await fetch('/api/decentralized-web/host-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverName: dwebServerName,
          protocol: selectedNetworkProtocol,
          domainSlug,
          allocatedNodeIp: selectedHostIp,
          port: dwebPort,
          ownerHandle: dwebOwnerHandle,
          htmlPayload: dwebHtmlPayload
        })
      });

      const data = await res.json();
      if (data.success) {
        setDwebServers(prev => [data.server, ...prev]);
        setHostSuccessMsg(data.message);
        addLog(`✓ ${data.message} | URL: ${data.server.sovereignUrl}`);
        setDwebPort(prev => prev + 1);
      } else {
        addLog(`Failed to host server: ${data.error}`);
      }
    } catch (err) {
      addLog(`Error hosting decentralized web server: ${err}`);
    } finally {
      setIsHostingServer(false);
    }
  };

  // Subscribe to a Decentralized Server
  const handleSubscribeToServer = async (serverId: string) => {
    setSubscribingServerId(serverId);
    addLog(`Broadcasting P2P peer mesh subscription to server #${serverId}...`);

    try {
      const res = await fetch('/api/decentralized-web/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverId, subscriberNodeIp: selectedHostIp })
      });

      const data = await res.json();
      if (data.success) {
        setDwebServers(prev => prev.map(s => s.id === serverId ? data.server : s));
        addLog(`✓ ${data.message}`);
      }
    } catch (err) {
      addLog(`Error subscribing to server: ${err}`);
    } finally {
      setSubscribingServerId(null);
    }
  };

  // Browse Decentralized Web URL
  const handleBrowseSovereignUrl = async (urlToBrowse?: string) => {
    const targetUrl = urlToBrowse || browserUrlInput;
    setIsBrowsing(true);
    addLog(`Resolving sovereign domain ${targetUrl} across P2P telemetry swarm...`);

    try {
      const res = await fetch('/api/decentralized-web/browse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sovereignUrl: targetUrl })
      });

      const data = await res.json();
      if (data.success) {
        setActiveBrowsedContent(data);
        addLog(`✓ Sovereign resolution successful (${data.latencyMs}ms) | Node: ${data.hostNodeIp} | Status: ${data.status}`);
      }
    } catch (err) {
      addLog(`Failed to resolve sovereign URL: ${err}`);
    } finally {
      setIsBrowsing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-red-600/20 border border-red-500/30 text-red-400 rounded-2xl">
              <Network className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>Protocols &amp; Decentralized Internet Ownership Studio</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                  DUAL-ENGINE PROXY &amp; SOVEREIGN WEB
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Group and manage protocols into <strong>Virtual Server Protocols</strong> (servers, nodes, subnets) and <strong>Network Protocols</strong> (decentralized internet ownership, sovereign hosting &amp; telemetry).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
            <Server className="h-4 w-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Selected Host Node</span>
              <select
                value={selectedHostIp}
                onChange={(e) => {
                  setSelectedHostIp(e.target.value);
                  addLog(`Bound generator host node to ${e.target.value}`);
                }}
                className="bg-transparent text-white font-bold font-mono focus:outline-none"
              >
                <option value="10.142.0.12" className="bg-slate-900">Primary SubNet Host (10.142.0.12)</option>
                {servers.map(s => (
                  <option key={s.id} value={s.ipAddress} className="bg-slate-900">{s.name} ({s.ipAddress})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2 Protocol Classification Category Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setActiveProtocolGroup('virtual_server')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border cursor-pointer ${
              activeProtocolGroup === 'virtual_server'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50 ring-1 ring-red-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Server className="h-4 w-4" />
            <span>Virtual Server Protocols (Servers, Nodes, Subnets)</span>
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-200 text-[10px] font-mono">
              {(proxies || []).length} Tunnels
            </span>
          </button>

          <button
            onClick={() => setActiveProtocolGroup('network_protocols')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border cursor-pointer ${
              activeProtocolGroup === 'network_protocols'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Network Protocols (Decentralized Internet Ownership)</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-200 text-[10px] font-mono">
              {(dwebServers || []).length} Sovereign Hosts
            </span>
          </button>

          <button
            onClick={() => {
              setActiveProtocolGroup('browser');
              if (!activeBrowsedContent) handleBrowseSovereignUrl();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border cursor-pointer ${
              activeProtocolGroup === 'browser'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-950/50 ring-1 ring-purple-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Sovereign Web Browser &amp; Subscriber</span>
          </button>
        </div>

        {/* Overview Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px]">Active Server Tunnels</span>
              <span className="font-bold text-emerald-400 text-sm">{(proxies || []).length} Tunnels Online</span>
            </div>
            <Wifi className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px]">Decentralized Web Hosts</span>
              <span className="font-bold text-cyan-400 text-sm">{(dwebServers || []).length} Sovereign Sites</span>
            </div>
            <Globe className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px]">P2P Peer Mesh Subscribers</span>
              <span className="font-bold text-purple-400 text-sm">
                {(dwebServers || []).reduce((acc, s) => acc + (s.subscribersCount || 0), 0)} Nodes
              </span>
            </div>
            <Users className="h-4 w-4 text-purple-400" />
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px]">PoT Staking Reward Yield</span>
              <span className="font-bold text-amber-400 text-sm">
                £{dwebServers.reduce((acc, s) => acc + s.trafficEarningsGBP, 0).toLocaleString()} GBP
              </span>
            </div>
            <Coins className="h-4 w-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: VIRTUAL SERVER PROTOCOLS (SERVERS, NODES & SUBNETS)            */}
      {/* ========================================================================= */}
      {activeProtocolGroup === 'virtual_server' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Generator Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sliders className="h-5 w-5 text-red-500" />
              <div>
                <span className="font-bold text-sm text-white block">Virtual Server Protocol Generator</span>
                <span className="text-[10px] text-slate-400">For servers, nodes &amp; subnets multiplexing</span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Server Tunnel Identifier</label>
                <input
                  type="text"
                  value={proxyName}
                  onChange={(e) => setProxyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Virtual Server Protocol (VSP)</label>
                <select
                  value={selectedVspProtocol}
                  onChange={(e) => {
                    setSelectedVspProtocol(e.target.value);
                    if (e.target.value.includes('IPC')) setListenPort(9090);
                    if (e.target.value.includes('gRPC')) setListenPort(50051);
                    if (e.target.value.includes('ZK')) setListenPort(8443);
                    if (e.target.value.includes('WireGuard')) setListenPort(51820);
                    if (e.target.value.includes('Qdrant')) setListenPort(6379);
                    if (e.target.value.includes('QUIC')) setListenPort(4433);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-amber-400 text-xs"
                >
                  <option value="VSP/Multiplex-IPC">VSP/Multiplex-IPC (Hypervisor Ring Bus - Port 9090)</option>
                  <option value="gRPC/HTTP2-Mux">gRPC/HTTP2-Mux (Microservice Multiplexer - Port 50051)</option>
                  <option value="SubNet-ZK-Tunnel">SubNet-ZK-Tunnel (Zero-Knowledge Ingress - Port 8443)</option>
                  <option value="WireGuard-SSL-Mesh">WireGuard-SSL-Mesh (Kernel Mesh Overlay - Port 51820)</option>
                  <option value="Qdrant-Redis-SyncBus">Qdrant-Redis-SyncBus (Vector &amp; RAM Sync - Port 6379)</option>
                  <option value="QUIC-HTTP3-NodeStream">QUIC-HTTP3-NodeStream (Low-Latency UDP Cluster - Port 4433)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Host Listen Port</label>
                  <input
                    type="number"
                    value={listenPort}
                    onChange={(e) => setListenPort(parseInt(e.target.value) || 8080)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Max Connections</label>
                  <input
                    type="number"
                    value={maxConnections}
                    onChange={(e) => setMaxConnections(parseInt(e.target.value) || 10000)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Upstream Node</label>
                <input
                  type="text"
                  value={targetEndpoint}
                  onChange={(e) => setTargetEndpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-emerald-400 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Hardware Encryption Scheme</label>
                <select
                  value={encryptionScheme}
                  onChange={(e) => setEncryptionScheme(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-purple-400 text-xs"
                >
                  <option value="mTLS-v1.3">mTLS v1.3 (Mutual Hardware TLS)</option>
                  <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 AEAD</option>
                  <option value="AES-256-GCM">AES-256-GCM Hardware Accelerated</option>
                  <option value="Noise Protocol Framework">Noise Protocol Framework</option>
                  <option value="TLS-v1.3-Passthrough">TLS v1.3 Passthrough (Zero-Decrypt)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateProxy}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs pt-3 cursor-pointer"
              >
                <Plus className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Provisioning VSP Tunnel...' : 'Deploy Virtual Server Protocol'}</span>
              </button>
            </div>
          </div>

          {/* Right: Active Tunnels & Diagnostic Terminal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
                  <span className="font-bold text-sm text-white">Active Virtual Server Protocol Instances</span>
                </div>
                <button
                  onClick={fetchProxies}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-3">
                {proxies.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold text-[10px] border border-red-500/30">
                          {p.protocol}
                        </span>
                        <strong className="text-white text-xs font-mono">{p.name}</strong>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/30 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <span>{p.status}</span>
                        </span>
                        <button
                          onClick={() => handleTestTunnel(p.id)}
                          disabled={testingProxyId === p.id}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Zap className={`h-3 w-3 ${testingProxyId === p.id ? 'animate-spin' : ''}`} />
                          <span>{testingProxyId === p.id ? 'Testing...' : 'Test Packet'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                      <div>
                        <span className="text-slate-500 text-[9px] block">Host Node Socket</span>
                        <strong className="text-white">{p.hostNodeIp}:{p.port}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9px] block">Target Upstream</span>
                        <strong className="text-emerald-400 truncate block">{p.targetEndpoint}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9px] block">Throughput</span>
                        <strong className="text-amber-400">{p.bandwidthMbps} Mbps</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9px] block">Encryption</span>
                        <strong className="text-purple-400">{p.encryption}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics Terminal Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white shadow-lg space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-slate-300 flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-red-500" />
                  <span>Virtual Server Protocols Diagnostic Terminal</span>
                </span>
                <button 
                  onClick={() => setLogs([])}
                  className="text-[10px] text-slate-500 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 max-h-[140px] overflow-y-auto text-[10px] leading-relaxed">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: NETWORK PROTOCOLS & DECENTRALIZED INTERNET OWNERSHIP            */}
      {/* ========================================================================= */}
      {activeProtocolGroup === 'network_protocols' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Inclusively Host a Web Server Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Globe className="h-5 w-5 text-cyan-400" />
                <div>
                  <span className="font-bold text-sm text-white block">Host a Decentralized Web Server</span>
                  <span className="text-[10px] text-slate-400">Create &amp; claim sovereign internet ownership</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Web Server Title</label>
                  <input
                    type="text"
                    value={dwebServerName}
                    onChange={(e) => setDwebServerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs"
                    placeholder="e.g. Genesis Sovereign Portal"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Network Protocol Scheme</label>
                  <select
                    value={selectedNetworkProtocol}
                    onChange={(e) => {
                      setSelectedNetworkProtocol(e.target.value);
                      if (e.target.value === 'vox://') setDomainSlug('telemetry.genesis.depo');
                      if (e.target.value === 'depo://') setDomainSlug('node-alpha.tubers');
                      if (e.target.value === 'torx-mesh://') setDomainSlug('subnet-omega.pot');
                      if (e.target.value === 'dDNS-SubNet://') setDomainSlug('sovereign-vault');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-cyan-300 text-xs"
                  >
                    <option value="vox://">vox:// (Sovereign Telemetry Protocol)</option>
                    <option value="depo://">depo:// (Autonomous Liquidity &amp; Node Discovery)</option>
                    <option value="torx-mesh://">torx-mesh:// (P2P Mesh Relay Web Protocol)</option>
                    <option value="dDNS-SubNet://">dDNS-SubNet:// (Distributed Sovereign Domain)</option>
                    <option value="ipfs-libp2p://">ipfs-libp2p:// (Immutable Content Address)</option>
                    <option value="pot-telemetry://">pot-telemetry:// (Proof-of-Traffic Routing)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Sovereign Domain URL (Telemetry-Format):
                  </label>
                  <div className="flex items-center space-x-1">
                    <span className="px-2.5 py-2 rounded-l-xl bg-slate-950 border border-r-0 border-slate-800 text-cyan-400 font-bold text-xs shrink-0">
                      {selectedNetworkProtocol}
                    </span>
                    <input
                      type="text"
                      value={domainSlug}
                      onChange={(e) => setDomainSlug(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-r-xl p-2 font-bold text-white text-xs"
                      placeholder="domain.subdomain"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Full URL: {selectedNetworkProtocol}{domainSlug}{selectedNetworkProtocol === 'vox://' ? '.telemetry' : selectedNetworkProtocol === 'depo://' ? '.vox' : '.relay'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Host Port</label>
                    <input
                      type="number"
                      value={dwebPort}
                      onChange={(e) => setDwebPort(parseInt(e.target.value) || 7080)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Owner Handle</label>
                    <input
                      type="text"
                      value={dwebOwnerHandle}
                      onChange={(e) => setDwebOwnerHandle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-amber-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Decentralized Web Payload (HTML/Markdown)</label>
                  <textarea
                    rows={4}
                    value={dwebHtmlPayload}
                    onChange={(e) => setDwebHtmlPayload(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] text-emerald-300 font-mono focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleHostDecentralizedServer}
                  disabled={isHostingServer}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-black font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer"
                >
                  <Globe className={`h-4 w-4 ${isHostingServer ? 'animate-spin' : ''}`} />
                  <span>{isHostingServer ? 'Hosting Server On Mesh...' : 'Host Sovereign Decentralized Server'}</span>
                </button>

                {hostSuccessMsg && (
                  <div className="p-3 bg-cyan-950/80 border border-cyan-500/50 rounded-xl text-xs text-cyan-300">
                    {hostSuccessMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Active Sovereign Hosted Servers List & Peer Subscriptions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Share2 className="h-5 w-5 text-cyan-400" />
                      <span>Decentralized Sovereign Hosted Web Servers ({(dwebServers || []).length})</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Users can inclusively host or subscribe to web servers with telemetry URLs.
                    </p>
                  </div>

                  <button
                    onClick={fetchDwebServers}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Sync Swarm</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {dwebServers.map((srv) => (
                    <div
                      key={srv.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-500/30">
                              {srv.protocol}
                            </span>
                            <span className="text-xs font-mono font-black text-emerald-400">{srv.sovereignUrl}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white">{srv.serverName}</h4>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setBrowserUrlInput(srv.sovereignUrl);
                              setActiveProtocolGroup('browser');
                              handleBrowseSovereignUrl(srv.sovereignUrl);
                            }}
                            className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                          >
                            <Compass className="h-3.5 w-3.5" />
                            <span>Browse</span>
                          </button>

                          <button
                            onClick={() => handleSubscribeToServer(srv.id)}
                            disabled={subscribingServerId === srv.id}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black text-xs font-mono font-black rounded-xl transition-all flex items-center space-x-1 cursor-pointer shadow-md"
                          >
                            <Users className="h-3.5 w-3.5 text-black" />
                            <span>{subscribingServerId === srv.id ? 'Subscribing...' : 'Subscribe'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                        <div>
                          <span className="text-slate-500 text-[9px] block">Allocated Host Node</span>
                          <strong className="text-white">{srv.allocatedNodeIp}:{srv.port}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[9px] block">Peer Subscribers</span>
                          <strong className="text-cyan-400">{srv.subscribersCount} Active Nodes</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[9px] block">Traffic Volume</span>
                          <strong className="text-amber-400">{srv.trafficVolumeGb} GB</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[9px] block">PoT Staking Earnings</span>
                          <strong className="text-emerald-400">£{srv.trafficEarningsGBP.toLocaleString()} GBP</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SOVEREIGN WEB BROWSER & LIVE SANDBOX VIEWER                    */}
      {/* ========================================================================= */}
      {activeProtocolGroup === 'browser' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <Compass className="h-5 w-5 text-purple-400" />
                <span>Decentralized Internet Browser &amp; Sovereign Telemetry Viewer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse non-standard decentralized internet protocols (vox://, depo://, torx-mesh://, dDNS-SubNet://) natively.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-purple-500/40 text-purple-300 font-mono font-bold">
                100% Censorship-Free P2P Mesh
              </span>
            </div>
          </div>

          {/* Browser Address Bar */}
          <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <Globe className="h-5 w-5 text-cyan-400 ml-2 shrink-0" />
            <input
              type="text"
              value={browserUrlInput}
              onChange={(e) => setBrowserUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBrowseSovereignUrl()}
              placeholder="Enter sovereign URL (e.g. vox://telemetry.genesis.depo)"
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none px-2"
            />
            <button
              onClick={() => handleBrowseSovereignUrl()}
              disabled={isBrowsing}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Search className={`h-3.5 w-3.5 ${isBrowsing ? 'animate-spin' : ''}`} />
              <span>{isBrowsing ? 'Resolving...' : 'Navigate'}</span>
            </button>
          </div>

          {/* Quick Bookmark Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Preset Sovereign Telemetry URLs:</span>
            {dwebServers.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setBrowserUrlInput(s.sovereignUrl);
                  handleBrowseSovereignUrl(s.sovereignUrl);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500 text-[10px] font-mono transition-all cursor-pointer"
              >
                {s.sovereignUrl}
              </button>
            ))}
          </div>

          {/* Rendered Sandbox Page Preview */}
          {activeBrowsedContent ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{activeBrowsedContent.status}</span>
                  </span>
                  <span>Host: <strong>{activeBrowsedContent.hostNodeIp}</strong></span>
                  <span>Latency: <strong>{activeBrowsedContent.latencyMs}ms</strong></span>
                </div>
                <div>
                  <span>Subscribers: <strong className="text-purple-300">{activeBrowsedContent.subscribersCount}</strong></span>
                </div>
              </div>

              <div className="bg-black border border-slate-800 rounded-2xl p-5 min-h-[220px]">
                <div
                  dangerouslySetInnerHTML={{ __html: activeBrowsedContent.htmlContent }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-xs font-mono">
              Enter a sovereign decentralized URL above and click Navigate to test the decentralized internet mesh.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
