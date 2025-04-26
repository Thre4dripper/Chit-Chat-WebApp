import React from 'react'
import { ButtonBase } from '@mui/material'

interface LeftImageProps {
    image: string
}

const MsgImage: React.FC<LeftImageProps> = ({ image }) => {
    return (
        <ButtonBase className="flex items-center justify-center" onClick={() => console.log('hell out of here')}>
            <div className="m-1.5 max-w-[250px] max-h-[250px] overflow-hidden rounded-3xl">
                <img
                    src={image}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/600x400?text=Loading...';
                    }}
                    alt="not working"
                />
            </div>
        </ButtonBase>
    )
}

export default MsgImage
