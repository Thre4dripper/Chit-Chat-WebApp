import { Typography, Box } from '@mui/material'
import CircularImage from '../CircularImage.tsx'
import React from 'react'
import { useNavigate } from 'react-router'

interface FavChatProps {
    chatId: string
    image: string
    name: string
}

const ItemFavChat: React.FC<FavChatProps> = ({ chatId, image, name }) => {
    const navigate = useNavigate()

    return (
        <Box className={'flex flex-col items-center'} onClick={() => navigate('/chat/' + chatId)}>
            <CircularImage image={image} size={80} />
            <Typography variant='subtitle1' sx={{ color: 'white' }} align='center'>
                {name}
            </Typography>
        </Box>
    )
}

export default ItemFavChat
