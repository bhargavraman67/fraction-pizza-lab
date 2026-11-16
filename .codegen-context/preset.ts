export const CYBERPUNK = {
  name: 'cyberpunk',

  colors: {
    bg: {
      primary: '#0A0014',       // deep purple-black
      secondary: '#120026',
      tertiary: '#1A0038',
      accent: '#0D1B2A',
    },
    cyber: {
      violet: '#8B00FF',
      blue: '#00D4FF',
      pink: '#FF2E97',
      green: '#00FF9F',
      orange: '#FF6B00',
    },
    text: {
      primary: '#E0D0FF',       // light purple-white
      secondary: '#7B68AE',
      accent: '#00D4FF',
      muted: '#4A3D6A',
      glitch: '#FF2E97',        // for "glitchy" elements
    },
    ui: {
      border: '#2A1A4A',
      divider: '#1E0E3A',
      overlay: 'rgba(10, 0, 20, 0.85)',
      glass: 'rgba(18, 0, 38, 0.8)',
      scanline: 'rgba(0, 212, 255, 0.03)',  // thin horizontal lines
    },
  },

  gradients: {
    primary: ['#8B00FF', '#00D4FF'],
    surface: ['#120026', '#0D1B2A'],
    button: ['#FF2E97', '#8B00FF'],
    reward: ['#00FF9F', '#00D4FF'],
    header: ['#0A0014', '#1A0038'],
    glitch: ['#FF2E97', '#00D4FF', '#8B00FF'],
  },

  typography: {
    hero: { fontSize: 46, fontWeight: '900' as const, letterSpacing: -2 },
    title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: 1 },
    subtitle: { fontSize: 16, fontWeight: '500' as const, letterSpacing: 2 },
    body: { fontSize: 14, fontWeight: '400' as const, letterSpacing: 0.3 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 2, textTransform: 'uppercase' as const },
    button: { fontSize: 14, fontWeight: '700' as const, letterSpacing: 3, textTransform: 'uppercase' as const },
    score: { fontSize: 44, fontWeight: '900' as const, letterSpacing: -2 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },

  radius: {
    sm: 2,          // cyber = sharp corners
    md: 6,
    lg: 10,
    xl: 14,
    pill: 100,
    cut: 0,         // fully straight
  },

  shadows: {
    card: {
      shadowColor: '#8B00FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    button: {
      shadowColor: '#FF2E97',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 12,
    },
  },

  animation: {
    spring: { tension: 150, friction: 6 },     // fast, snappy
    bounce: { tension: 250, friction: 8 },
    smooth: { duration: 200 },
    slow: { duration: 400 },
  },
};

// ============================================================
// DARK PREMIUM — muted colours, elegance, minimalism
// ============================================================
