import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  Send,
  Terminal,
  Cpu,
  Zap,
  Code2,
  Server,
  Shield,
  Layers,
  Activity,
  Play,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Download,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings2,
  Sliders,
  Database,
  Globe,
  Radio,
  KeyRound,
  FileCode,
  Workflow,
  Search,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  ShieldAlert,
  ArrowRight,
  CornerDownLeft,
  Flame,
  Bookmark,
  Share2
} from 'lucide-react';
import { PrivateServer, CodeInjunction, NetworkNode } from '../types';
import { AIToolItem } from '../types/aiToolsDirectory';
import { SCRAPED_AI_TOP_TOOLS_CATALOG } from '../data/scrapedAiTopToolsCatalog';

export interface AIAssistantBotStudioProps {
  servers?: PrivateServer[];
  injunctions?: CodeInjunction[];
  networkNodes?: NetworkNode[];
  onNavigateTab?: (tab: string) => void;
  onCreateServer?: (data: Partial<PrivateServer>) => void;
  onCreateInjunction?: (data: Partial<CodeInjunction>) => void;
  onExecuteInjunction?: (id: string, params: Record<string, any>) => Promise<any>;
}

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens?: number;
  modelUsed?: string;
  suggestedAction?: {
    type: 'NAVIGATE' | 'CREATE_SERVER' | 'DISPATCH_INJUNCTION' | 'RUN_DIAGNOSTIC' | 'COPY_CODE';
    label: string;
    payload: any;
  };
  toolCalls?: Array<{
    name: string;
    args: Record<string, any>;
    status: 'COMPLETED' | 'EXECUTING' | 'PENDING';
    resultSnippet?: string;
  }>;
}

type AgentPersonaId = 'cyber_security' | 'network_architect' | 'injunction_engineer' | 'seo_growth' | 'fullstack_builder';
type AIModelId = 'gemini-2.5-flash' | 'gemini-1.5-pro' | 'deepseek-r1' | 'claude-3.7-sonnet' | 'local-wasm-llm';

interface AgentPersona {
  id: AgentPersonaId;
  name: string;
  title: string;
  icon: any;
  color: string;
  accentBg: string;
  systemPrompt: string;
  suggestedPrompts: string[];
}

const AGENT_PERSONAS: AgentPersona[] = [
  {
    id: 'cyber_security',
    name: 'Aegis Security Sentinel',
    title: 'Zero-Knowledge & Cryptographic Auditor',
    icon: Shield,
    color: 'text-rose-400',
    accentBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    systemPrompt: 'You are Aegis Sentinel, an expert in cryptographic zero-knowledge proofs, DID attestation, SSL/TLS handshake security, and out-of-band penetration testing across distributed sovereign networks.',
    suggestedPrompts: [
      'Audit the cryptographic integrity of our active node addresses and check for checksum parity.',
      'How do I configure an out-of-band DNS callback listener for zero-day payload detection?',
      'Generate a zero-knowledge Merkle leaf verification script in TypeScript.'
    ]
  },
  {
    id: 'network_architect',
    name: 'VIP & DIOP Mesh Architect',
    title: 'Decentralized Internet & 8-Layer Router',
    icon: Globe,
    color: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    systemPrompt: 'You are the VIP/DIOP Core Mesh Architect specializing in vnet:// 8-layer addressing, non-custodial domain routing, VirtualPacket encapsulation, and QUIC/UDP multiplexing.',
    suggestedPrompts: [
      'Trace a VirtualPacket routing path from 10.142.0.12 to vnet://sovereign.mesh:9100.',
      'Explain how the 17 DIOP Virtual Server Protocols (VSP suite) interact with NIP Network Protocols.',
      'Simulate an asynchronous DNSSEC resolver query with cryptographic signature verification.'
    ]
  },
  {
    id: 'injunction_engineer',
    name: 'Code Injunction Commander',
    title: 'High-Throughput Dispatcher & Node Runner',
    icon: Code2,
    color: 'text-amber-400',
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    systemPrompt: 'You are the Code Injunction Commander. You generate, compile, and trigger sovereign TypeScript and Python code injections with deterministic execution logs and state synchronization.',
    suggestedPrompts: [
      'Generate a TypeScript injunction to batch-mint 50,000 $DPO token rewards to active network nodes.',
      'Create an automated SMTP email relay pipeline with DKIM signing and zero-gas rate limiting.',
      'Write an n8n webhook injector that listens for telemetry alerts and triggers an auto-repair sequence.'
    ]
  },
  {
    id: 'seo_growth',
    name: 'SEO & Permutation Strategist',
    title: 'Cartesian Matrix & Technical Lexicon Expert',
    icon: Sparkles,
    color: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    systemPrompt: 'You are the SEO Matrix Growth Strategist. You specialize in Cartesian keyword permutations, SERP CTR optimization, LSI query generation, and technical schema markup.',
    suggestedPrompts: [
      'Generate 20 high-intent transactional keyword permutations for our Web3 crypto wallet launch.',
      'How should I structure JSON-LD metadata for software application rich snippets on Google SERPs?',
      'Extract LSI question queries from the seed keywords "n8n automation" and "private server hosting".'
    ]
  },
  {
    id: 'fullstack_builder',
    name: 'Nexus Full-Stack Synthesizer',
    title: 'React 19, Tailwind & Container Engineer',
    icon: Zap,
    color: 'text-purple-400',
    accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    systemPrompt: 'You are Nexus Synthesizer, an elite full-stack engineer producing modular, clean, and performant React, TypeScript, and Docker container code architectures.',
    suggestedPrompts: [
      'Write an interactive React component that visualizes real-time CPU and RAM telemetry gauges.',
      'Generate a Docker Compose configuration for an isolated Nginx reverse proxy with Redis caching.',
      'Design a responsive Tailwind CSS card matrix with dark mode glowing borders.'
    ]
  }
];

export const AIAssistantBotStudio: React.FC<AIAssistantBotStudioProps> = ({
  servers = [],
  injunctions = [],
  networkNodes = [],
  onNavigateTab,
  onCreateServer,
  onCreateInjunction,
  onExecuteInjunction
}) => {
  // Active Model & Persona
  const [selectedPersonaId, setSelectedPersonaId] = useState<AgentPersonaId>('injunction_engineer');
  const [selectedModel, setSelectedModel] = useState<AIModelId>('gemini-2.5-flash');
  
  // Model Hyperparameters
  const [temperature, setTemperature] = useState<number>(0.7);
  const [streamResponse, setStreamResponse] = useState<boolean>(true);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isSpeechAudioEnabled, setIsSpeechAudioEnabled] = useState<boolean>(false);
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);

  // Active AI Tools state from aitoptools.com
  const [activeAiTools, setActiveAiTools] = useState<AIToolItem[]>(() => {
    const saved = localStorage.getItem('agvora_active_ai_tools');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return SCRAPED_AI_TOP_TOOLS_CATALOG.filter(tool => {
          const matched = parsed.find((p: any) => p.id === tool.id);
          return matched ? matched.isToggledForAI : tool.isToggledForAI;
        });
      } catch (e) {
        console.warn(e);
      }
    }
    return SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.isToggledForAI);
  });

  // Chat State
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Initial Seed Messages
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-welcome-01',
      sender: 'assistant',
      content: `Greetings! I am the **AGVORA Sovereign AI Assistant & Network Orchestrator**.\n\nI have real-time introspection into **${servers.length} container servers**, **${injunctions.length} code injunctions**, and **${networkNodes.length} active mesh nodes**.\n\nYou can ask me to:\n- 🚀 **Dispatch or synthesize code injunctions** (e.g. $DPO tokens, SMTP relays)\n- 🛡️ **Audit node security, cryptographic keys, and DID signatures**\n- 🌐 **Resolve VIP vnet:// routing paths and DIOP protocols**\n- 📊 **Generate multi-list SEO keyword permutation matrices**\n- ⚡ **Deploy and orchestrate new microservice container nodes**\n\nHow can I assist your operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens: 142,
      modelUsed: 'gemini-2.5-flash'
    }
  ]);

  const activePersona = useMemo(() => {
    return AGENT_PERSONAS.find(p => p.id === selectedPersonaId) || AGENT_PERSONAS[0];
  }, [selectedPersonaId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Copy message text helper
  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1800);
  };

  // Clear conversation
  const handleClearHistory = () => {
    if (window.confirm('Clear current assistant conversation history?')) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: `Conversation reset. Switched context to **${activePersona.name}**.\n\nReady for new instructions.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tokens: 28,
          modelUsed: selectedModel
        }
      ]);
    }
  };

  // Export conversation transcript
  const handleExportTranscript = () => {
    const transcript = messages
      .map(m => `[${m.timestamp}] ${m.sender.toUpperCase()} (${m.modelUsed || 'system'}):\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_assistant_transcript_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Execute interactive suggestion action from AI
  const handleExecuteSuggestedAction = async (action: AssistantMessage['suggestedAction']) => {
    if (!action) return;

    if (action.type === 'NAVIGATE' && onNavigateTab) {
      onNavigateTab(action.payload.tab);
      setActionSuccessNotice(`Navigated to ${action.payload.tab} tab.`);
    } else if (action.type === 'CREATE_SERVER' && onCreateServer) {
      onCreateServer(action.payload);
      setActionSuccessNotice(`Provisioned private server node "${action.payload.name}".`);
    } else if (action.type === 'DISPATCH_INJUNCTION' && onExecuteInjunction) {
      try {
        await onExecuteInjunction(action.payload.injunctionId || 'inj-00-depo', action.payload.params || {});
        setActionSuccessNotice(`Successfully triggered code injunction: ${action.payload.name || 'System Dispatch'}.`);
      } catch (err: any) {
        setActionSuccessNotice(`Injunction executed locally: ${err.message || 'Complete'}.`);
      }
    } else if (action.type === 'COPY_CODE') {
      navigator.clipboard.writeText(action.payload.code);
      setActionSuccessNotice('Code snippet copied to clipboard.');
    }

    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  // Handle Form Submit & AI Response Generation
  const handleSendMessage = async (promptOverride?: string) => {
    const query = (promptOverride || inputQuery).trim();
    if (!query || isGenerating) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const userMsg: AssistantMessage = {
      id: userMessageId,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens: Math.ceil(query.length / 4)
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    // Simulate AI Thought & Dynamic Response Construction based on query context
    setTimeout(async () => {
      const lower = query.toLowerCase();
      let responseText = '';
      let suggestedAction: AssistantMessage['suggestedAction'] | undefined;
      let toolCalls: AssistantMessage['toolCalls'] | undefined;

      if (lower.includes('depo') || lower.includes('mint') || lower.includes('token') || lower.includes('farming')) {
        responseText = `### 🪙 $DPO Token & Staking Injunction Protocol\n\nI have generated an optimized execution script for the **$DPO (DEPO)** automated reward pipeline.\n\n\`\`\`typescript\nimport { dispatchInjunction } from '@/services/vipEngine';\n\nexport async function executeDepoRewardBatch() {\n  const payload = {\n    coinSymbol: '$DPO',\n    batchAmount: 50000,\n    targetSubnet: 'vox-subnet-us-east',\n    multiplier: 1.45,\n    timestamp: new Date().toISOString()\n  };\n  \n  return await dispatchInjunction('inj-00-depo', payload);\n}\n\`\`\`\n\nWould you like me to trigger this injunction directly onto the active node mesh?`;
        suggestedAction = {
          type: 'DISPATCH_INJUNCTION',
          label: '⚡ Dispatch 50,000 $DPO Injunction Now',
          payload: {
            injunctionId: 'inj-00-depo',
            name: 'DEPO Reward Batch',
            params: { coinSymbol: '$DPO', amount: 50000 }
          }
        };
        toolCalls = [
          {
            name: 'inspectInjunctionRegistry',
            args: { id: 'inj-00-depo', node: '10.142.0.12' },
            status: 'COMPLETED',
            resultSnippet: 'Injunction verified • 64 executions recorded • Status: ONLINE'
          }
        ];
      } else if (lower.includes('server') || lower.includes('docker') || lower.includes('deploy') || lower.includes('node')) {
        const ip = `10.142.0.${Math.floor(50 + Math.random() * 150)}`;
        responseText = `### 🚀 Private Server Node Blueprint\n\nI have generated a specification for a high-availability **Gateway Proxy & Telemetry Node**:\n\n- **Node Name**: \`VOX-EDGE-AUTO-NODE-${Math.floor(10 + Math.random() * 90)}\`\n- **Virtual IP**: \`${ip}:8080\`\n- **Subnet Binding**: \`vox-subnet-us-east\`\n- **Docker Container**: \`nginx:alpine-slim\`\n- **Assigned Services**: WireGuard SSL VPN, Prometheus Exporter, OTLP Streamer\n\nClick the button below to provision this container immediately into your server mesh.`;
        suggestedAction = {
          type: 'CREATE_SERVER',
          label: `🚀 Deploy Node to Mesh (${ip})`,
          payload: {
            name: `VOX-EDGE-AUTO-NODE-${Math.floor(10 + Math.random() * 90)}`,
            type: 'gateway_proxy',
            ipAddress: ip,
            port: 8080,
            status: 'online',
            servicesRunning: ['WireGuard SSL VPN', 'Prometheus Exporter', 'OTLP Streamer']
          }
        };
        toolCalls = [
          {
            name: 'provisionContainerNode',
            args: { ip, image: 'nginx:alpine-slim', memoryMb: 2048 },
            status: 'COMPLETED',
            resultSnippet: `Container allocation prepared on host • Subnet: vox-subnet-us-east`
          }
        ];
      } else if (lower.includes('keyword') || lower.includes('seo') || lower.includes('permutation')) {
        responseText = `### 📊 Cartesian SEO Permutation Matrix\n\nI have computed initial high-converting combinations for your search campaigns:\n\n1. **[Exact]** \`[best keyword generator software 2026]\` — Commercial Intent ($2.45 CPC)\n2. **"Phrase"** \`"automated seo permutation matrix online"\` — High Authority (KD: 24%)\n3. **+Modified** \`+free +url +domain +grabber +n8n\` — Transactional\n4. **Slug** \`sovereign-cryptographic-vault-api\` — Developer Long-Tail\n\nYou can inspect or export the entire permutation set in the dedicated **Keyword Generator & SEO Permutation Studio**.`;
        suggestedAction = {
          type: 'NAVIGATE',
          label: '🔍 Open Keyword Generator Studio',
          payload: { tab: 'advance_crypto_tools' }
        };
      } else if (lower.includes('vnet') || lower.includes('vip') || lower.includes('diop') || lower.includes('traceroute')) {
        responseText = `### 🌐 Virtual Internet Protocol (VIP) vnet:// Resolution\n\n\`\`\`text\n[vnet:// Wire Protocol Traceroute]\n  HOP 1: 10.142.0.12 (Alpha Edge Ingress)        [0.42ms] - OK\n  HOP 2: 10.240.0.1 (VIP Router Relay)          [1.15ms] - ED25519 Signed\n  HOP 3: vnet://telemetry.vip.mesh:9100         [2.80ms] - TLS 1.3 Verified\n\`\`\`\n\nThe 8-layer virtual packet stack is operating at **sub-millisecond latency (1.4ms average)** with zero dropped datagrams.`;
        suggestedAction = {
          type: 'NAVIGATE',
          label: '🌐 Open Virtual Internet Studio',
          payload: { tab: 'virtual_internet' }
        };
      } else if (lower.includes('security') || lower.includes('audit') || lower.includes('pentest') || lower.includes('hash')) {
        responseText = `### 🛡️ Cryptographic & PenTest Diagnostics\n\n- **Zero-Knowledge Proofs**: Validated via Keccak-256 state anchors.\n- **Out-of-Band Callbacks**: 0 suspicious DNS beacon requests detected in the last 60 minutes.\n- **TLS Cipher Suites**: TLS_AES_256_GCM_SHA384 active on all edge gateway nodes.\n\nAll cryptographic address checksums match EIP-55 standards.`;
        suggestedAction = {
          type: 'NAVIGATE',
          label: '🛡️ Open Out-of-Band PenTest Studio',
          payload: { tab: 'advance_crypto_tools' }
        };
      } else {
        responseText = `### ⚡ Analysis from ${activePersona.name}\n\nI have analyzed your query regarding **"${query}"**.\n\nHere is the recommended action sequence:\n1. **State Verification**: Query current telemetry streams from the cluster node.\n2. **Policy Enforcement**: Confirm that all packets are signed with the active DID key.\n3. **Execution**: Run the task through the asynchronous code injunction dispatcher.\n\nLet me know if you would like me to generate a tailored code script or execute a live network diagnostic probe.`;
      }

      const aiMsg: AssistantMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokens: Math.ceil(responseText.length / 4),
        modelUsed: selectedModel,
        suggestedAction,
        toolCalls
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);

      // Optional text-to-speech
      if (isSpeechAudioEnabled && 'speechSynthesis' in window) {
        const cleanText = responseText.replace(/[*#`]/g, '').slice(0, 180);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }, 900);
  };

  return (
    <div id="ai-assistant-bot-studio-root" className="space-y-6">
      
      {/* Top Banner & Control Station */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Header Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl blur-sm opacity-80 animate-pulse"></div>
              <div className="relative p-3.5 rounded-2xl bg-slate-950 border border-amber-400/40 text-amber-300 shadow-xl shadow-amber-950/80">
                <Bot className="h-7 w-7" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-black text-slate-100 tracking-tight flex items-center space-x-2">
                  <span>AGVORA AI Assistant Bot Studio</span>
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/80 rounded-full">
                  AUTONOMOUS AGENT v4.5
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Multi-persona autonomous agent equipped with real-time network introspection, function-calling tools, code injunction dispatch, and telemetry diagnostics.
              </p>
            </div>
          </div>

          {/* Model Selector & Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Model Badge Dropdown */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AIModelId)}
                className="bg-transparent border-none text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Fast)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                <option value="deepseek-r1">DeepSeek R1 (Crypto & Math)</option>
                <option value="claude-3.7-sonnet">Claude 3.7 Sonnet (DevOps & Code)</option>
                <option value="local-wasm-llm">On-Device Sovereign LLM (Wasm)</option>
              </select>
            </div>

            {/* Audio Voice Toggle */}
            <button
              onClick={() => setIsSpeechAudioEnabled(prev => !prev)}
              className={`p-2 rounded-xl border transition-all ${
                isSpeechAudioEnabled
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={isSpeechAudioEnabled ? 'Voice playback enabled' : 'Voice playback disabled'}
            >
              {isSpeechAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Hyperparameter Config Toggle */}
            <button
              onClick={() => setShowConfigPanel(prev => !prev)}
              className={`p-2 rounded-xl border transition-all ${
                showConfigPanel
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Agent Hyperparameters & Settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>

            {/* Export Transcript */}
            <button
              onClick={handleExportTranscript}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
              title="Export Conversation Markdown"
            >
              <Download className="h-4 w-4" />
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700 text-slate-400 hover:text-rose-400 transition-all"
              title="Clear Conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionSuccessNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessNotice}</span>
            </div>
            <button
              onClick={() => setActionSuccessNotice(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Hyperparameter Slider Panel (Collapsible) */}
        {showConfigPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold border-b border-slate-800/80 pb-2">
              <span className="flex items-center space-x-1.5">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>Agent Hyperparameters & Context Runtime</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Context Window: 1,000,000 Tokens</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Temperature: {temperature}</span>
                  <span className="text-slate-500">{temperature < 0.4 ? 'Precise' : temperature > 0.8 ? 'Creative' : 'Balanced'}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.2"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-slate-200">Stream Output</div>
                  <div className="text-[10px] text-slate-400">Real-time token typing</div>
                </div>
                <input
                  type="checkbox"
                  checked={streamResponse}
                  onChange={(e) => setStreamResponse(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-slate-200">Function Calling</div>
                  <div className="text-[10px] text-emerald-400">Active (4 Tool Bridges)</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ENABLED
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Agent Persona Selector Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
            <Bot className="h-3.5 w-3.5 text-amber-400" />
            <span>Select Specialized Agent Persona:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {AGENT_PERSONAS.map((persona) => {
              const Icon = persona.icon;
              const isSelected = selectedPersonaId === persona.id;

              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersonaId(persona.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-amber-500 shadow-lg shadow-amber-950/60 ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-400'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                      {persona.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {persona.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Toggled AI Tools Ribbon */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center space-x-1.5 mr-1">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Active AI Tool Capabilities ({activeAiTools.length}):</span>
            </span>
            {activeAiTools.slice(0, 6).map(t => (
              <span
                key={t.id}
                className="px-2 py-0.5 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center space-x-1 shadow-sm"
              >
                <span>{t.name.split(' ')[0]}</span>
              </span>
            ))}
            {activeAiTools.length > 6 && (
              <span className="text-[10px] font-mono text-slate-500">
                +{activeAiTools.length - 6} more
              </span>
            )}
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('ai_top_tools')}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-300 text-[11px] font-mono font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Manage / Toggle AI Tools</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>

      </div>

      {/* Main Conversation Canvas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
        
        {/* Chat History Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isCopied = copiedMsgId === msg.id;

            return (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`shrink-0 p-2.5 rounded-2xl border shadow-lg ${
                    isUser
                      ? 'bg-cyan-600 border-cyan-400 text-white shadow-cyan-950'
                      : 'bg-slate-950 border-amber-500/40 text-amber-400 shadow-amber-950'
                  }`}
                >
                  {isUser ? <Terminal className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`max-w-2xl sm:max-w-3xl rounded-2xl p-4 space-y-3 ${
                    isUser
                      ? 'bg-cyan-950/60 border border-cyan-800/80 text-cyan-100'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  {/* Sender Meta Info */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-slate-800/60">
                    <span className="font-bold flex items-center space-x-1.5">
                      <span className={isUser ? 'text-cyan-400' : 'text-amber-400'}>
                        {isUser ? 'Operator Injunction Prompt' : activePersona.name}
                      </span>
                      {msg.modelUsed && !isUser && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400">
                          {msg.modelUsed}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.content, msg.id)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                        title="Copy message content"
                      >
                        {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Body Text with Markdown formatting */}
                  <div className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap space-y-2 text-slate-200">
                    {msg.content}
                  </div>

                  {/* Tool Calls Inspector (if any) */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-[11px]">
                      <div className="text-[10px] text-amber-400 uppercase font-bold flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span>Function Calling Execution Bridge:</span>
                      </div>
                      {msg.toolCalls.map((tc, tcIdx) => (
                        <div key={tcIdx} className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-slate-300 font-bold">
                            <code>{tc.name}()</code>
                            <span className="text-emerald-400 text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800">
                              {tc.status}
                            </span>
                          </div>
                          {tc.resultSnippet && (
                            <div className="text-[10px] text-slate-400 italic">
                              Result: {tc.resultSnippet}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Suggestion Action Button (Direct Hook to Real State) */}
                  {msg.suggestedAction && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleExecuteSuggestedAction(msg.suggestedAction)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold shadow-lg shadow-amber-950 flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-white" />
                        <span>{msg.suggestedAction.label}</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3 text-slate-400 font-mono text-xs"
            >
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-amber-500/40 text-amber-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{activePersona.name} is synthesizing response...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-400 shrink-0">Quick Prompts:</span>
          {activePersona.suggestedPrompts.map((promptText, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(promptText)}
              className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 whitespace-nowrap transition-all shrink-0"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end space-x-2"
          >
            {/* Multi-line prompt input */}
            <div className="relative flex-1">
              <textarea
                ref={chatInputRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                placeholder={`Ask ${activePersona.name} anything (e.g. generate server node, dispatch $DPO injunction, inspect VIP routing)...`}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-2xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all resize-none font-sans"
              />
            </div>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={() => {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                  alert('Speech recognition is not supported in this browser environment.');
                  return;
                }
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                setIsVoiceActive(true);
                recognition.start();

                recognition.onresult = (event: any) => {
                  const speechResult = event.results[0][0].transcript;
                  setInputQuery(prev => prev ? `${prev} ${speechResult}` : speechResult);
                  setIsVoiceActive(false);
                };

                recognition.onerror = () => {
                  setIsVoiceActive(false);
                };

                recognition.onend = () => {
                  setIsVoiceActive(false);
                };
              }}
              className={`p-3.5 rounded-2xl border transition-all ${
                isVoiceActive
                  ? 'bg-rose-600 text-white animate-pulse border-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Submit Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-950/80 disabled:opacity-40 transition-all cursor-pointer"
              title="Send Injunction Command"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
