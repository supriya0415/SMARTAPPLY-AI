// Environment configuration
export const config = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3002',
  appTitle: import.meta.env.VITE_APP_TITLE || 'SmartApply AI',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'AI-Powered Career & Skills Mentor',
  isProduction: import.meta.env.PROD || false,
  isDevelopment: import.meta.env.DEV || true,
};

// Validate required environment variables
export const validateConfig = () => {
  if (!config.geminiApiKey && config.isProduction) {
    console.warn('VITE_GEMINI_API_KEY is not set. Gemini API features will not work.');
    return false;
  }
  return true;
};
