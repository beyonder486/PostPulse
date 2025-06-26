import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'extension/popup-entry.jsx' // <-- update here
      },
      output: {
        entryFileNames: 'popup.js'
      }
    },
    outDir: 'extension',
    emptyOutDir: false
  }
});