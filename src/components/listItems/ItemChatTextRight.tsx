import { Timestamp } from '@firebase/firestore'
import MsgText from '../chatMessages/common/MsgText.tsx'
import React from 'react'
import CircularImage from '../CircularImage.tsx'

interface ItemChatTextLeftProps {
    seen: string[],
    message:string
    time: Timestamp
}

const ItemChatTextLeft: React.FC<ItemChatTextLeftProps> = ({ seen,message, time }) => {
    const FormatedTime = time.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const rightMessageColor = '#FF8181'
    return (
        <div className={'w-full flex flex-row px-4 py-2 justify-end'}>
            <div>
                <div
                    style={{ backgroundColor: rightMessageColor }}
                    className={
                        'shadow-slate-950/20 shadow-md ' +
                        'max-w-[36rem] w-full ' +
                        'rounded-tl-3xl rounded-bl-3xl rounded-br-lg rounded-tr-3xl'
                    }>
                    <MsgText message={message ?? ''} className={'text-white/80'} />
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
export default ItemChatTextLeft
