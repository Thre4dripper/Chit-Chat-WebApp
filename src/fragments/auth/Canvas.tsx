import React, { useCallback, useEffect, useRef } from 'react'
import imageSrc from '../../assets/auth/signin_image.png'
import logoSrc from '../../assets/logo.png'

// Pre-load images once at module level — zero per-frame allocation
const chatImg = new Image()
chatImg.src = imageSrc
const logoImg = new Image()
logoImg.src = logoSrc

// Orbit center as fraction of window dimensions — must match the oval's CSS position
const OX = 0.4
const OY = 0.5
const TILT = 45 * (Math.PI / 180)
const cosT = Math.cos(TILT)
const sinT = Math.sin(TILT)

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // All animation state in refs — no re-renders during the loop
    const glassDegsRef = useRef(0)
    const elemDegsRef = useRef(0)
    const prevDegsRef = useRef(0)
    const autoSpeedRef = useRef(0.2)
    const flingSpeedRef = useRef(0)
    const isDraggingRef = useRef(false)
    const dragAnchorRef = useRef({ x: 0, y: 0 })
    const flickerTimeRef = useRef(0)

    // Resize canvas only on mount + window resize, never inside rAF
    useEffect(() => {
        const resize = () => {
            const c = canvasRef.current
            if (!c) return
            const r = window.devicePixelRatio || 1
            c.width = window.innerWidth * r
            c.height = window.innerHeight * r
            c.style.width = `${window.innerWidth}px`
            c.style.height = `${window.innerHeight}px`
        }
        resize()
        window.addEventListener('resize', resize, { passive: true })
        return () => window.removeEventListener('resize', resize)
    }, [])

    // Animation loop — pure ref reads, no state
    useEffect(() => {
        let id: number

        const tick = () => {
            const c = canvasRef.current
            if (!c) { id = requestAnimationFrame(tick); return }
            const ctx = c.getContext('2d')
            if (!ctx) { id = requestAnimationFrame(tick); return }

            const r = window.devicePixelRatio || 1
            const W = window.innerWidth
            const H = window.innerHeight
            const V = Math.min(W, H) // vmin in px
            const cx = W * OX        // orbit/oval center X
            const cy = H * OY        // orbit/oval center Y

            ctx.clearRect(0, 0, c.width, c.height)
            // Use CSS-pixel coordinates; ratio is handled by the transform
            ctx.setTransform(r, 0, 0, r, 0, 0)

            // --- Glow blobs — Lissajous paths give organic 2D drift across the whole screen ---
            // Different X/Y frequency ratios (1:2, 3:2, 2:3, 7:5) produce non-repeating figure-8
            // style curves so no blob ever looks like it's just going left-right or up-down.
            const a = glassDegsRef.current * (Math.PI / 180)
            const blobs = [
                {   // Lavender — 1:2 figure-eight covering full W×H
                    bx: W * 0.5 + Math.cos(a)           * W * 0.43,
                    by: H * 0.5 + Math.sin(2 * a)       * H * 0.41,
                    br: V * 0.14 + V * 0.05 * Math.sin(a * 1.3),
                    c0: 'rgba(195,155,255,0.78)', c1: 'rgba(195,155,255,0)',
                },
                {   // Rose — 3:2 trefoil-ish path
                    bx: W * 0.5 + Math.cos(1.5 * a + 1.0) * W * 0.40,
                    by: H * 0.5 + Math.sin(a       + 0.5) * H * 0.38,
                    br: V * 0.12 + V * 0.04 * Math.sin(a * 0.7 + 2.0),
                    c0: 'rgba(255,165,195,0.72)', c1: 'rgba(255,165,195,0)',
                },
                {   // Sky blue — 2:3 Lissajous
                    bx: W * 0.5 + Math.cos(a       + 2.5) * W * 0.43,
                    by: H * 0.5 + Math.sin(1.5 * a + 1.8) * H * 0.41,
                    br: V * 0.14 + V * 0.04 * Math.sin(a * 0.9 + 1.0),
                    c0: 'rgba(150,205,255,0.74)', c1: 'rgba(150,205,255,0)',
                },
                {   // Peach — 7:5 slow drift for extra depth
                    bx: W * 0.5 + Math.cos(0.7 * a + 3.7) * W * 0.36,
                    by: H * 0.5 + Math.sin(1.1 * a + 2.8) * H * 0.34,
                    br: V * 0.10 + V * 0.04 * Math.sin(a * 1.5 + 0.5),
                    c0: 'rgba(255,205,170,0.68)', c1: 'rgba(255,205,170,0)',
                },
            ]
            ctx.save()
            ctx.filter = 'blur(85px)'
            blobs.forEach(({ bx, by, br, c0, c1 }) => {
                const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br)
                grad.addColorStop(0, c0)
                grad.addColorStop(1, c1)
                ctx.beginPath()
                ctx.arc(bx, by, br, 0, Math.PI * 2)
                ctx.fillStyle = grad
                ctx.fill()
            })
            ctx.restore()

            // --- Orbiting elements ---
            // oA / oB match the CSS oval's semi-axes: width=39vmin → oA=19.5vmin, height=54vmin → oB=27vmin
            const oA = V * 0.195
            const oB = V * 0.27
            const ed = elemDegsRef.current * (Math.PI / 180)

            const drawElement = (θ: number, img: HTMLImageElement) => {
                // Ellipse point
                const ex = Math.cos(θ) * oA
                const ey = Math.sin(θ) * oB
                // Rotate by TILT to match the oval's 45° angle
                const rx = ex * cosT - ey * sinT
                const ry = ex * sinT + ey * cosT
                // Size pulses gently with orbit position
                const sz = V * 0.13 + V * 0.02 * Math.sin(θ)
                ctx.drawImage(img, cx + rx - sz / 2, cy + ry - sz / 2, sz, sz)
            }

            drawElement(ed, chatImg)
            drawElement(ed + Math.PI, logoImg)

            // --- Advance --- (0.1 deg/frame ≈ 60 s per full Lissajous cycle at 60 fps)
            glassDegsRef.current = (glassDegsRef.current + 0.1) % 360

            if (flingSpeedRef.current !== 0) {
                flingSpeedRef.current *= 0.96  // friction damping
                elemDegsRef.current = (elemDegsRef.current + flingSpeedRef.current) % 360
                if (Math.abs(flingSpeedRef.current) < 0.05) flingSpeedRef.current = 0
            } else {
                elemDegsRef.current = (elemDegsRef.current + autoSpeedRef.current) % 360
            }

            id = requestAnimationFrame(tick)
        }

        id = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(id)
    }, [])

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        isDraggingRef.current = true
        dragAnchorRef.current = { x: e.clientX, y: e.clientY }
        prevDegsRef.current = elemDegsRef.current
        flingSpeedRef.current = 0
        flickerTimeRef.current = Date.now()
        document.body.style.cursor = 'grabbing'
    }, [])

    const handleMouseUp = useCallback(() => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false
        const elapsed = Math.max(Date.now() - flickerTimeRef.current, 1)
        const delta = elemDegsRef.current - prevDegsRef.current
        // Scale deg/ms → deg/frame (≈16 ms at 60 fps)
        flingSpeedRef.current = (delta / elapsed) * 16
        document.body.style.cursor = 'grab'
    }, [])

    const handleMouseLeave = useCallback(() => {
        isDraggingRef.current = false
        autoSpeedRef.current = 0.2
        document.body.style.cursor = 'default'
    }, [])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = e
        const cx = window.innerWidth * OX
        const cy = window.innerHeight * OY
        const dx = clientX - cx
        const dy = clientY - cy

        if (isDraggingRef.current) {
            document.body.style.cursor = 'grabbing'
            const adx = dragAnchorRef.current.x - cx
            const ady = dragAnchorRef.current.y - cy
            const angle = Math.atan2(dy, dx) - Math.atan2(ady, adx)
            elemDegsRef.current = prevDegsRef.current + (angle * 180) / Math.PI
            return
        }

        const dist = Math.sqrt(dx * dx + dy * dy)
        const hoverRadius = Math.min(window.innerWidth, window.innerHeight) * 0.28
        if (dist < hoverRadius) {
            document.body.style.cursor = 'grab'
            autoSpeedRef.current = 0
        } else {
            document.body.style.cursor = 'default'
            autoSpeedRef.current = 0.2
        }
    }, [])

    return (
        <>
            {/* Dashed oval — center anchored to the same (OX, OY) as the canvas orbit */}
            <div
                className='absolute border-4 border-purple-300 border-dashed pointer-events-none'
                style={{
                    left: `${OX * 100}%`,
                    top: `${OY * 100}%`,
                    // vmin-based sizing keeps the oval proportional at every screen size
                    width: '39vmin',
                    height: '54vmin',
                    borderRadius: '100% / 125% 125% 80% 80%',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    zIndex: -1,
                }}
            />
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
        </>
    )
}

export default Canvas

