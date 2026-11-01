import React, { useState, useEffect, useMemo } from 'react';
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
  Monitor,
  Zap,
  RefreshCw,
  HardDrive,
  Layers,
  Sparkles,
  Sliders,
  Play,
  Pause,
  Trash2,
  Download,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Radio,
  Gauge,
  Workflow
} from 'lucide-react';

interface TelemetryPoint {
  time: string;
  fps: number;
  frameTimeMs: number;
  layoutReflowMs: number;
  gpuCompositorMs: number;
  memoryUsedMb: number;
  eventBusQueue: number;
}

interface KernelThread {
  id: string;
  name: string;
  prio: 'HIGH' | 'REALTIME' | 'NORMAL';
  cpuPct: number;
  memMb: number;
  status: 'RUNNING' | 'IDLE' | 'WAITING';
}

const INITIAL_THREADS: KernelThread[] = [
  { id: 'T-001', name: 'x16-ui-render-pipeline', prio: 'REALTIME', cpuPct: 18.4, memMb: 64, status: 'RUNNING' },
  { id: 'T-002', name: 'x16-gpu-compositor-v2', prio: 'REALTIME', cpuPct: 12.1, memMb: 128, status: 'RUNNING' },
  { id: 'T-003', name: 'x16-input-event-dispatcher', prio: 'HIGH', cpuPct: 4.2, memMb: 16, status: 'RUNNING' },
  { id: 'T-004', name: 'x16-virtual-dom-reconciler', prio: 'HIGH', cpuPct: 9.8, memMb: 42, status: 'RUNNING' },
  { id: 'T-005', name: 'x16-memory-gc-allocator', prio: 'NORMAL', cpuPct: 1.5, memMb: 32, status: 'IDLE' },
  { id: 'T-006', name: 'x16-ipc-subledger-bridge', prio: 'HIGH', cpuPct: 6.2, memMb: 28, status: 'RUNNING' }
];

export const X16OsUiTelemetryStudio: React.FC = () => {
  const [isLive, setIsLive] = useState<boolean>(true);
  const [targetFps, setTargetFps] = useState<60 | 120 | 240>(120);
  const [subsystemFilter, setSubsystemFilter] = useState<'ALL' | 'Kernel' | 'RenderEngine' | 'InputBus' | 'MemoryAllocator' | 'GPUCompositor'>('ALL');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'threads' | 'events' | 'actions' | 'os_io_gates'>('os_io_gates');
  const [isGcRunning, setIsGcRunning] = useState<boolean>(false);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // OS Gate Series for I/O Operations State
  const [selectedIoChannel, setSelectedIoChannel] = useState<'NVME_DISK' | 'NETWORK_SOCKET' | 'GPU_VRAM' | 'IPC_EVENT_BUS' | 'SENSOR_PERIPHERAL'>('NVME_DISK');
  const [activeGateSeries, setActiveGateSeries] = useState<string[]>(['PSWAP', 'PROT', 'PAND', 'PXOR', 'PMIX', 'PFACT']);
  const [isTransformingIo, setIsTransformingIo] = useState<boolean>(false);
  const [ioParams, setIoParams] = useState({
    bufferSizeKb: 1024,
    stochasticBeta: 2.4,
    entropyNoiseRatio: 0.15
  });
  const [ioMetrics, setIoMetrics] = useState({
    throughputMbps: 4850,
    latencyUs: 42,
    errorCorrectionPcnt: 99.8,
    energyPerBitFj: 1.2
  });
  const [ioTelemetrySeries, setIoTelemetrySeries] = useState<Array<{ time: string; throughput: number; latency: number }>>(() => {
    const points = [];
    const now = new Date();
    for (let i = 10; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 2000);
      points.push({
        time: t.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
        throughput: Math.floor(4200 + Math.random() * 800),
        latency: Number((35 + Math.random() * 15).toFixed(1))
      });
    }
    return points;
  });
  const [ioExecutionLogs, setIoExecutionLogs] = useState<Array<{ id: string; time: string; gate: string; msg: string }>>([
    { id: '1', time: new Date().toLocaleTimeString(), gate: 'PSWAP', msg: 'Kernel user-space I/O buffer pages swapped to DMA hardware buffer cleanly.' },
    { id: '2', time: new Date().toLocaleTimeString(), gate: 'PROT', msg: 'Asynchronous I/O request queue phase bias rotated (+30°).' },
    { id: '3', time: new Date().toLocaleTimeString(), gate: 'PXOR', msg: 'Spin-glass parity correction applied to NVMe page frames. 0 checksum errors.' },
    { id: '4', time: new Date().toLocaleTimeString(), gate: 'PMIX', msg: 'Thermal noise entropy injected to damp TCP socket read jitter.' }
  ]);

  const toggleGateInSeries = (gateSymbol: string) => {
    setActiveGateSeries(prev => 
      prev.includes(gateSymbol) ? prev.filter(g => g !== gateSymbol) : [...prev, gateSymbol]
    );
  };

  const handleRunIoGateTransformation = () => {
    setIsTransformingIo(true);
    setToastMessage(`Executing Gate Series Transformation on ${selectedIoChannel}...`);

    setTimeout(() => {
      setIsTransformingIo(false);
      const newThroughput = Math.floor(4500 + activeGateSeries.length * 120 + Math.random() * 500);
      const newLatency = Number((25 + (6 - activeGateSeries.length) * 5 + Math.random() * 10).toFixed(1));

      setIoMetrics({
        throughputMbps: newThroughput,
        latencyUs: newLatency,
        errorCorrectionPcnt: Number((99.5 + activeGateSeries.length * 0.08).toFixed(1)),
        energyPerBitFj: Number((0.9 + activeGateSeries.length * 0.1).toFixed(2))
      });

      const nowStr = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
      setIoTelemetrySeries(prev => [
        ...prev.slice(1),
        { time: nowStr, throughput: newThroughput, latency: newLatency }
      ]);

      setIoExecutionLogs(prev => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          gate: activeGateSeries[0] || 'GATE',
          msg: `OS Function executed ${activeGateSeries.join(' → ')} transformation on ${selectedIoChannel} (${ioParams.bufferSizeKb}KB buffer, β=${ioParams.stochasticBeta}).`
        },
        ...prev.slice(0, 25)
      ]);

      setToastMessage(`OS Gate Transformation Complete: ${newThroughput} MB/s throughput, ${newLatency}µs latency.`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Time series frame telemetry data
  const [telemetryData, setTelemetryData] = useState<TelemetryPoint[]>(() => {
    const points: TelemetryPoint[] = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 1000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const baseFps = 118 + Math.floor(Math.random() * 4);
      points.push({
        time: timeStr,
        fps: baseFps,
        frameTimeMs: Number((1000 / baseFps).toFixed(2)),
        layoutReflowMs: Number((0.8 + Math.random() * 0.6).toFixed(2)),
        gpuCompositorMs: Number((1.2 + Math.random() * 0.8).toFixed(2)),
        memoryUsedMb: Math.floor(210 + Math.random() * 30),
        eventBusQueue: Math.floor(2 + Math.random() * 12)
      });
    }
    return points;
  });

  // Event log telemetry feed
  const [eventLogs, setEventLogs] = useState<Array<{ id: string; time: string; subsystem: string; level: 'INFO' | 'WARN' | 'EXEC'; msg: string }>>([
    { id: '1', time: new Date().toLocaleTimeString(), subsystem: 'Kernel', level: 'INFO', msg: 'X16 Micro-Kernel O/S UI Subsystem Initialized on 16 Cores' },
    { id: '2', time: new Date().toLocaleTimeString(), subsystem: 'RenderEngine', level: 'INFO', msg: 'Hardware accelerated VSync synchronized at 120Hz (8.33ms frame budget)' },
    { id: '3', time: new Date().toLocaleTimeString(), subsystem: 'GPUCompositor', level: 'INFO', msg: 'Metal/Vulkan graphics pipeline buffer allocated: 256MB VRAM' },
    { id: '4', time: new Date().toLocaleTimeString(), subsystem: 'InputBus', level: 'INFO', msg: 'Sub-millisecond touch/pointer event polling registered (1000Hz rate)' }
  ]);

  // Live telemetry streaming interval
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTelemetryData(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const spikeMultiplier = isSimulatingSpike ? 2.2 : 1.0;
        const targetFpsBase = targetFps;
        const currentFps = Math.max(30, Math.floor((targetFpsBase - (isSimulatingSpike ? 35 : Math.random() * 3))));
        const frameTime = Number((1000 / currentFps).toFixed(2));
        const layoutReflow = Number(((0.9 + Math.random() * 0.5) * spikeMultiplier).toFixed(2));
        const gpuComp = Number(((1.3 + Math.random() * 0.7) * spikeMultiplier).toFixed(2));
        const mem = Math.min(1024, Math.floor((220 + Math.random() * 40) * (isSimulatingSpike ? 1.4 : 1.0)));
        const queue = Math.floor((4 + Math.random() * 10) * spikeMultiplier);

        const newPoint: TelemetryPoint = {
          time: timeStr,
          fps: currentFps,
          frameTimeMs: frameTime,
          layoutReflowMs: layoutReflow,
          gpuCompositorMs: gpuComp,
          memoryUsedMb: mem,
          eventBusQueue: queue
        };

        return [...prev.slice(1), newPoint];
      });

      // Add random log periodically
      if (Math.random() > 0.6) {
        const subsystems = ['Kernel', 'RenderEngine', 'InputBus', 'MemoryAllocator', 'GPUCompositor'] as const;
        const sub = subsystems[Math.floor(Math.random() * subsystems.length)];
        const newLog = {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          subsystem: sub,
          level: isSimulatingSpike ? ('WARN' as const) : ('INFO' as const),
          msg: isSimulatingSpike
            ? `[HEAVY LOAD] Reflow queue bottleneck detected in ${sub} thread pool`
            : `[TELEMETRY] ${sub} heartbeat passed: frame budget ${targetFps}Hz stable`
        };
        setEventLogs(prev => [newLog, ...prev.slice(0, 49)]);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isLive, targetFps, isSimulatingSpike]);

  // Current metric highlights
  const currentMetrics = useMemo(() => {
    const latest = telemetryData[telemetryData.length - 1] || {
      fps: 120,
      frameTimeMs: 8.33,
      layoutReflowMs: 1.1,
      gpuCompositorMs: 1.4,
      memoryUsedMb: 240,
      eventBusQueue: 6
    };

    return {
      fps: latest.fps,
      frameTimeMs: latest.frameTimeMs,
      layoutReflowMs: latest.layoutReflowMs,
      gpuCompositorMs: latest.gpuCompositorMs,
      memoryUsedMb: latest.memoryUsedMb,
      eventBusQueue: latest.eventBusQueue,
      frameBudgetMs: Number((1000 / targetFps).toFixed(2))
    };
  }, [telemetryData, targetFps]);

  // Execute Garbage Collection
  const handleRunGc = () => {
    setIsGcRunning(true);
    setToastMessage('X16 Memory Allocator: Executing Heap Garbage Collection & Cache Purge...');
    setTimeout(() => {
      setIsGcRunning(false);
      setToastMessage('Garbage Collection Complete! Freed 84MB VRAM & Heap Cache.');
      setEventLogs(prev => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          subsystem: 'MemoryAllocator',
          level: 'EXEC',
          msg: 'X16 GC Executed: Compacting heap memory allocations & flushing stale UI DOM references'
        },
        ...prev
      ]);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1500);
  };

  // Toggle Frame Spike
  const handleToggleSpike = () => {
    setIsSimulatingSpike(prev => !prev);
    const mode = !isSimulatingSpike ? 'ENABLED' : 'DISABLED';
    setToastMessage(`UI Render Load Stress Simulation ${mode}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered Event Logs
  const filteredLogs = useMemo(() => {
    if (subsystemFilter === 'ALL') return eventLogs;
    return eventLogs.filter(l => l.subsystem === subsystemFilter);
  }, [eventLogs, subsystemFilter]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-bold shadow-2xl flex items-center justify-between animate-fade-in border border-red-400/40">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-300 animate-bounce" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded uppercase">X16 O/S KERNEL SYSTEM</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 rounded-2xl text-white shadow-xl flex items-center justify-center">
              <Activity className="h-7 w-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  X16 O/S UI Telemetry & Micro-Kernel Inspector
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>X16 KERNEL ACTIVE</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  {targetFps}Hz HIGH PRECISION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl font-mono">
                Sub-millisecond frame rendering telemetry, UI layout reflow, GPU compositing latency, event bus throughput, and kernel process memory diagnostics for the X16 O/S user interface engine.
              </p>
            </div>
          </div>

          {/* Quick Toolbar Actions */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Live Stream Toggle */}
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-2 rounded-xl border font-bold flex items-center space-x-2 transition-all ${
                isLive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isLive ? <Pause className="h-3.5 w-3.5 text-emerald-400" /> : <Play className="h-3.5 w-3.5 text-amber-400" />}
              <span>{isLive ? 'Streaming Live' : 'Telemetry Paused'}</span>
            </button>

            {/* Target FPS Selector */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex space-x-1">
              {([60, 120, 240] as const).map(fpsVal => (
                <button
                  key={fpsVal}
                  onClick={() => setTargetFps(fpsVal)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    targetFps === fpsVal
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fpsVal}Hz
                </button>
              ))}
            </div>

            {/* Run Garbage Collector */}
            <button
              onClick={handleRunGc}
              disabled={isGcRunning}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl font-bold flex items-center space-x-1.5 transition-all"
            >
              <Trash2 className={`h-3.5 w-3.5 ${isGcRunning ? 'animate-spin' : ''}`} />
              <span>{isGcRunning ? 'Cleaning...' : 'Purge GC Cache'}</span>
            </button>

            {/* Simulate Stress Spike */}
            <button
              onClick={handleToggleSpike}
              className={`px-3 py-2 rounded-xl border font-bold flex items-center space-x-1.5 transition-all ${
                isSimulatingSpike
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300'
              }`}
            >
              <Zap className={`h-3.5 w-3.5 ${isSimulatingSpike ? 'text-amber-400 animate-bounce' : ''}`} />
              <span>{isSimulatingSpike ? 'Spike Active' : 'Inject Load Spike'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('os_io_gates')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'os_io_gates'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Workflow className="h-3.5 w-3.5 text-purple-300" />
            <span>OS Gate Series for I/O Operations</span>
            <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-800 text-[9px] rounded font-bold">INTERACTIVE</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Gauge className="h-3.5 w-3.5 text-emerald-400" />
            <span>Frame Pipeline & Render Time</span>
          </button>

          <button
            onClick={() => setActiveTab('threads')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'threads'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-amber-300" />
            <span>X16 Kernel Thread Allocator</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'events'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-purple-300" />
            <span>Event Bus & Input Latency</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'actions'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-blue-300" />
            <span>O/S Subsystem Diagnostic Actions</span>
          </button>
        </div>
      </div>

      {/* Top High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        
        {/* Card 1: FPS Render Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">UI Render Rate</span>
            <Monitor className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">{currentMetrics.fps}</span>
            <span className="text-xs text-slate-400 font-bold">FPS</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Target: <strong className="text-white">{targetFps} Hz</strong></span>
            <span>Budget: <strong className="text-amber-300">{currentMetrics.frameBudgetMs}ms</strong></span>
          </div>
        </div>

        {/* Card 2: Frame Time Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Avg Frame Latency</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black ${currentMetrics.frameTimeMs > currentMetrics.frameBudgetMs ? 'text-red-400' : 'text-amber-300'}`}>
              {currentMetrics.frameTimeMs}
            </span>
            <span className="text-xs text-slate-400 font-bold">ms</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Reflow: <strong className="text-purple-300">{currentMetrics.layoutReflowMs}ms</strong></span>
            <span>GPU Comp: <strong className="text-blue-300">{currentMetrics.gpuCompositorMs}ms</strong></span>
          </div>
        </div>

        {/* Card 3: Memory Heap Usage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Kernel VRAM / Heap</span>
            <HardDrive className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-purple-300">{currentMetrics.memoryUsedMb}</span>
            <span className="text-xs text-slate-400 font-bold">MB</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${currentMetrics.memoryUsedMb > 400 ? 'bg-red-500' : 'bg-purple-500'}`}
              style={{ width: `${(currentMetrics.memoryUsedMb / 1024) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 4: Event Bus Throughput */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">IPC Event Queue</span>
            <Radio className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-blue-300">{currentMetrics.eventBusQueue}</span>
            <span className="text-xs text-slate-400 font-bold">events</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>0 Deadlocks / Drop</span>
          </div>
        </div>

        {/* Card 5: Subsystem Health Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">X16 O/S Health</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">OPTIMAL</span>
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Kernel Ver: <strong className="text-white">v16.4.2-rt</strong></span>
          </div>
        </div>

      </div>

      {/* Main Tab Panels */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main AreaChart (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <Gauge className="h-5 w-5 text-rose-500" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Real-Time UI Frame Render Pipeline Telemetry
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sub-millisecond tracking of FPS, DOM Reflow, and GPU Compositor times
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="flex items-center space-x-1">
                  <span className="h-3 w-3 rounded bg-emerald-500" />
                  <span className="text-slate-300">FPS</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="h-3 w-3 rounded bg-purple-500" />
                  <span className="text-slate-300">Reflow (ms)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="h-3 w-3 rounded bg-blue-500" />
                  <span className="text-slate-300">GPU Comp (ms)</span>
                </span>
              </div>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Area type="monotone" dataKey="fps" name="Render Rate (FPS)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFps)" />
                  <Area type="monotone" dataKey="layoutReflowMs" name="DOM Reflow (ms)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorReflow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Diagnostics Panel (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-2xl font-mono text-xs">
            <div className="border-b border-slate-800 pb-2.5">
              <h4 className="font-bold text-sm text-white">X16 O/S Pipeline Diagnostics</h4>
              <p className="text-[11px] text-slate-400">Micro-kernel VSync & GPU Shader Sync</p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Hardware VSync Lock</span>
                <div className="flex justify-between items-center">
                  <span className="text-slate-200 font-bold">120Hz VSync Engine</span>
                  <span className="text-emerald-400 font-bold">LOCKED</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Graphics Driver Pipeline</span>
                <div className="flex justify-between items-center">
                  <span className="text-slate-200 font-bold">Vulkan 1.3 / Metal 3</span>
                  <span className="text-blue-400 font-bold">ACTIVE</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Canvas Paint Latency</span>
                <div className="flex justify-between items-center">
                  <span className="text-slate-200 font-bold">0.42 ms / frame</span>
                  <span className="text-amber-300 font-bold">SUB-MS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Threads Tab */}
      {activeTab === 'threads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-2xl font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">X16 Micro-Kernel Thread Pool Manager</h3>
              <p className="text-slate-400">Inspect real-time process threads assigned to UI render engine, event loop, and subledger IPC</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold">
              6 THREADS ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="p-3">Thread ID</th>
                  <th className="p-3">Process Name</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">CPU %</th>
                  <th className="p-3">Memory (MB)</th>
                  <th className="p-3">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {INITIAL_THREADS.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-amber-300">{t.id}</td>
                    <td className="p-3 text-white font-bold">{t.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.prio === 'REALTIME' ? 'bg-red-500/20 text-rose-300 border border-rose-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                        {t.prio}
                      </span>
                    </td>
                    <td className="p-3 text-purple-300 font-bold">{t.cpuPct}%</td>
                    <td className="p-3 text-slate-300">{t.memMb} MB</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Event Logs Tab */}
      {activeTab === 'events' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-2xl font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">X16 O/S Live Event Stream & Subsystem Logs</h3>
              <p className="text-slate-400">Subsystem filtering & real-time IPC message logging</p>
            </div>

            <select
              value={subsystemFilter}
              onChange={(e) => setSubsystemFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-bold text-xs focus:outline-none"
            >
              <option value="ALL">Filter All Subsystems</option>
              <option value="Kernel">Kernel</option>
              <option value="RenderEngine">RenderEngine</option>
              <option value="InputBus">InputBus</option>
              <option value="MemoryAllocator">MemoryAllocator</option>
              <option value="GPUCompositor">GPUCompositor</option>
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 max-h-96 overflow-y-auto font-mono text-xs">
            {filteredLogs.map(log => (
              <div key={log.id} className="flex items-start space-x-3 text-slate-300 hover:bg-slate-900/50 p-1.5 rounded transition-colors">
                <span className="text-slate-500 shrink-0">{log.time}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${log.level === 'EXEC' ? 'bg-amber-500/20 text-amber-300' : log.level === 'WARN' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                  {log.subsystem}
                </span>
                <span className="text-slate-200">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === 'actions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 shadow-2xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">O/S Subsystem Diagnostic Functions</h3>
            <p className="text-slate-400">Trigger low-level micro-kernel tasks & performance calibrations</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <Trash2 className="h-4 w-4" />
                <span>Memory Heap Purge</span>
              </div>
              <p className="text-slate-400 text-[11px]">Free dead DOM nodes and unreferenced texture buffers from VRAM.</p>
              <button
                onClick={handleRunGc}
                disabled={isGcRunning}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
              >
                Execute Heap GC
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-300 font-bold">
                <Zap className="h-4 w-4" />
                <span>Render Load Stress Simulation</span>
              </div>
              <p className="text-slate-400 text-[11px]">Inject synthetic layout reflow queues to test frame drops.</p>
              <button
                onClick={handleToggleSpike}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl"
              >
                {isSimulatingSpike ? 'Disable Stress Test' : 'Start Stress Test'}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Download className="h-4 w-4" />
                <span>Telemetry Stack Snapshot</span>
              </div>
              <p className="text-slate-400 text-[11px]">Dump JSON telemetry logs for offline profiling & benchmarking.</p>
              <button
                onClick={() => {
                  setToastMessage('X16 Telemetry Log Stack Exported successfully.');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700"
              >
                Download Snapshot JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OS Function Gate Series for I/O Operations Tab */}
      {activeTab === 'os_io_gates' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-white space-y-6 shadow-2xl font-mono text-xs">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Workflow className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">OS Function Gate Series for I/O Operations</h3>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                  PSWAP • PROT • PAND • PXOR • PMIX • PFACT
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Apply parametrised stochastic logic gate series to low-level micro-kernel I/O channels (NVMe Disk, Socket Buffers, GPU VRAM, IPC Signals).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunIoGateTransformation}
                disabled={isTransformingIo}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <Zap className="h-4 w-4 text-amber-300" />
                <span>{isTransformingIo ? 'Executing Transformation...' : 'Run Gate Series Transformation'}</span>
              </button>
            </div>
          </div>

          {/* Controls Row: Channel Selector & Active Gate Series */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: OS I/O Channel Selector & Parameters (4 cols) */}
            <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-cyan-400" />
                <span>Target OS Kernel I/O Channel</span>
              </h4>

              <div className="space-y-2">
                {[
                  { id: 'NVME_DISK', name: 'NVMe Disk Storage Direct I/O', desc: 'PCIe 5.0 Direct Memory Access Page Buffers' },
                  { id: 'NETWORK_SOCKET', name: 'Network Socket TCP/UDP Buffer', desc: 'Kernel Ring Buffer & Epoll Queue I/O' },
                  { id: 'GPU_VRAM', name: 'GPU VRAM Memory-Mapped I/O', desc: 'Metal / Vulkan Shared Buffer Pages' },
                  { id: 'IPC_EVENT_BUS', name: 'IPC Ring & Event Bus Signal', desc: 'Sub-millisecond Inter-Process Communication' },
                  { id: 'SENSOR_PERIPHERAL', name: 'Sensor & Hardware Peripheral I/O', desc: '1000Hz Direct Sensor IRQ DMA Streams' },
                ].map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedIoChannel(channel.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedIoChannel === channel.id
                        ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs text-purple-300">{channel.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{channel.desc}</div>
                  </div>
                ))}
              </div>

              {/* Operating Parameters */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Buffer Window Size:</span>
                  <span className="text-cyan-300 font-bold">{ioParams.bufferSizeKb} KB</span>
                </div>
                <input
                  type="range"
                  min={128}
                  max={8192}
                  step={128}
                  value={ioParams.bufferSizeKb}
                  onChange={(e) => setIoParams({ ...ioParams, bufferSizeKb: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />

                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Stochastic Inverse Temp (β):</span>
                  <span className="text-amber-300 font-bold">{ioParams.stochasticBeta}</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5.0}
                  step={0.1}
                  value={ioParams.stochasticBeta}
                  onChange={(e) => setIoParams({ ...ioParams, stochasticBeta: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Right: Active Gate Series Sequence & Interactive Pipeline (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>Active Gate Series Pipeline Sequence</span>
                </h4>
                <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800 font-bold">
                  {activeGateSeries.length} Gates Active
                </span>
              </div>

              {/* Gate Series Pipeline Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { symbol: 'PSWAP', name: 'Probabilistic Swap Gate', desc: 'Swaps I/O buffer user-space and DMA hardware pages', color: 'emerald' },
                  { symbol: 'PROT', name: 'Phase Rotation Gate', desc: 'Rotates asynchronous request queue phase bias', color: 'cyan' },
                  { symbol: 'PAND', name: 'Probabilistic AND Gate', desc: 'Multi-channel soft synchronization constraint', color: 'indigo' },
                  { symbol: 'PXOR', name: 'Parity XOR Gate', desc: 'Spin-glass parity correction on raw I/O frames', color: 'rose' },
                  { symbol: 'PMIX', name: 'Entropy Mixer Gate', desc: 'Thermal noise injection for socket jitter damping', color: 'amber' },
                  { symbol: 'PFACT', name: 'Factor Constraint Node', desc: 'Evaluates graph potential energy on I/O channels', color: 'purple' },
                ].map((gateItem) => {
                  const isEnabled = activeGateSeries.includes(gateItem.symbol);
                  return (
                    <div
                      key={gateItem.symbol}
                      onClick={() => toggleGateInSeries(gateItem.symbol)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                        isEnabled
                          ? 'bg-slate-900 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-50 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-purple-300">{gateItem.symbol}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${isEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-500'}`}>
                          {isEnabled ? 'ENABLED' : 'BYPASSED'}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-200">{gateItem.name}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{gateItem.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Live Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">I/O Throughput</span>
                  <strong className="text-sm text-emerald-400 font-bold">{ioMetrics.throughputMbps} MB/s</strong>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Buffer Latency</span>
                  <strong className="text-sm text-cyan-300 font-bold">{ioMetrics.latencyUs} µs</strong>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Spin-Glass Parity</span>
                  <strong className="text-sm text-purple-300 font-bold">{ioMetrics.errorCorrectionPcnt}% Corrected</strong>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Energy / Bit</span>
                  <strong className="text-sm text-amber-300 font-bold">{ioMetrics.energyPerBitFj} fJ</strong>
                </div>
              </div>

              {/* Live Chart: Throughput & Latency over time */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">OS Function Gate Transformation Telemetry Stream</span>
                  <span className="text-[10px] text-cyan-400">Green: MB/s Throughput • Purple: Buffer Latency (µs)</span>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ioTelemetrySeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#a855f7" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Area yAxisId="left" type="monotone" dataKey="throughput" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                      <Area yAxisId="right" type="monotone" dataKey="latency" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Execution Log Stream */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-300 text-xs flex items-center space-x-1.5">
                  <Terminal className="h-3.5 w-3.5 text-purple-400" />
                  <span>Kernel I/O Gate Series Execution Trace Logs</span>
                </h5>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 max-h-40 overflow-y-auto text-[10px] font-mono">
                  {ioExecutionLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-2 text-slate-300">
                      <span className="text-slate-500 shrink-0">{log.time}</span>
                      <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold shrink-0">
                        {log.gate}
                      </span>
                      <span className="text-slate-200">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
