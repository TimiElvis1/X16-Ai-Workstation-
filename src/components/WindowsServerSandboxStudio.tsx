import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Activity, 
  Layers, 
  Zap, 
  RefreshCw, 
  Play, 
  RotateCcw, 
  Lock, 
  Copy, 
  Check, 
  Plus, 
  Monitor, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  Sliders, 
  Database, 
  Globe, 
  Radio
} from 'lucide-react';

export interface WindowsServerNode {
  id: string;
  name: string;
  ipAddress: string;
  role: string;
  windowsOsVersion: string;
  sandboxIsolationMode: 'Hyper-V Enclave VBS/HVCI' | 'Windows Defender App Guard' | 'AppContainer Sandbox' | 'Virtualization-Based Security (VBS)' | 'Hyper-V Guarded Host';
  status: 'HEALTHY_ONLINE' | 'PROVISIONING' | 'ISOLATED_SANDBOX' | 'DEGRADED';
  cpuUtilizationPct: number;
  ramUsageGb: number;
  ramMaxGb: number;
  diskQueueLength: number;
  handlesCount: number;
  threadsCount: number;
  processCount: number;
  networkAdapterMbps: number;
  winRmStatus: 'ACTIVE_LISTENING' | 'ENCRYPTED_KERBEROS' | 'STANDBY';
  windowsDefenderStatus: 'REALTIME_PROTECTION_ON' | 'SCANNING' | 'UPDATED';
  servicesRunning: string[];
  logs: string[];
}

export interface WindowsEventLog {
  id: string;
  eventId: number;
  logName: 'Security' | 'System' | 'Application' | 'Windows Defender';
  level: 'Information' | 'Warning' | 'Error' | 'Critical';
  source: string;
  timestamp: string;
  message: string;
  nodeName: string;
}

export function WindowsServerSandboxStudio() {
  // Preset Windows Server Sandbox Major Nodes
  const defaultWindowsNodes: WindowsServerNode[] = [
    {
      id: 'win-dc-01',
      name: 'WIN-DC-GENESIS-01',
      ipAddress: '10.142.0.10',
      role: 'Genesis Active Directory & Kerberos Core Domain Controller',
      windowsOsVersion: 'Windows Server 2025 Datacenter (Build 26100.1150)',
      sandboxIsolationMode: 'Hyper-V Enclave VBS/HVCI',
      status: 'HEALTHY_ONLINE',
      cpuUtilizationPct: 18.4,
      ramUsageGb: 14.2,
      ramMaxGb: 64.0,
      diskQueueLength: 0.02,
      handlesCount: 38450,
      threadsCount: 1420,
      processCount: 112,
      networkAdapterMbps: 450.5,
      winRmStatus: 'ENCRYPTED_KERBEROS',
      windowsDefenderStatus: 'REALTIME_PROTECTION_ON',
      servicesRunning: ['ADWS (Active Directory Web Services)', 'NTDS (Kerberos KDC)', 'DNS Server', 'WinRM', 'Windows Defender'],
      logs: [
        '[PS-LOG] Windows Server 2025 Core Sandbox booted inside Hyper-V VBS/HVCI Enclave.',
        '[KERBEROS] Ticket Granting Service (TGS) active for SubNet Domain Genesis.',
        '[WINRM] TLS 1.3 encrypted listener active on 10.142.0.10:5986.'
      ]
    },
    {
      id: 'win-vec-02',
      name: 'WIN-VEC-STORE-02',
      ipAddress: '10.142.0.14',
      role: 'Neural Vector Store & Cryptographic Indexer Core Node',
      windowsOsVersion: 'Windows Server 2022 Datacenter (Build 20348.2527)',
      sandboxIsolationMode: 'Windows Defender App Guard',
      status: 'HEALTHY_ONLINE',
      cpuUtilizationPct: 42.8,
      ramUsageGb: 28.6,
      ramMaxGb: 128.0,
      diskQueueLength: 0.15,
      handlesCount: 62100,
      threadsCount: 2840,
      processCount: 148,
      networkAdapterMbps: 1240.8,
      winRmStatus: 'ACTIVE_LISTENING',
      windowsDefenderStatus: 'REALTIME_PROTECTION_ON',
      servicesRunning: ['VectorDBIndexerSvc', 'CryptoKeyManager', 'HyperVIntegrationSvc', 'WinRM'],
      logs: [
        '[PS-LOG] Windows Defender Application Guard (WDAG) container initialized.',
        '[VECTOR-DB] 1,450,000 vector embeddings indexed in memory.',
        '[PERFMON] Disk queue length optimal @ 0.15 queue depth.'
      ]
    },
    {
      id: 'win-iis-03',
      name: 'WIN-IIS-GATEWAY-03',
      ipAddress: '10.142.0.18',
      role: 'IIS Application Gateway & ARR Reverse Proxy Node',
      windowsOsVersion: 'Windows Server 2022 Datacenter (Build 20348.2527)',
      sandboxIsolationMode: 'AppContainer Sandbox',
      status: 'HEALTHY_ONLINE',
      cpuUtilizationPct: 24.1,
      ramUsageGb: 9.8,
      ramMaxGb: 32.0,
      diskQueueLength: 0.04,
      handlesCount: 29800,
      threadsCount: 1150,
      processCount: 94,
      networkAdapterMbps: 820.2,
      winRmStatus: 'ACTIVE_LISTENING',
      windowsDefenderStatus: 'REALTIME_PROTECTION_ON',
      servicesRunning: ['W3SVC (World Wide Web Publishing)', 'WAS (IIS Admin)', 'Application Request Routing (ARR)', 'WinRM'],
      logs: [
        '[PS-LOG] IIS 10.0 Application Host Service (W3SVC) online.',
        '[ARR-PROXY] Bound reverse proxy routes for *.subnet.digital on port 443.',
        '[APPCONTAINER] Isolated app pool sandbox verified.'
      ]
    },
    {
      id: 'win-sql-04',
      name: 'WIN-SQL-LEDGER-04',
      ipAddress: '10.142.0.25',
      role: 'Core Relational Database & Encrypted Vault Ledger',
      windowsOsVersion: 'Windows Server 2022 Datacenter (Build 20348.2527)',
      sandboxIsolationMode: 'Virtualization-Based Security (VBS)',
      status: 'HEALTHY_ONLINE',
      cpuUtilizationPct: 35.6,
      ramUsageGb: 48.0,
      ramMaxGb: 128.0,
      diskQueueLength: 0.08,
      handlesCount: 84000,
      threadsCount: 3900,
      processCount: 130,
      networkAdapterMbps: 610.4,
      winRmStatus: 'ENCRYPTED_KERBEROS',
      windowsDefenderStatus: 'REALTIME_PROTECTION_ON',
      servicesRunning: ['MSSQLSERVER (SQL Server 2022 Enterprise)', 'SQLBrowser', 'SQLWriter', 'WinRM'],
      logs: [
        '[PS-LOG] SQL Server 2022 Enterprise engine initialized inside VBS sandbox.',
        '[ALWAYS-ENCRYPTED] Column-level encryption keys loaded via Windows Certificate Store.',
        '[PERFMON] Buffer cache hit ratio @ 99.8%.'
      ]
    },
    {
      id: 'win-ps-05',
      name: 'WIN-PS-WORKER-05',
      ipAddress: '10.142.0.30',
      role: 'PowerShell 7.4 Automation Worker & Script Sandbox',
      windowsOsVersion: 'Windows Server 2025 Datacenter Core',
      sandboxIsolationMode: 'Hyper-V Guarded Host',
      status: 'HEALTHY_ONLINE',
      cpuUtilizationPct: 15.2,
      ramUsageGb: 6.4,
      ramMaxGb: 32.0,
      diskQueueLength: 0.01,
      handlesCount: 18500,
      threadsCount: 820,
      processCount: 68,
      networkAdapterMbps: 210.0,
      winRmStatus: 'ENCRYPTED_KERBEROS',
      windowsDefenderStatus: 'REALTIME_PROTECTION_ON',
      servicesRunning: ['PowerShellCoreWorker', 'WinRM', 'SSH (OpenSSH Server)', 'Windows Defender'],
      logs: [
        '[PS-LOG] PowerShell 7.4.2 Core Worker sandbox initialized.',
        '[WINRM] Remote JEA (Just Enough Administration) endpoint listening.',
        '[DEFENDER] Antivirus real-time definitions updated.'
      ]
    },
    {
      id: 'win-arc-06',
      name: 'WIN-ARC-EDGE-06',
      ipAddress: '10.142.0.40',
      role: 'Azure Arc Hybrid Edge Compute & K3s Container Worker',
      windowsOsVersion: 'Windows Server 2019 Datacenter (Build 17763.5936)',
      sandboxIsolationMode: 'Hyper-V Enclave VBS/HVCI',
      status: 'HEALTHY_ONLINE',
      cpuUtilizationPct: 29.8,
      ramUsageGb: 18.2,
      ramMaxGb: 64.0,
      diskQueueLength: 0.09,
      handlesCount: 42100,
      threadsCount: 1950,
      processCount: 118,
      networkAdapterMbps: 540.0,
      winRmStatus: 'ACTIVE_LISTENING',
      windowsDefenderStatus: 'REALTIME_PROTECTION_ON',
      servicesRunning: ['himds (Azure Arc Connected Machine)', 'containerd', 'WinRM', 'Windows Defender'],
      logs: [
        '[PS-LOG] Azure Arc Hybrid Agent connected to Cloud Fabric.',
        '[CONTAINERD] Windows Container Sandbox runtime active.',
        '[TELEMETRY] Windows PerfMon telemetry stream synced.'
      ]
    }
  ];

  // Windows Event Log Stream Data
  const defaultEventLogs: WindowsEventLog[] = [
    {
      id: 'evt-101',
      eventId: 4624,
      logName: 'Security',
      level: 'Information',
      source: 'Microsoft-Windows-Security-Auditing',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      message: 'An account was successfully logged on. Target: SUBNET\\Administrator. Logon Type: 3 (Network via WinRM).',
      nodeName: 'WIN-DC-GENESIS-01'
    },
    {
      id: 'evt-102',
      eventId: 7036,
      logName: 'System',
      level: 'Information',
      source: 'Service Control Manager',
      timestamp: new Date(Date.now() - 340000).toLocaleTimeString(),
      message: 'The World Wide Web Publishing Service (W3SVC) entered the running state in AppContainer sandbox.',
      nodeName: 'WIN-IIS-GATEWAY-03'
    },
    {
      id: 'evt-103',
      eventId: 1116,
      logName: 'Windows Defender',
      level: 'Information',
      source: 'Windows Defender Antivirus',
      timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
      message: 'Real-time protection scan completed for Hyper-V Sandbox Enclave. 0 threats detected.',
      nodeName: 'WIN-VEC-STORE-02'
    },
    {
      id: 'evt-104',
      eventId: 4688,
      logName: 'Security',
      level: 'Information',
      source: 'Microsoft-Windows-Security-Auditing',
      timestamp: new Date(Date.now() - 900000).toLocaleTimeString(),
      message: 'A new process was created: C:\\Program Files\\PowerShell\\7\\pwsh.exe (PID: 4892) inside Guarded Sandbox.',
      nodeName: 'WIN-PS-WORKER-05'
    },
    {
      id: 'evt-105',
      eventId: 1001,
      logName: 'Application',
      level: 'Information',
      source: 'Windows Error Reporting / Telemetry',
      timestamp: new Date(Date.now() - 1200000).toLocaleTimeString(),
      message: 'Windows OS Telemetry diagnostic package generated successfully. All performance counters nominal.',
      nodeName: 'WIN-SQL-LEDGER-04'
    }
  ];

  const [nodes, setNodes] = useState<WindowsServerNode[]>(defaultWindowsNodes);
  const [selectedNode, setSelectedNode] = useState<WindowsServerNode>(defaultWindowsNodes?.[0] || defaultWindowsNodes[0]);
  const [eventLogs, setEventLogs] = useState<WindowsEventLog[]>(defaultEventLogs);
  
  // Interactive PowerShell Command Runner State
  const [psInput, setPsInput] = useState<string>('Get-Service | Where-Object {$_.Status -eq "Running"}');
  const [psOutput, setPsOutput] = useState<string[]>([
    'Windows PowerShell 7.4.2 Core Sandbox Runtime',
    'Copyright (c) Microsoft Corporation. All rights reserved.',
    'PS C:\\Windows\\System32> Get-Service | Where-Object {$_.Status -eq "Running"}',
    'Status   Name               DisplayName',
    '------   ----               -----------',
    'Running  ADWS               Active Directory Web Services',
    'Running  DNS                DNS Server',
    'Running  NTDS               Kerberos Key Distribution Center',
    'Running  WinRM              Windows Remote Management (WS-Management)',
    'Running  WinDefend          Windows Defender Antivirus Service',
    'PS C:\\Windows\\System32> '
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // New Node Provisioning Modal
  const [showProvisionModal, setShowProvisionModal] = useState<boolean>(false);
  const [newNodeName, setNewNodeName] = useState<string>('WIN-CORE-NODE-07');
  const [newNodeIp, setNewNodeIp] = useState<string>('10.142.0.45');
  const [newNodeRole, setNewNodeRole] = useState<string>('Windows Server Automation & Telemetry Sandbox');
  const [newNodeOs, setNewNodeOs] = useState<string>('Windows Server 2025 Datacenter Core');
  const [newNodeSandbox, setNewNodeSandbox] = useState<WindowsServerNode['sandboxIsolationMode']>('Hyper-V Enclave VBS/HVCI');

  // Copy Helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Run PowerShell Script inside Selected Windows Server Sandbox
  const handleExecutePowerShell = (customScript?: string) => {
    const scriptToRun = customScript || psInput;
    const timestamp = new Date().toLocaleTimeString();

    let outputLines: string[] = [
      `PS C:\\Windows\\System32> ${scriptToRun}`
    ];

    if (scriptToRun.includes('Get-Service')) {
      outputLines.push(
        'Status   Name               DisplayName',
        '------   ----               -----------',
        `Running  ${selectedNode.servicesRunning.slice(0, 3).join('\nRunning  ')}`,
        'Running  WinRM              Windows Remote Management',
        'Running  WinDefend          Windows Defender Antivirus'
      );
    } else if (scriptToRun.includes('Get-Process')) {
      outputLines.push(
        'NPM(K)    PM(M)    WS(M)     CPU(s)      Id  ProcessName',
        '------    -----    -----     ------     ---  -----------',
        '   142     840.5   1200.2     450.84    4892  pwsh',
        '    85     420.1    680.4     182.10    1024  lsass',
        '   210    1850.0   2400.0     890.22    2204  sqlservr',
        '    45     180.2    290.0      42.15    3108  w3wp'
      );
    } else if (scriptToRun.includes('Get-WinEvent')) {
      outputLines.push(
        'ProviderName: Microsoft-Windows-Security-Auditing',
        'TimeCreated          Id LevelDisplayName Message',
        '-----------          -- ---------------- -------',
        `${timestamp}       4624 Information      An account was successfully logged on (WinRM Kerberos).`,
        `${timestamp}       7036 Information      Service Control Manager: Service state verified.`
      );
    } else if (scriptToRun.includes('Test-NetConnection')) {
      outputLines.push(
        `ComputerName           : ${selectedNode.ipAddress}`,
        'RemoteAddress          : ' + selectedNode.ipAddress,
        'RemotePort             : 5986',
        'InterfaceAlias         : vEthernet (Hyper-V Virtual Switch)',
        'SourceAddress          : 10.142.0.1',
        'TcpTestSucceeded       : True',
        'PingSucceeded          : True',
        'PingReplyDetails (RTT) : 12 ms'
      );
    } else if (scriptToRun.includes('Get-Volume')) {
      outputLines.push(
        'DriveLetter FileSystemType DriveType HealthStatus SizeRemaining     Size',
        '----------- -------------- --------- ------------ -------------     ----',
        'C           NTFS           Fixed     Healthy          182.4 GB   500 GB',
        'D           ReFS           Fixed     Healthy          840.0 GB  2000 GB'
      );
    } else if (scriptToRun.includes('Invoke-WindowsDefenderScan')) {
      outputLines.push(
        'Scanning Windows Server Sandbox Enclave memory & binaries...',
        'ScanType             : QuickScan',
        'EngineVersion        : 1.1.24050.5',
        'SignatureVersion     : 1.411.890.0',
        'ThreatsFound         : 0',
        'Result               : PASSED (Hyper-V VBS Memory Integrity Verified)'
      );
    } else {
      outputLines.push(
        `[POWERSHELL-EXEC] Executed command: '${scriptToRun}' on node ${selectedNode.name} (${selectedNode.ipAddress})`,
        `[RESULT] Command returned exit code 0. Execution completed in 18ms.`
      );
    }

    setPsOutput(prev => [...prev, ...outputLines, 'PS C:\\Windows\\System32> ']);

    // Append to Node Logs
    setNodes(prev => prev.map(node => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          logs: [...node.logs, `[${timestamp}] [PS-EXEC] Ran script '${scriptToRun}' -> Exit Code 0`]
        };
      }
      return node;
    }));
  };

  // Trigger Telemetry Diagnostics Refresh for All Nodes
  const handleRefreshTelemetry = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      cpuUtilizationPct: Number((12 + Math.random() * 35).toFixed(1)),
      networkAdapterMbps: Number((300 + Math.random() * 900).toFixed(1)),
      diskQueueLength: Number((Math.random() * 0.12).toFixed(2))
    })));

    const newEvt: WindowsEventLog = {
      id: `evt-${Date.now()}`,
      eventId: 1001,
      logName: 'System',
      level: 'Information',
      source: 'Windows Performance Counter Monitor',
      timestamp: new Date().toLocaleTimeString(),
      message: `Windows PerfMon Telemetry refreshed across all ${nodes.length} Windows Server sandboxes.`,
      nodeName: selectedNode.name
    };

    setEventLogs(prev => [newEvt, ...prev.slice(0, 9)]);
  };

  // Add Custom Windows Server Sandbox Node
  const handleProvisionNode = (e: React.FormEvent) => {
    e.preventDefault();
    const newNode: WindowsServerNode = {
      id: `win-custom-${Date.now()}`,
      name: newNodeName,
      ipAddress: newNodeIp,
      role: newNodeRole,
      windowsOsVersion: newNodeOs,
      sandboxIsolationMode: newNodeSandbox,
      status: 'HEALTHY_ONLINE',
      cpuUtilizationPct: 14.5,
      ramUsageGb: 8.0,
      ramMaxGb: 32.0,
      diskQueueLength: 0.01,
      handlesCount: 22000,
      threadsCount: 950,
      processCount: 72,
      networkAdapterMbps: 380.0,
      winRmStatus: 'ENCRYPTED_KERBEROS',
      windowsDefenderStatus: 'REALTIME_PROTECTION_ON',
      servicesRunning: ['WinRM', 'Windows Defender', 'HyperVIntegrationSvc'],
      logs: [
        `[PS-LOG] ${newNodeName} initialized with ${newNodeOs} in ${newNodeSandbox}.`,
        `[NET] IP ${newNodeIp} assigned to Hyper-V Virtual Switch.`
      ]
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    setShowProvisionModal(false);
  };

  // Filtered Windows Nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = searchQuery === '' || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.ipAddress.includes(searchQuery) ||
        node.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'ALL' || node.windowsOsVersion.includes(filterRole);
      return matchesSearch && matchesRole;
    });
  }, [nodes, searchQuery, filterRole]);

  return (
    <div id="windows-server-sandbox-studio" className="space-y-6 font-sans">
      
      {/* Top Banner Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white tracking-tight font-mono">
                    Windows OS Server Sandbox & Telemetry Studio
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold text-[10px] uppercase">
                    Windows OS Core
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Isolated Windows OS Sandboxes for all Major Core Servers & SubNet Nodes with Windows PerfMon Telemetry, Event Logs & PowerShell Core 7.4
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <button
              onClick={handleRefreshTelemetry}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 shadow-md transition-all flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4 text-blue-400" />
              <span>Probe Windows Telemetry</span>
            </button>

            <button
              onClick={() => setShowProvisionModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-xl transition-all flex items-center space-x-2"
            >
              <Plus className="h-4 w-4 text-black" />
              <span>Provision Windows Core Sandbox</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Aggregate Telemetry Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* Total Active Windows Server Sandboxes */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Active Windows Server Sandboxes</span>
            <Server className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {nodes.length} <span className="text-xs text-zinc-400">Windows OS Nodes</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 pt-1 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>100% Hyper-V & App Guard Enclaves Active</span>
          </div>
        </div>

        {/* Windows Processor Utilization */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Avg Processor % Time</span>
            <Cpu className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {(nodes.reduce((s, n) => s + n.cpuUtilizationPct, 0) / nodes.length).toFixed(1)}%
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Windows PerfMon Counter: <strong className="text-white">\Processor(_Total)\% Processor Time</strong>
          </div>
        </div>

        {/* Windows Committed Memory */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Committed Memory Pool</span>
            <HardDrive className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {nodes.reduce((s, n) => s + n.ramUsageGb, 0).toFixed(1)} <span className="text-xs text-zinc-400">GB Committed</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Max Physical Allocation: {nodes.reduce((s, n) => s + n.ramMaxGb, 0)} GB RAM
          </div>
        </div>

        {/* Windows Event Viewer Stream */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-bold">
            <span>Event Log Telemetry Stream</span>
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {eventLogs.length} <span className="text-xs text-zinc-400">Audit Events</span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Security IDs: 4624 (Logon), 7036 (Services), 1116 (Defender)
          </div>
        </div>
      </div>

      {/* Main Grid: Windows Server Nodes List & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Major Windows Server Nodes List */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Major Windows Server Nodes Sandbox Index</h2>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Node / IP / Role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="ALL">All OS Versions</option>
                <option value="2025">Windows Server 2025</option>
                <option value="2022">Windows Server 2022</option>
                <option value="2019">Windows Server 2019</option>
              </select>
            </div>
          </div>

          {/* Windows Server Sandbox Nodes List */}
          <div className="space-y-3 font-mono text-xs">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected 
                      ? 'bg-zinc-900 border-blue-500 ring-1 ring-blue-500/50 shadow-xl' 
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    
                    {/* Node Name & OS Version */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                          WINDOWS OS
                        </span>
                        <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>{node.name}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </h3>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {node.role}
                      </p>
                    </div>

                    {/* Quick Specs & IP */}
                    <div className="text-right space-y-0.5">
                      <div className="text-xs font-bold text-white">{node.ipAddress}</div>
                      <div className="text-[10px] text-zinc-400">{node.windowsOsVersion}</div>
                    </div>
                  </div>

                  {/* Windows Telemetry Stats Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400">
                    <div>CPU: <strong className="text-white">{node.cpuUtilizationPct}%</strong></div>
                    <div>RAM: <strong className="text-white">{node.ramUsageGb} / {node.ramMaxGb} GB</strong></div>
                    <div>Net: <strong className="text-white">{node.networkAdapterMbps} Mbps</strong></div>
                    <div className="text-right">Sandbox: <strong className="text-blue-300">{node.sandboxIsolationMode}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Windows Node Inspector & PowerShell Console */}
        <div className="lg:col-span-5 space-y-6 font-mono text-xs">
          
          {selectedNode ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Node Inspector Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5 text-blue-400" />
                    <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{selectedNode.role}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  {selectedNode.status}
                </span>
              </div>

              {/* Windows OS Telemetry Details */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <div className="text-zinc-300 font-bold uppercase text-[11px] flex justify-between">
                  <span>Windows OS System Telemetry</span>
                  <span className="text-blue-400">{selectedNode.windowsOsVersion}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-black rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">WinRM Listener</span>
                    <strong className="text-emerald-400 font-bold">{selectedNode.winRmStatus}</strong>
                  </div>
                  <div className="p-2.5 bg-black rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Windows Defender</span>
                    <strong className="text-blue-300 font-bold">{selectedNode.windowsDefenderStatus}</strong>
                  </div>
                  <div className="p-2.5 bg-black rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Handles / Threads</span>
                    <strong className="text-white font-bold">{selectedNode.handlesCount.toLocaleString()} / {selectedNode.threadsCount.toLocaleString()}</strong>
                  </div>
                  <div className="p-2.5 bg-black rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Disk Queue Length</span>
                    <strong className="text-white font-bold">{selectedNode.diskQueueLength} Queue Depth</strong>
                  </div>
                </div>
              </div>

              {/* Running Windows Services */}
              <div className="space-y-2">
                <span className="text-zinc-400 font-bold uppercase text-[11px]">Active Windows Services</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedNode.servicesRunning || []).map((svc, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]">
                      ⚙️ {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Node Sandbox Terminal Logs */}
              <div className="space-y-2">
                <span className="text-zinc-400 font-bold uppercase text-[11px]">Windows Node Sandbox Logs</span>
                <div className="p-3 bg-black rounded-xl border border-zinc-800 h-28 overflow-y-auto space-y-1 text-[10px] text-blue-300 font-mono">
                  {(selectedNode.logs || []).map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 font-mono">
              Select a Windows Server Node to inspect telemetry & run PowerShell scripts.
            </div>
          )}

        </div>
      </div>

      {/* Interactive Windows PowerShell 7.4 Execution Console */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-3">
            <Terminal className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Windows PowerShell 7.4 Core Sandbox Terminal</h3>
              <p className="text-[11px] text-zinc-400">Execute PowerShell scripts directly inside the selected Windows Server sandbox ({selectedNode.name})</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 mr-1">Preset Scripts:</span>
            <button
              onClick={() => { setPsInput('Get-Service | Where-Object {$_.Status -eq "Running"}'); handleExecutePowerShell('Get-Service | Where-Object {$_.Status -eq "Running"}'); }}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-blue-300 text-[10px] border border-zinc-800"
            >
              Get-Service
            </button>
            <button
              onClick={() => { setPsInput('Get-Process'); handleExecutePowerShell('Get-Process'); }}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-blue-300 text-[10px] border border-zinc-800"
            >
              Get-Process
            </button>
            <button
              onClick={() => { setPsInput('Get-WinEvent -LogName System'); handleExecutePowerShell('Get-WinEvent -LogName System'); }}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-blue-300 text-[10px] border border-zinc-800"
            >
              Get-WinEvent
            </button>
            <button
              onClick={() => { setPsInput('Test-NetConnection -ComputerName 10.142.0.10'); handleExecutePowerShell('Test-NetConnection -ComputerName 10.142.0.10'); }}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-blue-300 text-[10px] border border-zinc-800"
            >
              Test-NetConnection
            </button>
            <button
              onClick={() => { setPsInput('Invoke-WindowsDefenderScan'); handleExecutePowerShell('Invoke-WindowsDefenderScan'); }}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-blue-300 text-[10px] border border-zinc-800"
            >
              Defender Scan
            </button>
          </div>
        </div>

        {/* Terminal Screen Output */}
        <div className="bg-black p-4 rounded-xl border border-zinc-800 font-mono text-xs h-52 overflow-y-auto space-y-1 text-zinc-200">
          {psOutput.map((line, idx) => (
            <div key={idx} className={line.startsWith('PS C:') ? 'text-blue-400 font-bold' : line.includes('Running') ? 'text-emerald-400' : ''}>
              {line}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleExecutePowerShell(); }} className="flex items-center space-x-2">
          <span className="text-blue-400 font-bold text-xs">PS C:\&gt;</span>
          <input
            type="text"
            value={psInput}
            onChange={(e) => setPsInput(e.target.value)}
            placeholder="Type Windows PowerShell command or script..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5"
          >
            <Play className="h-3.5 w-3.5 text-white" />
            <span>Run PowerShell</span>
          </button>
        </form>
      </div>

      {/* Windows Event Viewer Telemetry Audit Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Windows Event Log Viewer & Audit Telemetry Stream</h3>
          </div>
          <span className="text-xs text-zinc-400">Showing Security, System & Defender Event IDs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="p-2.5">Event ID</th>
                <th className="p-2.5">Log Name</th>
                <th className="p-2.5">Level</th>
                <th className="p-2.5">Node Target</th>
                <th className="p-2.5">Source</th>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Message Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300 text-[11px]">
              {eventLogs.map((evt) => (
                <tr key={evt.id} className="hover:bg-zinc-900/50">
                  <td className="p-2.5 font-bold text-blue-400">{evt.eventId}</td>
                  <td className="p-2.5 text-white">{evt.logName}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold">
                      {evt.level}
                    </span>
                  </td>
                  <td className="p-2.5 font-bold text-white">{evt.nodeName}</td>
                  <td className="p-2.5 text-zinc-400">{evt.source}</td>
                  <td className="p-2.5 text-zinc-500">{evt.timestamp}</td>
                  <td className="p-2.5 text-zinc-300 truncate max-w-xs">{evt.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Provision Windows Core Server Sandbox */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-5 text-xs text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Provision Custom Windows Server Sandbox</h3>
              </div>
              <button onClick={() => setShowProvisionModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleProvisionNode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400">Windows Node Host Name</label>
                <input
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400">SubNet IP Address</label>
                <input
                  type="text"
                  value={newNodeIp}
                  onChange={(e) => setNewNodeIp(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400">Windows Server Role</label>
                <input
                  type="text"
                  value={newNodeRole}
                  onChange={(e) => setNewNodeRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400">Windows OS Version</label>
                <select
                  value={newNodeOs}
                  onChange={(e) => setNewNodeOs(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Windows Server 2025 Datacenter Core">Windows Server 2025 Datacenter Core</option>
                  <option value="Windows Server 2022 Datacenter">Windows Server 2022 Datacenter</option>
                  <option value="Windows Server 2019 Datacenter">Windows Server 2019 Datacenter</option>
                  <option value="Windows 11 Enterprise LTSC Sandbox">Windows 11 Enterprise LTSC Sandbox</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400">Sandbox Isolation Mode</label>
                <select
                  value={newNodeSandbox}
                  onChange={(e) => setNewNodeSandbox(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Hyper-V Enclave VBS/HVCI">Hyper-V Enclave VBS/HVCI</option>
                  <option value="Windows Defender App Guard">Windows Defender App Guard</option>
                  <option value="AppContainer Sandbox">AppContainer Sandbox</option>
                  <option value="Virtualization-Based Security (VBS)">Virtualization-Based Security (VBS)</option>
                  <option value="Hyper-V Guarded Host">Hyper-V Guarded Host</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg"
                >
                  Provision Windows Sandbox
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
