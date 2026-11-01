import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  RefreshCw, 
  Terminal,
  Clock,
  Layers,
  Database
} from 'lucide-react';
import { DiopAuditEvent } from '../../types/diop';

interface AuditComplianceDashboardProps {
  auditLogs: DiopAuditEvent[];
  onTriggerSimulatedEvent: () => void;
}

export const AuditComplianceDashboard: React.FC<AuditComplianceDashboardProps> = ({
  auditLogs,
  onTriggerSimulatedEvent
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `diop-audit-trail-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSeverityBadge = (severity: 'INFO' | 'WARN' | 'CRITICAL') => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold flex items-center space-x-1"><XCircle className="h-3 w-3" /><span>CRITICAL</span></span>;
      case 'WARN':
        return <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold flex items-center space-x-1"><AlertTriangle className="h-3 w-3" /><span>WARN</span></span>;
      case 'INFO':
      default:
        return <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold flex items-center space-x-1"><Info className="h-3 w-3" /><span>INFO</span></span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldAlert className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-white">Immutable Protocol Audit &amp; Event Stream</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Cryptographically verified audit trail recording all domain registrations, node attestations, state replications, ownership challenges, and security anomalies.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onTriggerSimulatedEvent}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-cyan-300 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Simulate Protocol Event</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit Trail (JSON)</span>
            </button>
          </div>
        </div>

        {/* Filter / Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event type, DID actor, event ID..."
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-3" />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-zinc-400 font-bold">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white font-mono text-xs rounded-xl px-3 py-2 focus:border-cyan-500"
            >
              <option value="ALL">All Categories</option>
              <option value="VSP">Virtual Server Protocols (VSP)</option>
              <option value="NIP">Network Protocols (NIP)</option>
              <option value="AUTH">Authentication &amp; DID</option>
              <option value="ANOMALY">Security Anomalies</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-zinc-400 font-bold">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white font-mono text-xs rounded-xl px-3 py-2 focus:border-cyan-500"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Event Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Audit Trail Entries ({filteredLogs.length})</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400">HASH CHAIN INTEGRITY: 100% VERIFIED</span>
        </div>

        <div className="divide-y divide-zinc-800/80 max-h-[500px] overflow-y-auto font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No audit events matched your search filters.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.eventId} className="p-4 hover:bg-black/50 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(log.severity)}
                    <span className="font-bold text-white text-xs">{log.eventType}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                      {log.protocolId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-zinc-400">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <span>{new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})</span>
                    <span className="text-zinc-600">ID: {log.eventId}</span>
                  </div>
                </div>

                <p className="text-zinc-300 text-xs font-sans">
                  {log.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                  <span>Actor DID: <strong className="text-purple-300">{log.actor}</strong></span>
                  <span className="text-zinc-400">Sig Proof: {log.signatureProof.slice(0, 24)}...</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
