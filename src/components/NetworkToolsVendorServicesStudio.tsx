import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Server,
  Database,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Activity,
  Cpu,
  Layers,
  Code2,
  ShoppingBag,
  Tag,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Eye,
  RefreshCw,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Key,
  Lock,
  Workflow,
  Headphones,
  Box,
  Share2,
  FileText
} from 'lucide-react';
import { NetworkToolRequest, NetworkToolResponse, SniffedPacket } from '../types';

interface NetworkToolsVendorServicesProps {
  onNavigateTab?: (tab: string) => void;
}

interface VendorServiceItem {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Database' | 'Automation' | 'AI & Speech' | 'E-Commerce' | 'Security & Crypto' | 'Developer';
  status: 'ONLINE' | 'ACTIVE' | 'SYNCED' | 'HEALTHY';
  endpoint: string;
  description: string;
  icon: any;
  metricLabel: string;
  metricValue: string;
  targetTab: string;
  method: 'GET' | 'POST';
}

export const NetworkToolsVendorServicesStudio: React.FC<NetworkToolsVendorServicesProps> = ({
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vendor_directory' | 'network_tools' | 'api_relayer' | 'resource_telemetry'>('vendor_directory');
  
  // Diagnostic Tool State
  const [toolType, setToolType] = useState<NetworkToolRequest['type']>('ping');
  const [target, setTarget] = useState<string>('10.142.0.12');
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [httpBody, setHttpBody] = useState<string>('{\n  "vendor": "SubNet.com",\n  "status": "probe_active"\n}');
  const [port, setPort] = useState<number>(8080);
  const [ispCarrier, setIspCarrier] = useState<string>('Level3 / Lumen AS3356 Transit');
  const [interfaceName, setInterfaceName] = useState<string>('eth0-isp-gw');
  const [protocolFilter, setProtocolFilter] = useState<string>('ALL');
  
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [toolResponse, setToolResponse] = useState<NetworkToolResponse | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<SniffedPacket | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // API Relayer Tester State
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<string>('/api/servers');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiRequestBody, setApiRequestBody] = useState<string>('{}');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [apiResponseStatus, setApiResponseStatus] = useState<number | null>(null);
  const [apiResponseTime, setApiResponseTime] = useState<number | null>(null);
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);

  // Vendor Services Directory list
  const vendorServices: VendorServiceItem[] = [
    {
      id: 'vendor-cloudsql',
      name: 'Cloud SQL / PostgreSQL Relational Engine',
      category: 'Database',
      status: 'ONLINE',
      endpoint: '/api/db/credentials',
      description: 'PostgreSQL instance with auto-scaling connection pooling, Drizzle ORM schema migrations, and SSL encryption.',
      icon: Database,
      metricLabel: 'Connection Pool',
      metricValue: '18 / 100 Active',
      targetTab: 'db_plugin_credentials',
      method: 'GET'
    },
    {
      id: 'vendor-firebase',
      name: 'Firebase / Firestore Security & Auth Vault',
      category: 'Security & Crypto',
      status: 'HEALTHY',
      endpoint: '/api/firewall/status',
      description: 'Firestore persistence layer, real-time security rules evaluator, and OAuth identity token verification.',
      icon: Lock,
      metricLabel: 'Firestore Sync',
      metricValue: '99.99% Parity',
      targetTab: 'firewall_environment',
      method: 'GET'
    },
    {
      id: 'vendor-n8n',
      name: 'n8n Automation & Webhook Orchestrator',
      category: 'Automation',
      status: 'ACTIVE',
      endpoint: '/api/injunctions',
      description: 'Automated workflow triggers, webhook ingress relayer, and event-driven background task queue.',
      icon: Workflow,
      metricLabel: 'Active Workflows',
      metricValue: '8 Pipelines',
      targetTab: 'n8n',
      method: 'GET'
    },
    {
      id: 'vendor-ai-speech',
      name: 'SubNet Gemini AI & Speech Synthesis Engine',
      category: 'AI & Speech',
      status: 'ONLINE',
      endpoint: '/api/hosted-pages/landing',
      description: 'Gemini 3.6 Flash SDK integration, Web Speech API TTS narration, and natural voice acoustic synthesis.',
      icon: Headphones,
      metricLabel: 'Speech Voices',
      metricValue: '12 Ultra-HQ Voices',
      targetTab: 'hosted_pages',
      method: 'GET'
    },
    {
      id: 'vendor-monopoly-store',
      name: 'SubNet Monopoly Marketplace API',
      category: 'E-Commerce',
      status: 'ACTIVE',
      endpoint: '/api/ecommerce/products',
      description: 'Multi-channel payment gateway (Cyber-Card, Solana Escrow, SubNet Byte Tokens), verified sellers, and high-spec catalog.',
      icon: ShoppingBag,
      metricLabel: 'Product Catalog',
      metricValue: '18 High-Spec Items',
      targetTab: 'ecommerce',
      method: 'GET'
    },
    {
      id: 'vendor-p2p-classifieds',
      name: 'SubNet P2P Classifieds Gateway',
      category: 'E-Commerce',
      status: 'ACTIVE',
      endpoint: '/api/classifieds/listings',
      description: 'Craigslist-style peer-to-peer decentralized classified listings, verified seller ratings, and localized search.',
      icon: Tag,
      metricLabel: 'Listings Density',
      metricValue: '124 Active Items',
      targetTab: 'classifieds',
      method: 'GET'
    },
    {
      id: 'vendor-opensea-vault',
      name: 'OpenSea & Smart Contract Vault',
      category: 'Security & Crypto',
      status: 'SYNCED',
      endpoint: '/api/opensea/collections',
      description: 'ERC-721/1155 NFT asset indexer, Polygon gasless transaction relayer, and multi-sig smart contract vaults.',
      icon: Box,
      metricLabel: 'Relayer Gas Tank',
      metricValue: '1,420.5 MATIC',
      targetTab: 'opensea',
      method: 'GET'
    },
    {
      id: 'vendor-windows-sandbox',
      name: 'Windows Server & Protocol Proxy Sandbox',
      category: 'Infrastructure',
      status: 'ONLINE',
      endpoint: '/api/servers',
      description: 'Sandboxed Windows execution VMs, virtual protocol proxies, and automated out-of-band penetration testing.',
      icon: Server,
      metricLabel: 'Active VMs',
      metricValue: '4 Windows Pods',
      targetTab: 'windows_sandbox',
      method: 'GET'
    },
    {
      id: 'vendor-opensource-hub',
      name: 'OpenSource GitHub Repository Hub',
      category: 'Developer',
      status: 'SYNCED',
      endpoint: '/api/opensource/projects',
      description: 'Git repository sync, automated build pipelines, code injunction injection, and release artifact registry.',
      icon: Code2,
      metricLabel: 'Synced Repos',
      metricValue: '12 Repositories',
      targetTab: 'opensource',
      method: 'GET'
    }
  ];

  // Execute Network Diagnostic Tool
  const handleRunDiagnostic = async () => {
    setIsExecuting(true);
    setSelectedPacket(null);
    setToolResponse(null);

    try {
      if (toolType === 'ping') {
        const latency = Math.floor(10 + Math.random() * 12);
        setToolResponse({
          success: true,
          timestamp: new Date().toISOString(),
          latencyMs: latency,
          statusText: `ICMP Echo Reply from ${target}: ttl=64 time=${latency}ms`,
          data: {
            host: target,
            packetsTransmitted: 4,
            packetsReceived: 4,
            packetLossPercent: 0,
            roundTripMinMs: latency - 2,
            roundTripAvgMs: latency,
            roundTripMaxMs: latency + 3
          },
          logs: [
            `[00:00:01] PING ${target} (${target}) 56(84) bytes of data.`,
            `[00:00:01] 64 bytes from ${target}: icmp_seq=1 ttl=64 time=${latency} ms`,
            `[00:00:02] 64 bytes from ${target}: icmp_seq=2 ttl=64 time=${latency + 1} ms`,
            `[00:00:03] 64 bytes from ${target}: icmp_seq=3 ttl=64 time=${latency - 1} ms`,
            `[00:00:04] --- ${target} ping statistics ---`,
            `[00:00:04] 4 packets transmitted, 4 received, 0% packet loss, time 3004ms`
          ]
        });
      } else if (toolType === 'traceroute') {
        setToolResponse({
          success: true,
          timestamp: new Date().toISOString(),
          latencyMs: 18,
          statusText: `Traceroute completed to ${target} (30 hops max)`,
          data: {
            targetHost: target,
            hopsCount: 5,
            routePath: [
              { hop: 1, ip: '10.142.0.1', name: 'subnet-gateway-router.local', latencyMs: 1.2 },
              { hop: 2, ip: '172.16.24.1', name: 'border-switch-alpha.cloud', latencyMs: 3.4 },
              { hop: 3, ip: '192.168.100.254', name: 'lumen-transit-backbone.net', latencyMs: 8.9 },
              { hop: 4, ip: '10.142.0.10', name: 'subnet-load-balancer-01.node', latencyMs: 14.1 },
              { hop: 5, ip: target, name: `target-node-${target}.subnet.local`, latencyMs: 18.0 }
            ]
          },
          logs: [
            `traceroute to ${target}, 30 hops max, 60 byte packets`,
            ` 1  subnet-gateway-router.local (10.142.0.1)  1.214 ms  1.189 ms`,
            ` 2  border-switch-alpha.cloud (172.16.24.1)  3.412 ms  3.290 ms`,
            ` 3  lumen-transit-backbone.net (192.168.100.254)  8.910 ms  8.850 ms`,
            ` 4  subnet-load-balancer-01.node (10.142.0.10)  14.120 ms  14.001 ms`,
            ` 5  target-node (${target})  18.012 ms  17.990 ms`
          ]
        });
      } else if (toolType === 'dns') {
        setToolResponse({
          success: true,
          timestamp: new Date().toISOString(),
          latencyMs: 9,
          statusText: `DNS Zone records resolved for ${target}`,
          data: {
            domain: target,
            records: [
              { type: 'A', value: '10.142.0.12', ttl: 300 },
              { type: 'AAAA', value: 'fe80::1a2b:3c4d:5e6f:7a8b', ttl: 300 },
              { type: 'MX', value: '10 mail.subnet.com', ttl: 3600 },
              { type: 'TXT', value: 'v=spf1 include:subnet.node ~all', ttl: 3600 },
              { type: 'NS', value: 'ns1.subnet.node', ttl: 86400 }
            ]
          },
          logs: [
            `;; QUESTION SECTION:`,
            `;${target}. IN A`,
            `;; ANSWER SECTION:`,
            `${target}. 300 IN A 10.142.0.12`,
            `;; Query time: 9 msec`,
            `;; SERVER: 10.142.0.1#53(10.142.0.1)`
          ]
        });
      } else if (toolType === 'isp_sniffer') {
        const packets: SniffedPacket[] = [
          {
            frameNo: 101,
            timestamp: new Date().toISOString(),
            sourceIP: '10.142.0.12',
            destIP: target,
            sourcePort: 44300,
            destPort: 443,
            protocol: 'TLS',
            ispCarrier: ispCarrier,
            ispAsn: 'AS3356',
            payloadSizeBytes: 512,
            tcpFlags: 'SYN, ACK',
            info: 'TLS v1.3 Handshake Client Hello',
            headerDetails: {
              ethernet: '00:1A:2B:3C:4D:5E > 00:60:97:8F:12:34',
              ipv4Header: '10.142.0.12 > ' + target + ' TTL=64',
              transportHeader: 'TCP SrcPort=44300 DstPort=443',
              payloadHexDump: '16 03 01 02 00 01 00 01 fc 03 03...',
              payloadAscii: 'TLS Handshake Client Hello'
            }
          },
          {
            frameNo: 102,
            timestamp: new Date().toISOString(),
            sourceIP: target,
            destIP: '10.142.0.12',
            sourcePort: 8080,
            destPort: 52100,
            protocol: 'TCP',
            ispCarrier: ispCarrier,
            ispAsn: 'AS3356',
            payloadSizeBytes: 1024,
            tcpFlags: 'ACK',
            info: 'SubNet Gateway Proxy Data Frame',
            headerDetails: {
              ethernet: '00:60:97:8F:12:34 > 00:1A:2B:3C:4D:5E',
              ipv4Header: target + ' > 10.142.0.12 TTL=64',
              transportHeader: 'TCP SrcPort=8080 DstPort=52100',
              payloadHexDump: '48 54 54 50 2f 31 2e 31 20 32 30 30...',
              payloadAscii: 'HTTP/1.1 200 OK'
            }
          },
          {
            frameNo: 103,
            timestamp: new Date().toISOString(),
            sourceIP: '10.142.0.45',
            destIP: '10.142.0.18',
            sourcePort: 53530,
            destPort: 53,
            protocol: 'DNS',
            ispCarrier: ispCarrier,
            ispAsn: 'AS3356',
            payloadSizeBytes: 128,
            tcpFlags: 'QUERY',
            info: 'DNS Query: api.subnet.com',
            headerDetails: {
              ethernet: '00:11:22:33:44:55 > 00:60:97:8F:12:34',
              ipv4Header: '10.142.0.45 > 10.142.0.18 TTL=64',
              transportHeader: 'UDP SrcPort=53530 DstPort=53',
              payloadHexDump: '00 01 01 00 00 01 00 00 00 00 00 00...',
              payloadAscii: 'api.subnet.com A?'
            }
          },
          {
            frameNo: 104,
            timestamp: new Date().toISOString(),
            sourceIP: '10.142.0.12',
            destIP: target,
            sourcePort: 3000,
            destPort: 3000,
            protocol: 'HTTP',
            ispCarrier: ispCarrier,
            ispAsn: 'AS3356',
            payloadSizeBytes: 256,
            tcpFlags: 'PSH, ACK',
            info: 'SubNet Telemetry Stream Sync',
            headerDetails: {
              ethernet: '00:1A:2B:3C:4D:5E > 00:60:97:8F:12:34',
              ipv4Header: '10.142.0.12 > ' + target + ' TTL=64',
              transportHeader: 'TCP SrcPort=3000 DstPort=3000',
              payloadHexDump: '7b 22 74 65 6c 65 6d 65 74 72 79 22...',
              payloadAscii: '{"telemetry": "sync"}'
            }
          }
        ];

        setToolResponse({
          success: true,
          timestamp: new Date().toISOString(),
          latencyMs: 14,
          statusText: `Captured 4 transit packets on interface ${interfaceName} via ${ispCarrier}`,
          packetsCaptured: packets,
          data: {
            carrier: ispCarrier,
            interface: interfaceName,
            packetsCapturedCount: 4,
            filter: protocolFilter
          },
          logs: [
            `[SNIFFER-INIT] Attaching packet ring buffer to ${interfaceName}...`,
            `[CARRIER-TRANSIT] Carrier BGP Path: ${ispCarrier}`,
            `[CAPTURE-SUCCESS] Sniffed 4 frames. Zero dropped packets.`
          ]
        });
        setSelectedPacket(packets[0]);
      } else {
        // Default HTTP REST probe
        const res = await fetch('/api/servers');
        const resData = await res.json();
        setToolResponse({
          success: true,
          timestamp: new Date().toISOString(),
          latencyMs: 11,
          statusText: `HTTP 200 OK (${httpMethod} http://${target}:${port})`,
          data: resData,
          logs: [
            `> ${httpMethod} /api/servers HTTP/1.1`,
            `> Host: ${target}:${port}`,
            `> User-Agent: SubNet-NetworkTools/2.4`,
            `< HTTP/1.1 200 OK`,
            `< Content-Type: application/json; charset=utf-8`
          ]
        });
      }
    } catch (err: any) {
      setToolResponse({
        success: false,
        timestamp: new Date().toISOString(),
        latencyMs: 0,
        statusText: 'Diagnostic Tool Execution Failed',
        data: null,
        logs: [`[ERROR] ${err.message || String(err)}`]
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Test Vendor API Endpoint
  const handleTestApiEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET') => {
    setSelectedApiEndpoint(endpoint);
    setApiMethod(method);
    setIsTestingApi(true);
    setApiResponseData(null);
    setApiResponseStatus(null);
    const startTime = performance.now();

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? apiRequestBody : undefined
      });
      const endTime = performance.now();
      setApiResponseTime(Math.round(endTime - startTime));
      setApiResponseStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setApiResponseData(json);
      } else {
        const text = await res.text();
        setApiResponseData({ responseText: text.substring(0, 500) });
      }
    } catch (err: any) {
      setApiResponseStatus(500);
      setApiResponseData({ error: err.message || 'API Test Call Failed' });
    } finally {
      setIsTestingApi(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div id="network-tools-vendor-services-view" className="space-y-6 font-mono text-slate-100">
      
      {/* HERO HEADER BANNER */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Globe className="h-6 w-6 animate-pulse" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                SubNet.com Enterprise Resource Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Network Tools &amp; Vendor Services Console
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Centralized command hub drawing all APIs, cloud infrastructure, packet diagnostics, database clusters, and third-party vendor services across the SubNet.com network ecosystem.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Active Vendors</span>
              <span className="text-lg font-black text-emerald-400">9 Connected</span>
            </div>
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Network Probe</span>
              <span className="text-lg font-black text-cyan-400">14ms Latency</span>
            </div>
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Core Gateway</span>
              <span className="text-lg font-black text-amber-400">10.142.0.12</span>
            </div>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-zinc-800">
          <button
            onClick={() => setActiveSubTab('vendor_directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
              activeSubTab === 'vendor_directory'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Server className="h-4 w-4" />
            <span>1. Vendor Services Directory (9)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('network_tools')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
              activeSubTab === 'network_tools'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>2. Network Diagnostics &amp; ISP Sniffer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('api_relayer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
              activeSubTab === 'api_relayer'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>3. API Relayer &amp; Endpoint Tester</span>
          </button>

          <button
            onClick={() => setActiveSubTab('resource_telemetry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
              activeSubTab === 'resource_telemetry'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>4. Network Resource Telemetry</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VENDOR SERVICES DIRECTORY */}
      {activeSubTab === 'vendor_directory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>SubNet.com Vendor Services &amp; Connected API Modules</span>
            </h2>
            <span className="text-xs text-zinc-400">Click "Open Studio" to jump directly to any service module</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorServices.map((vendor) => {
              const IconComp = vendor.icon;
              return (
                <div
                  key={vendor.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-zinc-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        ● {vendor.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{vendor.category} Vendor</span>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {vendor.name}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 font-sans">
                      {vendor.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{vendor.metricLabel}:</span>
                      <span className="text-amber-300 font-bold">{vendor.metricValue}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestApiEndpoint(vendor.endpoint, vendor.method)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border border-zinc-700"
                      >
                        <Zap className="h-3.5 w-3.5 text-amber-400" />
                        <span>Test Endpoint</span>
                      </button>

                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab(vendor.targetTab)}
                          className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center space-x-1 shadow-md shrink-0"
                        >
                          <span>Open Studio</span>
                          <ArrowRight className="h-3.5 w-3.5" />
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

      {/* TAB 2: NETWORK DIAGNOSTICS & ISP SNIFFER */}
      {activeSubTab === 'network_tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tool Parameters Panel */}
          <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <Sliders className="h-4 w-4 text-emerald-400" />
              <span>Diagnostic Probe Configuration</span>
            </h3>

            {/* Select Tool Type */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-bold">Select Diagnostic Tool:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ping', label: 'ICMP Ping', icon: Activity },
                  { id: 'traceroute', label: 'Traceroute', icon: Radio },
                  { id: 'dns', label: 'DNS Zone Lookup', icon: Globe },
                  { id: 'isp_sniffer', label: 'ISP Carrier Sniffer', icon: Eye },
                  { id: 'http', label: 'HTTP REST Probe', icon: Send }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setToolType(item.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                        toolType === item.id
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Input */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-bold">Target IP / Hostname / Domain:</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-emerald-500"
                placeholder="10.142.0.12 or subnet.com"
              />
            </div>

            {toolType === 'isp_sniffer' && (
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-bold">ISP Carrier Transit:</label>
                  <select
                    value={ispCarrier}
                    onChange={(e) => setIspCarrier(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Level3 / Lumen AS3356 Transit">Level3 / Lumen AS3356 Transit</option>
                    <option value="Telia / Arelion AS1299 Global">Telia / Arelion AS1299 Global</option>
                    <option value="Cogent Communications AS174">Cogent Communications AS174</option>
                    <option value="Hurricane Electric AS6939 IPv6">Hurricane Electric AS6939 IPv6</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-bold">Protocol Filter:</label>
                  <div className="flex items-center space-x-1">
                    {['ALL', 'HTTPS', 'TCP', 'UDP', 'WEBSOCKET'].map((proto) => (
                      <button
                        key={proto}
                        onClick={() => setProtocolFilter(proto)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          protocolFilter === proto ? 'bg-amber-500 text-black' : 'bg-black text-zinc-400'
                        }`}
                      >
                        {proto}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleRunDiagnostic}
              disabled={isExecuting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-98 disabled:opacity-50"
            >
              <Terminal className={`h-4 w-4 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'Running Probe...' : 'Execute Diagnostic Probe'}</span>
            </button>
          </div>

          {/* Diagnostic Console Output */}
          <div className="lg:col-span-7 bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-zinc-200">Live Probe Output Console</span>
              </div>
              {toolResponse && (
                <button
                  onClick={() => copyToClipboard(JSON.stringify(toolResponse.data, null, 2))}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold flex items-center space-x-1 border border-zinc-700"
                >
                  {copiedResponse ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedResponse ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            {!toolResponse && !isExecuting && (
              <div className="py-12 text-center text-zinc-600 text-xs space-y-2">
                <Terminal className="h-8 w-8 mx-auto opacity-40 text-emerald-500" />
                <p>Select a diagnostic tool and click "Execute Diagnostic Probe" to test SubNet.com network transit.</p>
              </div>
            )}

            {isExecuting && (
              <div className="py-12 text-center text-emerald-400 text-xs space-y-3">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin" />
                <p className="font-bold">Probing {target} across SubNet transit gateways...</p>
              </div>
            )}

            {toolResponse && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-xs">
                  <span className="text-emerald-400 font-bold">{toolResponse.statusText}</span>
                  <span className="text-amber-300 font-bold">{toolResponse.latencyMs} ms</span>
                </div>

                {/* Log Stream */}
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1 max-h-48 overflow-y-auto">
                  {toolResponse.logs?.map((log, i) => (
                    <div key={i} className="leading-tight">{log}</div>
                  ))}
                </div>

                {/* Packet Inspector if sniffer */}
                {toolResponse.packetsCaptured && toolResponse.packetsCaptured.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <span className="text-xs font-bold text-zinc-300">Sniffed Packets Frame Buffer:</span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {toolResponse.packetsCaptured.map((pkt) => (
                        <div
                          key={pkt.frameNo}
                          onClick={() => setSelectedPacket(pkt)}
                          className={`p-2 rounded-xl text-[11px] border cursor-pointer transition-all flex items-center justify-between ${
                            selectedPacket?.frameNo === pkt.frameNo
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <span className="font-bold">#{pkt.frameNo} {pkt.protocol} {pkt.sourceIP} &rarr; {pkt.destIP}:{pkt.destPort}</span>
                          <span className="text-[10px] text-zinc-500">{pkt.info}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: API RELAYER & ENDPOINT TESTER */}
      {activeSubTab === 'api_relayer' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span>SubNet.com API Relayer &amp; REST Endpoint Inspector</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Directly execute HTTP requests against all backend endpoints in this applet.
              </p>
            </div>
            {apiResponseStatus && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                apiResponseStatus === 200 ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}>
                HTTP {apiResponseStatus} ({apiResponseTime}ms)
              </span>
            )}
          </div>

          {/* Quick Endpoint Selection Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400">Quick Endpoint Presets:</span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: 'Servers List', url: '/api/servers' },
                { name: 'Ecommerce Products', url: '/api/ecommerce/products' },
                { name: 'Classified Listings', url: '/api/classifieds/listings' },
                { name: 'Hosted Page', url: '/api/hosted-pages/landing' },
                { name: 'DB Credentials', url: '/api/db/credentials' },
                { name: 'Firewall Status', url: '/api/firewall/status' },
                { name: 'Injunctions List', url: '/api/injunctions' },
                { name: 'OpenSea Collections', url: '/api/opensea/collections' }
              ].map((ep) => (
                <button
                  key={ep.url}
                  onClick={() => handleTestApiEndpoint(ep.url)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedApiEndpoint === ep.url
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {ep.name}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Input Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={apiMethod}
              onChange={(e) => setApiMethod(e.target.value as any)}
              className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>

            <input
              type="text"
              value={selectedApiEndpoint}
              onChange={(e) => setSelectedApiEndpoint(e.target.value)}
              className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
            />

            <button
              onClick={() => handleTestApiEndpoint(selectedApiEndpoint, apiMethod)}
              disabled={isTestingApi}
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              <Send className={`h-4 w-4 ${isTestingApi ? 'animate-spin' : ''}`} />
              <span>{isTestingApi ? 'Sending...' : 'Send API Call'}</span>
            </button>
          </div>

          {/* Response Display */}
          <div className="bg-black border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2">
              <span>Response Payload JSON:</span>
              {apiResponseData && (
                <button
                  onClick={() => copyToClipboard(JSON.stringify(apiResponseData, null, 2))}
                  className="hover:text-white flex items-center space-x-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy Payload</span>
                </button>
              )}
            </div>

            <pre className="text-xs text-emerald-400 font-mono max-h-80 overflow-y-auto whitespace-pre-wrap">
              {apiResponseData ? JSON.stringify(apiResponseData, null, 2) : '// Response output will appear here after triggering endpoint test'}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCE TELEMETRY */}
      {activeSubTab === 'resource_telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase">SubNet Transit Throughput</span>
            <div className="text-2xl font-black text-emerald-400">12.4 Gbps</div>
            <p className="text-[11px] text-zinc-500">100 Gbps Optical Fiber Interconnect</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase">SubNet Token Vault</span>
            <div className="text-2xl font-black text-amber-400">4,850,000 $BYTE</div>
            <p className="text-[11px] text-zinc-500">Zero-Fee Native Escrow Pool</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase">Active WebSockets</span>
            <div className="text-2xl font-black text-cyan-400">1,248 Sockets</div>
            <p className="text-[11px] text-zinc-500">Live Telemetry &amp; Speech Relay</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase">SSL Certificates</span>
            <div className="text-2xl font-black text-emerald-400">100% Valid</div>
            <p className="text-[11px] text-zinc-500">Let's Encrypt Wildcard Active</p>
          </div>
        </div>
      )}

    </div>
  );
};
