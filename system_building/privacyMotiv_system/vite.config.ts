// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   base: '/PrivacyMotiv/system_building/privacyMotiv_system/',
//   assetsInclude: ['**/*.json'],
//   json: {
//     stringify: true
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isProduction = command === 'build'
  
  return {
    plugins: [react()],
    base: isProduction ? '/PrivacyMotiv/system_building/privacyMotiv_system/' : '/',
    assetsInclude: ['**/*.json'],
    json: {
      stringify: true
    }
  }
})