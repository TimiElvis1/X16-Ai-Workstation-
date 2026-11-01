import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Vault, 
  Server, 
  Coins, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Plus, 
  RefreshCw, 
  Layers, 
  DollarSign, 
  Sliders, 
  BarChart3, 
  Lock, 
  Key, 
  Terminal, 
  Search, 
  Filter, 
  ArrowUpDown,
  Cpu,
  Globe,
  Database,
  ExternalLink,
  Sparkles,
  FileCheck2,
  Wrench,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { PrivateServer } from '../types';

interface DigitalServerAssetVaultStudioProps {
  servers: PrivateServer[];
  onGenerateServer?: (serverData: Partial<PrivateServer>) => void;
}

export type DeploymentPriority = 'P0_CRITICAL' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW';

export interface TokenValuation {
  symbol: string;
  name: string;
  balance: number;
  unitPriceUsd: number;
  totalValueUsd: number;
  chain: 'DEPO_L2' | 'ETHEREUM' | 'SOLANA' | 'BITCOIN';
}

export interface ServerAssetVault {
  serverId: string;
  serverName: string;
  serverIp: string;
  serverType: string;
  status: 'online' | 'provisioning' | 'degraded' | 'offline';
  deploymentPriority: DeploymentPriority;
  priorityRank: number; // 1, 2, 3...
  deploymentQueueState: 'DEPLOYED_ACTIVE' | 'QUEUED_FOR_DEPLOYMENT' | 'REGENERATING_STANDBY' | 'PENDING_VALIDATION';
  vaultAddress: string;
  enclaveStatus: 'ENCLAVE_LOCKED' | 'HSM_VERIFIED' | 'MPC_SIGNER_ACTIVE';
  tokens: TokenValuation[];
  totalVaultValueUsd: number;
  stakedDepoWeight: number; // percentage or amount
  lastAuditTimestamp: string;
}

export function DigitalServerAssetVaultStudio({ servers }: DigitalServerAssetVaultStudioProps) {
  // Live Price Feeds State (Editable by user for real-time portfolio re-valuation)
  const [tokenPrices, setTokenPrices] = useState<{ [symbol: string]: number }>({
    'DEPO': 10000.00,
    'ETH': 3480.00,
    'SOL': 184.20,
    'BTC': 89200.00,
    'USDC': 1.00,
    'SNT': 0.85,
    'RUNES': 14.50
  });

  // Default Digital Servers with pre-configured Asset Vaults & Priority Rankings
  const defaultVaults: ServerAssetVault[] = [
    {
      serverId: 'srv-gen-01',
      serverName: 'SubNet Main Genesis Core-01',
      serverIp: '10.142.0.12',
      serverType: 'vector_db',
      status: 'online',
      deploymentPriority: 'P0_CRITICAL',
      priorityRank: 1,
      deploymentQueueState: 'DEPLOYED_ACTIVE',
      vaultAddress: '0x71C765d7023812dc3A010C7d01b50e0d17dc79A2',
      enclaveStatus: 'HSM_VERIFIED',
      stakedDepoWeight: 450000,
      lastAuditTimestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
      tokens: [
        { symbol: 'DEPO', name: 'SubNet DEPO Native Token', balance: 250000, chain: 'DEPO_L2', unitPriceUsd: 10000, totalValueUsd: 2500000000 },
        { symbol: 'ETH', name: 'Ethereum Native', balance: 32.5, chain: 'ETHEREUM', unitPriceUsd: 3480, totalValueUsd: 113100 },
        { symbol: 'USDC', name: 'USD Coin Reserve', balance: 150000, chain: 'DEPO_L2', unitPriceUsd: 1, totalValueUsd: 150000 }
      ],
      totalVaultValueUsd: 2500263100
    },
    {
      serverId: 'srv-vec-02',
      serverName: 'Vector DB Indexer & Decrypt Engine',
      serverIp: '10.142.0.14',
      serverType: 'vector_db',
      status: 'online',
      deploymentPriority: 'P0_CRITICAL',
      priorityRank: 2,
      deploymentQueueState: 'DEPLOYED_ACTIVE',
      vaultAddress: '0x882a9F4b01e39B27C19aC614E3C8B715A0129c91',
      enclaveStatus: 'MPC_SIGNER_ACTIVE',
      stakedDepoWeight: 280000,
      lastAuditTimestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      tokens: [
        { symbol: 'DEPO', name: 'SubNet DEPO Native Token', balance: 180000, chain: 'DEPO_L2', unitPriceUsd: 10000, totalValueUsd: 1800000000 },
        { symbol: 'SOL', name: 'Solana High-Speed Fuel', balance: 450, chain: 'SOLANA', unitPriceUsd: 184.20, totalValueUsd: 82890 },
        { symbol: 'SNT', name: 'SubNet Utility Token', balance: 95000, chain: 'DEPO_L2', unitPriceUsd: 0.85, totalValueUsd: 80750 }
      ],
      totalVaultValueUsd: 1800163640
    },
    {
      serverId: 'srv-pay-03',
      serverName: 'ERC-4337 Auto-Paymaster Relayer',
      serverIp: '10.142.0.18',
      serverType: 'gateway_proxy',
      status: 'online',
      deploymentPriority: 'P1_HIGH',
      priorityRank: 3,
      deploymentQueueState: 'DEPLOYED_ACTIVE',
      vaultAddress: '0x3a42C7f18b31D0823901b239015c3B502A19d71A',
      enclaveStatus: 'HSM_VERIFIED',
      stakedDepoWeight: 190000,
      lastAuditTimestamp: new Date(Date.now() - 5400000).toLocaleTimeString(),
      tokens: [
        { symbol: 'DEPO', name: 'SubNet DEPO Native Token', balance: 120000, chain: 'DEPO_L2', unitPriceUsd: 10000, totalValueUsd: 1200000000 },
        { symbol: 'ETH', name: 'Sepolia Gas Reserve', balance: 18.2, chain: 'ETHEREUM', unitPriceUsd: 3480, totalValueUsd: 63336 },
        { symbol: 'USDC', name: 'Sponsored Fee Treasury', balance: 75000, chain: 'DEPO_L2', unitPriceUsd: 1, totalValueUsd: 75000 }
      ],
      totalVaultValueUsd: 1200138336
    },
    {
      serverId: 'srv-sol-04',
      serverName: 'Solana PoH TPU Ingester & Parity Node',
      serverIp: '10.142.0.22',
      serverType: 'indexer_relay',
      status: 'online',
      deploymentPriority: 'P1_HIGH',
      priorityRank: 4,
      deploymentQueueState: 'DEPLOYED_ACTIVE',
      vaultAddress: 'SoL9xP3mR2tY8zB4wN6qE1cD5fA8gH2jL4mN9P0qR1s',
      enclaveStatus: 'MPC_SIGNER_ACTIVE',
      stakedDepoWeight: 150000,
      lastAuditTimestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
      tokens: [
        { symbol: 'SOL', name: 'Solana Native Vault', balance: 1250, chain: 'SOLANA', unitPriceUsd: 184.20, totalValueUsd: 230250 },
        { symbol: 'DEPO', name: 'SubNet DEPO Native Token', balance: 85000, chain: 'DEPO_L2', unitPriceUsd: 10000, totalValueUsd: 850000000 }
      ],
      totalVaultValueUsd: 850230250
    },
    {
      serverId: 'srv-btc-05',
      serverName: 'Bitcoin Ordinals & Runes Indexer Node',
      serverIp: '10.142.0.28',
      serverType: 'indexer_relay',
      status: 'online',
      deploymentPriority: 'P2_MEDIUM',
      priorityRank: 5,
      deploymentQueueState: 'QUEUED_FOR_DEPLOYMENT',
      vaultAddress: 'bc1q9x3mr2ty8zb4wn6qe1cd5fa8gh2jl4mn9p0qr1',
      enclaveStatus: 'ENCLAVE_LOCKED',
      stakedDepoWeight: 110000,
      lastAuditTimestamp: new Date(Date.now() - 9000000).toLocaleTimeString(),
      tokens: [
        { symbol: 'BTC', name: 'Bitcoin Taproot Reserve', balance: 4.85, chain: 'BITCOIN', unitPriceUsd: 89200, totalValueUsd: 432620 },
        { symbol: 'RUNES', name: 'DEPO Runes Subnet Token', balance: 12000, chain: 'BITCOIN', unitPriceUsd: 14.50, totalValueUsd: 174000 }
      ],
      totalVaultValueUsd: 606620
    },
    {
      serverId: 'srv-edg-06',
      serverName: 'Edge Compute Staging & Proxy Worker',
      serverIp: '10.142.0.34',
      serverType: 'edge_compute',
      status: 'provisioning',
      deploymentPriority: 'P3_LOW',
      priorityRank: 6,
      deploymentQueueState: 'REGENERATING_STANDBY',
      vaultAddress: '0x992B21C00181A08311B92C44a1928C101e1F914',
      enclaveStatus: 'ENCLAVE_LOCKED',
      stakedDepoWeight: 45000,
      lastAuditTimestamp: new Date(Date.now() - 12000000).toLocaleTimeString(),
      tokens: [
        { symbol: 'DEPO', name: 'SubNet DEPO Native Token', balance: 35000, chain: 'DEPO_L2', unitPriceUsd: 10000, totalValueUsd: 350000000 },
        { symbol: 'SNT', name: 'SubNet Staging Fuel', balance: 25000, chain: 'DEPO_L2', unitPriceUsd: 0.85, totalValueUsd: 21250 }
      ],
      totalVaultValueUsd: 350021250
    }
  ];

  const [vaultsState, setVaultsState] = useState<ServerAssetVault[]>(defaultVaults);
  const [selectedVault, setSelectedVault] = useState<ServerAssetVault | null>(defaultVaults?.[0] || null);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Deployment Execution State
  const [isDeployingSequence, setIsDeployingSequence] = useState<boolean>(false);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [showAllocateModal, setShowAllocateModal] = useState<boolean>(false);

  // Deposit Token Modal Form
  const [allocTokenSymbol, setAllocTokenSymbol] = useState<string>('DEPO');
  const [allocAmount, setAllocAmount] = useState<number>(50000);
  const [allocTargetServerId, setAllocTargetServerId] = useState<string>(defaultVaults?.[0]?.serverId || '');

  // Asset Audit Utility State
  const [showAuditPanel, setShowAuditPanel] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isFixingSync, setIsFixingSync] = useState<boolean>(false);
  const [auditResults, setAuditResults] = useState<any[]>([]);
  const [auditSummary, setAuditSummary] = useState<{
    totalDomains: number;
    syncErrorsCount: number;
    nonResponsiveDomains: number;
    totalVarianceDpo: number;
    valuationDiscrepancyUsd: number;
  } | null>(null);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  // Run Asset Audit Scan
  const handleRunAssetAudit = async () => {
    setIsAuditing(true);
    setAuditMessage(null);
    try {
      const res = await fetch('/api/asset-audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setAuditSummary(data.summary);
        setAuditResults(data.auditResults);
        setAuditMessage(`✓ Cross-referenced ${data.summary.totalDomains} domains & server nodes with on-chain $DPO contracts.`);
      }
    } catch (err) {
      console.error('Failed to run asset audit:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Fix Sync Error for a Domain or All Domains
  const handleFixSyncError = async (targetDomain: string) => {
    setIsFixingSync(true);
    try {
      const res = await fetch('/api/asset-audit/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDomain })
      });
      const data = await res.json();
      if (data.success) {
        setAuditResults(data.auditResults);
        setAuditMessage(data.message);
        
        // Update summary
        const syncErrorsCount = data.auditResults.filter((i: any) => i.syncStatus !== 'SYNC_OK').length;
        const nonResponsiveDomains = data.auditResults.filter((i: any) => i.domainStatus !== 'RESPONSIVE').length;
        const totalVarianceDpo = data.auditResults.reduce((acc: number, i: any) => acc + i.varianceDpo, 0);

        setAuditSummary({
          totalDomains: data.auditResults.length,
          syncErrorsCount,
          nonResponsiveDomains,
          totalVarianceDpo,
          valuationDiscrepancyUsd: totalVarianceDpo * (tokenPrices['DEPO'] || 10000)
        });

        // Also sync local vault states if matching serverIp
        setVaultsState(prev => (prev || []).map(v => {
          const matchedAudit = data.auditResults.find((a: any) => a.serverIp === v.serverIp);
          if (matchedAudit && matchedAudit.syncStatus === 'SYNC_OK') {
            const newTokens = (v.tokens || []).map(t => t.symbol === 'DEPO' ? { ...t, balance: matchedAudit.onChainDpoBalance, totalValueUsd: matchedAudit.onChainDpoBalance * (tokenPrices['DEPO'] || 10000) } : t);
            return {
              ...v,
              status: 'online',
              tokens: newTokens,
              totalVaultValueUsd: newTokens.reduce((sum, t) => sum + t.totalValueUsd, 0)
            };
          }
          return v;
        }));
      }
    } catch (err) {
      console.error('Failed to fix sync error:', err);
    } finally {
      setIsFixingSync(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Recalculate Vault Values based on current Token Prices
  const updatedVaults = useMemo(() => {
    return (vaultsState || []).map(vault => {
      const updatedTokens = (vault.tokens || []).map(t => {
        const price = tokenPrices[t.symbol] || t.unitPriceUsd;
        return {
          ...t,
          unitPriceUsd: price,
          totalValueUsd: t.balance * price
        };
      });
      const totalVal = updatedTokens.reduce((sum, t) => sum + t.totalValueUsd, 0);
      return {
        ...vault,
        tokens: updatedTokens,
        totalVaultValueUsd: totalVal
      };
    });
  }, [vaultsState, tokenPrices]);

  // Aggregate Portfolio Totals
  const aggregateValueUsd = useMemo(() => {
    return updatedVaults.reduce((sum, v) => sum + v.totalVaultValueUsd, 0);
  }, [updatedVaults]);

  const totalDepoHoldings = useMemo(() => {
    return updatedVaults.reduce((sum, v) => {
      const depoToken = v.tokens.find(t => t.symbol === 'DEPO');
      return sum + (depoToken ? depoToken.balance : 0);
    }, 0);
  }, [updatedVaults]);

  const totalEthHoldings = useMemo(() => {
    return updatedVaults.reduce((sum, v) => {
      const ethToken = v.tokens.find(t => t.symbol === 'ETH');
      return sum + (ethToken ? ethToken.balance : 0);
    }, 0);
  }, [updatedVaults]);

  const totalSolHoldings = useMemo(() => {
    return updatedVaults.reduce((sum, v) => {
      const solToken = v.tokens.find(t => t.symbol === 'SOL');
      return sum + (solToken ? solToken.balance : 0);
    }, 0);
  }, [updatedVaults]);

  // Filtered Vaults by Priority & Search
  const filteredVaults = useMemo(() => {
    return updatedVaults.filter(vault => {
      const matchesPriority = filterPriority === 'ALL' || vault.deploymentPriority === filterPriority;
      const matchesSearch = searchQuery === '' || 
        vault.serverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vault.serverIp.includes(searchQuery) ||
        vault.vaultAddress.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPriority && matchesSearch;
    }).sort((a, b) => a.priorityRank - b.priorityRank);
  }, [updatedVaults, filterPriority, searchQuery]);

  // Handle Priority Rank Update
  const handleUpdatePriority = (serverId: string, newPriority: DeploymentPriority) => {
    setVaultsState(prev => prev.map(v => {
      if (v.serverId === serverId) {
        let rank = 1;
        if (newPriority === 'P0_CRITICAL') rank = 1;
        if (newPriority === 'P1_HIGH') rank = 3;
        if (newPriority === 'P2_MEDIUM') rank = 5;
        if (newPriority === 'P3_LOW') rank = 7;
        return { ...v, deploymentPriority: newPriority, priorityRank: rank };
      }
      return v;
    }));
  };

  // Run Sequential Deployment Sequence for High Priority Vaults
  const handleRunDeploymentSequence = () => {
    setIsDeployingSequence(true);
    setDeploymentLog([
      `[0.00s] Initializing Sequential Priority Deployment Engine for ${updatedVaults.length} Digital Servers...`,
      `[0.20s] Sorting servers by Priority Rank: P0 Critical Core -> P1 High Utility -> P2 Relayer -> P3 Edge...`
    ]);

    setTimeout(() => {
      setDeploymentLog(prev => [
        ...prev,
        `[1.10s] [P0-RANK 1] SubNet Main Genesis Core-01 (10.142.0.12) -> HSM Enclave Verified | Vault Value $${updatedVaults[0]?.totalVaultValueUsd.toLocaleString()}`,
        `[1.45s] [P0-RANK 2] Vector DB Indexer (10.142.0.14) -> Syncing Vector Indexes | Vault Value $${updatedVaults[1]?.totalVaultValueUsd.toLocaleString()}`
      ]);
    }, 1200);

    setTimeout(() => {
      setDeploymentLog(prev => [
        ...prev,
        `[2.30s] [P1-RANK 3] ERC-4337 Paymaster Relayer (10.142.0.18) -> Verifying 0-Gas Paymaster Contract...`,
        `[2.70s] [P1-RANK 4] Solana TPU Parity Node (10.142.0.22) -> PoH Tick Synchronization Verified!`
      ]);
    }, 2600);

    setTimeout(() => {
      setVaultsState(prev => prev.map(v => ({ ...v, deploymentQueueState: 'DEPLOYED_ACTIVE' })));
      setIsDeployingSequence(false);
      setDeploymentLog(prev => [
        ...prev,
        `[3.80s] ✓ ALL DIGITAL SERVER ASSET VAULTS DEPLOYED & VERIFIED!`,
        `[3.90s] Cluster Aggregate Net Asset Value: $${aggregateValueUsd.toLocaleString()} USD across ${updatedVaults.length} Nodes.`
      ]);
    }, 4000);
  };

  // Execute Allocation of Tokens to a Server Vault
  const handleExecuteAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    setVaultsState(prev => prev.map(v => {
      if (v.serverId === allocTargetServerId) {
        const existingTokenIndex = v.tokens.findIndex(t => t.symbol === allocTokenSymbol);
        const price = tokenPrices[allocTokenSymbol] || 1;
        
        let newTokens = [...v.tokens];
        if (existingTokenIndex >= 0) {
          newTokens[existingTokenIndex] = {
            ...newTokens[existingTokenIndex],
            balance: newTokens[existingTokenIndex].balance + allocAmount,
            totalValueUsd: (newTokens[existingTokenIndex].balance + allocAmount) * price
          };
        } else {
          newTokens.push({
            symbol: allocTokenSymbol,
            name: `${allocTokenSymbol} Vault Asset`,
            balance: allocAmount,
            unitPriceUsd: price,
            totalValueUsd: allocAmount * price,
            chain: allocTokenSymbol === 'SOL' ? 'SOLANA' : allocTokenSymbol === 'BTC' ? 'BITCOIN' : 'DEPO_L2'
          });
        }
        return {
          ...v,
          tokens: newTokens,
          totalVaultValueUsd: newTokens.reduce((s, t) => s + t.totalValueUsd, 0)
        };
      }
      return v;
    }));
    setShowAllocateModal(false);
  };

  return (
    <div id="digital-server-asset-vault-studio" className="space-y-6 font-sans">
      
      {/* Top Banner Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-white text-black font-bold shadow-lg flex items-center justify-center">
                <Vault className="h-6 w-6 text-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white tracking-tight font-mono">
                    Digital Server Asset Vault & Deployment Engine
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-mono font-black text-[10px] uppercase tracking-wider">
                    v3.6 Multi-Vault
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Universal token valuation, deployment priority ordering & enclave vault storage for all SubNet digital servers
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <button
              onClick={() => {
                setShowAuditPanel(!showAuditPanel);
                if (!auditSummary) handleRunAssetAudit();
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 border ${
                showAuditPanel 
                  ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-rose-300 border-rose-900/60'
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Asset Audit Utility</span>
              {auditSummary && auditSummary.syncErrorsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-black text-[9px]">
                  {auditSummary.syncErrorsCount} Errors
                </span>
              )}
            </button>

            <button
              onClick={() => setShowAllocateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 shadow-md transition-all flex items-center space-x-2"
            >
              <Plus className="h-4 w-4 text-zinc-300" />
              <span>Allocate Asset to Server Vault</span>
            </button>

            <button
              onClick={handleRunDeploymentSequence}
              disabled={isDeployingSequence}
              className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isDeployingSequence ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-black" />
                  <span>Deploying Priority Queue...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-black fill-black" />
                  <span>Run Priority Deployment Engine</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Asset Audit Utility Panel */}
      <AnimatePresence>
        {showAuditPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-950 border border-rose-900/40 rounded-2xl p-6 shadow-2xl space-y-5 font-mono overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>On-Chain $DPO vs Server Node Metadata Asset Audit</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800">
                      Cross-Referencing Engine
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Validates on-chain smart contract $DPO balances against server-side node metadata & identifies non-responsive domains
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleRunAssetAudit}
                  disabled={isAuditing}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>{isAuditing ? 'Scanning Nodes...' : 'Re-Run Asset Audit'}</span>
                </button>

                <button
                  onClick={() => handleFixSyncError('ALL')}
                  disabled={isFixingSync || (auditSummary?.syncErrorsCount === 0)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-1.5 disabled:opacity-40"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Fix All Sync Errors & Rebind Domains</span>
                </button>

                <button
                  onClick={() => setShowAuditPanel(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notification / Message */}
            {auditMessage && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{auditMessage}</span>
                </div>
                <button onClick={() => setAuditMessage(null)} className="text-zinc-400 hover:text-white text-xs">Dismiss</button>
              </div>
            )}

            {/* Audit Summary Badges */}
            {auditSummary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="text-zinc-400 text-[10px] uppercase font-bold">Domains Scanned</div>
                  <div className="text-lg font-black text-white">{auditSummary.totalDomains}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="text-zinc-400 text-[10px] uppercase font-bold">Sync Errors Found</div>
                  <div className={`text-lg font-black ${auditSummary.syncErrorsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {auditSummary.syncErrorsCount}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="text-zinc-400 text-[10px] uppercase font-bold">$DPO Variance Delta</div>
                  <div className="text-lg font-black text-amber-400">{auditSummary.totalVarianceDpo.toLocaleString()} $DPO</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="text-zinc-400 text-[10px] uppercase font-bold">Non-Responsive Domains</div>
                  <div className={`text-lg font-black ${auditSummary.nonResponsiveDomains > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {auditSummary.nonResponsiveDomains}
                  </div>
                </div>
              </div>
            )}

            {/* Audit Results Table */}
            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Bound Domain & Server Node</th>
                    <th className="p-3">On-Chain $DPO</th>
                    <th className="p-3">Local Node Metadata</th>
                    <th className="p-3">Variance ($DPO)</th>
                    <th className="p-3">Domain Status</th>
                    <th className="p-3">Audit Sync Result</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70 bg-black">
                  {auditResults.map((item, idx) => {
                    const isSynced = item.syncStatus === 'SYNC_OK';
                    const isDomainResponsive = item.domainStatus === 'RESPONSIVE';

                    return (
                      <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{item.domainName}</div>
                          <div className="text-[10px] text-zinc-400">{item.serverName} ({item.serverIp})</div>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">
                          {item.onChainDpoBalance?.toLocaleString()} $DPO
                        </td>
                        <td className="p-3 font-bold text-zinc-200">
                          {item.localNodeDpoBalance?.toLocaleString()} $DPO
                        </td>
                        <td className="p-3 font-bold text-amber-400">
                          {item.varianceDpo > 0 ? `+${item.varianceDpo.toLocaleString()}` : '0'}
                        </td>
                        <td className="p-3">
                          {isDomainResponsive ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                              RESPONSIVE ({item.lastPingMs}ms)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold animate-pulse">
                              {item.domainStatus}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {isSynced ? (
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-bold flex items-center space-x-1 w-fit">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              <span>SYNC OK</span>
                            </span>
                          ) : (
                            <div>
                              <span className="px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-700 text-[10px] font-bold flex items-center space-x-1 w-fit">
                                <AlertTriangle className="h-3 w-3 text-rose-300" />
                                <span>{item.syncStatus}</span>
                              </span>
                              <div className="text-[9px] text-zinc-400 mt-1 max-w-xs">{item.resolutionText}</div>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!isSynced || !isDomainResponsive ? (
                            <button
                              onClick={() => handleFixSyncError(item.domainName)}
                              disabled={isFixingSync}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition-all shadow"
                            >
                              Fix Sync & Rebind
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-500 font-bold">Verified Synced</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aggregate Token Valuation Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* Total Vault Net Worth */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Total Asset Vault Net Worth</span>
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <div className="text-2xl font-black text-white">
            ${aggregateValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center space-x-1 pt-1">
            <span className="text-white font-bold">Across {updatedVaults.length} Digital Servers</span>
          </div>
        </div>

        {/* DEPO Token Holdings */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>DEPO Token Holdings</span>
            <Coins className="h-4 w-4 text-white" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalDepoHoldings.toLocaleString()} <span className="text-xs text-zinc-400">DEPO</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Valuation: ${(totalDepoHoldings * (tokenPrices['DEPO'] || 10000)).toLocaleString()} (@ ${tokenPrices['DEPO']})
          </div>
        </div>

        {/* ETH Gas Reserves */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Ethereum Reserves</span>
            <Layers className="h-4 w-4 text-white" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalEthHoldings.toFixed(2)} <span className="text-xs text-zinc-400">ETH</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Valuation: ${(totalEthHoldings * (tokenPrices['ETH'] || 3480)).toLocaleString()} (@ ${tokenPrices['ETH']})
          </div>
        </div>

        {/* SOL High-Speed Reserves */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Solana Reserves</span>
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalSolHoldings.toLocaleString()} <span className="text-xs text-zinc-400">SOL</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Valuation: ${(totalSolHoldings * (tokenPrices['SOL'] || 184.20)).toLocaleString()} (@ ${tokenPrices['SOL']})
          </div>
        </div>
      </div>

      {/* Live Token Price Feeds Controller */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="font-bold text-white flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-white" />
            <span>Live Token Price Feed Simulator & Oracle Valuation Controls</span>
          </span>
          <span className="text-[11px] text-zinc-400">
            Edit price values to re-index server vault net worth in real time
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
          {Object.entries(tokenPrices).map(([sym, price]) => (
            <div key={sym} className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-400 font-bold uppercase flex justify-between">
                <span>{sym} Price</span>
                <span>USD</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-zinc-500 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setTokenPrices(prev => ({ ...prev, [sym]: Number(e.target.value) }))}
                  className="w-full bg-black text-white font-bold p-1 rounded border border-zinc-800 focus:outline-none focus:border-white text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Log Output */}
      {deploymentLog.length > 0 && (
        <div className="bg-black p-4 rounded-2xl border border-zinc-800 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-400">
            <span className="font-bold text-white flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-white" />
              <span>Priority Deployment Engine Log</span>
            </span>
            <button onClick={() => setDeploymentLog([])} className="hover:text-white">Clear</button>
          </div>
          <pre className="text-zinc-300 text-[11px] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
            {deploymentLog.join('\n')}
          </pre>
        </div>
      )}

      {/* Main Grid: Server Vault Index & Detailed Vault Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: All Digital Servers Asset Vault List */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          
          {/* Controls Bar: Priority Filter & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-white" />
              <h2 className="text-base font-bold text-white">Digital Servers Asset Index</h2>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Server / IP / Vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none focus:border-white text-xs"
                />
              </div>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-white text-xs"
              >
                <option value="ALL">All Priorities</option>
                <option value="P0_CRITICAL">P0 - Critical Core</option>
                <option value="P1_HIGH">P1 - High Utility</option>
                <option value="P2_MEDIUM">P2 - Relayer Mesh</option>
                <option value="P3_LOW">P3 - Edge Staging</option>
              </select>
            </div>
          </div>

          {/* Digital Servers Vault List */}
          <div className="space-y-3 font-mono text-xs">
            {filteredVaults.map((vault) => {
              const isSelected = selectedVault?.serverId === vault.serverId;
              
              let priorityBadgeClass = 'bg-zinc-800 text-zinc-200 border-zinc-700';
              if (vault.deploymentPriority === 'P0_CRITICAL') priorityBadgeClass = 'bg-white text-black border-zinc-200 font-bold';
              if (vault.deploymentPriority === 'P1_HIGH') priorityBadgeClass = 'bg-zinc-200 text-black border-zinc-300 font-bold';
              if (vault.deploymentPriority === 'P2_MEDIUM') priorityBadgeClass = 'bg-zinc-800 text-zinc-200 border-zinc-700';

              return (
                <div
                  key={vault.serverId}
                  onClick={() => setSelectedVault(vault)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected 
                      ? 'bg-zinc-900 border-white ring-1 ring-white shadow-xl' 
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    
                    {/* Server Identity & Priority Rank */}
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${priorityBadgeClass}`}>
                        {vault.deploymentPriority.replace('_', ' ')}
                      </span>
                      <span className="text-zinc-500 font-bold">#{vault.priorityRank}</span>
                      <div>
                        <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>{vault.serverName}</span>
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        </h3>
                        <p className="text-[11px] text-zinc-400">
                          IP: {vault.serverIp} | Type: {vault.serverType}
                        </p>
                      </div>
                    </div>

                    {/* Total Vault Value */}
                    <div className="text-right">
                      <div className="text-sm font-black text-white">
                        ${vault.totalVaultValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {(vault?.tokens || []).length} Token Assets Held
                      </div>
                    </div>
                  </div>

                  {/* Token Quick Pill Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/80 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(vault?.tokens || []).map((t) => (
                        <span key={t.symbol} className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-zinc-300">
                          {t.balance.toLocaleString()} {t.symbol} (${t.totalValueUsd.toLocaleString()})
                        </span>
                      ))}
                    </div>

                    <div className="text-zinc-400 text-[10px] flex items-center space-x-2">
                      <span>Status: <strong className="text-white">{vault.deploymentQueueState}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Vault Inspection & Priority Adjuster */}
        <div className="lg:col-span-5 space-y-6 font-mono text-xs">
          
          {selectedVault ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Vault Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-white" />
                    <h3 className="text-base font-bold text-white">{selectedVault.serverName}</h3>
                  </div>
                  <p className="text-zinc-400 text-[11px]">IP: {selectedVault.serverIp} | ID: {selectedVault.serverId}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white text-black font-bold text-[10px] uppercase">
                  {selectedVault.enclaveStatus}
                </span>
              </div>

              {/* Priority & Queue State Modifier */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <div className="text-zinc-300 font-bold uppercase text-[11px] flex justify-between">
                  <span>Deployment Priority Settings</span>
                  <span>Rank #{selectedVault.priorityRank}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-400">Change Deployment Priority</label>
                  <select
                    value={selectedVault.deploymentPriority}
                    onChange={(e) => handleUpdatePriority(selectedVault.serverId, e.target.value as DeploymentPriority)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-white"
                  >
                    <option value="P0_CRITICAL">P0 - Critical Core (Genesis, Primary DB)</option>
                    <option value="P1_HIGH">P1 - High Utility (Paymaster, Relayers)</option>
                    <option value="P2_MEDIUM">P2 - Relayer Mesh (Indexer, Workers)</option>
                    <option value="P3_LOW">P3 - Edge Staging (Proxy, Test Nodes)</option>
                  </select>
                </div>
              </div>

              {/* Vault Address & Enclave Keys */}
              <div className="space-y-2">
                <div className="text-zinc-400 font-bold uppercase text-[11px] flex justify-between">
                  <span>Server Vault Smart Contract Address</span>
                  <span>EIP-712 Enclave</span>
                </div>
                <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-center justify-between font-mono text-white text-[11px]">
                  <span className="truncate pr-2">{selectedVault.vaultAddress}</span>
                  <button
                    onClick={() => handleCopy(selectedVault.vaultAddress)}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex-shrink-0"
                  >
                    {copiedAddress === selectedVault.vaultAddress ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Server Asset Valuation Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-white text-sm">Server Token Asset Valuation</span>
                  <span className="font-black text-white text-sm">
                    ${selectedVault.totalVaultValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="space-y-2">
                  {(selectedVault?.tokens || []).map((token) => (
                    <div key={token.symbol} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <span>{token.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-black text-zinc-300 text-[9px] border border-zinc-800">
                            {token.chain}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {token.balance.toLocaleString()} {token.symbol} @ ${token.unitPriceUsd.toLocaleString()} / unit
                        </div>
                      </div>

                      <div className="text-right font-bold text-white text-sm">
                        ${token.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staked Weight & Audit Info */}
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <div>Staked DEPO Weight: <strong className="text-white">{selectedVault.stakedDepoWeight.toLocaleString()} DEPO</strong></div>
                <div>Last Vault Security Audit: <strong className="text-white">{selectedVault.lastAuditTimestamp}</strong></div>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl text-center text-zinc-500 font-mono">
              Select a Digital Server from the list to inspect its Asset Vault & Deployment Priority.
            </div>
          )}

        </div>
      </div>

      {/* Allocate Token Asset to Server Vault Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-5 text-xs text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-white" />
                <h3 className="font-bold text-sm text-white">Allocate Token to Server Vault</h3>
              </div>
              <button onClick={() => setShowAllocateModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleExecuteAllocation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400">Target Digital Server</label>
                <select
                  value={allocTargetServerId}
                  onChange={(e) => setAllocTargetServerId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-white"
                >
                  {updatedVaults.map(v => (
                    <option key={v.serverId} value={v.serverId}>
                      {v.serverName} ({v.serverIp})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400">Token Asset Symbol</label>
                <select
                  value={allocTokenSymbol}
                  onChange={(e) => setAllocTokenSymbol(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-white"
                >
                  <option value="DEPO">DEPO (SubNet Native Token)</option>
                  <option value="ETH">ETH (Ethereum Gas Reserve)</option>
                  <option value="SOL">SOL (Solana High-Speed Fuel)</option>
                  <option value="BTC">BTC (Bitcoin Taproot Reserve)</option>
                  <option value="USDC">USDC (USD Coin Stablecoin)</option>
                  <option value="SNT">SNT (SubNet Utility Token)</option>
                  <option value="RUNES">RUNES (DEPO Runes Token)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400">Deposit Amount</label>
                <input
                  type="number"
                  value={allocAmount}
                  onChange={(e) => setAllocAmount(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 shadow-lg"
                >
                  Allocate to Vault
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
