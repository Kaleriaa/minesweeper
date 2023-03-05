import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        checker({
            typescript: true,
            eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
        }),
        tsconfigPaths(),
    ],
    server: {
        port: 3000,
    },
})
