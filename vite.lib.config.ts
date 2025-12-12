import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Separate build config to produce an embeddable library bundle
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: './src/embed.tsx',
      name: 'EviChatBot',
      formats: ['iife'],
      fileName: () => 'evi-chatbot.js',
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    emptyOutDir: false,
    outDir: 'dist',
    minify: 'terser',
  },
})


