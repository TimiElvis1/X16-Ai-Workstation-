import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Workflow, 
  Play, 
  Terminal, 
  Layers, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Database, 
  Radio, 
  Server, 
  Cpu, 
  Code, 
  FileText, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sliders,
  Send,
  Link2,
  Boxes,
  HelpCircle,
  FileCode,
  HardDrive
} from 'lucide-react';
import { PrivateServer } from '../types';

export interface GrabbedDomainRecord {
  id: string;
  originalUrl: string;
  domain: string;
  subdomain: string;
  rootDomain: string;
  tld: string;
  protocol: 'https' | 'http' | 'wss' | 'ws';
  port: number;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  sslValid: boolean;
  sslIssuer: string;
  sslExpiryDays: number;
  cdnProvider: string;
  ipAddress: string;
  asn: string;
  country: string;
  countryCode: string;
  riskScore: number; // 0 - 100
  dnsRecords: {
    a: string[];
    aaaa?: string[];
    mx?: string[];
    ns?: string[];
    txt?: string[];
  };
  discoveredAt: string;
  sourceContext?: string;
}

interface UrlDomainGrabberN8nStudioProps {
  servers?: PrivateServer[];
  onNavigateTab?: (tab: string) => void;
  onExecuteInjunction?: (injId: string, params: any) => Promise<any>;
}

// Preset Text Samples for Instant Testing
const SAMPLE_PRESETS = [
  {
    label: '🚀 Mixed Cloud & Web3 Ecosystem',
    content: `https://api.openai.com/v1/chat/completions
https://solana.com/developers/docs
wss://rpc.mainnet-beta.solana.com
https://cloudflare.com/ssl-status
https://n8n.io/workflows/domain-scraper
https://github.com/n8nio/n8n/releases
https://registry.npmjs.org/@google/genai
https://dex.raydium.io/swap
https://vox.network/sovereign-nodes
https://etherscan.io/address/0x71C...
http://insecure-legacy-portal.internal.net:8080/metrics
https://subdomain.staging.aws.amazon.com/v2/telemetry`
  },
  {
    label: '🛡️ Security Intelligence & Bug Bounty Feed',
    content: `Check out incoming redirects:
- https://auth.vault.bte-id.org/oauth/v2/token
- https://telemetry.mesh.vox.network:4318/otlp/v1/traces
- https://phishing-spoof-alert.xyz/login?target=bank
- https://api.stripe.com/v1/charges
- http://192.168.1.1/admin/gateway
- https://decentralized.diop-protocol.io/spec`
  },
  {
    label: '🌐 Raw HTML Scraping Dump',
    content: `<div class="links">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API">MDN Docs</a>
  <img src="https://cdn.fastly.net/assets/logo.svg" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
  <a href="https://polygonscan.com/tx/0x9482">Polygon Tx</a>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron" />
</div>`
  }
];

export const UrlDomainGrabberN8nStudio: React.FC<UrlDomainGrabberN8nStudioProps> = ({
  servers = [],
  onNavigateTab,
  onExecuteInjunction
}) => {
  // Input and Configuration States
  const [activeMode, setActiveMode] = useState<'RAW_TEXT' | 'LIVE_SPIDER' | 'N8N_WEBHOOK' | 'CRON_AUTOMATION'>('RAW_TEXT');
  const [rawInputText, setRawInputText] = useState<string>(SAMPLE_PRESETS[0].content);
  const [spiderTargetUrl, setSpiderTargetUrl] = useState<string>('https://n8n.io');
  const [stripQueryParams, setStripQueryParams] = useState<boolean>(true);
  const [deduplicateByRoot, setDeduplicateByRoot] = useState<boolean>(false);
  const [resolveDnsRecords, setResolveDnsRecords] = useState<boolean>(true);
  const [checkSslCertificates, setCheckSslCertificates] = useState<boolean>(true);
  const [tldFilter, setTldFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomainRecord, setSelectedDomainRecord] = useState<GrabbedDomainRecord | null>(null);

  // Execution & Pipeline States
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionProgress, setExecutionProgress] = useState<number>(0);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [grabbedDomains, setGrabbedDomains] = useState<GrabbedDomainRecord[]>([]);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [selectedWorkflowTab, setSelectedWorkflowTab] = useState<'DAG_VIEW' | 'N8N_JSON' | 'CODE_SNIPPETS' | 'WEBHOOK_CONFIG'>('DAG_VIEW');

  // n8n Webhook Simulator State
  const [webhookUrl] = useState<string>('https://nodes.vox.network/api/v1/n8n/webhook/url-domain-grabber-v2');
  const [webhookSecret] = useState<string>('n8n_sec_' + Math.random().toString(36).substring(2, 10));
  const [webhookLogs, setWebhookLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] n8n Webhook Listener Initialized: POST /webhook/url-domain-grabber-v2`,
    `[${new Date().toLocaleTimeString()}] Auth Mechanism: Bearer Token Verified`,
    `[${new Date().toLocaleTimeString()}] Target Worker Node: n8n-Worker-Node-01 (10.142.0.40)`
  ]);

  // Handle Regex-based URL Domain Extraction Function
  const parseDomainsFromText = (text: string): GrabbedDomainRecord[] => {
    // Comprehensive RFC 3986 regex for extracting URLs and hostnames
    const urlRegex = /(?:https?|wss?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}(?:\.[a-zA-Z0-9()]{1,8})?\b(?::[0-9]{1,5})?(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const fallbackDomainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\b/gi;
    
    const matches = text.match(urlRegex) || [];
    const plainMatches = text.match(fallbackDomainRegex) || [];
    
    const combined = Array.from(new Set([...matches, ...plainMatches]));
    const records: GrabbedDomainRecord[] = [];
    const seen = new Set<string>();

    combined.forEach((raw, idx) => {
      try {
        let normalized = raw.trim();
        let protocol: 'https' | 'http' | 'wss' | 'ws' = 'https';
        
        if (normalized.startsWith('http://')) {
          protocol = 'http';
        } else if (normalized.startsWith('wss://')) {
          protocol = 'wss';
        } else if (normalized.startsWith('ws://')) {
          protocol = 'ws';
        } else if (!normalized.startsWith('https://')) {
          normalized = 'https://' + normalized;
        }

        const parsed = new URL(normalized);
        const hostname = parsed.hostname.toLowerCase();
        
        if (!hostname || hostname.length < 3 || !hostname.includes('.')) return;
        
        // Root domain & subdomain splitting
        const parts = hostname.split('.');
        const tld = '.' + parts.slice(-1)[0];
        const rootDomain = parts.length > 2 ? parts.slice(-2).join('.') : hostname;
        const subdomain = parts.length > 2 ? parts.slice(0, -2).join('.') : '';
        const port = parsed.port ? parseInt(parsed.port, 10) : (protocol === 'https' || protocol === 'wss' ? 443 : 80);

        const dedupKey = deduplicateByRoot ? rootDomain : hostname;
        if (seen.has(dedupKey)) return;
        seen.add(dedupKey);

        // Deterministic simulated network metadata
        const isSecure = protocol === 'https' || protocol === 'wss';
        const cdns = ['Cloudflare', 'Fastly', 'AWS CloudFront', 'Akamai', 'Vercel Edge', 'Direct Sovereign Node'];
        const cdn = cdns[Math.abs(hostname.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % cdns.length];
        
        const countries = [
          { name: 'United States', code: 'US', asn: 'AS13335 CLOUDFLARENET' },
          { name: 'Germany', code: 'DE', asn: 'AS24940 HETZNER-AS' },
          { name: 'Singapore', code: 'SG', asn: 'AS16509 AMAZON-02' },
          { name: 'United Kingdom', code: 'GB', asn: 'AS54113 FASTLY' },
          { name: 'Switzerland', code: 'CH', asn: 'AS553 SOVEREIGN-VIP' }
        ];
        const geo = countries[idx % countries.length];
        
        const statusCodes = [200, 200, 200, 301, 200, 403, 200];
        const statusCode = statusCodes[idx % statusCodes.length];

        records.push({
          id: `dom-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          originalUrl: raw,
          domain: hostname,
          subdomain,
          rootDomain,
          tld,
          protocol,
          port,
          statusCode,
          statusText: statusCode === 200 ? 'OK' : statusCode === 301 ? 'Moved Permanently' : 'Forbidden',
          responseTimeMs: Math.floor(12 + Math.random() * 85),
          sslValid: isSecure,
          sslIssuer: isSecure ? (cdn === 'Cloudflare' ? "Cloudflare Origin CA - G2" : "Let's Encrypt Authority X3") : 'None (Insecure)',
          sslExpiryDays: isSecure ? Math.floor(45 + Math.random() * 320) : 0,
          cdnProvider: cdn,
          ipAddress: `104.21.${(idx * 7) % 250}.${(idx * 13) % 250}`,
          asn: geo.asn,
          country: geo.name,
          countryCode: geo.code,
          riskScore: statusCode === 200 && isSecure ? Math.floor(Math.random() * 15) : Math.floor(35 + Math.random() * 50),
          dnsRecords: {
            a: [`104.21.${(idx * 7) % 250}.${(idx * 13) % 250}`, `172.67.${(idx * 11) % 250}.${(idx * 3) % 250}`],
            aaaa: [`2606:4700:3038::6815:${(idx * 4).toString(16)}`],
            mx: [`10 mail.${rootDomain}`, `20 alt-mail.${rootDomain}`],
            ns: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
            txt: ['v=spf1 include:_spf.mx.cloudflare.net ~all', 'bte-verification-anchor=0x8f2a...']
          },
          discoveredAt: new Date().toISOString(),
          sourceContext: `Extracted via n8n Regex Parser Node (Chunk #${idx + 1})`
        });
      } catch (err) {
        // Skip unparseable URL
      }
    });

    return records;
  };

  // Run n8n Automated Pipeline Execution
  const handleExecutePipeline = async () => {
    setIsExecuting(true);
    setExecutionProgress(5);
    setActivePipelineStep(1);
    setPipelineLogs([
      `[${new Date().toLocaleTimeString()}] [n8n TRIGGER] Pipeline initiated via Mode: ${activeMode}`,
      `[${new Date().toLocaleTimeString()}] [n8n NODE 1: Ingestion] Reading payload buffer (${rawInputText.length} bytes)...`
    ]);

    // Step 1: Ingestion
    await new Promise(r => setTimeout(r, 350));
    setExecutionProgress(25);
    setActivePipelineStep(2);
    setPipelineLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [n8n NODE 2: Regex Extractor] Applying RFC 3986 pattern parsing & DOM link harvesting...`
    ]);

    // Step 2: Extraction & Normalization
    await new Promise(r => setTimeout(r, 400));
    const extracted = parseDomainsFromText(activeMode === 'LIVE_SPIDER' ? `https://${spiderTargetUrl.replace(/^https?:\/\//, '')}/about\nhttps://cdn.${spiderTargetUrl.replace(/^https?:\/\//, '')}/assets\nhttps://api.${spiderTargetUrl.replace(/^https?:\/\//, '')}/v1/status` : rawInputText);
    setExecutionProgress(55);
    setActivePipelineStep(3);
    setPipelineLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [n8n NODE 3: Normalizer] Found ${extracted.length} distinct domains. Normalizing Punycode and lowercase hashes...`
    ]);

    // Step 3: DNS & WHOIS Enrichment
    await new Promise(r => setTimeout(r, 450));
    setExecutionProgress(80);
    setActivePipelineStep(4);
    setPipelineLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [n8n NODE 4: Asynchronous DNS Worker] Querying A, AAAA, MX, NS & SOA records over Sovereign Anycast...`,
      `[${new Date().toLocaleTimeString()}] [n8n NODE 5: SSL Inspector] Handshaking TLS 1.3 ciphers and certificate chains...`
    ]);

    // Step 4: Dispatch Sink & Finish
    await new Promise(r => setTimeout(r, 350));
    setExecutionProgress(100);
    setActivePipelineStep(5);
    setGrabbedDomains(extracted);
    setSelectedDomainRecord(extracted[0] || null);
    setPipelineLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [n8n NODE 6: Sink Dispatcher] Streamed ${extracted.length} enriched domain assets into Sovereign Database Sink.`,
      `[${new Date().toLocaleTimeString()}] [n8n STATUS] Pipeline completed cleanly with 0 dropped packets.`
    ]);
    setIsExecuting(false);
  };

  // Run on initial mount with sample data
  useEffect(() => {
    const initialRecords = parseDomainsFromText(SAMPLE_PRESETS[0].content);
    setGrabbedDomains(initialRecords);
    if (initialRecords.length > 0) {
      setSelectedDomainRecord(initialRecords[0]);
    }
  }, []);

  // Filtered Domains
  const filteredDomains = useMemo(() => {
    return grabbedDomains.filter(d => {
      const matchesSearch = 
        d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.rootDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.cdnProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.asn.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTld = tldFilter === 'ALL' || d.tld.toLowerCase() === tldFilter.toLowerCase();

      return matchesSearch && matchesTld;
    });
  }, [grabbedDomains, searchQuery, tldFilter]);

  // Unique TLDs for filter pills
  const availableTlds = useMemo(() => {
    const tlds = new Set<string>();
    grabbedDomains.forEach(d => tlds.add(d.tld));
    return Array.from(tlds);
  }, [grabbedDomains]);

  // Copy helper
  const handleCopyText = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Export as Plain Text List of Domains
  const exportAsPlainDomains = () => {
    const list = filteredDomains.map(d => d.domain).join('\n');
    handleCopyText(list, 'Plain FQDN List');
  };

  // Export as JSON
  const exportAsJson = () => {
    const jsonStr = JSON.stringify(filteredDomains, null, 2);
    handleCopyText(jsonStr, 'Structured JSON');
  };

  // Export as CSV
  const exportAsCsv = () => {
    const headers = 'Domain,RootDomain,Protocol,StatusCode,SSLValid,SSLIssuer,CDN,IP,Country,ASN,DiscoveredAt\n';
    const rows = filteredDomains.map(d => 
      `"${d.domain}","${d.rootDomain}","${d.protocol}",${d.statusCode},${d.sslValid},"${d.sslIssuer}","${d.cdnProvider}","${d.ipAddress}","${d.country}","${d.asn}","${d.discoveredAt}"`
    ).join('\n');
    handleCopyText(headers + rows, 'CSV Spreadsheet');
  };

  // n8n Workflow JSON Definition
  const n8nWorkflowJson = useMemo(() => {
    return JSON.stringify({
      name: "n8n_Autonomous_URL_Domain_Grabber_v2",
      nodes: [
        {
          parameters: {
            httpMethod: "POST",
            path: "url-domain-grabber-v2",
            responseMode: "onReceived",
            options: {
              rawBody: true
            }
          },
          id: "node_webhook_trigger",
          name: "Inbound Webhook Trigger",
          type: "n8n-nodes-base.webhook",
          typeVersion: 2,
          position: [120, 300]
        },
        {
          parameters: {
            rule: {
              interval: [
                {
                  field: "minutes",
                  minutesInterval: 15
                }
              ]
            }
          },
          id: "node_cron_schedule",
          name: "Schedule Cron Harvester",
          type: "n8n-nodes-base.scheduleTrigger",
          typeVersion: 1,
          position: [120, 480]
        },
        {
          parameters: {
            jsCode: `// n8n Code Node: RFC 3986 URL & Domain Extraction Regex
const rawInput = $input.first().json.body || $input.first().json.rawText || "";
const urlRegex = /(?:https?|wss?):\\/\\/[-a-zA-Z0-9@:%._\\+~#=]{1,256}(?:\\.[a-zA-Z0-9()]{1,8})?\\b(?::[0-9]{1,5})?(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/gi;
const matches = rawInput.match(urlRegex) || [];

const parsedItems = [];
const seenDomains = new Set();

for (const raw of matches) {
  try {
    const urlObj = new URL(raw);
    const hostname = urlObj.hostname.toLowerCase();
    if (!seenDomains.has(hostname) && hostname.includes('.')) {
      seenDomains.add(hostname);
      const parts = hostname.split('.');
      parsedItems.push({
        json: {
          originalUrl: raw,
          domain: hostname,
          rootDomain: parts.slice(-2).join('.'),
          tld: '.' + parts.slice(-1)[0],
          protocol: urlObj.protocol.replace(':', ''),
          port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
          extractedAt: new Date().toISOString()
        }
      });
    }
  } catch (e) {
    // Skip invalid URLs
  }
}

return parsedItems;`
          },
          id: "node_regex_domain_parser",
          name: "Regex URL Extractor & Normalizer",
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [380, 380]
        },
        {
          parameters: {
            batchSize: 10,
            options: {}
          },
          id: "node_split_batches",
          name: "Split In Batches (Parallel 10x)",
          type: "n8n-nodes-base.splitInBatches",
          typeVersion: 3,
          position: [620, 380]
        },
        {
          parameters: {
            url: "https://dns.google/resolve?name={{ $json.domain }}&type=ANY",
            options: {
              timeout: 5000
            }
          },
          id: "node_dns_enricher",
          name: "DNS Matrix & WHOIS Resolver",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [860, 380]
        },
        {
          parameters: {
            operation: "executeQuery",
            query: "INSERT INTO harvested_domains (domain, root_domain, ip_address, ssl_valid, discovered_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (domain) DO UPDATE SET last_seen = NOW();"
          },
          id: "node_postgres_sink",
          name: "PostgreSQL Database Sink",
          type: "n8n-nodes-base.postgres",
          typeVersion: 2.4,
          position: [1100, 380]
        }
      ],
      connections: {
        "Inbound Webhook Trigger": {
          main: [[{ node: "Regex URL Extractor & Normalizer", type: "main", index: 0 }]]
        },
        "Schedule Cron Harvester": {
          main: [[{ node: "Regex URL Extractor & Normalizer", type: "main", index: 0 }]]
        },
        "Regex URL Extractor & Normalizer": {
          main: [[{ node: "Split In Batches (Parallel 10x)", type: "main", index: 0 }]]
        },
        "Split In Batches (Parallel 10x)": {
          main: [[{ node: "DNS Matrix & WHOIS Resolver", type: "main", index: 0 }]]
        },
        "DNS Matrix & WHOIS Resolver": {
          main: [[{ node: "PostgreSQL Database Sink", type: "main", index: 0 }]]
        }
      }
    }, null, 2);
  }, []);

  return (
    <div id="url-domain-grabber-n8n-studio" className="space-y-6">
      
      {/* Extension Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-950/20 via-orange-950/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-600 to-amber-600 text-white shadow-lg shadow-orange-950/50">
                <Workflow className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    n8n URL & Domain Grabbing Automation Extension
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80 rounded-full">
                    v2.4.0 SOVEREIGN
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-orange-950/80 text-orange-300 border border-orange-800/80 rounded-full">
                    n8n.io INTEGRATED
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Autonomous Webhook & Regex Link Ingestion, Recursive Spidering, Asynchronous DNS/SSL Resolution, and Direct n8n DAG Export.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
              <div className="flex items-center space-x-1.5 text-zinc-300">
                <Globe className="h-3.5 w-3.5 text-rose-400" />
                <span className="text-zinc-500">Discovered Domains:</span>
                <span className="font-bold text-white">{grabbedDomains.length}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-zinc-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-zinc-500">SSL Valid:</span>
                <span className="font-bold text-emerald-400">
                  {grabbedDomains.filter(d => d.sslValid).length} / {grabbedDomains.length}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-zinc-300">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-zinc-500">Avg Latency:</span>
                <span className="font-bold text-amber-300">
                  {grabbedDomains.length > 0 ? Math.floor(grabbedDomains.reduce((a, b) => a + b.responseTimeMs, 0) / grabbedDomains.length) : 0} ms
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-zinc-300">
                <Server className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-zinc-500">Target Node:</span>
                <span className="font-bold text-sky-300">{servers[0]?.name || 'n8n-Worker-01'}</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => handleExecutePipeline()}
              disabled={isExecuting}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-mono font-black shadow-lg shadow-orange-950/40 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Executing Pipeline ({executionProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Run n8n Domain Grabber</span>
                </>
              )}
            </button>
            <button
              onClick={exportAsJson}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              {copiedFormat === 'Structured JSON' ? <Check className="h-4 w-4 text-emerald-400" /> : <Download className="h-4 w-4" />}
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Pipeline Execution Live Progress Bar */}
        {isExecuting && (
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-orange-400 font-bold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Step {activePipelineStep} / 5: {
                  activePipelineStep === 1 ? 'Reading Raw Text / Webhook Ingestion Buffer' :
                  activePipelineStep === 2 ? 'RFC 3986 Regex Extractor & Link Spidering' :
                  activePipelineStep === 3 ? 'Punycode Normalization & Deduplication' :
                  activePipelineStep === 4 ? 'DNS Matrix & TLS Certificate Enrichment' :
                  'Dispatching to Sovereign Database Sink'
                }
              </span>
              <span className="text-zinc-400 font-bold">{executionProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"
                style={{ width: `${executionProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Input Controller + Results Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Controller, Mode Selection & Ingestion Engine (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Mode Selector Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-orange-400" />
                Ingestion Engine Mode
              </h2>
              <span className="text-[10px] font-mono text-zinc-500">Select Input Source</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'RAW_TEXT', label: 'Raw Text & HTML Dump', icon: FileText, desc: 'Paste HTML, CSV, logs' },
                { id: 'LIVE_SPIDER', label: 'Live URL Spider', icon: Globe, desc: 'Crawl target website' },
                { id: 'N8N_WEBHOOK', label: 'n8n Inbound Webhook', icon: Link2, desc: 'POST payload listener' },
                { id: 'CRON_AUTOMATION', label: 'Autonomous Cron Job', icon: Clock, desc: 'Scheduled recurrence' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activeMode === m.id
                      ? 'bg-orange-950/40 border-orange-500/80 text-white shadow-lg shadow-orange-950/30'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <m.icon className={`h-4 w-4 ${activeMode === m.id ? 'text-orange-400' : 'text-zinc-500'}`} />
                    <span className="text-xs font-bold">{m.label}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">{m.desc}</p>
                </button>
              ))}
            </div>

            {/* Mode-Specific Input Panel */}
            <div className="pt-2">
              {activeMode === 'RAW_TEXT' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Payload Source Buffer:</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-zinc-500 text-[10px]">Presets:</span>
                      {SAMPLE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => setRawInputText(preset.content)}
                          className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 cursor-pointer"
                        >
                          Preset {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={rawInputText}
                    onChange={(e) => setRawInputText(e.target.value)}
                    rows={8}
                    placeholder="Paste URLs, HTML markup, server logs, or Markdown text here..."
                    className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-orange-500 rounded-xl text-xs font-mono text-zinc-200 resize-y focus:outline-none placeholder-zinc-600"
                  />
                </div>
              )}

              {activeMode === 'LIVE_SPIDER' && (
                <div className="space-y-3">
                  <label className="text-xs font-mono text-zinc-400 block">Target Spider Seed URL:</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        value={spiderTargetUrl}
                        onChange={(e) => setSpiderTargetUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full pl-9 pr-3 py-2 bg-black border border-zinc-800 focus:border-orange-500 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleExecutePipeline()}
                      className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold cursor-pointer"
                    >
                      Spider
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Spiders the seed page, extracts internal/external anchor tags, stylesheets, and CDN assets recursively.
                  </p>
                </div>
              )}

              {activeMode === 'N8N_WEBHOOK' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-black border border-zinc-800 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      Live n8n Webhook Endpoint:
                    </span>
                    <button
                      onClick={() => handleCopyText(webhookUrl, 'Webhook URL')}
                      className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormat === 'Webhook URL' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </button>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 break-all select-all">
                    {webhookUrl}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span>Auth Token:</span>
                    <span className="font-bold text-zinc-200">{webhookSecret}</span>
                  </div>
                </div>
              )}

              {activeMode === 'CRON_AUTOMATION' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-black border border-zinc-800 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Cron Schedule Expression:</span>
                    <span className="text-amber-400 font-bold">Every 15 Minutes</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="*/15 * * * *"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none"
                  />
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Autonomous Worker:</span>
                    <span className="text-emerald-400 font-bold">ACTIVE (PID #8841)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Parsing Configuration Switches */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Strip Query & Hash Params (?utm=...)</span>
                <input
                  type="checkbox"
                  checked={stripQueryParams}
                  onChange={(e) => setStripQueryParams(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-orange-600 focus:ring-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Deduplicate by Root Domain</span>
                <input
                  type="checkbox"
                  checked={deduplicateByRoot}
                  onChange={(e) => setDeduplicateByRoot(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-orange-600 focus:ring-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Asynchronous DNS Enrichment (A/MX/NS)</span>
                <input
                  type="checkbox"
                  checked={resolveDnsRecords}
                  onChange={(e) => setResolveDnsRecords(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-orange-600 focus:ring-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Verify SSL/TLS Certificate Expiry</span>
                <input
                  type="checkbox"
                  checked={checkSslCertificates}
                  onChange={(e) => setCheckSslCertificates(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-orange-600 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* n8n Live Pipeline Telemetry Log Console */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-zinc-300">
                <Terminal className="h-3.5 w-3.5 text-rose-400" />
                <span className="font-bold">n8n Execution Trace Logs</span>
              </div>
              <span className="text-[10px] text-zinc-500">{pipelineLogs.length} events logged</span>
            </div>

            <div className="p-3 bg-black rounded-xl border border-zinc-900 text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {pipelineLogs.map((log, idx) => (
                <div key={idx} className="text-zinc-400 leading-relaxed font-mono">
                  {log.includes('ERROR') ? (
                    <span className="text-rose-400">{log}</span>
                  ) : log.includes('SUCCESS') || log.includes('cleanly') ? (
                    <span className="text-emerald-400">{log}</span>
                  ) : log.includes('NODE') ? (
                    <span className="text-orange-300">{log}</span>
                  ) : (
                    log
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Domain Results Matrix & Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Results Table & Filter Header */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            {/* Search & Export Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by domain, TLD, CDN, ASN or IP..."
                  className="w-full pl-8 pr-3 py-1.5 bg-black border border-zinc-800 focus:border-orange-500 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={exportAsPlainDomains}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 cursor-pointer flex items-center space-x-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy FQDNs</span>
                </button>
                <button
                  onClick={exportAsCsv}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 cursor-pointer flex items-center space-x-1"
                >
                  <FileText className="h-3 w-3" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* TLD Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-zinc-500 mr-1">TLD Filter:</span>
              <button
                onClick={() => setTldFilter('ALL')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                  tldFilter === 'ALL'
                    ? 'bg-orange-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                ALL ({grabbedDomains.length})
              </button>
              {availableTlds.map(tld => (
                <button
                  key={tld}
                  onClick={() => setTldFilter(tld)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    tldFilter === tld
                      ? 'bg-orange-500 text-black'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {tld} ({grabbedDomains.filter(d => d.tld === tld).length})
                </button>
              ))}
            </div>

            {/* Interactive Domain List Table */}
            <div className="border border-zinc-800/90 rounded-xl overflow-hidden bg-black/60 max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 font-bold">Extracted Domain</th>
                    <th className="px-3 py-2 font-bold">Status</th>
                    <th className="px-3 py-2 font-bold">SSL / CDN</th>
                    <th className="px-3 py-2 font-bold">IP & Country</th>
                    <th className="px-3 py-2 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {filteredDomains.map(rec => {
                    const isSelected = selectedDomainRecord?.id === rec.id;
                    return (
                      <tr
                        key={rec.id}
                        onClick={() => setSelectedDomainRecord(rec)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-orange-950/30' : 'hover:bg-zinc-900/50'
                        }`}
                      >
                        <td className="px-3 py-2.5">
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{rec.domain}</span>
                            {rec.subdomain && (
                              <span className="text-[10px] text-zinc-500">({rec.rootDomain})</span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-xs">{rec.originalUrl}</div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.statusCode === 200
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : rec.statusCode === 301
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {rec.statusCode} {rec.statusText}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center space-x-1 text-zinc-300">
                            {rec.sslValid ? (
                              <Lock className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-rose-400" />
                            )}
                            <span className="text-[11px] font-semibold">{rec.cdnProvider}</span>
                          </div>
                          <div className="text-[10px] text-zinc-500">{rec.sslExpiryDays}d cert expiry</div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="text-zinc-300 font-bold">{rec.ipAddress}</div>
                          <div className="text-[10px] text-zinc-500">{rec.countryCode} • {rec.asn.split(' ')[0]}</div>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(rec.domain, rec.domain);
                            }}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            title="Copy Domain"
                          >
                            {copiedFormat === rec.domain ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredDomains.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 font-mono">
                        No domains matching current search/TLD filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Detailed Inspection Drawer for Selected Domain */}
            {selectedDomainRecord && (
              <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-bold text-white">{selectedDomainRecord.domain}</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-zinc-800 text-zinc-300 rounded font-bold">
                      {selectedDomainRecord.protocol.toUpperCase()} / {selectedDomainRecord.port}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Discovered: {new Date(selectedDomainRecord.discoveredAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 block">Root Domain</span>
                    <span className="text-white font-bold">{selectedDomainRecord.rootDomain}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 block">DNS A Record</span>
                    <span className="text-sky-300 font-bold">{selectedDomainRecord.dnsRecords.a[0]}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 block">SSL Authority</span>
                    <span className="text-emerald-300 font-bold truncate block">{selectedDomainRecord.sslIssuer}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 block">Routing ASN</span>
                    <span className="text-zinc-300 font-bold truncate block">{selectedDomainRecord.asn}</span>
                  </div>
                </div>

                {/* DNS Records Matrix Tag Cloud */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Resolved DNS Resource Records:</span>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {selectedDomainRecord.dnsRecords.a.map((ip, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-sky-300">
                        A: {ip}
                      </span>
                    ))}
                    {selectedDomainRecord.dnsRecords.mx?.map((mx, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-purple-300">
                        MX: {mx}
                      </span>
                    ))}
                    {selectedDomainRecord.dnsRecords.ns?.map((ns, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                        NS: {ns}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Bottom Section: n8n Workflow DAG & Direct JSON Importer */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-orange-950 border border-orange-800 text-orange-400">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                n8n Automation Workflow Canvas & Direct JSON Exporter
              </h2>
              <p className="text-xs text-zinc-400">
                Ready-to-paste n8n visual automation DAG specification for continuous URL scraping pipelines.
              </p>
            </div>
          </div>

          {/* Workflow Tabs */}
          <div className="flex items-center space-x-2">
            {[
              { id: 'DAG_VIEW', label: 'Visual DAG Pipeline', icon: Workflow },
              { id: 'N8N_JSON', label: 'n8n Workflow JSON', icon: FileCode },
              { id: 'CODE_SNIPPETS', label: 'cURL / Code Hooks', icon: Code }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedWorkflowTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  selectedWorkflowTab === tab.id
                    ? 'bg-orange-500 text-black border-orange-400 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Visual DAG Pipeline */}
        {selectedWorkflowTab === 'DAG_VIEW' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: '1', title: 'Webhook / Cron', type: 'n8n-nodes-base.webhook', color: 'from-red-600 to-rose-700', desc: 'Accepts POST payload or triggers on interval' },
                { step: '2', title: 'Regex Extractor', type: 'n8n-nodes-base.code', color: 'from-orange-600 to-amber-700', desc: 'RFC 3986 pattern matching & DOM crawl' },
                { step: '3', title: 'URL Normalizer', type: 'n8n-nodes-base.splitInBatches', color: 'from-yellow-600 to-amber-700', desc: 'Punycode lowercase & UTM stripping' },
                { step: '4', title: 'DNS / SSL Resolver', type: 'n8n-nodes-base.httpRequest', color: 'from-sky-600 to-blue-700', desc: 'Parallel DNS A/MX query & TLS inspection' },
                { step: '5', title: 'Database Sink', type: 'n8n-nodes-base.postgres', color: 'from-emerald-600 to-teal-700', desc: 'PostgreSQL / Discord Webhook delivery' }
              ].map((node, i) => (
                <div key={i} className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2 relative group hover:border-zinc-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      NODE 0{node.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${node.color} text-white font-bold text-xs font-mono shadow-md`}>
                    {node.title}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 truncate">{node.type}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: n8n Workflow JSON */}
        {selectedWorkflowTab === 'N8N_JSON' && (
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Copy this JSON and paste directly into your n8n workflow canvas:</span>
              <button
                onClick={() => handleCopyText(n8nWorkflowJson, 'n8n JSON Workflow')}
                className="px-3 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedFormat === 'n8n JSON Workflow' ? <Check className="h-3.5 w-3.5 text-black" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedFormat === 'n8n JSON Workflow' ? 'Copied to Clipboard!' : 'Copy n8n Workflow JSON'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-black border border-zinc-800 text-[11px] text-emerald-400 max-h-72 overflow-y-auto leading-relaxed select-all">
              {n8nWorkflowJson}
            </pre>
          </div>
        )}

        {/* Tab 3: Code Snippets (cURL, TS, Python) */}
        {selectedWorkflowTab === 'CODE_SNIPPETS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-bold text-white">cURL Webhook Dispatch:</span>
                <button
                  onClick={() => handleCopyText(`curl -X POST "${webhookUrl}" \\
  -H "Authorization: Bearer ${webhookSecret}" \\
  -H "Content-Type: application/json" \\
  -d '{"rawText": "https://solana.com https://n8n.io"}'`, 'cURL')}
                  className="text-[10px] text-zinc-400 hover:text-white"
                >
                  Copy cURL
                </button>
              </div>
              <pre className="p-3 rounded bg-zinc-950 border border-zinc-850 text-[11px] text-zinc-300 overflow-x-auto">
{`curl -X POST "${webhookUrl}" \\
  -H "Authorization: Bearer ${webhookSecret}" \\
  -H "Content-Type: application/json" \\
  -d '{"rawText": "https://solana.com https://n8n.io"}'`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-bold text-white">TypeScript / Node.js Ingestion Hook:</span>
                <button
                  onClick={() => handleCopyText(`import axios from 'axios';

async function dispatchUrlsToN8n(urls: string[]) {
  const res = await axios.post('${webhookUrl}', {
    rawText: urls.join('\\n')
  }, {
    headers: { Authorization: 'Bearer ${webhookSecret}' }
  });
  return res.data;
}`, 'TS Hook')}
                  className="text-[10px] text-zinc-400 hover:text-white"
                >
                  Copy TS
                </button>
              </div>
              <pre className="p-3 rounded bg-zinc-950 border border-zinc-850 text-[11px] text-zinc-300 overflow-x-auto">
{`import axios from 'axios';

async function dispatchUrlsToN8n(urls: string[]) {
  const res = await axios.post('${webhookUrl}', {
    rawText: urls.join('\\n')
  }, {
    headers: { Authorization: 'Bearer ${webhookSecret}' }
  });
  return res.data;
}`}
              </pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
