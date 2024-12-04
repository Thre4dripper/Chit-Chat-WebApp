import React, { useCallback, useEffect } from 'react'

const Canvas: React.FC = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const glassDegreesRef = React.useRef(0)

    const drawCircle = useCallback(
        (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
            ctx.save()
            ctx.filter = 'blur(150px)'
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
            ctx.closePath()
            ctx.restore()
        },
        []
    )

    const animate = useCallback(() => {
        requestAnimationFrame(animate)
        const canvas = canvasRef.current
        if (!canvas) return
        const ratio = window.devicePixelRatio
        canvas.width = window.innerWidth * ratio
        canvas.height = window.innerHeight * ratio
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`

        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        ctx.scale(ratio, ratio)

        const radius = Math.min(canvas.width, canvas.height) / 3

        const glass1 = Math.cos(glassDegreesRef.current * (Math.PI / 180)) * radius
        const glass2 = Math.sin((glassDegreesRef.current + 120) * (Math.PI / 180)) * radius
        const glass3 = Math.cos((glassDegreesRef.current + 240) * (Math.PI / 180)) * radius

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawCircle(ctx, glass1 + 300, 300, 300, 'rgb(230,191,255)')
        drawCircle(ctx, 500, glass2 + 200, 200, 'rgb(255,190,190)')
        drawCircle(ctx, glass3 + 300, 300, 300, 'rgb(188,216,255)')

        glassDegreesRef.current = (glassDegreesRef.current + 0.2) % 360
    }, [drawCircle])

    useEffect(() => {
        requestAnimationFrame(animate)
    }, [animate])

    return (
        <>
            <div
                className={'absolute border-4 border-purple-300 border-dashed w-[24rem] h-[40rem]'}
                style={{
                    left: '40%',
                    top: 'calc(50% - 30px)',
                    borderRadius: '100% / 125% 125% 80%  80%',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
            />
            <canvas ref={canvasRef} />
        </>
    )
}

export default Canvas
