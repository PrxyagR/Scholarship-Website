import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Authentic 11-point Canadian Maple Leaf vector icon
 */
export function MapleLeafIcon({ className = 'h-4 w-4', size, color }: IconProps) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 100 100"
      fill={color || 'currentColor'}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M50 2 L53.8 22.8 L66.7 13.9 L62.7 32.5 L81.2 26.5 L74.8 45.4 L93.5 42.6 L79.4 61.2 L96 68.8 L76.5 78.4 L80.9 92.4 L61.6 83.9 L53.5 94.5 V100 H46.5 V94.5 L38.4 83.9 L19.1 92.4 L23.5 78.4 L4 68.8 L20.6 61.2 L6.5 42.6 L25.2 45.4 L18.8 26.5 L37.3 32.5 L33.3 13.9 L46.2 22.8 Z" />
    </svg>
  );
}

/**
 * Atmospheric background watermark of Canadian maple leaves & branches
 * Designed for page headers with soft ambient presence (4-7% opacity)
 */
export function MapleWatermark({
  className = '',
  opacity = 0.05,
  variant = 'branch',
}: {
  className?: string;
  opacity?: number;
  variant?: 'branch' | 'leaf' | 'forest';
}) {
  if (variant === 'leaf') {
    return (
      <div
        className={`pointer-events-none select-none absolute overflow-hidden ${className}`}
        aria-hidden="true"
        style={{ opacity }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="currentColor">
          <path d="M50 2 L53.8 22.8 L66.7 13.9 L62.7 32.5 L81.2 26.5 L74.8 45.4 L93.5 42.6 L79.4 61.2 L96 68.8 L76.5 78.4 L80.9 92.4 L61.6 83.9 L53.5 94.5 V100 H46.5 V94.5 L38.4 83.9 L19.1 92.4 L23.5 78.4 L4 68.8 L20.6 61.2 L6.5 42.6 L25.2 45.4 L18.8 26.5 L37.3 32.5 L33.3 13.9 L46.2 22.8 Z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none select-none absolute overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg viewBox="0 0 400 300" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth={2}>
        {/* Branch stem */}
        <path d="M400 280 C320 250, 220 220, 160 140 C120 90, 80 50, 20 40" strokeWidth={4} strokeLinecap="round" />
        <path d="M220 220 C240 170, 280 130, 340 100" strokeWidth={3} strokeLinecap="round" />
        <path d="M160 140 C130 180, 90 200, 30 210" strokeWidth={2.5} strokeLinecap="round" />
        {/* Leaf 1 (Top Left) */}
        <g transform="translate(10, 15) scale(0.7) rotate(-25)">
          <path
            fill="currentColor"
            stroke="none"
            d="M50 2 L53.8 22.8 L66.7 13.9 L62.7 32.5 L81.2 26.5 L74.8 45.4 L93.5 42.6 L79.4 61.2 L96 68.8 L76.5 78.4 L80.9 92.4 L61.6 83.9 L53.5 94.5 V100 H46.5 V94.5 L38.4 83.9 L19.1 92.4 L23.5 78.4 L4 68.8 L20.6 61.2 L6.5 42.6 L25.2 45.4 L18.8 26.5 L37.3 32.5 L33.3 13.9 L46.2 22.8 Z"
          />
        </g>
        {/* Leaf 2 (Center Right) */}
        <g transform="translate(300, 60) scale(0.85) rotate(35)">
          <path
            fill="currentColor"
            stroke="none"
            d="M50 2 L53.8 22.8 L66.7 13.9 L62.7 32.5 L81.2 26.5 L74.8 45.4 L93.5 42.6 L79.4 61.2 L96 68.8 L76.5 78.4 L80.9 92.4 L61.6 83.9 L53.5 94.5 V100 H46.5 V94.5 L38.4 83.9 L19.1 92.4 L23.5 78.4 L4 68.8 L20.6 61.2 L6.5 42.6 L25.2 45.4 L18.8 26.5 L37.3 32.5 L33.3 13.9 L46.2 22.8 Z"
          />
        </g>
        {/* Leaf 3 (Bottom Left) */}
        <g transform="translate(20, 180) scale(0.65) rotate(15)">
          <path
            fill="currentColor"
            stroke="none"
            d="M50 2 L53.8 22.8 L66.7 13.9 L62.7 32.5 L81.2 26.5 L74.8 45.4 L93.5 42.6 L79.4 61.2 L96 68.8 L76.5 78.4 L80.9 92.4 L61.6 83.9 L53.5 94.5 V100 H46.5 V94.5 L38.4 83.9 L19.1 92.4 L23.5 78.4 L4 68.8 L20.6 61.2 L6.5 42.6 L25.2 45.4 L18.8 26.5 L37.3 32.5 L33.3 13.9 L46.2 22.8 Z"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Handcrafted SVG illustration of the Great Canadian Sugar Maple Tree
 * Symbolizes student growth from high school roots to national canopy.
 */
export function MapleTreeEmblem({
  className = 'w-full max-w-[280px]',
}: {
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 320"
        className="w-full h-auto drop-shadow-md transition-transform duration-300 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Canadian Sugar Maple Tree emblem"
        role="img"
      >
        <defs>
          <radialGradient id="sunburst-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#fef3c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="trunk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a2f" />
            <stop offset="100%" stopColor="#10231d" />
          </linearGradient>
          <linearGradient id="canopy-red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e53e3e" />
            <stop offset="100%" stopColor="#9b2c2c" />
          </linearGradient>
          <linearGradient id="canopy-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f6ad55" />
            <stop offset="100%" stopColor="#dd6b20" />
          </linearGradient>
          <linearGradient id="canopy-forest" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2f855a" />
            <stop offset="100%" stopColor="#1c4532" />
          </linearGradient>
          <linearGradient id="path-gold" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#d69e2e" />
            <stop offset="100%" stopColor="#fefcbf" />
          </linearGradient>
        </defs>

        {/* Ambient Warm Sun Aura behind the tree */}
        <circle cx="160" cy="140" r="130" fill="url(#sunburst-glow)" />

        {/* Mountain/Hill Horizon Ridge */}
        <path
          d="M20 270 C80 255, 140 265, 200 260 C250 255, 290 262, 300 270 L300 300 L20 300 Z"
          fill="#eaf1ed"
        />

        {/* The Winding Path reaching the tree roots (MaplePath motif) */}
        <path
          d="M160 255 C164 265, 172 275, 175 285 C178 295, 168 300, 150 310 L170 310 C188 300, 192 292, 185 280 C178 270, 168 262, 164 255 Z"
          fill="url(#path-gold)"
        />

        {/* Deep Root Base */}
        <path
          d="M130 270 C140 265, 148 258, 152 245 L168 245 C172 258, 180 265, 190 270 C178 266, 170 255, 166 245 L154 245 C150 255, 142 266, 130 270 Z"
          fill="url(#trunk-grad)"
        />

        {/* Majestic Tree Trunk and Primary Branches */}
        <path
          d="M152 248 C150 215, 148 185, 132 155 C124 140, 108 128, 92 120 C95 125, 110 138, 118 152 C132 178, 138 205, 142 248 Z"
          fill="url(#trunk-grad)"
        />
        <path
          d="M168 248 C170 215, 172 185, 188 155 C196 140, 212 128, 228 120 C225 125, 210 138, 202 152 C188 178, 182 205, 178 248 Z"
          fill="url(#trunk-grad)"
        />
        <path
          d="M154 200 C156 160, 158 135, 160 95 L164 95 C166 135, 166 160, 166 200 Z"
          fill="url(#trunk-grad)"
        />

        {/* Secondary Upper Branches */}
        <path d="M140 160 C125 140, 100 130, 85 128 C98 135, 118 148, 130 168 Z" fill="url(#trunk-grad)" />
        <path d="M180 160 C195 140, 220 130, 235 128 C222 135, 202 148, 190 168 Z" fill="url(#trunk-grad)" />

        {/* Layer 1: Deep Evergreen Lower Foliage Clustered Canopies */}
        <path
          d="M75 190 C60 180, 50 160, 60 145 C70 130, 95 130, 105 145 C115 160, 105 185, 75 190 Z"
          fill="url(#canopy-forest)"
          opacity="0.95"
        />
        <path
          d="M245 190 C260 180, 270 160, 260 145 C250 130, 225 130, 215 145 C205 160, 215 185, 245 190 Z"
          fill="url(#canopy-forest)"
          opacity="0.95"
        />

        {/* Layer 2: Golden Amber Middle Foliage */}
        <path
          d="M95 145 C80 130, 75 105, 95 90 C115 75, 135 85, 140 105 C145 125, 125 155, 95 145 Z"
          fill="url(#canopy-amber)"
        />
        <path
          d="M225 145 C240 130, 245 105, 225 90 C205 75, 185 85, 180 105 C175 125, 195 155, 225 145 Z"
          fill="url(#canopy-amber)"
        />

        {/* Layer 3: Vibrant Canadian Maple Red Crown Canopy */}
        <path
          d="M125 110 C110 90, 115 65, 135 50 C155 35, 180 40, 190 60 C200 45, 225 45, 235 65 C245 85, 235 110, 215 120 C195 128, 175 115, 160 118 C145 115, 135 122, 125 110 Z"
          fill="url(#canopy-red)"
        />

        {/* Distinctive Canadian Maple Leaf Silhouette embedded at tree summit */}
        <g transform="translate(142, 28) scale(0.36)">
          <path
            fill="#ffffff"
            d="M50 2 L53.8 22.8 L66.7 13.9 L62.7 32.5 L81.2 26.5 L74.8 45.4 L93.5 42.6 L79.4 61.2 L96 68.8 L76.5 78.4 L80.9 92.4 L61.6 83.9 L53.5 94.5 V100 H46.5 V94.5 L38.4 83.9 L19.1 92.4 L23.5 78.4 L4 68.8 L20.6 61.2 L6.5 42.6 L25.2 45.4 L18.8 26.5 L37.3 32.5 L33.3 13.9 L46.2 22.8 Z"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Canadian Forest Treeline Silhouette for footers and thematic dividers
 */
export function TreelineSilhouette({ className = 'w-full h-8 text-[var(--forest-dark, #14433b)]' }: { className?: string }) {
  return (
    <div className={`overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        className="w-full h-full fill-current opacity-20"
      >
        {/* Repeating rhythm of spruce spires and rounded maple crowns */}
        <path d="M0 48 L0 32 L15 12 L30 32 L45 20 L60 36 L75 8 L90 36 L110 24 C120 16, 135 16, 145 24 L160 34 L175 14 L190 34 L210 22 L225 36 L240 6 L255 36 L275 22 C285 14, 305 14, 315 22 L330 34 L345 16 L360 34 L380 20 L395 36 L415 10 L435 36 L455 24 C465 16, 480 16, 490 24 L505 34 L520 14 L535 34 L555 20 L570 36 L590 8 L610 36 L630 22 C640 14, 660 14, 670 22 L685 34 L700 16 L715 34 L735 20 L750 36 L770 10 L790 36 L810 24 C820 16, 835 16, 845 24 L860 34 L875 14 L890 34 L910 20 L925 36 L945 8 L965 36 L985 22 C995 14, 1015 14, 1025 22 L1040 34 L1055 16 L1070 34 L1090 20 L1105 36 L1125 10 L1145 36 L1165 24 C1175 16, 1190 16, 1200 24 L1200 48 Z" />
      </svg>
    </div>
  );
}

/**
 * Grade-by-Grade Tree Growth Icon
 * Shows student trajectory: Grade 9 (Seedling) -> Grade 10 (Sprout) -> Grade 11 (Young Branch) -> Grade 12 (Full Maple Tree)
 */
export function TreeGrowthStage({ grade, className = 'h-5 w-5' }: { grade: number; className?: string }) {
  switch (grade) {
    case 9:
      // Seedling / Acorn-Sprout
      return (
        <span className={`inline-flex items-center justify-center text-[var(--spruce-primary)] ${className}`} title="Grade 9: Seedling stage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-full w-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-7m0 0c0-3 2-6 5-6-1 4-3 6-5 6zm0 0c0-3-2-6-5-6 1 4 3 6 5 6z" />
          </svg>
        </span>
      );
    case 10:
      // Budding Sprout with dual leaves
      return (
        <span className={`inline-flex items-center justify-center text-[var(--forest)] ${className}`} title="Grade 10: Deepening sprout stage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-full w-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10m0 0C12 7 15 4 18 4c0 4-3 6-6 6zm0 0C12 7 9 4 6 4c0 4 3 6 6 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15c2-1 4-1 6 0" />
          </svg>
        </span>
      );
    case 11:
      // Branching Maple Sapling
      return (
        <span className={`inline-flex items-center justify-center text-[var(--gold)] ${className}`} title="Grade 11: Acceleration branch stage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-full w-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9m0 4l4-3m-4 5l-4-3m4-7c-2-2-4-2-6-1 0 3 3 4 6 1zm0 0c2-2 4-2 6-1 0 3-3 4-6 1z" />
          </svg>
        </span>
      );
    case 12:
    default:
      // Full Mature Canadian Maple Crown
      return (
        <span className={`inline-flex items-center justify-center text-[var(--maple-primary)] ${className}`} title="Grade 12: Capstone Maple Tree stage">
          <MapleLeafIcon className="h-full w-full" />
        </span>
      );
  }
}
