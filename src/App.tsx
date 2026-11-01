import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { AIThemeModal } from './components/AIThemeModal';
import { NetworkTopologyCanvas } from './components/NetworkTopologyCanvas';
import { ServerManager } from './components/ServerManager';
import { CodeInjunctionStudio } from './components/CodeInjunctionStudio';
import { N8nServersWorkspace } from './components/N8nServersWorkspace';
import { RadarWorkspace } from './components/RadarWorkspace';
import { OobPenTestWorkspace } from './components/OobPenTestWorkspace';
import { CacheDumpingWorkspace } from './components/CacheDumpingWorkspace';
import { AdvancedTelemetryWorkspace } from './components/AdvancedTelemetryWorkspace';
import { BlockchainTelemetryWorkspace } from './components/BlockchainTelemetryWorkspace';
import { BtcSolParityWorkspace } from './components/BtcSolParityWorkspace';
import { SmartContractVaultStudio } from './components/SmartContractVaultStudio';
import { OpenSourceHub } from './components/OpenSourceHub';
import { NetworkToolsConsole } from './components/NetworkToolsConsole';
import { LiveTradingChart } from './components/LiveTradingChart';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { VirtualProtocolProxyStudio } from './components/VirtualProtocolProxyStudio';
import { HostingWorkspace } from './components/HostingWorkspace';
import { NetworkHealthAnalyticsDashboard } from './components/NetworkHealthAnalyticsDashboard';
import { OpenSeaIntegrationStudio } from './components/OpenSeaIntegrationStudio';
import { X16OsUiTelemetryStudio } from './components/X16OsUiTelemetryStudio';
import { GaslessTokenDeployerStudio } from './components/GaslessTokenDeployerStudio';
import { DigitalServerAssetVaultStudio } from './components/DigitalServerAssetVaultStudio';
import { WindowsServerSandboxStudio } from './components/WindowsServerSandboxStudio';
import { WebServerGatewayProxyStudio } from './components/WebServerGatewayProxyStudio';
import { GatesCircuitTelemetryStudio } from './components/GatesCircuitTelemetryStudio';
import { AIGenerativeStudio } from './components/AIGenerativeStudio';
import { DatabasePluginCredentialsStudio } from './components/DatabasePluginCredentialsStudio';
import { FirewallEnvironmentStudio } from './components/FirewallEnvironmentStudio';
import { IntentionalVisionStudio } from './components/IntentionalVisionStudio';
import { ClassifiedsStudio } from './components/ClassifiedsStudio';
import { EcommerceStudio } from './components/EcommerceStudio';
import { HostedWebBrowserStudio } from './components/HostedWebBrowserStudio';
import { NetworkToolsVendorServicesStudio } from './components/NetworkToolsVendorServicesStudio';
import { AdvanceCryptographicToolsStudio } from './components/AdvanceCryptographicToolsStudio';
import { AIAssistantBotStudio } from './components/AIAssistantBotStudio';
import { GoogleMapsGeoLocationStudio } from './components/GoogleMapsGeoLocationStudio';
import { AiTopToolsDirectoryStudio } from './components/AiTopToolsDirectoryStudio';
import { Web3FarmingStudio } from './components/Web3FarmingStudio';
import { DecentralizedInternetOwnershipStudio } from './components/DecentralizedInternetOwnershipProtocol/DecentralizedInternetOwnershipStudio';
import { BlockchainIdentityAnchorStudio } from './components/BlockchainIdentityAnchorStudio';
import { InclusiveProtocolEngineStudio } from './components/InclusiveProtocolEngineStudio';
import { VirtualInternetStudio } from './components/VirtualInternet/VirtualInternetStudio';
import { FounderStudio } from './components/FounderStudio';
import { GlobalCommandPalette } from './components/GlobalCommandPalette';
import { EnterpriseFooter } from './components/EnterpriseFooter';
import { IcrLogo } from './components/IcrLogo';
import { AppLivePreviewModal } from './components/AppLivePreviewModal';
import { 
  Terminal, 
  Blocks, 
  Activity, 
  Code2, 
  Server, 
  Radio, 
  Layers, 
  Database, 
  Workflow, 
  ShieldCheck, 
  FolderGit2, 
  TrendingUp, 
  Sparkles,
  Network,
  Globe,
  Zap,
  Vault,
  Tag,
  ShoppingBag,
  Coins,
  Monitor,
  Atom,
  Wand2,
  Mic,
  Video,
  Camera,
  Key,
  ShieldAlert,
  Lock,
  FileText,
  Wrench,
  BookOpen,
  Bot,
  User,
  LogOut,
  Sun,
  Moon,
  Dices,
  Palette,
  CheckCircle2,
  RefreshCw,
  Search,
  Send,
  Command,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { 
  PrivateServer, 
  CodeInjunction, 
  OpenSourceProject, 
  NetworkNode, 
  NetworkToolRequest, 
  NetworkToolResponse 
} from './types';
import { ThemeId } from './types/theme';
import { THEME_PRESETS, getRandomThemeId } from './utils/themePresets';
import { initialOpenSourceProjects, initialNetworkNodes } from './data/initialData';

// Custom layout-slide staggered animation variants for workspace switching
const layoutSlideVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.985,
    filter: 'blur(2px)',
    transition: {
      duration: 0.18,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('advance_crypto_tools');
  const [selectedCryptoSubTool, setSelectedCryptoSubTool] = useState<string>('injunctions');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  
  // AI Theme Management State
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('vox_ai_theme_id');
    return (saved && saved in THEME_PRESETS) ? (saved as ThemeId) : 'shades-of-black';
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isAutoCycleActive, setIsAutoCycleActive] = useState<boolean>(false);
  const [themeToast, setThemeToast] = useState<{ title: string; subtitle: string; icon: string } | null>(null);

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isGlobalPreviewModalOpen, setIsGlobalPreviewModalOpen] = useState<boolean>(false);
  const [heroAiPrompt, setHeroAiPrompt] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: 'admin' | 'user' } | null>({
    email: 'operator@vox.network',
    name: 'VOX Operator',
    role: 'admin'
  });

  const handleHeroAiSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = heroAiPrompt.trim();
    if (!q) return;

    const lower = q.toLowerCase();
    if (lower.includes('health') || lower.includes('lint') || lower.includes('audit') || lower.includes('repair')) {
      setActiveTab('advance_crypto_tools');
      setSelectedCryptoSubTool('protocol_health');
    } else if (lower.includes('injunction') || lower.includes('code') || lower.includes('smtp') || lower.includes('email') || lower.includes('sms')) {
      setActiveTab('advance_crypto_tools');
      setSelectedCryptoSubTool('injunctions');
    } else if (lower.includes('farm') || lower.includes('depo') || lower.includes('yield') || lower.includes('stake')) {
      setActiveTab('web3_farming');
    } else if (lower.includes('vip') || lower.includes('virtual internet') || lower.includes('vnet') || lower.includes('packet')) {
      setActiveTab('virtual_internet');
    } else if (lower.includes('diop') || lower.includes('protocol') || lower.includes('vsp') || lower.includes('nip')) {
      setActiveTab('protocols');
    } else if (lower.includes('server') || lower.includes('docker') || lower.includes('node') || lower.includes('container') || lower.includes('mesh')) {
      setActiveTab('advance_crypto_tools');
      setSelectedCryptoSubTool('server_manager');
    } else if (lower.includes('theme') || lower.includes('palette') || lower.includes('shuffle') || lower.includes('milk')) {
      handleRandomTheme();
    } else if (lower.includes('search') || lower.includes('find') || lower.includes('open') || lower.includes('jump')) {
      setIsCommandPaletteOpen(true);
    } else {
      setActiveTab('chat_bot');
      setAiDrawerOpen(true);
    }

    setHeroAiPrompt('');
  };

  // Global Cmd+K / Ctrl+K keyboard shortcut for Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const activeThemePreset = THEME_PRESETS[currentThemeId] || THEME_PRESETS['shades-of-black'];

  // Apply Theme Function
  const applyTheme = (themeId: ThemeId, showToast = true) => {
    const preset = THEME_PRESETS[themeId];
    if (!preset) return;
    setCurrentThemeId(themeId);
    setThemeMode(preset.isDark ? 'dark' : 'light');
    localStorage.setItem('vox_ai_theme_id', themeId);

    // Apply CSS Variables on Document Root
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', preset.accentColor);
    root.style.setProperty('--theme-border', preset.secondaryColor);

    if (showToast) {
      setThemeToast({
        title: `Active Theme: ${preset.name}`,
        subtitle: `${preset.aiPromptMood} • ${preset.isDark ? 'Shades of Black' : 'Light Canvas'}`,
        icon: preset.isDark ? '🖤' : '✨'
      });
      setTimeout(() => {
        setThemeToast(null);
      }, 3500);
    }
  };

  const handleRandomTheme = () => {
    const nextThemeId = getRandomThemeId(currentThemeId);
    applyTheme(nextThemeId, true);
  };

  // Auto-Cycle Effect if enabled
  useEffect(() => {
    if (!isAutoCycleActive) return;
    const interval = setInterval(() => {
      const nextThemeId = getRandomThemeId(currentThemeId);
      applyTheme(nextThemeId, true);
    }, 45000);
    return () => clearInterval(interval);
  }, [isAutoCycleActive, currentThemeId]);

  const defaultFallbackServers: PrivateServer[] = [
    {
      id: "srv-edge-01",
      name: "VOX-Alpha-Edge-Gateway",
      type: "gateway_proxy",
      ipAddress: "10.142.0.12",
      port: 8080,
      subnetId: "vox-subnet-us-east",
      status: "online",
      cpuUsage: 18,
      ramUsage: 1024,
      maxRam: 4096,
      latencyMs: 14,
      servicesRunning: ["Nginx Reverse Proxy", "WireGuard SSL VPN", "TLS Router"],
      os: "Ubuntu 22.04 LTS",
      dockerImage: "nginx:alpine-slim",
      envVars: { ENV: "production", MAX_CONN: "10000", LOG_LEVEL: "info" },
      createdAt: new Date().toISOString(),
      logs: [
        "[INFO] VOX Gateway initialized on 10.142.0.12:8080",
        "[SYSTEM] WireGuard tunnel established to vox-subnet-us-east",
        "[HEALTH] VOX sync heartbeat normal (14ms latency)"
      ]
    },
    {
      id: "srv-vector-02",
      name: "VOX-Neural-Vector-Store",
      type: "vector_db",
      ipAddress: "10.142.0.45",
      port: 6379,
      subnetId: "vox-subnet-us-east",
      status: "online",
      cpuUsage: 34,
      ramUsage: 2840,
      maxRam: 8192,
      latencyMs: 22,
      servicesRunning: ["Qdrant Vector Cluster", "Redis Memory Cache"],
      os: "Alpine Linux 3.19",
      dockerImage: "qdrant/qdrant:v1.7",
      envVars: { STORAGE_ENGINE: "memory_mapped", VECTOR_DIM: "1536" },
      createdAt: new Date().toISOString(),
      logs: [
        "[INFO] Vector index initialized with 1536 dimensions",
        "[SYNC] Shared RAM state synchronized with VOX-Alpha-Edge-Gateway"
      ]
    }
  ];

  const defaultFallbackInjunctions: CodeInjunction[] = [
    {
      id: "inj-00-depo",
      name: "DEPO_Token_Code_Injunction",
      description: "Automated code injunction dispatcher for DEPO ($DPO) coin transactions, batch minting, automated staking rewards, and webhook event relays.",
      language: "typescript",
      triggerType: "ai_tool",
      parameters: [
        { name: "coinSymbol", type: "string", required: true, description: "Coin Symbol (DEPO / $DPO)", defaultValue: "$DPO" },
        { name: "amount", type: "number", required: true, description: "Amount of DEPO coins to execute in injunction", defaultValue: 10000 },
        { name: "targetAddress", type: "string", required: true, description: "Target wallet address for DEPO injunction", defaultValue: "0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C" }
      ],
      code: `function execute(params) {\n  const { coinSymbol = "$DPO", amount = 10000 } = params;\n  return { success: true, coinSymbol, amountExecuted: amount, timestamp: new Date().toISOString() };\n}`,
      executionCount: 64,
      lastRunTime: new Date().toISOString(),
      lastExecutionLog: "[DEPO INJUNCTION] Transacted 10,000 $DPO (DEPO) coin via automated code injunction pipeline."
    }
  ];

  const [servers, setServers] = useState<PrivateServer[]>(defaultFallbackServers);
  const [injunctions, setInjunctions] = useState<CodeInjunction[]>(defaultFallbackInjunctions);
  const [openSourceProjects, setOpenSourceProjects] = useState<OpenSourceProject[]>(initialOpenSourceProjects);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>(initialNetworkNodes);
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);
  const [targetPingIp, setTargetPingIp] = useState<string>('10.142.0.12');
  const [pingMs, setPingMs] = useState<number>(14);

  // Initial Fetch from backend
  useEffect(() => {
    fetchServers();
    fetchInjunctions();

    // Ping simulator
    const interval = setInterval(() => {
      setPingMs(Math.floor(12 + Math.random() * 8));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchServers = async () => {
    try {
      const res = await fetch('/api/servers');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setServers(data);
        } else if (data && Array.isArray(data.servers)) {
          setServers(data.servers);
        }
      }
    } catch (err) {
      console.warn('Backend server endpoint not available, using default fallback servers.');
    }
  };

  const fetchInjunctions = async () => {
    try {
      const res = await fetch('/api/injunctions');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInjunctions(data);
        } else if (data && Array.isArray(data.injunctions)) {
          setInjunctions(data.injunctions);
        }
      }
    } catch (err) {
      console.warn('Backend injunctions endpoint not available, using default fallbacks.');
    }
  };

  const handleDeleteServer = async (serverId: string) => {
    setServers(prev => prev.filter(s => s.id !== serverId));
  };

  const handleRestartServer = async (serverId: string) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'online', logs: [...(s.logs || []), `[RESTART] Server restarted at ${new Date().toLocaleTimeString()}`] } : s));
  };

  const handleCreateInjunction = (injunctionData: Partial<CodeInjunction>) => {
    const newInj: CodeInjunction = {
      id: `inj-${Date.now()}`,
      name: injunctionData.name || 'Custom Injunction',
      description: injunctionData.description || 'User-defined code injunction',
      language: injunctionData.language || 'typescript',
      triggerType: injunctionData.triggerType || 'manual',
      parameters: injunctionData.parameters || [],
      code: injunctionData.code || '// custom code',
      executionCount: 0,
      lastRunTime: new Date().toISOString()
    };
    setInjunctions(prev => [newInj, ...prev]);
  };

  const handleExecuteInjunction = async (injunctionId: string, params: Record<string, any>) => {
    setInjunctions(prev => prev.map(inj => {
      if (inj.id === injunctionId) {
        return {
          ...inj,
          executionCount: inj.executionCount + 1,
          lastRunTime: new Date().toISOString(),
          lastExecutionLog: `[EXEC SUCCESS] Executed ${inj.name} with params: ${JSON.stringify(params)}`
        };
      }
      return inj;
    }));
    return { success: true, message: 'Injunction executed successfully' };
  };

  // Login & Logout Handlers
  const handleLogin = (userData: { email: string; name: string; role: 'admin' | 'user' }) => {
    setCurrentUser(userData);
    if (userData.role === 'admin') {
      setIsAdminMode(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
  };

  // Server Handlers
  const handleGenerateServer = async (serverData: Partial<PrivateServer>) => {
    try {
      const res = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData)
      });
      if (res.ok) {
        const newServer = await res.json();
        setServers(prev => [newServer, ...prev]);
      } else {
        const fallback: PrivateServer = {
          id: `srv-${Date.now()}`,
          name: serverData.name || 'VOX-Node',
          type: serverData.type || 'microservice',
          ipAddress: `10.142.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 250)}`,
          port: 8080,
          subnetId: 'vox-subnet-primary',
          status: 'online',
          cpuUsage: 12,
          ramUsage: 512,
          maxRam: 4096,
          latencyMs: 16,
          servicesRunning: serverData.servicesRunning || ['Docker', 'VOX Agent'],
          os: serverData.os || 'Ubuntu 22.04 LTS',
          dockerImage: serverData.dockerImage || 'node:alpine',
          envVars: { ENV: 'production' },
          createdAt: new Date().toISOString(),
          logs: ['[INFO] VOX Node initialized']
        };
        setServers(prev => [fallback, ...prev]);
      }
    } catch (err) {
      console.error('Error creating server:', err);
    }
  };

  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans antialiased ${
      activeThemePreset.bgClass
    } ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCryptoSubTool={selectedCryptoSubTool}
        setSelectedCryptoSubTool={setSelectedCryptoSubTool}
        servers={servers}
        serverCount={(servers || []).length}
        injunctionCount={(injunctions || []).length}
        aiDrawerOpen={aiDrawerOpen}
        setAiDrawerOpen={setAiDrawerOpen}
        isSearchOpen={isCommandPaletteOpen}
        setIsSearchOpen={setIsCommandPaletteOpen}
        onQuickGenerateServer={() => handleGenerateServer({ name: 'VOX-Quick-Node' })}
        pingMs={pingMs}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        currentThemeId={currentThemeId}
        onSelectTheme={applyTheme}
        onRandomTheme={handleRandomTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace Container with Spacious Max Width */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6">
        
        {/* PLAIN & CLEAN HERO BANNER */}
        <div id="hero-display-banner" className={`mb-6 relative overflow-hidden border rounded-3xl p-6 sm:p-8 transition-all vox-spacious-card ${
          isDark 
            ? 'bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black border-zinc-800/80 shadow-lg shadow-black/30' 
            : 'bg-gradient-to-br from-[#ffffff] via-[#faf6ee] to-[#f4edd9] border-[#e8dfd3] shadow-sm'
        }`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Plain & Clean Title & Network Overview */}
            <div className="space-y-3 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border flex items-center space-x-1.5 ${
                  isDark ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' : 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>Integrational Compute Repository (ICR)</span>
                </span>
                
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border flex items-center space-x-1.5 ${
                  isDark ? 'bg-zinc-900/80 text-emerald-400 border-zinc-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Mesh Synced (99.98%) • {pingMs}ms</span>
                </span>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                  isDark ? 'bg-zinc-900/60 text-zinc-400 border-zinc-800' : 'bg-[#faf6ee] text-[#78716c] border-[#e8dfd3]'
                }`}>
                  18 Cryptographic Tools • 20 VIP • 17 DIOP
                </span>

                {/* Founder Profile Quick Link */}
                <button
                  onClick={() => setActiveTab('founder')}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTab === 'founder'
                      ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                      : isDark
                        ? 'bg-amber-950/70 text-amber-300 border-amber-800 hover:bg-amber-900/80'
                        : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  }`}
                >
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  <span>Dr. Victor — Founder</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <IcrLogo size={46} isDark={isDark} withGlow={true} />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  <span className={`bg-gradient-to-r ${isDark ? 'from-white via-zinc-200 to-zinc-400' : 'from-[#1c1917] via-[#44403c] to-[#78350f]'} bg-clip-text text-transparent`}>
                    Integrational Compute Repository (ICR)
                  </span>
                </h1>
              </div>

              <p className={`text-xs sm:text-sm font-mono leading-relaxed max-w-3xl ${isDark ? 'text-zinc-400' : 'text-[#57534e]'}`}>
                Decentralized Sovereign Internet &amp; Cryptographic Architecture — High-performance computing environment powered by automated code injunctions, virtual container nodes, post-quantum cryptographic verifiers, and multi-protocol mesh routing.
              </p>
            </div>

            {/* Subtle Right Status Pill & Founder Quick Action */}
            <div className="hidden lg:flex flex-col items-end justify-center shrink-0 font-mono text-xs text-right space-y-2">
              <button
                onClick={() => setActiveTab('founder')}
                className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'founder'
                    ? 'bg-amber-400 text-black border-amber-300 font-bold'
                    : isDark 
                      ? 'bg-zinc-900/90 border-amber-500/40 text-amber-300 hover:bg-zinc-800' 
                      : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span className="font-bold">Founder Profile</span>
              </button>

              <div className={`px-3 py-1 rounded-xl border ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400' : 'bg-white border-[#e8dfd3] text-[#44403c]'
              }`}>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Theme: {activeThemePreset.name}</span>
                <span className="text-[10px] text-zinc-500">v1.0.4 Sovereign Release</span>
              </div>
            </div>

          </div>

        </div>

        {/* WORKSPACE CONTENT ROUTER */}
        <AnimatePresence mode="wait">

          {/* Founder Profile Studio */}
          {activeTab === 'founder' && (
            <motion.div
              key="founder_workspace"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <FounderStudio onNavigateTab={setActiveTab} isDark={isDark} />
            </motion.div>
          )}
          
          {/* Virtual Internet Protocol (VIP) Platform Studio */}
          {(activeTab === 'virtual_internet' || activeTab === 'vip') && (
            <motion.div
              key="virtual_internet_workspace"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <VirtualInternetStudio />
            </motion.div>
          )}

          {/* Advance Cryptographic Tools Studio */}
          {activeTab === 'advance_crypto_tools' && (
            <motion.div
              key="advance_crypto_tools"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <AdvanceCryptographicToolsStudio
                servers={servers}
                injunctions={injunctions}
                networkNodes={networkNodes}
                selectedSubTool={selectedCryptoSubTool}
                onSelectSubTool={setSelectedCryptoSubTool}
                onNavigateTab={setActiveTab}
                onCreateInjunction={handleCreateInjunction}
                onExecuteInjunction={handleExecuteInjunction}
                onGenerateServer={handleGenerateServer}
                onDeleteServer={handleDeleteServer}
                onRestartServer={handleRestartServer}
              />
            </motion.div>
          )}

          {/* Decentralized Internet Ownership & Protocols Studio */}
          {(activeTab === 'protocols' || activeTab === 'diop_protocols') && (
            <motion.div
              key="diop_protocols"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <DecentralizedInternetOwnershipStudio />
            </motion.div>
          )}

          {/* Inclusive Protocol Engine Studio Workspace */}
          {activeTab === 'protocol_engine' && (
            <motion.div
              key="protocol_engine_workspace"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <InclusiveProtocolEngineStudio onSelectSubTool={(subTool) => {
                setSelectedCryptoSubTool(subTool);
                setActiveTab('advance_crypto_tools');
              }} />
            </motion.div>
          )}

          {/* BTE-ID v1 Blockchain Identity Anchor Workspace */}
          {(activeTab === 'identity_anchor' || activeTab === 'bte_identity') && (
            <motion.div
              key="bte_identity_workspace"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <BlockchainIdentityAnchorStudio onSelectSubTool={(subTool) => {
                setSelectedCryptoSubTool(subTool);
                setActiveTab('advance_crypto_tools');
              }} />
            </motion.div>
          )}

          {/* Dedicated AI Assistant Bot Studio Tab */}
          {(activeTab === 'ai_assistant_bot' || activeTab === 'ai_assistant' || activeTab === 'assistant_bot') && (
            <motion.div
              key="ai_assistant_bot_workspace"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <AIAssistantBotStudio 
                servers={servers}
                injunctions={injunctions}
                networkNodes={networkNodes}
                onNavigateTab={setActiveTab}
                onCreateServer={handleGenerateServer}
                onCreateInjunction={handleCreateInjunction}
                onExecuteInjunction={handleExecuteInjunction}
              />
            </motion.div>
          )}

          {/* Google Maps Real-Time Geo-Location Schematics Tab */}
          {(activeTab === 'geo_map' || activeTab === 'google_map' || activeTab === 'geolocation' || activeTab === 'geo_schematics' || activeTab === 'maps') && (
            <motion.div
              key="google_maps_geo_workspace"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <GoogleMapsGeoLocationStudio
                servers={servers}
                onNavigateTab={setActiveTab}
              />
            </motion.div>
          )}

          {/* AITopTools Directory & Dynamic AI Function Toggler Tab */}
          {(activeTab === 'ai_top_tools' || activeTab === 'top_tools' || activeTab === 'tools_directory' || activeTab === 'aitoptools') && (
            <motion.div
              key="ai_top_tools_workspace"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <AiTopToolsDirectoryStudio
                onNavigateTab={setActiveTab}
              />
            </motion.div>
          )}

          {/* VOX AI & Tools Workspace (Protocol Health, App Creation Studio, Chat Bot Execution, Voice, Video, Playground) */}
          {(activeTab === 'tools' || activeTab === 'protocol_health' || activeTab === 'protocol_linter' || activeTab === 'voice_to_text' || activeTab === 'text_to_video' || activeTab === 'app_creation' || activeTab === 'chat_bot' || activeTab === 'ai_chat' || activeTab === 'execution_bot') && (
            <motion.div
              key="tools"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <AIGenerativeStudio 
                initialMode={
                  activeTab === 'protocol_health' ? 'protocol_health' :
                  activeTab === 'protocol_linter' ? 'protocol_linter' :
                  activeTab === 'chat_bot' || activeTab === 'ai_chat' || activeTab === 'execution_bot' ? 'chat_bot' :
                  activeTab === 'voice_to_text' ? 'voice_to_text' :
                  activeTab === 'text_to_video' ? 'text_to_video' :
                  activeTab === 'app_creation' ? 'app_creation' :
                  'protocol_health'
                }
                onNavigateTab={setActiveTab}
              />
            </motion.div>
          )}

          {/* VOX Tech Blog & Hosted Pages */}
          {activeTab === 'hosted_pages' && (
            <motion.div
              key="hosted_pages"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <HostedWebBrowserStudio onNavigateTab={setActiveTab} />
            </motion.div>
          )}

          {/* Network Tools & Vendor Hub */}
          {activeTab === 'network_tools_vendors' && (
            <motion.div
              key="network_tools_vendors"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <NetworkToolsVendorServicesStudio onNavigateTab={setActiveTab} />
            </motion.div>
          )}

          {/* Classifieds P2P */}
          {activeTab === 'classifieds' && (
            <motion.div
              key="classifieds"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <ClassifiedsStudio />
            </motion.div>
          )}

          {/* Marketplace */}
          {activeTab === 'ecommerce' && (
            <motion.div
              key="ecommerce"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <EcommerceStudio />
            </motion.div>
          )}

          {/* Web3 $DEPO Yield Farming Studio */}
          {activeTab === 'web3_farming' && (
            <motion.div
              key="web3_farming"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <Web3FarmingStudio />
            </motion.div>
          )}

          {/* Open Source Hub */}
          {activeTab === 'opensource' && (
            <motion.div
              key="opensource"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <OpenSourceHub projects={openSourceProjects} onDeploy={handleGenerateServer} />
            </motion.div>
          )}

          {/* Dex Trading Chart */}
          {activeTab === 'trading_chart' && (
            <motion.div
              key="trading_chart"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <LiveTradingChart />
            </motion.div>
          )}

          {/* Smart Contracts & Token Vaults */}
          {activeTab === 'btc_sol_parity' && (
            <motion.div
              key="btc_sol_parity"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <BtcSolParityWorkspace />
            </motion.div>
          )}

          {/* Digital Server Asset Vault */}
          {activeTab === 'digital_asset_vault' && (
            <motion.div
              key="digital_asset_vault"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <DigitalServerAssetVaultStudio servers={servers} />
            </motion.div>
          )}

          {/* Gasless Token Deployer */}
          {activeTab === 'gasless_deployer' && (
            <motion.div
              key="gasless_deployer"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <GaslessTokenDeployerStudio servers={servers} />
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* ADMINISTRATIVE MODE MODULES (UNLOCKED IN ADMIN MODE) */}
          {/* ========================================================= */}

          {/* Code Injunction Studio */}
          {activeTab === 'injunctions' && (
            <motion.div
              key="injunctions"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <CodeInjunctionStudio
                injunctions={injunctions}
                onCreateInjunction={handleCreateInjunction}
                onExecuteInjunction={handleExecuteInjunction}
              />
            </motion.div>
          )}

          {/* Telemetry & Gates */}
          {activeTab === 'telemetry' && (
            <motion.div
              key="telemetry"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <GatesCircuitTelemetryStudio />
            </motion.div>
          )}

          {/* Server Manager */}
          {activeTab === 'servers' && (
            <motion.div
              key="servers"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <ServerManager
                servers={servers}
                onGenerateServer={handleGenerateServer}
                onDeleteServer={handleDeleteServer}
                onRestartServer={handleRestartServer}
              />
            </motion.div>
          )}

          {/* Network Topology */}
          {activeTab === 'topology' && (
            <motion.div
              key="topology"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <NetworkTopologyCanvas nodes={networkNodes} />
            </motion.div>
          )}

          {/* Radar Sniffer */}
          {activeTab === 'radar' && (
            <motion.div
              key="radar"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <RadarWorkspace onOpenPingTool={(ip) => setTargetPingIp(ip)} />
            </motion.div>
          )}

          {/* Cache Dumping Explorer */}
          {activeTab === 'cache_dumping' && (
            <motion.div
              key="cache_dumping"
              variants={layoutSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <CacheDumpingWorkspace />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Spacious Apple-Amazon Inspired Enterprise Multi-Column Footer */}
      <EnterpriseFooter
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenTelemetry={() => setActiveTab('protocol_engine')}
        onOpenAppCreation={() => setActiveTab('app_creation')}
        themeMode={themeMode}
      />

      {/* Global Command Palette (Cmd+K / Ctrl+K) */}
      <GlobalCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenAppPreview={() => setIsGlobalPreviewModalOpen(true)}
        onOpenTelemetryMonitor={() => setActiveTab('protocol_engine')}
      />

      {/* Global Live App Preview Modal */}
      <AppLivePreviewModal
        isOpen={isGlobalPreviewModalOpen}
        onClose={() => setIsGlobalPreviewModalOpen(false)}
        appName="SubNet Telemetry & Node Monitor"
        category="Infrastructure & Telemetry"
      />

      {/* AI Assistant Drawer Component (VOX AI) */}
      <AIAssistantDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        servers={servers}
        injunctions={injunctions}
        onGenerateServer={handleGenerateServer}
        onExecuteInjunction={handleExecuteInjunction}
      />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* AI Theme Picker & Generator Studio Modal */}
      <AIThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={applyTheme}
        onRandomTheme={handleRandomTheme}
      />

      {/* Dynamic AI Theme Toast Notification */}
      <AnimatePresence>
        {themeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-950/95 border-2 border-cyan-400 text-white shadow-2xl backdrop-blur-xl flex items-center space-x-3.5 font-mono max-w-md pointer-events-auto"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-black font-black text-lg shrink-0 shadow-md">
              <Dices className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-cyan-300 flex items-center justify-between">
                <span>{themeToast.title}</span>
                <span className="text-[10px] text-zinc-400 font-normal">AI Active</span>
              </div>
              <div className="text-[11px] text-zinc-300 truncate mt-0.5">
                {themeToast.subtitle}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
