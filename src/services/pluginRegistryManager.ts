import { EngineProtocolCategory, TelemetryAssignment } from '../types/protocolEngine';
import { IDENTIFIED_PROTOCOL_CATEGORIES } from '../data/protocolCategoriesData';

export interface PluginHookDefinition {
  id: string;
  name: string;
  triggerEvent: 'BEFORE_INGRESS' | 'ON_AUTH' | 'ON_PACKET_INGEST' | 'ON_ROUTE_DISPATCH' | 'ON_TELEMETRY_EMIT' | 'AFTER_EGRESS';
  handlerName: string;
  description: string;
  isAsync: boolean;
  timeoutMs: number;
}

export interface ProtocolPluginModule {
  id: string;
  categoryId: EngineProtocolCategory;
  categoryIndex: number;
  name: string;
  shortLabel: string;
  layer: string;
  color: string;
  iconName: string;
  version: string;
  status: 'INSTALLED' | 'STANDBY' | 'ERROR';
  isInstalledAsTool: boolean;
  installedAt?: string;
  
  // API Route Specifications
  apiRoute: string;
  supportedMethods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'STREAM' | 'SUBSCRIBE'>;
  authStrategy: 'DID_ANCHOR' | 'BEARER_JWT' | 'MTLS_STRICT' | 'API_KEY' | 'OPEN';
  rateLimitPerSec: number;
  
  // Attached Tools and Hooks
  hooks: PluginHookDefinition[];
  constituentProtocols: string[];
  
  // Telemetry Server Assignment
  telemetry: TelemetryAssignment;
  
  // Documentation & Sample Code
  usageExample: {
    curl: string;
    typescript: string;
    python: string;
  };
}

export interface TelemetryServerOption {
  id: string;
  name: string;
  host: string;
  port: number;
  protocol: 'OTLP_GRPC' | 'PROMETHEUS' | 'SYSLOG_TLS' | 'FLUENT_BIT' | 'VIP_TELEMETRY';
  endpoint: string;
  location: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
  activePipelines: number;
}

export const AVAILABLE_TELEMETRY_SERVERS: TelemetryServerOption[] = [
  {
    id: 'telemetry-srv-01',
    name: 'Alpha-Edge-Gateway Subnet Probe (Primary)',
    host: '10.142.0.12',
    port: 4317,
    protocol: 'OTLP_GRPC',
    endpoint: 'https://10.142.0.12:4317/v1/traces',
    location: 'US-East (Alpha Edge)',
    status: 'ONLINE',
    activePipelines: 18
  },
  {
    id: 'telemetry-srv-02',
    name: 'Global OpenTelemetry OTLP High-Speed Collector',
    host: 'telemetry.vox.network',
    port: 4318,
    protocol: 'OTLP_GRPC',
    endpoint: 'https://telemetry.vox.network:4318/v1/metrics',
    location: 'Global Anycast Mesh',
    status: 'ONLINE',
    activePipelines: 24
  },
  {
    id: 'telemetry-srv-03',
    name: 'Prometheus High-Resolution Scraper Gateway',
    host: 'prometheus-gw.vox.network',
    port: 9090,
    protocol: 'PROMETHEUS',
    endpoint: 'https://prometheus-gw.vox.network:9090/metrics',
    location: 'EU-Central (Frankfurt)',
    status: 'ONLINE',
    activePipelines: 12
  },
  {
    id: 'telemetry-srv-04',
    name: 'Sovereign VIP Virtual Packet Telemetry Router',
    host: '10.240.0.1',
    port: 9100,
    protocol: 'VIP_TELEMETRY',
    endpoint: 'vnet://telemetry.vip.mesh:9100',
    location: 'Virtual Internet Mesh',
    status: 'ONLINE',
    activePipelines: 32
  },
  {
    id: 'telemetry-srv-05',
    name: 'Encrypted RFC 5424 Syslog TLS Ingestion Node',
    host: 'syslog-tls.vox.network',
    port: 6514,
    protocol: 'SYSLOG_TLS',
    endpoint: 'tls://syslog-tls.vox.network:6514',
    location: 'Asia-East (Tokyo)',
    status: 'ONLINE',
    activePipelines: 8
  }
];

const STORAGE_KEY = 'bte_protocol_plugins_v1';

/**
 * Generate Default 20 Protocol Category Plugin Modules
 */
export function buildInitialPluginModules(): ProtocolPluginModule[] {
  const basePlugins: ProtocolPluginModule[] = IDENTIFIED_PROTOCOL_CATEGORIES.map((cat, index): ProtocolPluginModule => {
    const slug = cat.id.replace(/-/g, '_');
    const apiRoute = `/api/plugins/v1/${slug}`;
    const defaultServer = AVAILABLE_TELEMETRY_SERVERS[index % AVAILABLE_TELEMETRY_SERVERS.length];

    const hooks: PluginHookDefinition[] = [
      {
        id: `hook-${slug}-01`,
        name: `${cat.shortLabel} Ingress Sanitizer`,
        triggerEvent: 'BEFORE_INGRESS',
        handlerName: `validate${cat.shortLabel.replace(/[^a-zA-Z0-9]/g, '')}Payload`,
        description: `Pre-flight schema validation & header sanitization for ${cat.name}`,
        isAsync: false,
        timeoutMs: 50
      },
      {
        id: `hook-${slug}-02`,
        name: `DID & Cryptographic Anchor Attestation`,
        triggerEvent: 'ON_AUTH',
        handlerName: `verify${cat.shortLabel.replace(/[^a-zA-Z0-9]/g, '')}IdentityProof`,
        description: `Enforce on-chain DID identity attestation & signature verification`,
        isAsync: true,
        timeoutMs: 150
      },
      {
        id: `hook-${slug}-03`,
        name: `Packet Buffer Ingest & Multiplex`,
        triggerEvent: 'ON_PACKET_INGEST',
        handlerName: `handle${cat.shortLabel.replace(/[^a-zA-Z0-9]/g, '')}PacketStream`,
        description: `Multiplex packet payloads across active virtual nodes and subnets`,
        isAsync: true,
        timeoutMs: 200
      },
      {
        id: `hook-${slug}-04`,
        name: `Telemetry & OTLP Metric Dispatch`,
        triggerEvent: 'ON_TELEMETRY_EMIT',
        handlerName: `emit${cat.shortLabel.replace(/[^a-zA-Z0-9]/g, '')}Telemetry`,
        description: `Publish real-time PPS, latency and socket metrics to telemetry server`,
        isAsync: true,
        timeoutMs: 100
      }
    ];

    const isInitiallyInstalled = cat.recommended || index < 10;
    const now = new Date(Date.now() - (20 - index) * 3600000).toISOString();

    return {
      id: `plugin-${cat.id}`,
      categoryId: cat.id,
      categoryIndex: cat.categoryIndex,
      name: cat.name,
      shortLabel: cat.shortLabel,
      layer: cat.layer,
      color: cat.color,
      iconName: cat.iconName,
      version: '1.0.0',
      status: isInitiallyInstalled ? 'INSTALLED' : 'STANDBY',
      isInstalledAsTool: isInitiallyInstalled,
      installedAt: isInitiallyInstalled ? now : undefined,
      apiRoute,
      supportedMethods: ['GET', 'POST', 'PUT', 'STREAM', 'SUBSCRIBE'],
      authStrategy: cat.id === 'identity-auth' || cat.id === 'security-crypto' ? 'DID_ANCHOR' : 'BEARER_JWT',
      rateLimitPerSec: cat.systemImpact === 'CRITICAL' ? 5000 : 1500,
      hooks,
      constituentProtocols: cat.protocolNames,
      telemetry: {
        assignedServerId: defaultServer.id,
        assignedServerName: defaultServer.name,
        telemetryEndpoint: defaultServer.endpoint,
        samplingRateHz: 10,
        otlpExportEnabled: true,
        assignedAt: now,
        status: 'ACTIVE',
        metrics: {
          throughputPps: Math.floor(450 + Math.random() * 850),
          latencyMs: parseFloat((1.5 + Math.random() * 6.5).toFixed(2)),
          packetLossPct: parseFloat((Math.random() * 0.005).toFixed(4)),
          activeSockets: Math.floor(12 + Math.random() * 88),
          errorCount: 0,
          lastHeartbeat: new Date().toISOString()
        }
      },
      usageExample: {
        curl: `curl -X POST https://0.0.0.0:3000${apiRoute}/invoke \\\n  -H "Authorization: Bearer <IDENTITY_TOKEN>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"action": "DISPATCH", "protocol": "${cat.protocolIds?.[0] || cat.id}", "payload": {}}'`,
        typescript: `import { invokeProtocolPlugin } from '@/services/pluginRegistryManager';\n\nconst response = await invokeProtocolPlugin('${cat.id}', {\n  action: 'EXECUTE',\n  protocol: '${cat.protocolIds?.[0] || cat.id}',\n  parameters: { timeoutMs: 1500 }\n});\nconsole.log(response);`,
        python: `import requests\n\nurl = "https://0.0.0.0:3000${apiRoute}/invoke"\nheaders = {"Authorization": "Bearer <TOKEN>", "Content-Type": "application/json"}\npayload = {"action": "DISPATCH", "protocol": "${cat.protocolIds?.[0] || cat.id}"}\n\nres = requests.post(url, json=payload, headers=headers)\nprint(res.json())`
      }
    };
  });

  const n8nDomainGrabberPlugin: ProtocolPluginModule = {
    id: 'plugin-ext-n8n-url-domain-grabber',
    categoryId: 'data-packet-routing' as any,
    categoryIndex: 21,
    name: 'n8n URL & Domain Grabbing Automation Extension',
    shortLabel: 'n8n Domain Grabber',
    layer: 'Layer 7 (Application / Automation)',
    color: '#f97316',
    iconName: 'Globe',
    version: '2.4.0',
    status: 'INSTALLED' as const,
    isInstalledAsTool: true,
    installedAt: new Date().toISOString(),
    apiRoute: '/api/plugins/v1/n8n_url_domain_grabber',
    supportedMethods: ['GET', 'POST', 'STREAM'] as Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'STREAM'>,
    authStrategy: 'API_KEY' as const,
    rateLimitPerSec: 500,
    hooks: [
      {
        id: 'hook-n8n-grabber-01',
        name: 'RFC 3986 Regex Ingestion Sanitizer',
        triggerEvent: 'BEFORE_INGRESS',
        handlerName: 'sanitizeRawPayloadAndExtractUrls',
        description: 'Extracts valid URLs and FQDN strings from raw text/HTML feeds',
        isAsync: false,
        timeoutMs: 40
      },
      {
        id: 'hook-n8n-grabber-02',
        name: 'Punycode & Subdomain Normalizer',
        triggerEvent: 'ON_PACKET_INGEST',
        handlerName: 'normalizeAndDeduplicateDomains',
        description: 'Converts internationalized domain names and groups by root domain',
        isAsync: false,
        timeoutMs: 30
      },
      {
        id: 'hook-n8n-grabber-03',
        name: 'Asynchronous DNS Matrix Resolver',
        triggerEvent: 'ON_ROUTE_DISPATCH',
        handlerName: 'resolveDnsRecordMatrixAsync',
        description: 'Batches parallel A, AAAA, MX, NS, and TXT lookups across Anycast nodes',
        isAsync: true,
        timeoutMs: 250
      },
      {
        id: 'hook-n8n-grabber-04',
        name: 'n8n Webhook & Database Sink Dispatcher',
        triggerEvent: 'AFTER_EGRESS',
        handlerName: 'dispatchToN8nWorkflowAndSink',
        description: 'Streams enriched domain entities into n8n Webhook and PostgreSQL stores',
        isAsync: true,
        timeoutMs: 150
      }
    ],
    constituentProtocols: ['HTTP/3', 'DNS-over-HTTPS', 'TLS 1.3', 'n8n-Webhook-Protocol', 'RFC-3986'],
    telemetry: {
      assignedServerId: AVAILABLE_TELEMETRY_SERVERS[0].id,
      assignedServerName: AVAILABLE_TELEMETRY_SERVERS[0].name,
      telemetryEndpoint: AVAILABLE_TELEMETRY_SERVERS[0].endpoint,
      samplingRateHz: 50,
      otlpExportEnabled: true,
      assignedAt: new Date().toISOString(),
      status: 'ACTIVE' as const,
      metrics: {
        throughputPps: 840,
        latencyMs: 2.1,
        packetLossPct: 0.0001,
        activeSockets: 36,
        errorCount: 0,
        lastHeartbeat: new Date().toISOString()
      }
    },
    usageExample: {
      curl: `curl -X POST https://0.0.0.0:3000/api/plugins/v1/n8n_url_domain_grabber/extract \\\n  -H "Authorization: Bearer <API_KEY>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"rawText": "https://solana.com https://n8n.io", "resolveDns": true}'`,
      typescript: `import axios from 'axios';\n\nconst { data } = await axios.post('/api/plugins/v1/n8n_url_domain_grabber/extract', {\n  rawText: 'https://n8n.io https://ethereum.org',\n  resolveDns: true,\n  checkSsl: true\n});\nconsole.log(data.grabbedDomains);`,
      python: `import requests\n\nres = requests.post("https://0.0.0.0:3000/api/plugins/v1/n8n_url_domain_grabber/extract", json={\n    "rawText": "https://n8n.io https://solana.com",\n    "resolveDns": True\n})\nprint(res.json())`
    }
  };

  const keywordGeneratorSeoPlugin: ProtocolPluginModule = {
    id: 'plugin-ext-keyword-generator-seo',
    categoryId: 'data-packet-routing' as any,
    categoryIndex: 22,
    name: 'Keyword Generator & SEO Permutation Studio',
    shortLabel: 'SEO Permutation Engine',
    layer: 'Layer 7 (Application / SEO Analytics)',
    color: '#f59e0b',
    iconName: 'Sparkles',
    version: '3.2.0',
    status: 'INSTALLED' as const,
    isInstalledAsTool: true,
    installedAt: new Date().toISOString(),
    apiRoute: '/api/plugins/v1/keyword_generator_seo',
    supportedMethods: ['GET', 'POST', 'STREAM'] as Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'STREAM'>,
    authStrategy: 'API_KEY' as const,
    rateLimitPerSec: 1000,
    hooks: [
      {
        id: 'hook-seo-perm-01',
        name: 'Cartesian Matrix Multiplier',
        triggerEvent: 'BEFORE_INGRESS',
        handlerName: 'computeCartesianPermutations',
        description: 'Multiplies prefix, seed, suffix, and modifier array permutations',
        isAsync: false,
        timeoutMs: 20
      },
      {
        id: 'hook-seo-perm-02',
        name: 'Search Intent & Difficulty Scorer',
        triggerEvent: 'ON_PACKET_INGEST',
        handlerName: 'scoreKeywordIntentAndDifficulty',
        description: 'Classifies Informational, Commercial, and Transactional search intent',
        isAsync: false,
        timeoutMs: 15
      },
      {
        id: 'hook-seo-perm-03',
        name: 'Technical Lexicon Term Resolver',
        triggerEvent: 'ON_ROUTE_DISPATCH',
        handlerName: 'lookupLexiconSynonymsAndDefinitions',
        description: 'Enriches keywords with technical dictionary synonyms and etymology',
        isAsync: true,
        timeoutMs: 50
      },
      {
        id: 'hook-seo-perm-04',
        name: 'SERP Preview & Metadata Formatter',
        triggerEvent: 'AFTER_EGRESS',
        handlerName: 'renderSerpSnippetPixelBoundaries',
        description: 'Validates title tags and meta descriptions against pixel width limits',
        isAsync: false,
        timeoutMs: 10
      }
    ],
    constituentProtocols: ['RFC-3986', 'HTTP/3', 'JSON-LD', 'Schema.org', 'OpenGraph-v2'],
    telemetry: {
      assignedServerId: AVAILABLE_TELEMETRY_SERVERS[1]?.id || AVAILABLE_TELEMETRY_SERVERS[0].id,
      assignedServerName: AVAILABLE_TELEMETRY_SERVERS[1]?.name || AVAILABLE_TELEMETRY_SERVERS[0].name,
      telemetryEndpoint: AVAILABLE_TELEMETRY_SERVERS[1]?.endpoint || AVAILABLE_TELEMETRY_SERVERS[0].endpoint,
      samplingRateHz: 20,
      otlpExportEnabled: true,
      assignedAt: new Date().toISOString(),
      status: 'ACTIVE' as const,
      metrics: {
        throughputPps: 1250,
        latencyMs: 1.1,
        packetLossPct: 0.00001,
        activeSockets: 48,
        errorCount: 0,
        lastHeartbeat: new Date().toISOString()
      }
    },
    usageExample: {
      curl: `curl -X POST https://0.0.0.0:3000/api/plugins/v1/keyword_generator_seo/generate \\\n  -H "Authorization: Bearer <API_KEY>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"prefixes": ["best", "top"], "core": ["seo audit", "crypto wallet"], "suffixes": ["software", "tool"]}'`,
      typescript: `import axios from 'axios';\n\nconst { data } = await axios.post('/api/plugins/v1/keyword_generator_seo/generate', {\n  prefixes: ['best', 'free'],\n  core: ['n8n automation'],\n  suffixes: ['guide', 'template']\n});\nconsole.log(data.permutations);`,
      python: `import requests\n\nres = requests.post("https://0.0.0.0:3000/api/plugins/v1/keyword_generator_seo/generate", json={\n    "prefixes": ["top", "enterprise"],\n    "core": ["private server"],\n    "suffixes": ["hosting", "cloud"]\n})\nprint(res.json())`
    }
  };

  return [...basePlugins, n8nDomainGrabberPlugin, keywordGeneratorSeoPlugin];
}

class PluginRegistryManager {
  private plugins: ProtocolPluginModule[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window === 'undefined') {
      this.plugins = buildInitialPluginModules();
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          this.plugins = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored plugin registry, initializing defaults:', e);
    }

    this.plugins = buildInitialPluginModules();
    this.saveState();
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.plugins));
      } catch (e) {
        console.error('Failed to save plugin registry state:', e);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getPlugins(): ProtocolPluginModule[] {
    return [...this.plugins];
  }

  public getPluginById(idOrCategoryId: string): ProtocolPluginModule | undefined {
    return this.plugins.find(p => p.id === idOrCategoryId || p.categoryId === idOrCategoryId);
  }

  public installPlugin(categoryId: string): boolean {
    const plugin = this.plugins.find(p => p.categoryId === categoryId || p.id === categoryId);
    if (!plugin) return false;

    plugin.status = 'INSTALLED';
    plugin.isInstalledAsTool = true;
    plugin.installedAt = new Date().toISOString();
    plugin.telemetry.status = 'ACTIVE';
    plugin.telemetry.metrics.lastHeartbeat = new Date().toISOString();

    this.saveState();
    return true;
  }

  public uninstallPlugin(categoryId: string): boolean {
    const plugin = this.plugins.find(p => p.categoryId === categoryId || p.id === categoryId);
    if (!plugin) return false;

    plugin.status = 'STANDBY';
    plugin.isInstalledAsTool = false;
    plugin.installedAt = undefined;
    plugin.telemetry.status = 'IDLE';

    this.saveState();
    return true;
  }

  public installAllAsPluginApi(telemetryServerId?: string): { installedCount: number; assignedServer: string } {
    const now = new Date().toISOString();
    const targetServer = telemetryServerId 
      ? AVAILABLE_TELEMETRY_SERVERS.find(s => s.id === telemetryServerId) || AVAILABLE_TELEMETRY_SERVERS[0]
      : AVAILABLE_TELEMETRY_SERVERS[0];

    this.plugins.forEach((p, idx) => {
      p.status = 'INSTALLED';
      p.isInstalledAsTool = true;
      p.installedAt = p.installedAt || now;
      p.telemetry = {
        assignedServerId: targetServer.id,
        assignedServerName: targetServer.name,
        telemetryEndpoint: targetServer.endpoint,
        samplingRateHz: 20,
        otlpExportEnabled: true,
        assignedAt: now,
        status: 'ACTIVE',
        metrics: {
          throughputPps: Math.floor(600 + Math.random() * 900),
          latencyMs: parseFloat((1.2 + Math.random() * 4.5).toFixed(2)),
          packetLossPct: 0.0001,
          activeSockets: Math.floor(25 + Math.random() * 100),
          errorCount: 0,
          lastHeartbeat: now
        }
      };
    });

    this.saveState();
    return {
      installedCount: this.plugins.length,
      assignedServer: targetServer.name
    };
  }

  public assignTelemetryServer(
    targetCategoryIds: string[] | 'ALL',
    serverConfig: {
      serverId: string;
      samplingRateHz: number;
      otlpExportEnabled: boolean;
    }
  ): boolean {
    const srv = AVAILABLE_TELEMETRY_SERVERS.find(s => s.id === serverConfig.serverId) || AVAILABLE_TELEMETRY_SERVERS[0];
    const now = new Date().toISOString();

    const targets = targetCategoryIds === 'ALL'
      ? this.plugins
      : this.plugins.filter(p => targetCategoryIds.includes(p.categoryId) || targetCategoryIds.includes(p.id));

    targets.forEach(p => {
      p.telemetry = {
        assignedServerId: srv.id,
        assignedServerName: srv.name,
        telemetryEndpoint: srv.endpoint,
        samplingRateHz: serverConfig.samplingRateHz,
        otlpExportEnabled: serverConfig.otlpExportEnabled,
        assignedAt: now,
        status: 'ACTIVE',
        metrics: {
          throughputPps: Math.floor(400 + Math.random() * 800),
          latencyMs: parseFloat((1.1 + Math.random() * 4.0).toFixed(2)),
          packetLossPct: 0.0001,
          activeSockets: Math.floor(20 + Math.random() * 50),
          errorCount: 0,
          lastHeartbeat: now
        }
      };
    });

    this.saveState();
    return true;
  }

  public updatePluginHooks(categoryId: string, hooks: PluginHookDefinition[]): boolean {
    const plugin = this.plugins.find(p => p.categoryId === categoryId || p.id === categoryId);
    if (!plugin) return false;

    plugin.hooks = hooks;
    this.saveState();
    return true;
  }

  public async invokePlugin(
    categoryId: string,
    action: string,
    payload: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    traceId: string;
    latencyMs: number;
    executedHooks: Array<{ hookName: string; status: 'SUCCESS' | 'SKIPPED'; durationMs: number }>;
    telemetryEmitted: boolean;
    result: Record<string, any>;
  }> {
    const plugin = this.plugins.find(p => p.categoryId === categoryId || p.id === categoryId);
    if (!plugin) {
      throw new Error(`Protocol Plugin '${categoryId}' not registered.`);
    }

    const start = performance.now();
    const traceId = `trc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    
    // Simulate hook pipeline execution
    const executedHooks = plugin.hooks.map(h => ({
      hookName: h.name,
      status: 'SUCCESS' as const,
      durationMs: parseFloat((0.2 + Math.random() * 1.5).toFixed(2))
    }));

    // Update live metrics on invoke
    if (plugin.telemetry && plugin.telemetry.metrics) {
      plugin.telemetry.metrics.throughputPps += 1;
      plugin.telemetry.metrics.lastHeartbeat = new Date().toISOString();
    }

    const latencyMs = parseFloat((performance.now() - start + 2.5).toFixed(2));

    this.saveState();

    return {
      success: true,
      traceId,
      latencyMs,
      executedHooks,
      telemetryEmitted: plugin.telemetry.otlpExportEnabled,
      result: {
        pluginId: plugin.id,
        category: plugin.name,
        action,
        status: 'DISPATCHED_TO_VIRTUAL_MESH',
        telemetryNode: plugin.telemetry.assignedServerName,
        timestamp: new Date().toISOString(),
        payloadEcho: payload
      }
    };
  }

  public resetToDefaults() {
    this.plugins = buildInitialPluginModules();
    this.saveState();
  }
}

export const pluginRegistryManager = new PluginRegistryManager();
