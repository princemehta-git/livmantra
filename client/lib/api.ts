import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Create axios instance with interceptor for auth
const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("livmantra_user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  return config;
});

// Guest endpoints (backward compatibility)
export const postGuest = (payload: any) =>
  axios.post(`${API_BASE}/auth/guest`, payload);

// Auth endpoints
export const signup = (payload: { name: string; email: string; phone: string; password: string }) =>
  axios.post(`${API_BASE}/auth/signup`, payload);

export const login = (payload: { email: string; password: string }) =>
  axios.post(`${API_BASE}/auth/login`, payload);

export const getMe = () => api.get(`${API_BASE}/auth/me`);

export const updateProfile = (payload: { name?: string; phone?: string; dob?: string; gender?: string; state?: string; nationality?: string }) =>
  api.put(`${API_BASE}/auth/profile`, payload);

export const uploadProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  return api.post(`${API_BASE}/auth/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// User endpoints
export const getUserTests = () => api.get(`${API_BASE}/user/tests`);

export const getUserProfile = () => api.get(`${API_BASE}/user/profile`);

export const updateUserProfile = (payload: { name?: string; phone?: string; dob?: string; gender?: string; state?: string; nationality?: string }) =>
  api.put(`${API_BASE}/user/profile`, payload);

// Admin endpoints
export const adminLogin = (payload: { email: string; password: string }) =>
  axios.post(`${API_BASE}/admin/login`, payload);

export const getAdminUsers = (params?: { page?: number; limit?: number; search?: string }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("livmantra_admin") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.token;
    } catch (e) {
      // Ignore
    }
  }
  return axios.get(`${API_BASE}/admin/users`, {
    params,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

export const getAdminUserDetails = (userId: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("livmantra_admin") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.token;
    } catch (e) {
      // Ignore
    }
  }
  return axios.get(`${API_BASE}/admin/users/${userId}`, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

export const impersonateUser = (userId: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("livmantra_admin") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.token;
    } catch (e) {
      // Ignore
    }
  }
  return axios.post(`${API_BASE}/admin/impersonate/${userId}`, {}, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

export const getAdminStats = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("livmantra_admin") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.token;
    } catch (e) {
      // Ignore
    }
  }
  return axios.get(`${API_BASE}/admin/stats`, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

export const getAdminFeedback = (params?: { page?: number; limit?: number }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("livmantra_admin") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.token;
    } catch (e) {
      // Ignore
    }
  }
  return axios.get(`${API_BASE}/admin/feedback`, {
    params,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

// Test endpoints
export const submitTest = (payload: any) =>
  api.post(`${API_BASE}/test/submit`, payload);

export const getResult = (id: string) =>
  axios.get(`${API_BASE}/test/result/${id}`);

export const mergeReport = (snapshot: any) =>
  axios.post(`${API_BASE}/test/mergeReport`, { snapshot });

export const postChat = (payload: any) =>
  axios.post(`${API_BASE}/chat`, payload);

export const submitFeedback = (payload: { userId: string; resultId: string; rating: number; comment?: string }) =>
  axios.post(`${API_BASE}/test/feedback`, payload);

// Message endpoints
export const getUserConversation = () => api.get(`${API_BASE}/messages/conversation`);

export const getMessages = (conversationId: string) => {
  // Determine which token to use based on current URL context
  let authToken = null;
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    
    // If URL contains '/admin', use admin token
    if (currentPath.includes("/admin")) {
      const adminData = localStorage.getItem("livmantra_admin");
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
    // If URL contains '/dashboard', use user token
    else if (currentPath.includes("/dashboard")) {
      const userData = localStorage.getItem("livmantra_user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
  }
  
  // If we have a specific token, use it; otherwise let api instance handle it
  if (authToken) {
    return axios.get(`${API_BASE}/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  
  return api.get(`${API_BASE}/messages/${conversationId}`);
};

export const sendMessage = (data: { conversationId: string; content?: string }, file?: File) => {
  const formData = new FormData();
  formData.append("conversationId", data.conversationId);
  if (data.content) {
    formData.append("content", data.content);
  }
  if (file) {
    formData.append("attachment", file);
  }
  
  // Determine which token to use based on current URL context
  let authToken = null;
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    
    // If URL contains '/admin', use admin token
    if (currentPath.includes("/admin")) {
      const adminData = localStorage.getItem("livmantra_admin");
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
    // If URL contains '/dashboard', use user token
    else if (currentPath.includes("/dashboard")) {
      const userData = localStorage.getItem("livmantra_user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
  }
  
  // If we have a specific token, use it; otherwise let api instance handle it
  if (authToken) {
    return axios.post(`${API_BASE}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  
  return api.post(`${API_BASE}/messages`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const markMessageAsRead = (messageId: string) => {
  // Determine which token to use based on current URL context
  let authToken = null;
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    
    // If URL contains '/admin', use admin token
    if (currentPath.includes("/admin")) {
      const adminData = localStorage.getItem("livmantra_admin");
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
    // If URL contains '/dashboard', use user token
    else if (currentPath.includes("/dashboard")) {
      const userData = localStorage.getItem("livmantra_user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
  }
  
  // If we have a specific token, use it; otherwise let api instance handle it
  if (authToken) {
    return axios.put(`${API_BASE}/messages/${messageId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  
  return api.put(`${API_BASE}/messages/${messageId}/read`);
};

export const markConversationAsRead = (conversationId: string) => {
  // Determine which token to use based on current URL context
  let authToken = null;
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    
    // If URL contains '/admin', use admin token
    if (currentPath.includes("/admin")) {
      const adminData = localStorage.getItem("livmantra_admin");
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
    // If URL contains '/dashboard', use user token
    else if (currentPath.includes("/dashboard")) {
      const userData = localStorage.getItem("livmantra_user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore
        }
      }
    }
  }
  
  // If we have a specific token, use it; otherwise let api instance handle it
  if (authToken) {
    return axios.put(`${API_BASE}/messages/conversation/${conversationId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  
  return api.put(`${API_BASE}/messages/conversation/${conversationId}/read`);
};

export const getAdminConversations = (params?: { page?: number; limit?: number; search?: string }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("livmantra_admin") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.token;
    } catch (e) {
      // Ignore
    }
  }
  return axios.get(`${API_BASE}/messages/admin/conversations`, {
    params,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

export const getAdminUnreadCount = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("livmantra_admin") : null;
  let authToken = null;
  if (token) {
    try {
      const parsed = JSON.parse(token);
      authToken = parsed.token;
    } catch (e) {
      // Ignore
    }
  }
  return axios.get(`${API_BASE}/messages/admin/unread-count`, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
};

