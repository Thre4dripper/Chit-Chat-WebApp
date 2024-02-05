import CircularImage from '../CircularImage.tsx'
import React from 'react'
import MsgText from './common/MsgText.tsx'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import MsgImage from './common/MsgImage.tsx'
import MsgSticker from './common/MsgSticker.tsx'
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
    //TODO change message colors
    return (
        <div className={'flex flex-row px-4 py-2'}>
            <div className={'flex w-full'}>
                <div className={'flex-none'}>
                    <CircularImage image={profileImage} size={28} alt={'Profile image'} />
                </div>
                <div>
                    {type === ChatMessageType.TEXT && (
                        <div
                            className={
                                'flex-none bg-slate-300/50 shadow-slate-950/20 shadow-md ' +
                                'max-w-[36rem] w-full ' +
                                'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
                            }>
                            <MsgText message={message ?? ''} className={'text-black/80'} />
                        </div>
                    )}
                    {type === ChatMessageType.IMAGE && (
                        <div
                            className={
                                'flex-none bg-slate-300/50 shadow-slate-950/20 shadow-md ' +
                                'min-w-[16rem] max-w-[36rem] w-full ' +
                                'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl overflow-hidden'
                            }>
                            <MsgImage image={image ?? ''} />
                        </div>
                    )}
                    {type === ChatMessageType.STICKER && (
                        <div
                            className={
                                'flex-none ' +
                                'min-w-[16rem] max-w-[36rem] w-full ' +
                                'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
                            }>
                            <MsgSticker stickerData={sticker ?? ''} />
                        </div>
                    )}
                    <div className={'flex justify-start my-1'}>
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
