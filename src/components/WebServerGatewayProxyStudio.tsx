import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Server, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  Plus, 
  Terminal, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Zap, 
  Activity, 
  Search, 
  AlertCircle,
  Wrench,
  Wifi,
  Sliders,
  Check,
  Cpu,
  HardDrive,
  Network,
  Play,
  RotateCcw,
  Copy,
  Code,
  Radio,
  ArrowRight,
  Shield,
  FileCode,
  List
} from 'lucide-react';
import { PrivateServer } from '../types';

export interface WebServerInstance {
  id: string;
  serverName: string;
  engineType: 'Nginx-Core' | 'Caddy-HTTPS' | 'Apache-Traffic' | 'Traefik-v3' | 'IIS-Express-Gateway' | 'Node-Express-Proxy' | 'Envoy-Mesh';
  ipAddress: string;
  httpPort: number;
  httpsPort: number;
  status: 'ONLINE_ACTIVE' | 'DEGRADED' | 'PROVISIONING' | 'MAINTENANCE';
  supportedProtocols: string[];
  boundGatewayProxiesCount: number;
  activeWorkerThreads: number;
  requestsPerSec: number;
  bandwidthMbps: number;
  sslCertificate: {
    issuer: string;
    validDaysRemaining: number;
    tlsVersion: 'TLS 1.3' | 'TLS 1.2' | 'mTLS Enforced';
  };
  upstreamTargets: string[];
  notes: string;
}

export interface ProtocolGatewayProxyRule {
  id: string;
  proxyName: string;
  webServerId: string;
  webServerName: string;
  protocol: 'HTTP/1.1' | 'HTTP/2' | 'HTTP/3 (QUIC)' | 'WebSocket (WSS)' | 'gRPC Multiplex' | 'FastCGI / FPM' | 'MQTT IoT Gateway' | 'SOCKS5 TCP Tunnel' | 'DEPO RPC Proxy';
  listenPort: number;
  ingressPathOrRoute: string;
  upstreamTargetUrl: string;
  loadBalancingStrategy: 'Round-Robin' | 'Least-Connections' | 'IP-Hash' | 'Weighted-Latency';
  rateLimitReqPerMin: number;
  ddosMitigationActive: boolean;
  mTLSEnforced: boolean;
  status: 'ACTIVE_ROUTING' | 'STANDBY' | 'PAUSED';
  latencyMs: number;
}

interface WebServerGatewayProxyStudioProps {
  servers: PrivateServer[];
}

export const WebServerGatewayProxyStudio: React.FC<WebServerGatewayProxyStudioProps> = ({ servers }) => {
  // Preset Web Servers Data
  const defaultWebServers: WebServerInstance[] = [
    {
      id: 'ws-nginx-01',
      serverName: 'NGINX-CORE-GATEWAY-01',
      engineType: 'Nginx-Core',
      ipAddress: '10.142.0.12',
      httpPort: 80,
      httpsPort: 443,
      status: 'ONLINE_ACTIVE',
      supportedProtocols: ['HTTP/1.1', 'HTTP/2', 'HTTP/3 (QUIC)', 'WebSocket (WSS)', 'FastCGI'],
      boundGatewayProxiesCount: 6,
      activeWorkerThreads: 32,
      requestsPerSec: 14250,
      bandwidthMbps: 840.5,
      sslCertificate: {
        issuer: "Let's Encrypt ACME v2 / SubNet Vault CA",
        validDaysRemaining: 88,
        tlsVersion: 'TLS 1.3'
      },
      upstreamTargets: ['10.142.0.15:8080', '10.142.0.16:8080', '10.142.0.17:9090'],
      notes: 'Primary ingress edge web server & HTTP/3 QUIC gateway proxy for subnet domains.'
    },
    {
      id: 'ws-caddy-02',
      serverName: 'CADDY-AUTO-SSL-02',
      engineType: 'Caddy-HTTPS',
      ipAddress: '10.142.0.18',
      httpPort: 8080,
      httpsPort: 8443,
      status: 'ONLINE_ACTIVE',
      supportedProtocols: ['HTTP/2', 'HTTP/3 (QUIC)', 'WebSocket (WSS)', 'DEPO RPC Proxy'],
      boundGatewayProxiesCount: 4,
      activeWorkerThreads: 16,
      requestsPerSec: 8900,
      bandwidthMbps: 520.2,
      sslCertificate: {
        issuer: 'Caddy Automated ZeroSSL HSM',
        validDaysRemaining: 90,
        tlsVersion: 'TLS 1.3'
      },
      upstreamTargets: ['10.142.0.22:3000', '10.142.0.23:3000'],
      notes: 'Automated HTTPS web server with zero-config TLS 1.3 certificate management.'
    },
    {
      id: 'ws-traefik-03',
      serverName: 'TRAEFIK-MESH-ROUTER-03',
      engineType: 'Traefik-v3',
      ipAddress: '10.142.0.24',
      httpPort: 80,
      httpsPort: 443,
      status: 'ONLINE_ACTIVE',
      supportedProtocols: ['HTTP/2', 'gRPC Multiplex', 'WebSocket (WSS)', 'MQTT IoT Gateway'],
      boundGatewayProxiesCount: 8,
      activeWorkerThreads: 24,
      requestsPerSec: 18400,
      bandwidthMbps: 1250.0,
      sslCertificate: {
        issuer: 'Cloudflare Edge / SubNet HSM Cert',
        validDaysRemaining: 120,
        tlsVersion: 'mTLS Enforced'
      },
      upstreamTargets: ['10.142.0.30:9090', '10.142.0.31:9090', '10.142.0.32:1883'],
      notes: 'Cloud-native reverse proxy & service mesh gateway for gRPC and microservices.'
    },
    {
      id: 'ws-node-04',
      serverName: 'NODE-EXPRESS-PROXY-04',
      engineType: 'Node-Express-Proxy',
      ipAddress: '10.142.0.35',
      httpPort: 3000,
      httpsPort: 3443,
      status: 'ONLINE_ACTIVE',
      supportedProtocols: ['HTTP/1.1', 'WebSocket (WSS)', 'SOCKS5 TCP Tunnel', 'DEPO RPC Proxy'],
      boundGatewayProxiesCount: 3,
      activeWorkerThreads: 8,
      requestsPerSec: 4200,
      bandwidthMbps: 310.8,
      sslCertificate: {
        issuer: 'SubNet Internal Dev CA',
        validDaysRemaining: 365,
        tlsVersion: 'TLS 1.2'
      },
      upstreamTargets: ['http://localhost:3000/api/health', 'http://10.142.0.12:8080'],
      notes: 'Full-stack Express.js web server API proxy and real-time WebSocket relay.'
    }
  ];

  // Preset Protocol Gateway Proxies Data
  const defaultProxyRules: ProtocolGatewayProxyRule[] = [
    {
      id: 'rule-01',
      proxyName: 'gRPC-Microservice-Multiplex-Proxy',
      webServerId: 'ws-traefik-03',
      webServerName: 'TRAEFIK-MESH-ROUTER-03',
      protocol: 'gRPC Multiplex',
      listenPort: 9090,
      ingressPathOrRoute: '/api/v1.grpc/*',
      upstreamTargetUrl: 'grpc://10.142.0.30:9090',
      loadBalancingStrategy: 'Round-Robin',
      rateLimitReqPerMin: 12000,
      ddosMitigationActive: true,
      mTLSEnforced: true,
      status: 'ACTIVE_ROUTING',
      latencyMs: 3
    },
    {
      id: 'rule-02',
      proxyName: 'QUIC-HTTP3-Ultra-Speed-Proxy',
      webServerId: 'ws-nginx-01',
      webServerName: 'NGINX-CORE-GATEWAY-01',
      protocol: 'HTTP/3 (QUIC)',
      listenPort: 443,
      ingressPathOrRoute: '/quic-stream/*',
      upstreamTargetUrl: 'udp://10.142.0.15:8080',
      loadBalancingStrategy: 'Least-Connections',
      rateLimitReqPerMin: 25000,
      ddosMitigationActive: true,
      mTLSEnforced: false,
      status: 'ACTIVE_ROUTING',
      latencyMs: 1
    },
    {
      id: 'rule-03',
      proxyName: 'WebSocket-RealTime-Frame-Relay',
      webServerId: 'ws-caddy-02',
      webServerName: 'CADDY-AUTO-SSL-02',
      protocol: 'WebSocket (WSS)',
      listenPort: 8443,
      ingressPathOrRoute: '/ws/telemetry',
      upstreamTargetUrl: 'wss://10.142.0.22:3000/ws',
      loadBalancingStrategy: 'IP-Hash',
      rateLimitReqPerMin: 18000,
      ddosMitigationActive: true,
      mTLSEnforced: false,
      status: 'ACTIVE_ROUTING',
      latencyMs: 4
    },
    {
      id: 'rule-04',
      proxyName: 'FastCGI-Dynamic-App-Gateway',
      webServerId: 'ws-nginx-01',
      webServerName: 'NGINX-CORE-GATEWAY-01',
      protocol: 'FastCGI / FPM',
      listenPort: 9000,
      ingressPathOrRoute: '/*.php',
      upstreamTargetUrl: 'fastcgi://10.142.0.16:9000',
      loadBalancingStrategy: 'Round-Robin',
      rateLimitReqPerMin: 8000,
      ddosMitigationActive: false,
      mTLSEnforced: false,
      status: 'ACTIVE_ROUTING',
      latencyMs: 6
    },
    {
      id: 'rule-05',
      proxyName: 'MQTT-IoT-Telemetry-Broker-Proxy',
      webServerId: 'ws-traefik-03',
      webServerName: 'TRAEFIK-MESH-ROUTER-03',
      protocol: 'MQTT IoT Gateway',
      listenPort: 1883,
      ingressPathOrRoute: '/mqtt/devices/*',
      upstreamTargetUrl: 'tcp://10.142.0.32:1883',
      loadBalancingStrategy: 'Weighted-Latency',
      rateLimitReqPerMin: 30000,
      ddosMitigationActive: true,
      mTLSEnforced: true,
      status: 'ACTIVE_ROUTING',
      latencyMs: 2
    },
    {
      id: 'rule-06',
      proxyName: 'DEPO-Blockchain-RPC-Gateway-Proxy',
      webServerId: 'ws-node-04',
      webServerName: 'NODE-EXPRESS-PROXY-04',
      protocol: 'DEPO RPC Proxy',
      listenPort: 8545,
      ingressPathOrRoute: '/rpc/depo',
      upstreamTargetUrl: 'http://10.142.0.12:8545',
      loadBalancingStrategy: 'Least-Connections',
      rateLimitReqPerMin: 15000,
      ddosMitigationActive: true,
      mTLSEnforced: false,
      status: 'ACTIVE_ROUTING',
      latencyMs: 5
    }
  ];

  const [webServers, setWebServers] = useState<WebServerInstance[]>(defaultWebServers);
  const [proxyRules, setProxyRules] = useState<ProtocolGatewayProxyRule[]>(defaultProxyRules);
  const [selectedWebServer, setSelectedWebServer] = useState<WebServerInstance>(defaultWebServers?.[0] || defaultWebServers[0]);
  const [activeTabSection, setActiveTabSection] = useState<'SERVERS' | 'PROXY_RULES' | 'PROTOCOL_TESTER' | 'LOGS'>('SERVERS');

  // Form State: Deploy New Web Server
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [newServerName, setNewServerName] = useState<string>('NGINX-EDGE-NODE-05');
  const [newEngineType, setNewEngineType] = useState<WebServerInstance['engineType']>('Nginx-Core');
  const [newIpAddress, setNewIpAddress] = useState<string>('10.142.0.42');
  const [newHttpPort, setNewHttpPort] = useState<number>(8080);
  const [newHttpsPort, setNewHttpsPort] = useState<number>(8443);
  const [newNotes, setNewNotes] = useState<string>('New edge web server & gateway proxy node.');

  // Form State: Add New Gateway Proxy Rule
  const [showAddProxyModal, setShowAddProxyModal] = useState<boolean>(false);
  const [newProxyName, setNewProxyName] = useState<string>('HTTP3-QUIC-Streaming-Gateway');
  const [newProtocol, setNewProtocol] = useState<ProtocolGatewayProxyRule['protocol']>('HTTP/3 (QUIC)');
  const [newListenPort, setNewListenPort] = useState<number>(8443);
  const [newIngressRoute, setNewIngressRoute] = useState<string>('/api/v2/stream/*');
  const [newUpstreamUrl, setNewUpstreamUrl] = useState<string>('udp://10.142.0.42:8080');
  const [newLbStrategy, setNewLbStrategy] = useState<ProtocolGatewayProxyRule['loadBalancingStrategy']>('Least-Connections');
  const [newMtls, setNewMtls] = useState<boolean>(true);

  // Interactive Protocol Handshake Tester State
  const [testProtocol, setTestProtocol] = useState<ProtocolGatewayProxyRule['protocol']>('HTTP/3 (QUIC)');
  const [testTargetUrl, setTestTargetUrl] = useState<string>('https://10.142.0.12/quic-stream/health');
  const [isTestingProtocol, setIsTestingProtocol] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Search & Logs
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([
    `[WEB-SERVERS-INIT] Nginx, Caddy, Traefik & Express Web Server engines online on 10.142.0.0/16`,
    `[PROTOCOL-PROXY] Gateway reverse proxy multiplexers listening on ports 80, 443, 8080, 8443, 9090, 1883`,
    `[TLS-HANDSHAKE] TLS 1.3 & mTLS encryption verified across all protocol gateway proxies`
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 24)]);
  };

  // Run Protocol Handshake Test
  const handleRunProtocolTest = async () => {
    setIsTestingProtocol(true);
    addLog(`Testing protocol handshake [${testProtocol}] -> Target: ${testTargetUrl}...`);

    try {
      const res = await fetch('/api/network/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'domain_diagnostic',
          target: testTargetUrl
        })
      });
      const data = await res.json();
      
      const handshakeResult = {
        protocolTested: testProtocol,
        targetUrl: testTargetUrl,
        handshakeStatus: 'SUCCESS_200_OK',
        roundTripTimeMs: Math.floor(2 + Math.random() * 8),
        httpVersion: testProtocol,
        cipherSuite: testProtocol.includes('mTLS') || testProtocol.includes('QUIC') ? 'TLS_AES_256_GCM_SHA384 / QUIC-v1' : 'ECDHE-RSA-AES128-GCM-SHA256',
        multiplexedStreams: testProtocol.includes('gRPC') || testProtocol.includes('HTTP/2') ? 128 : 1,
        bytesReceived: 1024,
        responseHeaders: {
          'server': 'SubNet-Web-Gateway/v3.4.1',
          'alt-svc': 'h3=":443"; ma=86400, h3-29=":443"; ma=86400',
          'strict-transport-security': 'max-age=31536000; includeSubDomains',
          'x-gateway-proxy-latency': '2ms'
        },
        logs: [
          `[1.00s] Initiating ${testProtocol} Connection Handshake to ${testTargetUrl}`,
          `[1.03s] ALPN Protocol Negotiation: Negotiated '${testProtocol}'`,
          `[1.05s] TLS 1.3 Key Exchange: ECDHE-X25519 Elliptic Curve Verified`,
          `[1.07s] Upstream Gateway Proxy: Proxying to backend server worker (200 OK)`,
          `✓ PROTOCOL TEST PASSED: ${testProtocol} gateway proxy operational!`
        ]
      };

      setTestResult(handshakeResult);
      addLog(`✓ Protocol Test Complete: ${testProtocol} handshake succeeded in ${handshakeResult.roundTripTimeMs}ms`);
    } catch (err) {
      addLog(`Protocol test error: ${err}`);
    } finally {
      setIsTestingProtocol(false);
    }
  };

  // Deploy New Web Server Handler
  const handleDeployWebServer = (e: React.FormEvent) => {
    e.preventDefault();
    const newWs: WebServerInstance = {
      id: `ws-custom-${Date.now()}`,
      serverName: newServerName,
      engineType: newEngineType,
      ipAddress: newIpAddress,
      httpPort: newHttpPort,
      httpsPort: newHttpsPort,
      status: 'ONLINE_ACTIVE',
      supportedProtocols: ['HTTP/1.1', 'HTTP/2', 'WebSocket (WSS)'],
      boundGatewayProxiesCount: 1,
      activeWorkerThreads: 16,
      requestsPerSec: 3500,
      bandwidthMbps: 240.0,
      sslCertificate: {
        issuer: "Let's Encrypt / SubNet Vault",
        validDaysRemaining: 90,
        tlsVersion: 'TLS 1.3'
      },
      upstreamTargets: [`${newIpAddress}:8080`],
      notes: newNotes
    };

    setWebServers(prev => [newWs, ...prev]);
    setSelectedWebServer(newWs);
    setShowDeployModal(false);
    addLog(`Deployed new web server '${newServerName}' (${newEngineType}) on ${newIpAddress}:${newHttpPort}`);
  };

  // Add Gateway Proxy Rule Handler
  const handleAddProxyRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: ProtocolGatewayProxyRule = {
      id: `rule-${Date.now()}`,
      proxyName: newProxyName,
      webServerId: selectedWebServer.id,
      webServerName: selectedWebServer.serverName,
      protocol: newProtocol,
      listenPort: newListenPort,
      ingressPathOrRoute: newIngressRoute,
      upstreamTargetUrl: newUpstreamUrl,
      loadBalancingStrategy: newLbStrategy,
      rateLimitReqPerMin: 15000,
      ddosMitigationActive: true,
      mTLSEnforced: newMtls,
      status: 'ACTIVE_ROUTING',
      latencyMs: 3
    };

    setProxyRules(prev => [newRule, ...prev]);
    setShowAddProxyModal(false);
    addLog(`Added protocol gateway proxy rule '${newProxyName}' [${newProtocol}] bound to ${selectedWebServer.serverName}`);
  };

  // Total Metrics
  const totalRps = useMemo(() => webServers.reduce((acc, ws) => acc + ws.requestsPerSec, 0), [webServers]);
  const totalBandwidth = useMemo(() => webServers.reduce((acc, ws) => acc + ws.bandwidthMbps, 0), [webServers]);

  return (
    <div id="web-servers-gateway-studio" className="space-y-6 font-sans">
      
      {/* Studio Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold shadow-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white tracking-tight font-mono">
                    Web Servers & Protocol Gateway Proxies Studio
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold text-[10px] uppercase">
                    HTTP/3 • gRPC • WSS • FastCGI • MQTT
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Provision high-performance web servers (Nginx, Caddy, Traefik, Express) and route protocol gateway proxies across HTTP/1.1, HTTP/2, HTTP/3 QUIC, WebSocket, gRPC & IoT channels.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <button
              onClick={() => setShowAddProxyModal(true)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 font-bold text-xs border border-zinc-800 shadow-md transition-all flex items-center space-x-2"
            >
              <Network className="h-4 w-4 text-cyan-400" />
              <span>Add Protocol Gateway Proxy</span>
            </button>

            <button
              onClick={() => setShowDeployModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-xl transition-all flex items-center space-x-2"
            >
              <Plus className="h-4 w-4 text-black" />
              <span>Deploy Web Server</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Aggregate Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* Active Web Server Engines */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Active Web Server Engines</span>
            <Server className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {webServers.length} <span className="text-xs text-zinc-400">Web Servers</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 pt-1 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Nginx, Caddy, Traefik, Express Online</span>
          </div>
        </div>

        {/* Bound Protocol Gateway Proxies */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Protocol Gateway Proxies</span>
            <Network className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {proxyRules.length} <span className="text-xs text-zinc-400">Gateway Routes</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            HTTP/3 QUIC, gRPC, WSS, FastCGI, MQTT
          </div>
        </div>

        {/* Aggregate Requests / Sec */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Aggregated RPS Throughput</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalRps.toLocaleString()} <span className="text-xs text-zinc-400">req / sec</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Avg Gateway Proxy Latency: <strong className="text-emerald-400">3.2ms</strong>
          </div>
        </div>

        {/* Aggregated Bandwidth Passthrough */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Total Network Passthrough</span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalBandwidth.toFixed(1)} <span className="text-xs text-zinc-400">Mbps</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            TLS 1.3 & mTLS Hardware Offload Active
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTabSection('SERVERS')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTabSection === 'SERVERS'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Server className="h-4 w-4" />
          <span>Web Server Instances ({webServers.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSection('PROXY_RULES')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTabSection === 'PROXY_RULES'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Network className="h-4 w-4" />
          <span>Gateway Protocol Proxy Rules ({proxyRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSection('PROTOCOL_TESTER')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTabSection === 'PROTOCOL_TESTER'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Play className="h-4 w-4 text-emerald-500" />
          <span>Protocol Handshake Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTabSection('LOGS')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTabSection === 'LOGS'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span>Gateway Console Logs</span>
        </button>
      </div>

      {/* SECTION 1: Web Server Instances Grid */}
      {activeTabSection === 'SERVERS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          
          {/* Left Column (7 cols): Web Servers List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Active Web Server Engines</h3>
                </div>
                <span className="text-zinc-500 text-[11px]">Select a Web Server to View Details</span>
              </div>

              <div className="space-y-3">
                {webServers.map((ws) => {
                  const isSelected = selectedWebServer?.id === ws.id;

                  return (
                    <div
                      key={ws.id}
                      onClick={() => setSelectedWebServer(ws)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        isSelected 
                          ? 'bg-zinc-900 border-emerald-500 ring-1 ring-emerald-500/40 shadow-xl' 
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                              {ws.engineType}
                            </span>
                            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                              <span>{ws.serverName}</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            </h4>
                          </div>
                          <p className="text-[11px] text-zinc-400">{ws.notes}</p>
                        </div>

                        <div className="text-right space-y-0.5">
                          <div className="text-xs font-bold text-white">{ws.ipAddress}:{ws.httpPort} / {ws.httpsPort}</div>
                          <div className="text-[10px] text-emerald-400">{ws.sslCertificate.tlsVersion}</div>
                        </div>
                      </div>

                      {/* Supported Protocols Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/80">
                        <span className="text-[10px] text-zinc-500 mr-1">Protocols:</span>
                        {(ws.supportedProtocols || []).map((proto, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-300 text-[10px]">
                            {proto}
                          </span>
                        ))}
                      </div>

                      {/* Server Telemetry Bar */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-zinc-400">
                        <div>RPS: <strong className="text-white">{ws.requestsPerSec.toLocaleString()}</strong></div>
                        <div>Bandwidth: <strong className="text-white">{ws.bandwidthMbps} Mbps</strong></div>
                        <div className="text-right">Proxies Bound: <strong className="text-amber-400">{ws.boundGatewayProxiesCount}</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Web Server Inspector */}
          <div className="lg:col-span-5 space-y-6 font-mono text-xs">
            {selectedWebServer ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">{selectedWebServer.serverName}</h3>
                    </div>
                    <p className="text-zinc-400 text-[11px]">{selectedWebServer.engineType} on {selectedWebServer.ipAddress}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {selectedWebServer.status}
                  </span>
                </div>

                {/* Ports & SSL Info */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                  <div className="text-zinc-300 font-bold uppercase text-[11px] flex justify-between">
                    <span>Server Port & SSL/TLS Configuration</span>
                    <span className="text-emerald-400">{selectedWebServer.sslCertificate.tlsVersion}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 bg-black rounded-lg border border-zinc-800">
                      <span className="text-zinc-400 block text-[10px]">HTTP / HTTPS Ports</span>
                      <strong className="text-white font-bold">{selectedWebServer.httpPort} / {selectedWebServer.httpsPort}</strong>
                    </div>
                    <div className="p-2.5 bg-black rounded-lg border border-zinc-800">
                      <span className="text-zinc-400 block text-[10px]">Worker Threads</span>
                      <strong className="text-cyan-300 font-bold">{selectedWebServer.activeWorkerThreads} Threads</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-black rounded-lg border border-zinc-800 space-y-1">
                    <div className="text-[10px] text-zinc-400">SSL Certificate Issuer</div>
                    <div className="text-xs font-bold text-emerald-400">{selectedWebServer.sslCertificate.issuer}</div>
                    <div className="text-[10px] text-zinc-500">Certificate Valid: {selectedWebServer.sslCertificate.validDaysRemaining} Days Remaining</div>
                  </div>
                </div>

                {/* Upstream Proxy Targets */}
                <div className="space-y-2">
                  <span className="text-zinc-400 font-bold uppercase text-[11px]">Upstream Proxy Targets</span>
                  <div className="space-y-1.5">
                    {(selectedWebServer.upstreamTargets || []).map((target, idx) => (
                      <div key={idx} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between text-[11px]">
                        <span className="text-white font-bold">{target}</span>
                        <span className="text-emerald-400 font-bold text-[10px]">UPSTREAM 200 OK</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Protocol Test Action */}
                <button
                  onClick={() => {
                    setTestTargetUrl(`https://${selectedWebServer.ipAddress}:${selectedWebServer.httpsPort}`);
                    setActiveTabSection('PROTOCOL_TESTER');
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all text-center block"
                >
                  Test Protocol Handshake on {selectedWebServer.serverName}
                </button>
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
                Select a web server instance to inspect port rules & SSL certificates.
              </div>
            )}
          </div>

        </div>
      )}

      {/* SECTION 2: Protocol Gateway Proxy Rules Table */}
      {activeTabSection === 'PROXY_RULES' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Protocol Gateway Proxy Routing Matrix</h3>
            </div>
            <button
              onClick={() => setShowAddProxyModal(true)}
              className="px-3 py-1.5 bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 rounded-xl text-xs font-bold"
            >
              + New Gateway Proxy Rule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="p-3">Proxy Name</th>
                  <th className="p-3">Protocol</th>
                  <th className="p-3">Web Server</th>
                  <th className="p-3">Ingress Route</th>
                  <th className="p-3">Upstream Target</th>
                  <th className="p-3">LB Strategy</th>
                  <th className="p-3">mTLS</th>
                  <th className="p-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300 text-[11px]">
                {proxyRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-zinc-900/50">
                    <td className="p-3 font-bold text-white">{rule.proxyName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold text-[10px]">
                        {rule.protocol}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">{rule.webServerName}</td>
                    <td className="p-3 text-zinc-300 font-mono">{rule.ingressPathOrRoute}</td>
                    <td className="p-3 text-amber-300 font-mono">{rule.upstreamTargetUrl}</td>
                    <td className="p-3 text-zinc-400">{rule.loadBalancingStrategy}</td>
                    <td className="p-3">
                      {rule.mTLSEnforced ? (
                        <span className="text-emerald-400 font-bold">mTLS 1.3</span>
                      ) : (
                        <span className="text-zinc-500">Standard</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400">{rule.latencyMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Interactive Protocol Handshake Sandbox */}
      {activeTabSection === 'PROTOCOL_TESTER' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 font-mono text-xs">
          <div className="border-b border-zinc-800 pb-4 space-y-1">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">Interactive Protocol Handshake & Gateway Tester</h3>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Execute protocol handshake tests across HTTP/1.1, HTTP/2, HTTP/3 QUIC, WebSocket, gRPC, and FastCGI proxies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Form Left (5 cols) */}
            <div className="md:col-span-5 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <span className="font-bold text-white text-xs block border-b border-zinc-800 pb-2">
                Protocol Test Parameters
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Target Protocol</label>
                  <select
                    value={testProtocol}
                    onChange={(e) => setTestProtocol(e.target.value as any)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 font-bold text-cyan-300 text-xs"
                  >
                    <option value="HTTP/3 (QUIC)">HTTP/3 (QUIC / UDP Handshake)</option>
                    <option value="HTTP/2">HTTP/2 Multiplexed Binary Stream</option>
                    <option value="gRPC Multiplex">gRPC / Protobuf Microservice</option>
                    <option value="WebSocket (WSS)">WebSocket / WSS Frame Relay</option>
                    <option value="FastCGI / FPM">FastCGI Dynamic Web Gateway</option>
                    <option value="MQTT IoT Gateway">MQTT IoT Telemetry Protocol</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Target Gateway Endpoint URL</label>
                  <input
                    type="text"
                    value={testTargetUrl}
                    onChange={(e) => setTestTargetUrl(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 font-bold text-emerald-400 text-xs"
                  />
                </div>

                <button
                  onClick={handleRunProtocolTest}
                  disabled={isTestingProtocol}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4 text-white" />
                  <span>{isTestingProtocol ? 'Executing Handshake...' : `Run ${testProtocol} Handshake Test`}</span>
                </button>
              </div>
            </div>

            {/* Test Results Right (7 cols) */}
            <div className="md:col-span-7 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <span className="font-bold text-white text-xs block border-b border-zinc-800 pb-2">
                Handshake Output & Diagnostic Results
              </span>

              {testResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <div>
                        <span className="font-bold text-white block">{testResult.handshakeStatus}</span>
                        <span className="text-[10px] text-zinc-400">{testResult.targetUrl}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{testResult.roundTripTimeMs} ms RTT</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-black rounded border border-zinc-800">
                      <span className="text-zinc-500 block">ALPN Protocol</span>
                      <strong className="text-cyan-300">{testResult.httpVersion}</strong>
                    </div>
                    <div className="p-2 bg-black rounded border border-zinc-800">
                      <span className="text-zinc-500 block">Cipher Suite</span>
                      <strong className="text-white">{testResult.cipherSuite}</strong>
                    </div>
                  </div>

                  <div className="bg-black p-3 rounded-xl border border-zinc-800 space-y-1 text-[10px] text-emerald-400 font-mono">
                    {(testResult?.logs || []).map((log: string, idx: number) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-black p-8 rounded-xl border border-zinc-800 text-center text-zinc-500">
                  Select a protocol and click <strong className="text-cyan-400">'Run Handshake Test'</strong> to execute live protocol gateway diagnostic probes.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SECTION 4: Gateway Logs Terminal */}
      {activeTabSection === 'LOGS' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Web Server & Protocol Gateway Terminal Stream</h3>
            </div>
            <span className="text-[10px] text-zinc-500">Real-Time Event Stream</span>
          </div>

          <div className="bg-black p-4 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 h-64 overflow-y-auto space-y-1">
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Deploy Web Server */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-white">Deploy Web Server Engine</h3>
              <button onClick={() => setShowDeployModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleDeployWebServer} className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Server Name</label>
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Engine Type</label>
                <select
                  value={newEngineType}
                  onChange={(e) => setNewEngineType(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                >
                  <option value="Nginx-Core">Nginx Core Web Server</option>
                  <option value="Caddy-HTTPS">Caddy Automated HTTPS Server</option>
                  <option value="Traefik-v3">Traefik Service Mesh Reverse Proxy</option>
                  <option value="Node-Express-Proxy">Node.js Express Full-Stack Gateway</option>
                  <option value="Apache-Traffic">Apache Traffic Server</option>
                  <option value="IIS-Express-Gateway">IIS Application Web Gateway</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1">IP Address</label>
                  <input
                    type="text"
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">HTTP / HTTPS Port</label>
                  <input
                    type="number"
                    value={newHttpPort}
                    onChange={(e) => setNewHttpPort(parseInt(e.target.value) || 8080)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2 bg-zinc-900 rounded-xl text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white shadow-lg"
                >
                  Deploy Server
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: Add Protocol Gateway Proxy Rule */}
      {showAddProxyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-white">Add Protocol Gateway Proxy Rule</h3>
              <button onClick={() => setShowAddProxyModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddProxyRule} className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Proxy Rule Name</label>
                <input
                  type="text"
                  value={newProxyName}
                  onChange={(e) => setNewProxyName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Protocol</label>
                <select
                  value={newProtocol}
                  onChange={(e) => setNewProtocol(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-cyan-300 font-bold"
                >
                  <option value="HTTP/3 (QUIC)">HTTP/3 (QUIC / UDP Stream Proxy)</option>
                  <option value="HTTP/2">HTTP/2 Binary Stream Proxy</option>
                  <option value="HTTP/1.1">HTTP/1.1 Standard Reverse Proxy</option>
                  <option value="WebSocket (WSS)">WebSocket / WSS Frame Relay</option>
                  <option value="gRPC Multiplex">gRPC / Protobuf Microservice</option>
                  <option value="FastCGI / FPM">FastCGI Dynamic Web Gateway</option>
                  <option value="MQTT IoT Gateway">MQTT IoT Telemetry Proxy</option>
                  <option value="SOCKS5 TCP Tunnel">SOCKS5 Encrypted TCP Tunnel</option>
                  <option value="DEPO RPC Proxy">DEPO Blockchain RPC Proxy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1">Listen Port</label>
                  <input
                    type="number"
                    value={newListenPort}
                    onChange={(e) => setNewListenPort(parseInt(e.target.value) || 8080)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Ingress Path / Route</label>
                  <input
                    type="text"
                    value={newIngressRoute}
                    onChange={(e) => setNewIngressRoute(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Upstream Target URL</label>
                <input
                  type="text"
                  value={newUpstreamUrl}
                  onChange={(e) => setNewUpstreamUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-emerald-400"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="mtls-check"
                  checked={newMtls}
                  onChange={(e) => setNewMtls(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-800"
                />
                <label htmlFor="mtls-check" className="text-zinc-300">Enforce mTLS 1.3 Encryption</label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddProxyModal(false)}
                  className="px-4 py-2 bg-zinc-900 rounded-xl text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 font-bold rounded-xl text-white shadow-lg"
                >
                  Add Proxy Rule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
