import { IconButton } from '@mui/material'
import React from 'react'

interface CircularImageProps {
    image: string
    size?: number
    alt?: string
}

const CircularImage: React.FC<CircularImageProps> = ({ image, size, alt = '' }) => {
    return (
        <div className={'flex flex-col justify-center'}>
            <IconButton>
                <div className={'rounded-full bg-white overflow-clip'}>
                    <img
                        src={image}
                        alt={alt}
                        style={{
                            width: size,
                            height: size,
                        }}
                        className={'rounded-full p-0.5'}
                    />
                </div>
            </IconButton>
        </div>
    )
}

export default CircularImage
