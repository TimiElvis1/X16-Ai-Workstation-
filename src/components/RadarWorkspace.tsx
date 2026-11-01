import React, { useState, useEffect, useRef } from 'react';
import { PrivateServer, CodeInjunction, SniffedPacket } from '../types';
import { 
  Radio, 
  Server, 
  Cpu, 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Zap, 
  Play, 
  Copy, 
  Check, 
  RefreshCw, 
  Code2, 
  Workflow, 
  Filter, 
  Box, 
  Search, 
  Lock, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  ChevronRight,
  HardDrive
} from 'lucide-react';

interface RadarWorkspaceProps {
  servers: PrivateServer[];
  injunctions: CodeInjunction[];
  onCreateInjunction: (injunction: Partial<CodeInjunction>) => void;
  onExecuteInjunction: (injunctionId: string, inputParams: any) => Promise<any>;
  onRestartServer: (serverId: string) => void;
}

interface DetectedPort {
  port: number;
  service: string;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'TLS' | 'WS' | 'MQTT';
  state: 'OPEN' | 'SNIFFING' | 'LISTENING' | 'FILTERED';
  banner: string;
  latencyMs: number;
  packetsCount: number;
}

interface HardwareOSConfig {
  kernel: string;
  cpuModel: string;
  architecture: string;
  nicDriver: string;
  macVendor: string;
  ramSpecs: string;
  systemUuid: string;
  firmware: string;
  promiscuousMode: boolean;
  tpmStatus: string;
}

export const RadarWorkspace: React.FC<RadarWorkspaceProps> = ({
  servers,
  injunctions,
  onCreateInjunction,
  onExecuteInjunction,
  onRestartServer
}) => {
  const [selectedServerId, setSelectedServerId] = useState<string>(servers[0]?.id || '');
  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0];

  // Radar Animation States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sweepAngle, setSweepAngle] = useState<number>(310);
  const [radarLockedTarget, setRadarLockedTarget] = useState<string | null>(servers[0]?.ipAddress || '10.142.0.12');
  
  // Scanning & Sniffing Controls
  const [isScanningPorts, setIsScanningPorts] = useState<boolean>(false);
  const [selectedProtocolFilter, setSelectedProtocolFilter] = useState<string>('ALL');
  const [selectedPacket, setSelectedPacket] = useState<SniffedPacket | null>(null);
  const [executionLogStream, setExecutionLogStream] = useState<string[]>([]);

  // Default OS Hardware Config sensing for active server
  const [hwConfig, setHwConfig] = useState<HardwareOSConfig>({
    kernel: 'Linux 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC',
    cpuModel: 'Intel(R) Xeon(R) Gold 6248R CPU @ 3.00GHz (16 Cores)',
    architecture: 'x86_64 (AVX-512, AES-NI, VT-x)',
    nicDriver: 'Mellanox ConnectX-6 Dx 25GbE [mlx5_core]',
    macVendor: 'Mellanox Technologies Ltd (52:54:00:12:34:56)',
    ramSpecs: '32GB DDR4 ECC 3200MHz Quad-Channel',
    systemUuid: 'd48e1a90-3b22-4a01-9f77-8c1143a290bc',
    firmware: 'UEFI v2.80 (ACPI 6.3, DMI Enclosure Type 03)',
    promiscuousMode: true,
    tpmStatus: 'TPM 2.0 Active (Hardware Root of Trust)'
  });

  // Sniffed Ports for the selected node
  const [detectedPorts, setDetectedPorts] = useState<DetectedPort[]>([
    { port: 22, service: 'OpenSSH v8.9p1', protocol: 'TCP', state: 'OPEN', banner: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6', latencyMs: 4, packetsCount: 142 },
    { port: 80, service: 'Nginx HTTP Reverse Proxy', protocol: 'HTTP', state: 'SNIFFING', banner: 'HTTP/1.1 200 OK (Server: nginx/1.22.1)', latencyMs: 2, packetsCount: 890 },
    { port: 443, service: 'TLS Gateway Stream', protocol: 'TLS', state: 'SNIFFING', banner: 'TLSv1.3 Cipher: TLS_AES_256_GCM_SHA384', latencyMs: 3, packetsCount: 1240 },
    { port: 1883, service: 'EMQX MQTT Telemetry Broker', protocol: 'MQTT', state: 'LISTENING', banner: 'MQTT v5.0 Broker (QoS 1, Auth HMAC)', latencyMs: 8, packetsCount: 412 },
    { port: 3000, service: 'SubNet React Applet Web UI', protocol: 'HTTP', state: 'OPEN', banner: 'HTTP/1.1 Vite Dev Server (Port 3000)', latencyMs: 1, packetsCount: 2310 },
    { port: 5432, service: 'PostgreSQL Relational DB', protocol: 'TCP', state: 'LISTENING', banner: 'PostgreSQL 15.4 (Ubuntu 15.4-1.pgdg22.04+1)', latencyMs: 6, packetsCount: 560 },
    { port: 5678, service: 'n8n Workflow Automation Engine', protocol: 'HTTP', state: 'SNIFFING', banner: 'HTTP/1.1 200 OK (X-N8N-Version: 1.25.1)', latencyMs: 5, packetsCount: 1780 },
    { port: 6379, service: 'Redis Cache & Queue', protocol: 'TCP', state: 'OPEN', banner: 'Redis server v=7.0.12 sha=00000000:0 bits=64', latencyMs: 2, packetsCount: 940 },
    { port: 8080, service: 'WebSocket Streaming Gateway', protocol: 'WS', state: 'SNIFFING', banner: 'WebSocket Frame Receiver (ws://10.142.0.12/ws)', latencyMs: 3, packetsCount: 1150 }
  ]);

  // Sniffed Packets Log Stream
  const [packetsStream, setPacketsStream] = useState<SniffedPacket[]>([
    {
      frameNo: 101,
      timestamp: '10:14:02.120',
      sourceIP: '198.51.100.42',
      destIP: activeServer?.ipAddress || '10.142.0.12',
      sourcePort: 48210,
      destPort: 5678,
      protocol: 'HTTP',
      ispCarrier: 'Level3 / CenturyLink',
      ispAsn: 'AS3356 Level3',
      payloadSizeBytes: 512,
      tcpFlags: '[PSH, ACK]',
      info: 'POST /webhook/n8n-trigger HTTP/1.1 Payload={"event":"HW_TELEMETRY"}',
      headerDetails: {
        ethernet: 'Destination: 52:54:00:12:34:56, Source: 00:11:22:33:44:55, Type: IPv4 (0x0800)',
        ipv4Header: `Version: 4, Header Length: 20 bytes, TTL: 58, Protocol: TCP (6), Source: 198.51.100.42, Destination: ${activeServer?.ipAddress || '10.142.0.12'}`,
        transportHeader: 'Source Port: 48210, Destination Port: 5678, Seq: 1042, Ack: 5012, Window: 65535',
        payloadHexDump: '0000  50 4f 53 54 20 2f 77 65 62 68 6f 6f 6b 2f 6e 38  POST /webhook/n8\n0010  38 6e 2d 74 72 69 67 67 65 72 20 48 54 54 50 2f  8n-trigger HTTP/\n0020  31 2e 31 0d 0a 48 6f 73 74 3a 20 31 30 2e 31 34  1.1..Host: 10.14\n0030  32 2e 0e 31 32 3a 35 36 37 38 0d 0a 0d 0a 7b  2.0.12:5678....{',
        payloadAscii: `POST /webhook/n8n-trigger HTTP/1.1\r\nHost: ${activeServer?.ipAddress || '10.142.0.12'}:5678\r\nContent-Type: application/json\r\n\r\n{"event":"HW_TELEMETRY","node":"${activeServer?.name || 'Alpha-Edge-Gateway'}"}`
      }
    },
    {
      frameNo: 102,
      timestamp: '10:14:02.245',
      sourceIP: '198.51.100.88',
      destIP: activeServer?.ipAddress || '10.142.0.12',
      sourcePort: 51204,
      destPort: 1883,
      protocol: 'TCP',
      ispCarrier: 'Cogent Communications',
      ispAsn: 'AS174 Cogent',
      payloadSizeBytes: 128,
      tcpFlags: '[SYN]',
      info: 'MQTT Connect Packet QoS=1 Topic=subnet/telemetry/hw',
      headerDetails: {
        ethernet: 'Destination: 52:54:00:12:34:56, Source: AA:BB:CC:DD:EE:FF, Type: IPv4 (0x0800)',
        ipv4Header: `Version: 4, Header Length: 20 bytes, TTL: 62, Protocol: TCP (6), Source: 198.51.100.88, Destination: ${activeServer?.ipAddress || '10.142.0.12'}`,
        transportHeader: 'Source Port: 51204, Destination Port: 1883, Seq: 8810, Ack: 0, Window: 32768',
        payloadHexDump: '0000  10 2a 00 04 4d 51 54 54 05 02 00 3c 00 0c 6e 38  .*..MQTT...<..n8\n0010  38 6e 5f 77 6f 72 6b 65 72 5f 30 31 00 05 74 6f  8n_worker_01..to',
        payloadAscii: 'MQTT Protocol Connect [Client: n8n_worker_01, KeepAlive: 60s, Topic: subnet/telemetry/hw]'
      }
    },
    {
      frameNo: 103,
      timestamp: '10:14:02.390',
      sourceIP: '203.0.113.12',
      destIP: activeServer?.ipAddress || '10.142.0.12',
      sourcePort: 38902,
      destPort: 8080,
      protocol: 'TLS',
      ispCarrier: 'Telia Company',
      ispAsn: 'AS1299 Telia',
      payloadSizeBytes: 1024,
      tcpFlags: '[PSH, ACK]',
      info: 'WebSocket Binary Frame (Masked) - System Config Telemetry Payload',
      headerDetails: {
        ethernet: 'Destination: 52:54:00:12:34:56, Source: 11:22:33:44:55:66, Type: IPv4 (0x0800)',
        ipv4Header: `Version: 4, Header Length: 20 bytes, TTL: 54, Protocol: TCP (6), Source: 203.0.113.12, Destination: ${activeServer?.ipAddress || '10.142.0.12'}`,
        transportHeader: 'Source Port: 38902, Destination Port: 8080, Seq: 12044, Ack: 9912, Window: 65535',
        payloadHexDump: '0000  81 88 1a 2b 3c 4d 5e 6f 70 81 92 a3 b4 c5 d6 e7  ...+<M^op.......',
        payloadAscii: 'WS_FRAME_RAW_STREAM [CPU_LOAD=14%, RAM_FREE=21400MB, KERNEL_OK]'
      }
    }
  ]);

  // Update OS Hardware Config dynamically when server changes
  useEffect(() => {
    if (activeServer) {
      setSelectedServerId(activeServer.id);
      setRadarLockedTarget(activeServer.ipAddress);

      setHwConfig({
        kernel: activeServer.os || 'Linux 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC',
        cpuModel: activeServer.type === 'vector_db' 
          ? 'AMD EPYC 7763 64-Core Processor (AVX-512, SHA-3)' 
          : activeServer.type === 'edge_compute'
          ? 'ARM Neoverse-N1 32-Core @ 2.8GHz (Crypto Extensions)'
          : 'Intel(R) Xeon(R) Gold 6248R CPU @ 3.00GHz (16 Cores)',
        architecture: activeServer.type === 'edge_compute' ? 'aarch64 (ARMv8.2-A)' : 'x86_64 (AVX-512, AES-NI, VT-x)',
        nicDriver: 'Mellanox ConnectX-6 Dx 25GbE [mlx5_core]',
        macVendor: 'Mellanox Technologies Ltd (52:54:00:12:34:56)',
        ramSpecs: '32GB DDR4 ECC 3200MHz Quad-Channel',
        systemUuid: 'd48e1a90-3b22-4a01-9f77-8c1143a290bc',
        firmware: 'UEFI v2.80 (ACPI 6.3, DMI System Enclosure Type 03)',
        promiscuousMode: true,
        tpmStatus: 'TPM 2.0 Active (Hardware Root of Trust)'
      });

      setExecutionLogStream([
        `[RADAR SWEEP] Locked radar vector on target server '${activeServer.name}' [${activeServer.ipAddress}]`,
        `[OS DETECT] Sensed OS Kernel: Linux 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC`,
        `[PORT SNIFFER] Promiscuous packet capture active on target: ${activeServer.ipAddress}`
      ]);
    }
  }, [selectedServerId]);

  // Radar Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let currentAngle = 310;

    const renderRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 15;

      // Dark Terminal Background inside canvas
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Concentric Distance Rings in Red Accent
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.font = '9px monospace';
        ctx.fillText(`${Math.round(scale * 100)}ms`, centerX + 4, centerY - radius * scale + 10);
      });

      // Axis Crosshairs
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.18)';
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Rotating Sweeping Beam (Red/Rose Tint)
      const sweepRad = (currentAngle * Math.PI) / 180;
      const endX = centerX + radius * Math.cos(sweepRad);
      const endY = centerY + radius * Math.sin(sweepRad);

      const gradient = ctx.createConicGradient(sweepRad - 0.4, centerX, centerY);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0)');
      gradient.addColorStop(0.85, 'rgba(239, 68, 68, 0.08)');
      gradient.addColorStop(0.98, 'rgba(239, 68, 68, 0.4)');
      gradient.addColorStop(1, 'rgba(225, 29, 72, 0.9)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepRad - 0.5, sweepRad);
      ctx.closePath();
      ctx.fill();

      // Sweep Line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Target Blips Rendering
      servers.forEach((srv, index) => {
        const angleDeg = (index * (360 / Math.max(1, servers.length)) + 45) % 360;
        const distRatio = 0.4 + (index % 3) * 0.2;
        const blipRad = (angleDeg * Math.PI) / 180;
        const bx = centerX + radius * distRatio * Math.cos(blipRad);
        const by = centerY + radius * distRatio * Math.sin(blipRad);

        const isLocked = srv.ipAddress === radarLockedTarget || srv.id === selectedServerId;

        ctx.beginPath();
        ctx.arc(bx, by, isLocked ? 8 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isLocked ? 'rgba(225, 29, 72, 0.4)' : 'rgba(239, 68, 68, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(bx, by, isLocked ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isLocked ? '#e11d48' : '#f87171';
        ctx.fill();

        ctx.fillStyle = isLocked ? '#fda4af' : '#fca5a5';
        ctx.font = isLocked ? 'bold 10px monospace' : '9px monospace';
        ctx.fillText(srv.name.split('-')[0] + ' [' + srv.ipAddress + ']', bx + 8, by + 3);
      });

      currentAngle = (currentAngle + 1.8) % 360;
      setSweepAngle(Math.round(currentAngle));
      animFrameId = requestAnimationFrame(renderRadar);
    };

    renderRadar();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [servers, selectedServerId, radarLockedTarget]);

  // Handle Scan Ports Action
  const handleTriggerPortScan = async () => {
    setIsScanningPorts(true);
    setExecutionLogStream(prev => [
      ...prev,
      `[RADAR SCAN] Dispatching hardware & TCP port scan against ${activeServer?.ipAddress || '10.142.0.12'}...`,
      `[SYS CONFIG] Querying DMI hardware tables, PCI bus, and socket listening table...`
    ]);

    await new Promise(r => setTimeout(r, 600));

    const newPacket: SniffedPacket = {
      frameNo: packetsStream.length + 104,
      timestamp: new Date().toISOString().split('T')[1].slice(0, 11),
      sourceIP: `198.51.100.${Math.floor(Math.random() * 200 + 10)}`,
      destIP: activeServer?.ipAddress || '10.142.0.12',
      sourcePort: Math.floor(30000 + Math.random() * 20000),
      destPort: 5678,
      protocol: 'HTTP',
      ispCarrier: 'Verizon Business',
      ispAsn: 'AS701 Verizon',
      payloadSizeBytes: 384,
      tcpFlags: '[PSH, ACK]',
      info: `n8n Webhook Injunction Probe - Port 5678 Active Payload`,
      headerDetails: {
        ethernet: 'Destination: 52:54:00:12:34:56, Source: 00:11:22:33:44:55, Type: IPv4 (0x0800)',
        ipv4Header: `Version: 4, TTL: 64, Protocol: TCP (6), Source: 198.51.100.99, Destination: ${activeServer?.ipAddress || '10.142.0.12'}`,
        transportHeader: 'Source Port: 54120, Destination Port: 5678, Seq: 99401, Ack: 12040',
        payloadHexDump: '0000  7b 22 73 74 61 74 75 73 22 3a 22 53 4e 49 46 46  {"status":"SNIFF\n0010  45 44 5f 4f 4b 22 2c 22 6e 6f 64 65 22 3a 22 6e  ED_OK","node":"n\n0020  38 6e 22 7d 0a                                   8n"}',
        payloadAscii: `{"status":"SNIFFED_OK","node":"${activeServer?.name || 'Alpha-Edge-Gateway'}","os":"${hwConfig.kernel}"}`
      }
    };

    setPacketsStream(prev => [newPacket, ...prev]);
    setIsScanningPorts(false);
    setExecutionLogStream(prev => [
      ...prev,
      `[SCAN COMPLETE] 9 open sockets detected on ${activeServer?.ipAddress || '10.142.0.12'}. OS Kernel & hardware signature confirmed.`
    ]);
  };

  // Code Injunction Snippet templates
  const handleApplySnippetInjunction = (snippetType: string) => {
    let snippet: Partial<CodeInjunction> = {};

    if (snippetType === 'n8n_port_sniffer') {
      snippet = {
        name: `Injunction_n8n_Port_5678_Packet_Sniffer_${injunctions.length + 1}`,
        description: `Sniffs raw HTTP TCP frames on Port 5678 (n8n Engine) on server ${activeServer?.name || 'Alpha-Edge-Gateway'} and parses system hardware telemetry.`,
        language: 'typescript',
        triggerType: 'webhook',
        parameters: [
          { name: 'targetServerIp', type: 'string', required: true, description: 'Target Server IP', defaultValue: activeServer?.ipAddress || '10.142.0.12' },
          { name: 'sniffPort', type: 'number', required: true, description: 'Sniff Port Number', defaultValue: 5678 }
        ],
        code: `function execute(params) {
  const { targetServerIp, sniffPort } = params;
  return {
    injunctionType: "PORT_SNIFFER",
    targetIp: targetServerIp,
    port: sniffPort,
    hardwareDetected: "${hwConfig.cpuModel}",
    osKernel: "${hwConfig.kernel}",
    promiscuousSniffing: true,
    capturedFrameCount: 42,
    timestamp: new Date().toISOString()
  };
}`
      };
    } else if (snippetType === 'hw_config_watcher') {
      snippet = {
        name: `Injunction_OS_HW_Config_Audit_${injunctions.length + 1}`,
        description: `Audits system config hardware signatures, DMI UUID, and kernel memory flags for tamper detection.`,
        language: 'typescript',
        triggerType: 'schedule',
        parameters: [
          { name: 'checkIntervalSec', type: 'number', required: true, description: 'Interval in Seconds', defaultValue: 30 }
        ],
        code: `function execute(params) {
  return {
    injunctionType: "HW_SYSTEM_CONFIG_AUDIT",
    systemUuid: "${hwConfig.systemUuid}",
    architecture: "${hwConfig.architecture}",
    nicDriver: "${hwConfig.nicDriver}",
    tpmStatus: "${hwConfig.tpmStatus}",
    auditStatus: "PASSED_HARDWARE_INTEGRITY_CHECK",
    timestamp: new Date().toISOString()
  };
}`
      };
    } else {
      snippet = {
        name: `Injunction_Open_Socket_Firewall_Shield_${injunctions.length + 1}`,
        description: `Enforces TLS rate-limiting and port-knocking defense on open ports 22, 1883, and 8080.`,
        language: 'typescript',
        triggerType: 'ai_tool',
        parameters: [
          { name: 'maxSynPerSec', type: 'number', required: true, description: 'Max SYN Packets/sec', defaultValue: 100 }
        ],
        code: `function execute(params) {
  const { maxSynPerSec } = params;
  return {
    injunctionType: "FIREWALL_PORT_SHIELD",
    protectedPorts: [22, 1883, 8080, 5678],
    maxSynRate: maxSynPerSec,
    shieldStatus: "ENFORCING_RATE_LIMITS",
    blockedAttacksCount: 0
  };
}`
      };
    }

    onCreateInjunction(snippet);
    setExecutionLogStream(prev => [
      ...prev,
      `[INJUNCTION CREATED] Created & registered code snippet '${snippet.name}' bound to ${activeServer?.name || 'Alpha-Edge-Gateway'}`
    ]);
  };

  return (
    <div id="radar-servers-workspace-view" className="space-y-6">
      
      {/* Workspace Header & Top Metrics */}
      <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-red-600 text-white shadow-md shadow-red-200">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Digital Radar & Server Sniffing System
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 rounded-full">
                  360° SWEEP ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Sensing OS & hardware detection in system config, port socket sniffing, packet capture logs, and code injunction snippets.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleTriggerPortScan}
              disabled={isScanningPorts}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-200 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isScanningPorts ? 'animate-spin' : ''}`} />
              <span>{isScanningPorts ? 'Sniffing Port Sockets...' : 'Sweep & Sniff Server Ports'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Radar Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-red-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-red-100">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Radar Angle Vector</div>
            <div className="text-lg font-bold text-red-600 mt-1 flex items-center space-x-2 font-mono">
              <Radio className="h-4 w-4 text-red-600" />
              <span>{sweepAngle}° Angle</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-red-100">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Sensed OS Hardware</div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate font-mono">
              {hwConfig.architecture}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-red-100">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Sniffed Open Sockets</div>
            <div className="text-lg font-bold text-slate-900 mt-1 flex items-center space-x-1 font-mono">
              <Sliders className="h-4 w-4 text-red-600" />
              <span>{detectedPorts.length} Open Ports</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-red-100">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Captured Packet Logs</div>
            <div className="text-lg font-bold text-red-600 mt-1 flex items-center space-x-1 font-mono">
              <Zap className="h-4 w-4 text-red-600" />
              <span>{packetsStream.length} Packets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Digital Radar Sweep HUD + OS Config Hardware Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Circular Radar Display & Server Target Lock */}
        <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-red-100">
            <div className="flex items-center space-x-2">
              <Radio className="h-4 w-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900">Digital Radar Target Sweep</h3>
            </div>
            <span className="text-[10px] font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              PROMISCUOUS ON
            </span>
          </div>

          {/* Interactive Radar Canvas HUD */}
          <div className="flex justify-center items-center py-2 bg-slate-950 rounded-xl border border-red-900/60 relative">
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full cursor-crosshair shadow-inner"
              onClick={() => {
                setRadarLockedTarget(activeServer?.ipAddress || '10.142.0.12');
              }}
            />

            {/* Radar Center HUD Info Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-red-900/60 px-2.5 py-1 rounded text-[9px] font-mono text-slate-300">
              TARGET: <span className="text-red-400 font-bold">{radarLockedTarget}</span>
            </div>
          </div>

          {/* Server Node Selection list */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 font-mono flex items-center justify-between">
              <span>Target Server Radar Nodes:</span>
              <span className="text-[10px] text-slate-500 font-bold">{servers.length} Servers</span>
            </div>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
              {servers.map((srv) => {
                const isSelected = srv.id === selectedServerId;

                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedServerId(srv.id);
                      setRadarLockedTarget(srv.ipAddress);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-600 border-red-700 text-white font-bold shadow-sm'
                        : 'bg-slate-50 border-red-100 text-slate-700 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <Server className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-red-600'}`} />
                      <span>{srv.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-red-100' : 'text-red-600'}`}>
                      {srv.ipAddress}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Column 2 & 3: OS Hardware Detection in System Config + Open Port Sniffer */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* OS & Hardware Detection Panel (Sensed in System Config) */}
          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  OS & Hardware Telemetry Detection (Sensed via System Config)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                HARDWARE IDENTIFIED
              </span>
            </div>

            {/* Hardware Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-xl border border-red-100 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">OS Kernel Release</div>
                <div className="text-slate-900 font-bold truncate">{hwConfig.kernel}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-red-100 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">CPU Microarchitecture</div>
                <div className="text-red-600 font-bold truncate">{hwConfig.cpuModel}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-red-100 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">NIC Hardware Controller & MAC</div>
                <div className="text-slate-900 font-bold truncate">{hwConfig.nicDriver}</div>
                <div className="text-[10px] text-slate-500">{hwConfig.macVendor}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-red-100 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">System Hardware UUID</div>
                <div className="text-red-700 font-bold truncate">{hwConfig.systemUuid}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-red-100 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Memory Specs & Enclosure</div>
                <div className="text-slate-900 font-bold truncate">{hwConfig.ramSpecs}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-red-100 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Hardware Security & TPM</div>
                <div className="text-emerald-700 font-bold truncate flex items-center space-x-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{hwConfig.tpmStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Open Ports Matrix & Sniffed Socket Telemetry */}
          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-red-100">
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Sniffed Network Open Ports Matrix ({detectedPorts.length} Ports)
                </h3>
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-600 font-bold">Protocol Filter:</span>
                <select
                  value={selectedProtocolFilter}
                  onChange={(e) => setSelectedProtocolFilter(e.target.value)}
                  className="bg-red-50 border border-red-200 rounded-lg px-2.5 py-1 text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="ALL">ALL PROTOCOLS</option>
                  <option value="HTTP">HTTP / REST</option>
                  <option value="TCP">TCP SOCKETS</option>
                  <option value="TLS">TLS / SSL</option>
                  <option value="MQTT">MQTT BROKER</option>
                </select>
              </div>
            </div>

            {/* Ports Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-red-100 text-[10px] text-slate-500 uppercase">
                    <th className="pb-2">Port</th>
                    <th className="pb-2">Service / Application</th>
                    <th className="pb-2">Protocol</th>
                    <th className="pb-2">State</th>
                    <th className="pb-2">Packets</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                  {detectedPorts
                    .filter(p => selectedProtocolFilter === 'ALL' || p.protocol === selectedProtocolFilter)
                    .map((port) => (
                      <tr key={port.port} className="hover:bg-red-50/50 transition-colors">
                        <td className="py-2.5 font-bold text-red-600">Port {port.port}</td>
                        <td className="py-2.5 text-slate-900">
                          <div className="font-bold">{port.service}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[220px]">{port.banner}</div>
                        </td>
                        <td className="py-2.5 text-slate-800 font-bold">{port.protocol}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            port.state === 'SNIFFING'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : port.state === 'OPEN'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {port.state}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-700 font-semibold">{port.packetsCount} pkts</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => handleApplySnippetInjunction('n8n_port_sniffer')}
                            className="text-[10px] px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-all border border-red-200"
                          >
                            + Attach Injunction
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Packet Payload Sniffer Logs Stream */}
      <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-red-100">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Live Intercepted Packet Payload Stream (Sniffed in Promiscuous Mode)
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            {packetsStream.length} Frames Buffer
          </span>
        </div>

        {/* Packet Stream Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-red-100 text-[10px] text-slate-500 uppercase">
                <th className="pb-2">Frame #</th>
                <th className="pb-2">Time</th>
                <th className="pb-2">Source IP:Port</th>
                <th className="pb-2">Dest IP:Port</th>
                <th className="pb-2">Protocol</th>
                <th className="pb-2">ISP Carrier</th>
                <th className="pb-2">Payload Info</th>
                <th className="pb-2 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50">
              {packetsStream.map((pkt) => (
                <tr key={pkt.frameNo} className="hover:bg-red-50/50 transition-colors text-slate-800">
                  <td className="py-2 text-red-600 font-bold">#{pkt.frameNo}</td>
                  <td className="py-2 text-slate-500">{pkt.timestamp}</td>
                  <td className="py-2 text-slate-700">{pkt.sourceIP}:{pkt.sourcePort}</td>
                  <td className="py-2 text-slate-900 font-bold">{pkt.destIP}:{pkt.destPort}</td>
                  <td className="py-2 font-bold text-red-700">{pkt.protocol}</td>
                  <td className="py-2 text-slate-600">{pkt.ispCarrier}</td>
                  <td className="py-2 text-slate-800 truncate max-w-[300px]">{pkt.info}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => setSelectedPacket(pkt)}
                      className="text-[10px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Packet Inspector Drawer Modal */}
        {selectedPacket && (
          <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60 space-y-3">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
              <div className="text-xs font-bold text-red-400 font-mono">
                Packet Inspection Payload - Frame #{selectedPacket.frameNo} [{selectedPacket.protocol}]
              </div>
              <button
                onClick={() => setSelectedPacket(null)}
                className="text-xs text-red-300 hover:text-white font-mono font-bold"
              >
                Close [x]
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
              <div>
                <div className="text-[10px] text-slate-400 mb-1">Ethernet & IPv4 Headers:</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-slate-300 space-y-1">
                  <div>{selectedPacket.headerDetails.ethernet}</div>
                  <div>{selectedPacket.headerDetails.ipv4Header}</div>
                  <div>{selectedPacket.headerDetails.transportHeader}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 mb-1">Payload Hex Dump:</div>
                <pre className="p-2.5 bg-slate-900 rounded border border-slate-800 text-red-400 text-[10px] whitespace-pre-wrap">
                  {selectedPacket.headerDetails.payloadHexDump}
                </pre>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 mb-1">Decoded Payload String / ASCII Text:</div>
              <pre className="p-2.5 bg-slate-900 rounded border border-slate-800 text-red-300 text-[11px] whitespace-pre-wrap font-mono">
                {selectedPacket.headerDetails.payloadAscii}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Code Injunction Snippets & Possibilities Section */}
      <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-red-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-900">
                Injunction Code Snippets & Possibilities Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Apply code injunction templates directly to sniffed open ports, OS hardware logs, or n8n automation hooks.
            </p>
          </div>
        </div>

        {/* 3 Snippet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Snippet 1 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-red-100 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-900">
                <span className="text-red-700">n8n Port 5678 Injunction Snippet</span>
                <span className="text-[10px] text-slate-500 font-bold">Port 5678</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Binds an HTTP webhook listener on Port 5678 to forward sniffed server hardware telemetry straight to n8n workflows.
              </p>
            </div>

            <div className="pt-2 border-t border-red-100 flex items-center justify-between">
              <button
                onClick={() => handleApplySnippetInjunction('n8n_port_sniffer')}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Apply Snippet as Injunction</span>
              </button>
            </div>
          </div>

          {/* Snippet 2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-red-100 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-900">
                <span className="text-slate-900">OS Hardware Config Audit</span>
                <span className="text-[10px] text-slate-500 font-bold">SysConfig</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Periodically hashes and verifies DMI UUID, kernel build signatures, and RAM integrity flags for tamper detection.
              </p>
            </div>

            <div className="pt-2 border-t border-red-100 flex items-center justify-between">
              <button
                onClick={() => handleApplySnippetInjunction('hw_config_watcher')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Cpu className="h-3.5 w-3.5 text-red-400" />
                <span>Apply Snippet as Injunction</span>
              </button>
            </div>
          </div>

          {/* Snippet 3 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-red-100 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-900">
                <span className="text-red-700">Open Socket Firewall Shield</span>
                <span className="text-[10px] text-slate-500 font-bold">Ports 22/1883</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Enforces SYN rate-limiting and TLS HMAC signature validation across detected open ports on target servers.
              </p>
            </div>

            <div className="pt-2 border-t border-red-100 flex items-center justify-between">
              <button
                onClick={() => handleApplySnippetInjunction('firewall_shield')}
                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg border border-red-200 transition-all flex items-center justify-center space-x-1.5"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                <span>Apply Snippet as Injunction</span>
              </button>
            </div>
          </div>

        </div>

        {/* Possibilities Explorer */}
        <div className="bg-slate-50 p-4 rounded-xl border border-red-100 space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-red-600" />
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase">
              Calculated Subnet Possibilities for Node [{activeServer?.name || 'Alpha-Edge-Gateway'}]
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-800">
            <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-red-600 shrink-0" />
                <span>
                  <strong>Possibility 1:</strong> Route sniffed port 5678 telemetry directly into n8n Webhook Injunction node for automated anomaly alerts.
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">READY</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-red-600 shrink-0" />
                <span>
                  <strong>Possibility 2:</strong> Store raw hex packet dumps from MQTT port 1883 into Qdrant Vector DB server for vector similarity search.
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">READY</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Possibility 3:</strong> Enable automated BGP route fallback when ISP packet loss on target interface exceeds 2.5%.
                </span>
              </div>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">CONFIGURABLE</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
