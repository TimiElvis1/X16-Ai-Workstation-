import { OpenSourceProject, NetworkNode } from '../types';

export const initialOpenSourceProjects: OpenSourceProject[] = [
  {
    id: "osp-01",
    name: "FastAPI-Microservice-Core",
    repoUrl: "https://github.com/tiangolo/fastapi",
    description: "High performance, easy to learn, fast to code, production-ready Python API framework with auto OpenAPI docs.",
    category: "DevOps",
    tags: ["python", "fastapi", "async", "openapi", "rest"],
    starCount: 78500,
    status: "running",
    deployedServerId: "srv-edge-01",
    author: "tiangolo",
    configYaml: `version: '3.8'
services:
  fastapi-app:
    image: tiangolo/uvicorn-gunicorn-fastapi:python3.10
    ports:
      - "8000:8000"
    environment:
      - WORKERS_PER_CORE=2
      - LOG_LEVEL=debug
      - SUBNET_BIND=10.142.0.12`,
    parameterFunctions: [
      {
        id: "inj-fastapi-health",
        name: "CheckFastApiHealth",
        description: "Queries FastAPI /health endpoint and checks worker thread status",
        language: "typescript",
        triggerType: "ai_tool",
        parameters: [
          { name: "endpointUrl", type: "string", required: true, description: "Full URL to FastAPI endpoint", defaultValue: "http://10.142.0.12:8000/health" }
        ],
        code: `function execute(params) {
  const { endpointUrl } = params;
  console.log("Querying health endpoint: " + endpointUrl);
  return {
    status: "UP",
    activeWorkers: 4,
    latencyMs: 12,
    memoryAllocationMb: 128
  };
}`,
        executionCount: 5,
        targetServerId: "srv-edge-01"
      }
    ]
  },
  {
    id: "osp-02",
    name: "Ollama-AI-Inference-Engine",
    repoUrl: "https://github.com/ollama/ollama",
    description: "Get up and running with Llama 3, Mistral, Gemma, and other open-source large language models on private subnets.",
    category: "AI/LLM",
    tags: ["ollama", "llm", "inference", "private-ai", "quantized"],
    starCount: 94200,
    status: "idle",
    author: "ollama",
    configYaml: `version: '3.8'
services:
  ollama-node:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ./ollama_models:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_KEEP_ALIVE=24h`,
    parameterFunctions: [
      {
        id: "inj-ollama-prompt",
        name: "InjectOllamaPrompt",
        description: "Executes localized prompt injection against Ollama private model endpoint.",
        language: "javascript",
        triggerType: "manual",
        parameters: [
          { name: "model", type: "string", required: true, description: "Model name", defaultValue: "llama3:8b" },
          { name: "prompt", type: "string", required: true, description: "Prompt input text" }
        ],
        code: `function execute(params) {
  const { model, prompt } = params;
  console.log("Dispatching prompt to " + model);
  return {
    modelUsed: model,
    promptLength: prompt ? prompt.length : 0,
    generatedOutput: "Simulated response from private " + model + " node.",
    tokensPerSecond: 42.5
  };
}`,
        executionCount: 12,
        targetServerId: "srv-vector-02"
      }
    ]
  },
  {
    id: "osp-03",
    name: "Qdrant-Vector-Search-Cluster",
    repoUrl: "https://github.com/qdrant/qdrant",
    description: "Vector Similarity Search Engine with extended filtering support, built in Rust for low-latency AI embeddings.",
    category: "Database",
    tags: ["vector-db", "rust", "embeddings", "qdrant", "rag"],
    starCount: 21800,
    status: "running",
    deployedServerId: "srv-vector-02",
    author: "qdrant",
    configYaml: `version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:v1.7.0
    ports:
      - "6333:6333"
      - "6334:6334"
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__STORAGE__STORAGE_PATH=/qdrant/storage`,
    parameterFunctions: []
  },
  {
    id: "osp-04",
    name: "n8n-Workflow-Automation-Hub",
    repoUrl: "https://github.com/n8n-io/n8n",
    description: "Free and source-available fair-code licensed workflow automation tool for connecting internal APIs and webhooks.",
    category: "Automation",
    tags: ["workflow", "automation", "node", "integrations", "webhooks"],
    starCount: 52000,
    status: "synced",
    author: "n8n-io",
    configYaml: `version: '3.8'
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=https`,
    parameterFunctions: [
      {
        id: "inj-n8n-webhook-protocol",
        name: "n8n_Webhook_HTTP_Protocol_Trigger",
        description: "n8n Webhook Listener Node with TLS handshake verification, query parameter extraction & HMAC SHA256 signature verification.",
        language: "typescript",
        triggerType: "webhook",
        parameters: [
          { name: "webhookPath", type: "string", required: true, description: "n8n endpoint path", defaultValue: "/webhook/v1/network-event" },
          { name: "httpMethod", type: "string", required: true, description: "GET | POST | PUT | DELETE", defaultValue: "POST" },
          { name: "authSecret", type: "string", required: false, description: "HMAC Secret Key", defaultValue: "n8n_sec_993812" }
        ],
        code: `function execute(params) {
  const { webhookPath, httpMethod, authSecret } = params;
  console.log("n8n Webhook Node Listening on: " + webhookPath);
  return {
    n8nNodeType: "n8n-nodes-base.webhook",
    status: "TRIGGERED",
    httpMethod,
    path: webhookPath,
    securityCheck: "HMAC_SHA256_VALIDATED",
    receivedHeaders: { "user-agent": "SubNet-n8n-Dispatcher/2.0", "content-type": "application/json" },
    payload: { id: "evt_9918", sourceSubnet: "10.142.0.0/24", eventType: "ISP_ROUTE_CHANGE" }
  };
}`,
        executionCount: 88,
        targetServerId: "srv-worker-03"
      },
      {
        id: "inj-n8n-mqtt-broker",
        name: "n8n_MQTT_Network_Broker_Node",
        description: "n8n MQTT Protocol Automation Node subscribing to private sub-connective broker topics with QoS 1 guaranteed delivery.",
        language: "typescript",
        triggerType: "ai_tool",
        parameters: [
          { name: "brokerHost", type: "string", required: true, description: "MQTT Broker Host", defaultValue: "10.142.1.88" },
          { name: "topic", type: "string", required: true, description: "MQTT Topic Filter", defaultValue: "subnet/sensors/telemetry/#" },
          { name: "qos", type: "number", required: false, description: "QoS Level (0, 1, 2)", defaultValue: 1 }
        ],
        code: `function execute(params) {
  const { brokerHost, topic, qos = 1 } = params;
  console.log("n8n MQTT Node Subscribed to " + topic + " on " + brokerHost);
  return {
    n8nNodeType: "n8n-nodes-base.mqtt",
    brokerStatus: "CONNECTED",
    subscribedTopic: topic,
    qosLevel: qos,
    bufferedMessagesCount: 14,
    samplePacket: { topic: "subnet/sensors/telemetry/node-01", payload: "{\"temp\":23.4,\"status\":\"OK\"}", qos }
  };
}`,
        executionCount: 54,
        targetServerId: "srv-worker-03"
      },
      {
        id: "inj-n8n-websocket-listener",
        name: "n8n_WebSocket_Stream_Listener",
        description: "n8n Real-time WebSocket Protocol Node listening on TCP socket connections for telemetry frame streaming.",
        language: "typescript",
        triggerType: "schedule",
        parameters: [
          { name: "wsUrl", type: "string", required: true, description: "WebSocket Server Endpoint", defaultValue: "ws://10.142.0.12:8080/ws/stream" },
          { name: "pingIntervalSec", type: "number", required: false, description: "Keepalive Ping Interval", defaultValue: 30 }
        ],
        code: `function execute(params) {
  const { wsUrl, pingIntervalSec } = params;
  return {
    n8nNodeType: "n8n-nodes-base.websocket",
    connectionState: "OPEN",
    endpoint: wsUrl,
    framesReceived: 1240,
    bandwidthKbps: 420,
    lastFramePayload: { event: "SOCKET_HEARTBEAT", timestamp: new Date().toISOString() }
  };
}`,
        executionCount: 112,
        targetServerId: "srv-worker-03"
      },
      {
        id: "inj-n8n-sftp-sync",
        name: "n8n_SFTP_S3_Network_Sync_Node",
        description: "n8n Secure Network File Transfer Node executing SFTP SSH protocol transfer and S3 object bucket checksum sync.",
        language: "typescript",
        triggerType: "manual",
        parameters: [
          { name: "sftpHost", type: "string", required: true, description: "SFTP Host Server", defaultValue: "10.142.0.45" },
          { name: "remotePath", type: "string", required: true, description: "Remote Directory Path", defaultValue: "/var/backups/subnet-logs/" },
          { name: "targetS3Bucket", type: "string", required: true, description: "S3 Target Bucket", defaultValue: "subnet-private-backups" }
        ],
        code: `function execute(params) {
  const { sftpHost, remotePath, targetS3Bucket } = params;
  return {
    n8nNodeType: "n8n-nodes-base.sftp",
    transferProtocol: "SFTP_SSH_PORT_22",
    remoteHost: sftpHost,
    s3Destination: targetS3Bucket,
    filesTransferred: [
      { filename: "subnet-telemetry-2026-08-07.log.gz", bytes: 4859200, sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
    ],
    status: "SYNC_COMPLETED"
  };
}`,
        executionCount: 31,
        targetServerId: "srv-worker-03"
      }
    ]
  }
];

export const initialNetworkNodes: NetworkNode[] = [
  { id: "node-gateway", label: "Alpha Gateway", type: "gateway", ip: "10.142.0.12", status: "active", x: 180, y: 150, connections: ["node-vector", "node-worker", "node-ai"], bandwidthKbps: 1250 },
  { id: "node-vector", label: "Vector Memory Store", type: "database", ip: "10.142.0.45", status: "active", x: 420, y: 100, connections: ["node-ai"], bandwidthKbps: 3400 },
  { id: "node-worker", label: "Script Automation Worker", type: "server", ip: "10.142.1.88", status: "active", x: 450, y: 260, connections: ["node-tool"], bandwidthKbps: 890 },
  { id: "node-ai", label: "VOX AI Engine", type: "ai_agent", ip: "10.142.99.1", status: "active", x: 680, y: 160, connections: ["node-webhook"], bandwidthKbps: 5200 },
  { id: "node-tool", label: "HTTP & Ping Probe", type: "tool", ip: "10.142.1.200", status: "idle", x: 250, y: 320, connections: ["node-gateway"], bandwidthKbps: 450 },
  { id: "node-webhook", label: "Webhook Dispatcher", type: "webhook", ip: "10.142.3.10", status: "active", x: 720, y: 330, connections: [], bandwidthKbps: 920 }
];
