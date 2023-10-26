import { Avatar, IconButton } from '@mui/material'
import React from 'react'

interface CircularImageProps {
    image: string
    size?: number
    alt?: string
}

const CircularImage: React.FC<CircularImageProps> = ({ image, size, alt }) => {
    return (
        <div className={'flex flex-col justify-center'}>
            <IconButton>
                <Avatar src={image} sx={{ width: size, height: size }} alt={alt} />
            </IconButton>
        </div>
    )
}

export default CircularImage
