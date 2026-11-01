import React from 'react';
import { IcrLogo } from './IcrLogo';
import {
  ShieldCheck,
  Activity,
  Globe,
  Sparkles,
  Layers,
  Terminal,
  FileCode,
  Lock,
  ArrowUpRight,
  Boxes,
  Cpu
} from 'lucide-react';

interface EnterpriseFooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenTelemetry?: () => void;
  onOpenAppCreation?: () => void;
  themeMode?: 'dark' | 'light';
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({
  onNavigateTab,
  onOpenTelemetry,
  onOpenAppCreation,
  themeMode = 'light'
}) => {
  const isDark = themeMode === 'dark';

  return (
    <footer className={`mt-20 border-t transition-colors duration-300 font-sans ${
      isDark ? 'border-zinc-800/80 bg-zinc-950 text-zinc-400' : 'border-[#e8dfd3] bg-[#f7f3eb] text-[#57534e]'
    }`}>
      
      {/* Top Status & Metrics Banner */}
      <div className={`border-b ${isDark ? 'border-zinc-900 bg-zinc-900/40' : 'border-[#e8dfd3] bg-[#faf6ed]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center space-x-2 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold">ALL SYSTEMS OPERATIONAL</span>
            </div>
            <span className={`${isDark ? 'text-zinc-700' : 'text-[#d7cbba]'} hidden sm:inline`}>|</span>
            <span>Mesh Latency: <strong className={isDark ? 'text-white' : 'text-[#1c1917]'}>1.8ms</strong></span>
            <span className={`${isDark ? 'text-zinc-700' : 'text-[#d7cbba]'} hidden sm:inline`}>|</span>
            <span>Active Adapters: <strong className={isDark ? 'text-cyan-400' : 'text-[#b45309]'}>20 / 20</strong></span>
            <span className={`${isDark ? 'text-zinc-700' : 'text-[#d7cbba]'} hidden sm:inline`}>|</span>
            <span>OTLP Collector: <strong className={isDark ? 'text-purple-400' : 'text-[#78350f]'}>10.142.0.12:4317</strong></span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('protocol_engine')}
              className={`hover:text-[#b45309] transition-colors flex items-center space-x-1 cursor-pointer font-bold`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Live Telemetry</span>
            </button>
            <span className={isDark ? 'text-zinc-700' : 'text-[#d7cbba]'}>•</span>
            <button
              onClick={() => onNavigateTab('bte_identity')}
              className={`hover:text-[#b45309] transition-colors flex items-center space-x-1 cursor-pointer font-bold`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>BTE-ID Anchor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Overview */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <IcrLogo size={36} isDark={isDark} withGlow={false} />
              <span className={`font-mono text-xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-[#1c1917]'
              }`}>
                Integrational Compute Repository (ICR)
              </span>
            </div>
            <p className={`text-sm max-w-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#57534e]'}`}>
              Integrational Compute Repository (ICR), Google AI Studio application builder, autonomous execution agent, and inclusive protocol engine with 20 pluggable category modules.
            </p>
            <div className={`pt-2 text-xs font-mono ${isDark ? 'text-zinc-500' : 'text-[#78716c]'}`}>
              Architecture Standard: W3C DID • RFC 5424 • OTLP gRPC • QUIC
            </div>
          </div>

          {/* Col 2: AI & Generation */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-[#1c1917]'
            }`}>
              AI &amp; Studio Suite
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigateTab('app_creation')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  AI App Creation Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('chat_bot')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Chat Bot Execution Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tools')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Generative Playground
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('voice_to_text')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Voice-to-Text Transcriber
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('text_to_video')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Text-to-Video Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Protocol & Mesh */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-[#1c1917]'
            }`}>
              Protocols &amp; Mesh
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigateTab('protocol_engine')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  20-Category Installer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('protocol_engine')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Plugin Registry &amp; Hooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('protocol_engine')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Visual Telemetry Monitor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('founder')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left font-bold text-amber-500 flex items-center space-x-1"
                >
                  <span>★ Dr. Victor — Founder Profile</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('bte_identity')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  BTE-ID Identity Anchor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('topology')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Network Topology Canvas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Infrastructure & Security */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-[#1c1917]'
            }`}>
              Infrastructure
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigateTab('servers')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Private Server Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('injunctions')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Code Injunction Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('radar')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Radar Port Sniffer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('hosting')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Cloud Hosting &amp; Ingress
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('opensource')}
                  className="hover:text-[#b45309] transition-colors cursor-pointer text-left"
                >
                  Open Source Hub
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
          isDark ? 'border-zinc-900 text-zinc-500' : 'border-[#e8dfd3] text-[#78716c]'
        }`}>
          <div>
            &copy; {new Date().getFullYear()} Integrational Compute Repository (ICR). All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-[#1c1917] cursor-pointer">Privacy Notice</span>
            <span className="hover:text-[#1c1917] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#1c1917] cursor-pointer">Security Attestations</span>
            <span className={isDark ? 'text-cyan-400' : 'text-[#b45309] font-bold'}>v1.0 Sovereign Edition</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
