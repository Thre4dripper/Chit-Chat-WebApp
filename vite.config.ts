import { defineConfig, loadEnv, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { createRequire } from 'module'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)

// Reads src/sw/firebase-messaging-sw.template.js, replaces %VITE_*% placeholders
// with actual env vars, and writes the result:
//   - During dev:   public/firebase-messaging-sw.js  (served by Vite dev server)
//   - During build: dist/firebase-messaging-sw.js    (emitted to output dir)
function swEnvPlugin(): Plugin {
    const TEMPLATE = path.resolve('src/sw/firebase-messaging-sw.template.js')
    const PUBLIC_OUT = path.resolve('public/firebase-messaging-sw.js')
    let isBuild = false
    let mode = 'development'
    let resolvedOutDir = 'dist'

    const generate = (env: Record<string, string>) =>
        fs.readFileSync(TEMPLATE, 'utf-8').replace(/%(\w+)%/g, (_, key) => env[key] ?? '')

    return {
        name: 'sw-env-inject',
        configResolved(config) {
            isBuild = config.command === 'build'
            mode = config.mode
            resolvedOutDir = path.resolve(config.build.outDir)
        },
        configureServer(server) {
            const env = loadEnv(server.config.mode, process.cwd(), '')
            fs.writeFileSync(PUBLIC_OUT, generate(env))
        },
        closeBundle() {
            if (!isBuild) return
            const env = loadEnv(mode, process.cwd(), '')
            fs.mkdirSync(resolvedOutDir, { recursive: true })
            fs.writeFileSync(path.join(resolvedOutDir, 'firebase-messaging-sw.js'), generate(env))
        },
    }
}

// https://vitejs.dev/config/
// lottie-react's "browser" field points to its UMD build, which Vite 8 (Rolldown)
// can't correctly interop as an ESM default export. Force the ESM build instead.
export default defineConfig({
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), swEnvPlugin()],
    resolve: {
        alias: {
            'lottie-react': require.resolve('lottie-react/build/index.es.js'),
        },
    },
})
