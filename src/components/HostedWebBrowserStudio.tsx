import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  FileText,
  PenTool,
  Send,
  MessageSquare,
  ThumbsUp,
  Share2,
  Tag,
  Calendar,
  User,
  Search,
  Plus,
  CheckCircle2,
  Monitor,
  Terminal,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  Radio,
  Activity,
  Cpu,
  Layers,
  Code2,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Tv,
  Eye,
  Wrench,
  Folder
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'AI & Neural' | 'Decentralized Networks' | 'Server Mesh' | 'Security & Crypto' | 'Tutorials';
  author: string;
  authorRole: string;
  publishedAt: string;
  readTimeMinutes: number;
  likes: number;
  tags: string[];
  comments: { id: string; author: string; text: string; date: string }[];
}

interface HostedWebBrowserStudioProps {
  initialSlug?: string;
  onNavigateTab?: (tab: string) => void;
}

export const HostedWebBrowserStudio: React.FC<HostedWebBrowserStudioProps> = ({
  initialSlug = 'vox-ai-v1-launch',
  onNavigateTab
}) => {
  const [activeTabSub, setActiveTabSub] = useState<'blog_feed' | 'blog_editor' | 'desktop_display' | 'remote_terminal'>('blog_feed');
  
  // Blog Feed & State
  const initialPosts: BlogPost[] = [
    {
      id: 'post-1',
      title: 'Introducing VOX Network v1.0 & Autonomous VOX AI Injunctions',
      slug: 'vox-ai-v1-launch',
      summary: 'An inside look at the VOX Network architecture, modular server node mesh, and real-time AI code injunction execution engine.',
      content: `Welcome to the official launch of **VOX Network v1.0**! 

### Core Innovations in VOX Network
VOX Network represents a quantum leap in decentralized compute orchestration and AI tool execution. By blending high-speed server node generation with vector memory stores and C++ SIMD vision acceleration, VOX Network provides developers and operators with an uncompromised full-stack workstation.

#### 1. VOX AI Engine
The built-in VOX AI assistant interacts directly with network telemetry, code injunction dispatchers, and remote RDP/VNC sessions. It can generate server manifests, execute direct diagnostic commands, and manage digital asset vaults seamlessly.

#### 2. Modular Server Mesh
Every node in the VOX Network operates as a self-contained container capable of running edge proxies, Qdrant vector databases, and n8n workflow engines with zero latency overhead.

#### 3. Cryptographic Injunction Pipelines
Code injunctions allow administrators to run sandboxed TypeScript and Python tools with cryptographic proof of execution, enabling trustless automation across edge infrastructure.`,
      category: 'AI & Neural',
      author: 'Alex Rivera',
      authorRole: 'Principal Architect @ VOX Network',
      publishedAt: 'August 13, 2026',
      readTimeMinutes: 5,
      likes: 128,
      tags: ['VOX AI', 'Decentralized Compute', 'Vector DB', 'Injunctions'],
      comments: [
        { id: 'c1', author: 'Elena Rostova', text: 'The sub-15ms latency on vector queries is astounding. Great work VOX team!', date: 'August 13, 2026' },
        { id: 'c2', author: 'David Chen', text: 'Tested the RDP workstation module — the keyboard relay and TLS 1.3 tunnels work flawlessly.', date: 'August 13, 2026' }
      ]
    },
    {
      id: 'post-2',
      title: 'Building Zero-Gas Token Vaults on VOX Network Digital Asset Layer',
      slug: 'zero-gas-token-vaults',
      summary: 'Learn how to deploy customized ERC-20 and Solana token contracts with automated gasless relays using VOX Network smart contract wizards.',
      content: `Decentralized finance and digital asset management have traditionally suffered from high friction and unpredictable gas fees. 

VOX Network introduces the **Gasless Token Deployer** and **Digital Server Asset Vault**, allowing operators to mint and manage tokens with built-in escrow bridges.

### Key Capabilities:
- **Zero-Gas Relays**: Transactions are bundled via VOX relayers and verified cryptographically.
- **Multi-Chain Parity**: Seamless bridge between Ethereum, Solana, and custom VOX Subnetworks.
- **Automated Staking Contracts**: Pre-audited smart contract templates ready for instant deployment.`,
      category: 'Security & Crypto',
      author: 'Marcus Vance',
      authorRole: 'Crypto Research Lead',
      publishedAt: 'August 12, 2026',
      readTimeMinutes: 4,
      likes: 94,
      tags: ['Gasless', 'Smart Contracts', 'Vaults', 'DeFi'],
      comments: [
        { id: 'c3', author: 'Sarah Jenkins', text: 'Was able to deploy a test token in under 30 seconds using the wizard!', date: 'August 12, 2026' }
      ]
    },
    {
      id: 'post-3',
      title: 'High-Performance Remote Workstations: RDP, RFB, & SSH X11 Tunnels',
      slug: 'remote-workstations-rdp',
      summary: 'How VOX Network delivers 60 FPS remote desktop streaming with mouse pointer capture and raw keyboard relay directly in the browser.',
      content: `Browser-based remote desktop protocols have evolved significantly. With WebSockets, WebRTC, and hardware-accelerated H.264 canvas decoders, VOX Network brings true workstation capability to any browser window.

### Protocol Support Matrix:
- **RDP 10.11**: Microsoft Windows Server & Windows 11 remote desktop.
- **RFB / VNC**: Ultra-lightweight Linux X11/Wayland sessions.
- **SSH X11 Tunneling**: Secure command-line and graphical application forwarding over Port 22.`,
      category: 'Server Mesh',
      author: 'David Chen',
      authorRole: 'Systems Infrastructure Engineer',
      publishedAt: 'August 10, 2026',
      readTimeMinutes: 6,
      likes: 76,
      tags: ['RDP', 'VNC', 'Remote Desktop', 'TLS 1.3'],
      comments: []
    }
  ];

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(initialPosts[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // New Post Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSummary, setNewSummary] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<BlogPost['category']>('AI & Neural');
  const [newTags, setNewTags] = useState<string>('VOX, Tech, Web3');
  const [newAuthor, setNewAuthor] = useState<string>('VOX Community Author');

  // New Comment Input State
  const [commentText, setCommentText] = useState<string>('');
  const [commentAuthor, setCommentAuthor] = useState<string>('');

  // RDP Terminal state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[VOX-RDP] Session initialized to host 10.142.0.12:3389',
    '[TLS-1.3] Cipher: AES-256-GCM verified',
    'Operator@VOX-HOST-01:~$ '
  ]);

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: commentAuthor.trim() || 'Anonymous Reader',
      text: commentText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    const updatedPosts = posts.map(p => {
      if (p.id === selectedPost.id) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    setPosts(updatedPosts);
    setSelectedPost(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
    setCommentText('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: BlogPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary: newSummary.trim() || newContent.slice(0, 120) + '...',
      content: newContent.trim(),
      category: newCategory,
      author: newAuthor.trim() || 'VOX Contributor',
      authorRole: 'Community Writer',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTimeMinutes: Math.max(2, Math.ceil(newContent.split(' ').length / 200)),
      likes: 1,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      comments: []
    };

    setPosts([created, ...posts]);
    setSelectedPost(created);
    setActiveTabSub('blog_feed');

    // Reset Form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="vox-hosted-pages-blog-studio" className="space-y-6 font-sans text-slate-100">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <BookOpen className="h-6 w-6 animate-pulse" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                IIN Tech Blog &amp; Hosted Pages Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
              <span className="font-iin-digital text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">IIN</span>
              <span>Network Knowledge Base &amp; Articles Hub</span>
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Discover articles on Intentional Infrastructure Network (IIN) AI, decentralized server meshes, gasless token deployment, and high-performance remote desktop workstation tunnels. Author and publish articles or test remote desktop sessions directly.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shrink-0 font-mono">
            <FileText className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Published Articles</span>
              <span className="text-sm font-black text-white">{posts.length} Tech Articles</span>
              <span className="text-[10px] text-emerald-400 block font-mono">Bloggable &amp; Community Enabled</span>
            </div>
          </div>
        </div>

        {/* SUB NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-zinc-800 font-mono text-xs">
          <button
            onClick={() => setActiveTabSub('blog_feed')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 border ${
              activeTabSub === 'blog_feed'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>1. Blog &amp; Articles Reader ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTabSub('blog_editor')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 border ${
              activeTabSub === 'blog_editor'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <PenTool className="h-4 w-4" />
            <span>2. Write &amp; Publish Article</span>
          </button>

          <button
            onClick={() => setActiveTabSub('desktop_display')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 border ${
              activeTabSub === 'desktop_display'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>3. Remote Desktop Workstation</span>
          </button>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('network_tools_vendors')}
              className="ml-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold transition-all flex items-center space-x-1.5 border border-zinc-700"
            >
              <Wrench className="h-4 w-4 text-amber-400" />
              <span>Tools Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB TAB 1: BLOG FEED & ARTICLE READER */}
      {activeTabSub === 'blog_feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Article List Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search & Category Filter */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3 font-mono">
              <div className="flex items-center space-x-2 bg-black border border-zinc-800 rounded-xl px-3 py-2">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search VOX articles..."
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['ALL', 'AI & Neural', 'Decentralized Networks', 'Server Mesh', 'Security & Crypto'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Cards Feed */}
            <div className="space-y-3">
              {filteredPosts.map(post => {
                const isSelected = selectedPost?.id === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-900 border-emerald-500/80 shadow-xl ring-1 ring-emerald-500/50'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.publishedAt}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                      {post.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60 pt-2.5">
                      <span className="flex items-center space-x-1 text-zinc-300">
                        <User className="h-3 w-3 text-emerald-400" />
                        <span>{post.author}</span>
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3 text-emerald-400" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3 text-cyan-400" />
                          <span>{post.comments.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Article Full View & Reader Column */}
          <div className="lg:col-span-7">
            {selectedPost ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                
                {/* Article Header */}
                <div className="space-y-3 border-b border-zinc-800 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold">
                      {selectedPost.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{selectedPost.publishedAt} • {selectedPost.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    {selectedPost.title}
                  </h1>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400">
                        {selectedPost.author.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{selectedPost.author}</span>
                        <span className="text-xs text-zinc-400 block font-mono">{selectedPost.authorRole}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLikePost(selectedPost.id)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 text-xs font-mono font-bold flex items-center space-x-2 transition-all active:scale-95"
                    >
                      <ThumbsUp className="h-4 w-4 fill-emerald-400/20" />
                      <span>{selectedPost.likes} Likes</span>
                    </button>
                  </div>
                </div>

                {/* Article Main Body */}
                <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed whitespace-pre-line space-y-4 font-sans">
                  {selectedPost.content}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-zinc-800 font-mono text-xs">
                  <Tag className="h-3.5 w-3.5 text-zinc-500" />
                  {selectedPost.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Reader Comments Section */}
                <div className="border-t border-zinc-800 pt-6 space-y-4 font-mono">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-cyan-400" />
                      <span>Community Discussion ({selectedPost.comments.length})</span>
                    </h3>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {selectedPost.comments.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No comments yet. Be the first to join the conversation!</p>
                    ) : (
                      selectedPost.comments.map(c => (
                        <div key={c.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-cyan-300">{c.author}</span>
                            <span className="text-zinc-500 text-[10px]">{c.date}</span>
                          </div>
                          <p className="text-zinc-300 font-sans">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3 text-xs">
                    <span className="font-bold text-zinc-200 block">Leave a Comment:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder="Your Name / Handle"
                        className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts on this VOX article..."
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-sans"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black transition-all flex items-center space-x-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Post Comment</span>
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 font-mono space-y-2">
                <BookOpen className="h-8 w-8 mx-auto text-zinc-600" />
                <p>Select an article from the left to read full content.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB TAB 2: WRITE & PUBLISH ARTICLE */}
      {activeTabSub === 'blog_editor' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-2xl font-mono">
          <div className="border-b border-zinc-800 pb-4 space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <PenTool className="h-5 w-5 text-emerald-400" />
              <span>Author New VOX Article</span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Publish tech updates, tutorials, or research papers directly to the VOX Network Hosted Knowledge Base.
            </p>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Article Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Scaling Vector DB Indexes with Autonomous Injunctions"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-emerald-400 font-bold focus:outline-none"
                >
                  <option value="AI & Neural">AI &amp; Neural</option>
                  <option value="Decentralized Networks">Decentralized Networks</option>
                  <option value="Server Mesh">Server Mesh</option>
                  <option value="Security & Crypto">Security &amp; Crypto</option>
                  <option value="Tutorials">Tutorials</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Author Name</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Brief Summary</label>
              <input
                type="text"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="A short 1-2 sentence overview of the article..."
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Tags (comma-separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="VOX AI, Injunctions, Telemetry"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Article Body Content (Markdown Supported)</label>
              <textarea
                rows={10}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your article content here..."
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-zinc-200 font-sans focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-xs transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Publish Article to VOX Network</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 3: REMOTE DESKTOP WORKSTATION */}
      {activeTabSub === 'desktop_display' && (
        <div className="bg-black border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col justify-between font-mono">
          <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
            <span className="font-black text-emerald-400 flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>VOX Remote Desktop Console (TLS 1.3 Tunneling)</span>
            </span>
            <span className="text-emerald-400 font-bold">10.142.0.12 • RDP Active • 60 FPS</span>
          </div>

          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Tv className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white">VOX Remote Desktop Workstation Connected</h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
              Remote desktop frame relay active. Mouse capture and raw keyboard tunneling established on host <span className="text-amber-300 font-mono">10.142.0.12:3389</span>.
            </p>
          </div>

          <div className="bg-zinc-950 px-4 py-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>VOX Network Hosted Workstation</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      )}

    </div>
  );
};
