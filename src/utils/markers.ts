export const getMarkerSVG = (type: string, isSelected: boolean): string => {
  const typeLower = type.toLowerCase();
  
  // Define color palettes based on type
  let colorStart = '#6C63FF'; // Default Primary
  let colorEnd = '#8B5CF6'; // Default Accent
  let glowColor = 'rgba(108, 99, 255, 0.5)';
  
  // Inner SVG Icon
  let iconPath = '';

  if (typeLower.includes('temple')) {
    colorStart = '#A855F7'; // Purple
    colorEnd = '#D946EF';
    glowColor = 'rgba(168, 85, 247, 0.6)';
    iconPath = '<path d="M12 2L2 10h3v10h14V10h3L12 2zm0 3.5l5 4v8.5H7v-8.5l5-4z"/>';
  } else if (typeLower.includes('monastery') || typeLower.includes('fort')) {
    colorStart = '#EAB308'; // Golden
    colorEnd = '#F59E0B';
    glowColor = 'rgba(234, 179, 8, 0.6)';
    iconPath = '<path d="M12 2L4 7v2h16V7L12 2zm-6 9v8h12v-8H6zm2 2h8v4H8v-4z"/>';
  } else if (typeLower.includes('grove') || typeLower.includes('village')) {
    colorStart = '#10B981'; // Green
    colorEnd = '#059669';
    glowColor = 'rgba(16, 185, 129, 0.6)';
    iconPath = '<path d="M12 2C8.69 2 6 4.69 6 8c0 2.22 1.21 4.16 3 5.2V22h6v-8.8c1.79-1.04 3-2.98 3-5.2 0-3.31-2.69-6-6-6zM12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>';
  } else if (typeLower.includes('water') || typeLower.includes('lake')) {
    colorStart = '#3B82F6'; // Blue
    colorEnd = '#2563EB';
    glowColor = 'rgba(59, 130, 246, 0.6)';
    iconPath = '<path d="M12 2c-3.3 4.2-8 9-8 13 0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4.7-8.8-8-13zm0 18c-2.8 0-5-2.2-5-5 0-2.6 3.1-6.4 5-8.8 1.9 2.4 5 6.2 5 8.8 0 2.8-2.2 5-5 5z"/>';
  } else if (typeLower.includes('route')) {
    colorStart = '#F97316'; // Orange
    colorEnd = '#EA580C';
    glowColor = 'rgba(249, 115, 22, 0.6)';
    iconPath = '<path d="M14.6 6.3l2.8 2.8c.4.4.4 1 0 1.4L8.7 19.3c-.4.4-1 .4-1.4 0l-2.8-2.8c-.4-.4-.4-1 0-1.4l8.7-8.8c.4-.4 1-.4 1.4 0zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>';
  } else {
    iconPath = '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>';
  }

  // Use a premium 3D pin shape
  // The outer pin is a 3D bubble, glowing shadow underneath
  const svg = `
    <svg width="64" height="80" viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorStart}" />
          <stop offset="100%" stop-color="${colorEnd}" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="${isSelected ? 8 : 4}" flood-color="${glowColor}" flood-opacity="${isSelected ? 0.8 : 0.4}" />
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.3" />
        </filter>
        <filter id="innerGlow">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feOffset dy="1" dx="0"/>
          <feComposite operator="out" in2="SourceAlpha"/>
          <feComposite operator="in" in2="SourceGraphic"/>
          <feBlend mode="multiply" in2="SourceGraphic"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <!-- Pin Body -->
        <path d="M32 4 C16 4 6 15 6 30 C6 48 30 72 32 74 C34 72 58 48 58 30 C58 15 48 4 32 4 Z" fill="url(#grad)" />
        <!-- Inner highlight to make it look 3D / Glass -->
        <path d="M32 4 C16 4 6 15 6 30 C6 48 30 72 32 74 C34 72 58 48 58 30 C58 15 48 4 32 4 Z" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5" filter="url(#innerGlow)" />
        <!-- Inner white circle for icon background -->
        <circle cx="32" cy="28" r="14" fill="#ffffff" fill-opacity="0.95" />
        <!-- Icon -->
        <g transform="translate(20, 16) scale(1.0)">
          <g fill="${colorEnd}">
            ${iconPath}
          </g>
        </g>
      </g>
    </svg>
  `;

  // Encode safely for data URI
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
};
