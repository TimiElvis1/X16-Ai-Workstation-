export type AIToolPricing = 'FREE' | 'FREEMIUM' | 'PAID' | 'OPEN_SOURCE' | 'API_SUBSCRIPTION';

export type AIToolCategory =
  | 'CODE_DEV'
  | 'LLM_REASONING'
  | 'AGENTS_AUTOMATION'
  | 'IMAGE_DESIGN_3D'
  | 'VIDEO_MOTION'
  | 'VOICE_AUDIO'
  | 'PRODUCTIVITY_WRITING'
  | 'SECURITY_CRYPTO'
  | 'VISION_MULTIMODAL';

export interface AIToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface AIToolItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: AIToolCategory;
  subCategory: string;
  pricingType: AIToolPricing;
  pricingNote: string;
  websiteUrl: string;
  apiEndpoint?: string;
  isToggledForAI: boolean;
  rating: number;
  reviewCount: number;
  monthlyUsers: string;
  verified: boolean;
  iconName: string;
  badge: string;
  tags: string[];
  capabilities: string[];
  systemPromptAddition: string;
  functionSchema: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
        enum?: string[];
      }>;
      required: string[];
    };
  };
  sampleCall: {
    action: string;
    input: Record<string, any>;
    expectedOutput: string;
  };
}

export interface ScrapeJobStatus {
  sourceUrl: string;
  status: 'IDLE' | 'PARSING' | 'COMPLETED' | 'ERROR';
  scrapedCount: number;
  categoriesFound: string[];
  timestamp: string;
  rawPayloadSnippet?: string;
}
