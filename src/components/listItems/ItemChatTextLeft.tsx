import { Timestamp } from '@firebase/firestore'
import MsgText from '../chatMessages/common/MsgText.tsx'
import React from 'react'
import CircularImage from '../CircularImage.tsx'
import { IconButton } from '@mui/material'

interface ItemChatTextLeftProps {
    profileImage: string
    message: string
    time: Timestamp
    onAvatarClick?: () => void
}

const ItemChatTextLeft: React.FC<ItemChatTextLeftProps> = ({
    profileImage,
    message,
    time,
    onAvatarClick,
}) => {
    const FormatedTime = time.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const leftMessageColor = '#DAE2FF'
    return (
        <>
            {onAvatarClick ? (
                <IconButton onClick={onAvatarClick} sx={{ padding: 0 }}>
                    <CircularImage image={profileImage} size={28} alt={'Profile image'} />
                </IconButton>
            ) : (
                <CircularImage image={profileImage} size={28} alt={'Profile image'} />
            )}
            <div>
                <div
                    style={{ backgroundColor: leftMessageColor }}
                    className={
                        'shadow-slate-950/20 shadow-md ' +
                        'min-w-[16rem] max-w-xl w-full ' +
                        'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl overflow-hidden'
                    }>
                    <MsgText message={message ?? ''} className={'text-black/80'} />
                </div>
                <div className={'flex justify-start my-2'}>
                    <span className={'text-slate-400 font-bold text-xs'}>{FormatedTime}</span>
                </div>
            </div>
        </>
    )
}
export default ItemChatTextLeft
