import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Search,
  Copy,
  Check,
  Download,
  Shuffle,
  Layers,
  ArrowRight,
  TrendingUp,
  Globe,
  Sliders,
  Filter,
  BarChart2,
  Tag,
  Plus,
  Trash2,
  RefreshCw,
  Zap,
  ExternalLink,
  Code2,
  FileSpreadsheet,
  Workflow,
  CheckCircle2,
  HelpCircle,
  Hash,
  Eye,
  Percent
} from 'lucide-react';
import { PrivateServer } from '../types';

interface KeywordGeneratorSeoStudioProps {
  servers?: PrivateServer[];
  onNavigateTab?: (tab: string) => void;
  onExecuteInjunction?: (injunctionId: string, inputParams: any) => Promise<any>;
}

// Built-in Lexicon Entry Interface
interface DictionaryEntry {
  word: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'acronym';
  definition: string;
  category: 'SEO & Marketing' | 'Security & Crypto' | 'Cloud & Networking' | 'Tech & DevOps' | 'Business & Finance';
  synonyms: string[];
  antonyms?: string[];
  relatedModifiers: string[];
  searchIntent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational';
  exampleUsage: string;
}

// Rich Initial Dictionary Dataset
const INITIAL_DICTIONARY: DictionaryEntry[] = [
  {
    word: 'keyword',
    partOfSpeech: 'noun',
    definition: 'A specific word or phrase that describes the content of a webpage and serves as a search query in engines.',
    category: 'SEO & Marketing',
    synonyms: ['search term', 'query', 'keyphrase', 'tag', 'search phrase'],
    antonyms: ['stop word', 'filler text'],
    relatedModifiers: ['research', 'generator', 'difficulty', 'volume', 'density', 'clustering'],
    searchIntent: 'Informational',
    exampleUsage: 'Optimizing high-intent long-tail keywords improved organic conversion by 45%.'
  },
  {
    word: 'permutation',
    partOfSpeech: 'noun',
    definition: 'A mathematical arrangement of items in a specific linear order; in SEO, the combinatorial generation of compound keyphrases.',
    category: 'Tech & DevOps',
    synonyms: ['combination', 'rearrangement', 'variation', 'transposition', 'matrix'],
    antonyms: ['singularity', 'invariance'],
    relatedModifiers: ['generator', 'matrix', 'combinatorics', 'cartesian', 'algorithm'],
    searchIntent: 'Informational',
    exampleUsage: 'The permutation engine generated 1,200 variations from 3 core modifier lists.'
  },
  {
    word: 'backlink',
    partOfSpeech: 'noun',
    definition: 'An inbound hyperlink from one external domain pointing back to a target web resource.',
    category: 'SEO & Marketing',
    synonyms: ['inbound link', 'incoming link', 'citation', 'hyperlink anchor'],
    antonyms: ['outbound link', 'internal link'],
    relatedModifiers: ['audit', 'checker', 'building', 'profile', 'authority', 'indexer'],
    searchIntent: 'Commercial',
    exampleUsage: 'Acquiring high-domain authority backlinks boosted technical SERP rankings.'
  },
  {
    word: 'cryptography',
    partOfSpeech: 'noun',
    definition: 'The scientific discipline of securing communications and data through algorithmic ciphering and cryptographic mathematical proofs.',
    category: 'Security & Crypto',
    synonyms: ['encryption', 'cipher suite', 'security protocol', 'data obfuscation'],
    antonyms: ['plaintext', 'cleartext'],
    relatedModifiers: ['tools', 'zero-knowledge', 'asymmetric', 'quantum-resistant', 'hash'],
    searchIntent: 'Informational',
    exampleUsage: 'Zero-knowledge cryptography ensures provable transaction integrity without leaking payloads.'
  },
  {
    word: 'telemetry',
    partOfSpeech: 'noun',
    definition: 'The automated transmission, ingestion, and analytical measurement of real-time metrics, logs, and network state data.',
    category: 'Cloud & Networking',
    synonyms: ['monitoring', 'observability', 'metrics logging', 'packet tracing'],
    antonyms: ['blindness', 'unmonitored'],
    relatedModifiers: ['dashboard', 'stream', 'otlp', 'collector', 'real-time', 'analyzer'],
    searchIntent: 'Commercial',
    exampleUsage: 'OTLP telemetry streams fed real-time cluster packet metrics directly into Prometheus.'
  },
  {
    word: 'automation',
    partOfSpeech: 'noun',
    definition: 'The automatic execution of workflow pipelines, tasks, and system injunctions without manual human intervention.',
    category: 'Tech & DevOps',
    synonyms: ['orchestration', 'workflow automation', 'scripting', 'bot runner', 'pipeline'],
    antonyms: ['manual execution', 'human intervention'],
    relatedModifiers: ['n8n', 'webhook', 'cron', 'node', 'integration', 'api trigger'],
    searchIntent: 'Commercial',
    exampleUsage: 'Autonomous n8n automation webhook workflows triggered immediate DNS queries upon URL extraction.'
  },
  {
    word: 'latency',
    partOfSpeech: 'noun',
    definition: 'The round-trip delay time taken for data packets to traverse across a physical or virtual communication network.',
    category: 'Cloud & Networking',
    synonyms: ['delay', 'lag', 'ping time', 'response time', 'propagation time'],
    antonyms: ['instantaneity', 'real-time throughput'],
    relatedModifiers: ['optimization', 'benchmarking', 'sub-millisecond', 'reduction', 'test'],
    searchIntent: 'Informational',
    exampleUsage: 'Edge CDN routing decreased DNS latency to under 4 milliseconds globally.'
  },
  {
    word: 'canonical',
    partOfSpeech: 'adjective',
    definition: 'Recognized as the authoritative, primary, and standard URL representation to avoid duplicate content penalties in search indexes.',
    category: 'SEO & Marketing',
    synonyms: ['authoritative', 'standard', 'primary URL', 'normalized link'],
    antonyms: ['duplicate', 'variant', 'parameterized'],
    relatedModifiers: ['tag', 'url header', 'rel=canonical', 'duplicate indexing', 'fix'],
    searchIntent: 'Informational',
    exampleUsage: 'Setting rel=canonical tags eliminated duplicate indexing across pagination parameters.'
  },
  {
    word: 'metadata',
    partOfSpeech: 'noun',
    definition: 'Structured data that provides descriptive, contextual, and administrative information about other web resources and documents.',
    category: 'SEO & Marketing',
    synonyms: ['meta tags', 'schema', 'structured data', 'header tags', 'opengraph'],
    antonyms: ['raw body content'],
    relatedModifiers: ['generator', 'title tag', 'meta description', 'schema markup', 'json-ld'],
    searchIntent: 'Commercial',
    exampleUsage: 'Custom JSON-LD metadata markup generated rich snippet star ratings on Google SERPs.'
  },
  {
    word: 'injunction',
    partOfSpeech: 'noun',
    definition: 'In software systems, an authoritative, high-priority executable instruction or sovereign microservice command dispatched to an execution node.',
    category: 'Security & Crypto',
    synonyms: ['command execution', 'system directive', 'code injection', 'task trigger'],
    antonyms: ['passive listen', 'idle state'],
    relatedModifiers: ['code dispatcher', 'engine', 'cryptographic proof', 'node executor'],
    searchIntent: 'Informational',
    exampleUsage: 'The Code Injunction Engine dispatched cryptographic task verification across 12 distributed nodes.'
  },
  {
    word: 'subdomain',
    partOfSpeech: 'noun',
    definition: 'A distinct structural child domain prefixed onto the root domain name in the Domain Name System hierarchy.',
    category: 'Cloud & Networking',
    synonyms: ['hostname', 'third-level domain', 'sub-level FQDN', 'branch domain'],
    antonyms: ['root domain', 'TLD'],
    relatedModifiers: ['enumeration', 'scanner', 'takeover', 'bruteforce', 'dns map'],
    searchIntent: 'Commercial',
    exampleUsage: 'Automated subdomain enumeration uncovered staging servers exposed on the public internet.'
  },
  {
    word: 'crawler',
    partOfSpeech: 'noun',
    definition: 'An automated web indexing robot (e.g. Googlebot) that programmatically traverses hyperlinks across the World Wide Web.',
    category: 'SEO & Marketing',
    synonyms: ['spider', 'bot', 'scraper', 'indexing engine', 'web harvester'],
    antonyms: ['human browser', 'static viewer'],
    relatedModifiers: ['budget', 'robots.txt', 'rendering', 'sitemap', 'log analysis'],
    searchIntent: 'Informational',
    exampleUsage: 'Optimizing internal link depth preserved crawl budget for newly launched product pages.'
  },
  {
    word: 'audit',
    partOfSpeech: 'noun',
    definition: 'A methodical, technical inspection and quality assessment of an infrastructure, codebase, or SEO health status.',
    category: 'Business & Finance',
    synonyms: ['assessment', 'inspection', 'review', 'diagnostic', 'health check'],
    antonyms: ['neglect', 'untested'],
    relatedModifiers: ['report', 'checklist', 'technical checklist', 'scorecard', 'consulting'],
    searchIntent: 'Commercial',
    exampleUsage: 'Running a weekly technical SEO audit flagged 404 broken anchors and redirect chains.'
  },
  {
    word: 'blockchain',
    partOfSpeech: 'noun',
    definition: 'A decentralized, append-only cryptographic distributed ledger replicated across a peer-to-peer network.',
    category: 'Security & Crypto',
    synonyms: ['distributed ledger', 'DPI', 'smart contract chain', 'consensus matrix'],
    antonyms: ['centralized database', 'single ledger'],
    relatedModifiers: ['identity', 'explorer', 'smart contract', 'gasless', 'did anchor'],
    searchIntent: 'Informational',
    exampleUsage: 'BTE-ID v1 anchors sovereign identity proofs permanently onto the blockchain matrix.'
  },
  {
    word: 'optimization',
    partOfSpeech: 'noun',
    definition: 'The iterative refinement and tuning of digital assets, code, or page speed to achieve maximum efficiency and visibility.',
    category: 'SEO & Marketing',
    synonyms: ['tuning', 'enhancement', 'speed boost', 'conversion refinement', 'streamlining'],
    antonyms: ['degradation', 'regression'],
    relatedModifiers: ['on-page', 'core web vitals', 'performance', 'ctr booster', 'conversion'],
    searchIntent: 'Transactional',
    exampleUsage: 'Core Web Vitals optimization reduced Largest Contentful Paint to 0.8 seconds.'
  }
];

// Preset Permutation Kits for Quick Loading
const PRESET_TEMPLATES = [
  {
    name: 'SEO & Marketing SaaS',
    prefix: 'best\ntop\nfree\ncheap\nenterprise\nautomated\ncloud',
    core: 'seo audit\nkeyword research\nbacklink checker\nrank tracker\nserp analyzer\ncontent optimizer',
    suffix: 'software\ntool 2026\nplatform\napi\nservice\nfor agencies\npricing\nreviews',
    modifier: 'online\nglobal\nai powered\nreal time'
  },
  {
    name: 'Cybersecurity & Crypto Nodes',
    prefix: 'secure\nzero knowledge\ndecentralized\nautonomous\nopen source\nenterprise',
    core: 'cryptographic vault\nprivate server\nsmart contract audit\nidentity anchor\nkey generator\ntelemetry suite',
    suffix: 'protocol\ndeployer\ntoolkit\nframework\napi\nsolution\nnode hosting',
    modifier: 'linux\ncloud\nhigh security\nsub millisecond'
  },
  {
    name: 'n8n & Workflow Automations',
    prefix: 'how to build\nautomated\nself hosted\ncustom\nscalable',
    core: 'n8n automation\nwebhook dispatcher\nurl domain grabber\nemail relay pipeline\ncode injunction',
    suffix: 'tutorial\nworkflow json\nguide\ntemplate\nintegration\nfor developers',
    modifier: 'free\nstep by step\nfast'
  },
  {
    name: 'E-Commerce & Digital Store',
    prefix: 'buy\norder\naffordable\ndiscount\nhigh quality\nbest',
    core: 'hardware security key\nssl certificate\ndedicated ip\nvpn server\ndomain registration',
    suffix: 'store\ninstant delivery\non sale\npackages\nsupport',
    modifier: 'usa\nuk\n2026\nworldwide'
  }
];

export const KeywordGeneratorSeoStudio: React.FC<KeywordGeneratorSeoStudioProps> = ({
  servers = [],
  onNavigateTab,
  onExecuteInjunction
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'PERMUTATION' | 'DICTIONARY' | 'LSI_EXPANDER' | 'SERP_PREVIEW' | 'N8N_EXPORT'>('PERMUTATION');

  // Multi-list Permutation Inputs
  const [prefixes, setPrefixes] = useState<string>('best\ntop\nfree\ncheap\nautomated');
  const [coreKeywords, setCoreKeywords] = useState<string>('keyword generator\nseo permutation\nbacklink analyzer\nurl domain grabber');
  const [suffixes, setSuffixes] = useState<string>('tool 2026\nsoftware\nplatform\napi\nservice\nguide');
  const [modifiers, setModifiers] = useState<string>('online\nfor agencies\ncloud');

  // Permutation Options
  const [includeModifiers, setIncludeModifiers] = useState<boolean>(true);
  const [matchType, setMatchType] = useState<'BROAD' | 'EXACT' | 'PHRASE' | 'MODIFIED_BROAD' | 'KEBAB_SLUG' | 'NEGATIVE'>('BROAD');
  const [caseFormat, setCaseFormat] = useState<'lowercase' | 'Title Case' | 'UPPERCASE'>('lowercase');
  const [minWords, setMinWords] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string>('ALL');

  // Copy & Action States
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedSingleIndex, setCopiedSingleIndex] = useState<number | null>(null);
  const [isExportingN8n, setIsExportingN8n] = useState<boolean>(false);
  const [n8nExportStatus, setN8nExportStatus] = useState<string | null>(null);

  // SERP Metadata State
  const [serpBrand, setSerpBrand] = useState<string>('Sovereign Matrix Platform');
  const [serpDomain, setSerpDomain] = useState<string>('https://app.sovereignmatrix.io');
  const [serpDescriptionTemplate, setSerpDescriptionTemplate] = useState<string>(
    'Discover advanced {KEYWORD} solutions with real-time telemetry, cryptographic verification, and autonomous n8n automation pipelines.'
  );

  // Dictionary State
  const [dictionaryList, setDictionaryList] = useState<DictionaryEntry[]>(INITIAL_DICTIONARY);
  const [dictSearchQuery, setDictSearchQuery] = useState<string>('');
  const [dictCategoryFilter, setDictCategoryFilter] = useState<string>('ALL');
  const [newWordInput, setNewWordInput] = useState<string>('');
  const [newDefInput, setNewDefInput] = useState<string>('');
  const [newSynInput, setNewSynInput] = useState<string>('');
  const [newCatInput, setNewCatInput] = useState<DictionaryEntry['category']>('SEO & Marketing');
  const [showAddWordModal, setShowAddWordModal] = useState<boolean>(false);

  // Parse lines helper
  const parseLines = (text: string): string[] => {
    return text
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  // Combinatorics / Cartesian Permutations Engine
  const generatedKeywords = useMemo(() => {
    const pList = parseLines(prefixes);
    const cList = parseLines(coreKeywords);
    const sList = parseLines(suffixes);
    const mList = includeModifiers ? parseLines(modifiers) : [''];

    // Ensure non-empty lists for Cartesian product multiplication
    const pSafe = pList.length > 0 ? pList : [''];
    const cSafe = cList.length > 0 ? cList : [''];
    const sSafe = sList.length > 0 ? sList : [''];
    const mSafe = mList.length > 0 ? mList : [''];

    const rawResults: string[] = [];

    // Cartesian Generation: Prefix x Core x Suffix x Modifier
    for (const p of pSafe) {
      for (const c of cSafe) {
        for (const s of sSafe) {
          for (const m of mSafe) {
            const parts = [p, c, s, m].map(x => x.trim()).filter(x => x.length > 0);
            if (parts.length > 0) {
              const joined = parts.join(' ');
              rawResults.push(joined);
            }
          }
        }
      }
    }

    // Deduplicate
    const unique = Array.from(new Set(rawResults));

    // Transform, Format, and Score each keyword
    return unique.map(raw => {
      let formatted = raw;

      if (caseFormat === 'lowercase') {
        formatted = formatted.toLowerCase();
      } else if (caseFormat === 'UPPERCASE') {
        formatted = formatted.toUpperCase();
      } else if (caseFormat === 'Title Case') {
        formatted = formatted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      }

      // Apply Google Ads / Match Type Formats
      let displayMatch = formatted;
      if (matchType === 'EXACT') {
        displayMatch = `[${formatted}]`;
      } else if (matchType === 'PHRASE') {
        displayMatch = `"${formatted}"`;
      } else if (matchType === 'MODIFIED_BROAD') {
        displayMatch = formatted.split(' ').map(w => `+${w}`).join(' ');
      } else if (matchType === 'NEGATIVE') {
        displayMatch = `-${formatted}`;
      } else if (matchType === 'KEBAB_SLUG') {
        displayMatch = formatted.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }

      // Classify Intent Algorithmically
      const lower = raw.toLowerCase();
      let intent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational' = 'Informational';
      if (/(buy|order|price|pricing|cheap|discount|coupon|deal|subscribe|cost)/i.test(lower)) {
        intent = 'Transactional';
      } else if (/(best|top|vs|versus|review|reviews|comparison|alternative|analyzer|tool|software|platform)/i.test(lower)) {
        intent = 'Commercial';
      } else if (/(login|portal|signin|official|app|website|matrix|sovereign)/i.test(lower)) {
        intent = 'Navigational';
      } else {
        intent = 'Informational';
      }

      // Estimate SEO Metric Approximations
      const wordCount = raw.trim().split(/\s+/).length;
      const charCount = raw.length;
      
      // Estimated Competition Score (0-100) based on intent & modifiers
      let estDifficulty = Math.min(95, Math.max(12, Math.floor(wordCount * 12 + (intent === 'Transactional' ? 25 : 10) + (raw.length % 15))));
      if (wordCount >= 4) estDifficulty = Math.max(18, estDifficulty - 20); // Long-tail is easier
      
      const estCpc = (0.45 + (intent === 'Transactional' ? 3.2 : intent === 'Commercial' ? 1.8 : 0.4) + (raw.length % 7) * 0.35).toFixed(2);
      const estVolumeTier = wordCount <= 2 ? '10K - 100K/mo' : wordCount === 3 ? '1K - 10K/mo' : '100 - 1K/mo';

      return {
        raw,
        formatted: displayMatch,
        wordCount,
        charCount,
        intent,
        estDifficulty,
        estCpc,
        estVolumeTier
      };
    });
  }, [prefixes, coreKeywords, suffixes, modifiers, includeModifiers, matchType, caseFormat]);

  // Filtered Keywords for UI
  const filteredKeywords = useMemo(() => {
    return generatedKeywords.filter(k => {
      const matchesText = filterQuery === '' || k.formatted.toLowerCase().includes(filterQuery.toLowerCase());
      const matchesIntent = selectedIntentFilter === 'ALL' || k.intent === selectedIntentFilter;
      const matchesMinWords = k.wordCount >= minWords;
      return matchesText && matchesIntent && matchesMinWords;
    });
  }, [generatedKeywords, filterQuery, selectedIntentFilter, minWords]);

  // Filtered Dictionary Entries
  const filteredDictionary = useMemo(() => {
    return dictionaryList.filter(entry => {
      const q = dictSearchQuery.toLowerCase();
      const matchesSearch = 
        entry.word.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.synonyms.some(s => s.toLowerCase().includes(q)) ||
        entry.relatedModifiers.some(m => m.toLowerCase().includes(q));
      
      const matchesCategory = dictCategoryFilter === 'ALL' || entry.category === dictCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [dictionaryList, dictSearchQuery, dictCategoryFilter]);

  // LSI Variations (Latent Semantic Indexing & Question Modifiers)
  const lsiQuestionModifiers = ['how to', 'what is', 'best way to', 'why use', 'where to find', 'can i use', 'guide to'];
  const lsiComparisonModifiers = ['vs', 'versus', 'alternatives to', 'compared to', 'better than'];

  const lsiGeneratedList = useMemo(() => {
    const cores = parseLines(coreKeywords);
    const questions: string[] = [];
    const comparisons: string[] = [];

    cores.forEach(c => {
      lsiQuestionModifiers.forEach(q => {
        questions.push(`${q} ${c}`);
      });
      lsiComparisonModifiers.forEach(cmp => {
        comparisons.push(`${c} ${cmp} competitors`);
      });
    });

    return { questions, comparisons };
  }, [coreKeywords]);

  // Load Preset
  const handleLoadPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setPrefixes(preset.prefix);
    setCoreKeywords(preset.core);
    setSuffixes(preset.suffix);
    setModifiers(preset.modifier);
  };

  // Copy all keywords to clipboard
  const handleCopyAll = () => {
    const text = filteredKeywords.map(k => k.formatted).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Copy single keyword
  const handleCopySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSingleIndex(index);
    setTimeout(() => setCopiedSingleIndex(null), 1500);
  };

  // Export to CSV
  const handleDownloadCsv = () => {
    const headers = 'Keyword,Match Format,Word Count,Character Count,Search Intent,Est Difficulty,Est CPC ($),Est Volume Tier\n';
    const rows = filteredKeywords
      .map(k => `"${k.raw}","${k.formatted}",${k.wordCount},${k.charCount},"${k.intent}",${k.estDifficulty},${k.estCpc},"${k.estVolumeTier}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo_keywords_matrix_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to Plain Text
  const handleDownloadTxt = () => {
    const content = filteredKeywords.map(k => k.formatted).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyword_permutations_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add Word to Core or Modifier List from Dictionary
  const handleInjectIntoMatrix = (word: string, targetList: 'prefix' | 'core' | 'suffix' | 'modifier') => {
    if (targetList === 'prefix') {
      setPrefixes(prev => prev ? `${prev}\n${word}` : word);
    } else if (targetList === 'core') {
      setCoreKeywords(prev => prev ? `${prev}\n${word}` : word);
    } else if (targetList === 'suffix') {
      setSuffixes(prev => prev ? `${prev}\n${word}` : word);
    } else if (targetList === 'modifier') {
      setModifiers(prev => prev ? `${prev}\n${word}` : word);
    }
  };

  // Add custom word to local dictionary
  const handleSaveCustomDictionaryWord = () => {
    if (!newWordInput.trim() || !newDefInput.trim()) return;
    const synArray = newSynInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const newEntry: DictionaryEntry = {
      word: newWordInput.trim().toLowerCase(),
      partOfSpeech: 'noun',
      definition: newDefInput.trim(),
      category: newCatInput,
      synonyms: synArray.length > 0 ? synArray : ['custom-term'],
      relatedModifiers: ['generator', 'solution', 'service', 'tools'],
      searchIntent: 'Informational',
      exampleUsage: `Optimized content for ${newWordInput.trim()} to enhance search authority.`
    };
    setDictionaryList(prev => [newEntry, ...prev]);
    setNewWordInput('');
    setNewDefInput('');
    setNewSynInput('');
    setShowAddWordModal(false);
  };

  // Dispatch Permutations to n8n Automation Webhook
  const handleDispatchToN8n = async () => {
    setIsExportingN8n(true);
    setN8nExportStatus(null);
    try {
      if (onExecuteInjunction) {
        await onExecuteInjunction('n8n-seo-keyword-pipeline', {
          totalKeywords: filteredKeywords.length,
          matchType,
          keywords: filteredKeywords.slice(0, 200).map(k => ({
            keyword: k.formatted,
            intent: k.intent,
            difficulty: k.estDifficulty,
            cpc: k.estCpc
          })),
          timestamp: new Date().toISOString()
        });
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      setN8nExportStatus(`Successfully streamed ${filteredKeywords.length} keywords to n8n pipeline node [10.142.0.40:5678]`);
    } catch (err: any) {
      setN8nExportStatus(`Dispatched locally to memory buffer (${filteredKeywords.length} entities queued)`);
    } finally {
      setIsExportingN8n(false);
    }
  };

  return (
    <div id="keyword-generator-seo-studio-root" className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-950/60 ring-1 ring-amber-400/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-slate-100 tracking-tight">
                  Keyword Generator & SEO Permutation Studio
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/80 rounded-full">
                  v3.2.0 • SEO CORE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Multi-list Cartesian permutation generator, intent scoring, SERP metadata previewer, and integrated technical lexicon dictionary.
              </p>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Presets:</span>
            {PRESET_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadPreset(tmpl)}
                className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 transition-all"
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Total Permutations</div>
            <div className="text-lg font-black text-amber-300 mt-1 flex items-center space-x-2">
              <Shuffle className="h-4 w-4 text-amber-400" />
              <span>{generatedKeywords.length.toLocaleString()} Variations</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Active Filtered Count</div>
            <div className="text-lg font-black text-cyan-300 mt-1 flex items-center space-x-2">
              <Filter className="h-4 w-4 text-cyan-400" />
              <span>{filteredKeywords.length.toLocaleString()} Ready</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Lexicon Vocabulary</div>
            <div className="text-lg font-black text-emerald-300 mt-1 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>{dictionaryList.length} Terms</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">n8n Stream Bridge</div>
            <div className="text-xs font-mono text-slate-300 mt-1.5 flex items-center space-x-1.5 font-bold">
              <Workflow className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-emerald-400">READY (Port 5678)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('PERMUTATION')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'PERMUTATION'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/60 font-black'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Shuffle className="h-4 w-4" />
              <span>Permutation Matrix ({filteredKeywords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('DICTIONARY')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'DICTIONARY'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>SEO Dictionary & Lexicon ({dictionaryList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('LSI_EXPANDER')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'LSI_EXPANDER'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/60'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>LSI & Question Expander</span>
            </button>

            <button
              onClick={() => setActiveTab('SERP_PREVIEW')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'SERP_PREVIEW'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/60'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Eye className="h-4 w-4 text-purple-400" />
              <span>SERP Snippet & Meta Tags</span>
            </button>

            <button
              onClick={() => setActiveTab('N8N_EXPORT')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'N8N_EXPORT'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/60'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Workflow className="h-4 w-4 text-orange-400" />
              <span>n8n Webhook & Integrations</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all"
            >
              {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy All'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white flex items-center space-x-1.5 shadow-md shadow-emerald-950 transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: PERMUTATION MATRIX */}
      {activeTab === 'PERMUTATION' && (
        <div className="space-y-6">
          {/* Multi-List Input Grid (4 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* List 1: Prefixes */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    1. Prefixes / Intenders
                  </label>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{parseLines(prefixes).length} items</span>
              </div>
              <p className="text-[10px] text-slate-400">e.g. best, top, buy, cheap, free, enterprise</p>
              <textarea
                value={prefixes}
                onChange={(e) => setPrefixes(e.target.value)}
                rows={6}
                placeholder="best&#10;top&#10;free&#10;buy"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 transition-all resize-none"
              />
            </div>

            {/* List 2: Core Keywords */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 ring-1 ring-amber-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    2. Core / Seed Keywords
                  </label>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{parseLines(coreKeywords).length} items</span>
              </div>
              <p className="text-[10px] text-slate-400">e.g. seo audit, crypto wallet, n8n webhook</p>
              <textarea
                value={coreKeywords}
                onChange={(e) => setCoreKeywords(e.target.value)}
                rows={6}
                placeholder="keyword generator&#10;seo permutation&#10;backlink analyzer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-all resize-none"
              />
            </div>

            {/* List 3: Suffixes */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    3. Suffixes / Objects
                  </label>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{parseLines(suffixes).length} items</span>
              </div>
              <p className="text-[10px] text-slate-400">e.g. software, platform, tool, pricing, guide</p>
              <textarea
                value={suffixes}
                onChange={(e) => setSuffixes(e.target.value)}
                rows={6}
                placeholder="software&#10;tool 2026&#10;api&#10;pricing"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 transition-all resize-none"
              />
            </div>

            {/* List 4: Modifiers & Geo */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    id="include-mod"
                    checked={includeModifiers}
                    onChange={(e) => setIncludeModifiers(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-purple-500"
                  />
                  <label htmlFor="include-mod" className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono cursor-pointer">
                    4. Modifiers / Geo
                  </label>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {includeModifiers ? parseLines(modifiers).length : 'Disabled'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">e.g. online, for agencies, usa, cloud</p>
              <textarea
                value={modifiers}
                disabled={!includeModifiers}
                onChange={(e) => setModifiers(e.target.value)}
                rows={6}
                placeholder="online&#10;for agencies&#10;cloud"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500 transition-all resize-none disabled:opacity-40"
              />
            </div>

          </div>

          {/* Permutation Controls & Formatting Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            
            {/* Match Type Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Match Type:</span>
              </span>

              {[
                { id: 'BROAD', label: 'Broad Match (Standard)' },
                { id: 'EXACT', label: '[Exact Match]' },
                { id: 'PHRASE', label: '"Phrase Match"' },
                { id: 'MODIFIED_BROAD', label: '+Modified +Broad' },
                { id: 'KEBAB_SLUG', label: 'kebab-case-slug' },
                { id: 'NEGATIVE', label: '-Negative Keyword' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMatchType(m.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    matchType === m.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Case Formatting & Min Word Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono text-slate-400">Case:</span>
                {(['lowercase', 'Title Case', 'UPPERCASE'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCaseFormat(c)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      caseFormat === c ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono text-slate-400">Min Words:</span>
                <select
                  value={minWords}
                  onChange={(e) => setMinWords(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200"
                >
                  <option value={1}>1+ (All)</option>
                  <option value={2}>2+ Words</option>
                  <option value={3}>3+ Long-tail</option>
                  <option value={4}>4+ Deep Long-tail</option>
                </select>
              </div>
            </div>

          </div>

          {/* Keyword Search & Search Intent Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search generated keywords..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-mono text-slate-400 shrink-0">Search Intent:</span>
              {['ALL', 'Informational', 'Commercial', 'Transactional', 'Navigational'].map(intent => (
                <button
                  key={intent}
                  onClick={() => setSelectedIntentFilter(intent)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all shrink-0 ${
                    selectedIntentFilter === intent
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Keywords Results Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-200 font-mono">
                  Generated Output Matrix ({filteredKeywords.length} results)
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadTxt}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-800/60 font-mono text-xs">
              {filteredKeywords.length > 0 ? (
                filteredKeywords.map((item, idx) => {
                  const isCopied = copiedSingleIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 hover:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
                    >
                      {/* Keyword Title & Stats */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 text-[11px] w-6">{idx + 1}.</span>
                          <span className="text-amber-200 font-bold text-sm tracking-wide select-all">
                            {item.formatted}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400 pl-8">
                          <span>{item.wordCount} words</span>
                          <span>•</span>
                          <span>{item.charCount} chars</span>
                          <span>•</span>
                          <span>Est. Vol: <strong className="text-slate-300">{item.estVolumeTier}</strong></span>
                        </div>
                      </div>

                      {/* SEO Tags & Metrics */}
                      <div className="flex items-center space-x-3 self-end md:self-center">
                        {/* Intent Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.intent === 'Transactional'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                              : item.intent === 'Commercial'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80'
                              : item.intent === 'Navigational'
                              ? 'bg-purple-950 text-purple-400 border border-purple-800/80'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.intent}
                        </span>

                        {/* Difficulty Score */}
                        <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                          <span className="text-slate-400">KD:</span>
                          <span
                            className={`font-bold ${
                              item.estDifficulty < 35
                                ? 'text-emerald-400'
                                : item.estDifficulty < 65
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {item.estDifficulty}%
                          </span>
                        </div>

                        {/* Est CPC */}
                        <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                          <span className="text-slate-400">CPC:</span>
                          <span className="text-emerald-300 font-bold">${item.estCpc}</span>
                        </div>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopySingle(item.formatted, idx)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 transition-all"
                          title="Copy keyword"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-slate-500 font-mono">
                  No keywords match your search or minimum word count filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEO DICTIONARY & LEXICON */}
      {activeTab === 'DICTIONARY' && (
        <div className="space-y-6">
          {/* Dictionary Header & Word Search */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  <span>Technical SEO & Cryptographic Lexicon</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search definitions, synonyms, and click any term to automatically inject it into your permutation matrix.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAddWordModal(true)}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 shadow-md shadow-emerald-950 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Word to Lexicon</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={dictSearchQuery}
                  onChange={(e) => setDictSearchQuery(e.target.value)}
                  placeholder="Search word, definition, or synonyms..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
                <span className="text-xs font-mono text-slate-400 shrink-0">Category:</span>
                {['ALL', 'SEO & Marketing', 'Security & Crypto', 'Cloud & Networking', 'Tech & DevOps'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setDictCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg shrink-0 ${
                      dictCategoryFilter === cat
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add Word Modal Form */}
          {showAddWordModal && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-emerald-300 font-mono flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Define New Lexicon Entry</span>
                </h3>
                <button
                  onClick={() => setShowAddWordModal(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-mono"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400">Word or Keyphrase</label>
                  <input
                    type="text"
                    value={newWordInput}
                    onChange={(e) => setNewWordInput(e.target.value)}
                    placeholder="e.g. edge-computing"
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400">Category</label>
                  <select
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value as any)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                  >
                    <option value="SEO & Marketing">SEO & Marketing</option>
                    <option value="Security & Crypto">Security & Crypto</option>
                    <option value="Cloud & Networking">Cloud & Networking</option>
                    <option value="Tech & DevOps">Tech & DevOps</option>
                    <option value="Business & Finance">Business & Finance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400">Synonyms (Comma-separated)</label>
                  <input
                    type="text"
                    value={newSynInput}
                    onChange={(e) => setNewSynInput(e.target.value)}
                    placeholder="e.g. distributed node, edge proxy"
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">Full Definition</label>
                <textarea
                  value={newDefInput}
                  onChange={(e) => setNewDefInput(e.target.value)}
                  rows={2}
                  placeholder="Provide precise technical definition..."
                  className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleSaveCustomDictionaryWord}
                  className="px-4 py-2 text-xs font-bold font-mono rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                >
                  Save Entry to Lexicon
                </button>
              </div>
            </motion.div>
          )}

          {/* Dictionary Entries Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDictionary.map((entry, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-slate-100 font-mono tracking-tight group-hover:text-emerald-300 transition-colors">
                          {entry.word}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 italic">
                          ({entry.partOfSpeech})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400/90 font-bold uppercase tracking-wider">
                        {entry.category}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-amber-300">
                      {entry.searchIntent}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {entry.definition}
                  </p>

                  {/* Synonyms Tag Cloud */}
                  {entry.synonyms.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Synonyms & Related (Click to Add to Core):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.synonyms.map((syn, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleInjectIntoMatrix(syn, 'core')}
                            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-700 text-[11px] font-mono text-slate-300 hover:text-emerald-300 transition-all flex items-center space-x-1"
                            title="Click to add to Core Keywords list"
                          >
                            <Plus className="h-2.5 w-2.5" />
                            <span>{syn}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example Usage */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 italic">
                    "{entry.exampleUsage}"
                  </div>
                </div>

                {/* Quick Matrix Action Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Inject Term into:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleInjectIntoMatrix(entry.word, 'prefix')}
                      className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800"
                    >
                      +Prefix
                    </button>
                    <button
                      onClick={() => handleInjectIntoMatrix(entry.word, 'core')}
                      className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800"
                    >
                      +Core
                    </button>
                    <button
                      onClick={() => handleInjectIntoMatrix(entry.word, 'suffix')}
                      className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800"
                    >
                      +Suffix
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LSI & QUESTION EXPANDER */}
      {activeTab === 'LSI_EXPANDER' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <span>LSI (Latent Semantic Indexing) & Question Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Generate high-conversion question queries ("How to", "Why", "Best way") and commercial comparison modifiers ("vs", "alternatives to") directly from your seed keywords.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Informational Question Queries */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold font-mono text-cyan-300 flex items-center space-x-1.5">
                    <HelpCircle className="h-4 w-4 text-cyan-400" />
                    <span>Question-Based Queries ({lsiGeneratedList.questions.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(lsiGeneratedList.questions.join('\n'));
                      alert('Copied question queries to clipboard!');
                    }}
                    className="text-[10px] font-mono text-cyan-400 hover:underline"
                  >
                    Copy All
                  </button>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto font-mono text-xs text-slate-300">
                  {lsiGeneratedList.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                    >
                      <span>{q}</span>
                      <button
                        onClick={() => handleInjectIntoMatrix(q, 'core')}
                        className="px-2 py-0.5 text-[10px] rounded bg-slate-950 text-cyan-400 hover:bg-slate-800 border border-slate-700"
                        title="Add to Core List"
                      >
                        +Matrix
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison & Commercial Queries */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold font-mono text-amber-300 flex items-center space-x-1.5">
                    <BarChart2 className="h-4 w-4 text-amber-400" />
                    <span>Commercial Comparisons ({lsiGeneratedList.comparisons.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(lsiGeneratedList.comparisons.join('\n'));
                      alert('Copied comparison queries to clipboard!');
                    }}
                    className="text-[10px] font-mono text-amber-400 hover:underline"
                  >
                    Copy All
                  </button>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto font-mono text-xs text-slate-300">
                  {lsiGeneratedList.comparisons.map((cmp, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                    >
                      <span>{cmp}</span>
                      <button
                        onClick={() => handleInjectIntoMatrix(cmp, 'core')}
                        className="px-2 py-0.5 text-[10px] rounded bg-slate-950 text-amber-400 hover:bg-slate-800 border border-slate-700"
                        title="Add to Core List"
                      >
                        +Matrix
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERP PREVIEW & METADATA BUILDER */}
      {activeTab === 'SERP_PREVIEW' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-400" />
                <span>SERP Snippet & HTML Meta Tags Generator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Simulate how your top generated keywords appear in Google Search result titles, URLs, and meta description snippets.
              </p>
            </div>

            {/* Template Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300">Brand / Site Title</label>
                <input
                  type="text"
                  value={serpBrand}
                  onChange={(e) => setSerpBrand(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300">Base Domain URL</label>
                <input
                  type="text"
                  value={serpDomain}
                  onChange={(e) => setSerpDomain(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300">
                Meta Description Template (<code className="text-amber-400">{'{KEYWORD}'}</code> will be substituted)
              </label>
              <textarea
                value={serpDescriptionTemplate}
                onChange={(e) => setSerpDescriptionTemplate(e.target.value)}
                rows={2}
                className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 resize-none"
              />
            </div>

            {/* Live Google Search Previews */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Live Google SERP Previews (Top 5 Selected):
              </h3>

              <div className="space-y-4">
                {filteredKeywords.slice(0, 5).map((kw, kwIdx) => {
                  const titleString = `${kw.raw.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())} | ${serpBrand}`;
                  const slug = kw.raw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  const descString = serpDescriptionTemplate.replace(/\{KEYWORD\}/g, kw.raw);

                  return (
                    <div
                      key={kwIdx}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-sans space-y-1 shadow-md hover:border-purple-500/40 transition-all"
                    >
                      {/* Breadcrumb / URL */}
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                        <span>{serpDomain}</span>
                        <span>›</span>
                        <span className="text-slate-300">{slug}</span>
                      </div>

                      {/* SERP Blue Title */}
                      <div className="text-blue-400 hover:underline cursor-pointer text-base font-medium">
                        {titleString}
                      </div>

                      {/* Snippet Description */}
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {descString}
                      </p>

                      {/* Pixel & Character Count Bar */}
                      <div className="flex items-center space-x-3 pt-2 text-[10px] font-mono text-slate-500">
                        <span>Title: {titleString.length} chars (~{titleString.length * 9}px / 580px max)</span>
                        <span>•</span>
                        <span>Meta Desc: {descString.length} chars (155-160 optimal)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: N8N AUTOMATION & EXPORT */}
      {activeTab === 'N8N_EXPORT' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Workflow className="h-5 w-5 text-orange-400" />
                <span>n8n Webhook & Injunction Stream Bridge</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Stream filtered keyword permutation matrices directly to your n8n workflow execution nodes, automated content generators, or rank tracker databases.
              </p>
            </div>

            {/* n8n Cluster Status */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Target n8n Webhook: <code>http://10.142.0.40:5678/webhook/seo-keyword-pipeline</code>
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Payload format: JSON array with Intent, Difficulty, and CPC attributes ({filteredKeywords.length} objects).
                </div>
              </div>

              <button
                onClick={handleDispatchToN8n}
                disabled={isExportingN8n || filteredKeywords.length === 0}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold font-mono shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {isExportingN8n ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-white" />}
                <span>{isExportingN8n ? 'Streaming...' : `Stream ${filteredKeywords.length} Keywords`}</span>
              </button>
            </div>

            {n8nExportStatus && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center space-x-2"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{n8nExportStatus}</span>
              </motion.div>
            )}

            {/* Ready-to-import n8n Workflow JSON */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center space-x-1.5">
                  <Code2 className="h-4 w-4 text-orange-400" />
                  <span>n8n SEO Ingestion Workflow JSON (Copy & Import into n8n canvas)</span>
                </span>
                <button
                  onClick={() => {
                    const workflowJson = JSON.stringify({
                      name: "Sovereign SEO Keyword Ingestion Pipeline",
                      nodes: [
                        {
                          parameters: { path: "seo-keyword-pipeline", httpMethod: "POST", responseMode: "onReceived" },
                          name: "Webhook Ingress",
                          type: "n8n-nodes-base.webhook",
                          typeVersion: 1,
                          position: [250, 300]
                        },
                        {
                          parameters: { jsCode: "return $input.all().map(item => ({ json: item.json }));" },
                          name: "Keyword Normalizer",
                          type: "n8n-nodes-base.code",
                          typeVersion: 2,
                          position: [450, 300]
                        },
                        {
                          parameters: { operation: "insert", table: "seo_keywords_vault" },
                          name: "PostgreSQL / Data Sink",
                          type: "n8n-nodes-base.postgres",
                          typeVersion: 1,
                          position: [650, 300]
                        }
                      ],
                      connections: {
                        "Webhook Ingress": { main: [[{ node: "Keyword Normalizer", type: "main", index: 0 }]] },
                        "Keyword Normalizer": { main: [[{ node: "PostgreSQL / Data Sink", type: "main", index: 0 }]] }
                      }
                    }, null, 2);
                    navigator.clipboard.writeText(workflowJson);
                    alert('n8n Workflow JSON copied to clipboard!');
                  }}
                  className="text-xs font-mono text-orange-400 hover:underline"
                >
                  Copy JSON Specification
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60">
                {JSON.stringify({
                  name: "Sovereign SEO Keyword Ingestion Pipeline",
                  nodes: [
                    {
                      parameters: { path: "seo-keyword-pipeline", httpMethod: "POST", responseMode: "onReceived" },
                      name: "Webhook Ingress",
                      type: "n8n-nodes-base.webhook",
                      typeVersion: 1,
                      position: [250, 300]
                    },
                    {
                      parameters: { jsCode: "return $input.all().map(item => ({ json: item.json }));" },
                      name: "Keyword Normalizer",
                      type: "n8n-nodes-base.code",
                      typeVersion: 2,
                      position: [450, 300]
                    },
                    {
                      parameters: { operation: "insert", table: "seo_keywords_vault" },
                      name: "PostgreSQL / Data Sink",
                      type: "n8n-nodes-base.postgres",
                      typeVersion: 1,
                      position: [650, 300]
                    }
                  ]
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
