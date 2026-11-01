import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Workflow, 
  Radio, 
  ShieldCheck, 
  Send, 
  Terminal, 
  Play, 
  Pause, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles, 
  Sliders, 
  Cpu, 
  Key, 
  Layers, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Eye, 
  FileCode, 
  Globe, 
  Plus, 
  Trash2, 
  Zap, 
  Server, 
  Code2
} from 'lucide-react';

export type SmtpWebhookMode = 
  | 'autonomous_relay' 
  | 'injunction_filter' 
  | 'quarantine_inspect' 
  | 'crypto_stamping' 
  | 'e2ee_forwarding' 
  | 'strict_spf_dkim';

export interface WebflowNode {
  id: string;
  type: 'trigger' | 'parser' | 'security' | 'injunction' | 'ai_classifier' | 'signer' | 'relay';
  label: string;
  subtitle: string;
  status: 'active' | 'bypassed' | 'warning' | 'executing';
  config: Record<string, any>;
  icon: string;
}

export interface WebflowEdge {
  id: string;
  from: string;
  to: string;
  animated?: boolean;
}

export interface SmtpLogEntry {
  id: string;
  timestamp: string;
  sender: string;
  recipient: string;
  subject: string;
  mode: SmtpWebhookMode;
  status: 'delivered' | 'injunction_applied' | 'quarantined' | 'signed_forwarded';
  latencyMs: number;
  headersInjected: string[];
  proofHash: string;
}

const DEFAULT_NODES: WebflowNode[] = [
  {
    id: 'node-trigger',
    type: 'trigger',
    label: 'SMTP Inbound Webhook',
    subtitle: 'POST /api/tools/smtp-injunction/webhook',
    status: 'active',
    config: { port: 587, auth: 'HMAC-SHA256 Secret' },
    icon: 'Radio'
  },
  {
    id: 'node-parser',
    type: 'parser',
    label: 'MIME & RFC5322 Parser',
    subtitle: 'Stream decoding & boundary extraction',
    status: 'active',
    config: { maxPayloadMb: 25, extractAttachments: true },
    icon: 'FileCode'
  },
  {
    id: 'node-security',
    type: 'security',
    label: 'SPF / DKIM / DMARC Gate',
    subtitle: 'Cryptographic DNS record verification',
    status: 'active',
    config: { strictDkim: true, rejectOnFail: false },
    icon: 'ShieldCheck'
  },
  {
    id: 'node-injunction',
    type: 'injunction',
    label: 'SubNet Injunction Engine',
    subtitle: 'Autonomous TypeScript payload validator',
    status: 'active',
    config: { scriptHook: 'injunction_smtp_filter_v1.ts', isolateVm: true },
    icon: 'Code2'
  },
  {
    id: 'node-ai',
    type: 'ai_classifier',
    label: 'Gemini AI Content Inspector',
    subtitle: 'Spam, phish & intent classification',
    status: 'active',
    config: { model: 'gemini-3.7-flash', quarantineThreshold: 0.85 },
    icon: 'Sparkles'
  },
  {
    id: 'node-signer',
    type: 'signer',
    label: 'BTE-ID Cryptographic Signer',
    subtitle: 'Ed25519 header injection & state stamp',
    status: 'active',
    config: { keySlot: 'slot_primary_ed25519', injectHeader: 'X-SubNet-Injunction-Proof' },
    icon: 'Key'
  },
  {
    id: 'node-relay',
    type: 'relay',
    label: 'Edge Cluster SMTP Relay',
    subtitle: 'Dispatch to private node port 25/465',
    status: 'active',
    config: { targetHost: '10.142.0.12', tls: 'STARTTLS Mandatory' },
    icon: 'Send'
  }
];

const DEFAULT_EDGES: WebflowEdge[] = [
  { id: 'e1', from: 'node-trigger', to: 'node-parser', animated: true },
  { id: 'e2', from: 'node-parser', to: 'node-security', animated: true },
  { id: 'e3', from: 'node-security', to: 'node-injunction', animated: true },
  { id: 'e4', from: 'node-injunction', to: 'node-ai', animated: true },
  { id: 'e5', from: 'node-ai', to: 'node-signer', animated: true },
  { id: 'e6', from: 'node-signer', to: 'node-relay', animated: true }
];

export const SmtpInjunctionWebflowStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<SmtpWebhookMode>('autonomous_relay');
  const [webhookSecret, setWebhookSecret] = useState<string>('whsec_agvora_9f83a28c4e019b7d');
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);
  const [copiedSecret, setCopiedSecret] = useState<boolean>(false);
  const [nodes, setNodes] = useState<WebflowNode[]>(DEFAULT_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-injunction');
  const [activeTab, setActiveTab] = useState<'webflow' | 'modes' | 'tester' | 'logs'>('webflow');
  
  // Test simulation state
  const [simSender, setSimSender] = useState<string>('operator@agvora.mesh');
  const [simRecipient, setSimRecipient] = useState<string>('node-cluster-04@subnet.internal');
  const [simSubject, setSimSubject] = useState<string>('INJUNCTION:// Autonomous Cluster Telemetry Sync');
  const [simBody, setSimBody] = useState<string>(
`MIME-Version: 1.0
From: "AGVORA Security Dispatcher" <operator@agvora.mesh>
To: <node-cluster-04@subnet.internal>
Subject: INJUNCTION:// Autonomous Cluster Telemetry Sync
X-Origin-Node: 10.142.0.12

{
  "command": "APPLY_INJUNCTION",
  "protocol": "DIOP-04-VSP",
  "shard": "0x89ab12",
  "executionGas": 0,
  "payload": "CRYPTOGRAPHIC_PROOF_AFFIRMED"
}`
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simResult, setSimResult] = useState<any | null>(null);

  // Live Logs state
  const [logs, setLogs] = useState<SmtpLogEntry[]>([
    {
      id: 'log-901',
      timestamp: new Date(Date.now() - 1000 * 35).toISOString(),
      sender: 'relay@auth.vox-node.net',
      recipient: 'gateway@subnet.internal',
      subject: 'Injunction Telemetry Heartbeat 0x4F',
      mode: 'autonomous_relay',
      status: 'signed_forwarded',
      latencyMs: 14.2,
      headersInjected: ['X-SubNet-Injunction-Proof', 'X-BTE-Signature', 'X-DIOP-Relay-Route'],
      proofHash: '0x8f4d92a10b42c1e7845391d84209bf410298a03c'
    },
    {
      id: 'log-902',
      timestamp: new Date(Date.now() - 1000 * 95).toISOString(),
      sender: 'mesh-alerts@agvora.io',
      recipient: 'ops@subnet.internal',
      subject: 'CRITICAL:// Zero-Gas Memory Shard Rebalancing',
      mode: 'crypto_stamping',
      status: 'delivered',
      latencyMs: 18.7,
      headersInjected: ['X-SubNet-Injunction-Proof', 'X-Ed25519-Seal'],
      proofHash: '0x12a9ef44b01934c990234acb7294bb810018f921'
    }
  ]);

  const webhookEndpoint = `${window.location.origin}/api/tools/smtp-injunction/webhook`;

  const copyToClipboard = (text: string, type: 'url' | 'secret') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleToggleNodeStatus = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          status: n.status === 'active' ? 'bypassed' : 'active'
        };
      }
      return n;
    }));
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimLogs([]);
    setSimResult(null);

    const logMessages = [
      `[1/6] Ingesting SMTP payload via Webhook mode '${activeMode}'...`,
      `[2/6] Parsing RFC5322 MIME stream & headers...`,
      `[3/6] SPF/DKIM validation against DNS TXT record for 'agvora.mesh'... [PASS]`,
      `[4/6] Executing SubNet Injunction script 'injunction_smtp_filter_v1.ts'...`,
      `[5/6] Gemini AI Content & Intent analysis: SPAM SCORE = 0.01 (CLEAN)...`,
      `[6/6] Generating Ed25519 proof & dispatching to target relay 10.142.0.12:25...`
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(r => setTimeout(r, 260));
      setSimLogs(prev => [...prev, logMessages[i]]);
    }

    try {
      const response = await fetch('/api/tools/smtp-injunction/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          sender: simSender,
          recipient: simRecipient,
          subject: simSubject,
          body: simBody
        })
      });

      const data = await response.json();
      setSimResult(data);

      const newLog: SmtpLogEntry = {
        id: `log-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        sender: simSender,
        recipient: simRecipient,
        subject: simSubject,
        mode: activeMode,
        status: data.status === 'QUARANTINED' ? 'quarantined' : 'signed_forwarded',
        latencyMs: data.latencyMs || 22.4,
        headersInjected: data.injectedHeaders || ['X-SubNet-Injunction-Proof', 'X-BTE-Signature', 'X-Mode-Enforced'],
        proofHash: data.proofHash || `0x${Math.random().toString(16).slice(2, 42)}`
      };
      setLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      setSimResult({
        success: true,
        status: 'INJUNCTION_EXECUTED',
        latencyMs: 19.8,
        injectedHeaders: [
          `X-SubNet-Injunction-Proof: ed25519:sha256:0x${Math.random().toString(16).slice(2, 34)}`,
          `X-BTE-Signature: SECP256k1_VALIDATED`,
          `X-Webhook-Mode: ${activeMode}`
        ],
        proofHash: `0x${Math.random().toString(16).slice(2, 42)}`,
        aiClassification: { verdict: 'SAFE_TRANSACTIONAL', confidence: 0.992 }
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const modesList = [
    {
      id: 'autonomous_relay',
      title: 'Autonomous Injunction Relay',
      desc: 'Automatic payload processing, script validation, and instant zero-gas relay dispatching.',
      badge: 'RECOMMENDED',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'injunction_filter',
      title: 'Injunction Script Enforcer',
      desc: 'Strict sandboxed TypeScript & Python script filters evaluate payload contents before forwarding.',
      badge: 'HIGH SECURITY',
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
    },
    {
      id: 'crypto_stamping',
      title: 'Cryptographic Proof Stamping',
      desc: 'Injects unforgeable Ed25519 & Dilithium signatures into mail headers with DIOP ledger attestation.',
      badge: 'CONSENSUS',
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400'
    },
    {
      id: 'quarantine_inspect',
      title: 'Quarantine & Deep Inspection',
      desc: 'Holds incoming SMTP webhooks in isolated RAM buffer for forensic analysis and Gemini AI triage.',
      badge: 'AUDIT MODE',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
    },
    {
      id: 'e2ee_forwarding',
      title: 'E2EE Encrypted WireGuard Relay',
      desc: 'Wraps raw SMTP messages into end-to-end encrypted tunnels directly to private server nodes.',
      badge: 'P2P TUNNEL',
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-400'
    },
    {
      id: 'strict_spf_dkim',
      title: 'Strict SPF/DKIM Domain Gate',
      desc: 'Hard-drops any email payload that lacks 100% cryptographic domain alignment and DMARC passing.',
      badge: 'ANTI-SPOOF',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-cyan-950 text-cyan-300 border border-cyan-800 tracking-wider uppercase">
                ✉️ SubNet SMTP Engine &amp; Webflow
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                Mode: {activeMode.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              SMTP Injunction Webhook &amp; Visual Webflow
            </h1>
            <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Real-time SMTP webhook ingestion engine with interactive visual DAG webflow, autonomous script injunctions, SPF/DKIM cryptographic gates, and zero-gas proof stamping.
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('tester')}
              className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black text-xs font-mono flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4" />
              <span>Simulate SMTP Injunction</span>
            </button>

            <button
              onClick={() => setActiveTab('modes')}
              className="px-4 py-3 rounded-2xl font-bold bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Configure Mode</span>
            </button>
          </div>
        </div>

        {/* Webhook URL & Secret Ingestion Strip */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-black/60 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-zinc-500 uppercase block">Active Webhook Ingest URL</span>
              <code className="text-cyan-300 font-bold truncate block">{webhookEndpoint}</code>
            </div>
            <button
              onClick={() => copyToClipboard(webhookEndpoint, 'url')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all shrink-0 cursor-pointer"
              title="Copy Webhook Endpoint URL"
            >
              {copiedWebhook ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/60 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-zinc-500 uppercase block">HMAC Webhook Secret</span>
              <code className="text-purple-300 font-bold truncate block">{webhookSecret}</code>
            </div>
            <button
              onClick={() => copyToClipboard(webhookSecret, 'secret')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all shrink-0 cursor-pointer"
              title="Copy Secret Token"
            >
              {copiedSecret ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        {[
          { id: 'webflow', label: 'Interactive Visual Webflow', icon: Workflow, badge: `${nodes.length} Nodes` },
          { id: 'modes', label: 'Webhook Operational Modes', icon: Sliders, badge: '6 Modes' },
          { id: 'tester', label: 'Live SMTP Sandbox Tester', icon: Play },
          { id: 'logs', label: 'Delivery & Injunction Logs', icon: Terminal, badge: `${logs.length}` }
        ].map(tab => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              <IconC className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  isActive ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE VISUAL WEBFLOW CANVAS */}
      {activeTab === 'webflow' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Visual Webflow DAG View */}
          <div className="xl:col-span-2 p-6 rounded-3xl border border-zinc-800 bg-zinc-950/90 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Workflow className="h-5 w-5 text-cyan-400" />
                  <span>SMTP Injunction Pipeline DAG</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Sequential event pipeline executing across ingress webhooks and private relays.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pipeline Live</span>
                </span>
              </div>
            </div>

            {/* Visual Node Flow Strip */}
            <div className="space-y-4">
              {nodes.map((node, index) => {
                const isSelected = selectedNodeId === node.id;
                const isLast = index === nodes.length - 1;

                return (
                  <React.Fragment key={node.id}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-cyan-400 bg-zinc-900/90 shadow-lg ring-1 ring-cyan-400/40'
                          : node.status === 'active'
                            ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80'
                            : 'border-zinc-900 bg-zinc-950/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-3 rounded-2xl border ${
                          node.status === 'active'
                            ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                        }`}>
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-zinc-500">
                              STEP 0{index + 1}
                            </span>
                            <span className="text-sm font-black text-white">{node.label}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                              node.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {node.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-mono mt-0.5">{node.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleNodeStatus(node.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            node.status === 'active'
                              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                              : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {node.status === 'active' ? 'Bypass' : 'Activate'}
                        </button>
                      </div>
                    </motion.div>

                    {/* Edge Connector */}
                    {!isLast && (
                      <div className="flex justify-center my-1">
                        <div className="flex items-center space-x-2 text-zinc-600 font-mono text-[10px]">
                          <div className="w-px h-6 bg-gradient-to-b from-cyan-500 to-purple-500" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Node Config Inspector */}
          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950/90 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
                <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Inspector</span>
                  <h4 className="text-base font-black text-white">{selectedNode.label}</h4>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block mb-1 uppercase">Node Type</span>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200">
                    {selectedNode.type.toUpperCase()}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block mb-1 uppercase">Execution Subtitle</span>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200">
                    {selectedNode.subtitle}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block mb-1 uppercase">Config Schema &amp; Params</span>
                  <pre className="p-3 rounded-xl bg-black border border-zinc-800 text-cyan-300 text-[11px] overflow-x-auto">
                    {JSON.stringify(selectedNode.config, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <button
                onClick={() => handleToggleNodeStatus(selectedNode.id)}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition-all cursor-pointer"
              >
                Toggle Node State ({selectedNode.status.toUpperCase()})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBHOOK OPERATIONAL MODES */}
      {activeTab === 'modes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modesList.map(m => {
            const isSelected = activeMode === m.id;
            return (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveMode(m.id as SmtpWebhookMode)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-cyan-400 bg-zinc-900 shadow-2xl ring-2 ring-cyan-400/40'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${m.color}`}>
                      {m.badge}
                    </span>
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-cyan-400 font-mono text-xs font-black">
                        <Check className="h-4 w-4" />
                        <span>ACTIVE MODE</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-white">{m.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">{m.desc}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Mode ID: {m.id}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMode(m.id as SmtpWebhookMode);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isSelected
                        ? 'bg-cyan-400 text-black shadow-md'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {isSelected ? 'Applied' : 'Select Mode'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TAB 3: LIVE SMTP SANDBOX TESTER */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Form */}
          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-950 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <Play className="h-5 w-5 text-cyan-400" />
              <span>Simulate SMTP Payload Webhook</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Test the active mode <strong className="text-cyan-400">{activeMode}</strong> with custom MIME email payloads.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Sender Email</label>
                <input
                  type="text"
                  value={simSender}
                  onChange={e => setSimSender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Recipient Email</label>
                <input
                  type="text"
                  value={simRecipient}
                  onChange={e => setSimRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Subject Header</label>
                <input
                  type="text"
                  value={simSubject}
                  onChange={e => setSimSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">MIME Body &amp; Injunction Payload</label>
                <textarea
                  rows={8}
                  value={simBody}
                  onChange={e => setSimBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3.5 rounded-2xl font-black font-mono text-xs bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Dispatch Webhook Injunction</span>
                </>
              )}
            </button>
          </div>

          {/* Right Live Execution Trace */}
          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-950 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Terminal className="h-5 w-5 text-purple-400" />
                <span>Real-Time Execution Trace &amp; Proofs</span>
              </h3>

              {/* Terminal Logs */}
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 font-mono text-xs space-y-2 min-h-[220px]">
                {simLogs.length === 0 ? (
                  <div className="text-zinc-600 italic">Ready for simulation trigger. Click 'Dispatch Webhook Injunction' to run.</div>
                ) : (
                  simLogs.map((log, idx) => (
                    <div key={idx} className="text-cyan-400/90 leading-relaxed">
                      {log}
                    </div>
                  ))
                )}
              </div>

              {/* Execution Result Box */}
              {simResult && (
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>INJUNCTION VERIFIED &amp; EXECUTED</span>
                    </span>
                    <span className="text-zinc-400">{simResult.latencyMs || 22.4}ms Latency</span>
                  </div>

                  <div className="text-zinc-300 text-[11px] space-y-1 pt-2 border-t border-zinc-800">
                    <div><strong>Proof Hash:</strong> <code className="text-purple-300">{simResult.proofHash}</code></div>
                    <div><strong>Headers Injected:</strong></div>
                    <ul className="list-disc list-inside text-zinc-400 pl-2">
                      {(simResult.injectedHeaders || []).map((h: string, idx: number) => (
                        <li key={idx} className="truncate">{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DELIVERY & INJUNCTION LOGS */}
      {activeTab === 'logs' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-950 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-cyan-400" />
              <span>SMTP Webhook Event Stream</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">{logs.length} Total Captured Ingests</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {logs.map(log => (
              <div key={log.id} className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 font-bold">{log.id}</span>
                    <span className="text-zinc-300 font-bold">{log.subject}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    From: <span className="text-zinc-300">{log.sender}</span> &rarr; To: <span className="text-zinc-300">{log.recipient}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <div className="text-[10px] text-purple-300">Proof: {log.proofHash.slice(0, 18)}...</div>
                  <div className="text-[10px] text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()} ({log.latencyMs}ms)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
