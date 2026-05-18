import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// https://vitejs.dev/config/
// lottie-react's "browser" field points to its UMD build, which Vite 8 (Rolldown)
// can't correctly interop as an ESM default export. Force the ESM build instead.
export default defineConfig({
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: {
        alias: {
            'lottie-react': require.resolve('lottie-react/build/index.es.js'),
        },
    },
})
