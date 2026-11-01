import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Code2,
  Activity,
  ShieldAlert,
  Flame,
  Terminal
} from 'lucide-react';
import { VIPSandboxTest } from '../../types/vip';
import { VIPEngine } from '../../services/vipEngine';

interface VipSandboxStudioProps {
  initialTests: VIPSandboxTest[];
  defaultProtocolCode?: string;
}

export const VipSandboxStudio: React.FC<VipSandboxStudioProps> = ({
  initialTests,
  defaultProtocolCode
}) => {
  const [tests, setTests] = useState<VIPSandboxTest[]>(initialTests);
  const [activeTest, setActiveTest] = useState<VIPSandboxTest | null>(initialTests[0] || null);
  const [isRunning, setIsRunning] = useState(false);
  const [customProtocol, setCustomProtocol] = useState(defaultProtocolCode || 'NIP-PACKET');

  const handleRunTest = (testId: string) => {
    setIsRunning(true);
    setTimeout(() => {
      const result = VIPEngine.runSandboxScenario(testId);
      setTests((prev) => prev.map((t) => (t.id === testId ? result : t)));
      setActiveTest(result);
      setIsRunning(false);
    }, 450);
  };

  const handleRunAll = () => {
    setIsRunning(true);
    setTimeout(() => {
      const updated = tests.map((t) => VIPEngine.runSandboxScenario(t.id));
      setTests(updated);
      setActiveTest(updated[0]);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Isolated Protocol & Network Sandbox
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Deterministic simulation testbed executing protocol compliance checks, wire fuzzing, route convergence, and tamper detection tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAll}
            disabled={isRunning}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
            <span>Execute All Test Suites</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Test Scenarios & Detailed Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Test Scenarios */}
        <div className="lg:col-span-5 space-y-3">
          {tests.map((t) => {
            const isSelected = activeTest?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTest(t)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-950/10 shadow-lg'
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        t.status === 'PASSED'
                          ? 'bg-emerald-400'
                          : t.status === 'RUNNING'
                          ? 'bg-amber-400 animate-pulse'
                          : t.status === 'FAILED'
                          ? 'bg-rose-500'
                          : 'bg-zinc-500'
                      }`}
                    />
                    <span className="font-bold text-sm text-zinc-100">{t.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {t.protocolCode}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>Packets Injected: <span className="text-zinc-200">{t.injectedPacketsCount}</span></span>
                  <span
                    className={`font-bold ${
                      t.status === 'PASSED'
                        ? 'text-emerald-400'
                        : t.status === 'FAILED'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {t.status} ({t.executionTimeMs}ms)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Execution Terminal & Output */}
        <div className="lg:col-span-7">
          {activeTest ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">{activeTest.protocolCode}</span>
                    <span className="text-xs font-mono text-zinc-400">● {activeTest.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-100">{activeTest.name}</h3>
                </div>

                <button
                  onClick={() => handleRunTest(activeTest.id)}
                  disabled={isRunning}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Run Suite</span>
                </button>
              </div>

              {/* Execution Summary Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">PACKETS PROCESSED</div>
                  <div className="text-zinc-200 font-bold">{activeTest.injectedPacketsCount}</div>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">LATENCY JITTER</div>
                  <div className="text-emerald-400 font-bold">{activeTest.latencyJitterMs}ms</div>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">EXECUTION TIME</div>
                  <div className="text-amber-400 font-bold">{activeTest.executionTimeMs}ms</div>
                </div>
              </div>

              {/* Terminal Logs Window */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Sandbox Execution Console Output
                  </span>
                  <span className="text-[10px] text-zinc-500">TTY: /dev/vnet-sandbox</span>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5 max-h-[300px] overflow-y-auto">
                  {activeTest.terminalLogs.map((line, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-600 select-none">$</span>
                      <span className={line.includes('SUCCESS') || line.includes('PASSED') ? 'text-emerald-400 font-semibold' : line.includes('INSPECT') ? 'text-cyan-400' : 'text-zinc-300'}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a test scenario on the left to inspect logs or run sandbox execution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
