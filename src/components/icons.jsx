/* Phosphor-style inline SVG icons (regular weight, 1.5px stroke) — site-wide.
   Light vocabulary, never emoji. */
export const I = (props) => {
  const { name, size = 22, stroke = 1.6, ...rest } = props;
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', ...rest };
  switch (name) {
    case 'magnifier': return (
      <svg {...common}><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.7-4.7"/></svg>);
    case 'chat': return (
      <svg {...common}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8A2.5 2.5 0 0 1 17.5 17H10l-4 3v-3H6.5A2.5 2.5 0 0 1 4 14.5z"/><circle cx="9" cy="10.5" r=".7" fill="currentColor"/><circle cx="12" cy="10.5" r=".7" fill="currentColor"/><circle cx="15" cy="10.5" r=".7" fill="currentColor"/></svg>);
    case 'chart': return (
      <svg {...common}><path d="M4 19h16"/><path d="M4 19V6"/><path d="M7 15l3-3 3 2 5-6"/><circle cx="7" cy="15" r="1.2"/><circle cx="10" cy="12" r="1.2"/><circle cx="13" cy="14" r="1.2"/><circle cx="18" cy="8" r="1.2"/></svg>);
    case 'bolt': return (
      <svg {...common}><path d="M13 3 5 13h6l-1 8 8-10h-6z"/></svg>);
    case 'sign': return (
      <svg {...common}><path d="M3 18c2-1 3-3 5-3s3 3 5 3 4-2 6-2"/><path d="M9 14c1-3 2.5-7 4-9"/><path d="M16 4l3 3"/></svg>);
    case 'gear': return (
      <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>);
    case 'check': return (<svg {...common}><path d="M5 13l4 4L19 7"/></svg>);
    case 'arrow-right': return (<svg {...common}><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>);
    case 'sparkle': return (
      <svg {...common}><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="M6 6l3 3"/><path d="M15 15l3 3"/><path d="M18 6l-3 3"/><path d="M9 15l-3 3"/></svg>);
    case 'shield': return (<svg {...common}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>);
    case 'clock': return (<svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
    case 'globe': return (<svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3 4.5 6 4.5 9S15 21 12 21s-4.5-6-4.5-9S9 3 12 3z"/></svg>);
    case 'mail': return (<svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>);
    case 'phone': return (<svg {...common}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>);
    case 'play': return (<svg {...common}><path d="M7 4l13 8-13 8z"/></svg>);
    case 'menu': return (<svg {...common}><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>);
    case 'close': return (<svg {...common}><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>);
    case 'down': return (<svg {...common}><path d="M6 9l6 6 6-6"/></svg>);
    case 'flag': return (<svg {...common}><path d="M5 22V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>);
    case 'doc': return (<svg {...common}><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>);
    case 'route': return (<svg {...common}><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 6h6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-4a4 4 0 0 0-4 4"/></svg>);
    case 'pulse': return (<svg {...common}><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>);
    case 'grid': return (<svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
    default: return null;
  }
};
