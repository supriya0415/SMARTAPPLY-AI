import axios from 'axios'
import { getLocalStorage } from './helper'
import { getToken } from './helper'

// Prefer VITE_BACKEND_URL (new). Fall back to VITE_SERVER_URL if present.
const env: any = import.meta.env
const base = env.VITE_BACKEND_URL ?? env.VITE_SERVER_URL ?? ''
const baseURL = (base.endsWith('/') ? base.slice(0, -1) : base) + '/api'

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000, // Increased to 30 seconds for database operations
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // redirect to sign-in on unauthorized
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
