import { Timestamp } from '@firebase/firestore'
import MsgSticker from '../chatMessages/common/MsgSticker.tsx'
import React from 'react'
import CircularImage from '../CircularImage.tsx'
import stickerValue from '../../enums/stickerMap.ts'
interface ItemChatStickerLeftProps {
    profileImage: string
    sticker: number
    time: Timestamp
}

const ItemChatStickerLeft: React.FC<ItemChatStickerLeftProps> = ({
    profileImage,
    sticker,
    time,
}) => {
    const FormatedTime = time.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    console.log('sticker value from chat Box', sticker)
    return (
        <>
            <div>
                <CircularImage image={profileImage} size={28} alt={'Profile image'} />
            </div>
            <div>
                <div
                    className={
                        'max-w-[36rem] w-full ' +
                        'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
                    }>
                    <MsgSticker stickerData={stickerValue(sticker) ?? MsgSticker} />
                </div>
                <div className={'flex justify-start my-2'}>
                    <span className={'text-slate-400 font-bold text-xs'}>{FormatedTime}</span>
                </div>
            </div>
        </>
    )
}
export default ItemChatStickerLeft
