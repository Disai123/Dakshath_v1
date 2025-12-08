import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Extract base URL (remove /api suffix if present) for proxy target
const getProxyTarget = (url) => {
  try {
    const urlObj = new URL(url);
    // Remove /api from pathname if it exists
    if (urlObj.pathname.endsWith('/api')) {
      urlObj.pathname = urlObj.pathname.replace(/\/api$/, '');
    }
    return urlObj.origin + urlObj.pathname;
  } catch {
    // Fallback to default if URL parsing fails
    return 'http://localhost:5001';
  }
};

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get API URL from environment variable
  const API_URL = env.VITE_API_URL || 'http://localhost:5001/api';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: getProxyTarget(API_URL),
          changeOrigin: true
        }
      }
    }
  }
})

