import { ButtonBase } from '@mui/material'
import Lottie from 'lottie-react'
import { stickerMap } from '../../enums/stickerMap.ts'
import Box from '@mui/material/Box'
import React, { useState, useEffect, useRef } from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'

interface PropType {
    closePopper: (newOpen: boolean) => void
    onStickerSelect?: (index: number) => void
}

// One lightweight sticker item
const StickerItem = ({
    index,
    asset,
    closePopper,
    onStickerSelect,
}: {
    index: number
    asset: any
    closePopper: (newOpen: boolean) => void
    onStickerSelect?: (index: number) => void
}) => {
    const [showLottie, setShowLottie] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const sendSticker = useChatDetailsStore((state) => state.sendStickerMessage)
    const username = useLocalStore((state) => state.username)
    const chatDetails = useChatDetailsStore((state) => state.chatDetails)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowLottie(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const handleSendSticker = () => {
        if (onStickerSelect) {
            onStickerSelect(index)
            closePopper(false)
            return
        }
        if (!chatDetails || !username) return
        const from = username
        const to =
            chatDetails.dmChatUser1.username === username
                ? chatDetails.dmChatUser2.username
                : chatDetails.dmChatUser1.username

        sendSticker(chatDetails, index, from, to)
        closePopper(false)
    }

    return (
        <div ref={ref} className='rounded-2xl w-fit overflow-hidden'>
            <ButtonBase
                className='block'
                sx={{ width: 100, height: 100 }}
                onClick={handleSendSticker}>
                {showLottie ? (
                    <Lottie
                        className='max-h-20 max-w-20'
                        animationData={asset}
                        loop={true}
                        autoPlay
                    />
                ) : (
                    <div className='w-20 h-20 rounded-xl bg-linear-to-br from-red-300 to-blue-300 animate-pulse' />
                )}
            </ButtonBase>
        </div>
    )
}

const VirtualizedStickerGrid: React.FC<PropType> = ({ closePopper, onStickerSelect }) => {
    return (
        <Box
            sx={{
                height: '300px',
                maxWidth: '700px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                overflowY: 'auto',
                gap: 1.5,
            }}>
            {Object.entries(stickerMap).map(([id, asset]) => (
                <StickerItem
                    key={id}
                    index={Number(id)}
                    asset={asset}
                    closePopper={closePopper}
                    onStickerSelect={onStickerSelect}
                />
            ))}
        </Box>
    )
}

export default VirtualizedStickerGrid
