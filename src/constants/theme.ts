/**
 * FractionPizzaLab — theme.
 * Preset: CYBERPUNK (design-system/preset.ts), accent colours overridden to the
 * brief hexes per rule #11b. The `name` field stays verbatim from the preset.
 */
export const theme = {
  name: 'cyberpunk',

  colors: {
    bg: {
      primary: '#181022', // base (brief override of preset #0A0014)
      secondary: '#231438', // sheets / control panels
      tertiary: '#2E1A45', // clay cards
      accent: '#251538', // board disc
      muted: '#552659', // locked / disabled surfaces
    },
    accent: {
      lime: '#8DE028', // primary action accent
      limeSoft: '#A8F03C',
      limeDeep: '#6FB81C',
      purple: '#642AAB', // secondary accent / surfaces
      purpleSoft: '#8B4BD6',
    },
    text: {
      primary: '#ECE9F0',
      secondary: 'rgba(236,233,240,0.62)',
      muted: 'rgba(236,233,240,0.42)',
      faint: 'rgba(236,233,240,0.28)',
      onAccent: '#181022',
    },
    ui: {
      border: 'rgba(236,233,240,0.12)',
      hairline: 'rgba(236,233,240,0.1)',
      highlight: 'rgba(236,233,240,0.08)',
      limeBorder: 'rgba(141,224,40,0.35)',
      limeFaint: 'rgba(141,224,40,0.18)',
      purpleBorder: 'rgba(100,42,171,0.75)',
      purpleFill: 'rgba(100,42,171,0.45)',
      glass: 'rgba(46,26,69,0.85)',
      header: 'rgba(24,16,34,0.72)',
      overlay: 'rgba(24,16,34,0.82)',
    },
  },

  gradients: {
    cta: ['#A8F03C', '#8DE028', '#6FB81C'],
    loader: ['rgba(24,16,34,0.94)', 'rgba(85,38,89,0.88)', 'rgba(24,16,34,0.97)'],
    menu: ['rgba(24,16,34,0.25)', 'rgba(24,16,34,0.35)', 'rgba(24,16,34,0.96)'],
    game: ['rgba(24,16,34,0.88)', 'rgba(37,21,56,0.92)', 'rgba(24,16,34,0.95)'],
    result: ['rgba(100,42,171,0.55)', 'rgba(24,16,34,0.93)'],
    facts: ['rgba(24,16,34,0.9)', 'rgba(85,38,89,0.86)', 'rgba(24,16,34,0.94)'],
    bar: ['#8DE028', '#642AAB'],
  },

  typography: {
    hero: { fontSize: 36, fontWeight: '900' as const, letterSpacing: 1.5 },
    title: { fontSize: 24, fontWeight: '800' as const, letterSpacing: 1.2 },
    subtitle: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 0.6 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2, lineHeight: 21 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.6 },
    number: { fontSize: 22, fontWeight: '900' as const, letterSpacing: 0.4 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },

  radius: { sm: 10, md: 14, lg: 18, xl: 20, xxl: 28, pill: 100 },

  shadows: {
    clay: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 20,
      elevation: 12,
    },
    sheet: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 18,
    },
    cta: {
      shadowColor: '#8DE028',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 12,
    },
    purple: {
      shadowColor: '#642AAB',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 26,
      elevation: 14,
    },
  },

  animation: {
    spring: { tension: 48, friction: 9 },
    pop: { tension: 70, friction: 6 },
    press: { tension: 300, friction: 12 },
    fade: 280,
    piece: 220,
    resultDelay: 650,
  },
};

export type Theme = typeof theme;
export default theme;
