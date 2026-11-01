import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Key, 
  Lock, 
  Zap, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  RefreshCw,
  Send,
  DownloadCloud
} from 'lucide-react';
import { 
  DomainOwnershipRecord, 
  DiopSession, 
  PublishedService,
  TransportType
} from '../../types/diop';

interface SubscribeWorkflowViewProps {
  domains: DomainOwnershipRecord[];
  onCompleteSubscribePipeline: (payload: {
    domain: string;
    serviceName: string;
    transport: TransportType;
    accessKey: string;
  }) => void;
}

export const SubscribeWorkflowView: React.FC<SubscribeWorkflowViewProps> = ({
  domains,
  onCompleteSubscribePipeline
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Step 1: Discover Domain
  const [selectedDomain, setSelectedDomain] = useState<string>(domains[0]?.domain || 'vx://core.mesh/gateway');

  // Step 2: Resolve Address
  const [resolvedEndpoint, setResolvedEndpoint] = useState<string>('10.142.0.12:8080 (QUIC)');
  const [resolvedLatency, setResolvedLatency] = useState<number>(12);

  // Step 3: Verify Identity
  const [verifiedDid, setVerifiedDid] = useState<string>('did:vx:secp256k1:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C');
  const [isDidVerified, setIsDidVerified] = useState<boolean>(true);

  // Step 4: Request Access
  const [accessScope, setAccessScope] = useState<string>('READ_EXECUTE_STREAM');
  const [clientEphemeralKey, setClientEphemeralKey] = useState<string>('0x0489a42a9b3112028cef8109d4310e39a20b3c...');

  // Step 5: Establish Session
  const [activeTransport, setActiveTransport] = useState<TransportType>('QUIC');
  const [sessionId, setSessionId] = useState<string>('sess_vx_89102ab');

  // Step 6: Consume Service
  const [samplePayload, setSamplePayload] = useState<string>('{"action": "query_realtime_inference", "model": "gemini-flash-1.5", "tokens": 256}');
  const [responseLog, setResponseLog] = useState<string>('Connected to vx://core.mesh/gateway\nHandshake 0-RTT QUIC negotiated (TLS 1.3 mTLS)\nCipher: Chacha20-Poly1305\n[200 OK] Response payload received in 8.4ms');

  const steps = [
    { num: 1, label: 'Discover Domain', icon: Search },
    { num: 2, label: 'Resolve Address', icon: Globe },
    { num: 3, label: 'Verify Identity', icon: ShieldCheck },
    { num: 4, label: 'Request Access', icon: Key },
    { num: 5, label: 'Establish Session', icon: Lock },
    { num: 6, label: 'Consume Service', icon: Zap }
  ];

  const handleFinish = () => {
    onCompleteSubscribePipeline({
      domain: selectedDomain,
      serviceName: 'Decentralized Service Pipeline',
      transport: activeTransport,
      accessKey: clientEphemeralKey
    });
    setIsCompleted(true);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <DownloadCloud className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-black text-white">Subscribe &amp; Consumer Pipeline</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            6-step subscriber workflow: <strong className="text-zinc-200">Discover Domain ➔ Resolve Address ➔ Verify Identity ➔ Request Access ➔ Establish Session ➔ Consume Service</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-mono text-xs font-bold">
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
                  ? 'bg-purple-950/60 border-purple-400 shadow-lg shadow-purple-950/50' 
                  : isDone
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-black ${isCurrent ? 'text-purple-300' : 'text-zinc-500'}`}>
                  0{step.num}
                </span>
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Icon className={`h-3.5 w-3.5 ${isCurrent ? 'text-purple-400' : 'text-zinc-500'}`} />
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
          
          {/* STEP 1: DISCOVER DOMAIN */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Search className="h-4 w-4 text-purple-400" />
                <span>Step 1: Discover Native Domain (NIP-DISCOVER)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Browse available attested domain endpoints across the decentralized DHT overlay.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {domains.map(d => (
                  <div
                    key={d.domain}
                    onClick={() => setSelectedDomain(d.domain)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedDomain === d.domain
                        ? 'bg-purple-950/40 border-purple-400 ring-1 ring-purple-500'
                        : 'bg-black border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-cyan-300 font-mono text-xs">{d.domain}</span>
                      <span className="text-[10px] font-mono text-emerald-400">{d.domainStatus}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
                      <span>Server: {d.virtualServerName}</span>
                      <span className="text-purple-300">{(d.publishedServices || []).length} Services</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: RESOLVE ADDRESS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>Step 2: Resolve Native Address (NIP-RESOLVE)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Resolve <strong className="text-white font-mono">{selectedDomain}</strong> into physical edge coordinates.
              </p>

              <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Destination Edge Node:</span>
                  <span className="text-emerald-400 font-bold">{resolvedEndpoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Measured RTT Ping:</span>
                  <span className="text-cyan-300 font-bold">{resolvedLatency} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subnet CIDR:</span>
                  <span className="text-purple-300">10.240.0.0/16 (WireGuard Encrypted)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFY IDENTITY */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Step 3: Verify Remote Cryptographic Identity (NIP-ID)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Attest the host's decentralized identifier (DID) and verify ECDSA public key signature.
              </p>

              <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Attested Host DID:</span>
                  <span className="text-purple-300 font-bold break-all">{verifiedDid}</span>
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-zinc-800 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Cryptographic Attestation Succeeded (Zero-Knowledge Validated)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REQUEST ACCESS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Key className="h-4 w-4 text-amber-400" />
                <span>Step 4: Request Access &amp; Challenge Token (NIP-OWNERSHIP)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Submit ephemeral subscriber public key to negotiate an authorization challenge.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Requested Scope:</label>
                  <select
                    value={accessScope}
                    onChange={(e) => setAccessScope(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="READ_EXECUTE_STREAM">READ_EXECUTE_STREAM (Standard Service Consumer)</option>
                    <option value="TELEMETRY_SUBSCRIBE">TELEMETRY_SUBSCRIBE (Realtime Observer)</option>
                    <option value="ADMIN_REPLICATION_SYNC">ADMIN_REPLICATION_SYNC (Multi-DC Node)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Subscriber Ephemeral Public Key:</label>
                  <input
                    type="text"
                    value={clientEphemeralKey}
                    readOnly
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-zinc-400 font-mono text-[10px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ESTABLISH SESSION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Lock className="h-4 w-4 text-purple-400" />
                <span>Step 5: Establish Encrypted Session Channel (NIP-SESSION)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Conduct 0-RTT ECDH key exchange with HMAC replay protection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Select Transport Protocol:</label>
                  <select
                    value={activeTransport}
                    onChange={(e) => setActiveTransport(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  >
                    <option value="QUIC">QUIC (0-RTT Forward Secret)</option>
                    <option value="WebSocket">WebSocket (Bidirectional Stream)</option>
                    <option value="WireGuard">WireGuard (Layer-3 Mesh)</option>
                    <option value="HTTP/HTTPS">HTTP/HTTPS</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Assigned Session ID:</label>
                  <input
                    type="text"
                    value={sessionId}
                    readOnly
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CONSUME SERVICE */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>Step 6: Stream &amp; Consume Service (NIP-DATA)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Transmit payload over the verified channel and monitor live latency.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Encrypted Payload Request:</label>
                  <textarea
                    rows={2}
                    value={samplePayload}
                    onChange={(e) => setSamplePayload(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="p-4 bg-black border border-zinc-800 rounded-xl font-mono text-[11px] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">Live Ingress Stream Log:</span>
                  <pre className="text-emerald-400 whitespace-pre-wrap">{responseLog}</pre>
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
                className="px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-400 hover:from-purple-400 hover:to-emerald-300 text-white font-black text-xs transition-all shadow-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Activate Subscription Channel</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Success screen */
        <div className="p-8 bg-zinc-900 border border-purple-500/40 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/40">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-base font-black text-white">
            Subscription Channel Established &amp; Active!
          </h4>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto font-mono">
            Connected to <strong className="text-cyan-300">{selectedDomain}</strong> over <strong className="text-purple-300">{activeTransport}</strong>. Ephemeral session <strong className="text-emerald-300">{sessionId}</strong> is streaming data with sub-10ms roundtrip latency.
          </p>

          <button
            onClick={() => {
              setIsCompleted(false);
              setCurrentStep(1);
            }}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
          >
            Launch Another Subscription Flow
          </button>
        </div>
      )}

    </div>
  );
};
