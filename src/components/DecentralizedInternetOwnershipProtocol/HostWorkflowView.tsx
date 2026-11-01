import React, { useState } from 'react';
import { 
  Globe, 
  Server, 
  Radio, 
  Layers, 
  Zap, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { 
  DomainOwnershipRecord, 
  LogicalSubnet, 
  NetworkNode, 
  VirtualServer, 
  PublishedService,
  TransportType
} from '../../types/diop';

interface HostWorkflowViewProps {
  subnets: LogicalSubnet[];
  nodes: NetworkNode[];
  onCompleteHostPipeline: (payload: {
    domain: string;
    serverName: string;
    nodeId: string;
    subnetId: string;
    vCpu: number;
    ramGB: number;
    serviceName: string;
    serviceEndpoint: string;
    servicePort: number;
    transport: TransportType;
  }) => void;
}

export const HostWorkflowView: React.FC<HostWorkflowViewProps> = ({
  subnets,
  nodes,
  onCompleteHostPipeline
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Step 1: Register Domain
  const [domainName, setDomainName] = useState<string>('vx://neural.inference/compute');
  const [ownerEmail, setOwnerEmail] = useState<string>('drvictoragboola@gmail.com');

  // Step 2: Create Server
  const [serverName, setServerName] = useState<string>('VOX-Neural-Inference-Server');
  const [vCpu, setVCpu] = useState<number>(16);
  const [ramGB, setRamGB] = useState<number>(32);

  // Step 3: Attach Node
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');

  // Step 4: Select Subnet
  const [selectedSubnetId, setSelectedSubnetId] = useState<string>(subnets[0]?.id || '');

  // Step 5: Publish Service
  const [serviceName, setServiceName] = useState<string>('TensorRT LLM Endpoint');
  const [serviceEndpoint, setServiceEndpoint] = useState<string>('/v1/chat/completions');
  const [servicePort, setServicePort] = useState<number>(8095);
  const [serviceTransport, setServiceTransport] = useState<TransportType>('QUIC');

  // Step 6: Telemetry
  const [telemetryEnabled, setTelemetryEnabled] = useState<boolean>(true);
  const [anomalyDetection, setAnomalyDetection] = useState<boolean>(true);

  const handleFinish = () => {
    onCompleteHostPipeline({
      domain: domainName,
      serverName,
      nodeId: selectedNodeId,
      subnetId: selectedSubnetId,
      vCpu,
      ramGB,
      serviceName,
      serviceEndpoint,
      servicePort,
      transport: serviceTransport
    });
    setIsCompleted(true);
  };

  const steps = [
    { num: 1, label: 'Register Domain', icon: Globe },
    { num: 2, label: 'Create Server', icon: Server },
    { num: 3, label: 'Attach Node', icon: Radio },
    { num: 4, label: 'Select Subnet', icon: Layers },
    { num: 5, label: 'Publish Service', icon: Zap },
    { num: 6, label: 'Activate Telemetry', icon: Activity }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-black text-white">Host Wizard Pipeline</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            6-step guided protocol workflow: <strong className="text-zinc-200">Register Domain ➔ Create Server ➔ Attach Node ➔ Select Subnet ➔ Publish Service ➔ Activate Telemetry</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-xs font-bold">
            STEP {currentStep} OF 6
          </span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map(step => {
          const Icon = step.icon;
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          return (
            <div
              key={step.num}
              onClick={() => {
                if (step.num <= currentStep) setCurrentStep(step.num);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isCurrent 
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/50' 
                  : isDone
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-black ${isCurrent ? 'text-cyan-300' : 'text-zinc-500'}`}>
                  0{step.num}
                </span>
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Icon className={`h-3.5 w-3.5 ${isCurrent ? 'text-cyan-400' : 'text-zinc-500'}`} />
                )}
              </div>
              <span className={`text-xs font-bold ${isCurrent ? 'text-white font-black' : ''}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Contents */}
      {!isCompleted ? (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-5">
          
          {/* STEP 1: REGISTER DOMAIN */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>Step 1: Register Native Namespace Domain (NIP-OWNERSHIP)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Claim a permanent, non-custodial decentralized URI to bind your virtual server cluster.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Native Domain URI:</label>
                  <input
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Owner Identity / Contact:</label>
                  <input
                    type="text"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CREATE SERVER */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Server className="h-4 w-4 text-emerald-400" />
                <span>Step 2: Create Virtual Server Instance (VSP-SERVER)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Configure vCPU allocation, memory mapped ring buffers, and container parameters.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Virtual Server Name:</label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">vCPU Cores:</label>
                  <input
                    type="number"
                    value={vCpu}
                    onChange={(e) => setVCpu(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">RAM (GB):</label>
                  <input
                    type="number"
                    value={ramGB}
                    onChange={(e) => setRamGB(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ATTACH NODE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Radio className="h-4 w-4 text-amber-400" />
                <span>Step 3: Attach to Physical / Virtual Edge Node (VSP-NODE)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Select an attested edge node to host the container execution engine.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {nodes.map(node => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedNodeId === node.id
                        ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-500'
                        : 'bg-black border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-xs">{node.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400">{node.healthScore}% HEALTH</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
                      <span>{node.ipAddress}:{node.port}</span>
                      <span>{node.region}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: SELECT SUBNET */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>Step 4: Select Logical Overlay Subnet (VSP-SUBNET)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Enables encrypted mesh routing across the chosen CIDR overlay network.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {subnets.map(subnet => (
                  <div
                    key={subnet.id}
                    onClick={() => setSelectedSubnetId(subnet.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedSubnetId === subnet.id
                        ? 'bg-purple-950/40 border-purple-400 ring-1 ring-purple-500'
                        : 'bg-black border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-xs">{subnet.name}</span>
                      <span className="text-[10px] font-mono text-purple-300 font-bold">{subnet.cidr}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      <span>{subnet.encryptionMode.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: PUBLISH SERVICE */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span>Step 5: Publish Service Ingress Endpoint (VSP-HOST)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Define the service name, endpoint route, listening port, and underlying transport.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Service Name:</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Endpoint Path:</label>
                  <input
                    type="text"
                    value={serviceEndpoint}
                    onChange={(e) => setServiceEndpoint(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-blue-300 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Port:</label>
                  <input
                    type="number"
                    value={servicePort}
                    onChange={(e) => setServicePort(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Transport:</label>
                  <select
                    value={serviceTransport}
                    onChange={(e) => setServiceTransport(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="QUIC">QUIC</option>
                    <option value="HTTP/HTTPS">HTTP/HTTPS</option>
                    <option value="WebSocket">WebSocket</option>
                    <option value="WireGuard">WireGuard</option>
                    <option value="TCP">TCP</option>
                    <option value="gRPC">gRPC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: ACTIVATE TELEMETRY */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Step 6: Activate Real-Time Telemetry &amp; Anomaly Stream (VSP-TELEMETRY)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Enables event-driven telemetry collection, packet trace buffers, and health probes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-black border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Real-Time UDP Telemetry Stream</span>
                    <span className="text-[10px] text-zinc-500">Streams CPU/RAM and latency to control plane</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={telemetryEnabled}
                    onChange={(e) => setTelemetryEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-black border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Autonomous Anomaly Detector</span>
                    <span className="text-[10px] text-zinc-500">Flags jitter spikes, dropped packets &amp; replay attacks</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={anomalyDetection}
                    onChange={(e) => setAnomalyDetection(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition-all disabled:opacity-30 cursor-pointer"
            >
              Previous Step
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black font-black text-xs transition-all shadow-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Deploy &amp; Activate Host Infrastructure</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Success screen */
        <div className="p-8 bg-zinc-900 border border-emerald-500/40 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-base font-black text-white">
            Hosting Infrastructure Activated Successfully!
          </h4>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto font-mono">
            Domain <strong className="text-cyan-300">{domainName}</strong> is now bound to <strong className="text-emerald-300">{serverName}</strong>. Service <strong className="text-blue-300">{serviceEndpoint}</strong> is listening on port {servicePort} via {serviceTransport}.
          </p>

          <button
            onClick={() => {
              setIsCompleted(false);
              setCurrentStep(1);
            }}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
          >
            Launch Another Host Workflow
          </button>
        </div>
      )}

    </div>
  );
};
