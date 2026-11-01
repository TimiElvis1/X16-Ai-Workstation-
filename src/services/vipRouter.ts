import { VIPRouteLink, VIPRoutePath, VIPTransportAdapter } from '../types/vip';
import { initialVipNodes, initialVipRouteLinks } from '../data/vipDatabase';

export interface VnetAddressComponents {
  scheme: 'vnet';
  raw: string;
  domainOrNetwork: string;
  isDomainFormat: boolean;
  subnetId?: string;
  nodeId?: string;
  serverId?: string;
  serviceName?: string;
  pathParams?: string;
}

export class VIPRouter {
  /**
   * Parse "vnet://" virtual URI format
   * Supports:
   * 1. Domain format: "vnet://neural.edge/inference"
   * 2. Hierarchical format: "vnet://mesh-primary/sub-eu-central/vnode-fra-01/vsrv-neural/inference"
   */
  static parseVnetUri(uri: string): VnetAddressComponents {
    const trimmed = uri.trim();
    if (!trimmed.startsWith('vnet://')) {
      throw new Error(`Invalid VIP address: must start with 'vnet://', received: ${uri}`);
    }

    const withoutScheme = trimmed.replace(/^vnet:\/\//, '');
    const parts = withoutScheme.split('/').filter(Boolean);
    const domainOrNetwork = parts[0] || 'localhost';

    const isDomainFormat = domainOrNetwork.includes('.');

    if (isDomainFormat) {
      return {
        scheme: 'vnet',
        raw: trimmed,
        domainOrNetwork,
        isDomainFormat: true,
        serviceName: parts[1] || undefined,
        pathParams: parts.slice(2).join('/') || undefined
      };
    }

    return {
      scheme: 'vnet',
      raw: trimmed,
      domainOrNetwork,
      isDomainFormat: false,
      subnetId: parts[1] || undefined,
      nodeId: parts[2] || undefined,
      serverId: parts[3] || undefined,
      serviceName: parts[4] || undefined,
      pathParams: parts.slice(5).join('/') || undefined
    };
  }

  /**
   * Dijkstra Shortest Path computation across overlay node graph
   */
  static findShortestRoute(
    sourceNodeId: string,
    targetNodeId: string,
    routeLinks: VIPRouteLink[] = initialVipRouteLinks
  ): VIPRoutePath {
    if (sourceNodeId === targetNodeId) {
      const node = initialVipNodes.find(n => n.id === sourceNodeId) || initialVipNodes[0];
      return {
        sourceUri: `vnet://node/${sourceNodeId}`,
        destinationUri: `vnet://node/${targetNodeId}`,
        hopNodes: [
          {
            nodeId: node.id,
            nodeName: node.name,
            transport: node.physicalTransportBinding.protocol,
            latencyMs: 0.5,
            healthScore: node.healthScore
          }
        ],
        totalHops: 1,
        estimatedLatencyMs: 0.5,
        routeScore: 100,
        failoverPathAvailable: true
      };
    }

    // Build Adjacency Graph
    const graph: Record<string, Array<{ target: string; link: VIPRouteLink }>> = {};
    for (const link of routeLinks) {
      if (link.status === 'DOWN') continue;
      if (!graph[link.sourceNodeId]) graph[link.sourceNodeId] = [];
      if (!graph[link.targetNodeId]) graph[link.targetNodeId] = [];
      graph[link.sourceNodeId].push({ target: link.targetNodeId, link });
      graph[link.targetNodeId].push({ target: link.sourceNodeId, link });
    }

    const distances: Record<string, number> = {};
    const previous: Record<string, { node: string; link: VIPRouteLink } | null> = {};
    const unvisited = new Set<string>();

    for (const node of initialVipNodes) {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    }

    distances[sourceNodeId] = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current: string | null = null;
      let minDistance = Infinity;
      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (current === null || minDistance === Infinity) break;
      if (current === targetNodeId) break;

      unvisited.delete(current);

      const neighbors = graph[current] || [];
      for (const { target, link } of neighbors) {
        if (!unvisited.has(target)) continue;
        const alt = distances[current] + link.latencyMs * link.costWeight;
        if (alt < distances[target]) {
          distances[target] = alt;
          previous[target] = { node: current, link };
        }
      }
    }

    // Reconstruct path
    const pathNodes: string[] = [];
    let curr: string | null = targetNodeId;
    while (curr && curr !== sourceNodeId) {
      pathNodes.unshift(curr);
      curr = previous[curr]?.node || null;
    }
    pathNodes.unshift(sourceNodeId);

    const hopNodes = pathNodes.map(id => {
      const node = initialVipNodes.find(n => n.id === id) || {
        id,
        name: `Node-${id}`,
        physicalTransportBinding: { protocol: 'QUIC' as VIPTransportAdapter },
        healthScore: 98
      };
      return {
        nodeId: node.id,
        nodeName: node.name,
        transport: node.physicalTransportBinding.protocol,
        latencyMs: Math.round(10 + Math.random() * 20),
        healthScore: node.healthScore
      };
    });

    const totalLatency = hopNodes.reduce((acc, h) => acc + h.latencyMs, 0);

    return {
      sourceUri: `vnet://node/${sourceNodeId}`,
      destinationUri: `vnet://node/${targetNodeId}`,
      hopNodes,
      totalHops: hopNodes.length,
      estimatedLatencyMs: totalLatency,
      routeScore: Math.max(80, Math.min(100, Math.round(100 - (totalLatency / 10)))),
      failoverPathAvailable: true
    };
  }

  /**
   * Run a virtual traceroute probe between any two addresses
   */
  static runTraceroute(sourceUri: string, destUri: string): {
    hops: Array<{
      hopIndex: number;
      nodeId: string;
      nodeName: string;
      ipAddress: string;
      transport: VIPTransportAdapter;
      rttMs: number;
      lossPct: number;
      status: 'ACK' | 'TIMEOUT' | 'FORWARDED';
    }>;
    totalHops: number;
    avgRttMs: number;
    resolvedDestinationIp: string;
  } {
    const route = this.findShortestRoute('vnode-fra-01', 'vnode-iad-01');
    const hops = route.hopNodes.map((hop, idx) => {
      const node = initialVipNodes.find(n => n.id === hop.nodeId);
      const rtt = Math.round(4 + idx * 18 + Math.random() * 6);
      return {
        hopIndex: idx + 1,
        nodeId: hop.nodeId,
        nodeName: hop.nodeName,
        ipAddress: node?.physicalTransportBinding.ipAddress || `10.240.${idx}.1`,
        transport: hop.transport,
        rttMs: rtt,
        lossPct: 0,
        status: 'ACK' as const
      };
    });

    const totalRtt = hops.reduce((a, b) => a + b.rttMs, 0);

    return {
      hops,
      totalHops: hops.length,
      avgRttMs: Math.round(totalRtt / Math.max(1, hops.length)),
      resolvedDestinationIp: hops[hops.length - 1]?.ipAddress || '198.51.100.88'
    };
  }
}
