import React from 'react';

/**
 * Retourne une icône SVG vectorielle moderne (style Lucide) à la place des anciens emojis
 * utilisés dans les questionnaires d'orientation et fiches de matières.
 */
export function ModernTestIcon({ icon, id = '', size = 20 }) {
  const key = `${id} ${icon || ''}`.toLowerCase();

  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  // Tech / Informatique / Code / Robotique
  if (key.includes('💻') || key.includes('🤖') || key.includes('⚙️') || key.includes('informatique') || key.includes('tech')) {
    return (
      <svg {...props}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }

  // Sciences / Labo / Physique / Chimie / Maths
  if (key.includes('🔬') || key.includes('⚗️') || key.includes('physique') || key.includes('science')) {
    return (
      <svg {...props}>
        <path d="M9 3h6" />
        <path d="M10 3v6l-5 8.5A2 2 0 0 0 6.7 20h10.6a2 2 0 0 0 1.7-2.5L14 9V3" />
        <path d="M7.5 15h9" />
      </svg>
    );
  }

  if (key.includes('📐') || key.includes('🧩') || key.includes('maths')) {
    return (
      <svg {...props}>
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
        <path d="m14.5 12.5 2-2" />
        <path d="m11.5 9.5 2-2" />
        <path d="m8.5 6.5 2-2" />
        <path d="m17.5 15.5 2-2" />
      </svg>
    );
  }

  // Lecture / Lettres / Langues / Histoire / Philo
  if (key.includes('📖') || key.includes('📜') || key.includes('francais') || key.includes('malagasy')) {
    return (
      <svg {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }

  if (key.includes('✍️') || key.includes('📝')) {
    return (
      <svg {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  }

  if (key.includes('🗣️') || key.includes('💬')) {
    return (
      <svg {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }

  if (key.includes('🌍') || key.includes('🗺️') || key.includes('🇲🇬') || key.includes('anglais') || key.includes('histoire')) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    );
  }

  // Entrepreneuriat / Économie / Gestion / Finance / Leadership
  if (key.includes('📈') || key.includes('📊') || key.includes('ses')) {
    return (
      <svg {...props}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }

  if (key.includes('💼') || key.includes('🏢') || key.includes('📋')) {
    return (
      <svg {...props}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }

  if (key.includes('🚀') || key.includes('⚡')) {
    return (
      <svg {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }

  if (key.includes('⚖️')) {
    return (
      <svg {...props}>
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </svg>
    );
  }

  // Social / Santé / Entraide / Humain
  if (key.includes('❤️') || key.includes('🩺') || key.includes('🤗')) {
    return (
      <svg {...props}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    );
  }

  if (key.includes('🤝') || key.includes('🕊️')) {
    return (
      <svg {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  // Arts / Création / Design / Cinéma / Idées
  if (key.includes('🎨') || key.includes('🎭')) {
    return (
      <svg {...props}>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    );
  }

  if (key.includes('🎬')) {
    return (
      <svg {...props}>
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="m22 8-6 4 6 4V8Z" />
      </svg>
    );
  }

  if (key.includes('💡') || key.includes('✨') || key.includes('philo')) {
    return (
      <svg {...props}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    );
  }

  // Nature / Environnement / SVT / Agriculture
  if (key.includes('🌱') || key.includes('🌿') || key.includes('🌳') || key.includes('🌾') || key.includes('🏞️') || key.includes('svt')) {
    return (
      <svg {...props}>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    );
  }

  // Recherche / Temps
  if (key.includes('🔍')) {
    return (
      <svg {...props}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    );
  }

  if (key.includes('⏳')) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }

  // Fallback icône étoile moderne
  return (
    <svg {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default ModernTestIcon;
