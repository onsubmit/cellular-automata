/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cellular-automata/',
  plugins: [react()],
  test: {
    mockReset: true,
  },
});
