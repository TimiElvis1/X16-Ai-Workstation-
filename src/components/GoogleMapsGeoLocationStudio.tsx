import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow
} from '@vis.gl/react-google-maps';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap as useLeafletMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Globe,
  MapPin,
  Compass,
  Navigation,
  Activity,
  Layers,
  Radio,
  Wifi,
  Server,
  Shield,
  Search,
  Crosshair,
  Sliders,
  Download,
  RefreshCw,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  Terminal,
  Cpu,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Key,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Database,
  Share2,
  Copy,
  Check,
  Network,
  GitBranch,
  Gauge,
  BarChart3,
  Signal,
  ArrowUpRight,
  TrendingUp,
  Table,
  SlidersHorizontal,
  Code
} from 'lucide-react';
import { PrivateServer } from '../types';

// Fix Leaflet default icon issues in bundled web apps
const createCustomLeafletIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background: #090d16;
          border: 2px solid ${color};
          color: ${color};
          padding: 2px 6px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.8);
          margin-bottom: 2px;
        ">${label}</div>
        <div style="
          width: 14px;
          height: 14px;
          background: ${color};
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px ${color};
        "></div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
};

// Google Maps API Key configuration
const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidGoogleKey = Boolean(GOOGLE_MAPS_KEY) && GOOGLE_MAPS_KEY !== 'YOUR_API_KEY' && GOOGLE_MAPS_KEY.length > 5;

// Global Topology Node Schema with Full Value Data
export interface TopologyNode {
  id: string;
  name: string;
  region: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  ipAddress: string;
  asn: number;
  asName: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  jitterMs: number;
  packetLossPercent: number;
  throughputGbps: number;
  cpuLoadPercent: number;
  memoryUsagePercent: number;
  activeTunnels: number;
  degreeCentrality: number;
  betweennessScore: number;
  fiedlerValue: number;
  encryption: string;
  role: 'CORE_ROUTER' | 'EDGE_GATEWAY' | 'STORAGE_VAULT' | 'VALIDATOR_ANCHOR' | 'INJUNCTION_DISPATCH';
  neighbors: string[]; // Connected node IDs
}

// Topology Link (Edge) Schema with Value Data
export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  sourceName: string;
  targetName: string;
  distanceKm: number;
  baseLatencyMs: number;
  jitterMs: number;
  bandwidthCapacityGbps: number;
  currentLoadPercent: number;
  packetDropRate: number;
  status: 'OPTIMAL' | 'CONGESTED' | 'DOWN';
  protocol: 'VIP-20-MESH' | 'DIOP-WIRE' | 'BGP4-MPLS' | 'OTLP-STREAM';
}

const DEFAULT_TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'node-us-east-1',
    name: 'IIN-VA-CORE-01',
    region: 'North America',
    country: 'United States',
    city: 'Ashburn, VA',
    lat: 39.0438,
    lng: -77.4874,
    ipAddress: '10.142.0.12',
    asn: 64512,
    asName: 'AS-IIN-US-EAST',
    status: 'ONLINE',
    latencyMs: 12,
    jitterMs: 0.8,
    packetLossPercent: 0.01,
    throughputGbps: 94.2,
    cpuLoadPercent: 32,
    memoryUsagePercent: 44,
    activeTunnels: 1240,
    degreeCentrality: 0.75,
    betweennessScore: 0.42,
    fiedlerValue: 0.38,
    encryption: 'ChaCha20-Poly1305 / TLS 1.3',
    role: 'CORE_ROUTER',
    neighbors: ['node-us-west-1', 'node-eu-west-1', 'node-sa-east-1']
  },
  {
    id: 'node-us-west-1',
    name: 'IIN-CA-EDGE-02',
    region: 'North America',
    country: 'United States',
    city: 'San Jose, CA',
    lat: 37.3382,
    lng: -121.8863,
    ipAddress: '10.142.0.45',
    asn: 64513,
    asName: 'AS-IIN-US-WEST',
    status: 'ONLINE',
    latencyMs: 18,
    jitterMs: 1.2,
    packetLossPercent: 0.02,
    throughputGbps: 88.6,
    cpuLoadPercent: 41,
    memoryUsagePercent: 52,
    activeTunnels: 980,
    degreeCentrality: 0.50,
    betweennessScore: 0.28,
    fiedlerValue: 0.35,
    encryption: 'AES-256-GCM / WireGuard',
    role: 'EDGE_GATEWAY',
    neighbors: ['node-us-east-1', 'node-ap-east-1', 'node-ap-se-1']
  },
  {
    id: 'node-eu-west-1',
    name: 'IIN-LON-HUB-03',
    region: 'Europe',
    country: 'United Kingdom',
    city: 'London',
    lat: 51.5074,
    lng: -0.1278,
    ipAddress: '10.240.0.18',
    asn: 64520,
    asName: 'AS-IIN-EU-WEST',
    status: 'ONLINE',
    latencyMs: 34,
    jitterMs: 1.5,
    packetLossPercent: 0.00,
    throughputGbps: 120.4,
    cpuLoadPercent: 28,
    memoryUsagePercent: 39,
    activeTunnels: 2150,
    degreeCentrality: 0.88,
    betweennessScore: 0.58,
    fiedlerValue: 0.44,
    encryption: 'XChaCha20 / DIOP v2',
    role: 'VALIDATOR_ANCHOR',
    neighbors: ['node-us-east-1', 'node-eu-central-1', 'node-af-south-1', 'node-me-central-1']
  },
  {
    id: 'node-eu-central-1',
    name: 'IIN-FRA-VAULT-04',
    region: 'Europe',
    country: 'Germany',
    city: 'Frankfurt',
    lat: 50.1109,
    lng: 8.6821,
    ipAddress: '10.240.1.99',
    asn: 64521,
    asName: 'AS-IIN-EU-CENTRAL',
    status: 'ONLINE',
    latencyMs: 38,
    jitterMs: 1.1,
    packetLossPercent: 0.01,
    throughputGbps: 110.1,
    cpuLoadPercent: 35,
    memoryUsagePercent: 48,
    activeTunnels: 1680,
    degreeCentrality: 0.62,
    betweennessScore: 0.31,
    fiedlerValue: 0.40,
    encryption: 'ChaCha20 / AES-256',
    role: 'STORAGE_VAULT',
    neighbors: ['node-eu-west-1', 'node-me-central-1', 'node-ap-south-1']
  },
  {
    id: 'node-ap-east-1',
    name: 'IIN-TYO-EDGE-05',
    region: 'Asia Pacific',
    country: 'Japan',
    city: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    ipAddress: '10.180.0.8',
    asn: 64530,
    asName: 'AS-IIN-AP-EAST',
    status: 'ONLINE',
    latencyMs: 78,
    jitterMs: 2.1,
    packetLossPercent: 0.03,
    throughputGbps: 98.7,
    cpuLoadPercent: 45,
    memoryUsagePercent: 58,
    activeTunnels: 1420,
    degreeCentrality: 0.62,
    betweennessScore: 0.34,
    fiedlerValue: 0.36,
    encryption: 'WireGuard / ED25519',
    role: 'EDGE_GATEWAY',
    neighbors: ['node-us-west-1', 'node-ap-south-1', 'node-ap-se-1']
  },
  {
    id: 'node-ap-south-1',
    name: 'IIN-SIN-ROUTER-06',
    region: 'Asia Pacific',
    country: 'Singapore',
    city: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    ipAddress: '10.180.2.14',
    asn: 64531,
    asName: 'AS-IIN-AP-SOUTH',
    status: 'ONLINE',
    latencyMs: 86,
    jitterMs: 2.4,
    packetLossPercent: 0.02,
    throughputGbps: 84.3,
    cpuLoadPercent: 39,
    memoryUsagePercent: 47,
    activeTunnels: 1120,
    degreeCentrality: 0.62,
    betweennessScore: 0.39,
    fiedlerValue: 0.37,
    encryption: 'ChaCha20-Poly1305',
    role: 'CORE_ROUTER',
    neighbors: ['node-eu-central-1', 'node-ap-east-1', 'node-ap-se-1', 'node-me-central-1']
  },
  {
    id: 'node-ap-se-1',
    name: 'IIN-SYD-ANCHOR-07',
    region: 'Oceania',
    country: 'Australia',
    city: 'Sydney',
    lat: -33.8688,
    lng: 151.2093,
    ipAddress: '10.190.0.33',
    asn: 64535,
    asName: 'AS-IIN-AU-EAST',
    status: 'ONLINE',
    latencyMs: 125,
    jitterMs: 3.1,
    packetLossPercent: 0.04,
    throughputGbps: 62.0,
    cpuLoadPercent: 22,
    memoryUsagePercent: 35,
    activeTunnels: 560,
    degreeCentrality: 0.38,
    betweennessScore: 0.15,
    fiedlerValue: 0.28,
    encryption: 'AES-256-GCM',
    role: 'VALIDATOR_ANCHOR',
    neighbors: ['node-us-west-1', 'node-ap-east-1', 'node-ap-south-1']
  },
  {
    id: 'node-sa-east-1',
    name: 'IIN-SAO-EDGE-08',
    region: 'South America',
    country: 'Brazil',
    city: 'São Paulo',
    lat: -23.5505,
    lng: -46.6333,
    ipAddress: '10.160.0.21',
    asn: 64540,
    asName: 'AS-IIN-SA-EAST',
    status: 'ONLINE',
    latencyMs: 112,
    jitterMs: 2.8,
    packetLossPercent: 0.03,
    throughputGbps: 76.5,
    cpuLoadPercent: 29,
    memoryUsagePercent: 41,
    activeTunnels: 740,
    degreeCentrality: 0.38,
    betweennessScore: 0.18,
    fiedlerValue: 0.29,
    encryption: 'TLS 1.3 / DIOP',
    role: 'EDGE_GATEWAY',
    neighbors: ['node-us-east-1', 'node-af-south-1']
  },
  {
    id: 'node-me-central-1',
    name: 'IIN-DXB-DISPATCH-09',
    region: 'Middle East',
    country: 'United Arab Emirates',
    city: 'Dubai',
    lat: 25.2048,
    lng: 55.2708,
    ipAddress: '10.170.1.5',
    asn: 64550,
    asName: 'AS-IIN-ME-CENTRAL',
    status: 'ONLINE',
    latencyMs: 72,
    jitterMs: 1.8,
    packetLossPercent: 0.01,
    throughputGbps: 89.0,
    cpuLoadPercent: 24,
    memoryUsagePercent: 38,
    activeTunnels: 890,
    degreeCentrality: 0.62,
    betweennessScore: 0.36,
    fiedlerValue: 0.39,
    encryption: 'ChaCha20 / WireGuard',
    role: 'INJUNCTION_DISPATCH',
    neighbors: ['node-eu-west-1', 'node-eu-central-1', 'node-ap-south-1', 'node-af-south-1']
  },
  {
    id: 'node-af-south-1',
    name: 'IIN-CPT-RELAY-10',
    region: 'Africa',
    country: 'South Africa',
    city: 'Cape Town',
    lat: -33.9249,
    lng: 18.4241,
    ipAddress: '10.150.0.60',
    asn: 64560,
    asName: 'AS-IIN-AF-SOUTH',
    status: 'ONLINE',
    latencyMs: 128,
    jitterMs: 3.5,
    packetLossPercent: 0.05,
    throughputGbps: 54.2,
    cpuLoadPercent: 22,
    memoryUsagePercent: 33,
    activeTunnels: 480,
    degreeCentrality: 0.38,
    betweennessScore: 0.16,
    fiedlerValue: 0.27,
    encryption: 'AES-256-GCM',
    role: 'EDGE_GATEWAY',
    neighbors: ['node-eu-west-1', 'node-sa-east-1', 'node-me-central-1']
  }
];

// Calculate Haversine Distance
function computeHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Generate Topology Edges from Node Neighbor relationships
function buildTopologyEdges(nodes: TopologyNode[]): TopologyEdge[] {
  const edges: TopologyEdge[] = [];
  const visited = new Set<string>();

  for (const node of nodes) {
    for (const neighborId of node.neighbors) {
      const neighbor = nodes.find(n => n.id === neighborId);
      if (!neighbor) continue;

      const edgeKey = [node.id, neighborId].sort().join('--');
      if (visited.has(edgeKey)) continue;
      visited.add(edgeKey);

      const distance = computeHaversine(node.lat, node.lng, neighbor.lat, neighbor.lng);
      const baseLat = Math.max(10, Math.round(distance / 180));

      edges.push({
        id: edgeKey,
        source: node.id,
        target: neighborId,
        sourceName: node.city.split(',')[0],
        targetName: neighbor.city.split(',')[0],
        distanceKm: distance,
        baseLatencyMs: baseLat,
        jitterMs: Number((Math.random() * 1.5 + 0.5).toFixed(1)),
        bandwidthCapacityGbps: 100,
        currentLoadPercent: Math.floor(Math.random() * 45 + 25),
        packetDropRate: 0.01,
        status: 'OPTIMAL',
        protocol: 'VIP-20-MESH'
      });
    }
  }

  return edges;
}

// Dijkstra Shortest Path Calculation on Topology Graph
function solveDijkstraShortestPath(
  nodes: TopologyNode[],
  edges: TopologyEdge[],
  sourceId: string,
  targetId: string
): { path: string[]; totalDistanceKm: number; totalLatencyMs: number; hops: number } | null {
  if (sourceId === targetId) return { path: [sourceId], totalDistanceKm: 0, totalLatencyMs: 0, hops: 0 };

  const distances: { [id: string]: number } = {};
  const previous: { [id: string]: string | null } = {};
  const unvisited = new Set<string>();

  for (const node of nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }

  distances[sourceId] = 0;

  while (unvisited.size > 0) {
    let closestNodeId: string | null = null;
    let shortestDist = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < shortestDist) {
        shortestDist = distances[nodeId];
        closestNodeId = nodeId;
      }
    }

    if (!closestNodeId || shortestDist === Infinity) break;
    if (closestNodeId === targetId) break;

    unvisited.delete(closestNodeId);

    const currentNode = nodes.find(n => n.id === closestNodeId);
    if (!currentNode) continue;

    for (const neighborId of currentNode.neighbors) {
      if (!unvisited.has(neighborId)) continue;

      const edge = edges.find(
        e => (e.source === closestNodeId && e.target === neighborId) || (e.source === neighborId && e.target === closestNodeId)
      );
      if (!edge || edge.status === 'DOWN') continue;

      // Cost function: latency + distance weighting
      const edgeCost = edge.baseLatencyMs + (edge.distanceKm / 1000);
      const alt = distances[closestNodeId] + edgeCost;

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = closestNodeId;
      }
    }
  }

  const path: string[] = [];
  let curr: string | null = targetId;

  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  if (path[0] !== sourceId) return null;

  let totalDist = 0;
  let totalLat = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const edge = edges.find(
      e => (e.source === path[i] && e.target === path[i + 1]) || (e.source === path[i + 1] && e.target === path[i])
    );
    if (edge) {
      totalDist += edge.distanceKm;
      totalLat += edge.baseLatencyMs;
    }
  }

  return {
    path,
    totalDistanceKm: totalDist,
    totalLatencyMs: totalLat,
    hops: path.length - 1
  };
}

export interface GoogleMapsGeoLocationStudioProps {
  servers?: PrivateServer[];
  onNavigateTab?: (tab: string) => void;
}

export const GoogleMapsGeoLocationStudio: React.FC<GoogleMapsGeoLocationStudioProps> = ({
  servers = [],
  onNavigateTab
}) => {
  // Map Engine Selector: 'LEAFLET_OSM' (Zero-Key default) vs 'GOOGLE_MAPS' (when key is available)
  const [mapEngine, setMapEngine] = useState<'LEAFLET_OSM' | 'GOOGLE_MAPS'>('LEAFLET_OSM');

  // Tile Provider for OpenStreetMap Leaflet Engine
  const [osmTileStyle, setOsmTileStyle] = useState<'DARK_MATTER' | 'STANDARD' | 'SATELLITE'>('DARK_MATTER');

  // Topology Nodes & Edges State
  const [nodes, setNodes] = useState<TopologyNode[]>(DEFAULT_TOPOLOGY_NODES);
  const [edges, setEdges] = useState<TopologyEdge[]>(() => buildTopologyEdges(DEFAULT_TOPOLOGY_NODES));
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(DEFAULT_TOPOLOGY_NODES[0]);
  const [selectedEdge, setSelectedEdge] = useState<TopologyEdge | null>(null);

  // Active View Tab: 'MAP_TOPOLOGY' | 'VALUE_DATA_MATRIX' | 'GPRS_NMEA_STREAM' | 'ROUTING_SOLVER'
  const [activeSubView, setActiveSubView] = useState<'MAP_TOPOLOGY' | 'VALUE_DATA_MATRIX' | 'GPRS_NMEA_STREAM' | 'ROUTING_SOLVER'>('MAP_TOPOLOGY');

  // Live GPS Tracking State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number; speed: number; heading: number } | null>(null);
  const [isTrackingGps, setIsTrackingGps] = useState<boolean>(true);

  // GPRS / Cellular Hardware Simulation Telemetry
  const [gprsTelemetry, setGprsTelemetry] = useState({
    mcc: '310',
    mnc: '410',
    lac: '0x4A1F',
    cellId: '0x02DF41',
    rssi: -67,
    rsrp: -92,
    rsrq: -10,
    snr: 24.5,
    cqi: 14,
    timingAdvance: 3,
    networkType: '5G NR SA / B78',
    ipAddress: '100.84.192.14'
  });

  // NMEA 0183 Stream Log
  const [nmeaLog, setNmeaLog] = useState<string[]>([]);
  const [pulseCounter, setPulseCounter] = useState<number>(0);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);

  // Shortest Path Solver State
  const [solverOriginId, setSolverOriginId] = useState<string>('node-us-east-1');
  const [solverTargetId, setSolverTargetId] = useState<string>('node-ap-south-1');
  const [solvedRoute, setSolvedRoute] = useState<{ path: string[]; totalDistanceKm: number; totalLatencyMs: number; hops: number } | null>(null);

  // Filters and Search
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Initialize live GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 37.7749, lng: -122.4194, accuracy: 12, speed: 0, heading: 0 });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10,
          speed: pos.coords.speed || 0,
          heading: pos.coords.heading || 0
        });
      },
      (err) => {
        console.warn('Geolocation notice:', err.message);
        setUserLocation({ lat: 37.7749, lng: -122.4194, accuracy: 15, speed: 0, heading: 0 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Generate Live NMEA 0183 Sentences and Topology Metric fluctuations
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setPulseCounter(prev => prev + 1);

      const lat = userLocation ? userLocation.lat : 37.7749;
      const lng = userLocation ? userLocation.lng : -122.4194;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '') + '.00';

      const latDeg = Math.floor(Math.abs(lat));
      const latMin = ((Math.abs(lat) - latDeg) * 60).toFixed(4);
      const latNmea = `${String(latDeg).padStart(2, '0')}${latMin},${lat >= 0 ? 'N' : 'S'}`;

      const lngDeg = Math.floor(Math.abs(lng));
      const lngMin = ((Math.abs(lng) - lngDeg) * 60).toFixed(4);
      const lngNmea = `${String(lngDeg).padStart(3, '0')}${lngMin},${lng >= 0 ? 'E' : 'W'}`;

      const sentences = [
        `$GPGGA,${timeStr},${latNmea},${lngNmea},1,12,0.85,18.4,M,-32.1,M,,*47`,
        `$GPRMC,${timeStr},A,${latNmea},${lngNmea},0.05,142.3,${now.getDate()}${now.getMonth() + 1}26,,,A*7A`,
        `$GPGSA,A,3,04,07,09,11,14,17,20,28,30,,,,1.4,0.8,1.1*32`,
        `$GPGSV,4,1,14,04,45,120,44,07,62,280,48,09,33,065,39,11,78,190,51*7C`
      ];

      setNmeaLog(prev => [...sentences, ...prev].slice(0, 30));

      // Fluctuate topology values
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          latencyMs: Math.max(8, node.latencyMs + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
          jitterMs: Number(Math.max(0.2, node.jitterMs + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(2)),
          cpuLoadPercent: Math.min(96, Math.max(12, node.cpuLoadPercent + (Math.random() > 0.5 ? 2 : -2)))
        }))
      );

      // Fluctuate GPRS cellular signal
      setGprsTelemetry(prev => ({
        ...prev,
        rssi: Math.min(-55, Math.max(-95, prev.rssi + (Math.random() > 0.5 ? 1 : -1))),
        snr: Number((24.0 + Math.random() * 2.0).toFixed(1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveSimulating, userLocation]);

  // Recalculate Dijkstra Shortest Path when nodes, edges, or endpoints change
  useEffect(() => {
    const solution = solveDijkstraShortestPath(nodes, edges, solverOriginId, solverTargetId);
    setSolvedRoute(solution);
  }, [nodes, edges, solverOriginId, solverTargetId]);

  // Compute Overall Network Topology Aggregates
  const topologyStats = useMemo(() => {
    const totalThroughput = nodes.reduce((acc, n) => acc + n.throughputGbps, 0);
    const avgLatency = Math.round(nodes.reduce((acc, n) => acc + n.latencyMs, 0) / nodes.length);
    const avgJitter = (nodes.reduce((acc, n) => acc + n.jitterMs, 0) / nodes.length).toFixed(2);
    const totalTunnels = nodes.reduce((acc, n) => acc + n.activeTunnels, 0);
    const avgFiedler = (nodes.reduce((acc, n) => acc + n.fiedlerValue, 0) / nodes.length).toFixed(3);
    const totalEdges = edges.length;

    return {
      totalThroughput: totalThroughput.toFixed(1),
      avgLatency,
      avgJitter,
      totalTunnels,
      avgFiedler,
      totalEdges,
      nodeCount: nodes.length
    };
  }, [nodes, edges]);

  // Filtered nodes based on region & search
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchRegion = filterRegion === 'ALL' || n.region === filterRegion;
      const matchSearch =
        !searchQuery.trim() ||
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.ipAddress.includes(searchQuery) ||
        String(n.asn).includes(searchQuery);
      return matchRegion && matchSearch;
    });
  }, [nodes, filterRegion, searchQuery]);

  // Export Topology Graph as JSON or CSV
  const handleExportTopologyData = (format: 'JSON' | 'CSV') => {
    if (format === 'JSON') {
      const data = {
        meta: {
          title: 'AGVORA Sovereign GPRS & Geo-Spatial Network Topology Matrix',
          timestamp: new Date().toISOString(),
          aggregateMetrics: topologyStats
        },
        nodes,
        edges
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agvora_topology_matrix_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = 'ID,Name,Region,Country,City,Latitude,Longitude,IP,ASN,Status,LatencyMs,JitterMs,ThroughputGbps,CPULoad,ActiveTunnels,DegreeCentrality,BetweennessScore\n';
      const rows = nodes.map(n =>
        `"${n.id}","${n.name}","${n.region}","${n.country}","${n.city}",${n.lat},${n.lng},"${n.ipAddress}",${n.asn},"${n.status}",${n.latencyMs},${n.jitterMs},${n.throughputGbps},${n.cpuLoadPercent},${n.activeTunnels},${n.degreeCentrality},${n.betweennessScore}`
      ).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iin_topology_nodes_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Leaflet Tile URLs
  const getLeafletTileUrl = () => {
    switch (osmTileStyle) {
      case 'DARK_MATTER':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'SATELLITE':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'STANDARD':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  return (
    <div id="gprs-topology-studio-root" className="space-y-6">
      
      {/* Top Header Station with Telemetry & Map Engine Switcher */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Header Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl blur-sm opacity-80 animate-pulse"></div>
              <div className="relative p-3.5 rounded-2xl bg-slate-950 border border-cyan-400/40 text-cyan-300 shadow-xl shadow-cyan-950/80">
                <Network className="h-7 w-7" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  GPRS Geo-Location & Network Topology Schematics
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>ZERO-KEY GPRS TELEMETRY</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Autonomous multi-hop mesh graph metrics, Dijkstra shortest paths, NMEA 0183 streams, and full topological value data matrices.
              </p>
            </div>
          </div>

          {/* Quick Engine & Mode Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Map Engine Toggle */}
            <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-1 text-xs font-mono">
              <button
                onClick={() => setMapEngine('LEAFLET_OSM')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  mapEngine === 'LEAFLET_OSM'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                OpenStreetMap (Zero-Key)
              </button>

              <button
                onClick={() => setMapEngine('GOOGLE_MAPS')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  mapEngine === 'GOOGLE_MAPS'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Google Maps Layer
              </button>
            </div>

            {/* Live Telemetry Pulse Toggle */}
            <button
              onClick={() => setIsLiveSimulating(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                isLiveSimulating
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              {isLiveSimulating ? <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" /> : <Pause className="h-3.5 w-3.5" />}
              <span>{isLiveSimulating ? 'Live Telemetry' : 'Paused'}</span>
            </button>

            {/* Export Menu */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleExportTopologyData('JSON')}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
                title="Export Topology Graph JSON"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={() => handleExportTopologyData('CSV')}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
                title="Export Value Data CSV"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>CSV</span>
              </button>
            </div>

          </div>

        </div>

        {/* Aggregate Value Data Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono">
          
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
              <Server className="h-3 w-3 text-cyan-400" />
              <span>Mesh Nodes</span>
            </div>
            <div className="text-cyan-300 font-black text-sm">
              {topologyStats.nodeCount} Sovereign Nodes
            </div>
            <div className="text-[10px] text-slate-500">{topologyStats.totalEdges} Active Edges</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
              <Activity className="h-3 w-3 text-blue-400" />
              <span>Average Latency</span>
            </div>
            <div className="text-blue-300 font-black text-sm">
              {topologyStats.avgLatency} ms
            </div>
            <div className="text-[10px] text-slate-500">±{topologyStats.avgJitter} ms Jitter</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span>Mesh Bandwidth</span>
            </div>
            <div className="text-emerald-300 font-black text-sm">
              {topologyStats.totalThroughput} Gbps
            </div>
            <div className="text-[10px] text-slate-500">Aggregate Ingress</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
              <Shield className="h-3 w-3 text-purple-400" />
              <span>Fiedler Connectivity</span>
            </div>
            <div className="text-purple-300 font-black text-sm">
              λ₂ = {topologyStats.avgFiedler}
            </div>
            <div className="text-[10px] text-slate-500">Partition Resistant</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
              <Radio className="h-3 w-3 text-amber-400" />
              <span>Active Tunnels</span>
            </div>
            <div className="text-amber-300 font-black text-sm">
              {topologyStats.totalTunnels.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">VIP / DIOP Encrypted</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
              <Signal className="h-3 w-3 text-rose-400" />
              <span>Cellular Triangulation</span>
            </div>
            <div className="text-rose-300 font-black text-sm">
              {gprsTelemetry.rssi} dBm
            </div>
            <div className="text-[10px] text-slate-500">{gprsTelemetry.networkType.split('/')[0]}</div>
          </div>

        </div>

        {/* Sub-view Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          {[
            { id: 'MAP_TOPOLOGY', label: 'Interactive Geo-Spatial Map', icon: Globe },
            { id: 'VALUE_DATA_MATRIX', label: 'Topology Value Data Matrix', icon: Table },
            { id: 'ROUTING_SOLVER', label: 'Dijkstra Path & Latency Solver', icon: Navigation },
            { id: 'GPRS_NMEA_STREAM', label: 'Hardware GPRS / NMEA 0183 Telemetry', icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubView(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-950/60 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Workspace Dynamic Views */}
      
      {/* 1. INTERACTIVE GEO-SPATIAL MAP & TOPOLOGY CANVAS */}
      {activeSubView === 'MAP_TOPOLOGY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Map View Canvas (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[620px]">
              
              {/* Map Tile & Layer Controller */}
              <div className="absolute top-4 right-4 z-[500] bg-slate-950/90 border border-slate-800 rounded-2xl p-2 shadow-xl backdrop-blur-md flex items-center space-x-1.5 text-xs font-mono">
                {mapEngine === 'LEAFLET_OSM' && (
                  <>
                    <button
                      onClick={() => setOsmTileStyle('DARK_MATTER')}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                        osmTileStyle === 'DARK_MATTER' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Cyber Dark
                    </button>
                    <button
                      onClick={() => setOsmTileStyle('SATELLITE')}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                        osmTileStyle === 'SATELLITE' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Satellite
                    </button>
                    <button
                      onClick={() => setOsmTileStyle('STANDARD')}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                        osmTileStyle === 'STANDARD' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Street
                    </button>
                  </>
                )}
              </div>

              {/* Map Engine Render Branch */}
              {mapEngine === 'LEAFLET_OSM' ? (
                <MapContainer
                  center={[25.0, 10.0]}
                  zoom={2}
                  scrollWheelZoom={true}
                  style={{ width: '100%', height: '100%', backgroundColor: '#090d16' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
                    url={getLeafletTileUrl()}
                  />

                  {/* Topology Edge Polylines */}
                  {edges.map(edge => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    const isPartOfSolvedPath =
                      solvedRoute?.path &&
                      solvedRoute.path.includes(edge.source) &&
                      solvedRoute.path.includes(edge.target) &&
                      Math.abs(solvedRoute.path.indexOf(edge.source) - solvedRoute.path.indexOf(edge.target)) === 1;

                    return (
                      <Polyline
                        key={edge.id}
                        positions={[
                          [sourceNode.lat, sourceNode.lng],
                          [targetNode.lat, targetNode.lng]
                        ]}
                        pathOptions={{
                          color: isPartOfSolvedPath ? '#f59e0b' : '#06b6d4',
                          weight: isPartOfSolvedPath ? 4 : 2,
                          dashArray: isPartOfSolvedPath ? undefined : '5, 8',
                          opacity: isPartOfSolvedPath ? 0.95 : 0.6
                        }}
                      />
                    );
                  })}

                  {/* User GPS Pin */}
                  {userLocation && (
                    <Marker
                      position={[userLocation.lat, userLocation.lng]}
                      icon={createCustomLeafletIcon('#38bdf8', 'MY GPS')}
                    >
                      <Popup>
                        <div className="p-2 font-mono text-xs text-slate-900">
                          <strong>My Live GPS Location</strong>
                          <div>Latitude: {userLocation.lat.toFixed(5)}</div>
                          <div>Longitude: {userLocation.lng.toFixed(5)}</div>
                          <div>Accuracy: ±{Math.round(userLocation.accuracy)}m</div>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Sovereign Topology Nodes */}
                  {filteredNodes.map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    const pinColor = isSelected ? '#f59e0b' : node.status === 'ONLINE' ? '#06b6d4' : '#ef4444';

                    return (
                      <Marker
                        key={node.id}
                        position={[node.lat, node.lng]}
                        icon={createCustomLeafletIcon(pinColor, node.city.split(',')[0])}
                        eventHandlers={{
                          click: () => setSelectedNode(node)
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[220px] font-sans text-xs text-slate-900 space-y-1">
                            <div className="font-bold border-b pb-1 flex justify-between">
                              <span>{node.name}</span>
                              <span className="font-mono text-[10px] text-cyan-700 font-bold">{node.status}</span>
                            </div>
                            <div className="font-mono text-[11px] text-slate-700 space-y-0.5">
                              <div><strong>IP:</strong> {node.ipAddress}</div>
                              <div><strong>ASN:</strong> AS{node.asn} ({node.asName})</div>
                              <div><strong>Latency:</strong> {node.latencyMs} ms (±{node.jitterMs}ms)</div>
                              <div><strong>Throughput:</strong> {node.throughputGbps} Gbps</div>
                              <div><strong>Degree Centrality:</strong> {node.degreeCentrality}</div>
                              <div><strong>Fiedler Score:</strong> {node.fiedlerValue}</div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              ) : (
                /* Google Maps Mode */
                hasValidGoogleKey ? (
                  <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
                    <GoogleMap
                      defaultCenter={{ lat: 25.0, lng: 10.0 }}
                      defaultZoom={2}
                      mapId="AGVORA_GOOGLE_TOPOLOGY_MAP"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {filteredNodes.map(node => (
                        <AdvancedMarker
                          key={node.id}
                          position={{ lat: node.lat, lng: node.lng }}
                          title={node.name}
                          onClick={() => setSelectedNode(node)}
                        >
                          <Pin background="#06b6d4" glyphColor="#000" borderColor="#083344" />
                        </AdvancedMarker>
                      ))}
                    </GoogleMap>
                  </APIProvider>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                    <AlertTriangle className="h-10 w-10 text-amber-400" />
                    <div className="max-w-md">
                      <h3 className="font-bold text-slate-100 text-sm">Google Maps Platform Key Required</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Use the Zero-Key <strong>OpenStreetMap</strong> layer above, or add <code>GOOGLE_MAPS_PLATFORM_KEY</code> to Settings → Secrets.
                      </p>
                    </div>
                    <button
                      onClick={() => setMapEngine('LEAFLET_OSM')}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl"
                    >
                      Switch to OpenStreetMap Engine
                    </button>
                  </div>
                )
              )}

              {/* Floating Coordinate HUD */}
              <div className="absolute bottom-4 left-4 z-[500] bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md text-[11px] font-mono text-slate-300 space-y-0.5">
                <div className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Compass className="h-3 w-3" />
                  <span>Geo-Spatial Coordinates HUD</span>
                </div>
                <div>User: {userLocation ? `${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E` : 'Locking GPS...'}</div>
                <div className="text-[10px] text-slate-500">Projection: EPSG:3857 (WGS 84 / Pseudo-Mercator)</div>
              </div>

            </div>

            {/* Quick Node Selected Details Bar */}
            {selectedNode && (
              <div className="p-5 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <strong className="text-slate-100 text-sm">{selectedNode.name}</strong>
                    <span className="text-slate-500">({selectedNode.city}, {selectedNode.country})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-bold">
                    AS{selectedNode.asn} • {selectedNode.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">IP & Gateway</span>
                    <span className="text-slate-200 font-bold">{selectedNode.ipAddress}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Round-Trip Latency</span>
                    <span className="text-cyan-400 font-bold">{selectedNode.latencyMs} ms (±{selectedNode.jitterMs}ms)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Degree Centrality</span>
                    <span className="text-purple-400 font-bold">{selectedNode.degreeCentrality}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Connected Neighbors</span>
                    <span className="text-amber-400 font-bold">{selectedNode.neighbors.length} Active Links</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Sovereign Node Catalog (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 font-black text-slate-100 text-sm">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <span>Sovereign Topology Fleet</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800 rounded-lg">
                  {filteredNodes.length} Nodes
                </span>
              </div>

              {/* Region Filter Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'North America', 'Europe', 'Asia Pacific', 'South America', 'Middle East', 'Africa'].map(reg => (
                  <button
                    key={reg}
                    onClick={() => setFilterRegion(reg)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      filterRegion === reg
                        ? 'bg-cyan-500 text-black'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by city, ASN, IP..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>

              {/* Scrollable Node Cards */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredNodes.map(node => {
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-100 font-mono flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>{node.name}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-cyan-400">
                          {node.latencyMs} ms
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                        <span>{node.city}, {node.country}</span>
                        <code className="text-[10px] text-slate-500 font-mono">AS{node.asn}</code>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                        <div>Throughput: <strong className="text-slate-300">{node.throughputGbps}G</strong></div>
                        <div>Centrality: <strong className="text-purple-300">{node.degreeCentrality}</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2. TOPOLOGY VALUE DATA MATRIX TABLE */}
      {activeSubView === 'VALUE_DATA_MATRIX' && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-100 flex items-center space-x-2">
                <Table className="h-5 w-5 text-cyan-400" />
                <span>Full Topological Value Data Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mathematical and empirical values for all sovereign nodes, graph centralities, and spectral Fiedler metrics.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportTopologyData('CSV')}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Matrix CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                  <th className="p-3">Node ID / Name</th>
                  <th className="p-3">Location (City, Country)</th>
                  <th className="p-3">IP / ASN</th>
                  <th className="p-3">Latency / Jitter</th>
                  <th className="p-3">Throughput</th>
                  <th className="p-3">CPU / Mem</th>
                  <th className="p-3">Degree C_D</th>
                  <th className="p-3">Betweenness C_B</th>
                  <th className="p-3">Fiedler λ₂</th>
                  <th className="p-3">Encryption</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {nodes.map(node => (
                  <tr key={node.id} className="hover:bg-slate-950/80 transition-colors">
                    <td className="p-3 font-bold text-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>{node.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">{node.role}</span>
                    </td>
                    <td className="p-3">
                      <div>{node.city}</div>
                      <span className="text-[10px] text-slate-500">{node.country}</span>
                    </td>
                    <td className="p-3">
                      <div>{node.ipAddress}</div>
                      <span className="text-[10px] text-cyan-400 font-bold">AS{node.asn}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-cyan-400 font-bold">{node.latencyMs} ms</span>
                      <span className="text-[10px] text-slate-500 block">±{node.jitterMs}ms</span>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">
                      {node.throughputGbps} Gbps
                    </td>
                    <td className="p-3">
                      <span>{node.cpuLoadPercent}% / {node.memoryUsagePercent}%</span>
                    </td>
                    <td className="p-3 text-purple-400 font-bold">
                      {node.degreeCentrality}
                    </td>
                    <td className="p-3 text-amber-400 font-bold">
                      {node.betweennessScore}
                    </td>
                    <td className="p-3 text-blue-400 font-bold">
                      {node.fiedlerValue}
                    </td>
                    <td className="p-3 text-[10px] text-slate-400">
                      {node.encryption}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. DIJKSTRA PATH & LATENCY SOLVER */}
      {activeSubView === 'ROUTING_SOLVER' && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-100 flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-amber-400" />
              <span>Dijkstra Multi-Hop Shortest Path & Latency Solver</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Computes optimal graph paths across global fiber links with real-time hop cost weights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Source Ingress Node
              </label>
              <select
                value={solverOriginId}
                onChange={e => setSolverOriginId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.city}, {n.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Destination Egress Node
              </label>
              <select
                value={solverTargetId}
                onChange={e => setSolverTargetId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.city}, {n.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {solvedRoute && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
                <span className="text-cyan-400 font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Computed Shortest Path Route</span>
                </span>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">Total Hops: <strong className="text-slate-100">{solvedRoute.hops}</strong></span>
                  <span className="text-slate-400">Distance: <strong className="text-amber-400">{solvedRoute.totalDistanceKm.toLocaleString()} km</strong></span>
                  <span className="text-slate-400">Total Latency: <strong className="text-cyan-400">{solvedRoute.totalLatencyMs} ms</strong></span>
                </div>
              </div>

              {/* Path Step-by-Step Chain */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {solvedRoute.path.map((nodeId, idx) => {
                  const node = nodes.find(n => n.id === nodeId);
                  if (!node) return null;

                  return (
                    <React.Fragment key={nodeId}>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-slate-200 space-y-0.5">
                        <div className="font-bold text-cyan-300">Hop #{idx + 1}: {node.city.split(',')[0]}</div>
                        <div className="text-[10px] text-slate-400">{node.name} (AS{node.asn})</div>
                      </div>
                      {idx < solvedRoute.path.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-amber-400 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. HARDWARE GPRS / NMEA 0183 TELEMETRY STREAM */}
      {activeSubView === 'GPRS_NMEA_STREAM' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          
          {/* Cellular Triangulation Values (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-slate-100 flex items-center space-x-2">
                <Signal className="h-5 w-5 text-rose-400" />
                <span>GPRS / 5G Modem Telemetry</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Direct hardware baseband metrics and cellular triangulation parameters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">MCC / MNC</span>
                <span className="text-slate-100 font-bold">{gprsTelemetry.mcc} / {gprsTelemetry.mnc} (AT&T US)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Location Area (LAC)</span>
                <span className="text-cyan-400 font-bold">{gprsTelemetry.lac}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Cell ID</span>
                <span className="text-amber-400 font-bold">{gprsTelemetry.cellId}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Signal (RSSI)</span>
                <span className="text-emerald-400 font-bold">{gprsTelemetry.rssi} dBm</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">RSRP / RSRQ</span>
                <span className="text-slate-200 font-bold">{gprsTelemetry.rsrp} dBm / {gprsTelemetry.rsrq} dB</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">SNR / CQI</span>
                <span className="text-purple-400 font-bold">{gprsTelemetry.snr} dB / CQI {gprsTelemetry.cqi}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Carrier Baseband IP</span>
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold">{gprsTelemetry.ipAddress}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {gprsTelemetry.networkType}
                </span>
              </div>
            </div>

          </div>

          {/* Live NMEA 0183 Terminal Log (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 font-black text-slate-100 text-sm">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>NMEA 0183 Serial Stream ($GPGGA, $GPRMC, $GPGSA)</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-950 text-emerald-300 border border-emerald-800 rounded-lg">
                4800 / 9600 BAUD LIVE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 h-72 overflow-y-auto space-y-1">
              {nmeaLog.map((line, idx) => (
                <div key={idx} className="hover:bg-slate-900/60 px-1 py-0.5 rounded transition-colors">
                  <span className="text-slate-600 mr-2">[{idx + 1}]</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Parsed Sentences: GGA (Position Fix), RMC (Velocity), GSA (DOP Active Satellites), GSV (Satellites in View)</span>
              <button
                onClick={() => copyToClipboard(nmeaLog.join('\n'), 'nmea')}
                className="text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <Copy className="h-3 w-3" />
                <span>{copiedKey === 'nmea' ? 'Copied!' : 'Copy Stream'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
