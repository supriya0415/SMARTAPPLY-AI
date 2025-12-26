import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Get auth token - AuthService uses 'jwt' key, not 'token'
const getAuthHeader = () => {
  const token = localStorage.getItem('jwt') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export class AdminService {
  // ==================== USER MANAGEMENT ====================
  
  static async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await axios.get(`${API_URL}/api/admin/users`, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  }

  static async getUserById(id: string) {
    const response = await axios.get(`${API_URL}/api/admin/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  static async deleteUser(id: string) {
    const response = await axios.delete(`${API_URL}/api/admin/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  static async updateUserRole(id: string, role: 'user' | 'admin') {
    const response = await axios.patch(
      `${API_URL}/api/admin/users/${id}/role`,
      { role },
      { headers: getAuthHeader() }
    );
    return response.data;
  }

  // ==================== ANALYTICS ====================
  
  static async getAnalytics() {
    const response = await axios.get(`${API_URL}/api/admin/analytics`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // ==================== CAREER/JOB MANAGEMENT ====================
  
  static async getAllCareers(params?: {
    page?: number;
    limit?: number;
    domain?: string;
    subdomain?: string;
    isActive?: boolean;
  }) {
    const response = await axios.get(`${API_URL}/api/admin/careers`, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  }

  static async createCareer(careerData: any) {
    const response = await axios.post(
      `${API_URL}/api/admin/careers`,
      careerData,
      { headers: getAuthHeader() }
    );
    return response.data;
  }

  static async updateCareer(id: string, careerData: any) {
    const response = await axios.put(
      `${API_URL}/api/admin/careers/${id}`,
      careerData,
      { headers: getAuthHeader() }
    );
    return response.data;
  }

  static async deleteCareer(id: string) {
    const response = await axios.delete(
      `${API_URL}/api/admin/careers/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  }

  static async getCareerDomains() {
    const response = await axios.get(`${API_URL}/api/admin/careers/domains`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Import all careers from frontend taxonomy
  static async importCareersFromTaxonomy(careers: any[]) {
    const response = await axios.post(
      `${API_URL}/api/admin/careers/import-from-taxonomy`,
      { careers },
      { headers: getAuthHeader() }
    );
    return response.data;
  }
}

