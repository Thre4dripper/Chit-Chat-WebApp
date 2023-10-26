import CircularImage from '../CircularImage.tsx'
import React from 'react'

interface ItemChatLeftMsgProps {
    profileImage: string
    message: string
    time: string
}

const ItemLeftTextMsg: React.FC<ItemChatLeftMsgProps> = ({ profileImage, message, time }) => {
    return (
        <div className={'flex flex-row px-4 py-2'}>
            <div className={'flex w-full'}>
                <div className={'flex-none'}>
                    <CircularImage image={profileImage} size={28} alt={'Profile image'} />
                </div>
                <div>
                    <div
                        className={
                            'flex-none bg-slate-300/50 shadow-slate-950/20 shadow-md ' +
                            'min-w-[16rem] max-w-[36rem] w-full ' +
                            'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
                        }>
                        <div className={'flex flex-row px-6 py-3'}>
                            <span className={'text-black/80 text-sm'}>{message}</span>
                        </div>
                    </div>
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

export default ItemLeftTextMsg