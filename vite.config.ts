import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isProduction = command === 'build'
  
  return {
    plugins: [react()],
    base: isProduction ? '/PrivacyMotiv/' : '/',
    assetsInclude: ['**/*.json'],
    json: {
      stringify: true
    }
  }
})