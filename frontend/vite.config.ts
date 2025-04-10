import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https://image.tmdb.org https://moviesforintex.blob.core.windows.net https://dummyimage.com;" +
        "frame-ancestors 'none'; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net https://*.database.windows.net; " +
        "object-src 'none'; base-uri 'self'; form-action 'self';",
    },
  },
});
