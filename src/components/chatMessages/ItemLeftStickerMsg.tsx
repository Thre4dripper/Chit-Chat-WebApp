import CircularImage from '../CircularImage.tsx'
import Lottie, { LottieOptions } from 'lottie-react'
import React from 'react'
import { IconButton } from '@mui/material'

interface ItemChatLeftStickerMsgProps {
    profileImage: string
    stickerData: LottieOptions['animationData']
    time: string
}

const ItemLeftStickerMsg: React.FC<ItemChatLeftStickerMsgProps> = ({
    profileImage,
    stickerData,
    time,
}) => {
    return (
        <div className={'flex flex-row px-4 py-2'}>
            <div className={'flex w-full'}>
                <div className={'flex-none'}>
                    <CircularImage image={profileImage} size={28} alt={'Profile image'} />
                </div>
                <div>
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
                    <div>
                        <span className={'text-slate-400 font-bold text-xs'}>{time}</span>
                    </div>
                </div>
                {/* Persistent right space */}
                <div className={'md:min-w-[5rem] lg:min-w-[10rem]'} />
            </div>
        </div>
    )
}

export default ItemLeftStickerMsg
