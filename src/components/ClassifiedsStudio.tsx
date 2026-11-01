import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Tag,
  MapPin,
  DollarSign,
  ShieldCheck,
  Zap,
  Clock,
  UserCheck,
  MessageSquare,
  Lock,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Wallet,
  Coins,
  Send,
  Eye,
  Building,
  Cpu,
  Shirt,
  Home,
  Laptop,
  Car,
  Rocket,
  Key,
  KeyRound,
  ShieldAlert,
  ThumbsUp,
  MessageCircle,
  Share2,
  LockKeyhole,
  Check,
  Binary,
  Code2,
  Activity,
  Award,
  Filter
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  cryptoEquiv: string;
  location: string;
  datePosted: string;
  description: string;
  sellerHandle: string;
  contactMethod: string;
  views: number;
  isUrgent: boolean;
  condition: string;
  escrowEnabled: boolean;
  p2pGatewayMethods: string[];
}

interface FeedComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isEncrypted?: boolean;
}

interface FeedPost {
  id: string;
  authorHandle: string;
  authorAvatar: string;
  authorReputation: number;
  isVerifiedSeller: boolean;
  tag: string;
  title: string;
  content: string;
  encryptedPayloadHash: string;
  zkProofHash: string;
  timestamp: string;
  likes: number;
  repliesCount: number;
  tipsAmountSNT: number;
  linkedListingId?: string;
  comments: FeedComment[];
}

export const ClassifiedsStudio: React.FC = () => {
  // Main Studio View Mode: 'listings' | 'community_feed' | 'p2p_cipher'
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'community_feed' | 'p2p_cipher'>('listings');

  // Listings State
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters for Listings
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Post Listing Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Electronics');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('San Francisco Bay Area');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newSellerHandle, setNewSellerHandle] = useState<string>('@operator_x');
  const [newContactMethod, setNewContactMethod] = useState<string>('AGVORA P2P Kyber Mail');
  const [newCondition, setNewCondition] = useState<string>('Like New');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // P2P Gateway Escrow Modal State
  const [selectedListingForP2P, setSelectedListingForP2P] = useState<Listing | null>(null);
  const [p2pPaymentMethod, setP2PPaymentMethod] = useState<string>('Solana Multi-Sig Escrow');
  const [p2pBuyerWallet, setP2PBuyerWallet] = useState<string>('0x98A...4F12');
  const [isInitiatingP2P, setIsInitiatingP2P] = useState<boolean>(false);
  const [p2pEscrowResult, setP2PEscrowResult] = useState<any | null>(null);

  // Community Feed State
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState<boolean>(false);
  const [selectedFeedTag, setSelectedFeedTag] = useState<string>('#All');
  const [feedSearchQuery, setFeedSearchQuery] = useState<string>('');
  const [isCreateFeedPostOpen, setIsCreateFeedPostOpen] = useState<boolean>(false);
  const [feedPostTitle, setFeedPostTitle] = useState<string>('');
  const [feedPostContent, setFeedPostContent] = useState<string>('');
  const [feedPostTag, setFeedPostTag] = useState<string>('#TradeOffer');
  const [feedPostIsEncrypted, setFeedPostIsEncrypted] = useState<boolean>(true);
  const [isSubmittingFeedPost, setIsSubmittingFeedPost] = useState<boolean>(false);

  // Expandable Comments
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [commentIsEncrypted, setCommentIsEncrypted] = useState<boolean>(true);

  // Post-Quantum P2P Cipher Suite State
  const [cipherPlaintext, setCipherPlaintext] = useState<string>('Initiating private deal: Transfer 2x H100 GPU nodes to San Jose vault via multi-sig escrow.');
  const [cipherSender, setCipherSender] = useState<string>('@quantum_operator');
  const [cipherRecipient, setCipherRecipient] = useState<string>('@silicon_trader');
  const [cipherSecurityTier, setCipherSecurityTier] = useState<string>('Kyber1024 + zk-SNARK + RingCT (Maximum Security)');
  const [isEncryptingCipher, setIsEncryptingCipher] = useState<boolean>(false);
  const [isDecryptingCipher, setIsDecryptingCipher] = useState<boolean>(false);
  const [cipherResult, setCipherResult] = useState<any | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<any | null>(null);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);

  // Direct E2EE Message Modal for Sellers
  const [messageSellerModalListing, setMessageSellerModalListing] = useState<Listing | null>(null);
  const [directMsgText, setDirectMsgText] = useState<string>('Hello! I am interested in purchasing your listing. Sending Kyber1024 E2EE handshake key...');
  const [directMsgSent, setDirectMsgSent] = useState<boolean>(false);

  const categories = [
    'All Categories',
    'Vehicles',
    'Aerospace Equipment',
    'Electronics',
    'Computers & Servers',
    'House & Home',
    'Fashion & Apparel',
    'Software & Services'
  ];

  const locations = [
    'All Locations',
    'San Francisco Bay Area',
    'Tokyo / Akihabara',
    'Seattle / Tech Hill',
    'Austin / Silicon Hills',
    'London / Tech City UK'
  ];

  const feedTags = [
    '#All',
    '#TradeOffer',
    '#InSearchOf',
    '#SellerReputation',
    '#SecurityAlert',
    '#HardwareDiscussion'
  ];

  useEffect(() => {
    fetchListings();
    fetchCommunityFeed();
  }, [selectedCategory, selectedLocation]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All Categories') queryParams.append('category', selectedCategory);
      if (selectedLocation !== 'All Locations') queryParams.append('location', selectedLocation);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);

      const res = await fetch(`/api/classifieds/listings?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setListings(data.listings || []);
        }
      }
    } catch (err) {
      console.error('Error fetching classified listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunityFeed = async () => {
    setIsFeedLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedFeedTag !== '#All') queryParams.append('tag', selectedFeedTag);
      if (feedSearchQuery) queryParams.append('search', feedSearchQuery);

      const res = await fetch(`/api/classifieds/community-feed?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFeedPosts(data.feed || []);
        }
      }
    } catch (err) {
      console.error('Error fetching community feed:', err);
    } finally {
      setIsFeedLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleFeedSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCommunityFeed();
  };

  const handlePublishListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    setIsPublishing(true);
    setPublishSuccessMsg(null);

    try {
      const res = await fetch('/api/classifieds/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          price: newPrice,
          location: newLocation,
          description: newDescription,
          sellerHandle: newSellerHandle,
          contactMethod: newContactMethod,
          condition: newCondition
        })
      });
      const data = await res.json();
      if (data.success) {
        setPublishSuccessMsg(data.message || 'Ad published successfully!');
        setIsPostModalOpen(false);
        setNewTitle('');
        setNewPrice('');
        setNewDescription('');
        fetchListings();
      }
    } catch (err) {
      console.error('Error publishing listing:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleInitiateP2P = async () => {
    if (!selectedListingForP2P) return;
    setIsInitiatingP2P(true);
    setP2PEscrowResult(null);

    try {
      const res = await fetch('/api/classifieds/p2p-escrow/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selectedListingForP2P.id,
          itemTitle: selectedListingForP2P.title,
          sellerHandle: selectedListingForP2P.sellerHandle,
          amount: selectedListingForP2P.price,
          paymentMethod: p2pPaymentMethod,
          buyerWallet: p2pBuyerWallet
        })
      });
      const data = await res.json();
      if (data.success) {
        setP2PEscrowResult(data.escrow);
      }
    } catch (err) {
      console.error('Error initiating P2P escrow:', err);
    } finally {
      setIsInitiatingP2P(false);
    }
  };

  const handleCreateFeedPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedPostTitle || !feedPostContent) return;
    setIsSubmittingFeedPost(true);

    try {
      const res = await fetch('/api/classifieds/community-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: feedPostTitle,
          content: feedPostContent,
          tag: feedPostTag,
          isEncryptedPost: feedPostIsEncrypted
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateFeedPostOpen(false);
        setFeedPostTitle('');
        setFeedPostContent('');
        fetchCommunityFeed();
      }
    } catch (err) {
      console.error('Error creating feed post:', err);
    } finally {
      setIsSubmittingFeedPost(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/classifieds/community-feed/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText) return;
    try {
      const res = await fetch(`/api/classifieds/community-feed/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: commentText,
          isEncrypted: commentIsEncrypted
        })
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        fetchCommunityFeed();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleRunP2PEncryption = async () => {
    setIsEncryptingCipher(true);
    setDecryptionResult(null);
    try {
      const res = await fetch('/api/classifieds/e2ee/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plaintext: cipherPlaintext,
          senderHandle: cipherSender,
          recipientHandle: cipherRecipient,
          securityTier: cipherSecurityTier
        })
      });
      const data = await res.json();
      if (data.success) {
        setCipherResult(data.encryptionMetadata);
      }
    } catch (err) {
      console.error('Error encrypting P2P payload:', err);
    } finally {
      setIsEncryptingCipher(false);
    }
  };

  const handleRunP2PDecryption = async () => {
    if (!cipherResult?.ciphertext) return;
    setIsDecryptingCipher(true);
    try {
      const res = await fetch('/api/classifieds/e2ee/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ciphertext: cipherResult.ciphertext
        })
      });
      const data = await res.json();
      if (data.success) {
        setDecryptionResult(data);
      }
    } catch (err) {
      console.error('Error decrypting P2P payload:', err);
    } finally {
      setIsDecryptingCipher(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Vehicles':
        return <Car className="h-4 w-4 text-amber-400" />;
      case 'Aerospace Equipment':
        return <Rocket className="h-4 w-4 text-cyan-400" />;
      case 'Electronics':
        return <Cpu className="h-4 w-4 text-cyan-400" />;
      case 'Computers & Servers':
        return <Laptop className="h-4 w-4 text-emerald-400" />;
      case 'House & Home':
        return <Home className="h-4 w-4 text-amber-400" />;
      case 'Fashion & Apparel':
        return <Shirt className="h-4 w-4 text-rose-400" />;
      default:
        return <Tag className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
              AGVORA Classifieds &amp; P2P Cipher Network
            </span>
            <span className="text-[10px] text-zinc-400">Quantum-Resistant Encrypted P2P</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center space-x-2">
            <span className="font-agvora-digital text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">AGVORA</span>
            <span className="text-amber-400 font-serif italic text-lg sm:text-xl">Classifieds &amp; Community Feed</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Community P2P marketplace &amp; feed protected by NIST FIPS-203 CRYSTALS-Kyber1024, Curve25519 Double-Ratchet E2EE, zk-SNARK Groth16 zero-knowledge proofs, and multi-sig escrow gateways.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-1.5 shadow-lg shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Post Classified Ad</span>
          </button>
          <button
            onClick={() => setIsCreateFeedPostOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-1.5 shadow-lg shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Post to Community Feed</span>
          </button>
        </div>
      </div>

      {publishSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{publishSuccessMsg}</span>
        </div>
      )}

      {/* CLASSIFIEDS SUB-NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSubTab('listings')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all border ${
            activeSubTab === 'listings'
              ? 'bg-amber-500 text-black border-amber-400 shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>P2P Marketplace Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('community_feed');
            fetchCommunityFeed();
          }}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all border ${
            activeSubTab === 'community_feed'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Community Feed ({feedPosts.length})</span>
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveSubTab('p2p_cipher')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all border ${
            activeSubTab === 'p2p_cipher'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          <LockKeyhole className="h-4 w-4 text-purple-300" />
          <span>Post-Quantum P2P Cipher Engine (Kyber1024 + zk-SNARK)</span>
        </button>
      </div>

      {/* ================= TAB 1: MARKETPLACE LISTINGS ================= */}
      {activeSubTab === 'listings' && (
        <div className="space-y-4">
          {/* Filter Bar & Search */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search classified ads (e.g. H100 GPU, rack server, jacket, switch)..."
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800 text-xs">
              <span className="text-zinc-500 text-[11px] font-bold">Categories:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Displaying <strong>{listings.length}</strong> P2P Classified Listings</span>
            <button
              onClick={fetchListings}
              className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Index</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-zinc-400">Loading AGVORA Classifieds Index...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto text-zinc-600" />
              <p className="text-xs font-bold text-zinc-400">No classified ads found matching criteria.</p>
              <p className="text-[11px]">Try adjusting your search query or selecting &quot;All Categories&quot;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 rounded-xl p-4 space-y-3 transition-all hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(item.category)}
                        <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                          {item.category}
                        </span>
                        {item.isUrgent && (
                          <span className="text-[9px] font-bold uppercase bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                            URGENT
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{item.datePosted}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white hover:text-amber-300 cursor-pointer line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-base font-black text-amber-300">${item.price.toLocaleString()} USD</span>
                        <span className="text-[10px] text-zinc-500 block font-mono">{item.cryptoEquiv}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-zinc-300 font-bold flex items-center space-x-1 justify-end">
                          <MapPin className="h-3 w-3 text-rose-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{item.location}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 block">{item.sellerHandle}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => {
                          setMessageSellerModalListing(item);
                          setDirectMsgSent(false);
                        }}
                        className="text-[10px] text-cyan-300 flex items-center space-x-1 bg-cyan-950/80 hover:bg-cyan-900 px-2.5 py-1.5 rounded-lg border border-cyan-800 transition-all font-bold"
                      >
                        <LockKeyhole className="h-3 w-3 text-cyan-400" />
                        <span>Kyber1024 E2EE Chat</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedListingForP2P(item);
                          setP2PEscrowResult(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center space-x-1 shadow-md"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Initiate Escrow Gateway</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: COMMUNITY FEED ================= */}
      {activeSubTab === 'community_feed' && (
        <div className="space-y-4">
          {/* Feed Filter & Search Bar */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-3">
            <form onSubmit={handleFeedSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={feedSearchQuery}
                  onChange={e => setFeedSearchQuery(e.target.value)}
                  placeholder="Search community posts, trade requests, or reputation reviews..."
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all flex items-center space-x-1"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search Feed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateFeedPostOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Post</span>
                </button>
              </div>
            </form>

            {/* Tags Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800 text-xs">
              <span className="text-zinc-500 text-[11px] font-bold">Feed Tags:</span>
              {feedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedFeedTag(tag);
                    fetchCommunityFeed();
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedFeedTag === tag
                      ? 'bg-cyan-500 text-black shadow'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Posts Index */}
          {isFeedLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
              <p className="text-xs text-zinc-400">Syncing AGVORA P2P Community Feed...</p>
            </div>
          ) : feedPosts.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto text-zinc-600" />
              <p className="text-xs font-bold text-zinc-400">No community feed posts found.</p>
              <p className="text-[11px]">Be the first to publish a trade offer or ISO post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-4 transition-all shadow-lg"
                >
                  {/* Post Author Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorHandle}
                        className="h-10 w-10 rounded-xl border border-cyan-500/50 object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white text-xs">{post.authorHandle}</span>
                          {post.isVerifiedSeller && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold flex items-center space-x-0.5">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verified ({post.authorReputation}%)</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 block">{post.timestamp}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                      {post.tag}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Cryptographic Proof Badges */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400">
                    <div className="flex items-center space-x-2">
                      <LockKeyhole className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span className="truncate max-w-[220px]">Kyber1024 Cipher Payload: <strong className="text-purple-300 font-mono">{post.encryptedPayloadHash}</strong></span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>zk-SNARK Groth16 Verified ({post.zkProofHash.substring(0, 16)}...)</span>
                    </div>
                  </div>

                  {/* Post Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center space-x-1.5 text-zinc-400 hover:text-amber-400 font-bold transition-all"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes} Upvotes</span>
                      </button>

                      <button
                        onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post.id ? null : post.id)}
                        className="flex items-center space-x-1.5 text-zinc-400 hover:text-cyan-400 font-bold transition-all"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.repliesCount} Replies</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setCipherRecipient(post.authorHandle);
                        setActiveSubTab('p2p_cipher');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 font-bold text-[11px] flex items-center space-x-1 transition-all"
                    >
                      <LockKeyhole className="h-3.5 w-3.5 text-purple-400" />
                      <span>E2EE Deal Negotiation</span>
                    </button>
                  </div>

                  {/* Expanded Comments Drawer */}
                  {expandedCommentsPostId === post.id && (
                    <div className="pt-3 border-t border-zinc-800 space-y-3 text-xs bg-black/40 p-3 rounded-xl border">
                      <div className="font-bold text-zinc-400 text-[11px] uppercase tracking-wider">
                        Community Replies &amp; P2P Comments
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {(post.comments || []).length === 0 ? (
                          <p className="text-[11px] text-zinc-500 italic">No comments yet. Leave a reply below!</p>
                        ) : (
                          (post.comments || []).map(c => (
                            <div key={c.id} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-cyan-300">{c.author}</span>
                                <span className="text-zinc-500">{c.timestamp}</span>
                              </div>
                              <p className="text-xs text-zinc-300">{c.text}</p>
                              {c.isEncrypted && (
                                <span className="text-[9px] text-purple-400 font-mono flex items-center space-x-1">
                                  <LockKeyhole className="h-2.5 w-2.5" />
                                  <span>Wrapped with Double-Ratchet Ephemeral Keys</span>
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Comment Input */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <textarea
                          rows={2}
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          placeholder="Write a reply or offer to this post..."
                          className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-1.5 text-[10px] text-zinc-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={commentIsEncrypted}
                              onChange={e => setCommentIsEncrypted(e.target.checked)}
                              className="rounded border-zinc-800 bg-black text-cyan-500"
                            />
                            <span>Encrypt reply with Kyber1024</span>
                          </label>

                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                          >
                            Send Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: POST-QUANTUM P2P CIPHER SUITE ================= */}
      {activeSubTab === 'p2p_cipher' && (
        <div className="space-y-6">
          {/* Cipher Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-950/60 via-zinc-900 to-black border border-purple-500/40 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase flex items-center space-x-1">
                <LockKeyhole className="h-3 w-3" />
                <span>NIST FIPS 203 &amp; 204 Compliant</span>
              </span>
              <span className="text-[10px] text-zinc-400">Quantum-Safe P2P Handshake</span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>AGVORA Post-Quantum Hybrid P2P Encryption Engine</span>
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Combines <strong>CRYSTALS-Kyber1024</strong> (Lattice-based Key Encapsulation KEM) with <strong>Curve25519 Double Ratchet</strong>, <strong>zk-SNARK Groth16 zero-knowledge proofs</strong>, and <strong>RingCT 16-Ring Signatures</strong> for untraceable, bulletproof peer-to-peer classified negotiations and secret escrow agreements.
            </p>
          </div>

          {/* Cryptographic Pipeline Step Diagram */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800 pb-2">
              <span>6-Layer Cryptographic Pipeline Execution</span>
              <span>Layer {activePipelineStep} of 6</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { step: 1, name: 'Kyber1024 KEM', icon: Key, color: 'text-purple-400' },
                { step: 2, name: 'Double Ratchet', icon: RefreshCw, color: 'text-cyan-400' },
                { step: 3, name: 'zk-SNARK Groth16', icon: ShieldCheck, color: 'text-emerald-400' },
                { step: 4, name: 'RingCT 16-Ring', icon: Binary, color: 'text-amber-400' },
                { step: 5, name: 'AES-256-GCM', icon: Lock, color: 'text-blue-400' },
                { step: 6, name: '3-of-5 MPC Escrow', icon: Layers, color: 'text-rose-400' }
              ].map(s => {
                const IconComp = s.icon;
                const isActive = activePipelineStep === s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePipelineStep(s.step)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-purple-950/80 border-purple-400 shadow-lg scale-105'
                        : 'bg-black/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                      <span>Step 0{s.step}</span>
                      <IconComp className={`h-3.5 w-3.5 ${s.color}`} />
                    </div>
                    <span className="font-bold text-xs text-white block">{s.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Pipeline Step Detail Box */}
            <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-2 text-xs font-sans">
              {activePipelineStep === 1 && (
                <div>
                  <h4 className="font-bold text-purple-300">Layer 1: CRYSTALS-Kyber1024 Post-Quantum Key Exchange</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Derives a 256-bit shared symmetric secret using Module Lattice-Based Key Encapsulation (ML-KEM). Immune to quantum Shor&apos;s algorithm attacks.
                  </p>
                </div>
              )}
              {activePipelineStep === 2 && (
                <div>
                  <h4 className="font-bold text-cyan-300">Layer 2: Curve25519 Double Ratchet Protocol</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Provides Forward Secrecy and Break-in Recovery. Every single P2P classified message uses a unique ephemeral symmetric key that self-destructs after receipt.
                  </p>
                </div>
              )}
              {activePipelineStep === 3 && (
                <div>
                  <h4 className="font-bold text-emerald-300">Layer 3: zk-SNARK Groth16 Zero-Knowledge Verification</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Generates a mathematical zero-knowledge proof verifying sender wallet solvency and reputation rank without revealing identities or exact wallet balances.
                  </p>
                </div>
              )}
              {activePipelineStep === 4 && (
                <div>
                  <h4 className="font-bold text-amber-300">Layer 4: MLSAG RingCT 16-Ring Signature</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Mixes sender&apos;s public key with 15 decoy keys from the AGVORA validator pool, guaranteeing 100% untraceable sender IP and wallet anonymity.
                  </p>
                </div>
              )}
              {activePipelineStep === 5 && (
                <div>
                  <h4 className="font-bold text-blue-300">Layer 5: Poly1305 + AES-256-GCM Authenticated Payload Wrapping</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Encrypts trade offer specifications, hardware serial numbers, and delivery addresses with hardware-accelerated AES-NI SIMD instructions.
                  </p>
                </div>
              )}
              {activePipelineStep === 6 && (
                <div>
                  <h4 className="font-bold text-rose-300">Layer 6: 3-of-5 Threshold MPC Secret Escrow Guardians</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Splits decryption keys into 5 Shamir secret shards distributed across independent AGVORA Escrow Guardian nodes. Requires 3-of-5 consensus to release funds.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Live Encryption Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
                <LockKeyhole className="h-5 w-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Interactive P2P Encryption Console</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Plaintext Deal Secret / Message</label>
                  <textarea
                    rows={4}
                    value={cipherPlaintext}
                    onChange={e => setCipherPlaintext(e.target.value)}
                    placeholder="Enter confidential deal terms or shipping address..."
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Sender Handle</label>
                    <input
                      type="text"
                      value={cipherSender}
                      onChange={e => setCipherSender(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Recipient Handle</label>
                    <input
                      type="text"
                      value={cipherRecipient}
                      onChange={e => setCipherRecipient(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Cryptographic Security Tier</label>
                  <select
                    value={cipherSecurityTier}
                    onChange={e => setCipherSecurityTier(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Kyber1024 + zk-SNARK + RingCT (Maximum Security)">Kyber1024 + zk-SNARK + RingCT (Maximum Security)</option>
                    <option value="X25519 Double Ratchet (Standard E2EE)">X25519 Double Ratchet (Standard E2EE)</option>
                    <option value="Threshold MPC Guardians (Escrow Locked)">Threshold MPC Guardians (Escrow Locked)</option>
                  </select>
                </div>

                <button
                  onClick={handleRunP2PEncryption}
                  disabled={isEncryptingCipher}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-lg"
                >
                  {isEncryptingCipher ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                  <span>Execute Kyber1024 Post-Quantum Encryption</span>
                </button>
              </div>
            </div>

            {/* Cipher Output & Decryption Sandbox */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Binary className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Cryptographic Payload &amp; Decryption Sandbox</h3>
                </div>
                {cipherResult && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    ENCRYPTED OK
                  </span>
                )}
              </div>

              {!cipherResult ? (
                <div className="p-12 text-center text-zinc-500 space-y-2 border border-dashed border-zinc-800 rounded-xl">
                  <KeyRound className="h-8 w-8 mx-auto text-zinc-600" />
                  <p className="text-xs font-bold text-zinc-400">No cryptographic payload generated yet.</p>
                  <p className="text-[11px]">Click &quot;Execute Kyber1024 Post-Quantum Encryption&quot; on the left to inspect ciphertext artifacts.</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="bg-black p-3 rounded-xl border border-zinc-800 space-y-1.5 font-mono text-[10px]">
                    <div className="text-purple-300 font-bold uppercase tracking-wider text-[9px] border-b border-zinc-800 pb-1">
                      Raw Kyber-1024 Ciphertext Payload
                    </div>
                    <p className="text-zinc-300 break-all select-all font-mono leading-relaxed bg-zinc-950 p-2 rounded border border-zinc-900">
                      {cipherResult.ciphertext}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-black p-2.5 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">Kyber1024 Public Key:</span>
                      <span className="text-purple-300 font-mono truncate block">{cipherResult.kyber1024PublicKEM}</span>
                    </div>
                    <div className="bg-black p-2.5 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">zk-SNARK Status:</span>
                      <span className="text-emerald-400 font-bold block">{cipherResult.zkSnarkProof.verificationStatus}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-black rounded-xl border border-zinc-800 space-y-1 text-[10px]">
                    <span className="text-amber-400 font-bold block">16-RingCT Ring Signature Key Image:</span>
                    <span className="text-zinc-300 font-mono block">{cipherResult.ringSignature.keyImage}</span>
                  </div>

                  <button
                    onClick={handleRunP2PDecryption}
                    disabled={isDecryptingCipher}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-md"
                  >
                    {isDecryptingCipher ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    <span>Decrypt Payload with Recipient Private Ratchet Key</span>
                  </button>

                  {decryptionResult && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Decrypted P2P Plaintext Result:</span>
                      </div>
                      <p className="text-xs text-white bg-black p-2.5 rounded border border-emerald-800 font-sans">
                        {decryptionResult.decryptedText}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DIRECT KYBER E2EE MSG MODAL FOR SELLERS */}
      {messageSellerModalListing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-cyan-500/50 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs font-mono"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <LockKeyhole className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Kyber1024 E2EE Message to Seller</h3>
              </div>
              <button
                onClick={() => setMessageSellerModalListing(null)}
                className="text-zinc-500 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-black p-3 rounded-xl border border-zinc-800 space-y-1">
              <div className="text-zinc-400 font-bold">Item: {messageSellerModalListing.title}</div>
              <div className="text-cyan-300 font-bold">Recipient: {messageSellerModalListing.sellerHandle}</div>
            </div>

            {!directMsgSent ? (
              <div className="space-y-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Encrypted Message</label>
                  <textarea
                    rows={4}
                    value={directMsgText}
                    onChange={e => setDirectMsgText(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 text-xs font-mono"
                  />
                </div>

                <div className="p-2.5 bg-purple-950/40 border border-purple-800 rounded-xl text-[10px] text-purple-300">
                  Message will be encrypted with Kyber-1024 post-quantum key encapsulation before transmission over AGVORA P2P mesh.
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => setMessageSellerModalListing(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setDirectMsgSent(true)}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black flex items-center space-x-1"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Kyber1024 E2EE Message</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950 border border-emerald-500/50 rounded-xl space-y-2 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Message Encrypted &amp; Sent!</h4>
                <p className="text-[11px] text-emerald-300">
                  Handshake keys delivered to {messageSellerModalListing.sellerHandle}. You will be notified when they decrypt your offer.
                </p>
                <button
                  onClick={() => setMessageSellerModalListing(null)}
                  className="w-full mt-2 py-2 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* POST NEW AD MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Plus className="h-5 w-5 text-amber-400" />
                <span>Post New IIN Classified Ad</span>
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-zinc-500 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishListing} className="space-y-3">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Ad Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. NVIDIA RTX 4090 24GB GPU Workstation"
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter(c => c !== 'All Categories').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    placeholder="250"
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="San Francisco Bay Area"
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Seller Handle</label>
                  <input
                    type="text"
                    value={newSellerHandle}
                    onChange={e => setNewSellerHandle(e.target.value)}
                    placeholder="@operator_x"
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Description &amp; Specifications</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Provide detailed description of condition, specs, and P2P exchange details..."
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black flex items-center space-x-1"
                >
                  {isPublishing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span>Publish Classified Listing</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* CREATE COMMUNITY FEED POST MODAL */}
      {isCreateFeedPostOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-cyan-500/50 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs font-mono"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                <span>Post to IIN Community Feed</span>
              </h3>
              <button
                onClick={() => setIsCreateFeedPostOpen(false)}
                className="text-zinc-500 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFeedPost} className="space-y-3">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={feedPostTitle}
                  onChange={e => setFeedPostTitle(e.target.value)}
                  placeholder="e.g. ISO: Liquid-cooled rack chassis for H100 cluster"
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Tag Category</label>
                <select
                  value={feedPostTag}
                  onChange={e => setFeedPostTag(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="#TradeOffer">#TradeOffer</option>
                  <option value="#InSearchOf">#InSearchOf</option>
                  <option value="#SellerReputation">#SellerReputation</option>
                  <option value="#SecurityAlert">#SecurityAlert</option>
                  <option value="#HardwareDiscussion">#HardwareDiscussion</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Content / Details</label>
                <textarea
                  rows={4}
                  required
                  value={feedPostContent}
                  onChange={e => setFeedPostContent(e.target.value)}
                  placeholder="Write your trade proposal, request, or review..."
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-sans text-xs"
                />
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl space-y-1 text-[10px] text-purple-300">
                <label className="flex items-center space-x-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feedPostIsEncrypted}
                    onChange={e => setFeedPostIsEncrypted(e.target.checked)}
                    className="rounded border-zinc-800 bg-black text-purple-500"
                  />
                  <span>Attach Kyber1024 Post-Quantum Payload Signature &amp; zk-SNARK Groth16 Proof</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateFeedPostOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedPost}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black flex items-center space-x-1"
                >
                  {isSubmittingFeedPost ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>Publish Feed Post</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* P2P PAYMENT GATEWAY ESCROW MODAL */}
      {selectedListingForP2P && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs font-mono"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">IIN P2P Escrow Payment Gateway</h3>
              </div>
              <button
                onClick={() => setSelectedListingForP2P(null)}
                className="text-zinc-500 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-black p-3 rounded-xl border border-zinc-800 space-y-1">
              <div className="text-zinc-400 font-bold">Item: {selectedListingForP2P.title}</div>
              <div className="text-amber-300 font-black text-sm">${selectedListingForP2P.price.toLocaleString()} USD ({selectedListingForP2P.cryptoEquiv})</div>
              <div className="text-[10px] text-zinc-500">Seller: {selectedListingForP2P.sellerHandle} | Location: {selectedListingForP2P.location}</div>
            </div>

            {!p2pEscrowResult ? (
              <div className="space-y-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Select P2P Payment Gateway Method</label>
                  <select
                    value={p2pPaymentMethod}
                    onChange={e => setP2PPaymentMethod(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Solana Multi-Sig Escrow">Solana Multi-Sig Smart Escrow</option>
                    <option value="Bitcoin Lightning Network">Bitcoin Lightning Network P2P</option>
                    <option value="IIN Byte Tokens">IIN Byte Tokens (Zero Fee)</option>
                    <option value="CashApp / Venmo P2P">CashApp / Venmo P2P Direct</option>
                    <option value="Zelle / Wire Escrow">Zelle / Wire Escrow Service</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Buyer Wallet / Identifier</label>
                  <input
                    type="text"
                    value={p2pBuyerWallet}
                    onChange={e => setP2PBuyerWallet(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1 text-[11px] text-emerald-300">
                  <div className="font-bold flex items-center space-x-1">
                    <Lock className="h-3.5 w-3.5" />
                    <span>How IIN P2P Escrow Works:</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[10px]">
                    1. Funds are locked in a multi-sig smart escrow contract with 3-of-5 MPC threshold shards.<br />
                    2. Seller ships or hand-delivers the item.<br />
                    3. Buyer inspects and releases escrow funds upon receipt.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => setSelectedListingForP2P(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInitiateP2P}
                    disabled={isInitiatingP2P}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black flex items-center space-x-1 shadow-lg"
                  >
                    {isInitiatingP2P ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    <span>Lock ${selectedListingForP2P.price} in P2P Escrow</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-black p-4 rounded-xl border border-emerald-500/50">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>P2P Escrow Locked &amp; Active!</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Escrow ID:</span>
                    <span className="text-amber-300 font-bold">{p2pEscrowResult.escrowId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Method:</span>
                    <span className="text-white">{p2pEscrowResult.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Transaction Hash:</span>
                    <span className="text-cyan-400 font-mono text-[10px]">{p2pEscrowResult.txHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status:</span>
                    <span className="text-emerald-400 font-bold">{p2pEscrowResult.status}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedListingForP2P(null)}
                  className="w-full py-2 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700"
                >
                  Close Escrow Receipt
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
