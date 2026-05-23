import { Avatar, IconButton } from '@mui/material'
import React from 'react'
import GroupsIcon from '@mui/icons-material/Groups'
interface CircularImageProps {
    image: string
    size?: number
    alt?: string
    isGroup?: boolean
}

const CircularImage: React.FC<CircularImageProps> = ({ image, size, alt = '', isGroup }) => {
    return (
        <div className={'flex flex-col justify-center'}>
            <IconButton>
                <div className={'rounded-full p-0.5 bg-white'}>
                    {isGroup ? (
                        <Avatar alt={alt} src={image} slotProps={{ img: { referrerPolicy: 'no-referrer' } }} sx={{ width: size, height: size }}>
                            <GroupsIcon />
                        </Avatar>
                    ) : (
                        <Avatar alt={alt} src={image} slotProps={{ img: { referrerPolicy: 'no-referrer' } }} sx={{ width: size, height: size }} />
                    )}
                </div>
            </IconButton>
        </div>
    )
}

export default CircularImage
