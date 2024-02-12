import React, { useCallback, useEffect } from 'react'

interface CanvasAnimationsProps {
    className: string
}

const CanvasAnimations: React.FC<CanvasAnimationsProps> = ({ className }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [glassDegrees, setGlassDegrees] = React.useState(0)

    const { canvasWidth, canvasHeight } = {
        canvasWidth: canvasRef.current?.clientWidth || 0,
        canvasHeight: canvasRef.current?.clientHeight || 0,
    }

    const radius = Math.min(canvasWidth, canvasHeight) / 10

    const glass1 = Math.cos(glassDegrees * (Math.PI / 180)) * radius
    const glass2 = Math.sin((glassDegrees + 120) * (Math.PI / 180)) * radius
    const glass3 = Math.cos((glassDegrees + 240) * (Math.PI / 180)) * radius

    const drawCircle = useCallback(
        (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
            ctx.save()
            ctx.filter = 'blur(50px)'
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
        const ctx = canvas?.getContext('2d')
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawCircle(ctx, glass1 + 100, 100, 100, 'rgb(230,191,255)')
            drawCircle(ctx, 100, glass2, 70, 'rgb(255,190,190)')
            drawCircle(ctx, glass3 + 100, 100, 80, 'rgb(188,216,255)')
        }

        setGlassDegrees((prev) => prev + 0.001)
    }, [drawCircle, glass1, glass2, glass3])

    useEffect(() => {
        requestAnimationFrame(animate)
    }, [animate])

    return (
        <canvas
            ref={canvasRef}
            className={`${className} bg-gradient-to-r from-transparent from-95% to-white`}
        />
    )
}

export default CanvasAnimations
