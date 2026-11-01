import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Terminal, 
  Bot, 
  Activity, 
  Code2, 
  ShieldCheck, 
  Plus, 
  Blocks,
  Sun,
  Moon,
  Tag,
  ShoppingBag,
  Coins,
  Monitor,
  Wrench,
  User,
  LogOut,
  FolderGit2,
  BookOpen,
  Lock,
  Sparkles,
  Search,
  ChevronDown,
  Cpu,
  Layers,
  Globe,
  Radio,
  Zap,
  Workflow,
  Vault,
  Key,
  Database,
  Server,
  ShieldAlert,
  Eye,
  X,
  Command,
  ArrowRight,
  Check,
  Mic,
  Video,
  Dices,
  Palette,
  Mail,
  Shield,
  SendHorizontal,
  KeyRound,
  FileCode,
  Boxes,
  Gauge,
  MapPin,
  Navigation,
  Award
} from 'lucide-react';
import { PrivateServer } from '../types';
import { ThemeId } from '../types/theme';
import { THEME_PRESETS } from '../utils/themePresets';
import { IcrLogo } from './IcrLogo';

interface SearchItem {
  id: string;
  title: string;
  category: 'Cryptographic Tools' | 'AI & Intelligence' | 'Infrastructure' | 'Publishing & Services' | 'Server Nodes';
  description: string;
  icon: any;
  targetTab: string;
  cryptoSubTool?: string;
  badge?: string;
  keywords?: string;
  ipAddress?: string;
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCryptoSubTool?: string;
  setSelectedCryptoSubTool?: (subTool: string) => void;
  servers?: PrivateServer[];
  serverCount: number;
  injunctionCount: number;
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  isSearchOpen?: boolean;
  setIsSearchOpen?: (open: boolean) => void;
  onQuickGenerateServer: () => void;
  pingMs: number;
  themeMode: 'dark' | 'light';
  setThemeMode: (theme: 'dark' | 'light') => void;
  currentThemeId?: ThemeId;
  onSelectTheme?: (themeId: ThemeId) => void;
  onOpenThemeModal?: () => void;
  onRandomTheme?: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  currentUser: { email: string; name: string; role: 'admin' | 'user' } | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCryptoSubTool,
  setSelectedCryptoSubTool,
  servers = [],
  serverCount,
  injunctionCount,
  aiDrawerOpen,
  setAiDrawerOpen,
  isSearchOpen: externalIsSearchOpen,
  setIsSearchOpen: externalSetIsSearchOpen,
  onQuickGenerateServer,
  pingMs,
  themeMode,
  setThemeMode,
  currentThemeId = 'cyber-dark',
  onSelectTheme,
  onOpenThemeModal,
  onRandomTheme,
  isAdminMode,
  setIsAdminMode,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const isDark = themeMode === 'dark';
  const activeThemePreset = THEME_PRESETS[currentThemeId] || THEME_PRESETS['cyber-dark'];
  const [isPaletteDropdownOpen, setIsPaletteDropdownOpen] = useState<boolean>(false);

  
  // Search state
  const [internalIsSearchOpen, setInternalIsSearchOpen] = useState<boolean>(false);
  const isSearchOpen = externalIsSearchOpen !== undefined ? externalIsSearchOpen : internalIsSearchOpen;
  const setIsSearchOpen = (open: boolean | ((prev: boolean) => boolean)) => {
    if (typeof open === 'function') {
      const nextVal = open(isSearchOpen);
      if (externalSetIsSearchOpen) externalSetIsSearchOpen(nextVal);
      else setInternalIsSearchOpen(nextVal);
    } else {
      if (externalSetIsSearchOpen) externalSetIsSearchOpen(open);
      else setInternalIsSearchOpen(open);
    }
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  
  // Dropdown menus state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut listener (Ctrl+K or Command+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto focus input when search modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Master List of Searchable Tools, Workspaces and Configurations
  const staticSearchItems: SearchItem[] = [
    // Executive Founder & Origin Profile
    {
      id: 'founder_profile',
      title: 'Dr. Victor — Founder, Technologist & Innovator',
      category: 'Publishing & Services',
      description: 'Executive founder profile of Dr. Victor Agboola (Born Nov 13, 1995), Computer Engineering distinction, UAE AI research, and ICR architecture.',
      icon: Award,
      targetTab: 'founder',
      badge: 'Founder',
      keywords: 'founder dr victor agboola victor technologist innovator biography education ekiti uae ai cv sdk pet musician writer'
    },
    // Diagnostic & Protocol Health Tools
    {
      id: 'protocol_health',
      title: 'Protocol Health Monitor',
      category: 'Cryptographic Tools',
      description: 'Real-time multi-protocol status linter tracking Active, Idle & Error states with Auto-Repair and Repair All recovery.',
      icon: Activity,
      targetTab: 'protocol_health',
      cryptoSubTool: 'protocol_health',
      badge: 'Auto-Repair',
      keywords: 'protocol health monitor repair all auto repair linter network active idle error diop vip status'
    },
    {
      id: 'protocol_linter',
      title: 'Protocol Linter & Auditor',
      category: 'Cryptographic Tools',
      description: 'Automated syntax linter and active status auditor for all 17 DIOP and 20 VIP protocols.',
      icon: Shield,
      targetTab: 'protocol_linter',
      cryptoSubTool: 'protocol_linter',
      badge: 'Protocols',
      keywords: 'protocol linter syntax auditor diop rfc ast packet ports'
    },
    // 18 Cryptographic Tools
    {
      id: 'injunctions',
      title: 'Code Injunction Engine',
      category: 'Cryptographic Tools',
      description: 'Autonomous TypeScript & Python script dispatcher with cryptographic execution proofs.',
      icon: Code2,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'injunctions',
      badge: 'Logic',
      keywords: 'code script python typescript injunction execute automated'
    },
    {
      id: 'gates_telemetry',
      title: 'Gates & Circuit Telemetry',
      category: 'Cryptographic Tools',
      description: 'Logic gate circuit analysis, pulse propagation, and hardware telemetry signal monitors.',
      icon: Activity,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'gates_telemetry',
      badge: 'Hardware',
      keywords: 'gates circuit pulses signal logic microchip probe'
    },
    {
      id: 'oob_pentest',
      title: 'Out-Of-Band PenTest Studio',
      category: 'Cryptographic Tools',
      description: 'OOB callback listeners, DNS interaction tracking, packet injection, and vulnerability scanner.',
      icon: ShieldAlert,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'oob_pentest',
      badge: 'Security',
      keywords: 'pentest oob security audit vulnerability callback listener packet'
    },
    {
      id: 'firewall_env',
      title: 'Firewall & Secrets Vault',
      category: 'Cryptographic Tools',
      description: 'Hardware firewall IP bans, TLS 1.3 cert inspections, and environment secrets management.',
      icon: Lock,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'firewall_env',
      badge: 'Security',
      keywords: 'firewall tls secrets env variables security block ip'
    },
    {
      id: 'database_creds',
      title: 'Database & Plugin Credentials Vault',
      category: 'Cryptographic Tools',
      description: 'AES-256 encrypted connection string vaults and plugin credential management.',
      icon: Key,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'database_creds',
      badge: 'Storage',
      keywords: 'database credentials aes-256 sql postgres redis password'
    },
    {
      id: 'virtual_proxy',
      title: 'Virtual Protocol Proxy & Tunnels',
      category: 'Cryptographic Tools',
      description: 'Socks5/HTTP proxy relays, WireGuard SSL VPN tunnels, and encrypted route switching.',
      icon: Globe,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'virtual_proxy',
      badge: 'Routing',
      keywords: 'proxy socks5 vpn wireguard tunnel network route'
    },
    {
      id: 'cache_dumping',
      title: 'Cache Dumping & Memory Explorer',
      category: 'Cryptographic Tools',
      description: 'Redis/Qdrant memory heap dumper, cache inspection, and key-value state diagnostics.',
      icon: Database,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'cache_dumping',
      badge: 'Memory',
      keywords: 'cache redis qdrant heap dumper memory key value'
    },
    {
      id: 'blockchain_telemetry',
      title: 'Blockchain Telemetry & Validators',
      category: 'Cryptographic Tools',
      description: 'Multi-subnet validator telemetry, zero-gas relayer monitors, and mempool sniffer.',
      icon: Blocks,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'blockchain_telemetry',
      badge: 'Ledgers',
      keywords: 'blockchain validator relayer mempool solana ethereum consensus'
    },
    {
      id: 'digital_asset_vault',
      title: 'Digital Server Asset Vault',
      category: 'Cryptographic Tools',
      description: 'Multi-signature coin escrow, gasless token vault, and cross-chain asset bridges.',
      icon: Vault,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'digital_asset_vault',
      badge: 'Storage',
      keywords: 'vault escrow tokens crypto assets multi-sig bitcoin'
    },
    {
      id: 'gasless_deployer',
      title: 'Gasless Token Deployer',
      category: 'Cryptographic Tools',
      description: 'Mint ERC20 & Solana token contracts with automated gasless relayer infrastructure.',
      icon: Zap,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'gasless_deployer',
      badge: 'Ledgers',
      keywords: 'gasless token deployer contract erc20 mint solana'
    },
    {
      id: 'advanced_telemetry',
      title: 'SubNet & VOX Telemetry Suite',
      category: 'Cryptographic Tools',
      description: 'Comprehensive 15-section telemetry engine with protocol probes & baseline anomaly detectors.',
      icon: Cpu,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'advanced_telemetry',
      badge: 'Metrics',
      keywords: 'telemetry subnet metrics baseline anomaly probe monitor'
    },
    {
      id: 'server_manager',
      title: 'Container Server Mesh Manager',
      category: 'Cryptographic Tools',
      description: 'Private container node generator, Docker CPU/RAM allocation, and real-time logs.',
      icon: Server,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'server_manager',
      badge: 'Nodes',
      keywords: 'container server docker mesh node private deploy'
    },
    {
      id: 'network_topology',
      title: 'Network Topology Canvas',
      category: 'Cryptographic Tools',
      description: 'Interactive node graph visualizer with live bandwidth, latencies, and route links.',
      icon: Layers,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'network_topology',
      badge: 'Nodes',
      keywords: 'topology graph nodes visualizer bandwidth latency canvas'
    },
    {
      id: 'radar_sniffer',
      title: 'Radar Sniffer & Ping Probe',
      category: 'Cryptographic Tools',
      description: 'Port scanner, ARP discovery, latency probes, and packet sniffing engine.',
      icon: Radio,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'radar_sniffer',
      badge: 'Security',
      keywords: 'radar sniffer ping port scan arp packet probe'
    },
    {
      id: 'windows_sandbox',
      title: 'Windows RDP Sandbox Workstation',
      category: 'Cryptographic Tools',
      description: '60 FPS remote desktop workstation streaming with mouse/keyboard relay.',
      icon: Monitor,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'windows_sandbox',
      badge: 'Workstation',
      keywords: 'windows rdp sandbox workstation remote desktop stream'
    },
    {
      id: 'web_gateway',
      title: 'Web Gateway & Nginx Reverse Proxy',
      category: 'Cryptographic Tools',
      description: 'Nginx load balancing, SSL edge route configuration, and upstream proxies.',
      icon: Globe,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'web_gateway',
      badge: 'Routing',
      keywords: 'gateway nginx reverse proxy ssl edge route load balancer'
    },
    {
      id: 'intentional_vision',
      title: 'SIMD AVX-512 Computer Vision',
      category: 'Cryptographic Tools',
      description: 'C++ AVX-512 SIMD tensor engine for real-time facial recognition & optical flow.',
      icon: Eye,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'intentional_vision',
      badge: 'Hardware',
      keywords: 'vision simd avx-512 tensor optical flow recognition video'
    },
    {
      id: 'n8n_mesh',
      title: 'n8n Workflow Automation Mesh',
      category: 'Cryptographic Tools',
      description: 'Workflow automation nodes, webhook listeners, and event trigger dispatches.',
      icon: Workflow,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'n8n_mesh',
      badge: 'Automation',
      keywords: 'n8n workflow automation mesh trigger webhook'
    },
    {
      id: 'bte_identity',
      title: 'BTE-ID v1 Blockchain Identity Anchor',
      category: 'Cryptographic Tools',
      description: 'Immutable blockchain identity anchor & inclusive protocol registry (VSP / NP suite).',
      icon: ShieldCheck,
      targetTab: 'advance_crypto_tools',
      cryptoSubTool: 'bte_identity',
      badge: 'Ledgers',
      keywords: 'bte-id identity anchor blockchain registry vsp np inclusive commitment'
    },

    // AI Workspaces
    {
      id: 'ai_app_creation_studio',
      title: 'AI App Creation Studio (Google AI Studio Inspired)',
      category: 'AI & Intelligence',
      description: 'Multi-file full-stack app generator with live interactive preview sandbox, device frame switcher, and bundle export.',
      icon: Sparkles,
      targetTab: 'app_creation',
      badge: 'Google AI Studio',
      keywords: 'app creation studio generator build applet code preview sandbox live prompt execution'
    },
    {
      id: 'ai_chat_bot_agent',
      title: 'Chat Bot Execution Agent',
      category: 'AI & Intelligence',
      description: 'Autonomous natural language prompt execution agent for cluster actions and operations.',
      icon: Terminal,
      targetTab: 'chat_bot',
      badge: 'Execution Agent',
      keywords: 'chat bot prompt execution agent runner ai autonomous'
    },
    {
      id: 'protocol_telemetry_monitor',
      title: 'Visual Protocol Telemetry Monitor',
      category: 'Infrastructure',
      description: 'Real-time packet flow stream and 20 pluggable module health matrix for Inclusive Protocol Engine.',
      icon: Activity,
      targetTab: 'protocol_engine',
      badge: 'Real-Time Flow',
      keywords: 'telemetry packet flow ingress egress adapter health matrix otlp collector inclusive protocol engine'
    },
    {
      id: 'google_maps_geo_schematics',
      title: 'Google Maps Real-Time Geo-Location Schematics',
      category: 'Infrastructure',
      description: 'Live GPS telemetry, global sovereign server node fleet mapping, geofence radius calculations, and multi-hop routing traceroute.',
      icon: MapPin,
      targetTab: 'geo_map',
      badge: 'Google Maps',
      keywords: 'google map maps geolocation gps schematics location coordinates latitude longitude fleet nodes route traceroute'
    },
    {
      id: 'ai_top_tools_directory',
      title: 'AITopTools Directory & Dynamic AI Function Toggler',
      category: 'AI & Intelligence',
      description: 'Scraped and exported index of top AI tools with one-click toggles to inject live schemas into AI Assistant Bot.',
      icon: Sparkles,
      targetTab: 'ai_top_tools',
      badge: 'AITopTools',
      keywords: 'aitoptools top tools directory scraper export openapi function calling cursor v0 midjourney elevenlabs flux'
    },
    {
      id: 'ai_assistant_bot_hub',
      title: 'AI Assistant Bot Studio',
      category: 'AI & Intelligence',
      description: 'Autonomous multi-persona agent with real-time network introspection, function-calling tools, code injunction dispatch, and telemetry diagnostics.',
      icon: Bot,
      targetTab: 'ai_assistant_bot',
      badge: 'Agent v4.5',
      keywords: 'ai assistant bot agent chat prompt model gemini deepseek claude dispatch function calling voice'
    },
    {
      id: 'vox_ai_generator',
      title: 'VOX AI Assistant & Code Generator',
      category: 'AI & Intelligence',
      description: 'Generative AI code assistant, context window analyzers, and prompt execution engine.',
      icon: Bot,
      targetTab: 'tools',
      badge: 'AI Engine',
      keywords: 'vox ai generator model prompt chat assistant code'
    },
    {
      id: 'voice_to_text',
      title: 'Voice Speech-to-Text Transcriber',
      category: 'AI & Intelligence',
      description: 'Real-time audio transcription with multilingual speech models and timestamp markers.',
      icon: Terminal,
      targetTab: 'voice_to_text',
      badge: 'Voice AI',
      keywords: 'voice speech to text transcription audio microphone'
    },
    {
      id: 'text_to_video',
      title: 'AI Text-to-Video Synthesizer',
      category: 'AI & Intelligence',
      description: 'High-definition neural video rendering pipeline from text prompts.',
      icon: Sparkles,
      targetTab: 'text_to_video',
      badge: 'Video AI',
      keywords: 'video synth text-to-video render neural generator'
    },

    // Infrastructure
    {
      id: 'subnet_telemetry_stand',
      title: 'SubNet System Telemetry Engine',
      category: 'Infrastructure',
      description: 'Global system telemetry dashboard tracking real-time network throughput and packet health.',
      icon: Activity,
      targetTab: 'telemetry',
      badge: 'System',
      keywords: 'telemetry system dashboard throughput latency logs'
    },
    {
      id: 'n8n_standalone',
      title: 'n8n Automation Engine',
      category: 'Infrastructure',
      description: 'Visual workflow canvas for connecting microservices and automated network triggers.',
      icon: Workflow,
      targetTab: 'n8n',
      badge: 'Workflow',
      keywords: 'n8n workflow canvas nodes automation trigger'
    },

    // Publishing & Services
    {
      id: 'vox_tech_blog',
      title: 'VOX Tech Blog & Knowledge Base',
      category: 'Publishing & Services',
      description: 'Hosted articles, architecture guides, reader comments, and blog authoring portal.',
      icon: BookOpen,
      targetTab: 'hosted_pages',
      badge: 'Articles',
      keywords: 'blog tech articles posts reading reader authoring'
    },
    {
      id: 'vendor_directory',
      title: 'Network Tools & Vendor Directory',
      category: 'Publishing & Services',
      description: 'Curated hub of network utilities, verification APIs, and verified security vendors.',
      icon: Wrench,
      targetTab: 'network_tools_vendors',
      badge: 'Services',
      keywords: 'vendor tools directory services security utilities'
    },
    {
      id: 'p2p_classifieds',
      title: 'P2P Network Classifieds',
      category: 'Publishing & Services',
      description: 'Peer-to-peer equipment exchange, server hardware listings, and service offers.',
      icon: Tag,
      targetTab: 'classifieds',
      badge: 'Classifieds',
      keywords: 'classifieds p2p hardware trading buy sell marketplace'
    },
    {
      id: 'ecommerce_store',
      title: 'E-Commerce Digital Storefront',
      category: 'Publishing & Services',
      description: 'Digital license marketplace, hardware ordering, and crypto checkout gateway.',
      icon: ShoppingBag,
      targetTab: 'ecommerce',
      badge: 'Commerce',
      keywords: 'ecommerce store licenses buy shopping cart checkout'
    },
    {
      id: 'virtual_browser_studio',
      title: 'Hosted Virtual Web Browser Studio',
      category: 'Publishing & Services',
      description: 'Isolated containerized browser session sandbox for secure web inspection.',
      icon: Globe,
      targetTab: 'hosted_browser',
      badge: 'Web Tools',
      keywords: 'browser virtual hosted web proxy sandbox web'
    },

    // Decentralized Internet Ownership Protocol (DIOP)
    {
      id: 'diop_master',
      title: 'Decentralized Internet Ownership Protocol (DIOP)',
      category: 'Infrastructure',
      description: 'Decentralized virtual server virtualization, transport-agnostic network protocols, non-custodial domain ownership, and 6-tier native address resolution.',
      icon: Globe,
      targetTab: 'protocols',
      badge: '17 Protocols',
      keywords: 'protocols diop vsp nip virtual server network decentralized domain vx ownership host subscribe'
    },
    {
      id: 'diop_vsp_servers',
      title: 'Virtual Server Protocols (VSP Suite)',
      category: 'Infrastructure',
      description: 'VSP-SERVER, VSP-NODE, VSP-SUBNET, VSP-HOST, VSP-RESOURCE, VSP-TELEMETRY, VSP-REPLICATION.',
      icon: Server,
      targetTab: 'protocols',
      badge: 'VSP Suite',
      keywords: 'vsp vsp-server vsp-node vsp-subnet vsp-host vsp-resource vsp-telemetry vsp-replication virtual servers'
    },
    {
      id: 'diop_nip_suite',
      title: 'Network Protocols (NIP Suite)',
      category: 'Infrastructure',
      description: 'NIP-ID, NIP-RESOLVE, NIP-DISCOVER, NIP-ROUTE, NIP-SESSION, NIP-DATA, NIP-SUBSCRIBE, NIP-OWNERSHIP, NIP-GOVERNANCE.',
      icon: Network,
      targetTab: 'protocols',
      badge: 'NIP Suite',
      keywords: 'nip nip-id nip-resolve nip-discover nip-route nip-session nip-ownership nip-governance network identity'
    },
    {
      id: 'vip_platform_overview',
      title: 'Virtual Internet Protocol (VIP) Sovereign Platform',
      category: 'Infrastructure',
      description: '8-layer vnet:// virtual addressing, VirtualPacket wire routing, 20 VSP & NIP specifications, and Merkle telemetry.',
      icon: Globe,
      targetTab: 'virtual_internet',
      badge: 'VIP Platform',
      keywords: 'vip virtual internet protocol vnet packet quic vsp nip traceroute did crypto overlay'
    },
    {
      id: 'vip_virtual_packet_studio',
      title: 'VirtualPacket & 8-Layer vnet:// Resolver',
      category: 'Cryptographic Tools',
      description: 'Resolve sovereign vnet:// URIs through 8-layer stack and dispatch signed ChaCha20 encrypted VirtualPackets over QUIC/UDP.',
      icon: Radio,
      targetTab: 'virtual_internet',
      badge: 'vnet:// Wire',
      keywords: 'vnet virtualpacket quic chacha20 ed25519 resolver traceroute packet injection'
    }
  ];

  // Dynamic Server Nodes search items
  const dynamicServerSearchItems: SearchItem[] = servers.map(srv => ({
    id: `srv-${srv.id}`,
    title: srv.name,
    category: 'Server Nodes',
    description: `IP: ${srv.ipAddress}:${srv.port} | OS: ${srv.os} | Status: ${srv.status.toUpperCase()}`,
    icon: Server,
    targetTab: 'advance_crypto_tools',
    cryptoSubTool: 'server_manager',
    badge: srv.status.toUpperCase(),
    keywords: `${srv.name} ${srv.ipAddress} ${srv.os} ${srv.dockerImage} server node`,
    ipAddress: srv.ipAddress
  }));

  const allSearchItems = [...staticSearchItems, ...dynamicServerSearchItems];

  // Filtered search results
  const filteredSearchItems = allSearchItems.filter(item => {
    const matchesCategory = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.keywords && item.keywords.toLowerCase().includes(query)) ||
      (item.ipAddress && item.ipAddress.includes(query))
    );
  });

  const handleSelectSearchItem = (item: SearchItem) => {
    setActiveTab(item.targetTab);
    if (item.cryptoSubTool && setSelectedCryptoSubTool) {
      setSelectedCryptoSubTool(item.cryptoSubTool);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Categories definition for the top Navigation Bar dropdowns
  const cryptoSubToolsList = [
    { id: 'protocol_health', name: 'Protocol Health Monitor', icon: Activity, desc: 'Real-time multi-protocol status & Auto-Repair' },
    { id: 'protocol_linter', name: 'Protocol Linter & Auditor', icon: Shield, desc: 'Lint 17 DIOP & 20 VIP protocols' },
    { id: 'unlimited_email_sms_deployment', name: 'Unlimited Email & SMS Modes', icon: SendHorizontal, desc: 'Zero-gas swarm email & global SMPP SMS' },
    { id: 'smtp_injunction_webflow', name: 'SMTP Injunctions & Webflow', icon: Mail, desc: 'Webhook modes & DAG visual flow' },
    { id: 'injunctions', name: 'Code Injunction Engine', icon: Code2, desc: 'Script dispatcher & execution logs' },
    { id: 'crypto_evaluator', name: 'Cryptographic Address Evaluator', icon: KeyRound, desc: 'Address & checksum verification, vanity generator & ENS' },
    { id: 'smart_contract_vault', name: 'Smart Contract Vault & Compiler', icon: FileCode, desc: 'Solidity / Rust bytecode compiler & gas estimator' },
    { id: 'network_tools_console', name: 'Network Diagnostic Console', icon: Terminal, desc: 'Ping, Traceroute, DNS Dig, WHOIS & ISP sniffer' },
    { id: 'plugin_registry', name: 'Sovereign Plugin Registry', icon: Boxes, desc: 'Decentralized Wasm/Node package registry' },
    { id: 'vendor_services', name: 'Network Tools & Vendor Hub', icon: Wrench, desc: 'Curated security tools & relayer gateways' },
    { id: 'x16_os_telemetry', name: 'X16 Sovereign OS & UI Telemetry', icon: Gauge, desc: 'Kernel threads, Frame profiler & GPU compositor' },
    { id: 'btc_sol_parity', name: 'BTC-SOL Parity & Matrix', icon: Coins, desc: 'Cross-chain bridge & Proof of History validator' },
    { id: 'oob_pentest', name: 'Out-Of-Band PenTest', icon: ShieldAlert, desc: 'OOB callback listeners & DNS auditor' },
    { id: 'firewall_env', name: 'Firewall & Secrets Vault', icon: Lock, desc: 'TLS 1.3 & hardware IP rules' },
    { id: 'database_creds', name: 'Database Credentials', icon: Key, desc: 'AES-256 encrypted connections' },
    { id: 'virtual_proxy', name: 'Virtual Protocol Proxy', icon: Globe, desc: 'Socks5/HTTP & WireGuard tunnels' },
    { id: 'gasless_deployer', name: 'Gasless Token Deployer', icon: Zap, desc: 'Mint ERC20 & Solana contracts' },
    { id: 'digital_asset_vault', name: 'Digital Asset Vault', icon: Vault, desc: 'Multi-sig coin & asset escrow' },
    { id: 'blockchain_telemetry', name: 'Blockchain Telemetry', icon: Blocks, desc: 'Validator metrics & mempool' },
    { id: 'gates_telemetry', name: 'Gates Circuit Telemetry', icon: Activity, desc: 'Hardware logic gate signals' },
    { id: 'cache_dumping', name: 'Cache Dumping', icon: Database, desc: 'Redis & Qdrant memory explorer' },
    { id: 'server_manager', name: 'Container Server Mesh', icon: Server, desc: 'Docker nodes & CPU allocation' },
    { id: 'network_topology', name: 'Network Topology', icon: Layers, desc: 'Interactive node graph canvas' },
    { id: 'radar_sniffer', name: 'Radar Sniffer Probe', icon: Radio, desc: 'Port scanner & ping discovery' },
    { id: 'windows_sandbox', name: 'Windows RDP Sandbox', icon: Monitor, desc: '60 FPS remote desktop stream' },
    { id: 'web_gateway', name: 'Web Nginx Proxy', icon: Globe, desc: 'Load balancing & SSL edge routes' },
    { id: 'intentional_vision', name: 'SIMD Computer Vision', icon: Eye, desc: 'C++ AVX-512 tensor flow' },
    { id: 'advanced_telemetry', name: 'SubNet Telemetry Suite', icon: Cpu, desc: '15-section metric probes' },
    { id: 'n8n_mesh', name: 'n8n Automation Mesh', icon: Workflow, desc: 'Workflow event trigger dispatches' },
    { id: 'bte_identity', name: 'BTE-ID v1 Identity Anchor', icon: ShieldCheck, desc: 'Immutable blockchain anchor & protocol registry' },
    { id: 'protocol_engine', name: 'Inclusive Protocol Engine', icon: Layers, desc: 'Install, test & configure protocol adapters' }
  ];

  const aiToolsList = [
    { tab: 'ai_assistant_bot', name: 'AI Assistant Bot Studio', icon: Bot, desc: 'Autonomous multi-persona agent with code injunction dispatch & live diagnostics' },
    { tab: 'app_creation', name: 'AI App Creation Studio', icon: Sparkles, desc: 'Google AI Studio multi-file app generator & live preview' },
    { tab: 'chat_bot', name: 'Chat Bot Execution Agent', icon: Terminal, desc: 'Receive prompts for real-time tool executions' },
    { tab: 'tools', name: 'AI Generative Playground', icon: Bot, desc: 'Generative AI code assistant & prompt synthesizer' },
    { tab: 'voice_to_text', name: 'Voice Speech-to-Text Transcriber', icon: Mic, desc: 'Real-time audio speech transcription' },
    { tab: 'text_to_video', name: 'AI Text-to-Video Synthesizer', icon: Video, desc: 'Neural video generation pipeline' },
    { tab: 'protocol_engine', name: 'Inclusive Protocol Engine Studio', icon: Layers, desc: 'Enterprise protocol adapter installer & sandbox' },
    { subTool: 'bte_identity', tab: 'advance_crypto_tools', name: 'BTE-ID v1 Blockchain Identity Anchor', icon: ShieldCheck, desc: 'Decentralized identity & inclusive protocol suite' },
    { subTool: 'intentional_vision', tab: 'advance_crypto_tools', name: 'SIMD AVX-512 Computer Vision', icon: Eye, desc: 'C++ tensor engine optical flow' }
  ];

  const infraToolsList = [
    { tab: 'geo_map', name: 'Google Maps Geo-Location Schematics', icon: MapPin, desc: 'Real-time GPS telemetry, fleet mapping & routing' },
    { subTool: 'server_manager', tab: 'advance_crypto_tools', name: 'Container Server Mesh', icon: Server, desc: 'Manage private Docker container nodes' },
    { subTool: 'network_topology', tab: 'advance_crypto_tools', name: 'Network Topology Canvas', icon: Layers, desc: 'Live bandwidth & latency graph' },
    { tab: 'telemetry', name: 'SubNet Telemetry Suite', icon: Activity, desc: 'System-wide packet health & throughput' },
    { subTool: 'web_gateway', tab: 'advance_crypto_tools', name: 'Nginx Reverse Proxy Gateway', icon: Globe, desc: 'Upstream proxies & SSL routing' },
    { subTool: 'windows_sandbox', tab: 'advance_crypto_tools', name: 'Windows RDP Sandbox', icon: Monitor, desc: 'Remote desktop stream environment' },
    { tab: 'n8n', name: 'n8n Automation Mesh', icon: Workflow, desc: 'Visual microservice workflow engine' }
  ];

  const contentToolsList = [
    { tab: 'founder', name: 'Dr. Victor (Founder Profile)', icon: Award, desc: 'Executive founder profile, AI research & vision' },
    { tab: 'hosted_pages', name: 'ICR Tech Blog & Knowledge Base', icon: BookOpen, desc: 'Hosted tech articles & authoring studio' },
    { tab: 'network_tools_vendors', name: 'Network Tools & Vendor Directory', icon: Wrench, desc: 'Curated security utilities & vendor APIs' },
    { tab: 'classifieds', name: 'P2P Network Classifieds', icon: Tag, desc: 'Hardware exchange & service listings' },
    { tab: 'ecommerce', name: 'E-Commerce Digital Storefront', icon: ShoppingBag, desc: 'Software licenses & crypto checkout' },
    { tab: 'web3_farming', name: 'Web3 $DEPO Yield Farming', icon: Coins, desc: 'Proof-of-Traffic dynamic yield & seed vault' },
    { tab: 'hosted_browser', name: 'Hosted Virtual Web Browser', icon: Globe, desc: 'Containerized browser sandbox' }
  ];

  return (
    <header 
      id="app-navbar" 
      className={`sticky top-0 z-50 transition-colors duration-300 border-b shadow-xl ${
        isDark 
          ? 'bg-zinc-950/95 border-zinc-800/80 text-white backdrop-blur-2xl' 
          : 'bg-[#fcfaf6]/95 border-[#e8dfd3] text-[#1c1917] backdrop-blur-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* BRAND LOGO & TITLE */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => {
                setActiveTab('advance_crypto_tools');
                if (setSelectedCryptoSubTool) setSelectedCryptoSubTool('injunctions');
              }}
              title="Integrational Compute Repository — Primary Tools"
            >
              <IcrLogo size={40} isDark={isDark} withGlow={true} />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl lg:text-2xl tracking-widest flex items-center space-x-1.5 whitespace-nowrap">
                  <span className={`font-iin-digital ${isDark ? 'text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]' : 'text-[#92400e]'}`}>
                    ICR
                  </span>
                  <span className={`font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold tracking-normal ${
                    isDark ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/60' : 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                  }`}>
                    CORE
                  </span>
                </span>
                {isAdminMode && (
                  <span className="hidden xl:inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase bg-amber-950 text-amber-300 border border-amber-700 rounded-md">
                    <ShieldCheck className="h-3 w-3 mr-1 text-amber-400" />
                    ADMIN
                  </span>
                )}
              </div>
              <p className={`text-[10px] sm:text-[11px] font-mono hidden md:block ${isDark ? 'text-zinc-400' : 'text-[#78716c]'}`}>
                Integrational Compute Repository (ICR)
              </p>
            </div>
          </div>

          {/* GLOBAL SEARCH INPUT BAR */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-1 sm:mx-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-full flex items-center justify-between px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-mono transition-all group ${
                isDark 
                  ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:border-cyan-500/60 hover:bg-zinc-900' 
                  : 'bg-[#f7f3eb] border-[#e8dfd3] text-[#1c1917] hover:border-[#b45309] hover:bg-[#ffffff]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <Search className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isDark ? 'text-cyan-400' : 'text-[#b45309]'} group-hover:scale-110 transition-transform shrink-0`} />
                <span className="truncate text-[11px] sm:text-xs font-medium">
                  Search tools, workspaces, servers...
                </span>
              </div>
              <div className={`hidden sm:flex items-center space-x-1 px-1.5 py-0.5 rounded border text-[10px] font-bold shrink-0 ${
                isDark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400' : 'bg-[#efe6d8] border-[#dfd4c3] text-[#57534e]'
              }`}>
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* UNIFIED TOOLS TOGGLE & NAVIGATION BAR (DESKTOP) */}
          <nav className={`hidden lg:flex items-center space-x-1.5 font-mono text-xs p-1.5 rounded-2xl border shadow-lg ${
            isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-[#f7f3eb] border-[#e8dfd3]'
          }`}>
            
            {/* Master Tool Toggle: Cryptographic & AI Suites */}
            <div className="relative group">
              <button
                onClick={() => {
                  setActiveTab('advance_crypto_tools');
                  setActiveDropdown(activeDropdown === 'crypto' ? null : 'crypto');
                }}
                onMouseEnter={() => setActiveDropdown('crypto')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                  activeTab === 'advance_crypto_tools'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-md'
                    : isDark ? 'text-cyan-300 hover:bg-zinc-800 border-transparent' : 'text-cyan-800 hover:bg-zinc-200 border-transparent'
                }`}
              >
                <Wrench className="h-4 w-4 text-cyan-400" />
                <span>Tools Suite</span>
                <span className="px-1.5 py-0.5 text-[9px] rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-black">
                  18+
                </span>
                <ChevronDown className="h-3 w-3 text-cyan-400 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Tools Master Dropdown Menu */}
              {activeDropdown === 'crypto' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 mt-2 w-96 bg-zinc-950 border-2 border-cyan-500/50 rounded-2xl shadow-2xl p-3 z-50 font-sans grid grid-cols-1 gap-1 text-xs"
                >
                  <div className="px-2 py-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800/80 mb-1">
                    <span>18 Cryptographic &amp; Diagnostic Tools</span>
                    <span className="text-cyan-500 font-mono">VOX SUITE</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {cryptoSubToolsList.map(item => {
                      const IconComp = item.icon;
                      const isSelected = activeTab === 'advance_crypto_tools' && selectedCryptoSubTool === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab('advance_crypto_tools');
                            if (setSelectedCryptoSubTool) setSelectedCryptoSubTool(item.id);
                            setActiveDropdown(null);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-inner' 
                              : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400 shrink-0">
                            <IconComp className="h-3.5 w-3.5" />
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-xs block truncate">{item.name}</span>
                            <span className="text-[10px] text-zinc-500 block truncate">{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* VOX AI & Studio Toggle */}
            <div className="relative group">
              <button
                onClick={() => {
                  setActiveTab('tools');
                  setActiveDropdown(activeDropdown === 'ai' ? null : 'ai');
                }}
                onMouseEnter={() => setActiveDropdown('ai')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                  ['tools', 'voice_to_text', 'text_to_video', 'app_creation', 'chat_bot', 'ai_chat'].includes(activeTab)
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                    : isDark ? 'text-zinc-300 hover:bg-zinc-800 border-transparent' : 'text-zinc-700 hover:bg-zinc-200 border-transparent'
                }`}
              >
                <Bot className="h-4 w-4 text-cyan-400" />
                <span>VOX AI</span>
                <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
              </button>

              {/* AI Dropdown */}
              {activeDropdown === 'ai' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 font-sans space-y-1 text-xs"
                >
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-zinc-800 mb-1">
                    AI &amp; Generative Studio
                  </div>
                  {aiToolsList.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(item.tab);
                          if (item.subTool && setSelectedCryptoSubTool) setSelectedCryptoSubTool(item.subTool);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left p-2 rounded-xl flex items-center space-x-2.5 transition-all text-zinc-300 hover:bg-zinc-900 hover:text-white cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400 shrink-0">
                          <IconComp className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-xs block truncate">{item.name}</span>
                          <span className="text-[10px] text-zinc-500 block truncate">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dedicated AI Assistant Bot Tab */}
            <button
              onClick={() => {
                setActiveTab('ai_assistant_bot');
                setActiveDropdown(null);
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                activeTab === 'ai_assistant_bot' || activeTab === 'ai_assistant' || activeTab === 'assistant_bot'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black border-amber-400 shadow-md shadow-amber-950/60 font-black'
                  : isDark ? 'text-amber-300 hover:bg-zinc-800/90 border-amber-500/30' : 'text-amber-800 hover:bg-amber-100 border-amber-300'
              }`}
            >
              <Bot className={`h-4 w-4 ${activeTab === 'ai_assistant_bot' ? 'text-black' : 'text-amber-400'}`} />
              <span>AI Assistant</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                activeTab === 'ai_assistant_bot' ? 'bg-black text-amber-300' : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}>
                BOT
              </span>
            </button>

            {/* Google Maps Real-Time Geo-Location Schematics Tab */}
            <button
              onClick={() => {
                setActiveTab('geo_map');
                setActiveDropdown(null);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                activeTab === 'geo_map' || activeTab === 'google_map' || activeTab === 'geolocation' || activeTab === 'geo_schematics'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-md shadow-cyan-950/60 font-black'
                  : isDark ? 'text-cyan-300 hover:bg-zinc-800/90 border-cyan-500/30' : 'text-cyan-800 hover:bg-cyan-100 border-cyan-300'
              }`}
            >
              <MapPin className={`h-4 w-4 ${activeTab === 'geo_map' ? 'text-black' : 'text-cyan-400'}`} />
              <span>Geo Map</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                activeTab === 'geo_map' ? 'bg-black text-cyan-300' : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
              }`}>
                GPS
              </span>
            </button>

            {/* AITopTools Directory & Dynamic AI Function Toggler */}
            <button
              onClick={() => {
                setActiveTab('ai_top_tools');
                setActiveDropdown(null);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                activeTab === 'ai_top_tools' || activeTab === 'top_tools' || activeTab === 'tools_directory' || activeTab === 'aitoptools'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-black border-amber-400 shadow-md shadow-amber-950/60 font-black'
                  : isDark ? 'text-amber-300 hover:bg-zinc-800/90 border-amber-500/30' : 'text-amber-800 hover:bg-amber-100 border-amber-300'
              }`}
            >
              <Sparkles className={`h-4 w-4 ${activeTab === 'ai_top_tools' ? 'text-black' : 'text-amber-400'}`} />
              <span>AI Tools</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                activeTab === 'ai_top_tools' ? 'bg-black text-amber-300' : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}>
                SCRAPED
              </span>
            </button>

            {/* Virtual Internet Protocols (VIP 20) */}
            <button
              onClick={() => {
                setActiveTab('virtual_internet');
                setActiveDropdown(null);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                activeTab === 'virtual_internet' || activeTab === 'vip'
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                  : isDark ? 'text-cyan-300 hover:bg-zinc-800 border-transparent' : 'text-cyan-700 hover:bg-zinc-200 border-transparent'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>VIP</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-extrabold">
                20
              </span>
            </button>

            {/* Decentralized Internet Protocols (DIOP 17) */}
            <button
              onClick={() => {
                setActiveTab('protocols');
                setActiveDropdown(null);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                activeTab === 'protocols' || activeTab === 'diop_protocols'
                  ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                  : isDark ? 'text-indigo-300 hover:bg-zinc-800 border-transparent' : 'text-indigo-700 hover:bg-zinc-200 border-transparent'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>DIOP</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-800 font-extrabold">
                17
              </span>
            </button>

            {/* Publishing & Services Hub */}
            <div className="relative group">
              <button
                onClick={() => {
                  setActiveTab('hosted_pages');
                  setActiveDropdown(activeDropdown === 'content' ? null : 'content');
                }}
                onMouseEnter={() => setActiveDropdown('content')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                  ['hosted_pages', 'network_tools_vendors', 'classifieds', 'ecommerce', 'hosted_browser', 'telemetry', 'n8n'].includes(activeTab)
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                    : isDark ? 'text-zinc-300 hover:bg-zinc-800 border-transparent' : 'text-zinc-700 hover:bg-zinc-200 border-transparent'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                <span>Services</span>
                <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Services Dropdown */}
              {activeDropdown === 'content' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 font-sans space-y-1 text-xs"
                >
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider border-b border-zinc-800 mb-1">
                    Publishing, Directory &amp; Infra
                  </div>
                  {contentToolsList.concat(infraToolsList).map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(item.tab);
                          if ((item as any).subTool && setSelectedCryptoSubTool) setSelectedCryptoSubTool((item as any).subTool);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left p-2 rounded-xl flex items-center space-x-2.5 transition-all text-zinc-300 hover:bg-zinc-900 hover:text-white cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 shrink-0">
                          <IconComp className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-xs block truncate">{item.name}</span>
                          <span className="text-[10px] text-zinc-500 block truncate">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Founder Profile Studio Tab */}
            <button
              onClick={() => {
                setActiveTab('founder');
                setActiveDropdown(null);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-black transition-all border min-h-[38px] cursor-pointer ${
                activeTab === 'founder'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black border-amber-300 shadow-md shadow-amber-950/60 font-black'
                  : isDark ? 'text-amber-300 hover:bg-zinc-800/90 border-amber-500/30' : 'text-amber-800 hover:bg-amber-100 border-amber-300'
              }`}
            >
              <Award className={`h-4 w-4 ${activeTab === 'founder' ? 'text-black' : 'text-amber-400'}`} />
              <span>Founder</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                activeTab === 'founder' ? 'bg-black text-amber-300' : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}>
                DR. VICTOR
              </span>
            </button>

          </nav>

          {/* RIGHT ACTION CONTROLS: AI Theme Toggle, Admin Toggle, Auth & VOX AI Drawer */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* AI Random Theme Button & Palette Launcher */}
            <div className={`relative flex items-center space-x-1 p-1 rounded-2xl shadow-md border ${
              isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-[#f7f3eb] border-[#e8dfd3]'
            }`}>
              {/* Random Theme Trigger */}
              <button
                onClick={onRandomTheme}
                title="AI Random Theme: Click to synthesize and randomize theme palette"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 hover:from-zinc-700 hover:to-zinc-600 text-white text-xs font-mono font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer min-h-[38px] border border-zinc-600"
              >
                <Dices className="h-4 w-4 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="hidden md:inline">Theme</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/40 text-zinc-200 rounded font-bold">🖤</span>
              </button>

              {/* Theme Palette Quick Dropdown Trigger */}
              <button
                onClick={() => setIsPaletteDropdownOpen(!isPaletteDropdownOpen)}
                title="Open Quick Theme Palette Picker"
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-1 ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                    : 'bg-[#ffffff] border-[#e8dfd3] text-[#78350f] hover:bg-[#faf6ee]'
                }`}
              >
                <Palette className={`h-4 w-4 ${isDark ? 'text-amber-400' : 'text-[#b45309]'}`} />
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Unique Palette Quick Switcher Flyout */}
              {isPaletteDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsPaletteDropdownOpen(false)}
                  className="absolute right-0 top-12 w-72 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 font-sans space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      ✨ Unique Theme Palettes
                    </span>
                    <button
                      onClick={() => {
                        setIsPaletteDropdownOpen(false);
                        if (onOpenThemeModal) onOpenThemeModal();
                      }}
                      className="text-[10px] text-cyan-400 hover:underline font-mono"
                    >
                      All 18 &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1">
                    {[
                      { id: 'shades-of-black', name: 'Shades of Black', mood: 'Multi-Tiered Deep Obsidian', colors: ['#000000', '#121215', '#27272a'] },
                      { id: 'monochrome-stealth', name: 'Monochrome Stealth', mood: 'Absolute Tactical Black & White', colors: ['#000000', '#09090b', '#ffffff'] },
                      { id: 'pitch-black', name: 'True Pitch Black', mood: 'OLED Zero-Light Pitch Black', colors: ['#000000', '#0c0c0f', '#1f1f24'] },
                      { id: 'carbon-graphite', name: 'Carbon Fiber & Graphite', mood: 'Brushed Tungsten & Carbon Mesh', colors: ['#08080a', '#15151a', '#334155'] },
                      { id: 'cyber-dark', name: 'Cyber Midnight', mood: 'Cyberpunk OLED High-Contrast', colors: ['#09090b', '#06b6d4', '#3b82f6'] },
                      { id: 'matrix-emerald', name: 'Matrix Emerald', mood: 'Phosphor Green Terminal', colors: ['#030a05', '#10b981', '#34d399'] },
                      { id: 'espresso-crema', name: 'Espresso Crema', mood: 'Dark Roast & Velvet Foam', colors: ['#18110b', '#d97706', '#fef3c7'] },
                      { id: 'amethyst-royale', name: 'Amethyst Royale', mood: 'Imperial Deep Violet & Gold', colors: ['#581c87', '#9333ea', '#eab308'] }
                    ].map(p => {
                      const isActive = currentThemeId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (onSelectTheme) onSelectTheme(p.id as ThemeId);
                            setIsPaletteDropdownOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                              : 'bg-zinc-900 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-xs block truncate">{p.name}</span>
                            <span className="text-[10px] text-zinc-500 block truncate">{p.mood}</span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            {p.colors.map((c, i) => (
                              <span key={i} className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Standard Light/Dark Toggle */}
            <button
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              title={isDark ? 'Switch to Warm Milk / Light Theme' : 'Switch to Dark Mode'}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-700 text-amber-300 hover:bg-zinc-800' 
                  : 'bg-[#f7f3eb] border-[#e8dfd3] text-[#78350f] hover:bg-[#ffffff]'
              }`}
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Admin Mode Toggle Button */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              title="Toggle Administrative Functions & Infrastructure Tools"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-mono font-bold border transition-all min-h-[42px] cursor-pointer ${
                isAdminMode
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md scale-[1.02]'
                  : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-[#f7f3eb] border-[#e8dfd3] text-[#57534e] hover:bg-[#ffffff]'
              }`}
            >
              <ShieldCheck className={`h-4 w-4 ${isAdminMode ? 'text-white' : isDark ? 'text-amber-400' : 'text-[#b45309]'}`} />
              <span className="hidden sm:inline">Admin</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                isAdminMode 
                  ? 'bg-black text-amber-300' 
                  : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-[#efe6d8] text-[#78350f]'
              }`}>
                {isAdminMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Auth User Status / Sign In */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className={`hidden sm:flex flex-col text-right ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                  <span className="text-xs font-black leading-tight truncate max-w-[110px]">{currentUser.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{currentUser.role === 'admin' ? 'Operator' : 'User'}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-md min-h-[42px] cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* VOX AI Drawer Button */}
            <button
              id="btn-toggle-ai-drawer"
              onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-black transition-all border min-h-[42px] cursor-pointer shadow-lg ${
                aiDrawerOpen
                  ? 'bg-cyan-500 text-black border-cyan-400 scale-[1.02]'
                  : isDark
                    ? 'bg-zinc-900 border-zinc-800 text-cyan-300 hover:bg-zinc-800 hover:border-cyan-500/50'
                    : 'bg-zinc-100 border-zinc-300 text-cyan-700 hover:bg-zinc-200'
              }`}
            >
              <Bot className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">VOX AI</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </button>

          </div>

        </div>

        {/* SECONDARY CONTEXTUAL SUB-NAVIGATION PILL BAR */}
        <div className={`py-2 px-3 border-t flex items-center space-x-2 overflow-x-auto text-xs font-mono no-scrollbar ${
          isDark ? 'border-zinc-800/80 bg-zinc-950/95' : 'border-zinc-200 bg-zinc-50'
        }`}>
          <span className="text-[11px] uppercase font-bold text-cyan-400 shrink-0 px-2 flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Active Sub-Tools:</span>
          </span>

          {/* 1. Cryptographic Suite Sub-Tools (18) */}
          {activeTab === 'advance_crypto_tools' && (
            cryptoSubToolsList.map(item => {
              const isSelected = selectedCryptoSubTool === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (setSelectedCryptoSubTool) setSelectedCryptoSubTool(item.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 whitespace-nowrap font-bold transition-all border shrink-0 cursor-pointer min-h-[34px] ${
                    isSelected
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm scale-[1.02]'
                      : isDark
                        ? 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-zinc-850'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-cyan-500 hover:bg-zinc-100'
                  }`}
                >
                  <IconComp className={`h-3.5 w-3.5 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })
          )}

          {/* 2. AI & Tools Sub-Navigation */}
          {['tools', 'voice_to_text', 'text_to_video'].includes(activeTab) && (
            <>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 whitespace-nowrap font-bold transition-all border shrink-0 min-h-[34px] cursor-pointer ${
                  activeTab === 'tools'
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Bot className="h-3.5 w-3.5 text-cyan-400" />
                <span>AI Assistant &amp; Code Generator</span>
              </button>
              <button
                onClick={() => setActiveTab('voice_to_text')}
                className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 whitespace-nowrap font-bold transition-all border shrink-0 min-h-[34px] cursor-pointer ${
                  activeTab === 'voice_to_text'
                    ? 'bg-amber-400 text-black border-amber-300 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Mic className="h-3.5 w-3.5 text-amber-400" />
                <span>Voice Speech-to-Text Transcriber</span>
              </button>
              <button
                onClick={() => setActiveTab('text_to_video')}
                className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 whitespace-nowrap font-bold transition-all border shrink-0 min-h-[34px] cursor-pointer ${
                  activeTab === 'text_to_video'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Video className="h-3.5 w-3.5 text-rose-400" />
                <span>AI Text-to-Video Synthesizer</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('advance_crypto_tools');
                  if (setSelectedCryptoSubTool) setSelectedCryptoSubTool('intentional_vision');
                }}
                className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 whitespace-nowrap font-bold transition-all border shrink-0 min-h-[34px] cursor-pointer ${
                  isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-purple-400" />
                <span>SIMD Computer Vision Studio</span>
              </button>
            </>
          )}

          {/* 3. Blog & Publishing Hub Sub-Navigation */}
          {['hosted_pages', 'network_tools_vendors', 'classifieds', 'ecommerce', 'web3_farming', 'hosted_browser'].includes(activeTab) && (
            <>
              <button
                onClick={() => setActiveTab('hosted_pages')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'hosted_pages'
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <BookOpen className="h-3 w-3 text-emerald-400" />
                <span>ICR Tech Blog &amp; KB</span>
              </button>
              <button
                onClick={() => setActiveTab('network_tools_vendors')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'network_tools_vendors'
                    ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Wrench className="h-3 w-3 text-blue-400" />
                <span>Vendor Directory &amp; APIs</span>
              </button>
              <button
                onClick={() => setActiveTab('classifieds')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'classifieds'
                    ? 'bg-amber-400 text-black border-amber-300 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Tag className="h-3 w-3 text-amber-400" />
                <span>P2P Classifieds</span>
              </button>
              <button
                onClick={() => setActiveTab('ecommerce')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'ecommerce'
                    ? 'bg-purple-500 text-white border-purple-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <ShoppingBag className="h-3 w-3 text-purple-400" />
                <span>Digital E-Commerce Store</span>
              </button>
              <button
                onClick={() => setActiveTab('web3_farming')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'web3_farming'
                    ? 'bg-emerald-400 text-black border-emerald-300 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Coins className="h-3 w-3 text-emerald-400" />
                <span>Web3 $DEPO Yield Farming</span>
              </button>
              <button
                onClick={() => setActiveTab('hosted_browser')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'hosted_browser'
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Globe className="h-3 w-3 text-cyan-400" />
                <span>Virtual Browser Sandbox</span>
              </button>
            </>
          )}

          {/* 4. Infrastructure Sub-Navigation */}
          {['telemetry', 'n8n'].includes(activeTab) && (
            <>
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'telemetry'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Activity className="h-3 w-3 text-purple-400" />
                <span>SubNet Telemetry Engine</span>
              </button>
              <button
                onClick={() => setActiveTab('n8n')}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  activeTab === 'n8n'
                    ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                    : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Workflow className="h-3 w-3 text-amber-400" />
                <span>n8n Workflow Mesh</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('advance_crypto_tools');
                  if (setSelectedCryptoSubTool) setSelectedCryptoSubTool('server_manager');
                }}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Server className="h-3 w-3 text-cyan-400" />
                <span>Container Server Mesh</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('advance_crypto_tools');
                  if (setSelectedCryptoSubTool) setSelectedCryptoSubTool('network_topology');
                }}
                className={`px-3 py-1 rounded-lg flex items-center space-x-1 whitespace-nowrap font-bold transition-all border shrink-0 ${
                  isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                <Network className="h-3 w-3 text-emerald-400" />
                <span>Topology Canvas</span>
              </button>
            </>
          )}

        </div>

        {/* MOBILE NAVIGATION QUICK BAR */}
        <div className="flex xl:hidden items-center justify-between py-2 border-t border-zinc-800/80 text-xs font-mono font-bold overflow-x-auto gap-2">
          <button
            onClick={() => {
              setActiveTab('virtual_internet');
            }}
            className={`px-3 py-1.5 rounded-lg flex-1 text-center whitespace-nowrap ${activeTab === 'virtual_internet' || activeTab === 'vip' ? 'bg-cyan-500 text-black font-extrabold shadow-sm' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'}`}
          >
            VIP (20)
          </button>
          <button
            onClick={() => {
              setActiveTab('advance_crypto_tools');
              if (setSelectedCryptoSubTool) setSelectedCryptoSubTool('injunctions');
            }}
            className={`px-3 py-1.5 rounded-lg flex-1 text-center whitespace-nowrap ${activeTab === 'advance_crypto_tools' ? 'bg-cyan-500 text-black font-extrabold' : 'bg-zinc-900 text-zinc-300'}`}
          >
            Crypto (18)
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded-lg flex-1 text-center ${activeTab === 'tools' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}
          >
            VOX AI
          </button>
          <button
            onClick={() => setActiveTab('hosted_pages')}
            className={`px-3 py-1.5 rounded-lg flex-1 text-center ${activeTab === 'hosted_pages' ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}
          >
            VOX Blog
          </button>
          <button
            onClick={() => setActiveTab('network_tools_vendors')}
            className={`px-3 py-1.5 rounded-lg flex-1 text-center ${activeTab === 'network_tools_vendors' ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-400'}`}
          >
            Vendors
          </button>
          <button
            onClick={() => setActiveTab('classifieds')}
            className={`px-3 py-1.5 rounded-lg flex-1 text-center ${activeTab === 'classifieds' ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'}`}
          >
            Classifieds
          </button>
        </div>

      </div>

      {/* GLOBAL SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/80 backdrop-blur-md">
            
            {/* Click backdrop to exit */}
            <div 
              className="absolute inset-0"
              onClick={() => setIsSearchOpen(false)}
            ></div>

            {/* Modal Container */}
            <motion.div 
              ref={searchModalRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-zinc-950 border-2 border-cyan-500/60 rounded-3xl shadow-2xl overflow-hidden z-10 font-sans"
            >
              
              {/* Search Bar Input */}
              <div className="flex items-center px-4 py-3.5 border-b border-zinc-800/80 bg-zinc-900/90 space-x-3">
                <Search className="h-5 w-5 text-cyan-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 18 crypto tools, AI generators, servers, IP addresses..."
                  className="flex-1 bg-transparent text-white focus:outline-none text-sm font-mono placeholder:text-zinc-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-mono font-bold hover:text-white"
                >
                  ESC
                </button>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center space-x-1.5 px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-950 overflow-x-auto text-xs font-mono">
                {['All', 'Cryptographic Tools', 'AI & Intelligence', 'Infrastructure', 'Publishing & Services', 'Server Nodes'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all border ${
                      selectedCategoryFilter === cat
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Results List */}
              <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                {filteredSearchItems.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Search className="h-8 w-8 text-zinc-600 mx-auto animate-bounce" />
                    <p className="text-zinc-400 font-bold text-sm">No matching tools or server nodes found</p>
                    <p className="text-zinc-600 text-xs font-mono">Try searching for &quot;OOB&quot;, &quot;Firewall&quot;, &quot;Gasless&quot;, &quot;Proxy&quot;, or an IP like &quot;10.142&quot;</p>
                  </div>
                ) : (
                  filteredSearchItems.map(item => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSearchItem(item)}
                        className="w-full text-left p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-cyan-500/50 transition-all group flex items-center justify-between space-x-3"
                      >
                        <div className="flex items-start space-x-3 truncate">
                          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-cyan-400 group-hover:border-cyan-500/50 group-hover:scale-105 transition-all shrink-0">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                            {item.category}
                          </span>
                          <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer info bar */}
              <div className="px-4 py-2.5 border-t border-zinc-800/80 bg-zinc-900/90 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>Total Index: {allSearchItems.length} Workspaces &amp; Nodes</span>
                <span>Press <strong className="text-cyan-400">ESC</strong> or click outside to exit</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
};
