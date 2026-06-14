const API_BASE_URL = 'http://localhost:8000/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Si le body est un FormData, le navigateur gère le Content-Type automatiquement (avec le boundary)
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...getAuthHeader() as Record<string, string>,
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMsg = 'Une erreur est survenue';
    
    // Default messages based on status
    if (response.status === 401) errorMsg = 'Identifiants incorrects ou session expirée';
    if (response.status === 403) errorMsg = 'Accès refusé';
    if (response.status === 404) errorMsg = 'Ressource non trouvée';
    if (response.status >= 500) errorMsg = 'Erreur serveur. Veuillez réessayer plus tard.';

    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.detail || errorMsg;
    } catch (e) {
      // Ignored
    }
    throw new Error(errorMsg);
  }

  // Handle 204 No Content or empty responses
  if (response.status === 204) {
    return null;
  }
  
  try {
    console.log("url :", url);
    const data = await response.json();
    console.log("data :", data);
    return data;
  } catch (e) {
    return null;
  }
}

export const api = {
  auth: {
    login: (data: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => fetchAPI('/auth/me'),
    dashboard: () => fetchAPI('/auth/dashboard'),
  },
  competitions: {
    list: (params?: { status?: string; task_type?: string; page?: number; per_page?: number }) => {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.task_type && params.task_type !== 'all') query.append('task_type', params.task_type);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.per_page) query.append('per_page', params.per_page.toString());
      
      const queryString = query.toString();
      return fetchAPI(`/competitions${queryString ? `?${queryString}` : ''}`);
    },
    getMyCompetitions: () => fetchAPI(`/competitions/my`),
    getDetails: (id: string) => fetchAPI(`/competitions/${id}`),
    create: (formData: FormData) => fetchAPI('/competitions', { method: 'POST', body: formData }),
    join: (id: string) => fetchAPI(`/competitions/${id}/join`, { method: 'POST' }),
    leave: (id: string) => fetchAPI(`/competitions/${id}/leave`, { method: 'DELETE' }),
    participants: (id: string) => fetchAPI(`/competitions/${id}/participants`),
  }
};
