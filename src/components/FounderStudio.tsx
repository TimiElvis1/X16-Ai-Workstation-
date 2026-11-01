import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Cpu, 
  Eye, 
  Music, 
  BookOpen, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Download, 
  ExternalLink, 
  Code2, 
  Layers, 
  Share2, 
  CheckCircle2, 
  Heart, 
  Quote, 
  FileText,
  Copy,
  Brain,
  Globe2,
  Lock,
  ArrowRight,
  ZoomIn,
  X,
  Upload,
  RefreshCw,
  Camera,
  Check
} from 'lucide-react';
import defaultFounderPortrait from '../assets/images/dr_victor_organic_portrait_1788185796854.jpg';

interface FounderStudioProps {
  onNavigateTab?: (tab: string) => void;
  isDark?: boolean;
}

export const FounderStudio: React.FC<FounderStudioProps> = ({
  onNavigateTab,
  isDark = true
}) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'vision' | 'milestones' | 'creative' | 'attestation'>('profile');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState<boolean>(false);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState<number>(0);
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    return localStorage.getItem('iin_founder_photo_custom') || null;
  });
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const activePhotoSrc = customPhoto || defaultFounderPortrait;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setCustomPhoto(result);
          localStorage.setItem('iin_founder_photo_custom', result);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    setCustomPhoto(null);
    localStorage.removeItem('iin_founder_photo_custom');
  };

  const copyContactEmail = () => {
    navigator.clipboard.writeText('drvictoragboola@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const quotes = [
    {
      quote: "Computing is not merely an engineering discipline—it is an art form of structured logic and intentional freedom.",
      context: "On Independent Frontier Computing"
    },
    {
      quote: "True innovation begins when you dare to build computational infrastructure from first principles rather than borrowing outdated paradigms.",
      context: "On Architecting the Intentional Infrastructure Network (IIN)"
    },
    {
      quote: "Creating on one's own terms with intellectual independence yields the highest caliber of scientific and artistic breakthrough.",
      context: "On Creative Autonomy"
    }
  ];

  const milestones = [
    {
      year: "1995",
      title: "Origins & Early Computing Genesis",
      description: "Born November 13, 1995. Developed early fascination with computing architecture on Pentium 4 systems, initiating a lifelong pursuit of technological excellence.",
      tag: "Foundational",
      icon: Cpu
    },
    {
      year: "Academic",
      title: "Computer Engineering Distinction",
      description: "Studied Computer Engineering in Ekiti State, Nigeria. Graduated with top distinction and led his graduating class through exceptional academic and technical performance.",
      tag: "Honors",
      icon: Award
    },
    {
      year: "Post-Graduate",
      title: "Advanced Artificial Intelligence (UAE)",
      description: "Advanced his specialization in Artificial Intelligence and neural computing in the United Arab Emirates, mastering deep learning, neural architectures, and computational systems.",
      tag: "Research",
      icon: Brain
    },
    {
      year: "Enterprise",
      title: "Founding Frontier Tech & CV SDK",
      description: "Returned to Nigeria to establish his frontier technology company. Architected high-performance Computer Vision SDKs, edge inference systems, and advanced SIMD pipelines.",
      tag: "Innovation",
      icon: Eye
    },
    {
      year: "Present",
      title: "Intentional Infrastructure Network (IIN)",
      description: "Architected IIN — a decentralized sovereign internet workspace, combining 20 VIP protocols, 17 DIOP standards, cryptographic AST execution engines, and autonomous AI agents.",
      tag: "Flagship",
      icon: Layers
    }
  ];

  const pillars = [
    {
      title: "Artificial Intelligence & Neural Systems",
      icon: Brain,
      color: "from-amber-500 to-orange-600",
      description: "Researching autonomous reasoning models, agentic execution engines, and low-latency transformer inference optimized for decentralized topologies."
    },
    {
      title: "Computer Vision & SIMD Acceleration",
      icon: Eye,
      color: "from-cyan-500 to-blue-600",
      description: "Architecting high-throughput C++ AVX-512 and SIMD optical flow pipelines, spatial telemetry, and edge perception models."
    },
    {
      title: "Sovereign Internet Protocols",
      icon: Globe2,
      color: "from-emerald-500 to-teal-600",
      description: "Pioneering Virtual Internet Protocols (VIP) and Decentralized Internet Overlay Protocols (DIOP) with post-quantum lattice security."
    },
    {
      title: "Music & Literary Authorship",
      icon: Music,
      color: "from-purple-500 to-indigo-600",
      description: "Prolific musician and writer blending algorithmic precision with harmonic composition, philosophical essays, and independent thought."
    }
  ];

  const handleExportBio = () => {
    const bioText = `DR. VICTOR AGBOOLA — FOUNDER, TECHNOLOGIST & INNOVATOR
=========================================================
Title: Founder & Principal Architect, Intentional Infrastructure Network (IIN)
Date of Birth: November 13, 1995
Origin: Nigeria
Email: drvictoragboola@gmail.com

EXECUTIVE PROFILE:
Born November 13, 1995, Dr. Agboola Victor is a Nigerian technology entrepreneur, AI researcher, inventor, musician, and writer. His fascination with computing began early with a Pentium 4—an experience that would evolve into a lifelong pursuit of technological excellence.

He studied Computer Engineering in Ekiti State, graduating with distinction and leading his class, before advancing his studies in Artificial Intelligence in the UAE. Returning to Nigeria, he founded his own technology company with an ambition to develop solutions at the frontier of computing and advanced science.

His work spans artificial intelligence, computer vision, and emerging computational systems, including the development of a Computer Vision SDK.

Beyond technology, Dr. Agboola Victor is a prolific musician and writer. He remains committed to intellectual independence, innovation, and an unconventional approach to life—preferring the companionship of pets and the freedom to create on his own terms.

TECHNICAL PILLARS:
- Intentional Infrastructure Network (IIN)
- Computer Vision SDK & SIMD AVX-512 Tensor Pipelines
- Autonomous Agent Execution Engines
- Cryptographic Protocol Design (VIP & DIOP)
- Post-Quantum Lattice Verifiers & W3C DID Identity Anchors

(c) ${new Date().getFullYear()} Dr. Victor Agboola. All rights reserved.`;

    const blob = new Blob([bioText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dr_Victor_Agboola_Founder_Profile_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="founder-page-studio" className="space-y-8 animate-fadeIn">
      
      {/* EXECUTIVE HERO CARD */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-zinc-800/80 shadow-2xl shadow-black/40' 
          : 'bg-gradient-to-br from-[#ffffff] via-[#faf6ee] to-[#f4edd9] border-[#e8dfd3] shadow-md'
      }`}>
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* FOUNDER PORTRAIT SECTION */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group">
                
                {/* Prestigious Aura Ring */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 via-cyan-400 to-yellow-400 rounded-3xl blur-md opacity-50 group-hover:opacity-90 transition-all duration-500"></div>
                
                <div 
                  className={`relative w-64 sm:w-72 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden border-2 shadow-2xl cursor-pointer ${
                    isDark ? 'border-amber-400/60 bg-zinc-950' : 'border-[#b45309]/50 bg-white'
                  }`}
                  onClick={() => setIsPhotoZoomed(true)}
                  title="Click to view high-resolution portrait"
                >
                  <img 
                    src={activePhotoSrc}
                    alt="Dr. Victor Agboola — Founder, Technologist & Innovator"
                    className="w-full h-full object-cover object-top filter contrast-100 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Photo Overlay Tag */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex items-center justify-between text-white">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-300 tracking-wider uppercase block">
                        Dr. Victor Agboola
                      </span>
                      <span className="text-[10px] text-zinc-300 font-sans">
                        Founder &amp; Chief Architect
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-cyan-300">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Photo Upload & Organic Options */}
              <div className="mt-3 flex items-center gap-2">
                <label className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center space-x-1.5 cursor-pointer transition-all ${
                  isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-zinc-700' : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                }`}>
                  <Upload className="h-3.5 w-3.5 text-amber-400" />
                  <span>{customPhoto ? 'Replace Photo' : 'Upload Original Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {customPhoto && (
                  <button
                    onClick={handleResetPhoto}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border flex items-center space-x-1 transition-all cursor-pointer ${
                      isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800' : 'bg-[#faf6ee] text-[#44403c] border-[#e8dfd3]'
                    }`}
                    title="Reset to default organic portrait"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {uploadSuccess && (
                <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center space-x-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Original photo applied and saved!</span>
                </div>
              )}

              {/* Identity & Status Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center space-x-1.5 ${
                  isDark ? 'bg-amber-950/80 text-amber-300 border-amber-800/80' : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Verified Founder &amp; Inventor</span>
                </span>
                
                <span className={`px-3 py-1 rounded-full text-xs font-mono border ${
                  isDark ? 'bg-zinc-900 text-cyan-300 border-zinc-800' : 'bg-[#f7f3eb] text-cyan-800 border-[#e8dfd3]'
                }`}>
                  Born Nov 13, 1995
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-mono border ${
                  isDark ? 'bg-zinc-900 text-purple-300 border-zinc-800' : 'bg-[#f7f3eb] text-purple-800 border-[#e8dfd3]'
                }`}>
                  Status: Single • Independent Creator
                </span>
              </div>
            </div>

            {/* FOUNDER EXECUTIVE BIO HEADER */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black shadow-sm">
                    Founder Profile
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono border ${
                    isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300'
                  }`}>
                    Intentional Infrastructure Network (IIN)
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  <span className={`bg-gradient-to-r ${
                    isDark 
                      ? 'from-amber-200 via-white to-amber-400' 
                      : 'from-[#1c1917] via-[#44403c] to-[#92400e]'
                  } bg-clip-text text-transparent`}>
                    Dr Victor — Founder, Technologist &amp; Innovator
                  </span>
                </h1>

                <p className={`text-base sm:text-lg font-medium leading-relaxed font-sans ${
                  isDark ? 'text-zinc-300' : 'text-[#44403c]'
                }`}>
                  Nigerian technology entrepreneur, artificial intelligence researcher, inventor, musician, and writer architecting next-generation computational infrastructure and sovereign protocols.
                </p>
              </div>

              {/* FULL NARRATIVE PROFILE */}
              <div className={`p-6 rounded-2xl border space-y-4 text-sm sm:text-base leading-relaxed ${
                isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300' : 'bg-white/80 border-[#e8dfd3] text-[#292524]'
              }`}>
                <p>
                  Born November 13, 1995, <strong className={isDark ? 'text-amber-300' : 'text-[#92400e]'}>Dr Agboola Victor</strong> is a Nigerian technology entrepreneur, AI researcher, inventor, musician, and writer. His fascination with computing began early with a Pentium 4—an experience that would evolve into a lifelong pursuit of technological excellence.
                </p>
                <p>
                  He studied Computer Engineering in Ekiti State, graduating with distinction and leading his class, before advancing his studies in Artificial Intelligence in the UAE. Returning to Nigeria, he founded his own technology company with an ambition to develop solutions at the frontier of computing and advanced science.
                </p>
                <p>
                  His work spans artificial intelligence, computer vision, and emerging computational systems, including the development of a high-performance Computer Vision SDK.
                </p>
                <p className="italic border-l-2 border-amber-500 pl-4 py-1">
                  Beyond technology, Dr Agboola Victor is a prolific musician and writer. He remains committed to intellectual independence, innovation, and an unconventional approach to life—preferring the companionship of pets and the freedom to create on his own terms.
                </p>
              </div>

              {/* ACTION BUTTONS & DIRECT CONTACT */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={copyContactEmail}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black hover:brightness-110 transition-all flex items-center space-x-2 shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  {isCopied ? <CheckCircle2 className="h-4 w-4 text-black" /> : <Mail className="h-4 w-4" />}
                  <span>{isCopied ? 'Email Copied!' : 'Contact Dr. Victor'}</span>
                </button>

                <button
                  onClick={handleExportBio}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center space-x-2 cursor-pointer ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800' 
                      : 'bg-[#faf6ee] border-[#dfd4c3] text-[#44403c] hover:bg-white'
                  }`}
                >
                  <Download className="h-4 w-4 text-cyan-400" />
                  <span>Download Executive Bio</span>
                </button>

                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('advance_crypto_tools')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center space-x-2 cursor-pointer ${
                      isDark 
                        ? 'bg-zinc-900 border-cyan-500/40 text-cyan-300 hover:bg-zinc-800' 
                        : 'bg-white border-cyan-300 text-cyan-800 hover:bg-cyan-50'
                    }`}
                  >
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    <span>Explore IIN Architecture</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* INTERACTIVE NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'profile', label: 'Core Pillars & Research', icon: Brain },
            { id: 'milestones', label: 'Academic & Career Milestones', icon: Award },
            { id: 'vision', label: 'IIN Network Philosophy', icon: Globe2 },
            { id: 'creative', label: 'Creative Works & Authorship', icon: Music },
            { id: 'attestation', label: 'Cryptographic Attestation', icon: Lock }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-950/40'
                    : isDark 
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' 
                      : 'text-[#78716c] hover:text-[#1c1917] hover:bg-[#f7f3eb]'
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-zinc-500 hidden sm:block">
          Dr. Victor Agboola • Sovereign Dossier
        </div>
      </div>

      {/* SECTION CONTENT DISPLAY */}
      <div className="space-y-6">
        
        {/* SECTION 1: CORE PILLARS */}
        {activeSection === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${
                    isDark 
                      ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 shadow-lg' 
                      : 'bg-white border-[#e8dfd3] hover:border-[#dfd4c3] shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${pillar.color} text-white shadow-md shrink-0`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                        {pillar.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#57534e]'}`}>
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SECTION 2: MILESTONES TIMELINE */}
        {activeSection === 'milestones' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-8 animate-fadeIn ${
            isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white border-[#e8dfd3]'
          }`}>
            <div className="space-y-1">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                Trajectory of Technological Excellence
              </h3>
              <p className={`text-xs sm:text-sm font-mono ${isDark ? 'text-zinc-400' : 'text-[#78716c]'}`}>
                Key milestones from early Pentium 4 hardware exploration to frontier AI systems.
              </p>
            </div>

            <div className="relative border-l-2 border-amber-500/40 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
              {milestones.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-[35px] sm:-left-[43px] top-0 p-1.5 rounded-full bg-zinc-950 border-2 border-amber-400 text-amber-300 shadow-md">
                      <IconComp className="h-4 w-4" />
                    </div>

                    <div className={`p-5 rounded-2xl border transition-all ${
                      isDark 
                        ? 'bg-zinc-900/90 border-zinc-800 group-hover:border-amber-500/50' 
                        : 'bg-[#faf6ee] border-[#e8dfd3] group-hover:border-amber-400'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {item.year}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-[#44403c]'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: VISION & PHILOSOPHY */}
        {activeSection === 'vision' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quote of Note */}
            <div className={`p-8 rounded-3xl border relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black border-amber-500/40' 
                : 'bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-amber-200'
            }`}>
              <Quote className="h-12 w-12 text-amber-500/30 absolute top-4 right-4" />
              <div className="relative z-10 space-y-4 max-w-3xl">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  {quotes[activeQuoteIdx].context}
                </span>
                <p className={`text-lg sm:text-2xl font-serif italic leading-relaxed ${
                  isDark ? 'text-white' : 'text-[#1c1917]'
                }`}>
                  "{quotes[activeQuoteIdx].quote}"
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <div className="flex space-x-1.5">
                    {quotes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveQuoteIdx(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          activeQuoteIdx === i ? 'bg-amber-400 w-6' : 'bg-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-zinc-500">— Dr. Victor Agboola</span>
                </div>
              </div>
            </div>

            {/* Vision Principles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border space-y-3 ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-[#e8dfd3] text-[#44403c]'
              }`}>
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base text-white">Sovereignty by Design</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
                  Building software and protocols that empower users with full data ownership, cryptographic verifiability, and resistance to single points of failure.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border space-y-3 ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-[#e8dfd3] text-[#44403c]'
              }`}>
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 w-fit">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base text-white">High-Performance SIMD Computing</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
                  Direct hardware utilization through custom C++ AVX-512 kernels, zero-copy packet switching, and accelerated neural processing.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border space-y-3 ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-[#e8dfd3] text-[#44403c]'
              }`}>
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base text-white">Autonomous Agentic Synthesis</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
                  Empowering AI models to not only answer questions, but autonomously execute infrastructure provisioning, code compilation, and port orchestration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: CREATIVE WORKS */}
        {activeSection === 'creative' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 animate-fadeIn ${
            isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white border-[#e8dfd3]'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Music className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                  Artistic Endeavors, Music &amp; Authorship
                </h3>
                <p className={`text-xs sm:text-sm font-mono ${isDark ? 'text-zinc-400' : 'text-[#78716c]'}`}>
                  Exploring the nexus between mathematical algorithms, sound synthesis, and philosophical prose.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#faf6ee] border-[#e8dfd3]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase">Music &amp; Sonic Synthesis</span>
                  <Music className="h-4 w-4 text-purple-400" />
                </div>
                <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                  Harmonic Systems &amp; Composition
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-[#44403c]'}`}>
                  As a prolific musician, Dr. Victor explores complex time signatures, polyphonic textures, and electronic synth modulation, treating music as acoustic architecture.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#faf6ee] border-[#e8dfd3]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">Literary Works &amp; Essays</span>
                  <BookOpen className="h-4 w-4 text-amber-400" />
                </div>
                <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                  Philosophical &amp; Technical Authorship
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-[#44403c]'}`}>
                  Writing essays on computational sovereignty, human cognition, creative autonomy, and unconventional lifestyles anchored in intellectual liberty.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: ATTESTATION */}
        {activeSection === 'attestation' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 animate-fadeIn ${
            isDark ? 'bg-zinc-950/90 border-zinc-800 font-mono' : 'bg-white border-[#e8dfd3] font-mono'
          }`}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-amber-400" />
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                  W3C DID Cryptographic Identity Anchor
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                VALIDATED ON IIN MESH
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className={`p-4 rounded-xl border space-y-1 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#faf6ee] border-[#e8dfd3] text-[#44403c]'
              }`}>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Founder DID</span>
                <span className="font-mono text-cyan-400 break-all select-all">
                  did:iin:founder:ed25519:0x7F2e89A42a9b3112028Cef8109d4310E39A20b3C
                </span>
              </div>

              <div className={`p-4 rounded-xl border space-y-1 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#faf6ee] border-[#e8dfd3] text-[#44403c]'
              }`}>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Public Key (Ed25519)</span>
                <span className="font-mono text-amber-300 break-all select-all">
                  ed25519_pk1vq90z4a887m3f62e89a42a9b3112028cef8109d4310e39a20b3c
                </span>
              </div>

              <div className={`p-4 rounded-xl border space-y-1 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#faf6ee] border-[#e8dfd3] text-[#44403c]'
              }`}>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Direct Communication Channel</span>
                <span className="font-mono text-emerald-400 select-all">
                  drvictoragboola@gmail.com
                </span>
              </div>

              <div className={`p-4 rounded-xl border space-y-1 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#faf6ee] border-[#e8dfd3] text-[#44403c]'
              }`}>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Mesh Consensus Role</span>
                <span className="font-mono text-purple-300">
                  Genesis Architect &amp; Sovereign Root Verifier
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-[11px] text-zinc-400 leading-relaxed ${
              isDark ? 'bg-black/60 border-zinc-800' : 'bg-[#f7f3eb] border-[#dfd4c3]'
            }`}>
              Attestation Hash: <code className="text-amber-300">sha256(DrVictorAgboola_IIN_Genesis_19951113_Ekiti_UAE_FrontierAI)</code>
            </div>
          </div>
        )}

      </div>

      {/* FULL PHOTO ZOOM MODAL */}
      <AnimatePresence>
        {isPhotoZoomed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-2xl w-full bg-zinc-950 border border-amber-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <span className="font-bold text-white font-mono text-sm">
                    Dr. Victor Agboola — Executive Portrait
                  </span>
                </div>
                <button 
                  onClick={() => setIsPhotoZoomed(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="aspect-[3/4] max-h-[70vh] rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center bg-black">
                <img 
                  src={activePhotoSrc}
                  alt="Dr. Victor Agboola"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
                <span>Dr. Victor — Founder, Technologist &amp; Innovator</span>
                <span className="text-amber-400">Intentional Infrastructure Network (IIN)</span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
