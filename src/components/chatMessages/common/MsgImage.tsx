import React from 'react'
import { ButtonBase } from '@mui/material'

interface LeftImageProps {
    image: string
}

const MsgImage: React.FC<LeftImageProps> = ({ image }) => {
    return (
        <ButtonBase>
            <img
                src={image}
                className={'m-1.5 max-h-[250px] max-w-[250px] object-cover w-full rounded-3xl'}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/600x400?text=Loading...';
                }}
                alt={"not working"}

            />
        </ButtonBase>
    )
}

export default MsgImage
