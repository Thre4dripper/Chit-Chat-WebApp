import React from 'react'
import PersonIcon from '@mui/icons-material/Person'
import Avatar from '@mui/material/Avatar'
import { SxProps, Theme } from '@mui/material/styles'

const UserAvatar: React.FC<{ src: string | undefined; alt: string; sx: SxProps<Theme> }> = ({
    src,
    alt,
    sx,
}) => {
    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const img = event.target as HTMLImageElement
        img.onerror = null
        img.src = ''
    }

    return (
        <Avatar src={src} alt={alt} onError={handleError} sx={sx}>
            <PersonIcon />
        </Avatar>
    )
}

export default UserAvatar
