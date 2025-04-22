import React, { useRef, useState } from 'react'
import { Button } from '@mui/material'
import { ReactCrop, Crop, centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import StorageUtils from '../../utils/StorageUtils.ts'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import { getStorage } from 'firebase/storage'
import { StorageFolders } from '../../constants/StorageFolders.ts'

interface OutputSize {
    width: number
    height: number
}

interface ImageSendFragmentProps {
    cropShape: 'rect' | 'round'
    aspect: number
    outputSize: OutputSize
    image: string | null
    onCancel: () => void
    onConfirmed:()=> void
}

const ImageSendFragment: React.FC<ImageSendFragmentProps> = ({
                                                                 cropShape,
                                                                 aspect,
                                                                 image,
                                                                 onCancel,
                                                                 onConfirmed,
                                                             }) => {
    const [crop, setCrop] = useState<Crop>()
    const imageRef = useRef<HTMLImageElement>(null)
    const sendImageMessage= useChatDetailsStore((state) => state.sendImageMessage)
    const username=useLocalStore((state) => state.username)
    const chatDetails=useChatDetailsStore((state) => state.chatDetails)

    const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        const crop = makeAspectCrop({ unit: '%', width: 100 }, aspect, width, height)
        setCrop(centerCrop(crop, width, height))
    }

    const handleConfirm = () => {
        const imageEl = imageRef.current
        if (!imageEl || !crop) return

        const canvas = document.createElement('canvas')
        const scaleX = imageEl.naturalWidth / imageEl.width
        const scaleY = imageEl.naturalHeight / imageEl.height
        const pixelCrop = convertToPixelCrop(crop, imageEl.width, imageEl.height)

        canvas.width = pixelCrop.width * scaleX
        canvas.height = pixelCrop.height * scaleY

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(
            imageEl,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        )

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'cropped.jpeg', { type: 'image/jpeg' })
                const storage = getStorage()
                const from = username
                if(!username || !chatDetails){
                    alert("wrong something ")
                    return;
                }
                const to = chatDetails.dmChatUser1.username === username ? chatDetails.dmChatUser2.username : chatDetails.dmChatUser1.username

                StorageUtils.getUrlFromStorage(storage,`${StorageFolders.CHAT_IMAGES_FOLDER}/${chatDetails.chatId}-${Date.now().toString()}`,file,(url)=>{
                    if(!url || !from){
                        return;
                    }
                    sendImageMessage(chatDetails,url,from,to);
                })
                onConfirmed()
            }
        }, 'image/jpeg')
    }

    return (
        <div className={``}>
            <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                circularCrop={cropShape === 'round'}
                aspect={aspect}
            >
                <img ref={imageRef} className="w-full h-full object-contain object-top" src={image ?? ''} onLoad={onImageLoaded} alt="To crop" />
            </ReactCrop>

            <div className="flex justify-end gap-4 mt-4">
                <Button variant="outlined" color="error" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleConfirm}>
                     Send
                </Button>
            </div>
       </div>
    )
}

export default ImageSendFragment
