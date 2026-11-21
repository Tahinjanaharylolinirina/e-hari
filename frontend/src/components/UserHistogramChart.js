import React, { useState } from 'react';
import ModernChartIcon from './ModernChartIcons';

/**
 * Composant Histogramme & Diagramme Circulaire des Utilisateurs e-HARI
 * Affiche la distribution selon :
 * 1. Selon les Catégories (Élèves, Étudiants, Emploi & Insertion, Administrateurs)
 * 2. Selon la Localisation (Madagascar : Antananarivo, Fianarantsoa, Toamasina, Mahajanga, Toliara, Antsiranana...)
 * 3. Selon l'Orientation des utilisateurs (issue des résultats du test de personnalité / métiers)
 *
 * Lorsque les vues sont séparées, un HISTOGRAMME CIRCULAIRE (Donut Chart SVG) interactif
 * est affiché avec indicateurs de pourcentage et carte de répartition synchronisée.
 */
export default function UserHistogramChart({
  stats = null,
  users = [],
  pupils = [],
  students = [],
  reconversions = [],
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'type', 'location', 'orientation'
  const [hoveredSliceKey, setHoveredSliceKey] = useState(null);

  // Total des utilisateurs
  const totalUsers = users.length || parseInt(stats?.total_utilisateurs || 0, 10) || 1;

  // 1. Données : Selon les Catégories d'utilisateurs (Élèves, Étudiants, Emploi) - Sans l'administrateur
  // Couleurs strictement imposées : Rouge, Bleu et Vert / Teal
  const categoryTypeData = (() => {
    let elevesCount = 0;
    let etudiantsCount = 0;
    let emploiCount = 0;

    if (users && users.length > 0) {
      users.forEach((u) => {
        const r = (u.uti_rol || u.role || '').toLowerCase();
        if (r === 'eleve') elevesCount++;
        else if (r === 'etudiant') etudiantsCount++;
        else if (r === 'emploi' || r === 'reconversion' || r.includes('emploi') || r.includes('recherche')) emploiCount++;
        // L'administrateur n'est pas intégré dans cet histogramme selon la demande
      });
    } else if (stats?.breakdown_type) {
      elevesCount = stats.breakdown_type.eleve || 0;
      etudiantsCount = stats.breakdown_type.etudiant || 0;
      emploiCount = stats.breakdown_type.emploi || 0;
    } else {
      elevesCount = pupils.length || parseInt(stats?.total_eleves || 0, 10);
      etudiantsCount = students.length || parseInt(stats?.total_etudiants || 0, 10);
      emploiCount = reconversions.length || parseInt(stats?.total_emploi || 0, 10);
    }

    return [
      { key: 'eleve', label: 'Élèves (Secondaire)', iconKey: 'eleve', count: elevesCount, color: '#dc2626', colorClass: 'eleve' },
      { key: 'etudiant', label: 'Étudiants (Supérieur)', iconKey: 'etudiant', count: etudiantsCount, color: '#2563eb', colorClass: 'etudiant' },
      { key: 'emploi', label: "À la recherche d'un emploi", iconKey: 'emploi', count: emploiCount, color: '#0d9488', colorClass: 'emploi' },
    ];
  })();

  // 2. Données : Selon la Localisation (Régions & Villes de Madagascar)
  const locationData = (() => {
    const locCounts = {
      'Antananarivo (Analamanga)': 0,
      'Fianarantsoa (Matsiatra)': 0,
      'Toamasina (Atsinanana)': 0,
      'Mahajanga (Boeny)': 0,
      'Toliara (Atsimo-Andrefana)': 0,
      'Antsiranana (Diana)': 0,
      'Autres Régions': 0,
    };

    if (users && users.length > 0) {
      users.forEach((u) => {
        const adr = (u.uti_adr || '').toLowerCase();
        const eta = ((u.ele_eta || u.etu_eta || '')).toLowerCase();
        if (adr.includes('ankofafa') || adr.includes('fianar') || eta.includes('jesoa')) {
          locCounts['Fianarantsoa (Matsiatra)']++;
        } else if (adr.includes('tamatave') || adr.includes('toamasina') || eta.includes('toamasina')) {
          locCounts['Toamasina (Atsinanana)']++;
        } else if (adr.includes('majunga') || adr.includes('mahajanga')) {
          locCounts['Mahajanga (Boeny)']++;
        } else if (adr.includes('toliara') || adr.includes('tulear')) {
          locCounts['Toliara (Atsimo-Andrefana)']++;
        } else if (adr.includes('antsiranana') || adr.includes('diego')) {
          locCounts['Antsiranana (Diana)']++;
        } else if (
          adr.includes('antananarivo') ||
          adr.includes('tana') ||
          adr.includes('itaosy') ||
          adr.includes('ankatso') ||
          adr.includes('ambonivato') ||
          adr.includes('sabotsy') ||
          adr.includes('antanimena') ||
          adr.includes('ankadilalana') ||
          eta.includes('rabearivelo') ||
          eta.includes('michel') ||
          eta.includes('ankatso')
        ) {
          locCounts['Antananarivo (Analamanga)']++;
        } else {
          locCounts['Autres Régions']++;
        }
      });
    } else if (stats?.breakdown_location) {
      Object.keys(stats.breakdown_location).forEach((k) => {
        if (locCounts[k] !== undefined) {
          locCounts[k] = stats.breakdown_location[k];
        }
      });
    }

    return [
      { key: 'tana', label: 'Antananarivo (Analamanga)', iconKey: 'loc-tana', count: locCounts['Antananarivo (Analamanga)'], color: '#2563eb', colorClass: 'loc-tana' },
      { key: 'fianar', label: 'Fianarantsoa (Matsiatra)', iconKey: 'loc-fianar', count: locCounts['Fianarantsoa (Matsiatra)'], color: '#7c3aed', colorClass: 'loc-fianar' },
      { key: 'toam', label: 'Toamasina (Atsinanana)', iconKey: 'loc-toam', count: locCounts['Toamasina (Atsinanana)'], color: '#0891b2', colorClass: 'loc-toam' },
      { key: 'maj', label: 'Mahajanga (Boeny)', iconKey: 'loc-maj', count: locCounts['Mahajanga (Boeny)'], color: '#f59e0b', colorClass: 'loc-maj' },
      { key: 'toli', label: 'Toliara (Atsimo-Andrefana)', iconKey: 'loc-toli', count: locCounts['Toliara (Atsimo-Andrefana)'], color: '#ea580c', colorClass: 'loc-toli' },
      { key: 'ants', label: 'Antsiranana (Diana)', iconKey: 'loc-ants', count: locCounts['Antsiranana (Diana)'], color: '#059669', colorClass: 'loc-ants' },
      { key: 'other', label: 'Autres Régions / En cours', iconKey: 'loc-other', count: locCounts['Autres Régions'], color: '#64748b', colorClass: 'loc-other' },
    ];
  })();

  // 3. Données : Selon l'Orientation des utilisateurs (issue des résultats du test de personnalité)
  // 6 Catégories d'orientation professionnelle et d'emploi
  const orientationData = (() => {
    const counts = {
      'Numérique, Technologies & Data': 0,
      'Commerce, Vente & Entrepreneuriat': 0,
      'Organisation, Gestion & Projets': 0,
      'Impact Social & Environnement': 0,
      'Ressources Humaines & Formation': 0,
      'Opérations Terrain & Logistique': 0,
    };

    // Index de lookup des résultats de tests depuis pupils, students, reconversions
    const testLookup = {};
    [...(pupils || []), ...(students || []), ...(reconversions || [])].forEach((item) => {
      const uid = item?.uti_id || item?.ele_uti_id || item?.etu_uti_id || item?.emp_uti_id;
      if (uid) {
        testLookup[uid] =
          item?.ele_ori_pro_1 ||
          item?.etu_ori_pro_1 ||
          item?.emp_ori_pro_1 ||
          item?.te1_ori_pro_1 ||
          item?.tet1_ori_pro_1 ||
          item?.tem1_ori_pro_1 ||
          item?.rep_resultat ||
          '';
      }
    });

    const userList = users && users.length > 0
      ? users
      : [...(pupils || []), ...(students || []), ...(reconversions || [])];

    if (userList && userList.length > 0) {
      userList.forEach((u) => {
        const uid = u?.uti_id;
        const lookupResult = uid && testLookup[uid] ? testLookup[uid] : '';

        const signals = [
          u?.test1?.rep_resultat,
          u?.test1?.rep_detail?.dominantLabel,
          u?.test1?.rep_detail?.dominant,
          u?.tests?.tel_ori_pro_1,
          u?.tests?.tet_ori_pro_1,
          u?.tests?.tem_ori_pro_1,
          u?.ele_ori_pro_1,
          u?.etu_ori_pro_1,
          u?.emp_ori_pro_1,
          lookupResult,
          u?.rep_resultat,
          u?.ori_pro_1,
          u?.test2?.rep_resultat,
          u?.etu_fil,
          u?.ele_ser,
          u?.emp_met_act,
          u?.uti_rol,
        ]
          .filter(Boolean)
          .map((s) => String(s).toLowerCase())
          .join(' ');

        // 1. Numérique, Technologies & Data
        if (
          signals.includes('tech_numerique') ||
          signals.includes('tech_ingenierie') ||
          signals.includes('sciences_tech') ||
          signals.includes('numérique') ||
          signals.includes('numerique') ||
          signals.includes('bâtisseur') ||
          signals.includes('ingénieur') ||
          signals.includes('ingenieur') ||
          signals.includes('informatique') ||
          signals.includes('sciences & technologies') ||
          signals.includes('sciences exactes') ||
          signals.includes('réfléchi') ||
          signals.includes('reflechi')
        ) {
          counts['Numérique, Technologies & Data']++;
        }
        // 2. Commerce, Vente & Entrepreneuriat
        else if (
          signals.includes('entrepreneuriat') ||
          signals.includes('commerce') ||
          signals.includes('comm_marketing') ||
          signals.includes('entreprenant') ||
          signals.includes('leader') ||
          signals.includes('marketing') ||
          signals.includes('vente') ||
          signals.includes('indépendant')
        ) {
          counts['Commerce, Vente & Entrepreneuriat']++;
        }
        // 3. Organisation, Gestion & Projets
        else if (
          signals.includes('management_conseil') ||
          signals.includes('analytique_finance') ||
          signals.includes('organisation') ||
          signals.includes('pilotage') ||
          signals.includes('gestion de projet') ||
          signals.includes('stratège') ||
          signals.includes('finance') ||
          signals.includes('audit') ||
          signals.includes('admin')
        ) {
          counts['Organisation, Gestion & Projets']++;
        }
        // 4. Impact Social & Environnement
        else if (
          signals.includes('impact_vert_rse') ||
          signals.includes('nature_agri') ||
          signals.includes('impact_societe_durable') ||
          signals.includes('développement durable') ||
          signals.includes('developpement durable') ||
          signals.includes('écologie') ||
          signals.includes('ecologie') ||
          signals.includes('observateur') ||
          signals.includes('nature') ||
          signals.includes('environnement') ||
          signals.includes('agri') ||
          signals.includes('agro')
        ) {
          counts['Impact Social & Environnement']++;
        }
        // 5. Ressources Humaines & Formation
        else if (
          signals.includes('formation_rh_humain') ||
          signals.includes('management_rh') ||
          signals.includes('sante_social') ||
          signals.includes('lettres_comm') ||
          signals.includes('ressources humaines') ||
          signals.includes('rh') ||
          signals.includes('bienveillant') ||
          signals.includes('altruiste') ||
          signals.includes('protecteur') ||
          signals.includes('éloquent') ||
          signals.includes('formation') ||
          signals.includes('social') ||
          signals.includes('santé') ||
          signals.includes('sante')
        ) {
          counts['Ressources Humaines & Formation']++;
        }
        // 6. Opérations Terrain & Logistique
        else if (
          signals.includes('expertise_terrain_qualite') ||
          signals.includes('logistique') ||
          signals.includes('opérations') ||
          signals.includes('operations') ||
          signals.includes('qualité') ||
          signals.includes('qualite') ||
          signals.includes('terrain') ||
          signals.includes('supply')
        ) {
          counts['Opérations Terrain & Logistique']++;
        } else {
          counts['Numérique, Technologies & Data']++;
        }
      });
    } else if (stats?.breakdown_orientation || stats?.breakdown_category) {
      const src = stats.breakdown_orientation || stats.breakdown_category;
      Object.keys(src).forEach((k) => {
        if (counts[k] !== undefined) {
          counts[k] = src[k];
        }
      });
    }

    return [
      { key: 'tech', label: 'Numérique, Technologies & Data', iconKey: 'tech', count: counts['Numérique, Technologies & Data'], color: '#2563eb', colorClass: 'tech' },
      { key: 'commerce', label: 'Commerce, Vente & Entrepreneuriat', iconKey: 'commerce', count: counts['Commerce, Vente & Entrepreneuriat'], color: '#d97706', colorClass: 'commerce' },
      { key: 'gestion', label: 'Organisation, Gestion & Projets', iconKey: 'gestion', count: counts['Organisation, Gestion & Projets'], color: '#059669', colorClass: 'gestion' },
      { key: 'impact', label: 'Impact Social & Environnement', iconKey: 'impact', count: counts['Impact Social & Environnement'], color: '#16a34a', colorClass: 'impact' },
      { key: 'rh', label: 'Ressources Humaines & Formation', iconKey: 'rh', count: counts['Ressources Humaines & Formation'], color: '#7c3aed', colorClass: 'rh' },
      { key: 'logistique', label: 'Opérations Terrain & Logistique', iconKey: 'logistique', count: counts['Opérations Terrain & Logistique'], color: '#0891b2', colorClass: 'logistique' },
    ];
  })();

  // Rendu de l'Histogramme Circulaire (SVG Donut Chart interactif)
  const renderCircularHistogram = (title, iconKey, data) => {
    const totalCount = data.reduce((acc, curr) => acc + curr.count, 0) || totalUsers;
    const radius = 72;
    const circumference = 2 * Math.PI * radius; // ~452.39

    let accumulatedOffset = 0;
    const slices = data
      .filter((item) => item.count > 0)
      .map((item) => {
        const portion = item.count / totalCount;
        const dashLength = portion * circumference;
        const offset = accumulatedOffset;
        accumulatedOffset += dashLength;
        const percent = Math.round(portion * 100);

        return {
          ...item,
          dashLength,
          offset,
          percent,
        };
      });

    // Données de l'élément actuellement survolé (ou résumé général)
    const activeItem = hoveredSliceKey
      ? data.find((d) => d.key === hoveredSliceKey) || null
      : null;

    return (
      <div className="circular-chart-layout">
        {/* Panneau Gauche : Donut SVG */}
        <div className="circular-chart-svg-wrap">
          <svg className="circular-chart-svg" viewBox="0 0 200 200">
            {/* Anneau de fond */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="20"
            />

            {/* Tranches circulaires */}
            {slices.map((slice) => {
              const isHovered = hoveredSliceKey === slice.key;
              return (
                <circle
                  key={slice.key}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? 26 : 20}
                  strokeDasharray={`${slice.dashLength} ${circumference - slice.dashLength}`}
                  strokeDashoffset={-slice.offset}
                  className={`circular-slice ${isHovered ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredSliceKey(slice.key)}
                  onMouseLeave={() => setHoveredSliceKey(null)}
                />
              );
            })}
          </svg>

          {/* Centre du Donut avec informations dynamiques au survol */}
          <div className="circular-chart-center">
            {activeItem ? (
              <>
                <span className="circular-center-label" style={{ color: activeItem.color, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ModernChartIcon name={activeItem.iconKey} size={15} color={activeItem.color} />
                  <span>{activeItem.label.split('(')[0].trim()}</span>
                </span>
                <span className="circular-center-val" style={{ color: activeItem.color }}>
                  {activeItem.count}
                </span>
                <span className="circular-center-percent">
                  {Math.round((activeItem.count / totalCount) * 100)}%
                </span>
              </>
            ) : (
              <>
                <span className="circular-center-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ModernChartIcon name="chart-pie" size={14} color="#64748b" />
                  <span>TOTAL</span>
                </span>
                <span className="circular-center-val">{totalCount}</span>
                <span className="circular-center-percent">100% Inscrits</span>
              </>
            )}
          </div>
        </div>

        {/* Panneau Droit : Cartes et Légende détaillée */}
        <div className="circular-legend-panel">
          <div className="circular-legend-header">
            <span className="circular-legend-title">
              <span className="modern-legend-icon" style={{ color: '#2563eb' }}>
                <ModernChartIcon name={iconKey} size={20} color="#2563eb" />
              </span>
              <span>{title}</span>
            </span>
            <span className="histogram-total-badge">
              {totalCount} utilisateur(s) au total
            </span>
          </div>

          <div className="circular-legend-items">
            {data.map((item) => {
              const percent = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
              const isHovered = hoveredSliceKey === item.key;

              return (
                <div
                  key={item.key}
                  className={`circular-legend-card ${isHovered ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredSliceKey(item.key)}
                  onMouseLeave={() => setHoveredSliceKey(null)}
                >
                  <span
                    className="circular-color-indicator"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="circular-card-content">
                    <div className="circular-card-name" title={item.label}>
                      <span
                        className="modern-icon-badge"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        <ModernChartIcon name={item.iconKey} size={15} color={item.color} />
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <div className="circular-card-stats">
                      <span className="circular-card-badge">{item.count} inscrit(s)</span>
                      <span>•</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>{percent}%</span>
                    </div>
                    <div className="histogram-track" style={{ height: '6px', marginTop: '4px' }}>
                      <div
                        className="histogram-fill"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Rendu de base en barres (pour la vue comparative d'ensemble)
  const renderHistogramPanel = (title, iconKey, data) => {
    const maxVal = Math.max(...data.map((d) => d.count), 1);
    const totalCount = data.reduce((acc, curr) => acc + curr.count, 0) || totalUsers;

    return (
      <div className="histogram-panel">
        <div className="histogram-panel-header">
          <span className="histogram-panel-title">
            <span className="modern-panel-icon" style={{ color: '#2563eb' }}>
              <ModernChartIcon name={iconKey} size={18} color="#2563eb" />
            </span>
            <span>{title}</span>
          </span>
          <span className="histogram-total-badge">{totalCount} utilisateurs</span>
        </div>

        <div className="histogram-bars-list">
          {data.map((item) => {
            const percentOfTotal = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
            const barFillWidth = maxVal > 0 ? Math.max(Math.round((item.count / maxVal) * 100), item.count > 0 ? 8 : 0) : 0;

            return (
              <div key={item.key} className="histogram-bar-row">
                <div className="histogram-bar-meta">
                  <span className="histogram-bar-label">
                    <span className="modern-bar-icon" style={{ color: item.color }}>
                      <ModernChartIcon name={item.iconKey} size={15} color={item.color} />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <span className="histogram-bar-values">
                    <strong>{item.count}</strong>
                    <span className="histogram-bar-percent">({percentOfTotal}%)</span>
                  </span>
                </div>
                <div className="histogram-track">
                  <div
                    className={`histogram-fill ${item.colorClass}`}
                    style={{ width: `${barFillWidth}%`, backgroundColor: item.color }}
                    title={`${item.label} : ${item.count} utilisateur(s) (${percentOfTotal}%)`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="histogram-section">
      <div className="histogram-header">
        <div className="histogram-title-block">
          <h3>
            <span className="modern-title-icon">
              <ModernChartIcon name="chart-bar" size={20} color="#2563eb" />
            </span>
            <span>Histogramme & Répartition des Utilisateurs</span>
          </h3>
          <p>
            Analyse dynamique des inscrits selon les catégories, la localisation à Madagascar et selon l'orientation.
          </p>
        </div>

        <div className="histogram-tabs">
          <button
            type="button"
            className={`histogram-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <ModernChartIcon name="layers" size={15} />
            <span>Tout afficher</span>
          </button>
          <button
            type="button"
            className={`histogram-tab-btn ${activeTab === 'type' ? 'active' : ''}`}
            onClick={() => setActiveTab('type')}
          >
            <ModernChartIcon name="users" size={15} />
            <span>Selon les Catégories</span>
          </button>
          <button
            type="button"
            className={`histogram-tab-btn ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            <ModernChartIcon name="map-pin" size={15} />
            <span>Selon la Localisation</span>
          </button>
          <button
            type="button"
            className={`histogram-tab-btn ${activeTab === 'orientation' || activeTab === 'category' ? 'active' : ''}`}
            onClick={() => setActiveTab('orientation')}
          >
            <ModernChartIcon name="compass" size={15} />
            <span>Selon l'orientation</span>
          </button>
        </div>
      </div>

      {/* VUE SÉPARÉE : HISTOGRAMME CIRCULAIRE */}
      {activeTab === 'type' &&
        renderCircularHistogram('Répartition selon les Catégories', 'users', categoryTypeData)}

      {activeTab === 'location' &&
        renderCircularHistogram('Répartition selon la Localisation (Madagascar)', 'map-pin', locationData)}

      {(activeTab === 'orientation' || activeTab === 'category') &&
        renderCircularHistogram("Selon l'orientation", 'compass', orientationData)}

      {/* VUE COMPARATIVE D'ENSEMBLE (TOUT AFFICHER) */}
      {activeTab === 'all' && (
        <div className="histogram-charts-container">
          {renderHistogramPanel('Selon les Catégories', 'users', categoryTypeData)}
          {renderHistogramPanel('Selon la Localisation', 'map-pin', locationData)}
          {renderHistogramPanel("Selon l'orientation", 'compass', orientationData)}
        </div>
      )}
    </section>
  );
}
