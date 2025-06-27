import React, { useRef, useState, useEffect } from 'react'
import { ReactCrop, Crop } from 'react-image-crop'
import Button from '@mui/material/Button'
import 'react-image-crop/dist/ReactCrop.css'
import SendIcon from '@mui/icons-material/Send'
import useChatDetailsStore from '../../store/chat.details.store'
import useLocalStore from '../../store/local.store'

interface ImageSendFragmentProps {
    image: string | null
    cropShape: 'rect' | 'round'
    onConfirmed: () => void
}

const ImageSendFragment: React.FC<ImageSendFragmentProps> = ({ image, cropShape, onConfirmed }) => {
    const imgRef = useRef<HTMLImageElement | null>(null)
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const [crop, setCrop] = useState<Crop | undefined>(undefined)

    const chatDetails = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)
    const sendImageMessage = useChatDetailsStore((state) => state.sendImageMessage)

    const handleImageLoad = () => {
        if (!imgRef.current) return

        const viewWidth = imgRef.current.clientWidth
        const viewHeight = imgRef.current.clientHeight

        setCrop({
            unit: 'px',
            x: 0,
            y: 0,
            width: viewWidth,
            height: viewHeight,
        })
    }
    useEffect(() => {
        if (!crop || !imgRef.current || !previewCanvasRef.current) return

        const canvas = previewCanvasRef.current
        const image = imgRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const pixelRatio = window.devicePixelRatio

        canvas.width = crop.width * pixelRatio
        canvas.height = crop.height * pixelRatio

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )
    }, [crop, image])

    const handleConfirm = async () => {
        if (!chatDetails || !username || !previewCanvasRef.current) return

        const to =
            chatDetails.dmChatUser1.username === username
                ? chatDetails.dmChatUser2.username
                : chatDetails.dmChatUser1.username

        previewCanvasRef.current.toBlob((blob) => {
            if (blob) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    const base64data = reader.result as string
                    sendImageMessage(chatDetails, base64data, username, to) // now sending a string
                    onConfirmed()
                }
                reader.readAsDataURL(blob) // convert blob to base64 string
            }
        }, 'image/jpeg')
    }

    return (
        <div className='flex flex-col items-center gap-4'>
            {image && (
                <>
                    <ReactCrop
                        crop={crop}
                        onChange={(newCrop) => {
                            const minWidth = 50
                            const minHeight = 90
                            let x = newCrop.x
                            let y = newCrop.y

                            const viewWidth = imgRef.current?.clientWidth || 0
                            const viewHeight = imgRef.current?.clientHeight || 0

                            const width = Math.max(newCrop.width, minWidth)
                            const height = Math.max(newCrop.height, minHeight)

                            if (x + width > viewWidth) {
                                x = Math.max(0, viewWidth - width)
                            }

                            // Adjust y if height goes beyond view
                            if (y + height > viewHeight) {
                                y = Math.max(0, viewHeight - height)
                            }
                            setCrop({
                                ...newCrop,
                                width,
                                height,
                                x,
                                y,
                            })
                        }}
                        aspect={undefined}
                        circularCrop={cropShape === 'round'}>
                        <img
                            ref={imgRef}
                            src={image}
                            alt='To Crop'
                            className='w-full h-[400px] object-contain mx-auto'
                            onLoad={handleImageLoad}
                        />
                    </ReactCrop>
                    <canvas ref={previewCanvasRef} style={{ display: 'none' }} />

                    <Button
                        sx={{
                            float: 'right',
                            position: 'absolute',
                            bottom: '10px',
                            right: '5px',
                            width: '50px',
                        }}
                        color='success'
                        onClick={handleConfirm}
                        endIcon={<SendIcon sx={{ width: '100%', height: '100%' }} />}></Button>
                </>
            )}
        </div>
    )
}

export default ImageSendFragment
