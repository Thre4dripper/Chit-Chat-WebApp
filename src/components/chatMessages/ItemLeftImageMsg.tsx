import CircularImage from '../CircularImage.tsx'
import React from 'react'
import { IconButton } from '@mui/material'

interface ItemChatLeftImageMsgProps {
    profileImage: string
    image: string
    time: string
}

const ItemLeftImageMsg: React.FC<ItemChatLeftImageMsgProps> = ({ profileImage, image, time }) => {
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
                        <div className={'flex flex-row justify-center'}>
                            <IconButton className={'w-full cursor-pointer'}>
                                <img
                                    src={image}
                                    alt={'Chat image'}
                                    className={
                                        'max-h-[250px] max-w-[250px] object-cover w-full rounded-3xl'
                                    }
                                />
                            </IconButton>
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

export default ItemLeftImageMsg
