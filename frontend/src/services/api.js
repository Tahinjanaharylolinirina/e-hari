const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // --- AUTHENTIFICATION ---
  async login(email, mot_de_passe) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mot_de_passe }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur d'inscription");
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur session');
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // --- GESTION UTILISATEURS ---
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/users${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement des utilisateurs');
    return data;
  },

  async getUserStats() {
    const res = await fetch(`${API_BASE_URL}/users/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la récupération des stats');
    return data;
  },

  async updateUser(id, updateData) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de mise à jour");
    return data;
  },

  async updateUserStatus(id, statut) {
    const res = await fetch(`${API_BASE_URL}/users/${id}/statut`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ statut }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur statut');
    return data;
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur suppression');
    return data;
  },

  async getPupils() {
    const res = await fetch(`${API_BASE_URL}/users/eleves`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur chargement élèves');
    return data;
  },

  async getStudents() {
    const res = await fetch(`${API_BASE_URL}/users/etudiants`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur étudiants');
    return data;
  },

  async getEmplois() {
    const res = await fetch(`${API_BASE_URL}/users/emploi`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur profils emploi');
    return data;
  },

  async getReconversions() {
    return this.getEmplois();
  },

  // --- GESTION DES RÉFÉRENTIELS (ENTREPRISES, FACULTÉS, MÉTIERS) ---
  // 1. Entreprises
  async getEntreprises(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/entreprises${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur chargement entreprises');
    return data;
  },

  async getEntreprise(id) {
    const res = await fetch(`${API_BASE_URL}/entreprises/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur chargement entreprise');
    return data;
  },

  async createEntreprise(entrepriseData) {
    const res = await fetch(`${API_BASE_URL}/entreprises`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entrepriseData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de création de l'entreprise");
    return data;
  },

  async updateEntreprise(id, entrepriseData) {
    const res = await fetch(`${API_BASE_URL}/entreprises/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entrepriseData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de mise à jour de l'entreprise");
    return data;
  },

  async deleteEntreprise(id) {
    const res = await fetch(`${API_BASE_URL}/entreprises/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression de l'entreprise");
    return data;
  },

  // 2. Facultés & Universités
  async getFacultes(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/facultes${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur chargement facultés');
    return data;
  },

  async getFaculte(id) {
    const res = await fetch(`${API_BASE_URL}/facultes/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur chargement faculté');
    return data;
  },

  async createFaculte(faculteData) {
    const res = await fetch(`${API_BASE_URL}/facultes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(faculteData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de création de la faculté");
    return data;
  },

  async updateFaculte(id, faculteData) {
    const res = await fetch(`${API_BASE_URL}/facultes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(faculteData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de mise à jour de la faculté");
    return data;
  },

  async deleteFaculte(id) {
    const res = await fetch(`${API_BASE_URL}/facultes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression de la faculté");
    return data;
  },

  // 3. Métiers & Débouchés
  async getMetiers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/metiers${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur chargement métiers');
    return data;
  },

  async getMetier(id) {
    const res = await fetch(`${API_BASE_URL}/metiers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur chargement métier');
    return data;
  },

  async createMetier(metierData) {
    const res = await fetch(`${API_BASE_URL}/metiers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(metierData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de création du métier");
    return data;
  },

  async updateMetier(id, metierData) {
    const res = await fetch(`${API_BASE_URL}/metiers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(metierData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de mise à jour du métier");
    return data;
  },

  async deleteMetier(id) {
    const res = await fetch(`${API_BASE_URL}/metiers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression du métier");
    return data;
  },

  // --- TESTS D'ORIENTATION ÉLÈVE ---
  async submitEleveInterestsTest(data) {
    const res = await fetch(`${API_BASE_URL}/users/eleve/test-interets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'enregistrement du test');
    if (resData.user) {
      localStorage.setItem('user', JSON.stringify(resData.user));
    }
    return resData;
  },

  async submitEleveMatieresTest(data) {
    const res = await fetch(`${API_BASE_URL}/users/eleve/test-matieres`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'enregistrement du questionnaire');
    if (resData.user) {
      localStorage.setItem('user', JSON.stringify(resData.user));
    }
    return resData;
  },

  // --- TESTS D'ORIENTATION ET INSERTION ÉTUDIANT ---
  async submitEtudiantInterestsTest(data) {
    const res = await fetch(`${API_BASE_URL}/users/etudiant/test-interets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'enregistrement du test étudiant');
    if (resData.user) {
      localStorage.setItem('user', JSON.stringify(resData.user));
    }
    return resData;
  },

  async submitEtudiantCompetencesTest(data) {
    const res = await fetch(`${API_BASE_URL}/users/etudiant/test-competences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'enregistrement du test de compétences');
    if (resData.user) {
      localStorage.setItem('user', JSON.stringify(resData.user));
    }
    return resData;
  },

  // --- TESTS EMPLOI & TRANSITION PROFESSIONNELLE ---
  async submitEmploiInterestsTest(data) {
    const res = await fetch(`${API_BASE_URL}/users/emploi/test-interets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'enregistrement du test emploi');
    if (resData.user) {
      localStorage.setItem('user', JSON.stringify(resData.user));
    }
    return resData;
  },

  async submitReconversionInterestsTest(data) {
    return this.submitEmploiInterestsTest(data);
  },

  async submitEmploiCompetencesTest(data) {
    const res = await fetch(`${API_BASE_URL}/users/emploi/test-competences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'enregistrement du test de compétences');
    if (resData.user) {
      localStorage.setItem('user', JSON.stringify(resData.user));
    }
    return resData;
  },

  async submitReconversionCompetencesTest(data) {
    return this.submitEmploiCompetencesTest(data);
  },

  // --- RÉCUPÉRATION DES QUESTIONS & CARACTÉRISTIQUES DEPUIS LA BDD ---
  async getTestQuestions(role = 'eleve', testNumber = 1) {
    const res = await fetch(`${API_BASE_URL}/tests/${role}/${testNumber}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de la récupération des questions du test');
    return resData;
  },

  async getTest1(role = 'eleve') {
    return this.getTestQuestions(role, 1);
  },

  async getTest2(role = 'eleve') {
    return this.getTestQuestions(role, 2);
  },

  // --- EMPLOI DU TEMPS & PLANNING DE RÉVISION (TABLE DÉDIÉE) ---
  async saveEleveEdt(edtData) {
    const res = await fetch(`${API_BASE_URL}/users/eleve/edt`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ edtData }),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'enregistrement de l\'emploi du temps');
    if (resData.user) {
      localStorage.setItem('user', JSON.stringify(resData.user));
    }
    return resData;
  },

  async getEleveEdt() {
    const res = await fetch(`${API_BASE_URL}/users/eleve/edt`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de la récupération de l\'emploi du temps');
    return resData;
  },

  // --- RAPPELS DE RÉVISION (SIGNALEMENT PAR EMAIL) ---
  async testRevisionReminder(reminderData = {}) {
    const res = await fetch(`${API_BASE_URL}/notifications/test-rappel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reminderData),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de l\'envoi du rappel');
    return resData;
  },

  async updateNotificationPermission(ele_not_ema) {
    const res = await fetch(`${API_BASE_URL}/notifications/permission`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ele_not_ema }),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Erreur lors de la mise à jour de la permission');
    return resData;
  },

  // --- MESSAGERIE / CHAT MP ---
  async sendMessage(messageData) {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de l'envoi du message");
    return data;
  },

  async getConversation(userId = null) {
    const url = userId 
      ? `${API_BASE_URL}/messages/conversation/${userId}`
      : `${API_BASE_URL}/messages/conversation`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement de la conversation');
    return data;
  },

  async getAdminConversations() {
    const res = await fetch(`${API_BASE_URL}/messages/admin/conversations`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement des conversations admin');
    return data;
  },

  async getUnreadMessagesCount() {
    const res = await fetch(`${API_BASE_URL}/messages/unread-count`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur comptage messages non lus');
    return data;
  },

  async markConversationAsRead(userId) {
    const res = await fetch(`${API_BASE_URL}/messages/mark-read/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur marquage lecture');
    return data;
  },

  async broadcastMessage(broadcastData) {
    const res = await fetch(`${API_BASE_URL}/messages/broadcast`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(broadcastData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la diffusion du message');
    return data;
  },

  async updateMessage(messageId, payload) {
    const res = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la modification du message');
    return data;
  },

  async deleteMessage(messageId) {
    const res = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression du message');
    return data;
  },

  // Helpers HTTP génériques
  async get(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return { data, ok: res.ok, status: res.status };
  },

  async post(endpoint, body) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { data, ok: res.ok, status: res.status };
  },

  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  },
};

export default api;

