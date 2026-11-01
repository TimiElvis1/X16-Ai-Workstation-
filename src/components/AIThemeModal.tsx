import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Dices, 
  Check, 
  X, 
  Sun, 
  Moon, 
  Zap, 
  Palette, 
  Bot, 
  RefreshCw, 
  Sliders, 
  Flame,
  Waves,
  Cpu,
  Layers,
  Sparkle
} from 'lucide-react';
import { ThemeId, ThemePreset } from '../types/theme';
import { THEME_PRESETS, THEME_IDS, getRandomThemeId } from '../utils/themePresets';

interface AIThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  onRandomTheme: () => void;
  isAutoCycleActive?: boolean;
  onToggleAutoCycle?: () => void;
}

export const AIThemeModal: React.FC<AIThemeModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
  onRandomTheme,
  isAutoCycleActive = false,
  onToggleAutoCycle
}) => {
  const currentTheme = THEME_PRESETS[currentThemeId] || THEME_PRESETS['cyber-dark'];
  const [filterCategory, setFilterCategory] = React.useState<string>('all');

  const filteredThemes = THEME_IDS.map(id => THEME_PRESETS[id]).filter(t => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'dark') return t.isDark;
    if (filterCategory === 'light') return !t.isDark;
    return t.category === filterCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden z-10 ${
              currentTheme.isDark 
                ? 'bg-zinc-950/95 border-zinc-800 text-zinc-100' 
                : 'bg-white/95 border-slate-300 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-6 sm:p-8 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              currentTheme.isDark ? 'border-zinc-800/80 bg-zinc-900/60' : 'border-slate-200 bg-slate-50/80'
            }`}>
              <div className="flex items-center space-x-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                  <Bot className="h-7 w-7 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      VOX AI Theme Engine
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      {THEME_IDS.length} PALETTES
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm mt-1 font-mono ${currentTheme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Toggle themes randomly with AI or customize individual aesthetic presets.
                  </p>
                </div>
              </div>

              {/* Close Button & AI Random Quick Trigger */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={onRandomTheme}
                  className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white flex items-center space-x-2.5 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm"
                >
                  <Dices className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>🎲 Milk &amp; Theme Shuffle</span>
                </button>

                <button
                  onClick={onClose}
                  className={`p-3 rounded-2xl border transition-all ${
                    currentTheme.isDark 
                      ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white' 
                      : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Active Theme Highlight Banner */}
            <div className={`p-4 sm:p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              currentTheme.isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-slate-100/60 border-slate-200'
            }`}>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-2xl shadow-inner border border-white/20 flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.accentColor}, ${currentTheme.secondaryColor})` }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-bold">Active Theme</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                      {currentTheme.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">{currentTheme.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono italic">"{currentTheme.aiPromptMood}"</p>
                </div>
              </div>

              {/* Theme Categories Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Palettes' },
                  { id: 'dark', label: '🖤 Shades of Black' },
                  { id: 'cyber', label: '⚡ Cyber & Stealth' },
                  { id: 'neon', label: '🌟 Neon Matrix' },
                  { id: 'unique', label: '✨ Unique Palettes' },
                  { id: 'milk', label: '🥛 Milk & Cream' },
                  { id: 'light', label: '☀️ Light Mode' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                      filterCategory === cat.id
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : currentTheme.isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          : 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}

                {onToggleAutoCycle && (
                  <button
                    onClick={onToggleAutoCycle}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                      isAutoCycleActive
                        ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                        : currentTheme.isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-200 border-slate-300 text-slate-700'
                    }`}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isAutoCycleActive ? 'animate-spin' : ''}`} />
                    <span>Auto-Cycle: {isAutoCycleActive ? 'ON' : 'OFF'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Themes Grid List */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[55vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredThemes.map(theme => {
                const isSelected = theme.id === currentThemeId;
                return (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 shadow-xl ring-2 ring-cyan-400/40 bg-zinc-900/90'
                        : currentTheme.isDark
                          ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {/* Top Palette Preview Bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-7 h-7 rounded-xl shadow-md border border-white/20 flex items-center justify-center shrink-0"
                          style={{ background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.secondaryColor})` }}
                        />
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                          {theme.category.toUpperCase()}
                        </span>
                      </div>

                      {isSelected ? (
                        <div className="flex items-center space-x-1 text-cyan-400 font-mono text-xs font-bold bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
                          <Check className="h-3.5 w-3.5" />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondaryColor }} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 my-2">
                      <h4 className={`text-base font-black ${isSelected ? 'text-cyan-300' : ''}`}>
                        {theme.name}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {theme.description}
                      </p>
                    </div>

                    {/* Bottom AI Mood Label & Apply Action */}
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[170px]">
                        {theme.tagline}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTheme(theme.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                          isSelected
                            ? 'bg-cyan-400 text-black shadow-md'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Apply'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 sm:p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
              currentTheme.isDark ? 'border-zinc-800/80 bg-zinc-900/60 text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}>
              <div className="flex items-center space-x-2">
                <Sparkle className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span>AI themes automatically restyle all 18+ workspace modules, buttons, cards, and data charts.</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
