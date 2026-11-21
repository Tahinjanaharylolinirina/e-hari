import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';

const POLES_OPTIONS = [
  { value: 'pole_tech', label: 'Technologies, Informatique & Numérique' },
  { value: 'pole_tech_digital', label: 'Digital, Web & BPO' },
  { value: 'sciences_exactes', label: 'Sciences Exactes & Ingénierie' },
  { value: 'sciences_vie_sante', label: 'Santé, Médecine & Sciences de la Vie' },
  { value: 'eco_societe', label: 'Économie, Droit & Sciences Sociales' },
  { value: 'pole_finance', label: 'Finance, Comptabilité & Audit' },
  { value: 'pole_logistique_supply', label: 'Logistique, Transport & Distribution' },
  { value: 'pole_impact_vert', label: 'Climat, Environnement & Énergie Verte' },
  { value: 'pole_entrepreneuriat', label: 'Entrepreneuriat & Artisanat' },
  { value: 'lettres_langues', label: 'Lettres, Langues & Communication' },
];

export default function AdminMetiersView() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [metiers, setMetiers] = useState([]);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPole, setFilterPole] = useState('');

  // Modale
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    met_nom: '',
    met_secteur: '',
    met_niveau_requis: '',
    met_salaire_indicatif: '',
    met_description: '',
    met_debouche: '',
    met_pole: 'pole_tech',
  };

  const [form, setForm] = useState(initialForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getMetiers();
      setMetiers(res.metiers || []);
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Erreur lors du chargement des métiers.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredMetiers = useMemo(() => {
    return metiers.filter((item) => {
      const matchPole = !filterPole || item.met_pole === filterPole;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchPole;
      const matchSearch =
        (item.met_nom && item.met_nom.toLowerCase().includes(term)) ||
        (item.met_secteur && item.met_secteur.toLowerCase().includes(term)) ||
        (item.met_niveau_requis && item.met_niveau_requis.toLowerCase().includes(term)) ||
        (item.met_description && item.met_description.toLowerCase().includes(term)) ||
        (item.met_debouche && item.met_debouche.toLowerCase().includes(term));
      return matchPole && matchSearch;
    });
  }, [metiers, filterPole, searchTerm]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setCurrentId(item.met_id);
    setForm({
      met_nom: item.met_nom || '',
      met_secteur: item.met_secteur || '',
      met_niveau_requis: item.met_niveau_requis || '',
      met_salaire_indicatif: item.met_salaire_indicatif || '',
      met_description: item.met_description || '',
      met_debouche: item.met_debouche || '',
      met_pole: item.met_pole || 'pole_tech',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      if (modalMode === 'create') {
        await api.createMetier(form);
        setFeedback({ type: 'success', text: 'Métier ajouté avec succès !' });
      } else {
        await api.updateMetier(currentId, form);
        setFeedback({ type: 'success', text: 'Métier mis à jour avec succès !' });
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Erreur lors de l\'enregistrement.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmation = window.confirm(
      `Confirmez-vous la suppression définitive du métier « ${name} » ? Cette action est irréversible.`
    );
    if (!confirmation) return;

    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      await api.deleteMetier(id);
      setFeedback({ type: 'success', text: `Le métier « ${name} » a été supprimé avec succès.` });
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Erreur lors de la suppression.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-metiers-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* En-tête dédié */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.45rem' }}>
              Gestion des Métiers & Carrières ({metiers.length})
            </h2>
            <p className="card-desc" style={{ margin: '0.25rem 0 0 0' }}>
              Fiches métiers, secteurs en croissance, niveaux d'études requis, débouchés et rémunérations indicatives
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
            style={{ fontWeight: 700 }}
          >
            + Nouveau Métier
          </button>
        </div>

        {/* Barre de recherche et de filtrage */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un métier, un secteur professionnel, des débouchés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ flex: '0 1 260px', minWidth: '180px', maxWidth: '100%' }}>
            <select
              className="form-control"
              value={filterPole}
              onChange={(e) => setFilterPole(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <option value="">Tous les Pôles d'Orientation</option>
              {POLES_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || filterPole) && (
            <div style={{ flexShrink: 0 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterPole('');
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message de notification / feedback */}
      {feedback.text && (
        <div className={`alert alert-${feedback.type}`} style={{ margin: 0 }}>
          {feedback.text}
        </div>
      )}

      {/* Tableau des Métiers */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {filteredMetiers.length} métier(s) affiché(s)
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Métier</th>
                <th style={{ width: '18%' }}>Secteur</th>
                <th style={{ width: '18%' }}>Pôle d'Orientation</th>
                <th style={{ width: '14%' }}>Niveau Requis</th>
                <th style={{ width: '18%' }}>Débouchés clés</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetiers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Chargement des métiers...' : 'Aucun métier ne correspond à votre recherche.'}
                  </td>
                </tr>
              ) : (
                filteredMetiers.map((met) => (
                  <tr key={met.met_id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{met.met_nom}</div>
                      {met.met_description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {met.met_description.length > 90
                            ? `${met.met_description.substring(0, 90)}...`
                            : met.met_description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{met.met_secteur}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                        }}
                      >
                        {POLES_OPTIONS.find((p) => p.value === met.met_pole)?.label || met.met_pole}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                        {met.met_niveau_requis || 'Tous niveaux'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {met.met_debouche || 'Secteurs variés'}
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {/* Bouton Modifier : Orange Doré #d97706 sans bordure */}
                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={() => handleOpenEdit(met)}
                        title="Modifier ce métier"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {/* Bouton Supprimer : Rouge #dc2626 sans bordure */}
                      <button
                        type="button"
                        className="action-icon-btn action-delete"
                        onClick={() => handleDelete(met.met_id, met.met_nom)}
                        title="Supprimer ce métier"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulaire Métier */}
      {modalOpen && (
        <div
          className="auth-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="auth-modal-dialog" style={{ maxWidth: '640px' }}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
              title="Fermer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="card auth-card modal-inner-card" style={{ padding: '2rem' }}>
              <div className="auth-form-header">
                <h2 className="auth-form-title">
                  {modalMode === 'create' ? 'Ajouter un métier' : 'Modifier le métier'}
                </h2>
                <p className="auth-form-subtitle">
                  {modalMode === 'create'
                    ? 'Remplissez les informations pour enrichir le catalogue des métiers'
                    : 'Modifiez les informations du métier'}
                </p>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="auth-form-grid">
                  <div className="form-group">
                    <label>Intitulé du métier * :</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.met_nom}
                      onChange={(e) => setForm({ ...form, met_nom: e.target.value })}
                      placeholder="ex: Ingénieur DevOps & Cloud"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pôle d'orientation * :</label>
                    <select
                      className="form-control"
                      required
                      value={form.met_pole}
                      onChange={(e) => setForm({ ...form, met_pole: e.target.value })}
                    >
                      {POLES_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="auth-form-grid">
                  <div className="form-group">
                    <label>Secteur professionnel * :</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.met_secteur}
                      onChange={(e) => setForm({ ...form, met_secteur: e.target.value })}
                      placeholder="ex: Technologies & Numérique"
                    />
                  </div>

                  <div className="form-group">
                    <label>Niveau d'études requis :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.met_niveau_requis}
                      onChange={(e) => setForm({ ...form, met_niveau_requis: e.target.value })}
                      placeholder="ex: Licence Pro / Master ou autodidacte certifié"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Rémunération / Salaire indicatif :</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.met_salaire_indicatif}
                    onChange={(e) => setForm({ ...form, met_salaire_indicatif: e.target.value })}
                    placeholder="ex: Attractif avec forte progression à Madagascar"
                  />
                </div>

                <div className="form-group">
                  <label>Description des missions & responsabilités :</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={form.met_description}
                    onChange={(e) => setForm({ ...form, met_description: e.target.value })}
                    placeholder="Missions au quotidien, compétences techniques et comportementales nécessaires..."
                  />
                </div>

                <div className="form-group">
                  <label>Débouchés & Entreprises qui recrutent :</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.met_debouche}
                    onChange={(e) => setForm({ ...form, met_debouche: e.target.value })}
                    placeholder="ex: Sociétés de services numériques, banques, télécoms, travail à distance"
                  />
                </div>

                <div className="form-submit-wrapper" style={{ gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-form-submit"
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : modalMode === 'create' ? 'Ajouter le métier' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

