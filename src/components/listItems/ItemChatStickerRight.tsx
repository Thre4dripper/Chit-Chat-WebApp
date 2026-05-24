import { Timestamp } from '@firebase/firestore'
import MsgSticker from '../chatMessages/common/MsgSticker.tsx'
import React from 'react'
import CircularImage from '../CircularImage.tsx'
import stickerValue from '../../enums/stickerMap.ts'
interface ItemChatStickerRightProps {
    seen: string[]
    sticker: number
    time: Timestamp
    onSeenByClick: (anchor: HTMLElement) => void
}

const ItemChatStickerRight: React.FC<ItemChatStickerRightProps> = ({
    seen,
    sticker,
    time,
    onSeenByClick,
}) => {
    const FormatedTime = time.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    return (
        <div className={'w-full flex flex-row px-4 py-2 justify-end'}>
            <div>
                <div
                    className={
                        'max-w-xl w-full ' +
                        'rounded-tl-3xl rounded-bl-3xl rounded-br-lg rounded-tr-3xl flex justify-end'
                    }>
                    <MsgSticker stickerData={stickerValue(sticker) ?? ''} />
                </div>
                <div className={'flex justify-end'}>
                    <div className={'flex flex-row-reverse'}>
                        {seen.map((item) => {
                            return (
                                <div
                                    key={item}
                                    className='-ml-6 cursor-pointer'
                                    role='button'
                                    tabIndex={0}
                                    onClick={(e) => onSeenByClick(e.currentTarget)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ')
                                            onSeenByClick(e.currentTarget)
                                    }}>
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
