import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  KeyRound, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Server, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  Cpu, 
  Coins, 
  Layers, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  XCircle,
  Copy,
  Zap,
  Globe,
  Sliders,
  SlidersHorizontal
} from 'lucide-react';
import { PrivateServer } from '../types';

interface CryptographicAddressEvaluatorStudioProps {
  servers: PrivateServer[];
}

export const CryptographicAddressEvaluatorStudio: React.FC<CryptographicAddressEvaluatorStudioProps> = ({
  servers
}) => {
  const [evalAddress, setEvalAddress] = useState<string>('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [targetServerIp, setTargetServerIp] = useState<string>('10.142.3.153');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  
  // Admin Action States
  const [isExecutingAdmin, setIsExecutingAdmin] = useState<boolean>(false);
  const [adminActionMessage, setAdminActionMessage] = useState<string | null>(null);
  const [newNonceInput, setNewNonceInput] = useState<number>(0);
  const [newDepoInput, setNewDepoInput] = useState<number>(10000);
  const [showNonceModal, setShowNonceModal] = useState<boolean>(false);
  const [showDepoModal, setShowDepoModal] = useState<boolean>(false);

  // Admin Logs
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);

  useEffect(() => {
    runEvaluation();
    fetchAdminLogs();
  }, [targetServerIp]);

  const fetchAdminLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const res = await fetch('/api/crypto/wallet-admin-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setAdminLogs(data.logs);
        }
      }
    } catch (err) {
      console.error('Error fetching wallet admin logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const runEvaluation = async (addrToUse?: string) => {
    const addressToQuery = addrToUse || evalAddress;
    if (!addressToQuery.trim()) return;

    try {
      setIsEvaluating(true);
      const res = await fetch('/api/crypto/evaluate-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: addressToQuery,
          targetServerIp
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data.evaluationReport);
      }
    } catch (err) {
      console.error('Failed to evaluate cryptographic address:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleExecuteAdminAction = async (actionType: string, params: object = {}) => {
    if (!evalAddress || !targetServerIp) return;

    try {
      setIsExecutingAdmin(true);
      setAdminActionMessage(null);
      const res = await fetch('/api/crypto/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: evalAddress,
          actionType,
          targetServerIp,
          params
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAdminActionMessage(data.message || 'Admin action executed successfully!');
        if (data.log) {
          setAdminLogs(prev => [data.log, ...prev]);
        }
        // Refresh evaluation report
        await runEvaluation();
      }
    } catch (err) {
      console.error('Error executing wallet admin action:', err);
    } finally {
      setIsExecutingAdmin(false);
      setShowNonceModal(false);
      setShowDepoModal(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3.5 bg-gradient-to-tr from-amber-600 via-rose-600 to-red-600 rounded-2xl text-white shadow-lg">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Cryptographic Address Evaluator & Multi-Node Wallet Admin Studio
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  UNIVERSAL MULTI-BLOCKCHAIN (ALL BLOCKCHAINS: EVM, SOL, BTC, COSMOS, MOVE, TON, XRPL, TRON)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Perform real-time cryptographic address evaluation across any private server node for ANY blockchain network family (EVM, Solana, Bitcoin, Cosmos, Aptos/Sui Move, TON, XRP Ledger, TRON, NEAR). Analyze ECDSA, EdDSA, and Schnorr signature formats, inspect subledger DEPO valuations ($10,000 USD / DEPO), and dispatch administrative ACL overrides, freeze actions, or nonce resets.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Cluster Enclave Nodes</span>
            <strong className="text-amber-400 font-bold text-sm">{servers.length || 5} Server Nodes Active</strong>
            <span className="text-[9px] text-emerald-400 font-bold block">Universal Multi-Chain Parity Sync</span>
          </div>
        </div>
      </div>

      {/* Address Evaluation Input Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
              <span>Target Cryptographic Wallet Address</span>
              <span className="text-slate-500 text-[10px]">Universal Format Recognition (EVM / SOL / BTC / COSMOS / MOVE / TON / XRPL / TRON)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={evalAddress}
                onChange={(e) => setEvalAddress(e.target.value)}
                placeholder="e.g. 0x70997970C51812dc3A010C7d01b50e0d17dc79C8, ATA_sSOL_..., bc1q..., cosmos1..., EQB3..., rHb9..., T9yD..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 font-mono text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
              />
              <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase font-mono">
              Evaluate On Server Node
            </label>
            <select
              value={targetServerIp}
              onChange={(e) => setTargetServerIp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 font-mono text-xs font-bold text-amber-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="10.142.3.153">DEPO-Vault-Subledger-Node-1 (10.142.3.153)</option>
              <option value="10.142.0.12">Alpha-Edge-Gateway (10.142.0.12)</option>
              <option value="10.142.0.45">Neural-Vector-Store (10.142.0.45)</option>
              <option value="10.142.1.88">Automation-Worker (10.142.1.88)</option>
              <option value="10.142.2.19">DEPO-Indexer-Relay-01 (10.142.2.19)</option>
              {servers.map(s => (
                <option key={s.id} value={s.ipAddress}>
                  {s.name} ({s.ipAddress})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Wallet Address Quick Selectors for All Blockchains */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">All-Blockchain Presets:</span>
          
          <button
            onClick={() => {
              setEvalAddress('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
              runEvaluation('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-mono font-bold transition-all border border-blue-900/50"
          >
            0x7099... (EVM Admin)
          </button>

          <button
            onClick={() => {
              setEvalAddress('0x3B9c02d18471eA284094C991f851A07b538f9021');
              runEvaluation('0x3B9c02d18471eA284094C991f851A07b538f9021');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-bold transition-all border border-slate-700"
          >
            0x3B9c... (EVM Subnet)
          </button>

          <button
            onClick={() => {
              setEvalAddress('ATA_sSOL_Alpha_Gateway_99120');
              runEvaluation('ATA_sSOL_Alpha_Gateway_99120');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-[11px] font-mono font-bold transition-all border border-purple-900/50"
          >
            ATA_sSOL... (Solana SPL)
          </button>

          <button
            onClick={() => {
              setEvalAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
              runEvaluation('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-mono font-bold transition-all border border-amber-900/50"
          >
            bc1qxy2k... (Bitcoin SegWit)
          </button>

          <button
            onClick={() => {
              setEvalAddress('cosmos1qvX9z53jfp48p...1840');
              runEvaluation('cosmos1qvX9z53jfp48p...1840');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-mono font-bold transition-all border border-emerald-900/50"
          >
            cosmos1... (Cosmos Hub)
          </button>

          <button
            onClick={() => {
              setEvalAddress('0x2b8109d948270f20914c0a5201c13d758f2731c28c89a0b127419e078901b2a9');
              runEvaluation('0x2b8109d948270f20914c0a5201c13d758f2731c28c89a0b127419e078901b2a9');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono font-bold transition-all border border-cyan-900/50"
          >
            0x2b81... (Aptos / Sui Move)
          </button>

          <button
            onClick={() => {
              setEvalAddress('EQB3n4271pCXY2901_TON_MasterVault');
              runEvaluation('EQB3n4271pCXY2901_TON_MasterVault');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-mono font-bold transition-all border border-sky-900/50"
          >
            EQB3... (TON TVM)
          </button>

          <button
            onClick={() => {
              setEvalAddress('rHb9CJAWyB4rj91VRPn96DkukG4bwdtyTh');
              runEvaluation('rHb9CJAWyB4rj91VRPn96DkukG4bwdtyTh');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] font-mono font-bold transition-all border border-rose-900/50"
          >
            rHb9... (XRP Ledger)
          </button>

          <button
            onClick={() => {
              setEvalAddress('T9yD14Nj9j7xAB31902KLD4091a1820');
              runEvaluation('T9yD14Nj9j7xAB31902KLD4091a1820');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-300 text-[11px] font-mono font-bold transition-all border border-red-900/50"
          >
            T9yD... (TRON TVM)
          </button>

          <button
            onClick={() => runEvaluation()}
            disabled={isEvaluating}
            className="ml-auto flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-lg text-xs font-bold hover:brightness-110 shadow-md transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>{isEvaluating ? 'Evaluating...' : 'Run Universal Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* Admin Action Notice */}
      {adminActionMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>{adminActionMessage}</span>
          </div>
          <button
            onClick={() => setAdminActionMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Main Grid: Left Column = Address Evaluation Report, Right Column = Admin Control Functions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Cryptographic Evaluation Report (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider font-mono">
                  Cryptographic Evaluation Report
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                Target Node: {targetServerIp}
              </span>
            </div>

            {evaluationResult ? (
              <div className="space-y-4">
                {/* Format & Cryptographic Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Format Standard</span>
                    <strong className="text-xs font-bold text-amber-300 font-mono block truncate">
                      {evaluationResult.format}
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Curve Algorithm</span>
                    <strong className="text-xs font-bold text-purple-300 font-mono block truncate">
                      {evaluationResult.curveType}
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Network Family</span>
                    <strong className="text-xs font-bold text-emerald-300 font-mono block truncate">
                      {evaluationResult.networkFamily}
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Account Type</span>
                    <strong className="text-xs font-bold text-blue-300 font-mono block truncate">
                      {evaluationResult.isContractAccount ? 'Smart Contract / Program' : 'EOA / Keypair Wallet'}
                    </strong>
                  </div>
                </div>

                {/* Aggregate Subledger Summary */}
                <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-amber-900/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-300 font-mono uppercase">
                      Cluster-Wide Aggregate Subledger DEPO Balance
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      Rate: 1 DEPO = $10,000 USD
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-xl font-black text-white font-mono">
                      {(evaluationResult.totalDepoAggregateBalance ?? evaluationResult.totalTorxAggregateBalance)?.toLocaleString()} DEPO
                    </strong>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      ${evaluationResult.totalUsdAggregateValuation?.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {/* Node-by-Node Subledger State Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono flex items-center justify-between">
                    <span>Subnet Node-by-Node Balance & ACL Breakdown</span>
                    <span className="text-[10px] text-slate-500">Target server highlighted</span>
                  </h4>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Node Name / IP</th>
                          <th className="p-2.5">DEPO Subledger</th>
                          <th className="p-2.5">ACL Role</th>
                          <th className="p-2.5">Nonce</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-slate-900">
                        {evaluationResult.nodeStates?.map((ns: any) => (
                          <tr 
                            key={ns.serverId} 
                            className={`hover:bg-slate-800/50 transition-colors ${ns.isTargetServer ? 'bg-amber-950/30 font-bold border-l-2 border-l-amber-500' : ''}`}
                          >
                            <td className="p-2.5">
                              <div className="flex items-center space-x-1.5">
                                <Server className={`h-3.5 w-3.5 ${ns.isTargetServer ? 'text-amber-400' : 'text-slate-500'}`} />
                                <span className="text-white text-xs font-bold">{ns.serverName}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block">{ns.serverIp}</span>
                            </td>
                            <td className="p-2.5">
                              <strong className="text-amber-300 font-bold block">{(ns.subledgerDepoBalance ?? ns.subledgerTorxBalance)?.toLocaleString()} DEPO</strong>
                              <span className="text-[9px] text-emerald-400 font-bold">${ns.usdValuation?.toLocaleString()} USD</span>
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ns.aclPermissionRole.includes('ADMIN') 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}>
                                {ns.aclPermissionRole}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-300 font-bold">
                              #{ns.nonce}
                            </td>
                            <td className="p-2.5">
                              {ns.isSubledgerFrozen ? (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-red-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                                  <Lock className="h-3 w-3 text-rose-400" />
                                  <span>FROZEN</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                  <span>ACTIVE</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Run address evaluation to view cryptographic report...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Wallet Administrative Functions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider font-mono">
                  Wallet Admin Controls
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold">
                Node: {targetServerIp}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Dispatch server-side administrative commands for <strong className="text-amber-300 font-mono">{evalAddress.slice(0, 10)}...</strong> directly on server node <strong className="text-white font-mono">{targetServerIp}</strong>:
            </p>

            <div className="space-y-3">
              
              {/* 1. Grant / Revoke Admin Privileges */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                    <UserCheck className="h-4 w-4 text-amber-400" />
                    <span>ACL Permission Level</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Node ACL Policy</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleExecuteAdminAction('GRANT_ADMIN_PRIVILEGES')}
                    disabled={isExecutingAdmin}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-xs font-bold hover:brightness-110 shadow transition-all"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Grant Admin</span>
                  </button>

                  <button
                    onClick={() => handleExecuteAdminAction('REVOKE_PRIVILEGES')}
                    disabled={isExecutingAdmin}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 transition-all"
                  >
                    <UserX className="h-3.5 w-3.5 text-slate-400" />
                    <span>Restrict Access</span>
                  </button>
                </div>
              </div>

              {/* 2. Lock / Freeze or Unfreeze Subledger */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                    <Lock className="h-4 w-4 text-rose-400" />
                    <span>Subledger Transfer Freeze State</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Enclave Hold</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleExecuteAdminAction('FREEZE_WALLETS_SUBLEDGER')}
                    disabled={isExecutingAdmin}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow transition-all"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Freeze Wallet</span>
                  </button>

                  <button
                    onClick={() => handleExecuteAdminAction('UNFREEZE_WALLETS_SUBLEDGER')}
                    disabled={isExecutingAdmin}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow transition-all"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Unfreeze Wallet</span>
                  </button>
                </div>
              </div>

              {/* 3. Nonce Counter Reset */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                    <RefreshCw className="h-4 w-4 text-purple-400" />
                    <span>Nonce Counter Reset</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Replay Sync</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newNonceInput}
                    onChange={(e) => setNewNonceInput(Number(e.target.value))}
                    placeholder="New Nonce (e.g. 0)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleExecuteAdminAction('RESET_NONCE_COUNTER', { newNonce: newNonceInput })}
                    disabled={isExecutingAdmin}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow transition-all"
                  >
                    Set Nonce
                  </button>
                </div>
              </div>

              {/* 4. Emergency DEPO Subledger Adjustment */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                    <Coins className="h-4 w-4 text-emerald-400" />
                    <span>Emergency DEPO Subledger Balance</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">$10,000 / DEPO</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newDepoInput}
                    onChange={(e) => setNewDepoInput(Number(e.target.value))}
                    placeholder="DEPO Balance"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleExecuteAdminAction('EMERGENCY_SUBLEDGER_ADJUSTMENT', { newTorxBalance: newDepoInput, newDepoBalance: newDepoInput })}
                    disabled={isExecutingAdmin}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow transition-all"
                  >
                    Set DEPO
                  </button>
                </div>
              </div>

              {/* 5. Zero-Fee gRPC Whitelist Sync */}
              <button
                onClick={() => handleExecuteAdminAction('ENCLAVE_WHITELIST_SYNC')}
                disabled={isExecutingAdmin}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-amber-400 group-hover:animate-pulse" />
                  <div>
                    <span className="text-xs font-bold text-white font-mono block">Sync Zero-Fee Enclave TPU Whitelist</span>
                    <span className="text-[10px] text-slate-400 font-mono block">Bypasses RPC rate limits on node {targetServerIp}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-mono font-bold">
                  Execute Sync
                </span>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Admin Action Audit Trail Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-black uppercase text-white tracking-wider font-mono">
              Wallet Administrative Audit Trail Logs
            </h3>
          </div>
          <button
            onClick={fetchAdminLogs}
            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono font-bold transition-all"
          >
            <RefreshCw className={`h-3 w-3 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Logs</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Log ID / Time</th>
                <th className="p-3">Wallet Address</th>
                <th className="p-3">Target Server IP</th>
                <th className="p-3">Admin Action Type</th>
                <th className="p-3">Execution Details</th>
                <th className="p-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900 text-slate-200">
              {adminLogs.map((log) => (
                <tr key={log.logId} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 text-slate-400 text-[11px]">
                    <span className="text-amber-400 font-bold block">{log.logId}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </td>
                  <td className="p-3 font-bold text-slate-300 truncate max-w-[150px]" title={log.address}>
                    {log.address}
                  </td>
                  <td className="p-3 font-bold text-amber-300">
                    {log.serverIp}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="p-3 text-emerald-300 font-bold text-xs">
                    {log.details}
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">
                    {log.operator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
