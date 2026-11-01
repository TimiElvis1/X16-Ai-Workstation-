import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Terminal,
  Server,
  Zap,
  ShieldCheck,
  Radio,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Layers,
  Wand2,
  Trash2,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Globe,
  Sliders,
  Code2,
  Mic,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ChatExecutionMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  executionPlan?: {
    planId: string;
    executionMode: string;
    steps: Array<{
      stepNo: number;
      title: string;
      status: string;
      detail: string;
    }>;
    actionArtifacts: Array<{
      type: string;
      data: any;
      message: string;
    }>;
    summary: string;
  };
  functionCalls?: Array<{
    id: string;
    name: string;
    args: any;
    result: any;
    status: string;
  }>;
}

const QUICK_EXECUTION_PROMPTS = [
  {
    label: "Provision Node",
    prompt: "Provision a private Docker node named 'VOX-Edge-Alpha' with 4GB RAM on subnet us-east-1 and start Nginx daemon."
  },
  {
    label: "Scan Port & Probe",
    prompt: "Execute network diagnostic port scan against target IP 10.142.0.12 and inspect HTTP/2 proxy endpoints."
  },
  {
    label: "Run Code Injunction",
    prompt: "Execute parameterized code injunction 'Injunction-SecScan' with payload { level: 'STRICT', bypassCache: true }."
  },
  {
    label: "Synthesize App",
    prompt: "Create a real-time crypto parity and yield farming dashboard app with Web3 $DEPO token balances."
  },
  {
    label: "VIP Packet Dispatch",
    prompt: "Dispatch VirtualPacket over QUIC transport with ChaCha20 encryption to destination vnet://mesh-primary."
  }
];

export const AIChatBotExecutionStudio: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatExecutionMessage[]>([
    {
      id: "msg-init",
      sender: "agent",
      content: "Hello! I am **Intentional Infrastructure Network (IIN) Autonomous Execution Agent**.\n\nSend me any command or prompt to execute real infrastructure actions, provision server containers, run parameter injunctions, execute network port probes, or synthesize full-stack web applications.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      executionPlan: {
        planId: "plan-ready",
        executionMode: "AUTONOMOUS",
        steps: [
          {
            stepNo: 1,
            title: "Autonomous Tool Dispatcher Ready",
            status: "ONLINE",
            detail: "Connected to Gemini-3.7-Flash backend with 5 system execution functions."
          }
        ],
        actionArtifacts: [],
        summary: "System standby. Awaiting execution prompt."
      }
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionMode, setExecutionMode] = useState<'AUTONOMOUS' | 'DIAGNOSTIC' | 'APP_CREATION' | 'INJUNCTION'>('AUTONOMOUS');
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.7-flash");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExecuting]);

  const handleSendPrompt = async (promptToSend?: string) => {
    const promptText = (promptToSend || inputPrompt).trim();
    if (!promptText || isExecuting) return;

    const userMsgId = `usr-${Date.now()}`;
    const newMsg: ChatExecutionMessage = {
      id: userMsgId,
      sender: "user",
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    if (!promptToSend) setInputPrompt("");
    setIsExecuting(true);

    try {
      // First, try specialized execution prompt endpoint
      const res = await fetch('/api/ai/execute-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          executionMode,
          model: selectedModel
        })
      });

      const data = await res.json();
      if (data.success && data.executionPlan) {
        const agentMsg: ChatExecutionMessage = {
          id: `agent-${Date.now()}`,
          sender: "agent",
          content: data.executionPlan.summary || "Execution completed successfully.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          executionPlan: data.executionPlan
        };
        setMessages(prev => [...prev, agentMsg]);
      } else {
        // Fallback to /api/gemini/chat
        const chatRes = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: promptText,
            model: selectedModel
          })
        });
        const chatData = await chatRes.json();
        const agentMsg: ChatExecutionMessage = {
          id: `agent-${Date.now()}`,
          sender: "agent",
          content: chatData.text || "Execution finished.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          functionCalls: chatData.functionCalls
        };
        setMessages(prev => [...prev, agentMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatExecutionMessage = {
        id: `err-${Date.now()}`,
        sender: "agent",
        content: `Execution error: ${err.message || 'Could not communicate with IIN AI node.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyTranscript = () => {
    const transcript = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(transcript);
    setCopiedId("transcript");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([messages[0]]);
  };

  return (
    <div id="ai-chatbot-execution-studio" className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-purple-950 text-purple-300 border border-purple-800 flex items-center space-x-1.5">
                <Bot className="h-3.5 w-3.5 text-purple-400" />
                <span>AUTONOMOUS EXECUTION AGENT</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                PROMPT-TO-EXECUTE ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Chat Bot &amp; Prompt Execution Studio
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Interact with a conversational execution agent that interprets natural language instructions, invokes underlying system tools, provisions nodes, inspects networking layers, and runs sandboxed functions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTranscript}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
            >
              {copiedId === "transcript" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedId === "transcript" ? "Copied" : "Export Log"}</span>
            </button>
            <button
              onClick={handleClearHistory}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Layout: Chat Console & Execution Action Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Chat & Prompt Console (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col h-[680px]">
            
            {/* Console Header Bar */}
            <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-zinc-200">Execution Thread Active</span>
                <span className="text-zinc-500">({messages.length} messages)</span>
              </div>

              {/* Mode Pill Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-zinc-500">Mode:</span>
                <select
                  value={executionMode}
                  onChange={(e) => setExecutionMode(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-cyan-300 text-xs font-mono font-bold focus:outline-none"
                >
                  <option value="AUTONOMOUS">Autonomous Execution</option>
                  <option value="DIAGNOSTIC">Network Diagnostics</option>
                  <option value="APP_CREATION">App Creation Mode</option>
                  <option value="INJUNCTION">Injunction Runner</option>
                </select>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                >
                  {/* Sender & Timestamp */}
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-500 px-1">
                    <span className="font-bold text-zinc-400">
                      {msg.sender === 'user' ? 'Operator' : 'IIN Execution Bot'}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl max-w-[90%] text-sm font-sans leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-lg'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Render Structured Execution Steps if Available */}
                    {msg.executionPlan && msg.executionPlan.steps.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2.5 font-mono text-xs">
                        <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                          Executed Steps &amp; Action Plan
                        </div>
                        {msg.executionPlan.steps.map((step, sIdx) => (
                          <div key={sIdx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start space-x-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-zinc-200">{step.title}</div>
                              <div className="text-[11px] text-zinc-400 mt-0.5">{step.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Executed Action Artifacts (e.g. Created Server, Port Probe) */}
                    {msg.executionPlan && msg.executionPlan.actionArtifacts.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.executionPlan.actionArtifacts.map((art, aIdx) => (
                          <div key={aIdx} className="p-3 rounded-xl bg-zinc-950 border border-cyan-500/40 font-mono text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-cyan-400 font-bold">⚡ {art.type}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                                ACTIVE
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-300">{art.message}</div>
                            {art.type === 'SERVER_NODE' && (
                              <button
                                onClick={() => onNavigateTab && onNavigateTab('advance_crypto_tools')}
                                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 text-[10px] font-bold border border-zinc-800 flex items-center space-x-1"
                              >
                                <span>Inspect in Server Manager</span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            )}
                            {art.type === 'APPLET_BUNDLE' && (
                              <button
                                onClick={() => onNavigateTab && onNavigateTab('app_creation')}
                                className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-900 text-purple-300 text-[10px] font-bold border border-purple-800 flex items-center space-x-1"
                              >
                                <span>Open in App Creation Studio</span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Function Calls if returned from Gemini Tool */}
                    {msg.functionCalls && msg.functionCalls.length > 0 && (
                      <div className="mt-3 space-y-2 font-mono text-xs">
                        {msg.functionCalls.map((fc, fcIdx) => (
                          <div key={fcIdx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                            <div className="text-purple-400 font-bold">Function: {fc.name}()</div>
                            <pre className="text-[10px] text-zinc-400 bg-zinc-900 p-2 rounded overflow-x-auto">
                              {JSON.stringify(fc.args, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isExecuting && (
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-sm text-xs font-mono text-cyan-400">
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  <span>Agent executing prompt &amp; dispatching actions...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 space-y-3">
              
              {/* Quick Prompt Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold shrink-0">Prompts:</span>
                {QUICK_EXECUTION_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(qp.prompt)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-mono whitespace-nowrap transition-all hover:text-cyan-300 shrink-0"
                  >
                    ⚡ {qp.label}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Enter prompt for execution (e.g. 'Provision node VOX-Edge on port 8080' or 'Run network port scan')..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isExecuting}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-black transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Execution Telemetry & Available Tool Registry (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Tools Palette */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="font-bold text-sm text-zinc-200">Execution Tool Registry</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">5 ONLINE</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-zinc-200">Server Provisioner</div>
                    <div className="text-[10px] text-zinc-500">generate_private_server</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Radio className="h-4 w-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-zinc-200">Network Probe Sniffer</div>
                    <div className="text-[10px] text-zinc-500">execute_network_tool</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Terminal className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="font-bold text-zinc-200">Code Injunction Runner</div>
                    <div className="text-[10px] text-zinc-500">run_code_injunction</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Wand2 className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="font-bold text-zinc-200">AI Applet Builder</div>
                    <div className="text-[10px] text-zinc-500">synthesize_applet_bundle</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                  READY
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Engine Config */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4 text-white font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="font-bold text-zinc-300">Engine Telemetry</span>
              <span className="text-cyan-400">{selectedModel}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] text-zinc-500">AVG RESPONSE</div>
                <div className="text-base font-black text-cyan-300 mt-0.5">14.2 ms</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] text-zinc-500">SUCCESS RATE</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">100%</div>
              </div>
            </div>

            <div className="space-y-1 text-zinc-400 text-[11px] leading-relaxed">
              All tool invocations are authenticated through the server-side GenAI client with telemetry headers.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
