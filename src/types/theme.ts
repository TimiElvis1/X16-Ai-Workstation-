export type ThemeId = 
  | 'shades-of-black'
  | 'monochrome-stealth'
  | 'pitch-black'
  | 'carbon-graphite'
  | 'cyber-dark'
  | 'matrix-emerald'
  | 'espresso-crema'
  | 'deep-abyss'
  | 'crimson-vortex'
  | 'nebula-purple'
  | 'arctic-aurora'
  | 'solar-amber'
  | 'synthwave-sunset'
  | 'tokyo-cyberpunk'
  | 'milky-cream'
  | 'oat-milk'
  | 'buttermilk-latte'
  | 'almond-milk'
  | 'coconut-cream'
  | 'matcha-milk'
  | 'warm-cashmere'
  | 'amethyst-royale'
  | 'cyber-mint'
  | 'tokyo-sakura'
  | 'nordic-glacier'
  | 'solar-blood-orange'
  | 'pure-light'
  | 'titanium-warm';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  category: 'milk' | 'light' | 'dark' | 'neon' | 'cyber' | 'unique';
  description: string;
  tagline: string;
  accentColor: string;
  secondaryColor: string;
  gradient: string;
  bgClass: string;
  surfaceClass: string;
  cardBgClass: string;
  borderClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  heroGradient: string;
  buttonPrimaryGradient: string;
  buttonText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glowColor: string;
  isDark: boolean;
  aiPromptMood: string;
  swatchColors?: [string, string, string];
}
