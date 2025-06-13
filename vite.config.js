import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html', // 👈 Chỉ định rõ output path
    }) // Phân tích bundle size (optional)
  ],
  // Base path cho mọi route
  base: '/',

  // Cấu hình server dev
  server: {
    port: 5173, // Cổng mặc định
    host: 'localhost', // Hostname
    strictPort: true,
    open: true, // Tự động mở trình duyệt
    // Bắt buộc cho React Router
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/index.html' } // Fallback mọi route
      ]
    }
  },

  // Tối ưu production build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true, // Bật sourcemap để debug
    chunkSizeWarningLimit: 1500, // Cảnh báo khi chunk lớn
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },

  // Tối ưu preload (optional)
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});