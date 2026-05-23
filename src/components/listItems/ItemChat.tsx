import { Divider, Typography } from '@mui/material'
import React from 'react'
import CircularImage from '../CircularImage.tsx'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import PhotoIcon from '@mui/icons-material/Photo'
import { useNavigate } from 'react-router'

interface ItemChatProps {
    chatId: string
    image: string
    primaryText: string
    secondaryText: string
    time: string
    unseenMessageCount: number
}

const ItemChat: React.FC<ItemChatProps> = ({
    chatId,
    image,
    primaryText,
    secondaryText,
    time,
    unseenMessageCount,
}) => {
    if (primaryText && primaryText.length > 20) {
        primaryText = primaryText.substring(0, 24) + '...'
    }
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const navigate = useNavigate()

    return (
        <div>
            <button
                onClick={() => navigate('/chat/' + chatId)}
                className={`${currentChat?.chatId === chatId ? 'bg-slate-900' : ''} w-full flex flex-row gap-4 px-4 py-2 select-none cursor-pointer hover:bg-slate-900 active:bg-slate-800`}>
                <CircularImage image={image} size={48} />
                <div className={'flex flex-col flex-auto justify-center'}>
                    {/*create a primary text container with ellipses effect on longer text and time container at the end*/}
                    <div className={'flex flex-row justify-between'}>
                        <div style={{ textOverflow: 'ellipsis' }} className={'text-white text-lg'}>
                            {primaryText}
                        </div>
                        <Typography variant={'subtitle2'} sx={{ color: 'gray' }}>
                            {time}
                        </Typography>
                    </div>
                    <div className={'flex flex-row justify-between'}>
                        {secondaryText ? (
                            <Typography variant={'subtitle2'} sx={{ color: 'gray' }}>
                                {secondaryText.length >= 30
                                    ? secondaryText.slice(0, 20) + '...'
                                    : secondaryText}
                            </Typography>
                        ) : (
                            <Typography variant={'subtitle2'} sx={{ color: 'gray' }}>
                                <PhotoIcon /> Photo/sticker
                            </Typography>
                        )}
                        <div className={'flex flex-row justify-center items-center'}>
                            {unseenMessageCount != 0 && (
                                <div
                                    className={
                                        'w-auto min-w-[1.2rem] px-1 h-5 bg-blue-300/50 rounded-full text-white text-xs flex justify-center items-center'
                                    }>
                                    {unseenMessageCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </button>
            {/*Separator*/}
            <div className={'flex justify-end'}>
                <Divider className={'bg-white/20 w-4/5'} />
            </div>
        </div>
    )
}

export default ItemChat
