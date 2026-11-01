import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network,
  Power,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Radio,
  Cpu,
  Sparkles,
  Info,
  Sliders,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export interface CircuitNode {
  id: string;
  label: string;
  symbol: string;
  type: 'INPUT' | 'GATE' | 'OUTPUT';
  category: string;
  x: number;
  y: number;
  enabled: boolean;
  energyfJ: number;
  latencyNs: number;
  bandwidthKHz: number;
  description: string;
}

export interface CircuitEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

const INITIAL_NODES: CircuitNode[] = [
  // Layer 0: Inputs
  {
    id: 'IN_0',
    label: 'pbit_0 (Source A)',
    symbol: 'pbit_0',
    type: 'INPUT',
    category: 'Binary Site',
    x: 80,
    y: 110,
    enabled: true,
    energyfJ: 0.1,
    latencyNs: 0.1,
    bandwidthKHz: 300,
    description: 'Probabilistic binary input stream A with Bernoulli parameter p_0'
  },
  {
    id: 'IN_1',
    label: 'pbit_1 (Source B)',
    symbol: 'pbit_1',
    type: 'INPUT',
    category: 'Binary Site',
    x: 80,
    y: 230,
    enabled: true,
    energyfJ: 0.1,
    latencyNs: 0.1,
    bandwidthKHz: 300,
    description: 'Probabilistic binary input stream B with Bernoulli parameter p_1'
  },
  {
    id: 'IN_2',
    label: 'pbit_2 (Source C)',
    symbol: 'pbit_2',
    type: 'INPUT',
    category: 'Binary Site',
    x: 80,
    y: 350,
    enabled: true,
    energyfJ: 0.1,
    latencyNs: 0.1,
    bandwidthKHz: 300,
    description: 'Probabilistic binary input stream C with Bernoulli parameter p_2'
  },
  {
    id: 'IN_3',
    label: 'pmode_0 (Thermal)',
    symbol: 'pmode_0',
    type: 'INPUT',
    category: 'Continuous Mode',
    x: 80,
    y: 470,
    enabled: true,
    energyfJ: 0.05,
    latencyNs: 0.05,
    bandwidthKHz: 450,
    description: 'Thermal noise injection continuous mode X_t'
  },

  // Layer 1: Intermediate Gates
  {
    id: 'G_PSWAP',
    label: 'PSWAP Gate',
    symbol: 'PSWAP',
    type: 'GATE',
    category: 'Boolean-Phase Swap',
    x: 310,
    y: 130,
    enabled: true,
    energyfJ: 1.2,
    latencyNs: 0.8,
    bandwidthKHz: 280,
    description: 'Swaps probability states between pbits with phase coupling J_12'
  },
  {
    id: 'G_PAND',
    label: 'PAND Gate',
    symbol: 'PAND',
    type: 'GATE',
    category: 'Soft Conjunction',
    x: 310,
    y: 290,
    enabled: true,
    energyfJ: 2.1,
    latencyNs: 1.1,
    bandwidthKHz: 250,
    description: 'Soft-max probabilistic AND coupling gate with Boltzmann beta'
  },
  {
    id: 'G_PMIX',
    label: 'PMIX Gate',
    symbol: 'PMIX',
    type: 'GATE',
    category: 'Entropy Injection',
    x: 310,
    y: 450,
    enabled: true,
    energyfJ: 0.5,
    latencyNs: 0.4,
    bandwidthKHz: 400,
    description: 'Injects calibrated Johnson-Nyquist thermal noise for Langevin sampling'
  },

  // Layer 2: Deep Processing Gates
  {
    id: 'G_PROT',
    label: 'PROT Gate',
    symbol: 'PROT',
    type: 'GATE',
    category: 'Phase Rotation',
    x: 540,
    y: 170,
    enabled: true,
    energyfJ: 0.8,
    latencyNs: 0.6,
    bandwidthKHz: 290,
    description: 'Applies continuous bias field rotation theta on probability distribution'
  },
  {
    id: 'G_PXOR',
    label: 'PXOR Gate',
    symbol: 'PXOR',
    type: 'GATE',
    category: 'Parity Coupling',
    x: 540,
    y: 330,
    enabled: true,
    energyfJ: 1.8,
    latencyNs: 0.9,
    bandwidthKHz: 260,
    description: 'Parity XOR gate enforcing frustrated spin couplings in spin-glass'
  },
  {
    id: 'G_PFACT',
    label: 'PFACT Gate',
    symbol: 'PFACT',
    type: 'GATE',
    category: 'Factor Constraint',
    x: 540,
    y: 490,
    enabled: true,
    energyfJ: 3.2,
    latencyNs: 1.4,
    bandwidthKHz: 220,
    description: 'Evaluates factor graph energy potential exp(-E / k_B T)'
  },

  // Layer 3: Sinks / Outputs
  {
    id: 'OUT_0',
    label: 'Sink Alpha (Sampler)',
    symbol: 'Sink_α',
    type: 'OUTPUT',
    category: 'Sampling Sink',
    x: 760,
    y: 180,
    enabled: true,
    energyfJ: 0.2,
    latencyNs: 0.2,
    bandwidthKHz: 300,
    description: 'High-speed TSU sampling output sink Alpha'
  },
  {
    id: 'OUT_1',
    label: 'Sink Beta (Ising State)',
    symbol: 'Sink_β',
    type: 'OUTPUT',
    category: 'State Register',
    x: 760,
    y: 330,
    enabled: true,
    energyfJ: 0.2,
    latencyNs: 0.2,
    bandwidthKHz: 280,
    description: 'Ising spin-glass ground state register Sink Beta'
  },
  {
    id: 'OUT_2',
    label: 'Sink Gamma (Factor Energy)',
    symbol: 'Sink_γ',
    type: 'OUTPUT',
    category: 'Energy Monitor',
    x: 760,
    y: 480,
    enabled: true,
    energyfJ: 0.2,
    latencyNs: 0.2,
    bandwidthKHz: 250,
    description: 'Factor potential energy monitoring sink Gamma'
  }
];

const EDGES: CircuitEdge[] = [
  // Inputs -> Stage 1
  { id: 'e1', from: 'IN_0', to: 'G_PSWAP', label: 'pbit_0' },
  { id: 'e2', from: 'IN_1', to: 'G_PSWAP', label: 'pbit_1' },
  { id: 'e3', from: 'IN_1', to: 'G_PAND', label: 'pbit_1' },
  { id: 'e4', from: 'IN_2', to: 'G_PAND', label: 'pbit_2' },
  { id: 'e5', from: 'IN_3', to: 'G_PMIX', label: 'pmode_0' },

  // Stage 1 -> Stage 2
  { id: 'e6', from: 'G_PSWAP', to: 'G_PROT', label: 'swapped_state' },
  { id: 'e7', from: 'G_PSWAP', to: 'G_PXOR', label: 'spin_parity' },
  { id: 'e8', from: 'G_PAND', to: 'G_PXOR', label: 'and_coupled' },
  { id: 'e9', from: 'G_PMIX', to: 'G_PXOR', label: 'thermal_noise' },
  { id: 'e10', from: 'G_PMIX', to: 'G_PFACT', label: 'langevin_drift' },

  // Stage 2 -> Outputs
  { id: 'e11', from: 'G_PROT', to: 'OUT_0', label: 'rotated_prob' },
  { id: 'e12', from: 'G_PROT', to: 'OUT_2', label: 'phase_ref' },
  { id: 'e13', from: 'G_PXOR', to: 'OUT_1', label: 'ising_state' },
  { id: 'e14', from: 'G_PFACT', to: 'OUT_2', label: 'energy_potential' }
];

export const InteractiveCircuitRoutingGraph: React.FC = () => {
  const [nodes, setNodes] = useState<CircuitNode[]>(INITIAL_NODES);
  const [pulseSpeedSec, setPulseSpeedSec] = useState<number>(2);
  const [hoveredNode, setHoveredNode] = useState<CircuitNode | null>(null);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<CircuitNode | null>(null);

  // Toggle individual gate
  const toggleGateNode = (id: string) => {
    setNodes(prev =>
      prev.map(n => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  // Preset Configurations
  const applyPreset = (preset: 'ALL_ON' | 'PRIMARY_ONLY' | 'FAULT_TEST' | 'ECO_MODE') => {
    if (preset === 'ALL_ON') {
      setNodes(prev => prev.map(n => ({ ...n, enabled: true })));
    } else if (preset === 'PRIMARY_ONLY') {
      setNodes(prev =>
        prev.map(n => {
          if (n.type === 'INPUT' || n.type === 'OUTPUT') return { ...n, enabled: true };
          return {
            ...n,
            enabled: n.id === 'G_PSWAP' || n.id === 'G_PROT'
          };
        })
      );
    } else if (preset === 'FAULT_TEST') {
      setNodes(prev =>
        prev.map(n => {
          if (n.id === 'G_PSWAP' || n.id === 'G_PXOR') return { ...n, enabled: false };
          return { ...n, enabled: true };
        })
      );
    } else if (preset === 'ECO_MODE') {
      setNodes(prev =>
        prev.map(n => {
          if (n.id === 'G_PAND' || n.id === 'G_PFACT') return { ...n, enabled: false };
          return { ...n, enabled: true };
        })
      );
    }
  };

  // Node Map Lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, CircuitNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Compute Active Signal Reachability via BFS
  const { activeNodeIds, activeEdgeIds, activeSinkCount, metrics, routingStatus } = useMemo(() => {
    const activeNodes = new Set<string>();
    const activeEdges = new Set<string>();

    // Input nodes are active sources
    const inputs = nodes.filter(n => n.type === 'INPUT' && n.enabled);
    const queue: string[] = inputs.map(i => i.id);
    inputs.forEach(i => activeNodes.add(i.id));

    while (queue.length > 0) {
      const currId = queue.shift()!;
      
      // Find outgoing edges from currId
      const outgoing = EDGES.filter(e => e.from === currId);
      for (const edge of outgoing) {
        const targetNode = nodeMap.get(edge.to);
        if (targetNode && targetNode.enabled) {
          activeEdges.add(edge.id);
          if (!activeNodes.has(targetNode.id)) {
            activeNodes.add(targetNode.id);
            queue.push(targetNode.id);
          }
        }
      }
    }

    // Active sinks
    const activeSinks = nodes.filter(n => n.type === 'OUTPUT' && activeNodes.has(n.id));
    const totalSinks = nodes.filter(n => n.type === 'OUTPUT').length;

    // Calculate routing metrics
    const enabledGates = nodes.filter(n => n.type === 'GATE' && n.enabled);
    const activeGates = nodes.filter(n => n.type === 'GATE' && activeNodes.has(n.id));

    const totalEnergy = enabledGates.reduce((sum, g) => sum + g.energyfJ, 0);
    const maxLatency = activeGates.length > 0 
      ? Math.max(...activeGates.map(g => g.latencyNs)) + 0.4
      : 0;
    
    const throughputKHz = activeSinks.length > 0
      ? activeSinks.reduce((sum, s) => sum + s.bandwidthKHz, 0) + activeGates.length * 50
      : 0;

    const connectivityPct = Math.round((activeSinks.length / totalSinks) * 100);

    let status: { label: string; color: string; bg: string; border: string; desc: string } = {
      label: 'OPTIMAL ROUTING',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-800',
      desc: 'All 3 output sinks actively receiving signal streams with low latency.'
    };

    if (connectivityPct === 0) {
      status = {
        label: 'CIRCUIT DISCONNECTED',
        color: 'text-rose-400',
        bg: 'bg-rose-950/80',
        border: 'border-rose-800',
        desc: 'Signal flow blocked! Key intermediate gates are disabled.'
      };
    } else if (connectivityPct < 100) {
      status = {
        label: 'PARTIAL BOTTLENECK',
        color: 'text-amber-400',
        bg: 'bg-amber-950/80',
        border: 'border-amber-800',
        desc: 'Partial network degradation. Some sink channels are isolated.'
      };
    }

    return {
      activeNodeIds: activeNodes,
      activeEdgeIds: activeEdges,
      activeSinkCount: activeSinks.length,
      metrics: {
        enabledGatesCount: enabledGates.length,
        activeGatesCount: activeGates.length,
        totalEnergy,
        maxLatency,
        throughputKHz,
        connectivityPct
      },
      routingStatus: status
    };
  }, [nodes, nodeMap]);

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Header Dashboard & Routing Metrics */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
        
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Interactive Circuit Connection Routing Flow</h3>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Click any gate node on the SVG graph or sidebar toggles to switch state ON/OFF and observe dynamic signal rerouting, path reachability, and energy metrics.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('ALL_ON')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold hover:bg-emerald-900 transition-all text-[11px]"
            >
              Full Mesh (All ON)
            </button>
            <button
              onClick={() => applyPreset('PRIMARY_ONLY')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold hover:bg-cyan-900 transition-all text-[11px]"
            >
              Primary Line (PSWAP)
            </button>
            <button
              onClick={() => applyPreset('FAULT_TEST')}
              className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-800 text-amber-300 font-bold hover:bg-amber-900 transition-all text-[11px]"
            >
              Fault Isolation
            </button>
            <button
              onClick={() => applyPreset('ECO_MODE')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 font-bold hover:bg-purple-900 transition-all text-[11px]"
            >
              Low Energy Mode
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* Status Alert Badge */}
          <div className={`p-3 rounded-xl border ${routingStatus.bg} ${routingStatus.border} col-span-2 md:col-span-1 space-y-1`}>
            <span className="text-[10px] text-zinc-400 block font-bold uppercase">Routing Health</span>
            <div className={`font-black text-sm ${routingStatus.color} flex items-center space-x-1.5`}>
              {metrics.connectivityPct === 100 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : metrics.connectivityPct > 0 ? (
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400" />
              )}
              <span>{routingStatus.label}</span>
            </div>
          </div>

          {/* Active Gates */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
            <span className="text-[10px] text-zinc-500 block font-bold">Active Gates / Total</span>
            <div className="text-sm font-black text-white">
              <span className="text-emerald-400">{metrics.activeGatesCount}</span> / {metrics.enabledGatesCount} Enabled
            </div>
          </div>

          {/* Throughput */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
            <span className="text-[10px] text-zinc-500 block font-bold">Signal Throughput</span>
            <div className="text-sm font-black text-cyan-400">
              {metrics.throughputKHz.toLocaleString()} kHz
            </div>
          </div>

          {/* Propagation Latency */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
            <span className="text-[10px] text-zinc-500 block font-bold">Signal Path Latency</span>
            <div className="text-sm font-black text-amber-400">
              {metrics.maxLatency.toFixed(2)} ns
            </div>
          </div>

          {/* Energy Dissipation */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
            <span className="text-[10px] text-zinc-500 block font-bold">Gate Power Loss</span>
            <div className="text-sm font-black text-purple-400">
              {metrics.totalEnergy.toFixed(2)} fJ / sample
            </div>
          </div>

        </div>

      </div>

      {/* Main Interactive Canvas & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive SVG Circuit Network Graph (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          {/* Canvas Top Bar */}
          <div className="flex items-center justify-between mb-3 text-zinc-400 text-[11px]">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-white">Extropic DEPO Circuit Routing Visualizer</span>
            </div>

            {/* Signal Speed Controller */}
            <div className="flex items-center space-x-2">
              <span className="text-zinc-500">Pulse Speed:</span>
              {[
                { label: '0.5x', val: 4 },
                { label: '1x', val: 2 },
                { label: '2x', val: 1 }
              ].map(sp => (
                <button
                  key={sp.label}
                  onClick={() => setPulseSpeedSec(sp.val)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    pulseSpeedSec === sp.val
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Connection Graph Canvas */}
          <div className="relative w-full overflow-x-auto bg-black/80 rounded-xl border border-zinc-800 p-2">
            <svg
              viewBox="0 0 880 580"
              className="w-full h-auto min-w-[700px] select-none"
              style={{ background: 'radial-gradient(circle at center, #09090b 0%, #000 100%)' }}
            >
              {/* Background Grid Lines */}
              <defs>
                <pattern id="circuitGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="0.5" opacity="0.4" />
                </pattern>

                {/* Animated Line Pulse Effect */}
                <style>{`
                  @keyframes pulseFlow {
                    0% { stroke-dashoffset: 40; }
                    100% { stroke-dashoffset: 0; }
                  }
                  .active-path-pulse {
                    animation: pulseFlow ${pulseSpeedSec}s linear infinite;
                  }
                `}</style>
              </defs>

              <rect width="880" height="580" fill="url(#circuitGrid)" />

              {/* Render Connection Edges */}
              {EDGES.map(edge => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                if (!fromNode || !toNode) return null;

                const isActive = activeEdgeIds.has(edge.id);
                
                // Curved Bezier Path
                const dx = toNode.x - fromNode.x;
                const controlX1 = fromNode.x + dx * 0.45;
                const controlX2 = fromNode.x + dx * 0.55;
                const pathD = `M ${fromNode.x} ${fromNode.y} C ${controlX1} ${fromNode.y}, ${controlX2} ${toNode.y}, ${toNode.x} ${toNode.y}`;

                return (
                  <g key={edge.id}>
                    {/* Background Trace */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isActive ? '#0284c7' : '#27272a'}
                      strokeWidth={isActive ? 3 : 1.5}
                      strokeDasharray={isActive ? 'none' : '4 4'}
                      opacity={isActive ? 0.8 : 0.4}
                    />

                    {/* Active Animated Pulse Overlay */}
                    {isActive && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                        strokeDasharray="8 12"
                        className="active-path-pulse"
                        style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {nodes.map(node => {
                const isActive = activeNodeIds.has(node.id);
                const isGate = node.type === 'GATE';
                const isHovered = hoveredNode?.id === node.id;

                let nodeColor = '#3f3f46'; // Default off
                let strokeColor = '#27272a';

                if (node.type === 'INPUT') {
                  nodeColor = '#10b981'; // Green
                  strokeColor = '#059669';
                } else if (node.type === 'OUTPUT') {
                  nodeColor = isActive ? '#a855f7' : '#3f3f46'; // Purple
                  strokeColor = isActive ? '#9333ea' : '#27272a';
                } else if (isGate) {
                  if (node.enabled) {
                    nodeColor = isActive ? '#f59e0b' : '#d97706'; // Amber
                    strokeColor = isActive ? '#fbbf24' : '#b45309';
                  } else {
                    nodeColor = '#18181b'; // Disabled dark
                    strokeColor = '#e11d48'; // Rose boundary disabled
                  }
                }

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => {
                      if (isGate) toggleGateNode(node.id);
                      setSelectedNodeDetails(node);
                    }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer transition-all"
                  >
                    {/* Glow halo when active or hovered */}
                    {(isActive || isHovered) && (
                      <circle
                        r={isGate ? 32 : 24}
                        fill={nodeColor}
                        opacity="0.2"
                        style={{ filter: 'blur(8px)' }}
                      />
                    )}

                    {/* Node Outer Shape */}
                    {isGate ? (
                      // Rectangular Gate Box
                      <rect
                        x="-45"
                        y="-22"
                        width="90"
                        height="44"
                        rx="10"
                        fill={node.enabled ? '#09090b' : '#000'}
                        stroke={strokeColor}
                        strokeWidth={node.enabled ? (isActive ? 2.5 : 1.5) : 1.5}
                      />
                    ) : (
                      // Circle Pin for Inputs and Outputs
                      <circle
                        r="20"
                        fill="#09090b"
                        stroke={strokeColor}
                        strokeWidth="2"
                      />
                    )}

                    {/* Inner Indicator LED */}
                    <circle
                      cx={isGate ? -28 : 0}
                      cy={isGate ? 0 : -8}
                      r="4"
                      fill={isActive ? '#10b981' : node.enabled ? '#f59e0b' : '#f43f5e'}
                    />

                    {/* Symbol Text */}
                    <text
                      x={isGate ? 4 : 0}
                      y={isGate ? 4 : 8}
                      textAnchor="middle"
                      fill={node.enabled ? '#ffffff' : '#71717a'}
                      fontSize={isGate ? '12' : '10'}
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.symbol}
                    </text>

                    {/* Node Category / Label Text */}
                    <text
                      x="0"
                      y={isGate ? 36 : 32}
                      textAnchor="middle"
                      fill="#a1a1aa"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {node.type === 'GATE' ? (node.enabled ? 'TOGGLE ON' : 'OFF') : node.category}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Canvas Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Active Input Stream</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Active Gate Node</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span>Bypassed / Disabled Gate</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                <span>Sink Output Register</span>
              </div>
            </div>

            <span>Tip: Click any gate node on the graph to toggle state</span>
          </div>

        </div>

        {/* Gate Switch Toggles Sidebar & Node Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Gate Toggle Switch Panel */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-bold text-white text-xs flex items-center space-x-2">
                <Power className="h-4 w-4 text-emerald-400" />
                <span>Gate Toggle Controls</span>
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">
                {nodes.filter(n => n.type === 'GATE' && n.enabled).length} / {nodes.filter(n => n.type === 'GATE').length} ON
              </span>
            </div>

            {/* List of Gate Nodes with Toggle Switches */}
            <div className="space-y-2">
              {nodes
                .filter(n => n.type === 'GATE')
                .map(gate => (
                  <div
                    key={gate.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      gate.enabled
                        ? 'bg-zinc-900 border-zinc-800 text-white'
                        : 'bg-black border-rose-950 text-zinc-500'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <strong className="text-amber-400 font-mono font-bold text-xs">{gate.symbol}</strong>
                        <span className="text-[10px] text-zinc-400 font-mono">({gate.category})</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Power: {gate.energyfJ} fJ • Latency: {gate.latencyNs} ns
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleGateNode(gate.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        gate.enabled ? 'bg-emerald-600' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          gate.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Selected / Hovered Node Inspector Detail */}
          {(selectedNodeDetails || hoveredNode) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
                  <Info className="h-4 w-4" />
                  <span>Node Inspector</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 text-[10px]">
                  {(selectedNodeDetails || hoveredNode)?.symbol}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-sm">{(selectedNodeDetails || hoveredNode)?.label}</strong>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    (selectedNodeDetails || hoveredNode)?.enabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {(selectedNodeDetails || hoveredNode)?.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>

                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {(selectedNodeDetails || hoveredNode)?.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <span className="text-zinc-500 block">Energy Cost</span>
                    <strong className="text-purple-300">{(selectedNodeDetails || hoveredNode)?.energyfJ} fJ</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <span className="text-zinc-500 block">Hop Latency</span>
                    <strong className="text-amber-300">{(selectedNodeDetails || hoveredNode)?.latencyNs} ns</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};
