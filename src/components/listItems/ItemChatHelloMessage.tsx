import stickerData from '../../assets/stickers/hello_message.json'

import MsgSticker from '../chatMessages/common/MsgSticker.tsx'
import React from 'react'



const ItemChatHelloMessage: React.FC = () => {
    return (
        <div className={`flex justify-center items-center w-full`}>
                <div
                    className={
                        'max-w-[36rem]' +
                        'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
                    }>
                    <MsgSticker stickerData={stickerData ?? ''} />
                </div>

            </div>

    )
}
export default ItemChatHelloMessage
