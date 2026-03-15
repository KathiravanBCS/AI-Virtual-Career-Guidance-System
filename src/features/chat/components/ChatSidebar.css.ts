import { keyframes, style } from '@vanilla-extract/css';

const dpAnimation = keyframes({
  '0%,80%,100%': { transform: 'scale(0.7)', opacity: 0.4 },
  '40%': { transform: 'scale(1)', opacity: 1 },
});

export const sidebarWrap = style({
  width: 260,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: "'DM Sans', sans-serif",
  flexShrink: 0,
  '@media': {
    '(prefers-color-scheme: dark)': {
      background: '#161616',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    },
    '(prefers-color-scheme: light)': {
      background: 'transparent',
      borderRight: '1px solid rgba(0,0,0,0.07)',
    },
  },
});

export const sbHeader = style({
  padding: '16px 12px 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const sbBrand = style({
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  '@media': {
    '(prefers-color-scheme: dark)': { color: '#f0ede8' },
    '(prefers-color-scheme: light)': { color: '#1a1a1a' },
  },
});

export const sbCollapseBtn = style({
  width: 28,
  height: 28,
  borderRadius: 6,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 150ms',
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.35)' },
    '(prefers-color-scheme: light)': { color: 'rgba(0,0,0,0.35)' },
  },
  selectors: {
    '&:hover': {
      '@media': {
        '(prefers-color-scheme: dark)': {
          background: 'rgba(255,255,255,0.06)',
          color: '#f0ede8',
        },
        '(prefers-color-scheme: light)': {
          background: 'rgba(0,0,0,0.06)',
          color: '#1a1a1a',
        },
      },
    },
  },
});

/* Nav: vertical list of full-width items, same as recent items style */
export const sbNav = style({
  padding: '2px 8px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const sbNavItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 10px',
  borderRadius: 8,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  textAlign: 'left',
  width: '100%',
  transition: 'background 150ms',
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.65)' },
    '(prefers-color-scheme: light)': { color: '#2a2a2a' },
  },
  selectors: {
    '&:hover': {
      '@media': {
        '(prefers-color-scheme: dark)': {
          background: 'rgba(255,255,255,0.05)',
          color: '#f0ede8',
        },
        '(prefers-color-scheme: light)': {
          background: 'rgba(0,0,0,0.05)',
          color: '#1a1a1a',
        },
      },
    },
  },
});

export const sbNavItemSvg = style({
  opacity: 0.55,
  flexShrink: 0,
});

export const sbActiveCardWrap = style({
  padding: '4px 8px 8px',
});

export const sbActiveCard = style({
  padding: '10px 12px',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  transition: 'all 120ms',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  fontFamily: "'DM Sans', sans-serif",
  '@media': {
    '(prefers-color-scheme: dark)': { background: 'rgba(100, 110, 200, 0.15)' },
    '(prefers-color-scheme: light)': { background: '#dfe8f5' },
  },
  selectors: {
    '&:hover': {
      '@media': {
        '(prefers-color-scheme: dark)': { background: 'rgba(100, 110, 200, 0.25)' },
        '(prefers-color-scheme: light)': { background: '#d4dff0' },
      },
    },
  },
});

/* Icon box: smaller, tighter */
export const sbActiveIcon = style({
  width: 32,
  height: 32,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  flexShrink: 0,
  '@media': {
    '(prefers-color-scheme: dark)': { background: 'rgba(255,255,255,0.12)' },
    '(prefers-color-scheme: light)': { background: '#f5f5f5' },
  },
});

export const sbActiveMeta = style({
  flex: 1,
  minWidth: 0,
});

export const sbActiveTitle = style({
  fontSize: 13,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginBottom: 2,
  '@media': {
    '(prefers-color-scheme: dark)': { color: '#f0ede8' },
    '(prefers-color-scheme: light)': { color: '#1a1a1a' },
  },
});

export const sbActiveSub = style({
  fontSize: 11,
  fontWeight: 400,
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.45)' },
    '(prefers-color-scheme: light)': { color: 'rgba(0,0,0,0.5)' },
  },
});

export const sbDivider = style({
  height: 1,
  margin: '4px 0',
  '@media': {
    '(prefers-color-scheme: dark)': { background: 'rgba(255,255,255,0.06)' },
    '(prefers-color-scheme: light)': { background: 'rgba(0,0,0,0.07)' },
  },
});

/* Section label aligned with card padding */
export const sbSectionLabel = style({
  padding: '12px 12px 4px',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.25)' },
    '(prefers-color-scheme: light)': { color: 'rgba(0,0,0,0.35)' },
  },
});

/* Recent items aligned with card left edge (8px container + 12px inner = match) */
export const sbRecentItem = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 400,
  textAlign: 'left',
  width: '100%',
  borderRadius: 8,
  transition: 'background 120ms',
  justifyContent: 'space-between',
  gap: 8,
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.6)' },
    '(prefers-color-scheme: light)': { color: '#2a2a2a' },
  },
  selectors: {
    '&:hover': {
      '@media': {
        '(prefers-color-scheme: dark)': {
          background: 'rgba(255,255,255,0.04)',
          color: '#f0ede8',
        },
        '(prefers-color-scheme: light)': {
          background: 'rgba(0,0,0,0.04)',
          color: '#1a1a1a',
        },
      },
    },
  },
});

export const sbRecentItemActive = style({
  fontWeight: 500,
  '@media': {
    '(prefers-color-scheme: dark)': { color: '#f0ede8' },
    '(prefers-color-scheme: light)': { color: '#1a1a1a' },
  },
});

export const sbRecentTitle = style({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const sbRecentDelete = style({
  opacity: 0,
  transition: 'opacity 120ms',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px 4px',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  '@media': {
    '(prefers-color-scheme: dark)': { color: 'rgba(255,255,255,0.3)' },
    '(prefers-color-scheme: light)': { color: 'rgba(0,0,0,0.3)' },
  },
  ':hover': {
    background: 'rgba(220,60,60,0.1)',
    color: '#dc3c3c',
  },
});

export const sbRecentItemHovered = style({
  selectors: {
    [`${sbRecentItem}:hover &`]: {
      opacity: 1,
    },
  },
});

export const sbScroll = style({
  flex: 1,
  overflowY: 'auto',
  padding: '0 8px',
  scrollbarWidth: 'thin',
  '@media': {
    '(prefers-color-scheme: dark)': { scrollbarColor: 'rgba(255,255,255,0.08) transparent' },
    '(prefers-color-scheme: light)': { scrollbarColor: 'rgba(0,0,0,0.08) transparent' },
  },
});

export const sbFooter = style({
  padding: '12px 16px',
  fontSize: 11,
  borderTop: '1px solid',
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderColor: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.18)',
    },
    '(prefers-color-scheme: light)': {
      borderColor: 'rgba(0,0,0,0.06)',
      color: 'rgba(0,0,0,0.28)',
    },
  },
});

export const dotPulse = style({
  display: 'flex',
  gap: 4,
  justifyContent: 'center',
  padding: 24,
});

export const dotPulseSpan = style({
  width: 5,
  height: 5,
  borderRadius: '50%',
  animation: `${dpAnimation} 1.2s infinite`,
  '@media': {
    '(prefers-color-scheme: dark)': { background: 'rgba(255,255,255,0.3)' },
    '(prefers-color-scheme: light)': { background: 'rgba(0,0,0,0.2)' },
  },
  selectors: {
    '&:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
});
