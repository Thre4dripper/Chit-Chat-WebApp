import React from 'react'
import { IconButton } from '@mui/material'
import Lottie, { LottieOptions } from 'lottie-react'

interface LeftStickerProps {
    stickerData: LottieOptions['animationData']
}

const LeftSticker: React.FC<LeftStickerProps> = ({ stickerData }) => {
    return (
        <div
            className={
                'flex-none ' +
                'min-w-[16rem] max-w-[36rem] w-full ' +
                'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
            }>
            <div className={'flex flex-row px-6 py-3'}>
                <IconButton className={'w-full cursor-pointer'}>
                    <Lottie
                        className={'max-h-[200px] max-w-[200px] '}
                        animationData={stickerData}
                        loop={true}
                        autoPlay={true}
                    />
                </IconButton>
            </div>
        </div>
    )
}

export default LeftSticker