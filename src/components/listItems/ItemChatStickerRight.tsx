import { Timestamp } from '@firebase/firestore'
import MsgSticker from '../chatMessages/common/MsgSticker.tsx'
import React from 'react'
import CircularImage from '../CircularImage.tsx'
import { LottieOptions } from 'lottie-react'

interface ItemChatStickerRightProps {
    seen: string[],
    sticker: LottieOptions['animationData']
    time: Timestamp
}

const ItemChatStickerRight: React.FC<ItemChatStickerRightProps> = ({ seen,sticker, time }) => {
    const FormatedTime = time.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    return (
        <div className={'w-full flex flex-row px-4 py-2 justify-end'}>
            <div>
                <div
                    className={
                        'max-w-[36rem] w-full ' +
                        'rounded-tl-3xl rounded-bl-3xl rounded-br-lg rounded-tr-3xl flex justify-end'
                    }>
                    <MsgSticker stickerData={sticker ?? ''} />
                </div>
                <div className={'flex justify-end'}>
                    <div className={'flex flex-row-reverse'}>
                        {seen.map((item) => {
                            return (
                                <div key={item} className={'-ml-6'}>
                                    <CircularImage image={item} size={20} alt={'Sender Image'} />
                                </div>
                            )
                        })}
                    </div>
                    <div className={'flex flex-col justify-center'}>
                        <span className={'text-slate-400 font-bold text-xs'}>{FormatedTime}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ItemChatStickerRight
