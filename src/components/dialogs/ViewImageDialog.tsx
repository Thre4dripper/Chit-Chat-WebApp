import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
interface ViewImageDialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    image: string
    zoomIntensity: number
    delay: number
    initialZoomLevel: number
    minZoomLevel: number
    maxZoomLevel: number
}

const ViewImageDialog: React.FC<ViewImageDialogProps> = ({
    open,
    setOpen,
    image,
    zoomIntensity,
    delay,
    initialZoomLevel,
    minZoomLevel,
    maxZoomLevel,
}) => {
    const [zoomLevel, setZoomLevel] = useState<number>(initialZoomLevel)
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const handleCloseDialog = () => {
        setOpen(false)
        setZoomLevel(1)
        setPosition({ x: 0, y: 0 })
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.deltaY < 0) {
            setZoomLevel((prevZoom) => Math.min(prevZoom + zoomIntensity / 10, maxZoomLevel))
        } else {
            setZoomLevel((prevZoom) => Math.max(prevZoom - zoomIntensity / 10, minZoomLevel))
        }

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const xPercent = x / rect.width
        const yPercent = y / rect.height
        setPosition({ x: xPercent, y: yPercent })
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const xPercent = x / rect.width || 0 // Ensure a default value of 0
        const yPercent = y / rect.height || 0 // Ensure a default value of 0
        setPosition({ x: xPercent, y: yPercent })
    }
    useEffect(() => {
        const preventDefault = (e: WheelEvent) => e.preventDefault()
        if (open) {
            window.addEventListener('wheel', preventDefault, { passive: false })
        } else {
            window.removeEventListener('wheel', preventDefault)
        }

        // Cleanup the debounced function when the component unmounts
        return () => {
            window.removeEventListener('wheel', preventDefault)
        }
    }, [open])

    return (
        <Box
            style={{
                zIndex: 9999,
                position: 'fixed',
                inset: '0',
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={handleCloseDialog}>
            <Box
                className={'w-[35rem] h-fit bg-slate-700 rounded-2xl shadow-lg shadow-slate-800/50'}
                onWheel={handleWheel}
                onClick={(e) => e.stopPropagation()}
                onMouseMove={handleMouseMove}
                style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: `${position.x * 100}% ${position.y * 100}%`,
                    transition: `all ${delay}s ease-out`,
                }}>
                <img
                    src={image}
                    alt={'Latent Diffusion Model'}
                    className={'w-full h-full rounded-2xl'}
                />
            </Box>
        </Box>
    )
}
export default ViewImageDialog
