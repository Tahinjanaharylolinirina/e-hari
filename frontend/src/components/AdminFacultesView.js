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

export default function AdminFacultesView() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [facultes, setFacultes] = useState([]);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPole, setFilterPole] = useState('');

  // Modale
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    fac_nom: '',
    fac_sigle: '',
    fac_type: 'Public',
    fac_ville: 'Antananarivo',
    fac_filiere: '',
    fac_description: '',
    fac_site_web: '',
    fac_pole: 'sciences_exactes',
  };

  const [form, setForm] = useState(initialForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getFacultes();
      setFacultes(res.facultes || []);
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Erreur lors du chargement des facultés.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredFacultes = useMemo(() => {
    return facultes.filter((item) => {
      const matchPole = !filterPole || item.fac_pole === filterPole;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchPole;
      const matchSearch =
        (item.fac_nom && item.fac_nom.toLowerCase().includes(term)) ||
        (item.fac_sigle && item.fac_sigle.toLowerCase().includes(term)) ||
        (item.fac_filiere && item.fac_filiere.toLowerCase().includes(term)) ||
        (item.fac_ville && item.fac_ville.toLowerCase().includes(term)) ||
        (item.fac_description && item.fac_description.toLowerCase().includes(term));
      return matchPole && matchSearch;
    });
  }, [facultes, filterPole, searchTerm]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setCurrentId(item.fac_id);
    setForm({
      fac_nom: item.fac_nom || '',
      fac_sigle: item.fac_sigle || '',
      fac_type: item.fac_type || 'Public',
      fac_ville: item.fac_ville || 'Antananarivo',
      fac_filiere: item.fac_filiere || '',
      fac_description: item.fac_description || '',
      fac_site_web: item.fac_site_web || '',
      fac_pole: item.fac_pole || 'sciences_exactes',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      if (modalMode === 'create') {
        await api.createFaculte(form);
        setFeedback({ type: 'success', text: 'Faculté ajoutée avec succès !' });
      } else {
        await api.updateFaculte(currentId, form);
        setFeedback({ type: 'success', text: 'Faculté mise à jour avec succès !' });
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
      `Confirmez-vous la suppression définitive de la faculté « ${name} » ? Cette action est irréversible.`
    );
    if (!confirmation) return;

    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      await api.deleteFaculte(id);
      setFeedback({ type: 'success', text: `La faculté « ${name} » a été supprimée avec succès.` });
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Erreur lors de la suppression.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-facultes-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* En-tête dédié */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.45rem' }}>
              Gestion des Facultés & Établissements ({facultes.length})
            </h2>
            <p className="card-desc" style={{ margin: '0.25rem 0 0 0' }}>
              Universités d'État, grandes écoles et instituts privés habilités, mentions et filières d'études supérieures
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
            style={{ fontWeight: 700 }}
          >
            + Nouvelle Faculté
          </button>
        </div>

        {/* Barre de recherche et de filtrage */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher une faculté, un institut, un sigle, une filière, une ville..."
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

      {/* Tableau des Facultés */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {filteredFacultes.length} établissement(s) affiché(s)
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Faculté / Institut</th>
                <th style={{ width: '10%' }}>Sigle</th>
                <th style={{ width: '10%' }}>Statut</th>
                <th style={{ width: '12%' }}>Ville</th>
                <th style={{ width: '18%' }}>Pôle d'Orientation</th>
                <th style={{ width: '15%' }}>Filières clés</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacultes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Chargement des facultés...' : 'Aucune faculté ne correspond à votre recherche.'}
                  </td>
                </tr>
              ) : (
                filteredFacultes.map((fac) => (
                  <tr key={fac.fac_id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{fac.fac_nom}</div>
                      {fac.fac_site_web && (
                        <a
                          href={fac.fac_site_web.startsWith('http') ? fac.fac_site_web : `https://${fac.fac_site_web}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.78rem', color: 'var(--hari-blue)', textDecoration: 'none' }}
                        >
                          Site web officiel ↗
                        </a>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {fac.fac_sigle || '-'}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          background: fac.fac_type === 'Public' ? '#dcfce7' : '#fef3c7',
                          color: fac.fac_type === 'Public' ? '#166534' : '#92400e',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                        }}
                      >
                        {fac.fac_type || 'Public'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{fac.fac_ville || 'Antananarivo'}</span>
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
                        {POLES_OPTIONS.find((p) => p.value === fac.fac_pole)?.label || fac.fac_pole}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {fac.fac_filiere || 'Toutes filières'}
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {/* Bouton Modifier : Orange Doré #d97706 sans bordure */}
                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={() => handleOpenEdit(fac)}
                        title="Modifier cette faculté"
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
                        onClick={() => handleDelete(fac.fac_id, fac.fac_nom)}
                        title="Supprimer cette faculté"
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

      {/* Modal Formulaire Faculté */}
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
                  {modalMode === 'create' ? 'Ajouter une faculté' : 'Modifier la faculté'}
                </h2>
                <p className="auth-form-subtitle">
                  {modalMode === 'create'
                    ? 'Remplissez les informations pour enrichir le catalogue des établissements'
                    : 'Modifiez les informations de l\'établissement'}
                </p>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="auth-form-grid">
                  <div className="form-group">
                    <label>Nom de la faculté ou université * :</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.fac_nom}
                      onChange={(e) => setForm({ ...form, fac_nom: e.target.value })}
                      placeholder="ex: Faculté des Sciences d'Ankatso"
                    />
                  </div>

                  <div className="form-group">
                    <label>Sigle ou acronyme :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.fac_sigle}
                      onChange={(e) => setForm({ ...form, fac_sigle: e.target.value })}
                      placeholder="ex: ESPA, DEGS, FLSH"
                    />
                  </div>
                </div>

                <div className="auth-form-grid">
                  <div className="form-group">
                    <label>Statut de l'établissement :</label>
                    <select
                      className="form-control"
                      value={form.fac_type}
                      onChange={(e) => setForm({ ...form, fac_type: e.target.value })}
                    >
                      <option value="Public">Public (Université d'État)</option>
                      <option value="Privé">Privé (Institut habilité)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Pôle d'orientation * :</label>
                    <select
                      className="form-control"
                      required
                      value={form.fac_pole}
                      onChange={(e) => setForm({ ...form, fac_pole: e.target.value })}
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
                    <label>Ville :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.fac_ville}
                      onChange={(e) => setForm({ ...form, fac_ville: e.target.value })}
                      placeholder="ex: Antananarivo, Fianarantsoa, Toamasina"
                    />
                  </div>

                  <div className="form-group">
                    <label>Site web officiel :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.fac_site_web}
                      onChange={(e) => setForm({ ...form, fac_site_web: e.target.value })}
                      placeholder="http://www.univ-antananarivo.mg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Filières et mentions principales :</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.fac_filiere}
                    onChange={(e) => setForm({ ...form, fac_filiere: e.target.value })}
                    placeholder="ex: Informatique, Électronique, Génie Civil, Mathématiques"
                  />
                </div>

                <div className="form-group">
                  <label>Description & Atouts :</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.fac_description}
                    onChange={(e) => setForm({ ...form, fac_description: e.target.value })}
                    placeholder="Présentation académique, diplômes délivrés (Licence, Master, Doctorat)..."
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
                    {loading ? 'Enregistrement...' : modalMode === 'create' ? 'Ajouter la faculté' : 'Enregistrer les modifications'}
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

