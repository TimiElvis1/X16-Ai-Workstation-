import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Maximize2,
  Minimize2,
  X,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Download,
  Copy,
  Check,
  Play,
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  Sun,
  Moon,
  ChevronRight,
  Send,
  Database
} from 'lucide-react';

interface AppLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  category?: string;
  livePreviewData?: {
    title: string;
    mockData?: any;
    primaryAction?: string;
    sampleMetrics?: Array<{ label: string; value: string; change: string }>;
  };
  files?: Array<{ filename: string; language: string; content: string }>;
  apiEndpoints?: Array<{ method: string; path: string; description: string }>;
}

export const AppLivePreviewModal: React.FC<AppLivePreviewModalProps> = ({
  isOpen,
  onClose,
  appName = 'SubNet Telemetry & Node Monitor',
  category = 'Infrastructure & Telemetry',
  livePreviewData,
  files = [],
  apiEndpoints = []
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [networkLatency, setNetworkLatency] = useState<'fiber' | '5g' | '3g'>('fiber');
  const [activeTab, setActiveTab] = useState<'app' | 'console' | 'api' | 'state'>('app');
  
  // Interactive mock app internal state
  const [counter, setCounter] = useState<number>(142);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [actionLogs, setActionLogs] = useState<Array<{ id: string; time: string; action: string; status: string }>>([
    { id: '1', time: '12:00:01', action: 'Handshake initiated via QUIC transport', status: '200 OK' },
    { id: '2', time: '12:00:04', action: 'Telemetry stream attached to OTLP collector', status: '200 OK' },
    { id: '3', time: '12:00:08', action: 'BTE Identity Anchor verified', status: 'VALIDATED' }
  ]);
  const [isSimulatingAction, setIsSimulatingAction] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateAction = (actionName: string) => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setCounter(c => c + 1);
      const newLog = {
        id: String(Date.now()),
        time: new Date().toLocaleTimeString(),
        action: `Executed action: ${actionName}`,
        status: 'SUCCESS'
      };
      setActionLogs(prev => [newLog, ...prev]);
      setIsSimulatingAction(false);
    }, networkLatency === 'fiber' ? 120 : networkLatency === '5g' ? 350 : 800);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-7xl h-[92vh] bg-[#fcfaf6] border border-[#e8dfd3] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1c1917]"
      >
        {/* Apple-Amazon Inspired Top Command Bar */}
        <div className="p-4 sm:px-6 bg-[#faf6ee] border-b border-[#e8dfd3] flex flex-wrap items-center justify-between gap-4">
          
          {/* App Title & Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#fef3c7] border border-[#fde68a] text-[#92400e]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-[#1c1917] tracking-tight">{appName}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                  🥛 Live Milk Preview
                </span>
              </div>
              <p className="text-xs text-[#57534e] mt-0.5">
                {category} • Interactive Sandbox Environment
              </p>
            </div>
          </div>

          {/* Viewport Device Selectors & Controls */}
          <div className="flex items-center space-x-2 bg-[#ffffff] p-1 rounded-2xl border border-[#dfd4c3]">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewport === 'desktop' ? 'bg-[#b45309] text-white shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
              title="Desktop View (1440x900)"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              onClick={() => setViewport('tablet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewport === 'tablet' ? 'bg-[#b45309] text-white shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
              title="Tablet View (1024x768)"
            >
              <Tablet className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>

            <button
              onClick={() => setViewport('mobile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewport === 'mobile' ? 'bg-[#b45309] text-white shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
              title="Mobile View (390x844)"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Secondary Controls: Theme & Network Simulator & Close */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-[#ffffff] hover:bg-[#efe6d8] text-[#1c1917] border border-[#dfd4c3] transition-all cursor-pointer"
              title="Toggle Light / Dark mode in preview"
            >
              {previewTheme === 'dark' ? <Sun className="h-4 w-4 text-[#b45309]" /> : <Moon className="h-4 w-4 text-[#78350f]" />}
            </button>

            <button
              onClick={handleCopyShareLink}
              className="px-3 py-2 rounded-xl bg-[#ffffff] hover:bg-[#efe6d8] text-[#1c1917] border border-[#dfd4c3] text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-[#15803d]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#ffffff] hover:bg-rose-50 text-[#78716c] hover:text-rose-600 border border-[#dfd4c3] transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Sub-Header (App View, Live Debugger, API Endpoints) */}
        <div className="px-6 py-2.5 bg-[#f5eedc] border-b border-[#e8dfd3] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'app' ? 'bg-[#ffffff] text-[#92400e] shadow-sm border border-[#dfd4c3]' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              App Canvas
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'console' ? 'bg-[#ffffff] text-[#78350f] shadow-sm border border-[#dfd4c3]' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              Logs &amp; Console ({actionLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'api' ? 'bg-[#ffffff] text-[#15803d] shadow-sm border border-[#dfd4c3]' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              API Routes ({apiEndpoints.length || 3})
            </button>
          </div>

          <div className="flex items-center space-x-3 text-[#78716c]">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Simulated Latency: {networkLatency === 'fiber' ? '1.2ms (Fiber)' : networkLatency === '5g' ? '28ms (5G)' : '180ms (3G)'}</span>
            </span>
          </div>
        </div>

        {/* MAIN BODY: Interactive Canvas Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#faf6ee]/60 flex items-center justify-center">
          
          {activeTab === 'app' && (
            <div
              className={`w-full transition-all duration-300 rounded-3xl overflow-hidden shadow-xl border ${
                previewTheme === 'dark' ? 'bg-[#1c1917] border-[#44403c] text-white' : 'bg-[#ffffff] border-[#e8dfd3] text-[#1c1917]'
              } ${
                viewport === 'mobile' ? 'max-w-sm h-[680px]' : viewport === 'tablet' ? 'max-w-2xl h-[700px]' : 'max-w-5xl'
              }`}
            >
              {/* Simulated Browser Bar for Mobile / Desktop Window */}
              <div className={`p-3 border-b flex items-center justify-between text-xs ${
                previewTheme === 'dark' ? 'bg-[#292524] border-[#44403c] text-[#a8a29e]' : 'bg-[#f5eedc] border-[#e8dfd3] text-[#57534e]'
              }`}>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="px-4 py-1 rounded-full bg-black/5 text-[11px] font-mono truncate max-w-xs">
                  https://app.agvora.network/{appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                </div>
                <button
                  onClick={() => handleSimulateAction('Refresh Data')}
                  className="hover:text-[#b45309] cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Interactive App Canvas Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[600px]">
                
                {/* Header in App */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-[#e8dfd3]">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">{appName}</h2>
                    <p className={`text-xs mt-0.5 ${previewTheme === 'dark' ? 'text-zinc-400' : 'text-[#57534e]'}`}>
                      Autonomous Application Preview Sandbox
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSimulateAction(livePreviewData?.primaryAction || 'Deploy Node Action')}
                      disabled={isSimulatingAction}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#92400e] hover:to-[#b45309] text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      {isSimulatingAction ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Zap className="h-3.5 w-3.5" />
                      )}
                      <span>{livePreviewData?.primaryAction || 'Execute Trigger'}</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Cards in App */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(livePreviewData?.sampleMetrics || [
                    { label: 'Total Operations', value: `${counter.toLocaleString()}`, change: '+14.2%' },
                    { label: 'Active Clusters', value: '8 Nodes', change: 'Optimal' },
                    { label: 'Mesh Throughput', value: '4.8 GB/s', change: '99.98% SLA' }
                  ]).map((metric, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        previewTheme === 'dark' ? 'bg-[#292524] border-[#44403c]' : 'bg-[#faf6ee] border-[#e8dfd3]'
                      }`}
                    >
                      <span className={`text-[11px] font-mono uppercase block ${
                        previewTheme === 'dark' ? 'text-zinc-400' : 'text-[#78716c]'
                      }`}>
                        {metric.label}
                      </span>
                      <div className={`text-xl font-bold font-mono mt-1 ${previewTheme === 'dark' ? 'text-amber-400' : 'text-[#92400e]'}`}>
                        {idx === 0 ? counter : metric.value}
                      </div>
                      <span className="text-[11px] text-[#15803d] mt-0.5 block font-mono font-bold">
                        {metric.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Simulated Interactive Search & Controls */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  previewTheme === 'dark' ? 'bg-[#292524] border-[#44403c]' : 'bg-[#faf6ee] border-[#e8dfd3]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">Live Interactive Control Hub</span>
                    <span className="text-[10px] font-mono text-[#b45309] font-bold">State: Interactive</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Filter node entities or keys..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                        previewTheme === 'dark' ? 'bg-[#1c1917] border-[#44403c] text-white' : 'bg-[#ffffff] border-[#dfd4c3] text-[#1c1917]'
                      }`}
                    />
                    <button
                      onClick={() => handleSimulateAction(`Query "${searchQuery || 'default'}"`)}
                      className="px-3.5 py-2 rounded-xl bg-[#78350f] hover:bg-[#451a03] text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-sm"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {/* Simulated Data Records Table */}
                <div className={`rounded-2xl border overflow-hidden ${
                  previewTheme === 'dark' ? 'bg-[#292524] border-[#44403c]' : 'bg-[#faf6ee] border-[#e8dfd3]'
                }`}>
                  <div className="p-3 border-b border-[#e8dfd3] flex items-center justify-between text-xs font-mono">
                    <span className="font-bold">Active Cluster Node Records</span>
                    <span className="text-[#78716c]">Auto-Refreshing</span>
                  </div>

                  <div className="divide-y divide-[#e8dfd3] text-xs font-mono">
                    {[
                      { id: 'node-01', region: 'us-east-alpha', status: 'ONLINE', load: '14%', ping: '1.2ms' },
                      { id: 'node-02', region: 'eu-central-mesh', status: 'ONLINE', load: '22%', ping: '4.8ms' },
                      { id: 'node-03', region: 'ap-east-gateway', status: 'STANDBY', load: '8%', ping: '12.4ms' }
                    ].map(row => (
                      <div key={row.id} className="p-3 flex items-center justify-between hover:bg-[#ffffff]/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold">{row.id}</span>
                          <span className="text-[#78716c]">({row.region})</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-[#78716c]">Load: {row.load}</span>
                          <span className="text-[#b45309] font-bold">{row.ping}</span>
                          <button
                            onClick={() => handleSimulateAction(`Ping ${row.id}`)}
                            className="px-2 py-1 rounded bg-[#ffffff] hover:bg-[#faf6ee] text-[10px] text-[#78350f] font-bold border border-[#dfd4c3]"
                          >
                            Ping
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: LIVE CONSOLE LOGS */}
          {activeTab === 'console' && (
            <div className="w-full max-w-4xl rounded-3xl bg-[#ffffff] border border-[#e8dfd3] p-6 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-[#b45309]" />
                  <span className="font-bold text-[#1c1917]">Live Application Sandbox Console</span>
                </div>
                <button
                  onClick={() => setActionLogs([])}
                  className="text-[#78716c] hover:text-[#1c1917] text-[11px] cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              <div className="space-y-2 h-96 overflow-y-auto pr-2 custom-scrollbar">
                {actionLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-[#faf6ee] border border-[#e8dfd3] flex items-center justify-between text-[#292524]">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#a8a29e]">[{log.time}]</span>
                      <span>{log.action}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] font-bold">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: API CONTRACTS */}
          {activeTab === 'api' && (
            <div className="w-full max-w-4xl rounded-3xl bg-[#ffffff] border border-[#e8dfd3] p-6 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-3">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-[#15803d]" />
                  <span className="font-bold text-[#1c1917]">Backend Server API Contracts</span>
                </div>
                <span className="text-[#78716c] text-[11px]">Express / REST Protocol</span>
              </div>

              <div className="space-y-3">
                {(apiEndpoints.length > 0 ? apiEndpoints : [
                  { method: 'GET', path: '/api/telemetry/nodes', description: 'Fetches real-time cluster node status & metrics' },
                  { method: 'POST', path: '/api/actions/trigger', description: 'Executes sandboxed node failover action' },
                  { method: 'GET', path: '/api/health', description: 'System health check and uptime probe' }
                ]).map((ep, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e8dfd3] space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        ep.method === 'GET' ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]' : 'bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]'
                      }`}>
                        {ep.method}
                      </span>
                      <code className="text-[#92400e] font-bold">{ep.path}</code>
                    </div>
                    <p className="text-[#57534e] text-xs">{ep.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer in Modal */}
        <div className="p-4 bg-[#faf6ee] border-t border-[#e8dfd3] flex flex-wrap items-center justify-between text-xs font-mono text-[#57534e] gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-[#b45309]" />
            <span>Google AI Studio Architecture Compliant • Vite + React 18 + Node.js</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#ffffff] hover:bg-[#efe6d8] text-[#1c1917] border border-[#dfd4c3] font-bold transition-all cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
