import { ButtonBase } from '@mui/material'
import Lottie from 'lottie-react'
import { stickerMap } from '../../enums/stickerMap.ts'
import Box from '@mui/material/Box'
import React, { useState } from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'

interface PropType {
    closePopper: (newOpen: boolean) => void
}

// One lightweight sticker item
const StickerItem = ({
    index,
    asset,
    closePopper,
}: {
    index: number
    asset: any
    closePopper: (newOpen: boolean) => void
}) => {
    const [showLottie, setShowLottie] = useState(false)
    const sendSticker = useChatDetailsStore((state) => state.sendStickerMessage)
    const username = useLocalStore((state) => state.username)
    const chatDetails = useChatDetailsStore((state) => state.chatDetails)

    const handleSendSticker = () => {
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
        <div className='rounded-2xl w-fit overflow-hidden'>
            <ButtonBase
                onMouseEnter={() => setShowLottie(true)}
                className='block'
                sx={{ width: 100, height: 100 }}
                onClick={handleSendSticker}>
                {showLottie ? (
                    <Lottie
                        className='max-h-[80px] max-w-[80px]'
                        animationData={asset}
                        loop={false}
                        autoPlay
                    />
                ) : (
                    <div className='w-[80px] h-[80px] rounded-xl bg-gradient-to-br from-red-300 to-blue-300 animate-pulse' />
                )}
            </ButtonBase>
        </div>
    )
}

const VirtualizedStickerGrid: React.FC<PropType> = ({ closePopper }) => {
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
                <StickerItem key={id} index={Number(id)} asset={asset} closePopper={closePopper} />
            ))}
        </Box>
    )
}

export default VirtualizedStickerGrid
