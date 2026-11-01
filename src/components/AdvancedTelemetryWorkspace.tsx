import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PrivateServer, 
  CodeInjunction, 
  ServerState, 
  StandardTelemetryObject, 
  AnomalyReport 
} from '../types';
import { 
  Activity, 
  Radio, 
  Cpu, 
  ShieldAlert, 
  Workflow, 
  Database, 
  Server, 
  Globe, 
  Zap, 
  RefreshCw, 
  Download, 
  Code, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Clock, 
  TrendingUp, 
  Sliders, 
  BarChart3, 
  Layers, 
  Terminal, 
  Play, 
  ShieldCheck, 
  Network, 
  FileText,
  Copy,
  ChevronRight,
  Plus,
  ArrowRight,
  RotateCcw,
  Upload,
  Gauge,
  Check,
  XCircle,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  GitBranch,
  Search,
  Filter,
  Wrench,
  Boxes
} from 'lucide-react';

interface AdvancedTelemetryWorkspaceProps {
  servers: PrivateServer[];
  injunctions: CodeInjunction[];
  onCreateServer: (server: Partial<PrivateServer>) => void;
  onCreateInjunction: (injunction: Partial<CodeInjunction>) => void;
  onExecuteInjunction: (injunctionId: string, inputParams: any) => Promise<any>;
}

type TelemetryArchitectureTab = 
  | 'active_probes' 
  | 'server_state_machine' 
  | 'baseline_anomaly' 
  | 'remediation_pipeline' 
  | 'data_model_tree' 
  | 'telemetry_json' 
  | 'architecture_master';

export const AdvancedTelemetryWorkspace: React.FC<AdvancedTelemetryWorkspaceProps> = ({
  servers,
  injunctions,
  onCreateServer,
  onCreateInjunction,
  onExecuteInjunction
}) => {
  const [activeTab, setActiveTab] = useState<TelemetryArchitectureTab>('active_probes');
  const [selectedServerId, setSelectedServerId] = useState<string>(servers[0]?.id || '');
  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0];

  const [isRunningProbeTest, setIsRunningProbeTest] = useState<boolean>(false);
  const [probeProgress, setProbeProgress] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Active Server State Lifecycle Tracker (Section 2)
  const [serverState, setServerState] = useState<ServerState>('HEALTHY');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);

  // Live Speed Testing Metrics & Protocol Probes (Section 4 & 5)
  const [downloadSpeedMbps, setDownloadSpeedMbps] = useState<number>(942.5);
  const [uploadSpeedMbps, setUploadSpeedMbps] = useState<number>(482.1);
  const [ttfbMs, setTtfbMs] = useState<number>(14.2);
  const [latencyMs, setLatencyMs] = useState<number>(18.5);
  const [jitterMs, setJitterMs] = useState<number>(1.4);
  const [packetLossPercent, setPacketLossPercent] = useState<number>(0.0);
  const [tcpRetransmits, setTcpRetransmits] = useState<number>(1);

  // Percentiles (Section 5)
  const [p50Ms, setP50Ms] = useState<number>(12);
  const [p90Ms, setP90Ms] = useState<number>(24);
  const [p95Ms, setP95Ms] = useState<number>(38);
  const [p99Ms, setP99Ms] = useState<number>(72);
  const [maxMs, setMaxMs] = useState<number>(94);

  // Anomaly Detection State (Section 7: Historical 950 Mbps vs Current 310 Mbps test)
  const [historicalBaselineMbps, setHistoricalBaselineMbps] = useState<number>(950);
  const [anomalyScore, setAnomalyScore] = useState<number>(0.04);
  const [anomalyDetected, setAnomalyDetected] = useState<boolean>(false);

  // Closed-Loop Remediation Workflow State (Section 9 & 10)
  const [remediationStep, setRemediationStep] = useState<'idle' | 'detecting' | 'diagnosing' | 'remediating' | 'verifying' | 'completed'>('idle');

  // Architecture logs
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    `[VOX-AI] Telemetry & Network Automation Engine initialized (v1.0 Production)`,
    `[RADAR] Discovered target host: ${activeServer?.name || 'Alpha-Edge-Gateway'} (${activeServer?.ipAddress || '10.142.0.12'})`,
    `[AUTH-CHECK] Authorization verified: AUTHORIZED -> State updated to TESTABLE`,
    `[POLICY] Active monitoring enabled. Thresholds: Latency > 100ms (WARNING), PacketLoss > 2% (CRITICAL), Throughput < 10 Mbps (WARNING)`
  ]);

  // Periodic metric pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!anomalyDetected && remediationStep === 'idle') {
        setLatencyMs(prev => Math.max(8, Math.min(45, prev + (Math.random() * 4 - 2))));
        setJitterMs(prev => Math.max(0.5, Math.min(3.5, prev + (Math.random() * 0.4 - 0.2))));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [anomalyDetected, remediationStep]);

  // Standard Telemetry Object according to Section 3 of PDF spec
  const currentTelemetryObject: StandardTelemetryObject = {
    telemetryId: `tel_${selectedServerId || '001'}_${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    target: {
      host: activeServer?.name || 'server.example.internal',
      address: activeServer?.ipAddress || '10.142.0.12',
      authorized: isAuthorized
    },
    protocol: 'HTTPS',
    test: {
      direction: 'download',
      payloadBytes: 10485760, // 10 MB
      durationMs: Math.round((10485760 * 8) / (downloadSpeedMbps * 1000000) * 1000),
      firstByteMs: Math.round(ttfbMs)
    },
    network: {
      latencyMs: Number(latencyMs.toFixed(1)),
      jitterMs: Number(jitterMs.toFixed(2)),
      packetLoss: packetLossPercent,
      throughputMbps: Number(downloadSpeedMbps.toFixed(1)),
      p50Ms,
      p90Ms,
      p95Ms,
      p99Ms
    },
    transport: {
      retransmissions: tcpRetransmits,
      connections: 2,
      timeouts: 0
    },
    result: {
      status: anomalyDetected ? 'warning' : 'success',
      error: anomalyDetected ? 'Throughput drop & TCP packet retransmission spike detected' : null
    }
  };

  // Run Active Protocol Probe (Upload & Download Speed Test according to Section 4 & 5)
  const handleRunProtocolProbe = async (forceAnomalyTest = false) => {
    setIsRunningProbeTest(true);
    setProbeProgress(10);
    setTelemetryLogs(prev => [
      ...prev,
      `[PROBE STARTED] Initializing active protocol probe on ${activeServer?.name || 'Target Server'} [${activeServer?.ipAddress || '10.142.0.12'}]...`,
      `[GET /telemetry/test-file] Streaming 10MB payload to measure download throughput & first-byte TTFB...`
    ]);

    await new Promise(r => setTimeout(r, 600));
    setProbeProgress(45);

    const calcDownload = forceAnomalyTest ? 310.0 : Number((880 + Math.random() * 110).toFixed(1));
    const calcLatency = forceAnomalyTest ? 148.0 : Number((12 + Math.random() * 8).toFixed(1));
    const calcTTFB = forceAnomalyTest ? 180.0 : Number((10 + Math.random() * 6).toFixed(1));
    const calcJitter = forceAnomalyTest ? 14.5 : Number((1.1 + Math.random() * 1.5).toFixed(1));
    const calcPacketLoss = forceAnomalyTest ? 4.8 : 0.0;

    setDownloadSpeedMbps(calcDownload);
    setLatencyMs(calcLatency);
    setTtfbMs(calcTTFB);
    setJitterMs(calcJitter);
    setPacketLossPercent(calcPacketLoss);

    setTelemetryLogs(prev => [
      ...prev,
      `[DOWNLOAD COMPLETE] Throughput: ${calcDownload} Mbps | First-Byte TTFB: ${calcTTFB}ms | Latency: ${calcLatency}ms`,
      `[POST /telemetry/upload] Streaming egress payload to measure upload duration & HTTP status...`
    ]);

    await new Promise(r => setTimeout(r, 600));
    setProbeProgress(80);

    const calcUpload = forceAnomalyTest ? 112.0 : Number((410 + Math.random() * 80).toFixed(1));
    setUploadSpeedMbps(calcUpload);

    await new Promise(r => setTimeout(r, 400));
    setProbeProgress(100);
    setIsRunningProbeTest(false);

    if (forceAnomalyTest || calcDownload < 400 || calcPacketLoss > 2) {
      setAnomalyDetected(true);
      setAnomalyScore(0.68);
      setServerState('REMEDIATION_REQUIRED');
      setTelemetryLogs(prev => [
        ...prev,
        `[AUTOMATION ENGINE] ⚠ ANOMALY DETECTED! Current throughput (${calcDownload} Mbps) dropped below baseline range (${historicalBaselineMbps} +/- 50 Mbps). Anomaly Score: 0.68.`,
        `[STATE MACHINE] Server state transitioned: HEALTHY ➔ REMEDIATION_REQUIRED`
      ]);
    } else {
      setAnomalyDetected(false);
      setAnomalyScore(0.04);
      setServerState('HEALTHY');
      setTelemetryLogs(prev => [
        ...prev,
        `[AUTOMATION ENGINE] ✓ Telemetry metrics operating normally within baseline (950 Mbps +/- 50 Mbps). Server state HEALTHY.`
      ]);
    }
  };

  // Run Closed-Loop Remediation Workflow (Section 8, 9 & 10)
  const handleTriggerClosedLoopRemediation = async () => {
    setRemediationStep('detecting');
    setTelemetryLogs(prev => [
      ...prev,
      `[CLOSED-LOOP REMEDIATION] Initiated 10-step Injunction Execution Pipeline...`,
      `[STEP 1-2: DETECT & DIAGNOSE] Context engine analyzing root-cause candidates...`
    ]);

    await new Promise(r => setTimeout(r, 800));
    setRemediationStep('diagnosing');
    setTelemetryLogs(prev => [
      ...prev,
      `[STEP 3-5: AUTHORIZATION & POLICY] Checking policy permissions for target ${activeServer?.name || 'server-42'}...`,
      `[POLICY VERIFIED] Approval mode: policy-approved | Action risk: LOW`
    ]);

    await new Promise(r => setTimeout(r, 900));
    setRemediationStep('remediating');
    setServerState('APPROVED_ACTION');
    setTelemetryLogs(prev => [
      ...prev,
      `[STEP 6-8: EXECUTE INJUNCTION] Executing controlled code injunction inj_001 ('restart_service: telemetry-agent')...`,
      `[CODE INJUNCTION] Applied kernel socket flush and reset BGP routing table buffers.`
    ]);

    await new Promise(r => setTimeout(r, 1000));
    setRemediationStep('verifying');
    setServerState('ACTION_EXECUTED');
    setTelemetryLogs(prev => [
      ...prev,
      `[STEP 9: VERIFY] Re-testing active protocol probes (GET /telemetry/test-file)...`
    ]);

    await new Promise(r => setTimeout(r, 800));
    setDownloadSpeedMbps(948.2);
    setUploadSpeedMbps(485.0);
    setLatencyMs(14.2);
    setJitterMs(1.1);
    setPacketLossPercent(0.0);
    setTcpRetransmits(0);
    setAnomalyDetected(false);
    setAnomalyScore(0.03);
    setServerState('VERIFIED');
    setRemediationStep('completed');

    setTelemetryLogs(prev => [
      ...prev,
      `[STEP 10: TELEMETRY AGAIN] Throughput restored to 948.2 Mbps | Latency: 14.2ms.`,
      `[AUDIT LOG] Incident successfully remediated, verified, and logged. Server state: VERIFIED.`
    ]);
  };

  // Copy JSON
  const handleCopyTelemetryJson = () => {
    const jsonStr = JSON.stringify(currentTelemetryObject, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedText('JSON Copied!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Toggle Authorization state (Section 11)
  const handleToggleAuthorization = (auth: boolean) => {
    setIsAuthorized(auth);
    if (!auth) {
      setServerState('UNAUTHORIZED');
      setTelemetryLogs(prev => [
        ...prev,
        `[RADAR INTEGRATION] Host marked UNAUTHORIZED -> Forced state: OBSERVE_ONLY. Active testing disabled according to policy rule Discovery != Authorization.`
      ]);
    } else {
      setServerState('AUTHORIZED');
      setTelemetryLogs(prev => [
        ...prev,
        `[RADAR INTEGRATION] Host AUTHORIZED -> Transitioned state to TESTABLE -> Active probes enabled.`
      ]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Microsoft Azure / Apple Styled Studio Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3.5 bg-gradient-to-tr from-rose-600 via-red-600 to-amber-600 rounded-2xl text-white shadow-lg">
              <Activity className="h-7 w-7 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  VOX AI — Telemetry & Network Automation Architecture Studio
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  v1.0 AUTOMATION SPEC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Comprehensive implementation of the VOX AI Telemetry Architecture. Run active upload/download protocol probes, track 11-stage server state transitions, detect baseline throughput anomalies, execute controlled code injunctions, and inspect telemetry data models.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-amber-400 font-mono text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {servers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.ipAddress})</option>
              ))}
            </select>

            <button
              onClick={() => handleRunProtocolProbe(false)}
              disabled={isRunningProbeTest || !isAuthorized}
              className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all text-xs font-mono"
            >
              <Zap className={`h-4 w-4 ${isRunningProbeTest ? 'animate-spin' : ''}`} />
              <span>{isRunningProbeTest ? 'Probing...' : 'Run Protocol Probe'}</span>
            </button>

            <button
              onClick={() => handleRunProtocolProbe(true)}
              disabled={isRunningProbeTest || !isAuthorized}
              className="flex items-center space-x-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded-xl transition-all text-xs font-mono"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>Simulate Anomaly (310 Mbps)</span>
            </button>
          </div>
        </div>

        {/* Metric Overview Scorecards (Apple/Microsoft Acrylic Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 pt-1 font-mono text-xs">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Throughput (Download)</span>
            <strong className="text-emerald-400 text-base font-black my-0.5">{downloadSpeedMbps} Mbps</strong>
            <span className="text-[9px] text-slate-400">Transmitted 10MB payload</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Egress (Upload)</span>
            <strong className="text-blue-400 text-base font-black my-0.5">{uploadSpeedMbps} Mbps</strong>
            <span className="text-[9px] text-slate-400">POST /telemetry/upload</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Latency (RTT / p95)</span>
            <strong className={`text-base font-black my-0.5 ${latencyMs > 100 ? 'text-rose-400' : 'text-amber-300'}`}>
              {latencyMs} ms ({p95Ms}ms p95)
            </strong>
            <span className="text-[9px] text-slate-400">Jitter: {jitterMs}ms</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Packet Loss SLA</span>
            <strong className={`text-base font-black my-0.5 ${packetLossPercent > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {packetLossPercent}% ({tcpRetransmits} retx)
            </strong>
            <span className="text-[9px] text-slate-400">SLA Critical limit: 2.0%</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Server State Stage</span>
            <strong className="text-cyan-300 text-xs font-black my-0.5 truncate">{serverState}</strong>
            <span className="text-[9px] text-slate-400">Stage 8 of 14</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Anomaly Score</span>
            <strong className={`text-base font-black my-0.5 ${anomalyDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
              {anomalyScore} {anomalyDetected ? '(DETECTED)' : '(NORMAL)'}
            </strong>
            <span className="text-[9px] text-slate-400">Baseline: 950 Mbps</span>
          </div>
        </div>
      </div>

      {/* Segmented Architectural Tab Navigation Bar (Microsoft Fluent Navigation) */}
      <div className="flex items-center space-x-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-mono shadow-inner scrollbar-none">
        
        <button
          onClick={() => setActiveTab('active_probes')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'active_probes'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Gauge className="h-4 w-4" />
          <span>4 & 5. Active Probes & Formulas</span>
        </button>

        <button
          onClick={() => setActiveTab('server_state_machine')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'server_state_machine'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Workflow className="h-4 w-4" />
          <span>2 & 11. State Machine & Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('baseline_anomaly')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'baseline_anomaly'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>6 & 7. Automation & Anomaly Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('remediation_pipeline')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'remediation_pipeline'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>8, 9 & 10. Injunction & Remediation</span>
        </button>

        <button
          onClick={() => setActiveTab('data_model_tree')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'data_model_tree'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>12 & 13. Data Model & Relationships</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry_json')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'telemetry_json'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>3. Telemetry Object JSON</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture_master')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'architecture_master'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>1, 14 & 15. Core Master Algorithm</span>
        </button>

      </div>

      {/* Main Tab Panels Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >

          {/* TAB 1: Section 4 & 5 - Active Probes & Formulas */}
          {activeTab === 'active_probes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
              
              {/* Left Column: Probe Operations & Live Stream Measurement */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <Download className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold text-sm text-white">4. Upload & Download Testing Engine</span>
                  </div>
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                    GET /telemetry/test-file & POST /telemetry/upload
                  </span>
                </div>

                {/* Progress bar during testing */}
                {isRunningProbeTest && (
                  <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between text-xs font-bold text-amber-400">
                      <span>Executing Active Protocol Probe Test...</span>
                      <span>{probeProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${probeProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Live Stream Measured Metrics Table */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase block">Active Probe Measured Metrics:</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Download Throughput</span>
                      <strong className="text-emerald-400 text-sm font-bold block">{downloadSpeedMbps} Mbps</strong>
                      <span className="text-[9px] text-slate-400 block">10,485,760 bytes / 842ms</span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Upload Throughput</span>
                      <strong className="text-blue-400 text-sm font-bold block">{uploadSpeedMbps} Mbps</strong>
                      <span className="text-[9px] text-slate-400 block">5,242,880 bytes egress</span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">First-Byte TTFB</span>
                      <strong className="text-amber-300 text-sm font-bold block">{ttfbMs} ms</strong>
                      <span className="text-[9px] text-slate-400 block">Initial byte ACK duration</span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">TCP Retransmissions</span>
                      <strong className="text-purple-300 text-sm font-bold block">{tcpRetransmits} Retx</strong>
                      <span className="text-[9px] text-slate-400 block">Connections: 2 active</span>
                    </div>
                  </div>
                </div>

                {/* Latency Reporting Distribution (p50, p90, p95, p99, max) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase block">Section 5: Latency Percentile Distribution:</span>
                  
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block font-bold">p50 Latency</span>
                      <strong className="text-emerald-400 font-bold">{p50Ms} ms</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block font-bold">p90 Latency</span>
                      <strong className="text-teal-300 font-bold">{p90Ms} ms</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block font-bold">p95 Latency</span>
                      <strong className="text-amber-400 font-bold">{p95Ms} ms</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block font-bold">p99 Latency</span>
                      <strong className="text-rose-400 font-bold">{p99Ms} ms</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block font-bold">Max Peak</span>
                      <strong className="text-purple-400 font-bold">{maxMs} ms</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Section 5 Telemetry Calculation Formulas */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <span className="font-bold text-sm text-white">5. Telemetry Calculation Formulas</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">1. Throughput Formula</span>
                    <pre className="bg-slate-900 p-2 rounded text-emerald-300 text-[11px] font-bold overflow-x-auto">
                      Throughput = transferred_bytes * 8 / duration_seconds
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">2. Megabits Per Second (Mbps)</span>
                    <pre className="bg-slate-900 p-2 rounded text-blue-300 text-[11px] font-bold overflow-x-auto">
                      Mbps = (bytes * 8) / seconds / 1,000,000
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">3. Packet Loss Percentage</span>
                    <pre className="bg-slate-900 p-2 rounded text-rose-300 text-[11px] font-bold overflow-x-auto">
                      PacketLoss = (sent - received) / sent * 100
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">4. Basic Jitter Calculation</span>
                    <pre className="bg-slate-900 p-2 rounded text-amber-300 text-[11px] font-bold overflow-x-auto">
                      Jitter ~= average(abs(RTT[n] - RTT[n-1]))
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Section 2 & 11 - 11-Stage Server State Machine & Radar Authorization */}
          {activeTab === 'server_state_machine' && (
            <div className="space-y-6 font-mono">
              
              {/* State Machine Visualizer Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <Workflow className="h-5 w-5 text-cyan-400" />
                    <span className="font-bold text-sm text-white">2. Server State Machine (11-Stage Lifecycle)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-xs">Current State:</span>
                    <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs">
                      {serverState}
                    </span>
                  </div>
                </div>

                {/* State Machine Workflow Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 text-center text-xs">
                  {[
                    { state: 'DISCOVERED', stage: 1 },
                    { state: 'IDENTIFIED', stage: 2 },
                    { state: 'UNAUTHORIZED', stage: 3, warn: true },
                    { state: 'OBSERVE_ONLY', stage: 4, warn: true },
                    { state: 'AUTHORIZED', stage: 5 },
                    { state: 'TESTABLE', stage: 6 },
                    { state: 'TESTING', stage: 7 },
                    { state: 'HEALTHY', stage: 8 },
                    { state: 'DEGRADED', stage: 9, alert: true },
                    { state: 'REMEDIATION_REQUIRED', stage: 10, alert: true },
                    { state: 'ACTION_EXECUTED', stage: 11 },
                    { state: 'VERIFIED', stage: 12 }
                  ].map((s) => {
                    const isActive = serverState === s.state;
                    return (
                      <button
                        key={s.state}
                        onClick={() => setServerState(s.state as any)}
                        className={`p-2.5 rounded-xl border text-[10px] font-bold flex flex-col items-center justify-between space-y-1 transition-all ${
                          isActive 
                            ? 'bg-gradient-to-b from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-lg scale-105 ring-2 ring-cyan-500/50'
                            : s.alert
                              ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                              : s.warn
                                ? 'bg-amber-950/40 border-amber-800 text-amber-300 hover:bg-amber-900/60'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="text-[9px] opacity-75 block">Stage {s.stage}</span>
                        <span className="truncate w-full block">{s.state}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Section 11: Radar Integration Rules */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-2">
                      <Radio className="h-4 w-4 text-amber-400" />
                      <span>11. Radar Integration & Authorization Check</span>
                    </span>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400 font-bold">Discovery != Authorization</span>
                      <button
                        onClick={() => handleToggleAuthorization(!isAuthorized)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                          isAuthorized ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-rose-600/20 border-rose-500 text-rose-300'
                        }`}
                      >
                        {isAuthorized ? '✓ Host AUTHORIZED' : '⚠ Host UNAUTHORIZED'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Radar discovers servers and fingerprints services. Before active testing is permitted, the policy engine validates inventory authorization. If unauthorized, the node is locked into <strong className="text-amber-300">OBSERVE_ONLY</strong> mode.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Section 6 & 7 - Telemetry Automation Engine & Baseline Anomaly Detection */}
          {activeTab === 'baseline_anomaly' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
              
              {/* Section 6: Telemetry Automation Engine */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Cpu className="h-5 w-5 text-emerald-400" />
                  <span className="font-bold text-sm text-white">6. Telemetry Automation Engine</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-bold block">`evaluateTelemetry(t)` Code Spec:</span>
                  <pre className="bg-slate-900 p-3 rounded-lg text-amber-300 text-xs overflow-x-auto">
{`function evaluateTelemetry(t) {
  const events = [];
  if (t.network.latencyMs > 100) {
    events.push({ type: "HIGH_LATENCY", severity: "warning" });
  }
  if (t.network.packetLoss > 2) {
    events.push({ type: "PACKET_LOSS", severity: "critical" });
  }
  if (t.network.throughputMbps < 10) {
    events.push({ type: "LOW_THROUGHPUT", severity: "warning" });
  }
  return events;
}`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-300 font-bold block uppercase">Live Telemetry Rule Status:</span>
                  
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span>Latency SLA Check (&lt;100ms)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${latencyMs > 100 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                        {latencyMs > 100 ? `TRIGGERED (${latencyMs}ms)` : `OK (${latencyMs}ms)`}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span>Packet Loss Critical SLA Check (&lt;2%)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${packetLossPercent > 2 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                        {packetLossPercent > 2 ? `CRITICAL (${packetLossPercent}%)` : `OK (${packetLossPercent}%)`}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span>Throughput Minimum SLA Check (&gt;10 Mbps)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${downloadSpeedMbps < 10 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                        {downloadSpeedMbps < 10 ? `WARNING (${downloadSpeedMbps} Mbps)` : `OK (${downloadSpeedMbps} Mbps)`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 7: Baseline and Anomaly Detection */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                  <span className="font-bold text-sm text-white">7. Baseline & Anomaly Detection Engine</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <span className="text-slate-400 uppercase font-bold block">Spec Example Match:</span>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div>Normal Download Baseline: <strong className="text-emerald-400">950 Mbps +/- 50 Mbps</strong></div>
                    <div>Current Measured Download: <strong className={downloadSpeedMbps < 500 ? 'text-rose-400' : 'text-emerald-400'}>{downloadSpeedMbps} Mbps</strong></div>
                    <div>Anomaly Status: <strong className={anomalyDetected ? 'text-rose-400' : 'text-emerald-400'}>{anomalyDetected ? 'ANOMALY DETECTED' : 'OPERATING NORMALLY'}</strong></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400 font-bold">Calculated Anomaly Score:</span>
                    <strong className={`text-base font-black ${anomalyDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {anomalyScore} / 1.0
                    </strong>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleRunProtocolProbe(true)}
                      disabled={isRunningProbeTest}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:brightness-110 text-white font-bold rounded-xl transition-all shadow text-xs flex items-center justify-center space-x-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Trigger 310 Mbps Anomaly Test</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Section 8, 9 & 10 - Controlled Code Injunction & Closed-Loop Remediation */}
          {activeTab === 'remediation_pipeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
              
              {/* Left 2 Cols: Injunction Pipeline Stepper & Remediation */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold text-sm text-white">9 & 10. Injunction Execution Pipeline & Remediation</span>
                  </div>

                  <button
                    onClick={handleTriggerClosedLoopRemediation}
                    disabled={remediationStep !== 'idle' && remediationStep !== 'completed'}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center space-x-2"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Run Closed-Loop Pipeline</span>
                  </button>
                </div>

                {/* 10-Step Pipeline Visualizer */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {[
                    'Telemetry',
                    'Problem Detected',
                    'Generate Recommendation',
                    'Check Authorization',
                    'Check Policy',
                    'Check Action Risk',
                    'Approval',
                    'Execute',
                    'Verify',
                    'Telemetry Again'
                  ].map((stepName, idx) => {
                    const stepNum = idx + 1;
                    const isDone = remediationStep === 'completed' || 
                                   (remediationStep === 'verifying' && stepNum <= 9) ||
                                   (remediationStep === 'remediating' && stepNum <= 7) ||
                                   (remediationStep === 'diagnosing' && stepNum <= 3);

                    return (
                      <div 
                        key={stepName}
                        className={`p-2.5 rounded-xl border text-[10px] font-bold space-y-1 ${
                          isDone 
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="block text-[9px]">Step {stepNum}</span>
                        <span className="block truncate">{stepName}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Section 10: Closed-Loop Remediation Cycle Diagram */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase block">10. Closed-Loop Remediation Cycle:</span>
                  <div className="flex items-center justify-between text-xs font-bold text-center">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-blue-300 w-20">Detect</div>
                    <ArrowRight className="h-4 w-4 text-slate-600" />
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-purple-300 w-20">Diagnose</div>
                    <ArrowRight className="h-4 w-4 text-slate-600" />
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-amber-300 w-20">Act</div>
                    <ArrowRight className="h-4 w-4 text-slate-600" />
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-teal-300 w-20">Measure</div>
                    <ArrowRight className="h-4 w-4 text-slate-600" />
                    <div className="p-2 bg-emerald-950 rounded-lg border border-emerald-500 text-emerald-300 w-24">Verified / Close</div>
                  </div>
                </div>
              </div>

              {/* Right Col: Section 8 Injunction Layer Spec */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Code className="h-5 w-5 text-amber-400" />
                  <span className="font-bold text-sm text-white">8. Controlled Code Injunction Spec</span>
                </div>

                <pre className="bg-slate-950 p-3.5 rounded-xl text-emerald-300 text-xs overflow-x-auto border border-slate-800">
{`{
  injunctionId: "inj_001",
  target: "server-42",
  authorization: {
    required: true,
    verified: true
  },
  action: "restart_service",
  parameters: {
    service: "telemetry-agent"
  },
  reason: "Telemetry agent unhealthy",
  approval: {
    mode: "policy-approved"
  }
}`}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 5: Section 12 & 13 - Data Model & Data Relationships */}
          {activeTab === 'data_model_tree' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
              
              {/* Section 12: Recommended Data Model */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Database className="h-5 w-5 text-blue-400" />
                  <span className="font-bold text-sm text-white">12. Recommended Data Model (10 Entities)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    'ASSETS', 'SERVICES', 'PROBES', 'TELEMETRY', 'EVENTS',
                    'INCIDENTS', 'INJUNCTIONS', 'ACTIONS', 'POLICIES', 'AUDIT_LOGS'
                  ].map((entity) => (
                    <div key={entity} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between font-bold text-slate-200">
                      <span>{entity}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 13: Data Relationships Graph */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <GitBranch className="h-5 w-5 text-purple-400" />
                  <span className="font-bold text-sm text-white">13. Data Relationships Tree</span>
                </div>

                <pre className="bg-slate-950 p-4 rounded-xl text-teal-300 text-xs overflow-x-auto border border-slate-800">
{`Asset
 |
 +-- Services
 |
 +-- Probes
 |   |
 |   +-- Telemetry
 |
 +-- Events
 |   |
 |   +-- Incidents
 |
 +-- Injunctions
     |
     +-- Audit Log`}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 6: Section 3 - Standard Telemetry Object Inspector */}
          {activeTab === 'telemetry_json' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <span className="font-bold text-sm text-white">3. Standard Telemetry Object Inspector</span>
                </div>

                <button
                  onClick={handleCopyTelemetryJson}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedText || 'Copy JSON Payload'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-5 rounded-2xl text-emerald-400 text-xs overflow-x-auto border border-slate-800 max-h-[480px]">
                {JSON.stringify(currentTelemetryObject, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 7: Section 1, 14 & 15 - Master Algorithm & Architectural Principles */}
          {activeTab === 'architecture_master' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
              
              {/* Section 15: Architectural Principles */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Layers className="h-5 w-5 text-amber-400" />
                  <span className="font-bold text-sm text-white">15. Architectural Principles (5 Layers)</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block font-bold">RADAR</strong>
                    <span className="text-slate-300 font-bold">"What exists?"</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Inventory discovery, IP range scanning, service fingerprinting.</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-emerald-400 block font-bold">TELEMETRY</strong>
                    <span className="text-slate-300 font-bold">"What is happening?"</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Throughput, latency, jitter, packet loss, retransmissions.</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-blue-400 block font-bold">AI / CONTEXT ENGINE</strong>
                    <span className="text-slate-300 font-bold">"What does it mean?"</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Historical baseline comparison & anomaly detection.</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-purple-400 block font-bold">INJUNCTION</strong>
                    <span className="text-slate-300 font-bold">"What approved action should happen?"</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Policy-governed automated code execution.</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-teal-400 block font-bold">VERIFICATION</strong>
                    <span className="text-slate-300 font-bold">"Did the action actually work?"</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Post-remediation probe testing & audit logging.</p>
                  </div>
                </div>
              </div>

              {/* Section 1 & 14: Core & Full Algorithm */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Workflow className="h-5 w-5 text-rose-400" />
                  <span className="font-bold text-sm text-white">14. Full SubNet AI Algorithm Stream</span>
                </div>

                <pre className="bg-slate-950 p-4 rounded-xl text-slate-300 text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
{`INITIALIZE SUBNET AI
 |
Discover / Import Assets
 |
Identify Services & Protocols
 |
Establish Authorization State
 / Authorized         Unauthorized
 |                        |
 |                Passive Telemetry
 |
Generate Probe
 |
Execute Upload Test
 |
Execute Download Test
 |
Measure Network + Application Metrics
 |
Normalize Telemetry
 |
Compare Against Baseline
 |
Detect Anomaly
 |
Correlate Events
 |
Determine Root-Cause Candidates
 |
Policy Engine
 +-- Informational
 +-- Alert
 +-- Recommend
 +-- Authorized Remediation
     |
     Execute Injunction
     |
     Re-test
     |
     Verify Improvement
     / Resolved          Escalate
     \\         /
      Audit Log`}
                </pre>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Real-time Architecture Console Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-lg space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-xs text-slate-300 flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-rose-400" />
            <span>SubNet AI Telemetry & Network Automation System Stream</span>
          </span>
          <button onClick={() => setTelemetryLogs([])} className="text-[10px] text-slate-500 hover:text-white">Clear</button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 max-h-[120px] overflow-y-auto text-[10px]">
          {telemetryLogs.map((log, idx) => (
            <div key={idx} className="text-slate-300">{log}</div>
          ))}
        </div>
      </div>

    </div>
  );
};
