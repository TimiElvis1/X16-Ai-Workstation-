import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  Play,
  Layers,
  Code2,
  Terminal,
  Settings,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Download,
  ExternalLink,
  Zap,
  Globe,
  Server,
  Wand2,
  FileCode,
  Layout,
  Plus,
  Box,
  Cpu,
  ShieldCheck,
  Flame,
  FileText,
  Activity,
  Maximize2,
  Eye,
  Info
} from 'lucide-react';
import { AppLivePreviewModal } from './AppLivePreviewModal';

interface AIAppletFile {
  filename: string;
  language: string;
  content: string;
}

interface GeneratedApplet {
  appName: string;
  description: string;
  category: string;
  tags: string[];
  files: AIAppletFile[];
  livePreview: {
    title: string;
    mockData: any;
    primaryAction: string;
    sampleMetrics: Array<{ label: string; value: string; change: string }>;
  };
  apiEndpoints: Array<{
    method: string;
    path: string;
    description: string;
    sampleResponse?: any;
  }>;
}

const STARTER_PROMPT_PRESETS = [
  {
    title: "Cluster Telemetry & Node Monitor",
    category: "Infrastructure",
    prompt: "Create a real-time cluster telemetry dashboard with live node metrics, latency graphs, and automated container failover triggers.",
    model: "gemini-3.7-flash"
  },
  {
    title: "Web3 Multi-Sig Escrow & Vault",
    category: "Blockchain",
    prompt: "Build a Web3 multi-sig cryptographic vault application with BTE-ID identity attestation, gasless Sepolia token deposits, and timelocked releases.",
    model: "gemini-3.7-flash"
  },
  {
    title: "Autonomous Code Injunction Dispatcher",
    category: "Automation",
    prompt: "Develop an automated code injunction engine that executes sandboxed V8 microservices based on webhook triggers and Redis cache state.",
    model: "gemini-3.7-flash"
  },
  {
    title: "VIP 8-Layer VirtualPacket Router",
    category: "Networking",
    prompt: "Construct a high-performance Virtual Internet Protocol packet router with QUIC transport simulation, ChaCha20 encryption verification, and traceroute visualization.",
    model: "gemini-3.7-flash"
  },
  {
    title: "OpenSea NFT Asset Evaluator",
    category: "Web3 Media",
    prompt: "Generate an NFT metadata evaluator and asset verification app with floor price analytics, contract validation, and wallet portfolio tracking.",
    model: "gemini-3.7-flash"
  }
];

export const AIAppCreationStudio: React.FC = () => {
  const [appName, setAppName] = useState<string>("SubNet Telemetry & Node Monitor");
  const [promptText, setPromptText] = useState<string>(
    "Create a real-time cluster telemetry dashboard with live node metrics, latency graphs, and automated container failover triggers."
  );
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.7-flash");
  const [systemInstruction, setSystemInstruction] = useState<string>(
    "You are Google AI Studio's master application architect. Generate production-ready, highly modular TypeScript, React 18, Tailwind CSS, and Express code with robust typing."
  );
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.95);
  const [thinkingBudget, setThinkingBudget] = useState<number>(2048);
  const [includeBackend, setIncludeBackend] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Infrastructure & Telemetry");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [generatedApp, setGeneratedApp] = useState<GeneratedApplet | null>(null);

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'preview' | 'code' | 'api' | 'config'>('preview');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [interactiveCounter, setInteractiveCounter] = useState<number>(0);
  const [sandboxActionLog, setSandboxActionLog] = useState<string[]>([]);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Initial demo applet
  React.useEffect(() => {
    if (!generatedApp) {
      setGeneratedApp({
        appName: "SubNet Telemetry & Node Monitor",
        description: "Real-time cluster health, packet metrics, and server node dispatcher with automated failover.",
        category: "Infrastructure & Telemetry",
        tags: ["React 18", "Tailwind CSS", "TypeScript", "Express API", "Lucide Icons"],
        files: [
          {
            filename: "App.tsx",
            language: "typescript",
            content: `import React, { useState } from 'react';
import { Activity, Server, Zap, RefreshCw, CheckCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function TelemetryDashboard() {
  const [nodes, setNodes] = useState([
    { id: 'node-1', name: 'Alpha-Edge-01', ip: '10.142.0.12', status: 'ONLINE', latencyMs: 14, rps: 8420 },
    { id: 'node-2', name: 'Neural-Vector-02', ip: '10.142.0.45', status: 'ONLINE', latencyMs: 22, rps: 12100 },
    { id: 'node-3', name: 'Proxy-Gateway-03', ip: '10.142.1.88', status: 'ONLINE', latencyMs: 18, rps: 6540 }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncNodes = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        latencyMs: Math.floor(Math.random() * 15 + 10),
        rps: Math.floor(Math.random() * 4000 + 7000)
      })));
      setIsSyncing(false);
    }, 500);
  };

  return (
    <div className="p-6 bg-zinc-950 text-white rounded-2xl border border-zinc-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-cyan-400">SubNet Cluster Monitor</h2>
          <p className="text-xs text-zinc-400">Live generated applet running in sandboxed container</p>
        </div>
        <button
          onClick={syncNodes}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw className={\`h-3.5 w-3.5 \${isSyncing ? 'animate-spin' : ''}\`} />
          <span>Sync Cluster</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {nodes.map(node => (
          <div key={node.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-zinc-200">{node.name}</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {node.status}
              </span>
            </div>
            <div className="text-xs font-mono text-zinc-400">IP: {node.ip}</div>
            <div className="text-sm font-black text-cyan-300 font-mono">
              {node.latencyMs} ms • {node.rps.toLocaleString()} req/s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`
          },
          {
            filename: "server.ts",
            language: "typescript",
            content: `import express from 'express';
const app = express();
app.use(express.json());

// API Endpoint: Cluster Telemetry Nodes
app.get('/api/applet/subnet-telemetry/nodes', (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    nodesCount: 3,
    clusterHealth: 'OPTIMAL_100_PCT',
    activeThroughputGbps: 4.85
  });
});

// API Endpoint: Dispatch failover
app.post('/api/applet/subnet-telemetry/failover', (req, res) => {
  const { targetNodeId } = req.body;
  res.json({
    success: true,
    txId: 'tx_' + Date.now().toString(36),
    targetNodeId,
    status: 'FAILOVER_COMPLETED',
    newRouteIp: '10.142.2.99'
  });
});`
          },
          {
            filename: "types.ts",
            language: "typescript",
            content: `export interface NodeMetric {
  id: string;
  name: string;
  ip: string;
  status: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  latencyMs: number;
  rps: number;
}

export interface ClusterTelemetryState {
  clusterName: string;
  nodes: NodeMetric[];
  totalThroughputGbps: number;
  lastSyncedAt: string;
}`
          },
          {
            filename: "manifest.json",
            language: "json",
            content: JSON.stringify({
              appName: "SubNet Telemetry & Node Monitor",
              version: "1.0.0",
              engine: "Google AI Studio Agent",
              modelUsed: "gemini-3.7-flash",
              author: "IIN AI Studio",
              runtime: "Node 20 + React 18 SPA"
            }, null, 2)
          }
        ],
        livePreview: {
          title: "SubNet Telemetry & Node Monitor",
          mockData: {
            activeNodesCount: 3,
            clusterHealth: "100%",
            throughputGbps: 4.85,
            lastSyncedAt: new Date().toISOString()
          },
          primaryAction: "Trigger Node Benchmark",
          sampleMetrics: [
            { label: "Cluster Throughput", value: "4.85 Gbps", change: "+14.2%" },
            { label: "Round-Trip Latency", value: "14.2 ms", change: "-2.8 ms" },
            { label: "Active Connections", value: "18,420", change: "+420" }
          ]
        },
        apiEndpoints: [
          { method: "GET", path: "/api/applet/subnet-telemetry/nodes", description: "Fetches live node health, latency & requests/sec." },
          { method: "POST", path: "/api/applet/subnet-telemetry/failover", description: "Dispatches automated failover sequence to standby node." }
        ]
      });
    }
  }, []);

  const handleGenerateApplet = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setGenerationStep("Analyzing user blueprint & requirements...");

    setTimeout(() => setGenerationStep("Synthesizing TypeScript interfaces & schema..."), 400);
    setTimeout(() => setGenerationStep("Generating interactive React 18 Tailwind frontend..."), 900);
    setTimeout(() => setGenerationStep("Constructing Express API routes & server backend..."), 1400);

    try {
      const res = await fetch('/api/ai/app-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: appName || "AI Applet",
          prompt: promptText,
          systemInstruction,
          model: selectedModel,
          appCategory: selectedCategory,
          includeBackend
        })
      });

      const data = await res.json();
      if (data.success && data.applet) {
        setGeneratedApp(data.applet);
        setSelectedFileIndex(0);
        setSandboxActionLog(prev => [
          `[${new Date().toLocaleTimeString()}] Successfully synthesized application '${data.applet.appName}' with ${data.applet.files.length} source files.`,
          ...prev
        ]);
      }
    } catch (err: any) {
      console.error("App generation error:", err);
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleCopyCode = () => {
    if (!generatedApp?.files?.[selectedFileIndex]) return;
    navigator.clipboard.writeText(generatedApp.files[selectedFileIndex].content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadAppBundle = () => {
    if (!generatedApp) return;
    const bundleContent = generatedApp.files.map(f => `// ==========================================\n// FILE: ${f.filename}\n// ==========================================\n\n${f.content}\n\n`).join('\n');
    const blob = new Blob([bundleContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedApp.appName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-app-bundle.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInteractiveTrigger = () => {
    setInteractiveCounter(prev => prev + 1);
    setSandboxActionLog(prev => [
      `[${new Date().toLocaleTimeString()}] User invoked primary sandbox action '${generatedApp?.livePreview.primaryAction || 'Execute'}'. State counter: ${interactiveCounter + 1}.`,
      ...prev
    ]);
  };

  return (
    <div id="ai-app-creation-studio" className="space-y-8 font-sans">
      
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e8dfd3] bg-gradient-to-br from-[#ffffff] via-[#faf6ed] to-[#f5eedc] p-8 shadow-xl text-[#1c1917]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#fef3c7] text-[#92400e] border border-[#fde68a] flex items-center space-x-1.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#b45309]" />
                <span>GOOGLE AI STUDIO ARCHITECTURE</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#faf6ed] text-[#78350f] border border-[#dfd4c3]">
                MULTI-FILE AGENT BUILDER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1917] tracking-tight">
              AI App Creation Studio &amp; Agent Builder
            </h1>
            <p className="text-sm text-[#57534e] leading-relaxed">
              Describe any digital application, decentralized protocol UI, network tool, or telemetry dashboard in natural language. Powered by server-side Gemini models with live sandbox preview and full-stack code exports.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-[#ffffff] border border-[#e8dfd3] p-3.5 rounded-2xl shrink-0 font-mono text-xs shadow-sm">
            <div className="text-center px-3 border-r border-[#e8dfd3]">
              <div className="text-[#b45309] font-black text-base">{selectedModel.replace('gemini-', '')}</div>
              <div className="text-[10px] text-[#78716c]">Active Engine</div>
            </div>
            <div className="text-center px-3 border-r border-[#e8dfd3]">
              <div className="text-[#15803d] font-black text-base">Full-Stack</div>
              <div className="text-[10px] text-[#78716c]">React + Express</div>
            </div>
            <div className="text-center px-3">
              <div className="text-[#92400e] font-black text-base">{generatedApp?.files?.length || 4} Files</div>
              <div className="text-[10px] text-[#78716c]">Bundle Output</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Control Blueprint | Right Workspace Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Prompt Blueprint & Model Knobs (4 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* App Configuration & Prompt Card */}
          <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e8dfd3] shadow-md space-y-5 text-[#1c1917]">
            <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-4">
              <div className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-[#b45309]" />
                <h2 className="font-black text-base text-[#1c1917]">App Blueprint Spec</h2>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#78716c]">Step 1: Define</span>
            </div>

            {/* App Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#44403c]">Application Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. Real-Time Telemetry Monitor"
                className="w-full px-4 py-2.5 rounded-xl bg-[#faf6ee] border border-[#dfd4c3] text-[#1c1917] text-sm focus:border-[#b45309] focus:outline-none font-medium"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#44403c]">Category / Domain</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#faf6ee] border border-[#dfd4c3] text-[#1c1917] text-sm focus:border-[#b45309] focus:outline-none font-medium"
              >
                <option value="Infrastructure & Telemetry">Infrastructure &amp; Telemetry</option>
                <option value="Web3 & Cryptographic Vault">Web3 &amp; Cryptographic Vault</option>
                <option value="Networking & VIP Protocols">Networking &amp; VIP Protocols</option>
                <option value="Automation & Code Injunctions">Automation &amp; Code Injunctions</option>
                <option value="Cybersecurity & Port Scanner">Cybersecurity &amp; Port Scanner</option>
                <option value="AI Intelligence & Analytics">AI Intelligence &amp; Analytics</option>
              </select>
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[#44403c]">Natural Language Prompt</label>
                <span className="text-[10px] text-[#a8a29e] font-mono">{promptText.length} chars</span>
              </div>
              <textarea
                rows={5}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe the application features, interactive components, API routes, data flow, and visual styling..."
                className="w-full p-4 rounded-xl bg-[#faf6ee] border border-[#dfd4c3] text-[#1c1917] text-sm focus:border-[#b45309] focus:outline-none font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Starter Presets Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#78716c] uppercase tracking-wider block">
                Quick Inspiration Templates:
              </span>
              <div className="flex flex-wrap gap-2">
                {STARTER_PROMPT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAppName(preset.title);
                      setPromptText(preset.prompt);
                      setSelectedCategory(preset.category);
                      setSelectedModel(preset.model);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#faf6ed] hover:bg-[#ffffff] text-[#44403c] hover:text-[#92400e] border border-[#e8dfd3] text-xs font-medium transition-all text-left truncate max-w-full cursor-pointer"
                  >
                    🥛 {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateApplet}
              disabled={isGenerating || !promptText.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#b45309] hover:from-[#92400e] hover:to-[#b45309] text-white font-black text-sm flex items-center justify-center space-x-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>{generationStep || 'Building Applet...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Synthesize &amp; Build Application</span>
                </>
              )}
            </button>
          </div>

          {/* Model Selection & Parameters Accordion */}
          <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e8dfd3] shadow-md space-y-4 text-[#1c1917]">
            <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="h-4.5 w-4.5 text-[#b45309]" />
                <h3 className="font-bold text-sm text-[#1c1917]">Model Parameters &amp; Architecture</h3>
              </div>
              <span className="text-[10px] font-mono text-[#78716c]">Google GenAI</span>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#44403c]">Gemini Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6ee] border border-[#dfd4c3] text-[#78350f] text-xs font-mono font-bold focus:border-[#b45309] focus:outline-none"
              >
                <option value="gemini-3.7-flash">gemini-3.7-flash (Recommended &amp; Fast)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Low Latency)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#57534e]">Temperature</span>
                <span className="text-[#b45309] font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#b45309] bg-[#efe6d8] rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* System Instruction */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#44403c]">System Blueprint Instruction</label>
              <textarea
                rows={2}
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#dfd4c3] text-[#1c1917] text-xs font-mono focus:border-[#b45309] focus:outline-none resize-none"
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Live Preview, Code Explorer & API Schema (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Applet Workspace Card */}
          <div className="rounded-3xl bg-[#ffffff] border border-[#e8dfd3] shadow-md overflow-hidden flex flex-col">
            
            {/* Workspace Navigation Bar */}
            <div className="p-4 bg-[#faf6ee] border-b border-[#e8dfd3] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setActiveWorkspaceTab('preview')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeWorkspaceTab === 'preview'
                      ? 'bg-[#b45309] text-white shadow-sm'
                      : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#efe6d8]'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>Live Sandbox Preview</span>
                </button>

                <button
                  onClick={() => setActiveWorkspaceTab('code')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeWorkspaceTab === 'code'
                      ? 'bg-[#78350f] text-white shadow-sm'
                      : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#efe6d8]'
                  }`}
                >
                  <Code2 className="h-4 w-4" />
                  <span>Source Code ({generatedApp?.files?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveWorkspaceTab('api')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeWorkspaceTab === 'api'
                      ? 'bg-[#15803d] text-white shadow-sm'
                      : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#efe6d8]'
                  }`}
                >
                  <Terminal className="h-4 w-4" />
                  <span>API Contracts</span>
                </button>
              </div>

              {/* Viewport Toggles & Live Modal Preview Button */}
              {activeWorkspaceTab === 'preview' && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-[#ffffff] p-1 rounded-xl border border-[#dfd4c3] text-xs">
                    <button
                      onClick={() => setPreviewViewport('desktop')}
                      className={`px-2 py-1 rounded-lg font-mono ${previewViewport === 'desktop' ? 'bg-[#faf6ed] text-[#78350f] font-bold' : 'text-[#78716c]'}`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewViewport('tablet')}
                      className={`px-2 py-1 rounded-lg font-mono ${previewViewport === 'tablet' ? 'bg-[#faf6ed] text-[#78350f] font-bold' : 'text-[#78716c]'}`}
                    >
                      Tablet
                    </button>
                    <button
                      onClick={() => setPreviewViewport('mobile')}
                      className={`px-2 py-1 rounded-lg font-mono ${previewViewport === 'mobile' ? 'bg-[#faf6ed] text-[#78350f] font-bold' : 'text-[#78716c]'}`}
                    >
                      Mobile
                    </button>
                  </div>

                  <button
                    id="btn-preview-built-app"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#92400e] hover:to-[#b45309] text-white font-bold text-xs font-mono flex items-center space-x-1.5 shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
                    title="Launch Apple-Amazon inspired live app preview modal"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Preview App</span>
                  </button>
                </div>
              )}

              {/* Code Download Button */}
              {activeWorkspaceTab === 'code' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-[#ffffff] hover:bg-[#faf6ee] text-[#1c1917] border border-[#dfd4c3] text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
                  >
                    {copiedFile ? <Check className="h-3.5 w-3.5 text-[#15803d]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedFile ? 'Copied' : 'Copy File'}</span>
                  </button>
                  <button
                    onClick={handleDownloadAppBundle}
                    className="px-3 py-1.5 rounded-xl bg-[#78350f] hover:bg-[#451a03] text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Bundle</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: LIVE INTERACTIVE SANDBOX PREVIEW */}
            {activeWorkspaceTab === 'preview' && (
              <div className="p-6 space-y-6">
                <div className={`mx-auto transition-all ${
                  previewViewport === 'mobile' ? 'max-w-sm' : previewViewport === 'tablet' ? 'max-w-xl' : 'w-full'
                }`}>
                  
                  {/* Generated App Canvas Header */}
                  <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#e8dfd3] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8dfd3] pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <h3 className="font-black text-lg text-[#1c1917]">
                            {generatedApp?.appName || "IIN Live Applet"}
                          </h3>
                        </div>
                        <p className="text-xs text-[#57534e] mt-1">
                          {generatedApp?.description || "Interactive component synthesized by IIN AI."}
                        </p>
                      </div>

                      <button
                        onClick={handleInteractiveTrigger}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#92400e] hover:to-[#b45309] text-white font-black text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer shrink-0"
                      >
                        <Play className="h-3.5 w-3.5 fill-white" />
                        <span>{generatedApp?.livePreview?.primaryAction || 'Run Sandbox Trigger'}</span>
                      </button>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(generatedApp?.livePreview?.sampleMetrics || []).map((m, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#ffffff] border border-[#e8dfd3] space-y-1 font-mono shadow-sm">
                          <div className="text-[11px] text-[#78716c]">{m.label}</div>
                          <div className="text-lg font-black text-[#92400e]">{m.value}</div>
                          <div className="text-[10px] text-[#15803d] font-bold">{m.change}</div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Cluster Nodes Simulation */}
                    <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e8dfd3] space-y-3 font-mono text-xs shadow-sm">
                      <div className="flex items-center justify-between text-[#57534e]">
                        <span className="font-bold uppercase tracking-wider text-[11px]">Sandboxed Node Cluster</span>
                        <span className="text-[#15803d] font-bold">State Invocations: {interactiveCounter}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-3 rounded-lg bg-[#faf6ed] border border-[#e8dfd3] flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#1c1917]">Edge-Node-01</div>
                            <div className="text-[10px] text-[#78716c]">10.142.0.12</div>
                          </div>
                          <span className="text-[#b45309] font-black">{12 + (interactiveCounter % 5)}ms</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#faf6ed] border border-[#e8dfd3] flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#1c1917]">Neural-VDB-02</div>
                            <div className="text-[10px] text-[#78716c]">10.142.0.45</div>
                          </div>
                          <span className="text-[#b45309] font-black">{18 + (interactiveCounter % 8)}ms</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#faf6ed] border border-[#e8dfd3] flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#1c1917]">Gateway-03</div>
                            <div className="text-[10px] text-[#78716c]">10.142.1.88</div>
                          </div>
                          <span className="text-[#b45309] font-black">{15 + (interactiveCounter % 4)}ms</span>
                        </div>
                      </div>
                    </div>

                    {/* Execution Audit Feed */}
                    <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e8dfd3] space-y-2 font-mono text-[11px] shadow-sm">
                      <div className="text-[#78716c] font-bold uppercase tracking-wider text-[10px]">
                        Live Container Execution Log
                      </div>
                      <div className="space-y-1 text-[#44403c] max-h-32 overflow-y-auto pr-2">
                        {sandboxActionLog.length === 0 ? (
                          <div className="text-[#a8a29e] italic">No actions dispatched yet. Click the trigger button above to test.</div>
                        ) : (
                          sandboxActionLog.map((log, i) => (
                            <div key={i} className="leading-snug text-[#78350f]">
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MULTI-FILE SOURCE CODE EXPLORER */}
            {activeWorkspaceTab === 'code' && (
              <div className="p-6 space-y-4">
                {/* File Tabs */}
                <div className="flex items-center space-x-2 border-b border-[#e8dfd3] pb-3 overflow-x-auto">
                  {(generatedApp?.files || []).map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
                        selectedFileIndex === idx
                          ? 'bg-[#ffffff] text-[#78350f] border border-[#dfd4c3] shadow-sm'
                          : 'text-[#78716c] hover:bg-[#faf6ee] hover:text-[#1c1917]'
                      }`}
                    >
                      <FileCode className="h-3.5 w-3.5 text-[#b45309]" />
                      <span>{file.filename}</span>
                    </button>
                  ))}
                </div>

                {/* Code Content Box */}
                {generatedApp?.files?.[selectedFileIndex] && (
                  <div className="relative rounded-2xl bg-[#faf6ee] border border-[#e8dfd3] overflow-hidden font-mono text-xs shadow-inner">
                    <div className="p-3 bg-[#ffffff] border-b border-[#e8dfd3] flex items-center justify-between text-[#57534e]">
                      <span className="font-bold text-[#1c1917]">{generatedApp.files[selectedFileIndex].filename}</span>
                      <span className="text-[10px] uppercase font-bold text-[#78350f]">{generatedApp.files[selectedFileIndex].language}</span>
                    </div>
                    <pre className="p-4 text-[#292524] overflow-x-auto max-h-[480px] leading-relaxed select-text">
                      <code>{generatedApp.files[selectedFileIndex].content}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REST API CONTRACTS & SCHEMAS */}
            {activeWorkspaceTab === 'api' && (
              <div className="p-6 space-y-4 font-mono text-xs">
                <div className="text-[#78716c] font-bold uppercase tracking-wider text-[11px] mb-2">
                  Generated REST API Routes &amp; Endpoints
                </div>
                
                <div className="space-y-3">
                  {(generatedApp?.apiEndpoints || []).map((ep, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#faf6ee] border border-[#e8dfd3] space-y-2 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                          ep.method === 'GET' ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]' : 'bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="font-bold text-[#92400e]">{ep.path}</span>
                      </div>
                      <p className="text-[#57534e] font-sans text-xs">{ep.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Standalone Live App Preview Modal */}
      <AppLivePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        appName={generatedApp?.appName || appName || "IIN Telemetry & Node Monitor"}
        category={generatedApp?.category || selectedCategory}
        livePreviewData={{
          title: generatedApp?.appName || "IIN Telemetry & Node Monitor",
          sampleMetrics: [
            { label: 'Cluster Operations', value: `${(interactiveCounter + 1420).toLocaleString()}`, change: '+18.4%' },
            { label: 'Active Edge Nodes', value: '12 / 12', change: '100% SLA' },
            { label: 'Packet Throughput', value: '6.4 GB/s', change: '0.00% Loss' }
          ],
          primaryAction: 'Execute Failover Test'
        }}
        files={generatedApp?.files || []}
        apiEndpoints={generatedApp?.apiEndpoints || []}
      />

    </div>
  );
};
