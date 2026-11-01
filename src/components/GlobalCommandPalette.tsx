import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Sparkles,
  Activity,
  Boxes,
  ShieldCheck,
  Server,
  Code,
  Globe,
  Radio,
  FileCode,
  Terminal,
  Zap,
  ArrowRight,
  Command,
  X,
  Play,
  Layers,
  Settings,
  Workflow,
  MapPin,
  Award
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'AI & Generation' | 'Protocols & Telemetry' | 'Infrastructure' | 'Identity & Cryptography';
  title: string;
  subtitle: string;
  icon: any;
  action: () => void;
  shortcut?: string;
}

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAppPreview?: () => void;
  onOpenTelemetryMonitor?: () => void;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenAppPreview,
  onOpenTelemetryMonitor
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command items catalog
  const commands: CommandItem[] = [
    {
      id: 'cmd-ai-top-tools',
      category: 'AI & Generation',
      title: 'AITopTools Directory & Dynamic AI Function Toggler',
      subtitle: 'Scraped index of top AI tools with toggleable schemas & multi-format export',
      icon: Sparkles,
      action: () => {
        onNavigateTab('ai_top_tools');
        onClose();
      },
      shortcut: '⇧D'
    },
    {
      id: 'cmd-ai-assistant-bot',
      category: 'AI & Generation',
      title: 'AI Assistant Bot Studio',
      subtitle: 'Autonomous multi-persona agent with code injunction dispatch & live diagnostics',
      icon: Terminal,
      action: () => {
        onNavigateTab('ai_assistant_bot');
        onClose();
      },
      shortcut: '⇧B'
    },
    {
      id: 'cmd-app-creator',
      category: 'AI & Generation',
      title: 'AI App Creation Studio',
      subtitle: 'Google AI Studio multi-file app generator & live preview sandbox',
      icon: Sparkles,
      action: () => {
        onNavigateTab('app_creation');
        onClose();
      },
      shortcut: '⇧A'
    },
    {
      id: 'cmd-app-preview',
      category: 'AI & Generation',
      title: 'Launch Live App Preview',
      subtitle: 'Open full Apple-Amazon inspired app preview modal',
      icon: Play,
      action: () => {
        if (onOpenAppPreview) onOpenAppPreview();
        onClose();
      },
      shortcut: '⇧P'
    },
    {
      id: 'cmd-chat-exec',
      category: 'AI & Generation',
      title: 'Chat Bot Execution Agent',
      subtitle: 'Autonomous natural language prompt executor for system tasks',
      icon: Terminal,
      action: () => {
        onNavigateTab('chat_bot');
        onClose();
      }
    },
    {
      id: 'cmd-google-maps-geo',
      category: 'Infrastructure',
      title: 'Google Maps Real-Time Geo-Location Schematics',
      subtitle: 'Live GPS telemetry, global sovereign server node fleet mapping, & route distance tracer',
      icon: MapPin,
      action: () => {
        onNavigateTab('geo_map');
        onClose();
      },
      shortcut: '⇧M'
    },
    {
      id: 'cmd-telemetry-monitor',
      category: 'Protocols & Telemetry',
      title: 'Visual Telemetry Monitor',
      subtitle: 'Real-time packet flow stream and 20 pluggable module health matrix',
      icon: Activity,
      action: () => {
        onNavigateTab('protocol_engine');
        if (onOpenTelemetryMonitor) onOpenTelemetryMonitor();
        onClose();
      },
      shortcut: '⇧T'
    },
    {
      id: 'cmd-plugin-registry',
      category: 'Protocols & Telemetry',
      title: 'Inclusive Protocol Engine & Plugins',
      subtitle: '20 identified category adapters, hooks, and OTLP server binding',
      icon: Boxes,
      action: () => {
        onNavigateTab('protocol_engine');
        onClose();
      }
    },
    {
      id: 'cmd-founder-profile',
      category: 'Identity & Cryptography',
      title: 'Dr. Victor — Founder, Technologist & Innovator',
      subtitle: 'Executive founder profile of Dr. Victor Agboola, AI researcher, Computer Vision SDK & sovereign computing architecture',
      icon: Award,
      action: () => {
        onNavigateTab('founder');
        onClose();
      },
      shortcut: '⇧F'
    },
    {
      id: 'cmd-bte-id',
      category: 'Identity & Cryptography',
      title: 'BTE-ID Blockchain Identity Anchor',
      subtitle: 'Sovereign cryptographic keys, W3C DID, and attestation certificates',
      icon: ShieldCheck,
      action: () => {
        onNavigateTab('bte_identity');
        onClose();
      }
    },
    {
      id: 'cmd-server-mgr',
      category: 'Infrastructure',
      title: 'Private Server Generator & Cluster Manager',
      subtitle: 'Deploy containerized edge nodes and gateway reverse proxies',
      icon: Server,
      action: () => {
        onNavigateTab('servers');
        onClose();
      }
    },
    {
      id: 'cmd-code-injunctions',
      category: 'Infrastructure',
      title: 'Code Injunction Execution Studio',
      subtitle: 'High-security microservice execution across distributed nodes',
      icon: Code,
      action: () => {
        onNavigateTab('injunctions');
        onClose();
      }
    },
    {
      id: 'cmd-url-domain-grabber',
      category: 'Infrastructure',
      title: 'n8n URL & Domain Grabbing Extension',
      subtitle: 'Autonomous link harvesting, RFC 3986 regex extraction & n8n DAG export',
      icon: Workflow,
      action: () => {
        onNavigateTab('advance_crypto_tools');
        onClose();
      },
      shortcut: '⇧U'
    },
    {
      id: 'cmd-keyword-generator',
      category: 'AI & Generation',
      title: 'Keyword Generator & SEO Permutation Studio',
      subtitle: 'Multi-list Cartesian permutation generator, SEO intent classifier & technical dictionary',
      icon: Sparkles,
      action: () => {
        onNavigateTab('advance_crypto_tools');
        onClose();
      },
      shortcut: '⇧K'
    },
    {
      id: 'cmd-topology',
      category: 'Protocols & Telemetry',
      title: 'Network Topology Visualizer',
      subtitle: 'Interactive node graph and cluster routing canvas',
      icon: Globe,
      action: () => {
        onNavigateTab('topology');
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[12vh] p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -20 }}
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center space-x-3 bg-zinc-900/90">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, tool, or protocol name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
          />
          <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-mono">
              No matching commands or tools found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-white'
                      : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${
                      isSelected
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm truncate">{cmd.title}</span>
                        <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{cmd.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {cmd.shortcut && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {cmd.shortcut}
                      </span>
                    )}
                    <ArrowRight className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-zinc-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400">Intentional Infrastructure Network (IIN) Command Hub</span>
        </div>
      </motion.div>
    </div>
  );
};
