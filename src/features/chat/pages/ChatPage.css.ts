import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const slideIn = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
});

/* ─── Root ─── */
export const root = style({
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  fontFamily: "'DM Sans', sans-serif",
  '@media': {
    '(prefers-color-scheme: dark)': { background: '#131314' },
    '(prefers-color-scheme: light)': { background: '#f8f9fa' },
  },
});

/* ─── Fixed top-left toggle icon ─── */
export const sidebarToggleWrap = style({
  position: 'fixed',
  top: 100,
  left: 50,
  zIndex: 50,
});

export const sidebarToggleBtn = style({
  transition: 'color 150ms, background 150ms',
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.45)' },
    '(prefers-color-scheme: light)': { color: 'rgba(0,0,0,0.4)' },
  },
  ':hover': {
    color: 'var(--primary-color)',
    background: 'var(--primary-color-light) !important',
  },
});

/* ─── Backdrop when sidebar is open ─── */
export const sidebarBackdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 150,
  background: 'rgba(0,0,0,0.25)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
});

/* ─── Sidebar drawer ─── */
export const sidebarDrawer = style({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  zIndex: 200,
  transform: 'translateX(-100%)',
  transition: 'transform 260ms cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: 'transform',
  '@media': {
    '(prefers-color-scheme: dark)': { boxShadow: '4px 0 24px rgba(0,0,0,0.5)' },
    '(prefers-color-scheme: light)': { boxShadow: '4px 0 24px rgba(0,0,0,0.12)' },
  },
});

export const sidebarDrawerOpen = style({
  transform: 'translateX(0)',
});

/* ─── Main chat fills full screen ─── */
export const chatMain = style({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

/* ─── Scroll area ─── */
export const scrollArea = style({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  '@media': {
    '(prefers-color-scheme: dark)': { scrollbarColor: 'rgba(255,255,255,0.06) transparent' },
    '(prefers-color-scheme: light)': { scrollbarColor: 'rgba(0,0,0,0.06) transparent' },
  },
});

/* ─── Centered content column ─── */
export const contentCol = style({
  maxWidth: 760,
  width: '100%',
  margin: '0 auto',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  /* nudge content right of the toggle icon on small screens */
  paddingLeft: 48,
  paddingRight: 16,
  '@media': {
    '(min-width: 640px)': {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
});

/* ─── Empty state ─── */
export const emptyWrap = style({
  flex: 1,
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
});

export const emptyRing = style({
  width: 60,
  height: 60,
  borderRadius: 18,
  '@media': {
    '(prefers-color-scheme: dark)': {
      background: 'var(--primary-color-dark-20)',
      boxShadow: '0 0 0 1px var(--primary-color-dark-30)',
    },
    '(prefers-color-scheme: light)': {
      background: 'var(--primary-color-light)',
      boxShadow: '0 0 0 1px var(--primary-color-light-dark)',
    },
  },
});

export const emptyIcon = style({ color: 'var(--primary-color)' });

export const emptyHeading = style({
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: '-0.025em',
  '@media': {
    '(prefers-color-scheme: dark)': { color: '#f0ede8' },
    '(prefers-color-scheme: light)': { color: '#181818' },
  },
});

/* ─── Suggestion chips ─── */
export const chip = style({
  cursor: 'pointer',
  transition: 'all 160ms ease',
  '@media': {
    '(prefers-color-scheme: dark)': {
      background: 'rgba(255,255,255,0.03)',
      borderColor: 'rgba(255,255,255,0.08) !important',
      color: 'rgba(255,255,255,0.55)',
    },
    '(prefers-color-scheme: light)': {
      background: '#fff',
      borderColor: 'rgba(0,0,0,0.08) !important',
      color: '#2a2a2a',
    },
  },
  ':hover': {
    borderColor: 'var(--primary-color-dim) !important',
    color: 'var(--primary-color)',
    transform: 'translateY(-1px)',
    boxShadow: 'var(--primary-color-shadow)',
  },
});

/* ─── AI avatar ─── */
export const aiAvatar = style({
  flexShrink: 0,
  '@media': {
    '(prefers-color-scheme: dark)': {
      background: 'var(--primary-color-dark-20) !important',
      color: 'var(--primary-color) !important',
    },
    '(prefers-color-scheme: light)': {
      background: 'var(--primary-color-light) !important',
      color: 'var(--primary-color) !important',
    },
  },
});

/* ─── Typing pill ─── */
export const typingPill = style({
  animation: `${fadeUp} 200ms ease`,
  '@media': {
    '(prefers-color-scheme: dark)': {
      background: 'rgba(255,255,255,0.04) !important',
      borderColor: 'rgba(255,255,255,0.07) !important',
    },
    '(prefers-color-scheme: light)': {
      background: '#fff !important',
      borderColor: 'rgba(0,0,0,0.07) !important',
    },
  },
});

/* ─── Input outer ─── */
export const inputOuter = style({
  flexShrink: 0,
  padding: '8px 24px 12px',
  '@media': {
    '(prefers-color-scheme: dark)': { background: '#131314' },
    // '(prefers-color-scheme: light)': { background: '#fff' },
  },
});

export const inputCol = style({
  maxWidth: 760,
  width: '100%',
  margin: '0 auto',
});

export const inputCard = style({
  transition: 'box-shadow 180ms, border-color 180ms',
  '@media': {
    '(prefers-color-scheme: dark)': {
      background: 'rgba(255,255,255,0.03) !important',
      borderColor: 'rgba(255,255,255,0.09) !important',
    },
    '(prefers-color-scheme: light)': {
      background: '#fff !important',
      borderColor: 'rgba(0,0,0,0.09) !important',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    },
  },
  ':focus-within': {
    borderColor: 'var(--primary-color-dim) !important',
    boxShadow: 'var(--primary-color-focus)',
  },
});

export const textarea = style({
  fontFamily: "'DM Sans', sans-serif",
  '@media': {
    '(prefers-color-scheme: dark)': { color: '#f0ede8' },
    '(prefers-color-scheme: light)': { color: '#1a1a1a' },
  },
});

export const sendBtn = style({
  background: 'var(--primary-color) !important',
  color: '#fff !important',
  flexShrink: 0,
  transition: 'transform 150ms, background 150ms',
  ':hover': {
    background: 'var(--primary-color-dark) !important',
    transform: 'scale(1.06)',
  },
  ':disabled': {
    background: 'rgba(0,0,0,0.07) !important',
    color: 'rgba(0,0,0,0.2) !important',
    transform: 'none',
  },
});

export const inputHint = style({
  fontSize: 11,
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.18)' },
    '(prefers-color-scheme: light)': { color: 'rgba(0,0,0,0.3)' },
  },
});
