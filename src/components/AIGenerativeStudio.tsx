import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Mic,
  MicOff,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  Copy,
  Check,
  Download,
  Send,
  Zap,
  Wand2,
  Film,
  Radio,
  Sliders,
  Layers,
  Cpu,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Boxes,
  Bot,
  Terminal,
  Code2,
  Activity,
  Wrench,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Server,
  Lock,
  Globe
} from 'lucide-react';
import { BlockchainIdentityAnchorStudio } from './BlockchainIdentityAnchorStudio';
import { AIAppCreationStudio } from './AIAppCreationStudio';
import { AIChatBotExecutionStudio } from './AIChatBotExecutionStudio';
import { ProtocolHealthMonitor } from './ProtocolHealthMonitor';
import { ProtocolLinterStudio } from './ProtocolLinterStudio';

export type ToolSubMode =
  | 'protocol_health'
  | 'protocol_linter'
  | 'app_creation'
  | 'chat_bot'
  | 'ai_generative'
  | 'voice_to_text'
  | 'text_to_video'
  | 'bte_identity';

export type ToolSectionCategory = 'ALL' | 'DIAGNOSTICS' | 'AI_STUDIO' | 'SECURITY';

interface AIGenerativeStudioProps {
  initialMode?: ToolSubMode | 'execution_bot' | 'ai_chat' | string;
  onNavigateTab?: (tab: string) => void;
}

interface ToolDefinition {
  id: ToolSubMode;
  name: string;
  category: ToolSectionCategory;
  categoryLabel: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  description: string;
  highlightColor: string;
}

const TOOLS_CATALOG: ToolDefinition[] = [
  // 1. Diagnostics & Network Protocols
  {
    id: 'protocol_health',
    name: 'Protocol Health Monitor',
    category: 'DIAGNOSTICS',
    categoryLabel: 'Diagnostic & Protocols',
    icon: Activity,
    badge: 'Real-Time Auto-Repair',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700',
    description: 'Continuous multi-protocol diagnostic linter tracking Active, Idle & Error states with Repair All recovery.',
    highlightColor: 'from-emerald-500 to-cyan-500'
  },
  {
    id: 'protocol_linter',
    name: 'Protocol Linter & Auditor',
    category: 'DIAGNOSTICS',
    categoryLabel: 'Diagnostic & Protocols',
    icon: Layers,
    badge: '37 Protocols',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    description: 'RFC syntax validator, AST binary parser, port collision auditor and cryptographic signature verifier.',
    highlightColor: 'from-purple-500 to-indigo-500'
  },

  // 2. AI Intelligence & Execution Hub
  {
    id: 'app_creation',
    name: 'AI App Creation Studio',
    category: 'AI_STUDIO',
    categoryLabel: 'AI & Execution Hub',
    icon: Sparkles,
    badge: 'AI Studio Engine',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    description: 'Autonomous multi-file web app generator with live code compilation, AST linting, and instant preview.',
    highlightColor: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'chat_bot',
    name: 'Chat Bot Execution Agent',
    category: 'AI_STUDIO',
    categoryLabel: 'AI & Execution Hub',
    icon: Terminal,
    badge: 'Autonomous Bot',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    description: 'Natural language terminal executing network injunctions, server provisioning, and SQL migrations.',
    highlightColor: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'ai_generative',
    name: 'Generative AI Playground',
    category: 'AI_STUDIO',
    categoryLabel: 'AI & Execution Hub',
    icon: Wand2,
    badge: 'Gemini 2.5 Flash',
    badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    description: 'Custom system instruction tuning, multi-node prompt engineering, and structured code synthesis.',
    highlightColor: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'voice_to_text',
    name: 'Voice Speech-to-Text',
    category: 'AI_STUDIO',
    categoryLabel: 'AI & Execution Hub',
    icon: Mic,
    badge: 'Neural Audio',
    badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    description: 'Real-time microphone audio capture, high-fidelity neural transcription, and command extraction.',
    highlightColor: 'from-amber-500 to-orange-500'
  },
  {
    id: 'text_to_video',
    name: 'Text to Video Synthesizer',
    category: 'AI_STUDIO',
    categoryLabel: 'AI & Execution Hub',
    icon: Video,
    badge: '4K Storyboard',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    description: 'Multi-scene kinematic video prompt generator with lighting control, camera dolly, and keyframes.',
    highlightColor: 'from-rose-500 to-pink-500'
  },

  // 3. Security & Cryptographic Anchors
  {
    id: 'bte_identity',
    name: 'BTE-ID Identity Anchor',
    category: 'SECURITY',
    categoryLabel: 'Security & Crypto',
    icon: ShieldCheck,
    badge: 'Ed25519 Anchor',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    description: 'Decentralized identity claims, cryptographic key derivation, DID documents, and sovereign credentials.',
    highlightColor: 'from-cyan-400 to-teal-500'
  }
];

export const AIGenerativeStudio: React.FC<AIGenerativeStudioProps> = ({
  initialMode = 'protocol_health',
  onNavigateTab
}) => {
  const getSubMode = (mode: string): ToolSubMode => {
    if (mode === 'protocol_health' || mode === 'health_monitor') return 'protocol_health';
    if (mode === 'protocol_linter' || mode === 'linter') return 'protocol_linter';
    if (mode === 'chat_bot' || mode === 'execution_bot' || mode === 'ai_chat') return 'chat_bot';
    if (mode === 'voice_to_text') return 'voice_to_text';
    if (mode === 'text_to_video') return 'text_to_video';
    if (mode === 'bte_identity') return 'bte_identity';
    if (mode === 'ai_generative') return 'ai_generative';
    if (mode === 'app_creation') return 'app_creation';
    return 'protocol_health';
  };

  const [activeSubMode, setActiveSubMode] = useState<ToolSubMode>(getSubMode(initialMode));
  const [selectedSection, setSelectedSection] = useState<ToolSectionCategory>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    if (initialMode) {
      setActiveSubMode(getSubMode(initialMode));
    }
  }, [initialMode]);

  // AI Generative State
  const [promptInput, setPromptInput] = useState<string>('');
  const [systemInstruction, setSystemInstruction] = useState<string>(
    'You are the Intentional Infrastructure Network (IIN) AI Node Assistant specializing in server infrastructure, vector DB, and blockchain telemetry.'
  );
  const [isGeneratingText, setIsGeneratingText] = useState<boolean>(false);
  const [generatedTextOutput, setGeneratedTextOutput] = useState<string>('');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Voice to Text State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcriptResult, setTranscriptResult] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number>(0.985);
  const [audioPromptInput, setAudioPromptInput] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Text to Video State
  const [videoPrompt, setVideoPrompt] = useState<string>('Intentional Infrastructure Network (IIN) activating modular server nodes in a futuristic cyber vault');
  const [videoStyle, setVideoStyle] = useState<string>('Cinematic 3D Cyber-Neon');
  const [videoResolution, setVideoResolution] = useState<string>('4K UHD (3840x2160)');
  const [videoDuration, setVideoDuration] = useState<number>(10);
  const [videoFps, setVideoFps] = useState<number>(60);
  const [cameraMovement, setCameraMovement] = useState<string>('360-Degree Orbit & Dolly In');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoResultData, setVideoResultData] = useState<any | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // Auto-play interval for video scene preview
  useEffect(() => {
    let interval: any;
    if (isPlayingVideo && videoResultData?.scenes?.length) {
      interval = setInterval(() => {
        setCurrentSceneIndex(prev => (prev + 1) % videoResultData.scenes.length);
      }, (videoResultData.durationSeconds * 1000) / videoResultData.scenes.length);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingVideo, videoResultData]);

  // Handle Text Generation
  const handleGenerateAI = async () => {
    if (!promptInput.trim()) return;
    setIsGeneratingText(true);
    setGeneratedTextOutput('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          systemInstruction
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedTextOutput(data.text);
      } else {
        setGeneratedTextOutput('Generation error: ' + (data.error || 'Failed to generate output'));
      }
    } catch (err: any) {
      setGeneratedTextOutput('Network error connecting to SubNet AI node.');
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Handle Microphone Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await processVoiceToText(base64Audio);
        };
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      simulateVoiceCapture();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
  };

  const simulateVoiceCapture = async () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timerIntervalRef.current);
      setIsRecording(false);
      processVoiceToText('');
    }, 4000);
  };

  const processVoiceToText = async (audioBase64: string) => {
    setIsTranscribing(true);
    try {
      const res = await fetch('/api/ai/voice-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType: 'audio/wav',
          prompt: audioPromptInput || promptInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setTranscriptResult(data.transcription);
        setConfidenceScore(data.confidenceScore || 0.982);
      }
    } catch (err) {
      console.error('Voice to text error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle Text to Video Generation
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);
    setVideoResultData(null);
    setIsPlayingVideo(false);
    setCurrentSceneIndex(0);

    try {
      const res = await fetch('/api/ai/text-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          style: videoStyle,
          resolution: videoResolution,
          duration: videoDuration,
          fps: videoFps,
          cameraMovement
        })
      });
      const data = await res.json();
      if (data.success) {
        setVideoResultData(data);
        setIsPlayingVideo(true);
      }
    } catch (err) {
      console.error('Text to video error:', err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Filtered list of tools based on Section and Search
  const filteredTools = TOOLS_CATALOG.filter(tool => {
    if (selectedSection !== 'ALL' && tool.category !== selectedSection) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeToolDef = TOOLS_CATALOG.find(t => t.id === activeSubMode) || TOOLS_CATALOG[0];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 font-sans text-white">
      
      {/* 1. TOP HEADER & SECTION CLASSIFICATION BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-zinc-800 pb-5">
        
        {/* Title */}
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-cyan-500/30 text-cyan-300 shadow-lg">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center space-x-2">
                <span className="font-mono text-cyan-400 font-bold">IIN</span>
                <span>Tools &amp; Diagnostic Workspace</span>
              </h2>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">
                Enterprise Hub
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Protocol Health Monitor, Auto-Repair Engines, Autonomous AI Agent Studios &amp; Cryptographic Toolsets
            </p>
          </div>
        </div>

        {/* Section Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 font-mono text-xs shadow-md">
          {[
            { id: 'ALL', label: 'All Tools' },
            { id: 'DIAGNOSTICS', label: 'Diagnostics & Protocols' },
            { id: 'AI_STUDIO', label: 'AI & Execution Hub' },
            { id: 'SECURITY', label: 'Security & Crypto' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedSection === sec.id
                  ? 'bg-cyan-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

      </div>

      {/* 2. CATEGORIZED TOOL SELECTOR CARDS / PILLS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {filteredTools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeSubMode === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setActiveSubMode(tool.id)}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 cursor-pointer group relative overflow-hidden ${
                isActive
                  ? 'bg-zinc-900 border-cyan-400/80 ring-2 ring-cyan-500/20 shadow-lg'
                  : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl border ${
                    isActive
                      ? 'bg-cyan-500 text-black border-cyan-400 font-black'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {tool.id === 'protocol_health' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>

              <div>
                <div className={`font-mono text-[11px] font-black line-clamp-1 ${isActive ? 'text-cyan-300' : 'text-white'}`}>
                  {tool.name}
                </div>
                <div className="text-[9px] text-zinc-500 font-mono mt-0.5 line-clamp-1">
                  {tool.categoryLabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE TOOL VIEW CONTAINER */}
      <div className="pt-2">

        {/* TAB 1: PROTOCOL HEALTH MONITOR (WITH AUTO-REPAIR & REPAIR ALL) */}
        {activeSubMode === 'protocol_health' && (
          <motion.div
            key="protocol_health_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProtocolHealthMonitor />
          </motion.div>
        )}

        {/* TAB 2: PROTOCOL LINTER & AUDITOR */}
        {activeSubMode === 'protocol_linter' && (
          <motion.div
            key="protocol_linter_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProtocolLinterStudio />
          </motion.div>
        )}

        {/* TAB 3: AI APP CREATION STUDIO */}
        {activeSubMode === 'app_creation' && (
          <motion.div
            key="app_creation_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AIAppCreationStudio />
          </motion.div>
        )}

        {/* TAB 4: CHAT BOT EXECUTION AGENT */}
        {activeSubMode === 'chat_bot' && (
          <motion.div
            key="chat_bot_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AIChatBotExecutionStudio onNavigateTab={onNavigateTab} />
          </motion.div>
        )}

        {/* TAB 5: GENERATIVE AI PLAYGROUND */}
        {activeSubMode === 'ai_generative' && (
          <motion.div
            key="ai_generative_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Input Controls */}
              <div className="lg:col-span-1 space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span>System Instruction</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Node Persona</span>
                  </label>
                  <textarea
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                    rows={3}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="System role instructions..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 font-mono">Quick Prompt Templates</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      'Analyze server node telemetry & vector embeddings',
                      'Synthesize $DPO asset vault staking yield code',
                      'Generate Nginx gateway proxy routing injunction',
                      'Diagnose DNS domain latency across SubNet nodes'
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPromptInput(preset)}
                        className="text-left text-[11px] p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
                      >
                        ⚡ {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prompt Area & Generated Output */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span>Generative AI Prompt Input</span>
                    <span className="text-[10px] font-mono text-cyan-400">Powered by Gemini 2.5 Flash</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      rows={4}
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 pr-24 font-sans"
                      placeholder="Enter what you want SubNet AI to generate, analyze, or program..."
                    />
                    <button
                      onClick={handleGenerateAI}
                      disabled={isGeneratingText || !promptInput.trim()}
                      className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer"
                    >
                      {isGeneratingText ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Run Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output Area */}
                <div className="bg-black border border-zinc-800 rounded-2xl p-4 min-h-[260px] space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="text-xs font-bold text-zinc-400 font-mono flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Synthesized Output</span>
                    </span>
                    {generatedTextOutput && (
                      <button
                        onClick={() => handleCopyText(generatedTextOutput)}
                        className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1 font-mono cursor-pointer"
                      >
                        {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedText ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  {generatedTextOutput ? (
                    <div className="text-xs text-zinc-200 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto pr-2">
                      {generatedTextOutput}
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-600 font-mono italic text-center pt-16">
                      Awaiting prompt dispatch... The generated response will stream here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: VOICE TO TEXT */}
        {activeSubMode === 'voice_to_text' && (
          <motion.div
            key="voice_to_text_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mic Controls */}
              <div className="lg:col-span-1 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/20'
                        : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-black hover:scale-105'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                  </button>
                  {isRecording && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-600 text-rose-300 text-[10px] font-mono font-bold">
                      {recordingSeconds}s
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-sm text-white">
                    {isRecording ? 'Listening & Streaming Audio...' : 'Click Mic to Record Voice'}
                  </div>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Transcribe spoken developer commands, network prompts, or node queries instantly.
                  </p>
                </div>
              </div>

              {/* Transcript Display */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-black border border-zinc-800 rounded-2xl p-5 min-h-[300px] space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-xs font-bold text-zinc-400 font-mono flex items-center space-x-1.5">
                        <FileText className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Speech-to-Text Transcription</span>
                      </span>
                      {transcriptResult && (
                        <div className="flex items-center space-x-3 text-xs font-mono">
                          <span className="text-emerald-400 font-bold">Confidence: {(confidenceScore * 100).toFixed(1)}%</span>
                          <button
                            onClick={() => handleCopyText(transcriptResult)}
                            className="text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isTranscribing ? (
                      <div className="text-center py-16 space-y-2">
                        <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin mx-auto" />
                        <div className="text-xs text-zinc-400 font-mono">Neural speech processing in progress...</div>
                      </div>
                    ) : transcriptResult ? (
                      <div className="text-sm text-zinc-100 font-sans leading-relaxed p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                        "{transcriptResult}"
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-600 font-mono italic text-center py-16">
                        Speak into the microphone to stream your voice transcription.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: TEXT TO VIDEO */}
        {activeSubMode === 'text_to_video' && (
          <motion.div
            key="text_to_video_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="lg:col-span-1 space-y-4 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Video Prompt</label>
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                    placeholder="Describe scene concept..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Visual Style</label>
                  <input
                    type="text"
                    value={videoStyle}
                    onChange={(e) => setVideoStyle(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-zinc-400 text-[10px]">Resolution</label>
                    <input
                      type="text"
                      value={videoResolution}
                      onChange={(e) => setVideoResolution(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-[11px] text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-400 text-[10px]">FPS / Duration</label>
                    <div className="p-2 bg-black border border-zinc-800 rounded-lg text-[11px] text-white mt-1">
                      {videoFps} FPS ({videoDuration}s)
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !videoPrompt.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isGeneratingVideo ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Synthesizing Storyboard...</span>
                    </>
                  ) : (
                    <>
                      <Film className="h-4 w-4" />
                      <span>Synthesize 4K Storyboard</span>
                    </>
                  )}
                </button>
              </div>

              {/* Storyboard View */}
              <div className="lg:col-span-2">
                {videoResultData ? (
                  <div className="space-y-4">
                    <div
                      className="relative rounded-2xl overflow-hidden border border-zinc-800 p-6 min-h-[280px] flex flex-col justify-between shadow-2xl"
                      style={{
                        background: videoResultData.scenes[currentSceneIndex]?.keyframeBg || 'linear-gradient(135deg, #020617, #06b6d4)'
                      }}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-white">
                        <span className="font-bold uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                          Scene {currentSceneIndex + 1} of {videoResultData.scenes.length}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-bold">
                          {videoResultData.resolution}
                        </span>
                      </div>

                      <div className="my-auto text-center space-y-2 py-6">
                        <h4 className="text-xl font-black text-white drop-shadow-lg">
                          {videoResultData.scenes[currentSceneIndex]?.title}
                        </h4>
                        <p className="text-xs text-white/90 max-w-md mx-auto bg-black/50 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                          "{videoResultData.scenes[currentSceneIndex]?.visualDescription}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md flex items-center space-x-1.5 cursor-pointer"
                        >
                          {isPlayingVideo ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                          <span>{isPlayingVideo ? 'Pause' : 'Play Storyboard'}</span>
                        </button>

                        <div className="flex items-center space-x-1.5">
                          {(videoResultData?.scenes || []).map((_: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCurrentSceneIndex(idx);
                                setIsPlayingVideo(false);
                              }}
                              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                                currentSceneIndex === idx ? 'bg-cyan-400 scale-125' : 'bg-zinc-600 hover:bg-zinc-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black border border-zinc-800 rounded-2xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[340px]">
                    <Film className="h-12 w-12 text-rose-500/40 animate-pulse" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white font-mono">Text-to-Video Storyboard Generator</h4>
                      <p className="text-xs text-zinc-500 max-w-md">
                        Configure your prompt on the left and click "Synthesize 4K Storyboard" to render multi-scene keyframes.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 8: BTE IDENTITY */}
        {activeSubMode === 'bte_identity' && (
          <motion.div
            key="bte_identity_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BlockchainIdentityAnchorStudio />
          </motion.div>
        )}

      </div>
    </div>
  );
};
