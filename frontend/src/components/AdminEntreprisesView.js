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

export default function AdminEntreprisesView() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [entreprises, setEntreprises] = useState([]);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPole, setFilterPole] = useState('');

  // Modale
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    ent_nom: '',
    ent_secteur: '',
    ent_secteur_detail: '',
    ent_ville: 'Antananarivo',
    ent_implantation: '',
    ent_description: '',
    ent_poste_recrute: '',
    ent_profil_recherche: '',
    ent_accessibilite: '',
    ent_email_contact: '',
    ent_site_web: '',
    ent_pole: 'pole_tech',
  };

  const [form, setForm] = useState(initialForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getEntreprises();
      setEntreprises(res.entreprises || []);
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Erreur lors du chargement des entreprises.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredEntreprises = useMemo(() => {
    return entreprises.filter((item) => {
      const matchPole = !filterPole || item.ent_pole === filterPole;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchPole;
      const matchSearch =
        (item.ent_nom && item.ent_nom.toLowerCase().includes(term)) ||
        (item.ent_secteur && item.ent_secteur.toLowerCase().includes(term)) ||
        (item.ent_ville && item.ent_ville.toLowerCase().includes(term)) ||
        (item.ent_description && item.ent_description.toLowerCase().includes(term)) ||
        (item.ent_poste_recrute && item.ent_poste_recrute.toLowerCase().includes(term));
      return matchPole && matchSearch;
    });
  }, [entreprises, filterPole, searchTerm]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setCurrentId(item.ent_id);
    setForm({
      ent_nom: item.ent_nom || '',
      ent_secteur: item.ent_secteur || '',
      ent_secteur_detail: item.ent_secteur_detail || '',
      ent_ville: item.ent_ville || 'Antananarivo',
      ent_implantation: item.ent_implantation || '',
      ent_description: item.ent_description || '',
      ent_poste_recrute: item.ent_poste_recrute || '',
      ent_profil_recherche: item.ent_profil_recherche || '',
      ent_accessibilite: item.ent_accessibilite || '',
      ent_email_contact: item.ent_email_contact || '',
      ent_site_web: item.ent_site_web || '',
      ent_pole: item.ent_pole || 'pole_tech',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      if (modalMode === 'create') {
        await api.createEntreprise(form);
        setFeedback({ type: 'success', text: 'Entreprise ajoutée avec succès !' });
      } else {
        await api.updateEntreprise(currentId, form);
        setFeedback({ type: 'success', text: 'Entreprise mise à jour avec succès !' });
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
      `Confirmez-vous la suppression définitive de l'entreprise « ${name} » ? Cette action est irréversible.`
    );
    if (!confirmation) return;

    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      await api.deleteEntreprise(id);
      setFeedback({ type: 'success', text: `L'entreprise « ${name} » a été supprimée avec succès.` });
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Erreur lors de la suppression.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-entreprises-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* En-tête dédié */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.45rem' }}>
              Gestion des Entreprises ({entreprises.length})
            </h2>
            <p className="card-desc" style={{ margin: '0.25rem 0 0 0' }}>
              Sociétés partenaires, offres d'emploi, critères de recrutement et implantation à Madagascar
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
            style={{ fontWeight: 700 }}
          >
            + Nouvelle Entreprise
          </button>
        </div>

        {/* Barre de recherche et de filtrage */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher une entreprise, secteur, ville, métier recherché..."
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

      {/* Tableau des Entreprises */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {filteredEntreprises.length} entreprise(s) affichée(s)
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Entreprise</th>
                <th style={{ width: '18%' }}>Secteur</th>
                <th style={{ width: '14%' }}>Ville & Implantation</th>
                <th style={{ width: '18%' }}>Pôle d'Orientation</th>
                <th style={{ width: '18%' }}>Postes Recrutés</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntreprises.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Chargement des entreprises...' : 'Aucune entreprise ne correspond à votre recherche.'}
                  </td>
                </tr>
              ) : (
                filteredEntreprises.map((ent) => (
                  <tr key={ent.ent_id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{ent.ent_nom}</div>
                      {ent.ent_site_web && (
                        <a
                          href={ent.ent_site_web.startsWith('http') ? ent.ent_site_web : `https://${ent.ent_site_web}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.78rem', color: 'var(--hari-blue)', textDecoration: 'none' }}
                        >
                          Site web officiel ↗
                        </a>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ent.ent_secteur}</div>
                      {ent.ent_secteur_detail && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {ent.ent_secteur_detail}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ent.ent_ville || 'Antananarivo'}</div>
                      {ent.ent_implantation && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {ent.ent_implantation}
                        </div>
                      )}
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
                        {POLES_OPTIONS.find((p) => p.value === ent.ent_pole)?.label || ent.ent_pole}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {ent.ent_poste_recrute || 'Non spécifié'}
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {/* Bouton Modifier : Orange Doré #d97706 sans bordure */}
                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={() => handleOpenEdit(ent)}
                        title="Modifier cette entreprise"
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
                        onClick={() => handleDelete(ent.ent_id, ent.ent_nom)}
                        title="Supprimer cette entreprise"
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

      {/* Modal Formulaire Entreprise */}
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
                  {modalMode === 'create' ? 'Ajouter une entreprise' : 'Modifier l\'entreprise'}
                </h2>
                <p className="auth-form-subtitle">
                  {modalMode === 'create'
                    ? 'Remplissez les informations pour enrichir le catalogue des entreprises'
                    : 'Modifiez les informations de l\'entreprise'}
                </p>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="auth-form-grid">
                  <div className="form-group">
                    <label>Nom de l'entreprise * :</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.ent_nom}
                      onChange={(e) => setForm({ ...form, ent_nom: e.target.value })}
                      placeholder="ex: Orange Madagascar"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pôle d'orientation * :</label>
                    <select
                      className="form-control"
                      required
                      value={form.ent_pole}
                      onChange={(e) => setForm({ ...form, ent_pole: e.target.value })}
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
                    <label>Secteur d'activité * :</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.ent_secteur}
                      onChange={(e) => setForm({ ...form, ent_secteur: e.target.value })}
                      placeholder="ex: Télécommunications & Numérique"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ville :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.ent_ville}
                      onChange={(e) => setForm({ ...form, ent_ville: e.target.value })}
                      placeholder="ex: Antananarivo"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Implantation / Quartier / Zone :</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.ent_implantation}
                    onChange={(e) => setForm({ ...form, ent_implantation: e.target.value })}
                    placeholder="ex: Ankorondrano, Zone Galaxy Andraharo"
                  />
                </div>

                <div className="form-group">
                  <label>Description & Présentation :</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={form.ent_description}
                    onChange={(e) => setForm({ ...form, ent_description: e.target.value })}
                    placeholder="Présentation des activités et de la culture d'entreprise..."
                  />
                </div>

                <div className="auth-form-grid">
                  <div className="form-group">
                    <label>Postes recrutés / Profils recherchés :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.ent_poste_recrute}
                      onChange={(e) => setForm({ ...form, ent_poste_recrute: e.target.value })}
                      placeholder="ex: Développeurs, Chefs de projet, Téléconseillers"
                    />
                  </div>

                  <div className="form-group">
                    <label>Accessibilité débutants :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.ent_accessibilite}
                      onChange={(e) => setForm({ ...form, ent_accessibilite: e.target.value })}
                      placeholder="ex: Stages rémunérés, formation interne assurée"
                    />
                  </div>
                </div>

                <div className="auth-form-grid">
                  <div className="form-group">
                    <label>Email de recrutement :</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.ent_email_contact}
                      onChange={(e) => setForm({ ...form, ent_email_contact: e.target.value })}
                      placeholder="recrutement@entreprise.mg"
                    />
                  </div>

                  <div className="form-group">
                    <label>Site web officiel :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.ent_site_web}
                      onChange={(e) => setForm({ ...form, ent_site_web: e.target.value })}
                      placeholder="https://www.entreprise.mg"
                    />
                  </div>
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
                    {loading ? 'Enregistrement...' : modalMode === 'create' ? 'Ajouter l\'entreprise' : 'Enregistrer les modifications'}
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

