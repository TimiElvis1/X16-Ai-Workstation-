import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Copy,
  Check,
  Zap,
  Globe,
  Terminal,
  Layers,
  FileCode,
  Send,
  Radio,
  Play,
  CheckCircle2
} from 'lucide-react';
import { VIPClient } from '../../services/vipSdk';

export const VipSdkStudio: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'TypeScript' | 'Python' | 'cURL'>('TypeScript');
  const [selectedTopic, setSelectedTopic] = useState<'resolve' | 'packet' | 'traceroute' | 'service'>('packet');
  const [copiedCode, setCopiedCode] = useState(false);

  // Live API tester
  const [liveEndpoint, setLiveEndpoint] = useState('/api/vip/overview');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiBody, setApiBody] = useState('');
  const [apiResult, setApiResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const snippets: Record<string, Record<string, string>> = {
    TypeScript: {
      resolve: `import { VIPClient } from '@agvora/vip-sdk';

const client = new VIPClient({
  endpoint: 'https://vip.agvora.io',
  identityPrivateKey: process.env.VIP_PRIVATE_KEY
});

// Resolve full 8-layer virtual stack for a sovereign vnet URI
const resolution = await client.resolve('vnet://neural.edge/inference');
console.log('Resolved Physical IP:', resolution.resolvedPhysicalIp);
console.log('Target Server DID:', resolution.resolutionPipeline.layer6_server.serverId);
console.log('Total Resolution Time:', resolution.totalResolutionTimeMs, 'ms');`,
      packet: `import { VIPClient } from '@agvora/vip-sdk';

const client = new VIPClient({ endpoint: 'https://vip.agvora.io' });

// Construct, sign (Ed25519) and dispatch an encrypted VirtualPacket over QUIC
const receipt = await client.sendPacket({
  destinationUri: 'vnet://neural.edge/inference',
  payload: {
    prompt: 'Synthesize decentralized LLM weights',
    maxTokens: 512
  },
  transport: 'QUIC',
  encrypt: true,
  priority: 'HIGH'
});

console.log('Packet Dispatched! Receipt ID:', receipt.receiptId);
console.log('Latency RTT:', receipt.latencyMs, 'ms');`,
      traceroute: `import { VIPClient } from '@agvora/vip-sdk';

const client = new VIPClient();

// Run sovereign overlay traceroute
const trace = await client.traceroute(
  'vnet://mesh-primary/sub-eu-central/vnode-fra-01/client',
  'vnet://neural.edge/inference'
);

console.log(\`Traceroute completed in \${trace.totalHops} hops (\${trace.avgRttMs}ms avg):\`);
trace.hops.forEach(h => console.log(\`  Hop #\${h.hopIndex}: \${h.nodeName} (\${h.ipAddress}) - \${h.rttMs}ms\`));`,
      service: `import { VIPClient } from '@agvora/vip-sdk';

const client = new VIPClient();

// Discover and invoke an RPC method on a sovereign virtual service
const response = await client.rpcCall(
  'vnet://neural.edge/inference',
  'predict',
  { model: 'Gemini-VIP-Edge', temperature: 0.2 }
);

console.log('RPC Output:', response.result);`
    },
    Python: {
      resolve: `from vip_sdk import VIPClient

client = VIPClient(endpoint="https://vip.agvora.io")

# Resolve sovereign 8-layer stack
res = client.resolve("vnet://neural.edge/inference")
print(f"Physical IP: {res.resolved_physical_ip}")
print(f"Cryptographic Proof: {res.cryptographic_proof}")`,
      packet: `from vip_sdk import VIPClient

client = VIPClient(endpoint="https://vip.agvora.io")

# Send encrypted VirtualPacket over QUIC/UDP
receipt = client.send_packet(
    destination_uri="vnet://neural.edge/inference",
    payload={"query": "Run sovereign tensor job"},
    transport="QUIC",
    encrypt=True
)
print(f"Receipt ID: {receipt.receipt_id} (RTT: {receipt.latency_ms}ms)")`,
      traceroute: `from vip_sdk import VIPClient

client = VIPClient()
trace = client.traceroute("vnet://mesh-primary/client", "vnet://neural.edge/inference")
for hop in trace.hops:
    print(f"Hop #{hop.hop_index}: {hop.node_name} - {hop.rtt_ms}ms")`,
      service: `from vip_sdk import VIPClient

client = VIPClient()
response = client.rpc_call("vnet://neural.edge/inference", "predict", {"tokens": 100})
print("Result:", response)`
    },
    cURL: {
      resolve: `curl -X POST https://vip.agvora.io/api/vip/resolve \\
  -H "Content-Type: application/json" \\
  -d '{"uri": "vnet://neural.edge/inference"}'`,
      packet: `curl -X POST https://vip.agvora.io/api/vip/packet/dispatch \\
  -H "Content-Type: application/json" \\
  -d '{
    "sourceUri": "vnet://mesh-primary/client",
    "destinationUri": "vnet://neural.edge/inference",
    "payload": {"query": "Sovereign inference"},
    "transport": "QUIC",
    "encrypt": true
  }'`,
      traceroute: `curl -X POST https://vip.agvora.io/api/vip/traceroute \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "vnet://mesh-primary/sub-eu-central/vnode-fra-01/client",
    "destination": "vnet://neural.edge/inference"
  }'`,
      service: `curl -X POST https://vip.agvora.io/api/vip/services/invoke \\
  -H "Content-Type: application/json" \\
  -d '{
    "serviceUri": "vnet://neural.edge/inference",
    "method": "predict",
    "params": {"model": "Gemini-VIP-Edge"}
  }'`
    }
  };

  const copyCode = () => {
    const code = snippets[selectedLanguage][selectedTopic];
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExecuteLiveApi = async () => {
    setIsExecuting(true);
    try {
      let res;
      if (apiMethod === 'GET') {
        res = await fetch(liveEndpoint);
      } else {
        res = await fetch(liveEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: apiBody || '{}'
        });
      }
      const data = await res.json();
      setApiResult(data);
    } catch (err: any) {
      setApiResult({ error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            Developer SDK & REST/WebSocket APIs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Client libraries, wire specifications, and REST endpoints for embedding the Virtual Internet Protocol overlay into any Node.js, Python, or edge runtime.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
          {(['TypeScript', 'Python', 'cURL'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                selectedLanguage === lang
                  ? 'bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800/60'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code Snippet Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topic Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono text-zinc-400 uppercase mb-1">SDK Capabilities</div>
          {[
            { id: 'packet', name: 'Sign & Dispatch VirtualPacket', desc: 'Ed25519 signing + ChaCha20 encryption' },
            { id: 'resolve', name: '8-Layer "vnet://" Stack Resolver', desc: 'Deterministic DID & transport binding' },
            { id: 'traceroute', name: 'Overlay Dijkstra Traceroute', desc: 'Pathfinding & hop latency probe' },
            { id: 'service', name: 'Microservice RPC Invocation', desc: 'Remote execution over overlay mesh' }
          ].map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id as any)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                selectedTopic === topic.id
                  ? 'border-indigo-500 bg-indigo-950/20 text-indigo-200 shadow-md'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <div className="font-semibold text-xs text-zinc-200">{topic.name}</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{topic.desc}</div>
            </button>
          ))}
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono text-indigo-400 font-bold">
                {selectedLanguage} · {selectedTopic.toUpperCase()}
              </span>
              <button
                onClick={copyCode}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Code</span>
              </button>
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre className="whitespace-pre">{snippets[selectedLanguage][selectedTopic]}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive REST API Live Console */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 shadow-lg">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Interactive REST API Test Console
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <select
            value={apiMethod}
            onChange={(e) => setApiMethod(e.target.value as any)}
            className="sm:col-span-2 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>

          <select
            value={liveEndpoint}
            onChange={(e) => {
              setLiveEndpoint(e.target.value);
              if (e.target.value.includes('resolve')) {
                setApiMethod('POST');
                setApiBody('{\n  "uri": "vnet://neural.edge/inference"\n}');
              } else if (e.target.value.includes('traceroute')) {
                setApiMethod('POST');
                setApiBody('{\n  "source": "vnet://mesh-primary/sub-eu-central/vnode-fra-01/client",\n  "destination": "vnet://neural.edge/inference"\n}');
              } else if (e.target.value.includes('packet')) {
                setApiMethod('POST');
                setApiBody('{\n  "sourceUri": "vnet://mesh-primary/client",\n  "destinationUri": "vnet://neural.edge/inference",\n  "payload": {"status": "ok"},\n  "transport": "QUIC",\n  "encrypt": true\n}');
              } else {
                setApiMethod('GET');
                setApiBody('');
              }
            }}
            className="sm:col-span-8 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="/api/vip/overview">GET /api/vip/overview (Telemetry, Networks, Nodes, Domains)</option>
            <option value="/api/vip/protocols">GET /api/vip/protocols (20 VSP & NIP Specifications)</option>
            <option value="/api/vip/resolve">POST /api/vip/resolve (8-Layer Stack Address Resolver)</option>
            <option value="/api/vip/traceroute">POST /api/vip/traceroute (Dijkstra Shortest Path Probe)</option>
            <option value="/api/vip/packet/dispatch">POST /api/vip/packet/dispatch (Sign & Send VirtualPacket)</option>
          </select>

          <button
            onClick={handleExecuteLiveApi}
            disabled={isExecuting}
            className="sm:col-span-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Send Request</span>
          </button>
        </div>

        {apiMethod === 'POST' && (
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Request Body (JSON)</label>
            <textarea
              rows={3}
              value={apiBody}
              onChange={(e) => setApiBody(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        {/* Live Response Box */}
        {apiResult && (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                HTTP 200 OK
              </span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg max-h-[240px] overflow-y-auto font-mono text-xs text-zinc-300">
              <pre className="whitespace-pre-wrap">{JSON.stringify(apiResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
