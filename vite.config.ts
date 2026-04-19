import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'figma:asset/adf74a4f3ade49831156b5025d56a3a4d58c7b14.png': path.resolve(__dirname, './src/assets/adf74a4f3ade49831156b5025d56a3a4d58c7b14.png'),
      'figma:asset/a473a3907a0ac1f08dca1a2a4f3e444190c8ea6c.png': path.resolve(__dirname, './src/assets/a473a3907a0ac1f08dca1a2a4f3e444190c8ea6c.png'),
      'figma:asset/7dabaa35f060e336674f96e2b5bcfa97786ff8a7.png': path.resolve(__dirname, './src/assets/7dabaa35f060e336674f96e2b5bcfa97786ff8a7.png'),
      'figma:asset/2814c1b071ac9190351adc0ec65b39f42340b45c.png': path.resolve(__dirname, './src/assets/2814c1b071ac9190351adc0ec65b39f42340b45c.png'),
      'figma:asset/1d9fc503bd80f5bcda39ece8d10000f122059fe7.png': path.resolve(__dirname, './src/assets/1d9fc503bd80f5bcda39ece8d10000f122059fe7.png'),
      'figma:asset/184fb38bf88a8706b48c3032fcd905cef28d0393.png': path.resolve(__dirname, './src/assets/184fb38bf88a8706b48c3032fcd905cef28d0393.png'),
    },
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber'],
  },
  optimizeDeps: {
    include: [
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'postprocessing',
      'three',
    ],
  },
});
