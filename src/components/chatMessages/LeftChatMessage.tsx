import CircularImage from '../CircularImage.tsx'
import React from 'react'
import LeftText from './common/LeftText.tsx'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import LeftImage from './common/LeftImage.tsx'
import LeftSticker from './common/LeftSticker.tsx'
import { LottieOptions } from 'lottie-react'

interface ItemChatLeftMsgProps {
    type: ChatMessageType
    profileImage: string
    message?: string
    image?: string
    sticker?: LottieOptions['animationData']
    time: string
}

const LeftChatMessage: React.FC<ItemChatLeftMsgProps> = ({
    type,
    profileImage,
    message,
    image,
    sticker,
    time,
}) => {
    return (
        <div className={'flex flex-row px-4 py-2'}>
            <div className={'flex w-full'}>
                <div className={'flex-none'}>
                    <CircularImage image={profileImage} size={28} alt={'Profile image'} />
                </div>
                <div>
                    {type === ChatMessageType.TEXT && <LeftText message={message ?? ''} />}
                    {type === ChatMessageType.IMAGE && <LeftImage image={image ?? ''} />}
                    {type === ChatMessageType.STICKER && (
                        <LeftSticker stickerData={sticker ?? ''} />
                    )}
                    <div>
                        <span className={'text-slate-400 font-bold text-xs'}>{time}</span>
                    </div>
                </div>
                {/*Persistent right space*/}
                <div className={'md:min-w-[5rem] lg:min-w-[10rem]'} />
            </div>
        </div>
    )
}

export default LeftChatMessage