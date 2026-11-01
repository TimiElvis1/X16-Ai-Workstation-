import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveCircuitRoutingGraph } from './InteractiveCircuitRoutingGraph';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Activity,
  Cpu,
  Zap,
  RefreshCw,
  Layers,
  Sparkles,
  Play,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Code2,
  Sliders,
  Radio,
  FileText,
  Copy,
  ExternalLink,
  Flame,
  Binary,
  Atom,
  Workflow,
  Network,
  Database
} from 'lucide-react';

interface GateSpec {
  symbol: string;
  name: string;
  category: string;
  inputs: string[];
  outputs: string[];
  description: string;
  matrix: string;
  fidelity: string;
  energyCostJ: string;
}

interface TelemetryPoint {
  time: string;
  samplingRateKHz: number;
  thermalNoisePsd: number;
  entropyDissipationJ: number;
  jaxAutogradLoss: number;
  chipTemperatureK: number;
  circuitFidelityPct: number;
}

export const GatesCircuitTelemetryStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CIRCUIT_GRAPH' | 'DOCS_INDEX' | 'GATES_CATALOG' | 'CIRCUIT_SIMULATOR' | 'HARDWARE_TELEMETRY'>('CIRCUIT_GRAPH');

  // Documentation Index State
  const [docsData, setDocsData] = useState<any>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(true);

  // Gates State
  const [gatesList, setGatesList] = useState<GateSpec[]>([]);
  const [selectedGate, setSelectedGate] = useState<GateSpec | null>(null);

  // Simulation State
  const [circuitName, setCircuitName] = useState<string>('Thermodynamic PSWAP Sampler');
  const [numPbits, setNumPbits] = useState<number>(4);
  const [temperatureK, setTemperatureK] = useState<number>(298.15);
  const [selectedGates, setSelectedGates] = useState<string[]>(['PSWAP', 'PROT', 'PFACT']);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Telemetry Stream State
  const [telemetryStream, setTelemetryStream] = useState<TelemetryPoint[]>([]);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  // System Logs
  const [logs, setLogs] = useState<string[]>([
    `[DEPO-INIT] Initialized DEPO circuit telemetry engine`,
    `[JAX-ACCEL] Extropic XTR-0 Silicon TSU & JAX Autograd Engine Online`,
    `[TELEMETRY] Live stream active at 1.2 MHz sampling throughput`
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 24)]);
  };

  useEffect(() => {
    fetchDocsResources();
    fetchGatesList();
    fetchLiveTelemetry();

    const interval = setInterval(() => {
      if (isLiveStreaming) {
        fetchLiveTelemetry();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Fetch Docs Resources from backend API
  const fetchDocsResources = async () => {
    try {
      setIsLoadingDocs(true);
      const res = await fetch('/api/depo/docs/resources');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setDocsData(data);
      }
    } catch (err) {
      console.warn('Unable to fetch DEPO docs resources:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  // Fetch Gates Catalog
  const fetchGatesList = async () => {
    try {
      const res = await fetch('/api/depo/gates');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.gates)) {
          setGatesList(data.gates);
          if (data.gates.length > 0) setSelectedGate(data.gates[0]);
        }
      }
    } catch (err) {
      console.warn('Unable to fetch DEPO gates:', err);
    }
  };

  // Fetch Live Telemetry Stream
  const fetchLiveTelemetry = async () => {
    try {
      const res = await fetch('/api/depo/telemetry/live');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.telemetryData) {
          setTelemetryStream(data.telemetryData);
        }
      }
    } catch (err) {
      console.warn('Unable to fetch live DEPO telemetry:', err);
    }
  };

  // Run Circuit Simulation
  const handleRunSimulation = async () => {
    try {
      setIsSimulating(true);
      addLog(`Compiling JAX autograd program for '${circuitName}' with gates [${selectedGates.join(', ')}]...`);

      const res = await fetch('/api/depo/circuit/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circuitName,
          numPbits,
          temperatureK,
          selectedGates
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setSimulationResult(data.simulationResult);
        addLog(`✓ ${data.message}`);
      }
    } catch (err) {
      console.warn('Unable to run simulation:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const toggleGateSelection = (symbol: string) => {
    if (selectedGates.includes(symbol)) {
      if (selectedGates.length > 1) {
        setSelectedGates(prev => prev.filter(g => g !== symbol));
      }
    } else {
      setSelectedGates(prev => [...prev, symbol]);
    }
  };

  const copyPythonCode = () => {
    if (simulationResult?.generatedPythonJaxCode) {
      navigator.clipboard.writeText(simulationResult.generatedPythonJaxCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div id="depo-gates-circuit-telemetry-studio" className="space-y-6 font-sans">
      
      {/* Studio Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white font-bold shadow-lg flex items-center justify-center">
                <Atom className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white tracking-tight font-mono">
                    Gates and circuit Telemetrys
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold text-[10px] uppercase">
                    Extropic DEPO AI v0.4.2
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Native DEPO resources • Parametrised Stochastic Circuits (PSCs), PSWAP Gates & Hardware Telemetry.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="bg-black border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-zinc-300">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>Extropic XTR-0 TSU</span>
            </div>
            <div className="bg-black border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-zinc-300">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>298.15 K Thermal Noise</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Tab Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3 font-mono text-xs">
        
        {/* Tab 1: Interactive Circuit Routing Graph */}
        <button
          onClick={() => setActiveTab('CIRCUIT_GRAPH')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'CIRCUIT_GRAPH'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Network className="h-4 w-4 text-cyan-400" />
          <span>Interactive Circuit Routing Flow</span>
          <span className="px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] rounded font-bold">GRAPH SIMULATOR</span>
        </button>

        {/* Tab 2: Docs Resources Index */}
        <button
          onClick={() => setActiveTab('DOCS_INDEX')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'DOCS_INDEX'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Globe className="h-4 w-4 text-emerald-400" />
          <span>Documentation Resources</span>
          <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] rounded">INDEXED</span>
        </button>

        {/* Tab 3: Gates Catalog */}
        <button
          onClick={() => setActiveTab('GATES_CATALOG')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'GATES_CATALOG'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Binary className="h-4 w-4 text-amber-400" />
          <span>Gates & Matrices</span>
          <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 text-[9px] rounded">PSWAP / PROT</span>
        </button>

        {/* Tab 4: Circuit Simulator */}
        <button
          onClick={() => setActiveTab('CIRCUIT_SIMULATOR')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'CIRCUIT_SIMULATOR'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Workflow className="h-4 w-4 text-purple-400" />
          <span>Stochastic Circuit Simulator</span>
          <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-800 text-[9px] rounded">JAX AUTOGRAD</span>
        </button>

        {/* Tab 5: Hardware Telemetry */}
        <button
          onClick={() => setActiveTab('HARDWARE_TELEMETRY')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'HARDWARE_TELEMETRY'
              ? 'bg-white text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Activity className="h-4 w-4 text-rose-400" />
          <span>Live Hardware Telemetry</span>
          <span className="px-1.5 py-0.2 bg-rose-950 text-rose-300 border border-rose-800 text-[9px] rounded">REAL-TIME</span>
        </button>
      </div>

      {/* SECTION 0: Interactive Circuit Routing Flow Graph */}
      {activeTab === 'CIRCUIT_GRAPH' && (
        <InteractiveCircuitRoutingGraph />
      )}

      {/* SECTION 1: Gate Injunctions & Circuit Resources Catalog */}
      {activeTab === 'DOCS_INDEX' && (
        <div className="space-y-6 font-mono text-xs">
          
          {/* Native Resources Header Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Native Gates & Circuit Resources Catalog</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    DOMAIN SYNC EXCLUDED
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Local embedded resource library for Parametrised Stochastic Circuits (PSCs), Directed Factor Graphs, and Gate Injunction syncing.
                </p>
              </div>
              <div className="px-3.5 py-2 bg-zinc-900 border border-zinc-700 text-emerald-300 font-bold rounded-xl flex items-center space-x-2 shadow-lg text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Native Resources Active</span>
              </div>
            </div>

            {/* Overview */}
            {docsData && (
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-cyan-300 block">Gate Injunction Resource Engine</span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {docsData.overview}
                </p>
              </div>
            )}

            {/* Primitive Sites Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs flex items-center space-x-2">
                <Binary className="h-4 w-4 text-emerald-400" />
                <span>DEPO Primitives (pbit, pdit, pmode)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {docsData?.primitives?.map((prim: any, idx: number) => (
                  <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm font-bold">{prim.name}</strong>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        {prim.type}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">{prim.description}</p>
                    <div className="text-[10px] text-cyan-400 font-bold">States: {prim.states}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation Sections */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-white text-xs flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-400" />
                <span>Indexed Documentation Chapters</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docsData?.sections?.map((sec: any) => (
                  <div key={sec.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                    <strong className="text-cyan-300 font-bold block">{sec.title}</strong>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Gates Catalog & Matrix Inspector */}
      {activeTab === 'GATES_CATALOG' && (
        <div className="space-y-6 font-mono text-xs">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gates List (5 cols) */}
            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-white text-xs flex items-center space-x-2">
                  <Binary className="h-4 w-4 text-emerald-400" />
                  <span>DEPO Gates Specification Library</span>
                </h3>
                <span className="text-[10px] text-zinc-500">{gatesList.length} Gates</span>
              </div>

              <div className="space-y-2">
                {gatesList.map((gate) => (
                  <div
                    key={gate.symbol}
                    onClick={() => setSelectedGate(gate)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      selectedGate?.symbol === gate.symbol
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-400 font-bold text-sm">{gate.symbol}</strong>
                      <span className="px-2 py-0.5 rounded bg-black text-zinc-400 text-[10px] border border-zinc-800">
                        {gate.category}
                      </span>
                    </div>
                    <div className="text-white font-bold">{gate.name}</div>
                    <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1">
                      <span>Fidelity: <strong className="text-emerald-300">{gate.fidelity}</strong></span>
                      <span>Energy: <strong className="text-cyan-300">{gate.energyCostJ} J</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gate Matrix & Mathematical Detail (7 cols) */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
              {selectedGate ? (
                <div className="space-y-5">
                  <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <span className="text-emerald-400">{selectedGate.symbol}</span>
                        <span>- {selectedGate.name}</span>
                      </h3>
                      <span className="text-zinc-400 text-[11px]">{selectedGate.category}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-xs">
                      {selectedGate.fidelity} Fidelity
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-zinc-400 font-bold block">Gate Description</span>
                    <p className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 text-[11px] leading-relaxed">
                      {selectedGate.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-zinc-400 font-bold block">Matrix / Hamiltonian Operator</span>
                    <div className="p-4 bg-black border border-zinc-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
                      {selectedGate.matrix}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
                      <span className="text-zinc-500 text-[10px] block">Input Terminals</span>
                      <strong className="text-white block">{selectedGate.inputs.join(', ')}</strong>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
                      <span className="text-zinc-500 text-[10px] block">Output Terminals</span>
                      <strong className="text-white block">{selectedGate.outputs.join(', ')}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 text-center py-20">Select a gate from the library to view details.</div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: Stochastic Circuit Simulator */}
      {activeTab === 'CIRCUIT_SIMULATOR' && (
        <div className="space-y-6 font-mono text-xs">
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Workflow className="h-5 w-5 text-amber-400" />
                  <span>Parametrised Stochastic Circuit (PSC) Simulator</span>
                </h3>
                <p className="text-zinc-400 text-[11px]">
                  Simulate stochastic circuits using JAX autograd and sample probability distributions.
                </p>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{isSimulating ? 'Simulating JAX...' : 'Run Simulation'}</span>
              </button>
            </div>

            {/* Circuit Configuration Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div>
                <label className="text-zinc-400 block mb-1 font-bold">Circuit Name</label>
                <input
                  type="text"
                  value={circuitName}
                  onChange={(e) => setCircuitName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-bold">Number of pbits (Binary Sites)</label>
                <input
                  type="number"
                  min={2}
                  max={32}
                  value={numPbits}
                  onChange={(e) => setNumPbits(Number(e.target.value))}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-bold">Temperature (K)</label>
                <input
                  type="number"
                  step="0.01"
                  value={temperatureK}
                  onChange={(e) => setTemperatureK(Number(e.target.value))}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-emerald-400 font-bold"
                />
              </div>
            </div>

            {/* Select Gates to Wire */}
            <div className="space-y-2">
              <span className="text-zinc-400 font-bold block">Wire Gates into Circuit Sequence:</span>
              <div className="flex flex-wrap gap-2">
                {['PSWAP', 'PROT', 'PAND', 'PXOR', 'PMIX', 'PFACT'].map((symbol) => {
                  const isSelected = selectedGates.includes(symbol);
                  return (
                    <button
                      key={symbol}
                      onClick={() => toggleGateSelection(symbol)}
                      className={`px-4 py-2 rounded-xl font-bold border transition-all ${
                        isSelected
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                      }`}
                    >
                      {symbol}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulation Results Display */}
            {simulationResult && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Distribution Bar Chart (7 cols) */}
                <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                  <span className="font-bold text-white text-xs block">Sampled Probability Distribution P(state)</span>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simulationResult.distribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="state" stroke="#a1a1aa" fontSize={10} />
                        <YAxis stroke="#a1a1aa" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
                        <Bar dataKey="prob" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Code Generator Snippet (5 cols) */}
                <div className="lg:col-span-5 bg-black border border-zinc-800 p-4 rounded-xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs">Generated Python + JAX Code</span>
                    <button
                      onClick={copyPythonCode}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded text-[10px] flex items-center space-x-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <pre className="text-emerald-400 text-[10px] font-mono max-h-56 overflow-y-auto leading-relaxed">
                    {simulationResult.generatedPythonJaxCode}
                  </pre>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: Live Hardware Telemetry Streams */}
      {activeTab === 'HARDWARE_TELEMETRY' && (
        <div className="space-y-6 font-mono text-xs">
          
          {/* Telemetry Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Sampling Rate Throughput (kHz) */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span>Sampling Throughput (kHz)</span>
                </span>
                <span className="text-emerald-400 font-bold">1.2 MHz Peak</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryStream}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a1a1aa" fontSize={10} />
                    <YAxis stroke="#a1a1aa" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
                    <Area type="monotone" dataKey="samplingRateKHz" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Thermal Noise PSD & Temperature */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>Chip Temperature & Thermal Noise PSD</span>
                </span>
                <span className="text-amber-400 font-bold">298.15 K</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetryStream}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a1a1aa" fontSize={10} />
                    <YAxis stroke="#a1a1aa" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
                    <Line type="monotone" dataKey="thermalNoisePsd" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Logs Footer Console */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-xl font-mono text-xs text-cyan-400 space-y-1 h-32 overflow-y-auto">
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>

    </div>
  );
};
