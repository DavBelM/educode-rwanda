import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — tiny, always needed
          'react-vendor': ['react', 'react-dom', 'react-router'],
          // Code editor — largest single dependency, only needed in workspace/lesson
          'codemirror': [
            '@uiw/react-codemirror',
            '@uiw/codemirror-theme-vscode',
            '@codemirror/lang-javascript',
            '@codemirror/lang-html',
          ],
          // MUI — only used in a few admin views
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Supabase client
          'supabase': ['@supabase/supabase-js'],
          // Gradio / HuggingFace client — only called server-side via API but bundled
          'gradio': ['@gradio/client'],
          // Animation / motion
          'motion': ['motion'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
