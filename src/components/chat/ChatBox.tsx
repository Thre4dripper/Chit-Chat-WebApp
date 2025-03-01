import React, { useEffect, useRef } from 'react'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import stickerData from '../../assets/stickers/hello_message.json'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import ItemChatTextLeft from '../listItems/ItemChatTextLeft.tsx'
import ItemChatHelloMessage from '../listItems/ItemChatHelloMessage.tsx'
import ItemChatImageLeft from '../listItems/ItemChatImageLeft.tsx'
import ItemChatStickerLeft from '../listItems/ItemChatStickerLeft.tsx'
import ItemChatTextRight from '../listItems/ItemChatTextRight.tsx'
import ItemChatImageRight from '../listItems/ItemChatImageRight.tsx'
import ItemChatStickerRight from '../listItems/ItemChatStickerRight.tsx'

const ChatBox: React.FC = () => {
    const bottomRef = useRef<HTMLDivElement>(null)

    const CurrentChats = useChatDetailsStore((state) => state._chatDetails)
    console.log(CurrentChats)
    const username = useLocalStore((state) => state.username)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [CurrentChats])
    return (
        <div
            className={
                'z-0 flex-1 bg-white overflow-y-scroll ' +
                'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full'
            }>
            {CurrentChats && <ItemChatHelloMessage />}

            {CurrentChats ? (
                [...CurrentChats.chatMessages].reverse().map((chat) => (
                    <div className={'flex gap-2'} key={chat.time.toMillis()}>
                        {chat.from !== username ? (
                            <>
                                {chat.type === ChatMessageType.TypeText && (
                                    <ItemChatTextLeft
                                        profileImage={
                                            CurrentChats.dmChatUser2.username === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        }
                                        message={chat.text as string}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeImage && chat.image && (
                                    <ItemChatImageLeft
                                        profileImage={
                                            CurrentChats.dmChatUser2.username === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        }
                                        image={chat.image}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeSticker && chat.sticker && (
                                    <ItemChatStickerLeft
                                        profileImage={
                                            CurrentChats.dmChatUser2.username === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        }
                                        sticker={stickerData}
                                        time={chat.time}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {chat.type === ChatMessageType.TypeText && (
                                    <ItemChatTextRight
                                        seen={chat.seenBy.map((item) =>
                                            item === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        )}
                                        message={chat.text as string}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeImage && chat.image && (
                                    <ItemChatImageRight
                                        seen={chat.seenBy.map((item) =>
                                            item === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        )}
                                        image={chat.image}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeSticker && chat.sticker && (
                                    <ItemChatStickerRight
                                        seen={chat.seenBy.map((item) =>
                                            item === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        )}
                                        sticker={stickerData}
                                        time={chat.time}
                                    />
                                )}
                            </>
                        )}
                        <div ref={bottomRef} />
                    </div>
                ))
            ) : (
                <div className={`flex flex-col gap-2`}>Select Any Chat from Left</div>
            )}
        </div>
    )
}

export default ChatBox
