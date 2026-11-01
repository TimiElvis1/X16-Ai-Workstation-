import { AIToolItem } from '../types/aiToolsDirectory';

export const SCRAPED_AI_TOP_TOOLS_CATALOG: AIToolItem[] = [
  // --- 1. CODE & DEVELOPER TOOLS ---
  {
    id: 'tool-cursor',
    name: 'Cursor AI Code Editor',
    slug: 'cursor-ai',
    tagline: 'The AI-first Code Editor built on VS Code with multi-file codebase indexing',
    description: 'Autonomous multi-file diff generation, intelligent repo-wide indexing, terminal command synthesis, and instant inline edits.',
    category: 'CODE_DEV',
    subCategory: 'Code Editors & IDEs',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free tier available / $20/mo Pro',
    websiteUrl: 'https://cursor.com',
    apiEndpoint: 'https://api.cursor.com/v1/indexing',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 3420,
    monthlyUsers: '2.5M+',
    verified: true,
    iconName: 'Code2',
    badge: 'Trending #1 Dev',
    tags: ['IDE', 'Codebase Indexing', 'Multi-file Diff', 'VS Code', 'TypeScript'],
    capabilities: ['Codebase Search', 'Repo-wide Refactoring', 'Semantic Code Analysis', 'Terminal Auto-Execution'],
    systemPromptAddition: 'When Cursor AI tool is toggled, generate precise multi-file git unified diff patches and respect repo file hierarchies.',
    functionSchema: {
      name: 'cursor_codebase_query',
      description: 'Searches and refactors codebase files with semantic indexing and context-aware diffs.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural language refactor or inspection query' },
          targetFiles: { type: 'string', description: 'Comma separated list of target file paths' },
          includeDependencies: { type: 'string', description: 'Whether to parse package manifests (true/false)' }
        },
        required: ['query']
      }
    },
    sampleCall: {
      action: 'Refactor Auth middleware to support JWT and OAuth2 Bearer tokens',
      input: { query: 'Migrate auth handler to OAuth2 Bearer', targetFiles: 'src/middleware/auth.ts, src/types/user.ts' },
      expectedOutput: 'Unified diff patch generated with 18 lines added, 4 removed.'
    }
  },
  {
    id: 'tool-v0-dev',
    name: 'v0 by Vercel',
    slug: 'v0-dev',
    tagline: 'Generative UI system producing production-ready React, Tailwind, and shadcn components',
    description: 'Natural language prompt-to-UI engine producing clean, accessible React components with Tailwind CSS styling and interactive state handling.',
    category: 'CODE_DEV',
    subCategory: 'Frontend & UI Generators',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free credits monthly / $20/mo Premium',
    websiteUrl: 'https://v0.dev',
    apiEndpoint: 'https://api.v0.dev/v1/generate',
    isToggledForAI: true,
    rating: 4.8,
    reviewCount: 2890,
    monthlyUsers: '1.8M+',
    verified: true,
    iconName: 'Layers',
    badge: 'Popular UI',
    tags: ['React', 'Tailwind CSS', 'shadcn', 'Component Design', 'Next.js'],
    capabilities: ['Instant React JSX/TSX', 'Tailwind Utility Styling', 'Accessible Headless Components', 'Live Preview Sandbox'],
    systemPromptAddition: 'When v0.dev is toggled, prioritize modular React components with pure Tailwind CSS utilities and Lucide icons.',
    functionSchema: {
      name: 'v0_generate_ui_component',
      description: 'Generates polished React and Tailwind UI component code based on visual design prompt.',
      parameters: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Detailed description of the UI component to build' },
          framework: { type: 'string', description: 'React, Next.js, or HTML', enum: ['React', 'Next.js', 'HTML'] },
          theme: { type: 'string', description: 'Dark, Light, Cyber, or Minimal', enum: ['Dark', 'Light', 'Cyber', 'Minimal'] }
        },
        required: ['prompt']
      }
    },
    sampleCall: {
      action: 'Generate Real-Time Crypto Orderbook Component',
      input: { prompt: 'High-frequency orderbook with bids/asks depth bars in dark mode', framework: 'React', theme: 'Dark' },
      expectedOutput: 'React TSX component <OrderBookVisualizer /> with live depth graph and responsive rows.'
    }
  },
  {
    id: 'tool-replit-agent',
    name: 'Replit Agent',
    slug: 'replit-agent',
    tagline: 'Autonomous end-to-end full-stack software development agent',
    description: 'Scaffolds, writes, debugs, installs dependencies, and deploys full-stack apps from natural language instructions in a containerized environment.',
    category: 'CODE_DEV',
    subCategory: 'Autonomous Dev Agents',
    pricingType: 'PAID',
    pricingNote: 'Core subscription ($25/mo)',
    websiteUrl: 'https://replit.com/agent',
    apiEndpoint: 'https://api.replit.com/v1/agent/task',
    isToggledForAI: false,
    rating: 4.7,
    reviewCount: 1650,
    monthlyUsers: '950K+',
    verified: true,
    iconName: 'Terminal',
    badge: 'Autonomous',
    tags: ['Full-stack', 'Cloud Deployment', 'PostgreSQL', 'Docker', 'Autonomous Agent'],
    capabilities: ['Autonomous Package Install', 'Database Provisioning', 'One-Click Cloud Deployment', 'Live Self-Debugging'],
    systemPromptAddition: 'When Replit Agent is toggled, construct complete end-to-end deployment plans including database schemas and server routes.',
    functionSchema: {
      name: 'replit_deploy_agent_task',
      description: 'Dispatches autonomous task execution to Replit cloud container environment.',
      parameters: {
        type: 'object',
        properties: {
          taskDescription: { type: 'string', description: 'Full stack project or feature goal' },
          runtime: { type: 'string', description: 'Node.js, Python, or Go', enum: ['Node.js', 'Python', 'Go'] }
        },
        required: ['taskDescription']
      }
    },
    sampleCall: {
      action: 'Deploy Telegram Bot with Redis Session Store',
      input: { taskDescription: 'Create Express + Telegraf bot storing user state in Redis', runtime: 'Node.js' },
      expectedOutput: 'Provisioned container with 3 files and active HTTPS webhook URL.'
    }
  },
  {
    id: 'tool-github-copilot',
    name: 'GitHub Copilot Workspace',
    slug: 'github-copilot',
    tagline: 'AI Pair Programmer & Issue-to-PR Task Planner',
    description: 'Context-aware autocompletions, automated pull request summarization, vulnerability remediation, and multi-file code exploration.',
    category: 'CODE_DEV',
    subCategory: 'Code Assistants',
    pricingType: 'PAID',
    pricingNote: '$10/mo Individual, $19/mo Business',
    websiteUrl: 'https://github.com/features/copilot',
    apiEndpoint: 'https://api.githubcopilot.com/v1/chat/completions',
    isToggledForAI: true,
    rating: 4.8,
    reviewCount: 5400,
    monthlyUsers: '5M+',
    verified: true,
    iconName: 'GitBranch',
    badge: 'Enterprise Standard',
    tags: ['GitHub', 'Pair Programming', 'PR Generation', 'Unit Testing', 'Security Fixes'],
    capabilities: ['Inline Auto-complete', 'Test Suite Generation', 'PR Plan Specification', 'Repo Q&A'],
    systemPromptAddition: 'When GitHub Copilot is toggled, follow idiomatic syntax standards, comprehensive docstrings, and robust unit tests.',
    functionSchema: {
      name: 'copilot_generate_unit_tests',
      description: 'Generates comprehensive unit test suites for target functions or modules.',
      parameters: {
        type: 'object',
        properties: {
          sourceCode: { type: 'string', description: 'The function or class implementation to test' },
          framework: { type: 'string', description: 'Jest, Vitest, PyTest, or GoTest', enum: ['Jest', 'Vitest', 'PyTest', 'GoTest'] }
        },
        required: ['sourceCode']
      }
    },
    sampleCall: {
      action: 'Generate Vitest test suite for Dijkstra shortest path solver',
      input: { sourceCode: 'export function solveDijkstra(...) { ... }', framework: 'Vitest' },
      expectedOutput: 'Generated 6 test cases covering edge weights, disconnected nodes, and cyclic loops.'
    }
  },

  // --- 2. LLM & REASONING AGENTS ---
  {
    id: 'tool-gemini-pro',
    name: 'Google Gemini 1.5 Pro & Flash',
    slug: 'gemini-1-5-pro',
    tagline: 'State-of-the-art multimodal reasoning with 2M token context window & live audio/vision',
    description: 'High-speed multimodal reasoning, deep research analysis, native tool-use function calling, and massive 2,000,000 token context processing.',
    category: 'LLM_REASONING',
    subCategory: 'Foundation Models',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free tier in AI Studio / Pay-per-token API',
    websiteUrl: 'https://ai.google.dev',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 4120,
    monthlyUsers: '10M+',
    verified: true,
    iconName: 'Sparkles',
    badge: '2M Context Winner',
    tags: ['Multimodal', '2M Context', 'Live API', 'Grounding', 'JSON Schema Output'],
    capabilities: ['2,000,000 Token Processing', 'Native Audio/Video Ingestion', 'Function Calling', 'Google Search Grounding'],
    systemPromptAddition: 'When Gemini 1.5 Pro is toggled, utilize high context synthesis and structured JSON schema outputs.',
    functionSchema: {
      name: 'gemini_multimodal_analyze',
      description: 'Executes high-capacity multimodal reasoning across long text, video frames, or audio streams.',
      parameters: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'The analytical reasoning prompt' },
          groundingWithSearch: { type: 'string', description: 'Enable Google Search grounding (true/false)' }
        },
        required: ['prompt']
      }
    },
    sampleCall: {
      action: 'Analyze 500-page RFC documentation for security protocol vulnerabilities',
      input: { prompt: 'Extract all cryptographic key exchange edge cases in RFC 8446', groundingWithSearch: 'true' },
      expectedOutput: 'Structured vulnerability breakdown with citations from section 4.1.2.'
    }
  },
  {
    id: 'tool-claude-sonnet',
    name: 'Claude 3.5 Sonnet',
    slug: 'claude-3-5-sonnet',
    tagline: 'Premier frontier coding, nuanced reasoning, and Artifacts execution environment',
    description: 'World-leading benchmarks for code synthesis, complex system architecture design, multi-turn reasoning, and artifact previews.',
    category: 'LLM_REASONING',
    subCategory: 'Frontier LLMs',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free tier available / $20/mo Claude Pro',
    websiteUrl: 'https://claude.ai',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 3980,
    monthlyUsers: '8M+',
    verified: true,
    iconName: 'Bot',
    badge: 'Coding SOTA',
    tags: ['Coding Benchmark #1', 'Artifacts', 'Anthropic API', 'Prompt Engineering', '200K Context'],
    capabilities: ['Artifact Visualizer', 'Complex Math & Logic', 'Refactoring Monoliths', 'Zero-shot Reasoning'],
    systemPromptAddition: 'When Claude 3.5 Sonnet is toggled, prioritize precise architectural explanations and pristine modular TypeScript.',
    functionSchema: {
      name: 'claude_architectural_review',
      description: 'Performs deep architectural review and system decomposition with Artifact code generation.',
      parameters: {
        type: 'object',
        properties: {
          architectureSpec: { type: 'string', description: 'Description of system components and topology' },
          focusArea: { type: 'string', description: 'Security, Latency, or Scalability', enum: ['Security', 'Latency', 'Scalability'] }
        },
        required: ['architectureSpec']
      }
    },
    sampleCall: {
      action: 'Audit distributed zero-knowledge consensus architecture',
      input: { architectureSpec: '10-node BFT mesh with BLS threshold signatures', focusArea: 'Security' },
      expectedOutput: 'Identified 2 threshold reconstruction race conditions with mitigation pseudocode.'
    }
  },
  {
    id: 'tool-deepseek-r1',
    name: 'DeepSeek-R1 / V3',
    slug: 'deepseek-r1',
    tagline: 'Open-weight reasoning model matching frontier standards via Large-Scale RL',
    description: 'Open-source reasoning model demonstrating chain-of-thought verification, mathematical proofs, and cost-efficient inference.',
    category: 'LLM_REASONING',
    subCategory: 'Open Weights & Reasoning',
    pricingType: 'OPEN_SOURCE',
    pricingNote: 'Apache 2.0 / Extremely low API cost',
    websiteUrl: 'https://deepseek.com',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    isToggledForAI: true,
    rating: 4.8,
    reviewCount: 2750,
    monthlyUsers: '4.2M+',
    verified: true,
    iconName: 'Cpu',
    badge: 'Open Weights',
    tags: ['Chain of Thought', 'Open Weights', 'Math Proofs', 'Ultra Low Cost', 'DeepSeek'],
    capabilities: ['Explicit Step-by-Step Thinking', 'Formal Logic Verification', 'Low Inference Cost', 'Uncensored Open Model'],
    systemPromptAddition: 'When DeepSeek-R1 is toggled, show structured reasoning tags <think> ... </think> before final solutions.',
    functionSchema: {
      name: 'deepseek_solve_logic_puzzle',
      description: 'Solves complex mathematical proofs and formal logic puzzles with verifiable step traces.',
      parameters: {
        type: 'object',
        properties: {
          problemStatement: { type: 'string', description: 'Math, algorithm, or formal logic theorem statement' }
        },
        required: ['problemStatement']
      }
    },
    sampleCall: {
      action: 'Solve maximum network flow with capacity constraints',
      input: { problemStatement: 'Calculate max flow in directed bipartite graph G=(V,E) with 14 vertices' },
      expectedOutput: 'Calculated max flow = 184 Gbps using Edmonds-Karp with full residual graph steps.'
    }
  },
  {
    id: 'tool-perplexity-pro',
    name: 'Perplexity Pro Research',
    slug: 'perplexity-pro',
    tagline: 'Conversational search engine with live academic citations and deep web crawling',
    description: 'Real-time web search synthesis, academic paper citation graph, Wolfram Alpha computation, and verified source grounding.',
    category: 'PRODUCTIVITY_WRITING',
    subCategory: 'Search & Deep Research',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free tier / $20/mo Pro',
    websiteUrl: 'https://perplexity.ai',
    apiEndpoint: 'https://api.perplexity.ai/chat/completions',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 3100,
    monthlyUsers: '6M+',
    verified: true,
    iconName: 'Search',
    badge: 'Research #1',
    tags: ['Citations', 'Live Web', 'Deep Research', 'Academic Search', 'Fact Verification'],
    capabilities: ['Live Web Grounding', 'URL Citation Tracking', 'Academic Papers Indexing', 'Multi-query Synthesis'],
    systemPromptAddition: 'When Perplexity Pro is toggled, always append source URLs and domain citations to empirical claims.',
    functionSchema: {
      name: 'perplexity_deep_research',
      description: 'Executes live web search and deep research across verified sources and returns cited answers.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Research query or factual verification topic' },
          domainFilter: { type: 'string', description: 'Limit to specific domains (e.g., github.com, arxiv.org)' }
        },
        required: ['query']
      }
    },
    sampleCall: {
      action: 'Research latest Post-Quantum Cryptography standards ratified by NIST',
      input: { query: 'NIST PQC final standards August 2024 ML-KEM ML-DSA', domainFilter: 'nist.gov' },
      expectedOutput: 'Synthesized FIPS 203, 204, 205 specifications with direct NIST links.'
    }
  },

  // --- 3. AGENTS & AUTOMATION ---
  {
    id: 'tool-n8n-ai',
    name: 'n8n AI Workflow Automation',
    slug: 'n8n-ai-automation',
    tagline: 'Self-hosted and cloud visual workflow automation with native LangChain AI nodes',
    description: 'Connect 400+ APIs, trigger autonomous webhook pipelines, orchestrate vector databases, and execute custom JavaScript/Python code nodes.',
    category: 'AGENTS_AUTOMATION',
    subCategory: 'Workflow Orchestration',
    pricingType: 'OPEN_SOURCE',
    pricingNote: 'Fair-code Community Edition (Free self-host) / Cloud plans',
    websiteUrl: 'https://n8n.io',
    apiEndpoint: 'http://localhost:5678/api/v1/workflows',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 2450,
    monthlyUsers: '1.2M+',
    verified: true,
    iconName: 'Workflow',
    badge: 'Self-Host Hero',
    tags: ['Workflow DAG', 'Self-Hosted', 'Webhooks', 'Vector Store', 'Automation Mesh'],
    capabilities: ['Visual DAG Canvas', 'AI Agent Nodes', 'Custom Code Execution', 'Zero Data Leakage Self-Hosting'],
    systemPromptAddition: 'When n8n AI is toggled, generate valid n8n workflow JSON nodes and webhook listener payloads.',
    functionSchema: {
      name: 'n8n_execute_workflow_dag',
      description: 'Dispatches execution trigger to configured n8n visual automation workflow.',
      parameters: {
        type: 'object',
        properties: {
          workflowId: { type: 'string', description: 'Identifier of the target n8n workflow' },
          payload: { type: 'string', description: 'JSON payload passed into trigger node' }
        },
        required: ['workflowId', 'payload']
      }
    },
    sampleCall: {
      action: 'Trigger Daily Server Health & Backup Sync to S3',
      input: { workflowId: 'wf_backup_s3_hourly', payload: '{"servers": ["10.142.0.12", "10.240.0.18"]}' },
      expectedOutput: 'Workflow executed in 410ms with status 200 OK.'
    }
  },
  {
    id: 'tool-crewai',
    name: 'CrewAI Multi-Agent Framework',
    slug: 'crewai',
    tagline: 'Cutting-edge framework for orchestrating role-playing autonomous AI agents',
    description: 'Enables autonomous agents to collaborate, delegate tasks, execute tool functions, and solve complex multi-stage objectives sequentially or in parallel.',
    category: 'AGENTS_AUTOMATION',
    subCategory: 'Multi-Agent Frameworks',
    pricingType: 'OPEN_SOURCE',
    pricingNote: 'MIT License / Free open source',
    websiteUrl: 'https://crewai.com',
    apiEndpoint: 'https://api.crewai.com/v1/crews/run',
    isToggledForAI: true,
    rating: 4.8,
    reviewCount: 1980,
    monthlyUsers: '800K+',
    verified: true,
    iconName: 'Users',
    badge: 'Agent Mesh',
    tags: ['Multi-Agent', 'Role Playing', 'Task Delegation', 'Python', 'Autonomous Teams'],
    capabilities: ['Autonomous Delegation', 'Hierarchical Process Flow', 'Tool Calling Orchestration', 'Memory & Cache'],
    systemPromptAddition: 'When CrewAI is toggled, structure complex tasks into clear Agent Roles (Researcher, Coder, Auditor, Reviewer).',
    functionSchema: {
      name: 'crewai_dispatch_crew',
      description: 'Spawns a multi-agent crew with specific roles and sequential tasks to complete a project.',
      parameters: {
        type: 'object',
        properties: {
          crewGoal: { type: 'string', description: 'Overall objective for the agent crew' },
          agentRoles: { type: 'string', description: 'Comma separated list of assigned personas' }
        },
        required: ['crewGoal']
      }
    },
    sampleCall: {
      action: 'Run Multi-Agent PenTest and Vulnerability Assessment',
      input: { crewGoal: 'Perform automated audit of smart contract staking pool', agentRoles: 'StaticAnalyzer, ExploitTester, ReportWriter' },
      expectedOutput: 'Crew completed 3 tasks in 14.2s producing unified security report.'
    }
  },

  // --- 4. IMAGE, DESIGN & 3D ---
  {
    id: 'tool-midjourney',
    name: 'Midjourney v6.1',
    slug: 'midjourney',
    tagline: 'World-renowned generative AI image model with unparalleled aesthetic realism',
    description: 'State-of-the-art visual fidelity, nuanced lighting, photorealistic textures, typography rendering, and cinematic camera controls.',
    category: 'IMAGE_DESIGN_3D',
    subCategory: 'Generative Art',
    pricingType: 'PAID',
    pricingNote: 'From $10/mo Basic to $60/mo Pro',
    websiteUrl: 'https://midjourney.com',
    apiEndpoint: 'https://api.midjourney.com/v1/imagine',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 8200,
    monthlyUsers: '16M+',
    verified: true,
    iconName: 'Palette',
    badge: 'Visual Benchmark',
    tags: ['Aesthetic Realism', 'Cinematic', 'Photorealism', 'Prompt Engineering', 'Texture'],
    capabilities: ['Hyper-realistic Textures', 'Dynamic Lighting', 'Coherent Text in Images', 'Vary Region (Inpainting)'],
    systemPromptAddition: 'When Midjourney is toggled, format prompts with optimal aspect ratios (--ar 16:9), stylize (--s 250), and lighting descriptors.',
    functionSchema: {
      name: 'midjourney_generate_image',
      description: 'Generates high-fidelity images using Midjourney diffusion model parameters.',
      parameters: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Detailed prompt with visual descriptors, camera lens, and lighting' },
          aspectRatio: { type: 'string', description: 'Aspect ratio (e.g., 16:9, 1:1, 9:16)', enum: ['16:9', '1:1', '9:16', '21:9'] },
          stylize: { type: 'string', description: 'Stylize strength 0 to 1000' }
        },
        required: ['prompt']
      }
    },
    sampleCall: {
      action: 'Generate Futuristic Cyberpunk Server Node Rack in Glass Hologram',
      input: { prompt: 'Sovereign cryptographic server rack with neon cyan fiber optics, glass chassis, dark room, 8k resolution', aspectRatio: '16:9', stylize: '350' },
      expectedOutput: 'Rendered 4-panel image grid with high dynamic range and glow particles.'
    }
  },
  {
    id: 'tool-flux-schnell',
    name: 'Flux.1 Schnell & Dev (Black Forest Labs)',
    slug: 'flux-1-schnell',
    tagline: 'Open-weight 12B parameter image generator matching and exceeding closed models',
    description: 'High prompt adherence, immaculate typography spelling, anatomical precision, and ultra-fast 4-step inference capabilities.',
    category: 'IMAGE_DESIGN_3D',
    subCategory: 'Open Weight Diffusion',
    pricingType: 'OPEN_SOURCE',
    pricingNote: 'Apache 2.0 (Schnell) / Non-commercial (Dev)',
    websiteUrl: 'https://blackforestlabs.ai',
    apiEndpoint: 'https://api.bfl.ml/v1/flux-pro-1.1',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 3600,
    monthlyUsers: '3.5M+',
    verified: true,
    iconName: 'Sparkles',
    badge: 'Fastest SOTA',
    tags: ['12B Params', 'Text Spelling', 'Fast Inference', 'Black Forest Labs', 'Open Weights'],
    capabilities: ['Accurate In-Image Text Spelling', 'Complex Multi-Subject Scenes', '4-Step Lightning Generation', 'Photographic Dynamic Range'],
    systemPromptAddition: 'When Flux.1 is toggled, structure concise descriptive prompts with clear quoted text strings for in-image spelling.',
    functionSchema: {
      name: 'flux_synthesize_visual',
      description: 'Synthesizes ultra-fast photorealistic imagery with accurate text typography.',
      parameters: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Scene description with exact text in quotes' },
          steps: { type: 'string', description: 'Inference steps (4 to 28)' }
        },
        required: ['prompt']
      }
    },
    sampleCall: {
      action: 'Generate Neon Sign with text "AGVORA VIP-20"',
      input: { prompt: 'A glowing cyan neon sign on a dark brick wall reading "AGVORA VIP-20", rainy night reflection', steps: '4' },
      expectedOutput: 'Generated 1024x1024 visual with pristine neon typography in 1.4 seconds.'
    }
  },

  // --- 5. VIDEO & MOTION GENERATION ---
  {
    id: 'tool-runway-gen3',
    name: 'Runway Gen-3 Alpha',
    slug: 'runway-gen-3',
    tagline: 'Industry standard for AI video generation, camera motions, and cinematic physics',
    description: 'Generates high-definition video clips from text or image prompts with realistic physics, fine-grained camera direction, and temporal consistency.',
    category: 'VIDEO_MOTION',
    subCategory: 'Generative Video',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free starter credits / Pro plans',
    websiteUrl: 'https://runwayml.com',
    apiEndpoint: 'https://api.runwayml.com/v1/tasks',
    isToggledForAI: true,
    rating: 4.8,
    reviewCount: 2900,
    monthlyUsers: '4M+',
    verified: true,
    iconName: 'Video',
    badge: 'Hollywood Standard',
    tags: ['Text-to-Video', 'Motion Brush', 'Camera Control', 'HD 60FPS', 'Cinematic Physics'],
    capabilities: ['Custom Motion Vectors', 'First and Last Frame Interpolation', 'Director Mode Camera Angles', '4K Upscaling'],
    systemPromptAddition: 'When Runway Gen-3 is toggled, specify explicit camera movements (e.g. slow pan right, orbital tilt, dolly in).',
    functionSchema: {
      name: 'runway_generate_video_clip',
      description: 'Renders cinematic video sequence with physics simulation and specified camera path.',
      parameters: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Visual action description with camera motion commands' },
          durationSeconds: { type: 'string', description: 'Duration (5s or 10s)', enum: ['5s', '10s'] },
          cameraMotion: { type: 'string', description: 'Dolly, Pan, Orbit, or Static', enum: ['Dolly', 'Pan', 'Orbit', 'Static'] }
        },
        required: ['prompt']
      }
    },
    sampleCall: {
      action: 'Generate 10-second fly-through of global fiber optic network datacenter',
      input: { prompt: 'Cinematic dolly shot moving through rows of blinking blue server nodes in dark vault', durationSeconds: '10s', cameraMotion: 'Dolly' },
      expectedOutput: 'Rendered 10s MP4 1080p video with smooth motion blur and optical reflections.'
    }
  },
  {
    id: 'tool-luma-dream-machine',
    name: 'Luma Dream Machine',
    slug: 'luma-dream-machine',
    tagline: 'High-speed AI video generator with exceptional character and fluid physics',
    description: 'Generates fluid 5-second video sequences from prompts or images with realistic human anatomy, fluid dynamics, and spatial coherence.',
    category: 'VIDEO_MOTION',
    subCategory: 'Real-Time Video',
    pricingType: 'FREEMIUM',
    pricingNote: '30 free generations / month',
    websiteUrl: 'https://lumalabs.ai/dream-machine',
    apiEndpoint: 'https://api.lumalabs.ai/v1/generations',
    isToggledForAI: true,
    rating: 4.7,
    reviewCount: 2100,
    monthlyUsers: '2.8M+',
    verified: true,
    iconName: 'Video',
    badge: 'Fluid Motion',
    tags: ['Fluid Physics', 'Image-to-Video', 'Spatial Consistency', 'Fast Rendering'],
    capabilities: ['Instant Image Animation', 'Natural Fluid Dynamics', 'Character Keyframe Stability'],
    systemPromptAddition: 'When Luma Dream Machine is toggled, emphasize fluid transitions and realistic physical interactions.',
    functionSchema: {
      name: 'luma_animate_image_to_video',
      description: 'Animates a source image into a high-definition moving video clip.',
      parameters: {
        type: 'object',
        properties: {
          imageUrl: { type: 'string', description: 'Source image URL or base64 data' },
          motionPrompt: { type: 'string', description: 'Description of motion to introduce' }
        },
        required: ['imageUrl', 'motionPrompt']
      }
    },
    sampleCall: {
      action: 'Animate static network topology diagram with glowing pulse packets',
      input: { imageUrl: 'https://example.com/topology.png', motionPrompt: 'Data packets glowing and flowing along network links' },
      expectedOutput: 'Rendered 5s loop video with glowing animated data streams.'
    }
  },

  // --- 6. VOICE, AUDIO & MUSIC ---
  {
    id: 'tool-elevenlabs',
    name: 'ElevenLabs Voice Engine',
    slug: 'elevenlabs-voice',
    tagline: 'World-leading AI voice synthesis, voice cloning, and multilingual speech dubbing',
    description: 'Emotionally expressive speech synthesis across 32 languages, instant zero-shot voice cloning, sound effects generation, and real-time Conversational AI.',
    category: 'VOICE_AUDIO',
    subCategory: 'Voice Synthesis & Cloning',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free tier 10,000 chars/mo / Paid plans from $5/mo',
    websiteUrl: 'https://elevenlabs.io',
    apiEndpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 6500,
    monthlyUsers: '12M+',
    verified: true,
    iconName: 'Mic',
    badge: 'Voice Standard #1',
    tags: ['Text-to-Speech', 'Voice Cloning', '32 Languages', 'Sound Effects', 'Low Latency'],
    capabilities: ['Expressive Emotional Modulation', 'Real-time Conversational API (<150ms)', 'Sound Effects Generator', 'Voice Cloning from 1min Audio'],
    systemPromptAddition: 'When ElevenLabs is toggled, format speech output with emotional cadence markers and natural pacing.',
    functionSchema: {
      name: 'elevenlabs_synthesize_speech',
      description: 'Converts text to human-quality audio speech using ElevenLabs voice models.',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'The text script to be spoken' },
          voiceId: { type: 'string', description: 'Target voice identity ID or preset (e.g. 21m00Tcm4TlvDq8ikWAM)' },
          stability: { type: 'string', description: 'Stability level 0.0 to 1.0' }
        },
        required: ['text']
      }
    },
    sampleCall: {
      action: 'Synthesize Audio Announcement for Sovereign Node Deployment',
      input: { text: 'Alert: Sovereign node Frankfurt Core 04 has established encrypted WireGuard tunnel at 120 Gigabits per second.', voiceId: 'Adam_Deep_Tech', stability: '0.75' },
      expectedOutput: 'Audio MP3 stream (24kHz, 128kbps) generated in 280ms.'
    }
  },
  {
    id: 'tool-suno-music',
    name: 'Suno v3.5 Music AI',
    slug: 'suno-ai-music',
    tagline: 'Generate complete 4-minute songs with vocals, instrumentals, and lyrics from any prompt',
    description: 'Produces radio-quality full song compositions across all musical genres with structured verse-chorus arrangements and authentic vocals.',
    category: 'VOICE_AUDIO',
    subCategory: 'Generative Music',
    pricingType: 'FREEMIUM',
    pricingNote: '50 daily free credits / $10/mo Pro',
    websiteUrl: 'https://suno.com',
    apiEndpoint: 'https://api.suno.ai/v1/generate',
    isToggledForAI: true,
    rating: 4.8,
    reviewCount: 4200,
    monthlyUsers: '9M+',
    verified: true,
    iconName: 'Radio',
    badge: 'Music SOTA',
    tags: ['Full Songs', 'Vocals & Lyrics', 'Genre Synthesis', '4-Minute Tracks', 'Instrumentals'],
    capabilities: ['Complete Song Arrangement', 'Multi-genre Fusion', 'Custom Lyric Vocalization', 'Stem Separation Export'],
    systemPromptAddition: 'When Suno AI is toggled, write lyrics with structured metatags [Verse], [Chorus], [Bridge], [Outro].',
    functionSchema: {
      name: 'suno_compose_song',
      description: 'Generates complete musical track with vocals and arrangement based on style prompt and lyrics.',
      parameters: {
        type: 'object',
        properties: {
          style: { type: 'string', description: 'Musical genre, tempo, instruments (e.g., Synthwave Cyberpunk 130BPM)' },
          lyrics: { type: 'string', description: 'Custom lyrics or topic for auto-lyric generation' },
          instrumentalOnly: { type: 'string', description: 'True if no vocals (true/false)' }
        },
        required: ['style']
      }
    },
    sampleCall: {
      action: 'Compose Cyberpunk Synthwave Theme for IIN Network',
      input: { style: 'Dark Synthwave with analog synths and punchy 80s drums, 128 BPM', lyrics: '[Verse]\nEncrypted nodes across the dark\nFiedler values light the spark' },
      expectedOutput: 'Generated 2 full 3:20 WAV song variants with mixed vocals.'
    }
  },

  // --- 7. CRYPTO, SECURITY & AUDITING ---
  {
    id: 'tool-slither-ai',
    name: 'Slither AI Smart Contract Auditor',
    slug: 'slither-ai-audit',
    tagline: 'Static analysis framework & LLM vulnerability detector for Solidity and Vyper',
    description: 'Detects reentrancy, integer overflows, uninitialized storage, access control bugs, and flash loan attack vectors in smart contracts.',
    category: 'SECURITY_CRYPTO',
    subCategory: 'Smart Contract Security',
    pricingType: 'OPEN_SOURCE',
    pricingNote: 'AGPL-3.0 Open Source',
    websiteUrl: 'https://github.com/crytic/slither',
    apiEndpoint: 'http://localhost:8000/api/v1/slither/analyze',
    isToggledForAI: true,
    rating: 4.9,
    reviewCount: 1850,
    monthlyUsers: '450K+',
    verified: true,
    iconName: 'ShieldAlert',
    badge: 'Security Standard',
    tags: ['Solidity', 'Static Analysis', 'Reentrancy Detection', 'Bytecode Disassembly', 'EVM'],
    capabilities: ['Reentrancy Vector Audit', 'Control Flow Graph Generation', 'Gas Optimization Suggestions', 'ERC-20/721 Compliance Check'],
    systemPromptAddition: 'When Slither AI is toggled, always flag severity ratings (CRITICAL, HIGH, MEDIUM, LOW) and provide reentrancy-guard fixes.',
    functionSchema: {
      name: 'slither_audit_smart_contract',
      description: 'Performs static and semantic security audit on Solidity smart contract source code.',
      parameters: {
        type: 'object',
        properties: {
          solidityCode: { type: 'string', description: 'Solidity contract code to audit' },
          solcVersion: { type: 'string', description: 'Target Solidity compiler version (e.g. 0.8.24)' }
        },
        required: ['solidityCode']
      }
    },
    sampleCall: {
      action: 'Audit ERC-20 Staking Pool contract for reentrancy vulnerabilities',
      input: { solidityCode: 'contract StakingPool { function withdraw() external { ... } }', solcVersion: '0.8.20' },
      expectedOutput: 'Identified 1 High severity CEI (Checks-Effects-Interactions) order violation in withdraw().'
    }
  },
  {
    id: 'tool-certik-skynet',
    name: 'CertiK Skynet On-Chain Intelligence',
    slug: 'certik-skynet',
    tagline: 'Real-time Web3 security scoring, smart contract monitoring, and mempool frontrunning detector',
    description: 'Continuous monitoring of on-chain activity, liquidity pool drains, governance proposals, oracle manipulation, and wallet blacklist verification.',
    category: 'SECURITY_CRYPTO',
    subCategory: 'On-Chain Telemetry',
    pricingType: 'FREEMIUM',
    pricingNote: 'Free public scores / Enterprise API',
    websiteUrl: 'https://skynet.certik.com',
    apiEndpoint: 'https://api.certik.com/v1/security-score',
    isToggledForAI: true,
    rating: 4.8,
    reviewCount: 2200,
    monthlyUsers: '1.5M+',
    verified: true,
    iconName: 'ShieldCheck',
    badge: 'Web3 Sentinel',
    tags: ['On-Chain Security', 'Mempool Monitoring', 'Oracle Guard', 'Liquidity Analysis', 'KYC/Audit'],
    capabilities: ['Real-time Security Score (0-100)', 'Flashloan Attack Detection', 'Governance Timelock Tracking', 'Whale Wallet Alerts'],
    systemPromptAddition: 'When CertiK Skynet is toggled, verify contract bytecode hash and token liquidity lock durations.',
    functionSchema: {
      name: 'certik_query_security_score',
      description: 'Fetches on-chain security telemetry and vulnerability scores for any contract address.',
      parameters: {
        type: 'object',
        properties: {
          contractAddress: { type: 'string', description: 'Ethereum or Solana smart contract address' },
          chainId: { type: 'string', description: 'Chain ID (1 for ETH, 56 for BSC, 137 for Polygon)' }
        },
        required: ['contractAddress']
      }
    },
    sampleCall: {
      action: 'Fetch security telemetry for Uniswap V3 Factory contract',
      input: { contractAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984', chainId: '1' },
      expectedOutput: 'Security Score: 96/100 (AAA). Zero active exploits. 100% formal verification passed.'
    }
  }
];

export const AI_TOOL_CATEGORIES_CONFIG = [
  { id: 'ALL', name: 'All Scraped Tools', count: SCRAPED_AI_TOP_TOOLS_CATALOG.length },
  { id: 'CODE_DEV', name: 'Code & Dev IDEs', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'CODE_DEV').length },
  { id: 'LLM_REASONING', name: 'LLMs & Reasoning', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'LLM_REASONING').length },
  { id: 'AGENTS_AUTOMATION', name: 'Agents & Automation', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'AGENTS_AUTOMATION').length },
  { id: 'IMAGE_DESIGN_3D', name: 'Image, Design & 3D', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'IMAGE_DESIGN_3D').length },
  { id: 'VIDEO_MOTION', name: 'Video & Animation', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'VIDEO_MOTION').length },
  { id: 'VOICE_AUDIO', name: 'Voice, Audio & Music', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'VOICE_AUDIO').length },
  { id: 'SECURITY_CRYPTO', name: 'Security & Web3 AI', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'SECURITY_CRYPTO').length },
  { id: 'PRODUCTIVITY_WRITING', name: 'Research & Search', count: SCRAPED_AI_TOP_TOOLS_CATALOG.filter(t => t.category === 'PRODUCTIVITY_WRITING').length }
];
