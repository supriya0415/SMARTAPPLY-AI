import { GoogleGenerativeAI } from '@google/generative-ai';

export const testGeminiAPI = async (): Promise<{ success: boolean; error?: string; response?: string }> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      return { success: false, error: 'API key not configured' };
    }

    console.log('Testing API with key:', apiKey.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent('Say "API test successful" if you can read this.');
    const response = await result.response;
    const text = response.text();
    
    return { success: true, response: text };
  } catch (error) {
    console.error('API test failed:', error);
    return { success: false, error: (error as Error).message || 'Unknown error' };
  }
};

// Quick test function you can call from browser console
(window as any).testAPI = testGeminiAPI;