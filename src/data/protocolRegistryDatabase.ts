import { keccak256, encodePacked } from 'viem';
import { ProtocolDefinition, EngineProtocolCategory, ProtocolLogEntry } from '../types/protocolEngine';

/**
 * Universal In-Memory Protocol Adapter Database
 * Stores standard adapters, secrets safely in encrypted/backend-only memory,
 * and tracks dependencies, connections, and telemetry logs.
 */

// Secret vault: protocolId => Map<key, encryptedValue>
const backendSecretVault: Map<string, Record<string, string>> = new Map();

// Protocol Audit Logs
export const protocolAuditLogs: ProtocolLogEntry[] = [
  {
    id: 'log-proto-01',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    protocolId: 'https',
    level: 'INFO',
    message: 'HTTPS Core Protocol initialized with TLS 1.3 Strict ALPN (h2, http/1.1)',
    actor: 'system'
  },
  {
    id: 'log-proto-02',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    protocolId: 'websocket',
    level: 'AUDIT',
    message: 'WebSocket Secure Gateway bound to port 3000 /api/ws endpoint',
    actor: 'admin@bte.vox'
  },
  {
    id: 'log-proto-03',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    protocolId: 'dns',
    level: 'INFO',
    message: 'DNS Over HTTPS (DoH) resolver synced with 12 local domain zone records',
    actor: 'dns-resolver'
  },
  {
    id: 'log-proto-04',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    protocolId: 'wireguard',
    level: 'SECURITY',
    message: 'WireGuard Mesh Kernel tunnel interface wg0 active with ChaCha20-Poly1305',
    actor: 'kernel-driver'
  }
];

export const initialProtocolCatalog: ProtocolDefinition[] = [
  // ==========================================
  // 1. INTERNET & CORE TRANSPORT (internet-transport)
  // ==========================================
  {
    id: 'ipv6',
    name: 'IPv6 / Dual-Stack Routing Stack',
    version: 'RFC 8200',
    categories: ['internet-transport', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: '128-bit global unicast address routing with SLAAC stateless autoconfiguration, ICMPv6 neighbor discovery, and flow labelling.',
    transport: 'Raw IP (Layer 3)',
    defaultPorts: [0],
    encrypted: false,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Kernel raw IP socket creation requires CAP_NET_RAW and root network permissions.',
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x1001000000000000000000000000000000000000000000000000000000000001',
    dependencies: [],
    securityRequirements: [
      { name: 'ICMPv6 Rate Limiting', level: 'HIGH', description: 'Prevent neighbor discovery flooding attacks', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: '2001:db8:85a3::8a2e:370:7334', status: 'bound' }
    ],
    config: {
      ENABLE_DUAL_STACK: true,
      SLAAC_ENABLED: true,
      PRIVACY_EXTENSIONS: true,
      PREFIX_DELEGATION_SUBNET: '2001:db8:vox::/48'
    },
    installedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'tcp',
    name: 'TCP Stream Manager & BBR Congestion Control',
    version: 'RFC 9293',
    categories: ['internet-transport', 'network'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Transmission Control Protocol stack with BBR v3 congestion control, selective acknowledgments (SACK), and SYN cookie mitigation.',
    transport: 'IP / TCP (Layer 4)',
    defaultPorts: [80, 443, 8080],
    encrypted: false,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'ipv6', name: 'IPv6 / IPv4 Core', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'SYN Cookie Defense', level: 'HIGH', description: 'Mitigate half-open TCP SYN floods', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      CONGESTION_ALGORITHM: 'BBRv3',
      TCP_FAST_OPEN: true,
      WINDOW_SCALING: true,
      MAX_SYN_BACKLOG: 4096
    },
    installedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'udp',
    name: 'UDP Datagram Multiplexer & Zero-Loss Engine',
    version: 'RFC 768',
    categories: ['internet-transport', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Connectionless, low-overhead datagram multiplexer optimized for high-packet-per-second realtime gaming, video feeds, and QUIC.',
    transport: 'IP / UDP (Layer 4)',
    defaultPorts: [53, 443, 51820],
    encrypted: false,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [],
    securityRequirements: [
      { name: 'Amplification Protection', level: 'HIGH', description: 'Limit outbound responses to unverified IPs', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      BUFFER_SIZE_MB: 32,
      GRO_GSO_ACCELERATION: true
    },
    installedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'quic_core',
    name: 'QUIC v1 Transport & Stream Multiplexer',
    version: 'RFC 9000',
    categories: ['internet-transport', 'web', 'network'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'UDP-based multiplexed and secure transport protocol with 0-RTT connection establishment, connection migration, and loss recovery.',
    transport: 'UDP / TLS 1.3',
    defaultPorts: [443, 8443],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'udp', name: 'UDP Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'TLS 1.3 Embedded Handshake', level: 'CRITICAL', description: 'Zero plaintext packet headers', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      MAX_CONCURRENT_STREAMS: 1000,
      IDLE_TIMEOUT_MS: 30000,
      ENABLE_0RTT: true
    },
    installedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 2. WEB & HYPERMEDIA (web)
  // ==========================================
  {
    id: 'https',
    name: 'HTTPS / HTTP-2 / HTTP-3 Edge Protocol',
    version: '1.1',
    categories: ['web', 'internet-transport', 'network', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Core web transport supporting HTTP/1.1, HTTP/2 multiplexing, and HTTP/3 QUIC with automatic TLS termination and rate-limiting.',
    transport: 'TCP / UDP (QUIC)',
    defaultPorts: [80, 443],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Binding to low system ports 80/443 requires CAP_NET_BIND_SERVICE or reverse proxy gateway.',
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x99201a02b34903e102948f12a02b3494a5e1e4baab89f3a32518a88c31bc87f',
    protocolHash: '0x3e102948f12a02b34901f82a77e1124b89a01f89c02113aa01f99201a02b3490',
    dependencies: [
      { id: 'tcp', name: 'TCP / QUIC Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'HSTS Preload', level: 'HIGH', description: 'Strict-Transport-Security enforced max-age=31536000', fulfilled: true },
      { name: 'Automated Rate Limiting', level: 'HIGH', description: 'DDoS protection bucket: 500 req/min per IP', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'https://0.0.0.0:3000', status: 'bound' }
    ],
    config: {
      HOST: '0.0.0.0',
      PORT: 3000,
      ENABLE_HTTP2: true,
      ENABLE_HTTP3_QUIC: true,
      RATE_LIMIT_PER_MIN: 600,
      TIMEOUT_MS: 30000,
      ALLOWED_ORIGINS: ['*']
    },
    installedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'websocket',
    name: 'WebSocket & WSS Realtime Gateway',
    version: '1.0',
    categories: ['web', 'messaging', 'network', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Full-duplex bidirectional communication channel with heartbeat keepalive, sub-millisecond telemetry broadcast, and binary frame handling.',
    transport: 'TCP (Upgrade)',
    defaultPorts: [3000, 8080],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x8812bf0093d011f23e2b1a908d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c',
    dependencies: [
      { id: 'https', name: 'HTTP / Upgrade Handshake Handler', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Origin Validation', level: 'HIGH', description: 'Cross-Site WebSocket Hijacking (CSWSH) protection', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-vector-02', type: 'server', name: 'Neural-Vector-Store', targetEndpoint: 'wss://10.142.0.45:6379/ws', status: 'bound' }
    ],
    config: {
      PATH: '/api/ws',
      HEARTBEAT_INTERVAL_MS: 15000,
      MAX_PAYLOAD_BYTES: 10485760,
      PER_MESSAGE_DEFLATE: true
    },
    installedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'webtransport',
    name: 'WebTransport Datagram Bridge',
    version: 'W3C Draft',
    categories: ['web', 'realtime-media'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Next-generation web communication protocol using HTTP/3 transport for bidirectional and unidirectional datagrams.',
    transport: 'QUIC / HTTP/3',
    defaultPorts: [4433],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'quic_core', name: 'QUIC v1 Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Origin Check', level: 'HIGH', description: 'Verify client web origin header against allowed list', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      MAX_DATAGRAM_SIZE: 1200,
      ALLOW_UNRELIABLE: true
    }
  },
  {
    id: 'sse',
    name: 'Server-Sent Events (SSE) Broadcast Feed',
    version: 'HTML5',
    categories: ['web', 'messaging'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Unidirectional realtime streaming over HTTP for continuous state, market ticker updates, and node event delivery.',
    transport: 'HTTP / HTTPS',
    defaultPorts: [3000],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'https', name: 'HTTPS Gateway', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Keep-Alive Headers', level: 'STANDARD', description: 'X-Accel-Buffering: no configured for nginx proxy', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      RETRY_MS: 3000,
      PING_INTERVAL_MS: 10000
    },
    installedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 3. DOMAIN & SERVICE DISCOVERY (domain-discovery)
  // ==========================================
  {
    id: 'dns',
    name: 'DNS / DoH / DoT Sovereign Resolver',
    version: '1.0',
    categories: ['domain-discovery', 'network', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Decentralized Domain Name System with DNSSEC cryptographic signing, DNS over HTTPS (DoH), and DNS over TLS (DoT) support.',
    transport: 'UDP / TCP (53) / HTTPS (443)',
    defaultPorts: [53, 853],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Authoritative port 53 listening requires root / net_bind capabilities.',
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x77e1124b89a01f89c02113aa01f99201a02b34903e102948f12a02b34901f82a',
    dependencies: [
      { id: 'udp', name: 'UDP 53 Transport', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'DNSSEC Cryptographic Attestation', level: 'HIGH', description: 'RRSIG and DNSKEY records verified against root key', fulfilled: true }
    ],
    connectedServices: [
      { id: 'dom-vox-01', type: 'domain', name: 'agvora.vox', targetEndpoint: 'ns1.vox.network', status: 'bound' }
    ],
    config: {
      LISTEN_PORT: 53,
      DOH_ENDPOINT: 'https://dns.vox.network/dns-query',
      DOT_PORT: 853,
      ENABLE_DNSSEC: true,
      UPSTREAM_SERVERS: ['1.1.1.1', '8.8.8.8'],
      LOCAL_ZONES_COUNT: 12
    },
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'doh_resolver',
    name: 'DNS-Over-HTTPS Proxy & Encrypted Recursive Engine',
    version: 'RFC 8484',
    categories: ['domain-discovery', 'security-crypto'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Privacy-preserving DNS resolver passing queries over TLS 1.3 HTTPS with zero ISP eavesdropping.',
    transport: 'HTTPS',
    defaultPorts: [443],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'https', name: 'HTTPS Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Strict TLS 1.3', level: 'HIGH', description: 'No unencrypted fallback queries', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      HTTP_PATH: '/dns-query',
      CACHE_TTL_MINUTES: 60,
      LOG_QUERIES: false
    },
    installedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'mdns',
    name: 'mDNS Multicast Service Discovery & ZeroConf',
    version: 'RFC 6762',
    categories: ['domain-discovery', 'network-management'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Zero-configuration subnet hostname resolution without central DNS servers, querying 224.0.0.251 / ff02::fb.',
    transport: 'UDP Multicast (5353)',
    defaultPorts: [5353],
    encrypted: false,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'Local Subnet Boundary', level: 'MEDIUM', description: 'Multicast packets bound to link-local scope', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      DOMAIN_SUFFIX: '.local',
      MULTICAST_TTL: 255
    }
  },

  // ==========================================
  // 4. EMAIL & MESSAGING DELIVERY (email)
  // ==========================================
  {
    id: 'smtp',
    name: 'SMTP / SMTPS Submission Adapter',
    version: '1.0',
    categories: ['email', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Simple Mail Transfer Protocol adapter with STARTTLS/TLS encryption, authenticated delivery, retry queues, and bounce handling.',
    transport: 'TCP',
    defaultPorts: [25, 465, 587],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x12a9b3489e21184a51198c21a482103f568a121041ab9f10928a4a5e1e4baab8',
    dependencies: [
      { id: 'tcp', name: 'TCP Transport Layer', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'STARTTLS / TLS', level: 'HIGH', description: 'Requires encrypted transport on port 465/587', fulfilled: true },
      { name: 'SPF/DKIM/DMARC Signing', level: 'HIGH', description: 'Cryptographic identity email provenance', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'smtp://10.142.0.12:587', status: 'bound' }
    ],
    config: {
      SMTP_HOST: 'mail.vox.network',
      SMTP_PORT: 587,
      SMTP_SECURITY: 'STARTTLS',
      SMTP_FROM: 'noreply@vox.network'
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'imap',
    name: 'IMAP / IMAPS Mail Receiver Adapter',
    version: '1.0',
    categories: ['email', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Internet Message Access Protocol adapter for synchronizing inbound email mailboxes securely over TLS 1.3.',
    transport: 'TCP',
    defaultPorts: [143, 993],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'tcp', name: 'TCP Transport Layer', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'IMAPS (Port 993)', level: 'HIGH', description: 'TLS encrypted mailbox sync', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      IMAP_HOST: 'imap.vox.network',
      IMAP_PORT: 993,
      IMAP_SECURITY: 'TLS',
      IDLE_SUPPORT: true
    },
    hasSecretConfig: true
  },
  {
    id: 'pop3',
    name: 'POP3 / POP3S Legacy Mail Client',
    version: '1.0',
    categories: ['email', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Post Office Protocol v3 adapter with TLS encryption for single-device client mailbox downloading.',
    transport: 'TCP',
    defaultPorts: [110, 995],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'TLS Mandatory', level: 'HIGH', description: 'Prevent plaintext password sniffing', fulfilled: true }
    ],
    connectedServices: [],
    config: { POP3_HOST: 'pop.vox.network', POP3_PORT: 995, POP3_SSL: true },
    hasSecretConfig: true
  },
  {
    id: 'jmap',
    name: 'JMAP (JSON Meta Application Protocol) Mail API',
    version: 'RFC 8620',
    categories: ['email', 'application-apis'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Modern, efficient JSON-based mail protocol replacing IMAP/SMTP with batched push operations and low bandwidth consumption.',
    transport: 'HTTPS / JSON',
    defaultPorts: [443],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'https', name: 'HTTPS Core', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Bearer Token Auth', level: 'HIGH', description: 'Cryptographic API token authentication', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      API_ENDPOINT: 'https://jmap.vox.network/api/',
      MAX_BATCH_CALLS: 50
    },
    hasSecretConfig: true
  },

  // ==========================================
  // 5. SECURITY & CRYPTOGRAPHY (security-crypto)
  // ==========================================
  {
    id: 'wireguard',
    name: 'WireGuard Mesh Gateway & Cryptographic Tunnel',
    version: '1.0.0',
    categories: ['security-crypto', 'routing', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Extremely fast, modern cryptographic VPN running kernel-accelerated ChaCha20-Poly1305 and Noise Protocol handshakes.',
    transport: 'UDP (51820)',
    defaultPorts: [51820],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Kernel network interface creation (wg0) requires CAP_NET_ADMIN.',
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x5001000000000000000000000000000000000000000000000000000000000005',
    dependencies: [
      { id: 'udp', name: 'UDP Core', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Curve25519 Keys', level: 'CRITICAL', description: 'Zero passwords, purely public-key authenticated peers', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: '10.142.0.12:51820', status: 'bound' }
    ],
    config: {
      INTERFACE: 'wg0',
      PORT: 51820,
      SUBNET: '10.200.0.0/24',
      MTU: 1420,
      PERSISTENT_KEEPALIVE: 25
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'ssh_bastion',
    name: 'SSH-2 Secure Bastion & Ed25519 Certificate Authority',
    version: 'OpenSSH 9.6',
    categories: ['security-crypto', 'file-transfer', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Secure shell remote administration daemon with Ed25519 host keys, certificate authority signing, and chrooted SFTP subsystems.',
    transport: 'TCP (22)',
    defaultPorts: [22, 2222],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Privileged user privilege separation and PAM authentication.',
    status: 'installed',
    dependencies: [
      { id: 'tcp', name: 'TCP', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Password Auth Disabled', level: 'CRITICAL', description: 'Only cryptographic Ed25519 keys accepted', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PORT: 22,
      PERMIT_ROOT_LOGIN: 'no',
      KEX_ALGORITHMS: 'curve25519-sha256',
      CIPHERS: 'chacha20-poly1305@openssh.com,aes256-gcm@openssh.com'
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'noise_protocol',
    name: 'Noise Protocol Framework (XX / IK Handshakes)',
    version: 'Revision 34',
    categories: ['security-crypto', 'peer-to-peer'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Cryptographic framework providing identity-hiding, mutual authentication, and replay protection for peer-to-peer tunnels.',
    transport: 'TCP / UDP / Raw Frames',
    defaultPorts: [9876],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [],
    securityRequirements: [
      { name: 'Mutual Forward Secrecy', level: 'CRITICAL', description: 'Ephemeral key exchange on every connection', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PATTERN: 'Noise_XX_25519_ChaChaPoly_BLAKE2s',
      PROLOGUE: 'BTE-SOVEREIGN-NET-V1'
    },
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 6. IDENTITY & AUTHENTICATION (identity-auth)
  // ==========================================
  {
    id: 'oauth2',
    name: 'OAuth 2.0 / OpenID Connect (OIDC)',
    version: '2.0',
    categories: ['identity-auth', 'web'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Industry-standard authorization protocol with PKCE (Proof Key for Code Exchange) and JWT identity claims bound to blockchain anchors.',
    transport: 'HTTPS',
    defaultPorts: [443],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x6001000000000000000000000000000000000000000000000000000000000006',
    dependencies: [
      { id: 'https', name: 'HTTPS Transport', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'PKCE Enforced (S256)', level: 'CRITICAL', description: 'Mitigates authorization code interception attacks', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      AUTH_ENDPOINT: 'https://auth.vox.network/oauth2/v1/auth',
      TOKEN_ENDPOINT: 'https://auth.vox.network/oauth2/v1/token',
      SCOPES: ['openid', 'profile', 'email', 'vox:node:read']
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'webauthn',
    name: 'WebAuthn & Passkeys (FIDO2)',
    version: 'L2',
    categories: ['identity-auth', 'security-crypto'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Hardware-backed biometric passkey authentication using Web Authentication API with zero password transmission.',
    transport: 'Browser Native / HTTPS',
    defaultPorts: [443],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'https', name: 'HTTPS Strict Origin', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Hardware Attestation (TPM/YubiKey)', level: 'CRITICAL', description: 'Asymmetric challenge-response signature verified on server', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      RP_NAME: 'Big Tech Enterprise Sovereign Auth',
      RP_ID: 'vox.network',
      USER_VERIFICATION: 'preferred'
    },
    installedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'mtls',
    name: 'Mutual TLS (mTLS) & X.509 Service PKI',
    version: '1.3',
    categories: ['identity-auth', 'security-crypto', 'network'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Mutual certificate authentication for zero-trust node-to-node and server-to-subnet traffic with automatic certificate rotation.',
    transport: 'TLS',
    defaultPorts: [8443],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a908d7c6b5a4f3e2d1c0b',
    dependencies: [],
    securityRequirements: [
      { name: 'Client Certificate Verification', level: 'CRITICAL', description: 'Zero unauthenticated requests allowed through edge gateway', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'https://10.142.0.12:8443', status: 'bound' }
    ],
    config: {
      CA_CERT_PATH: '/etc/ssl/certs/vox-root-ca.crt',
      CERT_EXPIRY_WARNING_DAYS: 30,
      AUTO_ROTATE: true
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'did_w3c_anchor',
    name: 'W3C DID Sovereign Identity Anchor',
    version: '1.0',
    categories: ['identity-auth', 'blockchain-web3'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Decentralized Identifiers (DIDs) resolved from blockchain smart contract anchors, proving key ownership cryptographically.',
    transport: 'EVM JSON-RPC / Secp256k1',
    defaultPorts: [8545],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [],
    securityRequirements: [
      { name: 'Secp256k1 Proofs', level: 'CRITICAL', description: 'Keccak-256 signatures validated against on-chain anchor registry', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      DID_METHOD: 'did:bte',
      RESOLVER_REGISTRY_ADDRESS: '0x71C8A942a9b3112028Cef8109d4310E39A20b001'
    },
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 7. ROUTING & GATEWAY ROUTING (routing)
  // ==========================================
  {
    id: 'bgp4',
    name: 'BGP-4 Autonomous Border Routing & Peering',
    version: 'RFC 4271',
    categories: ['routing', 'internet-transport'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Border Gateway Protocol v4 daemon for dynamic Internet and subnet routing table exchange with RPKI origin validation.',
    transport: 'TCP (179)',
    defaultPorts: [179],
    encrypted: false,
    requiresSecrets: true,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'BGP port 179 and kernel routing table modification.',
    status: 'available',
    dependencies: [
      { id: 'tcp', name: 'TCP', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'RPKI Route Origin Validation', level: 'CRITICAL', description: 'Mitigate BGP route hijacking', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      LOCAL_ASN: 64512,
      ROUTER_ID: '10.142.0.1',
      HOLD_TIME_SECONDS: 90
    },
    hasSecretConfig: true
  },
  {
    id: 'ospfv3',
    name: 'OSPFv3 Interior Gateway Protocol',
    version: 'RFC 5340',
    categories: ['routing', 'internet-transport'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Open Shortest Path First link-state routing protocol for scalable, zero-loop IPv6 / IPv4 enterprise intra-subnet routing.',
    transport: 'Raw IP (Protocol 89)',
    defaultPorts: [89],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'OSPF raw IP socket handling.',
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'IPsec Authentication Trailer', level: 'HIGH', description: 'Cryptographic OSPF packet integrity', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      AREA_ID: '0.0.0.0',
      DEAD_INTERVAL_SECONDS: 40
    },
    hasSecretConfig: true
  },
  {
    id: 'babel_mesh',
    name: 'Babel Distance-Vector Mesh Routing',
    version: 'RFC 8966',
    categories: ['routing', 'peer-to-peer'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Loop-avoiding distance-vector routing protocol designed for wireless mesh, dynamic overlay networks, and wired subnets.',
    transport: 'UDP (6696)',
    defaultPorts: [6696],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Kernel route table updates.',
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'HMAC-SHA256 Auth', level: 'HIGH', description: 'Prevent forged routing updates in mesh', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PORT: 6696,
      HELLO_INTERVAL_MS: 4000
    },
    hasSecretConfig: true
  },

  // ==========================================
  // 8. NETWORK MANAGEMENT & CONTROL (network-management)
  // ==========================================
  {
    id: 'snmp',
    name: 'SNMP v3 Telemetry & Device Monitoring',
    version: '3.0',
    categories: ['network-management', 'internet-transport'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Simple Network Management Protocol v3 with USM user-based authentication and privacy encryption for switch/router health monitoring.',
    transport: 'UDP',
    defaultPorts: [161, 162],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'UDP 161/162 trap monitoring interacts with core hardware networking gear.',
    status: 'available',
    dependencies: [
      { id: 'udp', name: 'UDP Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'SNMPv3 USM (AuthPriv)', level: 'HIGH', description: 'Insecure SNMPv1/v2c community strings strictly blocked', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      SNMP_PORT: 161,
      SECURITY_LEVEL: 'authPriv',
      AUTH_PROTOCOL: 'SHA-256',
      PRIV_PROTOCOL: 'AES-256'
    },
    hasSecretConfig: true
  },
  {
    id: 'ntp',
    name: 'NTP / PTP Time Synchronization Protocol',
    version: '4.0',
    categories: ['network-management', 'internet-transport', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Network Time Protocol & Precision Time Protocol adapter ensuring microsecond consensus synchronization across distributed validator nodes.',
    transport: 'UDP',
    defaultPorts: [123],
    encrypted: false,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Setting system clock hardware interrupts requires SYS_TIME capability.',
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x512089a012e345b67c89d012e345f67a89b012c345b67c89d012e345f67a89b0',
    dependencies: [
      { id: 'udp', name: 'UDP 123', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'NTS (Network Time Security)', level: 'MEDIUM', description: 'Cryptographic authentication of time source servers', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'ntp://10.142.0.12:123', status: 'bound' }
    ],
    config: {
      NTP_SERVERS: ['pool.ntp.org', 'time.google.com', 'time.cloudflare.com'],
      SYNC_INTERVAL_SECONDS: 300
    },
    installedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'netconf_yang',
    name: 'NETCONF / YANG Device Automation',
    version: 'RFC 6241',
    categories: ['network-management', 'application-apis'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'XML/JSON network configuration management protocol over SSH-2 using standardized YANG data models.',
    transport: 'SSH-2 (830)',
    defaultPorts: [830],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'ssh_bastion', name: 'SSH-2 Core', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Candidate Datastore Locking', level: 'HIGH', description: 'Atomic rollback and transaction commits', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PORT: 830,
      CAPABILITIES: ['urn:ietf:params:netconf:base:1.1']
    },
    hasSecretConfig: true
  },

  // ==========================================
  // 9. FILE & ASSET TRANSFER (file-transfer)
  // ==========================================
  {
    id: 'sftp',
    name: 'SFTP (SSH File Transfer Protocol)',
    version: 'SSH-2',
    categories: ['file-transfer', 'security-crypto', 'storage-distributed', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Secure file access, file transfer, and file management functionality over any reliable data stream secured by SSH-2.',
    transport: 'SSH / TCP',
    defaultPorts: [22, 2222],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x3a201d0873e0a12d4c8e1a708b89402120x9f2a819c4b312e0984f1a23e5d12',
    dependencies: [
      { id: 'ssh_bastion', name: 'OpenSSH Daemon', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Ed25519 Public Key Only', level: 'CRITICAL', description: 'Password-based root login permanently disabled', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-vector-02', type: 'server', name: 'Neural-Vector-Store', targetEndpoint: 'sftp://10.142.0.45:22', status: 'bound' }
    ],
    config: {
      SFTP_PORT: 2222,
      CHROOT_DIRECTORY: '/data/vault',
      ALLOW_KEY_AUTH: true,
      ALLOW_PASSWORD_AUTH: false
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'rsync_daemon',
    name: 'Rsync Delta-Transfer Engine',
    version: '3.2.7',
    categories: ['file-transfer', 'storage-distributed'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Fast, versatile, remote file-copying tool with rolling checksum delta encoding to minimize network bandwidth.',
    transport: 'TCP (873) / SSH',
    defaultPorts: [873],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'SSH Tunnel Only', level: 'HIGH', description: 'Raw rsync 873 port encapsulated in SSH', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      MAX_CONNECTIONS: 20,
      TIMEOUT: 300,
      READ_ONLY: true
    },
    hasSecretConfig: true
  },
  {
    id: 'webdav',
    name: 'WebDAV Over HTTPS Storage Protocol',
    version: 'RFC 4918',
    categories: ['file-transfer', 'web', 'storage-distributed'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Web Distributed Authoring and Versioning extension of HTTP allowing clients to perform remote Web content authoring operations.',
    transport: 'HTTPS (443)',
    defaultPorts: [443],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'https', name: 'HTTPS Gateway', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Digest / Bearer Authentication', level: 'HIGH', description: 'Enforce strong user auth and lock timeouts', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      ROOT_PATH: '/webdav',
      ENABLE_LOCKING: true
    },
    hasSecretConfig: true
  },

  // ==========================================
  // 10. APPLICATION APIS & RPC (application-apis)
  // ==========================================
  {
    id: 'grpc',
    name: 'gRPC & Protocol Buffers (Protobuf)',
    version: '1.x',
    categories: ['application-apis', 'messaging', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Ultra-low latency RPC framework using HTTP/2 binary framing and Protobuf serialization for microservices and tensor streaming.',
    transport: 'HTTP/2',
    defaultPorts: [50051],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x1000100000000000000000000000000000000000000000000000000000000010',
    dependencies: [
      { id: 'https', name: 'HTTP/2 Multiplexing', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'gRPC TLS Credentials', level: 'HIGH', description: 'Encrypted channel credentials with metadata token injection', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-vector-02', type: 'server', name: 'Neural-Vector-Store', targetEndpoint: 'grpc://10.142.0.45:50051', status: 'bound' }
    ],
    config: {
      GRPC_HOST: '0.0.0.0',
      GRPC_PORT: 50051,
      MAX_RECEIVE_MESSAGE_LENGTH: 52428800,
      KEEPALIVE_TIME_MS: 30000
    },
    installedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'graphql_ws',
    name: 'GraphQL WebSocket Subscriptions & Schema Engine',
    version: 'October 2021',
    categories: ['application-apis', 'web'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Declarative data query language and runtime for real-time GraphQL subscriptions with strict field-level authorization.',
    transport: 'WebSocket / HTTPS',
    defaultPorts: [4000],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'websocket', name: 'WebSocket Gateway', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Query Complexity Limiting', level: 'HIGH', description: 'Mitigate nested recursive query DoS attacks', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      ENDPOINT: '/graphql',
      SUBSCRIPTION_PATH: '/graphql/subscriptions',
      MAX_DEPTH: 7
    },
    installedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'openapi_rest',
    name: 'OpenAPI 3.1 REST Gateway & Schema Validator',
    version: '3.1.0',
    categories: ['application-apis', 'web'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Standardized REST API gateway with automatic request/response JSON Schema validation, JWT validation, and automated Swagger docs.',
    transport: 'HTTPS',
    defaultPorts: [3000],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'https', name: 'HTTPS Edge', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Strict Request Schema Validation', level: 'HIGH', description: 'Reject invalid payload payloads automatically', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      SPEC_PATH: '/api/docs/openapi.json',
      STRICT_VALIDATION: true
    },
    installedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 11. MESSAGING & EVENT STREAMING (messaging)
  // ==========================================
  {
    id: 'mqtt',
    name: 'MQTT v5.0 IoT & Telemetry Broker',
    version: '5.0',
    categories: ['messaging', 'iot', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Lightweight publish/subscribe protocol designed for low-bandwidth, high-latency satellite, aerospace, and IoT node sensors.',
    transport: 'TCP / WebSocket',
    defaultPorts: [1883, 8883],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x1100100000000000000000000000000000000000000000000000000000000011',
    dependencies: [
      { id: 'tcp', name: 'TCP Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'MQTTS (8883) Encrypted Broker', level: 'HIGH', description: 'Prevents plain MQTT 1883 packet snooping', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      BROKER_HOST: 'mqtt.vox.network',
      BROKER_PORT: 8883,
      QOS_LEVEL: 1,
      TOPIC_PREFIX: 'vox/telemetry/nodes/'
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'kafka_wire',
    name: 'Apache Kafka Wire Protocol & Partition Stream',
    version: 'v3.7',
    categories: ['messaging', 'application-apis'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Distributed commit log protocol for high-throughput, partitioned, fault-tolerant event ingestion and analytics pipelines.',
    transport: 'TCP (9092)',
    defaultPorts: [9092, 9093],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'tcp', name: 'TCP', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'SASL/SCRAM-SHA-512', level: 'HIGH', description: 'Cryptographic producer/consumer authentication', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      BOOTSTRAP_SERVERS: 'kafka.vox.network:9092',
      SECURITY_PROTOCOL: 'SASL_SSL',
      DEFAULT_PARTITIONS: 6
    },
    hasSecretConfig: true
  },
  {
    id: 'matrix',
    name: 'Matrix Federated Messaging Adapter',
    version: 'v1.9',
    categories: ['messaging', 'peer-to-peer', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Decentralized, federated, end-to-end encrypted group chat and real-time state synchronization over Olm/Megolm.',
    transport: 'HTTPS',
    defaultPorts: [8448],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'https', name: 'HTTPS', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Megolm End-to-End Encryption', level: 'CRITICAL', description: 'Zero-knowledge server message payload routing', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      HOMESERVER_URL: 'https://matrix.vox.network',
      SERVER_NAME: 'vox.network',
      ENABLE_FEDERATION: true
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 12. DISTRIBUTED STORAGE & DB WIRE (storage-distributed)
  // ==========================================
  {
    id: 's3_object_storage',
    name: 'S3-Compatible Object Storage API',
    version: 'v4',
    categories: ['storage-distributed', 'web', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'High-throughput object storage adapter with AWS Signature v4 authentication, bucket encryption, and multipart uploads.',
    transport: 'HTTPS',
    defaultPorts: [9000, 443],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x6f9c2b7080e1a36d509a776a8d2310ce56c7000234ea789cd12e0000zbda5510',
    dependencies: [
      { id: 'https', name: 'HTTPS', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Server-Side Encryption (SSE-KMS)', level: 'HIGH', description: 'AES-256 bucket level encryption at rest', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'https://s3.vox.network:9000', status: 'bound' }
    ],
    config: {
      ENDPOINT: 'https://s3.vox.network:9000',
      REGION: 'vox-global-1',
      DEFAULT_BUCKET: 'vox-encrypted-vault',
      SIGNATURE_VERSION: 'v4'
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'ipfs',
    name: 'IPFS & Bitswap Content Addressing',
    version: '0.27',
    categories: ['storage-distributed', 'peer-to-peer', 'network'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'InterPlanetary File System peer-to-peer hypermedia protocol with SHA-256 CIDv1 addressing and Bitswap block exchange.',
    transport: 'libp2p (TCP/QUIC/WebSockets)',
    defaultPorts: [4001, 5001, 8080],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x0014751e76e8199196d454941c45d1b3a323f1433bd612a9b3489e21184a5119',
    dependencies: [],
    securityRequirements: [
      { name: 'Content Addressing Cryptographic Integrity', level: 'CRITICAL', description: 'Data immutable via cryptographic Merkle DAG root verification', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'http://10.142.0.12:8080/ipfs/', status: 'bound' }
    ],
    config: {
      API_PORT: 5001,
      GATEWAY_PORT: 8080,
      SWARM_PORT: 4001,
      ENABLE_PUBSUB: true
    },
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'postgres_wire',
    name: 'PostgreSQL Frontend/Backend Wire Protocol',
    version: '3.0',
    categories: ['storage-distributed', 'application-apis'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Native PostgreSQL binary wire protocol for streaming SQL queries, parameterized statements, and binary COPY commands.',
    transport: 'TCP SSL (5432)',
    defaultPorts: [5432],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'tcp', name: 'TCP', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'SCRAM-SHA-256 Password Hashing', level: 'HIGH', description: 'Zero plaintext passwords in wire authentication', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      HOST: '10.142.0.45',
      PORT: 5432,
      SSL_MODE: 'require',
      MAX_POOL_SIZE: 20
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 13. PEER-TO-PEER & OVERLAYS (peer-to-peer)
  // ==========================================
  {
    id: 'libp2p',
    name: 'libp2p Modular P2P Networking Stack',
    version: '0.51',
    categories: ['peer-to-peer', 'network'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Modular network stack for P2P applications with Kademlia DHT routing, Noise encryption protocol, and multi-address multiplexing.',
    transport: 'TCP / QUIC / WebSockets / WebTransport',
    defaultPorts: [4001],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x94201a02b34903e102948f12a02b3494a5e1e4baab89f3a32518a88c31bc87f1',
    dependencies: [],
    securityRequirements: [
      { name: 'Noise Protocol Handshake (IK / XX)', level: 'CRITICAL', description: 'End-to-end peer encrypted streams', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: '/ip4/10.142.0.12/tcp/4001/p2p/12D3KooW...', status: 'bound' }
    ],
    config: {
      DHT_MODE: 'server',
      PUBSUB_ROUTER: 'GossipSub',
      MAX_PEERS: 250
    },
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'tor_onion_v3',
    name: 'Tor Onion Routing v3 Hidden Service',
    version: 'v3',
    categories: ['peer-to-peer', 'security-crypto'],
    isVirtualServer: true,
    isNetwork: true,
    description: '56-character Ed25519 anonymous hidden service endpoint providing total transport layer anonymity and NAT punching.',
    transport: 'SOCKS5 / TCP (9050)',
    defaultPorts: [9050, 9051],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'Zero Direct IP Leakage', level: 'CRITICAL', description: 'Strict proxy isolation preventing cleartext routing', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      SOCKS_PORT: 9050,
      CONTROL_PORT: 9051,
      ISOLATE_DEST_ADDR: true
    },
    hasSecretConfig: true
  },
  {
    id: 'kademlia_dht',
    name: 'Kademlia DHT Distributed Hash Table',
    version: '1.0',
    categories: ['peer-to-peer', 'domain-discovery'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'XOR metric distributed routing algorithm enabling fast logarithmic peer and content record location.',
    transport: 'UDP / libp2p',
    defaultPorts: [4001],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'libp2p', name: 'libp2p Core', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Sybil Defense Bucket Sizing', level: 'HIGH', description: 'K-bucket alpha concurrency bounds', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      K_BUCKET_SIZE: 20,
      ALPHA_CONCURRENCY: 3
    },
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 14. BLOCKCHAIN & WEB3 STATE (blockchain-web3)
  // ==========================================
  {
    id: 'blockchain_rpc',
    name: 'Blockchain EVM JSON-RPC & Identity Registry',
    version: '2.0',
    categories: ['blockchain-web3', 'identity-auth', 'network'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'EVM JSON-RPC adapter for querying smart contracts, verifying Identity Anchors, submitting transactions, and listening to on-chain protocol registry events.',
    transport: 'HTTPS / WebSocket JSON-RPC',
    defaultPorts: [8545, 8546],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C000000000000000000000000',
    protocolHash: '0x4a9f821c00984b2e1140928a34bc7e11248901a02b34903e102948f12a02b349',
    dependencies: [
      { id: 'https', name: 'HTTPS / WSS Gateway', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Private Key In-Memory Vault Guard', level: 'CRITICAL', description: 'Zero private keys exposed over API or client JS', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'https://rpc.vox.network:8545', status: 'bound' }
    ],
    config: {
      CHAIN_ID: 104,
      NETWORK_NAME: 'BTE-Sovereign-EVM',
      RPC_URL: 'https://rpc.vox.network:8545',
      REGISTRY_CONTRACT_ADDRESS: '0x71C8A942a9b3112028Cef8109d4310E39A20b001',
      GAS_PRICE_GWEI: 1.5,
      BLOCK_TIME_SECONDS: 2
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'solana_rpc',
    name: 'Solana JSON-RPC & WebSocket PubSub Adapter',
    version: '1.18',
    categories: ['blockchain-web3', 'application-apis'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'High-throughput 65k TPS Solana RPC connector with account notification subscriptions, slot telemetry, and SPL token indexing.',
    transport: 'HTTPS / WSS',
    defaultPorts: [8899, 8900],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'https', name: 'HTTPS', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Commitment Level Finalized', level: 'HIGH', description: 'Ensures zero transaction rollbacks in critical flows', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      CLUSTER_URL: 'https://api.mainnet-beta.solana.com',
      COMMITMENT: 'confirmed'
    },
    installedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'bitcoin_p2p',
    name: 'Bitcoin Core P2P Wire Protocol & UTXO Indexer',
    version: 'v27.0',
    categories: ['blockchain-web3', 'peer-to-peer'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Native Bitcoin network peer-to-peer wire protocol with BIP-324 encrypted v2 transport, compact block relay (BIP-152), and UTXO scanning.',
    transport: 'TCP (8333)',
    defaultPorts: [8333],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'BIP-324 v2 Transport Encryption', level: 'HIGH', description: 'ElligatorSwift key exchange preventing traffic shaping', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      NETWORK: 'mainnet',
      PORT: 8333,
      USE_BIP324: true
    }
  },

  // ==========================================
  // 15. REALTIME MEDIA & STREAMING (realtime-media)
  // ==========================================
  {
    id: 'webrtc',
    name: 'WebRTC P2P Data & Media Channel',
    version: '1.0',
    categories: ['realtime-media', 'web', 'peer-to-peer'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Peer-to-peer browser data channels, voice streaming, and direct video telemetry with STUN/TURN ICE signaling.',
    transport: 'UDP / DTLS / SRTP',
    defaultPorts: [3478, 5349],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'End-to-End DTLS-SRTP', level: 'CRITICAL', description: 'Mandatory cryptographic channel handshake', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      ICE_SERVERS: ['stun:stun.l.google.com:19302', 'stun:stun.vox.network:3478'],
      ENABLE_DATA_CHANNELS: true,
      AUDIO_CODEC: 'Opus',
      VIDEO_CODEC: 'VP9 / AV1'
    }
  },
  {
    id: 'rtsp_stream',
    name: 'RTSP Surveillance Video Stream Ingestion',
    version: 'RFC 2326',
    categories: ['realtime-media', 'iot'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Real-Time Streaming Protocol for controlling CCTV video cameras, sensor feeds, and remote media servers over RTP/RTCP.',
    transport: 'TCP / UDP (554)',
    defaultPorts: [554],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'RTSPS (TLS)', level: 'HIGH', description: 'Encrypted video stream transmission', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PORT: 554,
      BUFFER_DURATION_MS: 500
    },
    hasSecretConfig: true
  },
  {
    id: 'sip_voip',
    name: 'SIP / SDP Voice Over IP Telephony Gateway',
    version: 'RFC 3261',
    categories: ['realtime-media', 'identity-auth'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Session Initiation Protocol signaling adapter for establishing sovereign voice, video, and emergency conference calls.',
    transport: 'UDP / TCP (5060) / TLS (5061)',
    defaultPorts: [5060, 5061],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'SIPS TLS Port 5061', level: 'HIGH', description: 'Encrypted call setup signaling', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      SIP_PORT: 5061,
      REALM: 'vox.telecom.network'
    },
    hasSecretConfig: true
  },

  // ==========================================
  // 16. IOT & EMBEDDED SYSTEMS (iot)
  // ==========================================
  {
    id: 'coap',
    name: 'CoAP (Constrained Application Protocol)',
    version: 'RFC 7252',
    categories: ['iot', 'internet-transport'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Specialized web transfer protocol for use with constrained nodes and constrained networks in the Internet of Things.',
    transport: 'UDP / DTLS (5684)',
    defaultPorts: [5683, 5684],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'udp', name: 'UDP Core', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'DTLS Pre-Shared Key', level: 'HIGH', description: 'CoAPS port 5684 micro-controller encryption', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      COAP_PORT: 5684,
      ACK_TIMEOUT_MS: 2000,
      MAX_RETRANSMIT: 4
    },
    hasSecretConfig: true
  },
  {
    id: 'matter_thread',
    name: 'Matter / Thread Mesh Node Protocol',
    version: '1.2',
    categories: ['iot', 'security-crypto'],
    isVirtualServer: false,
    isNetwork: true,
    description: 'Unified smart home and device connectivity standard running IPv6 over low-power 802.15.4 wireless mesh with device attestation.',
    transport: 'UDP / IPv6 / Thread',
    defaultPorts: [5540],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [
      { id: 'ipv6', name: 'IPv6 Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'PASE / CASE Cryptographic Pairing', level: 'CRITICAL', description: 'Certificate-based hardware commissioning', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      DISCRIMINATOR: 3840,
      SETUP_PIN: 20202021
    },
    hasSecretConfig: true
  },

  // ==========================================
  // 17. HARDWARE & LOCAL INTERCONNECT (hardware-local)
  // ==========================================
  {
    id: 'usb_ip',
    name: 'USB-IP Peripheral Forwarder Over Subnet',
    version: '2.0',
    categories: ['hardware-local', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Kernel-level USB/IP server encapsulating Hardware Security Modules (HSM), biometric scanners, and serial devices over IP.',
    transport: 'TCP (3240)',
    defaultPorts: [3240],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Kernel vhci_hcd driver attachment requires CAP_SYS_ADMIN.',
    status: 'available',
    dependencies: [
      { id: 'tcp', name: 'TCP', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'mTLS Client Device Pinning', level: 'CRITICAL', description: 'Prevent malicious virtual USB injection', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PORT: 3240,
      AUTO_ATTACH_BUS_IDS: ['1-1.2']
    }
  },
  {
    id: 'socketcan_ip',
    name: 'SocketCAN Automotive Bus Over IP',
    version: 'CAN 2.0B / FD',
    categories: ['hardware-local', 'industrial'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Controller Area Network (CAN) bus bridge transmitting automotive ECU frames and telemetry packets over sovereign networks.',
    transport: 'UDP / TCP (29536)',
    defaultPorts: [29536],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'CAN raw socket binding.',
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'CAN ID Whitelist Filtering', level: 'CRITICAL', description: 'Strict frame filtering to prevent bus override', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      CAN_INTERFACE: 'vcan0',
      BITRATE: 500000
    }
  },
  {
    id: 'modbus_tcp',
    name: 'Modbus TCP Industrial Register Gateway',
    version: 'Modbus-IDA',
    categories: ['hardware-local', 'industrial'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Industrial communications protocol for master/slave supervision of sensors, actuators, PLC holding registers, and power meters.',
    transport: 'TCP (502)',
    defaultPorts: [502],
    encrypted: false,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Port 502 listening requires network capabilities.',
    status: 'available',
    dependencies: [
      { id: 'tcp', name: 'TCP', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Modbus Security (TLS 1.3)', level: 'HIGH', description: 'Port 802 TLS encapsulation enabled', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PORT: 502,
      UNIT_ID: 1,
      MAX_HOLDING_REGISTERS: 1000
    }
  },

  // ==========================================
  // 18. INDUSTRIAL & SCADA AUTOMATION (industrial)
  // ==========================================
  {
    id: 'opc_ua',
    name: 'OPC UA (Unified Architecture) Server & Client',
    version: 'IEC 62541',
    categories: ['industrial', 'application-apis', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Platform-independent, service-oriented architecture for industrial automation with information modeling and X.509 security profiles.',
    transport: 'opc.tcp (4840) / HTTPS',
    defaultPorts: [4840],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'Basic256Sha256 Security Policy', level: 'CRITICAL', description: 'Mandatory cryptographic session sign & encrypt', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      ENDPOINT_URL: 'opc.tcp://0.0.0.0:4840/vox/opcua/server',
      SECURITY_POLICY: 'http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256',
      MAX_NODES_PER_READ: 1000
    },
    hasSecretConfig: true
  },
  {
    id: 'profinet_ip',
    name: 'Profinet Industrial Ethernet Gateway',
    version: 'IEC 61158',
    categories: ['industrial', 'hardware-local'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Real-time industrial Ethernet protocol for automation systems, connecting controllers and decentralized I/O devices.',
    transport: 'Raw Ethernet / UDP (34964)',
    defaultPorts: [34964],
    encrypted: false,
    requiresSecrets: false,
    requiresPrivilegedAccess: true,
    privilegedAccessReason: 'Real-time raw Ethernet frames require root socket privileges.',
    status: 'available',
    dependencies: [],
    securityRequirements: [
      { name: 'Physical Subnet Segregation', level: 'HIGH', description: 'Isolated industrial VLAN to avoid packet interference', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      CYCLE_TIME_MS: 4,
      DEVICE_NAME: 'vox-profinet-io-01'
    }
  },

  // ==========================================
  // 19. TELEMETRY & OBSERVABILITY (telemetry-observability)
  // ==========================================
  {
    id: 'opentelemetry_otlp',
    name: 'OpenTelemetry (OTLP) Collector & Exporter',
    version: '1.30',
    categories: ['telemetry-observability', 'application-apis', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'High-performance OpenTelemetry Protocol collector receiving distributed traces, metrics, and logs over gRPC and HTTP/Protobuf.',
    transport: 'gRPC (4317) / HTTP (4318)',
    defaultPorts: [4317, 4318],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x1900100000000000000000000000000000000000000000000000000000000019',
    dependencies: [
      { id: 'grpc', name: 'gRPC Stack', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'mTLS Exporter Auth', level: 'HIGH', description: 'Cryptographic authentication of telemetry ingestion pipelines', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-edge-01', type: 'server', name: 'Alpha-Edge-Gateway', targetEndpoint: 'grpc://10.142.0.12:4317', status: 'bound' }
    ],
    config: {
      GRPC_PORT: 4317,
      HTTP_PORT: 4318,
      SAMPLING_RATIO: 1.0,
      BATCH_TIMEOUT_MS: 5000
    },
    installedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'prometheus_scrape',
    name: 'Prometheus Scrape Endpoint & OpenMetrics',
    version: 'OpenMetrics 1.0',
    categories: ['telemetry-observability', 'web'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Pull-based dimensional time-series metric exporter serving `/metrics` formatted counters, gauges, and histograms.',
    transport: 'HTTPS (9090)',
    defaultPorts: [9090, 3000],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [
      { id: 'https', name: 'HTTPS Gateway', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Basic / Bearer Auth', level: 'HIGH', description: 'Metrics protected from unauthorized public crawling', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      METRICS_PATH: '/api/metrics',
      SCRAPE_INTERVAL_SECONDS: 15
    },
    installedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'syslog_tls',
    name: 'RFC 5424 Syslog Over TLS Receiver',
    version: 'RFC 5424 / 5425',
    categories: ['telemetry-observability', 'security-crypto'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Standard secure system logging receiver collecting kernel, daemon, and audit messages with millisecond ISO timestamps.',
    transport: 'TLS (6514)',
    defaultPorts: [6514],
    encrypted: true,
    requiresSecrets: true,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [],
    securityRequirements: [
      { name: 'TLS 1.3 Mandatory', level: 'CRITICAL', description: 'Plaintext UDP 514 syslog disabled to prevent log tampering', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      PORT: 6514,
      MAX_MESSAGE_SIZE: 65536
    },
    hasSecretConfig: true,
    installedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    testStatus: 'PASS'
  },

  // ==========================================
  // 20. CUSTOM INCLUSIVE PROTOCOLS (custom-inclusive)
  // ==========================================
  {
    id: 'neural_stream',
    name: 'Neural Stream Protocol (Custom QUIC / Protobuf)',
    version: '1.0',
    categories: ['custom-inclusive', 'virtual-server', 'messaging'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Bespoke high-dimensional AI tensor streaming protocol with quantization negotiation and blockchain identity stake attestation.',
    transport: 'QUIC',
    defaultPorts: [9443],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    ownerIdentityId: '0x3f89a1b021c345d67e89f0123456789abcdef0123456789abcdef0123456789a',
    protocolId: '0x2000100000000000000000000000000000000000000000000000000000000020',
    protocolHash: '0x8f2a01b34901f82a77e1124b89a01f89c02113aa01f99201a02b34903e102948',
    dependencies: [
      { id: 'quic_core', name: 'QUIC Core', required: true, status: 'installed' }
    ],
    securityRequirements: [
      { name: 'Blockchain Signature Verification', level: 'CRITICAL', description: 'Zero unauthorized node inference streams', fulfilled: true }
    ],
    connectedServices: [
      { id: 'srv-vector-02', type: 'server', name: 'Neural-Vector-Store', targetEndpoint: 'quic://10.142.0.45:9443', status: 'bound' }
    ],
    config: {
      MAX_TENSOR_DIMENSIONS: 4096,
      QUANTIZATION_MODES: ['FP16', 'INT8', 'INT4']
    },
    installedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    testStatus: 'PASS'
  },
  {
    id: 'custom_vsp_sandbox',
    name: 'Custom VSP Sandbox Runtime Engine',
    version: '1.0-alpha',
    categories: ['custom-inclusive', 'virtual-server'],
    isVirtualServer: true,
    isNetwork: true,
    description: 'Dynamic sandbox for compiling user-defined JSON schemas into deterministic bytes32 bytecode adapters with live sandbox testing.',
    transport: 'Universal Multi-Transport',
    defaultPorts: [9444],
    encrypted: true,
    requiresSecrets: false,
    requiresPrivilegedAccess: false,
    status: 'installed',
    dependencies: [],
    securityRequirements: [
      { name: 'Wasm / Sandbox Isolation', level: 'CRITICAL', description: 'Strict memory and socket sandboxing', fulfilled: true }
    ],
    connectedServices: [],
    config: {
      EXECUTION_TIMEOUT_MS: 5000,
      MAX_MEMORY_MB: 256
    },
    installedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    testStatus: 'PASS'
  }
];

// Helper to store secrets securely
export function setBackendSecret(protocolId: string, secrets: Record<string, string>) {
  backendSecretVault.set(protocolId, secrets);
}

export function getBackendSecret(protocolId: string): Record<string, string> | undefined {
  return backendSecretVault.get(protocolId);
}

// Seed initial secrets
setBackendSecret('smtp', {
  SMTP_PASSWORD: 'EncryptedSecret(vox_smtp_relay_token_99420)',
  DKIM_PRIVATE_KEY: 'EncryptedSecret(rsa_2048_dkim_vox_net)'
});

setBackendSecret('imap', {
  IMAP_PASSWORD: 'EncryptedSecret(vox_imap_master_secret)'
});

setBackendSecret('blockchain_rpc', {
  NODE_OPERATOR_PRIVATE_KEY: 'EncryptedSecret(0x4a9f821c00984b2e1140928a34bc7e11248901a02b34903e102948f12a02b349)'
});

setBackendSecret('wireguard', {
  PRIVATE_KEY: 'EncryptedSecret(wg_priv_a89f1048b21c00984b2e1140928a34bc)'
});
