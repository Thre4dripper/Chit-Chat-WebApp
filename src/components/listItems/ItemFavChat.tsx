import { Typography } from '@mui/material'
import CircularImage from '../CircularImage.tsx'
import React from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'

interface FavChatProps {
    chatId: string
    image: string
    name: string
}

const ItemFavChat: React.FC<FavChatProps> = ({chatId, image, name }) => {
    // const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const setCurrentChatId = useChatDetailsStore((state) => state.setCurrentChatId)

    return (
        <button className={'flex flex-col items-center'}  onClick={() => setCurrentChatId(chatId)}>
            <CircularImage image={image} size={80} />
            <Typography variant='subtitle1' color='white' align='center'>
                {name}
            </Typography>
        </button>
    )
}

export default ItemFavChat
