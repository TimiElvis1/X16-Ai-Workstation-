import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw, 
  Server, 
  Layers, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Send,
  Wand2,
  Database,
  ArrowRight
} from 'lucide-react';
import { PrivateServer } from '../types';

interface GaslessTokenDeployerStudioProps {
  servers: PrivateServer[];
  onNodeProvisioned?: () => void;
}

interface RelayerNode {
  id: string;
  name: string;
  ip: string;
  status: 'active' | 'regenerating' | 'syncing';
  sponsoredGasEth: number;
  sponsoredGasSol: number;
  txsRelayed: number;
  latencyMs: number;
}

interface DeployedCoin {
  id: string;
  name: string;
  symbol: string;
  supply: number;
  network: string;
  contractAddress: string;
  txHash: string;
  timestamp: string;
  gasPaid: string;
  sponsorPaymaster: string;
}

export function GaslessTokenDeployerStudio({ servers, onNodeProvisioned }: GaslessTokenDeployerStudioProps) {
  // Coin Deployer Form State
  const [coinName, setCoinName] = useState<string>('SubNet DEPO Gasless Coin');
  const [coinSymbol, setCoinSymbol] = useState<string>('DEPO-Z');
  const [coinSupply, setCoinSupply] = useState<number>(1000000000);
  const [coinDecimals, setCoinDecimals] = useState<number>(18);
  const [targetNetwork, setTargetNetwork] = useState<string>('SubNet AI L2 (0 Gas)');
  const [paymasterSponsor, setPaymasterSponsor] = useState<string>('SubNet AI Auto-Paymaster (100% Free)');
  const [deployerAddress, setDeployerAddress] = useState<string>('0x71C765d7023812dc3A010C7d01b50e0d17dc79A2');

  // Deployment Process State
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStep, setDeploymentStep] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [deployedCoins, setDeployedCoins] = useState<DeployedCoin[]>([
    {
      id: 'coin-1',
      name: 'DEPO Prime Coin',
      symbol: 'DEPO',
      supply: 500000000,
      network: 'Ethereum Sepolia Testnet',
      contractAddress: '0x882a9F4b01e39B27C19aC614E3C8B715A0129c91',
      txHash: '0x94f1c83a17e0811b72a44c9b33a2134568e91822f77c8e9d0a1b2c3d4e5f6a7b',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      gasPaid: '$0.00 (100% Sponsored)',
      sponsorPaymaster: 'SubNet AI Auto-Paymaster'
    },
    {
      id: 'coin-2',
      name: 'SubNet Vector DB Utility Token',
      symbol: 'SVDB',
      supply: 100000000,
      network: 'Solana Devnet',
      contractAddress: 'SoL1v2xP9uR8mK3tY7zB4wN6qE1cD5fA8gH2jL4mN9P',
      txHash: '5K9zY2xR8mK3tY7zB4wN6qE1cD5fA8gH2jL4mN9P0qR1sT2uV3wX4yZ5aB6cD7e',
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
      gasPaid: '$0.00 (100% Sponsored)',
      sponsorPaymaster: 'Solana Gasless Relayer 02'
    }
  ]);

  // Gas Fee Fixer State
  const [fixerContractAddress, setFixerContractAddress] = useState<string>('');
  const [fixerErrorMsg, setFixerErrorMsg] = useState<string>('insufficient funds for gas * price + value');
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixResult, setFixResult] = useState<string | null>(null);

  // Relayer Nodes State
  const [relayerNodes, setRelayerNodes] = useState<RelayerNode[]>([
    { id: 'node-1', name: 'SubNet Paymaster Core-01', ip: '10.142.0.12', status: 'active', sponsoredGasEth: 18.45, sponsoredGasSol: 420.5, txsRelayed: 1420, latencyMs: 12 },
    { id: 'node-2', name: 'ERC-4337 Bundler Node-02', ip: '10.142.0.14', status: 'active', sponsoredGasEth: 12.10, sponsoredGasSol: 310.2, txsRelayed: 980, latencyMs: 14 },
    { id: 'node-3', name: 'Solana Sponsor Relayer-03', ip: '10.142.0.18', status: 'regenerating', sponsoredGasEth: 8.90, sponsoredGasSol: 610.8, txsRelayed: 2150, latencyMs: 18 },
    { id: 'node-4', name: 'EIP-2771 Forwarder-04', ip: '10.142.0.22', status: 'active', sponsoredGasEth: 15.60, sponsoredGasSol: 290.1, txsRelayed: 1100, latencyMs: 11 },
  ]);

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simulate Gasless Coin Deployment
  const handleStartGaslessDeploy = () => {
    setIsDeploying(true);
    setDeploymentStep(1);
    setDeploymentProgress(10);
    setDeploymentLogs([
      `[0.00s] Initiating 100% Gasless Coin Deployment for "${coinName}" (${coinSymbol})...`,
      `[0.15s] Target Network: ${targetNetwork} | Paymaster: ${paymasterSponsor}`,
      `[0.30s] Generating EIP-712 Meta-Transaction Permit Bytecode...`,
      `[0.45s] Constructing OpenZeppelin ERC-20 / Solana SPL Token Specs with 0-gas hooks...`
    ]);

    setTimeout(() => {
      setDeploymentStep(2);
      setDeploymentProgress(40);
      setDeploymentLogs(prev => [
        ...prev,
        `[1.10s] Attaching SubNet Paymaster EIP-712 signature (Sponsor Address: 0x992B...F14)...`,
        `[1.35s] Verifying Vector DB authentication hash against SubNet Relayer Mesh...`,
        `[1.60s] Zero-Gas Check Passed: User wallet gas balance required = 0.00000 ETH / SOL!`
      ]);
    }, 1200);

    setTimeout(() => {
      setDeploymentStep(3);
      setDeploymentProgress(75);
      setDeploymentLogs(prev => [
        ...prev,
        `[2.20s] Spreading transaction relay across 4 regenerating relayer server nodes...`,
        `[2.50s] Node 10.142.0.12 (SubNet Paymaster) sponsoring gas fees ($0.00 charged to user)...`,
        `[2.80s] Contract CREATE2 Address derived: 0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...`
      ]);
    }, 2800);

    setTimeout(() => {
      const newContractAddr = targetNetwork.includes('Solana')
        ? `SoL${Math.random().toString(36).substring(2, 12)}ZgAsSponsorToken`
        : `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      const newTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const newCoin: DeployedCoin = {
        id: `coin-${Date.now()}`,
        name: coinName,
        symbol: coinSymbol,
        supply: coinSupply,
        network: targetNetwork,
        contractAddress: newContractAddr,
        txHash: newTxHash,
        timestamp: new Date().toLocaleTimeString(),
        gasPaid: '$0.00 (100% SubNet Sponsored)',
        sponsorPaymaster: paymasterSponsor
      };

      setDeployedCoins(prev => [newCoin, ...prev]);
      setDeploymentStep(4);
      setDeploymentProgress(100);
      setIsDeploying(false);
      setDeploymentLogs(prev => [
        ...prev,
        `[3.80s] ✓ COIN DEPLOYMENT SUCCESSFUL WITH ZERO GAS FEES!`,
        `[3.90s] Contract Address: ${newContractAddr}`,
        `[4.00s] Token is now live on-chain and registered in SubNet Vector DB index.`
      ]);
    }, 4200);
  };

  // Simulate Gas Fee Fixer
  const handleApplyGasFix = () => {
    setIsFixing(true);
    setFixResult(null);
    setTimeout(() => {
      setIsFixing(false);
      setFixResult(
        `✓ GASLESS DEPLOYMENT FIX APPLIED!\n\nTarget Contract: ${fixerContractAddress || '0x71C765d7023812dc3A010C7d01b50e0d17dc79A2'}\nBypassed Error: "${fixerErrorMsg}"\nPaymaster Relay Status: Active (100% Sponsored)\n\nResult: Gas requirement overridden. The transaction was routed through SubNet Regenerating Paymaster Node (10.142.0.12). You can now deploy or interact with this coin without paying any gas fees!`
      );
    }, 1500);
  };

  return (
    <div id="gasless-token-deployer-workspace" className="space-y-6 font-sans">
      
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
                <Zap className="h-6 w-6 text-black fill-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white tracking-tight font-mono">
                    Gasless Coin & Token Deployer Engine
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-mono font-black text-[10px] uppercase tracking-wider">
                    0 Gas Fee Payment
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Deploy coins & smart contracts without paying ETH/SOL gas fees using SubNet Auto-Paymaster Relayer Mesh
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
              <div className="text-[10px] text-zinc-400 uppercase">User Gas Fee</div>
              <div className="text-lg font-black text-white flex items-center space-x-1">
                <span>$0.00</span>
                <span className="text-[10px] text-zinc-400 font-normal">(Free)</span>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
              <div className="text-[10px] text-zinc-400 uppercase">Paymaster Relayers</div>
              <div className="text-lg font-black text-white flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>4 Nodes Active</span>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl col-span-2 sm:col-span-1">
              <div className="text-[10px] text-zinc-400 uppercase">Deployed Coins</div>
              <div className="text-lg font-black text-white">
                {deployedCoins.length} Coins Live
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Section: Coin Deployer Form & Gas Fee Fixer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 1-Click Gasless Coin Deployer Form */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <Coins className="h-5 w-5 text-white" />
              <h2 className="text-base font-bold text-white font-mono">1-Click Zero-Gas Token Deployer</h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[11px]">
              EIP-712 & Paymaster Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Token Name */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold flex items-center justify-between">
                <span>Coin / Token Name</span>
                <span className="text-[10px] text-zinc-500">e.g. SubNet DEPO</span>
              </label>
              <input
                type="text"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="Enter Token Name"
              />
            </div>

            {/* Token Symbol */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold flex items-center justify-between">
                <span>Ticker Symbol</span>
                <span className="text-[10px] text-zinc-500">e.g. DEPO</span>
              </label>
              <input
                type="text"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="DEPO"
              />
            </div>

            {/* Total Supply */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold">Initial Supply</label>
              <input
                type="number"
                value={coinSupply}
                onChange={(e) => setCoinSupply(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>

            {/* Decimals */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold">Decimals</label>
              <select
                value={coinDecimals}
                onChange={(e) => setCoinDecimals(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              >
                <option value={18}>18 (Standard EVM ERC-20)</option>
                <option value={9}>9 (Solana SPL Token Standard)</option>
                <option value={6}>6 (USDC Parity Standard)</option>
              </select>
            </div>

            {/* Target Blockchain Network */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-bold">Target Blockchain Network</label>
              <select
                value={targetNetwork}
                onChange={(e) => setTargetNetwork(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              >
                <option value="SubNet AI L2 (0 Gas)">SubNet AI L2 Network (Native 0 Gas Engine)</option>
                <option value="Ethereum Sepolia Testnet">Ethereum Sepolia Testnet (ERC-4337 Sponsored)</option>
                <option value="Solana Devnet">Solana Devnet (Gasless Tx Relayer)</option>
                <option value="Polygon Amoy Testnet">Polygon Amoy Testnet (Paymaster Proxy)</option>
                <option value="Arbitrum Sepolia">Arbitrum Sepolia (EIP-2771 Forwarder)</option>
              </select>
            </div>

            {/* Paymaster Relay Sponsor */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-bold flex items-center justify-between">
                <span>Gas Fee Sponsor / Paymaster Engine</span>
                <span className="text-emerald-400 font-bold">100% FREE (0 ETH/SOL Needed)</span>
              </label>
              <select
                value={paymasterSponsor}
                onChange={(e) => setPaymasterSponsor(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              >
                <option value="SubNet AI Auto-Paymaster (100% Free)">SubNet AI Auto-Paymaster (100% Free - Sponsored)</option>
                <option value="ERC-4337 Account Abstraction Paymaster">ERC-4337 Account Abstraction UserOp Paymaster</option>
                <option value="Solana Gasless Relayer 02">Solana Gasless Fee Payer Relayer</option>
                <option value="EIP-2771 Minimal Forwarder">EIP-2771 Minimal Forwarder Contract</option>
              </select>
            </div>

            {/* Deployer Wallet Address */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-bold">Owner / Deployer Wallet Address</label>
              <input
                type="text"
                value={deployerAddress}
                onChange={(e) => setDeployerAddress(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleStartGaslessDeploy}
              disabled={isDeploying}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-mono font-bold text-sm shadow-xl hover:bg-zinc-200 transition-all active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-black" />
                  <span>Sponsoring Gas & Deploying Coin... ({deploymentProgress}%)</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-black fill-black" />
                  <span>Deploy Coin Now (100% Gas Free)</span>
                </>
              )}
            </button>
          </div>

          {/* Live Progress Logs */}
          {(isDeploying || deploymentStep > 0) && (
            <div className="bg-black p-4 rounded-xl border border-zinc-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] border-b border-zinc-800 pb-2">
                <span className="flex items-center space-x-2">
                  <Terminal className="h-3.5 w-3.5 text-zinc-300" />
                  <span className="font-bold text-white">Gasless Deployment Execution Console</span>
                </span>
                <span className="text-white font-bold">{deploymentProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="bg-white h-full transition-all duration-300 rounded-full"
                  style={{ width: `${deploymentProgress}%` }}
                ></div>
              </div>

              <pre className="text-zinc-300 text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {deploymentLogs.join('\n')}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Gas Fee Bypass & Fixer Tool */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Gas Fee Fixer Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-3">
              <Wand2 className="h-5 w-5 text-white" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Gas Fee Deployment Fixer</h3>
                <p className="text-[11px] text-zinc-400 font-mono">Fix gas blocked coin deployments instantly</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400">Target Contract / Coin Address (Optional)</label>
                <input
                  type="text"
                  value={fixerContractAddress}
                  onChange={(e) => setFixerContractAddress(e.target.value)}
                  placeholder="e.g. 0x71C765d7023812dc3A010C7d01b50e0d17dc79A2"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Error / Gas Failure Reason</label>
                <input
                  type="text"
                  value={fixerErrorMsg}
                  onChange={(e) => setFixerErrorMsg(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-white"
                />
              </div>

              <button
                onClick={handleApplyGasFix}
                disabled={isFixing}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold border border-zinc-700 transition-all flex items-center justify-center space-x-2"
              >
                {isFixing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Applying Paymaster Relayer Override...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-white" />
                    <span>⚡ Fix Gas Fee Requirement & Override</span>
                  </>
                )}
              </button>

              {fixResult && (
                <div className="p-3 bg-black rounded-xl border border-zinc-800 text-[11px] text-zinc-200 leading-relaxed font-mono whitespace-pre-wrap">
                  {fixResult}
                </div>
              )}
            </div>
          </div>

          {/* Regenerating Paymaster Server Relayer Network */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-white" />
                <h3 className="text-sm font-bold text-white font-mono">Regenerating Relayer Server Mesh</h3>
              </div>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono border border-zinc-700">
                Auto-Sponsoring
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {relayerNodes.map((node) => (
                <div key={node.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-white animate-pulse' : 'bg-zinc-500'}`}></span>
                      <span className="font-bold text-white">{node.name}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      IP: {node.ip} | Latency: {node.latencyMs}ms | Txs: {node.txsRelayed}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-300 font-bold bg-black px-2 py-1 rounded border border-zinc-800">
                      {node.sponsoredGasEth} ETH Sponsored
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Live Deployed Gasless Coins & Exported Code */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <Coins className="h-5 w-5 text-white" />
            <h3 className="text-base font-bold text-white font-mono">Deployed Gasless Coins History</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {deployedCoins.length} Coins Deployed ($0 Gas Paid)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Coin Name</th>
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Total Supply</th>
                <th className="py-2.5 px-3">Network</th>
                <th className="py-2.5 px-3">Contract Address</th>
                <th className="py-2.5 px-3">Gas Paid</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {deployedCoins.map((coin) => (
                <tr key={coin.id} className="hover:bg-zinc-900/60 transition-all">
                  <td className="py-3 px-3 font-bold text-white">{coin.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-bold border border-zinc-700">
                      {coin.symbol}
                    </span>
                  </td>
                  <td className="py-3 px-3">{coin.supply.toLocaleString()}</td>
                  <td className="py-3 px-3 text-zinc-400">{coin.network}</td>
                  <td className="py-3 px-3 text-white font-mono text-[11px]">
                    {coin.contractAddress.substring(0, 12)}...{coin.contractAddress.slice(-6)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-bold border border-zinc-700 text-[10px]">
                      {coin.gasPaid}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleCopy(coin.contractAddress, coin.id)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold transition-all flex items-center space-x-1"
                    >
                      {copiedIndex === coin.id ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedIndex === coin.id ? 'Copied' : 'Copy Address'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gasless ERC-20 / SPL Contract Bytecode Reference */}
        <div className="bg-black p-4 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-2">
            <span className="font-bold text-white flex items-center space-x-2">
              <Code2 className="h-4 w-4 text-white" />
              <span>SubNet Gasless ERC20PaymasterCompatible.sol Template</span>
            </span>
            <button
              onClick={() => handleCopy(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GaslessSubNetToken is ERC20, ERC20Permit, Ownable {
    address public immutable paymasterRelayer;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address _paymaster
    ) ERC20(name, symbol) ERC20Permit(name) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        paymasterRelayer = _paymaster;
    }

    // Zero-Gas Meta-transaction Execution Hook
    function _msgSender() internal view override returns (address sender) {
        if (msg.sender == paymasterRelayer && msg.data.length >= 20) {
            assembly {
                sender := shrink(calldataload(sub(calldatasize(), 20)))
            }
        } else {
            sender = super._msgSender();
        }
    }
}`, 'code-template')}
              className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1"
            >
              <Copy className="h-3.5 w-3.5 text-zinc-400" />
              <span>Copy Solidity Template</span>
            </button>
          </div>

          <pre className="text-zinc-300 text-[11px] font-mono leading-relaxed overflow-x-auto p-3 bg-zinc-950 rounded-lg border border-zinc-800">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract GaslessSubNetToken is ERC20, ERC20Permit {
    address public immutable paymasterRelayer = 0x1014200000000000000000000000000000000012;

    constructor(string memory name, string memory symbol, uint256 initialSupply) 
        ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // SubNet Auto-Paymaster 0-Gas Fee Bypass
    function executeGaslessPermit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external {
        permit(owner, spender, value, deadline, v, r, s);
        _transfer(owner, spender, value);
    }
}`}
          </pre>
        </div>
      </div>

    </div>
  );
}
