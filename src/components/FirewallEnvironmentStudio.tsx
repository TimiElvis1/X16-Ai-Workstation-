import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Globe,
  Radio,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Zap,
  Activity,
  Cpu,
  Terminal,
  Filter
} from 'lucide-react';

export const FirewallEnvironmentStudio: React.FC = () => {
  const [firewallState, setFirewallState] = useState<any>({
    enabled: true,
    mode: 'Strict Block',
    activeRulesCount: 5,
    blockedRequestsToday: 1420,
    allowedRequestsToday: 89420,
    mitigationEngine: 'SubNet Zero-Trust WAF 1.0',
    ddosShieldActive: true,
    rateLimitPerMin: 1200
  });

  const [rulesList, setRulesList] = useState<any[]>([]);
  const [ipRulesList, setIpRulesList] = useState<any[]>([]);
  const [logsList, setLogsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [showAddRuleModal, setShowAddRuleModal] = useState<boolean>(false);
  const [newRuleForm, setNewRuleForm] = useState({
    name: '',
    target: 'QUERY_PARAMS & BODY',
    severity: 'HIGH',
    action: 'BLOCK'
  });

  const [showAddIpModal, setShowAddIpModal] = useState<boolean>(false);
  const [newIpForm, setNewIpForm] = useState({
    cidr: '',
    type: 'BLACKLIST',
    description: ''
  });

  const [logFilter, setLogFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchFirewallStatus();
  }, []);

  const fetchFirewallStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/firewall/status');
      const data = await res.json();
      if (data.success) {
        setFirewallState(data.state || firewallState);
        setRulesList(data.rules || []);
        setIpRulesList(data.ipRules || []);
        setLogsList(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching firewall status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFirewall = async (enabled: boolean, mode?: string) => {
    try {
      const res = await fetch('/api/firewall/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, mode: mode || firewallState.mode })
      });
      const data = await res.json();
      if (data.success) {
        setFirewallState(data.state);
      }
    } catch (err) {
      console.error('Toggle firewall error:', err);
    }
  };

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleForm.name.trim()) return;
    try {
      const res = await fetch('/api/firewall/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRuleForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddRuleModal(false);
        setNewRuleForm({ name: '', target: 'QUERY_PARAMS & BODY', severity: 'HIGH', action: 'BLOCK' });
        fetchFirewallStatus();
      }
    } catch (err) {
      console.error('Add rule error:', err);
    }
  };

  const handleAddIpRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpForm.cidr.trim()) return;
    try {
      const res = await fetch('/api/firewall/ip-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIpForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddIpModal(false);
        setNewIpForm({ cidr: '', type: 'BLACKLIST', description: '' });
        fetchFirewallStatus();
      }
    } catch (err) {
      console.error('Add IP rule error:', err);
    }
  };

  const handlePurgeLogs = async () => {
    try {
      const res = await fetch('/api/firewall/purge-logs', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLogsList([]);
      }
    } catch (err) {
      console.error('Purge logs error:', err);
    }
  };

  const filteredLogs = logsList.filter(log => {
    if (logFilter === 'BLOCKED') return log.action === 'BLOCKED';
    if (logFilter === 'ALLOWED') return log.action === 'ALLOWED';
    return true;
  });

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-amber-500/20 border border-rose-500/30 text-rose-400 shadow-lg">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                SubNet Web Application Firewall (WAF) &amp; Security Shield
              </h2>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                firewallState.enabled
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {firewallState.enabled ? 'ACTIVE PROTECTION' : 'BYPASS MODE'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Zero-Trust Packet Inspection, DDoS Rate Limiting, Threat Mitigation &amp; IP Access Filtering
            </p>
          </div>
        </div>

        {/* Master Toggle Controls */}
        <div className="flex items-center space-x-3 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
          <button
            onClick={() => handleToggleFirewall(!firewallState.enabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              firewallState.enabled
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{firewallState.enabled ? 'WAF Enabled' : 'Enable WAF'}</span>
          </button>

          <select
            value={firewallState.mode}
            onChange={(e) => handleToggleFirewall(firewallState.enabled, e.target.value)}
            className="bg-black border border-zinc-800 text-xs font-bold text-cyan-300 rounded-lg p-1.5 focus:outline-none"
          >
            <option value="Strict Block">Strict Block Mode</option>
            <option value="Challenge CAPTCHA">Challenge CAPTCHA</option>
            <option value="Rate Limit Only">Rate Limit Only</option>
            <option value="Log Only">Log Only (Passive)</option>
          </select>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Threats Blocked Today</div>
          <div className="text-xl font-black text-rose-400">{firewallState.blockedRequestsToday?.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">Auto-Mitigated Packets</div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Allowed Clean Traffic</div>
          <div className="text-xl font-black text-emerald-400">{firewallState.allowedRequestsToday?.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">99.8% Passed Inspection</div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Active Security Rules</div>
          <div className="text-xl font-black text-cyan-300">{rulesList.length} Rules</div>
          <div className="text-[10px] text-zinc-500">Deep Packet Inspection</div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase font-bold">DDoS Shield Limit</div>
          <div className="text-xl font-black text-amber-300">{firewallState.rateLimitPerMin} Req/Min</div>
          <div className="text-[10px] text-emerald-400 font-bold">DDoS Shield Active</div>
        </div>
      </div>

      {/* Rules & IP Whitelist/Blacklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WAF Rules Panel */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Active WAF Inspection Rules</span>
            </h3>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Deploy Rule</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {rulesList.map((rule) => (
              <div key={rule.id} className="bg-black/80 border border-zinc-800 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    rule.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {rule.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Target: {rule.target}</span>
                  <span className="text-cyan-400 font-bold">{rule.triggersToday} Blocked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IP Access Control Rules */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Globe className="h-4 w-4 text-rose-400" />
              <span>IP Whitelist &amp; Blacklist Subnets</span>
            </h3>
            <button
              onClick={() => setShowAddIpModal(true)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add IP CIDR</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {ipRulesList.map((ip) => (
              <div key={ip.id} className="bg-black/80 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white font-mono">{ip.cidr}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      ip.type === 'WHITELIST' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {ip.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{ip.description}</div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{ip.addedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Threat Inspector Logs */}
      <div className="bg-black border border-zinc-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Live Firewall Threat &amp; Request Log Stream</h3>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[11px]">
              {['ALL', 'BLOCKED', 'ALLOWED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setLogFilter(f)}
                  className={`px-2 py-0.5 rounded font-bold ${
                    logFilter === f ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={handlePurgeLogs}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 text-xs font-bold"
            >
              Purge Logs
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase border-b border-zinc-800">
              <tr>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Client IP</th>
                <th className="p-2.5">Method &amp; Path</th>
                <th className="p-2.5">Status Code</th>
                <th className="p-2.5">Rule / Reason</th>
                <th className="p-2.5">WAF Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/40">
                  <td className="p-2.5 text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-2.5 font-bold text-cyan-300">{log.ip}</td>
                  <td className="p-2.5">
                    <span className="text-amber-300 font-bold mr-1">{log.method}</span>
                    <span className="text-zinc-300">{log.path}</span>
                  </td>
                  <td className="p-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 200 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-zinc-400 text-[11px]">{log.reason}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'BLOCKED' ? 'bg-rose-900 text-rose-200 border border-rose-700' : 'bg-emerald-900 text-emerald-200'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add WAF Rule */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                <span>Deploy New WAF Rule</span>
              </h3>
              <button onClick={() => setShowAddRuleModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Rule Identifier / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rate Limit /api/v1/auth"
                  value={newRuleForm.name}
                  onChange={e => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Severity Level</label>
                  <select
                    value={newRuleForm.severity}
                    onChange={e => setNewRuleForm({ ...newRuleForm, severity: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Target Action</label>
                  <select
                    value={newRuleForm.action}
                    onChange={e => setNewRuleForm({ ...newRuleForm, action: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="BLOCK">BLOCK (403)</option>
                    <option value="CHALLENGE">CHALLENGE CAPTCHA</option>
                    <option value="RATE_LIMIT">RATE LIMIT (429)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button type="button" onClick={() => setShowAddRuleModal(false)} className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg">Deploy Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add IP Rule */}
      {showAddIpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Globe className="h-4 w-4 text-rose-400" />
                <span>Add IP Address / Subnet Rule</span>
              </h3>
              <button onClick={() => setShowAddIpModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddIpRule} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">CIDR / IP Address</label>
                <input
                  type="text"
                  required
                  placeholder="192.168.1.0/24 or 45.12.34.56"
                  value={newIpForm.cidr}
                  onChange={e => setNewIpForm({ ...newIpForm, cidr: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Rule Type</label>
                <select
                  value={newIpForm.type}
                  onChange={e => setNewIpForm({ ...newIpForm, type: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  <option value="BLACKLIST">BLACKLIST (Deny All Access)</option>
                  <option value="WHITELIST">WHITELIST (Allow Bypass)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Description / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Internal gateway server"
                  value={newIpForm.description}
                  onChange={e => setNewIpForm({ ...newIpForm, description: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button type="button" onClick={() => setShowAddIpModal(false)} className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg">Save IP Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
