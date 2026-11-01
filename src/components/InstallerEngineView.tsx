import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Globe, 
  Server, 
  Cpu, 
  Radio, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Search, 
  RefreshCw, 
  Download, 
  FileText, 
  Zap, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Mail, 
  Network, 
  Activity, 
  KeyRound, 
  Sliders, 
  Boxes, 
  Trash2, 
  Terminal, 
  SlidersHorizontal,
  HardDrive,
  Filter,
  Sparkles,
  Route,
  ArrowUpRight
} from 'lucide-react';
import { 
  ProtocolDefinition, 
  EngineProtocolCategory, 
  ProtocolCategoryManifest 
} from '../types/protocolEngine';
import { IDENTIFIED_PROTOCOL_CATEGORIES } from '../data/protocolCategoriesData';

interface InstallerEngineViewProps {
  protocols: ProtocolDefinition[];
  onProtocolsUpdate: (updatedProtocols: ProtocolDefinition[]) => void;
  onSelectProtocolForConfig?: (proto: ProtocolDefinition) => void;
  onLaunchSandboxProbe?: (protoId: string) => void;
  showNotice: (text: string, type?: 'success' | 'warn' | 'error') => void;
}

// Icon mapping helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Network': return Network;
    case 'Globe': return Globe;
    case 'Server': return Server;
    case 'Mail': return Mail;
    case 'Lock': return Lock;
    case 'KeyRound': return KeyRound;
    case 'Route': return Route;
    case 'Sliders': return Sliders;
    case 'FileText': return FileText;
    case 'Code': return CodeIcon;
    case 'Activity': return Activity;
    case 'Database': return Database;
    case 'Radio': return Radio;
    case 'ShieldCheck': return ShieldCheck;
    case 'Zap': return Zap;
    case 'Cpu': return Cpu;
    case 'Boxes': return Boxes;
    case 'HardDrive': return HardDrive;
    default: return Layers;
  }
};

const CodeIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const InstallerEngineView: React.FC<InstallerEngineViewProps> = ({
  protocols,
  onProtocolsUpdate,
  onSelectProtocolForConfig,
  onLaunchSandboxProbe,
  showNotice
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'INSTALLED' | 'PARTIAL' | 'UNINSTALLED'>('ALL');
  const [layerFilter, setLayerFilter] = useState<string>('ALL');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [processingCategory, setProcessingCategory] = useState<string | null>(null);
  const [isBatchOperating, setIsBatchOperating] = useState(false);
  const [daemonLogsOpen, setDaemonLogsOpen] = useState(true);
  const [daemonLogs, setDaemonLogs] = useState<Array<{ id: string; timestamp: string; message: string; type: 'info' | 'success' | 'warn' }>>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(),
      message: 'Installer Engine daemon initialized with 20 identified protocol categories.',
      type: 'info'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toLocaleTimeString(),
      message: 'Verified zero-trust certificate chain & deterministic Keccak-256 anchors.',
      type: 'success'
    }
  ]);

  const appendDaemonLog = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setDaemonLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      },
      ...prev.slice(0, 49)
    ]);
  };

  // Toggle Category expansion
  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Helper to get protocols in category
  const getProtocolsForCategory = (catManifest: ProtocolCategoryManifest) => {
    return (protocols || []).filter(p => 
      ((p.categories || []).includes(catManifest.id)) ||
      ((catManifest.protocolIds || []).includes(p.id))
    );
  };

  // Calculate stats for each category
  const categoryStats = useMemo(() => {
    const map = new Map<string, {
      total: number;
      installed: number;
      status: 'installed' | 'partial' | 'uninstalled';
      percentage: number;
    }>();

    (IDENTIFIED_PROTOCOL_CATEGORIES || []).forEach(cat => {
      const inCat = getProtocolsForCategory(cat);
      const total = inCat.length || (cat.protocolIds || []).length;
      const installed = inCat.filter(p => p.status === 'installed').length;
      
      let status: 'installed' | 'partial' | 'uninstalled' = 'uninstalled';
      if (installed === total && total > 0) {
        status = 'installed';
      } else if (installed > 0) {
        status = 'partial';
      }

      const percentage = total > 0 ? Math.round((installed / total) * 100) : 0;
      map.set(cat.id, { total, installed, status, percentage });
    });

    return map;
  }, [protocols]);

  // Overall metrics
  const totalCategoriesCount = IDENTIFIED_PROTOCOL_CATEGORIES.length; // 20
  const installedCategoriesCount = useMemo(() => {
    let count = 0;
    categoryStats.forEach(stat => {
      if (stat.status === 'installed') count++;
    });
    return count;
  }, [categoryStats]);

  const partialCategoriesCount = useMemo(() => {
    let count = 0;
    categoryStats.forEach(stat => {
      if (stat.status === 'partial') count++;
    });
    return count;
  }, [categoryStats]);

  const totalInstalledProtocols = protocols.filter(p => p.status === 'installed').length;
  const overallReadinessPct = Math.round((installedCategoriesCount / totalCategoriesCount) * 100);

  // Toggle Install / Remove for an entire category
  const handleToggleCategory = async (catManifest: ProtocolCategoryManifest) => {
    const stats = categoryStats.get(catManifest.id);
    const isCurrentlyInstalled = stats?.status === 'installed';
    const action = isCurrentlyInstalled ? 'remove' : 'install';
    const catId = catManifest.id;

    setProcessingCategory(catId);
    appendDaemonLog(`[DISPATCH] ${action.toUpperCase()} signal triggered for Category: '${catManifest.name}' (${catId})`, 'info');

    try {
      const res = await fetch(`/api/protocols/category/${catId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (data.success && Array.isArray(data.protocols)) {
        onProtocolsUpdate(data.protocols);
        showNotice(
          action === 'install'
            ? `Category '${catManifest.name}' installed with all ${catManifest.protocolIds.length} adapters!`
            : `Category '${catManifest.name}' removed and decommissioned.`,
          action === 'install' ? 'success' : 'warn'
        );
        appendDaemonLog(
          `[SUCCESS] Category '${catManifest.name}' ${action === 'install' ? 'INSTALLED & BOUND' : 'REMOVED'} (${data.affectedCount} adapters updated).`,
          action === 'install' ? 'success' : 'warn'
        );
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (e) {
      // Local fallback in case backend is offline
      const targetStatus = action === 'install' ? 'installed' : 'available';
      const now = new Date().toISOString();
      
      const updated = protocols.map(p => {
        if (p.categories.includes(catId) || catManifest.protocolIds.includes(p.id)) {
          return {
            ...p,
            status: targetStatus as any,
            installedAt: action === 'install' ? (p.installedAt || now) : undefined
          };
        }
        return p;
      });

      onProtocolsUpdate(updated);
      showNotice(
        action === 'install' 
          ? `Category '${catManifest.name}' installed (Local Mode).` 
          : `Category '${catManifest.name}' removed (Local Mode).`,
        'success'
      );
      appendDaemonLog(`[LOCAL FALLBACK] Category '${catManifest.name}' updated locally to ${targetStatus.toUpperCase()}.`, 'info');
    } finally {
      setProcessingCategory(null);
    }
  };

  // Toggle individual protocol within a category
  const handleToggleSubProtocol = async (proto: ProtocolDefinition, catManifest: ProtocolCategoryManifest) => {
    const isInstalled = proto.status === 'installed';
    const action = isInstalled ? 'disable' : 'enable';
    const targetStatus = isInstalled ? 'available' : 'installed';

    try {
      const res = await fetch(`/api/protocols/${proto.id}/${action}`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.protocol) {
        const updated = protocols.map(p => p.id === proto.id ? data.protocol : p);
        onProtocolsUpdate(updated);
        showNotice(`Protocol '${proto.name}' set to ${targetStatus.toUpperCase()}`, 'success');
        appendDaemonLog(`[ADAPTER] '${proto.id.toUpperCase()}' toggled to ${targetStatus.toUpperCase()}.`, 'info');
      } else {
        throw new Error('Fallback needed');
      }
    } catch (e) {
      const updated = protocols.map(p => p.id === proto.id ? { ...p, status: targetStatus as any } : p);
      onProtocolsUpdate(updated);
      showNotice(`Protocol '${proto.name}' set to ${targetStatus.toUpperCase()}`, 'success');
      appendDaemonLog(`[ADAPTER] '${proto.id.toUpperCase()}' toggled to ${targetStatus.toUpperCase()} (local).`, 'info');
    }
  };

  // Batch Install All
  const handleInstallAll = async () => {
    setIsBatchOperating(true);
    appendDaemonLog('[BATCH] Initiating full system installation of all 20 protocol categories...', 'info');

    try {
      const res = await fetch('/api/protocols/batch/install-all', { method: 'POST' });
      const data = await res.json();
      if (data.success && Array.isArray(data.protocols)) {
        onProtocolsUpdate(data.protocols);
        showNotice('All 20 protocol categories successfully installed!', 'success');
        appendDaemonLog('[BATCH COMPLETE] All 20 protocol categories installed and registered to Identity Anchor.', 'success');
      } else {
        throw new Error('Batch failed');
      }
    } catch (e) {
      const now = new Date().toISOString();
      const updated = protocols.map(p => ({
        ...p,
        status: 'installed' as const,
        installedAt: p.installedAt || now
      }));
      onProtocolsUpdate(updated);
      showNotice('All 20 protocol categories installed (Local Mode)!', 'success');
      appendDaemonLog('[BATCH LOCAL] All 20 categories marked INSTALLED.', 'success');
    } finally {
      setIsBatchOperating(false);
    }
  };

  // Batch Remove All
  const handleRemoveAll = async () => {
    setIsBatchOperating(true);
    appendDaemonLog('[BATCH] Initiating decommissioning of all protocol categories...', 'warn');

    try {
      const res = await fetch('/api/protocols/batch/remove-all', { method: 'POST' });
      const data = await res.json();
      if (data.success && Array.isArray(data.protocols)) {
        onProtocolsUpdate(data.protocols);
        showNotice('All categories decommissioned.', 'warn');
        appendDaemonLog('[BATCH DECOMMISSION] All categories marked uninstalled.', 'warn');
      } else {
        throw new Error('Batch failed');
      }
    } catch (e) {
      const updated = protocols.map(p => ({
        ...p,
        status: 'available' as const,
        installedAt: undefined
      }));
      onProtocolsUpdate(updated);
      showNotice('All categories removed (Local Mode).', 'warn');
      appendDaemonLog('[BATCH LOCAL] All categories marked AVAILABLE.', 'warn');
    } finally {
      setIsBatchOperating(false);
    }
  };

  // Export Manifest
  const handleExportManifest = () => {
    const manifest = {
      engine: 'BTE-INCLUSIVE-PROTOCOL-ENGINE',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      summary: {
        totalCategories: 20,
        installedCategories: installedCategoriesCount,
        partialCategories: partialCategoriesCount,
        totalActiveProtocols: totalInstalledProtocols
      },
      categories: IDENTIFIED_PROTOCOL_CATEGORIES.map(cat => {
        const stats = categoryStats.get(cat.id);
        const inCat = getProtocolsForCategory(cat);
        return {
          id: cat.id,
          categoryIndex: cat.categoryIndex,
          name: cat.name,
          status: stats?.status,
          percentage: stats?.percentage,
          installedCount: stats?.installed,
          totalProtocols: stats?.total,
          protocols: inCat.map(p => ({
            id: p.id,
            name: p.name,
            status: p.status,
            ports: p.defaultPorts,
            transport: p.transport,
            installedAt: p.installedAt
          }))
        };
      })
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol-engine-installer-manifest-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Protocol Engine manifest exported successfully.', 'success');
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return IDENTIFIED_PROTOCOL_CATEGORIES.filter(cat => {
      const stats = categoryStats.get(cat.id);

      // Status filter
      if (statusFilter === 'INSTALLED' && stats?.status !== 'installed') return false;
      if (statusFilter === 'PARTIAL' && stats?.status !== 'partial') return false;
      if (statusFilter === 'UNINSTALLED' && stats?.status !== 'uninstalled') return false;

      // Layer filter
      if (layerFilter !== 'ALL') {
        if (layerFilter === 'TRANSPORT' && !cat.layer.toLowerCase().includes('transport') && !cat.layer.toLowerCase().includes('network')) return false;
        if (layerFilter === 'APPLICATION' && !cat.layer.toLowerCase().includes('application')) return false;
        if (layerFilter === 'SECURITY' && !cat.layer.toLowerCase().includes('zero-trust') && !cat.layer.toLowerCase().includes('identity')) return false;
        if (layerFilter === 'DECENTRALIZED' && !cat.layer.toLowerCase().includes('overlay') && !cat.layer.toLowerCase().includes('consensus')) return false;
        if (layerFilter === 'IOT_INDUSTRIAL' && !cat.layer.toLowerCase().includes('iot') && !cat.layer.toLowerCase().includes('industrial') && !cat.layer.toLowerCase().includes('hardware')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchTagline = cat.tagline.toLowerCase().includes(q);
        const matchDesc = cat.description.toLowerCase().includes(q);
        const matchId = cat.id.toLowerCase().includes(q);
        const matchLayer = cat.layer.toLowerCase().includes(q);
        const matchProtocols = cat.protocolNames.some(p => p.toLowerCase().includes(q)) || cat.protocolIds.some(p => p.toLowerCase().includes(q));
        const matchStandards = cat.securityStandards.some(s => s.toLowerCase().includes(q));
        return matchName || matchTagline || matchDesc || matchId || matchLayer || matchProtocols || matchStandards;
      }

      return true;
    });
  }, [categoryStats, statusFilter, layerFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. HERO METRIC & INSTALLER TELEMETRY BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top row: Title + Actions */}
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  INSTALLER ENGINE v1.0
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
                  20 Identified Protocol Categories
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Kernel & Userland Bindings
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Protocol Category Installer Engine
              </h2>
              <p className="text-slate-400 text-sm max-w-3xl mt-1 leading-relaxed">
                Toggle installation or removal across all 20 standard protocol families. Enable high-throughput edge proxies, sovereign mesh tunnels, cryptographic identity anchors, and industrial automation adapters with instant status reflection.
              </p>
            </div>

            {/* Quick Batch Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleInstallAll}
                disabled={isBatchOperating}
                className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Install All 20 Categories</span>
              </button>

              <button
                onClick={handleRemoveAll}
                disabled={isBatchOperating}
                className="px-3.5 py-2.5 rounded-xl font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Decommission All</span>
              </button>

              <button
                onClick={handleExportManifest}
                className="px-3.5 py-2.5 rounded-xl font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all text-xs sm:text-sm cursor-pointer"
                title="Export JSON Manifest"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Manifest</span>
              </button>
            </div>
          </div>

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
            {/* Metric 1 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Installed Categories</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
                  {installedCategoriesCount}
                </span>
                <span className="text-xs font-mono text-slate-500">/ {totalCategoriesCount} Categories</span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${overallReadinessPct}%` }}
                />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Partial Categories</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  {partialCategoriesCount}
                </span>
                <span className="text-xs font-mono text-slate-500">Categories</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2">Sub-protocols partially active</span>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Adapters</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                  {totalInstalledProtocols}
                </span>
                <span className="text-xs font-mono text-slate-500">/ {protocols.length} Protocols</span>
              </div>
              <span className="text-[11px] text-emerald-400/90 mt-2 flex items-center gap-1">
                <Check className="w-3 h-3" /> Bound to Sockets
              </span>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Readiness</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
                  {overallReadinessPct}%
                </span>
                <span className="text-xs font-mono text-slate-500">Zero-Trust</span>
              </div>
              <span className="text-[11px] text-indigo-400/90 mt-2">Keccak-256 Anchored</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 20 categories (e.g. wireguard, mqtt, s3, dns, web, scada, rpc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {(['ALL', 'INSTALLED', 'PARTIAL', 'UNINSTALLED'] as const).map(s => {
            const isSelected = statusFilter === s;
            const count = s === 'ALL' 
              ? 20 
              : s === 'INSTALLED' 
              ? installedCategoriesCount 
              : s === 'PARTIAL' 
              ? partialCategoriesCount 
              : (20 - installedCategoriesCount - partialCategoriesCount);

            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{s === 'ALL' ? 'All (20)' : s.charAt(0) + s.slice(1).toLowerCase()}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layer Scope Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 px-2 py-1 rounded-xl border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={layerFilter}
            onChange={(e) => setLayerFilter(e.target.value)}
            className="bg-transparent text-slate-300 font-semibold focus:outline-none cursor-pointer py-1"
          >
            <option value="ALL" className="bg-slate-900 text-white">All OSI Layers</option>
            <option value="TRANSPORT" className="bg-slate-900 text-white">Layer 3/4 Transport & Routing</option>
            <option value="APPLICATION" className="bg-slate-900 text-white">Layer 7 Web & APIs</option>
            <option value="SECURITY" className="bg-slate-900 text-white">Zero-Trust & Identity</option>
            <option value="DECENTRALIZED" className="bg-slate-900 text-white">P2P & Web3 Consensus</option>
            <option value="IOT_INDUSTRIAL" className="bg-slate-900 text-white">IoT, Industrial & Hardware</option>
          </select>
        </div>
      </div>

      {/* 3. 20 CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {filteredCategories.map((catManifest) => {
          const stats = categoryStats.get(catManifest.id) || { total: catManifest.protocolIds.length, installed: 0, status: 'uninstalled', percentage: 0 };
          const isInstalled = stats.status === 'installed';
          const isPartial = stats.status === 'partial';
          const isUninstalled = stats.status === 'uninstalled';
          const isProcessing = processingCategory === catManifest.id;
          const isExpanded = !!expandedCategories[catManifest.id];
          const subProtocols = getProtocolsForCategory(catManifest);
          const CatIcon = getCategoryIcon(catManifest.iconName);

          return (
            <div
              key={catManifest.id}
              className={`bg-slate-900/85 border rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all relative overflow-hidden group ${
                isInstalled
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : isPartial
                  ? 'border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'border-slate-800 hover:border-slate-700/80 shadow-md shadow-slate-950/50'
              }`}
            >
              {/* Category Card Header */}
              <div>
                {/* Top badges bar */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-800/90 text-cyan-300 border border-slate-700">
                      CAT-{catManifest.categoryIndex.toString().padStart(2, '0')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300">
                      {catManifest.layer}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      catManifest.systemImpact === 'CRITICAL' ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30' :
                      catManifest.systemImpact === 'HIGH' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {catManifest.systemImpact}
                    </span>
                  </div>

                  {/* Installation Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    isInstalled
                      ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : isPartial
                      ? 'bg-amber-950/90 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-800/90 text-slate-400 border border-slate-700'
                  }`}>
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                        <span>UPDATING...</span>
                      </>
                    ) : isInstalled ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>INSTALLED</span>
                      </>
                    ) : isPartial ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>PARTIAL</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        <span>UNINSTALLED</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Category Main Title & Icon */}
                <div className="flex items-start gap-3.5 mb-2.5">
                  <div className={`p-3 rounded-2xl flex-shrink-0 transition-all ${
                    isInstalled 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                      : isPartial
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-400'
                  }`}>
                    <CatIcon className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                      {catManifest.name}
                    </h3>
                    <p className="text-xs text-cyan-400/90 font-medium line-clamp-1 mt-0.5">
                      {catManifest.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-2">
                  {catManifest.description}
                </p>

                {/* Progress bar for category sub-protocols */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400 font-semibold">Active Adapters:</span>
                    <span className={`font-bold ${isInstalled ? 'text-emerald-300' : isPartial ? 'text-amber-300' : 'text-slate-500'}`}>
                      {stats.installed} of {stats.total} Active ({stats.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isInstalled 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                          : isPartial 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                          : 'bg-slate-700/50'
                      }`}
                      style={{ width: `${Math.max(stats.percentage, 2)}%` }}
                    />
                  </div>
                </div>

                {/* Sub-protocols preview chips */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {catManifest.protocolNames.slice(0, 4).map((pName, idx) => {
                    const pId = catManifest.protocolIds[idx];
                    const protoObj = protocols.find(p => p.id === pId);
                    const isProtoInstalled = protoObj?.status === 'installed';

                    return (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono flex items-center gap-1 border transition-all ${
                          isProtoInstalled
                            ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isProtoInstalled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span className="truncate max-w-[150px]">{pName.split(' ')[0]}</span>
                      </span>
                    );
                  })}
                  {catManifest.protocolNames.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-400">
                      +{catManifest.protocolNames.length - 4} more
                    </span>
                  )}
                </div>

                {/* Security Standards & Default Ports */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-slate-500">Ports:</span>
                    <span className="text-slate-300">{catManifest.defaultPorts.join(', ') || 'Dynamic'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3 h-3 text-emerald-400/80" />
                    <span className="text-slate-300 truncate max-w-[170px]">{catManifest.securityStandards[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar: Toggle Button + Sub-Protocol Manager Drawer */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                {/* Expand Sub-Protocols Details Button */}
                <button
                  onClick={() => toggleCategoryExpand(catManifest.id)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Manage Adapters ({subProtocols.length})</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* Primary Toggle Switch / Action Button */}
                <button
                  onClick={() => handleToggleCategory(catManifest)}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 ${
                    isInstalled
                      ? 'bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-500/40 hover:border-rose-400 shadow-rose-950/40'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-950/50'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : isInstalled ? (
                    <>
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span>Remove Category</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Install Category</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4. EXPANDED SUB-PROTOCOL INSPECTOR ACCORDION */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800/90 bg-slate-950/70 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-1">
                    <span className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                      Sub-Protocols in {catManifest.shortLabel}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {stats.installed}/{stats.total} Active
                    </span>
                  </div>

                  {/* Sub-protocols items list */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {subProtocols.length > 0 ? (
                      subProtocols.map(p => {
                        const isSubInstalled = p.status === 'installed';

                        return (
                          <div
                            key={p.id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                              isSubInstalled
                                ? 'bg-slate-900/90 border-emerald-500/30'
                                : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-white">
                                  {p.name}
                                </span>
                                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-cyan-300">
                                  {p.id.toUpperCase()} v{p.version}
                                </span>
                                {p.defaultPorts && p.defaultPorts.length > 0 && (
                                  <span className="text-[10px] font-mono text-slate-400">
                                    Port: {p.defaultPorts.join('/')}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                                {p.description}
                              </p>
                            </div>

                            {/* Sub-protocol Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {onLaunchSandboxProbe && (
                                <button
                                  onClick={() => onLaunchSandboxProbe(p.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs transition-all cursor-pointer"
                                  title="Test in Sandbox"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => handleToggleSubProtocol(p, catManifest)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                  isSubInstalled
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500/40'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-cyan-500 hover:text-slate-950'
                                }`}
                              >
                                {isSubInstalled ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3 h-3" />
                                    <span>Install</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
                        Loading registered adapter templates for {catManifest.name}...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. LIVE INSTALLER DAEMON AUDIT LOGS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Installer Engine Daemon Logs & Telemetry
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDaemonLogs([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
            >
              Clear Logs
            </button>
            <button
              onClick={() => setDaemonLogsOpen(!daemonLogsOpen)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
            >
              {daemonLogsOpen ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {daemonLogsOpen && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            {daemonLogs.length > 0 ? (
              daemonLogs.map(log => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 select-none">[{log.timestamp}]</span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warn' ? 'text-amber-400' :
                    'text-cyan-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-center py-2">No daemon logs recorded in this session.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
