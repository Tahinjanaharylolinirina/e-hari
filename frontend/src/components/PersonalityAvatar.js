import React from 'react';

/**
 * Avatar vectoriel personnalisé pour illustrer le profil de personnalité et de tempérament
 * (sans aucun code métier ou filière scolaire, centré sur le caractère humain).
 */
export default function PersonalityAvatar({ categoryKey = 'sciences_tech', size = 88, className = '' }) {
  const normKey = (categoryKey || '').toLowerCase();

  // Configuration par type de tempérament
  const config = {
    sciences_tech: {
      bgGradStart: '#1d4ed8',
      bgGradEnd: '#60a5fa',
      skinTone: '#fcd34d',
      hairColor: '#1e293b',
      accentColor: '#38bdf8',
      title: 'Caractère Réfléchi & Méthodique',
      accessory: (
        // Lunettes d'analyste + badge logique
        <g>
          {/* Lunettes */}
          <circle cx="43" cy="49" r="6.5" fill="none" stroke="#0f172a" strokeWidth="1.8" />
          <circle cx="57" cy="49" r="6.5" fill="none" stroke="#0f172a" strokeWidth="1.8" />
          <line x1="49.5" y1="49" x2="50.5" y2="49" stroke="#0f172a" strokeWidth="1.8" />
          {/* Badge constellation / logique */}
          <circle cx="78" cy="78" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          <path d="M78 72 L80 77 L85 78 L80 81 L78 86 L76 81 L71 78 L76 77 Z" fill="#ffffff" />
        </g>
      ),
    },
    lettres_comm: {
      bgGradStart: '#7e22ce',
      bgGradEnd: '#c084fc',
      skinTone: '#fed7aa',
      hairColor: '#451a03',
      accentColor: '#e879f9',
      title: 'Caractère Éloquent & Sensible',
      accessory: (
        // Coiffure soignée + badge livre ouvert
        <g>
          {/* Badge dialogue / plume */}
          <circle cx="78" cy="78" r="10" fill="#9333ea" stroke="#ffffff" strokeWidth="2" />
          <path d="M74 74 Q78 72 82 74 Q82 82 78 83 Q74 82 74 74 Z" fill="#ffffff" />
          <circle cx="78" cy="77" r="1.5" fill="#9333ea" />
        </g>
      ),
    },
    eco_gestion: {
      bgGradStart: '#047857',
      bgGradEnd: '#34d399',
      skinTone: '#fbcfe8',
      hairColor: '#18181b',
      accentColor: '#6ee7b7',
      title: 'Caractère Entreprenant & Leader',
      accessory: (
        // Col dynamique + badge étoile de leadership
        <g>
          {/* Badge leader */}
          <circle cx="78" cy="78" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
          <polygon points="78,72 80,76 84,77 81,80 82,84 78,82 74,84 75,80 72,77 76,76" fill="#fef08a" />
        </g>
      ),
    },
    sante_social: {
      bgGradStart: '#be123c',
      bgGradEnd: '#fb7185',
      skinTone: '#fed7aa',
      hairColor: '#78350f',
      accentColor: '#fda4af',
      title: 'Caractère Bienveillant & Altruiste',
      accessory: (
        // Badge cœur bienveillant
        <g>
          <circle cx="78" cy="78" r="10" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
          <path d="M78 83 C78 83 72 79 72 76 C72 74.2 73.5 73 75 73 C76.2 73 77.3 73.8 78 74.7 C78.7 73.8 79.8 73 81 73 C82.5 73 84 74.2 84 76 C84 79 78 83 78 83 Z" fill="#ffffff" />
        </g>
      ),
    },
    arts_creation: {
      bgGradStart: '#b45309',
      bgGradEnd: '#fbbf24',
      skinTone: '#fde68a',
      hairColor: '#7c2d12',
      accentColor: '#fde047',
      title: 'Caractère Créatif & Imaginatif',
      accessory: (
        // Béret d'artiste / mèche créative + badge étincelle
        <g>
          {/* Béret violet/indigo stylisé */}
          <ellipse cx="50" cy="31" rx="20" ry="6.5" fill="#6366f1" transform="rotate(-7 50 31)" />
          <circle cx="50" cy="24" r="2" fill="#4338ca" />
          {/* Badge étincelle d'inspiration */}
          <circle cx="78" cy="78" r="10" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
          <path d="M78 72 Q78 78 84 78 Q78 78 78 84 Q78 78 72 78 Q78 78 78 72 Z" fill="#ffffff" />
        </g>
      ),
    },
    nature_agri: {
      bgGradStart: '#15803d',
      bgGradEnd: '#4ade80',
      skinTone: '#fed7aa',
      hairColor: '#292524',
      accentColor: '#86efac',
      title: 'Caractère Observateur & Naturel',
      accessory: (
        // Badge feuille de nature
        <g>
          <circle cx="78" cy="78" r="10" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
          <path d="M74 82 C74 76 77 74 82 74 C82 79 80 82 74 82 Z" fill="#ffffff" />
          <line x1="74" y1="82" x2="80" y2="76" stroke="#16a34a" strokeWidth="1.2" />
        </g>
      ),
    },
  };

  // Trouver la clé correspondante ou fallback
  let selected = config.sciences_tech;
  if (normKey.includes('lettre') || normKey.includes('comm') || normKey.includes('eloquent')) selected = config.lettres_comm;
  else if (normKey.includes('eco') || normKey.includes('gestion') || normKey.includes('leader') || normKey.includes('entrepren')) selected = config.eco_gestion;
  else if (normKey.includes('sante') || normKey.includes('social') || normKey.includes('bienveill') || normKey.includes('altruis')) selected = config.sante_social;
  else if (normKey.includes('art') || normKey.includes('creati') || normKey.includes('imaginat')) selected = config.arts_creation;
  else if (normKey.includes('natur') || normKey.includes('agri') || normKey.includes('observat')) selected = config.nature_agri;
  else if (normKey.includes('scienc') || normKey.includes('tech') || normKey.includes('method') || normKey.includes('reflechi')) selected = config.sciences_tech;

  const gradId = `avatar-grad-${categoryKey || 'def'}`;

  return (
    <div
      className={`personality-avatar-box ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.14))',
      }}
      title={selected.title}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: '50%' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={selected.bgGradStart} />
            <stop offset="100%" stopColor={selected.bgGradEnd} />
          </linearGradient>
          <linearGradient id={`skin-${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={selected.skinTone} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Fond circulaire dégradé */}
        <circle cx="50" cy="50" r="48" fill={`url(#${gradId})`} stroke="#ffffff" strokeWidth="3" />

        {/* Halo décoratif discret */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />

        {/* Buste / Vêtements */}
        <path
          d="M26 92 C26 77 37 72 50 72 C63 72 74 77 74 92 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Col / Tenue */}
        <path
          d="M44 72 L50 80 L56 72 Z"
          fill={selected.bgGradStart}
          opacity="0.8"
        />

        {/* Cou */}
        <rect x="45" y="62" width="10" height="12" rx="3" fill={selected.skinTone} />

        {/* Visage */}
        <ellipse cx="50" cy="51" rx="16" ry="17" fill={selected.skinTone} />

        {/* Chevelure (base) */}
        <path
          d="M33 46 C33 34 39 30 50 30 C61 30 67 34 67 46 C67 49 66 52 66 52 C64 43 61 40 50 40 C39 40 36 43 34 52 Z"
          fill={selected.hairColor}
        />
        <path
          d="M34 46 C32 37 39 28 50 28 C61 28 68 37 66 46 C65 38 60 33 50 33 C40 33 35 38 34 46 Z"
          fill={selected.hairColor}
        />

        {/* Yeux pétillants */}
        <circle cx="43.5" cy="49" r="2.2" fill="#0f172a" />
        <circle cx="44.2" cy="48.2" r="0.8" fill="#ffffff" />
        <circle cx="56.5" cy="49" r="2.2" fill="#0f172a" />
        <circle cx="57.2" cy="48.2" r="0.8" fill="#ffffff" />

        {/* Sourcils bienveillants */}
        <path d="M41 45 Q44 43.5 47 45" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M53 45 Q56 43.5 59 45" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Nez discret */}
        <path d="M50 51 L49 54 L51 54" stroke="#d97706" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Sourire chaleureux */}
        <path
          d="M44 58 Q50 64 56 58"
          stroke="#9a3412"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pommettes douces */}
        <circle cx="39" cy="55" r="2.5" fill="#f43f5e" opacity="0.25" />
        <circle cx="61" cy="55" r="2.5" fill="#f43f5e" opacity="0.25" />

        {/* Accessoire & Badge caractéristique */}
        {selected.accessory}
      </svg>
    </div>
  );
}

