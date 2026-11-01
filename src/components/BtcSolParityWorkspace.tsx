import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Key, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Server, 
  Coins, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Send, 
  Sliders, 
  Flame, 
  Database, 
  Lock, 
  Activity, 
  ArrowRight,
  Sparkles,
  Link2,
  Box,
  Bot,
  ShieldAlert,
  Code2,
  ArrowRightLeft,
  Wallet,
  ExternalLink,
  AlertTriangle,
  Globe,
  Search,
  Copy,
  Radio,
  Network
} from 'lucide-react';
import { 
  CryptographicEngineState, 
  UTXOOutput, 
  SPLTokenAccount, 
  ProofOfHistoryTick, 
  SubnetTokenHost, 
  PrivateServer 
} from '../types';
import { CryptographicAddressEvaluatorStudio } from './CryptographicAddressEvaluatorStudio';
import { LiveTradingChart } from './LiveTradingChart';

interface BtcSolParityWorkspaceProps {
  servers: PrivateServer[];
  onNodeProvisioned?: () => void;
}

export const BtcSolParityWorkspace: React.FC<BtcSolParityWorkspaceProps> = ({
  servers,
  onNodeProvisioned
}) => {
  const [activeSection, setActiveSection] = useState<'cross_chain' | 'payment_gateway' | 'token_launch' | 'matrix' | 'utxo_spl' | 'tokens' | 'poh' | 'provision' | 'rpc_diagnostics' | 'indexer_relay' | 'exchange_rpc_proxy' | 'decentralized_ipfs' | 'address_evaluation'>('cross_chain');

  // Indexer & Webhook Relay Server State
  const [webhookEventType, setWebhookEventType] = useState<'deposit.detected' | 'purchase.completed' | 'token.minted' | 'vault.locked'>('deposit.detected');
  const [webhookTokenSymbol, setWebhookTokenSymbol] = useState<string>('DEPO');
  const [webhookAmount, setWebhookAmount] = useState<string>('5,000.00');
  const [webhookDepositor, setWebhookDepositor] = useState<string>('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [isSendingWebhook, setIsSendingWebhook] = useState<boolean>(false);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([
    {
      eventId: "wh_evt_99104",
      eventType: "deposit.detected",
      tokenSymbol: "DEPO",
      amount: "2,500.00",
      depositorAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      txHash: "0x3e102948f12a02b34901f82a77e1124b89a01f89c02113aa01f99201a02b3490",
      signatureVerified: true,
      processedByNode: "DEPO-Indexer-Relay-01 (10.142.2.19)",
      timestamp: new Date().toISOString(),
      status: "CONFIRMED"
    }
  ]);
  const [isScanningIndexer, setIsScanningIndexer] = useState<boolean>(false);
  const [indexerDeposits, setIndexerDeposits] = useState<any[]>([]);

  // Exchange RPC Gateway Proxy State
  const [rpcProxyMethod, setRpcProxyMethod] = useState<string>('eth_blockNumber');
  const [rpcProxyChain, setRpcProxyChain] = useState<string>('Ethereum Sepolia Testnet');
  const [rpcProxyClient, setRpcProxyClient] = useState<string>('Coinbase / Binance Proxy Worker');
  const [isTestingRpcProxy, setIsTestingRpcProxy] = useState<boolean>(false);
  const [rpcProxyResult, setRpcProxyResult] = useState<any>(null);

  // Decentralized IPFS Storage & Gateway Probe State
  const [ipfsCidInput, setIpfsCidInput] = useState<string>('QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
  const [ipfsGatewayInput, setIpfsGatewayInput] = useState<string>('Pinata Dedicated Gateway');
  const [isParsingIpfs, setIsParsingIpfs] = useState<boolean>(false);
  const [ipfsParsedResult, setIpfsParsedResult] = useState<any>(null);
  const [isProbingGateways, setIsProbingGateways] = useState<boolean>(false);
  const [probedGateways, setProbedGateways] = useState<any[]>([]);

  // RPC Connection Diagnostic Utility State
  const [rpcEndpointInput, setRpcEndpointInput] = useState<string>('https://rpc.sepolia.org');
  const [rpcNetworkInput, setRpcNetworkInput] = useState<string>('Ethereum Sepolia Testnet');
  const [rpcDeployerWallet, setRpcDeployerWallet] = useState<string>('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [rpcTargetContract, setRpcTargetContract] = useState<string>('0x71C765d7023812dc3A010C7d01b50e0d17dc79A2');
  const [isDiagnosingRpc, setIsDiagnosingRpc] = useState<boolean>(false);
  const [isFundingFaucet, setIsFundingFaucet] = useState<boolean>(false);

  const [rpcDiagResults, setRpcDiagResults] = useState<{
    rpcEndpoint: string;
    chainNetwork: string;
    deployerAddress: string;
    contractAddress: string;
    chainId: number;
    blockHeight: number;
    latencyMs: number;
    gasBalance: string;
    bytecodeVerified: boolean;
    overallStatus: 'READY_TO_TRANSACT' | 'INSUFFICIENT_GAS' | 'UNVERIFIED_BYTECODE' | 'RPC_OFFLINE';
    checks: Array<{
      id: string;
      name: string;
      status: string;
      details: string;
      latencyMs?: number;
      balance?: string;
      bytecodeSize?: string;
    }>;
  } | null>({
    rpcEndpoint: 'https://rpc.sepolia.org',
    chainNetwork: 'Ethereum Sepolia Testnet',
    deployerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    contractAddress: '0x71C765d7023812dc3A010C7d01b50e0d17dc79A2',
    chainId: 11155111,
    blockHeight: 19820412,
    latencyMs: 16,
    gasBalance: '1.4250 ETH',
    bytecodeVerified: true,
    overallStatus: 'READY_TO_TRANSACT',
    checks: [
      {
        id: 'RPC_STATUS',
        name: 'RPC Provider Status & Latency',
        status: 'HEALTHY',
        latencyMs: 16,
        details: 'Connected to https://rpc.sepolia.org (Chain ID: 11155111, Block: #19,820,412)'
      },
      {
        id: 'GAS_BALANCE',
        name: 'Deployer Gas Token Balance',
        status: 'SUFFICIENT',
        balance: '1.4250 ETH',
        details: 'Deployer address 0x70997970... holds 1.4250 ETH (Enough for transaction fees)'
      },
      {
        id: 'CONTRACT_BYTECODE',
        name: 'On-Chain Contract Bytecode Verification',
        status: 'VERIFIED_ON_CHAIN',
        bytecodeSize: '3420 bytes',
        details: 'Deployed contract bytecode verified at address 0x71C765d7023812dc3A010C7d01b50e0d17dc79A2 (3420 bytes)'
      }
    ]
  });

  // Run RPC Connection Diagnostic
  const handleRunRpcDiagnostic = async () => {
    setIsDiagnosingRpc(true);
    addLog(`Running RPC Connection Diagnostic for ${rpcEndpointInput} (${rpcNetworkInput})...`);

    try {
      const res = await fetch('/api/crypto-parity/diagnose-rpc-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rpcEndpoint: rpcEndpointInput,
          chainNetwork: rpcNetworkInput,
          deployerAddress: rpcDeployerWallet,
          contractAddress: rpcTargetContract
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRpcDiagResults(data);
        addLog(`✓ RPC DIAGNOSTIC COMPLETE: RPC Latency: ${data.latencyMs}ms | Gas: ${data.gasBalance} | Bytecode: ${data.bytecodeVerified ? 'VERIFIED' : 'EMPTY'} | Status: ${data.overallStatus}`);
      }
    } catch (err) {
      console.error('RPC connection diagnostic failed:', err);
    } finally {
      setIsDiagnosingRpc(false);
    }
  };

  // Top up Testnet Gas via Faucet
  const handleTopUpGasFaucet = async () => {
    setIsFundingFaucet(true);
    try {
      const res = await fetch('/api/crypto-parity/faucet-gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployerAddress: rpcDeployerWallet,
          network: rpcNetworkInput
        })
      });
      if (res.ok) {
        const data = await res.json();
        addLog(`✓ FAUCET SUCCESS: Funded 2.5 Testnet Gas tokens to ${data.deployerAddress}. Tx: ${data.txHash.slice(0, 14)}...`);
        await handleRunRpcDiagnostic();
      }
    } catch (err) {
      console.error('Faucet top-up failed:', err);
    } finally {
      setIsFundingFaucet(false);
    }
  };

  // Webhook Relay Dispatch Handler
  const handleSendWebhookRelay = async () => {
    setIsSendingWebhook(true);
    addLog(`Dispatching ${webhookEventType} webhook relay payload to DEPO Indexer...`);
    try {
      const res = await fetch('/api/relay/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: webhookEventType,
          tokenSymbol: webhookTokenSymbol,
          amount: webhookAmount,
          depositorAddress: webhookDepositor
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWebhookLogs(prev => [data.eventLog, ...prev]);
        addLog(`✓ WEBHOOK RELAY CONFIRMED: Event ID ${data.eventLog.eventId} processed by ${data.eventLog.processedByNode}`);
      }
    } catch (err) {
      console.error('Webhook relay failed:', err);
    } finally {
      setIsSendingWebhook(false);
    }
  };

  // Block Deposit Indexer Scanner Handler
  const handleRunDepositIndexer = async () => {
    setIsScanningIndexer(true);
    addLog(`Triggering block deposit indexer scan across DEPO Subnet...`);
    try {
      const res = await fetch('/api/relay/deposit-indexer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockWindow: 50, network: rpcNetworkInput })
      });
      if (res.ok) {
        const data = await res.json();
        setIndexerDeposits(data.deposits);
        addLog(`✓ INDEXER SCAN COMPLETE: Found ${data.detectedDepositsCount} deposits across 50 blocks. Status: ${data.status}`);
      }
    } catch (err) {
      console.error('Deposit indexer scan error:', err);
    } finally {
      setIsScanningIndexer(false);
    }
  };

  // Exchange RPC Proxy Load Balancer Test Handler
  const handleTestExchangeRpcProxy = async () => {
    setIsTestingRpcProxy(true);
    addLog(`Testing Exchange RPC Gateway Proxy Load Balancer for method ${rpcProxyMethod}...`);
    try {
      const res = await fetch('/api/gateway-proxy/rpc-load-balancer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: rpcProxyMethod,
          targetChain: rpcProxyChain,
          exchangeClient: rpcProxyClient
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRpcProxyResult(data);
        addLog(`✓ RPC PROXY LOAD BALANCED: Routed request via ${data.routedThroughNode.name} (${data.routedThroughNode.latencyMs}ms). Capacity: ${data.totalRpsCapacity} RPS`);
      }
    } catch (err) {
      console.error('Exchange RPC Proxy test error:', err);
    } finally {
      setIsTestingRpcProxy(false);
    }
  };

  // Decentralized IPFS CID Payload Parser Handler
  const handleParseIpfsPayload = async () => {
    setIsParsingIpfs(true);
    addLog(`Parsing IPFS CID / Arweave payload ${ipfsCidInput} via ${ipfsGatewayInput}...`);
    try {
      const res = await fetch('/api/decentralized/ipfs-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidOrHash: ipfsCidInput, gateway: ipfsGatewayInput })
      });
      if (res.ok) {
        const data = await res.json();
        setIpfsParsedResult(data.parsedData);
        addLog(`✓ IPFS PAYLOAD RESOLVED: ${data.parsedData.metadataSchema.name} (${data.parsedData.sizeBytes} bytes) in ${data.parsedData.resolveTimeMs}ms`);
      }
    } catch (err) {
      console.error('IPFS parsing error:', err);
    } finally {
      setIsParsingIpfs(false);
    }
  };

  // Decentralized Gateway Probe Handler
  const handleProbeDecentralizedGateways = async () => {
    setIsProbingGateways(true);
    addLog(`Probing decentralized storage & Web3 gateways (Pinata, Fleek, Cloudflare, Arweave, Pocket dRPC)...`);
    try {
      const res = await fetch('/api/decentralized/gateways-probe', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProbedGateways(data.gateways);
        addLog(`✓ GATEWAY PROBE COMPLETE: Tested ${data.totalGatewaysTested} gateways. Fastest: ${data.fastestGateway}`);
      }
    } catch (err) {
      console.error('Gateway probe error:', err);
    } finally {
      setIsProbingGateways(false);
    }
  };

  // Cross-Chain Bridge Workflow States
  const [bridgeStep, setBridgeStep] = useState<number>(0);
  const [bridgeLogs, setBridgeLogs] = useState<string[]>([
    `[BRIDGE-INIT] DEPO Subledger Relayer active on enclave daemon 10.142.3.153`,
    `[KMS-ATTEST] SECP256k1 & Ed25519 bridge signers verified`,
    `[MEMPOOL-SYNC] Connected to Ethereum & Solana RPC liquidity pools`
  ]);

  // Deploy Hosted Coin Form States
  const [newCoinName, setNewCoinName] = useState<string>('DEPO Subnet Credit');
  const [newCoinSymbol, setNewCoinSymbol] = useState<string>('DEPO');
  const [newCoinStandard, setNewCoinStandard] = useState<string>('ERC-20');
  const [newCoinSupply, setNewCoinSupply] = useState<number>(50000000);
  const [newCoinDecimals, setNewCoinDecimals] = useState<number>(18);
  const [newCoinNodeIp, setNewCoinNodeIp] = useState<string>('10.142.0.12');
  const [isDeployingCoin, setIsDeployingCoin] = useState<boolean>(false);

  // Cross-Chain Wallet Dispatcher Form States
  const [transferSymbol, setTransferSymbol] = useState<string>('DEPO');
  const [transferAmount, setTransferAmount] = useState<number>(2500);
  const [transferDestinationWallet, setTransferDestinationWallet] = useState<string>('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [transferTargetChain, setTransferTargetChain] = useState<string>('EVM');
  const [transferSourceNodeIp, setTransferSourceNodeIp] = useState<string>('10.142.0.12');
  const [transferMemo, setTransferMemo] = useState<string>('SubNet Cross-Chain Liquidity Settlement');
  const [isTransferringWallet, setIsTransferringWallet] = useState<boolean>(false);
  const [lastTransferReceipt, setLastTransferReceipt] = useState<{
    txHash: string;
    symbol: string;
    amount: number;
    destinationWallet: string;
    targetBlockchain: string;
    blockNumber: number;
    timestamp: string;
  } | null>(null);

  // Payment Gateway Form & Invoices State
  const [pgMerchantName, setPgMerchantName] = useState<string>('Acme Cloud Services');
  const [pgMerchantWallet, setPgMerchantWallet] = useState<string>('0x3B9c02d18471eA284094C991f851A07b538f9021');
  const [pgAcceptedCoin, setPgAcceptedCoin] = useState<string>('DEPO');
  const [pgNetwork, setPgNetwork] = useState<string>('EVM / DEPO Subnet');
  const [pgAmount, setPgAmount] = useState<number>(500);
  const [pgDescription, setPgDescription] = useState<string>('Enterprise API Subscription - Tier 1');
  const [pgWebhook, setPgWebhook] = useState<string>('https://acme-api.com/webhooks/depo-pay');
  const [isCreatingInvoice, setIsCreatingInvoice] = useState<boolean>(false);
  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  const [selectedInvoiceForCheckout, setSelectedInvoiceForCheckout] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [apiSnippetLang, setApiSnippetLang] = useState<'curl' | 'nodejs' | 'python' | 'react'>('nodejs');
  
  // Data States
  const [engineState, setEngineState] = useState<CryptographicEngineState>({
    secp256k1VerifiedCount: 482910,
    ed25519VerifiedCount: 912040,
    schnorrBip340Active: true,
    blake3Acceleration: true,
    pohSequenceTick: 8940212,
    pohHash: "0x9f2a819c4b312e0984f1a23e5d",
    tpsCapacity: 65000
  });

  const [utxos, setUtxos] = useState<UTXOOutput[]>([]);
  const [splTokens, setSplTokens] = useState<SPLTokenAccount[]>([]);
  const [pohTicks, setPohTicks] = useState<ProofOfHistoryTick[]>([]);
  const [hostedTokens, setHostedTokens] = useState<SubnetTokenHost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Action States
  const [verifyingSecp, setVerifyingSecp] = useState<boolean>(false);
  const [verifyingEd, setVerifyingEd] = useState<boolean>(false);
  const [generatingTick, setGeneratingTick] = useState<boolean>(false);
  const [provisioningNode, setProvisioningNode] = useState<boolean>(false);
  const [actionLog, setActionLog] = useState<string[]>([]);

  // Token Launch Architecture & Vector DB States
  const [pingingNode, setPingingNode] = useState<boolean>(false);
  const [pingResult, setPingResult] = useState<{
    targetIp: string;
    latencyMs: number;
    responseString: string;
    status: string;
    packetLossPercent: number;
  } | null>(null);

  const [generatingVectorDb, setGeneratingVectorDb] = useState<boolean>(false);
  const [vectorDbNode, setVectorDbNode] = useState<any>(null);

  // Phase 2 Form
  const [tokenNetwork, setTokenNetwork] = useState<string>('Ethereum Mainnet');
  const [tokenStandard, setTokenStandard] = useState<string>('ERC-20');
  const [tokenNameInput, setTokenNameInput] = useState<string>('DEPO Parity Token');
  const [tokenSymbolInput, setTokenSymbolInput] = useState<string>('DEPO');
  const [tokenDecimalsInput, setTokenDecimalsInput] = useState<number>(18);
  const [tokenSupplyInput, setTokenSupplyInput] = useState<number>(100000000);
  const [deployingContract, setDeployingContract] = useState<boolean>(false);
  const [deployedContractInfo, setDeployedContractInfo] = useState<{
    contractAddress: string;
    txHash: string;
    network: string;
    symbol: string;
  } | null>(null);

  // Phase 3 & 4
  const [trackedWalletAddress, setTrackedWalletAddress] = useState<string>('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [walletSyncActive, setWalletSyncActive] = useState<boolean>(true);
  const [executingInjunction, setExecutingInjunction] = useState<boolean>(false);

  // UTXO Form
  const [utxoValueSats, setUtxoValueSats] = useState<number>(500000);
  const [utxoAddress, setUtxoAddress] = useState<string>('bc1p8d3c90a12e345b67c89d012e345f67a89b012c');

  // SPL Form
  const [selectedSplSymbol, setSelectedSplSymbol] = useState<string>('DEPO');
  const [splTransferAmount, setSplTransferAmount] = useState<number>(500);

  // Node Provision Form
  const [nodeName, setNodeName] = useState<string>('Telemetry-Validator-Node-02');
  const [nodeIp, setNodeIp] = useState<string>('10.142.2.14');

  useEffect(() => {
    fetchParityData();
    fetchPaymentInvoices();
  }, []);

  const fetchPaymentInvoices = async () => {
    try {
      const res = await fetch('/api/payment-gateway/invoices');
      if (res.ok) {
        const data = await res.json();
        setInvoicesList(data.invoices || []);
        if (data.invoices?.length > 0) {
          setSelectedInvoiceForCheckout(data.invoices[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch payment gateway invoices:', err);
    }
  };

  // Deploy Hosted Coin to Server Node
  const handleDeployHostedCoin = async () => {
    if (!newCoinName || !newCoinSymbol) return;
    setIsDeployingCoin(true);
    try {
      const res = await fetch('/api/blockchain/deploy-coin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCoinName,
          symbol: newCoinSymbol,
          standard: newCoinStandard,
          totalSupply: newCoinSupply,
          decimals: newCoinDecimals,
          hostedNodeIp: newCoinNodeIp
        })
      });
      if (res.ok) {
        const data = await res.json();
        setHostedTokens(prev => [data.coin, ...prev]);
        addLog(`HOSTED COIN DEPLOYED: $${data.coin.symbol} (${data.coin.name}) deployed on server ${newCoinNodeIp}. Contract/Mint: ${data.coin.contractAddress}`);
      }
    } catch (err) {
      console.error('Failed to deploy hosted coin:', err);
    } finally {
      setIsDeployingCoin(false);
    }
  };

  // Transfer / Dispatch Coin to External Wallet Address
  const handleTransferToExternalWallet = async () => {
    if (!transferDestinationWallet || !transferAmount) return;
    setIsTransferringWallet(true);
    setBridgeStep(1);
    setBridgeLogs(prev => [`[1/4] Generating Enclave KMS ECDSA/Ed25519 signature for node ${transferSourceNodeIp}...`, ...prev]);

    setTimeout(async () => {
      setBridgeStep(2);
      setBridgeLogs(prev => [`[2/4] Locking ${transferAmount} $${transferSymbol} on server subledger & creating Merkle proof...`, ...prev]);

      setTimeout(async () => {
        setBridgeStep(3);
        setBridgeLogs(prev => [`[3/4] Transmitting cross-chain relay packet to ${transferTargetChain} validator pool...`, ...prev]);

        try {
          const res = await fetch('/api/blockchain/transfer-to-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              symbol: transferSymbol,
              amount: transferAmount,
              sourceNodeIp: transferSourceNodeIp,
              destinationWallet: transferDestinationWallet,
              targetBlockchain: transferTargetChain,
              memo: transferMemo
            })
          });
          if (res.ok) {
            const data = await res.json();
            setLastTransferReceipt({
              txHash: data.txHash,
              symbol: data.symbol,
              amount: data.amount,
              destinationWallet: data.destinationWallet,
              targetBlockchain: data.targetBlockchain,
              blockNumber: data.blockNumber,
              timestamp: data.timestamp
            });
            setBridgeStep(4);
            setBridgeLogs(prev => [`[4/4] CONFIRMED ON ${transferTargetChain.toUpperCase()} BLOCKCHAIN! Block #${data.blockNumber}. Tx Hash: ${data.txHash}`, ...prev]);
            addLog(`CROSS-CHAIN BRIDGE SUCCESS: ${data.amount} $${data.symbol} moved from node ${transferSourceNodeIp} to ${data.destinationWallet.slice(0, 12)}... on ${data.targetBlockchain}!`);
          }
        } catch (err) {
          console.error('Failed to transfer coin to external wallet:', err);
          setBridgeStep(0);
        } finally {
          setIsTransferringWallet(false);
        }
      }, 700);
    }, 600);
  };

  // Create Payment Gateway Invoice
  const handleCreatePaymentInvoice = async () => {
    if (!pgMerchantWallet || !pgAmount) return;
    setIsCreatingInvoice(true);
    try {
      const res = await fetch('/api/payment-gateway/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantName: pgMerchantName,
          merchantAddress: pgMerchantWallet,
          acceptedCoinSymbol: pgAcceptedCoin,
          blockchainNetwork: pgNetwork,
          amount: pgAmount,
          description: pgDescription,
          webhookUrl: pgWebhook
        })
      });
      if (res.ok) {
        const data = await res.json();
        setInvoicesList(prev => [data.invoice, ...prev]);
        setSelectedInvoiceForCheckout(data.invoice);
        addLog(`PAYMENT INVOICE GENERATED: Invoice #${data.invoice.invoiceId} for ${data.invoice.amount} $${data.invoice.acceptedCoinSymbol} created for ${pgMerchantName}`);
      }
    } catch (err) {
      console.error('Failed to create payment invoice:', err);
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  // Process Payment & Auto-Settle to Merchant Wallet
  const handleProcessPayment = async (invId: string) => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/payment-gateway/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invId })
      });
      if (res.ok) {
        const data = await res.json();
        setInvoicesList(prev => prev.map(inv => inv.invoiceId === invId ? data.invoice : inv));
        setSelectedInvoiceForCheckout(data.invoice);
        addLog(`PAYMENT SETTLED & FORWARDED: Invoice #${invId} paid! Settled funds auto-forwarded to merchant destination wallet ${data.invoice.merchantAddress.slice(0, 12)}... [Tx: ${data.forwardTxHash.slice(0, 14)}...]`);
      }
    } catch (err) {
      console.error('Failed to process payment:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchParityData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crypto-parity/state');
      if (res.ok) {
        const data = await res.json();
        setEngineState(data.engineState || engineState);
        setUtxos(data.utxos || []);
        setSplTokens(data.splTokens || []);
        setPohTicks(data.pohTicks || []);
        setHostedTokens(data.hostedTokens || []);
      }
    } catch (err) {
      console.error('Failed to fetch BTC/SOL parity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addLog = (msg: string) => {
    setActionLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 12)]);
  };

  // Verify Signature Batch
  const handleVerifyBatch = async (curveType: 'SECP256K1' | 'ED25519') => {
    if (curveType === 'SECP256K1') setVerifyingSecp(true);
    else setVerifyingEd(true);

    try {
      const res = await fetch('/api/crypto-parity/verify-signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 2500, curveType })
      });
      if (res.ok) {
        const data = await res.json();
        setEngineState(data.updatedEngineState);
        addLog(`BATCH VERIFIED: 2,500 ${curveType} cryptographic signatures via AVX-512 SIMD pipeline.`);
      }
    } catch (err) {
      console.error('Signature verification failed:', err);
    } finally {
      setVerifyingSecp(false);
      setVerifyingEd(false);
    }
  };

  // Execute UTXO Output
  const handleExecuteUtxo = async () => {
    try {
      const res = await fetch('/api/crypto-parity/execute-utxo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAddress: utxoAddress,
          valueSats: Number(utxoValueSats)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUtxos(prev => [data.utxo, ...prev]);
        addLog(`UTXO CREATED: ${utxoValueSats} Satoshis output minted to ${utxoAddress.slice(0, 10)}...`);
      }
    } catch (err) {
      console.error('Failed to execute UTXO:', err);
    }
  };

  // Transfer SPL Token
  const handleTransferSpl = async () => {
    try {
      const res = await fetch('/api/crypto-parity/transfer-spl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenSymbol: selectedSplSymbol,
          amount: Number(splTransferAmount)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSplTokens(data.splTokens);
        addLog(`SPL TRANSFER: +${splTransferAmount} $${selectedSplSymbol} transferred on Associated Token Account (ATA).`);
      }
    } catch (err) {
      console.error('Failed to transfer SPL token:', err);
    }
  };

  // Generate PoH Tick Clock
  const handleGenerateTick = async () => {
    setGeneratingTick(true);
    try {
      const res = await fetch('/api/crypto-parity/generate-poh-tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventPayload: `gRPC TPU Ingestion & PoH Sequence Tick #${engineState.pohSequenceTick + 1}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPohTicks(prev => [data.tick, ...prev]);
        setEngineState(prev => ({
          ...prev,
          pohSequenceTick: data.tick.tickIndex,
          pohHash: data.tick.hash
        }));
        addLog(`POH TICK GENERATED: Tick #${data.tick.tickIndex} timestamped with hash ${data.tick.hash.slice(0, 12)}...`);
      }
    } catch (err) {
      console.error('Failed to generate PoH tick:', err);
    } finally {
      setGeneratingTick(false);
    }
  };

  // Provision Validator Node
  const handleProvisionNode = async () => {
    setProvisioningNode(true);
    try {
      const res = await fetch('/api/crypto-parity/provision-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeName,
          ipAddress: nodeIp,
          nodeRole: 'TELEMETRY_VALIDATOR_CORE'
        })
      });
      if (res.ok) {
        const data = await res.json();
        addLog(`NODE PROVISIONED: Dedicated Telemetry Validator Core Node "${data.node.name}" (${data.node.ipAddress}) deployed.`);
        if (onNodeProvisioned) onNodeProvisioned();
      }
    } catch (err) {
      console.error('Failed to provision validator node:', err);
    } finally {
      setProvisioningNode(false);
    }
  };

  // ⚡ Ping Diagnostic Action
  const handlePingNode = async (ip = "10.142.0.12") => {
    setPingingNode(true);
    try {
      const res = await fetch('/api/crypto-parity/ping-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetIp: ip })
      });
      if (res.ok) {
        const data = await res.json();
        setPingResult(data);
        addLog(`⚡ PING DIAGNOSTIC: 64 bytes from ${data.targetIp}: icmp_seq=1 ttl=${data.ttl} time=${data.latencyMs}ms (${data.status})`);
      }
    } catch (err) {
      console.error('Ping diagnostic failed:', err);
    } finally {
      setPingingNode(false);
    }
  };

  // + Gen Vector DB Server Action
  const handleGenVectorDbNode = async () => {
    setGeneratingVectorDb(true);
    try {
      const res = await fetch('/api/crypto-parity/gen-vector-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeName: "Vector-DB-Qdrant-Core-01",
          targetIp: "10.142.0.12"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setVectorDbNode(data.node);
        addLog(`+ GEN VECTOR DB SERVER: Provisioned high-throughput Qdrant Vector Engine on ${data.node?.ipAddress || '10.142.0.12'}`);
        if (onNodeProvisioned) onNodeProvisioned();
      }
    } catch (err) {
      console.error('Failed to generate Vector DB Server:', err);
    } finally {
      setGeneratingVectorDb(false);
    }
  };

  // Phase 2 Smart Contract Deployment
  const handleDeployTokenContract = async () => {
    setDeployingContract(true);
    try {
      const res = await fetch('/api/crypto-parity/deploy-token-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tokenNameInput,
          symbol: tokenSymbolInput,
          decimals: tokenDecimalsInput,
          initialSupply: tokenSupplyInput,
          network: tokenNetwork,
          standard: tokenStandard
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDeployedContractInfo({
          contractAddress: data.contractAddress,
          txHash: data.txHash,
          network: data.network,
          symbol: tokenSymbolInput.toUpperCase()
        });
        setHostedTokens(prev => [data.deployedToken, ...prev]);
        addLog(`PHASE 2 DEPLOYED: Compiled & deployed ${tokenStandard} $${tokenSymbolInput.toUpperCase()} on ${tokenNetwork}. Contract: ${data.contractAddress.slice(0, 14)}...`);
      }
    } catch (err) {
      console.error('Contract deployment failed:', err);
    } finally {
      setDeployingContract(false);
    }
  };

  // Phase 4 Executing Code Injunctions
  const handleExecuteLaunchInjunction = async (actionType: string) => {
    setExecutingInjunction(true);
    try {
      const res = await fetch('/api/crypto-parity/execute-launch-injunction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          tokenSymbol: tokenSymbolInput,
          targetAddress: trackedWalletAddress,
          amount: 50000
        })
      });
      if (res.ok) {
        const data = await res.json();
        addLog(`PHASE 4 INJUNCTION EXECUTION [${data.injunctionId}]: ${data.message}`);
      }
    } catch (err) {
      console.error('Injunction execution failed:', err);
    } finally {
      setExecutingInjunction(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 rounded-2xl text-white shadow-md shadow-red-200">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  BTC & Solana Parity Cryptographic Core
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Secp256k1 + Ed25519
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dual-curve cryptographic verification, UTXO indexer & SPL account state machine hosted on subnet servers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-trigger-poh-tick"
              onClick={handleGenerateTick}
              disabled={generatingTick}
              className="flex items-center space-x-2 px-3.5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm shadow-red-200 transition-all"
            >
              <Clock className={`h-4 w-4 ${generatingTick ? 'animate-spin' : ''}`} />
              <span>{generatingTick ? 'Ticking...' : 'Trigger PoH Order Tick'}</span>
            </button>

            <button
              id="btn-provision-telemetry-node"
              onClick={() => setActiveSection('provision')}
              className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Server className="h-4 w-4 text-red-400" />
              <span>Provision Validator Node</span>
            </button>
          </div>
        </div>

        {/* Live Core Metrics Row with Motion Animations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">Secp256k1 (BTC)</span>
              <Key className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-base font-mono font-bold text-slate-900">
              {engineState.secp256k1VerifiedCount.toLocaleString()}
            </p>
            <p className="text-[10px] text-amber-600 font-semibold font-mono">ECDSA / Schnorr Verified</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">Ed25519 (Solana)</span>
              <ShieldCheck className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-base font-mono font-bold text-slate-900">
              {engineState.ed25519VerifiedCount.toLocaleString()}
            </p>
            <p className="text-[10px] text-purple-600 font-semibold font-mono">EdDSA Batch Verification</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">PoH Sequence Tick</span>
              <Activity className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-base font-mono font-bold text-red-600">
              #{engineState.pohSequenceTick.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">{engineState.pohHash.slice(0, 10)}...</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">gRPC / TPU Throughput</span>
              <Zap className="h-4 w-4 text-emerald-600 animate-pulse" />
            </div>
            <p className="text-base font-mono font-bold text-emerald-600">
              {engineState.tpsCapacity.toLocaleString()} TPS
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold font-mono">BLAKE3 Hardware Engine</p>
          </motion.div>

        </div>
      </motion.div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-red-200 pb-2">
        <button
          onClick={() => setActiveSection('address_evaluation')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'address_evaluation'
              ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 text-white shadow-md shadow-amber-200'
              : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-50'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-amber-500 animate-pulse" />
          <span>Address Evaluator & Admin</span>
          <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-mono font-bold">EVM + SOL + BTC</span>
        </button>

        <button
          onClick={() => setActiveSection('cross_chain')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'cross_chain'
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md shadow-red-200'
              : 'bg-white border border-red-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Send className="h-4 w-4 text-amber-300 animate-pulse" />
          <span>Cross-Chain Transfer</span>
          <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[9px] font-mono font-bold">ETH + SOL</span>
        </button>

        <button
          onClick={() => setActiveSection('token_launch')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'token_launch'
              ? 'bg-red-600 text-white shadow-sm shadow-red-200'
              : 'bg-white border border-red-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
          <span>4-Phase Token Launch & Vector DB</span>
        </button>

        <button
          onClick={() => setActiveSection('payment_gateway')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'payment_gateway'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <Coins className="h-4 w-4 text-emerald-500" />
          <span>Hosted Coin & Payment Gateway API</span>
          <span className="px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[9px] font-mono font-bold">API</span>
        </button>

        <button
          onClick={() => setActiveSection('matrix')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'matrix'
              ? 'bg-red-600 text-white shadow-sm shadow-red-200'
              : 'bg-white border border-red-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Crypto Primitives Matrix</span>
        </button>

        <button
          onClick={() => setActiveSection('utxo_spl')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'utxo_spl'
              ? 'bg-red-600 text-white shadow-sm shadow-red-200'
              : 'bg-white border border-red-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>UTXO & SPL VM Engine</span>
        </button>

        <button
          onClick={() => setActiveSection('tokens')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'tokens'
              ? 'bg-red-600 text-white shadow-sm shadow-red-200'
              : 'bg-white border border-red-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Coins className="h-4 w-4" />
          <span>Hosted Coins & Tokens ({hostedTokens.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('poh')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'poh'
              ? 'bg-red-600 text-white shadow-sm shadow-red-200'
              : 'bg-white border border-red-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Proof-of-Telemetry (PoH) Clock</span>
        </button>

        <button
          onClick={() => setActiveSection('rpc_diagnostics')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'rpc_diagnostics'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-200'
              : 'bg-white border border-blue-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
          <span>RPC & Pre-Tx Connection Diagnostics</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
            rpcDiagResults?.overallStatus === 'READY_TO_TRANSACT'
              ? 'bg-emerald-500 text-white'
              : 'bg-amber-400 text-slate-900'
          }`}>
            {rpcDiagResults?.overallStatus === 'READY_TO_TRANSACT' ? 'READY' : 'DIAGNOSE'}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('indexer_relay')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'indexer_relay'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200'
              : 'bg-white border border-purple-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
          }`}
        >
          <Radio className="h-4 w-4 text-purple-500 animate-pulse" />
          <span>Deposit Indexer & Webhook Relay</span>
          <span className="px-1.5 py-0.2 bg-purple-500 text-white rounded-full text-[9px] font-mono font-bold">HMAC</span>
        </button>

        <button
          onClick={() => setActiveSection('exchange_rpc_proxy')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'exchange_rpc_proxy'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-200'
              : 'bg-white border border-blue-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          <Network className="h-4 w-4 text-blue-500" />
          <span>Exchange RPC Gateway Proxy</span>
          <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded-full text-[9px] font-mono font-bold">PROXIED</span>
        </button>

        <button
          onClick={() => setActiveSection('decentralized_ipfs')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'decentralized_ipfs'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-200'
              : 'bg-white border border-cyan-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700'
          }`}
        >
          <Globe className="h-4 w-4 text-teal-500" />
          <span>IPFS / Arweave Gateway Suite</span>
        </button>

        <button
          onClick={() => setActiveSection('provision')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'provision'
              ? 'bg-red-600 text-white shadow-sm shadow-red-200'
              : 'bg-white border border-red-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Server className="h-4 w-4" />
          <span>Provision Node</span>
        </button>
      </div>

      {/* Main Section Content with Framer Motion AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* SECTION: Cryptographic Address Evaluator & Multi-Node Admin Studio */}
          {activeSection === 'address_evaluation' && (
            <CryptographicAddressEvaluatorStudio servers={servers} />
          )}

          {/* SECTION: Dedicated Cross-Chain Transfer Interface */}
          {activeSection === 'cross_chain' && (
            <div className="space-y-6">
              
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3.5 bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 rounded-2xl text-white shadow-lg">
                      <Send className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight text-white">
                          DEPO Cross-Chain Bridge & Node Dispatcher
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                          ETHEREUM ⇄ SOLANA DUAL-BRIDGE
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                          KMS ENCLAVE ACTIVE
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                          STIPULATED RATE: 1 DEPO = $10,000 USD
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                        Trigger secure cross-chain bridge transactions to move DEPO subledger tokens ($10,000 USD per 1 DEPO) hosted on private server nodes to any target wallet address on either Ethereum (EVM) or Solana (SPL) with cryptographic attestation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Source Node Balance</span>
                      <strong className="text-emerald-400 font-bold text-sm">1,500,000 DEPO</strong>
                      <span className="text-[9px] text-amber-300 font-bold block">($15,000,000,000 USD)</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Relayer Status</span>
                      <span className="text-amber-400 font-bold text-xs flex items-center space-x-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Connected (10.142.3.153)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-flight RPC Connection & Gas Readiness Banner */}
              <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-2xl p-4 text-white font-mono text-xs shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                    <Activity className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">Pre-Tx Connection Readiness:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        rpcDiagResults?.overallStatus === 'READY_TO_TRANSACT'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {rpcDiagResults?.overallStatus || 'CHECK_REQUIRED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      RPC: <strong className="text-blue-300">{rpcDiagResults?.rpcEndpoint || rpcEndpointInput}</strong> ({rpcDiagResults?.latencyMs || 16}ms) | Gas Balance: <strong className="text-emerald-300">{rpcDiagResults?.gasBalance || '1.425 ETH'}</strong> | Bytecode: <strong className="text-emerald-300">{rpcDiagResults?.bytecodeVerified ? 'VERIFIED ON-CHAIN' : 'CHECKING'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunRpcDiagnostic}
                    disabled={isDiagnosingRpc}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isDiagnosingRpc ? 'animate-spin' : ''}`} />
                    <span>{isDiagnosingRpc ? 'Testing...' : 'Verify RPC'}</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('rpc_diagnostics')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center space-x-1"
                  >
                    <span>Full Diagnostic Suite</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Grid: Bridge Interface Controls & Pipeline Output */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (7 cols): Cross-Chain Bridge Control Form */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5 shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <ArrowRightLeft className="h-5 w-5 text-amber-400" />
                      <h4 className="font-bold text-base">Cross-Chain Token Dispatch Parameters</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Enclave Bridge v2.4</span>
                  </div>

                  {/* 1. Source Server Node Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <Server className="h-3.5 w-3.5 text-amber-400" />
                        <span>1. Select Source Server-Hosted Node</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">Subledger Available</span>
                    </label>

                    <div className="relative">
                      <select
                        value={transferSourceNodeIp}
                        onChange={(e) => setTransferSourceNodeIp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono font-bold text-white text-xs focus:border-amber-500 focus:outline-none appearance-none"
                      >
                        <option value="10.142.3.153">DEPO-Vault-Subledger-Node-1 (10.142.3.153) - Balance: 1,500,000 DEPO</option>
                        <option value="10.142.0.12">Alpha-Edge-Gateway (10.142.0.12) - Balance: 750,000 DEPO</option>
                        <option value="10.142.0.45">Neural-Vector-Store (10.142.0.45) - Balance: 420,000 DEPO</option>
                        <option value="10.142.1.88">Automation-Worker (10.142.1.88) - Balance: 280,000 DEPO</option>
                        {servers.map(s => (
                          <option key={s.id} value={s.ipAddress}>
                            {s.name} ({s.ipAddress}) - Balance: 500,000 DEPO
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-xs">▼</div>
                    </div>
                  </div>

                  {/* 2. Token & Target Blockchain Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Token Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        2. Token Asset
                      </label>
                      <select
                        value={transferSymbol}
                        onChange={(e) => setTransferSymbol(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-bold text-white text-xs focus:border-amber-500 focus:outline-none"
                      >
                        <option value="DEPO">$DEPO (Subnet USD Credit Token)</option>
                        <option value="sSOL">$sSOL (Subnet Wrapped Solana)</option>
                        <option value="sBTC">$sBTC (Subnet Wrapped Bitcoin)</option>
                        <option value="USDT">$USDT (Tether USD Credit)</option>
                      </select>
                    </div>

                    {/* Target Blockchain Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        3. Target Blockchain
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTransferTargetChain('EVM');
                            if (!transferDestinationWallet.startsWith('0x')) {
                              setTransferDestinationWallet('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                            transferTargetChain === 'EVM'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="font-extrabold text-xs">Ethereum (EVM)</span>
                          <span className="text-[9px] text-slate-400 font-mono">0x Address</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setTransferTargetChain('Solana');
                            if (transferDestinationWallet.startsWith('0x')) {
                              setTransferDestinationWallet('ATA_sSOL_Alpha_Gateway_99120');
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                            transferTargetChain === 'Solana'
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="font-extrabold text-xs">Solana (SPL)</span>
                          <span className="text-[9px] text-slate-400 font-mono">Base58 ATA</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Destination Target Wallet Input & Quick Presets */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                        <span>4. Target Destination Wallet Address</span>
                      </label>

                      <div className="flex space-x-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => {
                            setTransferTargetChain('EVM');
                            setTransferDestinationWallet('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-mono font-bold"
                        >
                          Sample EVM 0x
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTransferTargetChain('Solana');
                            setTransferDestinationWallet('ATA_sSOL_Alpha_Gateway_99120');
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded font-mono font-bold"
                        >
                          Sample Solana ATA
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={transferDestinationWallet}
                        onChange={(e) => setTransferDestinationWallet(e.target.value)}
                        placeholder={transferTargetChain === 'EVM' ? '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' : 'ATA_sSOL_Alpha_Gateway_99120'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono font-bold text-emerald-400 text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-500 uppercase font-bold">
                        {transferTargetChain === 'EVM' ? 'EVM Checksum' : 'SPL Associated Account'}
                      </span>
                    </div>
                  </div>

                  {/* 4. Amount & Percentage Pickers */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        5. Transfer Amount ({transferSymbol})
                      </label>

                      <div className="flex space-x-1">
                        {[500, 1000, 2500, 10000].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setTransferAmount(amt)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono font-bold"
                          >
                            {amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono font-bold text-amber-300 text-sm focus:border-amber-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">
                        ${transferSymbol}
                      </span>
                    </div>
                  </div>

                  {/* Transfer Summary Breakdown */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Stipulated Rate:</span>
                      <strong className="text-amber-300 font-bold">1 DEPO = $10,000 USD</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Est. Total Valuation (USD):</span>
                      <strong className="text-emerald-400 font-bold">${(transferAmount * 10000).toLocaleString()} USD</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Subledger Source Node:</span>
                      <strong className="text-slate-200">{transferSourceNodeIp}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Base Transaction Price Costing:</span>
                      <strong className="text-emerald-400 font-bold">1 DEPO ($10,000.00 USD)</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated On-Chain Confirmation:</span>
                      <strong className="text-amber-300">{transferTargetChain === 'Solana' ? '~1.2s (Sub-second SPL)' : '~12s (EVM Finality)'}</strong>
                    </div>
                  </div>

                  {/* Trigger Bridge Transfer Button */}
                  <button
                    onClick={handleTransferToExternalWallet}
                    disabled={isTransferringWallet}
                    className="w-full py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2.5 uppercase tracking-wide"
                  >
                    <Send className={`h-4 w-4 ${isTransferringWallet ? 'animate-spin' : ''}`} />
                    <span>
                      {isTransferringWallet 
                        ? `Bridging Step ${bridgeStep}/4 in Progress...` 
                        : `Trigger Cross-Chain Bridge Transaction to ${transferTargetChain}`}
                    </span>
                  </button>
                </div>

                {/* Right Column (5 cols): Live Bridge Pipeline Status & Receipt */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* Pipeline Status Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Cpu className="h-4 w-4 text-emerald-400" />
                        <h4 className="font-bold text-sm">Bridge Verification Pipeline</h4>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {bridgeStep === 4 ? '✓ SETTLED' : bridgeStep > 0 ? `Step ${bridgeStep}/4` : 'READY'}
                      </span>
                    </div>

                    {/* Stage Steps */}
                    <div className="space-y-2.5 font-mono text-xs">
                      <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        bridgeStep >= 1 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}>
                        <span className="flex items-center space-x-2">
                          <span className="font-bold">1. KMS Enclave Attestation</span>
                        </span>
                        {bridgeStep >= 1 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      </div>

                      <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        bridgeStep >= 2 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}>
                        <span className="flex items-center space-x-2">
                          <span className="font-bold">2. Subledger Token Locking</span>
                        </span>
                        {bridgeStep >= 2 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      </div>

                      <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        bridgeStep >= 3 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}>
                        <span className="flex items-center space-x-2">
                          <span className="font-bold">3. Cross-Chain Relay Broadcast</span>
                        </span>
                        {bridgeStep >= 3 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      </div>

                      <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        bridgeStep >= 4 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}>
                        <span className="flex items-center space-x-2">
                          <span>4. Target Wallet On-Chain Receipt</span>
                        </span>
                        {bridgeStep >= 4 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      </div>
                    </div>

                    {/* Receipt Output if Available */}
                    {lastTransferReceipt && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 text-xs font-mono space-y-2.5 shadow-inner">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-emerald-400 font-bold uppercase text-[10px]">On-Chain Receipt Confirmed</span>
                          <span className="text-slate-400 text-[10px]">Block #{lastTransferReceipt.blockNumber}</span>
                        </div>

                        <div className="space-y-1 text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Asset:</span>
                            <strong className="text-amber-300">{lastTransferReceipt.amount} ${lastTransferReceipt.symbol}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Target Network:</span>
                            <strong className="text-purple-300">{lastTransferReceipt.targetBlockchain}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Recipient Address:</span>
                            <span className="text-emerald-400 truncate max-w-[180px]">{lastTransferReceipt.destinationWallet}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 truncate">
                            Tx Hash: <span className="text-slate-200 font-bold">{lastTransferReceipt.txHash}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <a
                            href={`https://${lastTransferReceipt.targetBlockchain.toLowerCase().includes('solana') ? 'solscan.io' : 'etherscan.io'}/tx/${lastTransferReceipt.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] rounded-lg border border-slate-700 flex items-center justify-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{lastTransferReceipt.targetBlockchain.includes('Solana') ? 'Solscan' : 'Etherscan'}</span>
                          </a>

                          <a
                            href={`https://${lastTransferReceipt.targetBlockchain.toLowerCase().includes('solana') ? 'opensea.io' : 'testnets.opensea.io'}/assets/${lastTransferReceipt.targetBlockchain.toLowerCase().includes('solana') ? 'solana' : 'sepolia'}/${lastTransferReceipt.destinationWallet}/1`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-bold text-[10px] rounded-lg border border-blue-500/40 flex items-center justify-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3 text-blue-400" />
                            <span>OpenSea Meta</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Relayer Activity Stream */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 font-mono shadow-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block border-b border-slate-800 pb-1.5">
                      Live Relayer Daemon Logs
                    </span>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 h-36 overflow-y-auto space-y-1 text-[11px] text-emerald-400">
                      {bridgeLogs.map((log, idx) => (
                        <div key={idx} className="leading-tight">{log}</div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Historical Bridge Transfers Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 font-mono shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-amber-400" />
                    <h4 className="font-bold text-sm">Recent Server-Node Cross-Chain Bridge History</h4>
                  </div>
                  <span className="text-[10px] text-slate-400">All Nodes Monitored</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                        <th className="p-2">Timestamp</th>
                        <th className="p-2">Source Server Node</th>
                        <th className="p-2">Asset</th>
                        <th className="p-2">Target Network</th>
                        <th className="p-2">Recipient Wallet</th>
                        <th className="p-2">Tx Hash</th>
                        <th className="p-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-2 text-slate-400 text-[11px]">Just now</td>
                        <td className="p-2 font-bold text-slate-300">10.142.3.153</td>
                        <td className="p-2 font-bold text-amber-300">2,500 DEPO</td>
                        <td className="p-2 text-purple-300">Ethereum EVM</td>
                        <td className="p-2 text-emerald-400 font-bold truncate max-w-[140px]">0x70997970C51812dc3A010C7d01b50e0d17dc79C8</td>
                        <td className="p-2 text-slate-400 truncate max-w-[120px]">0x7a89b012...</td>
                        <td className="p-2 text-right">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                            SETTLED
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-2 text-slate-400 text-[11px]">12 mins ago</td>
                        <td className="p-2 font-bold text-slate-300">10.142.0.12</td>
                        <td className="p-2 font-bold text-amber-300">1,500 DEPO</td>
                        <td className="p-2 text-purple-300">Solana SPL</td>
                        <td className="p-2 text-emerald-400 font-bold truncate max-w-[140px]">ATA_sSOL_Alpha_Gateway_99120</td>
                        <td className="p-2 text-slate-400 truncate max-w-[120px]">sol_tx_991a...</td>
                        <td className="p-2 text-right">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                            SETTLED
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-2 text-slate-400 text-[11px]">45 mins ago</td>
                        <td className="p-2 font-bold text-slate-300">10.142.0.45</td>
                        <td className="p-2 font-bold text-amber-300">10,000 DEPO</td>
                        <td className="p-2 text-purple-300">Ethereum EVM</td>
                        <td className="p-2 text-emerald-400 font-bold truncate max-w-[140px]">0x3B9c02d18471eA284094C991f851A07b538f9021</td>
                        <td className="p-2 text-slate-400 truncate max-w-[120px]">0x99201f...</td>
                        <td className="p-2 text-right">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                            SETTLED
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SECTION: Hosted Coin Deployer & Payment Gateway API Hub */}
          {activeSection === 'payment_gateway' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white shadow-md">
                      <Coins className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-extrabold tracking-tight text-white">
                          Hosted Coin Deployer & Cross-Chain Payment Gateway API
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                          EVM + SOL + BTC SETTLEMENT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Deploy hosted coins on server nodes, dispatch tokens to external wallet addresses, and process automated crypto checkout invoices with merchant auto-payout.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="text-slate-400 font-bold">Active Hosted Tokens:</span>
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg font-bold">
                      {hostedTokens.length} Tokens
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid 1: Coin Deployer & External Wallet Dispatcher */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Panel 1: Deploy Hosted Coin to Server Node */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-lg">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4 text-emerald-400" />
                      <h4 className="font-bold text-sm">Deploy New Hosted Coin to Server Node</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Subnet Server Host</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Coin Name</label>
                      <input
                        type="text"
                        value={newCoinName}
                        onChange={(e) => setNewCoinName(e.target.value)}
                        placeholder="e.g. DEPO Subnet Credit"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Coin Symbol</label>
                      <input
                        type="text"
                        value={newCoinSymbol}
                        onChange={(e) => setNewCoinSymbol(e.target.value)}
                        placeholder="e.g. DEPO"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs uppercase focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Standard</label>
                      <select
                        value={newCoinStandard}
                        onChange={(e) => setNewCoinStandard(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs focus:outline-none"
                      >
                        <option value="ERC-20">ERC-20 (EVM)</option>
                        <option value="SPL">SPL (Solana)</option>
                        <option value="BRC-20">BRC-20 (Bitcoin)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total Supply</label>
                      <input
                        type="number"
                        value={newCoinSupply}
                        onChange={(e) => setNewCoinSupply(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Server Host IP</label>
                      <select
                        value={newCoinNodeIp}
                        onChange={(e) => setNewCoinNodeIp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs font-mono focus:outline-none"
                      >
                        <option value="10.142.0.12">Alpha-Edge (10.142.0.12)</option>
                        <option value="10.142.0.45">Neural-Vector (10.142.0.45)</option>
                        <option value="10.142.1.88">Automation-Worker (10.142.1.88)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleDeployHostedCoin}
                    disabled={isDeployingCoin}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isDeployingCoin ? 'Deploying Coin to Server...' : 'Deploy Hosted Coin'}</span>
                  </button>
                </div>

                {/* Panel 2: Cross-Chain Wallet Dispatcher (Transfer to Any External Wallet) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-lg">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4 text-amber-400" />
                      <h4 className="font-bold text-sm">Dispatch Hosted Coin to External Wallet</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-mono font-bold">
                      BOTH BLOCKCHAINS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Select Coin</label>
                      <select
                        value={transferSymbol}
                        onChange={(e) => setTransferSymbol(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs focus:outline-none"
                      >
                        {hostedTokens.map(t => (
                          <option key={t.tokenId} value={t.symbol}>
                            ${t.symbol} - {t.name} ({t.standard})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Target Blockchain</label>
                      <select
                        value={transferTargetChain}
                        onChange={(e) => setTransferTargetChain(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs focus:outline-none"
                      >
                        <option value="EVM">EVM / DEPO Subnet (Ethereum)</option>
                        <option value="Solana">Solana SPL (Ed25519 ATA)</option>
                        <option value="Bitcoin">Bitcoin (BRC-20 / UTXO / SegWit)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Destination Wallet Address</label>
                    <input
                      type="text"
                      value={transferDestinationWallet}
                      onChange={(e) => setTransferDestinationWallet(e.target.value)}
                      placeholder="e.g. 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 or Base58 ATA or bc1p..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-emerald-400 text-xs font-bold focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Dispatch Amount</label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Source Server Node</label>
                      <select
                        value={transferSourceNodeIp}
                        onChange={(e) => setTransferSourceNodeIp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs font-mono focus:outline-none"
                      >
                        <option value="10.142.0.12">10.142.0.12 (Alpha-Edge-Gateway)</option>
                        <option value="10.142.0.45">10.142.0.45 (Neural-Vector-Store)</option>
                        <option value="10.142.1.88">10.142.1.88 (Automation-Worker)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleTransferToExternalWallet}
                    disabled={isTransferringWallet}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isTransferringWallet ? 'Executing On-Chain Transfer...' : 'Deploy & Transfer Coin to External Wallet'}</span>
                  </button>

                  {/* Last Receipt Box */}
                  {lastTransferReceipt && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 text-xs font-mono space-y-1.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-emerald-400 uppercase">On-Chain Transaction Confirmed</span>
                        <span>Block #{lastTransferReceipt.blockNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-200">
                        Dispatched <strong className="text-amber-400">{lastTransferReceipt.amount} ${lastTransferReceipt.symbol}</strong> to <code className="text-emerald-400">{lastTransferReceipt.destinationWallet}</code>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Tx Hash: <span className="text-slate-300 font-bold">{lastTransferReceipt.txHash}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid 2: Payment Gateway Checkout Studio */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Panel 3: Generate Payment Gateway Invoice */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-lg">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-emerald-400" />
                      <h4 className="font-bold text-sm">Create Crypto Payment Gateway Invoice</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Merchant API Endpoint</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Merchant Service Name</label>
                      <input
                        type="text"
                        value={pgMerchantName}
                        onChange={(e) => setPgMerchantName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Merchant External Wallet Address</label>
                      <input
                        type="text"
                        value={pgMerchantWallet}
                        onChange={(e) => setPgMerchantWallet(e.target.value)}
                        placeholder="0x... or Base58..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-emerald-400 text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Accepted Coin</label>
                      <select
                        value={pgAcceptedCoin}
                        onChange={(e) => setPgAcceptedCoin(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs focus:outline-none"
                      >
                        <option value="DEPO">$DEPO (Subnet USD Credit)</option>
                        <option value="sSOL">$sSOL (Subnet Wrapped Solana)</option>
                        <option value="sBTC">$sBTC (Subnet Wrapped BTC)</option>
                        <option value="USDT">$USDT (Tether USD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Invoice Amount</label>
                      <input
                        type="number"
                        value={pgAmount}
                        onChange={(e) => setPgAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Network</label>
                      <select
                        value={pgNetwork}
                        onChange={(e) => setPgNetwork(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs focus:outline-none"
                      >
                        <option value="EVM / DEPO Subnet">EVM / DEPO Subnet</option>
                        <option value="Solana SPL">Solana SPL</option>
                        <option value="Bitcoin Mainnet">Bitcoin Mainnet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Item / Order Description</label>
                    <input
                      type="text"
                      value={pgDescription}
                      onChange={(e) => setPgDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleCreatePaymentInvoice}
                    disabled={isCreatingInvoice}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <span>{isCreatingInvoice ? 'Generating Invoice API...' : 'Generate Payment Invoice API'}</span>
                  </button>
                </div>

                {/* Panel 4: Live Payment Gateway Checkout Simulator */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-lg font-mono">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-purple-400" />
                      <h4 className="font-bold text-sm">Payment Gateway Checkout Simulator</h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">Auto-Settlement Active</span>
                  </div>

                  {selectedInvoiceForCheckout ? (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Invoice #{selectedInvoiceForCheckout.invoiceId}</span>
                          <h5 className="text-sm font-bold text-white">{selectedInvoiceForCheckout.description}</h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          selectedInvoiceForCheckout.status === 'SETTLED' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        }`}>
                          {selectedInvoiceForCheckout.status}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Payable:</span>
                          <strong className="text-amber-400 text-sm">{selectedInvoiceForCheckout.amount} ${selectedInvoiceForCheckout.acceptedCoinSymbol}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Merchant Destination Wallet:</span>
                          <span className="text-emerald-400 truncate max-w-[200px]">{selectedInvoiceForCheckout.merchantAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Payment Gateway Address:</span>
                          <span className="text-slate-200 truncate max-w-[200px]">{selectedInvoiceForCheckout.paymentAddress}</span>
                        </div>
                      </div>

                      {selectedInvoiceForCheckout.status === 'SETTLED' ? (
                        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs space-y-1">
                          <div className="font-bold flex items-center space-x-1">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Payment Confirmed & Auto-Forwarded!</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Forward Tx: {selectedInvoiceForCheckout.txHash}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleProcessPayment(selectedInvoiceForCheckout.invoiceId)}
                          disabled={isProcessingPayment}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-md"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{isProcessingPayment ? 'Verifying & Forwarding Payment...' : 'Simulate Customer Payment'}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No invoices created yet. Click 'Generate Payment Invoice API' to simulate.
                    </div>
                  )}

                  {/* Existing Invoices List Selector */}
                  {invoicesList.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Invoices Queue ({invoicesList.length})</span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {invoicesList.map(inv => (
                          <button
                            key={inv.invoiceId}
                            onClick={() => setSelectedInvoiceForCheckout(inv)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                              selectedInvoiceForCheckout?.invoiceId === inv.invoiceId 
                                ? 'bg-slate-800 text-white border-emerald-500' 
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            #{inv.invoiceId} ({inv.amount} ${inv.acceptedCoinSymbol})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid 3: Developer API Code Snippets */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 font-mono shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Code2 className="h-4 w-4 text-emerald-400" />
                    <h4 className="font-bold text-sm">Developer Payment Gateway Integration API Snippets</h4>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs">
                    <button
                      onClick={() => setApiSnippetLang('nodejs')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${apiSnippetLang === 'nodejs' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Node.js
                    </button>
                    <button
                      onClick={() => setApiSnippetLang('curl')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${apiSnippetLang === 'curl' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      cURL
                    </button>
                    <button
                      onClick={() => setApiSnippetLang('python')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${apiSnippetLang === 'python' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Python
                    </button>
                    <button
                      onClick={() => setApiSnippetLang('react')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${apiSnippetLang === 'react' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      React
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto text-xs text-emerald-400">
                  <pre className="font-mono">
                    {apiSnippetLang === 'nodejs' && `// Node.js Express Payment Gateway & Coin Transfer API
import axios from 'axios';

// 1. Create Checkout Invoice
const createInvoice = async () => {
  const res = await axios.post('/api/payment-gateway/create-invoice', {
    merchantName: '${pgMerchantName}',
    merchantAddress: '${pgMerchantWallet}',
    acceptedCoinSymbol: '${pgAcceptedCoin}',
    blockchainNetwork: '${pgNetwork}',
    amount: ${pgAmount},
    description: '${pgDescription}',
    webhookUrl: '${pgWebhook}'
  });
  console.log('Payment Address:', res.data.invoice.paymentAddress);
};

// 2. Dispatch Hosted Coin to External Wallet Address
const dispatchToken = async () => {
  const res = await axios.post('/api/blockchain/transfer-to-wallet', {
    symbol: '${transferSymbol}',
    amount: ${transferAmount},
    sourceNodeIp: '${transferSourceNodeIp}',
    destinationWallet: '${transferDestinationWallet}',
    targetBlockchain: '${transferTargetChain}'
  });
  console.log('Tx Hash:', res.data.txHash);
};`}

                    {apiSnippetLang === 'curl' && `# cURL Create Payment Invoice API
curl -X POST http://localhost:3000/api/payment-gateway/create-invoice \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchantName": "${pgMerchantName}",
    "merchantAddress": "${pgMerchantWallet}",
    "acceptedCoinSymbol": "${pgAcceptedCoin}",
    "amount": ${pgAmount},
    "description": "${pgDescription}"
  }'

# cURL Cross-Chain Coin Transfer API to External Wallet Address
curl -X POST http://localhost:3000/api/blockchain/transfer-to-wallet \\
  -H "Content-Type: application/json" \\
  -d '{
    "symbol": "${transferSymbol}",
    "amount": ${transferAmount},
    "destinationWallet": "${transferDestinationWallet}",
    "targetBlockchain": "${transferTargetChain}"
  }'`}

                    {apiSnippetLang === 'python' && `# Python Subnet Payment Gateway Client
import requests

# Create Payment Invoice
response = requests.post("http://localhost:3000/api/payment-gateway/create-invoice", json={
    "merchantName": "${pgMerchantName}",
    "merchantAddress": "${pgMerchantWallet}",
    "acceptedCoinSymbol": "${pgAcceptedCoin}",
    "amount": ${pgAmount},
    "description": "${pgDescription}"
})

print("Invoice Details:", response.json()["invoice"])`}

                    {apiSnippetLang === 'react' && `// React Hook Integration
import { useState } from 'react';

export function usePaymentGateway() {
  const createPaymentInvoice = async (params) => {
    const res = await fetch('/api/payment-gateway/create-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  };

  return { createPaymentInvoice };
}`}
                  </pre>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 0: 4-Phase Token Launch Architecture & Vector DB Engine */}
          {activeSection === 'token_launch' && (
            <div className="space-y-6">
              
              {/* Quick Actions & Diagnostic Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl">
                      <Zap className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
                        <span>Applicative 5-Phase Token Launch Engine</span>
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
                          Production Standard
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Smart contract compilation, CREATE2 deterministic deployment, vector DB server hosting, and live wallet synchronizer
                      </p>
                    </div>
                  </div>

                  {/* Applicative Quick Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      id="btn-ping-node-12"
                      onClick={() => handlePingNode("10.142.0.12")}
                      disabled={pingingNode}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono text-xs font-bold rounded-xl border border-amber-500/30 transition-all shadow-xs"
                    >
                      <Activity className={`h-3.5 w-3.5 ${pingingNode ? 'animate-spin' : ''}`} />
                      <span>⚡ Ping 10.142.0.12</span>
                    </button>

                    <button
                      id="btn-gen-vector-db"
                      onClick={handleGenVectorDbNode}
                      disabled={generatingVectorDb}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-red-500/30 transition-all"
                    >
                      <Database className={`h-3.5 w-3.5 ${generatingVectorDb ? 'animate-spin' : ''}`} />
                      <span>+ Gen Vector DB Server</span>
                    </button>
                  </div>
                </div>

                {/* Ping Diagnostic Output & Vector DB Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs font-mono">
                  
                  {/* Ping Result */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">ICMP Ping Probe Status</span>
                      {pingResult ? (
                        <p className="text-emerald-400 font-bold text-xs mt-0.5">
                          64 bytes from {pingResult.targetIp}: time={pingResult.latencyMs}ms (TTL={pingResult.ttl})
                        </p>
                      ) : (
                        <p className="text-slate-500 text-xs italic mt-0.5">Click "⚡ Ping 10.142.0.12" to probe node latency</p>
                      )}
                    </div>
                    {pingResult && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        {pingResult.status}
                      </span>
                    )}
                  </div>

                  {/* Vector DB Status */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Gen Vector DB Node (Qdrant)</span>
                      {vectorDbNode ? (
                        <p className="text-purple-400 font-bold text-xs mt-0.5">
                          {vectorDbNode.name} @ {vectorDbNode.ipAddress}:6333 (Active)
                        </p>
                      ) : (
                        <p className="text-slate-500 text-xs italic mt-0.5">Click "+ Gen Vector DB Server" to provision</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vectorDbNode ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {vectorDbNode ? 'PROVISIONED' : 'READY'}
                    </span>
                  </div>

                </div>
              </div>

              {/* Grid of 5 Lifecycle Phases */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* PHASE 1: Infrastructure & Parameter Initialization */}
                <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-red-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold font-mono text-xs">Phase 1</span>
                      <h4 className="text-xs font-bold text-slate-900">Environment & Parameter Initialization</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">JSON Schema Standard</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Blockchain Network</label>
                        <select
                          value={tokenNetwork}
                          onChange={(e) => setTokenNetwork(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-xs focus:ring-1 focus:ring-red-500"
                        >
                          <option value="Ethereum Mainnet">Ethereum Mainnet (EVM)</option>
                          <option value="Polygon Pos">Polygon PoS (EVM)</option>
                          <option value="BNB Smart Chain">BNB Smart Chain (EVM)</option>
                          <option value="Solana Mainnet-Beta">Solana Mainnet-Beta (SPL)</option>
                          <option value="Arbitrum One">Arbitrum One (EVM)</option>
                          <option value="Ethereum Sepolia">Ethereum Sepolia (Testnet)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Smart Contract Standard</label>
                        <select
                          value={tokenStandard}
                          onChange={(e) => setTokenStandard(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-xs focus:ring-1 focus:ring-red-500"
                        >
                          <option value="ERC-20">EVM ERC-20 Standard</option>
                          <option value="SPL">Solana SPL Token Program</option>
                          <option value="CW20">Cosmos / CW20 Wasm</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Token Name</label>
                        <input
                          type="text"
                          value={tokenNameInput}
                          onChange={(e) => setTokenNameInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Symbol / Ticker</label>
                        <input
                          type="text"
                          value={tokenSymbolInput}
                          onChange={(e) => setTokenSymbolInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Decimals</label>
                        <input
                          type="number"
                          value={tokenDecimalsInput}
                          onChange={(e) => setTokenDecimalsInput(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Initial Supply</label>
                        <input
                          type="number"
                          value={tokenSupplyInput}
                          onChange={(e) => setTokenSupplyInput(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Security Modifiers Toggles */}
                    <div className="flex items-center space-x-3 pt-1 text-[11px] font-bold text-slate-700">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">✓ OpenZeppelin Ownable</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">✓ Pausable</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">✓ ReentrancyGuard</span>
                    </div>

                    {/* Master JSON Schema Preview */}
                    <details className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-emerald-400 font-mono">
                      <summary className="cursor-pointer font-bold text-slate-300 hover:text-white flex items-center justify-between">
                        <span>View Phase 1 Algorithm JSON Schema Spec</span>
                        <span className="text-slate-500 text-[9px]">[Expand]</span>
                      </summary>
                      <pre className="mt-2 text-[10px] overflow-x-auto text-slate-300">
{JSON.stringify({
  network: { name: tokenNetwork, chainId: tokenNetwork.includes("Ethereum") ? 1 : 137 },
  tokenSpec: { name: tokenNameInput, symbol: tokenSymbolInput, decimals: tokenDecimalsInput, totalSupply: tokenSupplyInput, isMintable: true, isBurnable: true, isPausable: true },
  wallets: { deployer: "0x71C7...9A2", treasury: "0x992B...F14" },
  infrastructure: { nodeIp: "10.142.0.12", service: "qdrant_vector_indexer" }
}, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>

                {/* PHASE 2: Contract Compilation & CREATE2 Deployment */}
                <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-red-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold font-mono text-xs">Phase 2</span>
                      <h4 className="text-xs font-bold text-slate-900">Deterministic CREATE2 Smart Contract Deployment</h4>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Compiler Ready</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                      <p className="flex justify-between text-slate-600">
                        <span>Compiler Version:</span>
                        <span className="font-bold text-slate-900">solc v0.8.24 + Optimizer (200 runs)</span>
                      </p>
                      <p className="flex justify-between text-slate-600">
                        <span>Salt Hash Derivation:</span>
                        <span className="font-bold text-slate-900">0x42f8910a3c9e... (CREATE2)</span>
                      </p>
                      <p className="flex justify-between text-slate-600">
                        <span>Host Node Gateway:</span>
                        <span className="font-bold text-red-600">10.142.0.12 (Vector DB / RPC)</span>
                      </p>
                    </div>

                    <button
                      id="btn-deploy-smart-contract"
                      onClick={handleDeployTokenContract}
                      disabled={deployingContract}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Key className={`h-4 w-4 ${deployingContract ? 'animate-spin' : ''}`} />
                      <span>{deployingContract ? 'Compiling & Deploying via CREATE2...' : `Compile & Deploy $${tokenSymbolInput.toUpperCase()} Smart Contract`}</span>
                    </button>

                    {deployedContractInfo ? (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-mono space-y-2">
                        <div className="flex justify-between items-center text-emerald-800 font-bold">
                          <span>✓ CONTRACT DEPLOYED & VERIFIED</span>
                          <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded">Etherscan Verified</span>
                        </div>
                        <p className="text-[11px] text-slate-800 font-bold">Address: {deployedContractInfo.contractAddress}</p>
                        <p className="text-[10px] text-slate-500">Tx Hash: {deployedContractInfo.txHash}</p>

                        <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-blue-900 flex items-center space-x-1">
                            <span>🌊 OpenSea Marketplace Status:</span>
                            <span className="text-emerald-700">INDEXED</span>
                          </span>

                          <div className="flex space-x-1.5">
                            <a
                              href={`https://testnets.opensea.io/assets/sepolia/${deployedContractInfo.contractAddress}/1`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold flex items-center space-x-1 shadow-sm"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View on OpenSea</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic text-center">Click compile button above to trigger smart contract deployment</p>
                    )}
                  </div>
                </div>

                {/* PHASE 3: Wallet Indexing & Live Synchronizer */}
                <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-red-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold font-mono text-xs">Phase 3</span>
                      <h4 className="text-xs font-bold text-slate-900">Wallet Indexing & Live Address Synchronizer</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      Listener Active
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5">
                      <div className="flex justify-between items-center text-red-400 font-bold">
                        <span>Event Listener Filter Topic:</span>
                        <span className="text-emerald-400">Transfer(address,address,uint256)</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">
                        Microservice `10.142.0.12` streaming block logs via gRPC WebSocket Gateway to update wallet address balances in real time.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={trackedWalletAddress}
                        onChange={(e) => setTrackedWalletAddress(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        placeholder="Tracked Wallet Address"
                      />
                      <span className="px-3 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300 flex items-center space-x-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Sync Live</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* PHASE 4 & 5: Wallet watchAsset Integration & Code Injunctions */}
                <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-red-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold font-mono text-xs">Phase 4 & 5</span>
                      <h4 className="text-xs font-bold text-slate-900">dApp wallet_watchAsset & Automated Injunctions</h4>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">EIP-747 Ready</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="text-slate-600 text-[11px]">
                      Execute automated code injunctions to mint initial supply, create DEX liquidity pools, and dispatch webhooks.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => handleExecuteLaunchInjunction("BATCH_MINT_DISTRIBUTE")}
                        disabled={executingInjunction}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-all text-center"
                      >
                        1. Batch Mint & Distribute
                      </button>

                      <button
                        onClick={() => handleExecuteLaunchInjunction("CREATE_DEX_LIQUIDITY")}
                        disabled={executingInjunction}
                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-all text-center"
                      >
                        2. Uniswap V3 Liquidity
                      </button>

                      <button
                        onClick={() => handleExecuteLaunchInjunction("ADDRESS_WATCHER_HOOK")}
                        disabled={executingInjunction}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all text-center"
                      >
                        3. Deploy Address Watcher
                      </button>
                    </div>

                    {/* wallet_watchAsset Prompt Spec */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-[10px]">
                      <span className="text-slate-700 font-bold block">MetaMask wallet_watchAsset (EIP-747) Integration Code:</span>
                      <p className="text-purple-700 font-semibold">
                        await window.ethereum.request({'{'} method: 'wallet_watchAsset', params: {'{'} type: '{tokenStandard}', options: {'{'} address: '{deployedContractInfo?.contractAddress || '0x71C...'}', symbol: '{tokenSymbolInput}', decimals: {tokenDecimalsInput} {'}'} {'}'} {'}'});
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* LIVE DEX TRADING CHART & ORDERBOOK */}
              <LiveTradingChart />

              {/* LIVE TRADING APPS & SERVER INJUNCTIONS SUITE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
                      <Bot className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <span>Live Trading Apps & Strategy Bots Hub</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                          3 Active Bots
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Hosted liquidity managers, vector arbitrage engines, and live server injunctions running on node 10.142.0.12
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleExecuteLaunchInjunction("DYNAMIC_REINJUNCTION")}
                      disabled={executingInjunction}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Dynamic Re-Injunction</span>
                    </button>

                    <button
                      onClick={() => handleExecuteLaunchInjunction("EMERGENCY_KILL_SWITCH")}
                      disabled={executingInjunction}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Emergency Kill Switch</span>
                    </button>
                  </div>
                </div>

                {/* Trading Bots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Bot 1 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">Bot-Alpha-EVM-Arbitrage</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Uniswap v3 / SushiSwap</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold">
                        ACTIVE (1.2ms)
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">24h Volume:</span>
                        <span className="font-bold text-emerald-400">$1,420,850</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Net Profit:</span>
                        <span className="font-bold text-amber-400">+14.28 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Node IP:</span>
                        <span className="text-slate-300">10.142.0.12:8080</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecuteLaunchInjunction("REBALANCE_BOT_ALPHA")}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg transition-all"
                    >
                      Rebalance Liquidity Pools
                    </button>
                  </div>

                  {/* Bot 2 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">Bot-Beta-Solana-MM</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Raydium / Orca SPL</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold">
                        ACTIVE (0.8ms)
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">24h Trades:</span>
                        <span className="font-bold text-emerald-400">8,412 ops</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Net Profit:</span>
                        <span className="font-bold text-purple-400">+382.4 SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Node IP:</span>
                        <span className="text-slate-300">10.142.0.12:9090</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecuteLaunchInjunction("ADJUST_SLIPPAGE_BETA")}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg transition-all"
                    >
                      Adjust Max Slippage (0.1%)
                    </button>
                  </div>

                  {/* Bot 3 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">Bot-Gamma-Vector-Sniper</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Qdrant Embeddings DB</span>
                      </div>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-[9px] font-bold">
                        VECTOR DB SYNC
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vector Index:</span>
                        <span className="font-bold text-purple-400">1,500,000 Embeds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">HNSW Accuracy:</span>
                        <span className="font-bold text-emerald-400">99.84%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Port Gateway:</span>
                        <span className="text-slate-300">10.142.0.12:6333</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGenVectorDbNode()}
                      className="w-full py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[10px] font-bold rounded-lg transition-all"
                    >
                      Re-index HNSW Embeddings
                    </button>
                  </div>

                </div>

                {/* Instant ABI Read/Write Interaction Panel */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                      <Code2 className="h-4 w-4" />
                      <span>Instant ABI Read / Write Contract Interaction Panel</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Target: {deployedContractInfo?.contractAddress || '0x71C7...9A2'}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Read Methods */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Read Functions</span>
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-300 font-bold">balanceOf(address owner)</span>
                          <button onClick={() => addLog(`READ balanceOf(0x71C7...9A2) => ${tokenSupplyInput} $${tokenSymbolInput}`)} className="px-2 py-0.5 bg-slate-800 text-amber-400 rounded hover:bg-slate-700">Query</button>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-300 font-bold">totalSupply()</span>
                          <button onClick={() => addLog(`READ totalSupply() => ${tokenSupplyInput} $${tokenSymbolInput}`)} className="px-2 py-0.5 bg-slate-800 text-amber-400 rounded hover:bg-slate-700">Query</button>
                        </div>
                      </div>
                    </div>

                    {/* Write Methods */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Write Injunction Functions</span>
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-300 font-bold">transfer(address to, uint256 amt)</span>
                          <button onClick={() => handleExecuteLaunchInjunction("WRITE_TRANSFER")} className="px-2 py-0.5 bg-red-600 text-white font-bold rounded hover:bg-red-700">Execute</button>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-300 font-bold">pause() / unpause()</span>
                          <button onClick={() => handleExecuteLaunchInjunction("WRITE_PAUSE")} className="px-2 py-0.5 bg-purple-600 text-white font-bold rounded hover:bg-purple-700">Toggle</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 1: Cryptographic Primitives Matrix */}
          {activeSection === 'matrix' && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="border-b border-red-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cryptographic Primitives Parity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Elliptic curves, signature verification schemes, and hardware-accelerated hashing engines
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  SIMD AVX-512 Active
                </span>
              </div>

              {/* Parity Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 text-xs font-sans">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Feature / Standard</th>
                      <th className="px-4 py-3 text-left">Bitcoin (BTC) Parity</th>
                      <th className="px-4 py-3 text-left">Solana (SOL) Parity</th>
                      <th className="px-4 py-3 text-left">Telemetry Subnet Requirement</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200 text-xs">
                    
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">Elliptic Curve</td>
                      <td className="px-4 py-3 font-mono text-amber-700 font-semibold">Secp256k1 (ECDSA)</td>
                      <td className="px-4 py-3 font-mono text-purple-700 font-semibold">Ed25519 (EdDSA)</td>
                      <td className="px-4 py-3 text-slate-600">Dual-curve verification engine (`libsecp256k1` + `ed25519-dalek`)</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleVerifyBatch('SECP256K1')}
                          disabled={verifyingSecp}
                          className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-bold hover:bg-amber-700"
                        >
                          {verifyingSecp ? 'Verifying...' : 'Test Secp256k1'}
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">Signature Schemes</td>
                      <td className="px-4 py-3 font-mono text-amber-700">Schnorr BIP-340 / ECDSA</td>
                      <td className="px-4 py-3 font-mono text-purple-700">Ed25519 Batch Verification</td>
                      <td className="px-4 py-3 text-slate-600">Batch signature verifier for multi-threaded telemetry packets</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleVerifyBatch('ED25519')}
                          disabled={verifyingEd}
                          className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[11px] font-bold hover:bg-purple-700"
                        >
                          {verifyingEd ? 'Verifying...' : 'Test Ed25519 Batch'}
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">Hashing Algorithms</td>
                      <td className="px-4 py-3 font-mono text-amber-700">SHA-256d / RIPEMD-160</td>
                      <td className="px-4 py-3 font-mono text-purple-700">SHA-256 / Blake3</td>
                      <td className="px-4 py-3 text-slate-600">Blake3 or SHA-256 hardware acceleration (AVX-512 / CUDA)</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Enabled</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">Proof & Clock State</td>
                      <td className="px-4 py-3 font-mono text-amber-700">Taproot BIP-341/342</td>
                      <td className="px-4 py-3 font-mono text-purple-700">Proof of History (PoH)</td>
                      <td className="px-4 py-3 text-slate-600">High-resolution tick clock sequence for telemetry ordering</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={handleGenerateTick}
                          disabled={generatingTick}
                          className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700"
                        >
                          Trigger Tick
                        </button>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Action Log Output */}
              <div className="p-4 bg-slate-950 rounded-xl border border-red-900/60 font-mono text-xs text-red-400 space-y-1">
                <div className="flex justify-between items-center border-b border-red-900/60 pb-2">
                  <span className="text-slate-200 font-bold flex items-center space-x-1.5">
                    <Terminal className="h-3.5 w-3.5 text-red-500" />
                    <span>Cryptographic Verification Output</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Live Hardware Stream</span>
                </div>
                <div className="h-28 overflow-y-auto space-y-1 text-[11px] text-slate-300 pt-1">
                  {actionLog.length === 0 ? (
                    <p className="text-slate-500 italic">[SYSTEM] Click verification test buttons above to run SIMD crypto checks...</p>
                  ) : (
                    actionLog.map((log, i) => (
                      <p key={i} className="text-emerald-400 font-mono">{log}</p>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 2: UTXO & SPL Virtual Machine State */}
          {activeSection === 'utxo_spl' && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="border-b border-red-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  UTXO & SPL State Virtual Machine Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Coexistence of Bitcoin UTXOs (Ordinals / BRC-20 / Runes) and Solana SPL Account Key-Value state
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* UTXO Column */}
                <div className="space-y-4 border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Box className="h-4 w-4 text-amber-600" />
                      <span>Bitcoin UTXO Output Indexer</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      {utxos.length} Outputs
                    </span>
                  </div>

                  {/* Mint Output Form */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block">Execute New UTXO Output</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={utxoValueSats}
                        onChange={(e) => setUtxoValueSats(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        placeholder="Satoshis (e.g. 500000)"
                      />
                      <input
                        type="text"
                        value={utxoAddress}
                        onChange={(e) => setUtxoAddress(e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        placeholder="Target Address"
                      />
                    </div>
                    <button
                      onClick={handleExecuteUtxo}
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs transition-colors"
                    >
                      Mint UTXO Output
                    </button>
                  </div>

                  {/* UTXO List */}
                  <div className="space-y-2">
                    {utxos.map((utxo) => (
                      <div key={utxo.txid} className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span className="text-amber-700">{utxo.type}</span>
                          <span>{utxo.valueSats.toLocaleString()} Sats</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">TxID: {utxo.txid}</p>
                        <p className="text-[10px] text-slate-600">Address: {utxo.address}</p>
                        {utxo.protocolData && (
                          <p className="text-[10px] text-purple-700 font-semibold bg-purple-50 p-1 rounded">
                            {utxo.protocolData}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SPL Account Column */}
                <div className="space-y-4 border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Coins className="h-4 w-4 text-purple-600" />
                      <span>Solana SPL Account State</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                      {splTokens.length} SPL Tokens
                    </span>
                  </div>

                  {/* Transfer Form */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block">SPL Associated Token Account (ATA) Transfer</span>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={selectedSplSymbol}
                        onChange={(e) => setSelectedSplSymbol(e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-xs"
                      >
                        <option value="SNT">SubNet Token ($SNT)</option>
                        <option value="sSOL">SubNet Solana ($sSOL)</option>
                      </select>
                      <input
                        type="number"
                        value={splTransferAmount}
                        onChange={(e) => setSplTransferAmount(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Amount"
                      />
                    </div>
                    <button
                      onClick={handleTransferSpl}
                      className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded text-xs transition-colors"
                    >
                      Execute ATA Transfer
                    </button>
                  </div>

                  {/* SPL List */}
                  <div className="space-y-2">
                    {splTokens.map((spl) => (
                      <div key={spl.mintAddress} className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span className="text-purple-700">{spl.tokenName} (${spl.tokenSymbol})</span>
                          <span className="text-emerald-600">{spl.balance.toLocaleString()} ${spl.tokenSymbol}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Mint: {spl.mintAddress.slice(0, 16)}...</p>
                        <p className="text-[10px] text-slate-600">ATA: {spl.associatedTokenAddress}</p>
                        <p className="text-[10px] text-slate-400">Hosted on: {spl.hostedOnServer}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 3: Hosted Coins & Tokens on Server Nodes */}
          {activeSection === 'tokens' && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-red-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Subnet Server Hosted Token Vaults
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographically embedded tokens and sub-ledger assets hosted directly on private server nodes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hostedTokens.map((tok) => (
                  <motion.div
                    key={tok.tokenId}
                    whileHover={{ scale: 1.02 }}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{tok.name}</h4>
                        <span className="font-mono text-xs font-bold text-red-600">${tok.symbol}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tok.standard === 'SPL' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tok.standard} Standard
                      </span>
                    </div>

                    <div className="text-xs font-mono space-y-1 text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      <p className="flex justify-between">
                        <span>Total Supply:</span>
                        <span className="font-bold text-slate-900">{tok.totalSupply.toLocaleString()}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Decimals:</span>
                        <span className="font-bold text-slate-900">{tok.decimals}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Holders:</span>
                        <span className="font-bold text-slate-900">{tok.holdersCount}</span>
                      </p>
                      <p className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Hosted Server IP:</span>
                        <span className="text-red-600 font-bold">{tok.hostedNodeIp}</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-mono">Contract: {tok.contractAddress.slice(0, 10)}...</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        HOSTED ACTIVE
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: Proof-of-Telemetry (PoH Derivative) Clock */}
          {activeSection === 'poh' && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-red-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Proof-of-Telemetry (PoT) Order Tick Sequence
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-resolution cryptographic SHA-256 hash sequence providing cryptographic proof of time for telemetry events
                  </p>
                </div>

                <button
                  onClick={handleGenerateTick}
                  disabled={generatingTick}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  {generatingTick ? 'Ticking...' : 'Generate Next PoH Tick'}
                </button>
              </div>

              <div className="space-y-3">
                {pohTicks.map((tick) => (
                  <div key={tick.tickIndex} className="p-4 bg-slate-950 text-slate-200 rounded-xl border border-red-900/60 font-mono text-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-900/60 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-red-900 text-red-200 font-bold text-xs">
                          TICK #{tick.tickIndex}
                        </span>
                        <span className="text-slate-400 text-[11px]">Slot: #{tick.slot}</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px]">{tick.leaderNode}</span>
                    </div>

                    <div className="flex justify-between items-center text-red-400">
                      <span>Hash Verification Vector:</span>
                      <span className="text-slate-200 font-bold">{tick.hash}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                      {tick.eventPayload}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: RPC Connection Diagnostic & Pre-Transaction Verification Utility */}
          {activeSection === 'rpc_diagnostics' && (
            <div className="space-y-6">
              
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 border border-blue-900/60 rounded-2xl p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
                      <Activity className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight text-white">
                          RPC Connection Diagnostic & Pre-Transaction Utility
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                          PRE-FLIGHT AUDIT
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                          BYTECODE & GAS VALIDATOR
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                        Comprehensive RPC infrastructure inspection tool. Verifies RPC node provider health, calculates deployer gas balance, and validates contract bytecode on-chain to prevent failed execution before submitting transactions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono bg-slate-900/90 p-3 rounded-xl border border-blue-900/50">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Pre-Tx Readiness</span>
                      <span className={`font-bold text-sm flex items-center space-x-1.5 ${
                        rpcDiagResults?.overallStatus === 'READY_TO_TRANSACT'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}>
                        <span className={`h-2.5 w-2.5 rounded-full ${rpcDiagResults?.overallStatus === 'READY_TO_TRANSACT' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
                        <span>{rpcDiagResults?.overallStatus || 'PENDING_AUDIT'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Form Controls & Diagnostic Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (5 cols): Diagnostic Parameter Form */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5 shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Sliders className="h-5 w-5 text-blue-400" />
                      <h4 className="font-bold text-base">RPC Probe Configuration</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">v2.4 Pre-Flight</span>
                  </div>

                  {/* RPC Provider Endpoint URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      1. RPC Provider Endpoint URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                      <input
                        type="text"
                        value={rpcEndpointInput}
                        onChange={(e) => setRpcEndpointInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 font-mono text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                        placeholder="https://rpc.sepolia.org"
                      />
                    </div>
                  </div>

                  {/* Target Blockchain Network */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      2. Target Blockchain Network
                    </label>
                    <select
                      value={rpcNetworkInput}
                      onChange={(e) => setRpcNetworkInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Ethereum Sepolia Testnet">Ethereum Sepolia Testnet (Chain ID 11155111)</option>
                      <option value="Ethereum Mainnet">Ethereum Mainnet (Chain ID 1)</option>
                      <option value="Solana Mainnet Beta">Solana Mainnet Beta (Cluster 101)</option>
                      <option value="Polygon Mainnet">Polygon Mainnet (Chain ID 137)</option>
                      <option value="Arbitrum One">Arbitrum One (Chain ID 42161)</option>
                      <option value="DEPO Subnet Node (10.142.0.12)">DEPO Subnet Private Enclave (10.142.0.12)</option>
                    </select>
                  </div>

                  {/* Deployer Wallet Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      3. Deployer Wallet Address (Gas Check)
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-3 h-4 w-4 text-amber-400" />
                      <input
                        type="text"
                        value={rpcDeployerWallet}
                        onChange={(e) => setRpcDeployerWallet(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                        placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                      />
                    </div>
                  </div>

                  {/* Target Contract Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      4. Contract Address (On-Chain Bytecode Check)
                    </label>
                    <div className="relative">
                      <Code2 className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                      <input
                        type="text"
                        value={rpcTargetContract}
                        onChange={(e) => setRpcTargetContract(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                        placeholder="0x71C765d7023812dc3A010C7d01b50e0d17dc79A2"
                      />
                    </div>
                  </div>

                  {/* Diagnostic Execution Action Buttons */}
                  <div className="pt-2 space-y-3">
                    <button
                      onClick={handleRunRpcDiagnostic}
                      disabled={isDiagnosingRpc}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center space-x-2"
                    >
                      <Activity className={`h-4 w-4 ${isDiagnosingRpc ? 'animate-spin' : ''}`} />
                      <span>{isDiagnosingRpc ? 'Probing RPC Provider & Bytecode...' : 'Run RPC Connection Diagnostic'}</span>
                    </button>

                    <button
                      onClick={handleTopUpGasFaucet}
                      disabled={isFundingFaucet}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <Flame className={`h-4 w-4 text-amber-400 ${isFundingFaucet ? 'animate-bounce' : ''}`} />
                      <span>{isFundingFaucet ? 'Funding Gas Faucet...' : 'Fund Deployer Testnet Gas (2.5 ETH Faucet)'}</span>
                    </button>
                  </div>

                </div>

                {/* Right Column (7 cols): Real-Time Diagnostic Results & Verification Cards */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Status Banner */}
                  <div className={`p-5 rounded-2xl border font-mono text-xs space-y-3 shadow-lg ${
                    rpcDiagResults?.overallStatus === 'READY_TO_TRANSACT'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : rpcDiagResults?.overallStatus === 'INSUFFICIENT_GAS'
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center space-x-2">
                        {rpcDiagResults?.overallStatus === 'READY_TO_TRANSACT' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <ShieldAlert className="h-5 w-5 text-amber-400" />
                        )}
                        <span className="font-bold text-sm uppercase tracking-wider text-white">
                          Pre-Transaction Validation Summary
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {rpcDiagResults?.timestamp ? new Date(rpcDiagResults.timestamp).toLocaleTimeString() : 'Live'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                      <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-400 block font-bold">RPC Latency</span>
                        <strong className="text-blue-400 text-sm">{rpcDiagResults?.latencyMs || 0} ms</strong>
                      </div>

                      <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-400 block font-bold">Gas Balance</span>
                        <strong className="text-emerald-400 text-sm">{rpcDiagResults?.gasBalance || '0 ETH'}</strong>
                      </div>

                      <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-400 block font-bold">On-Chain Code</span>
                        <strong className="text-purple-400 text-sm">{rpcDiagResults?.bytecodeVerified ? 'VERIFIED' : 'NOT FOUND'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Verification Step Cards */}
                  <div className="space-y-3">
                    
                    {/* Check 1: RPC Provider Health */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <h5 className="font-bold text-xs text-slate-200">Check 1: RPC Provider Status & Health</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          HEALTHY (Chain ID: {rpcDiagResults?.chainId})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {rpcDiagResults?.checks?.[0]?.details || 'Connected to RPC endpoint successfully.'}
                      </p>
                    </div>

                    {/* Check 2: Deployer Gas Balance */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wallet className="h-4 w-4 text-amber-400" />
                          <h5 className="font-bold text-xs text-slate-200">Check 2: Deployer Gas Balance</h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          rpcDiagResults?.checks?.[1]?.status === 'SUFFICIENT'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {rpcDiagResults?.checks?.[1]?.status || 'CHECKED'} ({rpcDiagResults?.gasBalance})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {rpcDiagResults?.checks?.[1]?.details || 'Deployer holds sufficient gas.'}
                      </p>
                    </div>

                    {/* Check 3: On-Chain Contract Bytecode Verification */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Code2 className="h-4 w-4 text-purple-400" />
                          <h5 className="font-bold text-xs text-slate-200">Check 3: Contract Bytecode On-Chain Existence</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          {rpcDiagResults?.bytecodeVerified ? 'BYTECODE VERIFIED' : 'NO BYTECODE'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {rpcDiagResults?.checks?.[2]?.details || 'Verified EVM bytecode on-chain.'}
                      </p>
                    </div>

                  </div>

                  {/* Diagnostic Terminal Logs */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-300 font-mono text-[11px] space-y-2">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <Terminal className="h-4 w-4 text-blue-400" />
                        <span className="font-bold text-xs text-slate-200">RPC Diagnostic Probe Log</span>
                      </div>
                      <span className="text-[10px]">Real-Time Inspection</span>
                    </div>

                    <div className="space-y-1 max-h-36 overflow-y-auto text-slate-300 pt-1">
                      <p className="text-blue-400">[RPC-PROBE] Querying provider {rpcDiagResults?.rpcEndpoint || rpcEndpointInput}...</p>
                      <p className="text-emerald-400">[eth_blockNumber] Latest Block #{rpcDiagResults?.blockHeight?.toLocaleString() || '19,820,412'}</p>
                      <p className="text-amber-300">[eth_getBalance] Deployer {rpcDiagResults?.deployerAddress?.slice(0, 10)}... balance = {rpcDiagResults?.gasBalance || '1.425 ETH'}</p>
                      <p className="text-purple-300">[eth_getCode] Target contract {rpcDiagResults?.contractAddress?.slice(0, 10)}... = 3,420 bytes bytecode</p>
                      <p className="text-emerald-400 font-bold">[PRE-TX-PASS] All checks validated! System ready for contract interaction.</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* SECTION: Deposit Indexer & Webhook Relay Server Workspace */}
          {activeSection === 'indexer_relay' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 border border-purple-900/60 rounded-2xl p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 rounded-2xl text-white shadow-lg">
                      <Radio className="h-7 w-7 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight text-white">
                          Deposit Detection Indexer & Webhook Relay Server
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                          HMAC SHA-256
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                          PRIVATE WORKER 10.142.2.19
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                        Dedicated private relay server for automated deposit detection, purchase webhooks, and block indexing. Listens for on-chain token deposits and dispatches HMAC-signed webhooks to external exchange platforms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono bg-slate-900/90 p-3 rounded-xl border border-purple-900/50">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Relay Node Status</span>
                      <span className="font-bold text-sm text-emerald-400 flex items-center space-x-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>DEPO-Indexer-Relay-01</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Form Controls & Webhook / Indexer Live Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (5 cols): Webhook Dispatcher & Indexer Scanner Controls */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5 shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Send className="h-5 w-5 text-purple-400" />
                      <h4 className="font-bold text-base">Webhook Dispatcher & Indexer</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Port 8090</span>
                  </div>

                  {/* Event Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      1. Webhook Event Trigger Type
                    </label>
                    <select
                      value={webhookEventType}
                      onChange={(e: any) => setWebhookEventType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="deposit.detected">deposit.detected (On-Chain Deposit Event)</option>
                      <option value="purchase.completed">purchase.completed (Exchange Purchase Order)</option>
                      <option value="token.minted">token.minted (Token Minting Event)</option>
                      <option value="vault.locked">vault.locked (Subnet Vault Stake Lock)</option>
                    </select>
                  </div>

                  {/* Token Symbol */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      2. Token Asset Symbol
                    </label>
                    <select
                      value={webhookTokenSymbol}
                      onChange={(e) => setWebhookTokenSymbol(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="DEPO">DEPO (Subnet Token - Sepolia Contract)</option>
                      <option value="sSOL">sSOL (Subnet Wrapped Solana - SPL Mint)</option>
                      <option value="sBTC">sBTC (Subnet Wrapped Bitcoin - BRC-20)</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      3. Event Amount / Volume
                    </label>
                    <input
                      type="text"
                      value={webhookAmount}
                      onChange={(e) => setWebhookAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                      placeholder="5,000.00"
                    />
                  </div>

                  {/* Depositor Wallet */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      4. Depositor / Purchaser Wallet Address
                    </label>
                    <input
                      type="text"
                      value={webhookDepositor}
                      onChange={(e) => setWebhookDepositor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-xs text-white focus:border-purple-500 focus:outline-none"
                      placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 space-y-3">
                    <button
                      onClick={handleSendWebhookRelay}
                      disabled={isSendingWebhook}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center space-x-2"
                    >
                      <Send className={`h-4 w-4 ${isSendingWebhook ? 'animate-bounce' : ''}`} />
                      <span>{isSendingWebhook ? 'Dispatching Webhook Relay...' : 'Dispatch HMAC-Signed Webhook Relay'}</span>
                    </button>

                    <button
                      onClick={handleRunDepositIndexer}
                      disabled={isScanningIndexer}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-purple-300 font-bold text-xs rounded-xl border border-purple-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <Activity className={`h-4 w-4 text-purple-400 ${isScanningIndexer ? 'animate-spin' : ''}`} />
                      <span>{isScanningIndexer ? 'Scanning Blocks...' : 'Scan Blocks for On-Chain Deposits (50 Blocks)'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Column (7 cols): Webhook Logs & Block Deposit Results */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Webhook Event Stream Log */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Terminal className="h-5 w-5 text-purple-400" />
                        <h4 className="font-bold text-sm text-slate-100">Live Webhook Relay Event Stream ({webhookLogs.length})</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                        HMAC VALIDATED
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {webhookLogs.map((log, idx) => (
                        <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-purple-300 font-bold uppercase">{log.eventType}</span>
                            <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-slate-200">
                            Amount: <strong className="text-emerald-400">{log.amount} {log.tokenSymbol}</strong> | Depositor: <span className="text-blue-300">{log.depositorAddress.slice(0, 10)}...</span>
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                            <span>Tx: {log.txHash.slice(0, 16)}...</span>
                            <span className="text-purple-400 font-bold">Node: {log.processedByNode}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Block Indexer Results */}
                  {indexerDeposits.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <h4 className="font-bold text-sm text-slate-100">Scanned On-Chain Block Deposits ({indexerDeposits.length})</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Scan Window: 50 Blocks</span>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        {indexerDeposits.map((dep, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <span className="text-amber-400 font-bold">Block #{dep.blockNumber}</span>
                              <p className="text-slate-300 text-[11px]">
                                From {dep.from.slice(0, 8)}... to DEPO Vault Contract
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-emerald-400 font-bold text-sm block">{dep.value}</span>
                              <span className="text-[10px] text-slate-400">{dep.confirmations} Confirmations</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {/* SECTION: Exchange RPC Gateway Proxy & Load Balancer */}
          {activeSection === 'exchange_rpc_proxy' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 border border-blue-900/60 rounded-2xl p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl text-white shadow-lg">
                      <Network className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight text-white">
                          Gateway Proxy for Exchange RPC Connections
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                          LOAD BALANCED POOL
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                          25,000 RPS CAPACITY
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                        Provision load-balanced gateway nodes to serve public and centralized exchange RPC requests. Handles automatic traffic distribution, caching, and failover routing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono bg-slate-900/90 p-3 rounded-xl border border-blue-900/50">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Cluster Latency</span>
                      <span className="font-bold text-sm text-emerald-400 flex items-center space-x-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>14 ms Avg</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: RPC Form & Cluster Pool Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (5 cols): Test RPC Gateway Form */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5 shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-400" />
                      <h4 className="font-bold text-base">Exchange RPC Tester</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Gateway Router</span>
                  </div>

                  {/* Chain Network */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      1. Target Blockchain Network
                    </label>
                    <select
                      value={rpcProxyChain}
                      onChange={(e) => setRpcProxyChain(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Ethereum Sepolia Testnet">Ethereum Sepolia Testnet (Chain ID 11155111)</option>
                      <option value="Ethereum Mainnet">Ethereum Mainnet (Chain ID 1)</option>
                      <option value="Solana Mainnet Beta">Solana Mainnet Beta (Cluster 101)</option>
                    </select>
                  </div>

                  {/* Exchange Client */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      2. Exchange / API Client Identity
                    </label>
                    <input
                      type="text"
                      value={rpcProxyClient}
                      onChange={(e) => setRpcProxyClient(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Coinbase / Binance Proxy Worker"
                    />
                  </div>

                  {/* RPC Method */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      3. JSON-RPC Method Request
                    </label>
                    <select
                      value={rpcProxyMethod}
                      onChange={(e) => setRpcProxyMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="eth_blockNumber">eth_blockNumber (Get Latest Block)</option>
                      <option value="eth_getBalance">eth_getBalance (Check Wallet Balance)</option>
                      <option value="eth_call">eth_call (Query Contract State)</option>
                      <option value="eth_sendRawTransaction">eth_sendRawTransaction (Submit Signed Tx)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleTestExchangeRpcProxy}
                    disabled={isTestingRpcProxy}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center space-x-2"
                  >
                    <Activity className={`h-4 w-4 ${isTestingRpcProxy ? 'animate-spin' : ''}`} />
                    <span>{isTestingRpcProxy ? 'Routing RPC Request...' : 'Send Exchange RPC Load-Balanced Request'}</span>
                  </button>
                </div>

                {/* Right Column (7 cols): Gateway Cluster Nodes Pool */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-blue-400" />
                        <h4 className="font-bold text-sm text-slate-100">Load-Balanced Gateway Proxy Nodes Pool</h4>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">100% HEALTHY</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block">Node 1 (Primary)</span>
                        <strong className="text-blue-300 block text-xs">Alpha-Edge-Gateway</strong>
                        <p className="text-[11px] text-slate-300">10.142.0.12 (14ms)</p>
                        <span className="text-emerald-400 text-[10px] font-bold block pt-1">Weight: 50%</span>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block">Node 2 (Secondary)</span>
                        <strong className="text-indigo-300 block text-xs">Exchange-RPC-Node-02</strong>
                        <p className="text-[11px] text-slate-300">10.142.1.44 (18ms)</p>
                        <span className="text-indigo-400 text-[10px] font-bold block pt-1">Weight: 30%</span>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block">Node 3 (Fallback)</span>
                        <strong className="text-purple-300 block text-xs">Fallback-RPC-Node-03</strong>
                        <p className="text-[11px] text-slate-300">10.142.2.80 (24ms)</p>
                        <span className="text-purple-400 text-[10px] font-bold block pt-1">Standby: 20%</span>
                      </div>
                    </div>
                  </div>

                  {/* RPC Response Result Card */}
                  {rpcProxyResult && (
                    <div className="bg-slate-950 border border-blue-900/60 rounded-2xl p-5 text-white font-mono text-xs space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-blue-400 uppercase text-xs">RPC Proxy Load-Balanced Response</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{rpcProxyResult.proxyStatus}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Routed Node</span>
                          <strong className="text-white text-xs">{rpcProxyResult.routedThroughNode.name} ({rpcProxyResult.routedThroughNode.ip})</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Latency / Cache</span>
                          <strong className="text-emerald-400 text-xs">{rpcProxyResult.routedThroughNode.latencyMs} ms (Cache Hit: YES)</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* SECTION: Decentralized Storage & IPFS Gateway Suite */}
          {activeSection === 'decentralized_ipfs' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 border border-teal-900/60 rounded-2xl p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3.5 bg-gradient-to-tr from-teal-600 via-cyan-600 to-indigo-600 rounded-2xl text-white shadow-lg">
                      <Globe className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight text-white">
                          Decentralized IPFS & Web3 Storage Gateway Suite
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold">
                          PINATA / FLEEK / ARWEAVE
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                        Resolve IPFS CIDs, Arweave TX IDs, and decentralized storage payloads. Probe response times across global IPFS gateways before publishing token metadata and static web assets.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleProbeDecentralizedGateways}
                    disabled={isProbingGateways}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
                  >
                    <Activity className={`h-4 w-4 ${isProbingGateways ? 'animate-spin' : ''}`} />
                    <span>{isProbingGateways ? 'Probing Gateways...' : 'Probe All Gateways'}</span>
                  </button>
                </div>
              </div>

              {/* Grid: IPFS CID Parser & Gateway Probe Results */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (5 cols): IPFS CID Parser Form */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5 shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Code2 className="h-5 w-5 text-teal-400" />
                      <h4 className="font-bold text-base">IPFS / Arweave CID Resolver</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Web3 Storage</span>
                  </div>

                  {/* CID Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      1. IPFS CID v0/v1 or Arweave TX Hash
                    </label>
                    <input
                      type="text"
                      value={ipfsCidInput}
                      onChange={(e) => setIpfsCidInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-xs text-white focus:border-teal-500 focus:outline-none"
                      placeholder="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
                    />
                  </div>

                  {/* Gateway Target */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      2. Gateway Target Endpoint
                    </label>
                    <select
                      value={ipfsGatewayInput}
                      onChange={(e) => setIpfsGatewayInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs font-bold text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="Pinata Dedicated Gateway">Pinata Dedicated Gateway (gateway.pinata.cloud)</option>
                      <option value="Fleek IPFS / Edge">Fleek IPFS / Edge (on-fleek.app)</option>
                      <option value="Cloudflare IPFS CDN">Cloudflare IPFS CDN (cloudflare-ipfs.com)</option>
                      <option value="Arweave / Irys Gateway">Arweave / Irys Gateway (arweave.net)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleParseIpfsPayload}
                    disabled={isParsingIpfs}
                    className="w-full py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-900/40 transition-all flex items-center justify-center space-x-2"
                  >
                    <Code2 className={`h-4 w-4 ${isParsingIpfs ? 'animate-spin' : ''}`} />
                    <span>{isParsingIpfs ? 'Resolving CID Payload...' : 'Resolve CID & Extract Metadata Schema'}</span>
                  </button>
                </div>

                {/* Right Column (7 cols): Parsed JSON & Gateway Benchmark Table */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Parsed IPFS Metadata Card */}
                  {ipfsParsedResult && (
                    <div className="bg-slate-950 border border-teal-900/60 rounded-2xl p-5 text-white font-mono text-xs space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-teal-400 uppercase text-xs">Resolved IPFS Metadata Schema</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{ipfsParsedResult.pinStatus} ({ipfsParsedResult.resolveTimeMs}ms)</span>
                      </div>

                      <p className="text-slate-300 font-bold">{ipfsParsedResult.metadataSchema.name}</p>
                      <p className="text-slate-400 text-[11px]">{ipfsParsedResult.metadataSchema.description}</p>

                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-bold">Resolved Gateway URL</span>
                        <a href={ipfsParsedResult.resolvedUrl} target="_blank" rel="noopener noreferrer" className="text-teal-300 text-[11px] hover:underline flex items-center space-x-1">
                          <span>{ipfsParsedResult.resolvedUrl}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Probed Gateways Table */}
                  {probedGateways.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-sm text-slate-100">Probed Gateway Benchmark Results ({probedGateways.length})</h4>
                        <span className="text-[10px] font-mono text-teal-400 font-bold">ALL ONLINE</span>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        {probedGateways.map((gw, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div>
                              <strong className="text-teal-300 block">{gw.provider}</strong>
                              <span className="text-[10px] text-slate-400">{gw.protocol}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-emerald-400 font-bold block">{gw.latencyMs} ms</span>
                              <span className="text-[10px] text-slate-400">{gw.throughputMbps} Mbps</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {/* SECTION 5: Provision Validator Node */}
          {activeSection === 'provision' && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-red-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Provision Dedicated Telemetry Validator Core Node
                </h3>
                <p className="text-xs text-slate-500">
                  Deploy a high-performance private server pre-configured with `libsecp256k1`, `ed25519-dalek`, and gRPC TPU ingesters
                </p>
              </div>

              <div className="max-w-xl space-y-4 bg-slate-50 p-5 border border-slate-200 rounded-xl">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Node Identifier Name</label>
                  <input
                    type="text"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Telemetry-Validator-Node-02"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Subnet Target IP Address</label>
                  <input
                    type="text"
                    value={nodeIp}
                    onChange={(e) => setNodeIp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="10.142.2.14"
                  />
                </div>

                <div className="p-3 bg-slate-950 text-red-400 font-mono text-[11px] rounded-lg space-y-1 border border-red-900/60">
                  <p className="text-slate-200 font-bold">Auto-Injected Microservices:</p>
                  <p>• libsecp256k1-daemon (ECDSA / Schnorr)</p>
                  <p>• ed25519-dalek-verifier (EdDSA Batch SIMD)</p>
                  <p>• gRPC-TPU-Ingester (Solana Pipeline Parity)</p>
                  <p>• PoH-Tick-Clock (High-res timestamping)</p>
                </div>

                <button
                  onClick={handleProvisionNode}
                  disabled={provisioningNode}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md shadow-red-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus className={`h-4 w-4 ${provisioningNode ? 'animate-spin' : ''}`} />
                  <span>{provisioningNode ? 'Provisioning Private Server...' : 'Provision Dedicated Node Now'}</span>
                </button>

              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
