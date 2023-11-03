import React from 'react'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import LeftText from './common/LeftText.tsx'
import LeftImage from './common/LeftImage.tsx'
import LeftSticker from './common/LeftSticker.tsx'
import { LottieOptions } from 'lottie-react'
import CircularImage from '../CircularImage.tsx'

interface ItemChatRightMsgProps {
    type: ChatMessageType
    seen: string[]
    message?: string
    image?: string
    sticker?: LottieOptions['animationData']
    time: string
}

const RightChatMessage: React.FC<ItemChatRightMsgProps> = ({
    type,
    seen,
    message,
    image,
    sticker,
    time,
}) => {
    return (
        <div className={'flex flex-row px-4 py-2'}>
            <div className={'flex w-full'}>
                {/* Persistent right space */}
                <div className={'flex-1 md:min-w-[5rem] lg:min-w-[10rem]'} />
                <div>
                    {type === ChatMessageType.TEXT && <LeftText message={message ?? ''} />}
                    {type === ChatMessageType.IMAGE && <LeftImage image={image ?? ''} />}
                    {type === ChatMessageType.STICKER && (
                        <LeftSticker stickerData={sticker ?? ''} />
                    )}
                    <div className={'flex justify-end'}>
                        <div className={'flex flex-row-reverse'}>
                            {seen.map((item) => {
                                return (
                                    <div className={'-ml-6'}>
                                        <CircularImage
                                            image={item}
                                            size={20}
                                            alt={'Sender Image'}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div className={'flex flex-col justify-center'}>
                            <span className={'text-slate-400 font-bold text-xs'}>{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightChatMessage
