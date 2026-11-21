import React from 'react';
import ongHariSvg from '../onghari.svg';
import ehariSvg from '../ehari.svg';

/**
 * Logo officiel de l'application e-hari
 * Utilise le fichier officiel 'src/ehari.svg'
 */
export function HariEmblem({ size = 96, className = '' }) {
  return (
    <div
      className={`brand-emblem-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <img
        src={ehariSvg}
        alt="Logo e-hari"
        className="brand-emblem-img"
        style={{
          height: size,
          width: 'auto',
          maxHeight: size,
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}

/**
 * Alias direct pour le logo e-hari
 */
export function EhariLogo(props) {
  return <HariEmblem {...props} />;
}

/**
 * Logo officiel de l'ONG HARI Madagascar
 * Panneau publicitaire rotatif 3D : le logo est comme collé sur un panneau de même forme
 * d'une épaisseur réelle de 1 cm (~14px), tournant doucement sans arrêt.
 */
export function OngHariOfficialLogo({ size = 185, className = '' }) {
  const height = Math.round(size * 0.732);
  // Tranches solides de 1px formant le corps du panneau de 1 cm d'épaisseur
  const panelSlices = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];

  return (
    <div className={`ong-billboard-wrapper ${className}`}>
      <div className="ong-billboard-stage" style={{ width: size, height }}>
        <div className="ong-billboard-rotor">
          {/* Corps solide du panneau (tranches d'épaisseur de 1 cm) */}
          {panelSlices.map((z) => (
            <div
              key={z}
              className="ong-panel-slice"
              style={{ transform: `translateZ(${z}px)` }}
              aria-hidden="true"
            />
          ))}

          {/* Face avant du panneau : panneau satiné avec le logo collé dessus */}
          <div className="ong-panel-face front">
            <img
              src={ongHariSvg}
              alt="Logo Officiel de l'ONG HARI Madagascar"
              className="ong-panel-logo-img"
            />
          </div>

          {/* Face arrière du panneau : orientée à 180° pour rester toujours à l'endroit */}
          <div className="ong-panel-face back">
            <img
              src={ongHariSvg}
              alt="Logo Officiel de l'ONG HARI Madagascar"
              className="ong-panel-logo-img"
            />
          </div>
        </div>

        {/* Ombre au sol dynamique synchronisée avec la rotation sans interruption */}
        <div className="ong-billboard-floor-shadow" aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * Emblème circulaire vectoriel officiel ONG HARI Madagascar (Cercle parfait haute fidélité)
 */
export function OngHariOfficialSvg({ size = 140 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      title="Logo Officiel ONG HARI Madagascar"
    >
      {/* Fond circulaire blanc */}
      <circle cx="50" cy="50" r="48" fill="#ffffff" />

      {/* Anneau extérieur rouge corail officiel */}
      <circle cx="50" cy="50" r="46" stroke="#e11d48" strokeWidth="3.5" fill="none" />
      <circle cx="50" cy="50" r="42" stroke="#16a34a" strokeWidth="0.8" strokeDasharray="2 2" fill="none" opacity="0.6" />

      {/* Contour vert de Madagascar */}
      <path
        d="M52 18 C55 22, 58 32, 56 42 C54 48, 50 58, 47 64 C45 68, 44 72, 46 76 C47 78, 45 80, 43 78 C41 74, 43 66, 46 58 C48 50, 49 38, 49 26 C49 20, 51 17, 52 18 Z"
        fill="#f0fdf4"
        stroke="#16a34a"
        strokeWidth="1.2"
      />

      {/* Arbre de la réussite et du développement (Vert émeraude) */}
      <path
        d="M37 34 C37 26, 45 22, 51 22 C57 22, 65 26, 65 34 C65 38, 61 42, 54 43 L54 50 L48 50 L48 43 C41 42, 37 38, 37 34 Z"
        fill="#15803d"
      />
      <circle cx="44" cy="27" r="5" fill="#22c55e" />
      <circle cx="58" cy="27" r="5" fill="#22c55e" />
      <circle cx="51" cy="23" r="6" fill="#16a34a" />

      {/* Silhouettes des 3 jeunes unis */}
      <circle cx="43" cy="40" r="2.8" fill="#1e293b" />
      <circle cx="51" cy="38" r="3.2" fill="#1e293b" />
      <circle cx="59" cy="40" r="2.8" fill="#1e293b" />
      <path
        d="M39 52 C39 46, 47 44, 51 44 C55 44, 63 46, 63 52 Z"
        fill="#1e293b"
      />

      {/* Texte HARI officiel en rouge */}
      <text
        x="51"
        y="67"
        textAnchor="middle"
        fontSize="16"
        fontWeight="900"
        fill="#e11d48"
        fontFamily="Arial, sans-serif"
        letterSpacing="1.5"
      >
        HARI
      </text>

      {/* Pousse verte d'espoir */}
      <path
        d="M59 57 C63 55, 65 51, 64 49 C61 50, 59 53, 59 57 Z"
        fill="#16a34a"
      />
      <path
        d="M59 57 C57 54, 55 52, 53 52 C53 55, 56 57, 59 57 Z"
        fill="#22c55e"
      />

      {/* Devise officielle en arc de cercle inférieur */}
      <path id="curve-official" d="M 16,50 A 34,34 0 0,0 84,50" fill="none" />
      <text fontSize="4.6" fill="#e11d48" fontWeight="800" letterSpacing="0.4">
        <textPath href="#curve-official" startOffset="50%" textAnchor="middle">
          HEVITRA • ATAMBATRA • REHAREHA • IOMBONANA
        </textPath>
      </text>
    </svg>
  );
}

export default HariEmblem;


