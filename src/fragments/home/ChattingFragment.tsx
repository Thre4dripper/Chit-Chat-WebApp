import React, { useEffect, useRef, useState } from 'react'
import ChatInput from '../../components/chat/ChatInput.tsx'
import ChatHeader from '../../components/chat/ChatHeader.tsx'
import ChatBox from '../../components/chat/ChatBox.tsx'
import ImageSendFragment from './ImageSendFragement.tsx'
import ConfirmDialog from '../../components/dialogs/ConfirmDialog.tsx'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import ViewProfile from '../../components/listItems/itemViewProfile.tsx'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import GroupChattingFragment from './GroupChattingFragment.tsx'

const ChattingFragment: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const currentChatId = useChatDetailsStore((state) => state.currentChatId)
    const [imageOpen, setImageOpen] = useState(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<boolean>(false)

    //  view profile
    const [isViewing, setIsViewing] = useState<boolean>(false)

    const clearSelectedImage = () => {
        if (imageSrc?.startsWith('blob:')) {
            URL.revokeObjectURL(imageSrc)
        }
        setImageOpen(false)
        setImageSrc(null)
    }

    useEffect(() => {
        return () => {
            if (imageSrc?.startsWith('blob:')) {
                URL.revokeObjectURL(imageSrc)
            }
        }
    }, [imageSrc])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (imageSrc?.startsWith('blob:')) {
                URL.revokeObjectURL(imageSrc)
            }
            setImageSrc(URL.createObjectURL(file))
            setImageOpen(true)
            e.target.value = ''
        }
    }
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile()
                const reader = new FileReader()
                reader.onload = (ev) => {
                    const result = ev.target?.result
                    if (typeof result === 'string') setImageSrc(result)
                    setImageOpen(true)
                }
                if (file) reader.readAsDataURL(file)
            }
        }
    }

    if(!currentChatId?.includes('-')){
        return <GroupChattingFragment/>
    }




    return (
        <div
            className={
                'bg-blue-50 h-screen rounded-tl-3xl rounded-bl-3xl rounded-tr-3xl rounded-br-3xl'
            }>
            <div className={'flex flex-col h-screen'}>
                {isViewing ? (
                    <ViewProfile setIsViewing={setIsViewing} />
                ) : (
                    <>
                        <ChatHeader setIsViewing={setIsViewing} />

                        {imageOpen && (
                            <button
                                className='fixed inset-0 bg-black bg-opacity-40 z-40'
                                onClick={() => setSelectedImage(true)}></button>
                        )}

                        {imageOpen ? (
                            <div className='relative  overflow-hidden w-full h-full bg-slate-400 flex justify-center items-center z-50'>
                                <ImageSendFragment
                                    image={imageSrc}
                                    cropShape='rect'
                                    onConfirmed={clearSelectedImage}
                                />
                                <Button
                                    color='error'
                                    onClick={clearSelectedImage}
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        zIndex: 10,
                                        width: '50px',
                                    }}
                                    endIcon={
                                        <CloseIcon sx={{ width: '100%', height: '100%' }} />
                                    }></Button>
                            </div>
                        ) : (
                            <>
                                <ChatBox setImageOpen={setImageOpen} setImageSrc={setImageSrc} />

                                <ChatInput
                                    handlePaste={handlePaste}
                                    fileInputRef={fileInputRef}
                                    handleFileChange={handleFileChange}
                                />
                            </>
                        )}
                    </>
                )}
                <ConfirmDialog
                    open={selectedImage}
                    handleClose={() => setSelectedImage(false)}
                    title='Are you sure?'
                    message='Want to unselect Image'
                    action={() => {
                        clearSelectedImage()
                        setSelectedImage(false)
                    }}
                />
            </div>
        </div>
    )
}

export default ChattingFragment
